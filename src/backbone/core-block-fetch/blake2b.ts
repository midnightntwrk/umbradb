/**
 * BLAKE2b-256 (RFC 7693, unkeyed, a 32-byte digest): the hash of a Substrate block header, which the Midnight node's
 * head notifications carry without its hash (`./header.ts`). Node.js's `crypto` offers BLAKE2b
 * only with a 64-byte digest (`blake2b512`), and a shorter BLAKE2b digest is not a prefix of it (the digest length is
 * hashed in), so the compression function is written out here. Checked against RFC 7693's and Python's `hashlib`
 * vectors and a real mainnet header (`test/backbone/block-fetch-scale.test.ts`). Pure: no Node.js import.
 */

const MASK = (1n << 64n) - 1n;

const IV: readonly bigint[] = [
  0x6a09e667f3bcc908n,
  0xbb67ae8584caa73bn,
  0x3c6ef372fe94f82bn,
  0xa54ff53a5f1d36f1n,
  0x510e527fade682d1n,
  0x9b05688c2b3e6c1fn,
  0x1f83d9abfb41bd6bn,
  0x5be0cd19137e2179n,
];

const SIGMA: readonly (readonly number[])[] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
  [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
  [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8],
  [9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13],
  [2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9],
  [12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11],
  [13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10],
  [6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5],
  [10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0],
];

const BLOCK_BYTES = 128;
const DIGEST_BYTES = 32;

const rotateRight = (x: bigint, n: bigint): bigint => ((x >> n) | (x << (64n - n))) & MASK;

/** The 16 little-endian words of the 128-byte block at `offset` of `data`, zero past its end. */
function words(data: Uint8Array, offset: number): bigint[] {
  const m: bigint[] = [];
  for (let word = 0; word < 16; word++) {
    let value = 0n;
    for (let byte = 7; byte >= 0; byte--) value = (value << 8n) | BigInt(data[offset + word * 8 + byte] ?? 0);
    m.push(value);
  }
  return m;
}

/** RFC 7693's compression function F: `h` updated in place with the block `m`, `t` bytes hashed so far. */
function compress(h: bigint[], m: readonly bigint[], t: bigint, last: boolean): void {
  const v = [...h, ...IV];
  v[12] = (v[12] as bigint) ^ (t & MASK);
  v[13] = (v[13] as bigint) ^ (t >> 64n);
  if (last) v[14] = (v[14] as bigint) ^ MASK;
  const g = (a: number, b: number, c: number, d: number, x: bigint, y: bigint): void => {
    v[a] = ((v[a] as bigint) + (v[b] as bigint) + x) & MASK;
    v[d] = rotateRight((v[d] as bigint) ^ (v[a] as bigint), 32n);
    v[c] = ((v[c] as bigint) + (v[d] as bigint)) & MASK;
    v[b] = rotateRight((v[b] as bigint) ^ (v[c] as bigint), 24n);
    v[a] = ((v[a] as bigint) + (v[b] as bigint) + y) & MASK;
    v[d] = rotateRight((v[d] as bigint) ^ (v[a] as bigint), 16n);
    v[c] = ((v[c] as bigint) + (v[d] as bigint)) & MASK;
    v[b] = rotateRight((v[b] as bigint) ^ (v[c] as bigint), 63n);
  };
  for (let round = 0; round < 12; round++) {
    const s = SIGMA[round % 10] as readonly number[];
    const word = (index: number): bigint => m[s[index] as number] as bigint;
    g(0, 4, 8, 12, word(0), word(1));
    g(1, 5, 9, 13, word(2), word(3));
    g(2, 6, 10, 14, word(4), word(5));
    g(3, 7, 11, 15, word(6), word(7));
    g(0, 5, 10, 15, word(8), word(9));
    g(1, 6, 11, 12, word(10), word(11));
    g(2, 7, 8, 13, word(12), word(13));
    g(3, 4, 9, 14, word(14), word(15));
  }
  for (let index = 0; index < 8; index++) h[index] = (h[index] as bigint) ^ (v[index] as bigint) ^ (v[index + 8] as bigint);
}

/** The BLAKE2b-256 digest of `data` (unkeyed). */
export function blake2b256(data: Uint8Array): Uint8Array {
  const h = [...IV];
  // The parameter block's first word: digest length, no key, fanout 1, depth 1.
  h[0] = (h[0] as bigint) ^ (0x01010000n | BigInt(DIGEST_BYTES));
  // Every block but the last is compressed as it comes; the last — possibly partial, or the empty input's only one —
  // with the final flag and the total length.
  const blocks = Math.max(1, Math.ceil(data.length / BLOCK_BYTES));
  for (let block = 0; block < blocks - 1; block++) {
    compress(h, words(data, block * BLOCK_BYTES), BigInt((block + 1) * BLOCK_BYTES), false);
  }
  compress(h, words(data.subarray((blocks - 1) * BLOCK_BYTES), 0), BigInt(data.length), true);
  const out = new Uint8Array(DIGEST_BYTES);
  for (let index = 0; index < DIGEST_BYTES; index++) {
    out[index] = Number(((h[index >> 3] as bigint) >> BigInt((index & 7) * 8)) & 0xffn);
  }
  return out;
}
