/**
 * The runner, and the parts it is made of. [design §1–§3]
 *
 * - the point dispatch and the order within points (`./dispatch.ts`);
 * - the block-source interface (`./block-source.ts`) and the in-memory source (`./in-memory-source.ts`);
 * - the block items and settings of a block context (`./block-context.ts`);
 * - the finalized loop (`./loop.ts`) and the chain-data envelope's helpers (`./envelope.ts`);
 * - the process items and module APIs: the process contexts (`./process-context.ts`), the module API's routes, requests
 *   and subscriptions (`./module-api.ts`) and its listener on `listen.api` (`./api-server.ts`);
 * - the process (`./process.ts`): its startup from the declarations, the configuration and a block source, the loop's
 *   start and stop heights, the delivery of the callbacks again after a restart, the upgrade boundary, its state and
 *   SIGTERM [RN-11];
 * - the failures: the `refused` and `halted` states with their reasons, and the retries of a lost connection or an
 *   unreachable node (`./process.ts`, `./failures.ts`);
 * - the slow-block watchdog: the loop's window of each height and of the callbacks it awaits outside a height's
 *   processing, and `slow-block` (`./loop.ts`, `./process.ts`);
 * - the pause between heights and the backup on SIGUSR2 (`./pause.ts`, `./loop.ts`, `./process.ts`).
 */

export * from "./api-server.js";
export * from "./block-context.js";
export * from "./block-source.js";
export * from "./dispatch.js";
export * from "./envelope.js";
export * from "./failures.js";
export * from "./in-memory-source.js";
export * from "./loop.js";
export * from "./module-api.js";
export * from "./pause.js";
export * from "./process.js";
export * from "./process-context.js";
