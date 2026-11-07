# Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting

No implementation code before the stage-1 gate (the cold adversarial review of this change, its thirteen targeted fix
checks, and the owner's approval on 2026-11-02). Then one task per change set, test first: write the tests for the
task's criteria, watch them fail for the intended reason, implement until they pass; a `[NEG]` criterion's negative
control is committed and seen failing for its own reason with the fault put back. Database tests run on PostgreSQL 18
in Docker and on PGlite, never on mocks. After each task: `npm run typecheck` and the tests it touched green, and the
task checked here with the criteria it demonstrated; at each section's end the whole `npx vitest run`, compared with
§0, and `npm run graph:refresh` with `graphify-out/` committed alone (AGENTS.md stage 2, `CLAUDE.md`).

**A task's criteria are `acceptance.md`'s, verbatim** (AGENTS.md stage 2): an id below means the whole criterion as
`acceptance.md` states it, its tag, cases and negative controls included. Where a criterion is split across tasks, each
task quotes the clauses it delivers, and the criterion is checked only when its last part passes. A criterion that
proves ambiguous or untestable is escalated, never read weaker (AGENTS.md, "Stop and escalate").

**A document a test reads changes with the code it describes**, in the same change set: `core-arch` design §11's halts
(the code registry test), §10's tables (A102), §13's retirement list (A5, `test/library-surface/retirement.test.ts`) and
`core-arch` acceptance §17's required-test table (the manifest's check). The other documents of `design.md` §11 change
in 5.2.

Order (`design.md` §13, with the deviations it needs to stay buildable): §0 records the baseline; §1 (measurements on
the tapes) and §2 (the reference model) run in parallel; §3 builds the parts below the process and ends with **the
switch** (3.8), the one change set that moves `core-ledger-state` from the sweep to the counting step together with the
tests and helpers that checked the sweep through the running core — before it the runtime sweep runs and its tests
pass, after it the counting step runs and the sweep's code is unused until 5.1 removes it; §4 checks the process on
both backends; §5 removes the sweep and updates the documents; §6 is the full verification and ends with CI green on
the pull request's head; §7 the local preprod runs; §8 the review; §9 the close-out, whose first task waits for R23 and
R24. Every commit is the corporate identity's, signed and with its DCO line; none is pushed without the owner's word.

## 0. Baseline

- [x] 0.1 Record the base commit and the state of the tree before any change.
      **Acceptance:** `npm run typecheck` exit 0 and a full `npx vitest run` on the base, its failures listed, each
      unrelated one filed in `docs/issues/` (or the existing issue named). The list is diagnostic: no later gate passes
      by pointing at it.
      **Done (2026-11-03):** base `5bcffec`. `npm run typecheck` exit 0; `npx vitest run` with `UMBRADB_TAPES` set: 387
      files, 6,252 tests passed, 12 skipped, no failure (1,585 s). No known failures: every later full run must pass.

## 1. Measurements on the recorded tapes (`design.md` §9, §13 phase 0)

- [x] 1.1 R21's batch figures, from the batches the base build flushes, each node classified against the child list
      last written for its key (tracked across the batches, a deletion ending it).
      **Acceptance:** R21's clauses "On the recorded stagenet 0–10,000, preprod 0–10,000 and devnet v8 → v9 tapes, per
      block: the batch's nodes; the nodes written again unchanged; the rewritten nodes; the keys written in a form other
      than one written for them earlier, deletions and re-insertions included; the new nodes' references; […] the root
      counts released; […] — reported per tape as distributions (median, 99th percentile, maximum)", with the first
      height per tape at which a key is written in another form (R4's comparison stops there); recorded here and in the
      pull request. The rest of R21 is 4.10's.
      **Done (2026-11-03, this commit):** measured on the base build (`5bcffec`, the runtime sweep running) by a harness
      outside the repository that edits nothing here (organizer `research/00034-ledger-node-refcount-data/measure/`):
      the real process from genesis on PGlite over a tape node, with the A99 tape replays' settings, `retainStates` 0
      and `sweep` on; the ledger worker's flushed batches and the sweep's evictions recorded; each batch node
      classified against the child list last written for its key, a deletion ending it. Two module sets (Q-1.1-1,
      decided by the runner): the ledger core (A99's) and with `core-contract-states` (R22's); their figures differ
      only on the devnet ("core; contracts" below). **First height at which a key is written in another form: none**
      on any of the three tapes in either set — no rewrite, and no key written with two child lists, the 18,757
      re-insertions after a deletion on stagenet and 553 on preprod included — so R4 compares every height of each
      tape. Checks, passing on every run: the new nodes are the base build's node inserts counted from the database
      (its row count after every block plus the sweep's deletions: stagenet 91,070, preprod 75,290, devnet 1,493 and
      1,499); no key is reported rewritten, so C3 (two different child lists for each) holds vacuously, and a control
      that writes a stored node again with a referenced child embedded is seen as one rewrite and one other form; the
      tracked node set is the database's at every block; every key is its node's hash. Codex runs: `1.1-measure-sets`
      (exit 0, all six captures, checks C1–C7 pass), reproduced byte for byte by `1.1-measure-tapes`; controls
      `1.1-measure-controls-3` (each fault fails its own check); the whole suite `1.1-full`: 386 of 387 files, the
      one failure A130's load-only hang (issue 00041), the file passing alone (`1.1-browser-alone`). The full report,
      for the pull request: `measure/r21-batch-figures.md` there; the runtime sweep's node set after every block, for
      4.9 (R4's runtime half): `measure/runtime-sweep-node-sets/`. Per block, median / p99 / max over every block of
      the range ("released": the root counts released, each by 1):

      | Tape | batch's nodes | written again unchanged | rewritten | other form | new nodes' references | released |
      |---|---|---|---|---|---|---|
      | stagenet 0–10,000 | 10 / 10 / 112 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 349 / 694 / 714 | 1 / 1 / 1 |
      | preprod 0–10,000 | 8 / 9 / 24 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 156 / 364 / 370 | 1 / 1 / 1 |
      | devnet 0–235 | 6 / 17 / 31 | 0 / 0 / 1; 0 / 0 / 2 | 0 / 0 / 0 | 0 / 0 / 0 | 19 / 37 / 40 | 1 / 1 / 1 |

## 2. The reference model and the reachability oracle (`design.md` §2.3, §3.2, §4; §13 phase 1)

- [x] 2.1 `test/backbone/refcount-model.ts`: the model, the reachability oracle and the generators of R1.
      **Acceptance:** R1.
      **Done (2026-11-03, this commit):** the model (`refcountModelStep(tables, batch, { on, fault? })`: rules 1–8 and
      10 of `design.md` §3.2 over hex keys, `childRefKeys` the only import from `src/`; `RefcountModel` across blocks;
      `RefcountModelHalt` for `negative-count` and `missing-reference`), `nodeSet`, the generators (`historyScripts`,
      `driveHistory`: real `layout-v2` child lists built with `test/ledger/node-format.ts`) and the oracle (`oracle`:
      `R_{h−1}`, `R_h`, `K_h`, counts, queue and protection recomputed from the generated persisted keys and the lists
      last written). R1 in `test/backbone/refcount-model.test.ts`: the property (seed 20261103, 200 runs) finds I1–I5
      after every block, I6 (with `S_h = K_h` where `sweep` is on) after every admissible one and `R_{h−1} ⊆ S_h` after
      every block, and asserts that the runs show each of R1's cases (`R1_CASES`, 19, admissible and non-admissible
      batches among them); five hand-made blocks pin both queued-node rewrites, a released state's deletion the block
      after and the halts. `[NEG]`: the committed control runs the model with rule 4's root conditions removed
      (`no-root-conditions`) and with a released state's rows also deleted in the block that releases it
      (`released-in-block`); each is seen failing the oracle's `R_{h−1} ⊆ S_h` (the second naming "a row of a state
      released at h"); with the fault put into the property itself it fails after one run. Questions Q-2.1-1
      (`missing-reference` checks a deleted rewritten node's new list too, as written: the generators avoid the case,
      a test pins the halt) and Q-2.1-2 (both faults committed). Five Codex runs green (`2.1-r1-run1`…`5`).
- [x] 2.2 The model against the sweep's model (`test/backbone/sweep-model.ts`).
      **Acceptance:** R2.
      **Done (2026-11-03, this commit):** `test/backbone/refcount-sweep-differential.test.ts` feeds 2.1's histories in
      one form (`historyScripts({ oneForm: true })`: admissible batches, no rewrite, no other form after a deletion;
      the test checks each batch admissible and each key's child list unchanged) to the counting model and to
      `SweepModel`, and compares node sets (`nodeSet`) after every block (seed 20261104, 150 runs each): equal with a
      budget of 1,000,000, under which the sweep ends its cycle in every block with `sweep` on (checked); a subset with
      a budget of 50. The runs delete and write rows again and turn `sweep` off (2,423 deletions, 712 rows written
      again, 273 heights off), and with budget 50 cycles span blocks (534 blocks) and the sweep holds more at 446
      heights; the test asserts floors on these. `[NEG]`: the counting model with its cascade stopped after the first
      round differs from the sweep's where each cycle fits (committed control; with the fault put into the equality
      property it fails at height 2 of its first run). Five Codex runs green (`2.2-r2-run1`…`5`).

## 3. Storage, the step, and the switch (`design.md` §2, §3, §10; §13 phase 2)

- [x] 3.1 The halt code `ledger-refcount-invalid` in `ERROR_CODES` (`src/deterministic-postgresql/errors.ts`) and
      `HALT_CODES` (`src/runner/failures.ts`), with the details of `design.md` §10, and in `core-arch` design §11's halts.
      **Acceptance:** R19's clause "`ledger-refcount-invalid` is in `ERROR_CODES`, in `HALT_CODES` and in `core-arch`
      design §11's halts"; `test/runner/code-registry.test.ts` passes. The registry's naming of R11's test is 3.8's.
      **Done (2026-11-03, this commit):** the code in `ERROR_CODES` (its comment gives §10's details: `reason`,
      `height`, `key` or `statement`/`expected`/`actual`, and §2.5's `tables-inconsistent` with `check`), in
      `HALT_CODES` and in `core-arch` design §11's halts. Test first: `test/runner/failures.test.ts` gains a case (the
      code raised in `on-compute` and `on-db-write` halts with that code, its height, module and point, never
      `callback-error`), seen failing (`callback-error`) before the code was listed. The registry (A87) lists the code
      as pending for this change's task 3.8 (questions file Q-3.1-1, A, for the owner's review): `code-registry.ts`
      reads this change's `tasks.md` (`changeTasks`, ids prefixed `ledger-refcount `), `code-registry.test.ts` takes a
      second baseline holding this one code, and a new negative control shows the registry failing once 3.8 is ticked
      with the code still pending. R19's first clause demonstrated; `code-registry.test.ts` and its negative controls
      pass. Task 3.8 registers R11's test and removes the pending entry. (After 3.8, the owner had the pending path
      removed, its one use done: `changeTasks` and its control are gone in `382cfb5`; Q-3.1-1.)
- [x] 3.2 One migration per part (`design.md` §2.4): `core-ledger-state`'s, `core-chain`'s and
      `core-private-source`'s `002` folded into their `001`; `core-ledger-state`'s `001` also creates `ref_counts` and
      `unreferenced`, and keeps the sweep's `sweep`, `grey` and `marks` until 5.1 removes the sweep; `core-arch` design
      §10's tables (the two new ones, the `002` notes of `core_chain.identity` and `core_private_source.accepted_config`)
      and §8's sentence on `accepted_config`'s migration.
      **Acceptance:** R16's clauses "A new database gets `ref_counts` and `unreferenced` […], and `core_chain.identity`
      and `core_private_source.accepted_config` from their parts' `001`; a database whose recorded migrations are an
      earlier build's (`core-ledger-state`'s, `core-chain`'s or `core-private-source`'s `001` and `002`) refuses startup
      with `migration-checksum-changed`, naming the part, `001` and both checksums, and runs no migration; a backup
      carrying those migrations is refused by `umbradb restore` with `backup-build-mismatch`", on both backends; A102
      (`test/backbone/ledger-storage.test.ts`) and the migration cases of `core-chain.test.ts` and
      `core-private-source.test.ts` pass. R16's "and none of `sweep`, `grey`, `marks`" is 5.1's.
      **Done (2026-11-03, this commit):** each part's `002` folded into its `001` (`CORE_CHAIN_MIGRATION` replaces
      `CONFIG_MIGRATION` and `IDENTITY_MIGRATION`); `core-ledger-state`'s `001` also creates `ref_counts` and
      `unreferenced` (design §2.1's columns and checks) and keeps `sweep`, `grey`, `marks`; the `ledger-state` item lists
      the two new tables (`core-ledger-state.test.ts` refuses a created table the item does not declare); `core-arch`
      design §10 (two rows; the `002` notes) and §8. Test first, seen failing before the fold (Codex `3.2-red`): R16's
      clauses on both backends in `test/backbone/part-migrations.test.ts` (the public process: a new database's
      tables from each part's `001`; an earlier build's records refuse startup with `migration-checksum-changed`,
      naming the part, `001` and both checksums, no migration run, on a database holding only those records and on one
      this build wrote), `test/private/part-migrations.test.ts` (the same for `core-private-source` on a private
      process) and `test/backup/restore-earlier-build.test.ts` (a ledger backup and a private backup carrying an
      earlier build's rows of each part refused with `backup-build-mismatch`, the target empty); the earlier build's
      checksums (`v0.10.0-rc.2`, identical to this branch's base) and the rewrites in `test/backbone/earlier-build.ts`.
      `core-chain.test.ts`'s and `core-private-source.test.ts`'s migration cases rewritten to one migration (the new
      pinned checksum of `core-chain`'s `001`); `test/config/history-startup.ts`'s stand-in takes the new `001`. A102,
      the migration cases and R16's clauses pass on both backends (Codex `3.2-green`, 11 files).
- [x] 3.3 The node write replaces a changed child list (`design.md` §2.2) and `writeBlock` returns the written count;
      `core-arch` design §10's `nodes` row ("an existing key is left as it is" replaced by §2.2's rule).
      **Acceptance:** a statement test on both backends: a node written again with its stored child list leaves its row
      untouched and is not counted, one written with another child list replaces it and is counted, a new one is
      inserted and counted (the shape `design.md` §14 probes); A100–A104 pass. R5 and R27 are checked whole in 4.2 and
      4.1.
      **Done (2026-11-03, this commit):** the node insert is `… ON CONFLICT (node_key) DO UPDATE SET children =
      EXCLUDED.children WHERE nodes.children IS DISTINCT FROM EXCLUDED.children`; `insertNodes` resolves with the rows
      it affected and `writeBlock` with their sum over its statements; `core-arch` design §10's `nodes` row and
      `core-ledger-state.ts`'s comments say the replacing rule. Test first: `test/backbone/ledger-node-write.test.ts`,
      on both backends through the database API on the part's own migration (a node written again unchanged keeps its
      row version and is not counted, one with another child list is replaced and counted, a new one inserted and
      counted; `writeBlock`'s count over two statements), seen failing before (no count) and, with the first-copy write
      (`DO NOTHING`) put back, failing on the rewritten node (expected 2, got 1). A100–A104 (`ledger-storage.test.ts`
      and its negative controls) and the sweep's tests (`ledger-sweep*.test.ts`, the eviction restart, the worker's
      eviction) pass with the replacing write, the tapes included: no sweep test differed. The whole suite with the
      tapes, compared with §0, is in the plan's P3 notes.
- [x] 3.4 `src/ledger/node-key.ts`: a node's key from its payload and its children's keys.
      **Acceptance:** R29's clause "`src/ledger/node-key.ts` gives, for every node embedded in the rows of the recorded
      tapes, the key the ledger package gives it"; checked against `test/ledger/node-format.ts` too.
      **Done (2026-11-03, this commit):** `nodeKeys(data, children)` gives a node's key and the key of every node its
      child list embeds (what 3.5's node set and row check take in one parse), `nodeKey` the key alone; the child list
      is read by `node-refs.ts`'s one reader, now `readChildList` with a visitor, `childRefKeys` on top of it (same
      keys, order and refusals; `src/ledger/node-refs.ts` is the one file touched outside the task's). Test first (seen
      failing: no module). `test/ledger/node-key.test.ts`: properties against `node-format.ts` (seed 20261103), a key
      written by hand, every SCALE length form, malformed child lists refused; on real genesis states of v8, v9 and
      v9-rc3 every flushed node's key, and the package's own key for every embedded node — `test/ledger/package-keys.ts`
      moves each embedded child out under `node-key.ts`'s key and a fresh package instance, reading it from its store,
      accepts it only if its own hash of it is that key; its controls (a node changed under its key, one wrong key) are
      refused. The clause on the recorded stagenet 0–10,000, preprod 0–10,000 and devnet v8 → v9 tapes
      (`test/ledger/node-key-tape-*.test.ts` over `node-key-tapes.ts`): each replayed from genesis on PGlite, every row
      written and every row stored at the end has `nodeKey`'s key (a row's key hashes its children's keys, so this fixes
      every embedded node's key), `nodeKeys`' embedded keys are the ones checked, and a fresh instance of the package
      that wrote them loads and serializes the state of every devnet and preprod height and of every 10th stagenet
      height and the last, reading and accepting every node embedded in those heights' rows under `nodeKey`'s key
      (stagenet's sample: Q-3.4-1, B, kept by the owner). Seen failing with a fault in `node-key.ts` put back: an
      embedded node hashed without its children's keys, and a wrong `embedded` list with right row keys. Coverage of
      `node-key.ts` and `node-refs.ts`: 100 %.
- [x] 3.5 The content-defined table mechanism (`design.md` §2.5): the declaration of a table item as content-defined,
      refused for user modules; the contents hash's content function (the node set, every row's key checked, the
      checks of `ref_counts` and `unreferenced`, `ledger-refcount-invalid` with reason `tables-inconsistent` and
      `details.check`); change capture and the digests skipping such tables; DT-6's rules and the `TRUNCATE` guard kept;
      the restore's contents-hash step (BK-3); `core-arch` design §4's determinism component. `core-ledger-state`'s own
      tables are declared content-defined only by the switch (3.8): before it the sweep runs and the counts are empty,
      which the checks would refuse.
      **Acceptance:** with a test build that declares `core_ledger_state`'s three tables content-defined, on both
      backends: R29 (but its `node-key.ts` clause, 3.4's) on databases built for it, with its three negative controls;
      A55's and A126's new text; A57's "nor a content-defined one"; a user module declaring a content-defined table is
      refused. 3.8 runs them again with the build's own declarations.
      **Done (2026-11-03, this commit):** a `table` item declares some of its tables content-defined with
      `table.contentDefined: { tables, content }` (`ContentDefinition`, `src/modules/declaration.ts`): `tables` some of
      the item's tables, `content` a `ContentFunction` (`src/determinism/contents-hash.ts`) that reads the hash's
      snapshot and gives each table's content, or null for one recorded by name only. Validation refuses it from a
      user module (`invalid-declaration`, field `provides[i].table.contentDefined`), and with an unknown property, no
      table, a table the item does not list, no function, or on an item declared `deterministic: false`. The schema
      plan lists the groups (`SchemaPlan.contentDefined`); change capture skips their tables (`uncaptured`), so they
      get no digest, while the column rules, the integer `CHECK`s and the `TRUNCATE` guard, which take the opt-out
      alone, still apply; `contentsHash` takes them by their content (option `contentDefined`, the content computed
      once per hash through its read); the backups (`DumpInput.contentDefined`: the process's, `umbradb backup`'s from
      `declaredContentDefined`, the browser worker's) and the restore (BK-3, `checked.plan`) pass them; the exported
      `contentsHash` is now the build's (`src/library/contents-hash.ts`: `contentsHashOf(declarations)` over UmbraDB's
      own backbone parts and core modules; same name and signature). `core-ledger-state`'s content function,
      `src/backbone/core-ledger-state/node-set.ts`: `nodeTablesContent()` reads `nodes` in key order a page at a time,
      checks each row's key with `node-key.ts`'s `nodeKeys` (a malformed child list fails as `node-key` too), gives
      `nodes` as its node set and `ref_counts`, `unreferenced` by name after the `closure`, `roots`, `counts` and
      `queue` checks; a failure is `ledger-refcount-invalid`, `details` `{ reason: "tables-inconsistent", check, key }`
      (the first such key in byte order); `LEDGER_NODE_TABLES` (`{ tables: ["nodes", "ref_counts", "unreferenced"],
      content: nodeTablesContent() }`) is what a `ledger-state` item declares — **3.8 adds `contentDefined:
      LEDGER_NODE_TABLES` to the `table` of `coreLedgerState()`'s `ledger-state` item**; the production build does
      not carry it yet. `core-arch` design §4 (change capture; a paragraph on content-defined tables, outside the
      `deterministic_postgresql` component's table, which A138 pins to the component's own rules). Files beyond the
      task's: `src/modules/adapters.ts`, `src/backup/pglite-backup.ts`, `src/runner/process.ts`, `src/cli/backup.ts`,
      `browser/src/process-worker.ts`, the two new modules, and `test/backbone/core-digest/chain.ts` (takes core
      modules). Test first (seen failing: four files at import, the generic mechanism's eight cases on the
      declaration ignored), on PostgreSQL 18 and PGlite: `test/determinism/content-defined.test.ts` (the mechanism, a
      hash computed by hand); `test/backbone/node-set.test.ts` — R29 but `node-key.ts`'s clause, on databases made by
      the part's migration with rows of `test/ledger/node-format.ts`'s format and the counts and queue their rows give
      (the two spellings equal; one more queued node different; `node-key` for a payload byte, a referenced key's
      byte, an embedded node's byte, a byte added; `tables-inconsistent` for `counts`, `queue`, `closure`, `roots`),
      A55's new text and the backends compared, and R29's three negative controls, committed (each also seen failing
      R29 with its fault put into `LEDGER_NODE_TABLES`: the spellings' hashes differ, the one-more-node hashes equal,
      the changed payload hashed); `test/backup/restore-content-defined.test.ts` — on `restore-ledger.ts`'s ledger
      chain synced by the process with the test build, A126's new text (a changed payload or child-list byte refuses
      with `ledger-refcount-invalid`, a node respelled with consistent counts and queue restores, a `root_counts`
      value still gives `contents-hash-mismatch`, the target empty after each refusal) and R29's backup, restore and
      export clauses (counts or queue refused in a restore; counts and a payload byte refused by `writeBackup` and by
      the process's own backup, no file written; the same through `contentsHashOf`, the exported function's code);
      `digests.test.ts` — A57's "nor a content-defined one" (seen failing with change capture not skipping them) and
      its control, the `TRUNCATE` guard and the column rules kept; `validation.test.ts` — a user module refused.
      R29's export clause is shown with the test build through `contentsHashOf`; a test pins `contentsHash` of
      `src/index.ts` to the production declarations' groups, so 3.8 reruns the clause on the export itself. The test
      build is `test/backbone/content-defined-build.ts`: `contentDefinedLedgerState({ base?, contentDefined?,
      writesCounts? })` (with `writesCounts`, the counts and queue written after each block from the rows, by the
      independent node format: `countsAndQueue`). Coverage: `node-set.ts` 100 % lines, 91.7 % branches; the hash's
      content-defined path 100 %. The whole suite with the tapes, compared with §0, is in the plan's P3 notes.
- [x] 3.6 `src/backbone/core-ledger-state/refcount.ts`: `refcountStep` behind its tables seam (rules 1–10 of
      `design.md` §3.2, the checks of §3.3, the reads of §3.4), `writeRefcount`, and the six faults of R12 as seams of the
      tables seam.
      **Acceptance:** given tables at h − 1 and batches from 2.1's generators, the step gives R1's model's new and
      rewritten nodes, counts, queue and deleted set after every block; each check fires on its fault at the step's
      level. R11 and R12 are checked whole in 3.8.
      **Done (2026-11-03, this commit):** `refcountStep(tables, batch, { height, on })` (rules 1–8; the eviction, rule
      9, is the caller's: `step.deleted`), `RefcountTables` (`rows`, `changed`, `queue`, `counts`, `references`, and
      `fault`, R12's seam: `second-occurrence-not-decremented`, `unchanged-counted`, `increment-once-per-parent`,
      `released-in-block` as Q-2.1-2's A, `referenced-queued-deleted`, `first-round-only`), `sqlRefcountTables(read)`
      and `writeRefcount(w, step, written)` (rule 10: called after the batch's node writes with their count; the
      `ref_counts` merge, the queue's delete and insert, then the deletion of `D`, each over at most `KEYS_PER_STATEMENT`
      (1,000) keys, each statement's rows checked, `write-nodes` included: `row-count-mismatch` with the statement,
      expected and actual). Its statements are in `sql.ts` (`deleteNodes` now returns its count). The step holds
      nothing between blocks; `missing-reference` checks every reference of every new and rewritten node's batch list
      (Q-2.1-1). Tests, seen failing first (module missing): `test/backbone/refcount-step.test.ts` (the step through an
      in-memory seam over the model's tables at h − 1 gives `refcountModelStep`'s new, rewritten and unchanged nodes,
      count changes, counts, deleted set, rounds, queue and rows after every block of `driveHistory`, seed 20261105, 200
      runs; with `released-in-block` and `first-round-only` it gives the model's same faults, halts included; each
      check fires as the model halts; each of R12's six faults by hand) and `test/backbone/refcount-tables.test.ts`
      (PostgreSQL 18 and PGlite: each read, chunked; a block's writes, each statement reporting the rows the step
      computed, chunks summed; `row-count-mismatch` for all five statements, the transaction rolled back; the other two
      checks through the database's reads; on 30 histories, seed 20261105, the tables equal the model's after every
      block). Coverage of `refcount.ts`: 100 % lines, 100 % branches. R11 and R12 stay 3.8's.
- [x] 3.7 The DAG fixture (`test/ledger/fixtures/sweep-fixture.ts`, `sweep-test-loader.ts`) extended as A105 says, and
      with the test packages R28 and R30 need (one that keeps a node's old child list when it creates the node again;
      one whose live state holds a row by reference while the stored parent embeds it). The extension is additive: the
      fixture's existing cases, which the sweep's tests run, are unchanged.
      **Acceptance:** a fixture test shows each new case's batches (a rewrite in each direction, a repeated child, an
      embedded child holding a reference, children shared between versions, the two packages' behaviours); the sweep's
      tests still pass.
      **Done (2026-11-03, this commit):** the fixture's functions take a DAG name, `"original"` unless given (the DAG
      the sweep's tests run, unchanged) or `"extended"`, whose roots add, after the original's 24 subtrees: children
      shared between versions (`shared v`), a child repeated in one child list (`repeat v`), embedded children holding
      references (`embed v`, one embedded node nested in another), and a stored node written again with its small child
      in the other form, both ways (`rewrite to-ref` at `TO_REF` 33, `rewrite to-embedded` at `TO_EMBEDDED` 53); and,
      beyond A105's list so that R12 (b) and (e) have a batch to bite on (questions file Q-3.7-1, A), a node written
      again unchanged (`again` at `AGAIN` 71) and a child a rewrite stops referencing that a new node references at the
      next block (`requeued`, at `REQUEUE` 63 and 64). `extendedCases(h)` names each case's nodes, `stateKeys(h, dag)`
      gives a state's node set, `contentOf` reads a stored node back. The test package takes `FixtureData`
      (`dag`, `keeping`); with `dag: "extended"` it keeps nodes as `writes-again` (the default: the fixture's child
      lists, restarted or not), `keeps-old-copy` (R28: a thread that never restarted keeps a rewritten node's old child
      list; a thread that read the state before from the node store writes the new one) or `holds-by-reference` (R30:
      writes what `writes-again` writes, but its live state still holds `small to-embedded` by reference after its
      parent is written embedding it, so it refuses to forget it at 54; a new thread does not); a state it did not make
      is read lazily from the node store, each row's key checked against its content and the keys reached against the
      fixture's node set. Test first, `test/ledger/sweep-fixture.test.ts` (Codex `3.7-red`: 7 failing on the missing
      extension, the original's guard passing): the original DAG's states and its package's batches over 0–100 pinned
      by digest at `5bcffec`; every extended node checked against `test/ledger/node-format.ts` and `childRefKeys`; each
      case's batches; the three packages' behaviours, R30's also in the ledger worker (`EvictionRefused` after two
      tries, a new worker loading the state at 53 from the node store, the same batch, the eviction taken). The sweep's
      tests pass unchanged on both backends (Codex `3.7-sweep-suites`: `ledger-sweep*`, `ledger-storage*`,
      `ledger-eviction-restart*`, `worker-sweep`, 10 files, 62 tests). For 3.8: the extended DAG's tape needs
      `rootOf(h, "extended")` as the node's roots (`sweepTape` gives the original's).
- [x] 3.8 **The switch.** `core-ledger-state` computes the counting step in `on-compute`, evicts the deleted rows before
      the block's transaction (with the worker restart of Q144 B), writes it after the node writes in `on-db-write`,
      empties rule 5's deleted set under `sweep: off`, and declares `nodes`, `ref_counts` and `unreferenced`
      content-defined; the runtime sweep is no longer called. In the same change set, test first: R3's database check;
      A105's test `test/backbone/ledger-refcount-process.test.ts` carrying `[[ledger.refcount-cross-backend-identical]]`
      in place of `ledger-sweep-process.test.ts`, the manifest and `core-arch` acceptance §17's row with it; R12's six
      controls through A105 in place of `ledger-sweep.negative-control.test.ts`; the helpers of
      `test/backbone/sweep-tapes.ts` that read the running core's sweep tables or compare it with the sweep's model, and
      the tests that use them (`ledger-storage.test.ts`'s A104 case, `eviction-restart.ts`,
      `ledger-eviction-restart*.test.ts`), moved to the counting tables and R1's model (the sweep's model kept for R2 and
      R4); R11's three faults.
      **Acceptance:** A105; R3's clauses (a)–(d) "After every block of the DAG fixture", with its negative control; R11;
      R12; R19's clause "the code registry (A87) names R11's test as the one that triggers it"; R20; A104's and A160's
      new text; R29 (but its `node-key.ts` clause), A55, A126 and A57 with the build's own declarations; the sweep's own
      unit tests (`ledger-sweep.test.ts`, `ledger-sweep-tables.test.ts`) still pass against `sweep.ts`; the whole suite
      on both backends has no failure that §0 did not have.
      **Done (2026-11-03, this commit):** `core-ledger-state`'s `on-compute` computes `refcountStep` from its read
      at h − 1 (`refcountOf`: `on` from the `core` revision's `sweep`; `step.deleted` evicted before the transaction;
      the Q144 B restart recomputes it on the new thread's batch) and `on-db-write` runs `writeRefcount(w, step, await
      writeBlock(w, applied))`; the `ledger-state` item declares `contentDefined: LEDGER_NODE_TABLES`; `sweepOf`, the
      `sweepBudget` and `greyPicker` options go (`sweep.ts` and its tables stay, unused, for 5.1). Negative-control
      seams of `coreLedgerState`: `refcountFault` (R12, into the tables seam), `refcountUnchecked` (one check left out,
      `RefcountCheck` in `refcount.ts`), `refcountWriter` (the handle the step's statements run through). Test first
      (seen failing on the sweep wiring: A105, A160 and R11 — nothing counted, no halt; and, without the declaration,
      R29/A55/A126/A57 on the build's own declarations — hashed by bytes, nothing refused, digested). Tests:
      `test/backbone/refcount-checks.ts`, R3's check (its own queries and `node-format.ts` parsing; `R_{h−1}`, `R_h`,
      `K_h` from the fixture's roots and the batches the watcher saw); `ledger-refcount-process.test.ts`, A105 on the
      extended DAG, both backends (R1's model fed each block's batch: rows, counts, roots, queue, new and rewritten
      nodes, evicted keys; every `core_ledger_state` table equal across backends after every block; R3 after every
      block; reuse at REVERT; `sweep: off`), its controls (R12's six, each seen making its own clause fail: (a) R3 (a)
      at 6 and (d) at 16, (b) (a) at AGAIN, (c) (b) and (c) at 6, (d) (c) at 1, (e) `missing-reference` at REQUEUE + 1,
      (f) (d) at 2; R3's own, state 20's root and the rows only it reaches deleted in block 20's transaction: (b) and
      (c) fail); `ledger-refcount-halts.test.ts`, R11 (a count lowered in a copy of the database built to 5, the PGlite
      directory copied or `CREATE DATABASE … TEMPLATE`: `negative-count` at 6; the test package's `withhold` and
      `persistUnknown`: `missing-reference` at 10, TO_REF and 20; a queue insert one key short: `row-count-mismatch` at
      3; each with its details, its log line and the database at h − 1) and its controls (each check left out:
      `database-error` from `ref_counts`' CHECK, or the block commits and R3 reports I1, I4 or I3). Moved to the
      counting tables and R1's model: `sweep-tapes.ts`'s helpers (names kept for 5.1's split; a host wrapper records
      each block's batch and evictions), `eviction-restart.ts` (on the new `refcount-process.ts`), A160 to its new text,
      A104 to its new text with its control moved to `ledger-storage.negative-control.test.ts`, A103's "sweep ran" line
      to R3's (a), (b). R19: the registry names R11's three tests, `PENDING` is empty, its control rewritten. R20: the
      manifest and `core-arch` acceptance §17. 3.5's tests on the build's declarations: `node-set.test.ts` (the exported
      `contentsHash` itself), `restore-content-defined.test.ts` (`LEDGER_CORE`), `digests.test.ts`.
      `refcount-tables.test.ts` uses `insertNodes`. Codex: `3.8-red`, `3.8-green-1`…`3`, `3.8-touched-1` (16 files with
      the tapes, the sweep's unit tests among them, 172 passed), `3.8-declared-red`, `3.8-declared-1` (17 files, 225
      passed). The whole suite with the tapes (`3.8-full`): 405 files, 6,430 tests passed, 12 skipped, 1 failed — A114
      (`test/private/transport-intake.test.ts`, "expected 1 to be 2" disconnects), a known load-only failure, which
      passes alone (`3.8-full-a114-alone`, diagnostic only); §0 had none.

## 4. The process on both backends (`design.md` §4–§8; §13 phase 3)

- [x] 4.1 R3 on the tapes, and the rewrite.
      **Acceptance:** R3's clause "at every 100th height and the last of the recorded preprod 0–10,000, stagenet
      0–10,000 and devnet v8 → v9 tapes" (R3 whole with 3.8's part); R27.
      **Done (2026-11-03, this commit):** R3 on the tapes: `test/backbone/refcount-tapes.ts` replays a tape from
      genesis through the process with the ledger's core modules and `core-contract-states`; a watcher module keeps,
      at each sampled height h (every 100th, the last; on the devnet also U 102, F 103, F + 1 104), the tables at
      h − 1 (`sweepTables`, its own queries, digests skipped) and the worker's batch for h, reads the tables after h at
      h + 1, and runs R3's (a)–(d) there (`storedProblems`), (c)'s `R_{h−1}`, `R_h`, `K_h` from the stored rows and the
      block's written nodes (`storedReach`, `refcount-checks.ts`), the rows outside `R_{h−1} ∪ R_h` logged. Files:
      `ledger-refcount-tape-{preprod,stagenet}-{postgres,pglite}.test.ts` (one PostgreSQL replay takes ~28 minutes
      under load, so each tape's backends run side by side) and `ledger-refcount-tape-devnet.test.ts` (both);
      skipped by name without `UMBRADB_TAPES`. Result: 101 heights checked on preprod and on stagenet and 7 on the
      devnet, on both backends, no problem, no row outside `R_{h−1} ∪ R_h`. R3's control on the tape
      (`ledger-refcount-tape.negative-control.test.ts`): at 200 on the devnet the state's new root and the block's
      written nodes deleted in its transaction (`refcountWriter`): (b) `I4` and (c) `S_h ≠ K_h` fail at 200, nothing
      before. R27 (`ledger-refcount-rewrite.test.ts`, both backends, the extended DAG): at TO_REF and TO_EMBEDDED the
      row holds the new child list, R3 (a) holds there and R3 after every block; `small to-embedded` keeps its row,
      queued, at TO_EMBEDDED and is deleted (and evicted) at TO_EMBEDDED + 1; kept when a new node references it by
      then (`requeue` at REQUEUE + 1) or when persisted by then (the test package's new `persist` option at
      TO_EMBEDDED + 1); a new process after each rewrite loads the new child list (the rows the node-store bridge read
      for its load, `readingLoads`) and its next root is the node's. Controls
      (`ledger-refcount-rewrite.negative-control.test.ts`): the first copy kept (`ON CONFLICT (node_key) DO NOTHING`
      through the new `core-ledger-state` seam `nodeWriter`, the write count's check left out so the block commits)
      fails the row check at TO_REF; `small to-embedded` deleted in TO_EMBEDDED's transaction fails R3 (c)'s
      `R_{h−1} ⊆ S_h`. Shared helpers extended, existing behavior kept: `sweepTables`' `digests` option,
      `fixtureReach`'s `persisted`, `runDag`'s `worker`, the test package's `persist`. Outside the task's test files:
      `core-ledger-state.ts`'s `nodeWriter` option (one field, one call). R27 seen failing with the first-copy write
      put back in `sql.ts` (all six tests halt at TO_REF). Codex: `4.1-devnet-1`, `4.1-tapes-1`, `4.1-r27-1`,
      `4.1-tape-control-1`, `4.1-r27-red-first-copy`, `4.1-touched-1` (14 files, 99 passed). The whole suite with the
      tapes (`4.1-full`, 3,756 s at a load average of 40–63): 413 files, 6,444 tests passed, 12 skipped, 5 failed, none
      in a file this task touches — A12 (`postgres-pool`), L17 and L18 (`library/network`, issue 00064), A114
      (`transport-intake`) and A47's PostgreSQL teardown (`upgrade-boundary`, Docker refusing to remove a running
      container; recorded as `docs/issues/00081-postgres-test-server-stop-fails-under-load.md`); the four files
      alone pass (`4.1-full-failed-alone`, 38 passed, diagnostic only); §0 had none.
- [x] 4.2 Written again, a queued key referenced again, the lag, reuse, a lowered window.
      **Acceptance:** R5, R6, R7, R8, R9.
      **Done (2026-11-03, this commit):** `test/backbone/ledger-refcount-blocks.test.ts`, on the extended DAG through
      the process, both backends, each run also checked by R3 and R1's model. R5: `again`, written again unchanged by
      the test package at AGAIN, and `requeued`, written again unchanged by a restarted worker's first block (the
      process stopped at REQUEUE and started again; its new thread loads the state after REQUEUE, where `requeue` embeds
      `requeued`): the counts of the keys it references as before, its row's `xmin` unchanged, the rows carrying the
      block's transaction id (its `states` row's) exactly its new and rewritten nodes, no row of the three
      content-defined tables in `core_digest.tables`, and the restarted run's tables after REQUEUE + 1 those of the run
      that never restarted. R6: `requeued` at REQUEUE + 1 (queued at REQUEUE, referenced once by one new node, `requeue
      holder`): kept, out of the queue, counted 1, `requeued leaf`'s count unchanged. R7: `retainStates` 0 with the
      package holding by reference (it refuses to forget a node a live state reaches, as the v9 package does), every h
      from 1 to 52: the released root queued at h, no row of the state deleted at h, its rows outside `K_{h+1}` deleted
      and evicted at h + 1, no refusal, no restart; `retainStates` 2, every h from 1 to 97: released and queued at h +
      2, no row of it deleted before h + 3, its rows outside `K_{h+3}` gone after h + 3. A state's rows are those its
      root reaches through the child lists as written at each height: a rewrite can take one out (`small to-embedded`,
      embedded from TO_EMBEDDED, is deleted at TO_EMBEDDED + 1 while the states after 51 and 52 are retained, which then
      hold it embedded). R8: subtree 0's first version deleted at 9 and inserted again at REVERT, each of its five rows
      counted 1 there; a new process's worker then loads the state after REVERT from the database (the package checks
      every row it reads against its content and the fixture's state). R9: `retainStates` 5 lowered to 0 at REQUEUE: the
      six roots released and queued there, none of their rows deleted; at REQUEUE + 1 every row of theirs outside `K`
      deleted and evicted, rows only the earlier five states reach among them; `requeued` (a row of the state after
      REQUEUE − 1, embedded by the state after REQUEUE, referenced again after REQUEUE + 1) kept. Helpers, additive:
      `runDag` takes more `user` modules; `fixtureReach` and `fixtureProblems` take `retainedFrom` (a window a revision
      changes). Seen failing (diagnostic, the source restored after each): R12 (b) fails R5's counts; the node write
      without its `WHERE` (the write-count check left out) fails R5's `xmin` clauses; R12 (e) fails R6
      (`missing-reference` at REQUEUE + 1); R12 (d) fails R7 (the eviction refused at 1; the rows gone at the release)
      and R9 (the six roots deleted at REQUEUE); no eviction fails R8 (`missing-reference` at REVERT). Codex:
      `4.2-green-1` (R7's `retainStates` 2 case failing on the test's first reading of a state's rows, fixed as above),
      `4.2-green-2` (12 passed), `4.2-red`, `4.2-red-touch`, `4.2-touched` (with the tapes: this file, A105, A160, R11,
      A100–A104 and their controls; 9 files, 70 passed).
- [x] 4.3 `sweep: off`.
      **Acceptance:** R10.
      **Done (2026-11-03, this commit):** `test/backbone/ledger-refcount-sweep-off.test.ts`, on the extended DAG through
      the process, both backends, `retainStates` 0, `sweep: off` from 30 to 65 under the development opt-in (the stretch
      holds both rewrites and the queued key referenced again) and on again from 66: switched off while the queue holds
      the root of the state after 28, released at 29; from 30 to 65 no row deleted or evicted (that state's rows
      included), the queue after every block exactly the rows no stored child list references and no root count
      persists, every root released meanwhile queued after 65; at 66 the whole queue deleted with its cascade (rows
      outside the queue among the deleted, R1's model counting more than one round), every deleted row evicted, the
      state's rows outside `K` gone; R3 after every block with `sweep` as configured ((a), (b) and `R_{h−1} ⊆ S_h`
      throughout, `S_h = K_h` and (d) where it is on). No reset at either switch: R1's model (no reset in its rules)
      holds the tables after every block, and no table of `core_ledger_state` but those the rules write changes at
      either switch (at 30 and at 66). Without the opt-in the same configuration is refused at startup with
      `development-opt-in-required` before anything is written: on PostgreSQL the history check names `sweep-off`; on
      PGlite the database itself needs the opt-in and refuses first (`pglite`), so no PGlite process runs `sweep: off`
      without it — the history check's own refusal is backend-independent (CF-9,
      `test/config/development-opt-in.test.ts`). Seen failing (diagnostic, the source restored after each): the step
      deleting while `sweep` is off fails the first case on both backends (rows deleted from 30, the state's rows gone);
      the history check without its `sweep-off` rule fails the refusal on PostgreSQL (the process starts). Codex:
      `4.3-green-1` (4 passed), `4.3-red` (the refusal under its fault waited for the started process's end until its
      timeout; the test now stops a process that starts at once), `4.3-green-2` (4 passed), `4.3-red-2`. Whole suite
      before this commit (`4.3-full`, `npx vitest run` with the tapes, the final tree but this sentence): 407 files,
      6,447 tests passed, 12 skipped, no failure (§0: 387, 6,252, 12).
- [x] 4.4 Restarts and crashes.
      **Acceptance:** R13, R14.
      **Done (2026-11-03, this commit):** a run is one or more segments, each a process of its own
      (`test/backbone/refcount-restart.worker.ts`, started with `spawnChild`) that reads back only the database the one
      before it left; its watcher module records after every block it commits the node set (kept from the rows each
      block wrote or deleted, read back, its row count checked against `nodes`), `root_counts`, the block's `states` row
      and their number, and `core_digest.tables`, and where asked the tables, the batch and the contents hash, into a
      file the test reads back (`test/backbone/refcount-restart.ts`). The named points, each reporting it was reached at
      its height, all sit on seams the process already has, so none was added to `src/`: `before-step` and
      `after-eviction` on the worker's answers to the block's apply and eviction, `after-node-writes` and
      `between-step-writes` on `refcountWriter`, `before-commit` and `after-commit` on a `FinalizedLoop` (its `write`
      and `commit`). R13 (`ledger-refcount-restart.test.ts`): the extended DAG fixture stopped after the `COMMIT` of 37
      and 74 and restarted has, after every block, the uninterrupted run's node set, `root_counts`, `states`, rows of
      every `core_ledger_state` table that is not content-defined, `core_digest.tables` and contents hash, and R3
      passes after every block; on the recorded preprod 0–10,000 tape (`ledger-refcount-restart-preprod-{postgres,
      pglite}.test.ts`) stopped after 20 heights drawn with seed 4413 (320, 575, 756, 1143, 1660, 2400, 2829, 3097,
      3572, 3809, 5095, 6097, 6354, 7019, 7714, 7861, 8399, 8524, 9056, 9762), the same after every block but the
      contents hash and the rows, read at every 100th height, each stop and the block after it, and R3 at every 100th
      height from the stored rows, no row outside `R_{h−1} ∪ R_h` (questions file Q-4.4-1, B, kept by the owner
      2026-11-03). R14: a SIGKILL at each point (`before-step` at TO_REF, `after-eviction` at TO_EMBEDDED + 1,
      `after-node-writes` at REQUEUE, `between-step-writes` at REQUEUE + 1, `before-commit` at AGAIN, `after-commit`
      at REVERT) leaves every `core_ledger_state` table byte for byte and the contents hash of the uninterrupted run
      after h − 1 (h after the `COMMIT`), read from outside by a process of its own; the restarted run's node set and
      byte-hashed tables after every block and contents hash after h − 1, h, h + 1 and 100 are the uninterrupted
      run's, with R3 after every block. Negative controls (`ledger-refcount-restart.negative-control.test.ts`), each
      seen making its check fail: a restart that empties `unreferenced` (a segment's seam) after the stop at 37 — the
      node sets are equal through 37 and differ from 38; a build writing `ref_counts` and `unreferenced` in a
      transaction of their own committed before the block's (its loop computes the step and runs those statements),
      crashed between the two commits at REQUEUE + 1 — the database is a mix (those two tables differ from h − 1's and
      the contents hash is refused) and after the restart the node sets differ from h on. Both backends throughout. One
      shared helper extended: `ingest`'s optional `loop`. Codex: `4.4-dag-1`…`5` (the DAG files; `4.4-dag-5` 18
      passed), `4.4-preprod-1`, `-2` (PGlite passed), `4.4-preprod-pg-diagnostic`, `-2`, `4.4-preprod-pg-1`
      (PostgreSQL passed). Found and filed, not fixed: two first starts at once on one PostgreSQL server race on
      creating the module roles (`docs/issues/00082-concurrent-first-startups-race-on-module-roles.md`); the preprod
      test starts its second run once the first committed a block. The whole suite with the tapes (`4.4-full`, the
      final tree but this sentence, 2,812 s): 409 files, 6,450 tests passed, 12 skipped, 1 failed — L38
      (`test/library/channel-queue.test.ts` on PostgreSQL, its 120 s timeout, at load ~20–50), which passes alone
      (`4.4-full-l38-alone`, 36 of 36, diagnostic only); §0 had none.
      Crash points (review S2): the six R14 points are reached through existing seams (the worker's apply and evict
      answers, `refcountWriter`, a `FinalizedLoop` subclass), each reporting that it was reached at its height, not
      through `crash-module.ts` or `UMBRADB_CRASH_HOOK` as the acceptance preamble names them; none uses a timer.
- [x] 4.5 Backups and the per-block capture.
      **Acceptance:** R15, R17.
      **Done (2026-11-03, this commit):** no `src/` change — the build's mechanism (3.5) and declaration (3.8) are what
      R15 and R17 check. `test/backbone/ledger-refcount-backup.test.ts` (R15, both backends): the extended DAG synced
      by the process and backed up by it at h = TO_EMBEDDED (its queue holds `small to-embedded` and the released
      root), restored by `restoreBackup` with the same build (the manifest's hash the build's, not the bytes'), a new
      process on the restored database to h + 50; the restored tables at h equal the backed-up ones, the queue goes at
      h + 1, R3 passes after every block of 0 … h + 50 (the run before the backup and the run after the restore
      together), the node set and `core_ledger_state`'s byte tables equal an uninterrupted run's after every block from
      h, every byte-hashed table and the exported `contentsHash` at h + 50. Its controls, each refused with
      `ledger-refcount-invalid` (`tables-inconsistent`), the target empty: the file without its `ref_counts` rows
      (`counts`), without one `nodes` row — a referenced one (`closure`), the root at h (`roots`), the queued leaf
      (`queue`) —, each naming the missing key. R15's third control (one payload byte, `node-key`) is A126's case in
      `test/backup/restore-content-defined.test.ts`. `ledger-refcount-capture.test.ts` (R17): the extended DAG with a
      module recording `core_digest.tables` at every cursor; TO_REF and TO_EMBEDDED each insert, rewrite and delete;
      the three tables carry no capture trigger and no shadow table and have no digest row at any height; `root_counts`
      has both, and its digest row after every block is DT-4's, recomputed with CBOR written out by the test; the
      exported `contentsHash` equal on both backends after the fixture. R17's `TRUNCATE` clause is
      `test/backbone/core-digest/digests.test.ts` (the build's `ledger-state` item). Helpers, additive: `runDag`'s
      `user` and `atLast`; `restore-ledger.ts`'s `RestoreBuild.user` and `RestorableBackup`; new
      `refcount-contents.ts`. Controls seen failing with the fault put back (each check of `node-set.ts` skipped in
      turn, `no-key-check`, the declaration removed): each fails its own case only. Codex: `4.5-green-1`, `-2`,
      `4.5-controls`, `4.5-touched-1` (16 files with the tapes, every user of the changed helpers, 121 passed). The
      whole suite with the tapes (`4.5-full`): 407 files, 6,442 tests passed, 12 skipped, no failure; §0 had none.
- [x] 4.6 Determinism across worker histories.
      **Acceptance:** R28.
      **Done (2026-11-03, this commit):** `test/backbone/refcount-histories.ts`: a run of one chain in segments, each a
      new process with a new ledger worker thread (the first from genesis, each later one from the cursor the one
      before stopped at, so it reads back only the database), a user module recording at every cursor the node set,
      the `nodes` rows (allowed to differ), `root_counts`, the block's rows of `states`, `segment_results` and
      `events`, `core_digest.tables` and the contents hash, the last height read once the process stopped; `runDag`
      gains a `user` option (nothing else of it changes). The DAG case (`ledger-refcount-determinism.test.ts`, both
      backends): `keeps-old-copy`, a run that never restarts against one restarted before TO_REF, TO_EMBEDDED and
      REQUEUE; their batches at those blocks and their `nodes` rows (TO_REF to 100) differ, and after every block the
      node set, `root_counts`, every row of the three tables, `core_digest.tables` and the contents hash are equal, R3
      passing on both. The tapes (`ledger-refcount-determinism-devnet.test.ts`, `-preprod-postgres.test.ts`,
      `-preprod-pglite.test.ts`; both runs side by side, the second started once the first committed a block): 20
      restart heights drawn from seed 20261103, each restarted segment loading the state at its cursor from the
      database; devnet with the contents hash after every block, preprod at every 100th height, the restart heights and
      10,000, the rest after every block (questions file Q-4.6-1, B, kept by the owner 2026-11-03). `[NEG]` committed in
      `ledger-refcount-determinism.negative-control.test.ts` (`nodes` hashed by its raw rows: the runs' hashes differ
      from TO_REF); seen failing with the fault put back in the main test (the raw rule as its contents hash: "after
      33: contents hash differ" to 100, both backends). Codex: `4.6-dag-1`, `4.6-fault-put-back`, `4.6-touched-1`
      (`runDag`'s users, 8 files, 40 passed), `4.6-4.7-runs-2to5`, `4.6-dag-devnet-2`, `4.6-tapes-3` (the three tape
      files with `UMBRADB_TAPES`: 4 passed, 1,919 s). Issue recorded: two first startups at once on one PostgreSQL
      server race on creating its module roles
      (`docs/issues/00082-concurrent-first-startups-race-on-module-roles.md`, which 4.4 recorded first).
- [x] 4.7 A live object holding a deleted row.
      **Acceptance:** R30.
      **Done (2026-11-03, this commit):** `test/backbone/refcount-live-object.ts`: the extended DAG fixture through the
      real process (`runDag`) to TO_EMBEDDED + 1 = h, its test package `holds-by-reference` (its live states keep
      `small to-embedded`, x, by reference after `rewrite to-embedded` is stored embedding it) or `writes-again` (the
      same batches, x never held by reference); the state after h loaded from the database by a new worker once the
      process stopped. `ledger-refcount-live-object.test.ts`, both backends: after h − 1, x is a row, queued, with no
      root count and no stored reference, its parent's stored child list embedding it; at h the step deletes x, the
      package refuses both tries (2 refusals in the first thread), the worker is replaced (1 restart, 2 threads), the
      new thread loads the state at h − 1 from the database and applies h again, and x is evicted (the keys the other
      run evicts); h commits with the node's root, R3 passes after every block, the node set and every table that is
      not content-defined equal the other run's after every block (`eviction-restart.ts`'s `tableDifferences`), every
      held key's nodes are stored, and the state after h loads from the database with the node's root. `[NEG]`
      committed in `ledger-refcount-live-object.negative-control.test.ts` (`restartOnRefusedEviction: false`:
      `callback-error` at h in `core-ledger-state`'s `on-compute`, the halt's log line naming x; no `states` row for h,
      every `core_ledger_state` table as the other run's after h − 1, x still a row); seen failing with the fault put
      back in the main test (`restarts` 0, not 1, both backends). Codex: `4.7-live-1` (the test passed at the first
      run; the control failed on its own harness, h − 1 not recorded in-process at a halted block, and now compares
      with the other run's tables), `4.7-live-control-2`, `4.7-fault-put-back`, `4.6-4.7-runs-2to5`,
      `4.6-dag-devnet-2`. The whole suite with `UMBRADB_TAPES` (`4.7-full-2`, 1,848 s): 412 files, 6,442 tests passed,
      12 skipped, 1 failed — A162's control `test/private/config-hash.negative-control.test.ts` on PostgreSQL
      (`writer-lock-held` on the restarted process), a known load-only failure, which passes alone
      (`4.7-full-a162-alone`, diagnostic only); §0 had none. `readStopped`'s comment now cites R30 too.
- [x] 4.8 The conversion.
      **Acceptance:** R22.
      **Done (2026-11-03, this commit):** no `src/` change — the conversion runs through 3.8's step with no rule of its
      own (design §9.2). `test/backbone/ledger-refcount-conversion.test.ts` (R22, both backends, `UMBRADB_TAPES`;
      skipped by name without the tape): the devnet tape from genesis to F + 4 (107) through the real process with
      `core-contract-states`, `retainStates` 0 and then 2, the tables after every height and each block's batch recorded
      (`sweepWatcher`, `recordingWorker`); F read from `core_block_commit.blocks` (the first `v9` block, 103). R3's
      (a)–(d) after every block of 100 … 107 through `refcount-checks.ts`'s clauses, `R_{h−1}`, `R_h` and `K_h` from the
      stored rows and the block's batch, the rows outside `R_{h−1} ∪ R_h` reported (0 at each). Each v8 state (after 0 …
      102, the tape's state keys distinct): root count 1 after h … b − 1, b = h + 1 + `retainStates`; b's batch −1 and
      no count after b; what its key reaches through the lists stored after each t of h … b stored, none of its rows
      after t − 1 gone after t; after b + 1 none of its rows after b stored outside `K_{b+1}` (the state after 102: 46
      rows, 33 deleted at 104 with `retainStates` 0, at 106 with 2). After 107 the three `core_contract_states` rows
      below F (11, 16, 23) load: both keys held, rebuilt from the stored nodes, deserialized by the v8 package, the
      value's root key the stored one. Helper `test/backbone/refcount-conversion.ts` (new; no shared helper changed).
      Test first: the code under test is 3.8's, so the test passed at its first run; diagnostic faults put in (scratch
      file, deleted): the cascade stopped after one round (the release clause fails from block 2 on, R3 (c) at each of
      100 … 107), the window one state late (each release a block late), a contract-state node dropped and a payload
      byte changed (the row named as not loading). Codex: `4.8-green-1`, `4.8-green-2` (2 passed, 101 s),
      `4.8-faults-diagnostic`, `4.8-no-tapes` (without `UMBRADB_TAPES`: 2 skipped by name). The whole suite with the
      tapes (`4.8-full`): 408 files, 6,440 tests passed, 12 skipped, 4 failed — A12 (`test/db/postgres-pool.test.ts`,
      "expected 8 to be greater than or equal to 10") and L16–L18's controls (`test/library/network.test.ts`, issue
      00064: "startup completed" not reached), known load-only failures that pass alone (`4.8-full-known-alone`,
      diagnostic only); §0 had none.
- [x] 4.9 The comparison with the sweep.
      **Acceptance:** R4. Its runtime half ("Before the runtime sweep is removed, the same comparison is also made
      against the runtime sweep itself (its own run and database) […] and recorded in `tasks.md`") runs the base
      commit's build (§0), in its own worktree and database; the result is recorded here.
      **Done (2026-11-03, this commit):** "the DAG fixture without its rewrite cases" is a third DAG of
      `test/ledger/fixtures/sweep-fixture.ts`, `"one-form"`: the extended DAG without `rewrite to-ref`, `rewrite
      to-embedded` and `requeue` (with `requeued`, its leaf and `requeue holder`), every other case kept (shared
      children, a repeated child, embedded children, `again` written again unchanged, subtree 0 reused at REVERT), every
      key in one child list throughout; the extended package serves it (`sweep-test-loader.ts`), and a test in
      `test/ledger/sweep-fixture.test.ts` pins it. R4's comparison is in `test/backbone/sweep-tapes.ts` (the part kept
      for R2 and R4, design §11): `SweepComparison` feeds each block's batch of the counting run to the sweep's model
      and compares node sets (rows and embedded keys, `nodeSet`) after the block, refusing a key written in another form
      and, where the budget must fit, a cycle that does not end in its block.
      *Model half.* `test/backbone/ledger-refcount-sweep.test.ts`, through the process on both backends: on the one-form
      DAG, the node sets are equal at every height 0–100 with a budget of 1,000,000 (each cycle ends in its block), and
      the counted one is a subset of the swept one at every height with 50 (cycles span blocks; the sweep holds more at
      most heights; both asserted); R3 passes on the run. On the recorded tapes (`ledger-refcount-sweep-tape-*.test.ts`,
      helper `ledger-refcount-sweep-tapes.ts`, one file per tape and backend but the devnet's): the first other-form
      height is none on every tape (1.1), so **the heights compared are every height: preprod 0–10,000, stagenet
      0–10,000, devnet 0–235**, node sets equal at each, on PostgreSQL and on PGlite; the counting run's rows are
      tracked from its batches and evictions and held to the database's after every block (a digest of keys and child
      lists). `[NEG]`: `ledger-refcount-sweep.negative-control.test.ts`, the step with its cascade stopped after the
      first round (`refcountFault: "first-round-only"`): the counting run holds rows the sweep's model deleted, from 2
      on; with that fault put into the main test it fails R4's equality at 2 (and at 98 more heights) on both backends.
      *Runtime half* (against the runtime sweep's own run and database, base build `5bcffec` in its own worktree;
      organizer `research/00034-ledger-node-refcount-data/measure/`, `runtime-half.sh`, `dag-sets.ts`,
      `compare-sets.ts`). DAG fixture (one-form, the lane's fixture given to the base build's worker; PostgreSQL and
      PGlite, each run on its own database): with the base build's own budget (10,000; every cycle ends in its block)
      the counting build's node sets and rows equal the runtime sweep's at all 101 heights; with a budget of 50 the
      counting build's are a subset at all 101 (strictly at 99; cycles unfinished after 98 blocks). Preprod and stagenet
      0–10,000 (and the devnet, 0–235), both module sets of 1.1, PGlite: the counting build's stored rows after every
      block (4.10's captures) equal the runtime sweep's (1.1's `runtime-sweep-node-sets/`) at every height, and the two
      runs' captures are byte-identical: the same batches, and the same keys deleted at the same blocks.
      Codex: `4.9-dag-1` (PostgreSQL's case past vitest's default timeout, given A105's), `4.9-dag-2` (4 passed),
      `4.9-fault-put-back`, `-2` (the fault in the main test: R4's equality fails at 2 on both backends),
      `4.9-tape-devnet-1`, `4.9-no-tapes` (the tape files skip by name, no container), `4.9-runtime-dag-1`,
      `4.9-runtime-tapes-1`, `4.9-touched-1` (with the tapes: this task's files, the fixture's test, every
      `ledger-refcount-*` suite, A100–A104, A160, the sweep's own and R1/R2's tests; 24 files, 132 passed, 2,258 s, the
      PostgreSQL replays of preprod 2,137 s and stagenet 2,252 s at load averages 7–34).
- [x] 4.10 The rest of R21, with 1.1's measurement extended to the step.
      **Acceptance:** R21's clauses "new nodes left unreferenced; […] the keys whose count changed before and after
      netting; the rows deleted; the cascade's rounds; and the step's time — reported per tape as distributions
      (median, 99th percentile, maximum). On the devnet tape also the block after the v8 state's release (F + 1 with
      `retainStates` 0): the rows stored at F − 1, the rows deleted, the cascade's rounds, the step's time and the
      block's total time" (R21 whole with 1.1's part); recorded here and in the pull request.
      **Done (2026-11-03, this commit):** measured on this build (`fc7f02e`: `core-ledger-state` reclaims by reference
      counting) by 1.1's harness, extended to the step and still outside the repository, editing nothing here
      (organizer `research/00034-ledger-node-refcount-data/measure/`: `capture.ts`'s step mode, `analyze.ts`): the
      same process, tapes, settings (`retainStates` 0, `sweep` on, PGlite) and two module sets as 1.1. The step's
      figures are the build's own `refcountStep` run again on `on-compute`'s read at h − 1 and the block's batch; its
      time is the build's own run, timed through `core-ledger-state`'s wrapped points (`compute`: from the step's first
      read after the apply to the eviction; `write`: `writeRefcount`, from the `refcountWriter` seam to `on-db-write`'s
      end); the keys whose count changes before netting are recomputed from the child lists the batches wrote. Checks
      on every capture: 1.1's C1–C7, and C8 (the step's deletions are the eviction's), C9 (the changes recomputed net to
      the step's deltas), C10 (R1's model, fed the batches, agrees on deletions, rounds, netted keys, queued new nodes);
      controls fail each its own check (Codex `4.10-step-controls-2`). Per block, median / p99 / max over every block
      (ledger core; with `core-contract-states` the counts are the same on stagenet and preprod, and on the devnet but
      the two maxima after a semicolon); times in ms on a machine shared with other lanes' test runs (load averages
      62 → 8 over the stagenet and preprod captures, 26 at the devnet's):

      | Tape | new left unreferenced | keys changed, before netting | after netting | rows deleted | rounds | step, ms |
      |---|---|---|---|---|---|---|
      | stagenet 0–10,000 | 0 / 0 / 0 | 70 / 99 / 422 | 18 / 18 / 306 | 10 / 10 / 90 | 4 / 4 / 6 | 5.5 / 19.5 / 129.4 |
      | preprod 0–10,000 | 0 / 0 / 0 | 163 / 372 / 378 | 14 / 25 / 204 | 8 / 9 / 10 | 4 / 4 / 4 | 6.5 / 23.6 / 85.5 |
      | devnet 0–235 | 0 / 0 / 0 | 24 / 50 / 54 | 10 / 40 / 42; 40 | 6 / 15 / 36; 33 | 3 / 5 / 5 | 3.6 / 6.1 / 7.1 |

      With contract states the step took 6.1 / 20.7 / 212.8 ms (stagenet), 5.3 / 8.5 / 13.9 (preprod, at the lowest
      load), 3.6 / 5.6 / 7.0 (devnet). **The devnet's F + 1** (104, `retainStates` 0, F = 103): 48 rows stored after
      F − 1 (52 with contract states); 36 rows deleted (33) in 5 rounds; the step 4.87 ms (6.99), the eviction 0.85 ms
      (0.76), the block's total time 23 ms (26), of which 3.87 ms (4.53) the harness's second run of the step. The
      captures are byte-identical to 1.1's base-build ones (4.9's runtime half). Codex runs: `4.10-step-devnet-1`,
      `4.10-step-tapes-1` (exit 0, 1,452 s), `4.10-step-devnet-2`, `4.10-step-controls-1`, `-2`. The full report, for
      the pull request: `measure/r21-step-figures.md` there. Whole suite before this commit (`4.10-full`, `npx vitest
      run` with the tapes, the final tree but this sentence): 416 files, 6,469 tests passed, 12 skipped, no failure
      (§0: 387, 6,252, 12).

## 5. The sweep removed, the documents (`design.md` §11; §13 phase 4)

- [x] 5.1 The runtime mark-and-sweep removed: `sweep.ts`, its statements and readers in `sql.ts`, `sweepReset`, the
      grey picker seam, `SWEEP_BUDGET`, the `sweepBudget` and `greyPicker` options; `sweep`, `grey` and `marks` gone from
      `core-ledger-state`'s `001` and from `core-arch` design §10; the sweep's own tests removed; what is left of
      `sweep-tapes.ts` split as `design.md` §11's table says (the DAG plumbing into `test/backbone/ledger-graph-tapes.ts`;
      R2's and R4's oracle kept); `test/ledger/worker-sweep.test.ts` renamed `worker-eviction.test.ts`; the mutation
      target, the coverage floor and `core-arch` design §13's retirement list as the owner decides (questions file Q-1),
      with `stryker.conf.json`, `vitest.mutation.config.ts`, `vitest.config.ts` and
      `test/library-surface/retirement.ts`.
      **Acceptance:** R18; R16's clause "and none of `sweep`, `grey`, `marks`" (R16 whole with 3.2's part); A5
      (`test/library-surface/retirement.test.ts`) passes; R2 and R4 still pass; the whole suite has no failure that §0
      did not have.
      **Done (2026-11-03, this commit):** `src/backbone/core-ledger-state/sweep.ts` deleted (its step, reset, budget,
      grey picker, tables seam and writes); from `sql.ts` the three tables' `CREATE TABLE`s in `001` and their
      constants, and the sweep's statements and readers (`nodeChildren` and `deleteNodes`, which the counting step uses,
      kept with its reads and writes); the barrel no longer exports it; the `ledger-state` item's tables are the five;
      `core-arch` design §10's two sweep rows removed. The `sweepBudget` and `greyPicker` options had gone with 3.8. The
      sweep's own tests `test/backbone/ledger-sweep.test.ts` and `ledger-sweep-tables.test.ts` deleted. `sweep-tapes.ts`
      split: the DAG fixture's plumbing (`SWEEP_LOADER`, `sweepTape`, `sweepCore`, `sweepTables`, `sweepWatcher`,
      `tablesByHeight`, with `TableSnapshot`, the recording worker, the watcher's record and R1's model helpers) moved,
      under the names §11 lists, to `test/backbone/ledger-graph-tapes.ts`, which its 24 importers now read;
      `sweep-tapes.ts` keeps R4's comparison only. `test/ledger/worker-sweep.test.ts` renamed `worker-eviction.test.ts`,
      its comments and title reworded (R12's parenthesis in `acceptance.md` kept the old path, Q-5.1-1 A; the owner
      then chose B, and `0e24347` names `worker-eviction.test.ts` there). Owner decision Q-1 A: `refcount.ts` replaces `sweep.ts` as a mutation target (`stryker.conf.json`; its fast
      tests `refcount-step.test.ts` and `refcount-tables.test.ts` in `vitest.mutation.config.ts`) and takes its 95/90
      floor (`vitest.config.ts`), with `core-arch` design §13's floor and mutation rows, `retirement.ts` (targets,
      floors, §13's terms), `retirement.test.ts`'s pending-floor case and the comment of
      `.github/workflows/conformance.yml`'s mutation job; nine targets still. Tests: R18 in the new
      `test/backbone/ledger-refcount-removal.test.ts` (`sweep.ts` absent; no file under `src/` names R18's seven
      identifiers, as whole words, the scan checked on a planted line; the item's five tables; every part either side
      declares with migrations has exactly `001`, and the four without, `core-block-fetch`, `core-config`,
      `core-health`, `core-status`, none); R16's clause in `test/backbone/part-migrations.test.ts`'s new-database case
      (no `core_ledger_state` relation named `sweep`, `grey` or `marks`, both backends). Codex: `5.1-red` (before the
      removal: 4 failing for the intended reasons — `sweep.ts` present, the item listing the three tables, a new
      database holding them on PostgreSQL and on PGlite), `5.1-touched-1` (with the tapes: R18, R16's three files, A5,
      R2, R4's DAG test, control and devnet tape file, A102, A160, the step's unit tests, every DAG file reading the
      plumbing, `worker-eviction`: 37 files, 246 tests passed), `5.1-mutation-refcount` (`refcount.ts` alone: 92.17 % of
      332 valid mutants, break 65), `5.1-refcount-coverage-2` (its two unit tests alone cover 100 % of its lines and
      branches). Whole suite before this commit (`5.1-full`, `npx vitest run` with the tapes, the final tree but this
      sentence, 2,578 s): 435 files, 6,506 tests passed, 12 skipped, no failure (§0: 387, 6,252, 12); R2's and R4's
      files among them, the tape files included.
- [x] 5.2 The documents (`design.md` §11, "Documents") not changed earlier, and `scripts/local-preprod-sync.mjs`
      (`design.md` §12.1).
      **Acceptance:** R26 but its clause "issue `docs/issues/00078` is closed naming this change" (9.2's), checked whole
      over every document R26 names, those changed in §3 and 5.1 included; the script, run without
      `UMBRADB_LOCAL_NODE`, exits non-zero naming the variable.
      **Done (2026-11-03, this commit):** `CHANGELOG.md`: R26's one line, in a subsection "Changed since
      `v0.10.0-rc.2`" after start-umbradb's (whose check, L59, reads only that one). `ROADMAP.md`: the ledger line
      (`:37`) says reference counting; `:88`, the line §11 names, meant the crash test and now says "the crash sweep".
      `core-arch` design: §1's `src/ledger/` row no longer lists the sweep; §5.4, "Storage, retention and
      reclamation", points to this design's §2–§7 and keeps the eviction, `forgetTransactions` and Q144 B's restart,
      with the one-block lag; its 12.5a paragraph's first-copy sentence replaced (a restart changes only how nodes are
      spelled, A160's rewritten text); §5.5: the eviction, not a sweep step, runs in the worker. The module guide: a
      new §4.4 (the bytes of `nodes`, `ref_counts` and `unreferenced` are not part of the determinism contract;
      modules read ledger state through ledger tasks and `core-ledger-state`'s items; the module role can read the
      tables, nothing more enforced), and `ledger-refcount-invalid` among Appendix A.2's halts (beyond R26's words).
      The `src/ledger/` comments of §11 (`types.ts`, `adapter.ts`, `worker/host.ts`, `worker/engine.ts`) say
      reclamation, and name the refusal's other cause, a live object holding a node by reference where the stored
      lists embed it. Checked whole over every document R26 names after 5.1: `core-arch` design §4, §8, §10, §11 and
      acceptance §17 (3.1–3.8, 5.1) describe the change; what still says "sweep" elsewhere is the `sweep` key (O-1),
      the crash sweep (A50), historical comparisons (§13's and the configurations' past floor and measurements), the
      upstream `gc-v1` feature, `CHANGELOG.md`, or records of their time (`docs/issues/`, `docs/releases/`,
      `docs/research/`, `core-arch`'s `tasks.md` and proposal); `core-arch`'s ledger spec and its A104, A105 and A134,
      which this change's delta and acceptance §7 replace, left as they are but for one pointer line under each of
      A104, A105 and A134 to acceptance §7 (questions file Q-5.2-1: the runner's A, then the owner's B, `0e24347`).
      Nothing of 5.1's needed fixing. `scripts/local-preprod-sync.mjs` (design §12.1, with §12.3's probe): the build's
      `umbradb run` in `node:24.9.0-alpine` on a Docker network of its own beside the repository's one PostgreSQL 18
      image (`test/postgres-image.ts`'s pin, which A148 requires; `postgres:18` first, caught by
      `test/dependencies/postgres-image.test.ts`); per 1,000-height window the wall time (interpolated between
      `/status` samples) and the `nodes` row count; the probe's answers and each window's slow mark; without
      `UMBRADB_LOCAL_NODE` (unset, empty or no `ws` URL) it exits 2 naming it before anything else. Never run against a
      node. Its test `test/integration/local-preprod-sync.test.ts` (with no `docker` on `PATH` it still names the
      variable; no output folder). Codex: `5.2-script-red` (the script missing: 4 failing), `5.2-docs-1`,
      `5.2-docs-2` (before and after the rebase onto 5.1: the script test and every test that reads a document, 21
      files, 313 passed), `5.2-docs-3` (with A148's pin test: 22 files, 321 passed). Whole suite before this commit
      (`5.2-full-2`, `npx vitest run` with the tapes, the final tree but this sentence, 2,939 s): 436 files, 6,510
      tests passed, 12 skipped, no failure (§0: 387, 6,252, 12; 5.1's: 435, 6,506, 12).

## 6. Full verification (AGENTS.md stage 3)

- [ ] 6.1 `npm run typecheck`, the full `npx vitest run` and `npm run test:coverage`.
      **Acceptance:** typecheck exit 0; the full run passes; a failing test is fixed here, or, if it is flaky and
      neither a required test of the manifest, a crash test nor a differential test, quarantined as AGENTS.md's "Flaky
      tests" rule allows (an owner, a root-cause note and a fix-or-retire date in an issue in `docs/issues/`) — a rerun
      that passes is diagnostic, never evidence; every coverage floor met (`vitest.config.ts`), none lowered.
- [ ] 6.2 Each new or changed crash, property and differential test run five times.
      **Acceptance:** Definition of done 5; the five runs of each recorded here with the commit.
- [ ] 6.3 The mutation gate, the pack smoke, the graph check and the conformance gate.
      **Acceptance:** `npm run test:mutation:ci` passes (at least 65 % on its targets); `npm run test:smoke` passes;
      `npm run graph:check` exits 0 after the section's refresh; `npm run test:conformance` passes, every required test
      executed and passed.
- [ ] 6.4 The acceptance map (`acceptance-map.md`): each of R1 … R30 and the rewritten A-criteria to its test file and
      title, and each `[NEG]` control to the run that shows it failing.
      **Acceptance:** every criterion has its tests (R23–R25: their manual evidence, after §7); every cited title exists
      in its file and passed.
- [ ] 6.5 A134 recorded as deferred after 0.10.0 (owner decision Q191; its rewritten text in `acceptance.md` §7; R14
      covers the step's crash points meanwhile).
- [ ] 6.6 CI on the pull request's head (the owner pushes).
      **Acceptance:** every required CI job (AGENTS.md stage 3) green on the head before §8 starts; every later edit
      runs the required CI again before merge.

## 7. Local preprod runs (`design.md` §12; manual evidence, never in CI)

- [ ] 7.1 The before-picture's height `H_p13` read from a `TEMPLATE` copy of the P13 volume (`design.md` §12.2).
- [ ] 7.2 The performance comparison.
      **Acceptance:** R23, its evidence recorded in the pull request.
- [ ] 7.3 The node set at `H_p13`.
      **Acceptance:** R24, its evidence recorded in the pull request.
- [ ] 7.4 Preprod 0–10,000 on both backends.
      **Acceptance:** R25, its evidence recorded in the pull request.

## 8. Review (AGENTS.md stage 4, bounded)

- [ ] 8.1 The three lanes on the final tree, after the branch is integrated with current `main` and 6.6 is green: spec
      compliance, cold adversarial, release.
- [ ] 8.2 Blocking findings fixed, then one targeted fix check by a reviewer other than the fixer; every finding still
      open recorded for the owner.

## 9. Close-out

- [ ] 9.1 After R23 and R24 pass: `test/backbone/sweep-model.ts`, the rest of `sweep-tapes.ts`, and R2's and R4's tests
      deleted (owner decision Q-E; Definition of done 2), their last passing run recorded in the pull request; this edit
      gets its own targeted fix check (AGENTS.md, "Bounded review") and the required CI again.
      **Acceptance:** no file under `test/` names `sweep-model`; the full run and the conformance gate pass as in §6.
- [ ] 9.2 Issue `docs/issues/00078` closed, naming this change.
      **Acceptance:** R26's last clause (R26 whole with 5.2's part).
- [ ] 9.3 Check off every task above with the criteria it demonstrated, the acceptance map complete.
- [ ] 9.4 Set the proposal's status line to Implemented.
- [ ] 9.5 Update `ROADMAP.md`: this change.
- [ ] 9.6 Run `npm run graph:refresh` and commit `graphify-out/` with the close-out commit; `npm run graph:check`
      exits 0.
- [ ] 9.7 Record in the pull request, per `docs/PULL_REQUEST_CHECKLIST.md`: the reviewed commit, each lane's verdict and
      model id, the fix checks, the owner's decisions, the manual evidence of R21 and R23–R25, R2's and R4's last
      passing run, the breaking-change note (databases and backups of earlier builds refused), and the CI runs.
