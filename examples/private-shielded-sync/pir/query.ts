/**
 * Queries, answers and decoding (spec FR-055–057, FR-059).
 *
 * - Client: for column j, a fresh uniform secret s (n values) and fresh Gaussian error e (C values);
 *   `query = A·s + e + Δ·unit(j) mod q` (FR-055).
 * - Server: `answer = grid × query mod q` (FR-056), every vector of a call in one pass.
 * - Client: `x = answer − H·s`; each cell `round(x / Δ) mod p`, then `+ p/2 mod p` to undo the centring (FR-057); the
 *   cells reassemble into the column's records.
 *
 * A call's vectors are laid out vector-major (`count × C` for queries, `count × R` for answers), as on the wire.
 */

import { decodeRecord } from "./encode.ts";
import { gaussianSamples, randomWords } from "./gaussian.ts";
import type { Grid, GridShape } from "./grid.ts";
import { matrixRows } from "./matrix.ts";
import { inlineMultiplier, type Matrix, type Multiplier } from "./multiply.ts";
import { DELTA, HALF_PLAIN, LOG_DELTA, LWE_N, PLAIN_MODULUS } from "./params.ts";

/** What the client knows of a table: its shape (from the manifest) and its public matrix's seed. */
export interface TableInfo extends GridShape {
  readonly seed: Uint8Array;
}

/** A call's queries and the secrets the client keeps to decode the answers. Never sent: `secrets`. */
export interface QueryBatch {
  readonly columns: readonly number[];
  /** `count × n` secrets, one per query. */
  readonly secrets: Uint32Array;
  /** `count × C` query values, as sent. */
  readonly queries: Uint32Array;
}

const A_CHUNK_ROWS = 4096;

/**
 * Builds one query per column (FR-055), each with its own fresh secret and error (FR-059). A is expanded in chunks of
 * rows, so the client never holds all of it.
 */
export async function buildQueries(
  table: TableInfo,
  columns: readonly number[],
  multiplier: Multiplier = inlineMultiplier,
): Promise<QueryBatch> {
  const count = columns.length;
  if (count < 1) throw new Error("a call needs at least one query");
  for (const j of columns) {
    if (!Number.isInteger(j) || j < 0 || j >= table.cols) throw new Error(`column ${j} out of range [0, ${table.cols})`);
  }
  const cols = table.cols;
  const secrets = randomWords(new Uint32Array(new SharedArrayBuffer(count * LWE_N * 4)));
  const queries = new Uint32Array(count * cols);
  // A·s for every query, chunk by chunk of A's rows (= the table's columns).
  const chunkRows = Math.min(A_CHUNK_ROWS, cols);
  const chunk = new Int32Array(new SharedArrayBuffer(chunkRows * LWE_N * 4));
  for (let c0 = 0; c0 < cols; c0 += chunkRows) {
    const rows = Math.min(chunkRows, cols - c0);
    const view = rows === chunkRows ? chunk : chunk.subarray(0, rows * LWE_N);
    matrixRows(table.seed, c0, rows, new Uint32Array(view.buffer, view.byteOffset, view.length));
    const part = await multiplier.multiply({ rows, cols: LWE_N, cells: view }, secrets, count, "vector-major");
    for (let v = 0; v < count; v++) queries.set(part.subarray(v * rows, (v + 1) * rows), v * cols + c0);
  }
  // + e + Δ·unit(j), modulo 2^32.
  const error = gaussianSamples(new Int32Array(count * cols));
  for (let i = 0; i < queries.length; i++) queries[i] = (queries[i]! + error[i]!) >>> 0;
  columns.forEach((j, v) => {
    queries[v * cols + j] = (queries[v * cols + j]! + DELTA) >>> 0;
  });
  return { columns: [...columns], secrets, queries };
}

/** The server's answers to `count` queries (`count × C`): `count × R` values, one pass over the grid (FR-056). */
export async function answerQueries(
  grid: Grid,
  queries: Uint32Array,
  count: number,
  multiplier: Multiplier = inlineMultiplier,
): Promise<Uint32Array> {
  return multiplier.multiply(grid, queries, count, "vector-major");
}

/**
 * Decodes answers (`count × R`) with the setup data H (an R × n matrix) into each query's column: R plaintext cell
 * values in [0, p) per query (FR-057).
 */
export async function decodeAnswers(
  setup: Matrix,
  batch: QueryBatch,
  answers: Uint32Array,
  multiplier: Multiplier = inlineMultiplier,
): Promise<Uint16Array[]> {
  const count = batch.columns.length;
  const rows = setup.rows;
  if (setup.cols !== LWE_N) throw new Error("setup data must have n columns");
  if (answers.length !== count * rows) throw new Error(`expected ${count} answers of ${rows} values, got ${answers.length}`);
  const hs = await multiplier.multiply(setup, batch.secrets, count, "vector-major");
  const half = DELTA / 2;
  const out: Uint16Array[] = [];
  for (let v = 0; v < count; v++) {
    const values = new Uint16Array(rows);
    for (let r = 0; r < rows; r++) {
      const x = (answers[v * rows + r]! - hs[v * rows + r]!) >>> 0;
      values[r] = ((((x + half) >>> 0) >>> LOG_DELTA) + HALF_PLAIN) & (PLAIN_MODULUS - 1);
    }
    out.push(values);
  }
  return out;
}

/** The records of one decoded column: `perColumn` records of `recordBytes` bytes, slot order. */
export function columnRecords(table: GridShape, values: Uint16Array): Uint8Array[] {
  if (values.length !== table.rows) throw new Error(`a column has ${table.rows} cells, got ${values.length}`);
  const out: Uint8Array[] = [];
  for (let s = 0; s < table.perColumn; s++) out.push(decodeRecord(values, s * table.cellsPerRecord, table.recordBytes));
  return out;
}
