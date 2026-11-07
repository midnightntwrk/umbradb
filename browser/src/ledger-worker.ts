/**
 * The ledger worker of the browser build: `src/ledger/worker/entry.ts` unchanged, in a dedicated Web Worker that the
 * process worker's ledger host starts (`src/ledger/worker/host.ts`, over `./shims/worker-threads-host.ts`).
 * [LG-7, LG-10, BR-1; design §5.3, §9.2]
 *
 * Its `workerData` (the node-store bridge's `SharedArrayBuffer`) comes as the host's first message, before the entry
 * runs (`./shims/worker-threads-worker.ts`). Its packages load through the vendored entries that the build rewrites to
 * fetch their WebAssembly (`./ledger/instantiate.ts`).
 */

import { runEntry } from "./shims/worker-threads-worker.js";

void runEntry(() => import("../../src/ledger/worker/entry.js"));
