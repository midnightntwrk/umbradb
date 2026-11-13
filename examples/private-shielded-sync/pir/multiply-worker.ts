/** Worker thread of `WorkerMultiplier`: computes one range of rows of a multiplication into shared memory. */

import { parentPort } from "node:worker_threads";
import { multiplyRows16, multiplyRows32 } from "./multiply-core.ts";
import type { RangeTask } from "./multiply.ts";

if (!parentPort) throw new Error("multiply-worker.ts runs only as a worker thread");
const port = parentPort;

port.on("message", (t: RangeTask) => {
  try {
    const layout = t.layout === "vector-major" ? { rowStride: 1, vecStride: t.rows } : { rowStride: t.count, vecStride: 1 };
    if (t.cells instanceof Int16Array) {
      multiplyRows16(t.cells, t.cols, t.rowStart, t.rowEnd, t.vectors, t.count, t.out, layout);
    } else {
      multiplyRows32(t.cells, t.cols, t.rowStart, t.rowEnd, t.vectors, t.count, t.out, layout);
    }
    port.postMessage({ id: t.id });
  } catch (e) {
    port.postMessage({ id: t.id, error: e instanceof Error ? e.message : String(e) });
  }
});
