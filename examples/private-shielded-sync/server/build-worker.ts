/**
 * The build's worker thread: runs `buildSnapshot` on the job it is given and posts each step's start and end, then
 * the result (its grids stay in shared memory) or the failure. Loaded as `.ts` by Node.js's own type stripping.
 */

import { parentPort, workerData } from "node:worker_threads";
import { BuildError, type BuildJob, buildSnapshot } from "./build.ts";

if (parentPort === null) throw new Error("build-worker.ts runs as a worker thread");
const port = parentPort;

try {
  const result = await buildSnapshot(workerData as BuildJob, {
    step: (name, phase, report) => port.postMessage({ kind: "step", name, phase, report }),
  });
  port.postMessage({ kind: "done", result });
} catch (error) {
  port.postMessage({
    kind: "failed",
    code: error instanceof BuildError ? error.code : "build-failed",
    message: error instanceof Error ? error.message : String(error),
  });
}
