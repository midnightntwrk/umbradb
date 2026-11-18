/**
 * An independent BigInt reference of the ownership test, for checking the kernel: Jubjub point decompression and
 * arithmetic over the BLS12-381 scalar field, and Poseidon (width 3, 8 full and 60 partial rounds, x^5) with
 * `midnight-circuits`' constants (`fixtures/poseidon-constants.json`). Adapted from the experiments' `webgpu/ref.mjs`.
 * Slow; for tests only.
 */

import { readFileSync } from "node:fs";

/** The BLS12-381 scalar field's modulus: Jubjub's base field. */
export const P = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n;
/** Jubjub's d (−u² + v² = 1 + d·u²·v²). */
export const D = 0x2a9318e74bfa2b48f5fd9207e6bd7fd4292d7f6d37579d2601065fd6d6343eb1n;

export type Point = readonly [bigint, bigint];

export const mod = (a: bigint): bigint => ((a % P) + P) % P;

export function pow(b: bigint, e: bigint): bigint {
  let r = 1n;
  b = mod(b);
  while (e > 0n) {
    if (e & 1n) r = (r * b) % P;
    b = (b * b) % P;
    e >>= 1n;
  }
  return r;
}

export const inv = (a: bigint): bigint => pow(a, P - 2n);
const T = (P - 1n) >> 32n;
const ROOT = (() => {
  for (let g = 2n; ; g++) if (pow(g, (P - 1n) / 2n) === P - 1n) return pow(g, T);
})();

/** Tonelli–Shanks square root, or null for a non-residue. */
export function sqrt(a: bigint): bigint | null {
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

export const fromLe = (bytes: Uint8Array): bigint => {
  let r = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) r = (r << 8n) | BigInt(bytes[i]!);
  return r;
};

export const toLe = (v: bigint, n = 32): Uint8Array => {
  const o = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    o[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return o;
};

/** Decompresses a 32-byte Jubjub encoding (v little-endian, sign of u in the top bit); null if not on the curve. */
export function decompress(b32: Uint8Array): Point | null {
  const b = Uint8Array.from(b32);
  const sign = b[31]! >> 7;
  b[31]! &= 0x7f;
  const v = fromLe(b);
  if (v >= P) return null;
  const v2 = (v * v) % P;
  let u = sqrt(mod((v2 - 1n) * inv(1n + D * v2)));
  if (u === null) return null;
  if (Number(u & 1n) !== sign) u = mod(-u);
  return [u, v];
}

export function compress([u, v]: Point): Uint8Array {
  const out = toLe(v);
  out[31]! |= Number(u & 1n) << 7;
  return out;
}

export function add([u1, v1]: Point, [u2, v2]: Point): Point {
  const k = mod(D * u1 * u2 * v1 * v2);
  return [mod((u1 * v2 + v1 * u2) * inv(1n + k)), mod((v1 * v2 + u1 * u2) * inv(1n - k))];
}

export function mul(p: Point, s: bigint): Point {
  let r: Point = [0n, 1n];
  for (let i = 255; i >= 0; i--) {
    r = add(r, r);
    if ((s >> BigInt(i)) & 1n) r = add(r, p);
  }
  return r;
}

interface PoseidonParams {
  readonly rc: bigint[][];
  readonly mds: bigint[][];
}

export const POSEIDON: PoseidonParams = (() => {
  const raw = JSON.parse(readFileSync(new URL("./fixtures/poseidon-constants.json", import.meta.url), "utf8")) as {
    roundConstants: string[][];
    mds: string[][];
  };
  const big = (h: string) => BigInt(`0x${h}`);
  return { rc: raw.roundConstants.map((r) => r.map(big)), mds: raw.mds.map((r) => r.map(big)) };
})();

/** Poseidon of two field elements: one permutation of [a, b, 2], first element. */
export function poseidon2(a: bigint, b: bigint, { rc, mds } = POSEIDON): bigint {
  let s = [mod(a + rc[0]![0]!), mod(b + rc[0]![1]!), mod(2n + rc[0]![2]!)];
  const p5 = (x: bigint) => {
    const x2 = (x * x) % P;
    return (((x2 * x2) % P) * x) % P;
  };
  for (let r = 0; r < 68; r++) {
    const full = r < 4 || r >= 64;
    s = full ? s.map(p5) : [s[0]!, s[1]!, p5(s[2]!)];
    const k = r === 67 ? [0n, 0n, 0n] : rc[r + 1]!;
    const t = s;
    s = [0, 1, 2].map((i) => mod(k[i]! + mds[i]![0]! * t[0]! + mds[i]![1]! * t[1]! + mds[i]![2]! * t[2]!));
  }
  return s[0]!;
}
