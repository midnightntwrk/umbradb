/** The IPIR+SP pool (`./pool.ts`) over Node's `worker_threads`, for the command line and the benchmark. */

import { Worker } from "node:worker_threads";
import { IpirPool } from "./pool.ts";

/** A pool of `threads` worker threads, started at its first use; an idle worker does not keep the process alive. */
export function nodeIpirPool(threads: number): IpirPool {
  return new IpirPool(threads, () => {
    const worker = new Worker(new URL("./pool-worker-node.ts", import.meta.url));
    worker.unref();
    return {
      post: (task, transfer) => worker.postMessage(task, transfer),
      listen(onReply, onError) {
        worker.on("message", onReply);
        worker.on("error", (error: unknown) => onError(error instanceof Error ? error : new Error(String(error))));
      },
      busy: (busy) => (busy ? worker.ref() : worker.unref()),
      terminate: async () => {
        await worker.terminate();
      },
    };
  });
}
