/**
 * Setup data (spec FR-054): `H = grid × A`, an R × n matrix of 32-bit values, stored little-endian in row order. It is
 * the multiplication of FR-066 with the n = 1,024 columns of A as its vectors.
 */

import type { Grid } from "./grid.ts";
import { matrixRows } from "./matrix.ts";
import type { Matrix, Multiplier } from "./multiply.ts";
import { LWE_N } from "./params.ts";

/** A's columns as vectors: the transpose of A, `n × C`, in shared memory. Expanded in chunks of rows. */
export function matrixColumns(seed: Uint8Array, cols: number): Uint32Array {
  const at = new Uint32Array(new SharedArrayBuffer(LWE_N * cols * 4));
  const chunk = 1024;
  const rows = new Uint32Array(chunk * LWE_N);
  for (let c0 = 0; c0 < cols; c0 += chunk) {
    const count = Math.min(chunk, cols - c0);
    matrixRows(seed, c0, count, rows);
    for (let r = 0; r < count; r++) {
      const src = r * LWE_N;
      const dst = c0 + r;
      for (let k = 0; k < LWE_N; k++) at[k * cols + dst] = rows[src + k]!;
    }
  }
  return at;
}

/** `H = grid × A` (R × n, row-major, in shared memory). */
export async function buildSetup(grid: Grid, seed: Uint8Array, multiplier: Multiplier): Promise<Uint32Array> {
  return multiplier.multiply(grid, matrixColumns(seed, grid.cols), LWE_N, "row-major");
}

/** The setup data's bytes (little-endian 32-bit values, row by row), without copying. */
export function setupBytes(h: Uint32Array): Uint8Array {
  return new Uint8Array(h.buffer, h.byteOffset, h.byteLength);
}

/** Setup data read from its bytes as an R × n matrix in shared memory (for the client's `H × s`). */
export function setupMatrix(bytes: Uint8Array, rows: number): Matrix {
  if (bytes.length !== rows * LWE_N * 4) throw new Error(`setup data must be ${rows * LWE_N * 4} bytes, got ${bytes.length}`);
  const cells = new Int32Array(new SharedArrayBuffer(bytes.length));
  new Uint8Array(cells.buffer).set(bytes);
  return { rows, cols: LWE_N, cells };
}
