# Design — LEDGER-REFCOUNT: stored ledger nodes in one form, reclaimed by reference counting

Section numbers of `core-arch` are cited as `core-arch design §n`. Requirement ids are `core-arch`'s (`LG-*`, `CF-*`,
`DB-*`, `DT-*`, `BK-*`, `RN-*`); criteria are this change's `R1` … `R30` and the rewritten `core-arch` criteria
(`acceptance.md`). `organizer:` names a path under `/Users/edwardalvarado/todo/Umbra` (the owner's workspace, not in
this repository); `upstream:` names the `midnight-ledger` checkout at tag `ledger-9.1.0.0-rc.5`
(`67f9f97246339539af0091c4d8c6bc5ab236a191`, the commit `vendor/ledger/v9/upstream.json` builds from).

## 0. Baseline and decisions

**Baseline and archive order.** The spec delta modifies requirements of `core-arch`, which is not archived:
`openspec/specs/` holds no baseline for the `ledger` capability. `core-arch` is archived first, then `start-umbradb`,
then this change. `start-umbradb` modifies no `ledger` requirement (its deltas: `admin-endpoints`, `backups`,
`configuration` CF-1 and CF-4, `library-mode`, `library-surface`, `modules`, `private-processes`, `runner`), so the two
changes touch no requirement in common. This change's delta (`specs/ledger/spec.md`) renames LG-14 (`## RENAMED
Requirements`, FROM/TO, as the repository's OpenSpec skill describes it,
`.claude/skills/openspec-sync-specs/SKILL.md:46, 75-76, 112-115`) and restates LG-11, LG-13 and LG-14 whole under
`## MODIFIED Requirements`, each header matching `core-arch`'s exactly (LG-14's after the rename). It changes no
`configuration` requirement, since the `sweep` key stays (O-1). Both changes land in PR #16 (decision Q-F).

**The owner's decisions** (2026-11-02; organizer `research/00034-ledger-node-refcount.md` §7 for Q-A … Q-F, organizer
`spec/00034-ledger-node-refcount.md` §3 for O-1 … O-8):

| # | Decision | What it fixes here |
|---|---|---|
| Q-A | Counts are computed in the process, not by database triggers | §3: `core-ledger-state` computes in `on-compute`, writes in `on-db-write`; no trigger |
| Q-B | No existing database is upgraded ("we are in development, there are no databases") | §2.5: an earlier build's database is refused |
| Q-C | No cap on a block's deletions | §3.3 rule 4 runs to the end |
| Q-D | The cascade runs inside the block | §3.3 rule 4; §4.5 |
| Q-E | The runtime sweep is removed; its model stays in the tests as the oracle until the local preprod run passes | §11: the sweep's model and the criteria that use it (R2, R4) retire together at close-out |
| Q-F | The change lands in PR #16, branch `00028-core-arch` | this section |
| O-1 | Keep the `core` entry's `sweep` key | §6: `off` deletes no node; counts kept |
| O-2 | One migration per part, across the branch: every part is a first version (`main` has none of them) | §2.5: `core-ledger-state`, `core-chain` and `core-private-source` each declare only `001` |
| O-3 | The block after a release deletes what it must, whatever its size: no special rules | §9.2 |
| O-4 | The local performance target: ≥ 80 % of the no-reclamation rate in every 10,000-height band from 10,000 to 50,000 | §12.3, R23 |
| O-5 | The node's runtime-version call per block is a separate work item | the proposal's Non-goals |
| O-6 | One halt code, `ledger-refcount-invalid`, with a reason | §10 |
| O-7 | Q-38 (which performance work first) is resolved by this change | none (workspace record) |
| O-8 | Storage is deterministic by design, in this change: every node is stored in one form | §2.2, §2.3, §4.4; issue `docs/issues/00078` |

## 1. Words

| Term | Meaning |
|---|---|
| node, key | A ledger node: a payload (`data`) and a child list (`children`, the ledger's serialization). Its key (32 bytes) is the hash of its payload and its children's hashes (`upstream:storage-core/src/arena.rs` `hash`). |
| child, reference, embedded child | A child is `ArenaKey::Ref` (a 32-byte key, the child stored elsewhere) or `ArenaKey::Direct` (the child's payload and child list inline). A **reference** is one occurrence of a key as a `Ref` child, found through embedded children (`src/ledger/node-refs.ts` `childRefKeys`); a key listed twice is two references. |
| small | A node whose payload and children fit the ledger's limit: `2 + |data| + Σ` each child's serialized size `≤ 1,024` (`upstream:storage-core/src/storable.rs:42, 150-159`). |
| form | A node's child list. A child's hash is the same embedded or referenced (`upstream:storage-core/src/arena.rs:2847-2880`), so one key can have several forms. |
| one form | The form defined from the leaves up: each child is embedded, in its own one form, when that one form is small, and referenced otherwise — `child_from`'s rule (`storable.rs:139-148`) applied to one forms. It is the form the ledger builds when it creates every node afresh, and a function of the node's content alone. |
| row | A node stored in `core_ledger_state.nodes`. A node is a row exactly when its one form is not small or its key has a root count (§2.3). |
| `S_h` | The keys of `nodes` after block h. |
| `refs_h(k)` | The number of references to k in the (one-form) child lists of the rows of `S_h`. |
| `roots_h(k)` | k's root count after block h (`root_counts`; 0 without a row). A **persisted key** after h is a key with `roots_h(k) > 0`. |
| `R_h` | The rows reachable from the persisted keys after h through stored child lists. `R_{−1}` is empty. |
| batch `B` | What the ledger worker gives for block h (`src/ledger/types.ts:54-62`): `B.inserts`, nodes in their one form, and `B.rootCounts`, one netted signed change per key. |
| new nodes `N` | The nodes of `B.inserts` whose key is not in `S_{h−1}`. A node of `B.inserts` already in `S_{h−1}` is **inserted again** (the package writes content again after its memory dropped the stored copy, `upstream:storage-core/src/backend.rs:532-534`, and on a restarted worker). |
| `K_h` | The rows reachable through stored child lists from the persisted keys after h − 1 and after h, and from h's new nodes: what block h keeps. |
| protected in h | A key with a root count after h − 1 or after h. |
| queue `Q_h` | The keys of `unreferenced` after block h. |
| the worker's store | Nodes the package flushed that are not rows (small, not persisted), kept in the ledger worker's memory (§2.3). |
| content set | Every key a database holds as a row or embedded in a row; it does not depend on forms (§4.5). |

## 2. Storage

### 2.1 The tables of `core-ledger-state`

| Table | Primary key | Other columns | Holds after block h |
|---|---|---|---|
| `nodes` | `node_key` | `data`, `children` (the one form) | `S_h` |
| `root_counts` | `node_key` | `count integer CHECK (count > 0)` | `roots_h` (unchanged, `src/backbone/core-ledger-state/sql.ts:60-64`) |
| `states`, `segment_results`, `events` | unchanged | unchanged | unchanged |
| **`ref_counts`** | `node_key` (`bytea`, `CHECK (octet_length(node_key) = 32)`) | `count integer NOT NULL CHECK (count > 0)` | one row per key with `refs_h(k) > 0`, holding it |
| **`unreferenced`** | `node_key` (`bytea`, `CHECK (octet_length(node_key) = 32)`) | — | `Q_h` |

`sweep`, `grey` and `marks` are gone. The `ledger-state` table item lists
`["nodes", "root_counts", "states", "ref_counts", "unreferenced"]`, kind `mutable` (`core-ledger-state.ts:589` today
lists the sweep's three). Both new tables are in the contents hash (DT-3), captured per block (DT-4) and digested
(DT-5); neither is `deterministic: false`, so a count that differs between two machines shows in that block's
`ref_counts` digest. Their column types and keys are ones DT-6's startup check accepts (as `root_counts`).

### 2.2 The one form

The package holds a node's children in whatever form it came to hold them: it embeds a small child it builds
(`child_from`, `storable.rs:139-148`), but `Sp::persist` and `Sp::into_tracked` turn a small node into a referenced
one (`upstream:storage-core/src/arena.rs:1525-1540, 1329-1352`), the ledger's `RcMap` builds referenced children for
keys (`upstream:storage/src/delta_tracking/rcmap.rs:199, 224, 251`), UmbraDB's `hold_as_node` tracks every persisted
root (`vendor/ledger/v9/patches/0003-ledger-wasm-node-store-exports.patch:333-334, 383, 483, 503`; the same in
`v9-rc3`'s `0003` and `v8`'s `0003:299-300, 349, 449, 469`), and a node loaded from the database keeps the form it was
stored in (`BackendLoader`, patch `0003-…:319`, through `arena.rs:975-990`). Only referenced nodes are objects of the
package's storage back-end (`arena.rs:535-555`), so only they are flushed.

So a form can depend on what the package's memory held, which differs between a worker that has run since genesis and
one restarted from the database (issue `docs/issues/00078`). UmbraDB therefore stores every node in its **one form**
(§1), a function of the node's content alone. The package accepts it: it reads a node from UmbraDB's node store by key
and checks only that the content hashes to the key (`vendor/ledger/v9/patches/0001-storage-core-external-node-store.patch:133-141`),
and the hash does not depend on the form; and the one form is the form the ledger itself builds for fresh content.

The worker computes the one form with the package's own code: each vendored package (`v8`, `v9-rc3`, `v9`) gets a
patch exporting it, applied to every node `flushNodes` takes, from the leaves up. To decide whether a referenced child
is small, the worker needs the child's size: from the batch, from the package's memory, from its own store (§2.3), or
— for a child it has not got — through the node store. A child that came to the package by reference from a stored one
form is a row, so it is not small unless persisted; a small child held by reference comes from the package's own
tracking, so the worker usually has it in memory. R21 measures how many node-store reads the one form needs per block.

### 2.3 Rows, persisted keys and the worker's store

A node is a **row** exactly when its one form is not small (every parent then references it) or its key has a root
count. A small node whose key has no root count exists only embedded in the one forms of its parents.

- **The batch.** For block h the worker gives, in `B.inserts`, the one form of every node `flushNodes` took that is a
  row by that rule, and of every key whose root count rises in h that is not already a row (taken from the package's
  pending nodes or from its own store). Every other node `flushNodes` took — small, not persisted — goes to the
  worker's store.
- **The worker's store.** The package believes the nodes it flushed are stored, and may read one back by key after its
  memory dropped it. The worker keeps those nodes in memory, by key, and answers the package's node-store reads for them
  itself, before asking the main thread (as it already serves the pending block's own nodes, `core-arch` design §5.3).
  After each committed block the worker asks its package to forget the keys of its store; a key the package forgets is
  dropped, a key it refuses (a live object holds it) is kept. This eviction is best-effort and never restarts the
  worker. When the step deletes rows (rule 4), the worker also evicts, with them, every node of its store that reaches a
  deleted row through its own children or other nodes of the store, and drops it; such a node is reached by no live
  state (§4.1, §4.2), and a refusal follows the eviction's path of rule 8. So the package never keeps, as stored, a small
  node whose references are gone: a later block that needs it writes it again, with the rows it references. A restarted worker starts with an empty store: its package loads states from one forms, which embed those
  nodes, so it never asks for them by key. The store is not in the database, not in the contents hash, and not in
  backups.

### 2.4 Invariants

After every committed block h with `core-ledger-state` active:

- **I0 (one form):** every row's `children` is its one form; no row is a small node without a root count.
- **I1 (closed):** every reference in a row's child list is a row.
- **I2 (counts):** `ref_counts` holds exactly the keys with `refs_h(k) > 0`, each with `refs_h(k)`.
- **I3 (queue):** `Q_h = { k ∈ S_h : refs_h(k) = 0 and roots_h(k) = 0 }`.
- **I4 (roots resolve):** every key with `roots_h(k) > 0` is a row. With I1, every retained state and every persisted
  contract and zswap state loads from the database with all it reaches.
- **I5 (no leak):** with `sweep` on at h, every key of `Q_{h−1}` that is not protected in h and gains no reference in h
  is gone after h, and so is every row that only such keys reached.
- **I6 (exact set):** `R_{h−1} ∪ R_h ⊆ K_h ⊆ S_h`; with `sweep` on at h, `S_h = K_h`; and when every new node of h is
  reached from a persisted key after h (the flush, §4.6), `K_h = R_{h−1} ∪ R_h`.

By I1 and I3, every row is reached from a persisted key or from a queued key, so the queue names all the garbage.

### 2.5 Migrations: one per part (O-2)

Every part these migrations belong to is new on this branch against `main`, which has no `src/backbone/` and no
migration runner, so each part ships one migration, `001`:

| Part | Today | After |
|---|---|---|
| `core-ledger-state` | `001` (`nodes`, `root_counts`, `states`, `segment_results`, `events`), `002` (the sweep's `sweep`, `grey`, `marks`; `sql.ts:102-121`) | `001` creates `nodes`, `root_counts`, `states`, `segment_results`, `events`, `ref_counts`, `unreferenced` |
| `core-chain` | `001` (`core_chain.config`), `002` (`core_chain.identity`; `src/backbone/core-chain/sql.ts:36-69`) | `001` creates both tables |
| `core-private-source` | `001` (`cursor`), `002` (`accepted_config`, declared `deterministic: false`; `src/backbone/core-private-source/sql.ts:26-47`) | `001` creates both tables |

Every other part already has one (`git grep 'id: "00'` over `src/`). The migration runner's own tests keep their
synthetic modules with two migrations (`test/db/migrate.test.ts`, `test/config/history-fixtures.ts`): they test DB-9
and DB-10, which are unchanged. A database written by an earlier build (`v0.10.0-rc.1`, `rc.2`, or this branch before
this change) recorded the old `001` of these parts, so its startup refuses before any migration runs with
`migration-checksum-changed`, naming the first such part, `001` and both checksums (DB-9, `src/db/migrate.ts`
`checkApplied`); `umbradb restore` of its backup refuses with `backup-build-mismatch` (BK-3). It resyncs into a new
database (decision Q-B). `requiresResync` (DB-10) could not express this: every core part carries `UMBRADB_VERSION`
(`src/config/build.ts:46`, `"0.10.0"`, the version of `rc.1` and `rc.2` too), and the check compares versions.

## 3. The reclamation step

### 3.1 Where it runs

As the sweep does today (`core-arch` design §5.4; `core-ledger-state.ts:489-535`): in `on-compute`, after the apply and
the root check, `core-ledger-state` computes block h's step from on-compute's read (the tables as committed at h − 1)
and the batch held in memory, has the worker evict the deleted nodes, and keeps the step for `on-db-write`, which
writes it after the batch (`writeBlock`, `core-ledger-state.ts:452-472`). The step is a pure function behind a tables
seam, as `sweepStep` is behind `SweepTables` (`sweep.ts:84-101`): `refcountStep(tables, batch, { on })`, where `on` is
whether the `core` entry's `sweep` is on at h. It holds no state between blocks.

### 3.2 Inputs

On-compute's read at h − 1, giving `S_{h−1}` (by key), `refs_{h−1}`, `roots_{h−1}` and `Q_{h−1}`; and `B`, in one
forms (§2.3). `Δ(k)` is the netted change of k's reference count in h, 0 unless set below; `roots'(k) =
roots_{h−1}(k) + δ(k)`, where `δ(k)` is k's change in `B.rootCounts` (0 if absent).

### 3.3 The rules, for block h

1. **New nodes.** `N` = the nodes of `B.inserts` whose key is not in `S_{h−1}`. Only they change counts; a node
   inserted again has the stored one form already and changes none.
2. **Increments.** For each node of `N`, for each reference k in its child list: `Δ(k) += 1`.
3. **Protection.** A key with a root count after h − 1 or after h is not deleted in h.
4. **Deletions, when `on`.** Starting from the keys of `Q_{h−1}`, repeat: every candidate k not yet deleted, not
   protected, with `refs_{h−1}(k) + Δ(k) = 0`, is deleted; for each node deleted in that round, for each reference k in
   its stored child list, `Δ(k) −= 1` and k becomes a candidate — until a round deletes none. `D` is the set deleted.
   When not `on`, `D` is empty. No limit bounds `D` (Q-C); it holds a released state's whole chain of newly
   unreferenced rows (Q-D).
5. **Counts after h.** `refs_h(k) = refs_{h−1}(k) + Δ(k)` for every key with `Δ(k) ≠ 0`.
6. **Queue after h.** `Q_h = { k ∈ S_h : refs_h(k) = 0 and roots'(k) = 0 }`, where `S_h = (S_{h−1} \ D) ∪ keys(N)`,
   computed over the keys whose membership can change in h — `Q_{h−1}`, the keys of `N`, the keys with `Δ(k) ≠ 0`, the
   keys of `B.rootCounts` — since any other row keeps its count and its root count. A key that enters the queue in h is
   deleted no earlier than block h + 1. In practice it holds the roots the block released.
7. **Checks** (§3.4), before eviction.
8. **Eviction.** The worker evicts `D` (`LedgerHost.evict`), in `on-compute`, before the block's transaction, as today
   (`core-ledger-state.ts:504`). A refusal after the worker freed every object it can restarts the worker and computes
   the block again, rules 1–8 included (`computeBlock`, LG-14, Q144 B, unchanged).
9. **Writes**, in `on-db-write` after `writeBlock`'s statements: the netted `Δ` of every key with `Δ(k) ≠ 0` merged
   into `ref_counts` (the shape of `root_counts`' merge, `sql.ts:138-142`: deltas added, a count reaching 0 deleted);
   `Q_{h−1} \ Q_h` deleted from `unreferenced` and `Q_h \ Q_{h−1}` inserted; `D` deleted from `nodes`. Each statement
   over a key list is chunked by `NODES_PER_STATEMENT` (1,000, `core-ledger-state.ts:146`), as the node inserts are. The
   result does not depend on the statements' order or chunking.

Why rule 3's two conditions: a key whose count reaches 0 but had a root count at h − 1 is in `R_{h−1}`, still held by
the worker during h (`docs/issues/00019`); if its root count also fell to 0 in h, rule 6 queues it and it is deleted at
h + 1 at the earliest. A key with a root count after h is in `R_h`.

### 3.4 Checks

Each check halts processing at h with `ledger-refcount-invalid` (§10) and nothing of the block stored; none repairs.

| `details.reason` | Fails when | Where |
|---|---|---|
| `negative-count` | some `refs_{h−1}(k) + Δ(k) < 0` | `on-compute`, before eviction |
| `missing-reference` | a reference in a new node's child list, or a key whose root count rises in h, is not in `S_h` (neither in `S_{h−1} \ D` nor a key of `N`) | `on-compute`, before eviction |
| `row-count-mismatch` | a write affects another number of rows than computed: the node inserts (summed over chunks) ≠ `|N|`; the `ref_counts` merge ≠ the number of keys with `Δ ≠ 0` and `refs_h > 0`; the `unreferenced` delete ≠ `|Q_{h−1} \ Q_h|`; its insert ≠ `|Q_h \ Q_{h−1}|`; the node delete ≠ `|D|` | `on-db-write`; the transaction rolls back |

`missing-reference` keeps I1 and I4: it is new strictness, since today the sweep marks a missing key and adds nothing
(LG-14 step 3), and a root without a node only fails later, when its state is loaded. The preprod snapshot at 48,665
has no reference to a missing node and no root without a node (organizer
`research/00034-ledger-node-refcount-data/analyze.out.json`: `missingChildRefs` 0, `rootsWithoutNode` 0). A new node
nothing references or persists is not a check: rule 6 queues it.

### 3.5 Reads

All through on-compute's read at h − 1, each an indexed lookup by key list (`= ANY($1::bytea[])`), chunked by 1,000
keys: which keys of `B.inserts`, of the references of `N`, and of `B.rootCounts` are rows; `unreferenced` in full (on
preprod 1–2 rows); `root_counts` and `ref_counts` of the keys of `Q_{h−1}`, of `B.rootCounts` and of each round's
candidates; and, per round of rule 4, the stored child lists of the nodes the round deletes. A round's child lists are
parsed to references (`childRefKeys`) and their bytes dropped before the next chunk, so memory follows the number of
references, not the child lists' size. The number of rounds is at most the depth of the deleted chain (5 on the
preprod snapshot).

## 4. Properties

### 4.1 Reachability does not depend on the form

Two forms of one node differ only in whether a small child is embedded or referenced; the rows a node reaches through
any of its forms are the same, since a small child embedded in the one form contributes its own references to its
parent's child list (`childRefKeys` reads through embedded children). So a row a state reaches through the forms the
package holds in memory, it also reaches through the stored one forms. The small nodes the package holds by reference
and that are not rows are in the worker's store, not in `nodes`, and the step never deletes them.

### 4.2 Safety: no deleted row is live

Every key of `D` is in neither `R_{h−1}` nor `R_h`, and no root after h − 1 or after h. By induction on the rounds of
rule 4: a deleted key d is not protected, and `refs_h(d) = 0`, which counts every reference in the stored child lists
of `S_{h−1}` minus the deleted rows' plus the new nodes'. So every row of `S_{h−1}` that referenced d was deleted in an
earlier round (in neither set, by induction), and no new node references d. By §4.1, neither the state the worker holds
at h − 1 nor the state it builds at h reaches d, in whatever form it holds them: the condition `docs/issues/00019`
sets (the eviction does not refuse a live state's root, so this is kept by the rule, not by the refusal). A node of the worker's store that reaches d is reached by no live state either (if a state reached
it, its references, d among them, would be the state's references by §4.1), so it is evicted with d (§2.3). Only an
object outside those states (a kept parse) can still hold d; the existing free-and-retry and restart path handles it
(§5).

### 4.3 No leak (I5) and the exact set (I6)

`K_h ⊆ S_h` by §4.2: a deleted key is no root and no new node references it. With `on`, every row of `S_{h−1}` outside
`K_h` is deleted, by induction on the length of the longest chain of stored parents above it (the graph is acyclic: a
key is the hash of its children's hashes, so a cycle needs a hash fixed point; the preprod snapshot has none). A row k
outside `K_h` with no parent in `S_{h−1}` is not a root at h − 1 (else it is in `R_{h−1} ⊆ K_h`), so it is in `Q_{h−1}`
(I3); it is not protected and no new node references it (either would put it in `K_h`), so rule 4 deletes it. A row k
with parents in `S_{h−1}`: each parent is outside `K_h` too (`K_h` is closed under stored child lists), so by induction
each is deleted in h; with no new node referencing k and no protection, its count reaches 0 and rule 4 deletes it.
Since a new node is in `K_h`, `S_h = K_h`; I5 follows. When every new node is reached from a persisted key after h,
`K_h = R_{h−1} ∪ R_h`. This holds also at the first block with `sweep` on after blocks with it off: I3 holds
throughout, so `Q_{h−1}` holds every parentless non-root row those blocks left.

### 4.4 Determinism across worker histories (O-8)

The rows after h are a function of the rows after h − 1 and of block h, whatever the worker's history (a restart, its
cache, the forms it holds):

- **The forms.** Every row is written in its one form, a function of content (§2.2).
- **Which rows are new.** The rows written in h are the nodes reachable from the keys whose root count rises in h
  through one forms that are rows by §2.3's rule and are not rows yet. A node that is a row by that rule and not stored
  is never believed stored by the package (a deleted row is evicted, so forgotten, §5, and so is every node of the
  worker's store that reaches it, §2.3; a node in the worker's store is small and not persisted, so not a row by that
  rule), so `flushNodes` takes it, or the worker adds it from its store when it is a persisted key (§2.3). Nodes inserted again change nothing (rule 1, and they are already in their one
  form). The small nodes the package flushed that are not rows go to the worker's store, not to the database.
- **The root counts** are the engine's: the new state persisted, the released states, the contract keys (`core-arch`
  design §5.4), functions of the chain, and the same after a worker restart (`core-arch` A160).
- **The step** is a function of the tables at h − 1 and `B` (§3).

By induction from genesis, two indexers that processed the same chain store the same rows, counts, queue and digests.
R29 tests it with a test package that holds a small child by reference in one run and embedded in another; R13 and A160
with restarts. This closes issue `docs/issues/00078` once implemented.

### 4.5 Equal to the sweep where its cycle fits one block

The sweep stores the package's forms, so its rows and counting's differ where a small node is a row under the sweep
(held by reference) and embedded under counting; compare the **content sets** instead (every key a database holds as a
row or embedded in a row, computed by hashing each embedded node, `test/ledger/node-format.ts`), which do not depend on
forms. LG-14's sweep, when a whole cycle starts and ends in block h, marks from the root counts at h − 1 and the keys
whose count rose in h (`sweep.ts:197-208`) through stored and batch child lists (`sweep.ts:218`) and deletes every
unmarked row, keeping the content reachable from the persisted keys after h − 1 and after h; counting keeps the same
content (`K_h`, with every new node reached from a rising key, §4.6). Both start empty at genesis, so their content sets
are equal at every height up to the first block whose cycle does not fit. On preprod every block so far ran a whole
cycle in-block (`sweep.cycle` = height + 1, cycle 46,739 when the run stopped near 46,738: organizer plan P13.3 and
questions Q-37). Where a cycle spans blocks, the sweep deletes a row only if nothing reachable from the roots at the
cycle's start or from any key that rose during it reaches it, a superset of what counting keeps: counting's content set
is a subset of the sweep's. *Derived here; R2 and R4 test both claims.*

When the sweep's model is fed the counting run's batches (R4), the comparison is valid in both regimes: the sweep model
deletes a node only after counting deleted it (subset), so the counting run's package, which evicted it, writes it
again whenever a later state needs it, and the sweep model sees that insert.

### 4.6 The flush

`flushNodes` takes only nodes reachable from a key whose root count rose, through other taken nodes, and stops at nodes
the package believes stored (patch `vendor/ledger/v9/patches/0001-storage-core-external-node-store.patch:143-190`,
export patch `0003-…:386-423`; the same patches exist for `v8` and `v9-rc3`). So every new node is expected to be
reached from a persisted key after h, and its references to be rows (`missing-reference` checks the latter). A new node
that nothing references after all is queued and deleted at h + 1 unless referenced by then; R21 counts such nodes on
the tapes.

## 5. Eviction, the one-block lag and the worker restart

Unchanged from LG-14 and `core-arch` design §5.4, with the lag now set by rule 3 and rule 6 instead of the sweep's
"roots as committed at h − 1". With `retainStates` 0, block h releases the state after h − 1 (`engine.ts:554`), which
the worker holds until `commit(h)`: its root is queued at h (when unreferenced) and its rows are deleted at h + 1, after
the worker dropped that state. A row forgotten by the package but still stored is merely written again (no count
change); a row deleted but not forgotten would be referenced by a later new node without being written —
`missing-reference` halts that block instead of storing a dangling reference. A restart after a refused eviction (Q144
B) recomputes the step from the same read at h − 1 and the new thread's batch, whose extra nodes inserted again change
no count; the new thread starts with an empty store (§2.3).

## 6. `sweep: off` (O-1)

The key keeps its name, values and kind (CF-4: data field, `on` or `off`, default `on`) and stays gated by the
development opt-in (CF-9; `src/config/history.ts:618-636`, feature `sweep-off`). While it is off at h, rules 1–3 and
5–7 run, rule 4's `D` is empty and nothing is evicted: no row is deleted, the counts stay exact and the queue keeps
every parentless non-root row (I0–I4). The first block with it on again deletes the whole queue that is not
protected, and its cascade, by rule 4 (§4.3). Unlike the sweep (`sweepReset`, `sweep.ts:281-294`), no reset is
written when it is turned off or on. The one form and the worker's store do not depend on it.

## 7. Crash safety and restarts

The step's writes and the block's batch are in the block's one transaction (RN-6): a crash leaves h − 1 or h, never a
mix. A crash after the eviction and before the commit leaves the deleted rows stored and the restarted process with a
fresh worker, which reads them as needed: safe. A restarted process reads the counts and the queue from the database;
the step keeps nothing in memory between blocks, and the worker's store starts empty.

## 8. Determinism across backends

`ref_counts` after h is a function of `S_h` (I2), and `S_h` and `Q_h` are fixed by the rules from the tables at h − 1
and the batch; with §4.4, every machine that processed the same chain stores the same rows. The cascade's fixed point
does not depend on the order of its rounds or of a round's keys; the merge, inserts and deletes are set operations;
the statements are the shapes both backends already run (`unnest` of `bytea[]`, `= ANY`, `ON CONFLICT`, a
data-modifying `WITH`). The digests compare each key's row before and after the block (DT-4), so netting is not
visible in them either way.

## 9. Cost

### 9.1 Per block on preprod (estimated from the snapshot at 48,665; R21 measures it)

| | The sweep today (3,568 nodes, a whole cycle per block) | Reference counting |
|---|---|---|
| Child lists read and parsed | every stored node's, ≈ 7.7 MB (≈ 15.5 MB of hex), twice | the deleted rows', ≈ 10 (≈ 22 KB); the batch's are in memory |
| Lookups | a flag per marked key, a scan of every node | ≈ 9 existence checks; the counts of the ≈ 10–20 keys whose count falls; the queue (1–2 rows) |
| Count changes | — | ≈ 544 increments and ≈ 544 decrements, netting to ≈ 18 keys |
| Rows written | the batch, ≈ 9 node deletes, the sweep row | the batch, ≈ 10 node deletes, ≈ 18 `ref_counts` rows, ≈ 2 queue rows: ≈ 40 |
| Growth | with the stored set, up to 10,000 node units per block | with the block's changes |

The one form adds, in the worker, a pass over each flushed node's children, and a node-store read for a referenced
child whose size the worker does not have (§2.2; R21 counts them). Over a whole sync every row is deleted at most once
per insertion, so the deletion work is bounded by the insertion work. The ≈ 18 is an estimate (organizer
`research/00034-ledger-node-refcount-data/netting.out.txt`); R21 replaces it with measured figures.

### 9.2 The block after a ledger conversion's release (O-3)

At the v8 → v9 conversion block F the worker converts the state; the v8 state after F − 1 is released by the block
that takes it out of the retention window (F with `retainStates` 0; F + R with `retainStates` R, `engine.ts:554`). The
block after that release deletes every row of that v8 state that no persisted key then reaches — the v8 contract and
zswap-state keys persisted under LG-13 stay roots, so their rows stay — in one block, by the same rules as any other
block (owner decision O-3: no special rules, no cap). R21 reports its size on the devnet v8 → v9 tape (F = 103,
`test/backbone/contract-data.test.ts:209`); R22 checks it.

## 10. The halt code (O-6)

`ledger-refcount-invalid` joins `ERROR_CODES` (`src/deterministic-postgresql/errors.ts`) and `HALT_CODES`
(`src/runner/failures.ts:104-122`), so a failure with it halts with that code (`failures.ts` rule 1), and `core-arch`
design §11's list of halts. Its details: `reason` (§3.4), `height`, and per reason the key as `0x` hex
(`negative-count`, `missing-reference`) or the statement's name with the expected and actual row counts
(`row-count-mismatch`). It carries no configuration value. The code registry test (`test/runner/code-registry.ts`)
names the test that triggers it (A87).

## 11. What is removed, rewritten and kept

**Code.**

| Path | Fate |
|---|---|
| `vendor/ledger/{v8,v9-rc3,v9}/patches/` | A patch per package exporting the one form of a node (§2.2), listed in `vendor/ledger/README.md` (LG-5); the packages rebuilt and their recorded SHA-256 updated |
| `src/ledger/worker/` (`engine.ts`, the node store) | The batch in one forms with persisted keys as rows (§2.3); the worker's store, served before the main thread and pruned after each committed block |
| `src/backbone/core-ledger-state/sweep.ts` | Removed: `sweepStep`, `sweepReset`, `SweepTables`, `GreyPicker`, `BYTE_ORDER`, `SWEEP_BUDGET`, `writeSweep` |
| `src/backbone/core-ledger-state/sql.ts` | One migration `001` (§2.5); the sweep's statements and readers removed (`sql.ts:158-177, 297-398`); the step's reads and writes added |
| `src/backbone/core-ledger-state/refcount.ts` | New: `refcountStep`, its tables seam, `writeRefcount` |
| `src/backbone/core-ledger-state/core-ledger-state.ts` | `sweepOf` → the counting step; the `sweepBudget` and `greyPicker` options removed; the `ledger-state` item's tables (§2.1); `writeBlock` returns the inserted count |
| `src/backbone/core-chain/sql.ts`, `src/backbone/core-private-source/sql.ts` | One migration `001` each (§2.5) |
| `src/deterministic-postgresql/errors.ts`, `src/runner/failures.ts` | The halt code (§10) |
| `src/ledger/` comments that name "the sweep" (`adapter.ts:328`, `types.ts:270`, `worker/engine.ts:67-69, 642`, `worker/host.ts:107`) | Reworded to reclamation; no behaviour change |
| `src/config/core-settings.ts:177`, `src/config/history.ts`, `src/cli/config-check.ts` | Unchanged (O-1) |

**Tests.**

| Path | Fate |
|---|---|
| `test/backbone/ledger-sweep.test.ts`, `ledger-sweep-tables.test.ts` | Removed with `sweep.ts` (tests of the runtime sweep's step and tables) |
| `test/backbone/ledger-sweep-process.test.ts` (A105's required test) | Replaced by `ledger-refcount-process.test.ts` carrying `[[ledger.refcount-cross-backend-identical]]` |
| `test/backbone/ledger-sweep.negative-control.test.ts` | Replaced by the counting negative controls (R12) |
| `test/backbone/sweep-tapes.ts` | Split when the sweep is removed: the DAG fixture's plumbing (`SWEEP_LOADER`, `sweepTape`, `sweepCore`, `sweepTables`, `sweepWatcher`, `tablesByHeight`), which `eviction-restart.ts`, `ledger-eviction-restart.test.ts` and `ledger-storage.test.ts` import, moves to a kept `test/backbone/ledger-graph-tapes.ts`; their comparison with the sweep's model (`modelOfFixture`, `modelProblems`) becomes a comparison with the counting model (`test/backbone/refcount-model.ts`); what stays in `sweep-tapes.ts` serves R2 and R4 only |
| `test/backbone/sweep-model.ts` and the rest of `sweep-tapes.ts` | Kept as R2's and R4's oracle until the close-out task that runs after R23 and R24 pass, which deletes them with R2's and R4's tests (Q-E) |
| `test/backbone/core-chain.test.ts`, `test/backbone/core-private-source.test.ts` | Their migration-list and checksum cases follow §2.5 |
| `test/backbone/ledger-storage.test.ts`, `.negative-control.test.ts`, `ledger-storage-checks.ts` (A100–A104) | Kept; A104's case reworded (its "two sweep cycles" become the blocks after the release) |
| `test/backbone/ledger-eviction-restart.test.ts`, `.negative-control.test.ts` (A160) | Kept; the restart recomputes the counting step |
| `test/ledger/worker-sweep.test.ts` | Kept (the worker's eviction is unchanged); renamed `worker-eviction.test.ts`, its comments reworded |
| `test/ledger/fixtures/sweep-fixture.ts`, `sweep-test-loader.ts` | Kept as the DAG fixture and test package of the counting tests and of A160; extended as A105 says |
| `test/ledger/node-format.ts` | Extended with an independent one-form implementation (the oracle of R27, R28) |
| New | the reference model and reachability oracle (`test/backbone/refcount-model.ts`, R1, R2); the step's unit tests; R3–R17's, R22's and R27–R30's tests |

**Documents.** `CHANGELOG.md` (one line: one stored form and reclamation by reference counting; one migration per
part; databases of earlier builds refused); `ROADMAP.md:37, 87`; `core-arch` design §5.3 (the worker's store), §5.4
(its sweep paragraphs replaced by a pointer to this design's §2–§7), §8 (`accepted_config`'s migration, design.md:1459),
§10 (the three sweep rows replaced by the two tables; the `002` notes of `core_chain.identity` and
`core_private_source.accepted_config`) and §11 (the halt code); `core-arch` acceptance §17's row for A105's id;
`vendor/ledger/README.md` (the new patches); issue `docs/issues/00078` closed at close-out. The README has no `sweep`
row today (`README.md:184` lists `retainStates` only) and gets none.

## 12. Local preprod runs (R23–R25)

### 12.1 Setup

The archive node is reachable on the owner's LAN only, so these runs are never part of CI and never in the
required-test manifest; their results are manual evidence in the pull request. A script in the repository,
`scripts/local-preprod-sync.mjs`, runs them when `UMBRADB_LOCAL_NODE` holds the node's WebSocket URL, and without it
exits non-zero naming the variable; it is not a test file. It runs the build's `umbradb run` **inside a
`node:24.9.0-alpine` container on the same Docker network as a `postgres:18` container**: from the host through Docker
Desktop's port, every database answer over ~8–16 KB costs ~14 ms, which measures Docker Desktop rather than UmbraDB
(organizer plan P13.2). It records, per 1,000-height window, the wall time, the stored row count and the size of the
worker's store.

### 12.2 The before-picture

The stopped P13 run's PostgreSQL volume (`umbra-p13-long-pgdata`, stored height `H_p13`, 48,665 when the research read
it) holds the sweep's rows at `H_p13`. It is read only: an experiment copies it with `CREATE DATABASE … TEMPLATE`, as
P13.4 did.

### 12.3 The performance comparison (O-4)

Two runs from genesis to 50,000 on the same machine and setup, every core module but `core-contract-logs-fast`: the
**reference**, this change's base commit `eb0ff7a` (no reclamation code) with `sweep: off`; and the **candidate**,
this change with `sweep: on`. The node has slow stretches (its runtime-version call, made once per block, has taken
~1.8 s for 10–50 s at a time, P13.3), so beside each run the script runs a probe that asks the node for
`state_getRuntimeVersion` at the run's latest block once a second and records each answer's time. A 1,000-height
window is left out of both runs' comparison only if, during that run's pass through it, the probe recorded an answer
slower than 1 s; each 10,000-height band keeps at least 7 of its 10 windows, else both runs are repeated (twice at
most; the attempt keeping the most windows counts). **Pass:** for each band from 10,000 to 50,000, the candidate's
heights/s over the kept windows is at least 80 % of the reference's over the same windows. The ratio over all the
band's windows is reported beside it.

## 13. Delivery order (for `tasks.md`, written after the stage-1 gate)

The build follows `AGENTS.md` stage 2 (test first; one task per change set). Phases, as the organizer research §6.1
adjusted for Q-B, Q-E and O-8:

| Phase | Goal | Criteria |
|---|---|---|
| 0 | Measure on the recorded tapes: per-block figures, the conversion spike, how often the package's form differs from the one form, the node-store reads the one form would need | R21 |
| 1 | Reference model and reachability oracle; the one-form oracle; the model against the sweep's model | R1, R2 |
| 2 | The one-form patch in `v8`, `v9-rc3`, `v9` and the worker's batch and store; `refcountStep` behind its tables seam; the migrations of §2.5; the halt code; every negative control seen failing | R11, R12, R16, R19, R27, R28, R30 |
| 3 | Wiring on both backends: model equality, backend equality, determinism across worker histories, the sweep differential (also against the runtime sweep, recorded before it is removed), restart, crash points, A160, nodes inserted again, a queued key referenced again, the lag, reuse, a lowered window, `sweep: off`, backups, the conversion | A104, A105, A160, R3–R10, R13–R15, R17, R22, R29 |
| 4 | Remove the runtime sweep (with the split of `sweep-tapes.ts`, §11); documents; the required test id; `npm run graph:refresh` | A134 (deferred, Q191), R18, R20, R26 |
| 5 | The local preprod runs | R23–R25 |
| 6 | Close-out: retire `sweep-model.ts` with R2's and R4's tests (Q-E); close issue 00078; `tasks.md` checked; the proposal's status; `ROADMAP.md`; `npm run graph:refresh` and `graphify-out/` committed with the close-out | — |

Phases 0 and 1 can run in parallel; 2 → 3 → 4 in series; 5 after 3. Every new or changed crash, property or
differential test runs at least five times before the change merges (`AGENTS.md`, "Flaky tests"). The new tests keep to
the conformance gate's deadline (105 minutes, about 75 used on a hosted runner, issue 00077): R3's and R27's checks run
after every block on the DAG fixture and at sampled heights on the tapes.

## 14. External claims and their evidence

| Claim | Evidence | Status |
|---|---|---|
| `INSERT … ON CONFLICT (node_key) DO NOTHING` reports only the rows really inserted; the `root_counts` merge shape reports the keys whose final count is non-zero (its `WITH` delete is not counted); `DELETE … WHERE node_key = ANY($1::bytea[])` reports the rows deleted | Probe on PGlite 0.5.10 (PostgreSQL 18.6) and PostgreSQL 18.6 (`postgres:18`), the repository's installed `@electric-sql/pglite` 0.5.10 and `postgres` 3.4.9: organizer `research/00034-ledger-node-refcount-data/probe-affected-rows.mjs` and `.out.txt` — identical on both | Verified (run) |
| `BlockWriteHandle.execute` returns the number of rows a statement affected | `src/db/api.ts:39-42` | Verified (repository) |
| No reference to a missing node, no root without a node, no cycle; depth 5; one block's garbage 10 nodes | Organizer `research/00034-ledger-node-refcount-data/analyze.out.json`, `garbage.out.txt`, `layers.out.txt` (preprod snapshot at 48,665) | Measured on one snapshot; checked at run time by `missing-reference` |
| A child's hash is the same in both forms; the small limit is 1,024 by `2 + |data| + Σ` child sizes; a new child is embedded when small; only referenced nodes are back-end objects; `persist` and `into_tracked` give a small node the referenced form; `RcMap` builds referenced children; a loaded node keeps its stored form | `upstream:storage-core/src/arena.rs:535-555, 975-990, 1329-1352, 1525-1540, 2847-2880`, `upstream:storage-core/src/storable.rs:42, 139-159`, `upstream:storage/src/delta_tracking/rcmap.rs:199, 224, 251` | Verified (upstream, pinned, v9); the `v8` package's `storage-core` (`ledger-8.1.2`) not read (unconfirmed): R28 runs the one-form patch of each package against the oracle |
| The package reads a node from UmbraDB's node store by key and checks only that its content hashes to the key | `vendor/ledger/v9/patches/0001-storage-core-external-node-store.patch:133-141` | Verified (repository); R28 checks that every package loads the one form on the recorded tapes |
| UmbraDB's patches track every persisted root with `hold_as_node` (`into_tracked`) and load stored nodes through `BackendLoader` | `vendor/ledger/{v8,v9-rc3,v9}/patches/0003-ledger-wasm-node-store-exports.patch` (lines in §2.2) | Verified (repository) |
| `flushNodes` takes only nodes reachable from a key whose root count rose, stopping at nodes believed stored | `vendor/ledger/v9/patches/0001-storage-core-external-node-store.patch:143-190`, `0003-…:386-423` | Verified (repository); not relied on for safety (§4.6) |
| `layout-v2` writes a re-created node again | `upstream:storage-core/src/backend.rs:532-534` | Verified (upstream, pinned) |
| `midnight-storage-core` `layout-v1` kept a reference count per node and deleted at zero, decrementing children with multiplicity; `layout-v2` removed it | `upstream:storage-core/src/backend.rs:1202-1218`, `upstream:storage-core/src/db/sql.rs:250-266, 340-399`, `upstream:CHANGELOG_storage_core.md:23` | Verified (upstream, pinned); the reason for the removal is not given there (unconfirmed, not built on) |
| The sweep's cycle fit one block at every preprod height of the stopped run | Organizer plan P13.3, questions Q-37 | Measured |
| The devnet v8 → v9 tape converts at F = 103 with contracts deployed on v8 | `test/backbone/contract-data.test.ts:209` | Verified (repository) |
| Every core part's migrations, and `main`'s lack of them | `git grep 'id: "00'` over `src/` (three parts with a `002`); `main` (`c8b6ff1`) has no `src/backbone/` and no `src/db/migrate.ts` | Verified (repository) |
| How often the package's form differs from the one form, and the reads the one form needs | — | Unconfirmed: R21 measures them on the tapes; the design does not depend on the figure, only the cost does |
| OpenSpec applies `## RENAMED Requirements` (FROM/TO) | `.claude/skills/openspec-sync-specs/SKILL.md:46, 75-76, 112-115` (generated by OpenSpec 1.6.0); no OpenSpec CLI is installed in this repository | Verified against the repository's instructions |
