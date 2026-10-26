/**
 * The core module `core-block-parsed` (CORE-ARCH §4.11; `openspec/changes/core-arch/specs/chain-data/spec.md` CD-5;
 * `design.md` §10; task 11.1): its declaration and table (`./core-block-parsed.ts`), the placement of a block's
 * transactions in their application order (`./placement.ts`) and the parse (`./parser.ts`).
 */

export * from "./core-block-parsed.js";
export * from "./parser.js";
export * from "./placement.js";
