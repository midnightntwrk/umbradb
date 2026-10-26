/**
 * The runner (`openspec/changes/core-arch/specs/runner/spec.md`, `design.md` §1–§3): the point dispatch and the order
 * within points (`./dispatch.ts`, task 5.1); the block-source interface (`./block-source.ts`) and the in-memory source
 * (`./in-memory-source.ts`), the block items and settings of a block context (`./block-context.ts`), the finalized loop
 * (`./loop.ts`) and the chain-data envelope of module API responses (`./envelope.ts`), task 5.2. Process items and
 * module APIs, start and stop, failures and restarts, and the slow-block watchdog are tasks 5.2a–5.5.
 */

export * from "./block-context.js";
export * from "./block-source.js";
export * from "./dispatch.js";
export * from "./envelope.js";
export * from "./in-memory-source.js";
export * from "./loop.js";
