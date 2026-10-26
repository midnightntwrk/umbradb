/**
 * The admin worker thread's entry (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1; `design.md` §1):
 * `./server.ts` starts it with the address, the heartbeat's shared memory and the first snapshot as its `workerData`,
 * and it serves the admin endpoints (`./serve.ts`) over its `parentPort` until it is told to close. It runs only as a
 * thread of its own, outside coverage; what it runs, `serveAdmin`, is covered on the main thread too.
 */

import { parentPort, workerData } from "node:worker_threads";
import { type AdminServeOptions, serveAdmin } from "./serve.js";

if (parentPort === null) throw new Error("the admin worker runs as a worker thread (./server.ts starts it)");
serveAdmin({ ...(workerData as Omit<AdminServeOptions, "channel">), channel: parentPort });
