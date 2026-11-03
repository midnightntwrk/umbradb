# Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting

No implementation code before the stage-1 gate (the cold adversarial review of this change, its thirteen targeted fix
checks, and the owner's approval on 2026-11-02). Then one task per change set, test first: write the tests for the
task's criteria (`acceptance.md`), watch them fail for the intended reason, implement until they pass; a `[NEG]`
criterion's negative control is committed and seen failing for its own reason with the fault put back. Database tests
run on PostgreSQL 18 in Docker and on PGlite, never on mocks. A criterion that proves ambiguous or untestable is
escalated, never read weaker (AGENTS.md, "Stop and escalate"). After each task: `npm run typecheck` and the tests it
touched green, and the task checked here with the criteria it demonstrated; at each section's end the whole
`npx vitest run`, compared with the known failures of §0, and `npm run graph:refresh` with `graphify-out/` committed
alone (AGENTS.md stage 2, `CLAUDE.md`).

Order (`design.md` §13): §0 records the baseline; §1 (measurements on the tapes) and §2 (the reference model) run in
parallel; §3 (storage, the step, its checks), §4 (the process on both backends) and §5 (the sweep removed, the
documents) run in series after §2; §6 is the full local verification; §7 the local preprod runs, after §5; §8 the
review; §9 the close-out, whose first task waits for R23 and R24. A criterion split across tasks names the part each
task delivers; it is checked only when its last part passes. Every commit is the corporate identity's, signed and with
its DCO line; none is pushed before the review.

## 0. Baseline

- [ ] 0.1 Record the base commit and the state of the tree before any change.
      **Acceptance:** `npm run typecheck` exit 0 and a full `npx vitest run` on the base, its failures listed, each
      unrelated one filed in `docs/issues/` (or the existing issue named).

## 1. Measurements on the recorded tapes (`design.md` §9, §13 phase 0; R21's batch figures)

- [ ] 1.1 The batch figures of R21, measured from the batches the current build flushes on the recorded stagenet
      0–10,000, preprod 0–10,000 and devnet v8 → v9 tapes, each node classified against the child list last written
      for its key (tracked across the batches, a deletion ending it): per block the batch's nodes, the nodes written
      again unchanged, the rewritten nodes, the keys written in a form other than one written for them earlier
      (deletions and re-insertions included), the new nodes' references, and the root counts released.
      **Acceptance:** the measurement runs on the three tapes and reports each figure per tape as a distribution
      (median, 99th percentile, maximum), with the first height, per tape, at which a key is written in another form
      (R4's comparison stops there); the report is recorded here and in the pull request. It fails only if it cannot
      run (`[MEASURE]`). The figures that need the step (new nodes left unreferenced, the keys whose count changed
      before and after netting, rows deleted, the cascade's rounds, the step's time, the block after the v8 state's
      release) are 4.10's.

## 2. The reference model and the reachability oracle (`design.md` §2.3, §3.2, §4; §13 phase 1)

- [ ] 2.1 `test/backbone/refcount-model.ts`: an independent model of LG-14's step (sets of hex keys, nothing of `src/`
      but `childRefKeys`), a reachability oracle that recomputes `R_h` and `K_h` from each height's generated state, and
      the generators of R1 (admissible and non-admissible batches, and every case R1 lists).
      **Acceptance:** R1 — the property test, its seed pinned and named in its title with an explicit `numRuns`, passes;
      its negative control (rule 4's root conditions removed) fails the oracle's `R_{h−1} ⊆ S_h`.
- [ ] 2.2 The model against the sweep's model.
      **Acceptance:** R2 — on generated histories of admissible batches with one form per key throughout (deletions and
      re-insertions included), the node sets are equal at every height with a budget that fits each cycle in one block,
      and the counted set is a subset of the swept one with a budget of 50; the negative control (the cascade stopped
      after its first round) makes the equality fail.

## 3. Storage, the step and its checks (`design.md` §2, §3, §10; §13 phase 2)

- [ ] 3.1 The halt code `ledger-refcount-invalid` in `ERROR_CODES` (`src/deterministic-postgresql/errors.ts`) and
      `HALT_CODES` (`src/runner/failures.ts`), with the details of `design.md` §10.
      **Acceptance:** a failure with the code halts with it (`failures.ts` rule 1); the code registry test passes. R19's
      registry half (naming R11's test) is 3.7's; its design half is 5.3's.
- [ ] 3.2 One migration per part (`design.md` §2.4): `core-ledger-state`'s, `core-chain`'s and
      `core-private-source`'s `002` folded into their `001`; `core-ledger-state`'s `001` creates `ref_counts`
      (`count > 0`) and `unreferenced`. The sweep's tables leave `001` with the sweep (5.1).
      **Acceptance:** R16 except "none of `sweep`, `grey`, `marks`" (5.1's): a new database gets `ref_counts`,
      `unreferenced`, `core_chain.identity` and `core_private_source.accepted_config` from their parts' `001`; a database
      whose recorded migrations are an earlier build's refuses startup with `migration-checksum-changed` (the part,
      `001`, both checksums) and runs no migration; a backup carrying them is refused with `backup-build-mismatch`;
      `test/backbone/core-chain.test.ts` and `core-private-source.test.ts` follow; both backends.
- [ ] 3.3 The node write replaces a changed child list (`design.md` §2.2: `ON CONFLICT (node_key) DO UPDATE SET
      children = EXCLUDED.children WHERE … IS DISTINCT FROM …`) and `writeBlock` returns the written count.
      **Acceptance:** on both backends, a node written again with its stored child list leaves its row untouched and
      uncounted, one written with another child list replaces it and is counted, a new one is inserted and counted (the
      statement halves of R5 and R27); the existing ledger storage tests (A100–A104) pass.
- [ ] 3.4 `src/ledger/node-key.ts`: a node's key from its payload and its children's keys.
      **Acceptance:** R29's last clause — for every node embedded in the rows of the recorded tapes, the key the ledger
      package gives it; checked against `test/ledger/node-format.ts`'s independent implementation too.
- [ ] 3.5 Content-defined tables (`design.md` §2.5): the declaration of a table item as content-defined, refused for
      user modules; the contents hash takes `nodes` by its node set with every row's key checked, and checks
      `ref_counts` and `unreferenced` against the rows and `root_counts` (`ledger-refcount-invalid`, reason
      `tables-inconsistent`, `details.check` one of `node-key`, `closure`, `roots`, `counts`, `queue`); change capture
      and the digests skip the three tables; DT-6's rules and the `TRUNCATE` guard kept; the restore's contents-hash step
      (BK-3) follows.
      **Acceptance:** R29 (but its last clause, 3.4's) with its three negative controls; A55 and A126 with their new
      text; A57's "nor a content-defined one"; a user module declaring a content-defined table is refused; both
      backends.
- [ ] 3.6 `src/backbone/core-ledger-state/refcount.ts`: `refcountStep` behind its tables seam (rules 1–10 of
      `design.md` §3.2, the checks of §3.3, the reads of §3.4) and `writeRefcount`; the six faults of R12 as seams of
      the tables seam.
      **Acceptance:** the step, given generated tables at h − 1 and batches (2.1's generators), gives the model's new and
      rewritten nodes, counts, queue and deleted set after every block; each check fires on its fault
      (`negative-count`, `missing-reference`, `row-count-mismatch`) at the step's level.
- [ ] 3.7 The step wired into `core-ledger-state`: `on-compute` computes it, the deleted rows are evicted before the
      block's transaction (with the worker restart of Q144 B), `on-db-write` writes it after the node writes in the
      block's transaction; `sweep: off` empties rule 5's deleted set; the `ledger-state` item's tables. The runtime
      sweep stays in the code, unused, until 5.1.
      **Acceptance:** R11 — each of its three faults halts at its block with `ledger-refcount-invalid`, its reason,
      height and key or statement, nothing of the block stored; each negative control fails the assertion; R19's
      registry half (the code registry names R11's test); both backends.
- [ ] 3.8 The DAG fixture (`test/ledger/fixtures/sweep-fixture.ts`, `sweep-test-loader.ts`) extended as A105 says:
      children shared between versions, a child repeated in one child list, embedded children holding references, a
      stored node written again with a small child in the other form (both directions), a package that keeps a node's
      old child list when it creates it again (R28), and one whose live state holds a row by reference while the stored
      parent embeds it (R30).
      **Acceptance:** R27 — on both backends, the row holds the new child list, the old list's references are
      subtracted and the new ones added, a key only the old list referenced is queued and deleted the next block, a
      restarted worker loads the new child list and its next root matches; both negative controls fail as R27 says.

## 4. The process on both backends (`design.md` §4–§8; §13 phase 3)

- [ ] 4.1 R3's database check (its own queries, not the step's code) and A105's test,
      `test/backbone/ledger-refcount-process.test.ts`, carrying `[[ledger.refcount-cross-backend-identical]]`.
      **Acceptance:** R3 after every block of the DAG fixture and at every 100th and the last height of the three tapes,
      its negative control making (b) and (c) fail; A105 — the implementation matches R1's model after every block on
      PostgreSQL and on PGlite (evicted keys included), every `core_ledger_state` table equal between the backends, R3
      passing, and the six negative controls of R12 each making it, R3 or R11 fail (R12).
- [ ] 4.2 Rewrites, the lag and reuse.
      **Acceptance:** R5 (a restarted worker's first block included), R6, R7 (`retainStates` 0 and 2), R8, R9; both
      backends.
- [ ] 4.3 `sweep: off`.
      **Acceptance:** R10, switched off while the queue holds a released state; the opt-in refusal without the opt-in.
- [ ] 4.4 Restarts and crashes.
      **Acceptance:** R13 (every 37th height of the DAG fixture, 20 seeded heights of the preprod tape, each point
      reporting it was reached) and R14 (each named point), each with its negative control.
- [ ] 4.5 Backups and the per-block capture.
      **Acceptance:** R15 with its three negative controls; R17 at block level (no change recorded and no
      `core_digest.tables` row for the three tables, `root_counts` captured and digested as before, the `TRUNCATE`
      refused, equal contents hashes on both backends after the DAG fixture).
- [ ] 4.6 Determinism across worker histories.
      **Acceptance:** R28 on the DAG fixture's case and on the preprod 0–10,000 and devnet v8 → v9 tapes with 20 seeded
      restarts, both backends; its negative control (`nodes` hashed by its raw rows) gives different hashes.
- [ ] 4.7 The eviction's refusal and the worker restart.
      **Acceptance:** R30 with its negative control (restart disabled: `callback-error`, nothing stored); A160 with its
      new text.
- [ ] 4.8 Contract states and the conversion.
      **Acceptance:** A104 with its new text; R22 on the devnet v8 → v9 tape (F = 103), `retainStates` 0 then 2.
- [ ] 4.9 The comparison with the sweep.
      **Acceptance:** R4 — the counting run's batches fed to the sweep's model: equal node sets on the DAG fixture
      without its rewrite cases and on each tape up to 1.1's first other-form height (the heights compared reported), a
      subset with a budget of 50; the negative control (cascade stopped after its first round) fails the equality. Its
      runtime half: the base commit's build (§0), in its own worktree and database, runs the runtime sweep on the DAG
      fixture and the preprod and stagenet tapes, and its node set per height is compared with the counting run's; the
      result is recorded here.
- [ ] 4.10 The rest of R21: per block the new nodes left unreferenced, the keys whose count changed before and after
      netting, the rows deleted, the cascade's rounds and the step's time; on the devnet tape the
      block after the v8 state's release (F + 1 with `retainStates` 0): the rows stored at F − 1, the rows deleted, the
      cascade's rounds, the step's time and the block's total time.
      **Acceptance:** with 1.1's figures, R21 reported per tape (`[MEASURE]`), recorded here and in the pull request.

## 5. The sweep removed, the required test, the documents (`design.md` §11; §13 phase 4)

- [ ] 5.1 The runtime mark-and-sweep removed: `sweep.ts`, its statements and readers in `sql.ts`, `sweepReset`, the
      grey picker seam, `SWEEP_BUDGET`, the `sweepBudget` and `greyPicker` options; `sweep`, `grey` and `marks` gone from
      `core-ledger-state`'s `001`; the tests of the runtime sweep removed or replaced and `sweep-tapes.ts` split as
      `design.md` §11's table says (the DAG plumbing into `test/backbone/ledger-graph-tapes.ts`; R2's and R4's oracle
      kept); `test/ledger/worker-sweep.test.ts` renamed `worker-eviction.test.ts`.
      **Acceptance:** R18; R16's last part (a new database has none of `sweep`, `grey`, `marks`); every test that
      imported the split helpers passes, A160's and the ledger storage tests included; R2 and R4 still pass.
- [ ] 5.2 The required test id.
      **Acceptance:** R20 — the manifest holds `ledger.refcount-cross-backend-identical` bound to A105's file, not
      `ledger.sweep-cross-backend-identical`; the pinned count stays 22; the required-test check passes.
- [ ] 5.3 The documents (`design.md` §11, "Documents"), and `scripts/local-preprod-sync.mjs` (`design.md` §12.1).
      **Acceptance:** R26 but its last clause (issue 00078 closed, 9.2's): `CHANGELOG.md`'s one line; `ROADMAP.md`'s
      lines on the sweep, `core-arch` design §4, §5.4, §8, §10 and §11 (R19's design half), `core-arch` acceptance §17
      and the `src/ledger/` comments describe the change; the module guide's statement on the node tables' bytes; no
      document outside `CHANGELOG.md` and the archived history describes the mark-and-sweep, or the first copy kept, as
      current. The script exits non-zero naming `UMBRADB_LOCAL_NODE` when it is unset.

## 6. Full verification (AGENTS.md stage 3, as far as it runs locally)

- [ ] 6.1 `npm run typecheck`, the full `npx vitest run` and `npm run test:coverage` with every floor met.
      **Acceptance:** typecheck exit 0; the full run fails only §0's known tests and the known load-only flakes, each
      named; every coverage floor met (`vitest.config.ts`), none lowered.
- [ ] 6.2 Each new or changed crash, property and differential test run five times (Definition of done 5).
      **Acceptance:** five passing runs of each, recorded here with the commit.
- [ ] 6.3 The mutation gate, the pack smoke, the graph check and the conformance gate.
      **Acceptance:** `npm run test:mutation:ci` passes (at least 65 % on its targets, the targets as the owner decides
      for `sweep.ts`, which 5.1 removes); `npm run test:smoke` passes; `npm run graph:check` exits 0 after the section's
      refresh; `npm run test:conformance` fails only §0's known tests, every required test executed and passed.
- [ ] 6.4 The acceptance map: each of R1 … R30 and the rewritten A-criteria to its test file and title, and each
      `[NEG]` control to the run that shows it failing.
      **Acceptance:** every criterion has its tests (R23–R25: their manual evidence, after §7); every cited title exists
      in its file and passed.
- [ ] 6.5 What cannot run locally recorded as pending for CI on the pull request's head, and A134 as deferred after
      0.10.0 (owner decision Q191; its rewritten text in `acceptance.md` §7; R14 covers the step's crash points
      meanwhile).

## 7. Local preprod runs (`design.md` §12; manual evidence, never in CI)

- [ ] 7.1 The before-picture's height `H_p13` read from a `TEMPLATE` copy of the P13 volume (`design.md` §12.2).
- [ ] 7.2 The performance comparison.
      **Acceptance:** R23 — both runs' per-window times and row counts, the windows left out with the probe's slow
      answers, and every band's ratios, recorded in the pull request.
- [ ] 7.3 The node set at `H_p13`.
      **Acceptance:** R24, recorded in the pull request.
- [ ] 7.4 Preprod 0–10,000 on both backends.
      **Acceptance:** R25, recorded in the pull request.

## 8. Review (AGENTS.md stage 4, bounded)

- [ ] 8.1 The three lanes on the final tree, after the branch is integrated with current `main`: spec compliance, cold
      adversarial, release.
- [ ] 8.2 Blocking findings fixed, then one targeted fix check by a reviewer other than the fixer; every finding still
      open recorded for the owner.

## 9. Close-out

- [ ] 9.1 After R23 and R24 pass: `test/backbone/sweep-model.ts`, the rest of `sweep-tapes.ts`, and R2's and R4's tests
      deleted (owner decision Q-E), their last passing run recorded in the pull request; this edit gets its own targeted
      fix check (AGENTS.md, "Bounded review").
      **Acceptance:** no file under `test/` names `sweep-model`; the full run and the conformance gate pass as in §6.
- [ ] 9.2 Issue `docs/issues/00078` closed, naming this change (R26's last clause).
- [ ] 9.3 Check off every task above with the criteria it demonstrated, the acceptance map complete.
- [ ] 9.4 Set the proposal's status line to Implemented.
- [ ] 9.5 Update `ROADMAP.md`: this change.
- [ ] 9.6 Run `npm run graph:refresh` and commit `graphify-out/` with the close-out commit; `npm run graph:check`
      exits 0.
- [ ] 9.7 Record in the pull request, per `docs/PULL_REQUEST_CHECKLIST.md`: the reviewed commit, each lane's verdict and
      model id, the fix checks, the owner's decisions, the manual evidence of R21 and R23–R25, R2's and R4's last
      passing run, the breaking-change note (databases and backups of earlier builds refused), and the CI runs.
