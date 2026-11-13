/**
 * The PIR multiplication behind one interface (spec FR-066): `multiply(matrix, vectors) → answers`, the server's answer
 * (`grid × query`, FR-056) and its setup data (`grid × A`, FR-054, 1,024 vectors), and the client's `A × s` and
 * `H × s`. The required implementation splits the matrix's rows across `worker_threads`; the matrix, vectors and
 * answers live in `SharedArrayBuffer`s, so no worker copies them.
 */

import { availableParallelism } from "node:os";
import { Worker } from "node:worker_threads";
import { multiplyRows16, multiplyRows32, type OutLayout } from "./multiply-core.ts";

/** A row-major matrix: a grid (16-bit cells) or a 32-bit matrix (A, H). */
export interface Matrix {
  readonly rows: number;
  readonly cols: number;
  readonly cells: Int16Array | Int32Array;
}

/**
 * Where the answers go: `vector-major` gives `count × rows` (the wire layout of an answer); `row-major` gives
 * `rows × count` (the layout of the setup data H).
 */
export type Layout = "vector-major" | "row-major";

export interface Multiplier {
  /**
   * `answers[v][r] = Σ_c matrix[r][c] · vectors[v][c] mod 2^32`, for `count` vectors given vector-major
   * (`count × cols`). One pass over the matrix serves every vector.
   */
  multiply(matrix: Matrix, vectors: Uint32Array, count: number, layout?: Layout): Promise<Uint32Array>;
  /** Stops any threads. */
  close(): Promise<void>;
}

function outLayout(layout: Layout, rows: number, count: number): OutLayout {
  return layout === "vector-major" ? { rowStride: 1, vecStride: rows } : { rowStride: count, vecStride: 1 };
}

function check(matrix: Matrix, vectors: Uint32Array, count: number): void {
  if (matrix.cells.length !== matrix.rows * matrix.cols) throw new Error("matrix cells do not match its shape");
  if (!Number.isInteger(count) || count < 1) throw new Error(`vector count must be ≥ 1: ${count}`);
  if (vectors.length !== count * matrix.cols) {
    throw new Error(`expected ${count} vectors of ${matrix.cols} values (${count * matrix.cols}), got ${vectors.length}`);
  }
}

function asInt32(a: Uint32Array): Int32Array {
  return new Int32Array(a.buffer, a.byteOffset, a.length);
}

/** Runs the rows `[rowStart, rowEnd)` of one multiplication on the calling thread. */
export function multiplyRange(
  matrix: Matrix,
  vectors: Int32Array,
  count: number,
  out: Int32Array,
  layout: Layout,
  rowStart: number,
  rowEnd: number,
): void {
  const l = outLayout(layout, matrix.rows, count);
  if (matrix.cells instanceof Int16Array) {
    multiplyRows16(matrix.cells, matrix.cols, rowStart, rowEnd, vectors, count, out, l);
  } else {
    multiplyRows32(matrix.cells, matrix.cols, rowStart, rowEnd, vectors, count, out, l);
  }
}

/** The multiplication on the calling thread: for tests, small tables and the client's own steps. */
export const inlineMultiplier: Multiplier = {
  async multiply(matrix, vectors, count, layout = "vector-major") {
    check(matrix, vectors, count);
    const out = new Uint32Array(matrix.rows * count);
    multiplyRange(matrix, asInt32(vectors), count, asInt32(out), layout, 0, matrix.rows);
    return out;
  },
  async close() {},
};

/** A message to a worker: one range of rows of one multiplication. */
export interface RangeTask {
  readonly id: number;
  readonly rows: number;
  readonly cols: number;
  readonly cells: Int16Array | Int32Array;
  readonly vectors: Int32Array;
  readonly count: number;
  readonly out: Int32Array;
  readonly layout: Layout;
  readonly rowStart: number;
  readonly rowEnd: number;
}

function isShared(a: ArrayBufferView): boolean {
  return a.buffer instanceof SharedArrayBuffer;
}

function shared<T extends Int16Array | Int32Array | Uint32Array>(a: T): T {
  if (isShared(a)) return a;
  const ctor = a.constructor as new (b: SharedArrayBuffer) => T;
  const copy = new ctor(new SharedArrayBuffer(a.byteLength));
  copy.set(a as never);
  return copy;
}

/**
 * The multiplication split by rows across worker threads (FR-066). A matrix not already in a `SharedArrayBuffer` is
 * copied into one per call; build grids and setup data in shared memory to avoid that.
 */
export class WorkerMultiplier implements Multiplier {
  readonly threads: number;
  readonly #workers: Worker[] = [];
  readonly #idle: Worker[] = [];
  readonly #queue: { task: Omit<RangeTask, "id">; resolve: () => void; reject: (e: Error) => void }[] = [];
  readonly #pending = new Map<number, { resolve: () => void; reject: (e: Error) => void; worker: Worker }>();
  #nextId = 1;
  #closed = false;
  #broken: Error | undefined;

  constructor(threads: number = Math.max(1, availableParallelism() - 1)) {
    if (!Number.isInteger(threads) || threads < 1) throw new Error(`thread count must be ≥ 1: ${threads}`);
    this.threads = threads;
    for (let i = 0; i < threads; i++) {
      const worker = new Worker(new URL("./multiply-worker.ts", import.meta.url));
      worker.unref();
      worker.on("message", (msg: { id: number; error?: string }) => this.#done(worker, msg));
      worker.on("error", (err: unknown) => this.#fail(worker, err instanceof Error ? err : new Error(String(err))));
      this.#workers.push(worker);
      this.#idle.push(worker);
    }
  }

  #done(worker: Worker, msg: { id: number; error?: string }): void {
    const p = this.#pending.get(msg.id);
    this.#pending.delete(msg.id);
    worker.unref();
    this.#idle.push(worker);
    if (p) {
      if (msg.error) p.reject(new Error(msg.error));
      else p.resolve();
    }
    this.#pump();
  }

  /** A worker thread failed (it has exited): the multiplier stops and every waiting call fails. */
  #fail(worker: Worker, err: Error): void {
    this.#broken ??= new Error(`a multiply worker failed: ${err.message}`);
    for (const p of this.#pending.values()) p.reject(this.#broken);
    for (const q of this.#queue) q.reject(this.#broken);
    this.#pending.clear();
    this.#queue.length = 0;
    for (const w of this.#workers) if (w !== worker) void w.terminate();
  }

  #pump(): void {
    while (this.#idle.length > 0 && this.#queue.length > 0) {
      const worker = this.#idle.pop()!;
      const { task, resolve, reject } = this.#queue.shift()!;
      const id = this.#nextId++;
      this.#pending.set(id, { resolve, reject, worker });
      // A worker with work keeps the process alive; an idle one does not.
      worker.ref();
      worker.postMessage({ ...task, id } satisfies RangeTask);
    }
  }

  #run(task: Omit<RangeTask, "id">): Promise<void> {
    return new Promise((resolve, reject) => {
      this.#queue.push({ task, resolve, reject });
      this.#pump();
    });
  }

  async multiply(matrix: Matrix, vectors: Uint32Array, count: number, layout: Layout = "vector-major"): Promise<Uint32Array> {
    if (this.#closed) throw new Error("the multiplier is closed");
    if (this.#broken) throw this.#broken;
    check(matrix, vectors, count);
    const cells = shared(matrix.cells);
    const vec = asInt32(shared(vectors));
    const out = new Int32Array(new SharedArrayBuffer(matrix.rows * count * 4));
    // Ranges of whole 4-row blocks, about four per thread, handed out as threads become free.
    const blocks = Math.ceil(matrix.rows / 4);
    const ranges = Math.max(1, Math.min(blocks, this.threads * 4));
    const per = Math.ceil(blocks / ranges);
    const tasks: Promise<void>[] = [];
    for (let b = 0; b < blocks; b += per) {
      const rowStart = b * 4;
      const rowEnd = Math.min(matrix.rows, (b + per) * 4);
      tasks.push(
        this.#run({ rows: matrix.rows, cols: matrix.cols, cells, vectors: vec, count, out, layout, rowStart, rowEnd }),
      );
    }
    await Promise.all(tasks);
    return new Uint32Array(out.buffer);
  }

  async close(): Promise<void> {
    this.#closed = true;
    await Promise.all(this.#workers.map((w) => w.terminate()));
  }
}
