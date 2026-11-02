# 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history

- **Status:** OPEN
- **Area:** ledger storage (`core-ledger-state`, LG-11)
- **Severity:** unknown — no divergence has been seen; if the packages produce it on a real chain, two indexers with
  different worker histories (one restarted) store different rows for a block and their per-block digests differ from
  that block on.
- **Effort:** small to investigate (measure on the recorded tapes); medium to fix (a canonical stored form).
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-02, at the stage-1 gate of the `ledger-refcount` change (its fix check's finding N1; the change's
  `design.md` §4.6–§4.7).

## Problem

A ledger node's key is the hash of its payload and its children's hashes, and a child's hash is the same whether the
child is embedded (`ArenaKey::Direct`) or referenced (`ArenaKey::Ref`). So one key can have two child lists. The
`nodes` table keeps the first one written (`INSERT … ON CONFLICT (node_key) DO NOTHING`), and `core-arch`'s design §10
states "a node is its key's content". If a package builds the same node sometimes with a small child embedded and
sometimes with it referenced, depending on what its memory holds (a restarted worker loads stored forms; a running one
may hold a node it persisted), then:

- a node inserted again can carry the other form, and its referenced small child is written as a new row on that
  machine only;
- a node created again after a deletion can be written in a different form on two machines.

Either way the stored rows, and every later per-block digest of `core_ledger_state.nodes`, differ between two machines
that processed the same chain. Reclamation (the mark-and-sweep today, reference counting after `ledger-refcount`) keeps
such a row for a block or deletes it, but cannot make its insertion deterministic.

## Evidence

- A child's hash does not depend on its form: `upstream:storage-core/src/arena.rs:2847-2880` (upstream's test of one
  hash as `Direct` and `Ref` in one parent); `test/ledger/node-format.ts:139`.
- A newly built child is embedded when small: `upstream:storage-core/src/storable.rs:139-159`.
- `Sp::persist` turns a small node into a referenced one, "baked into behaviour": `upstream:storage-core/src/arena.rs:1525-1540`;
  `Sp::into_tracked`: `arena.rs:1329-1352`.
- The ledger's `RcMap` builds `Ref` children for keys: `upstream:storage/src/delta_tracking/rcmap.rs:199, 224, 251`.
- UmbraDB's patches track every persisted root (`hold_as_node`): `vendor/ledger/v9/patches/0003-ledger-wasm-node-store-exports.patch:333-334, 383, 483, 503`
  (and `v9-rc3`'s, and `v8`'s `0003:299-300, 349, 449, 469`).
- A node loaded from the database keeps its stored form: `BackendLoader`, `vendor/ledger/v9/patches/0003-…:319`, through
  `upstream:storage-core/src/arena.rs:975-990` (`child.clone()`).
- No divergence observed so far: `core-arch` A160 (a worker restart gives the uninterrupted run's rows), A55 (cross-backend
  contents hash), and the local preprod restarts of the organizer's P13.1 runs ended with equal contents hashes.

(`upstream:` is `midnight-ledger` at tag `ledger-9.1.0.0-rc.5`, `67f9f97246339539af0091c4d8c6bc5ab236a191`.)

## Suggested fix

1. Measure: on every recorded tape, count the nodes inserted again whose batch child list differs from the stored one,
   and the new small nodes referenced only by such a form (the `ledger-refcount` change's R21 does this).
2. If any appear: store a canonical form (each child embedded exactly when small, by `child_from`'s rule) computed by
   UmbraDB before writing, so a key has one stored form whatever the package's history; check that the package loads
   that form; or halt on a form that differs from the stored one, so a divergence is never silent.
