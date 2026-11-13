/**
 * The files the GPU check (`check.ts`, Deno) and the CPU reference (`cpu-reference.ts`, Node) exchange in a work
 * folder: the check writes each job's inputs and `jobs.json`; the CPU reference writes each job's outputs and
 * `cpu.json` (timings). Binary files are the typed arrays' own little-endian bytes.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export interface ScanJob {
  readonly kind: "scan";
  readonly id: string;
  /** 36-byte entries. */
  readonly entries: string;
  /** 32-byte secret scalar. */
  readonly secret: string;
  /** Entries timed on one thread (the CPU kernel's per-entry cost). */
  readonly singleThreadSample: number;
}

export interface MultiplyJob {
  readonly kind: "multiply";
  readonly id: string;
  /** Row-major cells: 16-bit (`Int16Array`) or 32-bit (`Int32Array`). */
  readonly cells: string;
  readonly cellBits: 16 | 32;
  readonly rows: number;
  readonly cols: number;
  /** `count × cols` 32-bit values, vector-major. */
  readonly vectors: string;
  readonly count: number;
  readonly layout: "vector-major" | "row-major";
  /** Untimed calls first: the workers' code is optimized over the first calls (timings settle after a few). */
  readonly warmups: number;
  /** Timed runs of the worker multiply after the warm-up calls (the output is the last run's). */
  readonly runs: number;
  /** Also time the multiply on one thread (`inlineMultiplier`), best of `runs`. */
  readonly singleThread: boolean;
}

export type Job = ScanJob | MultiplyJob;

export interface JobFile {
  readonly threads: number;
  readonly jobs: readonly Job[];
}

/** Output files of a job. */
export const outputs = {
  scanValues: (id: string) => `${id}.cpu-values.bin`,
  scanHits: (id: string) => `${id}.cpu-hits.json`,
  answers: (id: string) => `${id}.cpu-answers.bin`,
};

export interface ScanTiming {
  readonly id: string;
  readonly entries: number;
  readonly threads: number;
  /** `ScanPool.scanValues` over every entry, after a warm-up. */
  readonly poolValuesMs: number;
  /** `ScanPool.scan` over every entry. */
  readonly poolScanMs: number;
  /** `Kernel.scanValues` on one thread over the first `singleThreadSample` entries. */
  readonly singleThreadSample: number;
  readonly singleThreadMs: number;
  readonly hits: number;
}

export interface MultiplyTiming {
  readonly id: string;
  readonly threads: number;
  /** Every timed run of `WorkerMultiplier.multiply`, after the warm-up calls. */
  readonly workerMs: readonly number[];
  /** Every timed run of `inlineMultiplier.multiply`, if timed. */
  readonly singleThreadMs: readonly number[];
  /** The inline result equals the workers' (when timed). */
  readonly inlineEqualsWorkers: boolean | null;
}

export interface CpuReport {
  readonly node: string;
  readonly cpus: number;
  readonly loadBefore: readonly number[];
  readonly loadAfter: readonly number[];
  readonly scans: readonly ScanTiming[];
  readonly multiplies: readonly MultiplyTiming[];
}

export function bytesOf(a: ArrayBufferView): Uint8Array {
  return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
}

export function writeBytes(dir: string, name: string, a: ArrayBufferView): string {
  writeFileSync(join(dir, name), bytesOf(a));
  return name;
}

export function readBytes(dir: string, name: string): Uint8Array {
  const b = readFileSync(join(dir, name));
  return new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
}

export function writeJson(dir: string, name: string, value: unknown): void {
  writeFileSync(join(dir, name), `${JSON.stringify(value, null, 2)}\n`);
}

export function readJson<T>(dir: string, name: string): T {
  return JSON.parse(readFileSync(join(dir, name), "utf8")) as T;
}
