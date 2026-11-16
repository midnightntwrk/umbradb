/**
 * A call's IPIR+SP requests and the decoding of its answer, on one thread or on several. Platform-neutral: no `node:`
 * import.
 *
 * - {@link IpirLocal} is one instance of the wallet's WebAssembly (`./wallet.ts`) seen as tables and calls. A call is
 *   one request per row asked for, each with its own fresh secret; its states stay in the instance until the call is
 *   freed. Everything is synchronous. A worker of the pool (`./pool-worker.ts`) runs one.
 * - {@link IpirEngine} is the same, asynchronous, as the scheme uses it (`../pir/ipir-sp-wallet.ts`):
 *   {@link inlineIpirEngine} runs an `IpirLocal` on the calling thread; the pool's (`./pool.ts`) deals a call's
 *   requests to its workers.
 *
 * Secrets: a request's state is erased only by freeing its call. A table's `free` frees every call of it not yet
 * freed, so a call whose answer never came is erased when its table is closed.
 */

import { IPIR_HEADER_BYTES, IPIR_KEY_BYTES, type IpirSizes } from "./sizes.ts";
import { IpirWallet, type IpirRequestState, type IpirTableClient, type IpirTableParams } from "./wallet.ts";

/** A call on one instance: its requests' bytes and the states that decode their answers. */
export class IpirLocalCall {
  /** One request per row asked for, in order: `count × requestBytes` bytes. */
  readonly requests: Uint8Array;
  readonly count: number;
  readonly #table: IpirLocalTable;
  readonly #client: IpirTableClient;
  #states: IpirRequestState[];

  /** Use {@link IpirLocalTable.call}. */
  constructor(table: IpirLocalTable, client: IpirTableClient, rows: readonly number[]) {
    const { requestBytes } = client.sizes;
    this.#table = table;
    this.#client = client;
    this.count = rows.length;
    this.requests = new Uint8Array(rows.length * requestBytes);
    this.#states = [];
    try {
      rows.forEach((row, q) => {
        const request = client.request(row);
        this.#states.push(request.state);
        this.requests.set(request.bytes, q * requestBytes);
      });
    } catch (error) {
      this.#erase();
      throw error;
    }
  }

  /**
   * The cells of the rows of the first `wanted` requests, from their answers (`wanted × responseBytes` bytes or
   * more), as one array of `wanted × cols` cells.
   */
  decode(responses: Uint8Array, wanted: number): Uint16Array {
    const { responseBytes } = this.#client.sizes;
    const { cols } = this.#client;
    if (!Number.isSafeInteger(wanted) || wanted < 0 || wanted > this.count) throw new Error(`wanted ${wanted} of ${this.count} requests`);
    if (this.#states.length !== this.count) throw new Error("this IPIR+SP call was freed");
    if (responses.length < wanted * responseBytes) throw new Error(`answers to ${wanted} requests are ${wanted * responseBytes} bytes, got ${responses.length}`);
    const cells = new Uint16Array(wanted * cols);
    for (let q = 0; q < wanted; q++) {
      cells.set(this.#client.decode(this.#states[q]!, responses.subarray(q * responseBytes, (q + 1) * responseBytes)), q * cols);
    }
    return cells;
  }

  /** Erases every request's state. Idempotent. */
  free(): void {
    this.#table.forget(this);
    this.#erase();
  }

  #erase(): void {
    const states = this.#states;
    this.#states = [];
    for (const state of states) state.free();
  }
}

/** A table on one instance. */
export class IpirLocalTable {
  readonly sizes: IpirSizes;
  readonly cols: number;
  readonly #client: IpirTableClient;
  readonly #live = new Set<IpirLocalCall>();
  #freed = false;

  /** Use {@link IpirLocal.openTable}. */
  constructor(client: IpirTableClient) {
    this.#client = client;
    this.sizes = client.sizes;
    this.cols = client.cols;
  }

  /** One request per row, in order, each with a fresh secret. */
  call(rows: readonly number[]): IpirLocalCall {
    if (this.#freed) throw new Error("this IPIR+SP table was freed");
    const call = new IpirLocalCall(this, this.#client, rows);
    this.#live.add(call);
    return call;
  }

  /** A freed call is no longer this table's to free. */
  forget(call: IpirLocalCall): void {
    this.#live.delete(call);
  }

  /** Frees every call not yet freed, then the table's setup and masks. Idempotent. */
  free(): void {
    if (this.#freed) return;
    this.#freed = true;
    for (const call of [...this.#live]) call.free();
    this.#client.free();
  }
}

/** One instance of the wallet's WebAssembly, as tables and calls. */
export class IpirLocal {
  readonly #wallet: IpirWallet;

  constructor(module: WebAssembly.Module) {
    this.#wallet = new IpirWallet(module);
  }

  /** Expands the table's setup and loads its masks; throws if the masks are not this setup's. */
  openTable(params: IpirTableParams): IpirLocalTable {
    return new IpirLocalTable(this.#wallet.openTable(params));
  }
}

/** A call as the scheme uses it. */
export interface IpirEngineCall {
  /** One request per row asked for, in order: `count × requestBytes` bytes. */
  readonly requests: Uint8Array;
  /** The cells of the rows of the first `wanted` requests, from the call's answers (`count × responseBytes` bytes). */
  decode(responses: Uint8Array, wanted: number): Promise<Uint16Array[]>;
  /** Erases every request's state. Idempotent. */
  free(): void;
}

/** A table as the scheme uses it. */
export interface IpirEngineTable {
  readonly sizes: IpirSizes;
  /** One request per row, in order, each with its own fresh secret. */
  call(rows: readonly number[]): Promise<IpirEngineCall>;
  /** Frees the table and the state of every call of it not yet freed. Idempotent. */
  free(): void;
}

/** What makes a wallet's IPIR+SP requests and decodes their answers. */
export interface IpirEngine {
  /** Threads a call's requests are made on. */
  readonly threads: number;
  /** Expands the table's setup and loads its masks; rejects if the masks are not this setup's. */
  openTable(params: IpirTableParams): Promise<IpirEngineTable>;
}

/**
 * Worker threads that make a wallet's IPIR+SP requests (`./pool.ts`): given to the scheme as
 * `WalletSchemeOptions.ipirWorkers`, and closed by whoever made them.
 */
export interface IpirWorkers {
  readonly threads: number;
  /**
   * Starts the workers on `module` (the first call; later calls use the workers already started, whose module is the
   * same checked file) and gives the engine over them.
   */
  engine(module: WebAssembly.Module): Promise<IpirEngine>;
  /** Erases what the workers still hold and stops them. */
  close(): Promise<void>;
}

/** Cuts `count × cols` cells into one array per request. */
export function splitCells(cells: Uint16Array, count: number, cols: number): Uint16Array[] {
  return Array.from({ length: count }, (_, q) => cells.subarray(q * cols, (q + 1) * cols));
}

/** The engine on the calling thread: one instance, one request after the other. */
export function inlineIpirEngine(module: WebAssembly.Module): IpirEngine {
  const local = new IpirLocal(module);
  return {
    threads: 1,
    async openTable(params) {
      const table = local.openTable(params);
      return {
        sizes: table.sizes,
        async call(rows) {
          const call = table.call(rows);
          return {
            requests: call.requests,
            async decode(responses, wanted) {
              return splitCells(call.decode(responses, wanted), wanted, table.cols);
            },
            free: () => call.free(),
          };
        },
        free: () => table.free(),
      };
    },
  };
}

/**
 * Throws when two of a call's `count` requests carry the same key. Each request's key comes from its own fresh secret,
 * so two equal keys mean the platform's random source gave the same bytes twice. Inside one instance the WebAssembly
 * refuses such a draw itself; this covers requests made in different instances (the pool's workers).
 */
export function checkDistinctKeys(requests: Uint8Array, count: number, requestBytes: number): void {
  const seen = new Map<string, number[]>();
  const key = (q: number): Uint8Array => requests.subarray(q * requestBytes + IPIR_HEADER_BYTES, q * requestBytes + IPIR_HEADER_BYTES + IPIR_KEY_BYTES);
  for (let q = 0; q < count; q++) {
    const bytes = key(q);
    // The key's last 32 bytes pick the candidates; a whole-key comparison decides.
    const tail = String.fromCharCode(...bytes.subarray(bytes.length - 32));
    const candidates = seen.get(tail) ?? [];
    for (const other of candidates) {
      const theirs = key(other);
      if (bytes.every((b, i) => b === theirs[i])) {
        throw new Error(`requests ${other} and ${q} of one IPIR+SP call carry the same key: the random source repeated itself`);
      }
    }
    candidates.push(q);
    seen.set(tail, candidates);
  }
}
