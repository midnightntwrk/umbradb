/**
 * A wallet's IPIR+SP requests on several worker threads. Platform-neutral: the workers come from a `spawn` function
 * (`./pool-node.ts` gives `worker_threads`, the page's worker gives Web Workers), and each runs `./pool-worker.ts`.
 *
 * A request costs the wallet about 8 ms (11 ms for the largest tables) and a call has one per group asked for (32 by
 * default); the requests are independent, so the pool deals them out: request `q` of a call goes to worker
 * `q mod threads`.
 *
 * - **One instance per worker.** Each worker instantiates the same compiled module, opens every table on it and
 *   draws its requests' secrets from its own `crypto.getRandomValues`. A request's state stays in the worker that
 *   made it, so that worker decodes its answer; the wanted requests of a call come first and so are spread over the
 *   workers too.
 * - **What the server sees is unchanged:** the same requests in the same order, each under its own fresh secret.
 * - **The random source.** An instance refuses a draw equal to its previous one. Draws in different workers are not
 *   compared there, so the pool refuses a call in which two requests carry the same key (`checkDistinctKeys`).
 * - **Erasing.** Freeing a call or a table posts the same to the workers; `close` has each worker free what is left
 *   before it is stopped.
 * - **Failures.** A worker that reports an error fails that call. A worker thread that dies fails every waiting and
 *   later call.
 *
 * The workers start at the first `engine` call, so a wallet that only meets SimplePIR snapshots never starts them.
 */

import { checkDistinctKeys, type IpirEngine, type IpirEngineCall, type IpirEngineTable, type IpirWorkers } from "./engine.ts";
import type { IpirReply, IpirTask } from "./pool-worker.ts";
import { ipirSizes, type IpirSizes } from "./sizes.ts";
import type { IpirTableParams } from "./wallet.ts";

/** One worker, as the pool talks to it. */
export interface IpirPort {
  post(task: IpirTask, transfer: ArrayBuffer[]): void;
  /** Called once, before any `post`. */
  listen(onReply: (reply: IpirReply) => void, onError: (error: Error) => void): void;
  /** Whether the worker has work waiting: in Node a worker with work keeps the process alive, an idle one does not. */
  busy(busy: boolean): void;
  terminate(): Promise<void>;
}

/** A task without its `id`, which the pool assigns. */
type TaskBody = IpirTask extends infer T ? (T extends IpirTask ? Omit<T, "id"> : never) : never;

interface Waiting {
  readonly worker: number;
  resolve(reply: IpirReply): void;
  reject(error: Error): void;
}

export class IpirPool implements IpirWorkers {
  readonly threads: number;
  readonly #spawn: () => IpirPort;
  readonly #ports: IpirPort[] = [];
  /** Tasks posted to each worker and not yet answered. */
  readonly #load: number[] = [];
  readonly #waiting = new Map<number, Waiting>();
  #started: Promise<void> | null = null;
  #nextId = 1;
  /** Table and call numbers, unique in the pool. */
  #nextNumber = 1;
  #broken: Error | undefined;
  #closed = false;

  /** `threads` workers, each from one call of `spawn`, started at the first {@link engine}. */
  constructor(threads: number, spawn: () => IpirPort) {
    if (!Number.isInteger(threads) || threads < 1) throw new Error(`thread count must be ≥ 1: ${threads}`);
    this.threads = threads;
    this.#spawn = spawn;
  }

  async engine(module: WebAssembly.Module): Promise<IpirEngine> {
    if (this.#closed) throw new Error("the IPIR+SP workers are closed");
    this.#started ??= this.#start(module);
    await this.#started;
    return { threads: this.threads, openTable: (params) => this.#openTable(params) };
  }

  async close(): Promise<void> {
    if (this.#closed) return;
    this.#closed = true;
    if (this.#started === null) return;
    // Each worker erases what it still holds; one that cannot answer is stopped all the same.
    await this.#started.then(() => Promise.all(this.#ports.map((_, w) => this.#send(w, { op: "close" })))).catch(() => undefined);
    await Promise.all(this.#ports.map((port) => port.terminate()));
  }

  async #start(module: WebAssembly.Module): Promise<void> {
    try {
      for (let w = 0; w < this.threads; w++) {
        const port = this.#spawn();
        port.listen(
          (reply) => this.#done(reply),
          (error) => this.#fail(error),
        );
        this.#ports.push(port);
        this.#load.push(0);
      }
      await Promise.all(this.#ports.map((_, w) => this.#send(w, { op: "init", module })));
    } catch (error) {
      this.#fail(error instanceof Error ? error : new Error(String(error)));
      throw this.#broken ?? error;
    }
  }

  #send(worker: number, body: TaskBody, transfer: ArrayBuffer[] = []): Promise<IpirReply> {
    if (this.#broken !== undefined) return Promise.reject(this.#broken);
    return new Promise((resolve, reject) => {
      const id = this.#nextId++;
      this.#waiting.set(id, { worker, resolve, reject });
      const port = this.#ports[worker]!;
      if (this.#load[worker]!++ === 0) port.busy(true);
      port.post({ ...body, id } as IpirTask, transfer);
    });
  }

  /** Posts a task whose outcome nothing waits for (a free). */
  #post(workers: readonly number[], body: TaskBody): void {
    for (const w of workers) void this.#send(w, body).catch(() => undefined);
  }

  #done(reply: IpirReply): void {
    const waiting = this.#waiting.get(reply.id);
    if (waiting === undefined) return;
    this.#waiting.delete(reply.id);
    if (--this.#load[waiting.worker]! === 0) this.#ports[waiting.worker]!.busy(false);
    if (reply.error === undefined) waiting.resolve(reply);
    else waiting.reject(new Error(reply.error));
  }

  /** A worker thread died, or the workers could not start: every waiting and later call fails. */
  #fail(error: Error): void {
    if (this.#broken !== undefined || this.#closed) return;
    this.#broken = new Error(`an IPIR+SP worker failed: ${error.message}`);
    for (const waiting of this.#waiting.values()) waiting.reject(this.#broken);
    this.#waiting.clear();
    for (const port of this.#ports) void port.terminate();
  }

  get #all(): number[] {
    return this.#ports.map((_, w) => w);
  }

  async #openTable(params: IpirTableParams): Promise<IpirEngineTable> {
    const sizes = ipirSizes(params.rows, params.cols);
    const table = this.#nextNumber++;
    try {
      await Promise.all(this.#all.map((w) => this.#send(w, { op: "open", table, params })));
    } catch (error) {
      this.#post(this.#all, { op: "free-table", table });
      throw error;
    }
    let freed = false;
    return {
      sizes,
      call: (rows) => {
        if (freed) return Promise.reject(new Error("this IPIR+SP table was freed"));
        return this.#call(table, sizes, params.cols, rows);
      },
      free: () => {
        if (freed) return;
        freed = true;
        this.#post(this.#all, { op: "free-table", table });
      },
    };
  }

  async #call(table: number, sizes: IpirSizes, cols: number, rows: readonly number[]): Promise<IpirEngineCall> {
    const { requestBytes, responseBytes } = sizes;
    const count = rows.length;
    const call = this.#nextNumber++;
    // Request q goes to worker q mod threads; `parts[w]` lists a worker's requests in order.
    const parts: number[][] = this.#ports.map(() => []);
    for (let q = 0; q < count; q++) parts[q % parts.length]!.push(q);
    const used = this.#all.filter((w) => parts[w]!.length > 0);
    let freed = false;
    const free = (): void => {
      if (freed) return;
      freed = true;
      this.#post(used, { op: "free-call", call });
    };
    try {
      const replies = await Promise.all(used.map((w) => this.#send(w, { op: "call", table, call, rows: parts[w]!.map((q) => rows[q]!) })));
      const requests = new Uint8Array(count * requestBytes);
      used.forEach((w, i) => {
        const bytes = replies[i]!.requests;
        if (bytes === undefined || bytes.length !== parts[w]!.length * requestBytes) throw new Error("an IPIR+SP worker's requests have the wrong length");
        parts[w]!.forEach((q, k) => requests.set(bytes.subarray(k * requestBytes, (k + 1) * requestBytes), q * requestBytes));
      });
      checkDistinctKeys(requests, count, requestBytes);
      return {
        requests,
        decode: async (responses, wanted) => {
          if (freed) throw new Error("this IPIR+SP call was freed");
          if (!Number.isSafeInteger(wanted) || wanted < 0 || wanted > count) throw new Error(`wanted ${wanted} of ${count} requests`);
          if (responses.length !== count * responseBytes) throw new Error(`an answer to ${count} requests is ${count * responseBytes} bytes, got ${responses.length}`);
          const out = new Array<Uint16Array>(wanted);
          await Promise.all(
            used.map(async (w) => {
              // A worker's wanted requests are its first ones.
              const mine = parts[w]!.filter((q) => q < wanted);
              if (mine.length === 0) return;
              const answers = new Uint8Array(mine.length * responseBytes);
              mine.forEach((q, k) => answers.set(responses.subarray(q * responseBytes, (q + 1) * responseBytes), k * responseBytes));
              const { cells } = await this.#send(w, { op: "decode", call, responses: answers, wanted: mine.length }, [answers.buffer]);
              if (cells === undefined || cells.length !== mine.length * cols) throw new Error("an IPIR+SP worker's cells have the wrong length");
              mine.forEach((q, k) => (out[q] = cells.subarray(k * cols, (k + 1) * cols)));
            }),
          );
          return out;
        },
        free,
      };
    } catch (error) {
      free();
      throw error;
    }
  }
}
