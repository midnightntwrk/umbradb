/**
 * The ledger (`openspec/changes/core-arch/design.md` §1 `src/ledger/`, §5): the `LedgerPackage` adapters for v8 and
 * v9 (task 12.1); each block's ledger version from its `MNSV` digest, the built-in version tables
 * (`networks.json`) and their pins, the metadata a block is decoded with, and the identity check of the ledger
 * packages (task 12.2). The ledger worker, the node-store bridge and the sweep follow (tasks 12.3–12.6). `design.md`
 * §12's surface takes `LedgerPackage`, `ParsedTransaction` and `LedgerTask` from here (task 17.3).
 */

export * from "./adapter.js";
export * from "./identity.js";
export * from "./load.js";
export * from "./metadata.js";
export * from "./networks.js";
export * from "./releases.js";
export type * from "./types.js";
export * from "./v8.js";
export * from "./v9.js";
export * from "./version-table.js";
