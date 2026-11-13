/** Worker thread of `ScanPool`: one kernel instance; scans chunks of the shared entries. */

import { parentPort, workerData } from "node:worker_threads";
import { ENTRY_BYTES, Kernel } from "./kernel.ts";
import type { ScanResult, ScanTask } from "./scan-pool.ts";

if (!parentPort) throw new Error("scan-worker.ts runs only as a worker thread");
const port = parentPort;
const kernel = new Kernel((workerData as { module: WebAssembly.Module }).module);

port.on("message", (t: ScanTask) => {
  let result: ScanResult;
  try {
    const entries = t.entries.subarray(t.first * ENTRY_BYTES, (t.first + t.count) * ENTRY_BYTES);
    if (t.op === "scan") {
      result = { id: t.id, hits: kernel.scan(entries, t.secret).map((i) => t.first + i) };
    } else {
      result = { id: t.id, values: kernel.scanValues(entries, t.secret) };
    }
  } catch (e) {
    result = { id: t.id, error: e instanceof Error ? e.message : String(e) };
  }
  port.postMessage(result, result.values ? [result.values.buffer as ArrayBuffer] : []);
});
