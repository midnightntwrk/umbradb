/**
 * The core module `core-ledger-state`, in five files. [LG-7 to LG-16; CORE-ARCH §4.8, §4.9, §4.11]
 *
 * - `./core-ledger-state.ts`: its declaration, the apply and root check of each block in the ledger worker, the stored
 *   state's reload, the ledger conversion and the contracts' keys;
 * - `./retention.ts`: the `core` revisions and the retention window [LG-12];
 * - `./refcount.ts`: reclamation by reference counting, each block's step [LG-14];
 * - `./sweep.ts`: the fixed-budget mark-and-sweep, which no block runs any more [LG-14];
 * - `./sql.ts`: its tables, its migrations and every statement.
 */

export * from "./core-ledger-state.js";
export * from "./refcount.js";
export * from "./retention.js";
export * from "./sql.js";
export * from "./sweep.js";
