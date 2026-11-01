# Graph Report - UmbraDB

## Corpus Check
- 1173 files · ~1,649,196 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12284 nodes · 37796 edges · 343 communities (309 shown, 34 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3098 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `d314b30ee4556f83` (1173 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- column-rules.ts
- declaration.ts
- ledger/types.ts
- cold-boot-recovery.integration.test.ts
- ingest-faults.test.ts
- paused-harness.ts
- test/postgres/setup.ts
- core-ledger-state.ts
- real-tapes.ts
- upgrade-boundary.test.ts
- release-version.ts
- resolver-boundary.ts
- node-fields-harness.ts
- loop.ts
- builds.ts
- browser/build.ts
- pglite-lock.ts
- order.property.test.ts
- .concat
- src/ledger/identity.ts
- chrome.ts
- code-registry.ts
- pg-tx-history-adapter.ts
- config/history.ts
- documents.ts
- checks.test.ts
- read-gate.ts
- signal-ignored-fixtures.ts
- config/plain-data.ts
- version-checks.ts
- relays.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- crash.test.ts
- surface.test.ts
- buffer.ts
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- restore-private.ts
- TapeNode
- cbor.ts
- ws-mutual-tls.test.ts
- BlockRef
- .value
- pack-install.mjs
- core-block-fetch/metadata.ts
- ApiRoutes
- api-answers.ts
- UmbraError
- block-fetch-decode.test.ts
- node-source.ts
- chain-events-decode.test.ts
- library-documents.test.ts
- slow-block-windows.test.ts
- HeightRun
- listening.test.ts
- NodeClient
- LoopPauses
- cli/restore.ts
- statementsOf
- .from
- config/plain-data.test.ts
- SubscriptionConnection
- browser/serve.ts
- checkParent
- no-indexer-or-wallet-sdk.test.ts
- Database
- worker-threads-worker.ts
- Design — Sprint 1: project setup + TemporalKV
- RuntimeMetadata
- quiet-host.child.ts
- admin-harness.ts
- spawnChild
- Worker
- ProcessItems
- ReadHandle
- browser/src/config/load.ts
- entries.ts
- type-check.ts
- cli-fixtures.ts
- HeldHeight
- signal-backup.worker.ts
- loop-harness.ts
- worker-threads.test.ts
- tools_tape_index_taperecord
- mutation-evidence.d.mts
- TransportProxy
- AsyncLocalStorage
- node-format.ts
- worker-threads-host.ts
- ref_node_path
- core-transport.ts
- InMemoryBlockSource
- ingest-harness.ts
- FinalizedLoop
- PageApiChannel
- NodeFS
- loop.test.ts
- vitest
- core-block-commit.test.ts
- resolve.ts
- refused-configuration.test.ts
- runner/process.ts
- channel-checks.test.ts
- ModuleDeclaration
- migrate.ts
- LedgerPackage
- NodeBlockSource
- core-private-source.ts
- ledger/ledger-tasks.test.ts
- admin/configuration.ts
- range.test.ts
- dispatch.test.ts
- restore-ledger.ts
- chain-data.test.ts
- adapter-fixtures.ts
- writer-lock-checks.ts
- lockstep-refusals.test.ts
- interfaces/transaction-history-storage.ts
- process-backends.ts
- transport-faults.test.ts
- contract-modules.test.ts
- slow-block-harness.ts
- start-umbradb.ts
- range.ts
- sweep-tapes.ts
- ledger-checks.ts
- browser.test.ts
- Process
- PgTransactionHistoryStorage
- backup/restore.ts
- loop-stop-harness.ts
- contract-data-checks.ts
- src/db/postgres.ts
- PointName
- graph.ts
- core-channels.ts
- backup/backup.ts
- ledger-storage.test.ts
- ref_node_child_process
- boundary.test.ts
- mapping.ts
- checkShape
- private/lockstep-wait.test.ts
- tape/index.ts
- retirement.test.ts
- page.ts
- events-fixtures.ts
- api-server.ts
- validation.ts
- binding.test.ts
- pause-fixtures.ts
- process-worker.ts
- file-mode.test.ts
- client.test.ts
- module-api.ts
- api-server.test.ts
- transaction-history-storage.property.test.ts
- src/config/load.ts
- validate.ts
- messages.ts
- refused
- version
- core-private-source.test.ts
- graph.py
- .off
- .slowBlockMs
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- twox.ts
- .disconnect
- Design — v1.1.0: Quint model checking
- UmbraDB third-party component inventory (SBOM)
- path.ts
- schemaName
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- startUmbraDB
- Evidence
- rowProblems
- fresh-instance.mjs
- crash-worker.ts
- history
- .put
- code
- ADDED Requirements
- T
- ADDED Requirements
- ADDED Requirements
- package.json
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- README.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Design — Sprint 4: Watermarks
- explore.md
- ROADMAP.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Boundaries, threats and controls
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- scoped-review-manifest
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — START-UMBRADB: UmbraDB as a library
- Tasks — v1.0.0-infosec-signoff
- After 0.10.0
- Repository agent policy
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Requirement: PP-4 The process transport
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- Midnight Foundation Security Policy
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- UmbraDB node architecture
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-infosec-signoff
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- lib.sh
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
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
- 00054 — A slow-block test hung inside PGlite for over an hour
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
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
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 403 edges
2. `UmbraError` - 344 edges
3. `ModuleDeclaration` - 194 edges
4. `InMemoryBlockSource` - 165 edges
5. `FinalizedLoop` - 133 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 102 edges
8. `Database` - 101 edges
9. `ReadHandle` - 92 edges
10. `startProcess()` - 85 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `1. Vendor/pin manifest (for the nightly live tier)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/tasks.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (343 total, 34 thin omitted)

### Community 0 - "column-rules.ts"
Cohesion: 0.02
Nodes (180): CaptureColumn, CheckedMigration, ModuleColumn, ModuleContentsError, ModuleTable, ModuleTableOptions, PageOptions, CatalogColumn (+172 more)

### Community 1 - "declaration.ts"
Cohesion: 0.02
Nodes (198): StatsRow, Outcome, BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, MetadataVariant, RuntimeMetadataView (+190 more)

### Community 10 - "ledger/types.ts"
Cohesion: 0.03
Nodes (110): LoadLedger, CoreLedgerStateOptions, LedgerStateItem, LedgerName, LedgerSource, ApplyOutput, ChainOutcome, LedgerPackageOptions (+102 more)

### Community 100 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 101 - "ingest-faults.test.ts"
Cohesion: 0.09
Nodes (35): ProcessCondition, A84Observation, LoggedRetry, OutageObservation, RetrySample, ingest, run(), eventsRead() (+27 more)

### Community 103 - "paused-harness.ts"
Cohesion: 0.11
Nodes (32): Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, a176Project(), keeperModule() (+24 more)

### Community 104 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 11 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (110): RetainedState, retainedStates, CoreRevision, StateRow, StoredState, GreyPicker, GreyView, SweepPhase (+102 more)

### Community 110 - "real-tapes.ts"
Cohesion: 0.09
Nodes (31): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+23 more)

### Community 111 - "upgrade-boundary.test.ts"
Cohesion: 0.10
Nodes (30): ChainDataView, A47Observation, Controls, Version, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight() (+22 more)

### Community 113 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 116 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (32): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+24 more)

### Community 117 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (27): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+19 more)

### Community 119 - "loop.ts"
Cohesion: 0.12
Nodes (32): HeightRange, Callback, ParallelPoint, PointSchedule, Invoke, Misuse, Progress, ReadOpener (+24 more)

### Community 12 - "builds.ts"
Cohesion: 0.03
Nodes (97): AdminStarter, PrivateIntakeOptions, DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, AdminRunOptions, A176Options (+89 more)

### Community 120 - "browser/build.ts"
Cohesion: 0.08
Nodes (25): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+17 more)

### Community 121 - "pglite-lock.ts"
Cohesion: 0.09
Nodes (24): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, acquirePgliteLock(), directoryPath() (+16 more)

### Community 123 - "order.property.test.ts"
Cohesion: 0.10
Nodes (31): PointRun, CheckName, GraphSpec, ModuleSpec, Pipeline, TESTED, byBytes(), checkDigestLast() (+23 more)

### Community 124 - ".concat"
Cohesion: 0.08
Nodes (20): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+12 more)

### Community 126 - "src/ledger/identity.ts"
Cohesion: 0.12
Nodes (25): AdapterSpec, ManifestLine, VerifyLedgerPackagesOptions, LedgerRelease, LedgerReleasePackage, LedgerSourceSettings, V9Logs, checkLedgerPackages() (+17 more)

### Community 127 - "chrome.ts"
Cohesion: 0.12
Nodes (15): Cdp, CdpEvent, ChromeBrowser, ChromeTab, Download, PageRequest, chrome(), chrome() (+7 more)

### Community 128 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 129 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 13 - "config/history.ts"
Cohesion: 0.03
Nodes (122): CoreSettings, versionEntry, HistoryCode, HistoryContext, HistoryOptions, HistoryRule, ProvidesRow, Span (+114 more)

### Community 131 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 132 - "checks.test.ts"
Cohesion: 0.10
Nodes (21): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+13 more)

### Community 135 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 136 - "signal-ignored-fixtures.ts"
Cohesion: 0.11
Nodes (22): ListenedRun, WorkerSignals, RunningCommand, listenerProblems(), namesUnder(), pacedNode(), runWorkerInChild(), signalLines() (+14 more)

### Community 139 - "config/plain-data.ts"
Cohesion: 0.11
Nodes (22): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, copyArray(), copyObject(), instanceOf() (+14 more)

### Community 14 - "version-checks.ts"
Cohesion: 0.03
Nodes (106): MetadataNode, Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem (+98 more)

### Community 140 - "relays.ts"
Cohesion: 0.10
Nodes (9): Session, Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable() (+1 more)

### Community 141 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 142 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 143 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 144 - "crash.test.ts"
Cohesion: 0.12
Nodes (22): CrashCall, CrashEvent, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule(), hex() (+14 more)

### Community 145 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 146 - "buffer.ts"
Cohesion: 0.11
Nodes (17): BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText(), charCodes(), encodingOf() (+9 more)

### Community 147 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (16): BackupText, createReadStream(), firstLine(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst() (+8 more)

### Community 148 - "restore-private.ts"
Cohesion: 0.17
Nodes (20): FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom(), pmModule() (+12 more)

### Community 149 - "TapeNode"
Cohesion: 0.10
Nodes (7): Outage, TapeClock, TapeNode, hasField(), CHAIN, HEAD, SYSTEM_CLOCK

### Community 15 - "cbor.ts"
Cohesion: 0.03
Nodes (110): CanonicalEncodingError, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+102 more)

### Community 150 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 152 - "BlockRef"
Cohesion: 0.13
Nodes (9): BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem (+1 more)

### Community 154 - ".value"
Cohesion: 0.23
Nodes (8): MetadataType, ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 155 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 156 - "core-block-fetch/metadata.ts"
Cohesion: 0.25
Nodes (15): MetadataPallet, MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata() (+7 more)

### Community 157 - "ApiRoutes"
Cohesion: 0.12
Nodes (16): ApiRoutes, ModuleRegistration, AcceptsDuplicates, transportReaderRule(), parsePath(), registerModuleApis(), shapeOf(), api() (+8 more)

### Community 159 - "api-answers.ts"
Cohesion: 0.14
Nodes (19): HeadersArgument, LifecycleStatus, answerNotServing(), byteLength(), isCoreHeader(), lifecycleBody(), lifecycleHeaders(), notServingResponse() (+11 more)

### Community 16 - "UmbraError"
Cohesion: 0.03
Nodes (56): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, PgliteLockUse, ReadOnlyDatabase, ReadOptions (+48 more)

### Community 163 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+9 more)

### Community 164 - "node-source.ts"
Cohesion: 0.13
Nodes (15): ExtrinsicCall, BlockLedgerSource, NodeSourceOptions, Prefetch, LedgerBinding, blockTimeOf(), callOf(), callVariants() (+7 more)

### Community 165 - "chain-events-decode.test.ts"
Cohesion: 0.13
Nodes (19): MetadataField, Primitive, canonicalJson(), hexOf(), littleEndian(), fill(), hexOf(), le() (+11 more)

### Community 166 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 167 - "slow-block-windows.test.ts"
Cohesion: 0.14
Nodes (16): HeightActivity, LockstepWait, SlowBlockEvent, SlowWindow, NeverClears, NeverClears, Held, Times (+8 more)

### Community 168 - "HeightRun"
Cohesion: 0.12
Nodes (8): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, CommitsDespiteLastWrite, WaitsInTransaction, ComputeAtH

### Community 169 - "listening.test.ts"
Cohesion: 0.13
Nodes (10): Validator, schemaFile(), text(), validatorOf(), adminOrigin(), libraryCore(), readerOf(), until() (+2 more)

### Community 17 - "NodeClient"
Cohesion: 0.05
Nodes (74): ConfiguredGenesis, FinalizedHeightOptions, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+66 more)

### Community 174 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 178 - "cli/restore.ts"
Cohesion: 0.17
Nodes (12): RestoreChain, RestoreSeams, Chain, RestoreCommandOptions, RestoreOutcome, RestoreJob, nodeOptionsOf(), openRestoreTarget() (+4 more)

### Community 179 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 18 - ".from"
Cohesion: 0.03
Nodes (90): Buffer, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+82 more)

### Community 180 - "config/plain-data.test.ts"
Cohesion: 0.16
Nodes (9): Row, plainDataWith(), failures(), refusal(), thrown(), valueOf(), A26, files (+1 more)

### Community 182 - "SubscriptionConnection"
Cohesion: 0.27
Nodes (5): SubscriptionCarrier, SubscriptionConnection, connectChannel(), errorMessage(), socketConnection()

### Community 183 - "browser/serve.ts"
Cohesion: 0.20
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 184 - "checkParent"
Cohesion: 0.18
Nodes (12): AlwaysLanded, checkParent(), sameBytes(), hashAt(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix (+4 more)

### Community 189 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 19 - "Database"
Cohesion: 0.03
Nodes (82): Database, BlockWrites, Settings, TestBackend, TestDatabase, Case, Job, HeldRead (+74 more)

### Community 195 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 196 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 198 - "RuntimeMetadata"
Cohesion: 0.21
Nodes (3): RuntimeMetadata, contentStateOf(), hexOf()

### Community 199 - "quiet-host.child.ts"
Cohesion: 0.20
Nodes (8): Outcome, Stated, until(), before, db, during, [first, refusedLate, failingSql, halting], outcomes

### Community 2 - "admin-harness.ts"
Cohesion: 0.02
Nodes (174): MountedAdminAnswer, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions (+166 more)

### Community 20 - "spawnChild"
Cohesion: 0.03
Nodes (91): Served, ParentJob, Kill, Orphaned, SourceFile, Run, WorkerEvent, LockResult (+83 more)

### Community 21 - "ReadHandle"
Cohesion: 0.03
Nodes (71): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue (+63 more)

### Community 211 - "browser/src/config/load.ts"
Cohesion: 0.29
Nodes (9): LoadedConfig, LoadOptions, configModuleUrl(), configPath(), loadConfig(), loadModuleList(), noFile(), DEFAULT_CONFIG_FILE (+1 more)

### Community 22 - "entries.ts"
Cohesion: 0.02
Nodes (98): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase (+90 more)

### Community 229 - "type-check.ts"
Cohesion: 0.36
Nodes (6): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile()

### Community 23 - "cli-fixtures.ts"
Cohesion: 0.04
Nodes (80): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, IgnoredJob, CommandResult, CheckTarget (+72 more)

### Community 230 - "HeldHeight"
Cohesion: 0.28
Nodes (5): CommitOutcome, HeldHeight, Outcomes, AlwaysLost, DropsHeld

### Community 231 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 24 - "loop-harness.ts"
Cohesion: 0.03
Nodes (68): Revision, EntryRange, ResolvedGraph, MisuseListener, MisuseReports, ProcessContexts, ProcessContextsInput, PublishRefusal (+60 more)

### Community 25 - "tools_tape_index_taperecord"
Cohesion: 0.04
Nodes (48): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step, Frame (+40 more)

### Community 253 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 27 - "node-format.ts"
Cohesion: 0.05
Nodes (64): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+56 more)

### Community 276 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 28 - "ref_node_path"
Cohesion: 0.06
Nodes (62): RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore, TickerHandle, TickerProcess, WORKER, SignalEvent (+54 more)

### Community 29 - "core-transport.ts"
Cohesion: 0.04
Nodes (51): PublicSide, EndpointOptions, Connected, CoreTransportOptions, CoreLink, coreSessions, LinkConnection, LinkSession (+43 more)

### Community 3 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (150): CommitOptions, FinalityStallCondition, InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job (+142 more)

### Community 30 - "ingest-harness.ts"
Cohesion: 0.05
Nodes (76): CoreBlockItems, MetadataBlock, RuntimeMetadataEntry, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME (+68 more)

### Community 31 - "FinalizedLoop"
Cohesion: 0.05
Nodes (20): EntryBoundary, Activity, FinalizedLoop, LoopObserver, UnexpectedCursor, SkipsLockstep, WaitingInRead, ItemsAfterWrite (+12 more)

### Community 32 - "loop.test.ts"
Cohesion: 0.05
Nodes (67): LoopEnd, Faults, LostCommit, Seen, AtGate, LoopClass, RunnerDatabase, Broken (+59 more)

### Community 33 - "vitest"
Cohesion: 0.03
Nodes (53): BaselineLoad, Comparison, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline, LatencyStats (+45 more)

### Community 34 - "core-block-commit.test.ts"
Cohesion: 0.04
Nodes (67): BlockRow, SchemaWriteHandle, MigrationPart, Difference, OwnPart, PlannedSchema, Provision, QualifiedTable (+59 more)

### Community 35 - "resolve.ts"
Cohesion: 0.04
Nodes (77): CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, ConfigFinding, HistoryFinding, LoadedConfig (+69 more)

### Community 36 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (71): EngineConfig, ProcessHandle, Answered, Start, Refusal, Start, listenError(), startAdminServer() (+63 more)

### Community 37 - "runner/process.ts"
Cohesion: 0.04
Nodes (63): Bound, ChainSource, CoreChainBinding, NodeWait, WaitingListener, ChainIdentity, ConfigRow, ConfigHashRow (+55 more)

### Community 38 - "channel-checks.test.ts"
Cohesion: 0.05
Nodes (59): Envelope, LinkTimers, controlledTimers, PeerEnd, PeerMessage, rawPeer, TestEnd, TestEndOptions (+51 more)

### Community 39 - "ModuleDeclaration"
Cohesion: 0.06
Nodes (64): ConfigFacts, NetworkShown, OpenedConfig, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, DigestRow (+56 more)

### Community 4 - "migrate.ts"
Cohesion: 0.02
Nodes (151): TableDigest, TableDigestRow, Transaction, CapturedTable, CaptureState, AppliedRow, Runnable, Settling (+143 more)

### Community 40 - "LedgerPackage"
Cohesion: 0.05
Nodes (39): Path, LedgerPackage, LedgerEngine, stagenetReplay, described(), differs(), key(), plainDataProblem() (+31 more)

### Community 41 - "NodeBlockSource"
Cohesion: 0.05
Nodes (28): HeadWait, NodeBlockSource, NodeHeader, PreparedBlock, QueueRunner, SourceCondition, SourceNodeView, EventsRunner (+20 more)

### Community 42 - "core-private-source.ts"
Cohesion: 0.06
Nodes (55): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport (+47 more)

### Community 43 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (60): TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses() (+52 more)

### Community 44 - "admin/configuration.ts"
Cohesion: 0.05
Nodes (61): AllowedDetail, RevisionSettings, DeclarationView, EntryView, RecordedView, SanitizedError, PlainObject, RedactableConfig (+53 more)

### Community 45 - "range.test.ts"
Cohesion: 0.05
Nodes (36): Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+28 more)

### Community 46 - "dispatch.test.ts"
Cohesion: 0.05
Nodes (58): BlockHeader, GraphInput, PointArguments, PastFaultCase, RefusalCase, CallEvent, Recorder, reader() (+50 more)

### Community 47 - "restore-ledger.ts"
Cohesion: 0.06
Nodes (59): plainData, watched, RestartEvent, RestartJob, RestoreBuild, nodeSourceOf(), commandBuild(), processCoreEntry() (+51 more)

### Community 49 - "chain-data.test.ts"
Cohesion: 0.07
Nodes (61): BlockParsed, itemsSeen, BlockSpec, Json, Scenario, transactionSpec, browserChain, coreBlockParsedOnParse() (+53 more)

### Community 5 - "adapter-fixtures.ts"
Cohesion: 0.03
Nodes (146): ApplyInput, StoredNode, recordedGenesis, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject (+138 more)

### Community 51 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (51): WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, blocksIn(), firstOf(), startWriterProcess() (+43 more)

### Community 52 - "lockstep-refusals.test.ts"
Cohesion: 0.07
Nodes (50): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, TestLink, directPublic(), launchPrivate(), privateModule() (+42 more)

### Community 53 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.04
Nodes (41): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+33 more)

### Community 54 - "process-backends.ts"
Cohesion: 0.05
Nodes (40): Flaky, ChangedFile, GenesisFixture, installationCopy, StartPackageProcess, QuietResult, ProcessBackend, Seen (+32 more)

### Community 56 - "transport-faults.test.ts"
Cohesion: 0.06
Nodes (46): ResultColumn, CoreTransport, Message, MessageType, ReadResult, Pending, Ended, rawClient (+38 more)

### Community 57 - "contract-modules.test.ts"
Cohesion: 0.06
Nodes (48): ContractLog, Program, V9Raw, CoreContractLogsFullOptions, LogEventType, LogItem, VmLog, Freeable (+40 more)

### Community 58 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (50): BlockEventSource, BlockItemSource, LoopInput, StatusBody, Times, Wait, askedSource, BodyRead (+42 more)

### Community 6 - "start-umbradb.ts"
Cohesion: 0.03
Nodes (147): AdminSeams, coreEntry, MessagePortLike, PrivateLinkChannel, readOptions, Address, UmbraDBBackup, UmbraDBCondition (+139 more)

### Community 60 - "range.ts"
Cohesion: 0.06
Nodes (53): NodeSubscription, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, Final, Height (+45 more)

### Community 61 - "sweep-tapes.ts"
Cohesion: 0.09
Nodes (47): FixtureRun, FixtureRunOptions, SweepModel, TableSnapshot, FixtureNode, FakeState, RefusalData, hex() (+39 more)

### Community 62 - "ledger-checks.ts"
Cohesion: 0.07
Nodes (40): ChildReader, LedgerEvent, NodeStore, TransactionResult, Thread, BridgeServer, bridgeStore, Growable (+32 more)

### Community 63 - "browser.test.ts"
Cohesion: 0.07
Nodes (54): Reachable, RestoreAttempt, PageBackup, PageEvent, PageLink, PageRestore, ProcessName, StatusBody (+46 more)

### Community 64 - "Process"
Cohesion: 0.08
Nodes (6): PauseHold, Process, SignalTarget, openedCursorHeight(), hasLedgerTasks(), messageOf()

### Community 65 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (44): TransactionHistoryStorage, PgTransactionHistoryStorage, encodeStoredEntry(), reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema (+36 more)

### Community 66 - "backup/restore.ts"
Cohesion: 0.07
Nodes (46): PublicIdentity, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool, Checked, PublicSide (+38 more)

### Community 67 - "loop-stop-harness.ts"
Cohesion: 0.09
Nodes (40): A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore (+32 more)

### Community 68 - "contract-data-checks.ts"
Cohesion: 0.09
Nodes (51): CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx (+43 more)

### Community 7 - "src/db/postgres.ts"
Cohesion: 0.02
Nodes (137): BenchEnv, DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, SslMode, CommittedHeight (+129 more)

### Community 70 - "PointName"
Cohesion: 0.06
Nodes (33): QueuedBlock, PointName, BlockItems, LateUse, CallbackFailure, ReasonCode, Unwrapped, HeightFailure (+25 more)

### Community 71 - "graph.ts"
Cohesion: 0.07
Nodes (50): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+42 more)

### Community 72 - "core-channels.ts"
Cohesion: 0.08
Nodes (21): ChannelEndpoint, EndpointEvents, CoreChannels, CoreChannelSeams, CoreChannelsOptions, Queued, CoreSessionOptions, Hello (+13 more)

### Community 73 - "backup/backup.ts"
Cohesion: 0.08
Nodes (46): BackupInput, BackupSeams, BackupTarget, BackupWritten, DumpInput, PgliteDump, SnapshotSeams, Environment (+38 more)

### Community 74 - "ledger-storage.test.ts"
Cohesion: 0.08
Nodes (45): EventSpec, SeenLoad, retentionSeen, ledgerScenario, LedgerTx, RawPackageClass, a100Problems(), a102Problems() (+37 more)

### Community 75 - "ref_node_child_process"
Cohesion: 0.04
Nodes (37): RepositoryFile, Pem, gateAdapters(), tallyMutants(), canPin(), pinViolations(), repositoryFiles(), end() (+29 more)

### Community 76 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+34 more)

### Community 77 - "mapping.ts"
Cohesion: 0.07
Nodes (33): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+25 more)

### Community 78 - "checkShape"
Cohesion: 0.07
Nodes (39): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+31 more)

### Community 79 - "private/lockstep-wait.test.ts"
Cohesion: 0.07
Nodes (27): InstanceView, PrivateInstance, Entry, Lockstep, LockstepCondition, LockstepInstance, LockstepOptions, LockstepRefusal (+19 more)

### Community 8 - "tape/index.ts"
Cohesion: 0.03
Nodes (122): Recorded, Failure, Variant, CompletenessRange, RecordingProblem, TapeError, TapeProblem, TransformError (+114 more)

### Community 80 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 81 - "page.ts"
Cohesion: 0.06
Nodes (34): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+26 more)

### Community 82 - "events-fixtures.ts"
Cohesion: 0.11
Nodes (35): eventsRuntime, Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, LedgerScenarioOptions (+27 more)

### Community 83 - "api-server.ts"
Cohesion: 0.10
Nodes (38): coreHeaders, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler, ModuleApiLimits (+30 more)

### Community 85 - "validation.ts"
Cohesion: 0.06
Nodes (39): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, withNetwork(), first() (+31 more)

### Community 86 - "binding.test.ts"
Cohesion: 0.08
Nodes (38): a165Run, Attempt, A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight() (+30 more)

### Community 87 - "pause-fixtures.ts"
Cohesion: 0.08
Nodes (31): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, PausesInsideTheHeight (+23 more)

### Community 88 - "process-worker.ts"
Cohesion: 0.08
Nodes (30): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, demoLink, Scope, crossedError, StartRun (+22 more)

### Community 89 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (31): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+23 more)

### Community 9 - "client.test.ts"
Cohesion: 0.03
Nodes (82): Connection, NodeCallOptions, NodeClientOptions, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers (+74 more)

### Community 90 - "module-api.ts"
Cohesion: 0.07
Nodes (29): ChainDataAnswer, ApiError, ApiErrorCode, ApiRequest, ApiResponse, HttpMethod, ModuleApi, PathSegment (+21 more)

### Community 91 - "api-server.test.ts"
Cohesion: 0.08
Nodes (30): HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, AppendsVersion, Client, VersionsAnswersOnly, configHashesOf() (+22 more)

### Community 93 - "transaction-history-storage.property.test.ts"
Cohesion: 0.07
Nodes (26): EntryContent, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, Command, ReplayableStorage, abortErrorLike(), capitalize(), applyCommand() (+18 more)

### Community 94 - "src/config/load.ts"
Cohesion: 0.07
Nodes (29): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, LoadOptions, BackupSignals, UserModulesSource (+21 more)

### Community 98 - "validate.ts"
Cohesion: 0.10
Nodes (39): TextPattern, CursorRule, Issue, Plain, SettingsSchema, findings(), coreSettingsSchema(), closest() (+31 more)

### Community 99 - "messages.ts"
Cohesion: 0.07
Nodes (34): Committed, MessageFault, instanceIdSchema(), bytesOf(), decodeParameter(), decodeValue(), describe(), elementType() (+26 more)

### Community 50 - "refused"
Cohesion: 0.04
Nodes (61): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 7. Storage helpers (+53 more)

### Community 69 - "version"
Cohesion: 0.05
Nodes (49): side(), params(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules (+41 more)

### Community 102 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (12): publicLockstepOf(), height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), PUBLIC_POLL_MS (+4 more)

### Community 109 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 114 - ".off"
Cohesion: 0.06
Nodes (32): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases (+24 more)

### Community 118 - ".slowBlockMs"
Cohesion: 0.07
Nodes (29): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+21 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): 5. WalletState envelope, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only (+24 more)

### Community 158 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 188 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 191 - ".disconnect"
Cohesion: 0.18
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 193 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 203 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 233 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 236 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 244 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 26 - "startUmbraDB"
Cohesion: 0.03
Nodes (94): backupAtStop(), text(), transportReader(), startUmbraDB(), log(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem (+86 more)

### Community 261 - "Evidence"
Cohesion: 0.40
Nodes (5): readDatabaseState(), 00029 — `umbradb config check --database` reads a private database's cursor from the public cursor table, Evidence, Problem, Suggested fix

### Community 274 - "rowProblems"
Cohesion: 0.60
Nodes (6): a114Problems(), a116Problems(), heights(), readProblems(), rowProblems(), writes()

### Community 305 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 316 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 48 - "history"
Cohesion: 0.04
Nodes (63): history(), n(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+55 more)

### Community 55 - ".put"
Cohesion: 0.04
Nodes (56): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+48 more)

### Community 59 - "code"
Cohesion: 0.04
Nodes (57): code(), Added, 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit (+49 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 96 - "T"
Cohesion: 0.05
Nodes (40): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Scenario: Version and timestamp addressing agree, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 6.1 — P3 is the differential gate's replay-equivalence / fold anchor (documentation, no new test code) (+32 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+31 more)

### Community 107 - "package.json"
Cohesion: 0.05
Nodes (39): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+31 more)

### Community 108 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 151 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 161 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 162 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 170 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 171 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 173 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 175 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 177 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 181 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 186 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 187 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 190 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 192 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 194 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 200 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 201 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 204 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 205 - "README.md"
Cohesion: 0.29
Nodes (3): Choosing a database, Launching it, stats-module

### Community 207 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 208 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 209 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 210 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 212 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 213 - "ROADMAP.md"
Cohesion: 0.20
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 214 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 215 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 216 - "Boundaries, threats and controls"
Cohesion: 0.20
Nodes (10): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+2 more)

### Community 217 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 218 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 219 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 220 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 221 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 222 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 223 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 224 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 225 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 2. Envelope module (Pg-only — required gate), 4. Pg-only conformance suite (required merge gate) — `test:conformance`, 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 226 - "Tasks — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.22
Nodes (8): 0. Baseline, 10. Review (AGENTS.md stage 4, bounded), 11. Close-out, 2. The private link's settings renamed (D-6; CF-4), 7. The browser demo on the engine (LM-11; design §8), 8. The test sweep, the documents and the pack smoke (design §9; LS-1), 9. Full verification (AGENTS.md stage 3, as far as it runs locally), Tasks — START-UMBRADB: UmbraDB as a library

### Community 227 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 228 - "After 0.10.0"
Cohesion: 0.22
Nodes (9): 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals, Release gates still to run (+1 more)

### Community 232 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 235 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 237 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 238 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 239 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 240 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 241 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 243 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 245 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 246 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 247 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 248 - "Requirement: PP-4 The process transport"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, Spec delta — `private-processes` capability

### Community 249 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 250 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 251 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 252 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 254 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 257 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 258 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 259 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 260 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 262 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 263 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 264 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 265 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 266 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 267 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 268 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 269 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 270 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 271 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 272 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 273 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 275 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 277 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 278 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 279 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 280 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 281 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 282 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 283 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 284 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 285 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 286 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 287 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 288 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 289 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 290 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 291 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 292 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 293 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 294 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 295 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 296 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 297 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 298 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 299 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 300 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 301 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 302 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 303 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 304 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

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

### Community 312 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 313 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 314 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 84 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-3339`, `RFC-8949`, `RFC-3339` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4052 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `column-rules.ts`, `declaration.ts`, `admin-harness.ts`, `InMemoryBlockSource`, `migrate.ts`, `adapter-fixtures.ts`, `start-umbradb.ts`, `src/db/postgres.ts`, `tape/index.ts`, `client.test.ts`, `ledger/types.ts`, `core-ledger-state.ts`, `builds.ts`, `config/history.ts`, `version-checks.ts`, `cbor.ts`, `UmbraError`, `NodeClient`, `.from`, `Database`, `spawnChild`, `ReadHandle`, `entries.ts`, `cli-fixtures.ts`, `loop-harness.ts`, `tools_tape_index_taperecord`, `node-format.ts`, `ref_node_path`, `core-transport.ts`, `ingest-harness.ts`, `loop.test.ts`, `core-block-commit.test.ts`, `resolve.ts`, `refused-configuration.test.ts`, `runner/process.ts`, `channel-checks.test.ts`, `NodeBlockSource`, `core-private-source.ts`, `ledger/ledger-tasks.test.ts`, `admin/configuration.ts`, `range.test.ts`, `dispatch.test.ts`, `restore-ledger.ts`, `chain-data.test.ts`, `writer-lock-checks.ts`, `lockstep-refusals.test.ts`, `interfaces/transaction-history-storage.ts`, `process-backends.ts`, `transport-faults.test.ts`, `contract-modules.test.ts`, `slow-block-harness.ts`, `sweep-tapes.ts`, `ledger-checks.ts`, `browser.test.ts`, `backup/restore.ts`, `loop-stop-harness.ts`, `contract-data-checks.ts`, `PointName`, `ledger-storage.test.ts`, `ref_node_child_process`, `boundary.test.ts`, `mapping.ts`, `private/lockstep-wait.test.ts`, `retirement.test.ts`, `validation.ts`, `binding.test.ts`, `pause-fixtures.ts`, `file-mode.test.ts`, `module-api.ts`, `api-server.test.ts`, `transaction-history-storage.property.test.ts`, `src/config/load.ts`, `messages.ts`, `cold-boot-recovery.integration.test.ts`, `ingest-faults.test.ts`, `core-private-source.test.ts`, `paused-harness.ts`, `test/postgres/setup.ts`, `package.json`, `real-tapes.ts`, `upgrade-boundary.test.ts`, `release-version.ts`, `resolver-boundary.ts`, `node-fields-harness.ts`, `browser/build.ts`, `pglite-lock.ts`, `order.property.test.ts`, `src/ledger/identity.ts`, `code-registry.ts`, `pg-tx-history-adapter.ts`, `documents.ts`, `checks.test.ts`, `read-gate.ts`, `signal-ignored-fixtures.ts`, `config/plain-data.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `crash.test.ts`, `surface.test.ts`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `restore-private.ts`, `TapeNode`, `ws-mutual-tls.test.ts`, `api-answers.ts`, `block-fetch-decode.test.ts`, `chain-events-decode.test.ts`, `library-documents.test.ts`, `slow-block-windows.test.ts`, `listening.test.ts`, `excluded-not-exported.test.ts`, `LoopPauses`, `statementsOf`, `config/plain-data.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`?**
  _High betweenness centrality (0.182) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `column-rules.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017570525291828794 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `column-rules.ts`, `declaration.ts`, `admin-harness.ts`, `InMemoryBlockSource`, `migrate.ts`, `adapter-fixtures.ts`, `start-umbradb.ts`, `src/db/postgres.ts`, `tape/index.ts`, `client.test.ts`, `ledger/types.ts`, `core-ledger-state.ts`, `builds.ts`, `config/history.ts`, `version-checks.ts`, `cbor.ts`, `NodeClient`, `Database`, `ReadHandle`, `entries.ts`, `cli-fixtures.ts`, `loop-harness.ts`, `tools_tape_index_taperecord`, `startUmbraDB`, `ref_node_path`, `core-transport.ts`, `ingest-harness.ts`, `FinalizedLoop`, `loop.test.ts`, `core-block-commit.test.ts`, `resolve.ts`, `refused-configuration.test.ts`, `runner/process.ts`, `channel-checks.test.ts`, `ModuleDeclaration`, `NodeBlockSource`, `core-private-source.ts`, `ledger/ledger-tasks.test.ts`, `admin/configuration.ts`, `dispatch.test.ts`, `restore-ledger.ts`, `writer-lock-checks.ts`, `lockstep-refusals.test.ts`, `process-backends.ts`, `transport-faults.test.ts`, `slow-block-harness.ts`, `range.ts`, `Process`, `backup/restore.ts`, `PointName`, `graph.ts`, `backup/backup.ts`, `mapping.ts`, `checkShape`, `validation.ts`, `binding.test.ts`, `pause-fixtures.ts`, `module-api.ts`, `api-server.test.ts`, `src/config/load.ts`, `validate.ts`, `ingest-faults.test.ts`, `core-private-source.test.ts`, `upgrade-boundary.test.ts`, `loop.ts`, `pglite-lock.ts`, `src/ledger/identity.ts`, `checks.test.ts`, `config/plain-data.ts`, `buffer.ts`, `ApiRoutes`, `node-source.ts`, `slow-block-windows.test.ts`, `cli/restore.ts`, `statementsOf`, `config/plain-data.test.ts`, `checkParent`, `RuntimeMetadata`, `browser/src/config/load.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `declaration.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.019003351672674383 - nodes in this community are weakly interconnected._