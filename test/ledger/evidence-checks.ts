import type { RawPackage } from "./adapter-fixtures.js";

// The ownership test a wallet runs on a zswap output's 224-byte ciphertext (`LedgerEvent.ciphertext`), written from
// the ledger's own encryption (`midnight-ledger` `transient-crypto/src/encryption.rs`: `decrypt`): k* = point × secret,
// k = Poseidon(k*.x, k*.y), and element i − Poseidon(k, i) is the i-th plaintext element, element 0's being 0. The
// curve arithmetic is plain `bigint` (Jubjub over the BLS12-381 scalar field, twisted Edwards, a = −1), as the
// experiments' reference (`resources/00053-private-shielded-sync/webgpu/ref.mjs`) does it; Poseidon is the package's
// own `transientHash` of two field elements, the ledger's `transient_hash`.

/** The BLS12-381 scalar field's modulus: Jubjub's base field. */
export const P = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n;
/** Jubjub's `d`. */
const D = 0x2a9318e74bfa2b48f5fd9207e6bd7fd4292d7f6d37579d2601065fd6d6343eb1n;

const mod = (a: bigint): bigint => ((a % P) + P) % P;
function pow(base: bigint, exponent: bigint): bigint {
  let result = 1n;
  let b = mod(base);
  let e = exponent;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % P;
    b = (b * b) % P;
    e >>= 1n;
  }
  return result;
}
const inv = (a: bigint): bigint => pow(a, P - 2n);
const T = (P - 1n) >> 32n;
/** A generator of the 2^32-th roots of unity: g^T for the smallest non-residue g. */
const ROOT = (() => {
  for (let g = 2n; ; g++) if (pow(g, (P - 1n) / 2n) === P - 1n) return pow(g, T);
})();

/** A square root modulo {@link P} (Tonelli–Shanks), or null for a non-residue. */
function sqrt(a: bigint): bigint | null {
  if (a === 0n) return 0n;
  if (pow(a, (P - 1n) / 2n) !== 1n) return null;
  let x = pow(a, (T + 1n) / 2n);
  let b = pow(a, T);
  let z = ROOT;
  let m = 32;
  while (b !== 1n) {
    let i = 0;
    for (let t = b; t !== 1n; t = (t * t) % P) i++;
    let c = z;
    for (let j = 0; j < m - i - 1; j++) c = (c * c) % P;
    x = (x * c) % P;
    z = (c * c) % P;
    b = (b * z) % P;
    m = i;
  }
  return x;
}

/** A little-endian integer. */
export function littleEndian(bytes: Uint8Array): bigint {
  let value = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) value = (value << 8n) | BigInt(bytes[i]!);
  return value;
}

/** A Jubjub point's affine coordinates (u, v). */
export type Point = readonly [bigint, bigint];

/**
 * A 32-byte compressed Jubjub point (v little-endian, u's sign in the top bit) as its coordinates, or null when the
 * bytes encode no point of the curve.
 */
export function decompressPoint(bytes: Uint8Array): Point | null {
  if (bytes.length !== 32) return null;
  const copy = Uint8Array.from(bytes);
  const sign = copy[31]! >> 7;
  copy[31] = copy[31]! & 0x7f;
  const v = littleEndian(copy);
  if (v >= P) return null;
  const v2 = (v * v) % P;
  let u = sqrt(mod((v2 - 1n) * inv(1n + D * v2)));
  if (u === null) return null;
  if (u === 0n && sign === 1) return null;
  if (Number(u & 1n) !== sign) u = mod(-u);
  return [u, v];
}

function add([u1, v1]: Point, [u2, v2]: Point): Point {
  const k = mod(D * u1 * u2 * v1 * v2);
  return [mod((u1 * v2 + v1 * u2) * inv(1n + k)), mod((v1 * v2 + u1 * u2) * inv(1n - k))];
}

/** `point` × `scalar`. */
export function multiply(point: Point, scalar: bigint): Point {
  let result: Point = [0n, 1n];
  for (let i = 255; i >= 0; i--) {
    result = add(result, result);
    if ((scalar >> BigInt(i)) & 1n) result = add(result, point);
  }
  return result;
}

/** A SCALE compact integer (the ledger's `ScaleBigInt`, its field elements' serialization). */
export function scaleCompact(value: bigint): Uint8Array {
  if (value < 0n) throw new RangeError("not a natural number");
  if (value < 1n << 6n) return Uint8Array.of(Number(value << 2n));
  if (value < 1n << 14n) {
    const v = (value << 2n) | 1n;
    return Uint8Array.of(Number(v & 0xffn), Number(v >> 8n));
  }
  if (value < 1n << 30n) {
    const v = (value << 2n) | 2n;
    return Uint8Array.from([0, 1, 2, 3].map((i) => Number((v >> BigInt(8 * i)) & 0xffn)));
  }
  const bytes: number[] = [];
  for (let rest = value; rest > 0n; rest >>= 8n) bytes.push(Number(rest & 0xffn));
  return Uint8Array.from([((bytes.length - 4) << 2) | 3, ...bytes]);
}

/** The value of a SCALE compact integer at the start of `bytes`. */
export function scaleCompactValue(bytes: Uint8Array): bigint {
  const first = bytes[0]!;
  switch (first & 3) {
    case 0:
      return BigInt(first >> 2);
    case 1:
      return littleEndian(bytes.subarray(0, 2)) >> 2n;
    case 2:
      return littleEndian(bytes.subarray(0, 4)) >> 2n;
    default:
      return littleEndian(bytes.subarray(1, 1 + (first >> 2) + 4));
  }
}

/** The ciphertext's six elements, each its 32-byte little-endian integer. */
export const elementsOf = (ciphertext: Uint8Array): bigint[] =>
  Array.from({ length: 6 }, (_, i) => littleEndian(ciphertext.subarray(32 + 32 * i, 64 + 32 * i)));

/** The bytes the ledger serializes the ciphertext as: the point, then each element as a SCALE compact integer. */
export function serializedCiphertext(ciphertext: Uint8Array): Uint8Array {
  const parts = [ciphertext.subarray(0, 32), ...elementsOf(ciphertext).map(scaleCompact)];
  return Uint8Array.from(parts.flatMap((part) => [...part]));
}

/** Poseidon of two field elements: the package's `transientHash` over two field atoms. */
export function hash2(raw: RawPackage, a: bigint, b: bigint): bigint {
  const field = { tag: "atom" as const, value: { tag: "field" as const } };
  return raw.valueToBigInt(raw.transientHash([field, field], [...raw.bigIntToValue(a), ...raw.bigIntToValue(b)]));
}

/** The plaintext elements of `ciphertext` under the encryption secret `secret` (element 0 is 0 for its owner). */
export function decrypt(raw: RawPackage, ciphertext: Uint8Array, secret: bigint): bigint[] {
  const point = decompressPoint(ciphertext.subarray(0, 32));
  if (point === null) throw new Error("the ciphertext's point is not on the curve");
  const [x, y] = multiply(point, secret);
  const key = hash2(raw, x, y);
  return elementsOf(ciphertext).map((element, i) => mod(element - hash2(raw, key, BigInt(i))));
}

/** `needle`'s first position in `haystack`, or −1. */
export function indexOfBytes(haystack: Uint8Array, needle: Uint8Array): number {
  return Buffer.from(haystack).indexOf(Buffer.from(needle));
}
