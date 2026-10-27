/**
 * The process transport (`openspec/changes/core-arch/specs/private-processes/spec.md` PP-3, PP-4, PP-6, PP-7, PP-11;
 * `design.md` §1, §8; tasks 14.2–14.4): its messages and their zod schemas (`./messages.ts`), the core's server
 * (`./core-transport.ts`), the core's lockstep bookkeeping and wait (`./lockstep.ts`), the core's view of its instances
 * for `/status` (`./instances.ts`) and a private process's client (`./private-transport.ts`). Node.js only (`ws`,
 * `node:http`, `node:https`): the browser's transport is `postMessage` between workers (task 16.1).
 */

export * from "./core-transport.js";
export * from "./instances.js";
export * from "./lockstep.js";
export * from "./messages.js";
export * from "./private-transport.js";
