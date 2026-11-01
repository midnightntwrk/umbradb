# Graph Report - UmbraDB

## Corpus Check
- 1157 files · ~1,612,674 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12020 nodes · 36814 edges · 356 communities (315 shown, 41 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2933 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `4092f26d24b54fb0` (1157 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- InMemoryBlockSource
- ingest-harness.ts
- range.test.ts
- contents-hash.ts
- TransactionHistoryEntry
- file-modes.ts
- postgres/transaction-history-storage.ts
- restore-private.ts
- dispatch.ts
- src/db/postgres.ts
- documents.ts
- pg-tx-history-adapter.ts
- Lockstep
- read-gate.ts
- test/postgres/setup.ts
- mapping.ts
- relays.ts
- BlockRef
- containers.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- process-worker.ts
- .from
- interfaces/transaction-history-storage.ts
- config/history.ts
- api-server.ts
- surface.test.ts
- block-fetch-decode.test.ts
- PointName
- cbor.property.test.ts
- pack-install.mjs
- adapter-fixtures.ts
- version-checks.ts
- example-checks.ts
- networks.ts
- .concat
- ledger-sweep.test.ts
- version-table.ts
- NodeBlockSource
- childRefKeys
- Process
- chrome.ts
- key-handling-checks.ts
- transaction-history-storage.property.test.ts
- version.negative-control.test.ts
- PortSocket
- text.test.ts
- client.test.ts
- core-chain.ts
- ledger-checks.ts
- LoopPauses
- ledger-liveness.test.ts
- vitest
- browser-harness.ts
- process-access.ts
- ws-mutual-tls.test.ts
- networks.test.ts
- resolver-boundary.ts
- postgres-tls-server.ts
- shims.test.ts
- ReadHandle
- statementsOf
- checkParent
- core-transport.ts
- no-indexer-or-wallet-sdk.test.ts
- browser/serve.ts
- worker-threads.test.ts
- admin-harness.ts
- core-block-parsed.ts
- quiet-host.child.ts
- worker-threads-worker.ts
- buffer.ts
- Worker
- api-answers.ts
- ModuleDeclaration
- Connection
- .send
- sweepStep
- browser/src/config/load.ts
- deterministic-postgresql/index.ts
- sha256
- postgres-image.test.ts
- validate.ts
- TapeAnswers
- typescript
- ProcessItems
- Database
- renamed-setting.test.ts
- loop-stop-harness.ts
- mutation-evidence.d.mts
- NetworkBroker
- AsyncLocalStorage
- declaration.ts
- db/backends.ts
- CoreTransport
- never
- WaitingInRead
- NodeClient
- host.ts
- ref_node_fs
- builds.ts
- aborted
- devnet-upgrade.test.ts
- ledger/types.ts
- BYTE_ORDER
- PauseHold
- CliBackend
- https.ts
- NodeFS
- EagerItems
- column-rules.ts
- writer-lock-checks.ts
- SkipsLockstep
- WaitsInTransaction
- SilentHalt
- adapter.ts
- lockstep-refusals.test.ts
- ledger/ledger-tasks.test.ts
- loop.ts
- LedgerPackage
- binding.test.ts
- FinalizedLoop
- range.ts
- .value
- redact.ts
- slow-block-harness.ts
- paused-harness.ts
- PgTransactionHistoryStorage
- tape/index.ts
- core-ledger-state.ts
- column-refusals.test.ts
- runner/process.ts
- column-rules.test.ts
- db/errors.ts
- cbor.ts
- worker-storage.test.ts
- validation.ts
- graph.ts
- contract-modules.test.ts
- start-umbradb.ts
- signal-ignored-fixtures.ts
- boundary.test.ts
- retirement.test.ts
- coreEntry
- checkShape
- transport.test.ts
- contract-data-checks.ts
- changes.property.test.ts
- api-server.test.ts
- sweep-tapes.ts
- config/plain-data.ts
- build-modules.ts
- cold-boot-recovery.integration.test.ts
- UmbraError
- backup/backup.ts
- startup-stop-harness.ts
- core-ledger-state/sql.ts
- net.test.ts
- failures.ts
- Design — Sprint 1: project setup + TemporalKV
- units.test.ts
- core-config.test.ts
- order.property.test.ts
- page.ts
- release-version.ts
- chain-events-decode.test.ts
- zero-timeouts-checks.ts
- browser.test.ts
- core.ts
- browser/build.ts
- 7. Storage helpers
- .constructor
- Proposal — Sprint 3: CheckpointStore
- Problem
- ADDED Requirements
- Design — START-UMBRADB: UmbraDB as a library
- refused
- .#startup
- .slowBlockMs
- log
- backupAtStop
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mapping.test.ts
- mutation-per-adapter.mjs
- core-ledger-state.test.ts
- twox.ts
- Design — v1.1.0: Quint model checking
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- midnight-env — reproducible PREPROD dev environment
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- parseJsonLossless
- v9
- firstRegularAtParentTime
- orphan-watcher.mjs
- checked-ledgers.test.ts
- fresh-instance.mjs
- crash-worker.ts
- history
- table
- .put
- T
- code
- ADDED Requirements
- graph.py
- following
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- Requirements
- README.md
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- Boundaries, threats and controls
- ADDED Requirements
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
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- ADDED Requirements
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.9.5] - 2026-07-25 — "Penumbra"
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Repository agent policy
- UmbraDB in a browser
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
- Midnight Foundation Security Policy
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Proposal — Sprint 1: project setup + TemporalKV
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
- 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
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
- 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail
- bug-report.md
- feature-request.md
- Tasks — Sprint 5: Lean M3a Watermarks W1
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
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 395 edges
2. `UmbraError` - 337 edges
3. `ModuleDeclaration` - 188 edges
4. `InMemoryBlockSource` - 153 edges
5. `FinalizedLoop` - 133 edges
6. `NodeClient` - 116 edges
7. `Database` - 101 edges
8. `BlockRef` - 99 edges
9. `ReadHandle` - 91 edges
10. `startProcess()` - 83 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `Evidence` --references--> `ManualTimers`  [INFERRED]
  docs/issues/00016-heartbeat-above-timer-limit.md → test/node/manual-timers.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (356 total, 41 thin omitted)

### Community 0 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (201): InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job, WorkerEvent, A77Observation (+193 more)

### Community 1 - "ingest-harness.ts"
Cohesion: 0.02
Nodes (193): BlockParsed, ProcessCondition, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec (+185 more)

### Community 10 - "range.test.ts"
Cohesion: 0.02
Nodes (96): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Frame, RawClient (+88 more)

### Community 100 - "contents-hash.ts"
Cohesion: 0.08
Nodes (28): CaptureColumn, CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ModuleColumn, PageOptions, ColumnType, encodeRow() (+20 more)

### Community 101 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 104 - "file-modes.ts"
Cohesion: 0.09
Nodes (25): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+17 more)

### Community 105 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (21): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+13 more)

### Community 108 - "restore-private.ts"
Cohesion: 0.08
Nodes (26): RestoreChain, RestoreSeams, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome, RestoreJob, PrivateConfig (+18 more)

### Community 109 - "dispatch.ts"
Cohesion: 0.13
Nodes (24): HeightRange, Callback, EntryBoundary, ParallelPoint, PointSchedule, SkipsStartAtRestart, StartsAtEveryRevision, CoreStopsFirst (+16 more)

### Community 11 - "src/db/postgres.ts"
Cohesion: 0.03
Nodes (106): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, SslMode (+98 more)

### Community 111 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 112 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 114 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 115 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 116 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 117 - "mapping.ts"
Cohesion: 0.13
Nodes (26): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+18 more)

### Community 119 - "relays.ts"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 12 - "BlockRef"
Cohesion: 0.03
Nodes (93): BlockRow, ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions (+85 more)

### Community 120 - "containers.test.ts"
Cohesion: 0.11
Nodes (19): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers() (+11 more)

### Community 122 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 123 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 124 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 125 - "process-worker.ts"
Cohesion: 0.14
Nodes (19): Scope, crossedError, StartRun, ToProcessWorker, openedProcess, ModuleTableOptions, messageAdmin(), withDevelopmentOptIn() (+11 more)

### Community 126 - ".from"
Cohesion: 0.09
Nodes (21): Buffer, Hash, createHash(), hex(), hex(), bytesOf(), bytesOf(), hexOf() (+13 more)

### Community 128 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (19): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, EntryContentSchema, EntryLifecycleSchema (+11 more)

### Community 13 - "config/history.ts"
Cohesion: 0.03
Nodes (135): ConfigRow, CoreVersion, CoreSettings, versionEntry, ConfigHashRow, HistoryCheck, HistoryCode, HistoryContext (+127 more)

### Community 131 - "api-server.ts"
Cohesion: 0.12
Nodes (24): coreHeaders, ConnectionRules, ModuleApiHandlerOptions, moduleApiHandlers, ModuleApiLimits, ModuleApiServer, ModuleApiServerOptions, isCoreHeader() (+16 more)

### Community 132 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 134 - "block-fetch-decode.test.ts"
Cohesion: 0.13
Nodes (20): PalletSpec, blake2b256(), compress(), rotateRight(), words(), decodeExtrinsics(), encodeHeader(), headerHash() (+12 more)

### Community 135 - "PointName"
Cohesion: 0.09
Nodes (20): PointName, PointArguments, PointRun, Activity, Misuse, SlowBlockCondition, CallEvent, A43Case (+12 more)

### Community 136 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (23): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+15 more)

### Community 139 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 14 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (128): ApplyInput, ApplyOutput, StateSummary, eventsRuntime, LedgerHeight, LedgerScenarioOptions, LedgerTx, RawPackageClass (+120 more)

### Community 140 - "version-checks.ts"
Cohesion: 0.18
Nodes (22): CallRecord, UpgradeCase, Answers, H(), blockWith(), bytesOf(), expectBadVersionDigestHalts(), expectEveryPackageFileChecked() (+14 more)

### Community 141 - "example-checks.ts"
Cohesion: 0.16
Nodes (17): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+9 more)

### Community 142 - "networks.ts"
Cohesion: 0.10
Nodes (21): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, networkIssues() (+13 more)

### Community 143 - ".concat"
Cohesion: 0.13
Nodes (11): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+3 more)

### Community 147 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (12): SweepState, SweepWrites, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints(), compare() (+4 more)

### Community 148 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerRow, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins() (+13 more)

### Community 15 - "NodeBlockSource"
Cohesion: 0.03
Nodes (65): BlockHeaderItem, BlockEventSource, BodyExtrinsic, BlockItemSource, CoreBlockHeader, CoreBlockItems, HeadWait, NodeBlockSource (+57 more)

### Community 150 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 151 - "Process"
Cohesion: 0.17
Nodes (3): Process, SignalTarget, NetworkPlan

### Community 152 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 153 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 155 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 156 - "version.negative-control.test.ts"
Cohesion: 0.15
Nodes (11): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, expectUpgradeDecoding(), runtimeAt() (+3 more)

### Community 157 - "PortSocket"
Cohesion: 0.17
Nodes (8): PortSocket, params(), pair(), 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix, 7. The module API

### Community 158 - "text.test.ts"
Cohesion: 0.15
Nodes (10): BackupText, createReadStream(), firstLine(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst() (+2 more)

### Community 16 - "client.test.ts"
Cohesion: 0.03
Nodes (80): Connection, NodeClientOptions, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, IngestOptions, HandSocket (+72 more)

### Community 163 - "core-chain.ts"
Cohesion: 0.16
Nodes (17): ChainSource, ConfiguredGenesis, CoreChainBinding, WaitingListener, builtInNetwork, LedgerTable, boundTo(), bytesOf() (+9 more)

### Community 165 - "ledger-checks.ts"
Cohesion: 0.24
Nodes (18): LedgerEvent, TransactionResult, VmLog, ledgerItemsSeen, a106Problems(), a107Problems(), a99Problems(), blockZeroProblems() (+10 more)

### Community 166 - "LoopPauses"
Cohesion: 0.16
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 169 - "ledger-liveness.test.ts"
Cohesion: 0.15
Nodes (15): SlowStep, TestLoaderData, beat(), countDeserializations(), hexOf(), loadLedger(), probe(), backend (+7 more)

### Community 17 - "vitest"
Cohesion: 0.02
Nodes (100): Served, ParentJob, Kill, Orphaned, SourceFile, Finding, Run, WorkerEvent (+92 more)

### Community 170 - "browser-harness.ts"
Cohesion: 0.27
Nodes (16): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+8 more)

### Community 171 - "process-access.ts"
Cohesion: 0.19
Nodes (16): Access, AllowedRead, bare(), callsPathResolve(), checked(), declares(), inRepository(), inType() (+8 more)

### Community 172 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (12): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+4 more)

### Community 176 - "networks.test.ts"
Cohesion: 0.13
Nodes (13): Answers, File, FormatRow, FoundTape, Tape, H(), validFile(), BUILT_IN_NETWORKS (+5 more)

### Community 177 - "resolver-boundary.ts"
Cohesion: 0.18
Nodes (15): Boundary, Crossing, Guard, boundaryOf(), boundarySources(), guardedSymbols(), hostWith(), inRepository() (+7 more)

### Community 178 - "postgres-tls-server.ts"
Cohesion: 0.18
Nodes (10): BenchEnv, TlsPostgres, makeCertificates(), startTlsPostgres(), PG_SETTINGS, container, { guarded, fixture }, HBA (+2 more)

### Community 179 - "shims.test.ts"
Cohesion: 0.19
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 18 - "ReadHandle"
Cohesion: 0.03
Nodes (84): StatsRow, Outcome, BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable (+76 more)

### Community 182 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 187 - "checkParent"
Cohesion: 0.18
Nodes (12): AlwaysLanded, checkParent(), sameBytes(), hashAt(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix (+4 more)

### Community 19 - "core-transport.ts"
Cohesion: 0.03
Nodes (92): PublicSide, ResultColumn, Session, TransportLimits, TransportTls, Committed, Hello, HelloAck (+84 more)

### Community 192 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 193 - "browser/serve.ts"
Cohesion: 0.22
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 194 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 2 - "admin-harness.ts"
Cohesion: 0.02
Nodes (178): FromAdmin, AdminServer, ConfigCheckReport, DatabaseParts, PostgresPartsInput, EngineConfig, EngineInput, ProcessHandle (+170 more)

### Community 20 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (106): ContractLog, BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsedOptions, ChainTransaction, ChainEvent, EventPhase (+98 more)

### Community 200 - "quiet-host.child.ts"
Cohesion: 0.18
Nodes (9): Job, Outcome, Stated, until(), before, db, during, [first, refusedLate, failingSql, halting] (+1 more)

### Community 202 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 203 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 209 - "api-answers.ts"
Cohesion: 0.26
Nodes (11): HeadersArgument, LifecycleStatus, ProcessReason, answerNotServing(), byteLength(), lifecycleBody(), lifecycleHeaders(), refuseNotServing() (+3 more)

### Community 21 - "ModuleDeclaration"
Cohesion: 0.03
Nodes (109): ConfigFacts, OpenedFacts, CoreChainFacts, RestoreBase, CheckFinding, CheckState, CheckStep, ConfigCheckOptions (+101 more)

### Community 210 - "Connection"
Cohesion: 0.35
Nodes (4): Connection, errorMessage(), encodeJson(), hex()

### Community 218 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 219 - "browser/src/config/load.ts"
Cohesion: 0.29
Nodes (9): LoadedConfig, LoadOptions, configModuleUrl(), configPath(), loadConfig(), loadModuleList(), noFile(), DEFAULT_CONFIG_FILE (+1 more)

### Community 22 - "deterministic-postgresql/index.ts"
Cohesion: 0.03
Nodes (76): TableDigest, TableDigestRow, CapturedTable, CaptureState, CheckedMigration, GuardTableRow, ConsistentRead, CheckFunctionsOptions (+68 more)

### Community 220 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 229 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 23 - "validate.ts"
Cohesion: 0.03
Nodes (102): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, HistoryFinding, TextPattern (+94 more)

### Community 230 - "TapeAnswers"
Cohesion: 0.40
Nodes (6): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), devnetUpgradeOf(), isCall()

### Community 235 - "typescript"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 24 - "Database"
Cohesion: 0.04
Nodes (85): Database, SchemaWriteHandle, MigrationPart, SchemaPlan, ProcessContext, StandInOptions, Commit, Committed (+77 more)

### Community 243 - "renamed-setting.test.ts"
Cohesion: 0.39
Nodes (6): Renamed, databaseOf(), dataOf(), escaped(), fileOf(), FINDING()

### Community 25 - "loop-stop-harness.ts"
Cohesion: 0.04
Nodes (101): BlockHeader, CrashEvent, CrashJob, ingest, watched, Call, SeenLoad, RestartEvent (+93 more)

### Community 253 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "declaration.ts"
Cohesion: 0.03
Nodes (86): CoreLedgerVersion, LedgerPackageIdentity, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder (+78 more)

### Community 27 - "db/backends.ts"
Cohesion: 0.03
Nodes (65): CheckTarget, Snapshot, Settings, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase (+57 more)

### Community 275 - "never"
Cohesion: 0.33
Nodes (4): IgnoresTheStop, StaysPaused, abortOf(), never()

### Community 277 - "WaitingInRead"
Cohesion: 0.20
Nodes (3): WaitingInRead, ItemsAfterWrite, DropsHeld

### Community 28 - "NodeClient"
Cohesion: 0.05
Nodes (65): FinalizedHeightOptions, HeadSubscriber, NodeCallOptions, NodeClient, Pending, State, Subscription, Waiter (+57 more)

### Community 29 - "host.ts"
Cohesion: 0.04
Nodes (65): RetainedState, ApplyBlock, BlockId, EngineHolding, EvictionRefused, GenesisBlock, Keys, LedgerLoader (+57 more)

### Community 3 - "ref_node_fs"
Cohesion: 0.03
Nodes (148): CommandHandler, CommandIo, BackupBackend, BackupDatabase, killedRestore, TickerHandle, TickerProcess, BackupOnSignal (+140 more)

### Community 30 - "builds.ts"
Cohesion: 0.04
Nodes (69): AdminStarter, PostgresParts, transportReaderFacts, LoopInput, EngineOptions, AdminRunOptions, A168RunOptions, A176Options (+61 more)

### Community 309 - "aborted"
Cohesion: 0.40
Nodes (3): DoesNotHold, EndsTheRun, aborted()

### Community 31 - "devnet-upgrade.test.ts"
Cohesion: 0.05
Nodes (64): Asked, Side, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable (+56 more)

### Community 32 - "ledger/types.ts"
Cohesion: 0.04
Nodes (75): BlockTransaction, LoadLedger, TransactionParser, UnsureLog, UnsureReason, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage (+67 more)

### Community 33 - "column-rules.ts"
Cohesion: 0.03
Nodes (94): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog (+86 more)

### Community 34 - "writer-lock-checks.ts"
Cohesion: 0.05
Nodes (71): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, WriterProcess, Job (+63 more)

### Community 36 - "adapter.ts"
Cohesion: 0.04
Nodes (66): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+58 more)

### Community 38 - "lockstep-refusals.test.ts"
Cohesion: 0.06
Nodes (69): LockstepCondition, PrivateProcess, PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals (+61 more)

### Community 39 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.04
Nodes (63): Path, TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, described(), differs() (+55 more)

### Community 4 - "loop.ts"
Cohesion: 0.02
Nodes (159): Transaction, GraphInput, CallbackFailure, CommitOutcome, HeightActivity, HeightFailure, HeightRun, HeldHeight (+151 more)

### Community 40 - "LedgerPackage"
Cohesion: 0.06
Nodes (37): LedgerStateItem, LedgerName, LedgerPackage, LedgerTask, LedgerTaskBlock, StateHandle, ContractKeys, EngineOptions (+29 more)

### Community 41 - "binding.test.ts"
Cohesion: 0.04
Nodes (68): PrivateIntakeOptions, startHashDecision, StartHashes, PglitePathParts, A165Options, a165Run, Attempt, TestDatabase (+60 more)

### Community 42 - "FinalizedLoop"
Cohesion: 0.06
Nodes (18): FinalizedLoop, LoopObserver, UnexpectedCursor, PausesInsideTheHeight, SkipsUnseen, CommitsDespiteLastWrite, FailingAfter, NoRedelivery (+10 more)

### Community 44 - "range.ts"
Cohesion: 0.05
Nodes (54): BoundaryBlockReading, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command, TapeCommandIo (+46 more)

### Community 45 - ".value"
Cohesion: 0.09
Nodes (39): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef (+31 more)

### Community 46 - "redact.ts"
Cohesion: 0.06
Nodes (49): AllowedDetail, RevisionSettings, EntryView, SanitizedError, ConfigCheckSeams, plainData, PlainObject, RedactableConfig (+41 more)

### Community 47 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (49): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, Observed (+41 more)

### Community 48 - "paused-harness.ts"
Cohesion: 0.07
Nodes (49): LoadOptions, Body, PausedExpectation, Read, Reader, Running, SignalJob, commandBuild() (+41 more)

### Community 49 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (49): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity (+41 more)

### Community 5 - "tape/index.ts"
Cohesion: 0.03
Nodes (133): NodeRetry, Metadata, Step, Failure, Variant, Failure, Variant, CompletenessRange (+125 more)

### Community 50 - "core-ledger-state.ts"
Cohesion: 0.07
Nodes (46): BlockLedgerSource, CoreLedgerStateOptions, LedgerBinding, retainedStates, CoreRevision, GreyPicker, FixtureRunOptions, blockHeaderOf() (+38 more)

### Community 51 - "column-refusals.test.ts"
Cohesion: 0.07
Nodes (31): ModuleTable, DeterminismBackend, TestDatabase, TestServer, Backend, Case, freshDatabase(), hashOf() (+23 more)

### Community 52 - "runner/process.ts"
Cohesion: 0.05
Nodes (32): NodeWait, RetryCode, PauseBy, BoundAddress, CloseHelper, CloseStep, EngineBuild, EngineNetwork (+24 more)

### Community 53 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (30): Because, columnVerdict, keyOrder, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+22 more)

### Community 54 - "db/errors.ts"
Cohesion: 0.06
Nodes (30): PostgresConnection, PostgresOptions, ReadOptions, ReadTimeoutSetting, ModuleContentsError, ModuleContentsFailure, ErrorCode, ErrorDetails (+22 more)

### Community 55 - "cbor.ts"
Cohesion: 0.08
Nodes (42): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+34 more)

### Community 56 - "worker-storage.test.ts"
Cohesion: 0.06
Nodes (34): ChainOutcome, StoredNode, AppliedState, Thread, BridgeServer, bridgeStore, Growable, CallTx (+26 more)

### Community 57 - "validation.ts"
Cohesion: 0.05
Nodes (38): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, A149Observation, A149Startup (+30 more)

### Community 58 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+40 more)

### Community 59 - "contract-modules.test.ts"
Cohesion: 0.06
Nodes (35): FastLogReader, LogSite, Program, V9Raw, LogEventType, Freeable, bytesOfHex(), decode() (+27 more)

### Community 6 - "start-umbradb.ts"
Cohesion: 0.02
Nodes (150): MainProcess, PrivateLinkChannel, readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle (+142 more)

### Community 60 - "signal-ignored-fixtures.ts"
Cohesion: 0.06
Nodes (34): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+26 more)

### Community 61 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 63 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 64 - "coreEntry"
Cohesion: 0.07
Nodes (38): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, coreEntry, core(), databaseOf() (+30 more)

### Community 65 - "checkShape"
Cohesion: 0.07
Nodes (38): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+30 more)

### Community 66 - "transport.test.ts"
Cohesion: 0.08
Nodes (30): ReadOnlyDatabase, Message, KeeperGlobals, Ended, rawClient, Escape, publicState, Refused (+22 more)

### Community 67 - "contract-data-checks.ts"
Cohesion: 0.10
Nodes (43): contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx, handoff (+35 more)

### Community 68 - "changes.property.test.ts"
Cohesion: 0.06
Nodes (43): ChangeKind, tableChanges, TouchedRow, Op, States, TableName, encodeCanonical(), changeOf() (+35 more)

### Community 7 - "api-server.test.ts"
Cohesion: 0.02
Nodes (135): ModuleApiServer, ModuleApiStart, StartedModuleApi, Bound, Revision, ResolvedGraph, ModuleApiStart, MountedApiSeams (+127 more)

### Community 70 - "sweep-tapes.ts"
Cohesion: 0.12
Nodes (39): FixtureRun, TableSnapshot, FixtureNode, refusalHalt(), refusalHeight(), runFixture(), tableDifferences(), hex() (+31 more)

### Community 74 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (32): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, Row, copyArray(), copyObject() (+24 more)

### Community 75 - "build-modules.ts"
Cohesion: 0.07
Nodes (25): CommandBuildOptions, ChainBuildOptions, commitBlock(), hex(), ledgerVersionOf(), startOf(), writeBlockRow(), writeHashRow() (+17 more)

### Community 78 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (24): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+16 more)

### Community 8 - "UmbraError"
Cohesion: 0.02
Nodes (151): AppliedRow, Runnable, Settling, StartupInput, MultiStatementRunner, BoundedRead, Difference, OwnPart (+143 more)

### Community 80 - "backup/backup.ts"
Cohesion: 0.09
Nodes (36): BackupInput, BackupSeams, BackupTarget, BackupWritten, DumpInput, PgliteDump, SnapshotSeams, Environment (+28 more)

### Community 82 - "startup-stop-harness.ts"
Cohesion: 0.11
Nodes (25): A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, StartVia, stopBy, WatchedClient (+17 more)

### Community 83 - "core-ledger-state/sql.ts"
Cohesion: 0.11
Nodes (34): StateRow, StoredState, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks(), deleteGrey() (+26 more)

### Community 85 - "net.test.ts"
Cohesion: 0.09
Nodes (20): IncomingMessage, Server, Emitter, Frame, Listener, PortUpgrade, RawData, WebSocket (+12 more)

### Community 86 - "failures.ts"
Cohesion: 0.08
Nodes (33): ReasonCode, Unwrapped, CodeList, CodeTest, RegistryInput, Section11, TestLiterals, isListenFailure() (+25 more)

### Community 88 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.05
Nodes (36): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+28 more)

### Community 89 - "units.test.ts"
Cohesion: 0.11
Nodes (26): BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool, Restored, exclusiveJob, TableName (+18 more)

### Community 9 - "core-config.test.ts"
Cohesion: 0.03
Nodes (142): NetworkShown, OpenedConfig, MountedAdminAnswer, AdminSeams, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, adminRoutes (+134 more)

### Community 90 - "order.property.test.ts"
Cohesion: 0.09
Nodes (32): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce() (+24 more)

### Community 91 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 93 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 94 - "chain-events-decode.test.ts"
Cohesion: 0.12
Nodes (24): Field, Registry, fill(), hexOf(), le(), merge(), metadataWith(), rotl() (+16 more)

### Community 96 - "zero-timeouts-checks.ts"
Cohesion: 0.11
Nodes (22): Outcome, setUp(), idleBlock(), migrated(), part(), seenAt(), slowCallbackRead(), slowMigrationAndSetup() (+14 more)

### Community 97 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 98 - "core.ts"
Cohesion: 0.12
Nodes (25): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+17 more)

### Community 99 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 138 - "7. Storage helpers"
Cohesion: 0.08
Nodes (21): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The node on `/status`, The transport reader, TLS to PostgreSQL: `ssl` (+13 more)

### Community 175 - ".constructor"
Cohesion: 0.14
Nodes (5): retryOf(), startupRejection(), unwrap(), nodeClientClosed(), closed()

### Community 241 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 261 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 102 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+26 more)

### Community 110 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.07
Nodes (25): transportReaderRule(), Evidence, 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 9.2 Browser build (BR), 9. Backups and browser (+17 more)

### Community 144 - "refused"
Cohesion: 0.13
Nodes (20): refused(), Problem, 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 12. When a callback fails, Requirement: AE-3 States and conditions (+12 more)

### Community 146 - ".#startup"
Cohesion: 0.14
Nodes (4): openedCursorHeight(), closeSteps(), messageOf(), sourceOf()

### Community 149 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 154 - "log"
Cohesion: 0.12
Nodes (15): join(), normalize(), resolve(), placeFor(), watchingPgDump(), log(), delimiter, sep (+7 more)

### Community 180 - "backupAtStop"
Cohesion: 0.16
Nodes (15): backupAtStop(), ownerOnlyFile(), A backup at the core's stop, A backup of a running process (SIGUSR2), Backups, Restoring a backup, What a backup holds, Writing a backup (+7 more)

### Community 181 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (14): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+6 more)

### Community 183 - "mapping.test.ts"
Cohesion: 0.16
Nodes (5): mapValue(), oid(), identity(), RESULT_COLUMNS, RFC-3339

### Community 185 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 186 - "core-ledger-state.test.ts"
Cohesion: 0.15
Nodes (8): boundLedgerParser(), itemsOf(), applied(), bound(), query(), refusing(), NODES_PER_STATEMENT, STORED_ROOT

### Community 191 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 199 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 206 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 214 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 240 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.29
Nodes (7): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 245 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.29
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 259 - "parseJsonLossless"
Cohesion: 0.40
Nodes (5): parseJsonLossless(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 264 - "v9"
Cohesion: 0.47
Nodes (5): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 273 - "firstRegularAtParentTime"
Cohesion: 0.47
Nodes (4): parentTimeOf(), blockTimeMsAt(), firstRegularAtParentTime(), parentTimestampMs()

### Community 276 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 310 - "checked-ledgers.test.ts"
Cohesion: 0.40
Nodes (3): copyVendoredLedger(), copy, VENDORED_ROOT

### Community 311 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 324 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 35 - "history"
Cohesion: 0.03
Nodes (87): integer(), history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+79 more)

### Community 37 - "table"
Cohesion: 0.03
Nodes (84): side(), migrations(), deferred(), table(), version(), fakePackage(), regular(), system() (+76 more)

### Community 43 - ".put"
Cohesion: 0.03
Nodes (67): coreBlockFetchOnFetch(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+59 more)

### Community 62 - "T"
Cohesion: 0.04
Nodes (46): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+38 more)

### Community 69 - "code"
Cohesion: 0.05
Nodes (42): code(), Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in) (+34 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 84 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 87 - "following"
Cohesion: 0.06
Nodes (35): text(), transportReader(), cursorRead(), following(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Problem, Suggested fix, 17. Trying a module against another node (+27 more)

### Community 103 - "package.json"
Cohesion: 0.06
Nodes (34): bin, umbradb, bugs, url, description, optional, engines, node (+26 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 127 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.07
Nodes (21): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+13 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 130 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 133 - "README.md"
Cohesion: 0.10
Nodes (17): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:, Choosing a database (+9 more)

### Community 137 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 145 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 159 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (19): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+11 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 162 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 167 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 168 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 173 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 174 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 184 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 188 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 189 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 190 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 195 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 196 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 197 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 198 - "ADDED Requirements"
Cohesion: 0.15
Nodes (13): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+5 more)

### Community 201 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 205 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 207 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 208 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 212 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 213 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 215 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 216 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 217 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 221 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 222 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 223 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 224 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 225 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-4 Every field is data, operational or secret, Scenario: A function in the configuration, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: A user module from the configuration file, Scenario: Two `core` revisions with different databases (+1 more)

### Community 226 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 227 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 228 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 231 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 232 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 233 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 234 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 237 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 238 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 239 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 242 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 244 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 246 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 247 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 248 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 249 - "Requirement: PP-4 The process transport"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, Spec delta — `private-processes` capability

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

### Community 260 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 262 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 263 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 265 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 266 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 267 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 268 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 269 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 270 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 271 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 272 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 278 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 279 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 280 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 281 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 282 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 283 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 284 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 285 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 286 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 287 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 288 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 289 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 290 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 291 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 292 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 293 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 294 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 295 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 296 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 297 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 298 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 299 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 300 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 301 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 302 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 303 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 304 - "00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail"
Cohesion: 0.40
Nodes (4): 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem, Suggested fix

### Community 305 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 306 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 307 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.40
Nodes (4): 0. Specification freeze, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 308 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 312 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 313 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 314 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 315 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 316 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 317 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 318 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 319 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 320 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 71 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 81 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-8949`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3985 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `InMemoryBlockSource`, `ingest-harness.ts`, `admin-harness.ts`, `ref_node_fs`, `loop.ts`, `tape/index.ts`, `start-umbradb.ts`, `api-server.test.ts`, `UmbraError`, `core-config.test.ts`, `range.test.ts`, `src/db/postgres.ts`, `BlockRef`, `config/history.ts`, `adapter-fixtures.ts`, `NodeBlockSource`, `client.test.ts`, `ReadHandle`, `core-transport.ts`, `core-block-parsed.ts`, `ModuleDeclaration`, `deterministic-postgresql/index.ts`, `validate.ts`, `Database`, `loop-stop-harness.ts`, `declaration.ts`, `db/backends.ts`, `NodeClient`, `host.ts`, `builds.ts`, `devnet-upgrade.test.ts`, `ledger/types.ts`, `writer-lock-checks.ts`, `adapter.ts`, `lockstep-refusals.test.ts`, `ledger/ledger-tasks.test.ts`, `binding.test.ts`, `redact.ts`, `slow-block-harness.ts`, `core-ledger-state.ts`, `column-refusals.test.ts`, `runner/process.ts`, `column-rules.test.ts`, `db/errors.ts`, `worker-storage.test.ts`, `validation.ts`, `contract-modules.test.ts`, `signal-ignored-fixtures.ts`, `boundary.test.ts`, `retirement.test.ts`, `coreEntry`, `transport.test.ts`, `contract-data-checks.ts`, `changes.property.test.ts`, `sweep-tapes.ts`, `config/plain-data.ts`, `build-modules.ts`, `cold-boot-recovery.integration.test.ts`, `startup-stop-harness.ts`, `core-ledger-state/sql.ts`, `net.test.ts`, `failures.ts`, `units.test.ts`, `order.property.test.ts`, `release-version.ts`, `chain-events-decode.test.ts`, `zero-timeouts-checks.ts`, `browser.test.ts`, `core.ts`, `browser/build.ts`, `contents-hash.ts`, `package.json`, `postgres/transaction-history-storage.ts`, `documents.ts`, `pg-tx-history-adapter.ts`, `Lockstep`, `read-gate.ts`, `test/postgres/setup.ts`, `containers.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `surface.test.ts`, `block-fetch-decode.test.ts`, `cbor.property.test.ts`, `version-checks.ts`, `example-checks.ts`, `ledger-sweep.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `version.negative-control.test.ts`, `text.test.ts`, `excluded-not-exported.test.ts`, `LoopPauses`, `ledger-liveness.test.ts`, `process-access.ts`, `ws-mutual-tls.test.ts`, `.constructor`, `networks.test.ts`, `resolver-boundary.ts`, `shims.test.ts`, `statementsOf`, `mapping.test.ts`, `mutation-per-adapter.mjs`, `core-ledger-state.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `facade-merge-loader.ts`, `postgres-image.test.ts`, `renamed-setting.test.ts`, `firstRegularAtParentTime`, `checked-ledgers.test.ts`?**
  _High betweenness centrality (0.254) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 19 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-8949` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InMemoryBlockSource` be split into smaller, more focused modules?**
  _Cohesion score 0.01903914590747331 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `InMemoryBlockSource`, `ingest-harness.ts`, `admin-harness.ts`, `ref_node_fs`, `loop.ts`, `tape/index.ts`, `start-umbradb.ts`, `api-server.test.ts`, `core-config.test.ts`, `src/db/postgres.ts`, `BlockRef`, `config/history.ts`, `version-checks.ts`, `NodeBlockSource`, `client.test.ts`, `.#startup`, `core-transport.ts`, `core-block-parsed.ts`, `ModuleDeclaration`, `version-table.ts`, `validate.ts`, `deterministic-postgresql/index.ts`, `loop-stop-harness.ts`, `Database`, `declaration.ts`, `NodeClient`, `db/backends.ts`, `ledger/types.ts`, `column-rules.ts`, `writer-lock-checks.ts`, `core-chain.ts`, `table`, `lockstep-refusals.test.ts`, `ledger/ledger-tasks.test.ts`, `LedgerPackage`, `binding.test.ts`, `FinalizedLoop`, `range.ts`, `redact.ts`, `.constructor`, `paused-harness.ts`, `slow-block-harness.ts`, `core-ledger-state.ts`, `shims.test.ts`, `backupAtStop`, `aborted`, `db/errors.ts`, `statementsOf`, `runner/process.ts`, `cbor.ts`, `graph.ts`, `checkParent`, `validation.ts`, `core-ledger-state.test.ts`, `mapping.test.ts`, `coreEntry`, `checkShape`, `transport.test.ts`, `changes.property.test.ts`, `config/plain-data.ts`, `build-modules.ts`, `backup/backup.ts`, `failures.ts`, `units.test.ts`, `browser/src/config/load.ts`, `sha256`, `ReadHandle`, `zero-timeouts-checks.ts`, `contents-hash.ts`, `restore-private.ts`, `renamed-setting.test.ts`, `mapping.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `ingest-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.023645685758618362 - nodes in this community are weakly interconnected._