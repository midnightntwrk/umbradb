/**
 * The backbone part `core-block-fetch` (CORE-ARCH §4.11; `openspec/changes/core-arch/specs/chain-data/spec.md` CD-2,
 * `specs/ingest/spec.md` IN-4 to IN-8; `design.md` §3; task 10.3): its declaration (`./core-block-fetch.ts`), the
 * node-backed block source with the finalized prefetch and the best-block queue (`./node-source.ts`), the block items
 * (`./items.ts`), and what they decode with — the runtime metadata (`./metadata.ts`), the extrinsics and the block time
 * (`./extrinsics.ts`), a header's hash (`./header.ts`, `./blake2b.ts`), SCALE (`./scale.ts`) —; and a block's raw
 * chain events, which the source also gives `core-chain-events` (`./events.ts`, task 11.1), and the node's ledger state
 * roots and genesis state, which it gives `core-ledger-state` (`./ledger-source.ts`, task 12.3).
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
