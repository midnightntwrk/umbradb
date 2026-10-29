# Graph Report - UmbraDB

## Corpus Check
- 1076 files · ~1,505,882 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11254 nodes · 34263 edges · 329 communities (298 shown, 31 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2651 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `5da0385023793592` (1076 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- FinalizedLoop
- admin-harness.ts
- column-rules.ts
- halts.test.ts
- chain-process.test.ts
- core.ts
- lockstep-refusals.test.ts
- slow-block-harness.ts
- browser.test.ts
- ConnectSocket
- connectionOfUrl
- migrate.ts
- writer-lock-checks.ts
- code-registry.ts
- postgres/transaction-history-storage.ts
- runtime-metadata.test.ts
- ledger-state.test.ts
- test/postgres/setup.ts
- crash.test.ts
- process-backends.ts
- node-fields-harness.ts
- documents.ts
- version-checks.ts
- Lockstep
- read-gate.ts
- TransactionHistoryEntry
- relays.ts
- pg-tx-history-adapter.ts
- declaration.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- config/plain-data.ts
- pglite-writer-processes.test.ts
- process-admin.ts
- slow-block-cases.test.ts
- PrivateTransport
- node-bridge.ts
- worker-threads.test.ts
- ws-mutual-tls.test.ts
- pglite-lock.ts
- LoopPauses
- pack-install.mjs
- cbor.ts
- example-checks.ts
- ledger-sweep.test.ts
- browser-harness.ts
- Buffer
- version-table.ts
- chrome.ts
- key-handling-checks.ts
- sweep.ts
- adapter-fixtures.ts
- commit-proxy.ts
- config/history.ts
- version.negative-control.test.ts
- sigterm.worker.ts
- surface.test.ts
- FakeNode
- Design — Sprint 1: project setup + TemporalKV
- statementsOf
- recovery.test.ts
- BlockRef
- Worker
- retention.ts
- web-lock.ts
- upgrade-boundary.test.ts
- NodeClient
- text.test.ts
- backup/restore.ts
- fetch-fixtures.ts
- .send
- TapeAnswers
- sha256
- ModuleDeclaration
- chain-placement.test.ts
- type-check.ts
- sweepStep
- ProcessItems
- ref_node_fs
- .value
- mutation-evidence.d.mts
- builder.negative-control.test.ts
- AsyncLocalStorage
- ledger-tapes.ts
- loop-stop-harness.ts
- validation.ts
- runner/process.ts
- core-transport.ts
- client.test.ts
- core-block-parsed.ts
- https.ts
- NodeFS
- ledger/types.ts
- .read
- spawnChild
- validate.ts
- vitest
- TapeNode
- Process
- adapter.ts
- core-config.test.ts
- InMemoryBlockSource
- range.ts
- intake.test.ts
- contract-modules.test.ts
- LedgerPackage
- .from
- pause-fixtures.ts
- ref_node_timers
- src/ledger/identity.ts
- backup/backup.ts
- db/errors.ts
- contract-data-checks.ts
- boundary.test.ts
- config-check.ts
- PgTransactionHistoryStorage
- transport.test.ts
- net.test.ts
- in-memory-source.ts
- api-server.test.ts
- binding.test.ts
- database-parts.ts
- process-worker.ts
- mapping.ts
- builds.ts
- ledger/ledger-tasks.test.ts
- graph.ts
- checkShape
- interfaces/transaction-history-storage.ts
- retirement.test.ts
- module-tables.ts
- file-mode.test.ts
- restore-private.ts
- networks.ts
- HeightRun
- real-tapes.ts
- worker-storage.test.ts
- UmbraError
- config-check-database.test.ts
- core-ledger-state.ts
- startProcess
- startup-stop-harness.ts
- paused-harness.ts
- admin/serve.test.ts
- tape/index.ts
- cold-boot-recovery.integration.test.ts
- release-version.ts
- containers.test.ts
- browser/build.ts
- page.ts
- cli/run.ts
- 7. Storage helpers
- Proposal — Sprint 3: CheckpointStore
- table
- transform-checks.ts
- UmbraDB third-party component inventory (SBOM)
- T
- .slowBlockMs
- core-ledger-state.test.ts
- .concat
- UmbraDB
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- twox.ts
- facade-merge-loader.ts
- scoped-review-manifest
- path.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- v9
- orphan-watcher.mjs
- fresh-instance.mjs
- crash-worker.ts
- history
- version
- code
- .put
- ADDED Requirements
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- Backups
- ADDED Requirements
- REMOVED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- README.md
- ADDED Requirements
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Boundaries, threats and controls
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.9.5] - 2026-07-25 — "Penumbra"
- ROADMAP.md
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- After 0.10.0
- Contributing
- UmbraDB in a browser
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- The laws of UmbraDB's storage helpers
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
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
- UmbraDB node architecture
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-infosec-signoff
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- lib.sh
- Vendored ledger builds
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
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
- bug-report.md
- feature-request.md
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
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
- zod.test.ts
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
- package.json
- post-block-update/oracle/main.rs
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 372 edges
2. `UmbraError` - 314 edges
3. `ModuleDeclaration` - 177 edges
4. `FinalizedLoop` - 133 edges
5. `InMemoryBlockSource` - 120 edges
6. `NodeClient` - 113 edges
7. `Database` - 100 edges
8. `BlockRef` - 95 edges
9. `ReadHandle` - 89 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Evidence` --references--> `ManualTimers`  [INFERRED]
  docs/issues/00016-heartbeat-above-timer-limit.md → test/node/manual-timers.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (329 total, 31 thin omitted)

### Community 0 - "FinalizedLoop"
Cohesion: 0.02
Nodes (113): PointName, ResolvedRange, LateUse, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+105 more)

### Community 1 - "admin-harness.ts"
Cohesion: 0.02
Nodes (161): AdminServer, BlockItemSource, HistoryOptions, ProcessConfig, ProcessState, AdminRun, Answered, Answerer (+153 more)

### Community 10 - "column-rules.ts"
Cohesion: 0.02
Nodes (116): CatalogColumn, CatalogOptions, CatalogTable, CheckFunctionsOptions, IntegerRule, IntegerRules, JsonbNumberRule, AllowedRule (+108 more)

### Community 100 - "halts.test.ts"
Cohesion: 0.09
Nodes (30): ChainDataView, A43Case, A43Observation, Outcome, SilentHalt, answerChainData(), chainDataHeaders(), hex() (+22 more)

### Community 102 - "chain-process.test.ts"
Cohesion: 0.09
Nodes (28): WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing, Flaky (+20 more)

### Community 103 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 105 - "lockstep-refusals.test.ts"
Cohesion: 0.12
Nodes (32): LockstepCondition, PrivateProcess, A118Observation, MismatchObservation, ExpectedWait, WaitSample, inMemoryBlock(), a118Problems() (+24 more)

### Community 106 - "slow-block-harness.ts"
Cohesion: 0.13
Nodes (27): ReadOpener, StatusBody, BodyRead, HoldMode, HoldSpec, Observed, OutsidePoint, Seen (+19 more)

### Community 107 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageRestore, StatusBody, continuedProblems(), midChainProblems(), networkProblems() (+25 more)

### Community 108 - "ConnectSocket"
Cohesion: 0.09
Nodes (19): Connection, NodeClientOptions, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets (+11 more)

### Community 109 - "connectionOfUrl"
Cohesion: 0.08
Nodes (26): driverConnectionOptions, PostgresConnection, TlsPostgres, Job, openPgliteOn(), postgresBackend(), databaseAs(), pgliteCliBackend() (+18 more)

### Community 11 - "migrate.ts"
Cohesion: 0.03
Nodes (100): Transaction, AppliedRow, Runnable, Settling, StartupInput, MultiStatementRunner, Difference, OwnPart (+92 more)

### Community 111 - "writer-lock-checks.ts"
Cohesion: 0.16
Nodes (23): PostgresOptions, PauseReport, startWriter(), expectRefusedBeforeAnyWrite(), noHeight(), firstOf(), opened(), loginOn() (+15 more)

### Community 113 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 114 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+11 more)

### Community 116 - "runtime-metadata.test.ts"
Cohesion: 0.10
Nodes (17): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, MetadataBlock, RuntimeMetadata, RuntimeMetadataEntry, Boundary, UpgradeCase (+9 more)

### Community 117 - "ledger-state.test.ts"
Cohesion: 0.15
Nodes (22): ChildReader, childRefKeys(), readChildren(), a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows() (+14 more)

### Community 118 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 119 - "crash.test.ts"
Cohesion: 0.10
Nodes (25): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, SkipsStartAtRestart, WORKER, CrashJob (+17 more)

### Community 12 - "process-backends.ts"
Cohesion: 0.03
Nodes (105): RestoreInput, LedgerActivity, LedgerWorkerFailure, LedgerWorkerOptions, NodeDatabase, ParseRequest, Pending, SentParses (+97 more)

### Community 120 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (24): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Run() (+16 more)

### Community 121 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 122 - "version-checks.ts"
Cohesion: 0.16
Nodes (25): CallRecord, Answers, toHex(), H(), withCore(), blockWith(), copyVendoredLedger(), expectBadVersionDigestHalts() (+17 more)

### Community 123 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 124 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 125 - "TransactionHistoryEntry"
Cohesion: 0.12
Nodes (8): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 127 - "relays.ts"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 128 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 13 - "declaration.ts"
Cohesion: 0.03
Nodes (90): StatsRow, Outcome, BlockWriteHandle, ReadHandle, SchemaWriteHandle, cursorTable, CursorTableOptions, CursorValue (+82 more)

### Community 131 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 132 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 133 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 134 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 137 - "config/plain-data.ts"
Cohesion: 0.11
Nodes (22): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, copyArray(), copyObject(), instanceOf() (+14 more)

### Community 138 - "pglite-writer-processes.test.ts"
Cohesion: 0.12
Nodes (20): WriterProcess, WorkerEvent, blocksIn(), cleanUp(), startWriterProcess(), workDirectory(), dataDirectory(), expectPausedWriterKeepsLock() (+12 more)

### Community 14 - "process-admin.ts"
Cohesion: 0.04
Nodes (109): ConfigFacts, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, DigestRow (+101 more)

### Community 141 - "slow-block-cases.test.ts"
Cohesion: 0.16
Nodes (23): BlockEventSource, Times, Wait, askedSource, afterCommitProblems(), earlyProblems(), neverShown(), shownOf() (+15 more)

### Community 142 - "PrivateTransport"
Cohesion: 0.14
Nodes (8): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), reject(), resolve(), client()

### Community 143 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 144 - "worker-threads.test.ts"
Cohesion: 0.09
Nodes (13): Listener, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread, parentPort (+5 more)

### Community 145 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 146 - "pglite-lock.ts"
Cohesion: 0.14
Nodes (19): CreatedDirectory, Held, PgliteLockUse, Job, acquirePgliteLock(), directoryPath(), lockHeld(), openFailed() (+11 more)

### Community 147 - "LoopPauses"
Cohesion: 0.10
Nodes (15): LoopPaused, LoopPauses, clock(), watched(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch (+7 more)

### Community 149 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 15 - "cbor.ts"
Cohesion: 0.03
Nodes (120): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+112 more)

### Community 150 - "example-checks.ts"
Cohesion: 0.16
Nodes (17): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+9 more)

### Community 152 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (13): SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints() (+5 more)

### Community 154 - "browser-harness.ts"
Cohesion: 0.20
Nodes (18): BrowserControl, PageEvent, ProcessName, PageServer, backupThrough(), byDeadline(), call(), eventsOf() (+10 more)

### Community 155 - "Buffer"
Cohesion: 0.14
Nodes (13): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+5 more)

### Community 156 - "version-table.ts"
Cohesion: 0.18
Nodes (20): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+12 more)

### Community 157 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 158 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 159 - "sweep.ts"
Cohesion: 0.13
Nodes (12): GreyView, SweepPhase, BYTE_ORDER(), hexOf(), merged(), writeSweep(), hex(), CORE_LEDGER_STATE_MIGRATIONS (+4 more)

### Community 16 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (103): ApplyInput, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+95 more)

### Community 169 - "commit-proxy.ts"
Cohesion: 0.16
Nodes (8): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), COMMIT_COMPLETE, COMMIT_QUERY

### Community 17 - "config/history.ts"
Cohesion: 0.04
Nodes (109): CoreSettings, versionEntry, ConfigHashRow, HistoryCode, HistoryContext, ProvidesRow, Span, Simulation (+101 more)

### Community 172 - "version.negative-control.test.ts"
Cohesion: 0.17
Nodes (9): MetadataNode, CountingNode, MetadataSelector, Select, OwnStateMetadata, expectUpgradeDecoding(), runtimeAt(), tapeMetadataNode() (+1 more)

### Community 173 - "sigterm.worker.ts"
Cohesion: 0.16
Nodes (14): Job, WorkEvent, WorkOptions, Job, report(), workModule(), report(), handle (+6 more)

### Community 174 - "surface.test.ts"
Cohesion: 0.20
Nodes (15): Surface, coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), runtimeValues(), section12(), section12Surface() (+7 more)

### Community 177 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 178 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 179 - "recovery.test.ts"
Cohesion: 0.23
Nodes (15): AlwaysLost, Fault, Recorded, RecoveryObservation, committedProblems(), count(), landedProblems(), neitherProblems() (+7 more)

### Community 18 - "BlockRef"
Cohesion: 0.03
Nodes (45): HeadWait, NodeBlockSource, Prefetch, QueuedBlock, NodeCallOptions, NodeSubscription, NodeHeader, BlockRef (+37 more)

### Community 180 - "Worker"
Cohesion: 0.21
Nodes (3): Worker, 9.2 Browser build (BR), 9. Backups and browser

### Community 184 - "retention.ts"
Cohesion: 0.19
Nodes (10): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, FixtureRunOptions, revisionsOf(), coreRevisionsOf(), releasedBy() (+2 more)

### Community 185 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 189 - "upgrade-boundary.test.ts"
Cohesion: 0.21
Nodes (12): A47Observation, CommitsTheBoundary, Controls, Version, a47Problems(), a47Run(), big(), buildOf() (+4 more)

### Community 19 - "NodeClient"
Cohesion: 0.05
Nodes (71): NodeSourceOptions, CoreChainBinding, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+63 more)

### Community 195 - "text.test.ts"
Cohesion: 0.23
Nodes (6): BackupText, blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir

### Community 2 - "backup/restore.ts"
Cohesion: 0.02
Nodes (130): ChainCheck, ChainCheckInput, ConfiguredGenesis, PrivateBlockSource, PrivateChecks, PrivateShared, PrivateSourceOptions, SourceTransport (+122 more)

### Community 20 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (99): ProcessCondition, EventSpec, Scenario, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME (+91 more)

### Community 206 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 207 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 21 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (78): AppliedMigration, MigrationPart, ModuleDeclaration, ProcessContext, ResolvedGraph, DeclarationRule, MisuseListener, MisuseReports (+70 more)

### Community 22 - "chain-placement.test.ts"
Cohesion: 0.05
Nodes (91): BlockParsed, itemsSeen, BlockSpec, Json, transactionSpec, eventsRuntime, Field, PalletMetadata (+83 more)

### Community 222 - "type-check.ts"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 23 - "ref_node_fs"
Cohesion: 0.06
Nodes (63): RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore, WORKER, SignalEvent, NodeRunResult, cliProject (+55 more)

### Community 24 - ".value"
Cohesion: 0.05
Nodes (71): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+63 more)

### Community 245 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 247 - "builder.negative-control.test.ts"
Cohesion: 0.29
Nodes (3): Failure, Variant, WrongRecording

### Community 25 - "ledger-tapes.ts"
Cohesion: 0.05
Nodes (63): RawPackageClass, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch (+55 more)

### Community 26 - "loop-stop-harness.ts"
Cohesion: 0.05
Nodes (92): CrashEvent, CrashJob, watched, Call, SeenLoad, RestartEvent, RestartJob, retentionSeen (+84 more)

### Community 27 - "validation.ts"
Cohesion: 0.02
Nodes (93): LedgerTableSettings, TransportReaderSettings, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder (+85 more)

### Community 28 - "runner/process.ts"
Cohesion: 0.03
Nodes (62): OpenedFacts, Bound, ChainSource, CoreChainFacts, NodeWait, WaitingListener, RestoreBase, CheckState (+54 more)

### Community 29 - "core-transport.ts"
Cohesion: 0.04
Nodes (76): ResultColumn, Session, TransportLimits, TransportTls, Committed, Hello, JsonValue, MessageFault (+68 more)

### Community 3 - "client.test.ts"
Cohesion: 0.02
Nodes (96): NodeRetry, Answer, Handler, Received, recorded, ManualTimers, ConnectionFrames, Recorded (+88 more)

### Community 30 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (84): BodyExtrinsic, BlockBody, BlockParsedOptions, TransactionParser, ChainTransaction, ChainEvent, EventPhase, ScaleValue (+76 more)

### Community 31 - "ledger/types.ts"
Cohesion: 0.05
Nodes (61): LedgerStateItem, RetainedState, LedgerName, AdapterSpec, LedgerRelease, ApplyOutput, ChainOutcome, LedgerEvent (+53 more)

### Community 32 - ".read"
Cohesion: 0.04
Nodes (76): SchemaPlan, Chain, ChainOptions, DigestRow, Settings, Outcome, digestBlock(), openBlockWrites() (+68 more)

### Community 33 - "spawnChild"
Cohesion: 0.03
Nodes (67): ParentJob, Kill, Orphaned, SourceFile, Run, Job, WorkerEvent, LockResult (+59 more)

### Community 34 - "validate.ts"
Cohesion: 0.04
Nodes (77): coreEntry, HistoryFinding, TextPattern, ConfigRule, CursorRule, EntryRef, Finding, Issue (+69 more)

### Community 35 - "vitest"
Cohesion: 0.03
Nodes (52): Served, Row, Finding, Lockfile, Manifest, RepositoryFile, Upstream, ReportedTest (+44 more)

### Community 36 - "TapeNode"
Cohesion: 0.04
Nodes (33): Outage, Metadata, Step, RawClient, Failure, Variant, TapeClock, TapeNode (+25 more)

### Community 37 - "Process"
Cohesion: 0.05
Nodes (26): CoreTransport, BlockSource, ProcessReason, ReasonCode, Unwrapped, PauseHold, Process, SignalTarget (+18 more)

### Community 38 - "adapter.ts"
Cohesion: 0.04
Nodes (58): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+50 more)

### Community 39 - "core-config.test.ts"
Cohesion: 0.06
Nodes (55): adminRoutes, AdminStartOptions, AdminEndpoint, AdminPart, AdminSnapshot, AdminView, ReadinessFacts, CommandBuildOptions (+47 more)

### Community 4 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (127): ErrorCode, EntryRange, GraphInput, InMemoryBlockSource, LockstepWait, LoopEnd, LoopInput, SlowBlockEvent (+119 more)

### Community 40 - "range.ts"
Cohesion: 0.04
Nodes (61): Refusal, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command, CompletenessRange, RecordingError (+53 more)

### Community 41 - "intake.test.ts"
Cohesion: 0.05
Nodes (59): PrivateBackend, SessionSeen, PrivateSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation (+51 more)

### Community 42 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (60): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+52 more)

### Community 43 - "LedgerPackage"
Cohesion: 0.06
Nodes (31): LedgerPackage, LedgerEngine, LedgerTaskFailed, hexOf(), idOf(), same(), sameBytes(), typeScriptEntry() (+23 more)

### Community 44 - ".from"
Cohesion: 0.07
Nodes (56): FixtureRun, ModelBatch, SweepModel, TableSnapshot, FixtureNode, FakeState, RefusalData, hexOf() (+48 more)

### Community 45 - "pause-fixtures.ts"
Cohesion: 0.05
Nodes (53): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, StaysPaused (+45 more)

### Community 46 - "ref_node_timers"
Cohesion: 0.05
Nodes (48): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, CommandResult, RunningCommand, statsConfig, backupArguments() (+40 more)

### Community 47 - "src/ledger/identity.ts"
Cohesion: 0.06
Nodes (51): LoadLedger, ManifestLine, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, LedgerPackageOptions, V9Logs, LoadAdapter (+43 more)

### Community 49 - "backup/backup.ts"
Cohesion: 0.07
Nodes (58): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+50 more)

### Community 5 - "db/errors.ts"
Cohesion: 0.03
Nodes (86): Database, ReadOnlyDatabase, ReadOptions, ReadTimeoutSetting, SchemaItem, SchemaMigration, SchemaModule, TestDatabase (+78 more)

### Community 50 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (59): ContractStateRow, CoreContractStatesOptions, DefinedModule, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+51 more)

### Community 51 - "boundary.test.ts"
Cohesion: 0.07
Nodes (48): DesignTable, RowCoverage, ModuleReference, Finding, collationsWritten(), componentCode(), componentExports(), componentTexts() (+40 more)

### Community 52 - "config-check.ts"
Cohesion: 0.06
Nodes (50): BackupOutcome, CheckFinding, ConfigCheckOptions, ConfigCheckSeams, StepName, StepReport, StepStatus, commandTarget (+42 more)

### Community 53 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (51): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity (+43 more)

### Community 54 - "transport.test.ts"
Cohesion: 0.07
Nodes (39): Message, ReadResult, PublicCore, TestCertificates, Ended, rawClient, Escape, publicState (+31 more)

### Community 55 - "net.test.ts"
Cohesion: 0.06
Nodes (27): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortSocket (+19 more)

### Community 56 - "in-memory-source.ts"
Cohesion: 0.05
Nodes (45): InMemoryItems, Wait, CommitOutcome, HeldHeight, StandInOptions, Commit, Committed, Outcomes (+37 more)

### Community 6 - "api-server.test.ts"
Cohesion: 0.03
Nodes (106): ModuleApiServer, ModuleApiStart, StartedModuleApi, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart (+98 more)

### Community 60 - "binding.test.ts"
Cohesion: 0.07
Nodes (43): startHashDecision, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding, Created (+35 more)

### Community 61 - "database-parts.ts"
Cohesion: 0.08
Nodes (30): PglitePathParts, PostgresParts, PostgresPartsInput, A162Options, a162Run, HeaderSeen, TransportProxy, canWriteFindings() (+22 more)

### Community 62 - "process-worker.ts"
Cohesion: 0.07
Nodes (34): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, Scope (+26 more)

### Community 63 - "mapping.ts"
Cohesion: 0.07
Nodes (36): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+28 more)

### Community 64 - "builds.ts"
Cohesion: 0.07
Nodes (39): AdminStarter, PrivateIntakeOptions, PublicWakes, DatabaseParts, AdminRunOptions, A176Options, TickerConfig, PausableConfig (+31 more)

### Community 65 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.06
Nodes (35): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), bindLedgerTasks() (+27 more)

### Community 66 - "graph.ts"
Cohesion: 0.07
Nodes (46): Edge, GraphFacts, GraphPart, GraphRule, HeightRange, MidChain, Missing, RangeCheck (+38 more)

### Community 67 - "checkShape"
Cohesion: 0.07
Nodes (39): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+31 more)

### Community 68 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (37): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+29 more)

### Community 69 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 7 - "module-tables.ts"
Cohesion: 0.03
Nodes (101): CaptureColumn, CapturedTable, CaptureState, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure (+93 more)

### Community 70 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (32): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+24 more)

### Community 72 - "restore-private.ts"
Cohesion: 0.08
Nodes (36): LoadOptions, FileProcess, privateBackup, PublicSetting, PublicSide, PublicSideOptions, SignalJob, invalid() (+28 more)

### Community 73 - "networks.ts"
Cohesion: 0.06
Nodes (39): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+31 more)

### Community 76 - "HeightRun"
Cohesion: 0.05
Nodes (18): BlockItems, HeightRun, PausesInsideTheHeight, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, CommitsDespiteLastWrite (+10 more)

### Community 77 - "real-tapes.ts"
Cohesion: 0.08
Nodes (35): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+27 more)

### Community 79 - "worker-storage.test.ts"
Cohesion: 0.07
Nodes (29): StoredNode, OracleState, OracleVersion, StagenetBlockJson, StagenetFixtureJson, Nodes, stateBytes(), stateTreesProblems() (+21 more)

### Community 8 - "UmbraError"
Cohesion: 0.03
Nodes (83): LoadedConfig, LoadOptions, PostgresConnection, PostgresOptions, SslMode, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning (+75 more)

### Community 81 - "config-check-database.test.ts"
Cohesion: 0.07
Nodes (28): CheckStep, CheckTarget, CliBackend, Snapshot, configCheck(), configText(), coreSettings(), inChild() (+20 more)

### Community 82 - "core-ledger-state.ts"
Cohesion: 0.09
Nodes (36): BlockLedgerSource, LedgerBinding, applyBlock(), boundLedger(), bytesOf(), computeBlock(), contractsOf(), deployedBelow() (+28 more)

### Community 83 - "startProcess"
Cohesion: 0.13
Nodes (33): ProcessObservation, testBuild, Phase, killedWhileQueued(), committedIn(), processOn(), rowsIn(), packageProcess() (+25 more)

### Community 86 - "startup-stop-harness.ts"
Cohesion: 0.09
Nodes (26): A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, WatchedClient, checkChain(), hex() (+18 more)

### Community 87 - "paused-harness.ts"
Cohesion: 0.11
Nodes (33): ProcessHandle, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, a176Project() (+25 more)

### Community 88 - "admin/serve.test.ts"
Cohesion: 0.09
Nodes (25): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminAnswer, Heartbeat, adminAnswer(), isMessage() (+17 more)

### Community 9 - "tape/index.ts"
Cohesion: 0.04
Nodes (102): Failure, Variant, RecordingProblem, TapeError, TapeProblem, TransformError, TransformProblem, readRequest (+94 more)

### Community 94 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (23): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+15 more)

### Community 95 - "release-version.ts"
Cohesion: 0.12
Nodes (35): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+27 more)

### Community 96 - "containers.test.ts"
Cohesion: 0.08
Nodes (25): BenchEnv, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer() (+17 more)

### Community 97 - "browser/build.ts"
Cohesion: 0.08
Nodes (27): BrowserBuild, BrowserBuildOptions, checkedLedgers, pageBench, browserLedgerEntry(), browserPlugin(), buildBrowser(), common() (+19 more)

### Community 98 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 99 - "cli/run.ts"
Cohesion: 0.08
Nodes (26): privateIntake, backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, ProcessingEnd (+18 more)

### Community 176 - "7. Storage helpers"
Cohesion: 0.12
Nodes (13): The node on `/status`, 7. Storage helpers, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+5 more)

### Community 231 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 90 - "table"
Cohesion: 0.06
Nodes (36): params(), table(), fakePackage(), regular(), system(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem (+28 more)

### Community 104 - "transform-checks.ts"
Cohesion: 0.10
Nodes (17): baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape(), expectVariantOutput(), forkRecords(), header(), changedLines() (+9 more)

### Community 112 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (28): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+20 more)

### Community 140 - "T"
Cohesion: 0.09
Nodes (24): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get` (+16 more)

### Community 151 - ".slowBlockMs"
Cohesion: 0.11
Nodes (19): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+11 more)

### Community 163 - "core-ledger-state.test.ts"
Cohesion: 0.12
Nodes (12): bindLedgerParser(), boundLedgerParser(), workerParser(), bindCoreLedgerState(), itemsOf(), writeBlock(), applied(), bound() (+4 more)

### Community 165 - ".concat"
Cohesion: 0.11
Nodes (15): probe(), tailOf(), records, 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness (+7 more)

### Community 167 - "UmbraDB"
Cohesion: 0.12
Nodes (18): text(), transportReader(), Backup and restore, Check and run, Configuration files, Create a project, Example: loading `stats-module`, Install UmbraDB (+10 more)

### Community 181 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (13): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+5 more)

### Community 183 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 190 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 198 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 209 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 226 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 234 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 254 - "v9"
Cohesion: 0.47
Nodes (5): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 264 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 292 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 303 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 48 - "history"
Cohesion: 0.04
Nodes (61): history(), revision(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+53 more)

### Community 57 - "version"
Cohesion: 0.04
Nodes (55): side(), migrations(), version(), 1. Overview, Appendix A. Reference, 0. Project setup, 1. TemporalKV, 2. Sprint close-out (+47 more)

### Community 58 - "code"
Cohesion: 0.04
Nodes (52): code(), Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log, The five stages (+44 more)

### Community 59 - ".put"
Cohesion: 0.04
Nodes (47): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+39 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 92 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.06
Nodes (37): 5. WalletState envelope, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll (+29 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+19 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 136 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 148 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 153 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 162 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 166 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 168 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 170 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 171 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 182 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 186 - "Backups"
Cohesion: 0.14
Nodes (14): A backup at the core's stop, A backup of a running process (SIGUSR2), A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Backups, Checking a configuration against its database, Restoring a backup (+6 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 188 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 191 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 192 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 193 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 194 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 196 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 197 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 199 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 201 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 202 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 203 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 204 - "README.md"
Cohesion: 0.29
Nodes (3): Choosing a database, Launching it, stats-module

### Community 205 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 208 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 210 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 211 - "Boundaries, threats and controls"
Cohesion: 0.20
Nodes (10): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+2 more)

### Community 212 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 213 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 214 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 215 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 216 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 217 - "ROADMAP.md"
Cohesion: 0.22
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 218 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 219 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 220 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 221 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 223 - "After 0.10.0"
Cohesion: 0.22
Nodes (9): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Feature modules, Later core work, Non-goals, Release gates still to run (+1 more)

### Community 227 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 228 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 229 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 230 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 232 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 233 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 235 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 236 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 237 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.29
Nodes (6): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers

### Community 238 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 239 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 240 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 241 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 242 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 243 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 244 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 246 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 249 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 250 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 251 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 252 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 253 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 255 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 256 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 257 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 258 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 259 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 260 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 261 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 262 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 263 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 265 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 266 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 267 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 268 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 269 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 270 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 271 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 272 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 273 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 274 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 275 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 276 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 277 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 278 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 279 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 280 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 281 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 282 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 283 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 284 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 285 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 286 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 287 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 288 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 289 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 290 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 291 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 293 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 294 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 295 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 296 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 297 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 298 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 299 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 300 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 301 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 302 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 71 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 85 - "package.json"
Cohesion: 0.05
Nodes (39): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+31 more)

### Community 89 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-8949`, `RFC-6455`, `RFC-3339` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3762 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `FinalizedLoop`, `admin-harness.ts`, `backup/restore.ts`, `client.test.ts`, `InMemoryBlockSource`, `db/errors.ts`, `api-server.test.ts`, `module-tables.ts`, `UmbraError`, `tape/index.ts`, `column-rules.ts`, `migrate.ts`, `process-backends.ts`, `declaration.ts`, `process-admin.ts`, `cbor.ts`, `adapter-fixtures.ts`, `config/history.ts`, `BlockRef`, `NodeClient`, `fetch-fixtures.ts`, `ModuleDeclaration`, `chain-placement.test.ts`, `ref_node_fs`, `.value`, `ledger-tapes.ts`, `loop-stop-harness.ts`, `validation.ts`, `runner/process.ts`, `core-transport.ts`, `ledger/types.ts`, `.read`, `spawnChild`, `validate.ts`, `TapeNode`, `Process`, `adapter.ts`, `core-config.test.ts`, `intake.test.ts`, `contract-modules.test.ts`, `.from`, `pause-fixtures.ts`, `ref_node_timers`, `src/ledger/identity.ts`, `backup/backup.ts`, `contract-data-checks.ts`, `boundary.test.ts`, `config-check.ts`, `transport.test.ts`, `net.test.ts`, `in-memory-source.ts`, `binding.test.ts`, `database-parts.ts`, `process-worker.ts`, `mapping.ts`, `builds.ts`, `ledger/ledger-tasks.test.ts`, `interfaces/transaction-history-storage.ts`, `retirement.test.ts`, `file-mode.test.ts`, `restore-private.ts`, `networks.ts`, `HeightRun`, `real-tapes.ts`, `worker-storage.test.ts`, `config-check-database.test.ts`, `core-ledger-state.ts`, `startProcess`, `package.json`, `startup-stop-harness.ts`, `paused-harness.ts`, `admin/serve.test.ts`, `cold-boot-recovery.integration.test.ts`, `release-version.ts`, `containers.test.ts`, `browser/build.ts`, `cli/run.ts`, `halts.test.ts`, `chain-process.test.ts`, `core.ts`, `transform-checks.ts`, `lockstep-refusals.test.ts`, `slow-block-harness.ts`, `browser.test.ts`, `ConnectSocket`, `connectionOfUrl`, `writer-lock-checks.ts`, `code-registry.ts`, `postgres/transaction-history-storage.ts`, `runtime-metadata.test.ts`, `ledger-state.test.ts`, `test/postgres/setup.ts`, `crash.test.ts`, `documents.ts`, `version-checks.ts`, `Lockstep`, `read-gate.ts`, `pg-tx-history-adapter.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `config/plain-data.ts`, `pglite-writer-processes.test.ts`, `slow-block-cases.test.ts`, `node-bridge.ts`, `worker-threads.test.ts`, `ws-mutual-tls.test.ts`, `LoopPauses`, `example-checks.ts`, `ledger-sweep.test.ts`, `key-handling-checks.ts`, `sweep.ts`, `core-ledger-state.test.ts`, `excluded-not-exported.test.ts`, `version.negative-control.test.ts`, `surface.test.ts`, `statementsOf`, `recovery.test.ts`, `mutation-per-adapter.mjs`, `retention.ts`, `web-lock.ts`, `upgrade-boundary.test.ts`, `twox.ts`, `text.test.ts`, `facade-merge-loader.ts`, `builder.negative-control.test.ts`, `zod.test.ts`?**
  _High betweenness centrality (0.257) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-8949` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `FinalizedLoop` be split into smaller, more focused modules?**
  _Cohesion score 0.024247491638795988 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `FinalizedLoop`, `admin-harness.ts`, `backup/restore.ts`, `client.test.ts`, `InMemoryBlockSource`, `db/errors.ts`, `api-server.test.ts`, `module-tables.ts`, `config/plain-data.ts`, `tape/index.ts`, `migrate.ts`, `process-backends.ts`, `declaration.ts`, `PrivateTransport`, `process-admin.ts`, `cbor.ts`, `config/history.ts`, `BlockRef`, `pglite-lock.ts`, `NodeClient`, `ModuleDeclaration`, `fetch-fixtures.ts`, `ref_node_fs`, `loop-stop-harness.ts`, `validation.ts`, `version-table.ts`, `core-transport.ts`, `runner/process.ts`, `ledger/types.ts`, `.read`, `validate.ts`, `core-ledger-state.test.ts`, `vitest`, `Process`, `range.ts`, `intake.test.ts`, `contract-modules.test.ts`, `pause-fixtures.ts`, `src/ledger/identity.ts`, `backup/backup.ts`, `statementsOf`, `config-check.ts`, `transport.test.ts`, `in-memory-source.ts`, `web-lock.ts`, `code`, `binding.test.ts`, `upgrade-boundary.test.ts`, `process-worker.ts`, `mapping.ts`, `ledger/ledger-tasks.test.ts`, `graph.ts`, `checkShape`, `slow-block-cases.test.ts`, `restore-private.ts`, `sha256`, `core-ledger-state.ts`, `startProcess`, `startup-stop-harness.ts`, `halts.test.ts`, `chain-process.test.ts`, `lockstep-refusals.test.ts`, `slow-block-harness.ts`, `connectionOfUrl`, `writer-lock-checks.ts`, `runtime-metadata.test.ts`, `version-checks.ts`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024386845039018952 - nodes in this community are weakly interconnected._