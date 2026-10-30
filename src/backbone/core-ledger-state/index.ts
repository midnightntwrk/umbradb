/**
 * The core module `core-ledger-state`, in four files. [LG-7 to LG-16; CORE-ARCH §4.8, §4.9, §4.11]
 *
 * - `./core-ledger-state.ts`: its declaration, the apply and root check of each block in the ledger worker, the stored
 *   state's reload, the ledger conversion and the contracts' keys;
 * - `./retention.ts`: the `core` revisions and the retention window [LG-12];
 * - `./sweep.ts`: the fixed-budget mark-and-sweep [LG-14];
 * - `./sql.ts`: its tables, its migrations and every statement.
 */

export * from "./core-ledger-state.js";
export * from "./retention.js";
export * from "./sql.js";
export * from "./sweep.js";
