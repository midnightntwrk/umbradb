/**
 * The core module `core-ledger-state` (CORE-ARCH §4.8, §4.9, §4.11; `openspec/changes/core-arch/specs/ledger/spec.md`
 * LG-7 to LG-16; tasks 12.3–12.5): its declaration, the apply and root check of each block in the ledger worker, the
 * stored state's reload, the conversion and contracts' keys, and its tables (`./core-ledger-state.ts`); the `core`
 * revisions and LG-12's retention window (`./retention.ts`); LG-14's fixed-budget mark-and-sweep (`./sweep.ts`).
 */

export * from "./core-ledger-state.js";
export * from "./retention.js";
export * from "./sweep.js";
