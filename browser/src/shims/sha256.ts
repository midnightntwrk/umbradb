/**
 * SHA-256 (FIPS 180-4) in plain TypeScript, synchronous and incremental: what the browser build gives the code that
 * Node.js runs with `node:crypto`'s `createHash("sha256")` (`openspec/changes/core-arch/design.md` §9.2; task 16.1).
 * The contents hash (DT-3), the per-block digests (DT-5), the configuration's data hash (CF-6), a key's id (CF-11) and
 * a ledger transaction's hash all call it synchronously and feed it in pieces, which WebCrypto's one-shot, asynchronous
 * `digest` cannot do. `test/browser/shims.test.ts` holds it equal to Node.js's on random inputs split at random points.
 */

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98,
  0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8,
  0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
  0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
  0xc67178f2,
]);

const INITIAL = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

/** An incremental SHA-256: {@link update} with bytes in any pieces, then {@link digest} once. */
export class Sha256 {
  readonly #state = Uint32Array.from(INITIAL);
  readonly #block = new Uint8Array(64);
  readonly #words = new Uint32Array(64);
  #filled = 0;
  /** The message's length so far, in bytes (a safe integer: 2^53 bytes is far beyond any input here). */
  #length = 0;
  #done = false;

  /** Hashes `bytes` after what came before; throws once {@link digest} was called. */
  update(bytes: Uint8Array): this {
    if (this.#done) throw new Error("Digest already called");
    let offset = 0;
    this.#length += bytes.length;
    if (this.#filled > 0) {
      const take = Math.min(64 - this.#filled, bytes.length);
      this.#block.set(bytes.subarray(0, take), this.#filled);
      this.#filled += take;
      offset = take;
      if (this.#filled < 64) return this;
      this.#compress(this.#block, 0);
      this.#filled = 0;
    }
    for (; offset + 64 <= bytes.length; offset += 64) this.#compress(bytes, offset);
    if (offset < bytes.length) {
      this.#block.set(bytes.subarray(offset), 0);
      this.#filled = bytes.length - offset;
    }
    return this;
  }

  /** The 32-byte hash of everything given; later calls of {@link update} or `digest` throw. */
  digest(): Uint8Array {
    if (this.#done) throw new Error("Digest already called");
    this.#done = true;
    const bits = this.#length * 8;
    const block = this.#block;
    block[this.#filled] = 0x80;
    block.fill(0, this.#filled + 1);
    if (this.#filled + 1 > 56) {
      this.#compress(block, 0);
      block.fill(0);
    }
    const view = new DataView(block.buffer, block.byteOffset, 64);
    view.setUint32(56, Math.floor(bits / 0x1_0000_0000));
    view.setUint32(60, bits >>> 0);
    this.#compress(block, 0);
    const out = new Uint8Array(32);
    const outView = new DataView(out.buffer);
    for (let i = 0; i < 8; i++) outView.setUint32(i * 4, this.#state[i] as number);
    return out;
  }

  #compress(bytes: Uint8Array, offset: number): void {
    const w = this.#words;
    for (let i = 0; i < 16; i++) {
      const at = offset + i * 4;
      w[i] = ((bytes[at] as number) << 24) | ((bytes[at + 1] as number) << 16) | ((bytes[at + 2] as number) << 8) | (bytes[at + 3] as number);
    }
    for (let i = 16; i < 64; i++) {
      const a = w[i - 15] as number;
      const b = w[i - 2] as number;
      const s0 = ((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3);
      const s1 = ((b >>> 17) | (b << 15)) ^ ((b >>> 19) | (b << 13)) ^ (b >>> 10);
      w[i] = ((w[i - 16] as number) + s0 + (w[i - 7] as number) + s1) | 0;
    }
    const s = this.#state;
    let a = s[0] as number;
    let b = s[1] as number;
    let c = s[2] as number;
    let d = s[3] as number;
    let e = s[4] as number;
    let f = s[5] as number;
    let g = s[6] as number;
    let h = s[7] as number;
    for (let i = 0; i < 64; i++) {
      const s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + s1 + ch + (K[i] as number) + (w[i] as number)) | 0;
      const s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (s0 + maj) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    s[0] = ((s[0] as number) + a) | 0;
    s[1] = ((s[1] as number) + b) | 0;
    s[2] = ((s[2] as number) + c) | 0;
    s[3] = ((s[3] as number) + d) | 0;
    s[4] = ((s[4] as number) + e) | 0;
    s[5] = ((s[5] as number) + f) | 0;
    s[6] = ((s[6] as number) + g) | 0;
    s[7] = ((s[7] as number) + h) | 0;
  }
}

/** SHA-256 of `bytes`, at once. */
export function sha256(bytes: Uint8Array): Uint8Array {
  return new Sha256().update(bytes).digest();
}
