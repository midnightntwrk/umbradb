/**
 * A Web Worker of the page's SimplePIR multiplication (`./multiply-web.ts`), started for the page's client
 * (`./call-workers.ts`): computes one range of rows of a multiplication into shared memory, as
 * `../pir/multiply-worker.ts` does on a Node.js worker thread. Bundled as `multiply-worker.js` (`./build.ts`).
 */

import { multiplyRows16, multiplyRows32 } from "../pir/multiply-core.ts";
import type { RangeTask } from "../pir/multiply.ts";
import { onCallWorkerPort } from "./call-workers.ts";

onCallWorkerPort<RangeTask, { id: number; error?: string }>((t) => {
  try {
    const layout = t.layout === "vector-major" ? { rowStride: 1, vecStride: t.rows } : { rowStride: t.count, vecStride: 1 };
    if (t.cells instanceof Int16Array) {
      multiplyRows16(t.cells, t.cols, t.rowStart, t.rowEnd, t.vectors, t.count, t.out, layout);
    } else {
      multiplyRows32(t.cells, t.cols, t.rowStart, t.rowEnd, t.vectors, t.count, t.out, layout);
    }
    return { reply: { id: t.id }, transfer: [] };
  } catch (e) {
    return { reply: { id: t.id, error: e instanceof Error ? e.message : String(e) }, transfer: [] };
  }
});
