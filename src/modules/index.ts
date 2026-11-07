/**
 * Modules: the declaration and its types, with `defineModule` and `POINTS` (`./declaration.ts`); declaration
 * validation at startup (`./validation.ts`); the adapters to the database API's inputs (`./adapters.ts`); and the
 * requirement graph, which resolves each height range's providers and order (`./graph.ts`). [design §1, §6]
 */

export * from "./adapters.js";
export * from "./declaration.js";
export * from "./graph.js";
export * from "./validation.js";
