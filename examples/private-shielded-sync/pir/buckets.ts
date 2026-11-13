/**
 * The nullifier table's buckets (spec FR-062–064).
 *
 * - A record is 40 bytes: nullifier (32), height (u32 little-endian), transaction index (u32 little-endian).
 * - A nullifier's bucket is its first `bucketBits` bits, byte 0 first, most significant bit first. Bucket j is column j.
 * - A bucket holds `capacity` records sorted by nullifier bytes, padded with zero records; `capacity` is the largest
 *   bucket's load (at least 1, so the grid always has a row).
 * - `bucketBits` is chosen in [4, 24] to minimise R + C, among the values whose column count passes the noise check
 *   (FR-058); ties go to the smaller value.
 */

import { cellsPerRecord } from "./encode.ts";
import { createGrid, type Grid, type GridShape, setRecord } from "./grid.ts";
import { noiseBoundHolds } from "./params.ts";

export const NULLIFIER_BYTES = 32;
export const NULLIFIER_RECORD_BYTES = 40;
export const MIN_BUCKET_BITS = 4;
export const MAX_BUCKET_BITS = 24;

/** A spent nullifier and where it was spent. */
export interface NullifierEntry {
  /** 32 bytes. */
  readonly nullifier: Uint8Array;
  readonly height: number;
  readonly txIndex: number;
}

export function encodeNullifierRecord(e: NullifierEntry): Uint8Array {
  if (e.nullifier.length !== NULLIFIER_BYTES) throw new Error("a nullifier is 32 bytes");
  const out = new Uint8Array(NULLIFIER_RECORD_BYTES);
  out.set(e.nullifier, 0);
  const view = new DataView(out.buffer);
  view.setUint32(32, e.height, true);
  view.setUint32(36, e.txIndex, true);
  return out;
}

export function decodeNullifierRecord(bytes: Uint8Array): NullifierEntry {
  if (bytes.length !== NULLIFIER_RECORD_BYTES) throw new Error("a nullifier record is 40 bytes");
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { nullifier: bytes.slice(0, 32), height: view.getUint32(32, true), txIndex: view.getUint32(36, true) };
}

/** The first `bits` bits of a nullifier, byte 0 first, most significant bit first (FR-063). */
export function bucketOf(nullifier: Uint8Array, bits: number): number {
  if (bits < 1 || bits > MAX_BUCKET_BITS) throw new Error(`bucket bits out of range: ${bits}`);
  const top = (nullifier[0]! << 16) | (nullifier[1]! << 8) | nullifier[2]!;
  return top >>> (24 - bits);
}

function compareBytes(a: Uint8Array, b: Uint8Array): number {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i]! - b[i]!;
  return a.length - b.length;
}

/** The largest bucket's load when the nullifiers are cut by `bits` bits. */
export function maxLoad(nullifiers: readonly Uint8Array[], bits: number): number {
  const loads = new Uint32Array(2 ** bits);
  let max = 0;
  for (const n of nullifiers) {
    const b = bucketOf(n, bits);
    const l = ++loads[b]!;
    if (l > max) max = l;
  }
  return max;
}

/** The table's shape for a choice of `bits` and the resulting capacity. */
export function bucketShape(count: number, bits: number, capacity: number): GridShape {
  const e = cellsPerRecord(NULLIFIER_RECORD_BYTES);
  return { rows: capacity * e, cols: 2 ** bits, perColumn: capacity, cellsPerRecord: e, recordBytes: NULLIFIER_RECORD_BYTES, records: count };
}

/** The choice of FR-064: the `bucketBits` (and its capacity) that minimises R + C. */
export function chooseBucketBits(nullifiers: readonly Uint8Array[]): { bucketBits: number; capacity: number } {
  const e = cellsPerRecord(NULLIFIER_RECORD_BYTES);
  let best: { bucketBits: number; capacity: number; cost: number } | null = null;
  for (let bits = MIN_BUCKET_BITS; bits <= MAX_BUCKET_BITS; bits++) {
    const cols = 2 ** bits;
    if (!noiseBoundHolds(cols)) continue;
    const capacity = Math.max(1, maxLoad(nullifiers, bits));
    const cost = capacity * e + cols;
    if (!best || cost < best.cost) best = { bucketBits: bits, capacity, cost };
  }
  if (!best) throw new Error("no bucket size passes the PIR noise check");
  return { bucketBits: best.bucketBits, capacity: best.capacity };
}

export interface NullifierTable {
  readonly grid: Grid;
  readonly bucketBits: number;
  readonly capacity: number;
}

/** Builds the nullifier table (FR-062–064). Nullifiers must be distinct. */
export function buildNullifierTable(entries: readonly NullifierEntry[], bucketBits?: number): NullifierTable {
  const nullifiers = entries.map((e) => e.nullifier);
  const choice =
    bucketBits === undefined
      ? chooseBucketBits(nullifiers)
      : { bucketBits, capacity: Math.max(1, maxLoad(nullifiers, bucketBits)) };
  const buckets: NullifierEntry[][] = Array.from({ length: 2 ** choice.bucketBits }, () => []);
  for (const e of entries) buckets[bucketOf(e.nullifier, choice.bucketBits)]!.push(e);
  const grid = createGrid(bucketShape(entries.length, choice.bucketBits, choice.capacity));
  buckets.forEach((bucket, column) => {
    bucket.sort((a, b) => compareBytes(a.nullifier, b.nullifier));
    for (let slot = 1; slot < bucket.length; slot++) {
      if (compareBytes(bucket[slot - 1]!.nullifier, bucket[slot]!.nullifier) === 0) throw new Error("duplicate nullifier");
    }
    bucket.forEach((e, slot) => setRecord(grid, column, slot, encodeNullifierRecord(e)));
  });
  return { grid, bucketBits: choice.bucketBits, capacity: choice.capacity };
}

/**
 * Looks a nullifier up in its decoded bucket (the records of its column, in slot order): the entry if present, else
 * null. Zero records are padding.
 */
export function findInBucket(records: readonly Uint8Array[], nullifier: Uint8Array): NullifierEntry | null {
  for (const r of records) {
    if (compareBytes(r.subarray(0, NULLIFIER_BYTES), nullifier) === 0) return decodeNullifierRecord(r);
  }
  return null;
}
