/**
 * The scan across worker threads (spec FR-104). Each worker instantiates its own copy of the kernel from the compiled
 * module; the entries sit in one `SharedArrayBuffer` that every worker reads its chunks from. The thread count is an
 * option.
 */

import { availableParallelism } from "node:os";
import { Worker } from "node:worker_threads";
import { compileKernel, ENTRY_BYTES } from "./kernel.ts";

/** A message to a scan worker. */
export interface ScanTask {
  readonly id: number;
  readonly op: "scan" | "values";
  readonly entries: Uint8Array;
  readonly first: number;
  readonly count: number;
  readonly secret: Uint8Array;
}

/** A scan worker's answer: positions (absolute) or values (32 bytes per entry). */
export interface ScanResult {
  readonly id: number;
  readonly hits?: number[];
  readonly values?: Uint8Array;
  readonly error?: string;
}

export interface ScanOptions {
  /** Entries per task; by default about eight tasks per thread, between 64 and 4,096 entries. */
  readonly chunk?: number;
}

export class ScanPool {
  readonly threads: number;
  readonly #workers: Worker[] = [];
  readonly #idle: Worker[] = [];
  readonly #queue: { task: Omit<ScanTask, "id">; resolve: (r: ScanResult) => void; reject: (e: Error) => void }[] = [];
  readonly #pending = new Map<number, { resolve: (r: ScanResult) => void; reject: (e: Error) => void }>();
  #nextId = 1;
  #broken: Error | undefined;

  /** Starts `threads` workers, each with an instance of `module` (by default the committed kernel, digest-checked). */
  constructor(options: { threads?: number; module?: WebAssembly.Module } = {}) {
    const threads = options.threads ?? Math.max(1, availableParallelism() - 1);
    if (!Number.isInteger(threads) || threads < 1) throw new Error(`thread count must be ≥ 1: ${threads}`);
    this.threads = threads;
    const module = options.module ?? compileKernel();
    for (let i = 0; i < threads; i++) {
      const worker = new Worker(new URL("./scan-worker.ts", import.meta.url), { workerData: { module } });
      worker.unref();
      worker.on("message", (r: ScanResult) => this.#done(worker, r));
      worker.on("error", (err: unknown) => this.#fail(err instanceof Error ? err : new Error(String(err))));
      this.#workers.push(worker);
      this.#idle.push(worker);
    }
  }

  #done(worker: Worker, r: ScanResult): void {
    const p = this.#pending.get(r.id);
    this.#pending.delete(r.id);
    worker.unref();
    this.#idle.push(worker);
    if (p) {
      if (r.error) p.reject(new Error(r.error));
      else p.resolve(r);
    }
    this.#pump();
  }

  #fail(err: Error): void {
    this.#broken ??= new Error(`a scan worker failed: ${err.message}`);
    for (const p of this.#pending.values()) p.reject(this.#broken);
    for (const q of this.#queue) q.reject(this.#broken);
    this.#pending.clear();
    this.#queue.length = 0;
    for (const w of this.#workers) void w.terminate();
  }

  #pump(): void {
    while (this.#idle.length > 0 && this.#queue.length > 0) {
      const worker = this.#idle.pop()!;
      const { task, resolve, reject } = this.#queue.shift()!;
      const id = this.#nextId++;
      this.#pending.set(id, { resolve, reject });
      worker.ref();
      worker.postMessage({ ...task, id } satisfies ScanTask);
    }
  }

  #run(op: ScanTask["op"], entries: Uint8Array, secret: Uint8Array, options: ScanOptions): Promise<ScanResult[]> {
    if (this.#broken) return Promise.reject(this.#broken);
    if (secret.length !== 32) return Promise.reject(new Error("secret must be 32 bytes"));
    const total = entries.length / ENTRY_BYTES;
    if (!Number.isInteger(total)) return Promise.reject(new Error("scan entries must be a whole number of 36-byte entries"));
    let shared = entries;
    if (!(entries.buffer instanceof SharedArrayBuffer)) {
      shared = new Uint8Array(new SharedArrayBuffer(entries.length));
      shared.set(entries);
    }
    const chunk = options.chunk ?? Math.min(4096, Math.max(64, Math.ceil(total / (this.threads * 8))));
    const tasks: Promise<ScanResult>[] = [];
    for (let first = 0; first < total; first += chunk) {
      const count = Math.min(chunk, total - first);
      tasks.push(
        new Promise((resolve, reject) => {
          this.#queue.push({ task: { op, entries: shared, first, count, secret: secret.slice() }, resolve, reject });
          this.#pump();
        }),
      );
    }
    return Promise.all(tasks);
  }

  /** The positions (indices into `entries`) that pass the ownership test, ascending. */
  async scan(entries: Uint8Array, secret: Uint8Array, options: ScanOptions = {}): Promise<number[]> {
    const results = await this.#run("scan", entries, secret, options);
    return results.flatMap((r) => r.hits ?? []).sort((a, b) => a - b);
  }

  /** The 32-byte value each entry's ownership test compares, in entry order. */
  async scanValues(entries: Uint8Array, secret: Uint8Array, options: ScanOptions = {}): Promise<Uint8Array> {
    const chunk = options.chunk ?? Math.min(4096, Math.max(64, Math.ceil(entries.length / ENTRY_BYTES / (this.threads * 8))));
    const results = await this.#run("values", entries, secret, { chunk });
    const out = new Uint8Array((entries.length / ENTRY_BYTES) * 32);
    results.forEach((r, i) => out.set(r.values!, i * chunk * 32));
    return out;
  }

  async close(): Promise<void> {
    await Promise.all(this.#workers.map((w) => w.terminate()));
  }
}
