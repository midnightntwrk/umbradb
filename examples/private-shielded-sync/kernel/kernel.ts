/**
 * Loads the scan kernel (`pss-kernel.wasm`, built by `build.sh` from `src/lib.rs`) and wraps its exports.
 *
 * The committed digest (`pss-kernel.wasm.sha256`) is checked before the module is compiled; a kernel whose bytes do
 * not match is refused (spec FR-101). The kernel's exports take and fill plain linear memory; this wrapper copies
 * inputs in and outputs out. The module lists wasm-bindgen placeholder imports (from a dependency of the ledger's
 * crates) that the kernel's exports never call; each is bound to a function that throws.
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** Bytes of one scan entry: compressed point (32), first 4 bytes of element 0. */
export const ENTRY_BYTES = 36;
/** Bytes of a full ciphertext: compressed point (32), elements 0–5 (32 each, little-endian). */
export const CIPHERTEXT_BYTES = 224;
/** Bytes of a coin in the kernel's layout: value (16, little-endian), token type (32), nonce (32). */
export const COIN_BYTES = 80;

export const KERNEL_PATH = fileURLToPath(new URL("./pss-kernel.wasm", import.meta.url));
export const KERNEL_DIGEST_PATH = fileURLToPath(new URL("./pss-kernel.wasm.sha256", import.meta.url));

/** The digest recorded beside the kernel, as lower-case hex. */
export function committedKernelDigest(path: string = KERNEL_DIGEST_PATH): string {
  const line = readFileSync(path, "utf8").trim();
  const digest = line.split(/\s+/)[0] ?? "";
  if (!/^[0-9a-f]{64}$/.test(digest)) throw new Error(`no SHA-256 in ${path}`);
  return digest;
}

/**
 * Reads and compiles the kernel after checking its SHA-256 against `expectedDigest` (by default the committed one).
 * The compiled module can be sent to worker threads.
 */
export function compileKernel(options: { path?: string; expectedDigest?: string } = {}): WebAssembly.Module {
  const bytes = readFileSync(options.path ?? KERNEL_PATH);
  const digest = createHash("sha256").update(bytes).digest("hex");
  const expected = options.expectedDigest ?? committedKernelDigest();
  if (digest !== expected) throw new Error(`scan kernel digest ${digest} does not match the expected ${expected}`);
  return new WebAssembly.Module(bytes);
}

interface Exports {
  memory: WebAssembly.Memory;
  alloc(len: number): number;
  dealloc(ptr: number, len: number): void;
  scan(entries: number, count: number, secret: number, out: number): number;
  scan_values(entries: number, count: number, secret: number, out: number): number;
  pads(point: number, secret: number, out: number): number;
  hash2_raw(a: number, b: number, out: number): number;
  decrypt_coin(ciphertext: number, secret: number, out: number): number;
  leaf(commitment: number, out: number): number;
  commitment(coin: number, coinPublicKey: number, out: number): number;
  public_key(secret: number, out: number): number;
}

/** A decrypted coin. */
export interface Coin {
  readonly value: bigint;
  /** 32 bytes. */
  readonly tokenType: Uint8Array;
  /** 32 bytes. */
  readonly nonce: Uint8Array;
}

/** One instance of the kernel. Not shareable across threads; each worker instantiates its own. */
export class Kernel {
  readonly #w: Exports;

  constructor(module: WebAssembly.Module) {
    const imports: WebAssembly.Imports = {};
    for (const imp of WebAssembly.Module.imports(module)) {
      if (imp.kind !== "function") throw new Error(`the scan kernel imports a ${imp.kind}: ${imp.module}.${imp.name}`);
      (imports[imp.module] ??= {})[imp.name] = () => {
        throw new Error(`the scan kernel called an import it should never call: ${imp.module}.${imp.name}`);
      };
    }
    this.#w = new WebAssembly.Instance(module, imports).exports as unknown as Exports;
  }

  /** Runs `body` with buffers allocated in the kernel's memory and released after. */
  #with<T>(sizes: readonly number[], body: (ptrs: number[]) => T): T {
    const ptrs = sizes.map((s) => this.#w.alloc(s));
    try {
      return body(ptrs);
    } finally {
      ptrs.forEach((p, i) => this.#w.dealloc(p, sizes[i]!));
    }
  }

  #put(ptr: number, bytes: Uint8Array): void {
    new Uint8Array(this.#w.memory.buffer).set(bytes, ptr);
  }

  #get(ptr: number, len: number): Uint8Array {
    return new Uint8Array(this.#w.memory.buffer, ptr, len).slice();
  }

  static #check(status: number, what: string): void {
    if (status === -1) throw new Error(`${what}: the secret is not a canonical scalar`);
  }

  /** Tests 36-byte entries (FR-100, FR-103); returns the positions, relative to `entries`, that are the key's. */
  scan(entries: Uint8Array, secret: Uint8Array): number[] {
    const count = entries.length / ENTRY_BYTES;
    if (!Number.isInteger(count)) throw new Error("scan entries must be a whole number of 36-byte entries");
    checkSecret(secret);
    if (count === 0) return [];
    return this.#with([entries.length, 32, count * 4], ([pe, ps, po]) => {
      this.#put(pe!, entries);
      this.#put(ps!, secret);
      const hits = this.#w.scan(pe!, count, ps!, po!);
      Kernel.#check(hits, "scan");
      return Array.from(new Uint32Array(this.#w.memory.buffer, po!, hits));
    });
  }

  /** For each entry, the 32-byte value the ownership test compares (zero for an all-zero entry). */
  scanValues(entries: Uint8Array, secret: Uint8Array): Uint8Array {
    const count = entries.length / ENTRY_BYTES;
    if (!Number.isInteger(count)) throw new Error("scan entries must be a whole number of 36-byte entries");
    checkSecret(secret);
    if (count === 0) return new Uint8Array(0);
    return this.#with([entries.length, 32, count * 32], ([pe, ps, po]) => {
      this.#put(pe!, entries);
      this.#put(ps!, secret);
      Kernel.#check(this.#w.scan_values(pe!, count, ps!, po!), "scan_values");
      return this.#get(po!, count * 32);
    });
  }

  /** The six pads Poseidon(k, i), i = 0 … 5, of a point (6 × 32 bytes), or null if the ledger would reject it. */
  pads(point: Uint8Array, secret: Uint8Array): Uint8Array | null {
    checkLength(point, 32, "point");
    checkSecret(secret);
    return this.#with([32, 32, 192], ([pp, ps, po]) => {
      this.#put(pp!, point);
      this.#put(ps!, secret);
      const status = this.#w.pads(pp!, ps!, po!);
      Kernel.#check(status, "pads");
      return status === 1 ? this.#get(po!, 192) : null;
    });
  }

  /** Poseidon of two field elements (32 bytes little-endian each), or null if either is not canonical. */
  hash2(a: Uint8Array, b: Uint8Array): Uint8Array | null {
    checkLength(a, 32, "a");
    checkLength(b, 32, "b");
    return this.#with([32, 32, 32], ([pa, pb, po]) => {
      this.#put(pa!, a);
      this.#put(pb!, b);
      return this.#w.hash2_raw(pa!, pb!, po!) === 1 ? this.#get(po!, 32) : null;
    });
  }

  /** The ledger's decryption of a 224-byte ciphertext into a coin, or null if it is not for this secret. */
  decryptCoin(ciphertext: Uint8Array, secret: Uint8Array): Coin | null {
    checkLength(ciphertext, CIPHERTEXT_BYTES, "ciphertext");
    checkSecret(secret);
    return this.#with([CIPHERTEXT_BYTES, 32, 1 + COIN_BYTES], ([pc, ps, po]) => {
      this.#put(pc!, ciphertext);
      this.#put(ps!, secret);
      const status = this.#w.decrypt_coin(pc!, ps!, po!);
      Kernel.#check(status, "decrypt_coin");
      if (status !== 1) return null;
      return coinFromBytes(this.#get(po! + 1, COIN_BYTES));
    });
  }

  /** A commitment's tree leaf, `degrade_to_transient(commitment)`, as 32 bytes little-endian. */
  leaf(commitment: Uint8Array): Uint8Array {
    checkLength(commitment, 32, "commitment");
    return this.#with([32, 32], ([pc, po]) => {
      this.#put(pc!, commitment);
      this.#w.leaf(pc!, po!);
      return this.#get(po!, 32);
    });
  }

  /** `coinCommitment(coin, coinPublicKey)`. */
  commitment(coin: Coin, coinPublicKey: Uint8Array): Uint8Array {
    checkLength(coinPublicKey, 32, "coin public key");
    return this.#with([COIN_BYTES, 32, 32], ([pc, pk, po]) => {
      this.#put(pc!, coinToBytes(coin));
      this.#put(pk!, coinPublicKey);
      this.#w.commitment(pc!, pk!, po!);
      return this.#get(po!, 32);
    });
  }

  /** The encryption public key `G × secret`, 32 bytes compressed (the ledger package's `encryptionPublicKey`). */
  publicKey(secret: Uint8Array): Uint8Array {
    checkSecret(secret);
    return this.#with([32, 32], ([ps, po]) => {
      this.#put(ps!, secret);
      Kernel.#check(this.#w.public_key(ps!, po!), "public_key");
      return this.#get(po!, 32);
    });
  }
}

function checkLength(bytes: Uint8Array, length: number, what: string): void {
  if (bytes.length !== length) throw new Error(`${what} must be ${length} bytes, got ${bytes.length}`);
}

function checkSecret(secret: Uint8Array): void {
  checkLength(secret, 32, "secret");
}

/** The kernel's 80-byte coin layout. */
export function coinToBytes(coin: Coin): Uint8Array {
  checkLength(coin.tokenType, 32, "token type");
  checkLength(coin.nonce, 32, "nonce");
  if (coin.value < 0n || coin.value >= 1n << 128n) throw new Error("coin value out of range");
  const out = new Uint8Array(COIN_BYTES);
  let v = coin.value;
  for (let i = 0; i < 16; i++) {
    out[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  out.set(coin.tokenType, 16);
  out.set(coin.nonce, 48);
  return out;
}

export function coinFromBytes(bytes: Uint8Array): Coin {
  checkLength(bytes, COIN_BYTES, "coin");
  let value = 0n;
  for (let i = 15; i >= 0; i--) value = (value << 8n) | BigInt(bytes[i]!);
  return { value, tokenType: bytes.slice(16, 48), nonce: bytes.slice(48, 80) };
}
