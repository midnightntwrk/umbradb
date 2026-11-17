/**
 * The IPIR+SP wallet side over `pss-ipir.wasm` (built by `build.sh wasm` from `wasm/`, committed with its SHA-256).
 * Platform-neutral: no `node:` imports, so it runs under Node 24 and in a browser Web Worker alike.
 *
 * It takes a compiled `WebAssembly.Module` and checks nothing about it itself: the caller checks the file's digest
 * before compiling (in Node, `compileIpirWasm` in `wallet-node.ts`; in a page, against the digest injected at build;
 * spec FR-031). The module's one import, `env.fill_random`, is answered from `globalThis.crypto.getRandomValues`,
 * and every request draws a fresh secret through it (FR-032).
 *
 * Interface:
 *
 * - `ipirSizes(rows, cols)` and the other pure size functions of `sizes.ts`, re-exported.
 * - `new IpirWallet(module)`: one instance of the module; it holds any number of table clients.
 * - `wallet.openTable({ rows, cols, seed, snapshot, masks }) → IpirTableClient`: expands the table's public setup
 *   from its shape, 32-byte seed and 32-byte snapshot digest, and loads its published masks (`ipirMasksBytes(cols)`
 *   bytes). Throws if the masks are not this setup's.
 * - `client.request(row) → { bytes, state }`: a request for `row` (`ipirRequestBytes(rows)` bytes) with a fresh secret;
 *   `state` is opaque and decodes the answer to exactly this request.
 * - `client.decode(state, answer) → Uint16Array`: the row's `cols` cells from its answer (`ipirResponseBytes(cols)`
 *   bytes).
 * - `state.free()`, `client.free()`: release their WebAssembly memory (idempotent).
 *
 * A trap inside the module (a panic aborts) or a failing random source leaves the instance unusable: every later
 * call on that wallet throws, and a new `IpirWallet` must be made.
 */

import { checkIpirShape, ipirSizes, type IpirSizes } from "./sizes.ts";

export {
  checkIpirShape,
  IPIR_RING,
  ipirMasksBytes,
  ipirRequestBytes,
  ipirResponseBytes,
  ipirSizes,
  type IpirSizes,
} from "./sizes.ts";

interface Exports {
  memory: WebAssembly.Memory;
  alloc(len: number): number;
  dealloc(ptr: number, len: number): void;
  request_bytes(rows: number): number;
  response_bytes(cols: number): number;
  masks_bytes(cols: number): number;
  client_new(rows: number, cols: number, seed: number, snapshot: number, masks: number, masksLen: number): number;
  client_free(client: number): void;
  request_new(client: number, row: number, out: number, outLen: number): number;
  request_free(state: number): void;
  decode(client: number, state: number, answer: number, answerLen: number, out: number, outLen: number): number;
  error_ptr(): number;
  error_len(): number;
}

/** `crypto.getRandomValues` fills at most 65,536 bytes per call. */
const RANDOM_CHUNK = 65_536;

/** A failure the module reported (a bad input, masks of another setup, …); the instance stays usable. */
class IpirCallError extends Error {}

/** One instance of the module, shared by a wallet and its table clients. */
class Instance {
  readonly w: Exports;
  #broken: string | undefined;

  constructor(module: WebAssembly.Module) {
    const imports = WebAssembly.Module.imports(module);
    const only = imports[0];
    if (imports.length !== 1 || only?.module !== "env" || only.name !== "fill_random" || only.kind !== "function") {
      const list = imports.map((i) => `${i.module}.${i.name} (${i.kind})`).join(", ");
      throw new Error(`the IPIR+SP WebAssembly must import only env.fill_random, it imports: ${list}`);
    }
    const random = globalThis.crypto;
    if (typeof random?.getRandomValues !== "function") {
      throw new Error("the IPIR+SP wallet needs crypto.getRandomValues, which this platform does not provide");
    }
    let exports: Exports | undefined;
    const fill_random = (ptr: number, len: number): void => {
      if (exports === undefined) throw new Error("the IPIR+SP WebAssembly asked for randomness while starting");
      for (let at = 0; at < len >>> 0; at += RANDOM_CHUNK) {
        const n = Math.min(RANDOM_CHUNK, (len >>> 0) - at);
        random.getRandomValues(new Uint8Array(exports.memory.buffer, (ptr >>> 0) + at, n));
      }
    };
    exports = new WebAssembly.Instance(module, { env: { fill_random } }).exports as unknown as Exports;
    this.w = exports;
  }

  /**
   * Runs one call into the module. A failure the module reported passes through; anything else (a trap, a thrown
   * import) leaves the instance refusing every later call.
   */
  call<T>(body: () => T): T {
    if (this.#broken !== undefined) {
      throw new Error(`this IPIR+SP wallet can no longer be used: an earlier call failed (${this.#broken})`);
    }
    try {
      return body();
    } catch (error) {
      if (error instanceof IpirCallError) throw error;
      this.#broken = error instanceof Error ? error.message : String(error);
      throw new Error(`the IPIR+SP WebAssembly failed (${this.#broken}); make a new IpirWallet`, { cause: error });
    }
  }

  /** A reported failure, with the module's message for it. */
  failure(what: string): IpirCallError {
    const len = this.w.error_len() >>> 0;
    const message = new TextDecoder().decode(new Uint8Array(this.w.memory.buffer, this.w.error_ptr() >>> 0, len).slice());
    return new IpirCallError(`${what}: ${message}`);
  }

  /** Runs `body` with allocations of the given sizes, released after it returns or reports a failure. */
  with<T>(sizes: readonly number[], body: (ptrs: number[]) => T): T {
    return this.call(() => {
      const ptrs: number[] = [];
      let release = false;
      try {
        for (const size of sizes) ptrs.push(this.w.alloc(size) >>> 0);
        const result = body(ptrs);
        release = true;
        return result;
      } catch (error) {
        release = error instanceof IpirCallError;
        throw error;
      } finally {
        // After a trap the module's state is unknown; its memory is not touched again.
        if (release) ptrs.forEach((ptr, i) => this.w.dealloc(ptr, sizes[i]!));
      }
    });
  }
}

/** Which table parameters a wallet opens a table client from. */
export interface IpirTableParams {
  readonly rows: number;
  readonly cols: number;
  /** The table's public seed, 32 bytes. */
  readonly seed: Uint8Array;
  /** The snapshot's digest, 32 bytes. */
  readonly snapshot: Uint8Array;
  /** The table's published masks. */
  readonly masks: Uint8Array;
}

/** The private state of one request. Opaque: it decodes the answer to that request, through the client that made it. */
export interface IpirRequestState {
  /** Releases the request's state (its secret) in the module's memory. Idempotent. */
  free(): void;
}

/** A request: the bytes to send and the state that decodes their answer. */
export interface IpirRequest {
  readonly bytes: Uint8Array;
  readonly state: IpirRequestState;
}

interface StateSlot {
  ptr: number;
  readonly client: IpirTableClient;
}

const slots = new WeakMap<IpirRequestState, StateSlot>();

/** The wallet: one instance of the IPIR+SP WebAssembly. */
export class IpirWallet {
  readonly #instance: Instance;

  constructor(module: WebAssembly.Module) {
    this.#instance = new Instance(module);
  }

  /** Opens a table: expands its setup and loads its published masks. */
  openTable(params: IpirTableParams): IpirTableClient {
    return new IpirTableClient(this.#instance, params);
  }

  /** The module's own byte lengths for a shape (equal to {@link ipirSizes}; kept for checks). */
  moduleSizes(rows: number, cols: number): { requestBytes: number; responseBytes: number; masksBytes: number } {
    const w = this.#instance.w;
    return this.#instance.call(() => ({
      requestBytes: w.request_bytes(rows),
      responseBytes: w.response_bytes(cols),
      masksBytes: w.masks_bytes(cols),
    }));
  }
}

/** A wallet's client of one table. */
export class IpirTableClient {
  readonly rows: number;
  readonly cols: number;
  readonly sizes: IpirSizes;
  readonly #instance: Instance;
  #ptr: number;

  /** Use {@link IpirWallet.openTable}. */
  constructor(instance: Instance, params: IpirTableParams) {
    const { rows, cols, seed, snapshot, masks } = params;
    checkIpirShape(rows, cols);
    if (seed.length !== 32) throw new Error(`the seed must be 32 bytes, got ${seed.length}`);
    if (snapshot.length !== 32) throw new Error(`the snapshot digest must be 32 bytes, got ${snapshot.length}`);
    this.rows = rows;
    this.cols = cols;
    this.sizes = ipirSizes(rows, cols);
    if (masks.length !== this.sizes.masksBytes) {
      throw new Error(`this table's masks are ${this.sizes.masksBytes} bytes, got ${masks.length}`);
    }
    this.#instance = instance;
    const w = instance.w;
    this.#ptr = instance.with([32, 32, masks.length], ([ps, pn, pm]) => {
      const memory = new Uint8Array(w.memory.buffer);
      memory.set(seed, ps!);
      memory.set(snapshot, pn!);
      memory.set(masks, pm!);
      const client = w.client_new(rows, cols, ps!, pn!, pm!, masks.length) >>> 0;
      if (client === 0) throw instance.failure("cannot open the IPIR+SP table");
      return client;
    });
  }

  /** Makes a request for `row` with a fresh secret. */
  request(row: number): IpirRequest {
    const client = this.#live();
    if (!Number.isSafeInteger(row) || row < 0 || row >= this.rows) {
      throw new Error(`row ${row} is outside a table of ${this.rows} rows`);
    }
    const w = this.#instance.w;
    const length = this.sizes.requestBytes;
    const { ptr, bytes } = this.#instance.with([length], ([out]) => {
      const ptr = w.request_new(client, row, out!, length) >>> 0;
      if (ptr === 0) throw this.#instance.failure("cannot make an IPIR+SP request");
      return { ptr, bytes: new Uint8Array(w.memory.buffer, out!, length).slice() };
    });
    const slot: StateSlot = { ptr, client: this };
    const state: IpirRequestState = {
      free: () => {
        if (slot.ptr === 0) return;
        const freed = slot.ptr;
        slot.ptr = 0;
        this.#instance.call(() => w.request_free(freed));
      },
    };
    slots.set(state, slot);
    return { bytes, state };
  }

  /** Decodes the answer to `state`'s request into the row's `cols` cells. */
  decode(state: IpirRequestState, answer: Uint8Array): Uint16Array {
    const client = this.#live();
    const slot = slots.get(state);
    if (slot === undefined || slot.client !== this) throw new Error("this request state was not made by this table client");
    if (slot.ptr === 0) throw new Error("this request state was freed");
    if (answer.length !== this.sizes.responseBytes) {
      throw new Error(`an answer from this table is ${this.sizes.responseBytes} bytes, got ${answer.length}`);
    }
    const w = this.#instance.w;
    const outLen = 2 * this.cols;
    return this.#instance.with([answer.length, outLen], ([pa, po]) => {
      new Uint8Array(w.memory.buffer).set(answer, pa!);
      if (w.decode(client, slot.ptr, pa!, answer.length, po!, outLen) !== 0) {
        throw this.#instance.failure("cannot decode the IPIR+SP answer");
      }
      const view = new DataView(w.memory.buffer, po!, outLen);
      const cells = new Uint16Array(this.cols);
      for (let i = 0; i < cells.length; i++) cells[i] = view.getUint16(2 * i, true);
      return cells;
    });
  }

  /** Releases the client's setup and masks in the module's memory. Idempotent. */
  free(): void {
    if (this.#ptr === 0) return;
    const freed = this.#ptr;
    this.#ptr = 0;
    this.#instance.call(() => this.#instance.w.client_free(freed));
  }

  #live(): number {
    if (this.#ptr === 0) throw new Error("this IPIR+SP table client was freed");
    return this.#ptr;
  }
}
