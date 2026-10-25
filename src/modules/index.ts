/**
 * Modules (`openspec/changes/core-arch/specs/modules/spec.md`, `design.md` §1, §6): the declaration and its types,
 * `defineModule` and `POINTS` (`./declaration.ts`), declaration validation at startup (`./validation.ts`), the adapters
 * to the database API's inputs (`./adapters.ts`), and the requirement graph per height range with each range's order
 * (`./graph.ts`).
 */

export * from "./adapters.js";
export * from "./declaration.js";
export * from "./graph.js";
export * from "./validation.js";
