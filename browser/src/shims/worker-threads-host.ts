/**
 * `node:worker_threads` for the thread that starts workers — the core worker and the private worker of the browser
 * build: its `Worker` over a dedicated Web Worker (a module worker), so that the ledger worker's host
 * (`src/ledger/worker/host.ts`) runs unchanged in the browser. The worker's `workerData` goes as the first message,
 * which `./worker-threads-worker.ts` reads before the entry runs. Its `SharedArrayBuffer` (the node-store bridge) stays
 * shared, as the page is cross-origin isolated. [LG-10; design §5.3, §9.2]
 *
 * Node.js's events become: `message` each message; `error` an uncaught error of the worker, or a message that could not
 * be read, after which the worker is ended — as an uncaught error ends a Node.js worker thread —; `exit` once, when the
 * worker is ended (`terminate`, or after an `error`). A Web Worker has no exit code of its own: `terminate` resolves
 * with 1, Node.js's code for a terminated thread.
 */

type Listener = (value: never) => void;

export class Worker {
  readonly #web: globalThis.Worker;
  readonly #listeners = new Map<string, Set<{ readonly listener: Listener; readonly once: boolean }>>();
  #ended = false;

  constructor(entry: URL | string, options: { readonly workerData?: unknown } = {}) {
    this.#web = new globalThis.Worker(entry, { type: "module" });
    this.#web.postMessage({ workerData: options.workerData });
    this.#web.addEventListener("message", (event) => this.#emit("message", event.data));
    this.#web.addEventListener("error", (event) => {
      event.preventDefault();
      this.#fail(new Error(event.message === "" ? "the worker failed" : event.message));
    });
    this.#web.addEventListener("messageerror", () => this.#fail(new Error("a message of the worker could not be read")));
  }

  get threadId(): number {
    return this.#ended ? -1 : 1;
  }

  on(event: string, listener: Listener): this {
    return this.#add(event, listener, false);
  }

  once(event: string, listener: Listener): this {
    return this.#add(event, listener, true);
  }

  off(event: string, listener: Listener): this {
    for (const entry of this.#listeners.get(event) ?? []) if (entry.listener === listener) this.#listeners.get(event)?.delete(entry);
    return this;
  }

  postMessage(value: unknown): void {
    if (!this.#ended) this.#web.postMessage(value);
  }

  /** Ends the worker; `exit` follows. */
  terminate(): Promise<number> {
    this.#end();
    return Promise.resolve(1);
  }

  /** Workers of the browser keep no event loop alive: nothing to do. */
  unref(): void {}

  ref(): void {}

  #add(event: string, listener: Listener, once: boolean): this {
    const set = this.#listeners.get(event) ?? new Set();
    set.add({ listener, once });
    this.#listeners.set(event, set);
    return this;
  }

  #emit(event: string, value: unknown): void {
    for (const entry of [...(this.#listeners.get(event) ?? [])]) {
      if (entry.once) this.#listeners.get(event)?.delete(entry);
      (entry.listener as (value: unknown) => void)(value);
    }
  }

  #fail(error: Error): void {
    if (this.#ended) return;
    this.#emit("error", error);
    this.#end();
  }

  #end(): void {
    if (this.#ended) return;
    this.#ended = true;
    this.#web.terminate();
    queueMicrotask(() => this.#emit("exit", 1));
  }
}

export const isMainThread = false;
export const parentPort = null;
export const workerData = null;
