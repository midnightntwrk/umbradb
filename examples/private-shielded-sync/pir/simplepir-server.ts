/**
 * SimplePIR's server side behind the scheme seam (`./scheme.ts`), over this folder's functions, unchanged: the grid
 * (`./grid.ts`), its shapes, the bucket choice (`./buckets.ts`), the setup data `H = grid × A` (`./setup.ts`) and the
 * answers `grid × query` (`./query.ts`), on a worker pool (`./multiply.ts`).
 *
 * - A group is a grid column; a request is the C query values of one column and a response the R answer values, both
 *   32-bit little-endian, so a request is `4C` bytes and a response `4R`.
 * - The table file is the grid's file (a 32-byte header, then the cells); the public artifact is the setup data.
 * - Shapes: the read table about square (`positionalShape`), the path table as wide as the noise check allows
 *   (`widestShape`, Q58), the nullifier table's bucket bits by `simplePirBucketBits`.
 * - A padded build's noise (Q57) is a uniformly random 9-bit value in every cell, before the records are written.
 */

import { closeSync, openSync, readSync, statSync } from "node:fs";
import { bucketGrid, simplePirBucketBits } from "./buckets.ts";
import { cellsPerRecord } from "./encode.ts";
import {
  createGrid,
  decodeGridHeader,
  encodeGridHeader,
  GRID_HEADER_BYTES,
  type Grid,
  gridCellBytes,
  type GridShape,
  positionalShape,
  positionOf,
  setRecord,
  widestShape,
} from "./grid.ts";
import { deriveSeed, type TableName } from "./matrix.ts";
import { type Multiplier, WorkerMultiplier } from "./multiply.ts";
import { checkNoise, HALF_PLAIN, LWE_N, MAX_COLUMNS, PIR_PARAMS, PLAIN_MODULUS } from "./params.ts";
import { answerQueries } from "./query.ts";
import type {
  EncodedTable,
  ServerScheme,
  ServerSchemeEntry,
  ServerSchemeOptions,
  ServerTable,
  TableSource,
  TableSpec,
  TableTransfer,
} from "./scheme.ts";
import { buildSetup, setupBytes } from "./setup.ts";
import type { PirTableRef } from "../shared/manifest.ts";

/** A grid as it crosses threads: its shape and its cells' shared buffer. */
export interface GridTransfer extends GridShape {
  readonly cells: SharedArrayBuffer;
}

/** A SimplePIR table on its way from the build's thread to the server's. */
export interface SimplePirTransfer extends TableTransfer {
  readonly scheme: "simplepir";
  readonly grid: GridTransfer;
}

/** The grid a transfer carries, its cells in the same shared memory. */
export function gridOfTransfer(t: TableTransfer): Grid {
  if (t.scheme !== "simplepir") throw new Error(`a ${t.scheme} table is not a SimplePIR grid`);
  const g = (t as SimplePirTransfer).grid;
  return { rows: g.rows, cols: g.cols, perColumn: g.perColumn, cellsPerRecord: g.cellsPerRecord, recordBytes: g.recordBytes, records: g.records, cells: new Int16Array(g.cells) };
}

function transferOf(grid: Grid): SimplePirTransfer {
  const { rows, cols, perColumn, cellsPerRecord: e, recordBytes, records } = grid;
  return { scheme: "simplepir", grid: { rows, cols, perColumn, cellsPerRecord: e, recordBytes, records, cells: grid.cells.buffer as SharedArrayBuffer } };
}

/** Bytes of A (as the setup's transposed copy) and of the setup data, per table column and row. */
const A_BYTES_PER_COLUMN = LWE_N * 4;
const SETUP_BYTES_PER_ROW = LWE_N * 4;

/** The grid shape of a positional table: the path table as wide as it can be (Q58), the read table about square. */
function positionalShapeOf(name: "read" | "path", records: number, recordBytes: number): GridShape {
  return name === "path" ? widestShape(records, recordBytes) : positionalShape(records, recordBytes);
}

/** Fills every cell of `grid` with a uniformly random 9-bit value (stored centred). */
function fillNoise(grid: Grid, next: (out: Uint8Array) => void): void {
  const cells = grid.cells;
  const bytes = new Uint8Array(cells.buffer, cells.byteOffset, cells.byteLength);
  const chunk = 1 << 24;
  for (let off = 0; off < cells.length; off += chunk) {
    const n = Math.min(chunk, cells.length - off);
    next(bytes.subarray(off * 2, (off + n) * 2));
    for (let i = off; i < off + n; i++) cells[i] = (cells[i]! & (PLAIN_MODULUS - 1)) - HALF_PLAIN;
  }
}

/** A grid the server answers from. Its memory is the garbage collector's: `release` has nothing to free. */
class SimplePirTable implements ServerTable {
  readonly requestBytes: number;
  readonly responseBytes: number;
  readonly heldBytes: number;
  readonly #grid: Grid;
  readonly #multiplier: Multiplier;

  constructor(grid: Grid, multiplier: Multiplier) {
    this.#grid = grid;
    this.#multiplier = multiplier;
    this.requestBytes = grid.cols * 4;
    this.responseBytes = grid.rows * 4;
    this.heldBytes = grid.cells.byteLength;
  }

  async answer(requests: Uint8Array, count: number): Promise<Uint8Array> {
    // Copied once into aligned shared memory, which the worker threads read without another copy.
    const queries = new Uint32Array(new SharedArrayBuffer(requests.length));
    new Uint8Array(queries.buffer).set(requests);
    const answers = await answerQueries(this.#grid, queries, count, this.#multiplier);
    return new Uint8Array(answers.buffer, answers.byteOffset, answers.byteLength);
  }

  release(): void {}
}

/** Checks a stored or transferred grid against the table's manifest entry. */
function checkAgainst(ref: PirTableRef, grid: GridShape): void {
  const l = ref.layout;
  if (grid.rows !== l.rows || grid.cols !== l.cols || grid.perColumn !== ref.perGroup || grid.recordBytes !== ref.recordBytes || grid.records !== ref.records) {
    throw new Error(`the grid (${grid.rows} × ${grid.cols}) is not the manifest's table (${l.rows} × ${l.cols})`);
  }
}

class SimplePirServer implements ServerScheme {
  readonly name = "simplepir" as const;
  readonly params = PIR_PARAMS;
  readonly #multiplier: Multiplier;
  readonly #own: boolean;

  constructor(options: ServerSchemeOptions) {
    this.#own = options.multiplier === undefined;
    this.#multiplier = options.multiplier ?? new WorkerMultiplier(Math.max(1, options.threads));
  }

  encodeTable(source: TableSource): EncodedTable {
    if (source.name === "nullifier") {
      const { bucketBits, capacity } = simplePirBucketBits(source);
      return this.#encoded(source.name, bucketGrid(source, bucketBits, capacity), bucketBits);
    }
    const grid = createGrid(positionalShapeOf(source.name, source.records, source.recordBytes));
    if (source.noise !== undefined) fillNoise(grid, source.noise);
    source.fill((index, record) => {
      const { column, slot } = positionOf(index, grid.perColumn);
      setRecord(grid, column, slot, record);
    });
    return this.#encoded(source.name, grid);
  }

  #encoded(name: TableName, grid: Grid, bucketBits?: number): EncodedTable {
    const multiplier = this.#multiplier;
    return {
      groups: grid.cols,
      perGroup: grid.perColumn,
      ...(bucketBits === undefined ? {} : { bucketBits }),
      file: [encodeGridHeader(grid), gridCellBytes(grid)],
      async setup(fileDigest) {
        const seed = deriveSeed(name, fileDigest);
        const h = await buildSetup(grid, seed, multiplier);
        return {
          public: [setupBytes(h)],
          layout: { rows: grid.rows, cols: grid.cols, cellsPerRecord: grid.cellsPerRecord, seed: Buffer.from(seed).toString("hex") },
          transfer: transferOf(grid),
        };
      },
    };
  }

  async adoptTable(ref: PirTableRef, transfer: TableTransfer): Promise<ServerTable> {
    const grid = gridOfTransfer(transfer);
    checkAgainst(ref, grid);
    return new SimplePirTable(grid, this.#multiplier);
  }

  /** A grid's memory is the garbage collector's: nothing to free. */
  discardTransfer(): void {}

  /** Reads the table file into shared memory in chunks: a padded snapshot's table is larger than `readFileSync` reads (Q57). */
  async loadTable(ref: PirTableRef, path: string): Promise<ServerTable> {
    const fd = openSync(path, "r");
    try {
      const header = new Uint8Array(GRID_HEADER_BYTES);
      if (readSync(fd, header, 0, GRID_HEADER_BYTES, 0) !== GRID_HEADER_BYTES) throw new Error(`${path} is shorter than its header`);
      const shape = decodeGridHeader(header);
      const expected = GRID_HEADER_BYTES + shape.rows * shape.cols * 2;
      if (statSync(path).size !== expected) throw new Error(`${path} must be ${expected} bytes`);
      checkNoise(shape.cols);
      checkAgainst(ref, shape);
      const cells = new Int16Array(new SharedArrayBuffer(shape.rows * shape.cols * 2));
      const bytes = new Uint8Array(cells.buffer);
      const chunk = 1 << 26;
      for (let off = 0; off < bytes.length; ) {
        const read = readSync(fd, bytes, off, Math.min(chunk, bytes.length - off), GRID_HEADER_BYTES + off);
        if (read === 0) throw new Error(`${path} ended early`);
        off += read;
      }
      return new SimplePirTable({ ...shape, cells }, this.#multiplier);
    } finally {
      closeSync(fd);
    }
  }

  async close(): Promise<void> {
    if (this.#own) await this.#multiplier.close();
  }
}

/** SimplePIR as the server module registers it (`./server-schemes.ts`). */
export const SIMPLEPIR_SERVER: ServerSchemeEntry = {
  name: "simplepir",
  // The widest table the noise check allows (FR-058): MAX_COLUMNS query values of 4 bytes.
  maxRequestBytes: MAX_COLUMNS * 4,
  buildBytes(tables: readonly TableSpec[]): number {
    let bytes = 0;
    for (const t of tables) {
      if (t.name === "nullifier") {
        // The nullifier grid's rows are its fullest bucket's load: allow half again the mean.
        bytes += 1.5 * t.records * cellsPerRecord(t.recordBytes) * 2;
      } else {
        const s = positionalShapeOf(t.name, t.records, t.recordBytes);
        bytes += s.rows * s.cols * 2 + s.cols * A_BYTES_PER_COLUMN + s.rows * SETUP_BYTES_PER_ROW;
      }
    }
    return bytes;
  },
  async open(options: ServerSchemeOptions): Promise<ServerScheme> {
    return new SimplePirServer(options);
  },
};
