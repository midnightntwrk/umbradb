/**
 * The ledger worker of the browser build (`openspec/changes/core-arch/specs/ledger/spec.md` LG-7, LG-10;
 * `specs/browser/spec.md` BR-1; `design.md` §5.3, §9.2; task 12.3's note (f); task 16.1): `src/ledger/worker/entry.ts`
 * unchanged, in a dedicated Web Worker that the process worker's ledger host starts (`src/ledger/worker/host.ts`, over
 * `./shims/worker-threads-host.ts`). Its `workerData` — the node-store bridge's `SharedArrayBuffer` — comes as the
 * host's first message, before the entry runs (`./shims/worker-threads-worker.ts`); its packages load through the
 * vendored entries the build rewrites to fetch their WebAssembly (`./ledger/instantiate.ts`).
 */

import { runEntry } from "./shims/worker-threads-worker.js";

void runEntry(() => import("../../src/ledger/worker/entry.js"));
