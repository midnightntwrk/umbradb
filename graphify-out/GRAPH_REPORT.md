# Graph Report - UmbraDB

## Corpus Check
- 1192 files · ~1,688,112 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12446 nodes · 38394 edges · 348 communities (309 shown, 39 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3211 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `d1829745f788cc7a` (1192 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- declaration.ts
- loop.ts
- adapter-fixtures.ts
- change-capture.ts
- api-socket.ts
- browser/build.ts
- test/postgres/setup.ts
- .#process
- core-ledger-state/sql.ts
- api.ts
- paused-harness.ts
- release-version.ts
- .concat
- resolver-boundary.ts
- validate.ts
- ChannelEndpoint
- node-source.ts
- process-worker.ts
- postgres/transaction-history-storage.ts
- node-fields-harness.ts
- chrome.ts
- code-registry.ts
- ledger-sweep.test.ts
- api-server.test.ts
- pg-tx-history-adapter.ts
- accepted-hash-checks.ts
- process-backends.ts
- documents.ts
- node-run.ts
- LoopPauses
- read-gate.ts
- core.ts
- vitest
- interfaces/transaction-history-storage.ts
- crash.test.ts
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- surface.test.ts
- tape/index.ts
- BlockRef
- pack-install.mjs
- core-block-fetch.test.ts
- ledger/metadata.ts
- node-bridge.ts
- start-umbradb.test.ts
- ws-mutual-tls.test.ts
- HeightRun
- ref_node_timers
- library-documents.test.ts
- .from
- api-session.test.ts
- version-table.ts
- NodeClient
- ModuleApi
- signal-backup.test.ts
- statementsOf
- src/index.ts
- ApiRoutes
- quiet-host.child.ts
- web-lock.ts
- sha256
- Buffer
- core-transport.ts
- browser/src/config/load.ts
- Heartbeat
- worker-threads-worker.ts
- admin-harness.ts
- client.test.ts
- buffer.ts
- Worker
- Design — Sprint 1: project setup + TemporalKV
- SubscriptionConnection
- recovery.test.ts
- runner/process.ts
- sweepStep
- TapeAnswers
- mounted-admin.test.ts
- sqlite-warning.test.ts
- ProcessItems
- db/errors.ts
- worker-threads.test.ts
- a114Run
- host.ts
- mutation-evidence.d.mts
- StartedModuleApi
- TransportProxy
- stats.ts
- AsyncLocalStorage
- backup/backup.ts
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- backup-fixtures.ts
- column-rules.ts
- HeldRead
- worker-threads-host.ts
- ledger/types.ts
- node-format.ts
- InMemoryBlockSource
- spawnChild
- restore-kill.worker.ts
- LedgerPackage
- BYTE_ORDER
- PageApiChannel
- Outage
- NodeFS
- contract-modules.test.ts
- Keeping
- core-chain.test.ts
- NeverClears
- contract-data-checks.ts
- process-admin.ts
- ledger-storage.test.ts
- validation.ts
- builder.test.ts
- range.ts
- builds.ts
- core-block-parsed.ts
- .value
- module-tables.ts
- refused-configuration.test.ts
- pause-fixtures.ts
- channel-queue.test.ts
- resolve.ts
- start-umbradb.ts
- cbor.ts
- UmbraError
- PgTransactionHistoryStorage
- loop-stop-harness.ts
- ledger-units.test.ts
- chain-placement.test.ts
- chain-data.test.ts
- transform-checks.ts
- slow-block-harness.ts
- FinalizedLoop
- zod
- config/history.ts
- sweep-tapes.ts
- browser.test.ts
- replay-check.ts
- column-rules.test.ts
- NodeBlockSource
- boundary.test.ts
- cbor.property.test.ts
- Transaction
- guarantees.test.ts
- version-checks.ts
- core-ledger-state.ts
- private-transport.ts
- checkShape
- retirement.test.ts
- file-mode.test.ts
- config-hash-checks.ts
- ingest-harness.ts
- config-check.ts
- core-block-commit.test.ts
- networks.ts
- mapping.ts
- messages.ts
- private/lockstep-wait.test.ts
- real-tapes.ts
- config/plain-data.ts
- ledger/ledger-tasks.test.ts
- startUmbraDB
- transaction-history-storage.property.test.ts
- block-fetch-decode.test.ts
- src/config/load.ts
- page.ts
- configuration-refusal.test.ts
- listening.test.ts
- cold-boot-recovery.integration.test.ts
- ADDED Requirements
- Problem
- data
- refused
- ADDED Requirements
- .off
- graph.py
- .slowBlockMs
- connectChannel
- core-ledger-state.test.ts
- .disconnect
- conformance-gate.mjs
- mutation-per-adapter.mjs
- twox.ts
- halted
- scoped-review-manifest
- .block
- path.ts
- v9
- firstRegularAtParentTime
- orphan-watcher.mjs
- fresh-instance.mjs
- crash-worker.ts
- history
- .put
- UmbraDB module guide
- version
- code
- ADDED Requirements
- T
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- package.json
- ADDED Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- Boundaries, threats and controls
- ADDED Requirements
- ADDED Requirements
- ROADMAP.md
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- README.md
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB third-party component inventory (SBOM)
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- The laws of UmbraDB's storage helpers
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- Midnight Foundation Security Policy
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- UmbraDB node architecture
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
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
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- Quick start (CLI)
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- start-stack.sh
- peerDependenciesMeta
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 409 edges
2. `UmbraError` - 346 edges
3. `ModuleDeclaration` - 195 edges
4. `InMemoryBlockSource` - 172 edges
5. `FinalizedLoop` - 133 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 102 edges
8. `Database` - 101 edges
9. `startUmbraDB()` - 100 edges
10. `ReadHandle` - 92 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (348 total, 39 thin omitted)

### Community 0 - "declaration.ts"
Cohesion: 0.02
Nodes (254): OpenedFacts, HistoryCheck, HistoryRule, Database, SchemaWriteHandle, AppliedMigration, AppliedRow, MigrationPart (+246 more)

### Community 1 - "loop.ts"
Cohesion: 0.02
Nodes (205): PointName, EntryRange, HeightRange, LateUse, Callback, CallbackFailure, ParallelPoint, PointArguments (+197 more)

### Community 10 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (117): ApplyOutput, StateSummary, StoredNode, LedgerHeight, Upstream, contractFixture, Ledger, RawPackage (+109 more)

### Community 100 - "change-capture.ts"
Cohesion: 0.11
Nodes (29): TableDigest, TableDigestRow, CapturedTable, CaptureState, capturedOf(), digestBlock(), checkpointDigests(), readDigests() (+21 more)

### Community 101 - "api-socket.ts"
Cohesion: 0.12
Nodes (36): coreHeaders, ChannelConnectOptions, connectionRules, ModuleApiLimits, ServedConnection, ModuleApiHandlerOptions, moduleApiHandlers, ModuleApiServerOptions (+28 more)

### Community 102 - "browser/build.ts"
Cohesion: 0.07
Nodes (29): BrowserBuild, BrowserBuildOptions, BrowserControl, checkedLedgers, pageBench, PageServer, browserLedgerEntry(), browserPlugin() (+21 more)

### Community 104 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 106 - ".#process"
Cohesion: 0.07
Nodes (8): Activity, LoopObserver, UnexpectedCursor, cursorText(), isBlock(), isRetryable(), sameBytes(), runWatched()

### Community 109 - "core-ledger-state/sql.ts"
Cohesion: 0.11
Nodes (34): StateRow, StoredState, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks(), deleteGrey() (+26 more)

### Community 11 - "api.ts"
Cohesion: 0.03
Nodes (95): databaseTarget, ReadOptions, Op, States, TableName, Settings, TestBackend, Case (+87 more)

### Community 114 - "paused-harness.ts"
Cohesion: 0.12
Nodes (28): Body, PausedExpectation, Read, Reader, a176Project(), keeperModule(), keepingPause(), pausedOf() (+20 more)

### Community 115 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 117 - ".concat"
Cohesion: 0.07
Nodes (22): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+14 more)

### Community 119 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 12 - "validate.ts"
Cohesion: 0.02
Nodes (125): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, plainData, ConfigInput (+117 more)

### Community 121 - "ChannelEndpoint"
Cohesion: 0.14
Nodes (6): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), 4. Channels

### Community 122 - "node-source.ts"
Cohesion: 0.07
Nodes (16): BlockEventSource, Prefetch, QueuedBlock, NodeSubscription, BlockItems, PreparedBlock, SourceCondition, SourceNodeView (+8 more)

### Community 123 - "process-worker.ts"
Cohesion: 0.10
Nodes (23): ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker, withDevelopmentOptIn() (+15 more)

### Community 124 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (20): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+12 more)

### Community 125 - "node-fields-harness.ts"
Cohesion: 0.09
Nodes (24): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+16 more)

### Community 126 - "chrome.ts"
Cohesion: 0.12
Nodes (15): Cdp, CdpEvent, ChromeBrowser, ChromeTab, Download, PageRequest, chrome(), chrome() (+7 more)

### Community 127 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 129 - "ledger-sweep.test.ts"
Cohesion: 0.13
Nodes (16): SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel (+8 more)

### Community 13 - "api-server.test.ts"
Cohesion: 0.03
Nodes (100): ApiRegistry, ChainDataAnswer, ChainDataView, ApiError, ApiErrorCode, ApiRequest, HttpHandler, HttpMethod (+92 more)

### Community 130 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 132 - "accepted-hash-checks.ts"
Cohesion: 0.12
Nodes (25): PrivateIntakeOptions, startHashDecision, A165Options, a165Run, Attempt, privateCursorHeight(), a165Problems(), contentsOf() (+17 more)

### Community 133 - "process-backends.ts"
Cohesion: 0.14
Nodes (21): NetworkRuleName, Observation, Parsed, Expected, ProcessBackend, ProcessDatabase, schemaCase(), commandRefusalProblems() (+13 more)

### Community 134 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 135 - "node-run.ts"
Cohesion: 0.10
Nodes (22): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, NodeRunResult, core(), databaseOf() (+14 more)

### Community 137 - "LoopPauses"
Cohesion: 0.09
Nodes (17): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, clock(), watched(), 1. Module layout, 2. Backend routing (the one non-obvious constraint) (+9 more)

### Community 138 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 139 - "core.ts"
Cohesion: 0.15
Nodes (21): BaselineLoad, Comparison, CommitOptions, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline() (+13 more)

### Community 14 - "vitest"
Cohesion: 0.03
Nodes (81): Served, Finding, Lockfile, Manifest, RepositoryFile, BlockImport, ChildResult, CodeBlock (+73 more)

### Community 140 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 141 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 143 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.08
Nodes (21): ReadPool, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider) (+13 more)

### Community 144 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 145 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 146 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 147 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 148 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 15 - "tape/index.ts"
Cohesion: 0.04
Nodes (81): Recorded, Failure, Variant, Link, TapeBuilderOptions, RecordingProblem, TapeProblem, TransformProblem (+73 more)

### Community 150 - "BlockRef"
Cohesion: 0.13
Nodes (9): BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem (+1 more)

### Community 153 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 154 - "core-block-fetch.test.ts"
Cohesion: 0.11
Nodes (12): BlockHeaderItem, BlockItemSource, CoreBlockHeader, CoreBlockItems, coreBlockFetchOnFetch(), isBlockItemSource(), chainBackbone(), blockContext() (+4 more)

### Community 155 - "ledger/metadata.ts"
Cohesion: 0.13
Nodes (9): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, OwnStateMetadata, contentStateOf(), hexOf() (+1 more)

### Community 156 - "node-bridge.ts"
Cohesion: 0.13
Nodes (17): Thread, BridgeServer, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 157 - "start-umbradb.test.ts"
Cohesion: 0.14
Nodes (16): ModuleListRule, GoneCwdResult, moduleListProblems(), closedByItself(), hostile(), optionProblems(), throwing(), problemsOf() (+8 more)

### Community 158 - "ws-mutual-tls.test.ts"
Cohesion: 0.12
Nodes (18): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+10 more)

### Community 159 - "HeightRun"
Cohesion: 0.10
Nodes (9): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, WaitsInTransaction (+1 more)

### Community 16 - "ref_node_timers"
Cohesion: 0.03
Nodes (86): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, IgnoredJob, CommandResult, CheckTarget (+78 more)

### Community 161 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 162 - ".from"
Cohesion: 0.10
Nodes (17): recordedGenesis, V9Raw, hexOf(), hex(), hex(), blockHex(), hex(), decode() (+9 more)

### Community 164 - "api-session.test.ts"
Cohesion: 0.15
Nodes (17): HeadersArgument, LifecycleStatus, answerNotServing(), byteLength(), lifecycleBody(), lifecycleHeaders(), notServingResponse(), refuseChannelNotServing() (+9 more)

### Community 169 - "version-table.ts"
Cohesion: 0.21
Nodes (18): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+10 more)

### Community 17 - "NodeClient"
Cohesion: 0.05
Nodes (75): NodeSourceOptions, CoreChainBinding, FinalizedHeightOptions, HeadSubscriber, NodeClient, Pending, State, Subscription (+67 more)

### Community 175 - "ModuleApi"
Cohesion: 0.15
Nodes (10): ApiResponse, ModuleApi, Leaking, apiErrorResponse(), encodeJson(), hex(), matches(), read() (+2 more)

### Community 177 - "signal-backup.test.ts"
Cohesion: 0.18
Nodes (12): WORKER, SignalEvent, SignalJob, report(), PGLITE, REPOSITORY, handle, job (+4 more)

### Community 179 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 18 - "src/index.ts"
Cohesion: 0.03
Nodes (78): StatsRow, Outcome, UmbraConfig, BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue (+70 more)

### Community 180 - "ApiRoutes"
Cohesion: 0.20
Nodes (10): ModuleApiStart, MountedApiSeams, ApiRoutes, ModuleApiOptions, parsePath(), registerModuleApis(), shapeOf(), routesOf() (+2 more)

### Community 186 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 187 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 188 - "sha256"
Cohesion: 0.22
Nodes (7): Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 189 - "Buffer"
Cohesion: 0.15
Nodes (9): Buffer, Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser (+1 more)

### Community 19 - "core-transport.ts"
Cohesion: 0.03
Nodes (76): PrivateLinkAddress, PrivateLinkConnect, ResultColumn, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected (+68 more)

### Community 193 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 197 - "Heartbeat"
Cohesion: 0.24
Nodes (7): Heartbeat, HeartbeatOptions, TimerHandle, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 199 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 2 - "admin-harness.ts"
Cohesion: 0.02
Nodes (192): MountedAdminAnswer, AdminSeams, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer (+184 more)

### Community 20 - "client.test.ts"
Cohesion: 0.03
Nodes (56): Connection, NodeClientOptions, NodeRetry, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets (+48 more)

### Community 200 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 203 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 205 - "SubscriptionConnection"
Cohesion: 0.35
Nodes (4): SubscriptionCarrier, SubscriptionConnection, errorMessage(), socketConnection()

### Community 206 - "recovery.test.ts"
Cohesion: 0.32
Nodes (11): Fault, committedProblems(), count(), landedProblems(), neitherProblems(), parsesBefore(), processedAgainProblems(), recorder() (+3 more)

### Community 21 - "runner/process.ts"
Cohesion: 0.04
Nodes (47): ProcessAdmin, NodeWait, LedgerWorkerOptions, transportReaderFacts, RetryCode, PauseBy, PauseHold, BoundAddress (+39 more)

### Community 213 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 214 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 22 - "mounted-admin.test.ts"
Cohesion: 0.04
Nodes (89): UmbraDBOptions, gate, SecretHashes, Compared, ConnectSeen, PortPeer, OwnWords, Shown (+81 more)

### Community 222 - "sqlite-warning.test.ts"
Cohesion: 0.24
Nodes (6): EmitWarning, WarningHook, ChildResult, isSqliteWarning(), quietImport(), SQLITE

### Community 23 - "db/errors.ts"
Cohesion: 0.04
Nodes (60): PostgresConnection, PostgresOptions, SslMode, DurabilityWarning, ReadTimeoutSetting, Job, JobQueue, Outcome (+52 more)

### Community 24 - "host.ts"
Cohesion: 0.04
Nodes (76): LoadLedger, LedgerStateItem, RetainedState, LedgerName, ChainOutcome, LedgerPackageOptions, ParsedTransaction, AppliedState (+68 more)

### Community 244 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 246 - "StartedModuleApi"
Cohesion: 0.29
Nodes (3): StartedModuleApi, FetchHandler, ModuleApiServer

### Community 248 - "stats.ts"
Cohesion: 0.33
Nodes (4): ManualOpts, TinybenchOpts, measureManual(), tinybench

### Community 25 - "backup/backup.ts"
Cohesion: 0.04
Nodes (93): BackupInput, BackupSeams, BackupTarget, BackupWritten, ManifestMigration, ManifestTool, DumpInput, PgliteDump (+85 more)

### Community 255 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 26 - "backup-fixtures.ts"
Cohesion: 0.05
Nodes (80): Manifest, RestoreInput, RestoreSeams, RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore, TickerHandle (+72 more)

### Community 27 - "column-rules.ts"
Cohesion: 0.03
Nodes (104): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules (+96 more)

### Community 270 - "HeldRead"
Cohesion: 0.60
Nodes (3): HeldRead, concurrent(), queued()

### Community 273 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 28 - "ledger/types.ts"
Cohesion: 0.04
Nodes (79): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+71 more)

### Community 29 - "node-format.ts"
Cohesion: 0.05
Nodes (67): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+59 more)

### Community 3 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (144): ProcessReason, InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job, WorkerEvent (+136 more)

### Community 30 - "spawnChild"
Cohesion: 0.03
Nodes (82): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+74 more)

### Community 304 - "restore-kill.worker.ts"
Cohesion: 0.40
Nodes (3): RestoreJob, job, orphanGuard

### Community 31 - "LedgerPackage"
Cohesion: 0.04
Nodes (48): LedgerEventKind, LedgerPackage, LedgerTask, NodeStore, StateHandle, EngineOptions, LedgerEngine, LedgerTaskFailed (+40 more)

### Community 32 - "contract-modules.test.ts"
Cohesion: 0.04
Nodes (78): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+70 more)

### Community 33 - "core-chain.test.ts"
Cohesion: 0.04
Nodes (70): ConfiguredDatabase, ConfiguredDatabaseOptions, Bound, ChainSource, ConfiguredGenesis, WaitingListener, ConfigRow, ReadDatabaseOptions (+62 more)

### Community 34 - "contract-data-checks.ts"
Cohesion: 0.06
Nodes (85): CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx (+77 more)

### Community 35 - "process-admin.ts"
Cohesion: 0.04
Nodes (85): NetworkShown, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdminOptions, RevisionSettings, DigestRow, ModuleFacts (+77 more)

### Community 36 - "ledger-storage.test.ts"
Cohesion: 0.05
Nodes (80): Restored, ChildReader, eventsRuntime, ingest, SeenLoad, retentionSeen, ledgerScenario, LedgerScenarioOptions (+72 more)

### Community 37 - "validation.ts"
Cohesion: 0.03
Nodes (87): ErrorCode, Edge, GraphFacts, GraphInput, GraphPart, GraphRule, MidChain, Missing (+79 more)

### Community 38 - "builder.test.ts"
Cohesion: 0.04
Nodes (44): ConnectionFrames, Failure, Variant, WrongRecording, Metadata, Step, Frame, RawClient (+36 more)

### Community 39 - "range.ts"
Cohesion: 0.04
Nodes (54): ConnectSocket, Script, ScriptedNode, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+46 more)

### Community 4 - "builds.ts"
Cohesion: 0.03
Nodes (131): AdminStarter, DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, ReadOnlyDatabase, AdminRunOptions, A176Options (+123 more)

### Community 40 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (77): BlockBody, MetadataVariant, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent, EventPhase (+69 more)

### Community 41 - ".value"
Cohesion: 0.06
Nodes (59): BodyExtrinsic, ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive (+51 more)

### Community 42 - "module-tables.ts"
Cohesion: 0.05
Nodes (53): CaptureColumn, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ConsistentRead, ColumnType (+45 more)

### Community 43 - "refused-configuration.test.ts"
Cohesion: 0.04
Nodes (69): EngineConfig, WorkerWithStreams, Start, Refusal, Start, listenError(), startAdminServer(), startProcess() (+61 more)

### Community 44 - "pause-fixtures.ts"
Cohesion: 0.05
Nodes (60): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, PausesInsideTheHeight (+52 more)

### Community 45 - "channel-queue.test.ts"
Cohesion: 0.05
Nodes (56): EndpointOptions, Envelope, MessagePortLike, controlledTimers, PeerEnd, PeerMessage, rawPeer, TestEnd (+48 more)

### Community 46 - "resolve.ts"
Cohesion: 0.04
Nodes (72): ConfigFacts, CoreChainFacts, RestoreBase, BackupText, CommandBuildOptions, CheckState, ConfigCheckOptions, CommandConfig (+64 more)

### Community 48 - "start-umbradb.ts"
Cohesion: 0.06
Nodes (65): readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork, UmbraDBReason (+57 more)

### Community 49 - "cbor.ts"
Cohesion: 0.06
Nodes (59): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+51 more)

### Community 5 - "UmbraError"
Cohesion: 0.03
Nodes (107): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport (+99 more)

### Community 51 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (53): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema (+45 more)

### Community 52 - "loop-stop-harness.ts"
Cohesion: 0.07
Nodes (54): EngineOptions, SignalTarget, watched, A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf (+46 more)

### Community 53 - "ledger-units.test.ts"
Cohesion: 0.06
Nodes (50): ManifestLine, VerifyLedgerPackagesOptions, Path, LedgerSource, LedgerSourceSettings, ChangedFile, GenesisFixture, installationCopy (+42 more)

### Community 54 - "chain-placement.test.ts"
Cohesion: 0.08
Nodes (53): Field, PalletMetadata, Registry, RuntimeShape, StorageSpec, chainHashOf(), fill(), le() (+45 more)

### Community 55 - "chain-data.test.ts"
Cohesion: 0.06
Nodes (57): BlockParsed, itemsSeen, BlockSpec, EventSpec, Json, transactionSpec, Phase, browserChain (+49 more)

### Community 56 - "transform-checks.ts"
Cohesion: 0.08
Nodes (44): TapeError, TransformError, NotificationRange, until(), baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape() (+36 more)

### Community 57 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (49): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+41 more)

### Community 58 - "FinalizedLoop"
Cohesion: 0.07
Nodes (19): EntryBoundary, PointRun, FinalizedLoop, SkipsLockstep, WaitingInRead, ItemsAfterWrite, SilentHalt, EagerLoop (+11 more)

### Community 59 - "zod"
Cohesion: 0.06
Nodes (40): Message, MessageType, Ended, rawClient, Escape, publicState, Refused, hexOf() (+32 more)

### Community 6 - "config/history.ts"
Cohesion: 0.03
Nodes (139): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase, Entry (+131 more)

### Community 60 - "sweep-tapes.ts"
Cohesion: 0.09
Nodes (50): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, FixtureNode, FakeState, RefusalData (+42 more)

### Community 61 - "browser.test.ts"
Cohesion: 0.08
Nodes (53): Reachable, RestoreAttempt, PageBackup, PageEvent, PageLink, PageRestore, ProcessName, StatusBody (+45 more)

### Community 63 - "replay-check.ts"
Cohesion: 0.06
Nodes (41): Refusal, BoundaryBlockReading, BoundaryOptions, BoundaryReading, TapeBuilder, Arguments, Command, TapeCommandIo (+33 more)

### Community 65 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (33): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+25 more)

### Community 67 - "NodeBlockSource"
Cohesion: 0.09
Nodes (12): HeadWait, NodeBlockSource, NodeHeader, QueueRunner, NoWindow, Refetches, TrustsNotifications, hexOf() (+4 more)

### Community 68 - "boundary.test.ts"
Cohesion: 0.08
Nodes (43): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+35 more)

### Community 69 - "cbor.property.test.ts"
Cohesion: 0.06
Nodes (49): ChangeKind, tableChanges, TouchedRow, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap (+41 more)

### Community 7 - "Transaction"
Cohesion: 0.03
Nodes (115): BenchEnv, Transaction, DurabilityProbeOptions, DurabilityViolation, ProbeSession, CreatedDirectory, Held, WarningArguments (+107 more)

### Community 70 - "guarantees.test.ts"
Cohesion: 0.06
Nodes (24): Hold, Signal, QuietResult, Job, HookedSource, PlainSubclass, Opened, HOLDS (+16 more)

### Community 71 - "version-checks.ts"
Cohesion: 0.10
Nodes (39): LedgerTable, Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk (+31 more)

### Community 72 - "core-ledger-state.ts"
Cohesion: 0.08
Nodes (41): BlockLedgerSource, LedgerBinding, retainedStates, CoreRevision, blockHeaderOf(), ledgerVersionOf(), applyBlock(), boundLedger() (+33 more)

### Community 73 - "private-transport.ts"
Cohesion: 0.08
Nodes (22): PublicSide, HelloAck, JsonValue, ReadResult, CarrierConnection, Pending, PrivateCarrier, PrivateTransport (+14 more)

### Community 75 - "checkShape"
Cohesion: 0.07
Nodes (39): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+31 more)

### Community 76 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 77 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (32): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+24 more)

### Community 79 - "config-hash-checks.ts"
Cohesion: 0.07
Nodes (26): Report, EngineInput, ChannelCoreOptions, PublicCoreOptions, A162Options, a162Run, HeaderSeen, HeldLink (+18 more)

### Community 8 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (119): NodeCallOptions, ProcessCondition, Scenario, RecordingClient, ArgType, BlockOptions, CallSpec, chainBlock (+111 more)

### Community 80 - "config-check.ts"
Cohesion: 0.07
Nodes (33): CheckFinding, StepName, StepReport, StepStatus, DatabaseState, TypeCheckFinding, TypeCheckResult, Finding (+25 more)

### Community 81 - "core-block-commit.test.ts"
Cohesion: 0.08
Nodes (34): BlockRow, BlockContext, StandInOptions, Commit, checkParent(), commitBlock(), hex(), sameBytes() (+26 more)

### Community 82 - "networks.ts"
Cohesion: 0.06
Nodes (40): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+32 more)

### Community 83 - "mapping.ts"
Cohesion: 0.08
Nodes (32): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+24 more)

### Community 84 - "messages.ts"
Cohesion: 0.06
Nodes (35): Committed, MessageFault, instanceIdSchema(), bytesOf(), decodeParameter(), decodeValue(), describe(), elementType() (+27 more)

### Community 85 - "private/lockstep-wait.test.ts"
Cohesion: 0.09
Nodes (42): LockstepCondition, OpenTransaction, A118Observation, MismatchObservation, ExpectedWait, WaitSample, hashAt(), inMemoryBlock() (+34 more)

### Community 86 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 88 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (32): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, Row, copyArray(), copyObject() (+24 more)

### Community 89 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.06
Nodes (35): SlowStep, TestLoaderData, bindLedgerTasks(), boundHost(), frozen(), hasLedgerTasks(), resultsOf(), withItems() (+27 more)

### Community 9 - "startUmbraDB"
Cohesion: 0.02
Nodes (138): demoLink, PrivateLinkChannel, UmbraDBStarted, ChannelPrivateOptions, Link, text(), transportReader(), transportReaderRule() (+130 more)

### Community 90 - "transaction-history-storage.property.test.ts"
Cohesion: 0.07
Nodes (25): EntryContent, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, Command, ReplayableStorage, abortErrorLike(), capitalize(), applyCommand() (+17 more)

### Community 94 - "block-fetch-decode.test.ts"
Cohesion: 0.07
Nodes (33): PalletSpec, CrashEvent, CrashJob, RestartEvent, RestartJob, blake2b256(), compress(), rotateRight() (+25 more)

### Community 95 - "src/config/load.ts"
Cohesion: 0.08
Nodes (28): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, ImportedConfig, LoadOptions, BackupSignals (+20 more)

### Community 96 - "page.ts"
Cohesion: 0.06
Nodes (31): ApiChannel, LinkRecord, PageState, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp() (+23 more)

### Community 97 - "configuration-refusal.test.ts"
Cohesion: 0.08
Nodes (30): ConfigFinding, ReasonCode, Unwrapped, StatusFacts, configurationRefused(), findingText(), refusalFindings(), configurationFindings() (+22 more)

### Community 98 - "listening.test.ts"
Cohesion: 0.07
Nodes (25): coreEntry, NetworkInput, NetworkRequest, NetworkRule, PlannedNetwork, Row, notUsedAs(), privateData() (+17 more)

### Community 99 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+27 more)

### Community 253 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 50 - "data"
Cohesion: 0.03
Nodes (67): params(), n(), data(), 2.1 The declaration, 2.2 Its table, 2.3 Writing each block, 2.4 Serving it, 2.5 The configuration file (+59 more)

### Community 64 - "refused"
Cohesion: 0.04
Nodes (48): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 12. When a callback fails, The node on `/status`, 7. Storage helpers (+40 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): 5. WalletState envelope, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll (+30 more)

### Community 107 - ".off"
Cohesion: 0.05
Nodes (35): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases (+27 more)

### Community 110 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 118 - ".slowBlockMs"
Cohesion: 0.07
Nodes (29): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+21 more)

### Community 171 - "connectChannel"
Cohesion: 0.18
Nodes (12): discard(), isChannel(), connectChannel(), 00068 — Two readers of a host's channel beside the private link's endpoint read its members outside a guard, Evidence, Problem, Suggested fix, 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once (+4 more)

### Community 178 - "core-ledger-state.test.ts"
Cohesion: 0.15
Nodes (9): boundLedgerParser(), bindCoreLedgerState(), itemsOf(), applied(), bound(), query(), refusing(), NODES_PER_STATEMENT (+1 more)

### Community 182 - ".disconnect"
Cohesion: 0.16
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 184 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 185 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 192 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 202 - "halted"
Cohesion: 0.20
Nodes (10): halted(), replayRange(), recording(), replay(), Requirement: AE-4 Readiness, Scenario: Catching up past the readiness lag, Requirement: RN-8 A failure before COMMIT leaves nothing and halts, Scenario: A failing writer leaves no row of its block (+2 more)

### Community 216 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 227 - ".block"
Cohesion: 0.47
Nodes (3): failingSource(), lookalike(), flakySource()

### Community 229 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 257 - "v9"
Cohesion: 0.47
Nodes (5): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 269 - "firstRegularAtParentTime"
Cohesion: 0.47
Nodes (4): parentTimeOf(), blockTimeMsAt(), firstRegularAtParentTime(), parentTimestampMs()

### Community 271 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 305 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 316 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 47 - "history"
Cohesion: 0.03
Nodes (67): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+59 more)

### Community 62 - ".put"
Cohesion: 0.04
Nodes (51): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+43 more)

### Community 66 - "UmbraDB module guide"
Cohesion: 0.04
Nodes (50): side(), migrations(), fakePackage(), regular(), system(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 13. Providing items to other modules (+42 more)

### Community 74 - "version"
Cohesion: 0.05
Nodes (45): deferred(), version(), Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log (+37 more)

### Community 78 - "code"
Cohesion: 0.05
Nodes (44): code(), Added, Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true) (+36 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 92 - "T"
Cohesion: 0.05
Nodes (40): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Scenario: Version and timestamp addressing agree, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 6.1 — P3 is the differential gate's replay-equivalence / fold anchor (documentation, no new test code) (+32 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 108 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 128 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 131 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 149 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 160 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 163 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 165 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (19): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+11 more)

### Community 166 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 170 - "ROADMAP.md"
Cohesion: 0.11
Nodes (13): Build commands, Build the package and install it, Building from source, Run from a clone, 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195) (+5 more)

### Community 172 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 173 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 174 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 176 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 181 - "README.md"
Cohesion: 0.19
Nodes (6): Choosing a database, Launching it, stats-module, Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 183 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 190 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 191 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 194 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 196 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 198 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 204 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 207 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 208 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 209 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 210 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 211 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (11): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 6. Nix — nixpkgs packages (from the locked nixpkgs), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies (+3 more)

### Community 212 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 215 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 217 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 218 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 219 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 220 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 221 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 223 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 224 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 225 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 226 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 230 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 231 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 232 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 233 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 236 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 237 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 238 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.29
Nodes (6): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers

### Community 239 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 240 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 241 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 242 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 243 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 245 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 250 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 251 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 252 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 254 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 256 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 258 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 259 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 260 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 261 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 262 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 263 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 264 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 265 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 266 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 267 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 268 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 272 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 274 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 275 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 276 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 277 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 278 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 279 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 280 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 281 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 282 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 283 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 284 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 285 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 286 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 287 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 288 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 289 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 290 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 291 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 292 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 293 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 294 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 295 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 296 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 297 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 298 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 299 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 300 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 301 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 302 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 303 - "Quick start (CLI)"
Cohesion: 0.40
Nodes (5): Check and run, Create a project, Install UmbraDB, Quick start (CLI), `umbradb.config.ts`

### Community 306 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 307 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 308 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 309 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 310 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 311 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 312 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 313 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 320 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 87 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-8949`, `RFC-8949`, `RFC-8949`, `RFC-6455`, `RFC-3339` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4086 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `declaration.ts`, `loop.ts`, `admin-harness.ts`, `InMemoryBlockSource`, `builds.ts`, `UmbraError`, `config/history.ts`, `Transaction`, `ingest-harness.ts`, `adapter-fixtures.ts`, `api.ts`, `validate.ts`, `api-server.test.ts`, `tape/index.ts`, `ref_node_timers`, `NodeClient`, `src/index.ts`, `core-transport.ts`, `client.test.ts`, `runner/process.ts`, `mounted-admin.test.ts`, `db/errors.ts`, `host.ts`, `backup/backup.ts`, `backup-fixtures.ts`, `ledger/types.ts`, `node-format.ts`, `spawnChild`, `LedgerPackage`, `contract-modules.test.ts`, `core-chain.test.ts`, `contract-data-checks.ts`, `process-admin.ts`, `ledger-storage.test.ts`, `validation.ts`, `builder.test.ts`, `range.ts`, `core-block-parsed.ts`, `module-tables.ts`, `refused-configuration.test.ts`, `pause-fixtures.ts`, `channel-queue.test.ts`, `resolve.ts`, `start-umbradb.ts`, `cbor.ts`, `loop-stop-harness.ts`, `ledger-units.test.ts`, `chain-placement.test.ts`, `chain-data.test.ts`, `transform-checks.ts`, `slow-block-harness.ts`, `zod`, `sweep-tapes.ts`, `browser.test.ts`, `column-rules.test.ts`, `boundary.test.ts`, `cbor.property.test.ts`, `guarantees.test.ts`, `version-checks.ts`, `core-ledger-state.ts`, `retirement.test.ts`, `file-mode.test.ts`, `config-hash-checks.ts`, `config-check.ts`, `core-block-commit.test.ts`, `networks.ts`, `mapping.ts`, `messages.ts`, `private/lockstep-wait.test.ts`, `real-tapes.ts`, `config/plain-data.ts`, `ledger/ledger-tasks.test.ts`, `transaction-history-storage.property.test.ts`, `block-fetch-decode.test.ts`, `src/config/load.ts`, `configuration-refusal.test.ts`, `listening.test.ts`, `cold-boot-recovery.integration.test.ts`, `browser/build.ts`, `test/postgres/setup.ts`, `core-ledger-state/sql.ts`, `paused-harness.ts`, `release-version.ts`, `resolver-boundary.ts`, `postgres/transaction-history-storage.ts`, `node-fields-harness.ts`, `code-registry.ts`, `ledger-sweep.test.ts`, `pg-tx-history-adapter.ts`, `package.json`, `accepted-hash-checks.ts`, `process-backends.ts`, `documents.ts`, `LoopPauses`, `read-gate.ts`, `core.ts`, `crash.test.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `surface.test.ts`, `core-block-fetch.test.ts`, `node-bridge.ts`, `start-umbradb.test.ts`, `ws-mutual-tls.test.ts`, `library-documents.test.ts`, `api-session.test.ts`, `excluded-not-exported.test.ts`, `signal-backup.test.ts`, `core-ledger-state.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `web-lock.ts`, `twox.ts`, `Heartbeat`, `recovery.test.ts`, `sqlite-warning.test.ts`, `worker-threads.test.ts`, `firstRegularAtParentTime`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-8949`, `RFC-8949` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `declaration.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.015387425231724578 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `declaration.ts`, `loop.ts`, `admin-harness.ts`, `InMemoryBlockSource`, `accepted-hash-checks.ts`, `process-backends.ts`, `config/history.ts`, `Transaction`, `ingest-harness.ts`, `builds.ts`, `startUmbraDB`, `api.ts`, `validate.ts`, `api-server.test.ts`, `tape/index.ts`, `ref_node_timers`, `NodeClient`, `src/index.ts`, `core-transport.ts`, `client.test.ts`, `runner/process.ts`, `mounted-admin.test.ts`, `db/errors.ts`, `backup/backup.ts`, `ledger/metadata.ts`, `ledger/types.ts`, `contract-modules.test.ts`, `core-chain.test.ts`, `process-admin.ts`, `validation.ts`, `range.ts`, `version-table.ts`, `module-tables.ts`, `refused-configuration.test.ts`, `pause-fixtures.ts`, `channel-queue.test.ts`, `resolve.ts`, `start-umbradb.ts`, `cbor.ts`, `core-ledger-state.test.ts`, `statementsOf`, `ApiRoutes`, `ledger-units.test.ts`, `transform-checks.ts`, `slow-block-harness.ts`, `FinalizedLoop`, `web-lock.ts`, `sha256`, `zod`, `replay-check.ts`, `browser/src/config/load.ts`, `NodeBlockSource`, `guarantees.test.ts`, `version-checks.ts`, `core-ledger-state.ts`, `private-transport.ts`, `version`, `checkShape`, `config-check.ts`, `core-block-commit.test.ts`, `mapping.ts`, `private/lockstep-wait.test.ts`, `config/plain-data.ts`, `src/config/load.ts`, `configuration-refusal.test.ts`, `listening.test.ts`, `.block`, `node-source.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `loop.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01981132075471698 - nodes in this community are weakly interconnected._