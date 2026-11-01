# Graph Report - UmbraDB

## Corpus Check
- 1144 files · ~1,585,269 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11850 nodes · 36072 edges · 362 communities (325 shown, 37 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2907 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `8a40664a5af32023` (1144 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- FinalizedLoop
- loop.test.ts
- declaration.ts
- containers.test.ts
- shims.test.ts
- cold-boot-recovery.integration.test.ts
- core-ledger-state/sql.ts
- backup/backup.ts
- page.ts
- entries.ts
- process-context.test.ts
- release-version.ts
- BlockRef
- browser.test.ts
- browser/build.ts
- ref_node_events
- resolver-boundary.ts
- tape/index.ts
- node-fields-harness.ts
- example-checks.ts
- PgliteDatabase
- documents.ts
- .concat
- code-registry.ts
- column-rules.ts
- config/plain-data.ts
- read-gate.ts
- test/postgres/setup.ts
- process-worker.ts
- pg-tx-history-adapter.ts
- TapeNode
- crash.test.ts
- fixtures/configuration.ts
- client.test.ts
- units.test.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- restore-private.ts
- PrivateTransport
- cbor.property.test.ts
- process-build.ts
- Writer
- node-bridge.ts
- backupAtStop
- inMemoryBlock
- ws-mutual-tls.test.ts
- NodeClient
- ledger-sweep.test.ts
- core-block-fetch.test.ts
- block-fetch-decode.test.ts
- chrome.ts
- devnet-upgrade.test.ts
- config/history.ts
- key-handling-checks.ts
- fast-check
- core-chain-events.ts
- node-source.test.ts
- browser-harness.ts
- Lockstep
- LoopPauses
- range.ts
- signal-ignored-fixtures.ts
- tape/command.ts
- Design — Sprint 1: project setup + TemporalKV
- statementsOf
- readiness.test.ts
- UmbraError
- ingest-harness.ts
- web-lock.ts
- Session
- read-height.property.test.ts
- no-indexer-or-wallet-sdk.test.ts
- core-config.test.ts
- postgres-tls.test.ts
- chain-events-source.test.ts
- history.property.test.ts
- worker-threads-worker.ts
- Worker
- adapter.ts
- childRefKeys
- .send
- runner/process.ts
- sweepStep
- restore-ledger.ts
- browser/src/config/load.ts
- transform-checks.ts
- ProcessItems
- core-transport.ts
- signal-backup.worker.ts
- worker-threads.test.ts
- spawnChild
- mutation-evidence.d.mts
- ref_node_crypto
- cli-fixtures.ts
- pageBench
- worker-threads-host.ts
- start-umbradb.ts
- api-server.test.ts
- builds.ts
- database-parts.ts
- EventsRunner
- ref_node_path
- BYTE_ORDER
- vitest
- https.ts
- NodeFS
- config-check.ts
- contract-modules.test.ts
- builder.test.ts
- LedgerPackage
- change-capture.ts
- configured.ts
- adapter-fixtures.ts
- ledger-storage.test.ts
- process-admin.ts
- core-private-source.ts
- ledger/ledger-tasks.test.ts
- ledger-tapes.ts
- contract-data-checks.ts
- refused-configuration.test.ts
- PgTransactionHistoryStorage
- module-tables.ts
- migrate.ts
- loop-stop-harness.ts
- cbor.ts
- column-refusals.test.ts
- core-block-parsed.ts
- pause-fixtures.ts
- sweep-tapes.ts
- networks.ts
- slow-block-harness.ts
- interfaces/transaction-history-storage.ts
- Process
- admin-harness.ts
- net.test.ts
- chain-process.test.ts
- validate.ts
- intake.test.ts
- .from
- src/ledger/identity.ts
- mapping.ts
- writer-lock-checks.ts
- version-checks.ts
- ModuleDeclaration
- openPostgres
- file-mode.test.ts
- NodeBlockSource
- pack-install.mjs
- graph.ts
- boundary.test.ts
- backup/restore.ts
- transport-faults.test.ts
- retirement.test.ts
- InMemoryBlockSource
- core-block-commit.test.ts
- changes.property.test.ts
- pglite-lock.ts
- checkShape
- TransactionHistoryStorage
- src/db/postgres.ts
- redact.ts
- ledger/types.ts
- node-source.ts
- private/lockstep-wait.test.ts
- events-fixtures.ts
- real-tapes.ts
- validation.ts
- paused-harness.ts
- ADDED Requirements
- refused
- Design — Sprint 3: CheckpointStore
- table
- graph.py
- core-ledger-state.ts
- Design — START-UMBRADB: UmbraDB as a library
- .put
- .retrying
- .slowBlockMs
- integer
- T
- log
- core-ledger-state.test.ts
- lockstep-refusals.test.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- conformance-gate.mjs
- mutation-per-adapter.mjs
- twox.ts
- Design — v1.1.0: Quint model checking
- UmbraDB third-party component inventory (SBOM)
- facade-merge-loader.ts
- transaction-history-storage.test.ts
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- history
- code
- ADDED Requirements
- core-private-source.test.ts
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- package.json
- ADDED Requirements
- ADDED Requirements
- Boundaries, threats and controls
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
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
- ADDED Requirements
- Design — Sprint 2: Transaction/Lease
- Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored
- Requirement: CF-4 Every field is data, operational or secret
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- UmbraDB in a browser
- stats-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
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
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Tasks — Sprint 2: Transaction/Lease
- Proposal — Sprint 4: Watermarks
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
- 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00023 — The blocks table's height partitions end at 5,000,000
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
- bug-report.md
- feature-request.md
- Tasks — Sprint 1: project setup + TemporalKV
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
- peerDependenciesMeta
- repository
- graphify/run.sh
- build-in-container.sh
- stats-module/run.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bin
- engines
- peerDependencies
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 387 edges
2. `UmbraError` - 333 edges
3. `ModuleDeclaration` - 186 edges
4. `InMemoryBlockSource` - 142 edges
5. `FinalizedLoop` - 133 edges
6. `NodeClient` - 116 edges
7. `Database` - 101 edges
8. `BlockRef` - 99 edges
9. `ReadHandle` - 91 edges
10. `NodeBlockSource` - 81 edges

## Surprising Connections (you probably didn't know these)
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `4. WalletState envelope` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/tasks.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `6. Live-sync tier (nightly/labeled — blocked on design.md §7's open question)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/tasks.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (362 total, 37 thin omitted)

### Community 0 - "FinalizedLoop"
Cohesion: 0.02
Nodes (133): PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+125 more)

### Community 1 - "loop.test.ts"
Cohesion: 0.02
Nodes (126): Transaction, GraphInput, CommitOutcome, HeightRun, HeldHeight, PausesInsideTheHeight, PastFaultCase, RefusalCase (+118 more)

### Community 10 - "declaration.ts"
Cohesion: 0.03
Nodes (90): StatsRow, Outcome, UmbraConfig, BlockWriteHandle, ReadHandle, SchemaWriteHandle, cursorTable, CursorTableOptions (+82 more)

### Community 100 - "containers.test.ts"
Cohesion: 0.07
Nodes (28): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers() (+20 more)

### Community 101 - "shims.test.ts"
Cohesion: 0.09
Nodes (23): Buffer, BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText(), charCodes() (+15 more)

### Community 103 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (24): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+16 more)

### Community 104 - "core-ledger-state/sql.ts"
Cohesion: 0.11
Nodes (34): StateRow, StoredState, GreyPicker, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks() (+26 more)

### Community 106 - "backup/backup.ts"
Cohesion: 0.10
Nodes (36): BackupInput, BackupSeams, BackupTarget, DumpInput, SnapshotSeams, Environment, PgDumpTool, BackupCommandOptions (+28 more)

### Community 107 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 11 - "entries.ts"
Cohesion: 0.02
Nodes (112): CoreLedgerVersion, LedgerPackageIdentity, LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader (+104 more)

### Community 110 - "process-context.test.ts"
Cohesion: 0.08
Nodes (26): MisuseListener, Seen, RunnerBackend, ContextsClass, a141Problems(), isQueryTimeout(), serving(), slowApi() (+18 more)

### Community 111 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 112 - "BlockRef"
Cohesion: 0.09
Nodes (16): BlockEventSource, QueuedBlock, BlockItems, BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery (+8 more)

### Community 114 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 115 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 116 - "ref_node_events"
Cohesion: 0.08
Nodes (23): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+15 more)

### Community 117 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 12 - "tape/index.ts"
Cohesion: 0.05
Nodes (96): Recorded, Link, TapeBuilderOptions, RecordingProblem, TapeProblem, TransformError, TransformProblem, readRequest (+88 more)

### Community 121 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (25): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+17 more)

### Community 122 - "example-checks.ts"
Cohesion: 0.11
Nodes (22): Served, BlockImport, ChildResult, CodeBlock, installedProject, isolationProblems(), serveCommand(), allowedSource() (+14 more)

### Community 125 - "PgliteDatabase"
Cohesion: 0.13
Nodes (7): AsyncLocalStorage, AsyncResource, JobQueue, PgliteDatabase, handleClosed(), failedEarlier(), openOn()

### Community 126 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 127 - ".concat"
Cohesion: 0.09
Nodes (19): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+11 more)

### Community 128 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 13 - "column-rules.ts"
Cohesion: 0.02
Nodes (103): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+95 more)

### Community 131 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 132 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 133 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 134 - "process-worker.ts"
Cohesion: 0.13
Nodes (21): Scope, crossedError, StartRun, ToProcessWorker, openedProcess, PgliteDump, messageAdmin(), withDevelopmentOptIn() (+13 more)

### Community 135 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 136 - "TapeNode"
Cohesion: 0.11
Nodes (10): FinalizedHeightOptions, TapeClock, TapeNode, finalizedHeight(), invalidOption(), timedOut(), FINALIZED_HEIGHT_TIMEOUT_MS, CHAIN (+2 more)

### Community 137 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 138 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (20): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+12 more)

### Community 14 - "client.test.ts"
Cohesion: 0.03
Nodes (62): Connection, NodeClientOptions, NodeRetry, NodeSocket, NodeSocketEvents, NodeTimers, IngestOptions, HandSocket (+54 more)

### Community 140 - "units.test.ts"
Cohesion: 0.15
Nodes (20): BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool, Restored, exclusiveJob, readPrivateCursor() (+12 more)

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

### Community 147 - "restore-private.ts"
Cohesion: 0.16
Nodes (21): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+13 more)

### Community 148 - "PrivateTransport"
Cohesion: 0.14
Nodes (8): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), reject(), resolve(), client()

### Community 149 - "cbor.property.test.ts"
Cohesion: 0.11
Nodes (25): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+17 more)

### Community 15 - "process-build.ts"
Cohesion: 0.03
Nodes (74): InMemoryItems, Wait, Flaky, ChangedFile, GenesisFixture, installationCopy, StartPackageProcess, Hold (+66 more)

### Community 150 - "Writer"
Cohesion: 0.11
Nodes (11): ReadPool, Writer, rollBack(), Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes (+3 more)

### Community 151 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 155 - "backupAtStop"
Cohesion: 0.09
Nodes (22): BackupWritten, backupAtStop(), A backup at the core's stop, A backup of a running process (SIGUSR2), Backups, Restoring a backup, What a backup holds, Writing a backup (+14 more)

### Community 158 - "inMemoryBlock"
Cohesion: 0.15
Nodes (15): CommitOptions, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual(), summarize(), checkHeight() (+7 more)

### Community 159 - "ws-mutual-tls.test.ts"
Cohesion: 0.12
Nodes (18): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+10 more)

### Community 16 - "NodeClient"
Cohesion: 0.05
Nodes (71): HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter, NodeBlock, NodeRuntimeVersion (+63 more)

### Community 160 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (13): SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints() (+5 more)

### Community 165 - "core-block-fetch.test.ts"
Cohesion: 0.10
Nodes (12): StandInOptions, coreBlockFetchOnFetch(), isBlockItemSource(), blockFetchStandIn(), blockContext(), KNOWN_NETWORKS, IN_MEMORY_LEDGER, IN_MEMORY_SPEC_VERSION (+4 more)

### Community 167 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+9 more)

### Community 168 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 169 - "devnet-upgrade.test.ts"
Cohesion: 0.16
Nodes (14): Side, TapeAnswers, FoundTape, found(), nodeRootAt(), recording(), replay(), storedRoots() (+6 more)

### Community 17 - "config/history.ts"
Cohesion: 0.04
Nodes (98): OpenedFacts, CoreVersion, versionEntry, ConfigHashRow, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding (+90 more)

### Community 170 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 175 - "fast-check"
Cohesion: 0.15
Nodes (13): retainedStates, CoreRevision, releasesOf(), revisionsOf(), coreRevisionsOf(), releasedBy(), retainedFrom(), retentionWindow() (+5 more)

### Community 18 - "core-chain-events.ts"
Cohesion: 0.05
Nodes (76): BodyExtrinsic, ExtrinsicCall, BlockBody, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType (+68 more)

### Community 182 - "node-source.test.ts"
Cohesion: 0.17
Nodes (14): Opened, RootWithoutSignal, at(), expectRootsEndWithTheirRun(), hashAndBlock(), open(), passFence(), quiet() (+6 more)

### Community 183 - "browser-harness.ts"
Cohesion: 0.27
Nodes (16): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+8 more)

### Community 188 - "Lockstep"
Cohesion: 0.18
Nodes (4): CoreTransportOptions, Lockstep, downText(), holds()

### Community 189 - "LoopPauses"
Cohesion: 0.18
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 19 - "range.ts"
Cohesion: 0.03
Nodes (74): ConnectSocket, Outage, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, BoundaryBlockReading (+66 more)

### Community 190 - "signal-ignored-fixtures.ts"
Cohesion: 0.16
Nodes (13): ListenedRun, listenerProblems(), namesUnder(), signalLines(), sigusr2Ignored(), watched(), adminPortIn(), PACE_MS (+5 more)

### Community 192 - "tape/command.ts"
Cohesion: 0.21
Nodes (15): Arguments, Command, boundaries(), check(), parse(), range(), record(), reportedVersion() (+7 more)

### Community 193 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 195 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 196 - "readiness.test.ts"
Cohesion: 0.19
Nodes (12): Decision, ae4(), caseText(), readinessProblems(), holding(), observedProblems(), ready(), readyWhen() (+4 more)

### Community 2 - "UmbraError"
Cohesion: 0.03
Nodes (110): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, CommittedHeight, ReadOnlyDatabase, ReadOptions (+102 more)

### Community 20 - "ingest-harness.ts"
Cohesion: 0.05
Nodes (88): ProcessCondition, ArgType, BlockOptions, CallSpec, RUNTIME, Decoded, FetchSeen, CrashEvent (+80 more)

### Community 200 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 205 - "Session"
Cohesion: 0.21
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 206 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 208 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 21 - "core-config.test.ts"
Cohesion: 0.04
Nodes (72): adminRoutes, AdminEndpoint, AdminPart, AdminView, ChainView, InstanceStatus, ItemView, ModuleTableStatus (+64 more)

### Community 214 - "postgres-tls.test.ts"
Cohesion: 0.19
Nodes (9): SslMode, driverConnectionOptions, PostgresConnection, TlsPostgres, makeCertificates(), startTlsPostgres(), noHeight(), readError() (+1 more)

### Community 215 - "chain-events-source.test.ts"
Cohesion: 0.21
Nodes (6): NodeCallOptions, RecordingClient, open(), quiet(), chain, closing

### Community 216 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 218 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 22 - "adapter.ts"
Cohesion: 0.03
Nodes (78): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+70 more)

### Community 225 - "childRefKeys"
Cohesion: 0.38
Nodes (3): ChildReader, childRefKeys(), readChildren()

### Community 23 - "runner/process.ts"
Cohesion: 0.03
Nodes (73): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait, WaitingListener, ConfigRow, LoadOptions (+65 more)

### Community 232 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 233 - "restore-ledger.ts"
Cohesion: 0.24
Nodes (10): RestoreInput, RestoreSeams, recordedGenesis, RestoreBuild, withNodeRoot(), connectionOf(), disagreeingNode(), ledgerChain() (+2 more)

### Community 234 - "browser/src/config/load.ts"
Cohesion: 0.29
Nodes (9): LoadedConfig, LoadOptions, configModuleUrl(), configPath(), loadConfig(), loadModuleList(), noFile(), DEFAULT_CONFIG_FILE (+1 more)

### Community 24 - "transform-checks.ts"
Cohesion: 0.04
Nodes (50): NodeRunResult, Metadata, Step, Failure, Variant, Failure, Variant, TapeError (+42 more)

### Community 25 - "core-transport.ts"
Cohesion: 0.03
Nodes (79): InstanceView, Session, TransportLimits, TransportTls, PrivateInstance, Entry, LockstepInstance, LockstepOptions (+71 more)

### Community 250 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 26 - "spawnChild"
Cohesion: 0.03
Nodes (76): ParentJob, Kill, Orphaned, SourceFile, Run, Job, WorkerEvent, LockResult (+68 more)

### Community 266 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 27 - "ref_node_crypto"
Cohesion: 0.05
Nodes (59): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+51 more)

### Community 28 - "cli-fixtures.ts"
Cohesion: 0.04
Nodes (68): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, CommandResult, CheckTarget, CliBackend, RunningCommand (+60 more)

### Community 286 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 287 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 29 - "start-umbradb.ts"
Cohesion: 0.04
Nodes (77): Finding, PrivateLinkChannel, readOptions, Address, NodeHttpHandler, NodeUpgradeHandler, UmbraDBBackup, UmbraDBCondition (+69 more)

### Community 3 - "api-server.test.ts"
Cohesion: 0.02
Nodes (115): ModuleApiServer, ModuleApiStart, StartedModuleApi, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart (+107 more)

### Community 30 - "builds.ts"
Cohesion: 0.04
Nodes (76): PrivateIntakeOptions, startHashDecision, PublicWakes, A165Options, a165Run, Attempt, A113Observation, A156Observation (+68 more)

### Community 31 - "database-parts.ts"
Cohesion: 0.05
Nodes (55): DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, EngineInput, TickerConfig, PrivateBackend, SessionSeen (+47 more)

### Community 32 - "ref_node_path"
Cohesion: 0.07
Nodes (55): RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore, TickerHandle, WORKER, SignalEvent, cliProject (+47 more)

### Community 33 - "vitest"
Cohesion: 0.03
Nodes (54): BaselineLoad, Comparison, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline, LatencyStats (+46 more)

### Community 34 - "config-check.ts"
Cohesion: 0.04
Nodes (73): CheckFinding, CheckStep, StepName, StepReport, StepStatus, DatabaseState, ReadDatabaseOptions, TypeCheckFinding (+65 more)

### Community 35 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (71): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+63 more)

### Community 36 - "builder.test.ts"
Cohesion: 0.04
Nodes (37): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Frame, RawClient, Script (+29 more)

### Community 37 - "LedgerPackage"
Cohesion: 0.05
Nodes (39): LedgerPackage, LedgerEngine, LedgerTaskFailed, stagenetReplay, hexOf(), idOf(), same(), sameBytes() (+31 more)

### Community 38 - "change-capture.ts"
Cohesion: 0.04
Nodes (58): TableDigest, TableDigestRow, CapturedTable, GuardTableRow, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules (+50 more)

### Community 39 - "configured.ts"
Cohesion: 0.06
Nodes (68): ConfigFacts, CoreChainFacts, RestoreBase, BackupOutcome, CheckState, ConfigCheckOptions, ConfigCheckSeams, CommandConfig (+60 more)

### Community 4 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (123): ApplyInput, StateSummary, StoredNode, LedgerHeight, Upstream, contractFixture, Ledger, RawPackage (+115 more)

### Community 40 - "ledger-storage.test.ts"
Cohesion: 0.06
Nodes (68): RetainedState, ingest, Call, SeenLoad, RestartEvent, RestartJob, retentionSeen, LedgerTx (+60 more)

### Community 41 - "process-admin.ts"
Cohesion: 0.06
Nodes (56): OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, DigestRow, ModuleFacts, NodeFacts (+48 more)

### Community 42 - "core-private-source.ts"
Cohesion: 0.06
Nodes (49): PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes, PublicConfiguration (+41 more)

### Community 43 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (56): TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses() (+48 more)

### Community 44 - "ledger-tapes.ts"
Cohesion: 0.06
Nodes (66): BlockSpec, EventSpec, Scenario, transactionSpec, eventsRuntime, chainBlock, ledgerScenario, LedgerScenarioOptions (+58 more)

### Community 45 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (62): CoreContractStatesOptions, ContractStateRow, CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+54 more)

### Community 46 - "refused-configuration.test.ts"
Cohesion: 0.06
Nodes (57): EngineConfig, ProcessHandle, Answered, Start, Refusal, Start, startProcess(), adminCore() (+49 more)

### Community 47 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (41): MergeEntriesFn, TransactionHistoryEntry, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize() (+33 more)

### Community 48 - "module-tables.ts"
Cohesion: 0.06
Nodes (54): CaptureColumn, CaptureState, ModuleColumn, ModuleContentsError, ModuleTable, PageOptions, ColumnType, RefusalCode (+46 more)

### Community 5 - "migrate.ts"
Cohesion: 0.02
Nodes (122): AppliedRow, Runnable, Settling, StartupInput, MultiStatementRunner, Difference, OwnPart, PlannedSchema (+114 more)

### Community 50 - "loop-stop-harness.ts"
Cohesion: 0.07
Nodes (43): ChainCheck, ChainCheckInput, BlockSource, FinalityStallCondition, EngineOptions, A169Observation, LoopStopScenario, SourceOf (+35 more)

### Community 51 - "cbor.ts"
Cohesion: 0.07
Nodes (52): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+44 more)

### Community 52 - "column-refusals.test.ts"
Cohesion: 0.06
Nodes (32): CheckedMigration, ModuleContentsFailure, ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, Case (+24 more)

### Community 53 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (55): BlockParsed, BlockParsedOptions, TransactionParser, itemsSeen, Json, ledgerVersionOf(), blockBodyOf(), blockParsedOf() (+47 more)

### Community 54 - "pause-fixtures.ts"
Cohesion: 0.07
Nodes (47): BackupOnSignal, LoopClass, Pausable, PausableConfig, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop (+39 more)

### Community 55 - "sweep-tapes.ts"
Cohesion: 0.08
Nodes (48): CoreLedgerStateOptions, FixtureRun, FixtureRunOptions, ModelBatch, SweepModel, TableSnapshot, FixtureNode, FakeState (+40 more)

### Community 56 - "networks.ts"
Cohesion: 0.05
Nodes (57): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+49 more)

### Community 57 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (49): BlockItemSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+41 more)

### Community 58 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (49): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, JsonEncoded, StoredEntryJson (+41 more)

### Community 59 - "Process"
Cohesion: 0.08
Nodes (9): CoreTransport, ProcessReason, PauseHold, Process, SignalTarget, openedCursorHeight(), publicLockstepOf(), hasLedgerTasks() (+1 more)

### Community 6 - "admin-harness.ts"
Cohesion: 0.03
Nodes (119): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStarter, AdminStartOptions, AdminAnswer (+111 more)

### Community 60 - "net.test.ts"
Cohesion: 0.06
Nodes (26): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortSocket (+18 more)

### Community 61 - "chain-process.test.ts"
Cohesion: 0.05
Nodes (42): Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+34 more)

### Community 62 - "validate.ts"
Cohesion: 0.07
Nodes (54): EntryView, plainData, ConfigContext, CursorRule, EntryView, Issue, Plain, coreSettingsSchema() (+46 more)

### Community 63 - "intake.test.ts"
Cohesion: 0.08
Nodes (42): PrivateProcess, PrivateSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation, A116Observation (+34 more)

### Community 64 - ".from"
Cohesion: 0.06
Nodes (51): TransactionResult, ledgerItemsSeen, hexOf(), hex(), hex(), hex(), hex(), a106Problems() (+43 more)

### Community 65 - "src/ledger/identity.ts"
Cohesion: 0.08
Nodes (38): ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, V9Logs, AdapterWorkerRequest, checkLedgerPackage() (+30 more)

### Community 66 - "mapping.ts"
Cohesion: 0.06
Nodes (37): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+29 more)

### Community 67 - "writer-lock-checks.ts"
Cohesion: 0.09
Nodes (39): WriterProcess, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf() (+31 more)

### Community 68 - "version-checks.ts"
Cohesion: 0.10
Nodes (40): MetadataNode, LedgerTable, Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase (+32 more)

### Community 7 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (106): Database, AppliedMigration, MigrationPart, SchemaPlan, Point, ModuleDeclaration, ProcessContext, ResolvedGraph (+98 more)

### Community 70 - "openPostgres"
Cohesion: 0.08
Nodes (31): BenchEnv, PostgresOptions, Phase, Job, openPostgres(), postgresBackend(), databaseAs(), postgresCliBackend() (+23 more)

### Community 71 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (35): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+27 more)

### Community 73 - "NodeBlockSource"
Cohesion: 0.10
Nodes (10): HeadWait, NodeBlockSource, NodeHeader, QueueRunner, NoWindow, Refetches, TrustsNotifications, hexOf() (+2 more)

### Community 74 - "pack-install.mjs"
Cohesion: 0.08
Nodes (45): Surface, SurfaceAmendment, SmokeFailure, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph() (+37 more)

### Community 75 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck (+40 more)

### Community 76 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 77 - "backup/restore.ts"
Cohesion: 0.08
Nodes (34): PublicIdentity, Checked, PublicSide, RestoreChain, RestoreTarget, BackupText, createReadStream(), isBlockLedgerSource() (+26 more)

### Community 78 - "transport-faults.test.ts"
Cohesion: 0.08
Nodes (33): Message, MessageType, TestCertificates, Ended, rawClient, mutualTlsOptions(), hexOf(), messageText() (+25 more)

### Community 79 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 8 - "InMemoryBlockSource"
Cohesion: 0.04
Nodes (114): LockstepCondition, InMemoryBlockSource, ProcessingEnd, ProcessStatus, watched, ProcessObservation, StartVia, PackageStartup (+106 more)

### Community 80 - "core-block-commit.test.ts"
Cohesion: 0.08
Nodes (35): BlockRow, Commit, AlwaysLanded, checkParent(), commitBlock(), hex(), sameBytes(), writeBlockRow() (+27 more)

### Community 81 - "changes.property.test.ts"
Cohesion: 0.06
Nodes (43): ChangeKind, tableChanges, TouchedRow, Op, States, TableName, encodeCanonical(), changeOf() (+35 more)

### Community 82 - "pglite-lock.ts"
Cohesion: 0.07
Nodes (35): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, acquirePgliteLock() (+27 more)

### Community 83 - "checkShape"
Cohesion: 0.07
Nodes (35): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+27 more)

### Community 85 - "TransactionHistoryStorage"
Cohesion: 0.05
Nodes (34): TransactionHistoryReader, TransactionHistoryStorage, TransactionHistoryWriter, reason(), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity (+26 more)

### Community 87 - "src/db/postgres.ts"
Cohesion: 0.09
Nodes (36): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, DriverError, Outcome, Role (+28 more)

### Community 89 - "redact.ts"
Cohesion: 0.09
Nodes (33): RevisionSettings, PlainObject, RedactableConfig, RedactionForms, SecretForm, TextPattern, fieldKinds, transportReaderFacts (+25 more)

### Community 9 - "ledger/types.ts"
Cohesion: 0.03
Nodes (100): LoadLedger, LedgerStateItem, LedgerName, Path, ApplyOutput, ChainOutcome, LedgerPackageOptions, LedgerTask (+92 more)

### Community 90 - "node-source.ts"
Cohesion: 0.07
Nodes (21): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, NodeSourceOptions, Prefetch, LedgerBinding, MetadataBlock (+13 more)

### Community 93 - "private/lockstep-wait.test.ts"
Cohesion: 0.08
Nodes (21): Report, ExpectedWait, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, a117Problems(), firstWait() (+13 more)

### Community 94 - "events-fixtures.ts"
Cohesion: 0.12
Nodes (30): Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, metadataWith(), metadataV14() (+22 more)

### Community 96 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 98 - "validation.ts"
Cohesion: 0.06
Nodes (34): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+26 more)

### Community 99 - "paused-harness.ts"
Cohesion: 0.11
Nodes (31): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, a176Project() (+23 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+26 more)

### Community 129 - "refused"
Cohesion: 0.11
Nodes (26): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 7. Storage helpers (+18 more)

### Community 184 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.13
Nodes (14): 0. Package layout, 1. Chunking, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions, 6. Migration (`002_checkpoint_store.ts`), 7. Error translation — no additions to `src/postgres/errors.ts`, 8. Composing Transaction/Lease (Sprint 2 dependency), 9. Test infrastructure (+6 more)

### Community 49 - "table"
Cohesion: 0.04
Nodes (61): side(), migrations(), table(), version(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix (+53 more)

### Community 105 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 120 - "core-ledger-state.ts"
Cohesion: 0.11
Nodes (31): blockHeaderOf(), applyBlock(), boundLedger(), computeBlock(), contractsOf(), hex(), maintainedOf(), parentTimeOf() (+23 more)

### Community 152 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.09
Nodes (20): transportReaderRule(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 4. Channels, 0. Baseline, 1. Source layout (+12 more)

### Community 156 - ".put"
Cohesion: 0.10
Nodes (21): coreTxResultsOnParse(), "on-fetch"(), Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level, Scenario: Sequential puts to the same key in separate transactions succeed, outside the millisecond-collision caveat, Scenario: Sequential unconditional writes produce consecutive versions, Scenario: The CAS-guarded and unconditional paths agree on version assignment (+13 more)

### Community 161 - ".retrying"
Cohesion: 0.09
Nodes (20): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The node on `/status`, The transport reader, TLS to PostgreSQL: `ssl` (+12 more)

### Community 166 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 171 - "integer"
Cohesion: 0.10
Nodes (18): integer(), 4.1 Column types, 4.2 Rules, 4.3 Data that is not a function of the chain: `deterministic: false`, 4. Deterministic PostgreSQL, Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first) (+10 more)

### Community 172 - "T"
Cohesion: 0.12
Nodes (18): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, Scenario: Version and timestamp addressing agree, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape (+10 more)

### Community 177 - "log"
Cohesion: 0.15
Nodes (14): join(), normalize(), resolve(), ledgerWorkerEntry(), log(), delimiter, sep, 13. Contract data (+6 more)

### Community 187 - "core-ledger-state.test.ts"
Cohesion: 0.14
Nodes (10): bindLedgerParser(), boundLedgerParser(), bindCoreLedgerState(), itemsOf(), applied(), bound(), query(), refusing() (+2 more)

### Community 191 - "lockstep-refusals.test.ts"
Cohesion: 0.27
Nodes (15): a118Problems(), a118Run(), coreOn(), haltOf(), json(), mismatchProblems(), mismatchRun(), names() (+7 more)

### Community 194 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (14): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+6 more)

### Community 198 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 199 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 207 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 213 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 220 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.17
Nodes (11): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 6. Nix — nixpkgs packages (from the locked nixpkgs), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies (+3 more)

### Community 222 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 223 - "transaction-history-storage.test.ts"
Cohesion: 0.18
Nodes (5): decodeSerializedContent(), decodeSerializedEntry(), store(), FAKE_TX, { sql: getSql }

### Community 253 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 259 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 284 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 69 - "history"
Cohesion: 0.05
Nodes (49): history(), n(), 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips (+41 more)

### Community 72 - "code"
Cohesion: 0.04
Nodes (48): code(), [0.9.5] - 2026-07-25 — "Penumbra", Added, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), 15. Relation to the existing design documents, Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface (+40 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 95 - "core-private-source.test.ts"
Cohesion: 0.06
Nodes (12): privateBackbone(), height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), PUBLIC_POLL_MS (+4 more)

### Community 102 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 118 - "README.md"
Cohesion: 0.07
Nodes (24): [0.10.0] - 2026-10-27, Added, Breaking changes, Changelog, [Unreleased], Choosing a database, At each start, Best blocks: worked on early, never stored (+16 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 145 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.07
Nodes (21): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+13 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 153 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 154 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 162 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 163 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 164 - "package.json"
Cohesion: 0.09
Nodes (21): bugs, url, description, exports, files, homepage, license, main (+13 more)

### Community 173 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 174 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 178 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (18): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+10 more)

### Community 179 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.11
Nodes (17): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4, 2. G9 — the four crash tests (+9 more)

### Community 180 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 181 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 186 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 201 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 202 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 203 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 204 - "UmbraDB"
Cohesion: 0.14
Nodes (14): Backup and restore, Check and run, Create a project, Example: loading `stats-module`, Install UmbraDB, Private processes, briefly, Project status, development and links, Quick start (CLI) (+6 more)

### Community 209 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 210 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 211 - "ADDED Requirements"
Cohesion: 0.15
Nodes (13): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+5 more)

### Community 212 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 217 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 221 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 224 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 227 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 228 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 229 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 230 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 231 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 235 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 236 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 237 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 238 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 239 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 240 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure, Design — Sprint 2: Transaction/Lease (+1 more)

### Community 241 - "Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored"
Cohesion: 0.20
Nodes (9): ADDED Requirements, MODIFIED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: A stale transaction handle is rejected before any query runs, Scenario: Two puts inside one withTransaction both commit together, Scenario: Two puts inside one withTransaction either both commit or neither does, Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API (+1 more)

### Community 242 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-4 Every field is data, operational or secret, Scenario: A function in the configuration, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: A user module from the configuration file, Scenario: Two `core` revisions with different databases (+1 more)

### Community 243 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 244 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 245 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 247 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 248 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 249 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 251 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 252 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 254 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 255 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 256 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 258 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 260 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 261 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 262 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 263 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 264 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 265 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 267 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 268 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 269 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 270 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 271 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 272 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 273 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 274 - "Tasks — Sprint 2: Transaction/Lease"
Cohesion: 0.33
Nodes (5): 0. `PgTransactionLeaseLayer` — transactions, 1. `PgTransactionLeaseLayer` — leases, 2. Wire `PgTemporalKV`'s `opts.tx`, 3. Sprint close-out, Tasks — Sprint 2: Transaction/Lease

### Community 275 - "Proposal — Sprint 4: Watermarks"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes, Why

### Community 276 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 277 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 278 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 279 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 280 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 281 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 282 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 283 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 285 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 288 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 289 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 290 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 291 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 292 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 293 - "00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond"
Cohesion: 0.40
Nodes (4): 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix

### Community 294 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 295 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 296 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 297 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 298 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 299 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 300 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 301 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 302 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 303 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 304 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 305 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 306 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 307 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 308 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 309 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 310 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 311 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 312 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 313 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 314 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 315 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 316 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 317 - "Tasks — Sprint 1: project setup + TemporalKV"
Cohesion: 0.40
Nodes (4): 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV

### Community 318 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 320 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 321 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 322 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 323 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 324 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 325 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 326 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 327 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 328 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 333 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 334 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 84 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-8949`, `RFC-8949`, `@stryker-mutator/core` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3941 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `FinalizedLoop`, `loop.test.ts`, `UmbraError`, `api-server.test.ts`, `adapter-fixtures.ts`, `migrate.ts`, `admin-harness.ts`, `ModuleDeclaration`, `InMemoryBlockSource`, `ledger/types.ts`, `declaration.ts`, `entries.ts`, `tape/index.ts`, `column-rules.ts`, `client.test.ts`, `process-build.ts`, `NodeClient`, `config/history.ts`, `core-chain-events.ts`, `range.ts`, `ingest-harness.ts`, `core-config.test.ts`, `adapter.ts`, `runner/process.ts`, `transform-checks.ts`, `core-transport.ts`, `spawnChild`, `ref_node_crypto`, `cli-fixtures.ts`, `start-umbradb.ts`, `builds.ts`, `database-parts.ts`, `ref_node_path`, `config-check.ts`, `contract-modules.test.ts`, `builder.test.ts`, `change-capture.ts`, `configured.ts`, `ledger-storage.test.ts`, `process-admin.ts`, `ledger/ledger-tasks.test.ts`, `ledger-tapes.ts`, `contract-data-checks.ts`, `refused-configuration.test.ts`, `loop-stop-harness.ts`, `cbor.ts`, `column-refusals.test.ts`, `core-block-parsed.ts`, `pause-fixtures.ts`, `sweep-tapes.ts`, `networks.ts`, `slow-block-harness.ts`, `interfaces/transaction-history-storage.ts`, `net.test.ts`, `chain-process.test.ts`, `intake.test.ts`, `.from`, `src/ledger/identity.ts`, `mapping.ts`, `writer-lock-checks.ts`, `version-checks.ts`, `openPostgres`, `file-mode.test.ts`, `pack-install.mjs`, `boundary.test.ts`, `backup/restore.ts`, `transport-faults.test.ts`, `retirement.test.ts`, `core-block-commit.test.ts`, `changes.property.test.ts`, `pglite-lock.ts`, `src/db/postgres.ts`, `redact.ts`, `private/lockstep-wait.test.ts`, `core-private-source.test.ts`, `real-tapes.ts`, `validation.ts`, `paused-harness.ts`, `containers.test.ts`, `shims.test.ts`, `cold-boot-recovery.integration.test.ts`, `core-ledger-state/sql.ts`, `process-context.test.ts`, `release-version.ts`, `browser.test.ts`, `browser/build.ts`, `ref_node_events`, `resolver-boundary.ts`, `core-ledger-state.ts`, `node-fields-harness.ts`, `example-checks.ts`, `documents.ts`, `code-registry.ts`, `config/plain-data.ts`, `read-gate.ts`, `test/postgres/setup.ts`, `pg-tx-history-adapter.ts`, `TapeNode`, `crash.test.ts`, `units.test.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `restore-private.ts`, `cbor.property.test.ts`, `node-bridge.ts`, `ws-mutual-tls.test.ts`, `ledger-sweep.test.ts`, `package.json`, `core-block-fetch.test.ts`, `block-fetch-decode.test.ts`, `devnet-upgrade.test.ts`, `key-handling-checks.ts`, `fast-check`, `excluded-not-exported.test.ts`, `node-source.test.ts`, `core-ledger-state.test.ts`, `LoopPauses`, `lockstep-refusals.test.ts`, `statementsOf`, `readiness.test.ts`, `mutation-per-adapter.mjs`, `web-lock.ts`, `read-height.property.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `postgres-tls.test.ts`, `chain-events-source.test.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `transaction-history-storage.test.ts`, `worker-threads.test.ts`?**
  _High betweenness centrality (0.245) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 19 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-8949` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `FinalizedLoop` be split into smaller, more focused modules?**
  _Cohesion score 0.021274234127571408 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `FinalizedLoop`, `loop.test.ts`, `api-server.test.ts`, `migrate.ts`, `admin-harness.ts`, `ModuleDeclaration`, `InMemoryBlockSource`, `ledger/types.ts`, `declaration.ts`, `entries.ts`, `tape/index.ts`, `client.test.ts`, `process-build.ts`, `NodeClient`, `config/history.ts`, `range.ts`, `ingest-harness.ts`, `core-config.test.ts`, `runner/process.ts`, `core-transport.ts`, `start-umbradb.ts`, `builds.ts`, `database-parts.ts`, `ref_node_path`, `vitest`, `config-check.ts`, `contract-modules.test.ts`, `change-capture.ts`, `configured.ts`, `process-admin.ts`, `core-private-source.ts`, `refused-configuration.test.ts`, `module-tables.ts`, `loop-stop-harness.ts`, `cbor.ts`, `column-refusals.test.ts`, `pause-fixtures.ts`, `networks.ts`, `slow-block-harness.ts`, `Process`, `chain-process.test.ts`, `validate.ts`, `src/ledger/identity.ts`, `mapping.ts`, `writer-lock-checks.ts`, `version-checks.ts`, `openPostgres`, `NodeBlockSource`, `graph.ts`, `backup/restore.ts`, `transport-faults.test.ts`, `core-block-commit.test.ts`, `changes.property.test.ts`, `pglite-lock.ts`, `checkShape`, `src/db/postgres.ts`, `node-source.ts`, `core-private-source.test.ts`, `validation.ts`, `shims.test.ts`, `backup/backup.ts`, `process-context.test.ts`, `ref_node_events`, `core-ledger-state.ts`, `PgliteDatabase`, `refused`, `config/plain-data.ts`, `TapeNode`, `units.test.ts`, `PrivateTransport`, `Writer`, `backupAtStop`, `inMemoryBlock`, `node-source.test.ts`, `core-ledger-state.test.ts`, `lockstep-refusals.test.ts`, `statementsOf`, `readiness.test.ts`, `web-lock.ts`, `Session`, `postgres-tls.test.ts`, `browser/src/config/load.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `loop.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024677716390423574 - nodes in this community are weakly interconnected._