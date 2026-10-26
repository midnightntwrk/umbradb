/**
 * Substrate's `twox128` storage hashing (task 0.3): the storage key prefix of a pallet's item is
 * `twox128(pallet) ‖ twox128(item)`, and `twox128(x)` is `xxh64(x, seed 0) ‖ xxh64(x, seed 1)`, each 64-bit hash
 * written little-endian (`sp-crypto-hashing`'s `twox_128`). The recording driver (`./range.ts`) names the storage it
 * reads at every height (`System.Events`) and at block 0 (the cNight registrations, IN-7) by these prefixes, so the
 * keys are computed, not copied. Short inputs only (pallet and item names): plain `bigint` arithmetic.
 */

const MASK = (1n << 64n) - 1n;
const PRIME_1 = 0x9e3779b185ebca87n;
const PRIME_2 = 0xc2b2ae3d27d4eb4fn;
const PRIME_3 = 0x165667b19e3779f9n;
const PRIME_4 = 0x85ebca77c2b2ae63n;
const PRIME_5 = 0x27d4eb2f165667c5n;

const rotl = (value: bigint, bits: number): bigint =>
  ((value << BigInt(bits)) | (value >> BigInt(64 - bits))) & MASK;

/** The little-endian unsigned integer of `length` bytes at `offset`. */
function littleEndian(bytes: Uint8Array, offset: number, length: number): bigint {
  let value = 0n;
  for (let index = length - 1; index >= 0; index--) value = (value << 8n) | BigInt(bytes[offset + index] as number);
  return value;
}

function round(accumulator: bigint, input: bigint): bigint {
  return (rotl((accumulator + input * PRIME_2) & MASK, 31) * PRIME_1) & MASK;
}

function merge(accumulator: bigint, value: bigint): bigint {
  return (((accumulator ^ round(0n, value)) * PRIME_1) + PRIME_4) & MASK;
}

/** XXH64 of `bytes` with `seed` (the reference algorithm, `xxhash.h`). */
export function xxh64(bytes: Uint8Array, seed: bigint): bigint {
  const length = bytes.length;
  let offset = 0;
  let hash: bigint;
  if (length >= 32) {
    let v1 = (seed + PRIME_1 + PRIME_2) & MASK;
    let v2 = (seed + PRIME_2) & MASK;
    let v3 = seed & MASK;
    let v4 = (seed - PRIME_1) & MASK;
    while (offset + 32 <= length) {
      v1 = round(v1, littleEndian(bytes, offset, 8));
      v2 = round(v2, littleEndian(bytes, offset + 8, 8));
      v3 = round(v3, littleEndian(bytes, offset + 16, 8));
      v4 = round(v4, littleEndian(bytes, offset + 24, 8));
      offset += 32;
    }
    hash = (rotl(v1, 1) + rotl(v2, 7) + rotl(v3, 12) + rotl(v4, 18)) & MASK;
    for (const v of [v1, v2, v3, v4]) hash = merge(hash, v);
  } else {
    hash = (seed + PRIME_5) & MASK;
  }
  hash = (hash + BigInt(length)) & MASK;
  while (offset + 8 <= length) {
    hash ^= round(0n, littleEndian(bytes, offset, 8));
    hash = (rotl(hash, 27) * PRIME_1 + PRIME_4) & MASK;
    offset += 8;
  }
  if (offset + 4 <= length) {
    hash ^= (littleEndian(bytes, offset, 4) * PRIME_1) & MASK;
    hash = (rotl(hash, 23) * PRIME_2 + PRIME_3) & MASK;
    offset += 4;
  }
  while (offset < length) {
    hash ^= (BigInt(bytes[offset] as number) * PRIME_5) & MASK;
    hash = (rotl(hash, 11) * PRIME_1) & MASK;
    offset += 1;
  }
  hash ^= hash >> 33n;
  hash = (hash * PRIME_2) & MASK;
  hash ^= hash >> 29n;
  hash = (hash * PRIME_3) & MASK;
  hash ^= hash >> 32n;
  return hash;
}

/** `value` as 8 little-endian bytes into `target` at `offset`. */
function writeLittleEndian(target: Uint8Array, offset: number, value: bigint): void {
  for (let index = 0; index < 8; index++) target[offset + index] = Number((value >> BigInt(8 * index)) & 0xffn);
}

/** Substrate's `twox128` of `text`'s UTF-8 bytes: 16 bytes. */
export function twox128(text: string): Uint8Array {
  const bytes = new TextEncoder().encode(text);
  const hash = new Uint8Array(16);
  writeLittleEndian(hash, 0, xxh64(bytes, 0n));
  writeLittleEndian(hash, 8, xxh64(bytes, 1n));
  return hash;
}

/** The storage key prefix of a pallet's storage item: `twox128(pallet) ‖ twox128(item)`, 32 bytes. */
export function storagePrefix(pallet: string, item: string): Uint8Array {
  const prefix = new Uint8Array(32);
  prefix.set(twox128(pallet), 0);
  prefix.set(twox128(item), 16);
  return prefix;
}
