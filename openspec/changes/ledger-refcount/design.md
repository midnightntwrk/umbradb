# Design — LEDGER-REFCOUNT: stored ledger nodes reclaimed by reference counting

Section numbers of `core-arch` are cited as `core-arch design §n`. Requirement ids are `core-arch`'s (`LG-*`, `CF-*`,
`DB-*`, `DT-*`, `BK-*`, `RN-*`); criteria are this change's `R1` … `R26` and the rewritten `core-arch` criteria
(`acceptance.md`). `organizer:` names a path under `/Users/edwardalvarado/todo/Umbra` (the owner's workspace, not in
this repository); `upstream:` names the `midnight-ledger` checkout at tag `ledger-9.1.0.0-rc.5`
(`67f9f97246339539af0091c4d8c6bc5ab236a191`, the commit `vendor/ledger/v9/upstream.json` builds from).

## 0. Baseline, decisions and open questions

**Baseline and archive order.** The spec delta modifies requirements of `core-arch`, which is not archived:
`openspec/specs/` holds no baseline for the `ledger` capability. `core-arch` is archived first, then `start-umbradb`,
then this change. `start-umbradb` modifies no `ledger` requirement (its deltas: `admin-endpoints`, `backups`,
`configuration` CF-1 and CF-4, `library-mode`, `library-surface`, `modules`, `private-processes`, `runner`), so the two
changes touch no requirement in common. This change's delta (`specs/ledger/spec.md`) renames LG-14 (`## RENAMED
Requirements`, FROM/TO, as the repository's OpenSpec skill describes it,
`.claude/skills/openspec-sync-specs/SKILL.md:46, 75-76, 112-115`) and restates LG-11, LG-13 and LG-14 whole under
`## MODIFIED Requirements`, each header matching `core-arch`'s exactly (LG-14's after the rename). It changes no
`configuration` requirement while O-1 keeps the `sweep` key (below). Both changes land in PR #16 (decision Q-F).

**The owner's decisions** (2026-11-02, organizer `research/00034-ledger-node-refcount.md` §7):

| # | Decision | What it fixes here |
|---|---|---|
| Q-A | Counts are computed in the process, not by database triggers | §3: `core-ledger-state` computes in `on-compute`, writes in `on-db-write`; no trigger is added |
| Q-B | No existing database is upgraded ("we are in development, there are no databases") | §2.3: no build of counts from an existing node set; an earlier build's database is refused |
| Q-C | No cap on a block's deletions | §3.2 step 4 runs to the end; §9.2 the conversion spike |
| Q-D | The cascade runs inside the block | §3.2 step 4; §4.4 equality with a one-block sweep cycle |
| Q-E | The runtime sweep is removed; its model stays in the tests as the oracle until the local preprod run passes | §11: the sweep's model and the two criteria that use it (R2, R4) retire together at close-out |
| Q-F | The change lands in PR #16, branch `00028-core-arch` | this section |

**Open questions** (organizer `spec/00034-ledger-node-refcount.md`; each written for the owner there). This design
applies the recommended answer of each; an answer other than the recommended one changes the sections named.

| # | Question | Applied here (recommended) | Sections that change otherwise |
|---|---|---|---|
| O-1 | The `core` entry's `sweep` key: keep, rename, drop? | Keep `sweep: on \| off`; `off` deletes no node, counts kept | A rename needs `configuration` deltas restating `start-umbradb`'s CF-4 and `core-arch`'s CF-9; §6, R10, R26 |
| O-2 | How the schema change is expressed when no database exists | Migration `002` rewritten in place; an earlier build's database is refused with `migration-checksum-changed` | §2.3, R16, the proposal's Impact |
| O-3 | The conversion spike: measure before approval, or in the build's first phase? | Measured in the first phase (R21); a large figure raises a separate decision | §9.2, §13 |
| O-4 | The local preprod performance target | ≥ 80 % of the no-reclamation reference's rate in every 10,000-height band from 10,000 to 50,000 | §12.3, R23 |
| O-5 | The node's runtime-version call made once per block: in scope? | Not in scope: a separate work item | the proposal's Non-goals |
| O-6 | The code of the new halts | One halt code, `ledger-refcount-invalid`, with `details.reason` | §10, R11, R19 |
| O-7 | Q-38 of the `start-umbradb` questions file (which performance work first) | Resolved by this change once approved | none (workspace record) |

## 1. Words

| Term | Meaning |
|---|---|
| node, key | A row of `core_ledger_state.nodes`: its key (32 bytes, the hash of its payload and its children's hashes), `data`, and `children`, the ledger's serialization of its child list (LG-11). |
| child list, reference, embedded child | `children` holds `ArenaKey::Ref` children (a 32-byte key of another node) and `ArenaKey::Direct` children (a small node embedded inline, with its own child list, recursively). A **reference** is one occurrence of a key as a `Ref` child, found through embedded children (`src/ledger/node-refs.ts` `childRefKeys`). A key listed twice in one child list is two references. |
| form | One child list a key can have. A child's hash is the same embedded or referenced (`upstream:storage-core/src/arena.rs:2847-2880`), so one key can have two forms (§4.6). The **stored form** is the one in `nodes`; the **batch form** is the one in the block's batch. |
| `S_h` | The keys of `nodes` after block h. |
| `refs_h(k)` | The number of references to k in the stored forms of the nodes of `S_h`. |
| `roots_h(k)` | k's root count after block h (`root_counts`; 0 without a row). A **root** after h is a key with `roots_h(k) > 0`. |
| `R_h` | The keys reachable from the roots after h through the stored forms of `S_h`. `R_{−1}` is empty. |
| batch `B` | What the ledger worker flushed for block h (`src/ledger/types.ts:54-62`): `B.inserts`, nodes in their batch forms, and `B.rootCounts`, one netted signed change per key. |
| new nodes `N` | The nodes of `B.inserts` whose key is not in `S_{h−1}`. A node of `B.inserts` already in `S_{h−1}` is **inserted again**: the package writes content again after its memory dropped the stored copy (`layout-v2` treats every creation as new, `upstream:storage-core/src/backend.rs:532-534`), and on a restarted worker. |
| batch references | Every reference in the batch form of every node of `B.inserts`, new or inserted again. |
| protected in h | A key with a root count after h − 1 or after h, or among the batch references. |
| queue `Q_h` | The keys of `unreferenced` after block h. |
| release | A root count lowered by the block's batch: block h releases the states leaving the retention window (LG-12). |

## 2. Tables and migration

### 2.1 The tables of `core-ledger-state`

| Table | Primary key | Other columns | Holds after block h |
|---|---|---|---|
| `nodes` | `node_key` | `data`, `children` | `S_h` (unchanged, `src/backbone/core-ledger-state/sql.ts:54-59`) |
| `root_counts` | `node_key` | `count integer CHECK (count > 0)` | `roots_h` (unchanged, `sql.ts:60-64`) |
| `states` | `height` | unchanged | unchanged |
| **`ref_counts`** | `node_key` (`bytea`, `CHECK (octet_length(node_key) = 32)`) | `count integer NOT NULL CHECK (count > 0)` | one row per key with `refs_h(k) > 0`, holding it |
| **`unreferenced`** | `node_key` (`bytea`, `CHECK (octet_length(node_key) = 32)`) | — | `Q_h` |

`sweep`, `grey` and `marks` are gone. The `ledger-state` table item lists
`["nodes", "root_counts", "states", "ref_counts", "unreferenced"]`, kind `mutable`
(`core-ledger-state.ts:589` today lists the sweep's three). Both new tables are module tables like the others: in the
contents hash (DT-3), captured per block (DT-4) and digested (DT-5); neither is `deterministic: false`. A count that
differs between two machines therefore shows in that block's `ref_counts` digest, not blocks later when a node is
deleted or kept wrongly. Their column types and keys are ones DT-6's startup check accepts (`bytea` keys and an
`integer` with a `CHECK`, as `root_counts`).

### 2.2 Invariants

After every committed block h with `core-ledger-state` active:

- **I1 (closed):** every reference in a stored form of `S_h` is a key of `S_h`.
- **I2 (counts):** `ref_counts` holds exactly the keys with `refs_h(k) > 0`, each with `refs_h(k)`.
- **I3 (queue):** `Q_h = { k ∈ S_h : refs_h(k) = 0 and roots_h(k) = 0 }`.
- **I4 (roots resolve):** every key with `roots_h(k) > 0` is in `S_h`. With I1, every retained state and every
  persisted contract and zswap state loads from the database with all it reaches.
- **I5 (nothing kept twice):** with `sweep` on at h, every key of `Q_{h−1}` that is not protected in h and gains no
  reference in h is gone after h, and so is every key that only such keys reached.
- **I6 (exact set):** with `sweep` on at h, `R_{h−1} ⊆ S_h`; and when no key is kept in h only because it is a batch
  reference and no new node of h ends unreferenced, `S_h = R_{h−1} ∪ R_h` (§4.3, §4.6).

By I1 and I3, in the acyclic graph every stored key is reached from a root after h or from a queued key, so the queue
names all the garbage there is.

### 2.3 Migration (O-2)

`core-ledger-state`'s migration `002` today creates the sweep's three tables (`sql.ts:102-121`). It is **rewritten in
place** to create `ref_counts` and `unreferenced` instead, and `001` is unchanged. A database with `core-ledger-state`
written by an earlier build (`v0.10.0-rc.1`, `rc.2`, or this branch before this change) recorded the old `002`'s
checksum, so its startup refuses before any migration runs with `migration-checksum-changed`, naming
`core-ledger-state`, `002` and both checksums (DB-9, `src/db/migrate.ts` `checkApplied`); `umbradb restore` of its
backup refuses with `backup-build-mismatch` (BK-3). Such a database resyncs into a new one (decision Q-B: none exists).

Why not the alternatives:

- **An added migration `003`** (DB-10's additive form, the sweep's tables left empty) would accept an earlier build's
  database and run on it with empty counts: its first deletion would halt with a negative count, or its counts would
  leak. Refusing it would need a guard migration that fails on a non-empty `nodes`.
- **`requiresResync: true`** (DB-10) compares versions, and every core module carries `UMBRADB_VERSION`
  (`src/config/build.ts:46`, `"0.10.0"`, the version of `rc.1` and `rc.2` too): with no version change it refuses
  nothing, and left in place it would refuse every database at the next version change.

## 3. The reclamation step

### 3.1 Where it runs

As the sweep does today (`core-arch` design §5.4; `core-ledger-state.ts:489-535`): in `on-compute`, after the apply and
the root check, `core-ledger-state` computes block h's step from on-compute's read (the tables as committed at h − 1)
and the batch held in memory, has the worker evict the deleted nodes, and keeps the step for `on-db-write`, which
writes it after the batch (`writeBlock`, `core-ledger-state.ts:452-472`). The step is a pure function behind a tables
seam, as `sweepStep` is behind `SweepTables` (`sweep.ts:84-101`): `refcountStep(tables, batch, { on })`, where `on` is
whether the `core` entry's `sweep` is on at h. It holds no state between blocks.

### 3.2 The rules, for block h

Inputs: on-compute's read at h − 1, giving `S_{h−1}` (by key), `refs_{h−1}`, `roots_{h−1}` and `Q_{h−1}`; and `B`.
`Δ(k)` is the netted change of k's reference count in h, 0 unless set below; `roots'(k) = roots_{h−1}(k) + δ(k)`,
where `δ(k)` is k's change in `B.rootCounts` (0 if absent).

1. **New nodes.** `N` = the nodes of `B.inserts` whose key is not in `S_{h−1}`. Only they change counts; a node
   inserted again keeps its stored form (`ON CONFLICT DO NOTHING`) and changes none.
2. **Increments.** For each node of `N`, for each reference k in its form: `Δ(k) += 1`.
3. **Protection.** A key protected in h (§1: a root count after h − 1 or after h, or a batch reference) is not
   deleted in h.
4. **Deletions, when `on`.** Starting from the keys of `Q_{h−1}`, repeat: every candidate k not yet deleted, not
   protected, with `refs_{h−1}(k) + Δ(k) = 0`, is deleted; for each node deleted in that round, for each reference k in
   its stored form, `Δ(k) −= 1` and k becomes a candidate — until a round deletes none. `D` is the set deleted. When not
   `on`, `D` is empty. No limit bounds `D` (Q-C); it holds a released state's whole chain of newly unreferenced nodes
   (Q-D).
5. **Counts after h.** `refs_h(k) = refs_{h−1}(k) + Δ(k)` for every key with `Δ(k) ≠ 0`.
6. **Queue after h.** `Q_h = { k ∈ S_h : refs_h(k) = 0 and roots'(k) = 0 }`, where `S_h = (S_{h−1} \ D) ∪ keys(N)`.
   It is computed over the keys whose membership can change in h — `Q_{h−1}`, the keys of `N`, the keys with
   `Δ(k) ≠ 0`, the keys of `B.rootCounts` — since any other stored key keeps its count and its root count. A key that
   enters the queue in h is deleted no earlier than block h + 1. It holds, in practice, the roots the block released;
   also a new node that nothing references (§4.6) and a key kept only as a batch reference.
7. **Checks** (§3.3), before eviction.
8. **Eviction.** The worker evicts `D` (`LedgerHost.evict`), in `on-compute`, before the block's transaction, as today
   (`core-ledger-state.ts:504`). A refusal after the worker freed every object it can restarts the worker and computes
   the block again, steps 1–8 included (`computeBlock`, LG-14, Q144 B, unchanged).
9. **Writes**, in `on-db-write` after `writeBlock`'s statements: the netted `Δ` of every key with `Δ(k) ≠ 0` merged
   into `ref_counts` (the shape of `root_counts`' merge, `sql.ts:138-142`: deltas added, a count reaching 0 deleted);
   `Q_{h−1} \ Q_h` deleted from `unreferenced` and `Q_h \ Q_{h−1}` inserted; `D` deleted from `nodes`. Each statement
   over a key list is chunked by `NODES_PER_STATEMENT` (1,000, `core-ledger-state.ts:146`), as the node inserts are. The
   result does not depend on the statements' order or chunking.

Why the root conditions of rule 3: a key whose count reaches 0 but had a root count at h − 1 is in `R_{h−1}`, still
held by the worker during h (`docs/issues/00019`); if its root count also fell to 0 in h, rule 6 queues it and it is
deleted at h + 1 at the earliest. A key with a root count after h is in `R_h`. Why batch references: a node the batch
inserts again keeps its stored form, so a reference only its batch form holds is not counted (§4.6); the sweep marks
through batch forms the same way (`sweep.ts:218`).

### 3.3 Checks

Each check halts processing at h with `ledger-refcount-invalid` (§10) and nothing of the block stored; none repairs.

| `details.reason` | Fails when | Where |
|---|---|---|
| `negative-count` | some `refs_{h−1}(k) + Δ(k) < 0` | `on-compute`, before eviction |
| `missing-reference` | a reference in a new node's form, or a key whose root count rises in h, is not in `S_h` (neither in `S_{h−1} \ D` nor a key of `N`) | `on-compute`, before eviction |
| `row-count-mismatch` | a write affects another number of rows than computed: the node inserts (summed over chunks) ≠ `|N|`; the `ref_counts` merge ≠ the number of keys with `Δ ≠ 0` and `refs_h > 0`; the `unreferenced` delete ≠ `|Q_{h−1} \ Q_h|`; its insert ≠ `|Q_h \ Q_{h−1}|`; the node delete ≠ `|D|` | `on-db-write`; the transaction rolls back |

`missing-reference` keeps I1 and I4: it is new strictness, since today the sweep marks a missing key and adds nothing
(LG-14 step 3), and a root without a node only fails later, when its state is loaded. The preprod snapshot at 48,665
has no reference to a missing node and no root without a node (organizer
`research/00034-ledger-node-refcount-data/analyze.out.json`: `missingChildRefs` 0, `rootsWithoutNode` 0). A new node
that ends the block unreferenced is not a check: it is queued (rule 6; §4.6).

### 3.4 Reads

All through on-compute's read at h − 1, each an indexed lookup by key list (`= ANY($1::bytea[])`), chunked by 1,000
keys: which keys of `B.inserts`, of the references of `N`, and of `B.rootCounts` are stored; `unreferenced` in full (on
preprod 1–2 rows); `root_counts` and `ref_counts` of the keys of `Q_{h−1}`, of `B.rootCounts` and of each round's
candidates; and, per round of rule 4, the stored forms of the nodes the round deletes. The batch forms of the nodes
inserted again are parsed in memory for the batch references. A round's stored forms are parsed to references
(`childRefKeys`) and their bytes dropped before the next chunk, so memory follows the number of references, not the
child lists' size. The number of rounds is at most the depth of the deleted chain (5 on the preprod snapshot).

## 4. Properties

### 4.1 Safety: no deleted node is live

Every key of `D` is in neither `R_{h−1}` nor `R_h`, is no batch reference, and is no root after h − 1 or after h. By
induction on the rounds of rule 4: a deleted key d is not protected, and `refs_h(d) = 0`, which counts every reference
in the stored forms of `S_{h−1}` minus the deleted nodes' plus the new nodes'. So every node of `S_{h−1}` that
referenced d was deleted in an earlier round (in neither set, by induction), no new node references d, and no node of
the batch references d. Hence no state reaches d through stored forms, nor through the batch's forms: neither the state
the worker holds at h − 1 nor the state it builds at h, which is the condition `docs/issues/00019` sets (the eviction
does not refuse a live state's root, so this is kept by the rule, not by the refusal). An object outside those states (a
kept parse, or an in-memory node whose form differs from both, §4.6) can still hold d: the eviction is then refused, and
the existing free-and-retry and restart path reloads the state from the database's stored forms (§5).

### 4.2 No leak (I5)

With `on`, every key of `Q_{h−1}` that is not protected and gains no reference has `refs = 0` and is deleted by rule 4's
first round; a key every stored parent of which is deleted reaches `refs = 0` and is deleted in a later round unless
protected. Keys reached only through such keys are deleted round by round down the chain, which ends since the graph
is acyclic (a key is the hash of its children's hashes, so a cycle needs a hash fixed point; the preprod snapshot has
none). This holds also at the first block with `sweep` on after blocks with it off: I3 holds throughout, so `Q_{h−1}`
holds every parentless non-root node those blocks left.

### 4.3 The exact set (I6)

`R_{h−1} ⊆ S_h` by §4.1. Let `G = S_h \ (R_{h−1} ∪ R_h)`. A key of `G` with no parent in `S_h` has `refs_h = 0` and no
root after h, so it is in `Q_h`; it is in neither `R_{h−1}` nor `R_h`, so it was not a queued key of `Q_{h−1}` kept by
a root, and not a candidate kept by a root count at h − 1: it is a new node that ends unreferenced, or a key kept only
as a batch reference. When neither happens in h, `G` has no parentless key, and since every parent of a key of `G` is in
`G` and the graph is acyclic, `G` is empty: `S_h = R_{h−1} ∪ R_h`.

### 4.4 Equal to the sweep where its cycle fits one block

LG-14's sweep, when a whole cycle starts and ends in block h, marks from the root counts at h − 1 and the keys whose
count rose in h (`sweep.ts:197-208`), following the batch form of a node the batch inserts and the stored form
otherwise (`sweep.ts:218`), and deletes every unmarked node. Counting keeps the same set at h, provided every node of
the batch is reachable from a key whose root count rose (the flush, §4.5): a key the sweep marks through stored forms is
kept by its counted references, one it marks through a batch form is a batch reference (rule 3), and a node that only a
batch form references is new and queued, not deleted. Both start empty at genesis, so they store the same nodes at every
height up to the first block whose cycle does not fit. On preprod every block so far ran a whole cycle in-block
(`sweep.cycle` = height + 1, cycle 46,739 when the run stopped near 46,738: organizer plan P13.3 and questions Q-37).
Where a cycle spans blocks, the sweep deletes a node only if nothing reachable from the roots at the cycle's start or
from any key that rose during it reaches it, a superset of what counting keeps: the counted set is a subset of the swept
set. *Derived here; R2 and R4 test both claims.*

When the sweep's model is fed the counting run's batches (R4), the comparison is valid in both regimes: the sweep model
deletes a node only after counting deleted it (subset), so the counting run's package, which evicted it, writes it
again whenever a later state needs it, and the sweep model sees that insert.

### 4.5 The flush

`flushNodes` takes only nodes reachable from a key whose root count rose, through other taken nodes, and stops at nodes
the package believes stored (patch `vendor/ledger/v9/patches/0001-storage-core-external-node-store.patch:143-160`,
export patch `0003-…:386-423`; the same patches exist for `v8` and `v9-rc3`). So every new node is expected to be
reachable after h, and its references to be stored (`missing-reference` checks the latter). A new node that nothing
references after all is queued and deleted at h + 1 unless referenced by then; R21 counts such nodes on the tapes.

### 4.6 Two forms of one key

A child's hash is the same embedded or referenced (`upstream:storage-core/src/arena.rs:2847-2880`, upstream's test of
both forms of one hash in one parent), so one key can have two child lists. The ledger embeds a newly built child when
it is small (`upstream:storage-core/src/storable.rs:139-159`, `child_from`), but a node can also hold a small child by
reference: `Sp::persist` turns a small node into a referenced one, a behaviour its comment calls "baked into behaviour"
(`arena.rs:1525-1540`); `Sp::into_tracked` does the same (`arena.rs:1329-1352`); the ledger's `RcMap` builds `Ref`
children for keys (`upstream:storage/src/delta_tracking/rcmap.rs:199, 224, 251`); and UmbraDB's `hold_as_node` tracks
every persisted root (`vendor/ledger/v9/patches/0003-…:333-334, 383, 483, 503`; the same in `v9-rc3`'s `0003`, and
`v8`'s `0003:299-300, 349, 449, 469`). A node loaded from the database keeps its stored form (`BackendLoader`, patch
`0003-…:319`, through `arena.rs:975-990`, `child.clone()`). So a node inserted again may carry another form than its
stored one. The rules stay safe when it does: the stored form stays (`ON CONFLICT DO NOTHING`), a key only the batch
form references is protected in that block (rule 3) and queued, and a small node the batch form references by key while
the stored form embeds it is new and queued; both are deleted at the first later block in which nothing protects them,
as the sweep's next cycle would delete them. R21 counts such forms on the tapes.

### 4.7 Determinism across worker histories

Which nodes a batch inserts again depends on what the package's memory still holds (a restart, its cache). When a node
inserted again carries its stored form, rule 3 protects only keys already in `R_h` (the node is reached from a rising
root through the batch, §4.5, and its children through it), and the new nodes are the same on every machine with the
same stored set (the package flushes every reachable node it does not believe stored, and it never believes a deleted
node stored, §5): the step's result does not depend on the worker's history. When a node inserted again carries the
other form (§4.6), the batch can bring a small node as a new row on one machine and not on another, and the stored rows
— then every later per-block digest — differ. That dependency is not new with counting: the node inserts already write
that row on the one machine only (LG-11), and the sweep marks through the batch's forms the same way (`sweep.ts:218`).
The criteria that compare runs with different worker histories would show it: R13 (restarts at 20 heights of the
preprod tape), A160 (a worker restart), and the cross-backend comparisons (A105, R17, R25); none has shown it with the
sweep (`core-arch` A160 and A55; the organizer plan's P13.1 restarts ended with equal contents hashes). *Assumption,
unconfirmed in general: a node inserted again carries its stored form.* Issue `docs/issues/00078` records the
question — whether the packages produce a node in two forms on one chain — and the fix if they do (a canonical stored
form written by UmbraDB), outside this change.

## 5. Eviction, the one-block lag and the worker restart

Unchanged from LG-14 and `core-arch` design §5.4, with the lag now set by rule 3's root conditions and rule 6 instead
of the sweep's "roots as committed at h − 1". With `retainStates` 0, block h releases the state after h − 1
(`engine.ts:554`), which the worker holds until `commit(h)`: its root is queued at h (when unreferenced) and its nodes
are deleted at h + 1, after the worker dropped that state. A node forgotten by the package but still stored is merely
written again (no count change); a node deleted but not forgotten would be referenced by a later new node without being
written — `missing-reference` halts that block instead of storing a dangling reference. A restart after a refused
eviction (Q144 B) recomputes the step from the same read at h − 1 and the new thread's batch: its extra nodes inserted
again change no count, and the new thread holds the stored forms, so an in-memory form that held a deleted node is gone.

## 6. `sweep: off` (O-1)

The key keeps its name, values and kind (CF-4: data field, `on` or `off`, default `on`) and stays gated by the
development opt-in (CF-9; `src/config/history.ts:618-636`, feature `sweep-off`). While it is off at h, rules 1–3 and
5–7 run, rule 4's `D` is empty and nothing is evicted: no node is deleted, the counts stay exact and the queue keeps
every parentless non-root node (I1–I4). The first block with it on again deletes the whole queue that is not protected,
and its cascade, by rule 4 (§4.2). Unlike the sweep (`sweepReset`, `sweep.ts:281-294`), no reset is written when it is
turned off or on.

## 7. Crash safety and restarts

The step's writes and the block's batch are in the block's one transaction (RN-6): a crash leaves h − 1 or h, never a
mix. A crash after the eviction and before the commit leaves the deleted nodes stored and the restarted process with a
fresh worker, which reads them as needed: safe. A restarted process reads the counts and the queue from the database;
the step keeps nothing in memory between blocks. A block processed again after a lost transaction gets the same step
(the engine gives the same batch for the same pending block, `core-arch` design §5.3).

## 8. Determinism

`ref_counts` after h is a function of `S_h` (I2), and `S_h` and `Q_h` are fixed by the rules from the tables at h − 1
and the batch, so every machine with the same history stores the same rows; across different worker histories they do
under §4.7's assumption. The cascade's fixed point does not depend
on the order of its rounds or of a round's keys; the merge, inserts and deletes are set operations; the statements are
the shapes both backends already run (`unnest` of `bytea[]`, `= ANY`, `ON CONFLICT`, a data-modifying `WITH`). The
digests compare each key's row before and after the block (DT-4), so netting is not visible in them either way.

## 9. Cost

### 9.1 Per block on preprod (estimated from the snapshot at 48,665; R21 measures it)

| | The sweep today (3,568 nodes, a whole cycle per block) | Reference counting |
|---|---|---|
| Child lists read and parsed | every stored node's, ≈ 7.7 MB (≈ 15.5 MB of hex), twice | the deleted nodes', ≈ 10 (≈ 22 KB); the batch's are in memory |
| Lookups | a flag per marked key, a scan of every node | ≈ 9 existence checks; the counts of the ≈ 10–20 keys whose count falls; the queue (1–2 rows) |
| Count changes | — | ≈ 544 increments and ≈ 544 decrements, netting to ≈ 18 keys |
| Rows written | the batch, ≈ 9 node deletes, the sweep row | the batch, ≈ 10 node deletes, ≈ 18 `ref_counts` rows, ≈ 2 queue rows: ≈ 40 |
| Growth | with the stored set, up to 10,000 node units per block | with the block's changes |

Over a whole sync every node is deleted at most once per insertion, so the deletion work is bounded by the insertion
work. The ≈ 18 is an estimate (organizer `research/00034-ledger-node-refcount-data/netting.out.txt`); R21 replaces it
with measured figures.

### 9.2 The block after a ledger conversion's release (O-3)

At the v8 → v9 conversion block F the worker converts the state; the v8 state after F − 1 is released by the block
that takes it out of the retention window (F with `retainStates` 0; F + R with `retainStates` R, `engine.ts:554`). The
block after that release deletes every node of that v8 state that no root then reaches — the v8 contract and
zswap-state keys persisted under LG-13 stay roots, so their nodes stay — in one block, with no cap (Q-C): the deleted
set, the stored forms read round by round, the deletes captured for the digests, and the eviction. No real network has
crossed a v8 → v9 conversion yet (preprod's two runtime upgrades stay on v8; mainnet's boundaries at 1,774,492 and
2,738,211 stay on v8, `src/ledger/networks.json`). R21 measures the spike on the devnet v8 → v9 tape (F = 103,
`test/backbone/contract-data.test.ts:209`) in the build's first phase, and R22 checks the reclamation across it; if the
spike is large, spreading it is a separate decision (it changes which block deletes which node).

## 10. The halt code (O-6)

`ledger-refcount-invalid` joins `ERROR_CODES` (`src/deterministic-postgresql/errors.ts`) and `HALT_CODES`
(`src/runner/failures.ts:104-122`), so a failure with it halts with that code (`failures.ts` rule 1), and `core-arch`
design §11's list of halts. Its details: `reason` (§3.3), `height`, and per reason the key as `0x` hex
(`negative-count`, `missing-reference`) or the statement's name with the expected and actual row counts
(`row-count-mismatch`). It carries no configuration value. The code registry test (`test/runner/code-registry.ts`)
names the test that triggers it (A87).

## 11. What is removed, rewritten and kept

**Code.**

| Path | Fate |
|---|---|
| `src/backbone/core-ledger-state/sweep.ts` | Removed: `sweepStep`, `sweepReset`, `SweepTables`, `GreyPicker`, `BYTE_ORDER`, `SWEEP_BUDGET`, `writeSweep` |
| `src/backbone/core-ledger-state/sql.ts` | Migration `002` rewritten (§2.3); the sweep's statements and readers removed (`sql.ts:158-177, 297-398`); the step's reads and writes added |
| `src/backbone/core-ledger-state/refcount.ts` | New: `refcountStep`, its tables seam, `writeRefcount` |
| `src/backbone/core-ledger-state/core-ledger-state.ts` | `sweepOf` → the counting step; the `sweepBudget` and `greyPicker` options removed; the `ledger-state` item's tables (§2.1); `writeBlock` returns the inserted count |
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
| `test/backbone/ledger-storage.test.ts`, `.negative-control.test.ts`, `ledger-storage-checks.ts` (A100–A104) | Kept; A104's case reworded (its "two sweep cycles" become the blocks after the release) |
| `test/backbone/ledger-eviction-restart.test.ts`, `.negative-control.test.ts` (A160) | Kept; the restart recomputes the counting step |
| `test/ledger/worker-sweep.test.ts` | Kept (the worker's eviction is unchanged); renamed `worker-eviction.test.ts`, its comments reworded |
| `test/ledger/fixtures/sweep-fixture.ts`, `sweep-test-loader.ts` | Kept as the DAG fixture and test package of the counting tests and of A160; extended as A105 says |
| New | the reference model and reachability oracle (`test/backbone/refcount-model.ts`, R1, R2); the step's unit tests; R3–R17's and R22's tests |

**Documents.** `CHANGELOG.md` (one line: reclamation by reference counting, and the refusal of earlier builds'
databases); `ROADMAP.md:37, 87`; `core-arch` design §5.4 (its sweep paragraphs replaced by a pointer to this design's
§3–§7), §10 (the three sweep rows replaced by the two tables) and §11 (the halt code); `core-arch` acceptance §17's
row for A105's id. The README has no `sweep` row today (`README.md:184` lists `retainStates` only) and gets none.

## 12. Local preprod runs (R23–R25)

### 12.1 Setup

The archive node is reachable on the owner's LAN only, so these runs are never part of CI and never in the
required-test manifest; their results are manual evidence in the pull request. A script in the repository,
`scripts/local-preprod-sync.mjs`, runs them when `UMBRADB_LOCAL_NODE` holds the node's WebSocket URL, and without it
exits non-zero naming the variable; it is not a test file. It runs the build's `umbradb run` **inside a
`node:24.9.0-alpine` container on the same Docker network as a `postgres:18` container**: from the host through Docker
Desktop's port, every database answer over ~8–16 KB costs ~14 ms, which measures Docker Desktop rather than UmbraDB
(organizer plan P13.2). It records, per 1,000-height window, the wall time and the stored node count.

### 12.2 The before-picture

The stopped P13 run's PostgreSQL volume (`umbra-p13-long-pgdata`, stored height `H_p13`, 48,665 when the research read
it) holds the sweep's stored node set at `H_p13`. It is read only: an experiment copies it with
`CREATE DATABASE … TEMPLATE`, as P13.4 did.

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
adjusted for Q-B and Q-E:

| Phase | Goal | Criteria |
|---|---|---|
| 0 | Measure per block on the recorded tapes, the conversion spike (O-3) and the forms of nodes inserted again | R21 |
| 1 | Reference model and reachability oracle; the model against the sweep's model | R1, R2 |
| 2 | `refcountStep` behind its tables seam; migration `002`; the halt code; every negative control seen failing | R11, R12, R16, R19 |
| 3 | Wiring on both backends: model equality, backend equality, the sweep differential (also against the runtime sweep, recorded before it is removed), restart, crash points, A160, nodes inserted again, a queued key referenced again, the lag, reuse, a lowered window, `sweep: off`, backups, the conversion | A104, A105, A160, R3–R10, R13–R15, R17, R22 |
| 4 | Remove the runtime sweep (with the split of `sweep-tapes.ts`, §11); documents; the required test id; `npm run graph:refresh` | A134 (deferred, Q191), R18, R20, R26 |
| 5 | The local preprod runs | R23–R25 |
| 6 | Close-out: retire `sweep-model.ts` with R2's and R4's tests (Q-E); `tasks.md` checked; the proposal's status; `ROADMAP.md`; `npm run graph:refresh` and `graphify-out/` committed with the close-out | — |

Phases 0 and 1 can run in parallel; 2 → 3 → 4 in series; 5 after 3. Every new or changed crash, property or
differential test runs at least five times before the change merges (`AGENTS.md`, "Flaky tests"). The new tests keep to
the conformance gate's deadline (105 minutes, about 75 used on a hosted runner, issue 00077): R3's check runs after every
block on the DAG fixture and at sampled heights on the tapes.

## 14. External claims and their evidence

| Claim | Evidence | Status |
|---|---|---|
| `INSERT … ON CONFLICT (node_key) DO NOTHING` reports only the rows really inserted; the `root_counts` merge shape reports the keys whose final count is non-zero (its `WITH` delete is not counted); `DELETE … WHERE node_key = ANY($1::bytea[])` reports the rows deleted | Probe on PGlite 0.5.10 (PostgreSQL 18.6) and PostgreSQL 18.6 (`postgres:18`), the repository's installed `@electric-sql/pglite` 0.5.10 and `postgres` 3.4.9: organizer `research/00034-ledger-node-refcount-data/probe-affected-rows.mjs` and `.out.txt` — identical on both | Verified (run) |
| `BlockWriteHandle.execute` returns the number of rows a statement affected | `src/db/api.ts:39-42` | Verified (repository) |
| No reference to a missing node, no root without a node, no cycle; depth 5; one block's garbage 10 nodes | Organizer `research/00034-ledger-node-refcount-data/analyze.out.json`, `garbage.out.txt`, `layers.out.txt` (preprod snapshot at 48,665) | Measured on one snapshot; checked at run time by `missing-reference` |
| `flushNodes` takes only nodes reachable from a key whose root count rose, stopping at nodes believed stored | `vendor/ledger/v9/patches/0001-storage-core-external-node-store.patch:143-160`, `0003-…:386-423` | Verified (repository); not relied on for safety (§4.5) |
| `layout-v2` writes a re-created node again | `upstream:storage-core/src/backend.rs:532-534` | Verified (upstream, pinned) |
| A child's hash is the same in both forms; a new child is embedded when small; `persist` and `into_tracked` give a small node the referenced form; `RcMap` builds referenced children; a loaded node keeps its stored form | `upstream:storage-core/src/arena.rs:975-990, 1329-1352, 1525-1540, 2847-2880`, `upstream:storage-core/src/storable.rs:139-159`, `upstream:storage/src/delta_tracking/rcmap.rs:199, 224, 251` | Verified (upstream, pinned, v9); the `v8` package's `storage-core` (`ledger-8.1.2`) not read (unconfirmed) |
| UmbraDB's patches track every persisted root with `hold_as_node` (`into_tracked`) and load stored nodes through `BackendLoader` | `vendor/ledger/{v8,v9-rc3,v9}/patches/0003-ledger-wasm-node-store-exports.patch` (lines in §4.6) | Verified (repository) |
| A node inserted again carries its stored form, so the batch's effect does not depend on the worker's history | — | Unconfirmed assumption (§4.7), shared with LG-11's node inserts and the sweep; R13, A160 and the cross-backend criteria would show a breach; issue `docs/issues/00078` |
| `midnight-storage-core` `layout-v1` kept a reference count per node and deleted at zero, decrementing children with multiplicity; `layout-v2` removed it | `upstream:storage-core/src/backend.rs:1202-1218`, `upstream:storage-core/src/db/sql.rs:250-266, 340-399`, `upstream:CHANGELOG_storage_core.md:23` | Verified (upstream, pinned); the reason for the removal is not given there (unconfirmed, not built on) |
| The sweep's cycle fit one block at every preprod height of the stopped run | Organizer plan P13.3, questions Q-37 | Measured |
| The devnet v8 → v9 tape converts at F = 103 with contracts deployed on v8 | `test/backbone/contract-data.test.ts:209` | Verified (repository) |
| The size of the v8 state a real network releases after its conversion | — | Unconfirmed: R21 measures the devnet tape's; no real network has converted |
| OpenSpec applies `## RENAMED Requirements` (FROM/TO) | `.claude/skills/openspec-sync-specs/SKILL.md:46, 75-76, 112-115` (generated by OpenSpec 1.6.0); no OpenSpec CLI is installed in this repository | Verified against the repository's instructions |
