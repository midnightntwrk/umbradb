/**
 * The admin endpoints (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1–AE-6; `design.md` §1; CORE-ARCH
 * §4.18; decision record Q70, task 8.1): the admin listener in a worker thread of its own (`./server.ts`, `./worker.ts`,
 * `./serve.ts`), answering the backbone parts' endpoints (`./routes.ts`: `core-health`, `core-status`, `core-config`)
 * from the snapshot the runner publishes (`./snapshot.ts`, `./types.ts`) and the heartbeat's shared memory
 * (`../runner/heartbeat.ts`); the runner's side of it (`./process-admin.ts`); the redaction and the sanitized errors the
 * endpoints share (`./redaction.ts`, `./errors.ts`). Internal: not design §12's surface.
 */

export * from "./errors.js";
export * from "./process-admin.js";
export * from "./redaction.js";
export * from "./routes.js";
export * from "./serve.js";
export * from "./server.js";
export * from "./snapshot.js";
export * from "./types.js";
