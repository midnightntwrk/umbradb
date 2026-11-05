# Tasks — TOKEN-METADATA: MIP-0018 token metadata from contract logs

No implementation code before the stage-1 gate: the cold adversarial review of this change (Codex, given only the
repository, the change and its instructions) and the owner's approval. Then one task per change set, test first: write
the tests for the task's criteria, watch them fail for the intended reason, implement until they pass; a `[NEG]`
criterion's negative control is committed and seen failing for its own reason with the fault put back. Database tests
run on PostgreSQL 18 in Docker and on PGlite, never on mocks. After each task: `npm run typecheck` and the tests it
touched green (`npx vitest run --maxWorkers=8 <files>`), and the task checked here with the criteria it demonstrated.

**A task's criteria are `acceptance.md`'s, verbatim** (AGENTS.md stage 2). A criterion split across tasks is checked
when its last part passes. A criterion that proves ambiguous or untestable is escalated, never read weaker.

## 0. Baseline

- [ ] 0.1 Record the base commit and the state of the tree before any change.
      **Acceptance:** `npm run typecheck` exit 0 and a full `npx vitest run --maxWorkers=8` with `UMBRADB_TAPES` set
      on the base, its result recorded here; each failure unrelated to this change filed in `docs/issues/`.

## 1. Fixtures and the log reader (`design.md` §D7, §D9)

- [ ] 1.1 Copy the reference repository's `vectors/` and the stagenet cases' JSON (C01–C11, IDX, U1) at `e8295792…`
      into `test/fixtures/mip-0018/` with `SOURCE.md` (commit, each file's SHA-256) and a hash test; write
      `SUPERSEDED.md` by checking every copied vector and case expectation against the MIP's text at `338ea19` (at
      least A3c; every vector with a non-UTF-8 key; C07's served fields).
      **Acceptance:** the hash test passes and fails on a changed byte; `SUPERSEDED.md` gives, for each entry, the
      reference outcome, UmbraDB's outcome and the MIP sentence that decides it.
- [ ] 1.2 Record the `data` bytes of C01's `Misc` log as UmbraDB stores them, read from the case's raw transaction
      (fetched from a stagenet node at the case's block) through `core-contract-logs-fast`'s reading, which gives
      `-full`'s rows without state (CC-3), as a fixture with its height, block hash and endpoint.
      **Acceptance:** the fixture exists; if its shape differs from `design.md` §D7's, stop and escalate before 1.3.
- [ ] 1.3 Record the stagenet tape over 710,806–724,957 (`tools/tape`), add it to the tapes release and to
      `test/tape/real/manifest.json`.
      **Acceptance:** the tape's manifest entry checks (size, SHA-256, range); the existing real-tape tests pass.
- [ ] 1.4 The log reader (`design.md` §D7).
      **Acceptance:** M6, M7, M9.

## 2. The decoder and the color (`design.md` §D2, §D6)

- [ ] 2.1 The payload decoder with its reason enumeration and the test encoder.
      **Acceptance:** M10, M11, M13.
- [ ] 2.2 The decoder's property test.
      **Acceptance:** M12, M8.
- [ ] 2.3 The color function.
      **Acceptance:** M15.

## 3. The module and its rows (`design.md` §D1, §D3, §D4)

- [ ] 3.1 The declaration (`src/features/token-metadata/`, id `token-metadata`, requires `contract-logs`,
      `startsMidChain: true`), migration `001` (both tables, their indexes), and the module harness.
      **Acceptance:** M1; the migration passes the determinism rules on both backends.
- [ ] 3.2 Storing candidates and records at `on-compute` / `on-db-write`.
      **Acceptance:** M5, M14 (rows part), M16, M2, M3, M4.

## 4. Answers (`design.md` §D5)

- [ ] 4.1 The replay, coverage and the read-time rules.
      **Acceptance:** M18, M19, M20, M21, M22, M23, M24, M25, M26, M27, M14.
- [ ] 4.2 The routes and the lookup by color.
      **Acceptance:** M17, M28, M31.
- [ ] 4.3 The subscription.
      **Acceptance:** M29.
- [ ] 4.4 The export from `src/index.ts` and its entry helper.
      **Acceptance:** `npm run typecheck` exit 0; the library-surface tests updated for the new export pass; a
      configuration using `TOKEN_METADATA.entry(...)` passes `npx umbradb config check`.
- [ ] 4.5 The measurements.
      **Acceptance:** M30, reported in the pull request.

## 5. Conformance, the real chain and the browser

- [ ] 5.1 UmbraDB's adapter for the reference runner.
      **Acceptance:** M32.
- [ ] 5.2 The stagenet tape replay against the cases.
      **Acceptance:** M33.
- [ ] 5.3 The module in the browser build.
      **Acceptance:** M34.

## 6. Verification

- [ ] 6.1 The full suite and the gates.
      **Acceptance:** `npm run typecheck` exit 0; full `npx vitest run --maxWorkers=8` with `UMBRADB_TAPES` set, no
      failure beyond §0's; `npm run test:conformance` with coverage floors for every new file; `npm run test:mutation`
      ≥ 65 % on `src/features/token-metadata/`; every new property and differential test run five times.
- [ ] 6.2 CI green on the pull request's head (conformance, mutation, Lean gate, supply chain, pack-install smoke,
      `graph.yml`, code scan).
      **Acceptance:** every required job green, linked in the pull request.

## 7. Review

- [ ] 7.1 The three review lanes (spec compliance, cold adversarial, release), one bounded round, then one targeted
      fix check; every finding fixed, specified, or decided by the owner.
      **Acceptance:** each lane's report and the decisions recorded in the pull request.

## 8. Close-out

- [ ] 8.1 Documentation: `docs/module-guide.md`, `docs/operator-guide.md`, `docs/browser.md`, `README.md`.
      **Acceptance:** M35 (its documentation part).
- [ ] 8.2 Update `ROADMAP.md`: F4's status for this change.
      **Acceptance:** M35 (its ROADMAP part).
- [ ] 8.3 Set `proposal.md`'s status line to Implemented and check every task here.
      **Acceptance:** no unchecked task above.
- [ ] 8.4 Run `npm run graph:refresh` and commit `graphify-out/` in the close-out commit (`git add` the change's new
      files first).
      **Acceptance:** `npm run graph:check` exits 0 on the close-out commit.

## Workflow follow-up

- Draft the chained change for the browser page that shows token metadata arriving (proposal D-B).
- Archive the change after merge (`/opsx:archive`), once `core-arch` is archived, so `specs/token-metadata/` becomes
  `openspec/specs/token-metadata/`.
