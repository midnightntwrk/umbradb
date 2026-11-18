/**
 * The CPU side of the GPU check, run under Node by `check.ts`: the jobs of a work folder (`jobs.ts`) through the CPU
 * kernels the server and client use — `ScanPool` (the WASM scan kernel across worker threads) and `WorkerMultiplier`
 * (the PIR multiply across worker threads) — writing their outputs and timings.
 *
 *     node examples/private-shielded-sync/gpu/cpu-reference.ts <work folder>
 *
 * Runs under Node because Deno's `node:worker_threads` runs the multiply's workers about twenty times slower than
 * Node does (the WASM scan is unaffected), so CPU timings taken under Deno would understate the CPU.
 */

import { loadavg, availableParallelism } from "node:os";
import { compileKernel, Kernel } from "../kernel/kernel.ts";
import { ScanPool } from "../kernel/scan-pool.ts";
import { inlineMultiplier, type Matrix, WorkerMultiplier } from "../pir/multiply.ts";
import {
  type CpuReport,
  type JobFile,
  type MultiplyJob,
  type MultiplyTiming,
  outputs,
  readBytes,
  readJson,
  type ScanJob,
  type ScanTiming,
  writeBytes,
  writeJson,
} from "./jobs.ts";

const ENTRY_BYTES = 36;

function shared<T extends Int16Array | Int32Array | Uint32Array>(ctor: new (b: SharedArrayBuffer) => T, bytes: Uint8Array): T {
  const buf = new SharedArrayBuffer(bytes.length);
  new Uint8Array(buf).set(bytes);
  return new ctor(buf);
}

function equal(a: Uint32Array, b: Uint32Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

async function scanJob(dir: string, job: ScanJob, pool: ScanPool, kernel: Kernel, threads: number): Promise<ScanTiming> {
  const entries = readBytes(dir, job.entries);
  const secret = readBytes(dir, job.secret);
  const count = entries.length / ENTRY_BYTES;
  // Warm-up: every worker compiles its instance on its first task.
  await pool.scanValues(entries.subarray(0, Math.min(count, threads * 16) * ENTRY_BYTES), secret);
  let t = performance.now();
  const values = await pool.scanValues(entries, secret);
  const poolValuesMs = performance.now() - t;
  t = performance.now();
  const hits = await pool.scan(entries, secret);
  const poolScanMs = performance.now() - t;
  writeBytes(dir, outputs.scanValues(job.id), values);
  writeJson(dir, outputs.scanHits(job.id), hits);
  const sample = Math.min(count, job.singleThreadSample);
  kernel.scanValues(entries.subarray(0, 16 * ENTRY_BYTES), secret);
  t = performance.now();
  kernel.scanValues(entries.subarray(0, sample * ENTRY_BYTES), secret);
  const singleThreadMs = performance.now() - t;
  return { id: job.id, entries: count, threads, poolValuesMs, poolScanMs, singleThreadSample: sample, singleThreadMs, hits: hits.length };
}

async function multiplyJob(dir: string, job: MultiplyJob, workers: WorkerMultiplier, threads: number): Promise<MultiplyTiming> {
  const bytes = readBytes(dir, job.cells);
  const cells = job.cellBits === 16 ? shared(Int16Array, bytes) : shared(Int32Array, bytes);
  const matrix: Matrix = { rows: job.rows, cols: job.cols, cells };
  const vectors = shared(Uint32Array, readBytes(dir, job.vectors));
  for (let w = 0; w < job.warmups; w++) await workers.multiply(matrix, vectors, job.count, job.layout);
  const workerMs: number[] = [];
  let answers: Uint32Array | undefined;
  for (let r = 0; r < job.runs; r++) {
    const t = performance.now();
    answers = await workers.multiply(matrix, vectors, job.count, job.layout);
    workerMs.push(performance.now() - t);
  }
  writeBytes(dir, outputs.answers(job.id), answers!);
  const singleThreadMs: number[] = [];
  let inlineEqualsWorkers: boolean | null = null;
  if (job.singleThread) {
    for (let r = 0; r < job.runs; r++) {
      const t = performance.now();
      const inline = await inlineMultiplier.multiply(matrix, vectors, job.count, job.layout);
      singleThreadMs.push(performance.now() - t);
      inlineEqualsWorkers = equal(inline, answers!) && inlineEqualsWorkers !== false;
    }
  }
  return { id: job.id, threads, workerMs, singleThreadMs, inlineEqualsWorkers };
}

async function main(): Promise<void> {
  const dir = process.argv[2];
  if (!dir) throw new Error("usage: node cpu-reference.ts <work folder>");
  const file = readJson<JobFile>(dir, "jobs.json");
  const threads = Math.min(file.threads, availableParallelism());
  const loadBefore = loadavg();
  const module = compileKernel();
  const kernel = new Kernel(module);
  const pool = new ScanPool({ threads, module });
  const workers = new WorkerMultiplier(threads);
  const scans: ScanTiming[] = [];
  const multiplies: MultiplyTiming[] = [];
  try {
    for (const job of file.jobs) {
      const t = performance.now();
      if (job.kind === "scan") scans.push(await scanJob(dir, job, pool, kernel, threads));
      else multiplies.push(await multiplyJob(dir, job, workers, threads));
      console.log(`  cpu ${job.id}: ${((performance.now() - t) / 1000).toFixed(1)} s`);
    }
  } finally {
    await pool.close();
    await workers.close();
  }
  const report: CpuReport = {
    node: process.version,
    cpus: availableParallelism(),
    loadBefore,
    loadAfter: loadavg(),
    scans,
    multiplies,
  };
  writeJson(dir, "cpu.json", report);
}

await main();
