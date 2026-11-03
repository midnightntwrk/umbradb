# Graph Report - UmbraDB

## Corpus Check
- 1287 files · ~1,818,126 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13256 nodes · 41475 edges · 361 communities (332 shown, 29 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3452 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `e338d7faf831aebe` (1287 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- declaration.ts
- runner/process.ts
- version-checks.ts
- file-mode.test.ts
- process-harness.ts
- 2. Database API
- test/postgres/setup.ts
- ref_node_fs
- browser/build.ts
- Worker
- PrivateLinkChannel
- browser.test.ts
- release-version.ts
- core.ts
- BlockRef
- ChannelEndpoint
- TransactionHistoryEntry
- core-block-fetch/metadata.ts
- paused-harness.ts
- ReadHandle
- process-backends.ts
- sweep-tapes.ts
- pg-tx-history-adapter.ts
- core-block-commit.test.ts
- example-checks.ts
- documents.ts
- ModuleApi
- code-registry.ts
- channel-processes.ts
- read-gate.ts
- client.test.ts
- relays.ts
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- cli/restore.ts
- restore-private.ts
- node-bridge.ts
- sigterm.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- core-block-parsed.ts
- cli/run.ts
- browser-harness.ts
- surface.test.ts
- crash.test.ts
- backupAtStop
- deterministic-postgresql/index.ts
- admin-harness.ts
- cbor.property.test.ts
- pack-install.mjs
- .concat
- demo-handlers.test.ts
- .value
- block-fetch-decode.test.ts
- library-documents.test.ts
- column-rules.ts
- ProcessContexts
- signal-ignored-fixtures.ts
- backbone/part-migrations.test.ts
- chrome.ts
- transaction-history-storage.property.test.ts
- HeightRun
- process-admin.ts
- resolver-boundary.ts
- readRuntimeMetadata
- database-fixtures.ts
- migrate.ts
- process-access.ts
- statementsOf
- node-refs.ts
- quiet-host.child.ts
- ledger/types.ts
- real-tapes.ts
- Session
- browser/src/config/load.ts
- checkParent
- ws-mutual-tls.test.ts
- src/db/postgres.ts
- history.property.test.ts
- Design — Sprint 1: project setup + TemporalKV
- .send
- builds.ts
- extrinsics.ts
- cli/backup.ts
- NodeClient
- pglite-directory-fixtures.ts
- spawnChild
- typescript
- signal-backup.worker.ts
- host.ts
- mounted.ts
- ledger-restart.worker.ts
- tape/index.ts
- mutation-evidence.d.mts
- channel-queue.test.ts
- process-build.ts
- UmbraError
- node-set.test.ts
- resolve.ts
- core-config.test.ts
- HeightActivity
- aborted
- library/modules.test.ts
- NodeFS
- database-parts.ts
- db/backends.ts
- core-ledger-state/sql.ts
- builder.test.ts
- height-versioned.test.ts
- validate.ts
- mounted-admin.test.ts
- .from
- FinalizedLoop
- LedgerPackage
- adapter.ts
- restore-ledger.ts
- roles.ts
- ref_node_timers
- refcount-model.ts
- vitest
- node-fields-harness.ts
- range.ts
- sweep-fixture.test.ts
- InMemoryBlockSource
- ledger/ledger-tasks.test.ts
- checks.test.ts
- api-session.test.ts
- cbor.ts
- core-ledger-state.ts
- contract-data-checks.ts
- opt-out.test.ts
- writer-lock-checks.ts
- boundary.test.ts
- ledger-graph-tapes.ts
- interfaces/transaction-history-storage.ts
- backup/backup.ts
- ledger-units.test.ts
- slow-block-harness.ts
- PgTransactionHistoryStorage
- config/history.ts
- validation.ts
- redact.ts
- refcount-restart.ts
- change-capture.ts
- transport.test.ts
- binding.test.ts
- config/plain-data.ts
- process-worker.ts
- transform-checks.ts
- halts.test.ts
- messages.ts
- private/lockstep-wait.test.ts
- loop-stop-harness.ts
- mapping.ts
- module-api.ts
- checkShape
- 4. Public API (`umbradb`)
- graph.ts
- retirement.test.ts
- pglite.ts
- shims.test.ts
- hex
- server.ts
- api-server.test.ts
- page.ts
- start-umbradb.ts
- ingest
- cold-boot-recovery.integration.test.ts
- ref_node_child_process
- history
- refused
- .off
- graph.py
- ADDED Requirements
- .slowBlockMs
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- config-check.test.ts
- loggingModule
- mutation-per-adapter.mjs
- twox.ts
- Design — v1.1.0: Quint model checking
- chain-events-decode.test.ts
- openssl
- Boundaries, threats and controls
- ref_node_worker_threads
- scoped-review-manifest
- path.ts
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- The laws of UmbraDB's storage helpers
- startUmbraDB
- .put
- version
- code
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- README.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Requirement: DT-3 The contents hash
- explore.md
- ROADMAP.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- [0.10.0] - 2026-10-27
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Requirement: BK-3 Restore into an empty database, checked before and after loading
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
- Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-infosec-signoff
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- dependencies
- lib.sh
- Vendored ledger builds
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
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
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Test wallets
- Spec — capability `formal-completion`
- renovate.json
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 464 edges
2. `UmbraError` - 357 edges
3. `ModuleDeclaration` - 213 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 139 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `Database` - 104 edges
9. `startUmbraDB()` - 103 edges
10. `PROCESS_BACKENDS` - 102 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts

## Import Cycles
- None detected.

## Communities (361 total, 29 thin omitted)

### Community 0 - "declaration.ts"
Cohesion: 0.02
Nodes (242): Database, BlockHeader, FieldKind, FieldSchema, ItemDeclaration, ItemSink, KnownPointsOnly, Lifetime (+234 more)

### Community 1 - "runner/process.ts"
Cohesion: 0.02
Nodes (105): Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, ChainIdentity (+97 more)

### Community 10 - "version-checks.ts"
Cohesion: 0.03
Nodes (116): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, Boundary, BoundaryBlock, builtInNetwork, Issue (+108 more)

### Community 102 - "file-mode.test.ts"
Cohesion: 0.08
Nodes (30): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+22 more)

### Community 103 - "process-harness.ts"
Cohesion: 0.09
Nodes (31): ChainDataView, Seen, ContextsClass, Process, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight() (+23 more)

### Community 104 - "2. Database API"
Cohesion: 0.08
Nodes (32): CheckedMigration, ModuleContentsError, RefusalPlace, refuseNonDeterministic(), moduleTables(), catalogRelations(), catalogTables(), schemaFilter() (+24 more)

### Community 105 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 11 - "ref_node_fs"
Cohesion: 0.04
Nodes (94): BackupBackend, killedRestore, TickerHandle, TickerProcess, BackupOnSignal, LoopClass, Pausable, RecorderGlobals (+86 more)

### Community 110 - "browser/build.ts"
Cohesion: 0.07
Nodes (27): BrowserBuild, BrowserBuildOptions, BrowserControl, checkedLedgers, pageBench, browserLedgerEntry(), browserPlugin(), buildBrowser() (+19 more)

### Community 112 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 113 - "PrivateLinkChannel"
Cohesion: 0.08
Nodes (28): PrivateLinkChannel, ChannelPrivateOptions, Link, discard(), isChannel(), connectChannel(), fault(), 00068 — Two readers of a host's channel beside the private link's endpoint read its members outside a guard (+20 more)

### Community 117 - "browser.test.ts"
Cohesion: 0.09
Nodes (31): Reachable, RestoreAttempt, PageRestore, NodeRunResult, heldClock, continuedProblems(), midChainProblems(), networkProblems() (+23 more)

### Community 118 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 119 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 12 - "BlockRef"
Cohesion: 0.03
Nodes (56): BlockHeaderItem, BlockEventSource, BlockItemSource, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, HeadWait, NodeBlockSource (+48 more)

### Community 122 - "ChannelEndpoint"
Cohesion: 0.14
Nodes (7): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), queuedSlowProblems(), 4. Channels

### Community 123 - "TransactionHistoryEntry"
Cohesion: 0.11
Nodes (12): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends (+4 more)

### Community 125 - "core-block-fetch/metadata.ts"
Cohesion: 0.10
Nodes (28): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive, RuntimeMetadataView (+20 more)

### Community 126 - "paused-harness.ts"
Cohesion: 0.13
Nodes (27): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, keeperModule() (+19 more)

### Community 128 - "ReadHandle"
Cohesion: 0.10
Nodes (17): StatsRow, Outcome, ReadHandle, PointCallbacks, insertRow(), lastTotal(), recentRows(), rowAt() (+9 more)

### Community 13 - "process-backends.ts"
Cohesion: 0.04
Nodes (107): FixtureRun, SourceClass, TableSnapshot, Touches, Reach, dagHistory, FacetOptions, Facets (+99 more)

### Community 130 - "sweep-tapes.ts"
Cohesion: 0.11
Nodes (16): ModelBatch, ModelSnapshot, SweepModel, SweepComparison, SweepComparisonSeen, TapeComparison, modelBatch(), sweepTapeCase() (+8 more)

### Community 131 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 132 - "core-block-commit.test.ts"
Cohesion: 0.09
Nodes (22): StandInOptions, Commit, Committed, blockFetchStandIn(), standInHeader(), standInItems(), a145Stored(), blockAt() (+14 more)

### Community 133 - "example-checks.ts"
Cohesion: 0.13
Nodes (20): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+12 more)

### Community 134 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 135 - "ModuleApi"
Cohesion: 0.11
Nodes (15): SubscriptionCarrier, SubscriptionConnection, ModuleApi, parseJsonLossless(), errorMessage(), socketConnection(), encodeJson(), hex() (+7 more)

### Community 136 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 138 - "channel-processes.ts"
Cohesion: 0.13
Nodes (24): NetworkRuleName, ChannelCoreOptions, Parsed, Expected, handleOf(), startedOf(), channelPrivate(), linkReadPublicDatabase() (+16 more)

### Community 139 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 14 - "client.test.ts"
Cohesion: 0.03
Nodes (74): Connection, NodeClientOptions, NodeRetry, NodeSocket, NodeSocketEvents, NodeTimers, SocketFailure, HandSocket (+66 more)

### Community 140 - "relays.ts"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 142 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.08
Nodes (21): ReadPool, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider) (+13 more)

### Community 143 - "cli/restore.ts"
Cohesion: 0.12
Nodes (23): RestoreChain, RestoreSeams, commandTarget, DatabaseState, ReadDatabaseOptions, Chain, RestoreCommandOptions, RestoreCommandSeams (+15 more)

### Community 144 - "restore-private.ts"
Cohesion: 0.15
Nodes (22): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+14 more)

### Community 145 - "node-bridge.ts"
Cohesion: 0.11
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 146 - "sigterm.test.ts"
Cohesion: 0.12
Nodes (22): Job, WorkEvent, WorkOptions, A48Observation, WORKER, Job, WorkerEvent, report() (+14 more)

### Community 147 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 148 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 149 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 15 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (120): BlockParsed, BlockParsedOptions, ChainEvent, itemsSeen, BlockSpec, EventSpec, Json, Scenario (+112 more)

### Community 152 - "cli/run.ts"
Cohesion: 0.11
Nodes (18): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, EngineInput, UserModulesSource (+10 more)

### Community 153 - "browser-harness.ts"
Cohesion: 0.15
Nodes (22): PageApiChannel, PageBackup, PageEvent, PageLink, ProcessName, StatusBody, apiChannel(), backupThrough() (+14 more)

### Community 154 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 155 - "crash.test.ts"
Cohesion: 0.11
Nodes (21): CrashEvent, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent, crashModule(), hex() (+13 more)

### Community 156 - "backupAtStop"
Cohesion: 0.11
Nodes (17): BackupText, createReadStream(), backupAtStop(), firstLine(), dumpLines(), blobChunks(), blobText(), firstLineOf() (+9 more)

### Community 158 - "deterministic-postgresql/index.ts"
Cohesion: 0.10
Nodes (21): GuardTableRow, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, optOut, integerCheckName() (+13 more)

### Community 16 - "admin-harness.ts"
Cohesion: 0.04
Nodes (116): EngineConfig, ProcessHandle, AdminRun, Answered, Answerer, Expected, Hold, Observation (+108 more)

### Community 161 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (23): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+15 more)

### Community 162 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 163 - ".concat"
Cohesion: 0.12
Nodes (12): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+4 more)

### Community 165 - "demo-handlers.test.ts"
Cohesion: 0.15
Nodes (17): Compared, ConnectSeen, PortPeer, comparedOfExchange(), comparedOfResponse(), connected(), engineOf(), fetchProblems() (+9 more)

### Community 166 - ".value"
Cohesion: 0.26
Nodes (7): ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 168 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), concatBytes(), encodeCompact() (+9 more)

### Community 169 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 17 - "column-rules.ts"
Cohesion: 0.02
Nodes (103): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+95 more)

### Community 170 - "ProcessContexts"
Cohesion: 0.11
Nodes (5): ProcessContexts, ProcessItems, SealedStart, names(), sealed()

### Community 171 - "signal-ignored-fixtures.ts"
Cohesion: 0.13
Nodes (18): ListenedRun, WorkerSignals, listenerProblems(), namesUnder(), pacedNode(), pacedTape(), runWorkerInChild(), signalLines() (+10 more)

### Community 172 - "backbone/part-migrations.test.ts"
Cohesion: 0.17
Nodes (18): FoldedPart, RecordedMigration, isObject(), readManifestLine(), earlierBackup(), earlierBootstrapSql(), earlierRefusalProblems(), earlierRows() (+10 more)

### Community 173 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 174 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 175 - "HeightRun"
Cohesion: 0.12
Nodes (8): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, CommitsDespiteLastWrite, WaitsInTransaction, ComputeAtH

### Community 18 - "process-admin.ts"
Cohesion: 0.04
Nodes (109): ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions (+101 more)

### Community 185 - "resolver-boundary.ts"
Cohesion: 0.18
Nodes (16): Boundary, Crossing, Guard, boundaryOf(), boundarySources(), guardedSymbols(), hostWith(), inRepository() (+8 more)

### Community 188 - "readRuntimeMetadata"
Cohesion: 0.40
Nodes (9): TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry(), storageEntry(), strings() (+1 more)

### Community 189 - "database-fixtures.ts"
Cohesion: 0.13
Nodes (10): CheckTarget, CliBackend, Snapshot, blocksSql(), pgliteCliBackend(), postgresCliBackend(), record(), rowsSql() (+2 more)

### Community 19 - "migrate.ts"
Cohesion: 0.03
Nodes (95): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, SchemaMigration (+87 more)

### Community 190 - "process-access.ts"
Cohesion: 0.20
Nodes (15): Access, AllowedRead, bare(), callsPathResolve(), checked(), declares(), inRepository(), inType() (+7 more)

### Community 191 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 195 - "node-refs.ts"
Cohesion: 0.29
Nodes (4): ChildReader, ChildVisitor, readChildList(), readChildren()

### Community 196 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 2 - "ledger/types.ts"
Cohesion: 0.03
Nodes (136): ApplyInput, ApplyOutput, LedgerPackageOptions, StateSummary, StoredNode, V9Logs, LedgerHeight, Upstream (+128 more)

### Community 20 - "real-tapes.ts"
Cohesion: 0.03
Nodes (84): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+76 more)

### Community 200 - "Session"
Cohesion: 0.21
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 202 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 203 - "checkParent"
Cohesion: 0.19
Nodes (11): AlwaysLanded, checkParent(), sameBytes(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix, 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first (+3 more)

### Community 208 - "ws-mutual-tls.test.ts"
Cohesion: 0.21
Nodes (8): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), read(), tlsClientErrors

### Community 21 - "src/db/postgres.ts"
Cohesion: 0.03
Nodes (83): BenchEnv, SslMode, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, driverConnectionOptions, DriverError (+75 more)

### Community 210 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 215 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 22 - "builds.ts"
Cohesion: 0.04
Nodes (93): PrivateIntakeOptions, A165Options, PrivateOptions, PrivateProcess, PrivateRefusal, PrivateSeen, PublicCore, InstanceHashes (+85 more)

### Community 227 - "extrinsics.ts"
Cohesion: 0.25
Nodes (9): BodyExtrinsic, ExtrinsicCall, BlockBody, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), isCompactU64() (+1 more)

### Community 228 - "cli/backup.ts"
Cohesion: 0.29
Nodes (10): Environment, BackupCommandOptions, BackupOutcome, backupArguments(), privateBySide(), runBackup(), declaredOptOuts(), openCommandDatabase() (+2 more)

### Community 23 - "NodeClient"
Cohesion: 0.05
Nodes (75): CoreChainBinding, FinalizedHeightOptions, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+67 more)

### Community 239 - "pglite-directory-fixtures.ts"
Cohesion: 0.29
Nodes (8): ProcessObservation, StartVia, committedIn(), processOn(), processProblems(), rowsIn(), S, control

### Community 24 - "spawnChild"
Cohesion: 0.02
Nodes (95): Served, ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts (+87 more)

### Community 247 - "typescript"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 248 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 25 - "host.ts"
Cohesion: 0.04
Nodes (83): LoadLedger, TransactionParser, RetainedState, LedgerName, ParsedTransaction, StateHandle, AppliedState, ApplyBlock (+75 more)

### Community 256 - "mounted.ts"
Cohesion: 0.39
Nodes (6): MountedAdminAnswer, headersOf(), mountedAdminFetch(), mountedAdminHandler(), exchange(), FAILED

### Community 257 - "ledger-restart.worker.ts"
Cohesion: 0.29
Nodes (7): RestartEvent, RestartJob, report(), handle, job, orphanGuard, poll

### Community 26 - "tape/index.ts"
Cohesion: 0.05
Nodes (75): Failure, Variant, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json (+67 more)

### Community 269 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 27 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (77): PublicSide, Envelope, LinkTimers, MessagePortLike, HelloAck, PrivateTransport, Waiter, controlledTimers (+69 more)

### Community 29 - "process-build.ts"
Cohesion: 0.04
Nodes (79): EngineBuild, EngineNetwork, watched, ChangedFile, GenesisFixture, installationCopy, PackageStartup, StartPackageProcess (+71 more)

### Community 3 - "UmbraError"
Cohesion: 0.03
Nodes (113): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, PrivateBlockSource, PrivateChecks, privateIntake (+105 more)

### Community 30 - "node-set.test.ts"
Cohesion: 0.04
Nodes (78): CaptureColumn, ContentOptions, TableContent, ModuleColumn, ModuleTable, ModuleTableOptions, PageOptions, ConsistentRead (+70 more)

### Community 31 - "resolve.ts"
Cohesion: 0.04
Nodes (87): coreEntry, plainData, AddressRequest, Asked, NetworkInput, NetworkProblem, NetworkRequest, NetworkRule (+79 more)

### Community 32 - "core-config.test.ts"
Cohesion: 0.04
Nodes (75): AdminEndpoint, AdminPart, BlockRow, ReadinessFacts, LifecycleStatus, ProcessState, ChainBuildOptions, ChainOptions (+67 more)

### Community 322 - "HeightActivity"
Cohesion: 0.60
Nodes (3): HeightActivity, NeverClears, NeverClears

### Community 323 - "aborted"
Cohesion: 0.40
Nodes (3): DoesNotHold, EndsTheRun, aborted()

### Community 33 - "library/modules.test.ts"
Cohesion: 0.04
Nodes (61): UmbraDBHandle, CloseHelper, Hold, Signal, Job, Run, FaultedClose, QuietResult (+53 more)

### Community 34 - "database-parts.ts"
Cohesion: 0.04
Nodes (61): AdminStarter, DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, TickerConfig, PausableConfig, Keeping (+53 more)

### Community 35 - "db/backends.ts"
Cohesion: 0.04
Nodes (62): ConfiguredDatabaseOptions, CommittedHeight, TestBackend, TestDatabase, Case, LoadOutcome, OutsideRead, Traced (+54 more)

### Community 36 - "core-ledger-state/sql.ts"
Cohesion: 0.04
Nodes (82): NodeSetFault, NodeSetOptions, NodeTableCheck, KeyCounts, RefcountStatement, refcountStep, RefcountTables, StateRow (+74 more)

### Community 37 - "builder.test.ts"
Cohesion: 0.04
Nodes (48): PageServer, ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata (+40 more)

### Community 39 - "height-versioned.test.ts"
Cohesion: 0.04
Nodes (67): cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Migration, BlockOptions (+59 more)

### Community 4 - "validate.ts"
Cohesion: 0.02
Nodes (154): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettings (+146 more)

### Community 40 - "mounted-admin.test.ts"
Cohesion: 0.04
Nodes (73): adminRoutes, gate, SecretHashes, SecretVariant, Expected, SubscriptionSeen, Client, Exchanged (+65 more)

### Community 41 - ".from"
Cohesion: 0.05
Nodes (82): LedgerEvent, TransactionResult, VmLog, eventsRuntime, ledgerItemsSeen, SeenLoad, retentionSeen, ledgerScenario (+74 more)

### Community 42 - "FinalizedLoop"
Cohesion: 0.05
Nodes (25): EntryBoundary, Activity, FinalizedLoop, LoopObserver, UnexpectedCursor, Startup, SkipsLockstep, WaitingInRead (+17 more)

### Community 43 - "LedgerPackage"
Cohesion: 0.05
Nodes (44): LedgerPackage, LedgerTask, LedgerTaskBlock, EngineOptions, LedgerEngine, LedgerTaskFailed, Driver, stagenetReplay (+36 more)

### Community 44 - "adapter.ts"
Cohesion: 0.04
Nodes (69): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+61 more)

### Community 45 - "restore-ledger.ts"
Cohesion: 0.04
Nodes (80): RestoreInput, contentsHash, Ran, handoff, HandoffAt, FileEntries, Cbor, DigestRow (+72 more)

### Community 46 - "roles.ts"
Cohesion: 0.04
Nodes (67): Difference, OwnPart, PlannedSchema, Provision, QualifiedTable, SchemaItem, SchemaModule, MigrationRow (+59 more)

### Community 47 - "ref_node_timers"
Cohesion: 0.05
Nodes (59): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, CommandResult, Renamed, RunningCommand, statsConfig (+51 more)

### Community 48 - "refcount-model.ts"
Cohesion: 0.05
Nodes (53): BlockKind, BlockScript, BoundaryRewrite, Dice, DrivenBlock, GeneratedBlock, GeneratedState, GraphNode (+45 more)

### Community 49 - "vitest"
Cohesion: 0.03
Nodes (54): Finding, Lockfile, Manifest, RepositoryFile, Upstream, Leftover, RemovedName, partsOf() (+46 more)

### Community 5 - "node-fields-harness.ts"
Cohesion: 0.03
Nodes (136): ProcessCondition, Validator, A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader (+128 more)

### Community 51 - "range.ts"
Cohesion: 0.05
Nodes (61): ConnectSocket, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments (+53 more)

### Community 52 - "sweep-fixture.test.ts"
Cohesion: 0.06
Nodes (67): Fault, FaultRun, DagRunOptions, Child, extendedCases, FixtureDag, NodeContent, ExtendedState (+59 more)

### Community 53 - "InMemoryBlockSource"
Cohesion: 0.05
Nodes (51): InMemoryBlockSource, InMemoryItems, Wait, WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation (+43 more)

### Community 54 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (58): Call, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses() (+50 more)

### Community 55 - "checks.test.ts"
Cohesion: 0.05
Nodes (54): SchemaPlan, Settings, Run, Job, WorkerEvent, Case, Outcome, helperDatabase (+46 more)

### Community 57 - "api-session.test.ts"
Cohesion: 0.07
Nodes (61): coreHeaders, HeadersArgument, NodeHttpHandler, NodeUpgradeHandler, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules (+53 more)

### Community 58 - "cbor.ts"
Cohesion: 0.06
Nodes (61): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+53 more)

### Community 59 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (56): ComputedBlock, LedgerBinding, LedgerStateItem, retainedStates, CoreRevision, ContractKeys, blockHeaderOf(), ledgerVersionOf() (+48 more)

### Community 6 - "contract-data-checks.ts"
Cohesion: 0.03
Nodes (136): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+128 more)

### Community 60 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (53): PlacedRefusal, Refusal, Chain, Op, States, TableName, captureFunction(), moduleM() (+45 more)

### Community 61 - "writer-lock-checks.ts"
Cohesion: 0.07
Nodes (51): WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), blocksIn(), cleanUp() (+43 more)

### Community 62 - "boundary.test.ts"
Cohesion: 0.07
Nodes (49): DesignTable, RowCoverage, ModuleReference, Finding, collationsWritten(), componentCode(), componentExports(), componentTexts() (+41 more)

### Community 63 - "ledger-graph-tapes.ts"
Cohesion: 0.07
Nodes (50): CoreLedgerStateOptions, RefcountCheck, RefcountFault, NodeBatch, FixtureRunOptions, Reader, Seen, workerRecord (+42 more)

### Community 64 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (42): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, JsonEncoded (+34 more)

### Community 65 - "backup/backup.ts"
Cohesion: 0.08
Nodes (52): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+44 more)

### Community 66 - "ledger-units.test.ts"
Cohesion: 0.06
Nodes (46): ManifestLine, Path, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage() (+38 more)

### Community 67 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (48): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+40 more)

### Community 68 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (51): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 2. Dependency direction: structural mirror, not a runtime import (+43 more)

### Community 7 - "config/history.ts"
Cohesion: 0.03
Nodes (133): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, versionEntry, HistoryCheck, HistoryCode, HistoryContext, HistoryOptions (+125 more)

### Community 70 - "validation.ts"
Cohesion: 0.04
Nodes (47): DeclarationRule, PlacedDeclaration, Plain, Accepts, Rest, WithKnownPoints, WithUnknownPoint, Case (+39 more)

### Community 71 - "redact.ts"
Cohesion: 0.07
Nodes (45): ConfigFinding, RedactionForms, SecretForm, TextPattern, Needs, findings(), configurationRefused(), databaseText() (+37 more)

### Community 72 - "refcount-restart.ts"
Cohesion: 0.05
Nodes (44): BatchJson, databaseNow, Hold, Light, Line, NodeSetKeeper, Observed, observedRun (+36 more)

### Community 73 - "change-capture.ts"
Cohesion: 0.08
Nodes (48): TableDigest, TableDigestRow, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow, capturedOf() (+40 more)

### Community 74 - "transport.test.ts"
Cohesion: 0.07
Nodes (34): ReadOnlyDatabase, Message, Pem, TestCertificates, Ended, rawClient, Escape, publicState (+26 more)

### Community 75 - "binding.test.ts"
Cohesion: 0.07
Nodes (43): startHashDecision, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding, Created (+35 more)

### Community 76 - "config/plain-data.ts"
Cohesion: 0.06
Nodes (38): ImportedConfig, LoadOptions, PlainArray, PlainDataNode, PlainDataRule, Walk, Row, configModules() (+30 more)

### Community 77 - "process-worker.ts"
Cohesion: 0.06
Nodes (38): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, Scope, crossedError, StartRun, ToProcessWorker (+30 more)

### Community 78 - "transform-checks.ts"
Cohesion: 0.10
Nodes (33): TransformError, NotificationRange, baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectVariantOutput(), forkRecords(), header() (+25 more)

### Community 79 - "halts.test.ts"
Cohesion: 0.05
Nodes (46): ProcessingEnd, ProcessStatus, Q142Observation, A43Case, A43Observation, CursorElsewhere, Halt, Outcome (+38 more)

### Community 8 - "messages.ts"
Cohesion: 0.02
Nodes (112): PrivateLinkAddress, PrivateLinkConnect, EndpointOptions, CoreChannelSeams, CoreChannelsOptions, Queued, Connected, CoreTransportOptions (+104 more)

### Community 80 - "private/lockstep-wait.test.ts"
Cohesion: 0.07
Nodes (29): InstanceView, PrivateInstance, Entry, Lockstep, LockstepCondition, LockstepInstance, LockstepOptions, LockstepRefusal (+21 more)

### Community 81 - "loop-stop-harness.ts"
Cohesion: 0.09
Nodes (39): A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore (+31 more)

### Community 82 - "mapping.ts"
Cohesion: 0.07
Nodes (34): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+26 more)

### Community 83 - "module-api.ts"
Cohesion: 0.06
Nodes (34): ReadOptions, ModuleApiStart, ApiError, ApiErrorCode, ApiRequest, ApiResponse, ApiRoutes, ApiStartup (+26 more)

### Community 84 - "checkShape"
Cohesion: 0.07
Nodes (40): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+32 more)

### Community 85 - "4. Public API (`umbradb`)"
Cohesion: 0.06
Nodes (41): demoLink, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork, UmbraDBOptions, UmbraDBReason (+33 more)

### Community 86 - "graph.ts"
Cohesion: 0.07
Nodes (46): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+38 more)

### Community 87 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 88 - "pglite.ts"
Cohesion: 0.08
Nodes (19): AsyncLocalStorage, AsyncResource, MultiStatementRunner, Job, JobQueue, Outcome, PgliteDatabase, ServerErrorFields (+11 more)

### Community 89 - "shims.test.ts"
Cohesion: 0.07
Nodes (28): PgliteLockUse, Buffer, BufferEncoding, Hash, sha256, acquirePgliteLock(), lockHeld(), pgliteLockFile() (+20 more)

### Community 9 - "hex"
Cohesion: 0.03
Nodes (113): nodeKeys, FixtureConfig, FreshInstanceRequest, FreshInstanceResult, StoredNode, Reader, NodeKeyTape, Written (+105 more)

### Community 90 - "server.ts"
Cohesion: 0.08
Nodes (29): AdminSeams, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+21 more)

### Community 91 - "api-server.test.ts"
Cohesion: 0.08
Nodes (31): ApiRegistry, ChainDataAnswer, HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, AppendsVersion, Client (+23 more)

### Community 92 - "page.ts"
Cohesion: 0.06
Nodes (34): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+26 more)

### Community 95 - "start-umbradb.ts"
Cohesion: 0.11
Nodes (39): readOptions, addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding(), guarded(), isAbortSignal() (+31 more)

### Community 96 - "ingest"
Cohesion: 0.08
Nodes (35): ingest, TasksRun, WindowBackup, nodeSourceOf(), run(), report(), tipWriter(), committed() (+27 more)

### Community 98 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 99 - "ref_node_child_process"
Cohesion: 0.07
Nodes (29): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, ChildResult, acquirePgliteLock() (+21 more)

### Community 38 - "history"
Cohesion: 0.03
Nodes (90): integer(), history(), params(), data(), 7. The module API, 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8), 2.3 Invariants (+82 more)

### Community 50 - "refused"
Cohesion: 0.03
Nodes (74): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+66 more)

### Community 107 - ".off"
Cohesion: 0.05
Nodes (35): Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases (+27 more)

### Community 109 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 120 - ".slowBlockMs"
Cohesion: 0.07
Nodes (30): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+22 more)

### Community 127 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.06
Nodes (30): deferred(), Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log, The five stages (+22 more)

### Community 182 - "config-check.test.ts"
Cohesion: 0.16
Nodes (14): configText(), coreSettings(), inChild(), treeOf(), core(), fileOf(), check(), coreOnly() (+6 more)

### Community 184 - "loggingModule"
Cohesion: 0.13
Nodes (18): busy(), holder(), withRoute(), migrating(), waiting(), module(), leaking(), holding() (+10 more)

### Community 194 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 201 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 207 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 209 - "chain-events-decode.test.ts"
Cohesion: 0.23
Nodes (11): chainEventsOf(), metadataView(), fill(), hexOf(), le(), merge(), rotl(), round() (+3 more)

### Community 213 - "openssl"
Cohesion: 0.20
Nodes (11): locked(), openssl(), 6. Nix — nixpkgs packages (from the locked nixpkgs), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known (+3 more)

### Community 214 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 226 - "ref_node_worker_threads"
Cohesion: 0.22
Nodes (8): hex(), hex(), requested, store, stored, requested, store, stored

### Community 230 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 240 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 250 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 259 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 262 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.33
Nodes (6): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers

### Community 28 - "startUmbraDB"
Cohesion: 0.03
Nodes (93): text(), transportReader(), transportReaderRule(), startUmbraDB(), libraryCore(), readerOf(), log(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever (+85 more)

### Community 56 - ".put"
Cohesion: 0.03
Nodes (67): coreBlockFetchOnFetch(), T(), input(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix (+59 more)

### Community 69 - "version"
Cohesion: 0.04
Nodes (53): side(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules (+45 more)

### Community 93 - "code"
Cohesion: 0.05
Nodes (42): code(), Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in) (+34 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning (+33 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 108 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+29 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 124 - "package.json"
Cohesion: 0.06
Nodes (32): bin, umbradb, bugs, url, description, optional, engines, node (+24 more)

### Community 129 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 150 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 151 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 159 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 164 - "Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.09
Nodes (22): 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words, 4.1 Reachability does not depend on the form (+14 more)

### Community 167 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 180 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 181 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 183 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 186 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 187 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 192 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 193 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+6 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 198 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 199 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 204 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 205 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 206 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 211 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 212 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 216 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 217 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.17
Nodes (11): 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents, 7. `core-arch` criteria rewritten by this change, 8. Required test ids (+3 more)

### Community 219 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 220 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 221 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 222 - "README.md"
Cohesion: 0.29
Nodes (3): Choosing a database, Launching it, stats-module

### Community 223 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 224 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 225 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 229 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 231 - "ROADMAP.md"
Cohesion: 0.20
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 232 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 233 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 234 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 235 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 236 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 237 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 238 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 241 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 242 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 243 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 244 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 245 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 246 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.22
Nodes (8): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution, Design — v1.0.0-perf-baseline

### Community 249 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 251 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 252 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 253 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 254 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 255 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 258 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 260 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 261 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 263 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 264 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 265 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 266 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 267 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 268 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 270 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 271 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 272 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 273 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 274 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 275 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 276 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 277 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 278 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 279 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 280 - "Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`), What changes, Why

### Community 281 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 282 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 283 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 284 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 285 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 286 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 287 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 288 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 289 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 290 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 291 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 292 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 293 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 294 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 295 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 296 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 297 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 298 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 299 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 300 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 301 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 302 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 303 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 304 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 305 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 306 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 307 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 308 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 309 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 310 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 311 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 312 - "00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it"
Cohesion: 0.40
Nodes (4): 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it, Evidence, Problem, Suggested fix

### Community 313 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 314 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 315 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 316 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 317 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 318 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 319 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 320 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 321 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 324 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 325 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 326 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.50
Nodes (3): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Problem, Suggested fix

### Community 327 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 328 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 329 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 330 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 331 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 332 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 333 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-3339`, `RFC-3339`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4360 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `declaration.ts`, `runner/process.ts`, `ledger/types.ts`, `UmbraError`, `validate.ts`, `node-fields-harness.ts`, `contract-data-checks.ts`, `config/history.ts`, `messages.ts`, `hex`, `version-checks.ts`, `ref_node_fs`, `BlockRef`, `process-backends.ts`, `client.test.ts`, `core-block-parsed.ts`, `admin-harness.ts`, `column-rules.ts`, `process-admin.ts`, `migrate.ts`, `real-tapes.ts`, `src/db/postgres.ts`, `builds.ts`, `NodeClient`, `spawnChild`, `host.ts`, `tape/index.ts`, `channel-queue.test.ts`, `process-build.ts`, `node-set.test.ts`, `resolve.ts`, `core-config.test.ts`, `library/modules.test.ts`, `database-parts.ts`, `db/backends.ts`, `core-ledger-state/sql.ts`, `builder.test.ts`, `height-versioned.test.ts`, `mounted-admin.test.ts`, `.from`, `adapter.ts`, `restore-ledger.ts`, `roles.ts`, `ref_node_timers`, `refcount-model.ts`, `sweep-fixture.test.ts`, `InMemoryBlockSource`, `ledger/ledger-tasks.test.ts`, `checks.test.ts`, `api-session.test.ts`, `cbor.ts`, `core-ledger-state.ts`, `opt-out.test.ts`, `writer-lock-checks.ts`, `boundary.test.ts`, `ledger-graph-tapes.ts`, `interfaces/transaction-history-storage.ts`, `backup/backup.ts`, `ledger-units.test.ts`, `slow-block-harness.ts`, `validation.ts`, `redact.ts`, `refcount-restart.ts`, `change-capture.ts`, `transport.test.ts`, `binding.test.ts`, `config/plain-data.ts`, `transform-checks.ts`, `halts.test.ts`, `private/lockstep-wait.test.ts`, `loop-stop-harness.ts`, `mapping.ts`, `module-api.ts`, `retirement.test.ts`, `shims.test.ts`, `server.ts`, `api-server.test.ts`, `start-umbradb.ts`, `ingest`, `cold-boot-recovery.integration.test.ts`, `ref_node_child_process`, `file-mode.test.ts`, `process-harness.ts`, `test/postgres/setup.ts`, `browser/build.ts`, `Worker`, `browser.test.ts`, `release-version.ts`, `core.ts`, `package.json`, `sweep-tapes.ts`, `pg-tx-history-adapter.ts`, `core-block-commit.test.ts`, `example-checks.ts`, `documents.ts`, `code-registry.ts`, `channel-processes.ts`, `read-gate.ts`, `restore-private.ts`, `node-bridge.ts`, `sigterm.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `cli/run.ts`, `surface.test.ts`, `crash.test.ts`, `backupAtStop`, `cbor.property.test.ts`, `demo-handlers.test.ts`, `block-fetch-decode.test.ts`, `library-documents.test.ts`, `backbone/part-migrations.test.ts`, `transaction-history-storage.property.test.ts`, `excluded-not-exported.test.ts`, `config-check.test.ts`, `resolver-boundary.ts`, `process-access.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `twox.ts`, `ws-mutual-tls.test.ts`, `chain-events-decode.test.ts`, `history.property.test.ts`, `pglite-directory-fixtures.ts`, `mounted.ts`?**
  _High betweenness centrality (0.203) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `@stryker-mutator/core` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `declaration.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017809561128526646 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `declaration.ts`, `runner/process.ts`, `validate.ts`, `node-fields-harness.ts`, `contract-data-checks.ts`, `config/history.ts`, `messages.ts`, `version-checks.ts`, `ref_node_fs`, `BlockRef`, `process-backends.ts`, `client.test.ts`, `admin-harness.ts`, `process-admin.ts`, `migrate.ts`, `src/db/postgres.ts`, `builds.ts`, `NodeClient`, `tape/index.ts`, `channel-queue.test.ts`, `startUmbraDB`, `process-build.ts`, `node-set.test.ts`, `resolve.ts`, `core-config.test.ts`, `library/modules.test.ts`, `db/backends.ts`, `core-ledger-state/sql.ts`, `height-versioned.test.ts`, `mounted-admin.test.ts`, `.from`, `FinalizedLoop`, `LedgerPackage`, `restore-ledger.ts`, `roles.ts`, `ref_node_timers`, `refcount-model.ts`, `range.ts`, `sweep-fixture.test.ts`, `InMemoryBlockSource`, `checks.test.ts`, `cbor.ts`, `core-ledger-state.ts`, `opt-out.test.ts`, `writer-lock-checks.ts`, `backup/backup.ts`, `ledger-units.test.ts`, `slow-block-harness.ts`, `validation.ts`, `redact.ts`, `transport.test.ts`, `binding.test.ts`, `config/plain-data.ts`, `transform-checks.ts`, `halts.test.ts`, `mapping.ts`, `module-api.ts`, `checkShape`, `4. Public API (`umbradb`)`, `graph.ts`, `pglite.ts`, `shims.test.ts`, `api-server.test.ts`, `start-umbradb.ts`, `ingest`, `ref_node_child_process`, `process-harness.ts`, `2. Database API`, `Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)`, `core-block-commit.test.ts`, `cli/restore.ts`, `backupAtStop`, `ProcessContexts`, `backbone/part-migrations.test.ts`, `statementsOf`, `Session`, `browser/src/config/load.ts`, `checkParent`, `cli/backup.ts`, `pglite-directory-fixtures.ts`, `aborted`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `runner/process.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01986524668550315 - nodes in this community are weakly interconnected._