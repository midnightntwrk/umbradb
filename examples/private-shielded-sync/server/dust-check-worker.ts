/**
 * The Dust check table's worker thread (spec 00062): runs `buildDustCheck` on the job it is given and posts the result
 * (its table's transfer for the server to adopt) or the failure. Loaded as `.ts` by Node.js's own type stripping.
 */

import { parentPort, workerData } from "node:worker_threads";
import { buildDustCheck, DustCheckFailure, type DustCheckJob } from "./dust-check.ts";

if (parentPort === null) throw new Error("dust-check-worker.ts runs as a worker thread");
const port = parentPort;

try {
  port.postMessage({ kind: "done", result: await buildDustCheck(workerData as DustCheckJob) });
} catch (error) {
  port.postMessage({
    kind: "failed",
    code: error instanceof DustCheckFailure ? error.code : "build-failed",
    message: error instanceof Error ? error.message : String(error),
  });
}
