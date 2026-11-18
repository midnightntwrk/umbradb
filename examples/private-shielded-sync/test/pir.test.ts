/**
 * SimplePIR (spec §5.5) and its checks FR-141 (a PIR read equals a direct read), FR-144 (fresh randomness) and FR-058
 * (noise check).
 */

import { createCipheriv, randomBytes } from "node:crypto";
import fc from "fast-check";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  answerQueries,
  buildPositionalGrid,
  buildQueries,
  buildSetup,
  cellsPerRecord,
  checkNoise,
  columnRecords,
  createGrid,
  decodeAnswers,
  decodeGridHeader,
  decodeRecord,
  DELTA,
  deriveSeed,
  deserializeGrid,
  encodeRecord,
  expandMatrix,
  gaussianSamples,
  type Grid,
  gridDigest,
  inlineMultiplier,
  LWE_N,
  MAX_COLUMNS,
  matrixKey,
  matrixRows,
  noiseBoundHolds,
  positionalShape,
  positionOf,
  readRecord,
  serializeGrid,
  setupMatrix,
  setupBytes,
  type TableInfo,
  WorkerMultiplier,
} from "../pir/index.ts";

let workers: WorkerMultiplier;
beforeAll(() => {
  workers = new WorkerMultiplier(4);
});
afterAll(async () => {
  await workers.close();
});

function randomRecords(count: number, recordBytes: number): Uint8Array {
  return new Uint8Array(randomBytes(count * recordBytes));
}

async function tableOf(grid: Grid, name: "read" | "nullifier" = "read") {
  const seed = deriveSeed(name, gridDigest(grid));
  const h = await buildSetup(grid, seed, inlineMultiplier);
  const info: TableInfo = { ...grid, seed };
  return { info, setup: setupMatrix(setupBytes(h), grid.rows), h };
}

/** Reads the records at `indices` of a positional table by PIR, in one call. */
async function pirRead(grid: Grid, indices: number[], multiplier = inlineMultiplier) {
  const { info, setup } = await tableOf(grid);
  const columns = indices.map((i) => positionOf(i, grid.perColumn).column);
  const batch = await buildQueries(info, columns, multiplier);
  const answers = await answerQueries(grid, batch.queries, columns.length, multiplier);
  const decoded = await decodeAnswers(setup, batch, answers, multiplier);
  return indices.map((i, v) => columnRecords(grid, decoded[v]!)[positionOf(i, grid.perColumn).slot]!);
}

describe("cell encoding (FR-051)", () => {
  it("round-trips any record through 9-bit centred cells", () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 1, maxLength: 800 }), (bytes) => {
        const e = cellsPerRecord(bytes.length);
        expect(e).toBe(Math.ceil((8 * bytes.length) / 9));
        const cells = new Int16Array(e);
        encodeRecord(bytes, e, cells, 0, 1);
        for (const c of cells) expect(c >= -256 && c <= 255).toBe(true);
        const values = Uint16Array.from(cells, (c) => (c + 256) & 511);
        expect(decodeRecord(values, 0, bytes.length)).toEqual(bytes);
      }),
    );
  });

  it("reads bits least significant first and stores v − 256", () => {
    // Bytes 0xff, 0x01: bits 1111 1111 1000 0000 → group 0 = 0x1ff (511), group 1 = 0 (the 0x01's high bits).
    const cells = new Int16Array(2);
    encodeRecord(Uint8Array.of(0xff, 0x01), 2, cells, 0, 1);
    expect([...cells]).toEqual([511 - 256, 0 - 256]);
  });
});

describe("grid (FR-052, FR-061)", () => {
  it("follows perColumn = max(1, round(√(N·E) / E)) and C = ⌈N / perColumn⌉", () => {
    for (const [n, size] of [[0, 705], [1, 705], [1000, 705], [1_000_000, 705], [12345, 40], [7, 1]] as const) {
      const s = positionalShape(n, size);
      const e = Math.ceil((8 * size) / 9);
      expect(s.cellsPerRecord).toBe(e);
      expect(s.perColumn).toBe(Math.max(1, Math.round(Math.sqrt(n * e) / e)));
      expect(s.cols).toBe(Math.max(1, Math.ceil(n / s.perColumn)));
      expect(s.rows).toBe(s.perColumn * e);
    }
  });

  it("stores two bytes per cell and reads back every record directly", () => {
    const records = randomRecords(57, 33);
    const grid = buildPositionalGrid(57, 33, records);
    expect(grid.cells.byteLength).toBe(grid.rows * grid.cols * 2);
    for (let i = 0; i < 57; i++) {
      const { column, slot } = positionOf(i, grid.perColumn);
      expect(readRecord(grid, column, slot)).toEqual(records.subarray(i * 33, (i + 1) * 33));
    }
    // Unused slots read as zero records.
    const last = positionOf(56, grid.perColumn);
    if (last.slot + 1 < grid.perColumn) expect(readRecord(grid, last.column, last.slot + 1)).toEqual(new Uint8Array(33));
  });

  it("serialises to its table file and back; the digest covers shape and cells", () => {
    const grid = buildPositionalGrid(40, 12, randomRecords(40, 12));
    const file = serializeGrid(grid);
    const again = deserializeGrid(file);
    expect(again.cells).toEqual(grid.cells);
    expect(gridDigest(again)).toEqual(gridDigest(grid));
    const other = createGrid({ ...decodeGridHeader(file), records: grid.records - 1 });
    expect(gridDigest(other)).not.toEqual(gridDigest(grid));
    const bad = file.slice();
    bad[0] = 0;
    expect(() => deserializeGrid(bad)).toThrow(/not a PIR table/);
    expect(() => deserializeGrid(file.subarray(0, file.length - 2))).toThrow(/bytes/);
  });
});

describe("noise check (FR-058)", () => {
  it("accepts C below (Δ/2 / (8·σ·p/2))² and refuses an oversized grid", () => {
    expect(MAX_COLUMNS).toBe(102_399);
    expect(noiseBoundHolds(MAX_COLUMNS)).toBe(true);
    expect(noiseBoundHolds(MAX_COLUMNS + 1)).toBe(false);
    expect(() => checkNoise(MAX_COLUMNS + 1)).toThrow(/noise check failed/);
    expect(() => createGrid({ rows: 1, cols: MAX_COLUMNS + 1, perColumn: 1, cellsPerRecord: 1, recordBytes: 1, records: 0 })).toThrow(
      /noise check failed/,
    );
    // A positional table that would need that many columns is refused when built.
    expect(() => createGrid({ ...positionalShape(1, 1), cols: 200_000 })).toThrow(/noise check failed/);
  });
});

describe("public matrix A (FR-053)", () => {
  const seed = new Uint8Array(randomBytes(32));

  it("is the AES-128-CTR keystream from a zero counter, read as little-endian words in row order", () => {
    const key = matrixKey(seed);
    const a = expandMatrix(seed, 3);
    // Counter block b is AES_k(b) for b as a 128-bit big-endian integer.
    const block = (b: number) => {
      const iv = Buffer.alloc(16);
      iv.writeUInt32BE(b, 12);
      return createCipheriv("aes-128-ecb", key, null).setAutoPadding(false).update(iv);
    };
    for (const [row, word] of [[0, 0], [0, 5], [1, 0], [2, 1023]] as const) {
      const index = row * LWE_N + word;
      expect(a[index]).toBe(block(Math.floor(index / 4)).readUInt32LE((index % 4) * 4));
    }
  });

  it("expands any range of rows on its own, equal to the full expansion", () => {
    const full = expandMatrix(seed, 50);
    expect(matrixRows(seed, 17, 9)).toEqual(full.subarray(17 * LWE_N, 26 * LWE_N));
  });

  it("is seeded per table name and grid digest", () => {
    const d = new Uint8Array(randomBytes(32));
    expect(deriveSeed("read", d)).not.toEqual(deriveSeed("nullifier", d));
    expect(deriveSeed("read", d)).toEqual(deriveSeed("read", d));
  });
});

describe("query error (FR-055, FR-059)", () => {
  it("is a discrete Gaussian with σ = 6.4", () => {
    const e = gaussianSamples(new Int32Array(200_000));
    const mean = e.reduce((a, x) => a + x, 0) / e.length;
    const sd = Math.sqrt(e.reduce((a, x) => a + (x - mean) ** 2, 0) / e.length);
    expect(Math.abs(mean)).toBeLessThan(0.1);
    expect(Math.abs(sd - 6.4) / 6.4).toBeLessThan(0.02);
    let max = 0;
    for (const x of e) max = Math.max(max, Math.abs(x));
    expect(max).toBeLessThan(60);
  });
});

describe("PIR read equals direct read (FR-141)", () => {
  it("for random tables and random positions", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 160 }),
        fc.integer({ min: 1, max: 90 }),
        fc.array(fc.nat(), { minLength: 1, maxLength: 6 }),
        async (count, recordBytes, picks) => {
          const records = randomRecords(count, recordBytes);
          const grid = buildPositionalGrid(count, recordBytes, records);
          const indices = picks.map((p) => p % count);
          const got = await pirRead(grid, indices);
          indices.forEach((i, v) => expect(got[v]).toEqual(records.subarray(i * recordBytes, (i + 1) * recordBytes)));
        },
      ),
      { numRuns: 25 },
    );
  });

  it("for every position of a table, in calls of 32 vectors with repeats (padding shape)", async () => {
    const count = 300;
    const records = randomRecords(count, 64);
    const grid = buildPositionalGrid(count, 64, records);
    for (let first = 0; first < count; first += 32) {
      const indices = Array.from({ length: 32 }, (_, k) => (first + k) % count);
      const got = await pirRead(grid, indices);
      indices.forEach((i, v) => expect(got[v]).toEqual(records.subarray(i * 64, (i + 1) * 64)));
    }
  });

  it("with the read record size of k = 16 (705 bytes) across worker threads, equal to the single-thread result", async () => {
    const count = 900;
    const records = randomRecords(count, 705);
    const grid = buildPositionalGrid(count, 705, records);
    const { info, setup, h } = await tableOf(grid);
    // The setup data H through the worker multiplier equals the single-thread one.
    expect(await buildSetup(grid, info.seed, workers)).toEqual(h);
    const indices = [0, 1, count - 1, 450, 451, 7, 7, 899];
    const columns = indices.map((i) => positionOf(i, grid.perColumn).column);
    const batch = await buildQueries(info, columns, workers);
    const answers = await answerQueries(grid, batch.queries, columns.length, workers);
    expect(answers).toEqual(await answerQueries(grid, batch.queries, columns.length, inlineMultiplier));
    const decoded = await decodeAnswers(setup, batch, answers, workers);
    indices.forEach((i, v) => {
      const { slot } = positionOf(i, grid.perColumn);
      expect(columnRecords(grid, decoded[v]!)[slot]).toEqual(records.subarray(i * 705, (i + 1) * 705));
    });
  });

  it("for a table with no records (one column, zero records)", async () => {
    const grid = buildPositionalGrid(0, 40, new Uint8Array(0));
    expect(grid.cols).toBe(1);
    const got = await pirRead(grid, [0]);
    expect(got[0]).toEqual(new Uint8Array(40));
  });
});

describe("fresh randomness (FR-144, FR-059)", () => {
  it("two queries for the same column differ in every value", async () => {
    const grid = buildPositionalGrid(2000, 40, randomRecords(2000, 40));
    const { info } = await tableOf(grid);
    const batch = await buildQueries(info, [5, 5]);
    const a = batch.queries.subarray(0, grid.cols);
    const b = batch.queries.subarray(grid.cols, 2 * grid.cols);
    expect(a).not.toEqual(b);
    let same = 0;
    for (let c = 0; c < grid.cols; c++) if (a[c] === b[c]) same++;
    expect(same).toBe(0);
    expect(batch.secrets.subarray(0, LWE_N)).not.toEqual(batch.secrets.subarray(LWE_N, 2 * LWE_N));
    // A third call for the same column differs again.
    const again = await buildQueries(info, [5]);
    expect(again.queries).not.toEqual(a);
  });

  it("a query is A·s + e + Δ·unit(j): small error everywhere, Δ more at the queried column", async () => {
    const grid = buildPositionalGrid(500, 40, randomRecords(500, 40));
    const { info } = await tableOf(grid);
    const batch = await buildQueries(info, [3]);
    const a = expandMatrix(info.seed, grid.cols);
    // Remove A·s: what is left is e (small) everywhere except Δ + e at the queried column.
    for (let c = 0; c < grid.cols; c++) {
      let as = 0;
      for (let k = 0; k < LWE_N; k++) as = (as + Math.imul(a[c * LWE_N + k]!, batch.secrets[k]!)) | 0;
      const rest = (batch.queries[c]! - as) | 0;
      if (c === 3) expect(Math.abs(rest - DELTA)).toBeLessThan(100);
      else expect(Math.abs(rest)).toBeLessThan(100);
    }
  });
});

describe("multiply interface (FR-066)", () => {
  it("checks shapes and refuses after close", async () => {
    const grid = buildPositionalGrid(10, 8, randomRecords(10, 8));
    await expect(inlineMultiplier.multiply(grid, new Uint32Array(grid.cols + 1), 1)).rejects.toThrow(/expected 1 vectors/);
    const m = new WorkerMultiplier(1);
    await m.close();
    await expect(m.multiply(grid, new Uint32Array(grid.cols), 1)).rejects.toThrow(/closed/);
  });

  it("gives row-major and vector-major layouts of the same product", async () => {
    const grid = buildPositionalGrid(77, 21, randomRecords(77, 21));
    const vectors = new Uint32Array(randomBytes(5 * grid.cols * 4).buffer);
    const vm = await workers.multiply(grid, vectors, 5, "vector-major");
    const rm = await workers.multiply(grid, vectors, 5, "row-major");
    for (let r = 0; r < grid.rows; r++) for (let v = 0; v < 5; v++) expect(rm[r * 5 + v]).toBe(vm[v * grid.rows + r]);
    // Against a plain triple loop.
    for (const [r, v] of [[0, 0], [grid.rows - 1, 4], [3, 2]] as const) {
      let acc = 0;
      for (let c = 0; c < grid.cols; c++) acc = (acc + Math.imul(grid.cells[r * grid.cols + c]!, vectors[v * grid.cols + c]!)) | 0;
      expect(vm[v * grid.rows + r]).toBe(acc >>> 0);
    }
  });
});
