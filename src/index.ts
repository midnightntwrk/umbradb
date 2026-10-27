/**
 * UmbraDB — the package's one entry point (`package.json` `exports` names only `"."`; `dist/index.js` and
 * `dist/index.d.ts` are built from this file).
 *
 * Empty between two tasks of `openspec/changes/core-arch`: task 17.2 retired the 0.9.5 parts this barrel exported —
 * TemporalKV, CheckpointStore, Watermarks, the transaction/lease layer, `saveAndAdvance`, WalletStateEnvelope, the
 * client, the migration runner, the durability-probe errors and the `StorageError` hierarchy (`design.md` §13; LS-2) —
 * and task 17.3 exports exactly the surface of `design.md` §12 here (LS-1). TransactionHistory is kept in
 * `legacy/transaction-history/`, outside the build and the package (task 17.1, LS-3).
 *
 * @packageDocumentation
 */

export {};
