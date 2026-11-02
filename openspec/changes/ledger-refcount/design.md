# Design — LEDGER-REFCOUNT: stored ledger nodes reclaimed by reference counting

Section numbers of `core-arch` are cited as `core-arch design §n`. Requirement ids are `core-arch`'s (`LG-*`, `CF-*`,
`DB-*`, `DT-*`, `BK-*`); criteria are this change's `R1` … `R26` and the rewritten `core-arch` criteria
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
| Q-B | No existing database is upgraded ("we are in development, there are no databases") | §2: no build of counts from an existing node set; an earlier build's database is refused |
| Q-C | No cap on a block's deletions | §3.2 step 5 runs to the end; §9 the F + 1 spike |
| Q-D | The cascade runs inside the block | §3.2 step 5; §4.3 equality with a one-block sweep cycle |
| Q-E | The runtime sweep is removed; its model stays in the tests as the oracle until the local preprod run passes | §11 |
| Q-F | The change lands in PR #16, branch `00028-core-arch` | this section |

**Open questions** (organizer `spec/00034-ledger-node-refcount.md`; each written for the owner there). This design
applies the recommended answer of each; an answer other than the recommended one changes the sections named.

| # | Question | Applied here (recommended) | Sections that change otherwise |
|---|---|---|---|
| O-1 | The `core` entry's `sweep` key: keep, rename, drop? | Keep `sweep: on \| off`; `off` deletes no node, counts kept | A rename needs `configuration` deltas restating `start-umbradb`'s CF-4 and `core-arch`'s CF-9; §6, R10, R26 |
| O-2 | How the schema change is expressed when no database exists | Migration `002` rewritten in place; an earlier build's database is refused with `migration-checksum-changed` | §2.3, R16, the proposal's Impact |
| O-3 | The v8 → v9 spike: measure before approval, or in the build's first phase? | Measured in the first phase (R22); a large figure raises a separate decision | §9.2, §13 |
| O-4 | The local preprod performance target | ≥ 80 % of the no-reclamation reference's rate in every 10,000-height band from 10,000 to 50,000 | §12.3, R23 |
| O-5 | The node's runtime-version call made once per block: in scope? | Not in scope: a separate work item | the proposal's Non-goals |
| O-6 | The code of the new halts | One halt code, `ledger-refcount-invalid`, with `details.reason` | §10, R11, R19 |
| O-7 | Q-38 of the `start-umbradb` questions file (which performance work first) | Resolved by this change once approved | none (workspace record) |

## 1. Words

| Term | Meaning |
|---|---|
| node, key | A row of `core_ledger_state.nodes`: its key (32 bytes, the hash of its payload and its children's keys), `data`, and `children`, the ledger's serialization of its child list (LG-11). |
| child list, reference, embedded child | `children` holds `ArenaKey::Ref` children (a 32-byte key of another node) and `ArenaKey::Direct` children (a small node embedded inline, with its own child list, recursively). A **reference** is one occurrence of a key as a `Ref` child, found through embedded children (`src/ledger/node-refs.ts` `childRefKeys`). A key listed twice in one child list is two references. |
| `S_h` | The keys of `nodes` after block h. |
| `refs_h(k)` | The number of references to k in the child lists of the nodes of `S_h`. |
| `roots_h(k)` | k's root count after block h (`root_counts`; 0 without a row). A **root** after h is a key with `roots_h(k) > 0`. |
| `R_h` | The keys of stored nodes reachable from the roots after h by following references (a root without a stored node reaches nothing). `R_{−1}` is empty. |
| batch `B` | What the ledger worker flushed for block h (`src/ledger/types.ts:54-62`): `B.inserts`, nodes with their child lists, and `B.rootCounts`, one netted signed change per key. |
| new nodes `N` | The nodes of `B.inserts` whose key is not in `S_{h−1}`. A node of `B.inserts` already in `S_{h−1}` is a **re-insert**: the package writes content again after its memory dropped the stored copy (`layout-v2` treats every creation as new, `upstream:storage-core/src/backend.rs:532-534`), and on a restarted worker. |
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

- **I1 (closed):** every reference in a child list of `S_h` is a key of `S_h`.
- **I2 (counts):** `ref_counts` holds exactly the keys with `refs_h(k) > 0`, each with `refs_h(k)`; every such key is
  in `S_h` (by I1).
- **I3 (queue):** `Q_h = { k ∈ S_h : refs_h(k) = 0 and roots_h(k) = 0 }`.
- **I4 (stored set):** `S_h ⊇ R_{h−1} ∪ R_h`, with equality after every block whose `sweep` is on.

I1–I3 hold whatever `sweep` is; I4's equality needs it on at h only (§4.2).

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

1. **New nodes.** `N` = the nodes of `B.inserts` whose key is not in `S_{h−1}`. Only they change counts.
2. **Increments.** For each node of `N`, for each reference k in its child list: `Δ(k) += 1`.
3. **Kept from the queue.** `K = { q ∈ Q_{h−1} : Δ(q) > 0 or roots'(q) > 0 }`: a queued key that gained a reference
   from a new node, or a root count, in h leaves the queue and is not deleted.
4. **Deletions, when `on`.** `D` starts as `Q_{h−1} \ K`. Repeat: for each node added to `D` in the last round, for
   each reference k in its child list as stored at h − 1, `Δ(k) −= 1`; then add to `D` every key k not yet in it with
   `refs_{h−1}(k) + Δ(k) = 0`, `roots_{h−1}(k) = 0` and `roots'(k) = 0` — until a round adds none. When not `on`,
   `D` is empty. No limit bounds `D` (Q-C); it holds a released state's whole chain of newly unreferenced nodes (Q-D).
5. **Counts after h.** `refs_h(k) = refs_{h−1}(k) + Δ(k)` for every key with `Δ(k) ≠ 0`.
6. **Queue after h.** `Q_h = (Q_{h−1} \ K \ D) ∪ E`, where `E` = the keys k of `(S_{h−1} \ D) ∪ keys(N)` with
   `refs_h(k) = 0`, `roots_{h−1}(k) > 0` and `roots'(k) = 0`: a root released in h that nothing references. When `on`,
   `Q_{h−1} \ K \ D` is empty. A key of `E` is deleted no earlier than block h + 1.
7. **Checks** (§3.3), before eviction.
8. **Eviction.** The worker evicts `D` (`LedgerHost.evict`), in `on-compute`, before the block's transaction, as today
   (`core-ledger-state.ts:504`). A refusal after the worker freed every object it can restarts the worker and computes
   the block again, steps 1–8 included (`computeBlock`, LG-14, Q144 B, unchanged).
9. **Writes**, in `on-db-write` after `writeBlock`'s statements: the netted `Δ` of every key with `Δ(k) ≠ 0` merged
   into `ref_counts` (the shape of `root_counts`' merge, `sql.ts:138-142`: deltas added, a count reaching 0 deleted);
   `Q_{h−1} ∩ (K ∪ D)` deleted from `unreferenced`; `E` inserted; `D` deleted from `nodes`. Each statement over a key
   list is chunked by `NODES_PER_STATEMENT` (1,000, `core-ledger-state.ts:146`), as the node inserts are. The result
   does not depend on the statements' order or chunking.

Why rule 4's root conditions: a key whose count reaches 0 but had a root count at h − 1 is in `R_{h−1}`, still held by
the worker during h (`docs/issues/00019`); if its root count also fell to 0 in h, rule 6 queues it. A key with a root
count after h is in `R_h`.

### 3.3 Checks

Each check halts processing at h with `ledger-refcount-invalid` (§10) and nothing of the block stored; none repairs.

| `details.reason` | Fails when | Where |
|---|---|---|
| `negative-count` | some `refs_{h−1}(k) + Δ(k) < 0` | `on-compute`, before eviction |
| `missing-reference` | a node of `N` references a key that is neither in `S_{h−1}` nor a key of `N`, or is in `D` | `on-compute`, before eviction |
| `unreferenced-new-node` | a node of `N` ends with `refs_h = 0` and `roots' = 0` | `on-compute`, before eviction |
| `row-count-mismatch` | a write affects another number of rows than computed: the node inserts (summed over chunks) ≠ `|N|`; the `ref_counts` merge ≠ the number of keys with `Δ ≠ 0` and `refs_h > 0`; the `unreferenced` delete ≠ `|Q_{h−1} ∩ (K ∪ D)|`; its insert ≠ `|E|`; the node delete ≠ `|D|` | `on-db-write`; the transaction rolls back |

The first three need reads the step makes anyway (§3.4). `missing-reference` is new strictness: today the sweep marks
a missing key and adds nothing (LG-14 step 3). The research found no reference to a missing node in the preprod
snapshot at 48,665 (organizer `research/00034-ledger-node-refcount-data/analyze.out.json`: `missingChildRefs` 0).
A root count on a key with no stored node is tolerated, as today (that snapshot: `rootsWithoutNode` 0): it reaches
nothing (§1, `R_h`).

### 3.4 Reads

All through on-compute's read at h − 1, each an indexed lookup by key list (`= ANY($1::bytea[])`), chunked by 1,000
keys: which keys of `B.inserts`, of the references of `N`, and of the keys whose root count falls in h are stored;
`unreferenced` in full (on preprod 1–2 rows); `root_counts` and `ref_counts` of the keys of `Q_{h−1}`, of
`B.rootCounts` and of each round's decremented keys; and, per round of step 4, the child lists of the nodes the round
adds to `D`. A round's child lists are parsed to references (`childRefKeys`) and their bytes dropped before the next
chunk, so memory follows the number of references, not the child lists' size. The number of rounds is at most the
depth of the deleted chain (5 on the preprod snapshot).

## 4. Properties

### 4.1 Safety: no deleted node is live

Every key of `D` is in neither `R_{h−1}` nor `R_h`. By induction on the rounds of step 4:

- A key q of `Q_{h−1} \ K` has `refs_{h−1}(q) = 0` and `roots_{h−1}(q) = 0` (I3), so no stored node references it
  and it is not a root at h − 1: q ∉ `R_{h−1}`. It gained no reference from `N` and has no root count after h (not in
  `K`), and no other node gains a reference in h (only `N` adds child lists): q ∉ `R_h`.
- A key k added in a later round had every stored parent deleted in earlier rounds (its count reached 0 counting
  every reference of `S_{h−1}` and of `N`), each in neither set by induction, and k is a root neither at h − 1 nor
  after h: so k is in neither set.

So neither the state the worker holds at h − 1 nor the state it builds at h reaches a deleted node, which is the
condition `docs/issues/00019` sets (the eviction does not refuse a live state's root, so this is kept by the rule, not
by the refusal). Only an object outside the held states (a kept parse) can hold one; the existing free-and-retry and
restart path handles it (§5).

### 4.2 No leak

After a block h with `on`, `S_h = R_{h−1} ∪ R_h` (I4's equality), given I1–I3 after h − 1 and `S_{h−1} ⊇ R_{h−1}`:
let `G = (S_{h−1} ∪ keys(N)) \ (R_{h−1} ∪ R_h)`. Every node of `N` is in `R_h` (§4.4), so `G ⊆ S_{h−1}`. Every stored
parent of a key of `G` is in `G` (a parent in `R_{h−1} ∪ R_h` would put the child there). The graph is acyclic (a key
is the hash of its children's keys, so a cycle needs a hash fixed point; none in the preprod snapshot), so `G`'s keys
with no parent in `G` have no stored parent at all and no root at h − 1: they are in `Q_{h−1}` (I3) and not in `K`
(gaining a reference or a root would put them in `R_h`). Step 4 deletes them, and then, round by round, every key of
`G` whose parents are all deleted. With §4.1, `D = G`. This holds also at the first block with `sweep` on after
blocks with it off: I3 holds throughout, so `Q_{h−1}` holds every parentless non-root node left by those blocks.

### 4.3 Equal to the sweep where its cycle fits one block

LG-14's sweep, when a whole cycle starts and ends in block h, marks from the root counts at h − 1 and the keys whose
count rose in h (`sweep.ts:197-208`) through the stored nodes and the batch's inserts, and deletes every unmarked node:
it keeps `R_{h−1} ∪ R_h` (the roots after h are among those two sets, and every key that rose has a positive count
after h). Both implementations start empty at genesis, so they store the same nodes at every height up to the first
block whose cycle does not fit. On preprod every block so far ran a whole cycle in-block (`sweep.cycle` =
height + 1, cycle 46,739 when the run stopped near 46,738: organizer plan P13.3 and questions Q-37). Where a cycle spans blocks, the sweep deletes a node only if
nothing reachable from the roots at the cycle's start or from any key that rose during it reaches it, a superset of
`R_{h−1} ∪ R_h`: the counted set is a subset of the swept set. *Derived here; R2 and R4 test both claims.*

When the sweep's model is fed the counting run's batches (R4), the comparison is valid in both regimes: the sweep model
deletes a node only after counting deleted it (subset), so the counting run's package, which evicted it, writes it
again whenever a later state needs it, and the sweep model sees that insert.

### 4.4 New nodes are reachable

`flushNodes` takes only nodes reachable from a key whose root count rose, through other taken nodes (patch
`vendor/ledger/v9/patches/0001-storage-core-external-node-store.patch:143-160`, export patch `0003-…:393-399`), so
every node of `N` should be in `R_h`. The step checks it without relying on it: by I1 no node of `S_{h−1}` references a
key outside `S_{h−1}`, so a node of `N` is referenced only by other nodes of `N`; in the acyclic graph some node of `N`
has no parent in `N`, and `unreferenced-new-node` requires it to be a root after h; by induction every node of `N` is in
`R_h`.

## 5. Eviction, the one-block lag and the worker restart

Unchanged from LG-14 and `core-arch` design §5.4, with the lag now set by rules 4 and 6 instead of the sweep's "roots as
committed at h − 1". With `retainStates` 0, block h releases the state after h − 1 (`engine.ts:554`), which the worker
holds until `commit(h)`: its root goes to `E` at h (when unreferenced) and its nodes are deleted at h + 1, after the
worker dropped that state. A node forgotten by the package but still stored is merely written again (a re-insert, no
count change); a node deleted but not forgotten would be referenced by a later new node without being written — the
`missing-reference` check halts that block instead of storing a dangling reference. A restart after a refused eviction
(Q144 B) recomputes the step from the same read at h − 1 and the new thread's batch, whose extra re-inserts change no
count (rule 1), so it gives the same `D`, counts and queue.

## 6. `sweep: off` (O-1)

The key keeps its name, values and kind (CF-4: data field, `on` or `off`, default `on`) and stays gated by the
development opt-in (CF-9; `src/config/history.ts:618-636`, feature `sweep-off`). While it is off at h, rules 1–3 and
5–7 run, step 4's `D` is empty and nothing is evicted: no node is deleted, the counts stay exact and the queue keeps
every parentless non-root node (I1–I3). The first block with it on again deletes the whole queue and its cascade by
rule 4, after which I4's equality holds again (§4.2). Unlike the sweep (`sweepReset`, `sweep.ts:281-294`), no reset
is written when it is turned off or on.

## 7. Crash safety and restarts

The step's writes and the block's batch are in the block's one transaction (RN-6): a crash leaves h − 1 or h, never a
mix. A crash after the eviction and before the commit leaves the deleted nodes stored and the restarted process with a
fresh worker, which reads them as needed: safe. A restarted process reads the counts and the queue from the database;
the step keeps nothing in memory between blocks. A block processed again after a lost transaction gets the same step
(the engine gives the same batch for the same pending block, `core-arch` design §5.3).

## 8. Determinism

`ref_counts` after h is a function of `S_h` (I2), and `S_h` and `Q_h` are fixed by the rules from the tables at h − 1
and the batch, so every machine with the same history stores the same rows. The cascade's fixed point does not depend
on the order of its rounds or of a round's keys; the merge, inserts and deletes are set operations; the statements are
the shapes both backends already run (`unnest` of `bytea[]`, `= ANY`, `ON CONFLICT`, a data-modifying `WITH`). The
digests compare each key's row before and after the block (DT-4), so netting is not visible in them either way.

## 9. Cost

### 9.1 Per block on preprod (estimated from the snapshot at 48,665; R21 measures it)

| | The sweep today (3,568 nodes, a whole cycle per block) | Reference counting |
|---|---|---|
| Child lists read and parsed | every stored node's, ≈ 7.7 MB (≈ 15.5 MB of hex), twice | the deleted nodes', ≈ 10 (≈ 22 KB); `N`'s are in the batch |
| Lookups | a flag per marked key, a scan of every node | ≈ 9 existence checks; the counts of the ≈ 10–20 keys whose count falls; the queue (1–2 rows) |
| Count changes | — | ≈ 544 increments and ≈ 544 decrements, netting to ≈ 18 keys |
| Rows written | the batch, ≈ 9 node deletes, the sweep row | the batch, ≈ 10 node deletes, ≈ 18 `ref_counts` rows, ≈ 2 queue rows: ≈ 40 |
| Growth | with the stored set, up to 10,000 node units per block | with the block's changes |

Over a whole sync every node is deleted at most once per insertion, so the deletion work is bounded by the insertion
work. The ≈ 18 is an estimate (organizer `research/00034-ledger-node-refcount-data/netting.out.txt`); R21 replaces it
with measured figures.

### 9.2 The block after a ledger conversion (O-3)

At the v8 → v9 conversion block F the batch releases the v8 state (`engine.ts:40-45`), so F's `E` holds its root and
F + 1 deletes every v8 node the v9 state does not share, in one block, with no cap (Q-C): the deleted set, the child
lists read round by round, the deletes captured for the digests, and the eviction. No real network has crossed a v8 →
v9 conversion yet (preprod's two runtime upgrades stay on v8; mainnet's pin at 1,774,492 is runtime 1.0, also v8).
R22 measures the spike on the devnet v8 → v9 tape in the build's first phase; if it is large, spreading it is a
separate decision (it changes which block deletes which node).

## 10. The halt code (O-6)

`ledger-refcount-invalid` joins `ERROR_CODES` (`src/deterministic-postgresql/errors.ts`) and `HALT_CODES`
(`src/runner/failures.ts:104-122`), so a failure with it halts with that code (`failures.ts` rule 1), and `core-arch`
design §11's list of halts. Its details: `reason` (§3.3), `height`, and per reason the key as `0x` hex
(`negative-count`, `missing-reference`, `unreferenced-new-node`) or the statement's name with the expected and actual
row counts (`row-count-mismatch`). It carries no configuration value. The code registry test
(`test/runner/code-registry.ts`) names the test that triggers it (A87).

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
| `test/backbone/sweep-model.ts` | Kept as R4's oracle until the close-out task that runs after R23 and R24 pass, which deletes it with R4's test (Q-E) |
| `test/backbone/sweep-tapes.ts` | Kept with `sweep-model.ts`, retired with it |
| `test/backbone/ledger-storage.test.ts`, `.negative-control.test.ts`, `ledger-storage-checks.ts` (A100–A104) | Kept; A104's case reworded (its "two sweep cycles" become the blocks after the release) |
| `test/backbone/ledger-eviction-restart.test.ts`, `.negative-control.test.ts` (A160) | Kept; the restart recomputes the counting step |
| `test/ledger/worker-sweep.test.ts` | Kept (the worker's eviction is unchanged); renamed `worker-eviction.test.ts`, its comments reworded |
| `test/ledger/fixtures/sweep-fixture.ts`, `sweep-test-loader.ts` | Kept as the DAG fixture and test package of the counting tests and of A160; extended with shared, duplicated and embedded children (A105) |
| New | the reference model and reachability oracle (`test/backbone/refcount-model.ts`, R1, R2); the step's unit tests; R3–R17's tests |

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
(organizer plan P13.2). It records, per 1,000-height window, the wall time and the stored node count, and the node's
slow stretches (its runtime-version call, made once per block, has taken ~1.8 s for 10–50 s at a time, P13.3) are
reported so a slow window is not read as UmbraDB's.

### 12.2 The before-picture

The stopped P13 run's PostgreSQL volume (`umbra-p13-long-pgdata`, stored height `H_p13`, 48,665 when the research read
it) holds the sweep's stored node set at `H_p13`. It is read only: an experiment copies it with
`CREATE DATABASE … TEMPLATE`, as P13.4 did.

### 12.3 The performance comparison (O-4)

Two runs from genesis to 50,000 on the same machine and setup, every core module but `core-contract-logs-fast`: the
**reference**, the branch's last commit before this change (no reclamation code) with `sweep: off`; and the
**candidate**, this change with `sweep: on`. For each 10,000-height band from 10,000 to 50,000, the candidate's
heights/s over the band is at least 80 % of the reference's. A 1,000-height window whose time in either run exceeds 3×
that run's median window time is listed with the node's state and left out of both runs' bands.

## 13. Delivery order (for `tasks.md`, written after the stage-1 gate)

The build follows `AGENTS.md` stage 2 (test first; one task per change set). Phases, as the organizer research §6.1
adjusted for Q-B and Q-E:

| Phase | Goal | Criteria |
|---|---|---|
| 0 | Measure per block on the recorded tapes; the v8 → v9 spike (O-3) | R21, R22 |
| 1 | Reference model and reachability oracle; the model against the sweep model | R1, R2 |
| 2 | `refcountStep` behind its tables seam; migration `002`; the halt code; every negative control seen failing | R11, R12, R16, R19 |
| 3 | Wiring on both backends: model equality, backend equality, the sweep differential (also against the runtime sweep, recorded before it is removed), restart, crash points, A160, re-insert, resurrection, the lag, reuse, `sweep: off`, backups | A104, A105, A160, R3–R10, R13–R15, R17 |
| 4 | Remove the runtime sweep; documents; the required test id; `npm run graph:refresh` | A134 (deferred, Q191), R18, R20, R26 |
| 5 | The local preprod runs | R23–R25 |
| 6 | Close-out: retire `sweep-model.ts` and R4's test (Q-E); `tasks.md` checked; the proposal's status; `ROADMAP.md`; `npm run graph:refresh` and `graphify-out/` committed with the close-out | — |

Phases 0 and 1 can run in parallel; 2 → 3 → 4 in series; 5 after 3. The new tests keep to the conformance gate's
deadline (105 minutes, about 75 used on a hosted runner, issue 00077): the per-block invariant of R3 runs after every
block on the fixture and at sampled heights on the tapes.

## 14. External claims and their evidence

| Claim | Evidence | Status |
|---|---|---|
| `INSERT … ON CONFLICT (node_key) DO NOTHING` reports only the rows really inserted; the `root_counts` merge shape reports the keys whose final count is non-zero (its `WITH` delete is not counted); `DELETE … WHERE node_key = ANY($1::bytea[])` reports the rows deleted | Probe on PGlite 0.5.10 (PostgreSQL 18.6) and PostgreSQL 18.6 (`postgres:18`), the repository's installed `@electric-sql/pglite` 0.5.10 and `postgres` 3.4.9: organizer `research/00034-ledger-node-refcount-data/probe-affected-rows.mjs` and `.out.txt` — identical on both | Verified |
| `BlockWriteHandle.execute` returns the number of rows a statement affected | `src/db/api.ts:39-42` | Verified (repository) |
| Every reference is stored; no root without a node; no cycle; depth 5; one block's garbage 10 nodes | Organizer `research/00034-ledger-node-refcount-data/analyze.out.json`, `garbage.out.txt`, `layers.out.txt` (preprod snapshot at 48,665) | Measured on one snapshot |
| `flushNodes` takes only nodes reachable from a key whose root count rose, stopping at nodes believed stored | `vendor/ledger/v9/patches/0001-storage-core-external-node-store.patch:143-160`, `0003-…:386-423` | Verified (repository); checked at run time by `unreferenced-new-node` |
| `layout-v2` writes a re-created node again | `upstream:storage-core/src/backend.rs:532-534` | Verified (upstream, pinned) |
| `midnight-storage-core` `layout-v1` kept a reference count per node and deleted at zero, decrementing children with multiplicity; `layout-v2` removed it | `upstream:storage-core/src/backend.rs:1202-1218`, `upstream:storage-core/src/db/sql.rs:250-266, 340-399`, `upstream:CHANGELOG_storage_core.md:23` | Verified (upstream, pinned); the reason for the removal is not given there (unconfirmed, not built on) |
| The sweep's cycle fit one block at every preprod height of the stopped run (cycle 46,739 at the stop, near 46,738) | Organizer plan P13.3, questions Q-37 | Measured |
| The size of the v8 state a real network releases at F | — | Unconfirmed: R22 measures the devnet tape's; no real network has converted |
| OpenSpec applies `## RENAMED Requirements` (FROM/TO) | `.claude/skills/openspec-sync-specs/SKILL.md:46, 75-76, 112-115` (generated by OpenSpec 1.6.0); no OpenSpec CLI is installed in this repository | Verified against the repository's instructions; the archive applies it |
