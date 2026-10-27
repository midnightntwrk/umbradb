# Graph Report - UmbraDB

## Corpus Check
- 979 files · ~1,448,540 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10430 nodes · 30228 edges · 345 communities (308 shown, 37 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2441 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `a25423c7cdc4a1f0` (979 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- ModuleDeclaration
- fetch-fixtures.ts
- validation.ts
- Lockstep
- test/postgres/setup.ts
- browser/build.ts
- mapping.ts
- failures.ts
- vitest
- private/lockstep-wait.test.ts
- sigterm.test.ts
- crash.test.ts
- Buffer
- lockstep-refusals.test.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- range.test.ts
- fixtures/configuration.ts
- ModuleApi
- ref_node_url
- PgliteDatabase
- ProcessContexts
- cbor.property.test.ts
- NodeClient
- digest.test.ts
- migrate.test.ts
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- postgres/transaction-history-storage.ts
- TransactionHistoryEntry
- block-fetch-decode.test.ts
- client.test.ts
- node-bridge.ts
- attempt
- pglite-writer.worker.ts
- package-identity.test.ts
- 1. Determinism primitives
- validate.test.ts
- version-table.ts
- recovery.test.ts
- key-handling-checks.ts
- PortSocket
- transaction-history-storage.property.test.ts
- ledger-checks.ts
- commit-proxy.ts
- TapeNode
- JsonValue
- core-transport.ts
- shims.test.ts
- core-private-source.test.ts
- halts.test.ts
- read-height.property.test.ts
- ref_node_child_process
- ws-mutual-tls.test.ts
- Storage Types — reference for formalization
- statementsOf
- backup/restore.ts
- ChromeTab
- pglite-timeouts.test.ts
- browser-harness.ts
- chrome.ts
- Design — Sprint 1: project setup + TemporalKV
- .from
- no-indexer-or-wallet-sdk.test.ts
- worker-threads.test.ts
- midnight-env — reproducible PREPROD dev environment
- Session
- history.property.test.ts
- admin-harness.ts
- core-block-commit.test.ts
- component-table.test.ts
- transport-intake.test.ts
- worker-threads-worker.ts
- Worker
- change-capture.ts
- RuntimeMetadata
- stop-heights.test.ts
- Writer
- runner/process.ts
- sha256
- postgres-image.test.ts
- chain-placement.test.ts
- upgrade-boundary.test.ts
- stats.ts
- page-server.ts
- node-format.ts
- type-check.ts
- ingest-crash.worker.ts
- checkParent
- builder.test.ts
- items.ts
- .slowBlock
- binding.test.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- ledger/types.ts
- UmbraError
- core-ledger-state.ts
- exitWithin
- ref_node_fs
- FinalizedLoop
- pglite.ts
- SignalSource
- CliBackend
- https.ts
- NodeFS
- LedgerPackage
- Database
- DropsHeld
- NoRedelivery
- column-rules.ts
- builds.ts
- changes.property.test.ts
- cbor.ts
- ledger-storage-checks.ts
- tape/index.ts
- ledger-sweep.test.ts
- NodeBlockSource
- PgTransactionHistoryStorage
- core-block-parsed.ts
- spawnChild
- config/history.ts
- history.test.ts
- column-refusals.test.ts
- loop.test.ts
- slow-block-harness.ts
- .value
- column-rules.test.ts
- range.ts
- writer-lock-checks.ts
- startProcess
- api-server.ts
- graph.ts
- ledger-storage.test.ts
- core-settings.ts
- BlockRef
- version-checks.ts
- page.ts
- ProcessAdmin
- interfaces/transaction-history-storage.ts
- checkShape
- retirement.test.ts
- net.test.ts
- chain-process.test.ts
- module-tables.ts
- api-server.test.ts
- durability-probe.test.ts
- browser.test.ts
- chain-events-decode.test.ts
- networks.ts
- declaration.ts
- pg-tx-history-adapter.ts
- contract-modules.test.ts
- process-worker.ts
- boundary.test.ts
- order.property.test.ts
- adapter-fixtures.ts
- containers.test.ts
- InMemoryBlockSource
- core-chain-events.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- 5. Runner
- Process
- code-registry.ts
- PrivateTransport
- ADDED Requirements
- migrations
- Problem
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- cold-boot-recovery.integration.test.ts
- .concat
- T
- mapping.test.ts
- decode
- referenceMergeEntries
- UmbraDB 1.0.0 Release Contracts
- ADDED Requirements
- mutation-per-adapter.mjs
- twox.ts
- Full-Chain Storage
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- pack-install.mjs
- path.ts
- Performance — design
- read-only-checks.ts
- fresh-instance.mjs
- leanProblems
- history
- fn
- code
- version
- .put
- graph.py
- table
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- chain_archive lineage
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB
- stryker.conf.json
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — Sprint 4: Watermarks
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- Design — v1.1.0: Quint model checking
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- Security policy & threat model
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- Checkpoint-store composition contract — cursor ordering and replay
- Storage Algebra Lean M3a Watermarks Sprint
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Our Pledge
- Midnight infra verification checklist
- Backups
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond
- 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- bug-report.md
- feature-request.md
- GC architecture and query-tracing: research findings
- manifest.json
- 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- peerDependenciesMeta
- repository
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bin
- post-block-update/oracle/run.sh
- state-trees/oracle/run.sh
- v8/build.sh
- v9/build.sh
- v9-rc3/build.sh
- vendor-ledger.sh
- workerData
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 302 edges
2. `UmbraError` - 295 edges
3. `ModuleDeclaration` - 161 edges
4. `FinalizedLoop` - 118 edges
5. `InMemoryBlockSource` - 101 edges
6. `NodeClient` - 100 edges
7. `Database` - 97 edges
8. `BlockRef` - 93 edges
9. `ReadHandle` - 84 edges
10. `5. Runner` - 75 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (345 total, 37 thin omitted)

### Community 0 - "ModuleDeclaration"
Cohesion: 0.02
Nodes (188): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdminOptions, RevisionSettings, AdminStarter (+180 more)

### Community 1 - "fetch-fixtures.ts"
Cohesion: 0.03
Nodes (176): BlockParsed, BlockParsedOptions, ChainEvent, NodeCallOptions, ProcessCondition, itemsSeen, BlockSpec, EventSpec (+168 more)

### Community 10 - "validation.ts"
Cohesion: 0.03
Nodes (103): HistoryRule, SchemaWriteHandle, AppliedMigration, AppliedRow, MigrationPart, Runnable, Settling, Difference (+95 more)

### Community 100 - "Lockstep"
Cohesion: 0.10
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 101 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 102 - "browser/build.ts"
Cohesion: 0.09
Nodes (24): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+16 more)

### Community 103 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 106 - "failures.ts"
Cohesion: 0.11
Nodes (22): ConfigFinding, HistoryFinding, Finding, ProcessReason, ReasonCode, Unwrapped, StatusFacts, configurationRefused() (+14 more)

### Community 11 - "vitest"
Cohesion: 0.03
Nodes (70): Settings, Case, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer (+62 more)

### Community 111 - "private/lockstep-wait.test.ts"
Cohesion: 0.12
Nodes (18): Report, ExpectedWait, ReportRelay, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf() (+10 more)

### Community 112 - "sigterm.test.ts"
Cohesion: 0.10
Nodes (22): Job, WorkerEvent, WORKER, WorkEvent, WorkOptions, A48Observation, WORKER, Job (+14 more)

### Community 113 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 114 - "Buffer"
Cohesion: 0.10
Nodes (18): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+10 more)

### Community 116 - "lockstep-refusals.test.ts"
Cohesion: 0.15
Nodes (21): TestDatabase, privateCursorHeight(), bindingIn(), createdIn(), a118Problems(), a118Run(), coreOn(), haltOf() (+13 more)

### Community 117 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 118 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 119 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 12 - "range.test.ts"
Cohesion: 0.03
Nodes (76): ConnectSocket, FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+68 more)

### Community 120 - "fixtures/configuration.ts"
Cohesion: 0.12
Nodes (19): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration() (+11 more)

### Community 121 - "ModuleApi"
Cohesion: 0.12
Nodes (16): ModuleApiServer, ModuleApiStart, StartedModuleApi, ModuleApiStart, ApiRoutes, ApiStartup, ModuleApi, ModuleApiOptions (+8 more)

### Community 124 - "ref_node_url"
Cohesion: 0.08
Nodes (19): Upstream, ReportedTest, filesUnder(), patchesOf(), patchText(), check, checker, env (+11 more)

### Community 126 - "PgliteDatabase"
Cohesion: 0.17
Nodes (6): JobQueue, PgliteDatabase, handleClosed(), failedEarlier(), nestedCall(), openOn()

### Community 127 - "ProcessContexts"
Cohesion: 0.11
Nodes (6): ProcessContexts, ProcessItems, names(), providesProcessItem(), configOf(), startChain()

### Community 128 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (24): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+16 more)

### Community 13 - "NodeClient"
Cohesion: 0.05
Nodes (73): NodeSourceOptions, CoreChainBinding, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+65 more)

### Community 132 - "digest.test.ts"
Cohesion: 0.12
Nodes (23): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+15 more)

### Community 133 - "migrate.test.ts"
Cohesion: 0.12
Nodes (18): SchemaItem, MigrationRow, PartOptions, TestPart, state(), migrationRows(), storedRows(), exists() (+10 more)

### Community 135 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.10
Nodes (17): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+9 more)

### Community 136 - "postgres/transaction-history-storage.ts"
Cohesion: 0.13
Nodes (18): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow() (+10 more)

### Community 137 - "TransactionHistoryEntry"
Cohesion: 0.16
Nodes (7): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 139 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 14 - "client.test.ts"
Cohesion: 0.03
Nodes (63): Connection, NodeClientOptions, NodeRetry, NodeSocket, NodeSocketEvents, NodeTimers, Answer, FakeNode (+55 more)

### Community 140 - "node-bridge.ts"
Cohesion: 0.14
Nodes (17): BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 143 - "attempt"
Cohesion: 0.09
Nodes (22): Write, Version, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel (+14 more)

### Community 144 - "pglite-writer.worker.ts"
Cohesion: 0.16
Nodes (17): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor() (+9 more)

### Community 145 - "package-identity.test.ts"
Cohesion: 0.15
Nodes (19): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, text(), checkPackageFiles(), manifestSha256(), mismatch() (+11 more)

### Community 146 - "1. Determinism primitives"
Cohesion: 0.16
Nodes (20): CaptureState, capturedTables(), describeTables(), refuseNonDeterministic(), catalogRelations(), catalogTables(), compareUtf8(), schemaFilter() (+12 more)

### Community 15 - "validate.test.ts"
Cohesion: 0.03
Nodes (93): coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+85 more)

### Community 150 - "version-table.ts"
Cohesion: 0.18
Nodes (20): LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable() (+12 more)

### Community 151 - "recovery.test.ts"
Cohesion: 0.16
Nodes (20): LockstepCondition, ProcessStatus, Q142Observation, A118Observation, MismatchObservation, WaitSample, A43Observation, Fault (+12 more)

### Community 152 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 153 - "PortSocket"
Cohesion: 0.16
Nodes (8): PortSocket, params(), 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix, Contract states and contract logs, Process items and APIs

### Community 154 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (15): Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS, goodLeaf (+7 more)

### Community 156 - "ledger-checks.ts"
Cohesion: 0.24
Nodes (18): LedgerEvent, TransactionResult, VmLog, ledgerItemsSeen, a106Problems(), a107Problems(), a99Problems(), blockZeroProblems() (+10 more)

### Community 157 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 158 - "TapeNode"
Cohesion: 0.18
Nodes (3): TapeClock, TapeNode, SYSTEM_CLOCK

### Community 159 - "JsonValue"
Cohesion: 0.12
Nodes (17): JsonValue, 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file) (+9 more)

### Community 16 - "core-transport.ts"
Cohesion: 0.04
Nodes (92): Session, TransportLimits, TransportTls, Committed, Hello, Message, MessageFault, MessageType (+84 more)

### Community 164 - "shims.test.ts"
Cohesion: 0.18
Nodes (11): databaseTarget, PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS (+3 more)

### Community 17 - "core-private-source.test.ts"
Cohesion: 0.04
Nodes (56): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, SourceTransport, PublicConfiguration, PublicDatabase, PublicSideOptions (+48 more)

### Community 171 - "halts.test.ts"
Cohesion: 0.15
Nodes (13): A43Case, Outcome, a43Entries(), a43Problems(), a43Run(), failingAt(), "on-fetch"(), showOutcome() (+5 more)

### Community 172 - "read-height.property.test.ts"
Cohesion: 0.17
Nodes (11): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+3 more)

### Community 173 - "ref_node_child_process"
Cohesion: 0.15
Nodes (10): BenchEnv, main(), pauseUntilKilled(), requireEnv(), end(), removeContainers(), PG_SETTINGS, filters (+2 more)

### Community 175 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 176 - "Storage Types — reference for formalization"
Cohesion: 0.12
Nodes (15): Key, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec (+7 more)

### Community 179 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 18 - "backup/restore.ts"
Cohesion: 0.04
Nodes (87): PublicIdentity, BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow (+79 more)

### Community 181 - "pglite-timeouts.test.ts"
Cohesion: 0.17
Nodes (12): Run, Job, WorkerEvent, expectNeverCutOffNorHung(), settings(), apiRead(), engine(), report() (+4 more)

### Community 184 - "browser-harness.ts"
Cohesion: 0.27
Nodes (13): ProcessName, backupThrough(), call(), eventsOf(), eventWhen(), logOf(), pageWhen(), restoreThrough() (+5 more)

### Community 185 - "chrome.ts"
Cohesion: 0.23
Nodes (11): Cdp, CdpEvent, Download, PageRequest, chrome(), chrome(), chromePath(), chromeVersion() (+3 more)

### Community 186 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.15
Nodes (13): Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4a. Error translation (`src/postgres/errors.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV (+5 more)

### Community 19 - ".from"
Cohesion: 0.03
Nodes (77): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+69 more)

### Community 191 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 192 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 196 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 198 - "Session"
Cohesion: 0.22
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 199 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 2 - "admin-harness.ts"
Cohesion: 0.03
Nodes (155): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer, AdminSnapshot (+147 more)

### Community 20 - "core-block-commit.test.ts"
Cohesion: 0.03
Nodes (70): BlockWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, BlockContext, Migration (+62 more)

### Community 200 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 201 - "transport-intake.test.ts"
Cohesion: 0.23
Nodes (4): PrivateSeen, A114Observation, A116Observation, TransportProxy

### Community 203 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 21 - "change-capture.ts"
Cohesion: 0.04
Nodes (69): CapturedTable, GuardTableRow, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, optOut (+61 more)

### Community 211 - "RuntimeMetadata"
Cohesion: 0.21
Nodes (3): RuntimeMetadata, OwnStateMetadata, hexOf()

### Community 212 - "stop-heights.test.ts"
Cohesion: 0.21
Nodes (6): ProcessingEnd, RunObservation, a45Problems(), anyAbove(), at(), POINTS

### Community 22 - "runner/process.ts"
Cohesion: 0.03
Nodes (65): Bound, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait, WaitingListener, LoadOptions, RetryCode (+57 more)

### Community 221 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 229 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 23 - "chain-placement.test.ts"
Cohesion: 0.05
Nodes (64): LoadLedger, TransactionParser, LedgerName, LedgerTask, NodeStore, ParsedTransaction, StateHandle, AppliedState (+56 more)

### Community 230 - "upgrade-boundary.test.ts"
Cohesion: 0.33
Nodes (9): A47Observation, a47Problems(), a47Run(), big(), buildOf(), moduleM(), moduleN(), BOUNDARY (+1 more)

### Community 231 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 232 - "page-server.ts"
Cohesion: 0.28
Nodes (6): BrowserBuild, pageBench, PageServer, servePage(), ISOLATION_HEADERS, TYPES

### Community 24 - "node-format.ts"
Cohesion: 0.05
Nodes (59): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+51 more)

### Community 240 - "type-check.ts"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 241 - "ingest-crash.worker.ts"
Cohesion: 0.28
Nodes (8): CrashEvent, CrashJob, report(), tipWriter(), handle, job, orphanGuard, poll

### Community 245 - "checkParent"
Cohesion: 0.32
Nodes (7): AlwaysLanded, checkParent(), sameBytes(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 25 - "builder.test.ts"
Cohesion: 0.04
Nodes (40): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step, Frame (+32 more)

### Community 251 - "items.ts"
Cohesion: 0.32
Nodes (6): BlockHeaderItem, BodyExtrinsic, BlockBody, BlockItemSource, CoreBlockHeader, CoreBlockItems

### Community 26 - "binding.test.ts"
Cohesion: 0.05
Nodes (71): PrivateIntakeOptions, PrivateBackend, A113Observation, A156Observation, Binding, Created, Outcome, PrivateOptions (+63 more)

### Community 262 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 27 - "ledger/types.ts"
Cohesion: 0.04
Nodes (66): LoadAdapter, ApplyInput, ApplyOutput, ChainOutcome, LedgerPackageOptions, StateSummary, V9Logs, CallTx (+58 more)

### Community 28 - "UmbraError"
Cohesion: 0.04
Nodes (66): LoadedConfig, LoadOptions, PostgresOptions, ReadOptions, ReadTimeoutSetting, StartupInput, MultiStatementRunner, BlockWrites (+58 more)

### Community 29 - "core-ledger-state.ts"
Cohesion: 0.04
Nodes (65): ContractStateRow, CoreContractStatesOptions, CoreLedgerStateOptions, LedgerStateItem, retainedStates, CoreRevision, GreyPicker, ContractKeys (+57 more)

### Community 3 - "ref_node_fs"
Cohesion: 0.03
Nodes (126): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, RestoreCommandSeams, RestoreOutcome, BackupBackend (+118 more)

### Community 30 - "FinalizedLoop"
Cohesion: 0.05
Nodes (22): Activity, FinalizedLoop, UnexpectedCursor, Startup, SkipsLockstep, SkipsUnseen, WaitsInTransaction, WaitingInRead (+14 more)

### Community 31 - "pglite.ts"
Cohesion: 0.05
Nodes (60): ConfiguredDatabase, ConfiguredDatabaseOptions, DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight (+52 more)

### Community 32 - "LedgerPackage"
Cohesion: 0.05
Nodes (39): LedgerPackage, LedgerEngine, stagenetReplay, inThreadLogReader(), hexOf(), idOf(), same(), sameBytes() (+31 more)

### Community 33 - "Database"
Cohesion: 0.05
Nodes (53): Database, ReadOnlyDatabase, SchemaPlan, ResolvedGraph, LoopInput, MisuseListener, PublishRefusal, Committed (+45 more)

### Community 34 - "column-rules.ts"
Cohesion: 0.04
Nodes (70): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+62 more)

### Community 35 - "builds.ts"
Cohesion: 0.06
Nodes (50): SessionSeen, PrivateProcess, PrivateRefusal, A162Options, a162Run, HeaderSeen, Pause, InstancesOptions (+42 more)

### Community 37 - "changes.property.test.ts"
Cohesion: 0.05
Nodes (56): Chain, ChainOptions, DigestRow, Op, States, TableName, captured(), moduleM() (+48 more)

### Community 38 - "cbor.ts"
Cohesion: 0.07
Nodes (54): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+46 more)

### Community 39 - "ledger-storage-checks.ts"
Cohesion: 0.07
Nodes (58): RetainedState, TableSnapshot, FixtureNode, FakeState, coreLedgerState(), retainedStatesOf(), writeSweep(), a100Problems() (+50 more)

### Community 4 - "tape/index.ts"
Cohesion: 0.03
Nodes (121): Recorded, Failure, Variant, Link, TapeBuilderOptions, RecordingError, RecordingProblem, TapeError (+113 more)

### Community 40 - "ledger-sweep.test.ts"
Cohesion: 0.06
Nodes (31): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, ChildReader, NodeBatch, Block (+23 more)

### Community 42 - "NodeBlockSource"
Cohesion: 0.08
Nodes (18): BlockLedgerSource, HeadWait, NodeBlockSource, Prefetch, LedgerBinding, NodeSubscription, NodeHeader, PreparedBlock (+10 more)

### Community 43 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (53): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order) (+45 more)

### Community 44 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (54): ChainTransaction, EventPhase, ledgerVersionOf(), decodeExtrinsics(), blockBodyOf(), blockParsedOf(), chainHashOf(), coreBlockParsedOnParse() (+46 more)

### Community 45 - "spawnChild"
Cohesion: 0.05
Nodes (47): ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, heldPort(), startChild() (+39 more)

### Community 46 - "config/history.ts"
Cohesion: 0.08
Nodes (49): CoreVersion, CoreSettings, HistoryCode, HistoryContext, ProvidesRow, Span, SettingsSchema, errorCode() (+41 more)

### Community 47 - "history.test.ts"
Cohesion: 0.06
Nodes (47): Simulation, Start, Case, canonicalJson(), builtWith100(), deletesOnly(), failingSecondWrite(), m() (+39 more)

### Community 48 - "column-refusals.test.ts"
Cohesion: 0.06
Nodes (26): CheckedMigration, DeterminismBackend, TestDatabase, TestServer, Backend, Case, freshDatabase(), hashOf() (+18 more)

### Community 5 - "loop.test.ts"
Cohesion: 0.03
Nodes (115): Transaction, EntryRange, HeightFailure, HeightRun, LockstepWait, LoopEnd, SlowBlockEvent, SkipsAfterReconnect (+107 more)

### Community 50 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (45): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+37 more)

### Community 51 - ".value"
Cohesion: 0.12
Nodes (30): ExtrinsicCall, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, TypeDef, ScaleError, ScaleReader (+22 more)

### Community 52 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+24 more)

### Community 53 - "range.ts"
Cohesion: 0.06
Nodes (48): Arguments, Command, CompletenessRange, Final, Height, RangeStats, Params, ConnectionFrames (+40 more)

### Community 54 - "writer-lock-checks.ts"
Cohesion: 0.10
Nodes (39): WriterProcess, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf() (+31 more)

### Community 55 - "startProcess"
Cohesion: 0.09
Nodes (39): testBuild, A42Observation, Seen, Phase, a77Run(), a78Run(), a90Run(), chainProcess() (+31 more)

### Community 56 - "api-server.ts"
Cohesion: 0.06
Nodes (35): Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, answerHead(), coreHeaders(), coreHeadersResponse(), errorMessage() (+27 more)

### Community 57 - "graph.ts"
Cohesion: 0.08
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 6 - "ledger-storage.test.ts"
Cohesion: 0.04
Nodes (126): ContractLog, CoreContractLogsFullOptions, LogEventType, contractScenario, ContractScenarioOptions, LogLine, Program, Ran (+118 more)

### Community 60 - "core-settings.ts"
Cohesion: 0.06
Nodes (40): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys (+32 more)

### Community 61 - "BlockRef"
Cohesion: 0.07
Nodes (16): QueuedBlock, BlockItems, BlockRef, InMemorySourceOptions, CommitOutcome, HeldHeight, EventsRunner, Fetching (+8 more)

### Community 62 - "version-checks.ts"
Cohesion: 0.12
Nodes (31): MetadataBlock, MetadataNode, RuntimeMetadataEntry, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata (+23 more)

### Community 63 - "page.ts"
Cohesion: 0.06
Nodes (35): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, Scope, CallMethod, FromProcessWorker (+27 more)

### Community 64 - "ProcessAdmin"
Cohesion: 0.07
Nodes (28): ProcessAdmin, Heartbeat, recordedHistory(), writerLockHeld(), refused(), beat(), 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence (+20 more)

### Community 65 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.06
Nodes (28): EntryContent, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+20 more)

### Community 66 - "checkShape"
Cohesion: 0.07
Nodes (35): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), 6. Determinism (+27 more)

### Community 68 - "retirement.test.ts"
Cohesion: 0.07
Nodes (39): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), manifestProblems(), mutationProblems() (+31 more)

### Community 69 - "net.test.ts"
Cohesion: 0.08
Nodes (22): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortUpgrade (+14 more)

### Community 7 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (100): adminRoutes, AdminEndpoint, AdminPart, AdminView, ChainView, DeclarationView, InstanceStatus, ItemView (+92 more)

### Community 72 - "module-tables.ts"
Cohesion: 0.09
Nodes (33): openedProcess, CaptureColumn, ModuleColumn, ModuleContentsError, ModuleTable, ModuleTableOptions, PageOptions, ConsistentRead (+25 more)

### Community 74 - "api-server.test.ts"
Cohesion: 0.09
Nodes (29): ChainDataAnswer, HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, AppendsVersion, Client, VersionsAnswersOnly (+21 more)

### Community 75 - "durability-probe.test.ts"
Cohesion: 0.08
Nodes (34): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, Outcome, WriterSession, WriterStart (+26 more)

### Community 77 - "browser.test.ts"
Cohesion: 0.08
Nodes (38): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+30 more)

### Community 78 - "chain-events-decode.test.ts"
Cohesion: 0.11
Nodes (28): Field, Registry, fill(), hexOf(), le(), merge(), metadataWith(), rotl() (+20 more)

### Community 79 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 8 - "declaration.ts"
Cohesion: 0.03
Nodes (98): EntryBuilder, ReadHandle, ApiRegistry, BlockHeader, DefinedModule, FieldKind, FieldSchema, ItemDeclaration (+90 more)

### Community 81 - "pg-tx-history-adapter.ts"
Cohesion: 0.08
Nodes (25): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys(), describeStatusValue() (+17 more)

### Community 84 - "contract-modules.test.ts"
Cohesion: 0.08
Nodes (28): BlockTransaction, CoreContractLogsFastOptions, UnsureLog, FastLogReader, LogSite, Program, UnsureReason, V9Raw (+20 more)

### Community 86 - "process-worker.ts"
Cohesion: 0.11
Nodes (27): crossedError, privateIntake, RunOptions, RunSeams, ProcessHandle, NodeRunResult, adminAnswer(), messageAdmin() (+19 more)

### Community 88 - "boundary.test.ts"
Cohesion: 0.14
Nodes (32): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+24 more)

### Community 89 - "order.property.test.ts"
Cohesion: 0.09
Nodes (32): PointRun, Recorder, CheckName, GraphSpec, ModuleSpec, Pipeline, TESTED, byBytes() (+24 more)

### Community 9 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (101): StoredNode, DeployTx, Upstream, contractFixture, RawPackage, AdapterWorkerHost, Decimal, Fullness (+93 more)

### Community 90 - "containers.test.ts"
Cohesion: 0.09
Nodes (24): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers() (+16 more)

### Community 92 - "InMemoryBlockSource"
Cohesion: 0.08
Nodes (16): InMemoryBlockSource, Failing, Flaky, Flaky, TickerProcess, RestoreJob, Broken, Lost (+8 more)

### Community 94 - "core-chain-events.ts"
Cohesion: 0.09
Nodes (27): BlockEventSource, MetadataField, MetadataVariant, Primitive, RuntimeMetadataView, RecordTypes, ScaleValue, boundEventSource() (+19 more)

### Community 95 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.06
Nodes (33): Absent, 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 1. Executive conclusion, 2.1 Historical implementation baseline (+25 more)

### Community 96 - "5. Runner"
Cohesion: 0.13
Nodes (28): Callback, EntryBoundary, ParallelPoint, PointSchedule, SlowWindow, SlowBlockCondition, SkipsStartAtRestart, StartsAtEveryRevision (+20 more)

### Community 97 - "Process"
Cohesion: 0.14
Nodes (5): CoreTransport, StartedModuleApi, Process, startModuleApi(), messageOf()

### Community 98 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 99 - "PrivateTransport"
Cohesion: 0.12
Nodes (10): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), readFailure(), reject(), resolve() (+2 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 141 - "migrations"
Cohesion: 0.09
Nodes (20): migrations(), 4.3 `transactions` — metadata only, raw bytes via blob reference, 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Migrations, Requirement: DB-9 Bootstrap, migrations and setup, Scenario: A changed migration refuses startup, Scenario: The second of two migrations fails, 6. Storage helpers (+12 more)

### Community 267 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 104 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.07
Nodes (26): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data (+18 more)

### Community 108 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.14
Nodes (16): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), registerSuiteLifecycle(), startTestDatabase(), stopTestDatabase(), EXPECTED_NIGHT_VALUE (+8 more)

### Community 122 - ".concat"
Cohesion: 0.07
Nodes (23): probe(), records, 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline (+15 more)

### Community 123 - "T"
Cohesion: 0.09
Nodes (23): n(), T(), input(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 4. Transaction / Lease — the control algebra the other three run inside, 5. Testable-law deliverable (fast-check + Vitest) (+15 more)

### Community 142 - "mapping.test.ts"
Cohesion: 0.11
Nodes (11): mapRows(), mapValue(), parseJsonLossless(), oid(), identity(), RESULT_COLUMNS, RFC-3339, 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug (+3 more)

### Community 148 - "decode"
Cohesion: 0.11
Nodes (20): decode(), Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Scenario: A future-versioned envelope is rejected cleanly, Scenario: An unknown top-level field is rejected as a typed envelope error (F7), Scenario: Non-JSON bytes are rejected as a typed envelope error, Scenario: Structurally invalid JSON is rejected as a typed envelope error, 0. Specification freeze (+12 more)

### Community 167 - "referenceMergeEntries"
Cohesion: 0.13
Nodes (16): referenceMergeEntries(), 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 3.1 Field mapping (write path), 3.2 Lifecycle-detail fidelity — the correctness-gate open question, 3.3 No runtime SDK import in core, 3. The adapter (the seam) (+8 more)

### Community 174 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.12
Nodes (15): up(), name, 8. Migration, 1. Durability contract, 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 4. Save-retry caveat, 5. Lease limitation (+7 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.12
Nodes (14): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+6 more)

### Community 183 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 190 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 205 - "Full-Chain Storage"
Cohesion: 0.17
Nodes (11): store(), 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 3. Semantic decode: `chain-archive-sync/tx-replay-decoder.ts`, 4. How to run it (+3 more)

### Community 206 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 215 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 220 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 242 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 250 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 300 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 301 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 315 - "leanProblems"
Cohesion: 0.50
Nodes (4): leanImports(), leanProblems(), leanTheorems(), retiredLean()

### Community 36 - "history"
Cohesion: 0.04
Nodes (64): integer(), history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+56 more)

### Community 41 - "fn"
Cohesion: 0.04
Nodes (60): fn(), 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure (+52 more)

### Community 49 - "code"
Cohesion: 0.04
Nodes (53): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21), The catalog, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog (+45 more)

### Community 58 - "version"
Cohesion: 0.05
Nodes (44): version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5) (+36 more)

### Community 70 - ".put"
Cohesion: 0.05
Nodes (41): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+33 more)

### Community 85 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 87 - "table"
Cohesion: 0.06
Nodes (36): table(), Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Private modules, Reading through `db`, Running a module with the `umbradb` command (+28 more)

### Community 107 - "Full-Chain Storage — Design"
Cohesion: 0.07
Nodes (28): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+20 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+20 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 125 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence (+17 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 131 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 134 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 149 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 160 - "chain_archive lineage"
Cohesion: 0.11
Nodes (18): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, `chain_blobs` / `chain_blob_roles`, CheckpointStore tables, How the two lineages coexist (+10 more)

### Community 161 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.11
Nodes (18): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.4 — Public surface, contracts, and DX (G1–G4, G20), §2.5 — Security (G15–G19), §2 — Engineering rules (+10 more)

### Community 162 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 163 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 165 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.12
Nodes (12): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort (+4 more)

### Community 166 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 169 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 170 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 178 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 182 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 188 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 193 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 194 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 195 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 202 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 207 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 208 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 209 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 210 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 213 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 214 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 216 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 217 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 218 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.18
Nodes (10): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds, 8. CI (+2 more)

### Community 222 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 223 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 224 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 225 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 226 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 227 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 228 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 233 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 234 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 235 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 236 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 237 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 238 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 239 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 243 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 244 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 246 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 247 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 248 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 249 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.25
Nodes (7): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically

### Community 253 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 254 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 255 - "Backups"
Cohesion: 0.29
Nodes (6): A backup at the core's stop, Backups, Restoring a backup, UmbraDB operator guide, What a backup holds, Writing a backup

### Community 256 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 257 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 258 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 259 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 260 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 261 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 264 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 265 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 266 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 268 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 269 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 270 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 271 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 272 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 273 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 274 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 275 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 276 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 277 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 278 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 279 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 280 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 281 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 282 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 283 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 284 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 285 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 286 - "00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond"
Cohesion: 0.40
Nodes (4): 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix

### Community 287 - "00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone"
Cohesion: 0.40
Nodes (4): 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone, Problem, Resolution, Suggested fix

### Community 288 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 289 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 290 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 291 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 292 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 293 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 294 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 295 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 296 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 297 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 298 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 302 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 303 - "00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor"
Cohesion: 0.50
Nodes (3): 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor, Evidence, Suggested fix

### Community 304 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 305 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 306 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 307 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 308 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 309 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 310 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 311 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 320 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 321 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 59 - "README.md"
Cohesion: 0.05
Nodes (30): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, [0.9.5] - 2026-07-25 — "Penumbra" (+22 more)

### Community 67 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 71 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+32 more)

### Community 80 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides, Requirement: LG-17 Ledger tasks give modules the native objects (+25 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-3339`, `RFC-8259`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3615 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ModuleDeclaration`, `fetch-fixtures.ts`, `admin-harness.ts`, `ref_node_fs`, `tape/index.ts`, `loop.test.ts`, `ledger-storage.test.ts`, `chain-process.test.ts`, `declaration.ts`, `adapter-fixtures.ts`, `validation.ts`, `range.test.ts`, `NodeClient`, `client.test.ts`, `validate.test.ts`, `core-transport.ts`, `core-private-source.test.ts`, `backup/restore.ts`, `.from`, `core-block-commit.test.ts`, `change-capture.ts`, `runner/process.ts`, `chain-placement.test.ts`, `node-format.ts`, `builder.test.ts`, `binding.test.ts`, `ledger/types.ts`, `UmbraError`, `core-ledger-state.ts`, `pglite.ts`, `Database`, `builds.ts`, `changes.property.test.ts`, `cbor.ts`, `ledger-storage-checks.ts`, `ledger-sweep.test.ts`, `spawnChild`, `history.test.ts`, `column-refusals.test.ts`, `slow-block-harness.ts`, `column-rules.test.ts`, `writer-lock-checks.ts`, `startProcess`, `core-settings.ts`, `version-checks.ts`, `interfaces/transaction-history-storage.ts`, `retirement.test.ts`, `net.test.ts`, `module-tables.ts`, `api-server.test.ts`, `durability-probe.test.ts`, `browser.test.ts`, `chain-events-decode.test.ts`, `networks.ts`, `pg-tx-history-adapter.ts`, `contract-modules.test.ts`, `process-worker.ts`, `boundary.test.ts`, `order.property.test.ts`, `containers.test.ts`, `code-registry.ts`, `Lockstep`, `test/postgres/setup.ts`, `browser/build.ts`, `failures.ts`, `cold-boot-recovery.integration.test.ts`, `private/lockstep-wait.test.ts`, `sigterm.test.ts`, `crash.test.ts`, `lockstep-refusals.test.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `ref_node_url`, `package.json`, `cbor.property.test.ts`, `digest.test.ts`, `migrate.test.ts`, `block-fetch-decode.test.ts`, `node-bridge.ts`, `mapping.test.ts`, `package-identity.test.ts`, `recovery.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `shims.test.ts`, `halts.test.ts`, `read-height.property.test.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `pglite-timeouts.test.ts`, `mutation-per-adapter.mjs`, `excluded-not-exported.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `history.property.test.ts`, `component-table.test.ts`, `transport-intake.test.ts`, `facade-merge-loader.ts`, `stop-heights.test.ts`, `postgres-image.test.ts`, `upgrade-boundary.test.ts`, `pglite.test.ts`?**
  _High betweenness centrality (0.256) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8259`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ModuleDeclaration` be split into smaller, more focused modules?**
  _Cohesion score 0.023212419764143902 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `ModuleDeclaration`, `fetch-fixtures.ts`, `admin-harness.ts`, `tape/index.ts`, `migrate.test.ts`, `ledger-storage.test.ts`, `chain-process.test.ts`, `declaration.ts`, `loop.test.ts`, `validation.ts`, `vitest`, `NodeClient`, `client.test.ts`, `validate.test.ts`, `pglite-writer.worker.ts`, `core-private-source.test.ts`, `backup/restore.ts`, `1. Determinism primitives`, `package-identity.test.ts`, `change-capture.ts`, `runner/process.ts`, `version-table.ts`, `core-transport.ts`, `core-block-commit.test.ts`, `binding.test.ts`, `chain-placement.test.ts`, `core-ledger-state.ts`, `FinalizedLoop`, `pglite.ts`, `Database`, `shims.test.ts`, `changes.property.test.ts`, `cbor.ts`, `NodeBlockSource`, `halts.test.ts`, `config/history.ts`, `history.test.ts`, `column-refusals.test.ts`, `slow-block-harness.ts`, `statementsOf`, `range.ts`, `writer-lock-checks.ts`, `startProcess`, `graph.ts`, `core-settings.ts`, `version-checks.ts`, `ProcessAdmin`, `checkShape`, `Session`, `module-tables.ts`, `api-server.test.ts`, `durability-probe.test.ts`, `mapping.test.ts`, `RuntimeMetadata`, `process-worker.ts`, `table`, `Writer`, `InMemoryBlockSource`, `sha256`, `PrivateTransport`, `upgrade-boundary.test.ts`, `mapping.ts`, `failures.ts`, `lockstep-refusals.test.ts`, `checkParent`, `ModuleApi`, `PgliteDatabase`, `ProcessContexts`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `fetch-fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.027052398020139954 - nodes in this community are weakly interconnected._