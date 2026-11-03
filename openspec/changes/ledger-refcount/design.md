# Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting

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
changes touch no requirement in common. This change's `ledger` delta (`specs/ledger/spec.md`) renames LG-14
(`## RENAMED Requirements`, FROM/TO, as the repository's OpenSpec skill describes it,
`.claude/skills/openspec-sync-specs/SKILL.md:46, 75-76, 112-115`) and restates LG-11, LG-13 and LG-14 whole under
`## MODIFIED Requirements`; its `determinism` delta (`specs/determinism/spec.md`) restates DT-3 and DT-4 whole, and its
`backups` delta (`specs/backups/spec.md`) restates BK-3 whole; each header matches `core-arch`'s exactly (LG-14's after
the rename). `start-umbradb` modifies neither `ledger` nor `determinism`, and of `backups` only BK-1. It
changes no `configuration` requirement, since the `sweep` key stays (O-1), and not MD-1 (§2.5). Both changes land in
PR #16 (decision Q-F).

**The owner's decisions** (2026-11-02; organizer `research/00034-ledger-node-refcount.md` §7 for Q-A … Q-F, organizer
`spec/00034-ledger-node-refcount.md` §3 for O-1 … O-8):

| # | Decision | What it fixes here |
|---|---|---|
| Q-A | Counts are computed in the process, not by database triggers | §3: `core-ledger-state` computes in `on-compute`, writes in `on-db-write`; no trigger |
| Q-B | No existing database is upgraded ("we are in development, there are no databases") | §2.4: an earlier build's database is refused |
| Q-C | No cap on a block's deletions | §3.2 rule 5 runs to the end |
| Q-D | The cascade runs inside the block | §3.2 rule 5; §4.5 |
| Q-E | The runtime sweep is removed; its model stays in the tests as the oracle until the local preprod run passes | §11: the sweep's model and the criteria that use it (R2, R4) retire together at close-out |
| Q-F | The change lands in PR #16, branch `00028-core-arch` | this section |
| O-1 | Keep the `core` entry's `sweep` key | §6: `off` deletes no node; counts kept |
| O-2 | One migration per part, across the branch: every part is a first version (`main` has none of them) | §2.4 |
| O-3 | The block after a release deletes what it must, whatever its size: no special rules | §9.2 |
| O-4 | The local performance target: ≥ 80 % of the no-reclamation rate in every 10,000-height band from 10,000 to 50,000 | §12.3, R23 |
| O-5 | The node's runtime-version call per block is a separate work item | the proposal's Non-goals |
| O-6 | One halt code, `ledger-refcount-invalid`, with a reason | §10 |
| O-7 | Q-38 (which performance work first) is resolved by this change | none (workspace record) |
| O-8 | "Lets match the node": a node the ledger writes again replaces its stored child list, as both of the node's storage back-ends do; a restarted worker then reads back what the ledger last wrote. Then "Content-based": the node tables take part in the contents hash by the nodes they hold, not by their bytes, since the ledger itself can spell one node two ways depending on its memory | §2.2, §2.5, §3.2, §4.4; R27–R29; issues `docs/issues/00078`, `00079` |
| D-7 | The vendored ledger only exposes inner workings; no change to how it computes, caches or serializes | §2.2, §11: no new ledger patch |

## 1. Words

| Term | Meaning |
|---|---|
| node, key | A ledger node: a payload (`data`) and a child list (`children`, the ledger's serialization). Its key (32 bytes) is the hash of its payload and its children's hashes (`upstream:storage-core/src/arena.rs` `hash`). |
| child, reference, embedded child | A child is `ArenaKey::Ref` (a 32-byte key, the child stored elsewhere) or `ArenaKey::Direct` (the child's payload and child list inline). A **reference** is one occurrence of a key as a `Ref` child, found through embedded children (`src/ledger/node-refs.ts` `childRefKeys`); a key listed twice is two references. |
| form | A node's child list. A child's hash is the same embedded or referenced (`upstream:storage-core/src/arena.rs:2847-2880`), so one key can have several forms (§2.2). |
| row | A node stored in `core_ledger_state.nodes`, with the form the ledger last wrote for it. |
| `S_h` | The keys of `nodes` after block h. |
| `refs_h(k)` | The number of references to k in the child lists of the rows of `S_h`, as stored after h. |
| `roots_h(k)` | k's root count after block h (`root_counts`; 0 without a row). A **persisted key** after h is a key with `roots_h(k) > 0`. |
| `R_h` | The rows reachable from the persisted keys after h through the child lists stored after h. `R_{−1}` is empty. |
| batch `B` | What the ledger worker flushed for block h (`src/ledger/types.ts:54-62`): `B.inserts`, nodes with the forms the package holds, and `B.rootCounts`, one netted signed change per key. |
| new nodes `N` | The nodes of `B.inserts` whose key is not in `S_{h−1}`. |
| rewritten nodes `W` | The nodes of `B.inserts` whose key is in `S_{h−1}` with another child list than the stored one. A node of `B.inserts` with its stored child list is **written again unchanged** (the package writes content again after its memory dropped the stored copy, `upstream:storage-core/src/backend.rs:532-534`, and on a restarted worker). |
| `K_h` | What block h keeps: `R_{h−1}`; the rows that the persisted keys after h and the nodes of `N` and `W` reach through the child lists stored after h; and the rows that the stored child lists of `W` at h − 1 reached through the child lists stored at h − 1. |
| protected in h | A key with a root count after h − 1 or after h, a key that a stored child list of `W` at h − 1 references, or a key of `N`. |
| queue `Q_h` | The keys of `unreferenced` after block h. |
| node set | Every key a database holds as a row or embedded in a row (an embedded node's key computed from its payload and its children's hashes, as the ledger computes keys). It does not depend on forms: two forms of a node hold the same keys (§2.5). |
| content-defined table | A table that takes part in the contents hash by what it holds rather than by its bytes, and whose rows are not captured per block (DT-3, DT-4 as this change modifies them): `nodes`, `ref_counts`, `unreferenced` (§2.5). |

## 2. Storage

### 2.1 The tables of `core-ledger-state`

| Table | Primary key | Other columns | Holds after block h |
|---|---|---|---|
| `nodes` | `node_key` | `data`, `children` (the form the ledger last wrote) | `S_h` |
| `root_counts` | `node_key` | `count integer CHECK (count > 0)` | `roots_h` (unchanged, `src/backbone/core-ledger-state/sql.ts:60-64`) |
| `states`, `segment_results`, `events` | unchanged | unchanged | unchanged |
| **`ref_counts`** | `node_key` (`bytea`, `CHECK (octet_length(node_key) = 32)`) | `count integer NOT NULL CHECK (count > 0)` | one row per key with `refs_h(k) > 0`, holding it |
| **`unreferenced`** | `node_key` (`bytea`, `CHECK (octet_length(node_key) = 32)`) | — | `Q_h` |

`sweep`, `grey` and `marks` are gone. The `ledger-state` table item lists
`["nodes", "root_counts", "states", "ref_counts", "unreferenced"]`, kind `mutable` (`core-ledger-state.ts:589` today
lists the sweep's three). `nodes`, `ref_counts` and `unreferenced` are **content-defined** (§2.5): the contents hash
takes `nodes` by its node set and checks the other two against it, and none of the three is captured or digested per
block. `root_counts`, `states`, `segment_results` and `events` stay byte-hashed, captured and digested as today. None
of the five is `deterministic: false`: DT-6's column rules and the `TRUNCATE` guard (DB-14) apply to all of them.
Their column types and keys are ones DT-6's startup check accepts (as `root_counts`).

### 2.2 Forms, and storing them as the node does (O-8)

A small child can be embedded in its parent or referenced by key, and the parent's key is the same either way, so one
node can have several forms. Which form the ledger package writes depends on how it came to hold each child: it embeds
a small child it builds afresh (`child_from`, `upstream:storage-core/src/storable.rs:139-148`); `Sp::persist` and
`Sp::into_tracked` turn a small node into a referenced one (`upstream:storage-core/src/arena.rs:1525-1540,
1329-1352`); the ledger's `RcMap` builds referenced children (`upstream:storage/src/delta_tracking/rcmap.rs:199, 224,
251`); and a node loaded from storage keeps the form it was stored in (`BackendLoader`,
`vendor/ledger/v9/patches/0003-ledger-wasm-node-store-exports.patch:319`, through `arena.rs:975-990`).

The form is not storage detail only: the ledger's storage-cost accounting reads a node's child list and counts a
referenced child differently from an embedded one (`update_rcmap`, `gc_rcmap`,
`upstream:storage/src/delta_tracking/mod.rs:199-300`), and that count is ledger state. So UmbraDB stores what the
ledger writes, and never rewrites it.

**When the ledger writes a node it already wrote, the stored row takes the new child list.** That is what both of the
node's storage back-ends do: the SQL one with `INSERT OR REPLACE` (`upstream:storage-core/src/db/sql.rs:578-590,
621-630`), ParityDB with `Set` (`upstream:storage-core/src/db/paritydb.rs:261-280, 297-320`). Today UmbraDB keeps the
first copy (`ON CONFLICT (node_key) DO NOTHING`, `sql.ts:135-137`), so a worker restarted from the database could read
an older form than the ledger last wrote — a form a restarted node never reads. With the row replaced, a restarted
worker rebuilds its memory from what the ledger last wrote, as a restarted node does. The write is
`INSERT … ON CONFLICT (node_key) DO UPDATE SET children = EXCLUDED.children WHERE nodes.children IS DISTINCT FROM
EXCLUDED.children`: a node written again unchanged touches no row, so change capture sees nothing (DT-4), and the
affected rows are the new and the rewritten nodes (probe, §14). A key is the hash of its payload, so a row's `data`
never changes.

### 2.3 Invariants

After every committed block h with `core-ledger-state` active:

- **I1 (closed):** every reference in a row's child list is a row.
- **I2 (counts):** `ref_counts` holds exactly the keys with `refs_h(k) > 0`, each with `refs_h(k)`.
- **I3 (queue):** `Q_h = { k ∈ S_h : refs_h(k) = 0 and roots_h(k) = 0 }`.
- **I4 (roots resolve):** every key with `roots_h(k) > 0` is a row. With I1, every retained state and every persisted
  contract and zswap state loads from the database with all it reaches.
- **I5 (no leak):** with `sweep` on at h, every row of `Q_{h−1}` that is not protected in h and gains no reference in h
  is gone after h; and, recursively, every row whose references at h − 1 all came from rows deleted in h, that gains
  no reference in h (from a node the batch writes) and is not protected in h, is gone after h. A protected row whose
  count reaches 0 is kept and queued (I3): for example, a key a rewrite stops referencing.
- **I6 (exact set):** for a batch in which every node of `N` and `W` is reached, through the batch's child lists and
  the stored ones, from a key whose root count rises in h — what `flushNodes` takes (§4.6) —: `R_{h−1} ∪ R_h ⊆ K_h ⊆
  S_h`; with `sweep` on at h, `S_h = K_h`; and when every node of `W` was in `R_{h−1}`, `K_h = R_{h−1} ∪ R_h`. For any
  other batch, I1–I5 still hold.

By I1 and I3, every row is reached from a persisted key or from a queued key, so the queue names all the garbage.

### 2.4 Migrations: one per part (O-2)

Every part these migrations belong to is new on this branch against `main`, which has no `src/backbone/` and no
migration runner, so a part that has migrations ships one, `001`:

| Part | Today | After |
|---|---|---|
| `core-ledger-state` | `001` (`nodes`, `root_counts`, `states`, `segment_results`, `events`), `002` (the sweep's `sweep`, `grey`, `marks`; `sql.ts:102-121`) | `001` creates `nodes`, `root_counts`, `states`, `segment_results`, `events`, `ref_counts`, `unreferenced` |
| `core-chain` | `001` (`core_chain.config`), `002` (`core_chain.identity`; `src/backbone/core-chain/sql.ts:36-69`) | `001` creates both tables |
| `core-private-source` | `001` (`cursor`), `002` (`accepted_config`, declared `deterministic: false`; `src/backbone/core-private-source/sql.ts:26-47`) | `001` creates both tables |

Every other part with migrations already has one (`git grep 'id: "00'` over `src/`); the parts without any
(`core-health`, `core-config`, `core-status`, `core-block-fetch`) keep none. The migration runner's own tests keep their
synthetic modules with two migrations (`test/db/migrate.test.ts`, `test/config/history-fixtures.ts`): they test DB-9
and DB-10, which are unchanged. A database written by an earlier build (`v0.10.0-rc.1`, `rc.2`, or this branch before
this change) recorded the old `001` of these parts, so its startup refuses before any migration runs with
`migration-checksum-changed`, naming the first such part, `001` and both checksums (DB-9, `src/db/migrate.ts`
`checkApplied`); `umbradb restore` of its backup refuses with `backup-build-mismatch` (BK-3). It resyncs into a new
database (decision Q-B). `requiresResync` (DB-10) could not express this: every core part carries `UMBRADB_VERSION`
(`src/config/build.ts:46`, `"0.10.0"`, the version of `rc.1` and `rc.2` too), and the check compares versions.

### 2.5 Content-based determinism (O-8; DT-3, DT-4)

The ledger can spell one node two ways (§2.2), and which way it writes depends on its memory: when it creates again a
node it already holds, its back-end keeps the old copy (`upstream:storage-core/src/backend.rs:485-512`, "only
reference counts can vary for a given key"), while a worker that does not hold the node creates and writes it anew.
So two indexers with different restart histories can hold one node in different bytes — and then also differ in which
small nodes are rows, and in the counts and queue derived from that. Changing the ledger to prevent it is ruled out
(D-7; reported upstream, issue `docs/issues/00079`). What they cannot differ in is **which nodes they hold**: a key is
the hash of a node's payload and its children's hashes, the same in every spelling, and every node a spelling embeds
is still held, with the same key.

So `core-ledger-state`'s node tables take part in the contents hash by content:

- **`nodes`** appears as `[schema, table, ["node_key"], [[k] for every k of its node set, in byte order]]`: the keys
  of its rows and of every node embedded in them, each once. An embedded node's key is computed on the main thread by
  the ledger's hash (the 4-byte little-endian payload length, the payload, and each child's key, SHA-256 —
  `upstream:storage-core/src/arena.rs` `hash`; `test/ledger/node-format.ts:140-148` implements it independently), in a
  new `src/ledger/node-key.ts` whose output a test checks against the package's keys.
- **Every row is authenticated** while the node set is computed: its key must be the hash of its payload and its
  children's keys (the check LG-11 already makes on every read), so a changed payload or child list fails the
  computation instead of leaving the node set unchanged.
- **`ref_counts`** and **`unreferenced`** appear as `[schema, table, null, null]`, after a check, in the same
  snapshot, that they hold exactly the counts and the queue the rows and `root_counts` give (I1–I4). They are
  bookkeeping derived from the spelling, so they are checked, not compared.
- IF a row's key does not match its content, or a check fails, THEN the computation fails with
  `ledger-refcount-invalid` (reason `tables-inconsistent`, `details.check` naming `node-key`, `closure`, `roots`,
  `counts` or `queue`, and the key): a backup is not written, a restore rolls back and refuses, the exported
  `contentsHash` rejects.
- **Per block**, none of the three is captured (DT-4) or digested (DT-5). What they hold after block h is fixed by data
  that is captured and digested: with `sweep` on, the node set after h is what the persisted keys after h − 1 and after
  h reach (I6), and those are `root_counts`' rows; with it off from block b on, the node set after b − 1 together
  with what every persisted key since b reached, from the same history. The configuration that sets `sweep` is in `core_chain.config`, hashed too.

What this guarantees, by construction rather than by test: two indexers that processed the same chain with the same
configuration have equal node sets after every block, hence equal contents hashes and equal digests of every captured
table that UmbraDB writes, whatever their restart histories (§4.4). What it does not: equal bytes in these three
tables. A spelling that would ever change a state result is still caught by the per-block root check (LG-15), which
halts.

**The bytes of a content-defined table are not part of the determinism contract**, like the rows of a `deterministic:
false` table. A module that copies them — `nodes.children`, a count of `nodes` rows, a `ref_counts` value — into its
own tables, or a private process that reads them over the private link, makes its own output depend on more than the
chain, as one copying a `deterministic: false` table's rows would; a module reads ledger state through ledger tasks
(LG-17) and `core-ledger-state`'s items instead. Modules stay trusted code (DB-6, owner decision Q46): the roles let
them read these tables and nothing more is enforced; the module guide says so.

The mechanism stays inside UmbraDB: the build gives `contentsHash` the content-defined tables and their content
function as it gives it the opted-out ones today (`src/determinism/contents-hash.ts:34-49`, `options.optedOut`);
`core-ledger-state` names its three tables content-defined in its declaration, a field only UmbraDB's own core modules
may set (a user module setting it is refused, `invalid-declaration`), so MD-1, which `start-umbradb` also amends, is
not changed. The contents hash is computed for backups and restores (`src/backup/facts.ts:108`,
`src/backup/restore.ts:439-447`) and by the exported `contentsHash` (`src/index.ts:35`); computing a node set reads
every row once.

## 3. The reclamation step

### 3.1 Where it runs

As the sweep does today (`core-arch` design §5.4; `core-ledger-state.ts:489-535`): in `on-compute`, after the apply and
the root check, `core-ledger-state` computes block h's step from on-compute's read (the tables as committed at h − 1)
and the batch held in memory, has the worker evict the deleted nodes, and keeps the step for `on-db-write`, which
writes it with the batch (`writeBlock`, `core-ledger-state.ts:452-472`). The step is a pure function behind a tables
seam, as `sweepStep` is behind `SweepTables` (`sweep.ts:84-101`): `refcountStep(tables, batch, { on })`, where `on` is
whether the `core` entry's `sweep` is on at h. It holds no state between blocks.

### 3.2 The rules, for block h

Inputs: on-compute's read at h − 1, giving `S_{h−1}` with each row's stored child list on demand, `refs_{h−1}`,
`roots_{h−1}` and `Q_{h−1}`; and `B`. `Δ(k)` is the netted change of k's reference count in h, 0 unless set below;
`roots'(k) = roots_{h−1}(k) + δ(k)`, where `δ(k)` is k's change in `B.rootCounts` (0 if absent).

1. **Classify the batch.** `N` = the nodes of `B.inserts` not in `S_{h−1}`; `W` = those in `S_{h−1}` whose child list
   differs from the stored one; the rest are written again unchanged and change nothing.
2. **Increments.** For each node of `N` and `W`, for each reference k in its child list from the batch: `Δ(k) += 1`.
3. **Rewrites.** For each node of `W`, for each reference k in its child list stored at h − 1: `Δ(k) −= 1`. Every key
   so decremented is protected in h: the state after h − 1, which the worker still holds during h, may reach it through
   the old child list.
4. **Protection.** A key with a root count after h − 1 or after h, decremented by rule 3, or of a node of `N`, is not
   deleted in h: a new node is never deleted in the block that inserts it. A rewritten node is not protected for being
   rewritten: if it is queued and nothing references or persists it, rule 5 deletes it, subtracting its new child
   list's references.
5. **Deletions, when `on`.** Starting from the keys of `Q_{h−1}`, repeat: every candidate k not yet deleted, not
   protected, with `refs_{h−1}(k) + Δ(k) = 0`, is deleted; for each node deleted in that round, for each reference k in
   its child list as stored after the block's writes (the batch's list for a node of `W`, else the stored one; a node
   of `N` is protected, so never deleted here),
   `Δ(k) −= 1` and k becomes a candidate — until a round deletes none. `D` is the set deleted. When not `on`, `D` is
   empty. No limit bounds `D` (Q-C); it holds a released state's whole chain of newly unreferenced rows (Q-D).
6. **Counts after h.** `refs_h(k) = refs_{h−1}(k) + Δ(k)` for every key with `Δ(k) ≠ 0`.
7. **Queue after h.** `Q_h = { k ∈ S_h : refs_h(k) = 0 and roots'(k) = 0 }`, where `S_h = (S_{h−1} \ D) ∪ keys(N)`
   (`D` holds no key of `N`, rule 4),
   computed over the keys whose membership can change in h — `Q_{h−1}`, the keys of `N`, the keys with `Δ(k) ≠ 0`, the
   keys of `B.rootCounts` — since any other row keeps its count and its root count. A key that enters the queue in h is
   deleted no earlier than block h + 1. In practice it holds the roots the block released.
8. **Checks** (§3.3), before eviction.
9. **Eviction.** The worker evicts `D` (`LedgerHost.evict`), in `on-compute`, before the block's transaction, as today
   (`core-ledger-state.ts:504`). A refusal after the worker freed every object it can restarts the worker and computes
   the block again, rules 1–9 included (`computeBlock`, LG-14, Q144 B, unchanged).
10. **Writes**, in `on-db-write`: the batch's nodes with the replacing insert of §2.2 (in `writeBlock`, chunked by
    `NODES_PER_STATEMENT`, 1,000, `core-ledger-state.ts:146`); the netted `Δ` of every key with `Δ(k) ≠ 0` merged into
    `ref_counts` (the shape of `root_counts`' merge, `sql.ts:138-142`: deltas added, a count reaching 0 deleted);
    `Q_{h−1} \ Q_h` deleted from `unreferenced` and `Q_h \ Q_{h−1}` inserted; `D` deleted from `nodes`. The node
    writes come before the deletion of `D`, since a rewritten node can be in `D` (deleting first and writing after would
    store it again); the `ref_counts` merge and the `unreferenced` changes touch other tables and commute with the rest.
    Each statement over a key list is chunked by 1,000 keys; the result does not depend on the chunking.

Why rule 4's root conditions: a key whose count reaches 0 but had a root count at h − 1 is in `R_{h−1}`, still held by
the worker during h (`docs/issues/00019`); if its root count also fell to 0 in h, rule 7 queues it and it is deleted at
h + 1 at the earliest. A key with a root count after h is in `R_h`. Rule 3 gives a reference that a rewrite drops the
same one-block delay.

### 3.3 Checks

Each check halts processing at h with `ledger-refcount-invalid` (§10) and nothing of the block stored; none repairs.

| `details.reason` | Fails when | Where |
|---|---|---|
| `negative-count` | some `refs_{h−1}(k) + Δ(k) < 0` | `on-compute`, before eviction |
| `missing-reference` | a reference in the batch's child list of a node of `N` or `W`, or a key whose root count rises in h, is not in `S_h` (neither in `S_{h−1} \ D` nor a key of `N`) | `on-compute`, before eviction |
| `row-count-mismatch` | a write affects another number of rows than computed: the node writes (summed over chunks) ≠ `|N| + |W|`; the `ref_counts` merge ≠ the number of keys with `Δ ≠ 0` and `refs_h > 0`; the `unreferenced` delete ≠ `|Q_{h−1} \ Q_h|`; its insert ≠ `|Q_h \ Q_{h−1}|`; the node delete ≠ `|D|` | `on-db-write`; the transaction rolls back |

`missing-reference` keeps I1 and I4: it is new strictness, since today the sweep marks a missing key and adds nothing
(LG-14 step 3), and a root without a node only fails later, when its state is loaded. The preprod snapshot at 48,665
has no reference to a missing node and no root without a node (organizer
`research/00034-ledger-node-refcount-data/analyze.out.json`: `missingChildRefs` 0, `rootsWithoutNode` 0). A new node
nothing references or persists is not a check: rule 7 queues it.

### 3.4 Reads

All through on-compute's read at h − 1, each an indexed lookup by key list (`= ANY($1::bytea[])` or a join on
`unnest`), chunked by 1,000 keys: for the nodes of `B.inserts`, which are rows and, for those whose child list differs,
the stored child list (one statement that sends the batch's child lists and returns only the rows that differ, so the
database compares the bytes; probe, §14); which keys of the references of `N` and `W` and of `B.rootCounts` are rows;
`unreferenced` in full (on preprod 1–2 rows); `root_counts` and `ref_counts` of the keys of `Q_{h−1}`, of
`B.rootCounts`, of every key rule 3 decrements, and of each round's candidates — every key whose count can fall, so
the step knows each such key's count after h, its queue membership and the merge's row count; and, per round of rule 5, the stored child lists of the nodes the round
deletes. Child lists are parsed to references (`childRefKeys`) and their bytes dropped before the next chunk, so memory
follows the number of references, not the child lists' size. The number of rounds is at most the depth of the deleted
chain (5 on the preprod snapshot).

## 4. Properties

### 4.1 Reachability does not depend on the form

Two forms of one node differ only in whether a small child is embedded or referenced; a small child embedded in a
form contributes its own references to its parent's child list (`childRefKeys` reads through embedded children). So
every form of a node reaches the same content; the rows it reaches differ at most by the small child itself, which
one form references as a row and the other holds inline.

### 4.2 Safety: no deleted row is live in the stored graph; the eviction covers the rest

**Through the stored child lists.** Every key of `D` is in neither `R_{h−1}` nor `R_h`, no root after h − 1 or after
h, and referenced by no child list stored at h − 1 or after h's writes. By induction on the rounds of rule 5: a deleted
key d is not protected (no root, not in a rewritten node's old child list), and `refs_h(d) = 0`, which counts every
reference in the child lists stored after h. So every row that referenced d at h − 1 was deleted in an earlier round
(in neither set, by induction) or rewritten — and then d would be protected by rule 3 — and no node the batch writes
references d. This is the condition `docs/issues/00019` sets, for every state as the database stores it: the eviction
does not refuse a live state's root, so this part is kept by the rule, not by the refusal.

**Through what the worker holds in memory.** The worker's objects need not carry the stored child lists: the ledger's
back-end keeps the form it first cached for a key while a live object built later may carry the other form
(`upstream:storage-core/src/backend.rs:485-512`, `upstream:storage-core/src/arena.rs:566-609`; issue 00079), and a kept
parse can hold any node. So a live object can hold d by reference while every stored child list embeds it or no longer
reaches it. That case is not prevented by the rules; it is caught: the package refuses to forget a node a live object
holds (`vendor/ledger/v9/patches/0001-storage-core-external-node-store.patch:8-30`), the worker frees its kept parses
and tries again, and a second refusal ends the worker and starts a new one (LG-14, Q144 B). The new worker loads the
state at h − 1 from the stored child lists, in which d is not reached, and computes the block again; a refusal on
that retry fails the block with `callback-error`, before anything is stored. So no deleted row is ever needed by the
state a worker builds from the database, and a worker whose memory holds one is replaced. R30 forces this path.

### 4.3 No leak (I5) and the exact set (I6)

`K_h ⊆ S_h` by §4.2 and the closure of the stored child lists (I1 at h − 1, `missing-reference` for the batch's). With
`on`, every row of `S_{h−1}` outside `K_h` is deleted, by induction on the length of the longest chain of parents above
it in the child lists stored at h − 1 (the graph is acyclic: a key is the hash of its children's hashes, so a cycle
needs a hash fixed point; the preprod snapshot has none). A row k outside `K_h` with no parent at h − 1 is not a root at
h − 1 (else it is in `R_{h−1}`), so it is in `Q_{h−1}` (I3); it is not protected (a root after h, or a reference in a
rewritten node's old child list, would put it in `K_h`) and no node the batch writes references it, so rule 5 deletes
it. A row k with parents at h − 1: each parent is outside `K_h` too and not rewritten with k in its old child list (else
k is in `K_h`), so by induction each is deleted in h; with no new reference and no protection, k's count reaches 0 and
rule 5 deletes it. Hence `S_h = K_h`, and I5 follows. `K_h = R_{h−1} ∪ R_h` when the nodes the batch writes are reached
from a persisted key after h and the rewritten ones were in `R_{h−1}`, since their old child lists then reach only rows
of `R_{h−1}`. This holds also at the first block with `sweep` on after blocks with it off: I3 holds throughout, so
`Q_{h−1}` holds every parentless non-root row those blocks left.

### 4.4 Determinism across worker histories (O-8)

**What is guaranteed.** Two indexers that processed the same chain with the same configuration hold, after every
block, the same node set, the same `root_counts`, `states`, `segment_results` and `events`, hence equal contents
hashes and equal digests of every captured table — whatever their restart histories — as long as no module copies the
bytes of a content-defined table into its own (§2.5). By induction over blocks:

- the root counts are the engine's (the new state persisted, the released states, the contract keys, `core-arch`
  design §5.4), functions of the chain; a worker restart gives the same (`core-arch` A160);
- with `sweep` on, the node set after h is what the persisted keys after h − 1 and after h reach (I6, for the batches
  `flushNodes` gives); a key is a hash of content, so what a key reaches does not depend on how any node is spelled;
- with `sweep` off from block b on, nothing is deleted, and the node set is the node set after b − 1 together with
  what every persisted key since b reached;
- the state roots are checked against the node's at every block (LG-15), so the `states` rows are the node's.

**What is not guaranteed: equal bytes in `nodes`, `ref_counts`, `unreferenced`.** A running worker can keep an old
spelling of a node that a restarted worker writes anew (`upstream:storage-core/src/backend.rs:485-512`), so two
indexers' rows for that node can differ; the content-based contents hash (§2.5) does not see it, by design. Replacing a
node written again (§2.2) keeps each indexer's restarts consistent with what its own ledger last wrote, as the node's
storage does. If a spelling difference ever changed a state result, the per-block root check halts that indexer.

R28 tests the guarantee with a test package that keeps an old spelling in a never-restarted run and writes the new one
in a restarted run, and on the recorded tapes with runs restarted at 20 heights; R29 tests the content-based hash
itself.

### 4.5 Equal to the sweep where its cycle fits one block

The runtime sweep keeps the first copy of a node written again, and counting replaces it, so their rows can differ in
form; compare the **node sets** instead (§2.5: every key a database holds as a row or embedded in a row, each embedded
node's key computed with `test/ledger/node-format.ts`'s `nodeKey`), which do not depend on forms. LG-14's sweep, when a
whole cycle starts and ends in block h, marks from the root counts at h − 1 and the keys whose count rose in h
(`sweep.ts:197-208`) through stored and batch child lists (`sweep.ts:218`) and deletes every unmarked row, keeping the
content reachable from the persisted keys after h − 1 and after h; counting keeps the same content when the nodes the
batch writes are reached from a rising key (§4.3, §4.6). Both start empty at genesis, so their node sets are equal
at every height up to the first block whose cycle does not fit. On preprod every block so far ran a whole cycle
in-block (`sweep.cycle` = height + 1, cycle 46,739 when the run stopped near 46,738: organizer plan P13.3 and questions
Q-37). Where a cycle spans blocks, the sweep deletes a row only if nothing reachable from the roots at the cycle's start
or from any key that rose during it reaches it, a superset of what counting keeps: counting's node set is a subset of
the sweep's. *Derived here; R2 and R4 test both claims.*

When the sweep's model is fed the counting run's batches (R4), the comparison is valid in both regimes for histories
without rewritten nodes: the sweep model deletes a node only after counting deleted it (subset), so the counting run's
package, which evicted it, writes it again whenever a later state needs it, and the sweep model sees that insert. With a
rewrite the two keep different rows (the sweep model keeps the first child list, counting the new one; a small node a
rewrite makes a row can then outlive, under counting, what the sweep keeps). The same holds when a key is deleted and
written again later in another form, and for a batch that writes a node no rising key reaches (counting keeps it one
block, a complete sweep cycle deletes it at once). So R2 and R4 compare only histories of admissible batches in which
every key is written in one form throughout, the deletions and re-insertions included; on a recorded tape, only the
heights before the first block at which R21 sees a key written in a form other than an earlier one; the other cases
are covered by R1, R3, R27 and R28.

### 4.6 The flush

`flushNodes` takes only nodes reachable from a key whose root count rose, through other taken nodes, and stops at nodes
the package believes stored (patch `vendor/ledger/v9/patches/0001-storage-core-external-node-store.patch:143-190`,
export patch `0003-…:386-423`; the same patches exist for `v8` and `v9-rc3`). So every node the batch writes is
expected to be reached from a persisted key after h, and its references to be rows (`missing-reference` checks the
latter). A new node that nothing references after all is queued and deleted at h + 1 unless referenced by then; R21
counts such nodes on the tapes.

## 5. Eviction, the one-block lag and the worker restart

Unchanged from LG-14 and `core-arch` design §5.4, with the lag now set by rules 3, 4 and 7 instead of the sweep's
"roots as committed at h − 1". With `retainStates` 0, block h releases the state after h − 1 (`engine.ts:554`), which
the worker holds until `commit(h)`: its root is queued at h (when unreferenced) and its rows are deleted at h + 1, after
the worker dropped that state. A reference that a rewrite drops waits the same block (rule 3). A row forgotten by the
package but still stored is merely written again (no count change); a row deleted but not forgotten would be referenced
by a later node without being written — `missing-reference` halts that block instead of storing a dangling reference. A
restart after a refused eviction (Q144 B) recomputes the step from the same read at h − 1 and the new thread's batch;
the new thread loads the child lists the ledger last wrote (§4.4).

## 6. `sweep: off` (O-1)

The key keeps its name, values and kind (CF-4: data field, `on` or `off`, default `on`) and stays gated by the
development opt-in (CF-9; `src/config/history.ts:618-636`, feature `sweep-off`). While it is off at h, rules 1–4 and
6–8 run, rule 5's `D` is empty and nothing is evicted: no row is deleted, the counts stay exact and the queue keeps
every parentless non-root row (I1–I4). The first block with it on again deletes the whole queue that is not
protected, and its cascade, by rule 5 (§4.3). Unlike the sweep (`sweepReset`, `sweep.ts:281-294`), no reset is
written when it is turned off or on.

## 7. Crash safety and restarts

The step's writes and the block's batch are in the block's one transaction (RN-6): a crash leaves h − 1 or h, never a
mix. A crash after the eviction and before the commit leaves the deleted rows stored and the restarted process with a
fresh worker, which reads them as needed: safe. A restarted process reads the counts and the queue from the database;
the step keeps nothing in memory between blocks.

## 8. Determinism across backends

`ref_counts` after h is a function of the rows and their child lists after h (I2), and `S_h` and `Q_h` are fixed by
the rules from the tables at h − 1 and the batch; for the same batch, PostgreSQL and PGlite store the same rows (R3,
A105). Across indexers with different worker histories, §4.4 gives equal node sets and equal hashes. The cascade's fixed point does not depend on the order of its rounds or of a round's keys; the writes are
set operations; the statements are the shapes both backends run (`unnest` of `bytea[]`, `= ANY`, `ON CONFLICT … DO
UPDATE … WHERE`, a data-modifying `WITH`), with the same affected-row counts on PostgreSQL 18.6 and PGlite 0.5.10
(§14). The digests compare each key's row before and after the block (DT-4), so netting is not visible in them.

## 9. Cost

### 9.1 Per block on preprod (estimated from the snapshot at 48,665; R21 measures it)

| | The sweep today (3,568 nodes, a whole cycle per block) | Reference counting |
|---|---|---|
| Child lists read and parsed | every stored node's, ≈ 7.7 MB (≈ 15.5 MB of hex), twice | the deleted rows', ≈ 10 (≈ 22 KB); the batch's are in memory |
| Lookups | a flag per marked key, a scan of every node | ≈ 9 existence checks, with the database comparing the child lists of nodes written again; the counts of the ≈ 10–20 keys whose count falls; the queue (1–2 rows) |
| Count changes | — | ≈ 544 increments and ≈ 544 decrements, netting to ≈ 18 keys |
| Rows written | the batch, ≈ 9 node deletes, the sweep row | the batch, ≈ 10 node deletes, ≈ 18 `ref_counts` rows, ≈ 2 queue rows: ≈ 40 |
| Growth | with the stored set, up to 10,000 node units per block | with the block's changes |

Comparing the child lists of the nodes written again sends their bytes to the database a second time; how many there
are per block is measured by R21. Over a whole sync every row is deleted at most once per insertion, so the deletion
work is bounded by the insertion work. The ≈ 18 is an estimate (organizer
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
design §11's list of halts. Its details: `reason` (§3.3), `height`, and per reason the key as `0x` hex
(`negative-count`, `missing-reference`) or the statement's name with the expected and actual row counts
(`row-count-mismatch`). It carries no configuration value. The code registry test (`test/runner/code-registry.ts`)
names the test that triggers it (A87).

## 11. What is removed, rewritten and kept

**Code.**

| Path | Fate |
|---|---|
| `src/backbone/core-ledger-state/sweep.ts` | Removed: `sweepStep`, `sweepReset`, `SweepTables`, `GreyPicker`, `BYTE_ORDER`, `SWEEP_BUDGET`, `writeSweep` |
| `src/backbone/core-ledger-state/sql.ts` | One migration `001` (§2.4); the node insert replaces a changed child list (§2.2); the sweep's statements and readers removed (`sql.ts:158-177, 297-398`); the step's reads and writes added |
| `src/backbone/core-ledger-state/refcount.ts` | New: `refcountStep`, its tables seam, `writeRefcount` |
| `src/backbone/core-ledger-state/core-ledger-state.ts` | `sweepOf` → the counting step; the `sweepBudget` and `greyPicker` options removed; the `ledger-state` item's tables (§2.1); `writeBlock` returns the written count |
| `src/backbone/core-chain/sql.ts`, `src/backbone/core-private-source/sql.ts` | One migration `001` each (§2.4) |
| `src/deterministic-postgresql/errors.ts`, `src/runner/failures.ts` | The halt code (§10) |
| `src/determinism/contents-hash.ts`, `src/db/change-capture.ts`, the schema plan (`src/db/roles.ts`) | Content-defined tables: hashed by their content function, not captured per block; DT-6's rules and the `TRUNCATE` guard kept (§2.5) |
| `src/ledger/node-key.ts` | New: a node's key from its payload and its children's keys (the node set's embedded keys) |
| `src/modules/declaration.ts`, `src/modules/validation.ts` | The content-defined declaration of a table item, refused for user modules (§2.5) |
| `src/ledger/` comments that name "the sweep" (`adapter.ts:328`, `types.ts:270`, `worker/engine.ts:67-69, 642`, `worker/host.ts:107`) | Reworded to reclamation; no behaviour change |
| `src/config/core-settings.ts:177`, `src/config/history.ts`, `src/cli/config-check.ts` | Unchanged (O-1) |
| `vendor/ledger/` | Unchanged: no new patch |

**Tests.**

| Path | Fate |
|---|---|
| `test/backbone/ledger-sweep.test.ts`, `ledger-sweep-tables.test.ts` | Removed with `sweep.ts` (tests of the runtime sweep's step and tables) |
| `test/backbone/ledger-sweep-process.test.ts` (A105's required test) | Replaced by `ledger-refcount-process.test.ts` carrying `[[ledger.refcount-cross-backend-identical]]` |
| `test/backbone/ledger-sweep.negative-control.test.ts` | Replaced by the counting negative controls (R12) |
| `test/backbone/sweep-tapes.ts` | Split when the sweep is removed: the DAG fixture's plumbing (`SWEEP_LOADER`, `sweepTape`, `sweepCore`, `sweepTables`, `sweepWatcher`, `tablesByHeight`), which `eviction-restart.ts`, `ledger-eviction-restart.test.ts` and `ledger-storage.test.ts` import, moves to a kept `test/backbone/ledger-graph-tapes.ts`; their comparison with the sweep's model (`modelOfFixture`, `modelProblems`) becomes a comparison with the counting model (`test/backbone/refcount-model.ts`); what stays in `sweep-tapes.ts` serves R2 and R4 only |
| `test/backbone/sweep-model.ts` and the rest of `sweep-tapes.ts` | Kept as R2's and R4's oracle until the close-out task that runs after R23 and R24 pass, which deletes them with R2's and R4's tests (Q-E) |
| `test/backbone/core-chain.test.ts`, `test/backbone/core-private-source.test.ts` | Their migration-list and checksum cases follow §2.4 |
| `test/backbone/ledger-storage.test.ts`, `.negative-control.test.ts`, `ledger-storage-checks.ts` (A100–A104) | Kept; A104's case reworded (its "two sweep cycles" become the blocks after the release) |
| `test/backbone/ledger-eviction-restart.test.ts`, `.negative-control.test.ts` (A160) | Kept; the restart recomputes the counting step |
| `test/ledger/worker-sweep.test.ts` | Kept (the worker's eviction is unchanged); renamed `worker-eviction.test.ts`, its comments reworded |
| `test/ledger/fixtures/sweep-fixture.ts`, `sweep-test-loader.ts` | Kept as the DAG fixture and test package of the counting tests and of A160; extended as A105 says |
| New | the reference model and reachability oracle (`test/backbone/refcount-model.ts`, R1, R2); the step's unit tests; R3–R17's, R22's and R27–R29's tests; `node-key.ts` checked against the packages' keys |

**Documents.** `CHANGELOG.md` (one line: reclamation by reference counting; a node written again replaces its stored
child list; the ledger's node tables hashed by the nodes they hold; one migration per part; databases of earlier
builds refused); `core-arch` design §4 (the determinism component: content-defined tables); `ROADMAP.md:37, 87`; `core-arch` design
§5.4 (its sweep paragraphs replaced by a pointer to this design's §2–§7), §8 (`accepted_config`'s migration,
design.md:1459), §10 (the `nodes` row's "an existing key is left as it is" replaced by §2.2's rule; the three sweep rows
replaced by the two tables; the `002` notes of `core_chain.identity` and `core_private_source.accepted_config`) and §11
(the halt code); `core-arch` acceptance §17's row for A105's id; issue `docs/issues/00078` closed at close-out. The
README has no `sweep` row today (`README.md:184` lists `retainStates` only) and gets none.

## 12. Local preprod runs (R23–R25)

### 12.1 Setup

The archive node is reachable on the owner's LAN only, so these runs are never part of CI and never in the
required-test manifest; their results are manual evidence in the pull request. A script in the repository,
`scripts/local-preprod-sync.mjs`, runs them when `UMBRADB_LOCAL_NODE` holds the node's WebSocket URL, and without it
exits non-zero naming the variable; it is not a test file. It runs the build's `umbradb run` **inside a
`node:24.9.0-alpine` container on the same Docker network as a `postgres:18` container**: from the host through Docker
Desktop's port, every database answer over ~8–16 KB costs ~14 ms, which measures Docker Desktop rather than UmbraDB
(organizer plan P13.2). It records, per 1,000-height window, the wall time and the stored row count.

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
| 0 | Measure on the recorded tapes: per-block figures, the conversion spike, the nodes written again and how many of them change their child list | R21 |
| 1 | Reference model and reachability oracle; the model against the sweep's model | R1, R2 |
| 2 | The replacing node write; `refcountStep` behind its tables seam; content-defined tables in the contents hash and change capture; the migrations of §2.4; the halt code; every negative control seen failing | R11, R12, R16, R19, R27, R29 |
| 3 | Wiring on both backends: model equality, backend equality, determinism across worker histories, a live object holding a deleted row (R30), the sweep differential (also against the runtime sweep, recorded before it is removed), restart, crash points, A160, nodes written again, a queued key referenced again, the lag, reuse, a lowered window, `sweep: off`, backups, the conversion | A104, A105, A160, R3–R10, R13–R15, R17, R22, R28 |
| 4 | Remove the runtime sweep (with the split of `sweep-tapes.ts`, §11); documents; the required test id; `npm run graph:refresh` | A134 (deferred, Q191), R18, R20, R26 |
| 5 | The local preprod runs | R23–R25 |
| 6 | Close-out: retire `sweep-model.ts` with R2's and R4's tests (Q-E); close issue 00078; `tasks.md` checked; the proposal's status; `ROADMAP.md`; `npm run graph:refresh` and `graphify-out/` committed with the close-out | — |

Phases 0 and 1 can run in parallel; 2 → 3 → 4 in series; 5 after 3. Every new or changed crash, property or
differential test runs at least five times before the change merges (`AGENTS.md`, "Flaky tests"). The new tests keep to
the conformance gate's deadline (105 minutes, about 75 used on a hosted runner, issue 00077): R3's check runs after
every block on the DAG fixture and at sampled heights on the tapes.

## 14. External claims and their evidence

| Claim | Evidence | Status |
|---|---|---|
| `INSERT … ON CONFLICT (node_key) DO NOTHING` reports only the rows really inserted; the `root_counts` merge shape reports the keys whose final count is non-zero (its `WITH` delete is not counted); `DELETE … WHERE node_key = ANY($1::bytea[])` reports the rows deleted | Probe on PGlite 0.5.10 (PostgreSQL 18.6) and PostgreSQL 18.6 (`postgres:18`), the repository's installed `@electric-sql/pglite` 0.5.10 and `postgres` 3.4.9: organizer `research/00034-ledger-node-refcount-data/probe-affected-rows.mjs` and `.out.txt` — identical on both | Verified (run) |
| `INSERT … ON CONFLICT (node_key) DO UPDATE SET children = EXCLUDED.children WHERE n.children IS DISTINCT FROM EXCLUDED.children` leaves an unchanged row untouched and uncounted, replaces a changed one and counts it, and counts an inserted one; a join of the batch's child lists on the stored ones returns exactly the rows that differ, with their stored child list | Probe on the same versions: organizer `research/00034-ledger-node-refcount-data/probe-replace.mjs` and `.out.txt` — identical on both | Verified (run) |
| `BlockWriteHandle.execute` returns the number of rows a statement affected | `src/db/api.ts:39-42` | Verified (repository) |
| The node's storage back-ends replace a node written again | `upstream:storage-core/src/db/sql.rs:578-590, 621-630` (`INSERT OR REPLACE`), `upstream:storage-core/src/db/paritydb.rs:261-280, 297-320` (`Set`) | Verified (upstream, pinned) |
| The ledger's storage-cost accounting reads child lists and counts referenced and embedded children differently | `upstream:storage/src/delta_tracking/mod.rs:199-300` | Verified (upstream, pinned) |
| A child's hash is the same in both forms; a new child is embedded when small; `persist` and `into_tracked` give a small node the referenced form; `RcMap` builds referenced children; a loaded node keeps its stored form | `upstream:storage-core/src/arena.rs:975-990, 1329-1352, 1525-1540, 2847-2880`, `upstream:storage-core/src/storable.rs:139-148`, `upstream:storage/src/delta_tracking/rcmap.rs:199, 224, 251` | Verified (upstream, pinned, v9); the `v8` package's `storage-core` (`ledger-8.1.2`) not read: R28 runs on the v8 tapes |
| UmbraDB's patches persist roots through a fresh object (`hold_as_node`) and load stored nodes through `BackendLoader` | `vendor/ledger/{v8,v9-rc3,v9}/patches/0003-ledger-wasm-node-store-exports.patch` (`v9`: 319, 333-334, 383, 483, 503; `v8`: 299-300, 349, 449, 469) | Verified (repository) |
| No reference to a missing node, no root without a node, no cycle; depth 5; one block's garbage 10 nodes | Organizer `research/00034-ledger-node-refcount-data/analyze.out.json`, `garbage.out.txt`, `layers.out.txt` (preprod snapshot at 48,665) | Measured on one snapshot; checked at run time by `missing-reference` |
| `flushNodes` takes only nodes reachable from a key whose root count rose, stopping at nodes believed stored | `vendor/ledger/v9/patches/0001-storage-core-external-node-store.patch:143-190`, `0003-…:386-423` | Verified (repository); not relied on for safety (§4.6) |
| `layout-v2` writes a re-created node again | `upstream:storage-core/src/backend.rs:532-534` | Verified (upstream, pinned) |
| `midnight-storage-core` `layout-v1` kept a reference count per node and deleted at zero, decrementing children with multiplicity; `layout-v2` removed it | `upstream:storage-core/src/backend.rs:1202-1218`, `upstream:storage-core/src/db/sql.rs:250-266, 340-399`, `upstream:CHANGELOG_storage_core.md:23` | Verified (upstream, pinned); the reason for the removal is not given there (unconfirmed, not built on) |
| A running worker keeps the old copy of a node it creates again; a worker that does not hold it creates it anew | `upstream:storage-core/src/backend.rs:485-512, 531-534` | Verified (upstream, pinned); the reason the bytes, not the node set, can differ across histories (§2.5, §4.4) |
| The contents hash is computed for backups, restores and the exported `contentsHash`; opted-out tables are passed in by the build | `src/backup/facts.ts:108`, `src/backup/restore.ts:439-447`, `src/index.ts:35`, `src/determinism/contents-hash.ts:34-49` | Verified (repository) |
| The ledger's node key is SHA-256 over the 4-byte little-endian payload length, the payload and each child's key | `upstream:storage-core/src/arena.rs` `hash`; `test/ledger/node-format.ts:140-148` (an independent implementation the tests already check against the packages) | Verified (repository and upstream); `src/ledger/node-key.ts` checked against the packages by a test (§11) |
| The sweep's cycle fit one block at every preprod height of the stopped run | Organizer plan P13.3, questions Q-37 | Measured |
| The devnet v8 → v9 tape converts at F = 103 with contracts deployed on v8 | `test/backbone/contract-data.test.ts:209` | Verified (repository) |
| Every core part's migrations, and `main`'s lack of them | `git grep 'id: "00'` over `src/` (three parts with a `002`; `core-health`, `core-config`, `core-status`, `core-block-fetch` with none); `main` (`c8b6ff1`) has no `src/backbone/` and no `src/db/migrate.ts` | Verified (repository) |
| OpenSpec applies `## RENAMED Requirements` (FROM/TO) | `.claude/skills/openspec-sync-specs/SKILL.md:46, 75-76, 112-115` (generated by OpenSpec 1.6.0); no OpenSpec CLI is installed in this repository | Verified against the repository's instructions |
