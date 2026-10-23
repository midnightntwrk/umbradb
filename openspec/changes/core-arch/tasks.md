# Tasks — CORE-ARCH: the standalone indexer's core architecture

No implementation code before the stage-1 gate (the cold adversarial review of this spec, its fix check, and the owner's
approval). Then one task at a time, test first: write the tests for the task's criteria, watch them fail for the
intended reason, implement until they pass. One task is one atomic change set; no placeholders, stubs or `TODO`s. After
each task: `npm run typecheck` and `npm test` green, and the task checked here with the criteria it demonstrated.

Order: sections 0–9 build the platform; 10–16 build the chain, ledger, contract, private, snapshot and browser parts on
it; 17 retires the 0.9.5 parts and moves the gates; 18 runs the whole-system checks; 19 closes out.

## 0. Pins and verification

- [ ] 0.1 Pin `@electric-sql/pglite` 0.5.10 and `ws` 8.22.0 (runtime) and `esbuild` 0.28.2 (development) — the
      versions verified by the stage-1 probes (`design.md` §14) — through the supply-chain gate; move `typescript` to
      `dependencies`; keep `zod` 4. Commit the probes as tests (PGlite roles, `SET LOCAL ROLE`, provider functions,
      triggers, `TRUNCATE` refusal, `jsonpath` check; zod metadata; `ws` mutual TLS; esbuild worker bundle).
      **Acceptance:** the probe tests pass in CI; `npm run test:conformance` is green on the unchanged code.
- [ ] 0.2 Vendored ledger builds (`vendor/ledger/`, `design.md` §5.2): pin the v8 release; build v9 and the v8→v9
      conversion (`v8-to-v9-state-translation`, `midnight-ledger` `da96e33d78ee9b7d3867b15c1037510d499cd909`) from one
      aligned v9 version; list each function of `LedgerPackage` the published packages lack and write the patches; make
      the build reproducible and record each SHA-256; add the CI job that rebuilds and compares; run the conversion on
      a v8 test state and compare its result with the node's root at a devnet fork's F.
      **Acceptance:** two runs of `npm run vendor:ledger` give the recorded SHA-256; the conversion's root matches the
      node's at F.
- [ ] 0.3 Tapes: record, with the builder of task 9.2, stagenet 0–10,000, preview 0–10,000 and a preview range across
      the runtime 1.0.300 upgrade, mainnet ranges around 1,774,492 and 1,788,980 (from snapshots), and a local devnet
      that starts on a v8 runtime and enacts the v9 upgrade; read each network's genesis hash, runtime at genesis and
      upgrade boundaries (U and F hashes and `MNSV`) for the built-in tables; publish the tapes as pinned release assets
      with their SHA-256.
      **Acceptance:** each tape replays against the tape node and its SHA-256 matches; the boundary data is recorded
      with its source. (Runs after task 9.2.)

## 1. Determinism primitives

- [ ] 1.1 `src/determinism/cbor.ts`: the canonical encoder of DT-1, `encodeCanonical`, `encodeRow`.
      **Acceptance:** A52, A53 pass.
- [ ] 1.2 Primary-key order and `contentsHash` (DT-2, DT-3), over a database handle.
      **Acceptance:** A54 and A55 pass on both backends (after task 2.2 provides PGlite; until then on PostgreSQL, and
      re-run in 2.2).

## 2. Database API

- [ ] 2.1 `src/db/api.ts` and the PostgreSQL backend (refactored from `src/postgres/client.ts`): writer connection, read
      pool, read handles at one height, result mapping, errors with retryability (`connection-lost`).
      **Acceptance:** A9 (including lossless `jsonb`), A12, A19 pass; A8 passes on PostgreSQL.
- [ ] 2.2 The PGlite backend with its single queue, behind the same API.
      **Acceptance:** A7, A8 (PGlite), A11 including its negative control.
- [ ] 2.3 Roles and `SET LOCAL ROLE`, provider functions (fixed `search_path`, `PUBLIC` revoked), the id pattern and
      schema-name collisions, shared-item schemas, and the `TRUNCATE` refusal.
      **Acceptance:** A13 including its negative control, A14, A15, A73.
- [ ] 2.4 Migrations with checksums (refactored from `src/postgres/migrate.ts`), `core_chain.migrations`, setup after
      migrations, and `requiresResync`.
      **Acceptance:** A16, A72; the refactored `migrate` and `migration-lock-timeout` tests pass or are retired per
      `design.md` §13.
- [ ] 2.5 Writer lock (refactored from `src/postgres/transaction-lease.ts`) and the PGlite operating-system lock
      (`node:sqlite` exclusive transaction); the durability probe moved to `src/db/`.
      **Acceptance:** A17, A18; `durability-probe.test.ts` passes at its new path.
- [ ] 2.6 Write handles and their closing.
      **Acceptance:** A10.

## 3. Modules

- [ ] 3.1 Declaration types, `defineModule`, declaration validation.
      **Acceptance:** A20, A21.
- [ ] 3.2 Graph resolution per height range, Kahn order, mid-chain rule, development-only rule, shared-item providers.
      **Acceptance:** A22, A23, A24, A25.

## 4. Configuration

- [ ] 4.1 `defineConfig`, `coreEntry`, `versionEntry`, the module `entry` builder; the loader; the plain-data check.
      **Acceptance:** A26, A27.
- [ ] 4.2 Schema validation with kinds, defaults and the `core` fields of CF-4; secret redaction helper.
      **Acceptance:** A28; A29 (completed in 8.1).
- [ ] 4.3 `core-chain`'s configuration history: revisions, future-only comparison, `data_hash`, the version check, the
      development opt-in.
      **Acceptance:** A30, A31, A32, A33, A34.
- [ ] 4.4 `umbradb config check` and the `umbradb` command.
      **Acceptance:** A35, A6.

## 5. Runner

- [ ] 5.1 Point dispatch and order within points; parallel waves.
      **Acceptance:** A38.
- [ ] 5.2 The finalized loop over the block-source interface; `InMemoryBlockSource` with its `core-block-commit`
      cursor table; block context and item sink; per-point handles; the chain-data envelope of module API responses.
      **Acceptance:** A36, A37, A39, A40, A41, A49; RN-16 is covered by A75.
- [ ] 5.2a Process items (`ProcessContext.publish`) and module API registration (`ApiRegistry` mounted on `listen.api`,
      WebSocket subscriptions, duplicate routes refused).
      **Acceptance:** A74, A75.
- [ ] 5.3 Revisions and settings; start and stop heights; the upgrade-boundary stop; SIGTERM.
      **Acceptance:** A42, A45, A47, A48.
- [ ] 5.4 Failure handling and the delivery guarantees after restart.
      **Acceptance:** A43, A44, A46.

## 6. Storage helpers

- [ ] 6.1 Cursor table (refactored from `src/postgres/watermarks.ts`); P9 retargeted.
      **Acceptance:** A59.
- [ ] 6.2 Height-versioned table (refactored from `src/postgres/temporal-kv.ts`).
      **Acceptance:** A60, A61.

## 7. Digests

- [ ] 7.1 Change capture (shadow tables and triggers) and `core-digest`; the non-deterministic-column check and the
      `jsonb` number `CHECK`.
      **Acceptance:** A56 including its negative control, A57, A58.

## 8. Admin endpoints

- [ ] 8.1 The admin server in its own worker thread reading the runner's published state, the main-thread heartbeat,
      states and conditions, readiness with its precedence, `/status` and `/config` with their JSON schemas, redaction
      and sanitized errors.
      **Acceptance:** A62, A63, A64, A65, A66, A67, A29.

## 9. Test tape

- [ ] 9.1 Tape reader and writer (including `delayMs`); the tape node.
      **Acceptance:** A68, A69, A70.
- [ ] 9.2 The recording builder and the variant transforms.
      **Acceptance:** A71 (`[CI]` part); the `[MANUAL]` record-and-replay against a real node is recorded for the PR.

## 10. Node client and ingest

- [ ] 10.1 The node client (refactored from `chain-archive-sync/node-rpc-client.ts`): JSON-RPC over WebSocket,
      subscriptions, reconnect, timeouts, back-off; delete `chain-archive-sync/indexer-client.ts`.
      **Acceptance:** A83 (`[STATIC]` part); the refactored node-client tests pass.
- [ ] 10.2 `core-chain` (identity, bootstrap, startup checks) and `core-block-commit` (the `blocks` table from the
      `chain_archive` store, keeping range partitioning).
      **Acceptance:** A77, A78, A88, A90.
- [ ] 10.3 `core-block-fetch`: finalized processing, the finalized prefetch, the best-block queue with branch switches,
      block 0's fetch path.
      **Acceptance:** A76, A79, A80, A81, A83, A89.
- [ ] 10.4 Error handling, retries and halts; recovery after an uncertain COMMIT; the refusal and halt registry.
      **Acceptance:** A84, A85, A86, A87.

## 11. Chain data

- [ ] 11.1 `core-chain-events`, `core-block-parsed`, `core-tx-results`.
      **Acceptance:** A91, A92, A93.

## 12. Ledger

- [ ] 12.1 The `LedgerPackage` adapters for v8 (from `chain-archive-sync/tx-replay-decoder.ts`) and v9; the adapter test
      suite.
      **Acceptance:** A98.
- [ ] 12.2 Version selection, the built-in tables (`networks.json`, from task 0.3), pins, package identity checks,
      metadata selection at upgrades.
      **Acceptance:** A94, A95, A96, A97.
- [ ] 12.3 The ledger worker and the node-store bridge; `core-ledger-state` apply, replay rules, block 0's ledger path,
      root check, outputs.
      **Acceptance:** A82, A99, A101, A106, A107.
- [ ] 12.4 Storage of the ledger state, restart, retention, contract-key persistence, the v8→v9 conversion.
      **Acceptance:** A100, A102, A103, A104.
- [ ] 12.5 The fixed-budget mark-and-sweep.
      **Acceptance:** A105 including its negative control.
- [ ] 12.6 Ledger tasks and the plain-data `block-parsed` (`runLedgerWorker`, the host's worker entry, the
      structured-clone check).
      **Acceptance:** A137.

## 13. Contract data

- [ ] 13.1 `core-contract-states`; `core-contract-logs-full`; `core-contract-logs-fast`; the shared `contract-logs`
      item.
      **Acceptance:** A108, A109, A110, A111.

## 14. Private processes

- [ ] 14.1 The private backbone (`core-private-source`, `core-key-registry`), binding, block intake.
      **Acceptance:** A112, A113, A114, A116.
- [ ] 14.2 The process transport and its messages; opt-in mutual TLS.
      **Acceptance:** A115, A121.
- [ ] 14.3 Lockstep and the behind-instance refusal.
      **Acceptance:** A117, A118.
- [ ] 14.4 The key API, test keys, privacy checks, the private-snapshot refusal.
      **Acceptance:** A119, A120, A122, A123.

## 15. Snapshots

- [ ] 15.1 Export (command and at stop) and the file format.
      **Acceptance:** A124, A125.
- [ ] 15.2 Import in place with its checks, the import marker and the final identity transaction.
      **Acceptance:** A126, A127, A128.

## 16. Browser

- [ ] 16.1 The browser build (page, core, ledger and private workers, PGlite, Web Locks, snapshot picker) and its
      headless-Chrome tests in CI.
      **Acceptance:** A129, A130, A131, A132.

## 17. Library surface and gates

- [ ] 17.1 Move TransactionHistory and its tests to `legacy/transaction-history/`, excluded from build, package and run.
      **Acceptance:** A3.
- [ ] 17.2 Remove the retired parts, the `chain_archive` store, `chain-archive-sync`, their tests, the Lean modules,
      benchmarks, manifest ids, coverage floors and mutation targets exactly as listed in `design.md` §13, and update
      the aggregators it lists; mark the retired laws in `Formal/STORAGE_ALGEBRA.md` and the roadmaps; set
      `openspec/changes/v1.1.0-quint-model-checking`'s status to Archived with the reason; remove the `archive:sync`
      script.
      **Acceptance:** A5; `lake build --wfail` and the trust audit pass; `npm run test:mutation:ci` passes at break 65
      on the new targets.
- [ ] 17.3 `src/index.ts` with exactly the §12 surface; the surface pin; the `umbradb` command; the pack smoke rewritten
      (§12 imports, the retired-name failure, a tape sync on PostgreSQL in Docker, `umbradb config check`); the bench
      smoke retargeted with a fresh baseline; `typedoc.json` entry points.
      **Acceptance:** A1, A2, A6; `npm run test:smoke` passes.
- [ ] 17.4 Version `0.10.0` and the breaking-change notice in `CHANGELOG.md`.
      **Acceptance:** A4.

## 18. Whole-system faults, differentials and measurements

- [ ] 18.1 The crash worker retargeted to the runner (harness ids 1–4 kept); the crash sweep with test modules and its
      negative control; the restart-20 and cross-backend differential.
      **Acceptance:** A50, A51; required ids 1–4 pass.
- [ ] 18.2 The full-core runs: stagenet and preview 0–10,000 from genesis; the full-core crash sweep and its negative
      control; the three-backend comparison.
      **Acceptance:** A133, A134, A135.
- [ ] 18.3 The ingest benchmark against the official indexer (`bench/ingest-vs-official/`), recorded in the PR.
      **Acceptance:** A136.
- [ ] 18.4 Add the 23 ids of `acceptance.md` §17 to the manifest and set the pinned count to 27.
      **Acceptance:** `npm run test:conformance` passes with every required id reported passed in its file.

## 19. Close-out

- [ ] 19.1 Check off every task above with the criteria it demonstrated; map every acceptance criterion to its test in
      the pull request.
- [ ] 19.2 Set the proposal's status line to Implemented.
- [ ] 19.3 Update `ROADMAP.md`: this change, the new architecture, and the "36 symbols" statements at `ROADMAP.md:455`
      and `docs/v1-implementation-guideline.md:194`.
- [ ] 19.4 Run `npm run graph:refresh` and commit `graphify-out/` with the close-out commit; `npm run graph:check`
      exits 0.
- [ ] 19.5 Record in the pull request, per `docs/PULL_REQUEST_CHECKLIST.md`: the reviewed commit, each lane's verdict
      and model id, the fix check, the owner's decisions (including the approval of `design.md` §13), the
      `[MANUAL]` evidence (A71, A136), and the CI runs.
