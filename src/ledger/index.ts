/**
 * The ledger. It holds:
 *
 * - the `LedgerPackage` adapters for v8 and v9;
 * - each block's ledger version, read from its `MNSV` digest, with the built-in version tables (`networks.json`) and
 *   their pins;
 * - the metadata a block is decoded with;
 * - the identity check of the ledger packages and their sources;
 * - the ledger worker, the node-store bridge and the block-level replay rules (`./replay.ts`).
 *
 * The public surface takes `LedgerPackage`, `ParsedTransaction` and `LedgerTask` from here. [LG-8; design §1, §5, §12]
 */

export * from "./adapter.js";
export * from "./identity.js";
export * from "./load.js";
export * from "./metadata.js";
export * from "./networks.js";
export * from "./node-refs.js";
export * from "./releases.js";
export * from "./replay.js";
export * from "./sources.js";
export type * from "./types.js";
export * from "./v8.js";
export * from "./v9.js";
export * from "./version-table.js";
export * from "./worker/index.js";
