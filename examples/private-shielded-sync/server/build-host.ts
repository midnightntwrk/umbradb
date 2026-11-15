/**
 * Runs a build in its worker thread (`./build-worker.ts`) and measures it for the benchmark (spec §8, server rows):
 * each step's duration and artifact size as the worker reports them, and the process's peak resident memory while
 * the step ran, sampled on the main thread (the worker shares the process) every {@link RSS_SAMPLE_MS} ms.
 */

import { Worker } from "node:worker_threads";
import type { BuildJob, BuildResult, BuildStep, StepReport } from "./build.ts";

/** How often the resident memory is sampled during a build. */
export const RSS_SAMPLE_MS = 10;

/** A step's report with the process's peak resident memory while it ran. */
export interface StepStats extends StepReport {
  readonly peakRssBytes: number;
}

export interface WorkerOutcome {
  readonly result: BuildResult;
  readonly steps: Readonly<Partial<Record<BuildStep, StepStats>>>;
  /** The process's peak resident memory over the whole build. */
  readonly peakRssBytes: number;
}

/** A build that failed: its stable code and message. */
export class BuildFailure extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

type FromWorker =
  | { readonly kind: "step"; readonly name: BuildStep; readonly phase: "start" | "end"; readonly report?: StepReport }
  | { readonly kind: "done"; readonly result: BuildResult }
  | { readonly kind: "failed"; readonly code: string; readonly message: string };

/** Runs `job` in a new worker thread; rejects with a {@link BuildFailure}. `onStep` is told each step's start and end. */
export function runBuildWorker(job: BuildJob, onStep?: (name: BuildStep, phase: "start" | "end", ms?: number) => void): Promise<WorkerOutcome> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./build-worker.ts", import.meta.url), { workerData: job });
    const steps: Partial<Record<BuildStep, StepStats>> = {};
    let current: BuildStep | null = null;
    let stepPeak = 0;
    let peak = process.memoryUsage.rss();
    const sample = (): void => {
      const rss = process.memoryUsage.rss();
      if (rss > peak) peak = rss;
      if (rss > stepPeak) stepPeak = rss;
    };
    const timer = setInterval(sample, RSS_SAMPLE_MS);
    let settled = false;
    const finish = (body: () => void): void => {
      if (settled) return;
      settled = true;
      clearInterval(timer);
      body();
      void worker.terminate();
    };
    worker.on("message", (message: FromWorker) => {
      if (message.kind === "step") {
        sample();
        onStep?.(message.name, message.phase, message.report?.ms);
        if (message.phase === "start") {
          current = message.name;
          stepPeak = process.memoryUsage.rss();
        } else if (message.report !== undefined) {
          steps[message.name] = { ...message.report, peakRssBytes: stepPeak };
          current = null;
        }
        return;
      }
      if (message.kind === "done") finish(() => resolve({ result: message.result, steps, peakRssBytes: peak }));
      else finish(() => reject(new BuildFailure(message.code, message.message)));
    });
    worker.on("error", (error: unknown) =>
      finish(() => reject(new BuildFailure("build-failed", error instanceof Error ? error.message : String(error)))),
    );
    worker.on("exit", (code) =>
      finish(() => reject(new BuildFailure("build-failed", `the build worker exited (${code}) during ${current ?? "startup"}`))),
    );
  });
}
