# 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history

- **Status:** OPEN — the fix is specified in the `ledger-refcount` change (`openspec/changes/ledger-refcount/`,
  `design.md` §2.2 and §4.4; owner decision O-8, 2026-11-02: "lets match the node"); closed when that change is
  implemented
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

## Fix (specified in `ledger-refcount`)

Rewriting stored child lists into one form would not do: the ledger's storage-cost accounting reads a node's child
list and counts referenced and embedded children differently (`upstream:storage/src/delta_tracking/mod.rs:199-300`),
so a restarted worker reading a rewritten form could compute another state than the node. The owner chose to match the
node instead:

1. When the ledger writes again a node already stored with another child list, the stored child list is replaced, as
   both of the node's storage back-ends do (`upstream:storage-core/src/db/sql.rs:578-590`, `INSERT OR REPLACE`;
   `upstream:storage-core/src/db/paritydb.rs:261-280`, `Set`); a node written again unchanged touches no row. A
   restarted worker then rebuilds its memory from the child lists the ledger last wrote, as a restarted node does.
2. Reference counting subtracts a rewritten node's old references and adds its new ones, and keeps a reference a
   rewrite drops one block longer, since the state the worker still holds may reach it.
3. Criteria R27 (a rewrite replaces the row and counts it) and R28 (a never-restarted run and runs restarted at 20
   heights store identical rows and digests, on the fixture and the recorded tapes) verify it; R21 counts rewrites on
   the tapes. If R28 ever fails, the fallback is to start every block from the database with nothing carried in the
   ledger's memory.
