/**
 * SimplePIR's multiplication for the page's client (`../pir/multiply.ts`, `Multiplier`), split by rows across Web
 * Workers the page starts for it (`./call-workers.ts`): what `WorkerMultiplier` does on Node.js worker threads. The wallet's side of a call is two of them: `A × s` for the
 * call's 32 secrets when it is built, and `H × s` when its answer is decoded.
 *
 * The matrix, the vectors and the answers are in `SharedArrayBuffer`s (the page is cross-origin isolated,
 * `./serve.ts`), so no worker copies them; a matrix or vectors not already shared are copied into one per call. The
 * workers (each `multiply-worker.js`) start at the first multiplication, so an IPIR+SP snapshot never starts them.
 */

import type { Layout, Matrix, Multiplier, RangeTask } from "../pir/multiply.ts";
import { type CallWorker, startCallWorker } from "./call-workers.ts";

function shared<T extends Int16Array | Int32Array | Uint32Array>(a: T): T {
  if (a.buffer instanceof SharedArrayBuffer) return a;
  const ctor = a.constructor as new (b: SharedArrayBuffer) => T;
  const copy = new ctor(new SharedArrayBuffer(a.byteLength));
  copy.set(a as never);
  return copy;
}

interface Waiting {
  resolve(): void;
  reject(error: Error): void;
}

export class WebMultiplier implements Multiplier {
  readonly threads: number;
  readonly #workers: CallWorker[] = [];
  readonly #idle: CallWorker[] = [];
  readonly #queue: { task: Omit<RangeTask, "id">; waiting: Waiting }[] = [];
  readonly #pending = new Map<number, Waiting>();
  #nextId = 1;
  #closed = false;
  #broken: Error | undefined;

  /** `threads` workers running `multiply-worker.js`, started at the first multiplication. */
  constructor(threads: number) {
    if (!Number.isInteger(threads) || threads < 1) throw new Error(`thread count must be ≥ 1: ${threads}`);
    this.threads = threads;
  }

  #start(): void {
    for (let i = this.#workers.length; i < this.threads; i++) {
      const worker = startCallWorker("multiply-worker.js");
      worker.port.onmessage = (event: MessageEvent<{ id: number; error?: string }>) => {
        const waiting = this.#pending.get(event.data.id);
        this.#pending.delete(event.data.id);
        this.#idle.push(worker);
        if (event.data.error === undefined) waiting?.resolve();
        else waiting?.reject(new Error(event.data.error));
        this.#pump();
      };
      worker.onFail((error) => this.#fail(error));
      this.#workers.push(worker);
      this.#idle.push(worker);
    }
  }

  /** A worker failed: the multiplier stops and every waiting call fails. */
  #fail(error: Error): void {
    this.#broken ??= new Error(`a multiply worker failed: ${error.message}`);
    for (const waiting of this.#pending.values()) waiting.reject(this.#broken);
    for (const queued of this.#queue) queued.waiting.reject(this.#broken);
    this.#pending.clear();
    this.#queue.length = 0;
    for (const worker of this.#workers) worker.stop();
  }

  #pump(): void {
    while (this.#idle.length > 0 && this.#queue.length > 0) {
      const worker = this.#idle.pop()!;
      const { task, waiting } = this.#queue.shift()!;
      const id = this.#nextId++;
      this.#pending.set(id, waiting);
      worker.port.postMessage({ ...task, id } satisfies RangeTask);
    }
  }

  #run(task: Omit<RangeTask, "id">): Promise<void> {
    return new Promise((resolve, reject) => {
      this.#queue.push({ task, waiting: { resolve, reject } });
      this.#pump();
    });
  }

  async multiply(matrix: Matrix, vectors: Uint32Array, count: number, layout: Layout = "vector-major"): Promise<Uint32Array> {
    if (this.#closed) throw new Error("the multiplier is closed");
    if (this.#broken) throw this.#broken;
    if (matrix.cells.length !== matrix.rows * matrix.cols) throw new Error("matrix cells do not match its shape");
    if (!Number.isInteger(count) || count < 1) throw new Error(`vector count must be ≥ 1: ${count}`);
    if (vectors.length !== count * matrix.cols) {
      throw new Error(`expected ${count} vectors of ${matrix.cols} values (${count * matrix.cols}), got ${vectors.length}`);
    }
    this.#start();
    const cells = shared(matrix.cells);
    const sharedVectors = shared(vectors);
    const vec = new Int32Array(sharedVectors.buffer, sharedVectors.byteOffset, sharedVectors.length);
    const out = new Int32Array(new SharedArrayBuffer(matrix.rows * count * 4));
    // Ranges of whole 4-row blocks, about four per thread, handed out as workers become free.
    const blocks = Math.ceil(matrix.rows / 4);
    const ranges = Math.max(1, Math.min(blocks, this.threads * 4));
    const per = Math.ceil(blocks / ranges);
    const tasks: Promise<void>[] = [];
    for (let b = 0; b < blocks; b += per) {
      tasks.push(this.#run({ rows: matrix.rows, cols: matrix.cols, cells, vectors: vec, count, out, layout, rowStart: b * 4, rowEnd: Math.min(matrix.rows, (b + per) * 4) }));
    }
    await Promise.all(tasks);
    return new Uint32Array(out.buffer);
  }

  async close(): Promise<void> {
    this.#closed = true;
    for (const worker of this.#workers) worker.stop();
  }
}
