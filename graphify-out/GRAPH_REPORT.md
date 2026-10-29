# Graph Report - UmbraDB

## Corpus Check
- 1087 files · ~1,518,138 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11336 nodes · 34586 edges · 343 communities (311 shown, 32 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2661 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `af8bdea42967831d` (1087 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- ref_node_fs
- InMemoryBlockSource
- declaration.ts
- ingest-harness.ts
- browser/build.ts
- pg-tx-history-adapter.ts
- ingest-faults.test.ts
- node-fields-harness.ts
- .concat
- browser.test.ts
- column-rules.ts
- checks.test.ts
- code-registry.ts
- config-check.ts
- file-modes.ts
- test/postgres/setup.ts
- postgres/transaction-history-storage.ts
- documents.ts
- interfaces/transaction-history-storage.ts
- FinalizedLoop
- ledger-sweep.test.ts
- config/plain-data.ts
- Lockstep
- read-gate.ts
- core.ts
- mapping.ts
- core-chain-events.ts
- tape/index.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- crash.test.ts
- node-bridge.ts
- core-block-fetch/metadata.ts
- PgliteDatabase
- loggingModule
- ref_node_http
- db/api.ts
- src/ledger/identity.ts
- TransactionHistoryEntry
- pack-install.mjs
- example-checks.ts
- status-schema.test.ts
- readiness.test.ts
- .value
- record-and-replay.test.ts
- Buffer
- ledger-table-config.test.ts
- browser-harness.ts
- order.property.test.ts
- chrome.ts
- key-handling-checks.ts
- transaction-history-storage.property.test.ts
- items.ts
- lockstep-refusals.test.ts
- signal-ignored-fixtures.ts
- NodeBlockSource
- LoopPauses
- private/lockstep-wait.test.ts
- ws-mutual-tls.test.ts
- stats-module.ts
- NodeClient
- readRuntimeMetadata
- version-table.ts
- surface.test.ts
- Design — Sprint 1: project setup + TemporalKV
- statementsOf
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- DatabaseParts
- no-indexer-or-wallet-sdk.test.ts
- browser/serve.ts
- web-lock.ts
- Session
- worker-threads.test.ts
- migrate.ts
- .from
- history.property.test.ts
- component-table.test.ts
- worker-threads-worker.ts
- Worker
- core-transport.ts
- childRefKeys
- .send
- TapeAnswers
- blobText
- module-tables.ts
- Heartbeat
- sweepStep
- transport-intake.test.ts
- Writer
- compare.ts
- sha256
- client.test.ts
- type-check.ts
- loop.test.ts
- devnet-upgrade.test.ts
- fetch-fixtures.ts
- mutation-evidence.d.mts
- BlockSource
- AsyncLocalStorage
- runner/process.ts
- builder.test.ts
- cbor.ts
- vitest
- ledger/types.ts
- db/backends.ts
- BYTE_ORDER
- https.ts
- writer-lock-checks.ts
- NodeFS
- contract-modules.test.ts
- history.test.ts
- snapshot.test.ts
- process-context.test.ts
- PgTransactionHistoryStorage
- contract-data-checks.ts
- transport-faults.test.ts
- database-parts.ts
- range.ts
- configured.ts
- loop-stop-harness.ts
- config/history.ts
- chain-data-tapes.ts
- refused-configuration.test.ts
- core-block-parsed.ts
- slow-block-harness.ts
- ModuleDeclaration
- adapter-fixtures.ts
- paused-harness.ts
- loop.ts
- ledger-storage.test.ts
- admin-harness.ts
- ledger/ledger-tasks.test.ts
- UmbraError
- entries.ts
- api-server.test.ts
- sweep-tapes.ts
- private/backends.ts
- Process
- backup/backup.ts
- intake.test.ts
- net.test.ts
- validate.test.ts
- version-checks.ts
- binding.test.ts
- transform-checks.ts
- opt-out.test.ts
- builds.ts
- core-ledger-state.ts
- LedgerEngine
- process-worker.ts
- retirement.test.ts
- checkShape
- core-settings.ts
- height-versioned.test.ts
- graph.ts
- host.ts
- validate.ts
- admin/types.ts
- default.test.ts
- chain-data.test.ts
- backup/restore.ts
- boundary.test.ts
- core-ledger-state/sql.ts
- networks.ts
- release-version.ts
- page.ts
- Proposal — Sprint 3: CheckpointStore
- following
- block-fetch-decode.test.ts
- mapping.test.ts
- .slowBlockMs
- UmbraDB module guide
- .query
- Boundaries, threats and controls
- core-ledger-state.test.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- twox.ts
- Design — v1.1.0: Quint model checking
- placement.ts
- UmbraDB third-party component inventory (SBOM)
- test-processes.test.ts
- path.ts
- backupAtStop
- midnight-env — reproducible PREPROD dev environment
- readPrivateCursor
- orphan-watcher.mjs
- crash-worker.ts
- history
- version
- code
- .put
- cold-boot-recovery.integration.test.ts
- ADDED Requirements
- T
- graph.py
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- README.md
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- Requirement: BK-1 Backup
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- Design — Sprint 4: Watermarks
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- [0.9.5] - 2026-07-25 — "Penumbra"
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Repository agent policy
- Contributing
- UmbraDB in a browser
- UmbraDB operator guide
- stats-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Midnight Foundation Security Policy
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
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
- Problem
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
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
- bug-report.md
- feature-request.md
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
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
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 373 edges
2. `UmbraError` - 314 edges
3. `ModuleDeclaration` - 177 edges
4. `FinalizedLoop` - 133 edges
5. `InMemoryBlockSource` - 120 edges
6. `NodeClient` - 113 edges
7. `Database` - 101 edges
8. `BlockRef` - 97 edges
9. `ReadHandle` - 91 edges
10. `NodeBlockSource` - 81 edges

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

## Communities (343 total, 32 thin omitted)

### Community 0 - "ref_node_fs"
Cohesion: 0.03
Nodes (135): BackupBackend, BackupDatabase, killedRestore, TickerProcess, BackupOnSignal, LoopClass, Pausable, RecorderGlobals (+127 more)

### Community 1 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (149): InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job, WorkerEvent, A77Observation (+141 more)

### Community 10 - "declaration.ts"
Cohesion: 0.03
Nodes (105): BlockRow, KnownPointsOnly, TableDeclaration, DeclarationRule, PlacedDeclaration, Plain, ChainBuildOptions, Accepts (+97 more)

### Community 100 - "ingest-harness.ts"
Cohesion: 0.10
Nodes (31): BlockHeader, SourceShared, CrashEvent, CrashJob, IngestOptions, SourceClass, watched, RestartEvent (+23 more)

### Community 101 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 102 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (24): LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+16 more)

### Community 103 - "ingest-faults.test.ts"
Cohesion: 0.08
Nodes (24): NodeCallOptions, ProcessCondition, RecordingClient, A84Observation, LoggedRetry, OutageObservation, RetrySample, open() (+16 more)

### Community 104 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (27): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+19 more)

### Community 107 - ".concat"
Cohesion: 0.08
Nodes (21): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+13 more)

### Community 109 - "browser.test.ts"
Cohesion: 0.10
Nodes (30): Reachable, RestoreAttempt, PageRestore, continuedProblems(), midChainProblems(), networkProblems(), plain(), restoreProblems() (+22 more)

### Community 11 - "column-rules.ts"
Cohesion: 0.02
Nodes (110): DumpInput, ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction (+102 more)

### Community 110 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, integer(), checkFunctionsSql() (+14 more)

### Community 111 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 113 - "config-check.ts"
Cohesion: 0.10
Nodes (25): CheckFinding, StepName, StepReport, StepStatus, ConfigFinding, databaseFinding(), declarationFinding(), declarationPath() (+17 more)

### Community 114 - "file-modes.ts"
Cohesion: 0.09
Nodes (25): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+17 more)

### Community 115 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 116 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+11 more)

### Community 117 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 118 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (22): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus, TransactionHistoryWriter (+14 more)

### Community 12 - "FinalizedLoop"
Cohesion: 0.03
Nodes (41): BlockRef, EntryBoundary, PointRun, InMemorySourceOptions, Activity, CommitOutcome, FinalizedLoop, HeightRun (+33 more)

### Community 121 - "ledger-sweep.test.ts"
Cohesion: 0.13
Nodes (14): SweepState, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel, bigints(), compare() (+6 more)

### Community 122 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 123 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 124 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 125 - "core.ts"
Cohesion: 0.13
Nodes (21): CommitOptions, PostgresRun, BenchEnv, ManualOpts, TinybenchOpts, Backend, Baseline, LatencyStats (+13 more)

### Community 126 - "mapping.ts"
Cohesion: 0.13
Nodes (26): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+18 more)

### Community 127 - "core-chain-events.ts"
Cohesion: 0.12
Nodes (24): BlockEventSource, systemEventsKey(), boundEventSource(), chainEventsOf(), coreChainEventsOnFetch(), metadataView(), runtimeMetadataOf(), writeEventRows() (+16 more)

### Community 13 - "tape/index.ts"
Cohesion: 0.04
Nodes (87): Recorded, Failure, Variant, Link, TapeBuilderOptions, RecordingProblem, TapeError, TapeProblem (+79 more)

### Community 130 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 131 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 132 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 133 - "crash.test.ts"
Cohesion: 0.12
Nodes (22): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+14 more)

### Community 134 - "node-bridge.ts"
Cohesion: 0.12
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 135 - "core-block-fetch/metadata.ts"
Cohesion: 0.12
Nodes (20): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive, RecordTypes (+12 more)

### Community 136 - "PgliteDatabase"
Cohesion: 0.18
Nodes (6): JobQueue, PgliteDatabase, handleClosed(), failedEarlier(), nestedCall(), openOn()

### Community 137 - "loggingModule"
Cohesion: 0.11
Nodes (22): AdminRun, busy(), holder(), withRoute(), migrating(), secretDatabase(), secretProblems(), module() (+14 more)

### Community 139 - "ref_node_http"
Cohesion: 0.12
Nodes (8): Report, HeldLink, HoldingRelay, ReportRelay, hostPort(), sendable(), typeOf(), RFC-6455

### Community 14 - "db/api.ts"
Cohesion: 0.03
Nodes (82): BlockWriteHandle, Database, ReadHandle, ReadOptions, SchemaWriteHandle, ErrorCode, cursorTable, CursorTableOptions (+74 more)

### Community 140 - "src/ledger/identity.ts"
Cohesion: 0.16
Nodes (22): ManifestLine, VerifyLedgerPackagesOptions, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkPackageFiles(), manifestSha256(), mismatch() (+14 more)

### Community 142 - "TransactionHistoryEntry"
Cohesion: 0.15
Nodes (11): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends (+3 more)

### Community 144 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 145 - "example-checks.ts"
Cohesion: 0.16
Nodes (17): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+9 more)

### Community 147 - "status-schema.test.ts"
Cohesion: 0.13
Nodes (16): StatusBody, Validator, BodyRead, answerAdmin(), statusOf(), schemaFile(), text(), validatorOf() (+8 more)

### Community 148 - "readiness.test.ts"
Cohesion: 0.13
Nodes (15): ReadinessFacts, ProcessState, gate, Decision, ReadinessCase, ae4(), caseText(), readinessProblems() (+7 more)

### Community 149 - ".value"
Cohesion: 0.26
Nodes (7): ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 15 - "record-and-replay.test.ts"
Cohesion: 0.03
Nodes (73): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+65 more)

### Community 153 - "Buffer"
Cohesion: 0.14
Nodes (13): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+5 more)

### Community 157 - "ledger-table-config.test.ts"
Cohesion: 0.19
Nodes (19): Answers, H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts(), haltOf() (+11 more)

### Community 159 - "browser-harness.ts"
Cohesion: 0.20
Nodes (19): PageBackup, PageEvent, ProcessName, StatusBody, backupThrough(), byDeadline(), call(), eventsOf() (+11 more)

### Community 16 - "order.property.test.ts"
Cohesion: 0.03
Nodes (103): ItemSink, PointName, GraphInput, LateUse, PointArguments, Misuse, SlowBlockCondition, PastFaultCase (+95 more)

### Community 160 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 161 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 163 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 164 - "items.ts"
Cohesion: 0.16
Nodes (15): BlockHeaderItem, BodyExtrinsic, ExtrinsicCall, BlockBody, CoreBlockHeader, CoreBlockItems, RuntimeMetadataView, blockTimeOf() (+7 more)

### Community 165 - "lockstep-refusals.test.ts"
Cohesion: 0.22
Nodes (18): LockstepCondition, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn(), haltOf() (+10 more)

### Community 169 - "signal-ignored-fixtures.ts"
Cohesion: 0.15
Nodes (15): ListenedRun, WorkerSignals, listenerProblems(), namesUnder(), runWorkerInChild(), signalLines(), sigusr2Ignored(), watched() (+7 more)

### Community 17 - "NodeBlockSource"
Cohesion: 0.04
Nodes (46): BlockLedgerSource, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, QueuedBlock, LedgerBinding, NodeSubscription (+38 more)

### Community 173 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 175 - "private/lockstep-wait.test.ts"
Cohesion: 0.20
Nodes (13): ExpectedWait, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf(), rowsIn(), sampleWait() (+5 more)

### Community 176 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (12): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+4 more)

### Community 177 - "stats-module.ts"
Cohesion: 0.20
Nodes (13): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+5 more)

### Community 18 - "NodeClient"
Cohesion: 0.05
Nodes (65): CoreChainBinding, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+57 more)

### Community 180 - "readRuntimeMetadata"
Cohesion: 0.40
Nodes (9): TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry(), storageEntry(), strings() (+1 more)

### Community 181 - "version-table.ts"
Cohesion: 0.25
Nodes (16): LedgerPin, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin(), freezeRow(), hexOf() (+8 more)

### Community 182 - "surface.test.ts"
Cohesion: 0.20
Nodes (15): Surface, coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), runtimeValues(), section12(), section12Surface() (+7 more)

### Community 183 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 186 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 188 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.17
Nodes (9): ReadPool, Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically (+1 more)

### Community 19 - "DatabaseParts"
Cohesion: 0.03
Nodes (81): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, DatabaseParts, TickerConfig, PausableConfig (+73 more)

### Community 190 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 191 - "browser/serve.ts"
Cohesion: 0.21
Nodes (10): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), listenOnRandomPort(), CONTENT_TYPES (+2 more)

### Community 192 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 195 - "Session"
Cohesion: 0.21
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 197 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 2 - "migrate.ts"
Cohesion: 0.02
Nodes (147): Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner, Difference (+139 more)

### Community 20 - ".from"
Cohesion: 0.03
Nodes (86): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+78 more)

### Community 203 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 204 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 206 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 21 - "core-transport.ts"
Cohesion: 0.03
Nodes (77): Session, TransportLimits, TransportTls, Committed, Hello, HelloAck, JsonValue, MessageFault (+69 more)

### Community 211 - "childRefKeys"
Cohesion: 0.38
Nodes (3): ChildReader, childRefKeys(), readChildren()

### Community 213 - "TapeAnswers"
Cohesion: 0.32
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 217 - "blobText"
Cohesion: 0.24
Nodes (7): BackupText, blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), 9.2 Browser build (BR), 9. Backups and browser

### Community 22 - "module-tables.ts"
Cohesion: 0.04
Nodes (74): CaptureColumn, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ConsistentRead, ColumnType (+66 more)

### Community 221 - "Heartbeat"
Cohesion: 0.31
Nodes (5): Heartbeat, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 222 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 225 - "compare.ts"
Cohesion: 0.27
Nodes (7): BaselineLoad, Comparison, compareToBaseline(), loadBaseline(), BASELINE_PATH, REGRESSION_FACTOR, dir

### Community 226 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 23 - "client.test.ts"
Cohesion: 0.03
Nodes (59): NodeRetry, NodeSocketEvents, HandSocket, HandSockets, Answer, FakeNode, Handler, Received (+51 more)

### Community 234 - "type-check.ts"
Cohesion: 0.33
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 24 - "loop.test.ts"
Cohesion: 0.04
Nodes (81): LockstepWait, LoopEnd, SlowBlockEvent, SlowWindow, Contexts, Faults, LostCommit, Seen (+73 more)

### Community 25 - "devnet-upgrade.test.ts"
Cohesion: 0.05
Nodes (68): Side, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch (+60 more)

### Community 26 - "fetch-fixtures.ts"
Cohesion: 0.05
Nodes (87): EventSpec, Scenario, ArgType, BlockOptions, CallSpec, chainBlock, PalletSpec, RUNTIME (+79 more)

### Community 260 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 27 - "runner/process.ts"
Cohesion: 0.03
Nodes (64): Bound, ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, ChainIdentity, TransportReader, LoadOptions (+56 more)

### Community 28 - "builder.test.ts"
Cohesion: 0.03
Nodes (41): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step, Frame (+33 more)

### Community 29 - "cbor.ts"
Cohesion: 0.04
Nodes (80): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+72 more)

### Community 3 - "vitest"
Cohesion: 0.02
Nodes (121): Child, Served, ParentJob, Kill, Orphaned, SourceFile, Finding, Started (+113 more)

### Community 30 - "ledger/types.ts"
Cohesion: 0.04
Nodes (60): LoadLedger, LedgerReleasePackage, LedgerPackage, LedgerPackageOptions, V9Logs, LoadAdapter, AdapterWorkerRequest, SlowStep (+52 more)

### Community 31 - "db/backends.ts"
Cohesion: 0.04
Nodes (56): Settings, TestBackend, Case, HeldRead, Job, Outcome, Reads, Step (+48 more)

### Community 32 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (61): CreatedDirectory, Held, PgliteLockUse, WriterProcess, Job, WorkerEvent, PauseReport, acquirePgliteLock() (+53 more)

### Community 33 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (63): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+55 more)

### Community 34 - "history.test.ts"
Cohesion: 0.05
Nodes (67): versionEntry, HistoryCheck, HistoryInput, HistoryOptions, HistoryRow, HistoryRule, AppliedMigration, Simulation (+59 more)

### Community 35 - "snapshot.test.ts"
Cohesion: 0.05
Nodes (57): AllowedDetail, RevisionSettings, SnapshotFacts, ConfigSnapshot, SanitizedError, ConfigCheckSeams, PlainObject, RedactableConfig (+49 more)

### Community 36 - "process-context.test.ts"
Cohesion: 0.05
Nodes (39): ProcessContext, Revision, EntryRange, ResolvedGraph, StartedModuleApi, MisuseListener, MisuseReports, ProcessContexts (+31 more)

### Community 37 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (55): TransactionHistoryStorage, PgTransactionHistoryStorage, rowToEntry(), reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 4. Wiring `PgTemporalKV`'s `opts.tx` (+47 more)

### Community 38 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (62): CoreContractStatesOptions, ContractStateRow, DefinedModule, CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine (+54 more)

### Community 39 - "transport-faults.test.ts"
Cohesion: 0.05
Nodes (47): ReadOnlyDatabase, ResultColumn, Message, TestCertificates, Ended, rawClient, Escape, publicState (+39 more)

### Community 4 - "database-parts.ts"
Cohesion: 0.03
Nodes (114): PostgresParts, PostgresPartsInput, SslMode, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Job (+106 more)

### Community 40 - "range.ts"
Cohesion: 0.05
Nodes (61): BoundaryBlockReading, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange, Final, Height (+53 more)

### Community 41 - "configured.ts"
Cohesion: 0.06
Nodes (52): RestoreChain, RestoreSeams, BackupOutcome, CommandConfig, commandTarget, DatabaseState, ReadDatabaseOptions, Chain (+44 more)

### Community 42 - "loop-stop-harness.ts"
Cohesion: 0.07
Nodes (47): NodeClientOptions, ConnectSocket, A169Observation, LoopStopScenario, Outage, SourceOf, A167Observation, CheckOf (+39 more)

### Community 44 - "config/history.ts"
Cohesion: 0.06
Nodes (54): CoreVersion, CoreSettings, HistoryCode, HistoryContext, ProvidesRow, Span, SettingsSchema, errorCode() (+46 more)

### Community 45 - "chain-data-tapes.ts"
Cohesion: 0.08
Nodes (53): BlockSpec, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry, RuntimeShape (+45 more)

### Community 46 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (44): BackupSeams, backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, LoadedConfig, BackupSignals (+36 more)

### Community 47 - "core-block-parsed.ts"
Cohesion: 0.06
Nodes (53): BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent, EventPhase, ParsedTransaction, blockBodyOf() (+45 more)

### Community 48 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (51): BlockItemSource, LoopInput, ReadOpener, Times, Wait, askedSource, HoldMode, HoldSpec (+43 more)

### Community 49 - "ModuleDeclaration"
Cohesion: 0.08
Nodes (50): ConfigFacts, OpenedConfig, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, DigestRow, ModuleFacts (+42 more)

### Community 5 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (126): ApplyInput, ApplyOutput, StateSummary, StoredNode, LedgerHeight, RawPackageClass, recordedGenesis, Upstream (+118 more)

### Community 50 - "paused-harness.ts"
Cohesion: 0.06
Nodes (49): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, SignalJob (+41 more)

### Community 53 - "loop.ts"
Cohesion: 0.07
Nodes (49): HeightRange, Callback, CallbackFailure, ParallelPoint, PointSchedule, ProcessReason, ReasonCode, Unwrapped (+41 more)

### Community 54 - "ledger-storage.test.ts"
Cohesion: 0.08
Nodes (52): Call, SeenLoad, retentionSeen, ledgerScenario, LedgerTx, WindowBackup, cappedAt(), firstParam() (+44 more)

### Community 55 - "admin-harness.ts"
Cohesion: 0.06
Nodes (48): FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminSnapshot, AdminRunOptions, Answerer, Expected (+40 more)

### Community 57 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.06
Nodes (45): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses(), expectedCallArgs(), plainWatchModule() (+37 more)

### Community 58 - "UmbraError"
Cohesion: 0.05
Nodes (41): LoadedConfig, LoadOptions, PostgresConnection, PostgresOptions, ReadTimeoutSetting, ErrorDetails, UmbraError, ChainDataView (+33 more)

### Community 59 - "entries.ts"
Cohesion: 0.05
Nodes (48): CoreLedgerVersion, LedgerPackageIdentity, DatabasePartsInput, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig (+40 more)

### Community 6 - "api-server.test.ts"
Cohesion: 0.03
Nodes (107): ModuleApiServer, ModuleApiStart, StartedModuleApi, ApiRegistry, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions (+99 more)

### Community 60 - "sweep-tapes.ts"
Cohesion: 0.10
Nodes (48): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, FixtureNode, FakeState, RefusalData (+40 more)

### Community 61 - "private/backends.ts"
Cohesion: 0.08
Nodes (39): PglitePathParts, PrivateBackend, SessionSeen, A162Options, a162Run, HeaderSeen, instancesRun, A112Observation (+31 more)

### Community 62 - "Process"
Cohesion: 0.08
Nodes (11): CoreTransport, PauseHold, Process, SignalTarget, openedCursorHeight(), publicLockstepOf(), retryOf(), messageOf() (+3 more)

### Community 63 - "backup/backup.ts"
Cohesion: 0.07
Nodes (50): BackupInput, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool (+42 more)

### Community 64 - "intake.test.ts"
Cohesion: 0.08
Nodes (42): PrivateProcess, PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation (+34 more)

### Community 65 - "net.test.ts"
Cohesion: 0.07
Nodes (23): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortSocket (+15 more)

### Community 66 - "validate.test.ts"
Cohesion: 0.06
Nodes (41): coreEntry, ConfigRule, EntryRef, CursorRow, Expected, validateConfig(), checked(), findings() (+33 more)

### Community 67 - "version-checks.ts"
Cohesion: 0.08
Nodes (29): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, LedgerSelection, VersionedBlock, Boundary, CallRecord (+21 more)

### Community 68 - "binding.test.ts"
Cohesion: 0.07
Nodes (42): startHashDecision, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding, Created (+34 more)

### Community 69 - "transform-checks.ts"
Cohesion: 0.10
Nodes (34): TransformError, NotificationRange, baseRecords(), expectedText(), expectResubscriptionOnTape(), expectVariantOutput(), forkRecords(), header() (+26 more)

### Community 7 - "opt-out.test.ts"
Cohesion: 0.03
Nodes (118): TableDigest, TableDigestRow, CapturedTable, CaptureState, CheckedMigration, SchemaPlan, ChangeKind, tableChanges (+110 more)

### Community 70 - "builds.ts"
Cohesion: 0.07
Nodes (40): AdminStarter, PrivateIntakeOptions, PublicWakes, A165Options, PrivateOptions, PrivateRefusal, PublicCoreOptions, Pause (+32 more)

### Community 71 - "core-ledger-state.ts"
Cohesion: 0.08
Nodes (43): retainedStates, CoreRevision, blockHeaderOf(), ledgerVersionOf(), writeBlockRow(), applyBlock(), boundLedger(), chainOutcomesOf() (+35 more)

### Community 72 - "LedgerEngine"
Cohesion: 0.11
Nodes (17): StateHandle, LedgerEngine, LedgerTaskFailed, Settled, stagenetReplay, hexOf(), idOf(), same() (+9 more)

### Community 73 - "process-worker.ts"
Cohesion: 0.07
Nodes (33): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, Scope (+25 more)

### Community 74 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 75 - "checkShape"
Cohesion: 0.07
Nodes (38): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+30 more)

### Community 76 - "core-settings.ts"
Cohesion: 0.05
Nodes (41): LedgerTableSettings, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, Absent, DeepReadonly, PrivateKeys (+33 more)

### Community 77 - "height-versioned.test.ts"
Cohesion: 0.09
Nodes (31): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+23 more)

### Community 78 - "graph.ts"
Cohesion: 0.08
Nodes (43): Edge, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts, ResolvedRange (+35 more)

### Community 8 - "host.ts"
Cohesion: 0.03
Nodes (101): LedgerStateItem, RetainedState, LedgerName, Path, LedgerSource, ChainOutcome, LedgerTask, LedgerTaskBlock (+93 more)

### Community 81 - "validate.ts"
Cohesion: 0.09
Nodes (43): EntryView, HistoryFinding, plainData, CheckedEntry, ConfigContext, CursorRule, EntryView, Finding (+35 more)

### Community 84 - "admin/types.ts"
Cohesion: 0.08
Nodes (33): adminRoutes, AdminChannel, AdminServeOptions, AdminAnswer, AdminEndpoint, AdminPart, AdminView, ChainView (+25 more)

### Community 85 - "default.test.ts"
Cohesion: 0.10
Nodes (39): Answered, Observation, Start, startProcess(), adminCore(), adminSource(), ask(), dbKeeper() (+31 more)

### Community 86 - "chain-data.test.ts"
Cohesion: 0.09
Nodes (36): BlockParsed, itemsSeen, Json, ingest, coreBlockParsedOnParse(), a91Problems(), a92Problems(), a93Problems() (+28 more)

### Community 9 - "backup/restore.ts"
Cohesion: 0.03
Nodes (87): ChainCheck, ChainCheckInput, ConfigRow, PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions (+79 more)

### Community 90 - "boundary.test.ts"
Cohesion: 0.11
Nodes (35): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+27 more)

### Community 91 - "core-ledger-state/sql.ts"
Cohesion: 0.11
Nodes (36): StateRow, StoredState, SweepPhase, SweepWrites, allGreyKeys(), bytesOf(), clearGrey(), clearMarks() (+28 more)

### Community 93 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 97 - "release-version.ts"
Cohesion: 0.12
Nodes (35): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+27 more)

### Community 98 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 249 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 128 - "following"
Cohesion: 0.09
Nodes (27): text(), transportReader(), cursorRead(), following(), 17. Trying a module against another node, Requirement: AE-3 States and conditions, Scenario: A fault of the build's declarations ends the process, Scenario: A paused loop (+19 more)

### Community 152 - "block-fetch-decode.test.ts"
Cohesion: 0.17
Nodes (16): blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes(), encodeCompact() (+8 more)

### Community 154 - "mapping.test.ts"
Cohesion: 0.12
Nodes (10): mapValue(), parseJsonLossless(), oid(), identity(), RESULT_COLUMNS, RFC-3339, 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence (+2 more)

### Community 155 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 156 - "UmbraDB module guide"
Cohesion: 0.10
Nodes (21): params(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations, 16. Upgrades (+13 more)

### Community 158 - ".query"
Cohesion: 0.21
Nodes (19): a76Problems(), heightsIn(), a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows(), expectedStates() (+11 more)

### Community 162 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 172 - "core-ledger-state.test.ts"
Cohesion: 0.13
Nodes (11): boundLedgerParser(), bindCoreLedgerState(), itemsOf(), retainedStatesOf(), applied(), bound(), query(), refusing() (+3 more)

### Community 184 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (14): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+6 more)

### Community 189 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 196 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 201 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 202 - "placement.ts"
Cohesion: 0.24
Nodes (12): callVariant(), carried(), is(), placeTransactions(), refuse(), systemBytes(), bodyOrder(), eventOrder() (+4 more)

### Community 216 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 236 - "test-processes.test.ts"
Cohesion: 0.24
Nodes (8): file(), namesRunner(), runnerStarts(), sources(), valueNames(), REPOSITORY, RUNNER, TESTS

### Community 242 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 245 - "backupAtStop"
Cohesion: 0.29
Nodes (8): backupAtStop(), A backup at the core's stop, A backup of a running process (SIGUSR2), Backups, Restoring a backup, What a backup holds, Writing a backup, 15. Backups and browser

### Community 248 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.29
Nodes (7): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 253 - "readPrivateCursor"
Cohesion: 0.38
Nodes (6): readPrivateCursor(), readDatabaseState(), 00029 — `umbradb config check --database` reads a private database's cursor from the public cursor table, Evidence, Problem, Suggested fix

### Community 279 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 318 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 43 - "history"
Cohesion: 0.04
Nodes (61): history(), n(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+53 more)

### Community 51 - "version"
Cohesion: 0.04
Nodes (56): side(), migrations(), version(), 1. Overview, Appendix A. Reference, 0. Project setup, 1. TemporalKV, 2. Sprint close-out (+48 more)

### Community 52 - "code"
Cohesion: 0.04
Nodes (57): code(), Added, 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit (+49 more)

### Community 56 - ".put"
Cohesion: 0.04
Nodes (52): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+44 more)

### Community 79 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.10
Nodes (27): phaseA_syncAndPersistEnvelope(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed(), ledgerV8NodeEntry(), loadMidnightWalletSdk() (+19 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 88 - "T"
Cohesion: 0.05
Nodes (40): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Scenario: Version and timestamp addressing agree, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 6.1 — P3 is the differential gate's replay-equivalence / fold anchor (documentation, no new test code) (+32 more)

### Community 96 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 106 - "package.json"
Cohesion: 0.06
Nodes (33): bin, umbradb, bugs, url, description, optional, engines, node (+25 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 141 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 146 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.09
Nodes (17): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+9 more)

### Community 150 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 151 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 166 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 170 - "README.md"
Cohesion: 0.15
Nodes (10): Choosing a database, At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails, Generate your local wallet (+2 more)

### Community 171 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 174 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 179 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 185 - "Requirement: BK-1 Backup"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+7 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 193 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 194 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 198 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 199 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 200 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 205 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 208 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 209 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 210 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 214 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 215 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 218 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 219 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 220 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 227 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 228 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 229 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 230 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 231 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 232 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 233 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 235 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 237 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 238 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 239 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 240 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 241 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 243 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 244 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 246 - "UmbraDB operator guide"
Cohesion: 0.25
Nodes (8): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The transport reader, TLS to PostgreSQL: `ssl`, UmbraDB operator guide

### Community 247 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 250 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 251 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 252 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 254 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 255 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 256 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 257 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 258 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 259 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 261 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 264 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 265 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 266 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 267 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 268 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 269 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

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

### Community 275 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 276 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 277 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 278 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 280 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

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

### Community 286 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 287 - "Problem"
Cohesion: 0.40
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 288 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 289 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 290 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 291 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

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

### Community 296 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.40
Nodes (4): 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 297 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 298 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 299 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 300 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 301 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 302 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 303 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 304 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 305 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 306 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 307 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 308 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 309 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 310 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 311 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 312 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 313 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 314 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 315 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 316 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 80 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 94 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3756 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ref_node_fs`, `InMemoryBlockSource`, `migrate.ts`, `database-parts.ts`, `adapter-fixtures.ts`, `api-server.test.ts`, `opt-out.test.ts`, `host.ts`, `backup/restore.ts`, `declaration.ts`, `column-rules.ts`, `tape/index.ts`, `db/api.ts`, `record-and-replay.test.ts`, `order.property.test.ts`, `NodeBlockSource`, `NodeClient`, `DatabaseParts`, `.from`, `core-transport.ts`, `module-tables.ts`, `client.test.ts`, `loop.test.ts`, `devnet-upgrade.test.ts`, `fetch-fixtures.ts`, `runner/process.ts`, `builder.test.ts`, `cbor.ts`, `ledger/types.ts`, `db/backends.ts`, `writer-lock-checks.ts`, `contract-modules.test.ts`, `history.test.ts`, `snapshot.test.ts`, `process-context.test.ts`, `contract-data-checks.ts`, `transport-faults.test.ts`, `configured.ts`, `loop-stop-harness.ts`, `config/history.ts`, `refused-configuration.test.ts`, `core-block-parsed.ts`, `slow-block-harness.ts`, `paused-harness.ts`, `loop.ts`, `ledger-storage.test.ts`, `admin-harness.ts`, `ledger/ledger-tasks.test.ts`, `UmbraError`, `entries.ts`, `sweep-tapes.ts`, `private/backends.ts`, `intake.test.ts`, `net.test.ts`, `validate.test.ts`, `version-checks.ts`, `binding.test.ts`, `transform-checks.ts`, `builds.ts`, `core-ledger-state.ts`, `process-worker.ts`, `retirement.test.ts`, `core-settings.ts`, `height-versioned.test.ts`, `cold-boot-recovery.integration.test.ts`, `default.test.ts`, `chain-data.test.ts`, `boundary.test.ts`, `core-ledger-state/sql.ts`, `networks.ts`, `release-version.ts`, `browser/build.ts`, `pg-tx-history-adapter.ts`, `ingest-faults.test.ts`, `node-fields-harness.ts`, `package.json`, `browser.test.ts`, `checks.test.ts`, `code-registry.ts`, `config-check.ts`, `test/postgres/setup.ts`, `postgres/transaction-history-storage.ts`, `documents.ts`, `ledger-sweep.test.ts`, `config/plain-data.ts`, `Lockstep`, `read-gate.ts`, `core-chain-events.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `crash.test.ts`, `node-bridge.ts`, `loggingModule`, `src/ledger/identity.ts`, `example-checks.ts`, `status-schema.test.ts`, `readiness.test.ts`, `block-fetch-decode.test.ts`, `mapping.test.ts`, `ledger-table-config.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `lockstep-refusals.test.ts`, `excluded-not-exported.test.ts`, `core-ledger-state.test.ts`, `LoopPauses`, `private/lockstep-wait.test.ts`, `ws-mutual-tls.test.ts`, `surface.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `web-lock.ts`, `twox.ts`, `worker-threads.test.ts`, `history.property.test.ts`, `component-table.test.ts`, `Heartbeat`, `transport-intake.test.ts`, `compare.ts`, `test-processes.test.ts`?**
  _High betweenness centrality (0.231) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_node_fs` be split into smaller, more focused modules?**
  _Cohesion score 0.03116883116883117 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `ref_node_fs`, `InMemoryBlockSource`, `migrate.ts`, `database-parts.ts`, `api-server.test.ts`, `opt-out.test.ts`, `PgliteDatabase`, `backup/restore.ts`, `declaration.ts`, `host.ts`, `src/ledger/identity.ts`, `FinalizedLoop`, `db/api.ts`, `tape/index.ts`, `order.property.test.ts`, `NodeBlockSource`, `NodeClient`, `status-schema.test.ts`, `readiness.test.ts`, `core-transport.ts`, `module-tables.ts`, `client.test.ts`, `loop.test.ts`, `DatabaseParts`, `mapping.test.ts`, `runner/process.ts`, `cbor.ts`, `ledger-table-config.test.ts`, `db/backends.ts`, `writer-lock-checks.ts`, `contract-modules.test.ts`, `history.test.ts`, `snapshot.test.ts`, `process-context.test.ts`, `lockstep-refusals.test.ts`, `transport-faults.test.ts`, `range.ts`, `configured.ts`, `config/history.ts`, `core-ledger-state.test.ts`, `refused-configuration.test.ts`, `slow-block-harness.ts`, `paused-harness.ts`, `version-table.ts`, `loop.ts`, `statementsOf`, `entries.ts`, `backup/backup.ts`, `web-lock.ts`, `validate.test.ts`, `Session`, `binding.test.ts`, `version-checks.ts`, `builds.ts`, `core-ledger-state.ts`, `transform-checks.ts`, `process-worker.ts`, `checkShape`, `height-versioned.test.ts`, `graph.ts`, `validate.ts`, `default.test.ts`, `Writer`, `sha256`, `ingest-harness.ts`, `ingest-faults.test.ts`, `checks.test.ts`, `config-check.ts`, `backupAtStop`, `config/plain-data.ts`, `mapping.ts`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `InMemoryBlockSource` be split into smaller, more focused modules?**
  _Cohesion score 0.027097902097902096 - nodes in this community are weakly interconnected._