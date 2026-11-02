# Acceptance — LEDGER-REFCOUNT: stored ledger nodes reclaimed by reference counting

Every criterion is numbered, individually checkable, and tagged with how it is verified (the tags of `core-arch`'s
`acceptance.md`): `[CI]` CI test, `[PROP]` property test (fast-check, seed recorded), `[FAULT]` crash or fault
injection, `[DIFF]` differential, `[STATIC]` static check, `[DOC]` documentation artifact, `[MANUAL]` manual evidence
recorded in the pull request, `[MEASURE]` a measurement run and reported, which fails only if it cannot run, never on
its figures. `[NEG]` marks a criterion whose test carries a negative control that is seen failing for its own reason
with the fault put back. Database criteria run on PostgreSQL 18 in Docker and on PGlite, as `core-arch`'s do, unless a
criterion names one backend. The recorded tapes are those of `core-arch`'s acceptance (downloaded into `UMBRADB_TAPES`;
a tape-based case is skipped by name when its tape is absent); the **DAG fixture** is
`test/ledger/fixtures/sweep-fixture.ts` with its test package `sweep-test-loader.ts`, extended as A105 says. Terms
(`S_h`, `R_h`, new nodes, queue) are those of `design.md` §1. The requirements each criterion verifies are in parentheses.

## Definition of done

1. Every criterion below passes; every `[NEG]` control fails for its own reason with the fault put back.
2. R4 passes until the close-out task that retires it with `test/backbone/sweep-model.ts`, which runs only after R23
   and R24 pass (owner decision Q-E); its last passing run is recorded in the pull request.
3. R23–R25 are manual evidence from local runs (`design.md` §12), recorded in the pull request; they are never part of
   CI or of the required-test manifest.
4. The `core-arch` criteria rewritten in §7 pass with their new text; every other `core-arch` and `start-umbradb`
   criterion passes unchanged.
5. The conformance gate passes on the pull request's head.

## 1. The rules, on the reference model (LG-14)

- **R1** `[PROP]` A reference model of LG-14 (an independent in-memory implementation of its steps in the tests, using
  sets of hex keys and nothing of `src/` but `childRefKeys`, which `test/ledger/node-refs.test.ts` checks against the
  ledger package's own `childRefs`) and a reachability oracle (the stored keys reachable from the roots, recomputed
  from scratch) agree after every block of generated histories: with `sweep` on, the stored set is `R_{h−1} ∪ R_h`;
  always, every reference count is the in-degree over the stored child lists counting repeats, the queue is the set of
  stored keys with no reference and no root count, and no stored child list references a key that is not stored.
  The generators cover shared children (one key under parents of different states), a key repeated in one child list,
  embedded children holding references, re-inserts, a queued key referenced again, `retainStates` 0 and > 0, contract
  keys persisted and never released, a lowered window releasing several states in one block, and `sweep` turned off
  and on. (LG-14)
- **R2** `[PROP][DIFF]` On the same generated histories, the model's stored set equals the sweep's reference model's
  (`test/backbone/sweep-model.ts`) at every height when its budget lets each cycle start and end in one block, and is a
  subset of it at every height with a budget of 50. (LG-14; `design.md` §4.3)

## 2. The implementation, on both backends

- **R3** `[CI]` After every block of the DAG fixture, and at every 100th height and the last of the recorded preprod
  0–10,000, stagenet 0–10,000 and devnet v8 → v9 tapes, the database read independently satisfies `design.md` §2.2:
  every `ref_counts` row equals the in-degree recomputed from every stored child list (repeats counted), no key with a
  positive in-degree lacks a row, `unreferenced` is exactly the stored keys with no reference and no root count, every
  reference resolves to a stored node, and the stored set is `R_{h−1} ∪ R_h`. (LG-11, LG-14)
- **R4** `[DIFF]` The counting run's batches, fed after every block to the sweep's reference model: on the DAG fixture
  and the recorded tapes with a budget that fits each cycle in one block, the two stored sets are equal at every height;
  on the DAG fixture with a budget of 50, the counted set is a subset of the swept set at every height. Before the
  runtime sweep is removed, the same comparison is also made against the runtime sweep itself (its own run and
  database) on the DAG fixture and the preprod and stagenet tapes, and recorded in `tasks.md`. (LG-14)
- **R5** `[CI]` A node already stored that a later batch inserts again (the test package flushing it again, and a
  restarted worker's first block) changes no count, and the insert's affected rows exclude it. (LG-14)
- **R6** `[CI]` A key queued at h − 1 that one new node of block h references once is not deleted at h, leaves the
  queue, has count 1, and its children's counts do not change at h. (LG-14)
- **R7** `[CI]` With `retainStates` 0, the state released by block h has its root queued at h and its unreached nodes
  deleted at h + 1, none at h, and the worker's eviction at h + 1 is not refused; with `retainStates` 2, the state after
  h − 1 has its unreached nodes deleted at h + 3. (LG-12, LG-14)
- **R8** `[CI]` A node deleted at h1 and needed again at h2 is inserted again at h2 with its references counted again,
  and loading the state at h2 from the database (a fresh worker) succeeds. (LG-11, LG-14)
- **R9** `[CI]` A revision lowering `retainStates` from 5 to 0 at h releases five states at h; every node of theirs
  that the states after h and h + 1 do not reach is deleted at h + 1, in that one block. (LG-12, LG-14)
- **R10** `[CI]` With `sweep: off` from h1 to h2 (the development opt-in set) no node is deleted, every count is exact
  (R3's check) and the queue holds every stored key with no reference and no root count; the first block with
  `sweep: on` again deletes the queue and its cascade, after which the stored set is `R_{h−1} ∪ R_h`; no reset is
  written at either switch. Without the opt-in, `sweep: off` is still refused (`development-opt-in-required`,
  CF-9). (LG-14, CF-9)
- **R11** `[CI][NEG]` Each of the four faults halts at its block with `ledger-refcount-invalid` and its `reason`, the
  block's height and the key or statement in `details`, with nothing of the block stored and the database at h − 1:
  a stored count lowered by hand in a database copy so that a deletion takes it below 0 (`negative-count`); a test
  package flushing a new node that references a key not stored (`missing-reference`); a test package flushing a node
  that nothing references or persists (`unreferenced-new-node`); a test seam making one of the step's statements affect
  one row fewer (`row-count-mismatch`). Each negative control removes its check and the criterion's assertion fails:
  the block commits (R3's check then reports the damage) or halts with another code (a negative count meets
  `ref_counts`' `CHECK (count > 0)`: `database-error`). (LG-14)
- **R12** `[NEG]` Each of these faults, put into the step through its tables seam, makes the oracles of R1, R3 or A105
  fail for its own reason: (a) skipping the decrement of the second occurrence of a repeated child (a leak: R3's count
  check and the stored-set check fail); (b) counting a re-insert's references (R3's count check fails at that block);
  (c) counting a repeated child once per parent on increment but per occurrence on decrement (a count reaches 0 early:
  a live node is deleted, or `negative-count` halts); (d) deleting a released state's nodes in the block that releases
  it (R3's stored-set check finds a node of `R_{h−1}` missing at h; the v9 package would refuse that eviction, as
  `test/ledger/worker-sweep.test.ts` shows for a node of a held state); (e) ignoring rule (3) (a node with a new parent is deleted:
  `missing-reference` halts); (f) stopping the cascade after its first round (garbage stays: R3's stored-set check
  fails). (LG-14)
- **R13** `[FAULT]` The process killed and restarted at every 37th height of the DAG fixture and at 20 seeded heights
  of the preprod 0–10,000 tape continues with `nodes`, `ref_counts`, `unreferenced` and `root_counts` equal, after every
  later block, to an uninterrupted run's. (LG-11)
- **R14** `[FAULT]` A crash injected at each of: in `on-compute` before the step; after the eviction and before the
  block's transaction; in `on-db-write` after the node inserts and before the step's writes; between the step's writes;
  just before and just after `COMMIT` — leaves the database at h − 1 or h, never a mix, and a restarted run's tables
  equal an uninterrupted run's. (LG-11, LG-14, RN-6)
- **R15** `[CI]` A backup taken at h of a database built by this change restores (BK-3: its contents-hash check passes
  with `ref_counts` and `unreferenced` in it), and the restored database continues to h + 50 with R3's check passing
  and its tables equal to an uninterrupted run's. (LG-11, BK-3)
- **R16** `[CI]` A new database gets `ref_counts` and `unreferenced` and none of `sweep`, `grey`, `marks`; a database
  whose recorded `core-ledger-state` migration `002` is the earlier build's (the sweep's tables) refuses startup with
  `migration-checksum-changed`, naming `core-ledger-state`, `002` and both checksums, and runs no migration; a backup
  carrying that migration is refused by `umbradb restore` with `backup-build-mismatch`. (LG-11, DB-9, BK-3)
- **R17** `[CI]` `ref_counts` and `unreferenced` are in the contents hash and the per-block digests: after a block that
  changes a count and the queue, the rows of `core_digest.tables` for both tables carry that height (DT-5); changing
  one count in a copy changes the contents hash; the two backends give equal contents hashes after the DAG fixture.
  (LG-11, DT-3, DT-5)

## 3. Removal, codes and the required test

- **R18** `[STATIC]` `src/backbone/core-ledger-state/sweep.ts` does not exist; no file under `src/` names `sweepStep`,
  `sweepReset`, `SWEEP_BUDGET`, `GreyPicker`, `core_ledger_state.sweep`, `core_ledger_state.grey` or
  `core_ledger_state.marks`; the `ledger-state` item's tables are exactly `nodes`, `root_counts`, `states`,
  `ref_counts`, `unreferenced`. (LG-11, LG-14)
- **R19** `[STATIC]` `ledger-refcount-invalid` is in `ERROR_CODES`, in `HALT_CODES` and in `core-arch` design §11's
  halts, and the code registry (A87) names R11's test as the one that triggers it. (LG-14)
- **R20** `[STATIC]` `test/integration/required-tests.manifest.json` holds `ledger.refcount-cross-backend-identical`,
  bound to A105's test file, and no longer `ledger.sweep-cross-backend-identical`; the pinned count stays 22. (LG-14)

## 4. Measurements

- **R21** `[MEASURE]` On the recorded stagenet 0–10,000, preprod 0–10,000 and devnet v8 → v9 tapes, per block: the
  batch's inserts, its re-inserts, the new nodes' references, the root counts released, the keys whose count changed
  before and after netting, the nodes deleted, the cascade's rounds, and the step's time; reported per tape as
  distributions (median, 99th percentile, maximum). (LG-14; `design.md` §9.1)
- **R22** `[MEASURE]` On the devnet v8 → v9 tape: the stored node count at F − 1, the nodes deleted at F + 1, the
  cascade's rounds there, the step's time and the block's total time at F + 1; reported, with the stored node count at
  the last height of R24's run as the figure a real network's v8 state is at least. (LG-9, LG-14; `design.md` §9.2)

## 5. Local preprod runs (`design.md` §12; never in CI)

- **R23** `[MANUAL]` The performance comparison of `design.md` §12.3: in every 10,000-height band from 10,000 to
  50,000 the candidate's heights/s is at least 80 % of the reference's; the windows left out are listed with the
  node's state; both runs' per-window times and stored node counts are recorded in the pull request. (LG-14)
- **R24** `[MANUAL]` A run of this change from genesis, every core module but `core-contract-logs-fast`, stopped by the
  `core` entry's `stop` at `H_p13` (the stored height of the P13 volume, `design.md` §12.2), stores exactly the node
  keys and root counts of a `TEMPLATE` copy of that volume; and at five or more heights between 10,000 and `H_p13`,
  each read in one `REPEATABLE READ READ ONLY` transaction during the run, R3's check passes. (LG-14)
- **R25** `[MANUAL]` Preprod 0–10,000 on PGlite (the development opt-in) and on PostgreSQL 18, each stopped at 10,000:
  equal contents hashes, and R3's check passes on both. (LG-14, DT-3)

## 6. Documents

- **R26** `[DOC]` `CHANGELOG.md` has one line for the change (reclamation by reference counting; databases and
  backups of earlier builds with `core-ledger-state` refused); `ROADMAP.md`'s lines on the sweep, `core-arch` design
  §5.4, §10 and §11, `core-arch` acceptance §17 and the `src/ledger/` comments describe reference counting; no
  document outside `CHANGELOG.md` and the archived history describes the mark-and-sweep as current. (LG-14)

## 7. `core-arch` criteria rewritten by this change

Each replaces the `core-arch` criterion of the same id; only what is in bold changed.

- **A104** `[CI]` With `retainStates` 0: contract C's state and zswap-state keys are stored at height 10; C changes at
  height 20; enough blocks pass for the ledger states holding the height-10 contract state to be released **and for
  the blocks after their releases to delete their unused nodes**; the contract state and zswap state stored at height
  10 still load from their keys; a control run without persisting them shows those nodes deleted. (LG-13)
- **A105** `[DIFF][NEG]` A reference model of LG-14 **(R1's model)** computes, for each block of **the DAG fixture —
  wide trees, interleaved new roots, content reused after a deletion, extended with children shared between versions,
  a child repeated in one child list and embedded children holding references — the new nodes, reference counts,
  queue, deleted set and stored set**; the implementation **matches the model after every block on PostgreSQL and on
  PGlite, including the keys it evicts, and every `core_ledger_state` table is equal between the two backends after
  every block**; a node deleted and needed again is reinserted; with `sweep: off` nothing is deleted; **negative
  controls: the six of R12, each seen making it or R3 fail**. Required test id
  **`ledger.refcount-cross-backend-identical`**. (LG-14)
- **A134** `[FAULT]` The crash sweep of A50 repeated on the fixed local preprod 0–10,000 range with every core module
  except `-fast`: every mandatory point (inside `on-compute`; inside `on-db-write` after the first and the last
  callback; just before and just after COMMIT; **after the reclamation step's eviction and before the block's
  transaction**) and 100 seeded random points leave no partial block, no skipped height, and a contents hash equal to
  an uninterrupted run's; **negative control:** a build that writes the ledger nodes in a transaction of their own is
  detected. (RN-6, IN-1, LG-11, LG-14) Deferred after 0.10.0 as `core-arch` records it (owner decision Q191).
- **A160** `[FAULT]` A test package that refuses one eviction at block h, after the worker freed what it can, makes
  the worker thread end and a new one start, which loads the state at h − 1 from the database and applies h again
  **with the reclamation step computed again**: the process does not halt, and its stored rows, **reference counts,
  queue** and state roots equal an uninterrupted run's; a package that refuses again on that retry fails the block with
  `callback-error`; on both backends. (LG-14, owner decision Q144)

## 8. Required test ids

| Id | Criterion | Change |
|---|---|---|
| `ledger.refcount-cross-backend-identical` | A105 | Replaces `ledger.sweep-cross-backend-identical`; bound to `test/backbone/ledger-refcount-process.test.ts` |

## 9. Requirement coverage

| Requirement | Criteria |
|---|---|
| LG-11 (layout, restart) | R3, R8, R13, R14, R15, R16, R17, R18, A134 |
| LG-13 (contract states) | A104, R1 |
| LG-14 (reclamation) | R1–R12, R14, R18–R26, A105, A134, A160 |
| LG-12 (window; unchanged, exercised) | R7, R9 |
| LG-9 (conversion; unchanged, measured) | R22 |
| CF-9 (`sweep: off` gate; unchanged) | R10 |
| DB-9, BK-3 (refusals of an earlier build's database) | R16 |
| DT-3, DT-5 (the new tables hashed and digested) | R17, R25 |
