/**
 * The public matrix A (spec FR-053): C rows of n 32-bit values, expanded from a 32-byte seed as the AES-128-CTR
 * keystream under the key `SHA-256("umbradb-pss/A/v1" ‖ seed)[0..16]`, counter block starting at zero (a 128-bit
 * big-endian counter), read as little-endian 32-bit words in row order. The seed is
 * `SHA-256("umbradb-pss/seed/v1" ‖ table name ‖ grid digest)`.
 *
 * Row r starts at keystream byte r·n·4, which is counter block r·n/4, so any range of rows can be expanded on its own.
 */

import { createCipheriv, createHash } from "node:crypto";
import { LWE_N } from "./params.ts";

const SEED_DOMAIN = new TextEncoder().encode("umbradb-pss/seed/v1");
const KEY_DOMAIN = new TextEncoder().encode("umbradb-pss/A/v1");
const BLOCK_BYTES = 16;
const ROW_BYTES = LWE_N * 4;

/** The table names the seed derivation uses. */
export type TableName = "read" | "path" | "nullifier";

/** `SHA-256("umbradb-pss/seed/v1" ‖ table name (UTF-8) ‖ grid digest)`. */
export function deriveSeed(table: TableName, gridDigest: Uint8Array): Uint8Array {
  if (gridDigest.length !== 32) throw new Error("grid digest must be 32 bytes");
  const hash = createHash("sha256");
  hash.update(SEED_DOMAIN);
  hash.update(new TextEncoder().encode(table));
  hash.update(gridDigest);
  return new Uint8Array(hash.digest());
}

/** The AES-128 key of A: `SHA-256("umbradb-pss/A/v1" ‖ seed)[0..16]`. */
export function matrixKey(seed: Uint8Array): Uint8Array {
  if (seed.length !== 32) throw new Error("seed must be 32 bytes");
  return new Uint8Array(createHash("sha256").update(KEY_DOMAIN).update(seed).digest().subarray(0, 16));
}

function counterBlock(block: number): Buffer {
  const iv = Buffer.alloc(BLOCK_BYTES);
  // Rows ≤ 102,400 and n = 1024 give at most ~26 million blocks: the counter fits the low 64 bits.
  iv.writeBigUInt64BE(BigInt(block), 8);
  return iv;
}

/**
 * Rows `[first, first + count)` of A, row-major (`out[(r − first)·n + k]`), written into `out` if given (it must hold
 * `count·n` values) or a new array.
 */
export function matrixRows(seed: Uint8Array, first: number, count: number, out?: Uint32Array): Uint32Array {
  const words = count * LWE_N;
  const target = out ?? new Uint32Array(words);
  if (target.length < words) throw new Error("output too small for the rows");
  const bytes = new Uint8Array(target.buffer, target.byteOffset, words * 4);
  const cipher = createCipheriv("aes-128-ctr", matrixKey(seed), counterBlock((first * ROW_BYTES) / BLOCK_BYTES));
  // Encrypting zeros gives the keystream. Work in slices to bound the temporary buffers.
  const slice = 1 << 22;
  for (let off = 0; off < bytes.length; off += slice) {
    const end = Math.min(bytes.length, off + slice);
    const ks = cipher.update(new Uint8Array(end - off));
    bytes.set(ks, off);
  }
  // Little-endian words: on a little-endian host the bytes are already the words.
  return target;
}

/** All C rows of A (C·n values). Prefer `matrixRows` in chunks when memory matters. */
export function expandMatrix(seed: Uint8Array, cols: number): Uint32Array {
  return matrixRows(seed, 0, cols);
}
