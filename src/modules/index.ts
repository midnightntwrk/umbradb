/**
 * Modules (`openspec/changes/core-arch/specs/modules/spec.md`, `design.md` §1, §6): the declaration and its types,
 * `defineModule` and `POINTS` (`./declaration.ts`), declaration validation at startup (`./validation.ts`), and the
 * adapters to the database API's inputs (`./adapters.ts`). The requirement graph per height range is task 3.2's.
 */

export * from "./adapters.js";
export * from "./declaration.js";
export * from "./validation.js";
