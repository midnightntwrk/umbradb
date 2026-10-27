/**
 * The process transport (`openspec/changes/core-arch/specs/private-processes/spec.md` PP-3, PP-4, PP-11; `design.md`
 * §1, §8; task 14.2): its messages and their zod schemas (`./messages.ts`), the core's server (`./core-transport.ts`)
 * and a private process's client (`./private-transport.ts`). Lockstep's bookkeeping is task 14.3's. Node.js only (`ws`,
 * `node:http`, `node:https`): the browser's transport is `postMessage` between workers (task 16.1).
 */

export * from "./core-transport.js";
export * from "./messages.js";
export * from "./private-transport.js";
