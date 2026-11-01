# Graph Report - UmbraDB

## Corpus Check
- 1164 files · ~1,638,071 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12217 nodes · 37584 edges · 359 communities (324 shown, 35 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3012 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `f0a0646a7c3f7bf4` (1164 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- InMemoryBlockSource
- declaration.ts
- migrate.ts
- ChannelEndpoint
- core-ledger-state/sql.ts
- page.ts
- release-version.ts
- openPostgres
- process-worker.ts
- resolver-boundary.ts
- browser/build.ts
- transaction-history-storage.property.test.ts
- .concat
- adapter-fixtures.ts
- node-fields-harness.ts
- order.property.test.ts
- pg-tx-history-adapter.ts
- PointName
- signal-ignored-fixtures.ts
- 5. Runner
- config/plain-data.ts
- documents.ts
- client.test.ts
- api-server.test.ts
- code-registry.ts
- read-gate.ts
- test/postgres/setup.ts
- mapping.ts
- items.ts
- relays.ts
- src/index.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- harness.ts
- version-table.ts
- .send
- fixtures/configuration.ts
- .name
- runner/process.ts
- postgres/transaction-history-storage.ts
- node-bridge.ts
- worker-threads.test.ts
- ledger-sweep.test.ts
- .from
- 4. Configuration
- binding.test.ts
- ApiRoutes
- Process
- childRefKeys
- worker-storage.test.ts
- tape/index.ts
- .#startup
- browser-harness.ts
- options.ts
- text.test.ts
- NodeClient
- core-block-fetch.test.ts
- statementsOf
- api-answers.ts
- LoopPauses
- .#log
- readiness.test.ts
- shims.test.ts
- core-private-source.test.ts
- cursor-table.property.test.ts
- read-height.property.test.ts
- web-lock.ts
- start-umbradb.ts
- ref_node_fs
- no-indexer-or-wallet-sdk.test.ts
- browser/serve.ts
- ws-mutual-tls.test.ts
- SubscriptionConnection
- history.property.test.ts
- spawnChild
- quiet-host.child.ts
- buffer.ts
- Worker
- defineModule
- sweepStep
- ledger/plain-data.ts
- TapeAnswers
- browser/src/config/load.ts
- core-transport.ts
- ingest-crash.worker.ts
- core.ts
- core-block-commit.test.ts
- contract-data-checks.ts
- renamed-setting.test.ts
- builds.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- range.test.ts
- builder.test.ts
- MessagePortLike
- core-block-parsed.ts
- core-config.test.ts
- adapter.ts
- host.ts
- HeightActivity
- PageState
- messages.ts
- BlockLedgerSource
- BYTE_ORDER
- .value
- PageApiChannel
- NodeFS
- FinalizedLoop
- node-format.ts
- validation.ts
- NodeBlockSource
- channel-checks.test.ts
- loop-stop-harness.ts
- Transaction
- LedgerPackage
- chain-placement.test.ts
- column-rules.ts
- UmbraError
- cli/command.ts
- config-check.ts
- vitest
- PgTransactionHistoryStorage
- db/errors.ts
- backup/backup.ts
- transport.test.ts
- table
- slow-block-harness.ts
- column-rules.test.ts
- transform-checks.ts
- pause-fixtures.ts
- range.ts
- history.test.ts
- opt-out.test.ts
- sweep-tapes.ts
- chain-process.test.ts
- paused-harness.ts
- core-ledger-state.ts
- cold-boot-recovery.integration.test.ts
- pack-install.mjs
- boundary.test.ts
- graph.ts
- snapshot.test.ts
- core-settings.ts
- ingest-harness.ts
- validate.test.ts
- api-server.ts
- ledger-units.test.ts
- ledger/ledger-tasks.test.ts
- interfaces/transaction-history-storage.ts
- retirement.test.ts
- cbor.ts
- config/history.ts
- validate.ts
- admin-harness.ts
- checkShape
- networks.ts
- contract-modules.test.ts
- restore-private.ts
- version-checks.ts
- browser.test.ts
- file-mode.test.ts
- resolve.ts
- cbor.property.test.ts
- startup-stop-harness.ts
- module-api.ts
- ledger-tasks-checks.ts
- example-checks.ts
- pglite-lock.ts
- refused
- Proposal — Sprint 3: CheckpointStore
- Problem
- graph.py
- backupAtStop
- .off
- ADDED Requirements
- .slowBlockMs
- transportReader
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Boundaries, threats and controls
- mapping.test.ts
- core-ledger-state.test.ts
- .disconnect
- conformance-gate.mjs
- mutation-per-adapter.mjs
- twox.ts
- Design — v1.1.0: Quint model checking
- openssl
- UmbraDB third-party component inventory (SBOM)
- Requirement: CF-4 Every field is data, operational or secret
- development-opt-in.test.ts
- path.ts
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- fresh-instance.mjs
- crash-worker.ts
- history
- .put
- code
- T
- ADDED Requirements
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- Requirement: BK-1 Backup
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.9.5] - 2026-07-25 — "Penumbra"
- scoped-review-manifest
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Repository agent policy
- Contributing
- UmbraDB operator guide
- stats-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Requirement: PP-4 The process transport
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data
- Proposal — v1.0.0-infosec-signoff
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- dependencies
- lib.sh
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true
- 00045 — Mutual TLS does not bind a certificate to an instance id
- 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy
- 00047 — Resource limits are per message or connection, not per service
- 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance
- 00049 — A141's "within 2 s" on PostgreSQL fails once under load
- 00050 — A165's race step on PostgreSQL with a transport failed once under load
- 00051 — The transport's instance id is any text: line breaks reach the core's log
- 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents
- 00054 — A slow-block test hung inside PGlite for over an hour
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
- 00064 — Under a loaded machine, three tests' timing budgets run out in the full suite: L15–L18's controls, A63, F2
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- library/fixtures/task-modules.ts
- start-stack.sh
- graphify/run.sh
- build-in-container.sh
- stats-module/run.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- post-block-update/oracle/run.sh
- state-trees/oracle/run.sh
- modules-missing.ts
- modules-not-a-list.ts
- v8/build.sh
- v9/build.sh
- v9-rc3/build.sh
- vendor-ledger.sh
- workerData
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs

## God Nodes (most connected - your core abstractions)
1. `vitest` - 400 edges
2. `UmbraError` - 341 edges
3. `ModuleDeclaration` - 194 edges
4. `InMemoryBlockSource` - 157 edges
5. `FinalizedLoop` - 133 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 102 edges
8. `Database` - 101 edges
9. `ReadHandle` - 92 edges
10. `startProcess()` - 85 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (359 total, 35 thin omitted)

### Community 0 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (178): BlockItemSource, HistoryOptions, BlockRef, InMemoryBlockSource, InMemoryItems, InMemorySourceOptions, Wait, LoopInput (+170 more)

### Community 1 - "declaration.ts"
Cohesion: 0.02
Nodes (180): ErrorCode, ItemDeclaration, ItemSink, KnownPointsOnly, Revision, TableDeclaration, EntryRange, GraphInput (+172 more)

### Community 10 - "migrate.ts"
Cohesion: 0.03
Nodes (121): Checked, AppliedRow, Runnable, Settling, StartupInput, Difference, OwnPart, PlannedSchema (+113 more)

### Community 102 - "ChannelEndpoint"
Cohesion: 0.11
Nodes (8): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), messageEnvelope(), refuseChannel(), 4. Channels, 5.4 Channels

### Community 103 - "core-ledger-state/sql.ts"
Cohesion: 0.12
Nodes (33): StateRow, StoredState, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks(), deleteGrey() (+25 more)

### Community 104 - "page.ts"
Cohesion: 0.07
Nodes (30): ApiChannel, LinkRecord, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp(), beginCore() (+22 more)

### Community 109 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 11 - "openPostgres"
Cohesion: 0.03
Nodes (110): BenchEnv, DurabilityProbeOptions, DurabilityViolation, ProbeSession, driverConnectionOptions, Outcome, PostgresConnection, PostgresOptions (+102 more)

### Community 110 - "process-worker.ts"
Cohesion: 0.10
Nodes (26): ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker, withDevelopmentOptIn() (+18 more)

### Community 112 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (32): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+24 more)

### Community 113 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 116 - "transaction-history-storage.property.test.ts"
Cohesion: 0.09
Nodes (21): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, ReplayableStorage, abortErrorLike(), capitalize(), applyCommand(), replay(), TransactionHistoryEntrySchema (+13 more)

### Community 117 - ".concat"
Cohesion: 0.07
Nodes (22): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+14 more)

### Community 12 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (120): ApplyInput, ApplyOutput, LogItem, StateSummary, StoredNode, VmLog, DeployTx, LedgerHeight (+112 more)

### Community 120 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (25): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+17 more)

### Community 123 - "order.property.test.ts"
Cohesion: 0.10
Nodes (30): CheckName, GraphSpec, ModuleSpec, TESTED, checkDigestLast(), checkEachOnce(), checkParallelWaits(), checkWaves() (+22 more)

### Community 124 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 125 - "PointName"
Cohesion: 0.08
Nodes (17): QueuedBlock, PointName, BlockItems, CallbackFailure, Activity, Misuse, SlowBlockCondition, CallEvent (+9 more)

### Community 126 - "signal-ignored-fixtures.ts"
Cohesion: 0.10
Nodes (26): IgnoredJob, ListenedRun, WorkerSignals, runFailed(), listenerProblems(), namesUnder(), pacedNode(), pacedTape() (+18 more)

### Community 127 - "5. Runner"
Cohesion: 0.15
Nodes (26): Callback, EntryBoundary, ParallelPoint, PointSchedule, SkipsStartAtRestart, StartsAtEveryRevision, CoreStopsFirst, boundaryModules() (+18 more)

### Community 128 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 129 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 13 - "client.test.ts"
Cohesion: 0.03
Nodes (81): NodeClientOptions, ConnectSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets, Answer, FakeNode (+73 more)

### Community 130 - "api-server.test.ts"
Cohesion: 0.11
Nodes (22): AppendsVersion, Client, configHashesOf(), duplicateProblems(), exchange(), helperProblems(), hex(), isConfigHash() (+14 more)

### Community 131 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 133 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 134 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 135 - "mapping.ts"
Cohesion: 0.13
Nodes (26): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+18 more)

### Community 137 - "items.ts"
Cohesion: 0.11
Nodes (13): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, CoreBlockItems, MetadataBlock, MetadataNode, RuntimeMetadata (+5 more)

### Community 138 - "relays.ts"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 14 - "src/index.ts"
Cohesion: 0.03
Nodes (88): StatsRow, Outcome, UmbraConfig, BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue (+80 more)

### Community 141 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 142 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 143 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 144 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 145 - "harness.ts"
Cohesion: 0.13
Nodes (18): BaselineLoad, Comparison, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline, LatencyStats (+10 more)

### Community 146 - "version-table.ts"
Cohesion: 0.13
Nodes (25): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+17 more)

### Community 147 - ".send"
Cohesion: 0.14
Nodes (10): Cdp, ChromeBrowser, ChromeTab, chrome(), chrome(), chromePath(), exitsWithin(), launchChrome() (+2 more)

### Community 148 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (19): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+11 more)

### Community 149 - ".name"
Cohesion: 0.10
Nodes (17): Fetching, Recorder, Key, Sql, 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem, Suggested fix (+9 more)

### Community 15 - "runner/process.ts"
Cohesion: 0.03
Nodes (86): ConfigFacts, OpenedConfig, Bound, ChainCheck, ChainCheckInput, ChainSource, CoreChainFacts, NodeWait (+78 more)

### Community 150 - "postgres/transaction-history-storage.ts"
Cohesion: 0.12
Nodes (14): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+6 more)

### Community 151 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 152 - "worker-threads.test.ts"
Cohesion: 0.09
Nodes (13): Listener, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread, parentPort (+5 more)

### Community 157 - "ledger-sweep.test.ts"
Cohesion: 0.18
Nodes (14): SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints() (+6 more)

### Community 158 - ".from"
Cohesion: 0.10
Nodes (17): Buffer, hex(), hex(), hex(), blockHex(), hex(), hex(), utf8() (+9 more)

### Community 159 - "4. Configuration"
Cohesion: 0.13
Nodes (18): CoreVersion, CoreSettings, SettingsSchema, UpgradeEntry, recordHistory(), tableItemsOf(), deleteConfigRow(), updateProvides() (+10 more)

### Community 16 - "binding.test.ts"
Cohesion: 0.04
Nodes (107): PglitePathParts, LockstepCondition, TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome (+99 more)

### Community 161 - "ApiRoutes"
Cohesion: 0.13
Nodes (15): ModuleApiStart, MountedApiSeams, ApiRoutes, ApiStartup, ModuleApiOptions, ModuleRegistration, AcceptsDuplicates, registerModuleApis() (+7 more)

### Community 164 - "Process"
Cohesion: 0.16
Nodes (3): Process, NetworkPlan, asksForChannels()

### Community 165 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 167 - "worker-storage.test.ts"
Cohesion: 0.15
Nodes (12): StagenetBlockJson, StagenetFixtureJson, Nodes, bytes(), at(), input(), rows(), started() (+4 more)

### Community 17 - "tape/index.ts"
Cohesion: 0.04
Nodes (83): Recorded, TapeBuilderOptions, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest, RequestId (+75 more)

### Community 172 - ".#startup"
Cohesion: 0.14
Nodes (3): SignalTarget, privateLinkOf(), sourceOf()

### Community 173 - "browser-harness.ts"
Cohesion: 0.25
Nodes (17): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+9 more)

### Community 175 - "options.ts"
Cohesion: 0.24
Nodes (17): readOptions, addressFindings(), configFindings(), finding(), isHost(), isObject(), keysOf(), networkFindings() (+9 more)

### Community 177 - "text.test.ts"
Cohesion: 0.16
Nodes (8): BackupText, createReadStream(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir, 16. Browser

### Community 18 - "NodeClient"
Cohesion: 0.05
Nodes (74): CoreChainBinding, FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State (+66 more)

### Community 181 - "core-block-fetch.test.ts"
Cohesion: 0.15
Nodes (8): LedgerTable, coreBlockFetchOnFetch(), isBlockItemSource(), chainBackbone(), blockContext(), BOUND, CORE_BLOCK_FETCH_ID, CORE_BLOCK_ITEMS

### Community 182 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 183 - "api-answers.ts"
Cohesion: 0.21
Nodes (14): LifecycleStatus, answerNotServing(), byteLength(), isCoreHeader(), lifecycleBody(), lifecycleHeaders(), notServingResponse(), refuseChannelNotServing() (+6 more)

### Community 184 - "LoopPauses"
Cohesion: 0.18
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 186 - "readiness.test.ts"
Cohesion: 0.18
Nodes (13): Decision, ReadinessCase, ae4(), caseText(), readinessProblems(), holding(), observedProblems(), ready() (+5 more)

### Community 187 - "shims.test.ts"
Cohesion: 0.21
Nodes (7): Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 19 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (65): ConfiguredGenesis, PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision (+57 more)

### Community 190 - "cursor-table.property.test.ts"
Cohesion: 0.17
Nodes (15): Access, Block, BlockFails, Counts, Write, canonicalText(), expectValue(), holds() (+7 more)

### Community 196 - "read-height.property.test.ts"
Cohesion: 0.20
Nodes (10): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+2 more)

### Community 197 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 2 - "start-umbradb.ts"
Cohesion: 0.02
Nodes (159): demoLink, RunOptions, RunSeams, PrivateLinkChannel, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd (+151 more)

### Community 20 - "ref_node_fs"
Cohesion: 0.05
Nodes (78): BackupBackend, BackupDatabase, killedRestore, TickerConfig, TickerHandle, TickerProcess, WORKER, SignalEvent (+70 more)

### Community 202 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 203 - "browser/serve.ts"
Cohesion: 0.22
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 207 - "ws-mutual-tls.test.ts"
Cohesion: 0.21
Nodes (8): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), read(), tlsClientErrors

### Community 208 - "SubscriptionConnection"
Cohesion: 0.33
Nodes (5): SubscriptionCarrier, SubscriptionConnection, connectChannel(), errorMessage(), socketConnection()

### Community 209 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 21 - "spawnChild"
Cohesion: 0.03
Nodes (90): CdpEvent, Download, ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted (+82 more)

### Community 210 - "quiet-host.child.ts"
Cohesion: 0.18
Nodes (9): Job, Outcome, Stated, until(), before, db, during, [first, refusedLate, failingSql, halting] (+1 more)

### Community 212 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 22 - "defineModule"
Cohesion: 0.03
Nodes (99): TableDigest, TableDigestRow, CapturedTable, ChangeKind, tableChanges, TouchedRow, DigestRow, Op (+91 more)

### Community 223 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 224 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 225 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 226 - "browser/src/config/load.ts"
Cohesion: 0.29
Nodes (9): LoadedConfig, LoadOptions, configModuleUrl(), configPath(), loadConfig(), loadModuleList(), noFile(), DEFAULT_CONFIG_FILE (+1 more)

### Community 23 - "core-transport.ts"
Cohesion: 0.03
Nodes (65): PrivateLinkAddress, ResultColumn, CoreChannelSeams, CoreChannelsOptions, Queued, Connected, CoreTransport, CoreTransportOptions (+57 more)

### Community 233 - "ingest-crash.worker.ts"
Cohesion: 0.24
Nodes (8): CrashEvent, CrashJob, report(), tipWriter(), handle, job, orphanGuard, poll

### Community 234 - "core.ts"
Cohesion: 0.39
Nodes (8): CommitOptions, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual(), summarize(), LEDGER_TABLE

### Community 24 - "core-block-commit.test.ts"
Cohesion: 0.04
Nodes (88): OpenedFacts, BlockRow, ConfigRow, commandTarget, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget (+80 more)

### Community 25 - "contract-data-checks.ts"
Cohesion: 0.05
Nodes (92): ContractLog, CoreContractLogsFastOptions, FastLogReader, CoreContractLogsFullOptions, CoreContractStatesOptions, ContractStateRow, LogEventType, DefinedModule (+84 more)

### Community 250 - "renamed-setting.test.ts"
Cohesion: 0.39
Nodes (6): Renamed, databaseOf(), dataOf(), escaped(), fileOf(), FINDING()

### Community 26 - "builds.ts"
Cohesion: 0.04
Nodes (74): PostgresParts, A165Options, a165Run, Attempt, PrivateBackend, SessionSeen, PrivateRefusal, A162Options (+66 more)

### Community 260 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 267 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 27 - "range.test.ts"
Cohesion: 0.03
Nodes (63): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+55 more)

### Community 28 - "builder.test.ts"
Cohesion: 0.03
Nodes (47): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step, Frame (+39 more)

### Community 29 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (84): MetadataVariant, BlockParsed, BlockParsedOptions, TransactionParser, ChainTransaction, ChainEvent, EventPhase, RecordTypes (+76 more)

### Community 3 - "core-config.test.ts"
Cohesion: 0.03
Nodes (137): NetworkShown, MountedAdminAnswer, AdminSeams, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, adminRoutes, AdminChannel (+129 more)

### Community 30 - "adapter.ts"
Cohesion: 0.04
Nodes (72): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+64 more)

### Community 31 - "host.ts"
Cohesion: 0.05
Nodes (62): LoadLedger, LedgerStateItem, LedgerName, ParsedTransaction, AppliedState, ApplyBlock, BlockId, ContractKeys (+54 more)

### Community 316 - "HeightActivity"
Cohesion: 0.60
Nodes (3): HeightActivity, NeverClears, NeverClears

### Community 32 - "messages.ts"
Cohesion: 0.03
Nodes (61): PrivateLinkConnect, PublicSide, EndpointOptions, Received, Committed, HelloAck, JsonValue, MessageFault (+53 more)

### Community 33 - ".value"
Cohesion: 0.05
Nodes (65): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, RuntimeMetadataView (+57 more)

### Community 34 - "FinalizedLoop"
Cohesion: 0.04
Nodes (27): PointRun, FinalizedLoop, LoopObserver, Startup, PausesInsideTheHeight, SkipsLockstep, SkipsUnseen, WaitsInTransaction (+19 more)

### Community 35 - "node-format.ts"
Cohesion: 0.05
Nodes (61): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+53 more)

### Community 36 - "validation.ts"
Cohesion: 0.04
Nodes (60): SchemaWriteHandle, MigrationPart, ProcessContext, DeclarationRule, PlacedDeclaration, Plain, MisuseListener, MisuseReports (+52 more)

### Community 38 - "NodeBlockSource"
Cohesion: 0.06
Nodes (26): HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeSubscription, NodeHeader, PreparedBlock, QueueRunner (+18 more)

### Community 39 - "channel-checks.test.ts"
Cohesion: 0.05
Nodes (57): Envelope, LinkTimers, controlledTimers, PeerEnd, PeerMessage, rawPeer, TestEnd, TestEndOptions (+49 more)

### Community 4 - "loop-stop-harness.ts"
Cohesion: 0.03
Nodes (160): Manifest, Restored, RestoreInput, BlockHeader, itemsSeen, eventsRuntime, ingest, watched (+152 more)

### Community 40 - "Transaction"
Cohesion: 0.05
Nodes (19): Transaction, DurabilityWarning, JobQueue, PgliteDatabase, BoundedRead, ReadPool, Session, Writer (+11 more)

### Community 42 - "LedgerPackage"
Cohesion: 0.08
Nodes (28): LedgerPackage, LedgerTask, LedgerTaskBlock, StateHandle, EngineOptions, LedgerEngine, LedgerTaskFailed, Settled (+20 more)

### Community 43 - "chain-placement.test.ts"
Cohesion: 0.07
Nodes (57): Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, decodeExtrinsics(), chainHashOf() (+49 more)

### Community 44 - "column-rules.ts"
Cohesion: 0.04
Nodes (69): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+61 more)

### Community 45 - "UmbraError"
Cohesion: 0.06
Nodes (55): PublicSide, RestoreTarget, UmbraError, ChainStarted, BlockOptions, LostCommit, bindCoreBlockFetch(), isBlockLedgerSource() (+47 more)

### Community 46 - "cli/command.ts"
Cohesion: 0.06
Nodes (49): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, CommandResult, RunningCommand, statsConfig, backupArguments() (+41 more)

### Community 47 - "config-check.ts"
Cohesion: 0.05
Nodes (47): CheckFinding, CheckStep, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, TypeCheckFinding (+39 more)

### Community 48 - "vitest"
Cohesion: 0.04
Nodes (41): Lockfile, Manifest, RepositoryFile, Upstream, Leftover, RemovedName, ReportedTest, canPin() (+33 more)

### Community 49 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (54): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers (+46 more)

### Community 5 - "db/errors.ts"
Cohesion: 0.03
Nodes (115): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, SslMode, CommittedHeight, Database (+107 more)

### Community 50 - "backup/backup.ts"
Cohesion: 0.07
Nodes (52): BackupInput, BackupSeams, BackupTarget, BackupFacts, ManifestHistoryRow, ManifestMigration, ManifestTool, PgliteDump (+44 more)

### Community 51 - "transport.test.ts"
Cohesion: 0.06
Nodes (41): ReadOnlyDatabase, Message, MessageType, TestCertificates, Ended, rawClient, Escape, publicState (+33 more)

### Community 52 - "table"
Cohesion: 0.04
Nodes (50): ProcessItems, side(), params(), migrations(), table(), version(), fakePackage(), regular() (+42 more)

### Community 53 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (50): BlockEventSource, ReadOpener, ProbeRecord, Times, Wait, askedSource, BodyRead, HoldMode (+42 more)

### Community 54 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, keyOrder, TableRule, TypeRule, DesignTable, becauseOf() (+24 more)

### Community 56 - "transform-checks.ts"
Cohesion: 0.09
Nodes (36): Failure, Variant, TransformError, NotificationRange, baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape() (+28 more)

### Community 57 - "pause-fixtures.ts"
Cohesion: 0.06
Nodes (39): backupSignalRelay, SignalSource, stopSignal, BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable (+31 more)

### Community 58 - "range.ts"
Cohesion: 0.06
Nodes (51): BoundaryBlockReading, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange, Final, Height (+43 more)

### Community 59 - "history.test.ts"
Cohesion: 0.07
Nodes (48): versionEntry, ConfigHashRow, Simulation, Start, Case, dataHash(), builtWith100(), deletesOnly() (+40 more)

### Community 6 - "opt-out.test.ts"
Cohesion: 0.03
Nodes (122): DumpInput, CaptureColumn, CaptureState, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure (+114 more)

### Community 60 - "sweep-tapes.ts"
Cohesion: 0.10
Nodes (48): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, FixtureNode, FakeState, RefusalData (+40 more)

### Community 61 - "chain-process.test.ts"
Cohesion: 0.05
Nodes (40): Job, WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation, Failing, Flaky (+32 more)

### Community 62 - "paused-harness.ts"
Cohesion: 0.08
Nodes (41): LoadOptions, A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running (+33 more)

### Community 63 - "core-ledger-state.ts"
Cohesion: 0.08
Nodes (43): RetainedState, retainedStates, CoreRevision, applyBlock(), boundLedger(), chainOutcomesOf(), computeBlock(), contractsOf() (+35 more)

### Community 64 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (32): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+24 more)

### Community 65 - "pack-install.mjs"
Cohesion: 0.08
Nodes (45): Surface, SurfaceAmendment, SmokeFailure, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph() (+37 more)

### Community 66 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+34 more)

### Community 67 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+40 more)

### Community 68 - "snapshot.test.ts"
Cohesion: 0.07
Nodes (36): AllowedDetail, SanitizedError, ConfigFinding, ProcessReason, ReasonCode, RetryCode, Unwrapped, UnexpectedCursor (+28 more)

### Community 69 - "core-settings.ts"
Cohesion: 0.05
Nodes (44): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, Absent, DeepReadonly (+36 more)

### Community 7 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (141): NodeCallOptions, ProcessCondition, BlockSpec, EventSpec, Scenario, transactionSpec, RecordingClient, ArgType (+133 more)

### Community 70 - "validate.test.ts"
Cohesion: 0.06
Nodes (39): DatabasePartsInput, Entry, ConfigRule, EntryRef, Accepts, ConfigOf, CoreSettingsGiven, Minimal (+31 more)

### Community 71 - "api-server.ts"
Cohesion: 0.09
Nodes (41): coreHeaders, HeadersArgument, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler, ModuleApiLimits, ServedConnection (+33 more)

### Community 72 - "ledger-units.test.ts"
Cohesion: 0.08
Nodes (38): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages() (+30 more)

### Community 73 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (37): LedgerWorkerFailure, SlowStep, TestLoaderData, beat(), countDeserializations(), hexOf(), loadLedger(), probe() (+29 more)

### Community 74 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (31): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+23 more)

### Community 75 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 76 - "cbor.ts"
Cohesion: 0.09
Nodes (37): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+29 more)

### Community 77 - "config/history.ts"
Cohesion: 0.09
Nodes (38): HistoryCode, HistoryContext, HistoryRule, ProvidesRow, Span, StartupOptions, asNumber(), atOrBelow() (+30 more)

### Community 79 - "validate.ts"
Cohesion: 0.09
Nodes (42): HistoryFinding, TextPattern, CursorRule, Finding, Issue, Plain, findings(), coreSettingsSchema() (+34 more)

### Community 8 - "admin-harness.ts"
Cohesion: 0.03
Nodes (137): BackupWritten, DatabaseParts, PostgresPartsInput, EngineConfig, ProcessHandle, AdminRun, Answered, Answerer (+129 more)

### Community 80 - "checkShape"
Cohesion: 0.08
Nodes (34): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+26 more)

### Community 82 - "networks.ts"
Cohesion: 0.06
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 84 - "contract-modules.test.ts"
Cohesion: 0.08
Nodes (31): BlockTransaction, UnsureLog, LogSite, Program, UnsureReason, V9Raw, Freeable, bytesOfHex() (+23 more)

### Community 85 - "restore-private.ts"
Cohesion: 0.09
Nodes (32): RestoreChain, RestoreSeams, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome, RestoreJob, FileProcess (+24 more)

### Community 86 - "version-checks.ts"
Cohesion: 0.12
Nodes (32): Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk, Answers (+24 more)

### Community 87 - "browser.test.ts"
Cohesion: 0.07
Nodes (39): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, PageRequest, heldClock (+31 more)

### Community 88 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (29): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+21 more)

### Community 9 - "resolve.ts"
Cohesion: 0.02
Nodes (140): RevisionSettings, SnapshotFacts, EntryView, RecordedView, CoreLedgerVersion, LedgerPackageIdentity, TransportReader, coreEntry (+132 more)

### Community 92 - "cbor.property.test.ts"
Cohesion: 0.07
Nodes (38): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+30 more)

### Community 93 - "startup-stop-harness.ts"
Cohesion: 0.09
Nodes (32): SignalJob, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, StartVia, stopBy (+24 more)

### Community 94 - "module-api.ts"
Cohesion: 0.08
Nodes (28): ChainDataAnswer, ApiError, ApiErrorCode, ApiRequest, ApiResponse, HttpHandler, HttpMethod, HttpRoute (+20 more)

### Community 96 - "ledger-tasks-checks.ts"
Cohesion: 0.10
Nodes (31): IngestOptions, TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses(), expectedCallArgs() (+23 more)

### Community 97 - "example-checks.ts"
Cohesion: 0.08
Nodes (25): Served, Finding, BlockImport, ChildResult, CodeBlock, installedProject, isolationProblems(), serveCommand() (+17 more)

### Community 99 - "pglite-lock.ts"
Cohesion: 0.09
Nodes (28): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, acquirePgliteLock(), isSqliteWarning() (+20 more)

### Community 121 - "refused"
Cohesion: 0.09
Nodes (29): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 12. When a callback fails (+21 more)

### Community 248 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 265 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 100 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 101 - "backupAtStop"
Cohesion: 0.07
Nodes (33): backupAtStop(), transportReaderRule(), ledgerWorkerEntry(), placeFor(), watchingPgDump(), log(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence (+25 more)

### Community 105 - ".off"
Cohesion: 0.06
Nodes (33): Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract, 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract (+25 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 114 - ".slowBlockMs"
Cohesion: 0.07
Nodes (29): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+21 more)

### Community 115 - "transportReader"
Cohesion: 0.06
Nodes (32): text(), transportReader(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 10. Requirement coverage, 2. Network (+24 more)

### Community 156 - "ADDED Requirements"
Cohesion: 0.08
Nodes (21): The node on `/status`, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception (+13 more)

### Community 160 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 166 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 180 - "mapping.test.ts"
Cohesion: 0.15
Nodes (8): mapRows(), mapValue(), oid(), identity(), RESULT_COLUMNS, RESULT_TYPES, fast-check, RFC-3339

### Community 189 - "core-ledger-state.test.ts"
Cohesion: 0.14
Nodes (9): boundLedgerParser(), workerParser(), itemsOf(), applied(), bound(), query(), refusing(), NODES_PER_STATEMENT (+1 more)

### Community 191 - ".disconnect"
Cohesion: 0.16
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 194 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 195 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 201 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 206 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 214 - "openssl"
Cohesion: 0.20
Nodes (11): locked(), openssl(), 6. Nix — nixpkgs packages (from the locked nixpkgs), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known (+3 more)

### Community 219 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 238 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.22
Nodes (9): released(), Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears (+1 more)

### Community 241 - "development-opt-in.test.ts"
Cohesion: 0.28
Nodes (7): load(), noHeight(), resolve(), build(), CONFIG, MODULES, DEVTOOL

### Community 243 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 245 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 252 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 281 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 317 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 331 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 37 - "history"
Cohesion: 0.03
Nodes (73): integer(), history(), n(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()` (+65 more)

### Community 41 - ".put"
Cohesion: 0.03
Nodes (66): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+58 more)

### Community 55 - "code"
Cohesion: 0.04
Nodes (55): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+47 more)

### Community 83 - "T"
Cohesion: 0.05
Nodes (41): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+33 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 106 - "README.md"
Cohesion: 0.06
Nodes (27): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs (+19 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 119 - "package.json"
Cohesion: 0.06
Nodes (33): bin, umbradb, bugs, url, description, optional, engines, node (+25 more)

### Community 122 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.06
Nodes (27): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+19 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 154 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 155 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 162 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 163 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 169 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 170 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 174 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 176 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 179 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 188 - "Requirement: BK-1 Backup"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+7 more)

### Community 192 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 193 - "ADDED Requirements"
Cohesion: 0.13
Nodes (15): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker (+7 more)

### Community 198 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 199 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 200 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 204 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 205 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 211 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 213 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 215 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 216 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 217 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 220 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 221 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.16
Nodes (9): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix, Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds (+1 more)

### Community 222 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 227 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 228 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 229 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 230 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 231 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 232 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 235 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 236 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 237 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 239 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 240 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 242 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 244 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 246 - "UmbraDB operator guide"
Cohesion: 0.25
Nodes (8): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The transport reader, TLS to PostgreSQL: `ssl`, UmbraDB operator guide

### Community 247 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 249 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 251 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 253 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 254 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 255 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 256 - "Requirement: PP-4 The process transport"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, Spec delta — `private-processes` capability

### Community 257 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 258 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 259 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 262 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 263 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 264 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 266 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 268 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 269 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 270 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

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

### Community 275 - "Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data"
Cohesion: 0.33
Nodes (5): MODIFIED Requirements, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Scenario: A function in the configuration, Scenario: A user module from the configuration file, Spec delta — `configuration` capability

### Community 276 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 277 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 278 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 279 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 282 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 283 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 284 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 285 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 286 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 287 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 288 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 289 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 290 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 291 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 292 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 293 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 294 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 295 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 296 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 297 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 298 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 299 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 300 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 301 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 302 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 303 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 304 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 305 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 306 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 307 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 308 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 309 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 310 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 311 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 312 - "00064 — Under a loaded machine, three tests' timing budgets run out in the full suite: L15–L18's controls, A63, F2"
Cohesion: 0.40
Nodes (4): 00064 — Under a loaded machine, three tests' timing budgets run out in the full suite: L15–L18's controls, A63, F2, Evidence, Problem, Suggested fix

### Community 313 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 314 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 315 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 318 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 320 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 321 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 322 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 323 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 324 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 325 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 326 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 327 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 332 - "library/fixtures/task-modules.ts"
Cohesion: 0.50
Nodes (3): modules, SEEN, TASK_ROWS

### Community 78 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 98 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

## Knowledge Gaps
- **56 isolated node(s):** `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx`, `typedoc`, `@types/node` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4027 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `InMemoryBlockSource`, `declaration.ts`, `start-umbradb.ts`, `core-config.test.ts`, `loop-stop-harness.ts`, `db/errors.ts`, `opt-out.test.ts`, `ingest-harness.ts`, `admin-harness.ts`, `resolve.ts`, `migrate.ts`, `openPostgres`, `adapter-fixtures.ts`, `client.test.ts`, `src/index.ts`, `runner/process.ts`, `binding.test.ts`, `tape/index.ts`, `NodeClient`, `core-private-source.test.ts`, `ref_node_fs`, `spawnChild`, `defineModule`, `core-transport.ts`, `core-block-commit.test.ts`, `contract-data-checks.ts`, `builds.ts`, `range.test.ts`, `builder.test.ts`, `core-block-parsed.ts`, `adapter.ts`, `host.ts`, `messages.ts`, `.value`, `node-format.ts`, `validation.ts`, `channel-checks.test.ts`, `chain-placement.test.ts`, `UmbraError`, `cli/command.ts`, `config-check.ts`, `backup/backup.ts`, `transport.test.ts`, `slow-block-harness.ts`, `column-rules.test.ts`, `transform-checks.ts`, `pause-fixtures.ts`, `history.test.ts`, `sweep-tapes.ts`, `chain-process.test.ts`, `paused-harness.ts`, `core-ledger-state.ts`, `cold-boot-recovery.integration.test.ts`, `pack-install.mjs`, `boundary.test.ts`, `snapshot.test.ts`, `core-settings.ts`, `validate.test.ts`, `ledger-units.test.ts`, `ledger/ledger-tasks.test.ts`, `interfaces/transaction-history-storage.ts`, `retirement.test.ts`, `networks.ts`, `contract-modules.test.ts`, `restore-private.ts`, `version-checks.ts`, `browser.test.ts`, `file-mode.test.ts`, `cbor.property.test.ts`, `startup-stop-harness.ts`, `ledger-tasks-checks.ts`, `example-checks.ts`, `pglite-lock.ts`, `core-ledger-state/sql.ts`, `release-version.ts`, `resolver-boundary.ts`, `browser/build.ts`, `transaction-history-storage.property.test.ts`, `package.json`, `node-fields-harness.ts`, `order.property.test.ts`, `pg-tx-history-adapter.ts`, `signal-ignored-fixtures.ts`, `config/plain-data.ts`, `documents.ts`, `api-server.test.ts`, `code-registry.ts`, `read-gate.ts`, `test/postgres/setup.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `harness.ts`, `version-table.ts`, `node-bridge.ts`, `worker-threads.test.ts`, `ledger-sweep.test.ts`, `worker-storage.test.ts`, `excluded-not-exported.test.ts`, `text.test.ts`, `mapping.test.ts`, `core-block-fetch.test.ts`, `statementsOf`, `api-answers.ts`, `LoopPauses`, `readiness.test.ts`, `shims.test.ts`, `core-ledger-state.test.ts`, `cursor-table.property.test.ts`, `mutation-per-adapter.mjs`, `read-height.property.test.ts`, `web-lock.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `ws-mutual-tls.test.ts`, `history.property.test.ts`, `ledger/plain-data.ts`, `development-opt-in.test.ts`, `renamed-setting.test.ts`?**
  _High betweenness centrality (0.223) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 19 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InMemoryBlockSource` be split into smaller, more focused modules?**
  _Cohesion score 0.022714859437751003 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `config/plain-data.ts`, `InMemoryBlockSource`, `start-umbradb.ts`, `declaration.ts`, `loop-stop-harness.ts`, `db/errors.ts`, `opt-out.test.ts`, `mapping.ts`, `admin-harness.ts`, `resolve.ts`, `migrate.ts`, `openPostgres`, `items.ts`, `ingest-harness.ts`, `src/index.ts`, `runner/process.ts`, `client.test.ts`, `binding.test.ts`, `version-table.ts`, `core-private-source.test.ts`, `NodeClient`, `ref_node_fs`, `defineModule`, `core-transport.ts`, `core-block-commit.test.ts`, `contract-data-checks.ts`, `tape/index.ts`, `builder.test.ts`, `messages.ts`, `ApiRoutes`, `FinalizedLoop`, `validation.ts`, `NodeBlockSource`, `channel-checks.test.ts`, `Transaction`, `LedgerPackage`, `.#startup`, `options.ts`, `config-check.ts`, `backup/backup.ts`, `transport.test.ts`, `mapping.test.ts`, `slow-block-harness.ts`, `statementsOf`, `transform-checks.ts`, `pause-fixtures.ts`, `readiness.test.ts`, `shims.test.ts`, `history.test.ts`, `chain-process.test.ts`, `paused-harness.ts`, `core-ledger-state.ts`, `core-ledger-state.test.ts`, `range.ts`, `graph.ts`, `snapshot.test.ts`, `web-lock.ts`, `validate.test.ts`, `ledger-units.test.ts`, `interfaces/transaction-history-storage.ts`, `cbor.ts`, `config/history.ts`, `api-server.test.ts`, `validate.ts`, `checkShape`, `core-config.test.ts`, `restore-private.ts`, `version-checks.ts`, `module-api.ts`, `browser/src/config/load.ts`, `pglite-lock.ts`, `backupAtStop`, `development-opt-in.test.ts`, `renamed-setting.test.ts`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `declaration.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02114419538307126 - nodes in this community are weakly interconnected._