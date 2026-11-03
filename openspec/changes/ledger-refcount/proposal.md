# Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)

> **Status:** Proposed — at the stage-1 gate (the cold adversarial review, then the owner's approval); no code.

## Why

`core-arch` LG-14 deletes the ledger nodes no live state reaches with the ledger's `gc-v1` mark-and-sweep, given a
fixed budget of 10,000 node units per block (`src/backbone/core-ledger-state/sweep.ts`). While the stored node set is
small, a whole mark-and-scan cycle fits in one block, so every block marks every live node again: it reads and parses
the child list of every stored node. A preprod sync from genesis on PostgreSQL 18 (every core module but
`core-contract-logs-fast`, the process and the database on one Docker network) fell from about 52 heights/s in its
second minute to about 12 heights/s by height 46,700, still falling. A profile at height ~48,665 put the sweep at about
91 % of each height (84 of 93 ms); the same build with `sweep: off` ran the same heights at 104–115 heights/s
(8.7 ms a height). At that height 3,568 stored nodes hold about 7.7 MB of child lists (embedded children), against
121 KB of node data, and every block reads them all. The cost grows with the stored set until the budget caps it, then
the projected rate is 5–7 heights/s: 65–80 hours to the first runtime upgrade at height 1,568,257. (Evidence: the
organizer plan `plans/00028-umbradb-core-arch-startumbradb.md`, P13.3 and P13.4; its questions file, Q-37 and Q-38.)

Reference counting makes the cost follow what a block changes instead of the ledger's size. On preprod a block writes
about 9 nodes and releases about 9; counting them costs about 40 row writes per block (estimated, `design.md` §9),
against today's re-read of every child list. The stored ledger has every property counting needs: it is acyclic (a key
is the hash of its payload and its children's hashes), every reference is stored, and every new node is reachable from
a persisted key. Midnight's own storage library kept a reference count per node in its `layout-v1` before `layout-v2`
removed it; UmbraDB keeps `layout-v2`'s keys and roots, and counts beside them.

A node's key does not depend on whether a small child is embedded in it or referenced by key, so one node can have
several child lists, and the ledger reads them back in its own storage-cost accounting. When the ledger writes a node
it already wrote, the node's own storage replaces it; UmbraDB keeps the first copy, so a worker restarted from
UmbraDB's database could read an older child list than the ledger last wrote (issue `docs/issues/00078`). And when
the ledger creates again a node it already holds, it keeps the old copy, while a worker that does not hold it writes
it anew (reported upstream, issue `docs/issues/00079`): two indexers with different restart histories can spell the
same nodes differently. The owner decided (O-8) to match the node — the stored child list is the one the ledger last
wrote — and to compare the ledger's node tables by **the nodes they hold**, which no spelling changes, instead of by
their bytes; and (D-7) that the vendored ledger only exposes inner workings, so none of this changes the ledger.

The owner decided the design's points on 2026-11-02 (organizer research `research/00034-ledger-node-refcount.md` §7,
Q-A … Q-F; organizer `spec/00034-ledger-node-refcount.md` §3, O-1 … O-8; restated in `design.md` §0):

- the counts are computed in the process, in `core-ledger-state`'s step, not by database triggers (Q-A);
- no database written by an earlier build is upgraded in place: there are none (Q-B);
- no cap on the deletions of a block, and no special rule for a large one (Q-C, O-3);
- a release's whole chain of newly unreferenced nodes is deleted in one block (Q-D);
- the runtime mark-and-sweep is removed; its reference model stays in the tests as an oracle until the local preprod
  run passes (Q-E);
- the change lands in the pull request that carries `core-arch` (PR #16), like `start-umbradb` (Q-F);
- the `sweep` key stays (O-1); every part ships one migration (O-2); one halt code (O-6); nodes stored as the node
  stores them and compared by content (O-8); no deep change to the vendored ledger (D-7).

## What changes

1. **Nodes stored as the node stores them** (LG-11, rewritten; `design.md` §2.2): when the ledger writes a node it
   already wrote with another child list, the stored child list is replaced, as both of the node's storage back-ends
   do; a node written again unchanged touches no row.
2. **The node tables compared by content** (LG-11; DT-3 and DT-4, modified; `design.md` §2.5): `nodes`,
   `ref_counts` and `unreferenced` become content-defined tables. The contents hash takes `nodes` by its node set (the
   keys of its rows and of every node embedded in them) and checks `ref_counts` and `unreferenced` against the rows;
   none of the three is captured or digested per block, since what they hold is fixed by `root_counts`, which is. Two
   indexers that processed the same chain then have equal contents hashes and digests whatever their restart
   histories (R28, R29).
3. **Reclamation by reference counting** (LG-14, rewritten and renamed; `design.md` §3–§5): `core-ledger-state`
   keeps, for every stored node, the number of references to it in the stored child lists (with repeats, through
   embedded children). Each block, from the tables as committed at h − 1 and the block's flushed batch, it counts the
   references of the nodes it writes new or rewritten (subtracting a rewritten node's old references), deletes the
   nodes queued at h − 1 that nothing references or persists, cascades the deletion through the children it leaves
   unreferenced, queues every stored node left with neither a reference nor a root count (in practice the roots the
   block released), checks the result, evicts the deleted nodes from the ledger worker and writes everything in the
   block's one transaction. A released state's nodes, and a reference a rewrite drops, are deleted one block later,
   never in the block that releases them.
4. **The stored layout and one migration per part** (LG-11; `design.md` §2.1, §2.4): two tables,
   `core_ledger_state.ref_counts` and `core_ledger_state.unreferenced`, replace the sweep's `sweep`, `grey` and
   `marks`. Every part is a first version on this branch, so `core-ledger-state`, `core-chain` and
   `core-private-source` each fold their `002` into `001`: a database written by an earlier build is refused at startup
   with `migration-checksum-changed` (DB-9).
5. **`sweep: off`** (LG-14; the `core` entry's data field of CF-4, gated by the development opt-in of CF-9): no ledger
   node is deleted while it is off; the counts and the queue are still kept, so turning it on again needs no reset.
6. **New checks that halt** (`design.md` §3.3, §10): a negative count, a reference of a new or rewritten node or a
   newly persisted key that is not a stored node, and a write whose affected rows differ from the computed ones halt the
   block with one new code, `ledger-refcount-invalid`, with nothing of the block stored. Today the sweep tolerates a
   reference to a missing node.
7. **The runtime mark-and-sweep is removed** (Q-E; `design.md` §11): `src/backbone/core-ledger-state/sweep.ts`, its
   statements in `sql.ts`, `sweepReset`, the grey picker seam and `SWEEP_BUDGET`. The tests of the runtime sweep go
   with it; the sweep's reference model stays in the tests as the differential oracle and is retired, with the two
   criteria that use it, by a close-out task once the local preprod criteria pass.
8. **Acceptance:** criteria R1 … R29 (`acceptance.md`); `core-arch`'s A104, A105, A134 and A160 rewritten. A105's
   required test id `ledger.sweep-cross-backend-identical` is replaced by `ledger.refcount-cross-backend-identical`.

## Non-goals (what this change does NOT cover)

- **No database triggers** compute or apply counts (Q-A). Only `core-ledger-state` writes its tables, as today.
- **No in-place upgrade** of a database written by an earlier build, no build of counts from an existing node set, no
  restore of a backup taken by an earlier build (Q-B).
- **No cap and no spreading** of a block's deletions (Q-C, O-3). The block after the v8 state's release at a v8 → v9
  conversion deletes every node of it that no root reaches, at once, by the same rules as any block; R21 reports its
  size and R22 checks it.
- **No rewriting of what the ledger writes**: UmbraDB stores the child lists the package flushes, never a form of its
  own; keys, hashes, the `layout-v2` encoding, the package's flush, the node-store bridge and the eviction path (LG-14's
  restart after a refused eviction, owner decision Q144 B) are unchanged, and no vendored package gets a new patch.
- **No table leaves the contents hash**: the node tables take part by their content instead of their bytes; every
  other table of `core-ledger-state` stays byte-hashed and digested (DT-3 … DT-5). Content-defined tables are a core
  mechanism, not offered to user modules (no change to MD-1, which `start-umbradb` also amends).
- **No change to the retention window** (LG-12), the v8 → v9 conversion (LG-9), contract keys (LG-13's rule), or
  backups' format (BK-1 … BK-5).
- **No change to the migration rules** (DB-9, DB-10): later versions still add migrations; only this first version's
  parts are folded to one each.
- **No equal bytes for the node tables across restart histories.** Equal node sets are guaranteed; equal spellings
  are not, as the ledger itself does not give them (issue 00079). Rebuilding the ledger's memory every block, which
  would, was set aside for its cost.
- **No performance work outside reclamation:** the node's runtime-version call made once per block (O-5), the cost of
  decoding `bytea` results in `src/deterministic-postgresql/` (Q-38's option D), and splitting the conformance suite
  (issue 00077) are separate items.
- **No rename** of the `core` entry's `sweep` key (O-1), so no change to CF-4 or CF-9, which `start-umbradb` also
  amends.

## Impact

- **Databases:** a database written by `v0.10.0-rc.1`, `v0.10.0-rc.2` or any earlier build of this branch is refused at
  startup (`migration-checksum-changed`, naming the first part whose `001` changed and both checksums); it resyncs into a
  new database. A backup taken by such a build is refused by `umbradb restore` with `backup-build-mismatch` (BK-3).
  `CHANGELOG.md` says so in one line.
- **Contents hash and digests:** DT-3 and DT-4 gain content-defined tables; the exported `contentsHash` hashes
  `core-ledger-state`'s node tables by content and can fail with `ledger-refcount-invalid` when they are inconsistent;
  the per-block digests no longer cover those three tables (less work per block: their rows are no longer copied for
  change capture). The tables of `core-ledger-state` change (two added, three gone), and where a sweep cycle would have
  spanned blocks fewer rows are kept. Contents hashes and digests are compared only between databases built by the
  same build.
- **Codes:** one new halt code, `ledger-refcount-invalid` (`ERROR_CODES`, `HALT_CODES`, `core-arch` design §11, the
  code registry test).
- **Required tests:** the A105 id is replaced (the pinned count stays 22).
- **Issue 00078** is closed by this change at close-out; **issue 00079** goes upstream with the owner's approval.
- **Delivery:** in PR #16 on branch `00028-core-arch` (Q-F). `core-arch` is archived first, then `start-umbradb`, then
  this change (`design.md` §0).
