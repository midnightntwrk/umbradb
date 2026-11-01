# Tasks — START-UMBRADB: UmbraDB as a library

No implementation code before the stage-1 gate (the cold adversarial review of this change, its fix checks, and the
owner's approval on 2026-11-01). Then one task per change set, test first: write the tests for the task's criteria
(`acceptance.md`), watch them fail for the intended reason, implement until they pass; a `[NEG]` criterion's negative
control is committed and seen failing for its own reason with the fault put back. Database tests run on PostgreSQL 18
in Docker and on PGlite, never on mocks. After each task: `npm run typecheck` and the tests it touched green, and the
task checked here with the criteria it demonstrated; at each section's end the whole `npx vitest run`, compared with the
known failures of §0, and `npm run graph:refresh` with `graphify-out/` committed alone (AGENTS.md stage 2, `CLAUDE.md`).

Order: §0 records the baseline; §1–§7 build the change, each on the one before (they share the engine,
`src/runner/process.ts`); §8 sweeps the tests and documents and runs the pack smoke; §9 is the full verification, §10
the review, §11 the close-out. Every commit is the corporate identity's, signed and with its DCO line; none is pushed
before the review.

## 0. Baseline

- [x] 0.1 Record the base commit and the state of the tree before any change.
      **Acceptance:** `npm run typecheck` exit 0 and a full `npx vitest run` on the base, its failures listed, each
      unrelated one filed in `docs/issues/`.
      **Done (2026-11-01):** base `d46db79`. 347 files, 5,649 tests: 21 failed, 5,572 passed, 56 skipped. The failures
      that every later run is compared with: `test/private/transport.test.ts` A115 ×18 (instance ids with spaces, which
      the issue-00051 rule refuses: issue 00059), `test/runner/halts.test.ts` `unexpected-cursor` ×2 (the parent check
      halts first: issue 00060), and `test/db/postgres-pool.test.ts` A12 (a poll count under load; passes alone).
      Issues 00059 and 00060: `45b2e76`.

## 1. The resolver and the engine's input (LM-1; design §3.1, §3.2)

- [x] 1.1 `src/runner/resolve.ts`: `resolveDeclarations`, `resolveConfig`, `resolve` and their failure contract, with
      `inferSide`, `commandBuild`, `validateConfig` and `processCoreEntry` called only from there.
      **Acceptance:** `test/runner/resolve.test.ts` passes (seen failing first: the module missing); the configuration,
      backbone, command and backup suites pass unchanged on both backends.
      **Done (2026-11-01, `8454105`):** a third stage `resolveSide(data, side?)` is exported for the commands that call
      the stages themselves (questions file Q-2); `buildDeclarations` is gone; `src/config/history.ts` and
      `src/backup/restore.ts` take the process's core revision as input. A149's negative control rewritten on
      PostgreSQL (one revision for the run): it is refused as on PGlite and still fails A149.
- [x] 1.2 The engine takes `config: { file } | { data }`, `cwd` and a user-modules source, loads and resolves the
      configuration itself and refuses at step 2; `loadConfig`'s `cwd` is required.
      **Acceptance:** the engine's, the command's and the admin's tests pass with `cwd` given; a relative `{ file }`
      resolves against `cwd`, a file URL is read, another URL is refused.
      **Done (2026-11-01, `4b48581`, `cf78382`):** `umbradb run`, the browser worker and the benchmark call the engine
      with the new input; the loader converts file URLs, so the engine bundles without `node:url` (the browser build
      refused it: `cf78382`, `test/browser/` green again).
- [x] 1.3 `umbradb config check`, `backup` and `restore` resolve through the resolver.
      **Acceptance:** L57's first half — `test/cli/config-check*`, `test/cli/modules`, `test/backup/` (with
      `restore-private.test.ts`) keep their assertions (keys renamed), on both backends.
      **Done (2026-11-01, `8219484`):** the commands call the stages, not the composite `resolve`, so a declarations
      fault and a refused configuration keep their messages (questions file Q-3).
- [x] 1.4 L56: no module outside the resolver calls its guarded functions, none outside the engine `planNetwork`.
      **Acceptance:** `test/runner/resolver-boundary.test.ts` passes on the tree and reports, on the base, the 26 call
      sites of before; its negative control (a fixture copy of `src/cli/backup.ts` with every call form) fails.
      **Done (2026-11-01, `aabf664`):** the TypeScript checker over every non-test source; `planNetwork` joined the
      guards with 4.1.

## 2. The private link's settings renamed (D-6; CF-4)

- [x] 2.1 `listen.transport` → `listen.privateLink`, `coreTransport` → `privateLink`: the schemas, the builders' types,
      the runner's and the private source's reads, the messages; every test and fixture moved.
      **Acceptance:** A177 rewritten (`test/private/transport-reader.test.ts`, the schema half in
      `test/config/database-parts.test.ts`) and the configuration, private, command and backup suites pass on both
      backends.
      **Done (2026-11-01, `5269427`).**
- [x] 2.2 `renamed-setting`: an old key is refused `invalid-configuration` at its path, naming the new key.
      **Acceptance:** L51's command and engine half (`test/cli/renamed-setting.test.ts`: `config check`, `backup`,
      `restore`, `run` and the engine, each key, both backends) and A28's rows (`test/config/validate.test.ts`), with
      the rule removed failing 29 cases.
      **Done (2026-11-01, `9d6e5a7`, `dc6b9ec`):** the rule reads every `core` revision as written (questions file Q-4).
- [x] 2.3 The documents name the new keys.
      **Acceptance:** the tests that read the documents pass; `git grep` finds the old keys only in README's notes of
      the rename, the specs and the issues' history.
      **Done (2026-11-01, `42ef756`).** Found on the way: issues 00061 (`389b03a`) and 00062 (`d03c348`).

## 3. The library entry, its options and guarantees (LM-1, LM-2, LM-7–LM-10; design §3.1, §4, §6, §7)

- [x] 3.1 `startUmbraDB`: the synchronous facade, the options' checks (`invalid-option`), the `cwd` default, the handle
      of design §4, `status().listening`, `UmbraDBStarted` without settings.
      **Acceptance:** LM-1's scenario, L32's synchronous return, L52, L62 and its control, L51's library half
      (`test/library/start-umbradb.test.ts`); L50 (`test/library/accept-hash.test.ts`).
      **Done (2026-11-01, `770fcfd`, `9841333`).**
- [x] 3.2 The engine's ports, each off when absent — `log`, `adminListener`, `backupSignals`, `backupAtStop`,
      `workerOutput`, `ledgerWorkerEntry` —; the command gives its own.
      **Acceptance:** L4 and its control (`test/runner/worker-output.test.ts`); L55 (`test/cli/run.test.ts`).
      **Done (2026-11-01, `5846649`):** the ports are flat members of the engine's input, not a nested `ports`
      (questions file Q-6); `updateHash` is `acceptPublicConfigHash`.
- [x] 3.3 Guarantees G1–G10: no `process` listener, no output without `log`, the quiet `node:sqlite` import, the close
      helper, `cwd`-relative paths, `library-setting-refused`, and the `process`-access check.
      **Acceptance:** L1, L2, L8 in a host process of their own, L5, L6, L7, L9, L10, L11, L12, L14, L47 and their
      controls (`test/library/guarantees.test.ts`); L3 (`test/db/sqlite-warning.test.ts`); L13
      (`test/runner/process-access.test.ts`, seen failing first on exactly the sites design §3.1 named).
      **Done (2026-11-01, `390d3a3`).**
- [x] 3.4 User modules: `modules`, `modulesFrom` (both threads import the one URL), `modules-given-twice`,
      `ledger-tasks-need-modules-from`, `load-failed` and `modules-not-a-list`.
      **Acceptance:** L43–L46, L63 and their controls (`test/library/modules.test.ts`).
      **Done (2026-11-01, `e9c4593`).**
- [x] 3.5 `source`: only an exact `InMemoryBlockSource` without hook members, on a public process (`source-refused`);
      no node client with it.
      **Acceptance:** L48 and its control, L49 (`test/library/source.test.ts`, seen failing first: 21 of 23).
      **Done (2026-11-01, `1281941`):** the `node-client` item is absent with an in-memory chain (questions file Q-7).
- [x] 3.6 `started`'s rejection (the reason code, `cause`, the abort reason of a stop, marked handled); `callback-error`
      and `listen-failed` in `ERROR_CODES`; refusal classes by startup step.
      **Acceptance:** LM-9's scenario and L32's abort halves (`test/library/started.test.ts`, 19 seen failing first),
      `test/runner/failures.test.ts`, `test/runner/code-registry.test.ts` and its control.
      **Done (2026-11-01, `99b59e1`, `ddecd5f`).**
- [x] 3.7 `finalizedHeight`; the exports of design §4; `startProcess`, `ProcessHandle`, `ProcessState`,
      `runLedgerWorker` and `BlockSource` no longer exported.
      **Acceptance:** L53 (`test/library/finalized-height.test.ts`); A1 rewritten
      (`test/library-surface/surface.test.ts`, seen failing first on the old barrel).
      **Done (2026-11-01, `4ab167a`).**
- [x] 3.8 The rewritten `core-arch` criteria on `startUmbraDB`.
      **Acceptance:** A157 (`test/admin/refused-configuration.test.ts`), A166 (`test/config/pglite-directory.test.ts`
      and its control), A167 (`test/runner/startup-stop.test.ts` and its control), A169
      (`test/runner/loop-stop.test.ts` and its control), A174 (`test/backup/file-mode.test.ts`), A175
      (`test/backup/signal-ignored.test.ts`), on both backends.
      **Done (2026-11-01, `47e3b21`).**

## 4. The network request and plan (LM-3; design §5.1, §5.2)

- [x] 4.1 `planNetwork` (N1–N9) and its refusals `network-address-conflict` (`both`, `no-address`, `unused`) and
      `private-link-misconfigured` (`wrong-side`, `reader-missing`).
      **Acceptance:** `test/runner/network-plan.test.ts` (each rule's rows, and its negative control); L15–L18 and their
      controls (`test/library/network.test.ts`).
- [x] 4.2 The listeners and the link from the plan; `status().listening`; a `listen.privateLink` on a private process
      ignored; the command's request derived from the file and the admin default.
      **Acceptance:** L19 over TCP and mutual TLS, L21, L64 (`test/library/listening.test.ts`).
- [x] 4.3 The private side's link from the plan; the restore gives the written `privateLink` with its `tls`.
      **Acceptance:** L57's restore half (`test/backup/restore-private.test.ts`, assertions unchanged).
- [x] 4.4 `/config`: the plan's addresses as bound and the `network` field; A66's schemas, additively.
      **Acceptance:** L22 (`test/library/listening.test.ts`); `test/backbone/core-config/config-schema.test.ts`,
      `core-status/status-schema.test.ts`.
      **Done (4.1–4.4, 2026-11-01, `176ff42`):** one engine change, one commit; the full run: the known failures only.

## 5. Mounted handlers and the service lifecycle (LM-4, LM-5; design §5.3)

- [x] 5.1 The module API's handlers usable mounted, with the listener's rules; the lifecycle's 503 body; reads in
      `stopped` and `halted` until `stop()`; subscriptions through `api.upgrade`.
      **Acceptance:** L24 and its controls, L68 and its controls (`test/library/mounted-api.test.ts`); L25–L30 and L30's
      control (`test/library/lifecycle.test.ts`).
- [x] 5.2 `X-Umbra-Version` on every answer, `X-Umbra-Config-Hash` once the hash exists.
      **Acceptance:** L23 (`test/library/mounted-api.test.ts`); A162 (`test/private/config-hash.test.ts`, its run also
      reading the core's mounted answers).
- [x] 5.3 Mounted admin: the snapshot in memory, the heartbeat `unref()`ed when only mounted, the fact reads kept,
      mounted `/health/live` (`thread: "host"`), `/config` before validation, `instance.role` null until the side is
      known, the last snapshot after `closed`.
      **Acceptance:** L61 and its control, with the host-process case (`test/library/mounted-admin.test.ts`); A157's
      stay-up half mounted.
- [x] 5.4 Secrets through the mounted paths; the command's lifecycle.
      **Acceptance:** L65 and its controls (`test/library/mounted-admin.test.ts`); L31
      (`test/cli/run-lifecycle.test.ts`).
      **Done (5.1–5.4, 2026-11-01, `ba38a29`, `00427d1`, `f454ffe`, `ec4fd77`):** 34 of the 43 new criterion tests seen
      failing on the base; L61's no-read oracle strengthened after it passed there (`f454ffe`); RN-9's order test no
      longer orders a parallel wave (`ec4fd77`). A mounted `api.http` answers 400 to a request whose body the host read
      first (questions file Q-9).

## 6. The private link over channels (LM-6; design §5.4)

- [x] 6.1 The link's session logic split from its socket carriers (`src/private/core-socket.ts`,
      `src/private/private-socket.ts`).
      **Acceptance:** `test/private/` fails exactly the same 18 tests (§0's A115) before and after the split.
      **Done (2026-11-01, `254e8ec`).**
- [x] 6.2 `src/library/channels.ts`: `PrivateLinkChannel`, the envelope, `messagePortChannel`, liveness, size and
      backpressure.
      **Acceptance:** `test/library/channels.test.ts`; A1 with nothing pending.
      **Done (2026-11-01, `f6d73f5`):** the envelope's shape is this build's reading (questions file Q-10).
- [x] 6.3 `publicSide: { channels: true }` with `accept` (the queue of 64, `hello-first`, `hello-pending`, `too-large`,
      `private-link-not-accepting`, `try-again`) and `privateSide: { connect }` (back-off, `stop()` aborts it).
      **Acceptance:** L20, L33, L34–L36 and their controls, L37, L42 (`test/library/channel-link.test.ts`); L38–L41 and
      their controls (`test/library/channel-queue.test.ts`).
      **Done (2026-11-01, `d322635`, `f45ddb5`):** `report-unchecked` at the process level on PostgreSQL, and at the
      link on any backend (questions file Q-11).
- [x] 6.4 The link's checks over channels, as over sockets.
      **Acceptance:** L66 and L67 with their controls (`test/library/channel-checks.test.ts`); 52 of the 58 criterion
      tests of 6.3–6.4 seen failing on the 6.2 tree.
      **Done (2026-11-01, `da5a907`).**

## 7. The browser demo on the engine (LM-11; design §8)

- [x] 7.1 The engine's internal `api.fetch`, `admin.fetch` and `api.connect`; the module API's socket carrier split
      out (`src/runner/api-session.ts`, `src/runner/api-socket.ts`).
      **Acceptance:** `test/library/demo-handlers.test.ts` and its controls (10 seen failing on the base),
      `test/runner/api-session.test.ts`.
      **Done (2026-11-01, `a848778`):** the demo reads its process through a fourth internal member, `opened()`
      (questions file Q-12); an `api.connect` channel's end (questions file Q-13).
- [x] 7.2 The demo's workers call the engine with `{ data }`, `cwd: "/"`, the page's log and the Web Worker entry; the
      link over a new `MessageChannel` per (re)connection.
- [x] 7.3 The socket carriers in `UNAVAILABLE`, the substitute of `src/runner/api-server.ts` and the simulated network
      removed; the fixture writes no address and has no `api=1`.
- [x] 7.4 A129 and A132 on the new wiring, A130 and A131 unchanged; L58.
      **Acceptance:** `test/browser/` in headless Chrome (`browser.test.ts` with L58, `build.test.ts` and its control);
      `npm run build:browser`.
      **Done (7.2–7.4, 2026-11-01, `01e6dc9`):** 6 of 15 new browser tests seen failing on the 7.1 tree. Issues 00063
      (ledger-task user modules in the demo), 00064 (timing budgets under a loaded machine) and 00065 (a Node.js 24.9.0
      V8 fault hanging a test fork) filed.

## 8. The test sweep, the documents and the pack smoke (design §9; LS-1)

- [x] 8.1 Every test that calls `startProcess(` starts the engine (internal) or `startUmbraDB`; L60.
      **Acceptance:** no test imports a removed export from the package (`npm run typecheck`, A1's pin); L60
      (`test/library/writer-lock.test.ts`), which fails with the lock's in-process check disabled.
      **Done (2026-11-01, `195b8f4`):** the 56 test files that call `startProcess(` take the engine directly (from
      `test/admin/`) or through `test/runner/process-build.ts`; nothing was left to move.
- [x] 8.2 `CHANGELOG.md`'s entry, with its breaking-change warning; the module guide's recipe restored with L54's
      fixture; the guides on running UmbraDB in a host program.
      **Acceptance:** L59 — `test/library-surface/library-documents.test.ts` (the entry's terms, read from design §4
      and §7.2, and the documents' sweep, each with negative controls) and `test/examples/try-module.test.ts` (the
      guide's §17 block is `examples/try-module/try-module.ts`), both seen failing before the documents.
      **Done (2026-11-01, `ce3a707`, `0e0879f`):** the module guide's §17 and §18, the README, the operator guide, the
      roadmap; issue 00053 closed. The entry's place in the `0.10.0` section: questions file Q-14.
- [x] 8.3 L54 from the packed package; A2 still passes.
      **Acceptance:** `npm run test:smoke` passes, its oracle 4d running `examples/try-module/try-module.ts` with
      `node --test` in the scratch project that installed the tarball (seen failing with the test's expected answer
      changed).
      **Done (2026-11-01, `3e920e1`).**
- [x] 8.4 This file.
      **Acceptance:** each task of §0–§8 checked with its criteria and their tests (`openspec/config.yaml`'s rule).
- [x] 8.5 The design amendments the build deferred (questions Q-2, Q-3, Q-6, Q-7, Q-9, Q-10, Q-12, Q-13, and design
      §1's file list) are written as proposed texts in the questions file, for the owner; none is applied to the
      approved change.
      **Acceptance:** each question carries a "Proposed amendment" (file, section, old sentence, new sentence), and
      `git diff` shows no change to `proposal.md`, `design.md`, `acceptance.md` or `specs/` of this change, or to
      `core-arch`.
      **Done (2026-11-01):** in the organizer's questions file (outside this repository), with four new questions and
      their texts: Q-15 (this proposal's status line, still "Approved … No code yet."), Q-16 (design §1's eleven new
      files), Q-17 (`core-arch` design §12's sentence on `--update-hash`), Q-18 (`/config`'s `core` and `entries[]`).
- [x] 8.6 The section's full run.
      **Acceptance:** `npx vitest run` fails only §0's known tests, the load-only flakes of issues 00062 and 00064 (each
      passing alone) and issue 00065's V8 fault; `test/browser/` passes in headless Chrome; `npm run graph:check` exits
      0 after `npm run graph:refresh`.
      **Done (2026-11-01), on a loaded machine (load about 20; 48 and 30 min):** run 1, 6,102 tests — 37 failed: §0's
      20 and A12, and waits that ran out or containers Docker started too slowly (issue 00064's kind, extended; one left
      a container behind, issue 00066), each file passing when run again. Run 2 — 28 failed: §0's 20, seven of issue
      00064's, and A117's second case on PostgreSQL (an open transaction seen while the core waited), which passes alone
      and in every earlier run; its likely cause, admin's fact reads that every engine process now runs, is not
      confirmed (the organizer's question Q-19, for §9). `test/browser/`: 45 tests pass. The graph: the section's
      close.

## 9. Full verification (AGENTS.md stage 3, as far as it runs locally)

- [x] 9.0 A117's oracle (found in 8.6's run 2: an open transaction seen while the core waited).
      **Acceptance:** the cause found, and either the core's waiting path fixed test-first or the oracle rewritten with
      its negative control still failing.
      **Done (2026-11-01, `e2201c8`):** an instrumented count (not committed) showed the session counted was admin's
      short fact read on the core's login, which every engine process runs since 5.3 (a forced 0.4 s read reproduced
      the failure; 80 looks at real waits, quiet and loaded, saw no open transaction; the negative control's block
      transaction is the same `pid` and `xact_start` in all five looks). PP-6 is met. The oracle now counts a
      transaction only when the same one is open in two consecutive looks; the control's assertion is unchanged and
      still failing; three unit cases pin the rule; the file five times, 11 of 11 each (the organizer's question Q-19).
- [x] 9.1 `npm run typecheck`, the full `npx vitest run` and `npm run test:coverage` with every floor met.
      **Acceptance:** typecheck exit 0; the full runs fail only §0's known tests and the known load-only flakes (issues
      00062, 00064, each passing alone), 00065's V8 fault or 00054's PGlite hang; every coverage floor met.
      **Done (2026-11-01):** `npm run typecheck` exit 0. Three full runs of the suite on `e2201c8`/`8cc9754` (the change
      after `e2201c8` is an issue file): plain `npx vitest run` — 6,105 tests, 25 failed (§0's 20; A63 ×2, A64 ×2 of
      issue 00064; A111 on PostgreSQL refused `writer-lock-held` after its restore, added to 00064 in `8cc9754`; the
      three files pass alone), 20.6 min, the load the suite's own (Docker's VM at about 650 % CPU, load average up to
      48); the conformance gate's run (9.2) — exactly §0's 20, 9.7 min; and `npx vitest run --coverage
      --coverage.reportOnFailure=true` (Vitest 4 checks the floors only when every test passed unless that flag is set)
      — §0's 20, and one fork hung inside PGlite (issue 00054, seen again: `bd9a991`), killed by hand. **Coverage:
      every floor met** (no threshold error; each of 209 files checked against `vitest.config.ts`'s floors: none below,
      the tightest `src/private/core-channels.ts` at 85.00 % branches against 85); all files 99.73 % lines, 98.38 %
      branches. `test/browser/` (headless Chrome) passed in each run.
- [x] 9.2 The mutation gate (`npm run test:mutation:ci`, at least 65 % on its targets), the pack smoke, the graph check,
      and `npm run test:conformance`.
      **Acceptance:** the mutation gate passes; `npm run test:smoke` passes; `npm run graph:check` exits 0 after the
      section's refresh; the conformance gate fails only §0's known tests, every required test executed and passed.
      **Done (2026-11-01):** `npm run test:conformance` on `8cc9754` (9.7 min, within its 60 min deadline): 6,105 tests,
      exactly §0's 20 failed, 56 skipped as §0; the required-test reconciliation OK, all 22 required tests executed and
      passed; the gate exits 1 for the 20. `npm run test:mutation:ci` (39.6 min, load about 2): **PASSED, aggregate
      87.37 %** over 3,127 valid mutants (break 65) — `src/modules/graph.ts` 87.80 % (836 valid), `src/runner/dispatch.ts`
      95.80 % (143), `src/config/history.ts` 85.81 % (620; the one target this change touched), `src/determinism/cbor.ts`
      96.85 % (603), `src/determinism/digest.ts` 96.05 % (76), `src/helpers/height-versioned.ts` 74.07 % (54),
      `src/helpers/cursor-table.ts` 78.38 % (37), `src/backbone/core-ledger-state/sweep.ts` 87.11 % (225),
      `src/backbone/core-block-fetch/node-source.ts` 76.36 % (533). `npm run test:smoke`: PASS (A2's consumer of 28
      values and 38 types, the module test of L54 from the installed package, the tape sync on PostgreSQL). `npm run
      bench:smoke` (non-gating): no workload above 10× its baseline. `npm run graph:check` before the section's refresh:
      exit 1, stale (this section's commits), as expected; after the refresh: exit 0 (11.4's step, done for §9 in its
      graph commit).
- [x] 9.3 The acceptance map (`acceptance-map.md`): each of L1 … L68 and the rewritten A-criteria to its test file and
      title, and each `[NEG]` control to the run that shows it failing.
      **Acceptance:** every criterion has its tests; every `[NEG]` criterion its committed control, seen failing; each
      cited title exists in its file and passed.
      **Done (2026-11-01):** `acceptance-map.md`; 339 cited titles, each found in its file's source and each test it
      names passed in 9.2's conformance run (the one skip: A162's PostgreSQL-only case on PGlite, by design). Every
      `[NEG]` criterion has its committed control (passing there, i.e. its oracle failing with the fault put back), and
      where the build put the fault back in the source, the count that failed. No criterion without a test.
- [x] 9.4 What cannot run locally (a CI-only or release-candidate criterion) recorded as pending.
      **Done (2026-11-01):** no acceptance criterion needs CI or a release candidate (L54 runs from the packed tarball
      locally). Pending for CI on the PR head carrying this change: the `test` job (the conformance gate on a hosted
      runner, red on §0's 20 until issues 00059 and 00060 are fixed — the organizer's question Q-1) and the `mutation`
      job of `conformance.yml`; `lean.yml` (needs mathlib; nothing under `Formal/` changed since `d46db79`);
      `supply-chain.yml` (`npm audit`, gitleaks; `package-lock.json`, `.npmrc`, `.gitleaks.toml`, `nix/` unchanged);
      `vendored-ledger.yml` (`vendor/` unchanged); `scan.yaml` (the organization's scan); `pack-smoke.yml`, `graph.yml`
      and `bench-smoke.yml`, whose commands pass here. Definition of done item 5 — the 0.10.0 release checklist's gates
      and the conformance gate on that head (D-9) — stays pending until it runs there.

## 10. Review (AGENTS.md stage 4, bounded)

- [ ] 10.1 The three lanes on the final tree: spec compliance, cold adversarial, release.
- [ ] 10.2 Blocking findings fixed, then one targeted fix check by a reviewer other than the fixer; every finding still
      open recorded for the owner.

## 11. Close-out

- [ ] 11.1 Check off every task above with the criteria it demonstrated, the acceptance map complete.
- [ ] 11.2 Set the proposal's status line to Implemented.
- [x] 11.3 Update `ROADMAP.md`: this change, its entry points and the exported surface (66 names: 28 values, 38
      types).
      **Done (2026-11-01, `ce3a707`):** with the documents of 8.2; the review's status lines are updated at 11.5.
- [ ] 11.4 Run `npm run graph:refresh` and commit `graphify-out/` with the close-out commit; `npm run graph:check`
      exits 0.
- [ ] 11.5 Record in the pull request, per `docs/PULL_REQUEST_CHECKLIST.md`: the reviewed commit, each lane's verdict
      and model id, the fix check, the owner's decisions (the questions file's answers, the design amendments), the
      breaking-change warning, and the CI runs.
