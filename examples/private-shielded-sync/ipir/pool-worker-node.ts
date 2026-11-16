/** Worker thread of the IPIR+SP pool in Node (`./pool-node.ts`): passes each message to `./pool-worker.ts`. */

import { parentPort } from "node:worker_threads";
import { ipirWorker, type IpirTask } from "./pool-worker.ts";

if (!parentPort) throw new Error("pool-worker-node.ts runs only as a worker thread");
const port = parentPort;
const handle = ipirWorker();

port.on("message", (task: IpirTask) => {
  const { reply, transfer } = handle(task);
  port.postMessage(reply, transfer);
});
