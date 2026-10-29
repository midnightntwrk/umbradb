/**
 * The admin endpoints:
 * - the admin listener, in a worker thread of its own (`./server.ts`, `./worker.ts`, `./serve.ts`);
 * - the backbone parts' endpoints it answers (`./routes.ts`: `core-health`, `core-status`, `core-config`), from the
 *   snapshot the runner publishes (`./snapshot.ts`, `./types.ts`) and the heartbeat's shared memory
 *   (`../runner/heartbeat.ts`);
 * - the runner's side of it (`./process-admin.ts`);
 * - the redaction and the sanitized errors the endpoints share (`./redaction.ts`, `./errors.ts`).
 *
 * Internal: not part of the package's public surface. [AE-1, AE-2, AE-3, AE-4, AE-5, AE-6, Q70; CORE-ARCH §4.18;
 * design §1, §12]
 */

export * from "./errors.js";
export * from "./process-admin.js";
export * from "./redaction.js";
export * from "./routes.js";
export * from "./serve.js";
export * from "./server.js";
export * from "./snapshot.js";
export * from "./types.js";
