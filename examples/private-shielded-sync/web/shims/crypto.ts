/**
 * The parts of `node:crypto` the client's code uses, for the browser page (`../build.ts` aliases `node:crypto` here):
 * `createHash("sha256")` (`@noble/hashes`), `createCipheriv("aes-128-ctr")` (AES-128 below, CTR with a 128-bit
 * big-endian counter as Node.js counts it), `randomFillSync`, `randomInt` and `randomBytes` (`crypto.getRandomValues`).
 * Anything else throws.
 */

import { sha256 } from "@noble/hashes/sha2.js";
import { Buffer } from "buffer";

type Data = Uint8Array | string;
const bytesOf = (data: Data): Uint8Array => (typeof data === "string" ? new TextEncoder().encode(data) : data);

export function createHash(algorithm: string) {
  if (algorithm !== "sha256") throw new Error(`createHash(${algorithm}) is not available in the page`);
  const h = sha256.create();
  const hash = {
    update(data: Data) {
      h.update(bytesOf(data));
      return hash;
    },
    digest(encoding?: "hex") {
      const out = Buffer.from(h.digest());
      return encoding === "hex" ? out.toString("hex") : out;
    },
  };
  return hash;
}

// ── AES-128 ─────────────────────────────────────────────────────────────────────────────────────────────────────

const SBOX = new Uint8Array(256);
const T0 = new Uint32Array(256);
const T1 = new Uint32Array(256);
const T2 = new Uint32Array(256);
const T3 = new Uint32Array(256);
{
  const rotl8 = (x: number, s: number) => ((x << s) | (x >>> (8 - s))) & 0xff;
  let p = 1;
  let q = 1;
  do {
    p = (p ^ ((p << 1) & 0xff) ^ (p & 0x80 ? 0x1b : 0)) & 0xff; // p × 3
    q ^= q << 1;
    q ^= q << 2;
    q ^= q << 4;
    q &= 0xff;
    if (q & 0x80) q ^= 0x09; // q / 3
    SBOX[p] = (q ^ rotl8(q, 1) ^ rotl8(q, 2) ^ rotl8(q, 3) ^ rotl8(q, 4) ^ 0x63) & 0xff;
  } while (p !== 1);
  SBOX[0] = 0x63;
  for (let x = 0; x < 256; x++) {
    const s = SBOX[x]!;
    const s2 = ((s << 1) ^ (s & 0x80 ? 0x1b : 0)) & 0xff;
    const s3 = s2 ^ s;
    T0[x] = ((s2 << 24) | (s << 16) | (s << 8) | s3) >>> 0;
    T1[x] = ((s3 << 24) | (s2 << 16) | (s << 8) | s) >>> 0;
    T2[x] = ((s << 24) | (s3 << 16) | (s2 << 8) | s) >>> 0;
    T3[x] = ((s << 24) | (s << 16) | (s3 << 8) | s2) >>> 0;
  }
}

function expandKey(key: Uint8Array): Uint32Array {
  if (key.length !== 16) throw new Error("AES-128 takes a 16-byte key");
  const w = new Uint32Array(44);
  for (let i = 0; i < 4; i++) w[i] = ((key[4 * i]! << 24) | (key[4 * i + 1]! << 16) | (key[4 * i + 2]! << 8) | key[4 * i + 3]!) >>> 0;
  let rcon = 1;
  for (let i = 4; i < 44; i++) {
    let t = w[i - 1]!;
    if (i % 4 === 0) {
      t = ((SBOX[(t >>> 16) & 0xff]! << 24) | (SBOX[(t >>> 8) & 0xff]! << 16) | (SBOX[t & 0xff]! << 8) | SBOX[t >>> 24]!) ^ (rcon << 24);
      rcon = ((rcon << 1) ^ (rcon & 0x80 ? 0x1b : 0)) & 0xff;
    }
    w[i] = (w[i - 4]! ^ t) >>> 0;
  }
  return w;
}

/** Encrypts one block given as four big-endian words; writes 16 bytes at `out[at]`. */
function encryptBlock(rk: Uint32Array, b0: number, b1: number, b2: number, b3: number, out: Uint8Array, at: number): void {
  let s0 = b0 ^ rk[0]!;
  let s1 = b1 ^ rk[1]!;
  let s2 = b2 ^ rk[2]!;
  let s3 = b3 ^ rk[3]!;
  for (let r = 1; r < 10; r++) {
    const k = 4 * r;
    const t0 = T0[s0 >>> 24]! ^ T1[(s1 >>> 16) & 0xff]! ^ T2[(s2 >>> 8) & 0xff]! ^ T3[s3 & 0xff]! ^ rk[k]!;
    const t1 = T0[s1 >>> 24]! ^ T1[(s2 >>> 16) & 0xff]! ^ T2[(s3 >>> 8) & 0xff]! ^ T3[s0 & 0xff]! ^ rk[k + 1]!;
    const t2 = T0[s2 >>> 24]! ^ T1[(s3 >>> 16) & 0xff]! ^ T2[(s0 >>> 8) & 0xff]! ^ T3[s1 & 0xff]! ^ rk[k + 2]!;
    const t3 = T0[s3 >>> 24]! ^ T1[(s0 >>> 16) & 0xff]! ^ T2[(s1 >>> 8) & 0xff]! ^ T3[s2 & 0xff]! ^ rk[k + 3]!;
    s0 = t0 >>> 0;
    s1 = t1 >>> 0;
    s2 = t2 >>> 0;
    s3 = t3 >>> 0;
  }
  const last = (a: number, b: number, c: number, d: number, k: number) =>
    ((SBOX[a >>> 24]! << 24) | (SBOX[(b >>> 16) & 0xff]! << 16) | (SBOX[(c >>> 8) & 0xff]! << 8) | SBOX[d & 0xff]!) ^ rk[k]!;
  const o = [last(s0, s1, s2, s3, 40), last(s1, s2, s3, s0, 41), last(s2, s3, s0, s1, 42), last(s3, s0, s1, s2, 43)];
  for (let i = 0; i < 4; i++) {
    out[at + 4 * i] = o[i]! >>> 24;
    out[at + 4 * i + 1] = (o[i]! >>> 16) & 0xff;
    out[at + 4 * i + 2] = (o[i]! >>> 8) & 0xff;
    out[at + 4 * i + 3] = o[i]! & 0xff;
  }
}

export function createCipheriv(algorithm: string, key: Uint8Array, iv: Uint8Array) {
  if (algorithm !== "aes-128-ctr") throw new Error(`createCipheriv(${algorithm}) is not available in the page`);
  if (iv.length !== 16) throw new Error("AES-CTR takes a 16-byte counter block");
  const rk = expandKey(key);
  // The counter as four big-endian words, incremented as one 128-bit number.
  const c = [0, 1, 2, 3].map((i) => ((iv[4 * i]! << 24) | (iv[4 * i + 1]! << 16) | (iv[4 * i + 2]! << 8) | iv[4 * i + 3]!) >>> 0);
  const block = new Uint8Array(16);
  let used = 16;
  const next = () => {
    encryptBlock(rk, c[0]!, c[1]!, c[2]!, c[3]!, block, 0);
    for (let i = 3; i >= 0; i--) {
      c[i] = (c[i]! + 1) >>> 0;
      if (c[i] !== 0) break;
    }
    used = 0;
  };
  return {
    update(data: Uint8Array): Buffer {
      const out = Buffer.alloc(data.length);
      let i = 0;
      // Whole blocks straight into the output when aligned.
      while (i < data.length) {
        if (used === 16 && data.length - i >= 16) {
          encryptBlock(rk, c[0]!, c[1]!, c[2]!, c[3]!, out, i);
          for (let j = 0; j < 16; j++) out[i + j]! ^= data[i + j]!;
          for (let j = 3; j >= 0; j--) {
            c[j] = (c[j]! + 1) >>> 0;
            if (c[j] !== 0) break;
          }
          i += 16;
          continue;
        }
        if (used === 16) next();
        out[i] = data[i]! ^ block[used]!;
        used++;
        i++;
      }
      return out;
    },
    final(): Buffer {
      return Buffer.alloc(0);
    },
  };
}

// ── randomness ──────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * Fills `view` with random bytes. `crypto.getRandomValues` refuses a view of a `SharedArrayBuffer` (the PIR library's
 * buffers are shared) and more than 65,536 bytes at once, so it fills a private chunk and copies it in.
 */
export function randomFillSync<T extends ArrayBufferView>(view: T): T {
  const bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  const chunk = new Uint8Array(Math.min(65536, bytes.length));
  for (let off = 0; off < bytes.length; off += chunk.length) {
    const n = Math.min(chunk.length, bytes.length - off);
    crypto.getRandomValues(chunk.subarray(0, n));
    bytes.set(chunk.subarray(0, n), off);
  }
  chunk.fill(0);
  return view;
}

export function randomBytes(n: number): Buffer {
  return randomFillSync(Buffer.alloc(n));
}

/** A uniform integer in [0, max) (or [min, max) with two arguments), by rejection. */
export function randomInt(a: number, b?: number): number {
  const [min, max] = b === undefined ? [0, a] : [a, b];
  const range = max - min;
  if (!Number.isSafeInteger(range) || range <= 0 || range > 2 ** 32) throw new Error(`randomInt range ${range}`);
  const limit = Math.floor(2 ** 32 / range) * range;
  const u = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(u);
    if (u[0]! < limit) return min + (u[0]! % range);
  }
}
