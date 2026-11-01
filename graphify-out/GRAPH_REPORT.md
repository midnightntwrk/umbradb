# Graph Report - UmbraDB

## Corpus Check
- 1137 files · ~1,575,545 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11787 nodes · 35835 edges · 355 communities (316 shown, 39 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2907 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `dff8b9b365441899` (1137 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- ref_node_fs
- UmbraError
- vitest
- core.ts
- redact.ts
- refused-configuration.test.ts
- browser/build.ts
- Design — Sprint 1: project setup + TemporalKV
- core-ledger-state/sql.ts
- core-block-commit.test.ts
- page.ts
- release-version.ts
- pg-tx-history-adapter.ts
- checks.test.ts
- config/history.ts
- browser.test.ts
- resolver-boundary.ts
- file-modes.ts
- paused-harness.ts
- code-registry.ts
- core-private-source.ts
- documents.ts
- adapter-fixtures.ts
- crash.test.ts
- shims.test.ts
- mapping.ts
- config/plain-data.ts
- node-fields-harness.ts
- Lockstep
- read-gate.ts
- source-scan.ts
- zod
- process-worker.ts
- PrivateLinkChannel
- restore-private.ts
- node-bridge.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- client.test.ts
- fixtures/configuration.ts
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- ws-mutual-tls.test.ts
- TransactionHistoryEntry
- order.property.test.ts
- ledger-sweep.test.ts
- worker-host.test.ts
- lockstep-refusals.test.ts
- chrome.ts
- QueueRunner
- childRefKeys
- key-handling-checks.ts
- .concat
- records.ts
- UmbraDBHandle
- NodeBlockSource
- start-umbradb.ts
- start-umbradb.test.ts
- client.ts
- BlockRef
- recovery.test.ts
- browser-harness.ts
- describeNodeStoreExports
- admin-harness.ts
- core-contract-states.ts
- validation.test.ts
- PortSocket
- statementsOf
- no-indexer-or-wallet-sdk.test.ts
- web-lock.ts
- database-parts.ts
- loop.test.ts
- upgrade-boundary.test.ts
- .#finalizedAt
- history.property.test.ts
- quiet-host.child.ts
- InMemoryBlockSource
- worker-threads-worker.ts
- Worker
- Reader
- intake.test.ts
- cbor.ts
- sweepStep
- browser/src/config/load.ts
- host.ts
- expectRootsEndWithTheirRun
- .send
- FinalizedLoop
- signal-backup.worker.ts
- module-tables.ts
- ledger/plain-data.ts
- worker-threads.test.ts
- core-block-parsed.ts
- mutation-evidence.d.mts
- builder.negative-control.test.ts
- AsyncLocalStorage
- .value
- BoundedRead
- db/backends.ts
- EventsRunner
- never
- Reader
- worker-threads-host.ts
- Database
- api-server.test.ts
- adapter.ts
- containers.test.ts
- aborted
- ModuleDeclaration
- BlockLedgerSource
- BYTE_ORDER
- https.ts
- NodeFS
- ledger-storage.test.ts
- range.ts
- ingest
- interfaces/transaction-history-storage.ts
- process-backends.ts
- config-check.ts
- admin/configuration.ts
- version-checks.ts
- transform-checks.ts
- declaration.ts
- ref_node_crypto
- ledger/types.ts
- contract-modules.test.ts
- core-chain.test.ts
- chain-process.test.ts
- LedgerPackage
- ref_node_timers
- PgTransactionHistoryStorage
- tape/index.ts
- loop.ts
- slow-block-harness.ts
- real-tapes.ts
- chain-placement.test.ts
- range.test.ts
- ledger-units.test.ts
- startup-stop-harness.ts
- runner/process.ts
- NodeClient
- contract-data-checks.ts
- private/backends.ts
- writer-lock-checks.ts
- node-format.ts
- determinism-checks.ts
- builds.ts
- Process
- backup/backup.ts
- column-rules.ts
- node.test.ts
- config-check-database.test.ts
- core-ledger-state.ts
- signal-ignored-fixtures.ts
- ledger/ledger-tasks.test.ts
- graph.ts
- BlockItems
- guarantees.test.ts
- height-versioned.test.ts
- validate.ts
- entries.ts
- resolve.ts
- example-checks.ts
- binding.test.ts
- PgliteDatabase
- retirement.test.ts
- 14. Private processes
- validation.ts
- net.test.ts
- core-config.test.ts
- backup/restore.ts
- private/lockstep-wait.test.ts
- pack-install.mjs
- ADDED Requirements
- Proposal — Sprint 3: CheckpointStore
- refused
- graph.py
- core-private-source.test.ts
- .slowBlockMs
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- startUmbraDB
- .from
- ADDED Requirements
- T
- mapping.test.ts
- integer
- Boundaries, threats and controls
- boundary.test.ts
- following
- Design — START-UMBRADB: UmbraDB as a library
- core-ledger-state.test.ts
- log
- conformance-gate.mjs
- mutation-per-adapter.mjs
- twox.ts
- backupAtStop
- UmbraDB third-party component inventory (SBOM)
- path.ts
- schemaName
- readPrivateCursor
- .convertFromV8
- v9
- orphan-watcher.mjs
- read-only-checks.ts
- crash-worker.ts
- history
- .put
- code
- version
- cold-boot-recovery.integration.test.ts
- ADDED Requirements
- post-block-update/oracle/main.rs
- UmbraDB 0.9.5 "Penumbra"
- package.json
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
- Requirement: DT-6 Stored data avoids non-deterministic values
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
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
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
- scoped-review-manifest
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- UmbraDB operator guide
- stats-module/tsconfig.json
- MODIFIED Requirements
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Proposal — Sprint 1: project setup + TemporalKV
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
- 00026 — A configuration's `core` revisions may name different networks
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
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
- 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail
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
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 384 edges
2. `UmbraError` - 326 edges
3. `ModuleDeclaration` - 186 edges
4. `InMemoryBlockSource` - 133 edges
5. `FinalizedLoop` - 133 edges
6. `NodeClient` - 113 edges
7. `Database` - 101 edges
8. `BlockRef` - 98 edges
9. `ReadHandle` - 91 edges
10. `NodeBlockSource` - 81 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (355 total, 39 thin omitted)

### Community 0 - "ref_node_fs"
Cohesion: 0.03
Nodes (143): BackupSeams, CommandHandler, CommandIo, MainProcess, BackupBackend, killedRestore, TickerProcess, BackupOnSignal (+135 more)

### Community 1 - "UmbraError"
Cohesion: 0.03
Nodes (133): PostgresConnection, PostgresOptions, SchemaWriteHandle, Transaction, ReadTimeoutSetting, AppliedRow, MigrationPart, Runnable (+125 more)

### Community 10 - "vitest"
Cohesion: 0.02
Nodes (91): Child, ParentJob, Kill, Orphaned, SourceFile, Run, Job, WorkerEvent (+83 more)

### Community 100 - "core.ts"
Cohesion: 0.11
Nodes (28): BaselineLoad, Comparison, CommitOptions, PostgresRun, BenchEnv, ManualOpts, TinybenchOpts, Backend (+20 more)

### Community 103 - "redact.ts"
Cohesion: 0.09
Nodes (30): RedactionForms, SecretForm, TextPattern, transportReaderFacts, Needs, findings(), isMemoryDatabase(), configRedactor() (+22 more)

### Community 104 - "refused-configuration.test.ts"
Cohesion: 0.08
Nodes (31): EngineConfig, Refusal, Start, adminSnapshot(), codeOnly(), commandProblems(), declarationsOf(), earlyListener() (+23 more)

### Community 106 - "browser/build.ts"
Cohesion: 0.07
Nodes (27): BrowserBuild, BrowserBuildOptions, BrowserControl, checkedLedgers, pageBench, PageServer, browserLedgerEntry(), browserPlugin() (+19 more)

### Community 107 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.05
Nodes (36): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+28 more)

### Community 109 - "core-ledger-state/sql.ts"
Cohesion: 0.12
Nodes (33): StateRow, StoredState, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks(), deleteGrey() (+25 more)

### Community 11 - "core-block-commit.test.ts"
Cohesion: 0.03
Nodes (95): BlockHeaderItem, BlockRow, CoreBlockHeader, BlockWriteHandle, CursorValue, BlockContext, StandInOptions, Commit (+87 more)

### Community 111 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 116 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 117 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (23): LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 119 - "checks.test.ts"
Cohesion: 0.08
Nodes (23): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql() (+15 more)

### Community 12 - "config/history.ts"
Cohesion: 0.03
Nodes (105): ConfigHashRow, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding, HistoryOptions, HistoryRow, HistoryRule (+97 more)

### Community 120 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 121 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 122 - "file-modes.ts"
Cohesion: 0.09
Nodes (25): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+17 more)

### Community 124 - "paused-harness.ts"
Cohesion: 0.13
Nodes (28): Body, PausedExpectation, Read, Reader, commandBuild(), keeperModule(), keepingPause(), pausedOf() (+20 more)

### Community 126 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 127 - "core-private-source.ts"
Cohesion: 0.11
Nodes (27): PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, startHashDecision, PublicConfiguration, PublicItem, bindingRefusal() (+19 more)

### Community 129 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 13 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (94): DeployTx, Upstream, contractFixture, RawPackage, AdapterSubject, AdapterWorkerHost, LoadedState, Point (+86 more)

### Community 130 - "crash.test.ts"
Cohesion: 0.11
Nodes (24): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+16 more)

### Community 131 - "shims.test.ts"
Cohesion: 0.11
Nodes (19): databaseTarget, Buffer, BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText() (+11 more)

### Community 132 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 134 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 135 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (23): A168Observation, A168Phase, Expected, GatedConnector, StatusReader, a(), a168Run(), atLeast() (+15 more)

### Community 136 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 138 - "read-gate.ts"
Cohesion: 0.14
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 139 - "source-scan.ts"
Cohesion: 0.11
Nodes (24): DesignTable, RowCoverage, ModuleReference, settingsElsewhere(), opensDatabase(), boundaryViolations(), calledNames(), codeFingerprints() (+16 more)

### Community 14 - "zod"
Cohesion: 0.03
Nodes (80): Session, TransportLimits, TransportTls, Committed, Hello, HelloAck, JsonValue, MessageFault (+72 more)

### Community 140 - "process-worker.ts"
Cohesion: 0.13
Nodes (20): Scope, crossedError, StartRun, ToProcessWorker, messageAdmin(), withDevelopmentOptIn(), databaseOptions(), openConfiguredDatabase() (+12 more)

### Community 144 - "PrivateLinkChannel"
Cohesion: 0.08
Nodes (21): PrivateLinkChannel, NetworkRequest, 4. Channels, 5.4 Channels, 8. The browser demo on the engine (owner decision D-21), ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point (+13 more)

### Community 145 - "restore-private.ts"
Cohesion: 0.16
Nodes (21): RestoreOutcome, BackupDatabase, FileProcess, privateBackup, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+13 more)

### Community 146 - "node-bridge.ts"
Cohesion: 0.11
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 147 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 148 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 149 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 15 - "client.test.ts"
Cohesion: 0.03
Nodes (53): Connection, NodeRetry, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets, Answer (+45 more)

### Community 155 - "fixtures/configuration.ts"
Cohesion: 0.12
Nodes (17): BrowserConfiguration, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig(), coreConfiguration() (+9 more)

### Community 156 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (14): BackupText, createReadStream(), firstLine(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst() (+6 more)

### Community 158 - "ws-mutual-tls.test.ts"
Cohesion: 0.12
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 159 - "TransactionHistoryEntry"
Cohesion: 0.17
Nodes (8): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends, 3.1 Field mapping (write path)

### Community 16 - "order.property.test.ts"
Cohesion: 0.04
Nodes (95): ErrorCode, GraphInput, PointArguments, PointRun, PastFaultCase, RefusalCase, CallEvent, Recorder (+87 more)

### Community 160 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (13): SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelSnapshot, bigints(), compare() (+5 more)

### Community 161 - "worker-host.test.ts"
Cohesion: 0.11
Nodes (19): SlowStep, TestLoaderData, errorOf(), beat(), countDeserializations(), hexOf(), loadLedger(), probe() (+11 more)

### Community 162 - "lockstep-refusals.test.ts"
Cohesion: 0.18
Nodes (20): LockstepCondition, PublicCore, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn() (+12 more)

### Community 163 - "chrome.ts"
Cohesion: 0.15
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 165 - "QueueRunner"
Cohesion: 0.20
Nodes (6): Prefetch, NodeHeader, PreparedBlock, QueueRunner, refOf(), sameBytes()

### Community 166 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 167 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 168 - ".concat"
Cohesion: 0.15
Nodes (10): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+2 more)

### Community 17 - "records.ts"
Cohesion: 0.05
Nodes (70): RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError, Connection (+62 more)

### Community 171 - "UmbraDBHandle"
Cohesion: 0.13
Nodes (12): UmbraDBHandle, handleOf(), startedOf(), cursorReaches(), 9. `core-arch` criteria rewritten by this change, MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process (+4 more)

### Community 172 - "NodeBlockSource"
Cohesion: 0.14
Nodes (6): NodeBlockSource, SourceCondition, NoWindow, Refetches, TrustsNotifications, hexOf()

### Community 174 - "start-umbradb.ts"
Cohesion: 0.19
Nodes (17): Address, NodeHttpHandler, NodeUpgradeHandler, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork, UmbraDBOptions (+9 more)

### Community 179 - "start-umbradb.test.ts"
Cohesion: 0.21
Nodes (14): readOptions, addressFindings(), configFindings(), finding(), isObject(), keysOf(), networkFindings(), optionFindings() (+6 more)

### Community 18 - "client.ts"
Cohesion: 0.05
Nodes (61): HeadSubscriber, Pending, State, Subscription, Waiter, NodeBlock, NodeRuntimeVersion, connectionFailure (+53 more)

### Community 182 - "BlockRef"
Cohesion: 0.20
Nodes (6): QueuedBlock, BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery

### Community 183 - "recovery.test.ts"
Cohesion: 0.19
Nodes (17): ProcessStatus, Q142Observation, A43Observation, Fault, Recorded, RecoveryObservation, StatusRead, committedProblems() (+9 more)

### Community 185 - "browser-harness.ts"
Cohesion: 0.27
Nodes (16): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+8 more)

### Community 186 - "describeNodeStoreExports"
Cohesion: 0.18
Nodes (4): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports()

### Community 19 - "admin-harness.ts"
Cohesion: 0.05
Nodes (90): AdminRun, Answered, Answerer, Expected, gate, Hold, Observation, Prober (+82 more)

### Community 190 - "core-contract-states.ts"
Cohesion: 0.14
Nodes (14): CoreContractStatesOptions, ContractStateRow, LedgerStateItem, ContractKeys, DefinedModule, contractStatesOf(), coreContractStates(), hex() (+6 more)

### Community 191 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 192 - "PortSocket"
Cohesion: 0.21
Nodes (5): PortSocket, 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 194 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 198 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 199 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 2 - "database-parts.ts"
Cohesion: 0.03
Nodes (134): ConfiguredDatabase, ConfiguredDatabaseOptions, RestoreSeams, BackupOutcome, CommandConfig, commandTarget, ReadDatabaseOptions, Chain (+126 more)

### Community 20 - "loop.test.ts"
Cohesion: 0.04
Nodes (76): CommitOutcome, HeldHeight, LockstepWait, LoopEnd, SlowBlockEvent, SlowWindow, Contexts, Faults (+68 more)

### Community 203 - "upgrade-boundary.test.ts"
Cohesion: 0.22
Nodes (12): versionEntry, A47Observation, CommitsTheBoundary, Version, a47Problems(), a47Run(), big(), buildOf() (+4 more)

### Community 208 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 209 - "quiet-host.child.ts"
Cohesion: 0.18
Nodes (9): Job, Outcome, Stated, until(), before, db, during, [first, refusedLate, failingSql, halting] (+1 more)

### Community 21 - "InMemoryBlockSource"
Cohesion: 0.05
Nodes (76): InMemoryBlockSource, ProcessingEnd, Flaky, A43Case, Outcome, Broken, testBuild, A149Observation (+68 more)

### Community 211 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 215 - "Reader"
Cohesion: 0.33
Nodes (5): Reader, decodeChild(), readChild(), readChildList(), taggedRootKey()

### Community 216 - "intake.test.ts"
Cohesion: 0.33
Nodes (11): PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), follow(), heights(), readProblems() (+3 more)

### Community 22 - "cbor.ts"
Cohesion: 0.04
Nodes (92): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+84 more)

### Community 223 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 224 - "browser/src/config/load.ts"
Cohesion: 0.29
Nodes (9): LoadedConfig, LoadOptions, configModuleUrl(), configPath(), loadConfig(), loadModuleList(), noFile(), DEFAULT_CONFIG_FILE (+1 more)

### Community 23 - "host.ts"
Cohesion: 0.05
Nodes (67): LoadLedger, LedgerName, LedgerTask, LedgerTaskBlock, AppliedState, ApplyBlock, BlockId, EngineHolding (+59 more)

### Community 233 - "expectRootsEndWithTheirRun"
Cohesion: 0.22
Nodes (5): RootWithoutSignal, at(), expectRootsEndWithTheirRun(), hashAndBlock(), until()

### Community 24 - "FinalizedLoop"
Cohesion: 0.04
Nodes (27): EntryBoundary, PointSchedule, Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, PausesInsideTheHeight (+19 more)

### Community 241 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 25 - "module-tables.ts"
Cohesion: 0.05
Nodes (72): CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, ConsistentRead (+64 more)

### Community 250 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 26 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (89): BrowserRun, BlockEventSource, BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent (+81 more)

### Community 261 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 263 - "builder.negative-control.test.ts"
Cohesion: 0.29
Nodes (3): Failure, Variant, WrongRecording

### Community 27 - ".value"
Cohesion: 0.06
Nodes (66): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+58 more)

### Community 28 - "db/backends.ts"
Cohesion: 0.04
Nodes (64): Settings, Case, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer (+56 more)

### Community 281 - "never"
Cohesion: 0.33
Nodes (4): IgnoresTheStop, StaysPaused, abortOf(), never()

### Community 285 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 29 - "Database"
Cohesion: 0.04
Nodes (83): Database, Committed, Chain, ChainOptions, DigestRow, TestDatabase, helperDatabase, migrationPart() (+75 more)

### Community 3 - "api-server.test.ts"
Cohesion: 0.03
Nodes (108): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, ReadOptions, Connection, HeadersArgument, ModuleApiServer (+100 more)

### Community 30 - "adapter.ts"
Cohesion: 0.04
Nodes (69): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+61 more)

### Community 31 - "containers.test.ts"
Cohesion: 0.04
Nodes (64): driverConnectionOptions, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, TlsPostgres, RepositoryFile, Cancellable (+56 more)

### Community 314 - "aborted"
Cohesion: 0.40
Nodes (3): DoesNotHold, EndsTheRun, aborted()

### Community 32 - "ModuleDeclaration"
Cohesion: 0.05
Nodes (48): OpenedFacts, ModuleDeclaration, Revision, ResolvedGraph, StartedModuleApi, LateUse, LoopInput, MisuseListener (+40 more)

### Community 33 - "ledger-storage.test.ts"
Cohesion: 0.06
Nodes (76): SeenLoad, RestartEvent, RestartJob, retentionSeen, ledgerScenario, LedgerTx, RawPackageClass, recordedGenesis (+68 more)

### Community 34 - "range.ts"
Cohesion: 0.04
Nodes (65): NodeSubscription, Refusal, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions (+57 more)

### Community 35 - "ingest"
Cohesion: 0.06
Nodes (74): CoreLedgerStateOptions, GreyPicker, itemsSeen, FixtureRun, FixtureRunOptions, ingest, TableSnapshot, Side (+66 more)

### Community 36 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.03
Nodes (58): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus (+50 more)

### Community 37 - "process-backends.ts"
Cohesion: 0.05
Nodes (56): TasksRun, taskSeen, ChangedFile, GenesisFixture, installationCopy, PackageStartup, StartPackageProcess, ProcessBackend (+48 more)

### Community 38 - "config-check.ts"
Cohesion: 0.04
Nodes (62): CheckFinding, CheckStep, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, CoreLedgerVersion (+54 more)

### Community 39 - "admin/configuration.ts"
Cohesion: 0.05
Nodes (57): OpenedConfig, AllowedDetail, ProcessAdmin, RevisionSettings, DigestRow, ModuleFacts, PartTable, SnapshotFacts (+49 more)

### Community 4 - "version-checks.ts"
Cohesion: 0.03
Nodes (108): MetadataNode, RuntimeMetadata, Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis (+100 more)

### Community 40 - "transform-checks.ts"
Cohesion: 0.06
Nodes (54): ConnectionFrames, Recorded, Script, Step, Failure, Variant, TransformError, closeServer() (+46 more)

### Community 41 - "declaration.ts"
Cohesion: 0.05
Nodes (52): StatsRow, Outcome, UmbraConfig, ReadHandle, cursorTable, CursorTableOptions, ApiRegistry, BlockHeader (+44 more)

### Community 42 - "ref_node_crypto"
Cohesion: 0.05
Nodes (59): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow (+51 more)

### Community 43 - "ledger/types.ts"
Cohesion: 0.05
Nodes (53): ApplyInput, ApplyOutput, LedgerEvent, LogItem, ParsedTransaction, StateSummary, StoredNode, TransactionResult (+45 more)

### Community 44 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (52): ContractLog, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw, CoreContractLogsFullOptions (+44 more)

### Community 45 - "core-chain.test.ts"
Cohesion: 0.05
Nodes (47): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait, WaitingListener, ConfigRow, WaitingCondition (+39 more)

### Community 46 - "chain-process.test.ts"
Cohesion: 0.04
Nodes (47): InMemoryItems, Wait, Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal (+39 more)

### Community 47 - "LedgerPackage"
Cohesion: 0.07
Nodes (27): LedgerPackage, StateHandle, LedgerEngine, stagenetReplay, hexOf(), idOf(), same(), sameBytes() (+19 more)

### Community 48 - "ref_node_timers"
Cohesion: 0.06
Nodes (44): Message, TestCertificates, Ended, rawClient, Escape, publicState, Refused, mutualTlsOptions() (+36 more)

### Community 49 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (58): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 4. Multi-wallet identity, Impact, Non-goals (+50 more)

### Community 5 - "tape/index.ts"
Cohesion: 0.04
Nodes (120): ProcessCondition, BlockSpec, EventSpec, Scenario, transactionSpec, ArgType, BlockOptions, CallSpec (+112 more)

### Community 50 - "loop.ts"
Cohesion: 0.07
Nodes (53): PointName, HeightRange, Callback, CallbackFailure, ParallelPoint, ProcessReason, ReasonCode, Unwrapped (+45 more)

### Community 51 - "slow-block-harness.ts"
Cohesion: 0.08
Nodes (53): BlockItemSource, ReadOpener, StatusBody, Validator, Times, Wait, askedSource, BodyRead (+45 more)

### Community 52 - "real-tapes.ts"
Cohesion: 0.05
Nodes (46): Metadata, Step, FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+38 more)

### Community 54 - "chain-placement.test.ts"
Cohesion: 0.08
Nodes (52): eventsRuntime, Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, LedgerScenarioOptions (+44 more)

### Community 55 - "range.test.ts"
Cohesion: 0.05
Nodes (32): ScriptedNode, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, TapeCommandIo, RangeOptions (+24 more)

### Community 57 - "ledger-units.test.ts"
Cohesion: 0.07
Nodes (44): ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, LedgerPackageOptions, V9Logs, LoadAdapter (+36 more)

### Community 58 - "startup-stop-harness.ts"
Cohesion: 0.06
Nodes (41): BackupWritten, ProcessHandle, SignalTarget, Running, A167Observation, CheckOf, NodeWatch, PrivateObservation (+33 more)

### Community 59 - "runner/process.ts"
Cohesion: 0.05
Nodes (46): ChainCheck, ChainCheckInput, CoreVersion, BlockSource, FinalityStallCondition, RetryCode, PauseBy, BoundAddress (+38 more)

### Community 6 - "NodeClient"
Cohesion: 0.04
Nodes (93): BodyExtrinsic, BlockBody, CoreBlockItems, NodeSourceOptions, MetadataBlock, RuntimeMetadataEntry, NodeCallOptions, NodeClient (+85 more)

### Community 60 - "contract-data-checks.ts"
Cohesion: 0.09
Nodes (55): Manifest, Restored, contractScenario, ContractScenarioOptions, LogLine, Program, Ran, ScenarioTx (+47 more)

### Community 61 - "private/backends.ts"
Cohesion: 0.07
Nodes (30): PrivateBackend, SessionSeen, Pause, SkipsLockstep, A112Observation, Wiring, TransportProxy, pgliteBackend() (+22 more)

### Community 62 - "writer-lock-checks.ts"
Cohesion: 0.08
Nodes (44): WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), blocksIn(), cleanUp() (+36 more)

### Community 64 - "node-format.ts"
Cohesion: 0.09
Nodes (48): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, NodeBatch, Readable, TableNode, NodeRoot (+40 more)

### Community 66 - "determinism-checks.ts"
Cohesion: 0.08
Nodes (42): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, TestLink, A155Observation, Outcome, a113Run() (+34 more)

### Community 67 - "builds.ts"
Cohesion: 0.06
Nodes (45): AdminStarter, PrivateIntakeOptions, PublicWakes, ReadOnlyDatabase, EngineInput, A168RunOptions, A176Options, KeeperGlobals (+37 more)

### Community 68 - "Process"
Cohesion: 0.09
Nodes (9): CoreTransport, PauseHold, Process, openedCursorHeight(), hasLedgerTasks(), messageOf(), get(), losingCommits() (+1 more)

### Community 69 - "backup/backup.ts"
Cohesion: 0.08
Nodes (49): BackupInput, BackupTarget, BackupFacts, ManifestHistoryRow, ManifestMigration, ManifestTool, DumpInput, PgliteDump (+41 more)

### Community 7 - "column-rules.ts"
Cohesion: 0.02
Nodes (107): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+99 more)

### Community 70 - "node.test.ts"
Cohesion: 0.06
Nodes (23): Frame, RawClient, Failure, Variant, TapeClock, main(), pageHandler(), servePage() (+15 more)

### Community 71 - "config-check-database.test.ts"
Cohesion: 0.06
Nodes (37): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, CheckTarget, CliBackend (+29 more)

### Community 72 - "core-ledger-state.ts"
Cohesion: 0.07
Nodes (46): RetainedState, retainedStates, CoreRevision, blockHeaderOf(), ledgerVersionOf(), applyBlock(), boundLedger(), chainOutcomesOf() (+38 more)

### Community 73 - "signal-ignored-fixtures.ts"
Cohesion: 0.06
Nodes (40): ConfigCheckReport, ListenedRun, WorkerSignals, RunningCommand, statsConfig, listenerProblems(), namesUnder(), pacedNode() (+32 more)

### Community 74 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.06
Nodes (41): CallArgsItem, CallArguments, V9Raw, bindLedgerTasks(), boundHost(), frozen(), resultsOf(), withItems() (+33 more)

### Community 75 - "graph.ts"
Cohesion: 0.07
Nodes (49): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck (+41 more)

### Community 76 - "BlockItems"
Cohesion: 0.05
Nodes (27): BlockItems, LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, EagerItems, EagerLoop, KeptItems (+19 more)

### Community 77 - "guarantees.test.ts"
Cohesion: 0.06
Nodes (32): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, CloseHelper, UserModulesSource (+24 more)

### Community 78 - "height-versioned.test.ts"
Cohesion: 0.08
Nodes (35): heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Control, StoredVersion, Block, BlockFails, Counts (+27 more)

### Community 79 - "validate.ts"
Cohesion: 0.08
Nodes (47): CursorRule, Finding, Issue, Plain, SettingsSchema, earlyRedactor(), coreSettingsSchema(), pathOf() (+39 more)

### Community 8 - "entries.ts"
Cohesion: 0.02
Nodes (116): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput (+108 more)

### Community 80 - "resolve.ts"
Cohesion: 0.08
Nodes (47): ConfigFacts, EntryView, CoreChainFacts, RestoreBase, CommandBuildOptions, CheckState, ConfigCheckOptions, ProcessSide (+39 more)

### Community 81 - "example-checks.ts"
Cohesion: 0.07
Nodes (32): TypeCheckFinding, TypeCheckResult, Served, Finding, BlockImport, ChildResult, CodeBlock, installedProject (+24 more)

### Community 82 - "binding.test.ts"
Cohesion: 0.07
Nodes (37): PglitePathParts, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding, Created (+29 more)

### Community 83 - "PgliteDatabase"
Cohesion: 0.08
Nodes (10): JobQueue, PgliteDatabase, ReadPool, Session, Writer, handleClosed(), allowMultiStatement(), failedEarlier() (+2 more)

### Community 84 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 85 - "14. Private processes"
Cohesion: 0.08
Nodes (27): PrivateBlockSource, SourceTransport, StartHashes, PublicDatabase, PublicSide, PublicSideOptions, TransportPosition, readConfigHash() (+19 more)

### Community 86 - "validation.ts"
Cohesion: 0.08
Nodes (36): PlacedDeclaration, Plain, Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject() (+28 more)

### Community 87 - "net.test.ts"
Cohesion: 0.08
Nodes (23): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortUpgrade (+15 more)

### Community 9 - "core-config.test.ts"
Cohesion: 0.03
Nodes (90): PrivateSideFacts, ProcessAdminOptions, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer (+82 more)

### Community 93 - "backup/restore.ts"
Cohesion: 0.09
Nodes (34): PublicIdentity, Checked, PublicSide, RestoreChain, RestoreInput, RestoreTarget, isBlockLedgerSource(), publicNotStarted() (+26 more)

### Community 96 - "private/lockstep-wait.test.ts"
Cohesion: 0.08
Nodes (21): Report, ExpectedWait, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, a117Problems(), firstWait() (+13 more)

### Community 97 - "pack-install.mjs"
Cohesion: 0.09
Nodes (35): Surface, SmokeFailure, coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), runtimeValues(), section12() (+27 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+26 more)

### Community 247 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 98 - "refused"
Cohesion: 0.07
Nodes (35): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, The node on `/status`, 7. Storage helpers, ADDED Requirements (+27 more)

### Community 105 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 110 - "core-private-source.test.ts"
Cohesion: 0.06
Nodes (10): height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), PRIVATE_CORE_DIGEST, ACK_OF_CORE (+2 more)

### Community 112 - ".slowBlockMs"
Cohesion: 0.06
Nodes (31): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+23 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 125 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.06
Nodes (30): deferred(), Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log, The five stages (+22 more)

### Community 128 - "startUmbraDB"
Cohesion: 0.08
Nodes (27): text(), transportReader(), librarySettingsRefusal(), modulesGivenTwice(), optionsRefusal(), guardedLog(), startUmbraDB(), userModulesOf() (+19 more)

### Community 137 - ".from"
Cohesion: 0.07
Nodes (24): hexOf(), hex(), hex(), blockHex(), hex(), hex(), hex(), bytesOf() (+16 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.07
Nodes (25): 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 5. WalletState envelope, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage, ADDED Requirements (+17 more)

### Community 153 - "T"
Cohesion: 0.09
Nodes (24): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get` (+16 more)

### Community 164 - "mapping.test.ts"
Cohesion: 0.12
Nodes (11): mapRows(), mapValue(), parseJsonLossless(), oid(), identity(), RESULT_COLUMNS, RFC-3339, 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug (+3 more)

### Community 169 - "integer"
Cohesion: 0.10
Nodes (18): integer(), 4.1 Column types, 4.2 Rules, 4.3 Data that is not a function of the chain: `deterministic: false`, 4. Deterministic PostgreSQL, Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first) (+10 more)

### Community 170 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 173 - "boundary.test.ts"
Cohesion: 0.23
Nodes (17): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), where() (+9 more)

### Community 175 - "following"
Cohesion: 0.12
Nodes (19): cursorRead(), following(), 17. Trying a module against another node, 3. Lifecycle, Backup and restore, Check and run, Configuration files, Create a project (+11 more)

### Community 180 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.12
Nodes (16): transportReaderRule(), Evidence, 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout (+8 more)

### Community 189 - "core-ledger-state.test.ts"
Cohesion: 0.14
Nodes (10): bindLedgerParser(), boundLedgerParser(), bindCoreLedgerState(), itemsOf(), applied(), bound(), query(), refusing() (+2 more)

### Community 193 - "log"
Cohesion: 0.17
Nodes (14): ledgerWorkerEntry(), placeFor(), watchingPgDump(), log(), 13. Contract data, 1. Library-mode guarantees, 3.1 Engine, 3.3 Entry points (+6 more)

### Community 196 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 197 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 204 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 213 - "backupAtStop"
Cohesion: 0.18
Nodes (12): backupAtStop(), A backup at the core's stop, A backup of a running process (SIGUSR2), Backups, Restoring a backup, What a backup holds, Writing a backup, Requirement: BK-1 Backup (+4 more)

### Community 219 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 242 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 244 - "readPrivateCursor"
Cohesion: 0.32
Nodes (7): readPrivateCursor(), commandCommittedHeight(), readDatabaseState(), 00029 — `umbradb config check --database` reads a private database's cursor from the public cursor table, Evidence, Problem, Suggested fix

### Community 262 - ".convertFromV8"
Cohesion: 0.29
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 270 - "v9"
Cohesion: 0.47
Nodes (5): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 283 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 315 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 327 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 53 - "history"
Cohesion: 0.04
Nodes (61): history(), n(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+53 more)

### Community 56 - ".put"
Cohesion: 0.04
Nodes (56): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+48 more)

### Community 63 - "code"
Cohesion: 0.04
Nodes (55): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+47 more)

### Community 65 - "version"
Cohesion: 0.04
Nodes (54): side(), params(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules (+46 more)

### Community 88 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.10
Nodes (27): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed(), ledgerV8NodeEntry() (+19 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 101 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 102 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.05
Nodes (33): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+25 more)

### Community 108 - "package.json"
Cohesion: 0.05
Nodes (37): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+29 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 150 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 151 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 154 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 157 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+15 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 181 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 184 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 188 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 195 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 200 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 201 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 202 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 205 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 206 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 210 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 214 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 217 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 218 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 220 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 221 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 222 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 225 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 226 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 227 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 228 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 229 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-4 Every field is data, operational or secret, Scenario: A function in the configuration, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: A user module from the configuration file, Scenario: Two `core` revisions with different databases (+1 more)

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

### Community 238 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 239 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 240 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 245 - "UmbraDB operator guide"
Cohesion: 0.25
Nodes (8): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The transport reader, TLS to PostgreSQL: `ssl`, UmbraDB operator guide

### Community 246 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 248 - "MODIFIED Requirements"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy, Spec delta — `admin-endpoints` capability

### Community 249 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 252 - "Our Pledge"
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

### Community 256 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 257 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 258 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 259 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 260 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 265 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 266 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 267 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 268 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 269 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 271 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 272 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 273 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 274 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 275 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 276 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 277 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 278 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 284 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 286 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 287 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 288 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 289 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 290 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 291 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 292 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 293 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 294 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 295 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 296 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 297 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 298 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 299 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.40
Nodes (4): 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

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

### Community 310 - "00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail"
Cohesion: 0.40
Nodes (4): 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem, Suggested fix

### Community 311 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 312 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 313 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 316 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 317 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 318 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 319 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 320 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 321 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 322 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 323 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 324 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 89 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 90 - "README.md"
Cohesion: 0.05
Nodes (33): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:, Backups and status (+25 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3915 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ref_node_fs`, `UmbraError`, `database-parts.ts`, `api-server.test.ts`, `version-checks.ts`, `tape/index.ts`, `NodeClient`, `column-rules.ts`, `entries.ts`, `core-config.test.ts`, `core-block-commit.test.ts`, `config/history.ts`, `adapter-fixtures.ts`, `zod`, `client.test.ts`, `order.property.test.ts`, `records.ts`, `client.ts`, `admin-harness.ts`, `loop.test.ts`, `InMemoryBlockSource`, `cbor.ts`, `host.ts`, `module-tables.ts`, `core-block-parsed.ts`, `.value`, `db/backends.ts`, `Database`, `adapter.ts`, `containers.test.ts`, `ModuleDeclaration`, `ledger-storage.test.ts`, `ingest`, `interfaces/transaction-history-storage.ts`, `process-backends.ts`, `config-check.ts`, `admin/configuration.ts`, `transform-checks.ts`, `declaration.ts`, `ref_node_crypto`, `ledger/types.ts`, `contract-modules.test.ts`, `core-chain.test.ts`, `chain-process.test.ts`, `ref_node_timers`, `loop.ts`, `slow-block-harness.ts`, `real-tapes.ts`, `chain-placement.test.ts`, `range.test.ts`, `ledger-units.test.ts`, `startup-stop-harness.ts`, `runner/process.ts`, `contract-data-checks.ts`, `private/backends.ts`, `writer-lock-checks.ts`, `node-format.ts`, `determinism-checks.ts`, `builds.ts`, `node.test.ts`, `config-check-database.test.ts`, `core-ledger-state.ts`, `signal-ignored-fixtures.ts`, `ledger/ledger-tasks.test.ts`, `BlockItems`, `guarantees.test.ts`, `height-versioned.test.ts`, `resolve.ts`, `example-checks.ts`, `binding.test.ts`, `retirement.test.ts`, `validation.ts`, `net.test.ts`, `cold-boot-recovery.integration.test.ts`, `backup/restore.ts`, `private/lockstep-wait.test.ts`, `pack-install.mjs`, `core.ts`, `redact.ts`, `refused-configuration.test.ts`, `browser/build.ts`, `package.json`, `core-ledger-state/sql.ts`, `core-private-source.test.ts`, `release-version.ts`, `pg-tx-history-adapter.ts`, `checks.test.ts`, `browser.test.ts`, `resolver-boundary.ts`, `code-registry.ts`, `core-private-source.ts`, `documents.ts`, `crash.test.ts`, `shims.test.ts`, `config/plain-data.ts`, `Lockstep`, `read-gate.ts`, `source-scan.ts`, `restore-private.ts`, `node-bridge.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `ws-mutual-tls.test.ts`, `ledger-sweep.test.ts`, `worker-host.test.ts`, `lockstep-refusals.test.ts`, `mapping.test.ts`, `key-handling-checks.ts`, `boundary.test.ts`, `excluded-not-exported.test.ts`, `start-umbradb.test.ts`, `recovery.test.ts`, `core-ledger-state.test.ts`, `validation.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `web-lock.ts`, `upgrade-boundary.test.ts`, `twox.ts`, `history.property.test.ts`, `intake.test.ts`, `worker-threads.test.ts`, `builder.negative-control.test.ts`?**
  _High betweenness centrality (0.215) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 19 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_node_fs` be split into smaller, more focused modules?**
  _Cohesion score 0.02968036529680365 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `ref_node_fs`, `database-parts.ts`, `api-server.test.ts`, `version-checks.ts`, `tape/index.ts`, `NodeClient`, `entries.ts`, `core-block-commit.test.ts`, `config/history.ts`, `zod`, `client.test.ts`, `order.property.test.ts`, `records.ts`, `client.ts`, `admin-harness.ts`, `loop.test.ts`, `InMemoryBlockSource`, `cbor.ts`, `host.ts`, `FinalizedLoop`, `module-tables.ts`, `core-block-parsed.ts`, `db/backends.ts`, `Database`, `containers.test.ts`, `ModuleDeclaration`, `range.ts`, `process-backends.ts`, `config-check.ts`, `admin/configuration.ts`, `transform-checks.ts`, `declaration.ts`, `core-chain.test.ts`, `chain-process.test.ts`, `ref_node_timers`, `loop.ts`, `slow-block-harness.ts`, `ledger-units.test.ts`, `runner/process.ts`, `private/backends.ts`, `writer-lock-checks.ts`, `determinism-checks.ts`, `Process`, `backup/backup.ts`, `config-check-database.test.ts`, `core-ledger-state.ts`, `ledger/ledger-tasks.test.ts`, `graph.ts`, `height-versioned.test.ts`, `validate.ts`, `resolve.ts`, `binding.test.ts`, `PgliteDatabase`, `14. Private processes`, `validation.ts`, `backup/restore.ts`, `redact.ts`, `refused-configuration.test.ts`, `core-private-source.test.ts`, `checks.test.ts`, `Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)`, `core-private-source.ts`, `startUmbraDB`, `shims.test.ts`, `mapping.ts`, `config/plain-data.ts`, `lockstep-refusals.test.ts`, `mapping.test.ts`, `QueueRunner`, `NodeBlockSource`, `start-umbradb.ts`, `start-umbradb.test.ts`, `core-ledger-state.test.ts`, `validation.test.ts`, `statementsOf`, `web-lock.ts`, `upgrade-boundary.test.ts`, `backupAtStop`, `browser/src/config/load.ts`, `BoundedRead`, `aborted`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.02849246231155779 - nodes in this community are weakly interconnected._