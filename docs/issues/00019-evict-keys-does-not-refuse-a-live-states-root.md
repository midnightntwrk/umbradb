# 00019 — `evictKeys` does not refuse the root node of a live ledger state

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-26, during task 12.1 of `openspec/changes/core-arch` (the `LedgerPackage` adapters), outside its
  change: the behaviour is the vendored packages' (task 0.2's patches), which task 12.1 does not change.

## Problem

`vendor/ledger/README.md` says the patches' `forget_stored(keys)` (exported as `evictKeys`) "refuses a key a live
object still holds". It does refuse the nodes below a live state's root, but not the root node itself: a `LedgerState`
object holds its root as a plain value, not as an `Sp` of the arena, and the check only looks at the arena's `Sp`s. So
`evictKeys([stateKey(state)])` succeeds while `state` is alive, and the package then treats that node as never stored:
the next flush that reaches it inserts it again.

Nothing in tasks 12.1–12.4 evicts a root. Task 12.5's sweep deletes only unmarked nodes, and a state's root is marked
while its root count is positive; but a state released while its handle is still alive in the worker would have its
root evicted without the refusal the README promises, and the worker would keep using a state whose root the database
no longer holds.

## Evidence

- `vendor/ledger/v9/patches/0001-storage-core-external-node-store.patch` (and v8's): `forget_stored` refuses a key only
  if `metadata.contains_key(key)`, the arena's metadata of live `Sp`s.
- `vendor/ledger/v9/patches/0003-ledger-wasm-node-store-exports.patch`: `stateKey(state)` allocates the root as an `Sp`
  "kept until the next flush" — after the flush nothing in the arena holds it.
- Reproduced in task 12.1 with the v8 package: for the state `test/ledger/ledger-states.ts` `makeV8State("evict")`,
  after `persistKey(stateKey(state))` and `flushNodes()` (4 nodes), `evictKeys([node])` throws "still held by a live
  object" for each of the 3 child nodes and returns normally for the root; for the mainnet genesis state (one node,
  `test/ledger/fixtures/genesis/genesis_state_mainnet.mn`) `evictKeys([root])` returns normally.
- `test/ledger/node-store-suite.ts` ("evictKeys makes a node the store deleted be flushed again…") evicts a batch that
  holds child nodes, so it sees the refusal and does not show the root's case.

## Suggested fix

Either make the patch's `forget_stored` also refuse the key of any live `LedgerState`'s root (the export keeps a weak
set of the roots of the states it hands out), or correct the README's sentence to "a key an `Sp` still holds" and have
task 12.5's sweep, which owns eviction, free a state's handle before its root can be swept (the worker frees released
states' handles, `free()` of wasm-bindgen).
