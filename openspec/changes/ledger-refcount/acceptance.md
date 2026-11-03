# Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting

Every criterion is numbered, individually checkable, and tagged with how it is verified (the tags of `core-arch`'s
`acceptance.md`): `[CI]` CI test, `[PROP]` property test (fast-check, seed pinned and named in the test's title,
explicit `numRuns`), `[FAULT]` crash or fault injection, `[DIFF]` differential, `[STATIC]` static check, `[DOC]`
documentation artifact, `[MANUAL]` manual evidence recorded in the pull request, `[MEASURE]` a measurement run and
reported, which fails only if it cannot run, never on its figures. `[NEG]` marks a criterion whose test carries a
negative control that is seen failing for its own reason with the fault put back. Database criteria run on PostgreSQL
18 in Docker and on PGlite, as `core-arch`'s do, unless a criterion names one backend. The recorded tapes are those of
`core-arch`'s acceptance (downloaded into `UMBRADB_TAPES`; a tape-based case is skipped by name when its tape is
absent). The **DAG fixture** is `test/ledger/fixtures/sweep-fixture.ts` with its test package
`sweep-test-loader.ts`, extended as A105 says. Terms (`S_h`, `R_h`, `K_h`, form, row, new and rewritten nodes,
protected, queue, node set, content-defined table) and the invariants I1–I6 are those of `design.md` §1 and §2.3. An
**admissible batch** is one in which every node the batch writes is reached from a key whose root count rises (what
`flushNodes` gives, `design.md` §4.6). A crash or fault test
stops the process at a named program point (`test/runner/crash-module.ts` or the crash worker's
`UMBRADB_CRASH_HOOK`), never on a timer, and the point reports that it was reached at its height. The requirements
each criterion verifies are in parentheses.

## Definition of done

1. Every criterion below passes; every `[NEG]` control fails for its own reason with the fault put back.
2. R2 and R4 pass until the close-out task that retires them with `test/backbone/sweep-model.ts`, which runs only
   after R23 and R24 pass (owner decision Q-E: the sweep's model stays the differential oracle until the local preprod
   run passes); their last passing run is recorded in the pull request.
3. R23–R25 are manual evidence from local runs (`design.md` §12), recorded in the pull request; they are never part of
   CI or of the required-test manifest.
4. The `core-arch` criteria rewritten in §7 pass with their new text; every other `core-arch` and `start-umbradb`
   criterion passes unchanged.
5. Every new or changed crash, property or differential test has run at least five times before the change merges.
6. The conformance gate passes on the pull request's head.

## 1. The rules, on the reference model (LG-14)

- **R1** `[PROP][NEG]` A reference model of LG-14 (an independent in-memory implementation of its steps in the tests,
  using sets of hex keys and nothing of `src/` but `childRefKeys`, which `test/ledger/node-refs.test.ts` checks against
  the ledger package's own `childRefs`) and a reachability oracle (reachable sets recomputed from scratch from each
  height's generated state, not from the model's sets) agree after every block of generated histories: I1–I5 hold
  for every batch, and I6 (with `S_h = K_h` at every block with `sweep` on) for every admissible batch; the generators
  produce non-admissible batches too, so that the boundary is exercised. The generators cover shared children (one key under parents of
  different states), a key repeated in one child list, embedded children holding references, nodes written again
  unchanged, nodes rewritten with a small child embedded in one form and referenced in the other (both directions), a
  queued key referenced again, `retainStates` 0 and > 0, contract keys persisted and never released, a lowered window
  releasing several states in one block, and `sweep` turned off and on. **Negative control:** the model with rule 4's
  root conditions removed (a released state's rows deleted in the block that releases it) fails the oracle's
  `R_{h−1} ⊆ S_h`. (LG-11, LG-14)
- **R2** `[PROP][DIFF][NEG]` On the same generated histories with no rewritten node (the sweep's model keeps a node's
  first child list, `design.md` §4.5), the model's node set equals the sweep's reference
  model's (`test/backbone/sweep-model.ts`) at every height when its budget lets each cycle start and end in one block,
  and is a subset of it at every height with a budget of 50. **Negative control:** the model with its cascade stopped
  after the first round differs from the sweep's model where each cycle fits. (LG-14; `design.md` §4.5)

## 2. The implementation, on both backends

- **R3** `[CI][NEG]` After every block of the DAG fixture, and at every 100th height and the last of the recorded
  preprod 0–10,000, stagenet 0–10,000 and devnet v8 → v9 tapes, a check that reads the database through its own
  queries (not through the step's code) finds: (a) I1, I2 and I3, each count recomputed from every stored child list
  with repeats counted; (b) I4, and every state key of `core_ledger_state.states` inside the retention window and every
  key `core_contract_states.states` stores is a row whose whole reachable set is stored; (c) `R_{h−1} ⊆ S_h`, and at
  every block with `sweep` on `S_h = K_h`, with `R_{h−1}`, `R_h` and `K_h` computed on the DAG fixture from the
  fixture's own nodes and states and the block's written nodes (seen through a watcher module), not from the database;
  on the tapes, from the stored rows, with the number of rows outside `R_{h−1} ∪ R_h` reported; (d) at every block with
  `sweep` on, I5 against the queue read at h − 1. **Negative control:** a test seam that, at one block, deletes the
  state's newly persisted root and the rows only it reaches makes (b) and (c) fail. (LG-11, LG-14)
- **R4** `[DIFF][NEG]` The counting run's batches, fed after every block to the sweep's reference model: on the DAG
  fixture without its rewrite cases, and on each recorded tape up to the first rewrite R21 counts there (the heights
  compared are reported), with a budget that fits each cycle in one block, the two node sets are equal at every
  height; on the DAG fixture with a budget of 50, the counted node set is a subset of the swept one at every
  height. Before the runtime sweep is removed, the same comparison is also made against the runtime sweep itself (its
  own run and database) on the DAG fixture and the preprod and stagenet tapes, and recorded in `tasks.md`. **Negative
  control:** a counting step with its cascade stopped after the first round makes the equality fail on the DAG fixture.
  (LG-14)
- **R5** `[CI]` A row that a later batch writes again with the same child list (the test package flushing it again, and
  a restarted worker's first block) changes no count, its row is untouched (no change captured for it), and the node
  write's affected rows exclude it. (LG-11, LG-14)
- **R6** `[CI]` A key queued at h − 1 that one new node of block h references once is not deleted at h, leaves the
  queue, has count 1, and its children's counts do not change at h. (LG-14)
- **R7** `[CI]` With `retainStates` 0, the state released by block h has its root queued at h; none of its rows is
  deleted at h, and at h + 1 every row of it outside `K_{h+1}` is deleted, and the worker's eviction at h + 1 is not
  refused; with `retainStates` 2, the state after h − 1 is released at h + 2, none of its rows is deleted before h + 3,
  and at h + 3 every row of it outside `K_{h+3}` is deleted. (LG-12, LG-14)
- **R8** `[CI]` A row deleted at h1 and needed again at h2 is inserted again at h2 with its references counted again,
  and loading the state at h2 from the database (a fresh worker) succeeds. (LG-11, LG-14)
- **R9** `[CI]` With the window full, a revision lowering `retainStates` from 5 to 0 at h releases the six states after
  h − 6 … h − 1 at h; at h + 1, in that one block, every row of theirs outside `K_{h+1}` is deleted, and a row of
  theirs that the state after h + 1 holds again stays. (LG-12, LG-14)
- **R10** `[CI]` With `sweep: off` from h1 to h2 (the development opt-in set) no row is deleted, R3's (a) and (b) pass,
  and the queue holds every row with no reference and no root count; the first block with `sweep: on` again deletes the
  queue and its cascade, after which R3's (c) passes; no reset is written at either switch. Without the opt-in,
  `sweep: off` is still refused (`development-opt-in-required`, CF-9). (LG-14, CF-9)
- **R11** `[CI][NEG]` Each of the three faults halts at its block with `ledger-refcount-invalid` and its `reason`, the
  block's height and the key or statement in `details`, with nothing of the block stored and the database at h − 1: a
  stored count lowered in a database copy so that a deletion takes it below 0 (`negative-count`); a test package
  flushing a new node that references a key not stored, one rewriting a stored node with a child list that references
  a key not stored, and one raising the root count of a key it neither flushes nor has stored (`missing-reference`); a
  test seam making one of the step's statements affect one row fewer (`row-count-mismatch`). **Negative controls:** each
  removes its check, and the criterion's assertion fails: the block commits (R3 then reports the damage) or halts with
  another code (a negative count meets `ref_counts`' `CHECK (count > 0)`: `database-error`). (LG-14)
- **R12** `[CI][NEG]` Each of these faults, put into the step through its tables seam, makes R3, A105 or R11 fail for
  its own reason: (a) skipping the decrement of the second occurrence of a repeated child (a leak: R3 (a) and (d)); (b)
  counting the references of a node written again unchanged (R3 (a) at that block); (c) counting a repeated child once
  per parent on increment but per occurrence on decrement (a count reaches 0 early: R3 (b) or (c) finds a live row gone,
  or `negative-count` halts); (d) deleting a released state's rows in the block that releases it (R3 (c) finds a row of
  `R_{h−1}` gone; the v9 package would refuse that eviction, as `test/ledger/worker-sweep.test.ts` shows for a node of a
  held state); (e) deleting a queued key that a new node references in the same block (`missing-reference` halts); (f)
  stopping the cascade after its first round (R3 (d)). (LG-14)
- **R13** `[FAULT][NEG]` The process stopped and restarted at a named point after the commit of every 37th height of
  the DAG fixture and of 20 seeded heights of the preprod 0–10,000 tape, each point reporting it was reached, continues
  with `nodes`, `ref_counts`, `unreferenced` and `root_counts` equal, after every later block, to an uninterrupted
  run's. **Negative control:** a restart that empties `unreferenced` (a test seam) makes the tables differ after the
  next block. (LG-11)
- **R14** `[FAULT][NEG]` A crash at each named point — in `on-compute` before the step; after the eviction and before
  the block's transaction; in `on-db-write` after the node writes and before the step's other writes; between the
  step's writes; just before and just after `COMMIT` — each reporting it was reached at its height, leaves the database
  at h − 1 or h, never a mix, and a restarted run's tables equal an uninterrupted run's. **Negative control:** a build
  that writes `ref_counts` and `unreferenced` in a transaction of their own, committed before the block's, crashed
  between the two commits, is detected (R3 (a) fails after the restart, or the tables differ). (LG-11, LG-14, RN-6)
- **R15** `[CI][NEG]` A backup taken at h of a database built by this change restores (BK-3: its contents-hash check
  passes, the node set compared and `ref_counts` and `unreferenced` checked against the rows), and the restored database
  continues to h + 50 with R3 passing and its tables equal to an uninterrupted run's. **Negative controls:** a backup
  whose file lacks the `ref_counts` rows is refused by the restore (its contents-hash step fails with
  `ledger-refcount-invalid`, reason `tables-inconsistent`, and the restore rolls back); one whose file lacks one row of
  `nodes` is refused the same way (a reference, root or queue entry names the missing node). (LG-11, BK-3, DT-3)
- **R16** `[CI]` A new database gets `ref_counts` and `unreferenced` and none of `sweep`, `grey`, `marks`, and
  `core_chain.identity` and `core_private_source.accepted_config` from their parts' `001`; a database whose recorded
  migrations are an earlier build's (`core-ledger-state`'s, `core-chain`'s or `core-private-source`'s `001` and `002`)
  refuses startup with `migration-checksum-changed`, naming the part, `001` and both checksums, and runs no migration;
  a backup carrying those migrations is refused by `umbradb restore` with `backup-build-mismatch`. (LG-11, DB-9, BK-3)
- **R17** `[CI]` `nodes`, `ref_counts` and `unreferenced` are content-defined: a block that inserts, rewrites and
  deletes nodes records no change for them and `core_digest.tables` holds no row for them, while `root_counts`'
  changes at that block are recorded and digested as before (DT-4, DT-5); a `TRUNCATE` of one of them in a callback is
  still refused (`truncate-not-allowed`, DB-14); the two backends give equal contents hashes after the DAG fixture.
  (LG-11, DT-3, DT-4, DT-5)
- **R27** `[CI][NEG]` A rewrite, on both backends, on the DAG fixture's case of a stored node that the test package
  writes again with a small child referenced where the stored child list embeds it, and again in the other direction:
  after the block the row holds the new child list; the old list's references are subtracted and the new ones added
  (R3 (a)); a key only the old list referenced is not deleted at that block, is queued, and is deleted at the next block
  unless referenced or persisted by then; a worker restarted after the block loads the new child list and its next
  state root matches the node's. **Negative controls:** keeping the first copy (`ON CONFLICT DO NOTHING`) fails the row
  check; deleting a key only the old list referenced in the same block fails R3 (c)'s `R_{h−1} ⊆ S_h`. (LG-11, LG-14)
- **R28** `[CI][DIFF][NEG]` Determinism across worker histories, on both backends: on the DAG fixture — whose test
  package, in a run that never restarts, keeps a node's old child list when it creates the node again, and in a run
  restarted before that block writes the new one, as the ledger's back-end does (`design.md` §2.5) — and on the recorded
  preprod 0–10,000 and devnet v8 → v9 tapes with runs restarted at 20 seeded heights (a new process each, reading back
  only the database): the node sets, `root_counts`, `states`, `segment_results`, `events`, `core_digest.tables` and the
  contents hashes are equal after every block across the runs. **Negative control:** with `nodes` hashed by its raw
  rows (today's DT-3 rule), the never-restarted and the restarted runs of the DAG fixture's case have different
  contents hashes. (LG-11, DT-3)
- **R29** `[CI][NEG]` The content-based contents hash, on both backends: two databases holding the same ledger nodes,
  one with a small node embedded in its parent and the other with it referenced and stored as its own row, each with
  the counts and queue its rows give, have equal contents hashes; a database that also holds one more persisted state
  (its root count and the nodes only it reaches, with consistent counts), or one fewer, has a different hash; one whose `ref_counts` or `unreferenced` differ from what its rows give makes the computation
  fail with `ledger-refcount-invalid` (reason `tables-inconsistent`), in a backup (nothing written), a restore (rolled
  back) and the exported `contentsHash`; and `src/ledger/node-key.ts` gives, for every node embedded in the rows of the
  recorded tapes, the key the ledger package gives it. **Negative control:** `nodes` hashed by its raw rows makes the two
  spellings' hashes differ. (LG-11, DT-3)

## 3. Removal, codes and the required test

- **R18** `[STATIC]` `src/backbone/core-ledger-state/sweep.ts` does not exist; no file under `src/` names `sweepStep`,
  `sweepReset`, `SWEEP_BUDGET`, `GreyPicker`, `core_ledger_state.sweep`, `core_ledger_state.grey` or
  `core_ledger_state.marks`; the `ledger-state` item's tables are exactly `nodes`, `root_counts`, `states`,
  `ref_counts`, `unreferenced`; every part UmbraDB declares that has migrations has exactly one, `001`, and the parts
  that have none still have none. (LG-11, LG-14)
- **R19** `[STATIC]` `ledger-refcount-invalid` is in `ERROR_CODES`, in `HALT_CODES` and in `core-arch` design §11's
  halts, and the code registry (A87) names R11's test as the one that triggers it. (LG-14)
- **R20** `[STATIC]` `test/integration/required-tests.manifest.json` holds `ledger.refcount-cross-backend-identical`,
  bound to A105's test file, and no longer `ledger.sweep-cross-backend-identical`; the pinned count stays 22. (LG-14)

## 4. The recorded tapes and the conversion

- **R21** `[MEASURE]` On the recorded stagenet 0–10,000, preprod 0–10,000 and devnet v8 → v9 tapes, per block: the
  batch's nodes; the nodes written again unchanged; the rewritten nodes; the new nodes' references; new nodes left
  unreferenced; the root counts released; the keys whose count changed before and after netting; the rows deleted; the
  cascade's rounds; and the step's time — reported per tape as distributions (median, 99th percentile, maximum). On the
  devnet tape also the block after the v8 state's release (F + 1 with `retainStates` 0): the rows stored at F − 1, the
  rows deleted, the cascade's rounds, the step's time and the block's total time. (LG-9, LG-11, LG-14; `design.md` §9)
- **R22** `[CI]` On the devnet v8 → v9 tape (F = 103), with `core-contract-states` active and `retainStates` 0, then 2:
  R3 passes at every block from F − 3 to F + 4; each v8 state is released by the block b its window sets, none of its
  rows is deleted before b + 1, and at b + 1 every row of it outside `K_{b+1}` is deleted; every contract state and
  zswap state stored below F loads from its stored key after F + 4. (LG-9, LG-13, LG-14)

## 5. Local preprod runs (`design.md` §12; never in CI)

- **R23** `[MANUAL]` The performance comparison of `design.md` §12.3: in each 10,000-height band from 10,000 to
  50,000, the candidate's heights/s over the kept windows is at least 80 % of the reference's over the same windows,
  with at least 7 of the band's 10 windows kept; the windows left out are listed with the probe's slow answers; both
  runs' per-window times and row counts, and every band's ratio over all its windows, are recorded in the pull request.
  (LG-14)
- **R24** `[MANUAL]` A run of this change from genesis, every core module but `core-contract-logs-fast`, stopped by the
  `core` entry's `stop` at `H_p13` (the stored height of the P13 volume, `design.md` §12.2), has the node set and the
  root counts of a `TEMPLATE` copy of that volume; and at five or more heights between 10,000 and `H_p13`, each read in
  one `REPEATABLE READ READ ONLY` transaction during the run, R3's (a), (b) and (d) pass. (LG-11, LG-14)
- **R25** `[MANUAL]` Preprod 0–10,000 on PGlite (the development opt-in) and on PostgreSQL 18, each stopped at 10,000:
  equal contents hashes, and R3's (a), (b) and (d) pass on both. (LG-11, LG-14, DT-3)

## 6. Documents

- **R26** `[DOC]` `CHANGELOG.md` has one line for the change (reclamation by reference counting; a node written again
  replaces its stored child list; the ledger's node tables hashed by the nodes they hold; one migration per part;
  databases and backups of earlier builds refused); `ROADMAP.md`'s lines on the sweep, `core-arch` design §4 (the
  determinism component's content-defined tables), §5.4, §8, §10 and §11, `core-arch` acceptance §17 and the
  `src/ledger/` comments describe the change; issue `docs/issues/00078` is closed naming this change; no document
  outside `CHANGELOG.md` and the archived history describes the mark-and-sweep, or the first copy kept, as current.
  (LG-11, LG-14)

## 7. `core-arch` criteria rewritten by this change

Each replaces the `core-arch` criterion of the same id; only what is in bold changed.

- **A104** `[CI]` With `retainStates` 0: contract C's state and zswap-state keys are stored at height 10; C changes at
  height 20; enough blocks pass for the ledger states holding the height-10 contract state to be released **and for
  the blocks after their releases to delete their unused rows**; the contract state and zswap state stored at height 10
  still load from their keys; a control run without persisting them shows those nodes deleted. (LG-13)
- **A105** `[DIFF][NEG]` A reference model of LG-14 **(R1's model)** computes, for each block of **the DAG fixture —
  wide trees, interleaved new roots, content reused after a deletion, extended with children shared between versions,
  a child repeated in one child list, embedded children holding references, and a stored node the test package writes
  again with a small child in the other form — the new and rewritten nodes, reference counts, queue, deleted set and
  rows**; the implementation **matches the model after every block on PostgreSQL and on PGlite, including the keys it
  evicts; every `core_ledger_state` table is equal between the two backends after every block; and R3's check passes
  after every block**; a row deleted and needed again is reinserted; with `sweep: off` nothing is deleted; **negative
  controls: the six of R12, each seen making it, R3 or R11 fail**. Required test id
  **`ledger.refcount-cross-backend-identical`**. (LG-11, LG-14)
- **A134** `[FAULT]` The crash sweep of A50 repeated on the fixed local preprod 0–10,000 range with every core module
  except `-fast`: every mandatory point (inside `on-compute`; inside `on-db-write` after the first and the last
  callback; just before and just after COMMIT; **after the reclamation step's eviction and before the block's
  transaction**) and 100 seeded random points leave no partial block, no skipped height, and a contents hash equal to
  an uninterrupted run's; **negative control:** a build that writes the ledger nodes in a transaction of their own is
  detected. (RN-6, IN-1, LG-11, LG-14) Deferred after 0.10.0 as `core-arch` records it (owner decision Q191); R14
  covers the step's crash points meanwhile.
- **A160** `[FAULT]` A test package that refuses one eviction at block h, after the worker freed what it can, makes
  the worker thread end and a new one start, which loads the state at h − 1 from the database and applies h again
  **with the reclamation step computed again**: the process does not halt, and its stored rows, **reference counts,
  queue** and state roots equal an uninterrupted run's; a package that refuses again on that retry fails the block with
  `callback-error`; on both backends. (LG-14, owner decision Q144)

## 8. Required test ids

| Id | Criterion | Change |
|---|---|---|
| `ledger.refcount-cross-backend-identical` | A105 (with R3's check after every block of the DAG fixture) | Replaces `ledger.sweep-cross-backend-identical`; bound to `test/backbone/ledger-refcount-process.test.ts` |

## 9. Requirement coverage

| Requirement | Criteria |
|---|---|
| LG-11 (layout, the replacing node write, content-defined tables, restart, determinism across worker histories) | R1, R3, R5, R8, R13–R18, R21, R24, R25, R27–R29, A105, A134 |
| LG-13 (contract states) | A104, R1, R3, R22 |
| LG-14 (reclamation) | R1–R12, R14, R18–R27, A105, A134, A160 |
| LG-12 (window; unchanged, exercised) | R7, R9 |
| LG-9 (conversion; unchanged, exercised and measured) | R21, R22 |
| CF-9 (`sweep: off` gate; unchanged) | R10 |
| DB-9, BK-3 (refusals of an earlier build's database) | R16 |
| DT-3, DT-4 (content-defined tables; modified) | R15, R17, R28, R29 |
| DT-5 (no digest rows for content-defined tables; unchanged rule) | R17, R25 |
