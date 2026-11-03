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

- [ ] 0.1 Record the base commit and the state of the tree before any change.
      **Acceptance:** `npm run typecheck` exit 0 and a full `npx vitest run` on the base, its failures listed, each
      unrelated one filed in `docs/issues/` (or the existing issue named). The list is diagnostic: no later gate passes
      by pointing at it.

## 1. Measurements on the recorded tapes (`design.md` §9, §13 phase 0)

- [ ] 1.1 R21's batch figures, from the batches the base build flushes, each node classified against the child list
      last written for its key (tracked across the batches, a deletion ending it).
      **Acceptance:** R21's clauses "On the recorded stagenet 0–10,000, preprod 0–10,000 and devnet v8 → v9 tapes, per
      block: the batch's nodes; the nodes written again unchanged; the rewritten nodes; the keys written in a form other
      than one written for them earlier, deletions and re-insertions included; the new nodes' references; […] the root
      counts released; […] — reported per tape as distributions (median, 99th percentile, maximum)", with the first
      height per tape at which a key is written in another form (R4's comparison stops there); recorded here and in the
      pull request. The rest of R21 is 4.10's.

## 2. The reference model and the reachability oracle (`design.md` §2.3, §3.2, §4; §13 phase 1)

- [ ] 2.1 `test/backbone/refcount-model.ts`: the model, the reachability oracle and the generators of R1.
      **Acceptance:** R1.
- [ ] 2.2 The model against the sweep's model (`test/backbone/sweep-model.ts`).
      **Acceptance:** R2.

## 3. Storage, the step, and the switch (`design.md` §2, §3, §10; §13 phase 2)

- [ ] 3.1 The halt code `ledger-refcount-invalid` in `ERROR_CODES` (`src/deterministic-postgresql/errors.ts`) and
      `HALT_CODES` (`src/runner/failures.ts`), with the details of `design.md` §10, and in `core-arch` design §11's halts.
      **Acceptance:** R19's clause "`ledger-refcount-invalid` is in `ERROR_CODES`, in `HALT_CODES` and in `core-arch`
      design §11's halts"; `test/runner/code-registry.test.ts` passes. The registry's naming of R11's test is 3.8's.
- [ ] 3.2 One migration per part (`design.md` §2.4): `core-ledger-state`'s, `core-chain`'s and
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
- [ ] 3.3 The node write replaces a changed child list (`design.md` §2.2) and `writeBlock` returns the written count;
      `core-arch` design §10's `nodes` row ("an existing key is left as it is" replaced by §2.2's rule).
      **Acceptance:** a statement test on both backends: a node written again with its stored child list leaves its row
      untouched and is not counted, one written with another child list replaces it and is counted, a new one is
      inserted and counted (the shape `design.md` §14 probes); A100–A104 pass. R5 and R27 are checked whole in 4.2 and
      4.1.
- [ ] 3.4 `src/ledger/node-key.ts`: a node's key from its payload and its children's keys.
      **Acceptance:** R29's clause "`src/ledger/node-key.ts` gives, for every node embedded in the rows of the recorded
      tapes, the key the ledger package gives it"; checked against `test/ledger/node-format.ts` too.
- [ ] 3.5 The content-defined table mechanism (`design.md` §2.5): the declaration of a table item as content-defined,
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
- [ ] 3.6 `src/backbone/core-ledger-state/refcount.ts`: `refcountStep` behind its tables seam (rules 1–10 of
      `design.md` §3.2, the checks of §3.3, the reads of §3.4), `writeRefcount`, and the six faults of R12 as seams of the
      tables seam.
      **Acceptance:** given tables at h − 1 and batches from 2.1's generators, the step gives R1's model's new and
      rewritten nodes, counts, queue and deleted set after every block; each check fires on its fault at the step's
      level. R11 and R12 are checked whole in 3.8.
- [ ] 3.7 The DAG fixture (`test/ledger/fixtures/sweep-fixture.ts`, `sweep-test-loader.ts`) extended as A105 says, and
      with the test packages R28 and R30 need (one that keeps a node's old child list when it creates the node again;
      one whose live state holds a row by reference while the stored parent embeds it). The extension is additive: the
      fixture's existing cases, which the sweep's tests run, are unchanged.
      **Acceptance:** a fixture test shows each new case's batches (a rewrite in each direction, a repeated child, an
      embedded child holding a reference, children shared between versions, the two packages' behaviours); the sweep's
      tests still pass.
- [ ] 3.8 **The switch.** `core-ledger-state` computes the counting step in `on-compute`, evicts the deleted rows before
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

## 4. The process on both backends (`design.md` §4–§8; §13 phase 3)

- [ ] 4.1 R3 on the tapes, and the rewrite.
      **Acceptance:** R3's clause "at every 100th height and the last of the recorded preprod 0–10,000, stagenet
      0–10,000 and devnet v8 → v9 tapes" (R3 whole with 3.8's part); R27.
- [ ] 4.2 Written again, a queued key referenced again, the lag, reuse, a lowered window.
      **Acceptance:** R5, R6, R7, R8, R9.
- [ ] 4.3 `sweep: off`.
      **Acceptance:** R10.
- [ ] 4.4 Restarts and crashes.
      **Acceptance:** R13, R14.
- [ ] 4.5 Backups and the per-block capture.
      **Acceptance:** R15, R17.
- [ ] 4.6 Determinism across worker histories.
      **Acceptance:** R28.
- [ ] 4.7 A live object holding a deleted row.
      **Acceptance:** R30.
- [ ] 4.8 The conversion.
      **Acceptance:** R22.
- [ ] 4.9 The comparison with the sweep.
      **Acceptance:** R4. Its runtime half ("Before the runtime sweep is removed, the same comparison is also made
      against the runtime sweep itself (its own run and database) […] and recorded in `tasks.md`") runs the base
      commit's build (§0), in its own worktree and database; the result is recorded here.
- [ ] 4.10 The rest of R21, with 1.1's measurement extended to the step.
      **Acceptance:** R21's clauses "new nodes left unreferenced; […] the keys whose count changed before and after
      netting; the rows deleted; the cascade's rounds; and the step's time — reported per tape as distributions
      (median, 99th percentile, maximum). On the devnet tape also the block after the v8 state's release (F + 1 with
      `retainStates` 0): the rows stored at F − 1, the rows deleted, the cascade's rounds, the step's time and the
      block's total time" (R21 whole with 1.1's part); recorded here and in the pull request.

## 5. The sweep removed, the documents (`design.md` §11; §13 phase 4)

- [ ] 5.1 The runtime mark-and-sweep removed: `sweep.ts`, its statements and readers in `sql.ts`, `sweepReset`, the
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
- [ ] 5.2 The documents (`design.md` §11, "Documents") not changed earlier, and `scripts/local-preprod-sync.mjs`
      (`design.md` §12.1).
      **Acceptance:** R26 but its clause "issue `docs/issues/00078` is closed naming this change" (9.2's), checked whole
      over every document R26 names, those changed in §3 and 5.1 included; the script, run without
      `UMBRADB_LOCAL_NODE`, exits non-zero naming the variable.

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
