# 00018 — The ledger packages' `successfulSegments` is true for the segments that failed

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-26, during task 12.1 of `openspec/changes/core-arch` (the `LedgerPackage` adapters), outside its
  change: the code is upstream `midnight-ledger`'s, built unchanged into both vendored packages (`vendor/ledger/`).

## Problem

`TransactionResult.successfulSegments` of the ledger's WebAssembly API maps each segment of a partially successful
transaction to `true` when that segment **failed** and to `false` when it succeeded. Its name, and the type
declaration that ships with it, say the opposite. A reader who trusts the name stores every segment's success inverted —
in UmbraDB's terms, `core_ledger_state.segment_results` (LG-16) would say the guaranteed segment of every partially
successful transaction failed and its failed fallible segment succeeded.

## Evidence

- `midnight-ledger` `ledger-wasm/src/tx.rs` (`ledger-9.1.0.0-rc.5`, commit `67f9f972`, the `successful_segments`
  getter, `js_name = "successfulSegments"`): `res.set(&JsValue::from(*k), &JsValue::from(v.is_err()))` — the value is
  `is_err()`. The same code is in `ledger-8.1.0` (`ledger-wasm/src/tx.rs:1810`), so the v8 package (ledger-8.1.2) has it
  too.
- The ledger's semantics put segment 0 in the map as `Ok(())` and each fallible segment as its outcome
  (`ledger/src/semantics.rs` `apply_fallible`).
- `vendor/ledger/v8/pkg/ledger-v8.d.ts:2117` (and the v9 declaration) declare `readonly successfulSegments?:
  Map<number, boolean>` with nothing saying the values are inverted.
- Seen by task 12.1: a contract call whose guaranteed transcript logs and whose fallible transcript fails gives
  `type: 'partialSuccess'` and `successfulSegments` `Map { 0 => false, 1 => true }` on both packages.
  `src/ledger/adapter.ts` inverts the values (the comment at the partial-success branch, and the module header), and
  `test/ledger/adapter-suite.ts` ("applies a block … as the reference replay does") pins the outcome the semantics give:
  segment 0 successful, segment 1 failed.

## Suggested fix

Upstream: return `v.is_ok()` (or rename the getter `failedSegments`). It belongs with the vendored patches the owner
proposes upstream once `midnight-ledger` is stable (decision record Q56), as a separate small pull request. When a
release fixes it, `src/ledger/adapter.ts` must stop inverting for that package; the suite's partial-success test then
fails until it does, so the change cannot go unnoticed.
