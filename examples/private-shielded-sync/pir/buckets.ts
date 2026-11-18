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

/**
 * Nullifier entries as typed arrays: nullifier `i` is `values[32i … 32i + 31]`, spent at `heights[i]` in transaction
 * `txs[i]`. A table of millions of entries is built from these without one object per entry (Q57).
 */
export interface NullifierColumns {
  readonly count: number;
  readonly values: Uint8Array;
  readonly heights: Uint32Array;
  readonly txs: Uint32Array;
}

/** Each bucket's load when the nullifiers are cut by `bits` bits. */
function loadsOf(c: NullifierColumns, bits: number): Uint32Array {
  const loads = new Uint32Array(2 ** bits);
  const shift = 24 - bits;
  const v = c.values;
  for (let i = 0, o = 0; i < c.count; i++, o += NULLIFIER_BYTES) loads[((v[o]! << 16) | (v[o + 1]! << 8) | v[o + 2]!) >>> shift]!++;
  return loads;
}

const maxOf = (loads: Uint32Array): number => loads.reduce((m, l) => (l > m ? l : m), 0);

/** Builds the nullifier table (FR-062–064) from typed arrays. Nullifiers must be distinct. */
export function buildNullifierTableOf(c: NullifierColumns, bucketBits?: number): NullifierTable {
  if (c.values.length < c.count * NULLIFIER_BYTES || c.heights.length < c.count || c.txs.length < c.count) {
    throw new Error("the nullifier columns are shorter than their count");
  }
  const e = cellsPerRecord(NULLIFIER_RECORD_BYTES);
  let choice: { bucketBits: number; capacity: number; loads: Uint32Array } | null = null;
  if (bucketBits !== undefined) {
    const loads = loadsOf(c, bucketBits);
    choice = { bucketBits, capacity: Math.max(1, maxOf(loads)), loads };
  } else {
    let best = Infinity;
    for (let bits = MIN_BUCKET_BITS; bits <= MAX_BUCKET_BITS; bits++) {
      if (!noiseBoundHolds(2 ** bits)) continue;
      const loads = loadsOf(c, bits);
      const capacity = Math.max(1, maxOf(loads));
      const cost = capacity * e + 2 ** bits;
      if (cost < best) {
        best = cost;
        choice = { bucketBits: bits, capacity, loads };
      }
    }
    if (choice === null) throw new Error("no bucket size passes the PIR noise check");
  }
  // The entries in bucket order (a counting sort), then each bucket sorted by nullifier bytes.
  const { loads } = choice;
  const starts = new Float64Array(loads.length + 1);
  for (let b = 0; b < loads.length; b++) starts[b + 1] = starts[b]! + loads[b]!;
  const fill = starts.slice(0, loads.length);
  const order = new Uint32Array(c.count);
  const shift = 24 - choice.bucketBits;
  const v = c.values;
  for (let i = 0, o = 0; i < c.count; i++, o += NULLIFIER_BYTES) order[fill[((v[o]! << 16) | (v[o + 1]! << 8) | v[o + 2]!) >>> shift]!++] = i;
  const cmp = (a: number, b: number): number => {
    for (let k = 0, x = a * NULLIFIER_BYTES, y = b * NULLIFIER_BYTES; k < NULLIFIER_BYTES; k++) if (v[x + k] !== v[y + k]) return v[x + k]! - v[y + k]!;
    return 0;
  };
  const grid = createGrid(bucketShape(c.count, choice.bucketBits, choice.capacity));
  const record = new Uint8Array(NULLIFIER_RECORD_BYTES);
  const view = new DataView(record.buffer);
  for (let column = 0; column < loads.length; column++) {
    const bucket = order.subarray(starts[column], starts[column + 1]);
    bucket.sort(cmp);
    for (let slot = 0; slot < bucket.length; slot++) {
      const i = bucket[slot]!;
      if (slot > 0 && cmp(bucket[slot - 1]!, i) === 0) throw new Error("duplicate nullifier");
      record.set(v.subarray(i * NULLIFIER_BYTES, (i + 1) * NULLIFIER_BYTES), 0);
      view.setUint32(32, c.heights[i]!, true);
      view.setUint32(36, c.txs[i]!, true);
      setRecord(grid, column, slot, record);
    }
  }
  return { grid, bucketBits: choice.bucketBits, capacity: choice.capacity };
}

/** Builds the nullifier table (FR-062–064). Nullifiers must be distinct. */
export function buildNullifierTable(entries: readonly NullifierEntry[], bucketBits?: number): NullifierTable {
  const count = entries.length;
  const values = new Uint8Array(count * NULLIFIER_BYTES);
  const heights = new Uint32Array(count);
  const txs = new Uint32Array(count);
  entries.forEach((e, i) => {
    if (e.nullifier.length !== NULLIFIER_BYTES) throw new Error("a nullifier is 32 bytes");
    values.set(e.nullifier, i * NULLIFIER_BYTES);
    heights[i] = e.height;
    txs[i] = e.txIndex;
  });
  return buildNullifierTableOf({ count, values, heights, txs }, bucketBits);
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
