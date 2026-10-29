/**
 * The core module `core-chain-events`: its declaration (`./core-chain-events.ts`), its table and statements
 * (`./sql.ts`), the chain events' decoding (`./events.ts`) and the values read with a runtime's type registry
 * (`./scale-value.ts`). [CD-4; CORE-ARCH §4.11; design §10]
 */

export * from "./core-chain-events.js";
export * from "./events.js";
export * from "./scale-value.js";
export * from "./sql.js";
