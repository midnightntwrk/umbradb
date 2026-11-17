/**
 * A Web Worker of the page's IPIR+SP pool (`../ipir/pool.ts`), started for the page's client (`./call-workers.ts`) on
 * an IPIR+SP snapshot: one instance of the wallet's WebAssembly, which makes its share of each call's requests and
 * decodes their answers (`../ipir/pool-worker.ts`). Bundled as `ipir-worker.js` (`./build.ts`). It makes no request
 * itself: the compiled module arrives in its first task, already checked against the committed SHA-256.
 */

import { ipirWorker, type IpirReply, type IpirTask } from "../ipir/pool-worker.ts";
import { onCallWorkerPort } from "./call-workers.ts";

onCallWorkerPort<IpirTask, IpirReply>(ipirWorker());
