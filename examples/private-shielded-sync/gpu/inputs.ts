/**
 * Inputs of the GPU check (`check.ts`): scan entry sets and PIR matrices at the sizes the spec's story 7 test names,
 * built deterministically from a seed (except the query vectors, which use the library's own fresh randomness).
 *
 * Scan sets:
 * - `vectors`: the 16,384 test-vector entries (`test/fixtures/entries.bin`, the ledger's own encryptions) and their key.
 * - `preprod`: about Preprod's output count, mostly valid ciphertext points as on the chain: the 16,384 vectors, other
 *   points of the prime-order subgroup (public keys of random scalars, from the CPU kernel), outputs without a
 *   ciphertext (all-zero entries), and entries for every path of the test: 4-byte matches on points of the subgroup
 *   (hits), on points outside it and on the identity (refused by the ledger's check, FR-103), and points that do not
 *   decode (v ≥ p, not on the curve, ZIP 216's refused encodings). A forced 4-byte match takes the value the CPU kernel
 *   computes for the entry.
 *
 * Matrices: a read table (`pathSplit` 16, 705-byte records) and a nullifier table (40-byte records, buckets chosen by
 * the library) at Preprod's counts, random content.
 */

import { type Kernel } from "../kernel/kernel.ts";
import { buildNullifierTable, type NullifierEntry } from "../pir/buckets.ts";
import { buildPositionalGrid, type Grid } from "../pir/grid.ts";
import { readRecordBytes } from "../shared/records.ts";
import { add, compress, decompress, mul, P, type Point } from "../test/reference.ts";
import { JUBJUB_R } from "./field.ts";

export const ENTRY_BYTES = 36;

/** xoshiro128**, seeded through splitmix32: deterministic, fast, not cryptographic. */
export class Rng {
  readonly #s = new Uint32Array(4);

  constructor(seed: number) {
    let x = seed >>> 0;
    for (let i = 0; i < 4; i++) {
      x = (x + 0x9e3779b9) >>> 0;
      let z = x;
      z = Math.imul(z ^ (z >>> 16), 0x85ebca6b) >>> 0;
      z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35) >>> 0;
      this.#s[i] = (z ^ (z >>> 16)) >>> 0;
    }
  }

  u32(): number {
    const s = this.#s;
    const result = Math.imul(rotl(Math.imul(s[1]!, 5), 7), 9) >>> 0;
    const t = (s[1]! << 9) >>> 0;
    s[2]! ^= s[0]!;
    s[3]! ^= s[1]!;
    s[1]! ^= s[2]!;
    s[0]! ^= s[3]!;
    s[2]! ^= t;
    s[3] = rotl(s[3]!, 11);
    return result;
  }

  /** Uniform in [0, n). */
  below(n: number): number {
    return Math.floor((this.u32() / 4294967296) * n);
  }

  fill(out: Uint8Array): Uint8Array {
    const whole = out.length & ~3;
    const words = new Uint32Array(out.buffer, out.byteOffset, whole / 4);
    if (out.byteOffset % 4 === 0) for (let i = 0; i < words.length; i++) words[i] = this.u32();
    else for (let i = 0; i < whole; i++) out[i] = this.u32() & 0xff;
    for (let i = whole; i < out.length; i++) out[i] = this.u32() & 0xff;
    return out;
  }

  bytes(n: number): Uint8Array {
    return this.fill(new Uint8Array(n));
  }

  shuffle<T>(items: T[]): T[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = this.below(i + 1);
      [items[i], items[j]] = [items[j]!, items[i]!];
    }
    return items;
  }
}

function rotl(x: number, k: number): number {
  return ((x << k) | (x >>> (32 - k))) >>> 0;
}

const le = (bytes: Uint8Array): bigint => {
  let r = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) r = (r << 8n) | BigInt(bytes[i]!);
  return r;
};
const toLe = (v: bigint): Uint8Array => {
  const o = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    o[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return o;
};

export interface ScanSet {
  readonly name: string;
  readonly entries: Uint8Array;
  readonly secret: Uint8Array;
  /** What the set holds, by kind of entry. */
  readonly composition: Record<string, number>;
}

/** Fixture files of the example (`test/fixtures`). */
export interface Fixtures {
  readonly entries: Uint8Array;
  readonly pads: Uint8Array;
  readonly mine: Uint8Array;
  readonly scalar: Uint8Array;
}

/** The 16,384 test vectors. */
export function vectorSet(f: Fixtures): ScanSet {
  return { name: "vectors", entries: f.entries, secret: f.scalar, composition: { "ledger encryptions (test vectors)": f.entries.length / ENTRY_BYTES } };
}

/** A random scalar below the subgroup order, 32 bytes little-endian. */
function randomScalar(rng: Rng): Uint8Array {
  return toLe(le(rng.bytes(32)) % JUBJUB_R);
}

/** An entry from a point's 32 bytes and a 4-byte tag. */
function entryOf(point: Uint8Array, tag: Uint8Array): Uint8Array {
  const e = new Uint8Array(ENTRY_BYTES);
  e.set(point.subarray(0, 32), 0);
  e.set(tag.subarray(0, 4), 32);
  return e;
}

/** The entry with its tag set to the value the CPU kernel computes for it (a forced 4-byte match). */
function forced(kernel: Kernel, secret: Uint8Array, point: Uint8Array): Uint8Array {
  const e = entryOf(point, new Uint8Array(4));
  e.set(kernel.scanValues(e, secret).subarray(0, 4), 32);
  return e;
}

/** A point of order exactly 8 (Jubjub's cofactor): r·Q for a curve point Q outside the subgroup, retried until order 8. */
function orderEightPoint(rng: Rng): Point {
  for (;;) {
    const bytes = rng.bytes(32);
    bytes[31]! &= 0x3f;
    const q = decompress(bytes);
    if (!q) continue;
    const t = mul(q, JUBJUB_R);
    const t4 = add(add(t, t), add(t, t));
    if (!(t4[0] === 0n && t4[1] === 1n)) return t;
  }
}

/**
 * About Preprod's output count (`total`, default 70,000) of entries: see the module comment. Deterministic for a seed.
 */
export function preprodSet(f: Fixtures, kernel: Kernel, total = 70_000, seed = 53): ScanSet {
  const rng = new Rng(seed);
  const secret = f.scalar;
  const vectorCount = f.entries.length / ENTRY_BYTES;
  const parts: { kind: string; entry: Uint8Array }[] = [];
  const push = (kind: string, entry: Uint8Array) => parts.push({ kind, entry });
  const vector = (i: number) => f.entries.subarray(i * ENTRY_BYTES, (i + 1) * ENTRY_BYTES);

  for (let i = 0; i < vectorCount; i++) push("ledger encryptions (test vectors)", vector(i));

  // Forced 4-byte matches on subgroup points that are not the key's: the ledger's check accepts them, so they are hits.
  const notMine = [...f.mine].flatMap((m, i) => (m === 0 ? [i] : []));
  for (let k = 0; k < 64; k++) {
    push("forced match, subgroup point (a hit)", forced(kernel, secret, vector(notMine[rng.below(notMine.length)]!)));
  }

  // Forced matches on points outside the subgroup: a subgroup point plus each of the seven non-zero small-order points.
  const t8 = orderEightPoint(rng);
  const torsion: Point[] = [t8];
  for (let k = 1; k < 7; k++) torsion.push(add(torsion[k - 1]!, t8));
  for (let k = 0; k < 64; k++) {
    const base = decompress(vector(rng.below(vectorCount)).subarray(0, 32))!;
    const shifted = add(base, torsion[k % 7]!);
    push("forced match, point outside the subgroup (refused)", forced(kernel, secret, compress(shifted)));
  }
  // The small-order points themselves, forced.
  for (const t of torsion) push("forced match, small-order point (refused)", forced(kernel, secret, compress(t)));

  // Encodings at the edges of decoding.
  const identity = new Uint8Array(32);
  identity[0] = 1;
  push("forced match, identity (refused)", forced(kernel, secret, identity));
  const identitySigned = identity.slice();
  identitySigned[31] = 0x80;
  push("undecodable: identity with the sign bit (ZIP 216)", entryOf(identitySigned, rng.bytes(4)));
  const minusOne = toLe(P - 1n);
  push("forced match, (0, −1) (refused)", forced(kernel, secret, minusOne));
  const minusOneSigned = minusOne.slice();
  minusOneSigned[31]! |= 0x80;
  push("undecodable: (0, −1) with the sign bit (ZIP 216)", entryOf(minusOneSigned, rng.bytes(4)));
  const zeroPoint = new Uint8Array(32);
  push("point bytes zero, tag not zero (an order-4 point)", entryOf(zeroPoint, Uint8Array.of(1, 2, 3, 4)));
  push("forced match, point bytes zero (refused)", forced(kernel, secret, zeroPoint));
  for (const v of [P, P + 1n, (1n << 255n) - 1n]) push("undecodable: v not below p", entryOf(toLe(v), rng.bytes(4)));
  push("undecodable: all bytes 0xff", new Uint8Array(ENTRY_BYTES).fill(0xff));

  // Bytes that are not a curve point (v below p, u² not a square), and fully random bytes.
  for (let k = 0; k < 128; ) {
    const bytes = rng.bytes(32);
    bytes[31]! &= 0x3f;
    if (decompress(bytes) !== null) continue;
    push("undecodable: not on the curve", entryOf(bytes, rng.bytes(4)));
    k++;
  }
  for (let k = 0; k < 256; k++) push("random 36 bytes", rng.bytes(ENTRY_BYTES));
  // Curve points mostly outside the subgroup (random v below p that decodes), random tags.
  for (let k = 0; k < 256; ) {
    const bytes = rng.bytes(32);
    bytes[31]! &= 0x3f;
    if (decompress(bytes) === null) continue;
    push("curve point, random tag", entryOf(bytes, rng.bytes(4)));
    k++;
  }

  // Outputs without a ciphertext.
  const zeros = Math.round(total / 64);
  for (let k = 0; k < zeros; k++) push("all zero (no ciphertext)", new Uint8Array(ENTRY_BYTES));

  // The rest: other subgroup points with random tags, as other wallets' outputs.
  while (parts.length < total) push("subgroup point, random tag", entryOf(kernel.publicKey(randomScalar(rng)), rng.bytes(4)));
  if (parts.length > total) throw new Error(`the fixed parts (${parts.length}) exceed the set size ${total}`);

  rng.shuffle(parts);
  const entries = new Uint8Array(total * ENTRY_BYTES);
  const composition: Record<string, number> = {};
  parts.forEach(({ kind, entry }, i) => {
    entries.set(entry, i * ENTRY_BYTES);
    composition[kind] = (composition[kind] ?? 0) + 1;
  });
  return { name: "preprod", entries, secret, composition };
}

/** Preprod's read table: `records` (default 69,255) records of `readRecordBytes(16)` = 705 random bytes. */
export function readTable(records = 69_255, seed = 7): Grid {
  const rng = new Rng(seed);
  const size = readRecordBytes(16);
  const bytes = rng.bytes(records * size);
  return buildPositionalGrid(records, size, bytes);
}

/** Preprod's nullifier table: `count` (default 57,770) distinct random nullifiers, buckets as the library picks. */
export function nullifierTable(count = 57_770, seed = 11): { grid: Grid; bucketBits: number; capacity: number } {
  const rng = new Rng(seed);
  const seen = new Set<string>();
  const entries: NullifierEntry[] = [];
  while (entries.length < count) {
    const nullifier = rng.bytes(32);
    const key = Array.from(nullifier, (b) => b.toString(16).padStart(2, "0")).join("");
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push({ nullifier, height: rng.below(3_400_000), txIndex: rng.below(64) });
  }
  return buildNullifierTable(entries);
}

/** `count` random vectors of `cols` 32-bit values (vector-major). */
export function randomVectors(rng: Rng, count: number, cols: number): Uint32Array {
  const out = new Uint32Array(count * cols);
  for (let i = 0; i < out.length; i++) out[i] = rng.u32();
  return out;
}
