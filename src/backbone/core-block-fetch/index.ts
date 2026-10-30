/**
 * The backbone part `core-block-fetch`:
 * - its declaration (`./core-block-fetch.ts`);
 * - the node-backed block source, with the finalized prefetch and the best-block queue (`./node-source.ts`)
 *   [IN-4, IN-5, IN-6, IN-7, IN-8];
 * - the block items (`./items.ts`) [CD-2];
 * - what the items are decoded with: the runtime metadata (`./metadata.ts`), the extrinsics and the block time
 *   (`./extrinsics.ts`), a header's hash (`./header.ts`, `./blake2b.ts`) and SCALE (`./scale.ts`);
 * - a block's raw chain events, which the source also gives `core-chain-events` (`./events.ts`) [CD-4];
 * - the node's ledger state roots and genesis state, which the source gives `core-ledger-state`
 *   (`./ledger-source.ts`) [LG-15].
 *
 * [CD-2; CORE-ARCH §4.11; design §3]
 */

export * from "./blake2b.js";
export * from "./core-block-fetch.js";
export * from "./events.js";
export * from "./extrinsics.js";
export * from "./header.js";
export * from "./items.js";
export * from "./ledger-source.js";
export * from "./metadata.js";
export * from "./node-source.js";
export * from "./scale.js";
