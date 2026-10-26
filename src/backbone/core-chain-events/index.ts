/**
 * The core module `core-chain-events` (CORE-ARCH §4.11; `openspec/changes/core-arch/specs/chain-data/spec.md` CD-4;
 * `design.md` §10; task 11.1): its declaration and table (`./core-chain-events.ts`), the chain events' decoding
 * (`./events.ts`) and the values read with a runtime's type registry (`./scale-value.ts`).
 */

export * from "./core-chain-events.js";
export * from "./events.js";
export * from "./scale-value.js";
