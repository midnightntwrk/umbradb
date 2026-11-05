# Graph Report - UmbraDB

## Corpus Check
- 1301 files · ~1,834,172 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13414 nodes · 41704 edges · 385 communities (349 shown, 36 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3487 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `9feaf71ff6fd42d3` (1301 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- column-rules.ts
- UmbraError
- ref_node_fs
- process-context.test.ts
- refcount-model.ts
- Worker
- cold-boot-recovery.integration.test.ts
- upgrade-boundary.test.ts
- messages.ts
- hex
- node-key.test.ts
- node-format.ts
- release-version.ts
- ref_node_crypto
- halts.test.ts
- browser/build.ts
- TransactionHistoryEntry
- core-block-commit.test.ts
- browser.test.ts
- resolver-boundary.ts
- page.ts
- in-memory-source.ts
- network-refusals.ts
- node-set.test.ts
- fetch-fixtures.ts
- code-registry.ts
- postgres/transaction-history-storage.ts
- test/postgres/setup.ts
- backup/restore.ts
- Lockstep
- documents.ts
- pg-tx-history-adapter.ts
- ledger-storage.test.ts
- node-fields-harness.ts
- interfaces/transaction-history-storage.ts
- intake.test.ts
- checks.test.ts
- read-gate.ts
- sigterm.test.ts
- postgres-tls-server.ts
- core-ledger-state.ts
- core-private-source.ts
- config/plain-data.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- configuration-refusal.test.ts
- PrivateBlockSource
- surface.test.ts
- module-api.ts
- node-bridge.ts
- manifest.ts
- public-database.ts
- ProcessContexts
- crash.test.ts
- pack-install.mjs
- core-block-fetch/metadata.ts
- start-umbradb.test.ts
- HeightRun
- adapter-fixtures.ts
- browser-harness.ts
- .concat
- block-fetch-decode.test.ts
- harness.ts
- .value
- version-checks.ts
- library-documents.test.ts
- describeNodeStoreExports
- process-worker.ts
- Buffer
- chrome.ts
- key-handling-checks.ts
- transaction-history-storage.property.test.ts
- placement.ts
- BlockItems
- change-capture.ts
- chain-events-decode.test.ts
- LoopPauses
- GraphWorld
- childRefKeys
- Decisions
- api.ts
- tape/index.ts
- network.test.ts
- FakeNode
- backbone/part-migrations.test.ts
- ws-mutual-tls.test.ts
- NodeClient
- ReadHandle
- statementsOf
- quiet-host.child.ts
- core.ts
- configured.ts
- browser/src/config/load.ts
- Heartbeat
- channel-queue.test.ts
- Design — Sprint 1: project setup + TemporalKV
- .send
- src/configuration.ts
- src/protocol.ts
- contract-data-checks.ts
- extrinsics.ts
- ledger/plain-data.ts
- sha256
- process-admin.ts
- loop.test.ts
- host.ts
- HeldHeight
- runner/process.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- chain-placement.test.ts
- process-backends.ts
- ledger-refcount-backup.test.ts
- pageBench
- roles.ts
- refcount-histories.ts
- mounted-admin.test.ts
- refused-configuration.test.ts
- PageState
- adapter.ts
- PageApiChannel
- ApiChannel
- NodeFS
- transport-faults.test.ts
- NodeBlockSource
- cbor.ts
- validateDeclarations
- vitest
- LedgerPackage
- validation.ts
- FinalizedLoop
- entries.ts
- graph.ts
- node.test.ts
- pause-fixtures.ts
- src/config/load.ts
- transform-checks.ts
- record-and-replay.test.ts
- loop.ts
- Process
- process-build.ts
- ledger/types.ts
- order.property.test.ts
- config-check.ts
- .from
- private/lockstep-wait.test.ts
- refcount-restart.ts
- builds.ts
- boundary.test.ts
- client.test.ts
- start-umbradb.ts
- chain-process.test.ts
- slow-block-harness.ts
- range.ts
- PgTransactionHistoryStorage
- admin-harness.ts
- ref_node_timers
- guarantees.test.ts
- loop-stop-harness.ts
- history.test.ts
- startDatabase
- config/history.ts
- migrate.ts
- resolve.ts
- paused-harness.ts
- post-block-update-checks.ts
- retirement.test.ts
- file-mode.test.ts
- InMemoryBlockSource
- binding.test.ts
- status-schema.test.ts
- declaration.ts
- api-server.test.ts
- pglite-lock.ts
- ledger-tasks-checks.ts
- validate.ts
- ledger/ledger-tasks.test.ts
- ChannelEndpoint
- ADDED Requirements
- Proposal — Sprint 3: CheckpointStore
- refused
- core-private-source.test.ts
- graph.py
- .boolean
- ADDED Requirements
- .off
- Tasks — START-UMBRADB: UmbraDB as a library
- .onClose
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- vendored-ledger-v9.test.ts
- local-preprod-sync.mjs
- The laws of UmbraDB's storage helpers
- mutation-per-adapter.mjs
- ref_node_worker_threads
- Design — v1.1.0: Quint model checking
- Boundaries, threats and controls
- facade-merge-loader.ts
- midnight-env — reproducible PREPROD dev environment
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- crash-worker.ts
- startUmbraDB
- history
- .put
- data
- backupAtStop
- version
- code
- log
- T
- ADDED Requirements
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- Requirements
- Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- devDependencies
- Requirement: BK-1 Backup
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- Tasks — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Requirement: DT-3 The contents hash
- [0.10.0] - 2026-10-27
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Proposal — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0 (`token-metadata`)
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- scoped-review-manifest
- try.sh
- Tasks — v1.0.0-infosec-signoff
- Contributing
- UmbraDB in a browser
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
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
- 00054 — A slow-block test hung inside PGlite for over an hour
- UmbraDB node architecture
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)
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
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00023 — The blocks table's height partitions end at 5,000,000
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
- 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered
- 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream)
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container
- 00085 — The fast contract-log provider limits mid-chain use: development-only, and it halts on partial transactions
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- Vendored ledger builds
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails
- 00083 — Four timing-bound tests fail when the machine runs several test lanes at once
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- start-stack.sh
- repository
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
1. `vitest` - 465 edges
2. `UmbraError` - 357 edges
3. `ModuleDeclaration` - 213 edges
4. `InMemoryBlockSource` - 178 edges
5. `FinalizedLoop` - 139 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `Database` - 104 edges
9. `startUmbraDB()` - 103 edges
10. `PROCESS_BACKENDS` - 102 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (385 total, 36 thin omitted)

### Community 0 - "column-rules.ts"
Cohesion: 0.02
Nodes (200): CaptureColumn, CheckedMigration, ContentOptions, TableContent, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable (+192 more)

### Community 1 - "UmbraError"
Cohesion: 0.02
Nodes (120): databaseTarget, PostgresConnection, PostgresOptions, PgliteLockUse, SslMode, ReadOptions, DurabilityProbeOptions, DurabilityViolation (+112 more)

### Community 10 - "ref_node_fs"
Cohesion: 0.04
Nodes (102): RestoreOutcome, BackupBackend, BackupDatabase, killedRestore, TickerHandle, FileRow, ledgerBackup, FileProcess (+94 more)

### Community 100 - "process-context.test.ts"
Cohesion: 0.07
Nodes (28): MisuseListener, PublishRefusal, AcceptsDuplicates, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass, serving() (+20 more)

### Community 104 - "refcount-model.ts"
Cohesion: 0.09
Nodes (32): Node, BlockKind, BlockScript, BoundaryRewrite, DrivenBlock, GeneratedBlock, GeneratedState, GraphNode (+24 more)

### Community 107 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 108 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (22): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+14 more)

### Community 109 - "upgrade-boundary.test.ts"
Cohesion: 0.10
Nodes (32): versionEntry, HistoryOptions, ChainDataView, AdminRunOptions, TestBuildOptions, A47Observation, Controls, Version (+24 more)

### Community 11 - "messages.ts"
Cohesion: 0.03
Nodes (95): PublicSide, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected, CoreTransportOptions, CoreLink (+87 more)

### Community 111 - "hex"
Cohesion: 0.07
Nodes (25): RefcountBatch, Given, Halt, Outcome, Tables, childKeys(), node(), bytes() (+17 more)

### Community 112 - "node-key.test.ts"
Cohesion: 0.09
Nodes (32): nodeKeys, StoredNode, Written, GenesisNodes, NodeBatch, byReference, KeyOf, Walk (+24 more)

### Community 113 - "node-format.ts"
Cohesion: 0.11
Nodes (20): Reader, Readable, Reader, TableNode, list(), concat(), decodeChild(), encodeChild() (+12 more)

### Community 114 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 115 - "ref_node_crypto"
Cohesion: 0.11
Nodes (28): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages() (+20 more)

### Community 117 - "halts.test.ts"
Cohesion: 0.09
Nodes (33): LifecycleStatus, ProcessReason, ProcessingEnd, ProcessStatus, Q142Observation, A43Observation, CursorElsewhere, Halt (+25 more)

### Community 118 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 119 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 12 - "core-block-commit.test.ts"
Cohesion: 0.02
Nodes (102): BlockRow, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Migration (+94 more)

### Community 121 - "browser.test.ts"
Cohesion: 0.09
Nodes (31): Reachable, RestoreAttempt, PageRestore, heldClock, continuedProblems(), midChainProblems(), networkProblems(), plain() (+23 more)

### Community 122 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 123 - "page.ts"
Cohesion: 0.08
Nodes (29): LinkRecord, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp(), beginCore(), element() (+21 more)

### Community 127 - "in-memory-source.ts"
Cohesion: 0.07
Nodes (26): BlockHeaderItem, CoreBlockHeader, InMemoryItems, Wait, StandInOptions, RestoreJob, SignalJob, checkHeight() (+18 more)

### Community 128 - "network-refusals.ts"
Cohesion: 0.09
Nodes (23): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+15 more)

### Community 129 - "node-set.test.ts"
Cohesion: 0.08
Nodes (27): StoredRow, Tables, changedRow(), database(), databaseSql(), hexOf(), keyOf(), literal() (+19 more)

### Community 13 - "fetch-fixtures.ts"
Cohesion: 0.03
Nodes (117): NodeCallOptions, ProcessCondition, Scenario, RecordingClient, ArgType, BlockOptions, CallSpec, chainBlock (+109 more)

### Community 131 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 132 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+11 more)

### Community 134 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 136 - "backup/restore.ts"
Cohesion: 0.11
Nodes (24): PublicIdentity, Checked, PublicSide, RestoreInput, RestoreTarget, BackupText, isBlockLedgerSource(), configuredGenesisOf() (+16 more)

### Community 137 - "Lockstep"
Cohesion: 0.10
Nodes (11): InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal, byId() (+3 more)

### Community 138 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 139 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 14 - "ledger-storage.test.ts"
Cohesion: 0.03
Nodes (124): BlockParsed, Manifest, Restored, itemsSeen, ingest, IngestOptions, SeenLoad, RestartEvent (+116 more)

### Community 142 - "node-fields-harness.ts"
Cohesion: 0.09
Nodes (23): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Run() (+15 more)

### Community 143 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 144 - "intake.test.ts"
Cohesion: 0.13
Nodes (16): PrivateSeen, A114Observation, A116Observation, TestLink, CountingLink, a114Problems(), a114Run(), a116Problems() (+8 more)

### Community 145 - "checks.test.ts"
Cohesion: 0.10
Nodes (21): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), numericOkPredicate() (+13 more)

### Community 146 - "read-gate.ts"
Cohesion: 0.14
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 147 - "sigterm.test.ts"
Cohesion: 0.11
Nodes (23): Job, WorkEvent, WorkOptions, A48Observation, WORKER, Job, WorkerEvent, report() (+15 more)

### Community 148 - "postgres-tls-server.ts"
Cohesion: 0.10
Nodes (21): BenchEnv, TlsPostgres, removeAttempt(), startContainer(), startContainers(), makeCertificates(), startTlsPostgres(), PG_SETTINGS (+13 more)

### Community 15 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (118): ComputedBlock, LedgerBinding, LedgerStateItem, RetainedState, retainedStates, NodeSetFault, NodeSetOptions, NodeTableCheck (+110 more)

### Community 150 - "core-private-source.ts"
Cohesion: 0.12
Nodes (22): PrivateChecks, privateIntake, PrivateSourceOptions, startHashDecision, PublicConfiguration, PublicItem, listed(), needsLockstepRefusal() (+14 more)

### Community 151 - "config/plain-data.ts"
Cohesion: 0.11
Nodes (22): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, copyArray(), copyObject(), instanceOf() (+14 more)

### Community 152 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 153 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 154 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 155 - "configuration-refusal.test.ts"
Cohesion: 0.13
Nodes (20): ConfigFinding, configurationRefused(), findingText(), refusalFindings(), redactedCopy(), configurationFindings(), configurationRefusalLines(), isConfigurationRefusal() (+12 more)

### Community 158 - "PrivateBlockSource"
Cohesion: 0.11
Nodes (5): PrivateBlockSource, SourceTransport, PublicDatabase, bytesOfHex(), lockstepBehind()

### Community 159 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 16 - "module-api.ts"
Cohesion: 0.03
Nodes (106): coreHeaders, HeadersArgument, NodeHttpHandler, NodeUpgradeHandler, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions (+98 more)

### Community 161 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 162 - "manifest.ts"
Cohesion: 0.12
Nodes (20): BackupFacts, ManifestHistoryRow, ManifestMigration, readCursor(), readIdentity(), readPrivateCursor(), isPrivateDatabase(), present() (+12 more)

### Community 163 - "public-database.ts"
Cohesion: 0.16
Nodes (24): PrivateShared, StartHashes, PrivateLink, PrivateLinkAddress, PrivateLinkConnect, PublicSideOptions, PublicWakes, ConnectChannel (+16 more)

### Community 164 - "ProcessContexts"
Cohesion: 0.11
Nodes (5): MisuseReports, ProcessContexts, ProcessItems, providesProcessItem(), sealed()

### Community 165 - "crash.test.ts"
Cohesion: 0.13
Nodes (20): CrashCall, CrashEvent, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule(), a44Problems() (+12 more)

### Community 166 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 167 - "core-block-fetch/metadata.ts"
Cohesion: 0.25
Nodes (15): MetadataPallet, MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata() (+7 more)

### Community 168 - "start-umbradb.test.ts"
Cohesion: 0.14
Nodes (16): ModuleListRule, GoneCwdResult, moduleListProblems(), closedByItself(), hostile(), optionProblems(), throwing(), problemsOf() (+8 more)

### Community 169 - "HeightRun"
Cohesion: 0.09
Nodes (10): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, WaitsInTransaction (+2 more)

### Community 17 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (105): ApplyOutput, NodeStore, StateSummary, StoredNode, Freeable, LedgerHeight, Upstream, contractFixture (+97 more)

### Community 170 - "browser-harness.ts"
Cohesion: 0.17
Nodes (22): PageBackup, PageEvent, PageLink, ProcessName, StatusBody, apiChannel(), backupThrough(), byDeadline() (+14 more)

### Community 171 - ".concat"
Cohesion: 0.12
Nodes (12): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+4 more)

### Community 174 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 175 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 176 - ".value"
Cohesion: 0.25
Nodes (7): MetadataType, ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 18 - "version-checks.ts"
Cohesion: 0.03
Nodes (107): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, Boundary, BoundaryBlock, builtInNetwork, Issue (+99 more)

### Community 180 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 181 - "describeNodeStoreExports"
Cohesion: 0.16
Nodes (7): Disposable, NodeStoreExports, NodeStoreSubject, hasEmbeddedChild(), describeNodeStoreExports(), nodesOf(), sortedHex()

### Community 182 - "process-worker.ts"
Cohesion: 0.13
Nodes (14): Scope, ToProcessWorker, answer(), backUp(), connectLink(), coreCommittedHeight(), onLink(), openedProcess() (+6 more)

### Community 183 - "Buffer"
Cohesion: 0.14
Nodes (14): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+6 more)

### Community 185 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 186 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 187 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 188 - "placement.ts"
Cohesion: 0.17
Nodes (16): MetadataVariant, RuntimeMetadataView, ChainTransaction, EventPhase, RecordTypes, ScaleValue, callVariant(), carried() (+8 more)

### Community 189 - "BlockItems"
Cohesion: 0.13
Nodes (10): QueuedBlock, BlockItems, EagerItems, EagerLoop, KeptItems, KeptLoop, revisionAt(), reporting() (+2 more)

### Community 19 - "change-capture.ts"
Cohesion: 0.03
Nodes (118): TableDigest, TableDigestRow, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow, Chain (+110 more)

### Community 192 - "chain-events-decode.test.ts"
Cohesion: 0.15
Nodes (16): Primitive, canonicalJson(), hexOf(), littleEndian(), fill(), le(), merge(), read() (+8 more)

### Community 194 - "LoopPauses"
Cohesion: 0.16
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 196 - "childRefKeys"
Cohesion: 0.22
Nodes (7): ChildReader, ChildVisitor, childRefKeys(), readChildList(), readChildren(), referenced(), 1. The rules, on the reference model (LG-14)

### Community 198 - "Decisions"
Cohesion: 0.12
Nodes (16): MetadataField, Context, D1. A module, not an archive and a scanner, D2. Starting with the database (TM-1), D3. Tables (schema `token_metadata`), D4. Per block, D5. The API, D6. Candidates from a log's `data` (TM-2, TM-3) (+8 more)

### Community 2 - "api.ts"
Cohesion: 0.02
Nodes (122): ConfiguredDatabase, ConfiguredDatabaseOptions, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, Database (+114 more)

### Community 20 - "tape/index.ts"
Cohesion: 0.04
Nodes (77): Recorded, Link, TapeBuilder, TapeBuilderOptions, RecordingError, RecordingProblem, TapeProblem, TransformProblem (+69 more)

### Community 201 - "network.test.ts"
Cohesion: 0.18
Nodes (14): NetworkRuleName, Parsed, Expected, handleOf(), startedOf(), startWithSeams(), schemaCase(), listeningSockets() (+6 more)

### Community 207 - "backbone/part-migrations.test.ts"
Cohesion: 0.21
Nodes (14): FoldedPart, RecordedMigration, earlierBootstrapSql(), earlierRefusalProblems(), earlierRows(), earlierRowsSql(), recorded(), rowsSql() (+6 more)

### Community 208 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 21 - "NodeClient"
Cohesion: 0.05
Nodes (81): FinalizedHeightOptions, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription, Waiter (+73 more)

### Community 212 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 217 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 218 - "core.ts"
Cohesion: 0.23
Nodes (11): CommitOptions, ManualOpts, TinybenchOpts, commitEmptyBlockPglite(), commitEmptyBlockPostgres(), commitSamples(), startBenchEnv(), measureManual() (+3 more)

### Community 22 - "configured.ts"
Cohesion: 0.03
Nodes (105): BackupInput, BackupSeams, BackupTarget, BackupWritten, ManifestTool, DumpInput, PgliteDump, SnapshotSeams (+97 more)

### Community 223 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 228 - "Heartbeat"
Cohesion: 0.24
Nodes (7): Heartbeat, HeartbeatOptions, TimerHandle, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 23 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (92): demoLink, EndpointOptions, Envelope, PrivateLinkChannel, EngineInput, controlledTimers, PeerEnd, PeerMessage (+84 more)

### Community 232 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 238 - "src/configuration.ts"
Cohesion: 0.18
Nodes (6): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, umbradb:configuration

### Community 239 - "src/protocol.ts"
Cohesion: 0.24
Nodes (8): ProcessView, CallMethod, crossedError, FromProcessWorker, StartRun, hexOf(), jsonSafe(), HEX

### Community 24 - "contract-data-checks.ts"
Cohesion: 0.04
Nodes (104): ContractLog, CoreContractLogsFastOptions, CoreContractLogsFullOptions, CoreContractStatesOptions, ContractStateRow, BlockWriteHandle, LogEventType, BlockContext (+96 more)

### Community 245 - "extrinsics.ts"
Cohesion: 0.25
Nodes (9): BodyExtrinsic, ExtrinsicCall, BlockBody, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), isCompactU64() (+1 more)

### Community 246 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 247 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 25 - "process-admin.ts"
Cohesion: 0.04
Nodes (98): ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions (+90 more)

### Community 26 - "loop.test.ts"
Cohesion: 0.04
Nodes (85): EntryRange, LockstepWait, LoopEnd, SlowBlockEvent, Faults, LostCommit, Seen, AtGate (+77 more)

### Community 27 - "host.ts"
Cohesion: 0.05
Nodes (73): LoadLedger, TransactionParser, CoreLedgerStateOptions, LedgerName, ChainOutcome, ParsedTransaction, AppliedState, ApplyBlock (+65 more)

### Community 270 - "HeldHeight"
Cohesion: 0.32
Nodes (4): CommitOutcome, HeldHeight, Outcomes, DropsHeld

### Community 28 - "runner/process.ts"
Cohesion: 0.03
Nodes (57): BlockLedgerSource, Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait (+49 more)

### Community 280 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 29 - "chain-placement.test.ts"
Cohesion: 0.04
Nodes (92): BlockSpec, EventSpec, Json, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase (+84 more)

### Community 3 - "process-backends.ts"
Cohesion: 0.04
Nodes (143): NodeBatch, FixtureRun, SourceClass, Reader, Seen, TableSnapshot, Touches, Fault (+135 more)

### Community 30 - "ledger-refcount-backup.test.ts"
Cohesion: 0.04
Nodes (83): contentsHash, FileEntries, Cbor, DigestRow, DigestRows, Reader, FixtureConfig, ReadableDatabase (+75 more)

### Community 302 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 31 - "roles.ts"
Cohesion: 0.04
Nodes (78): MigrationPart, Difference, OwnPart, PlannedSchema, Provision, QualifiedTable, SchemaMigration, SchemaModule (+70 more)

### Community 32 - "refcount-histories.ts"
Cohesion: 0.04
Nodes (70): workerRecord, Call, StoredCheck, FacetOptions, Facets, NodeSetCache, tapeDeterminism, TapeDeterminismOptions (+62 more)

### Community 33 - "mounted-admin.test.ts"
Cohesion: 0.04
Nodes (72): gate, SecretHashes, SecretVariant, Compared, ConnectSeen, PortPeer, OwnWords, Shown (+64 more)

### Community 34 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (75): EngineConfig, ProcessHandle, Answered, Observation, Start, Refusal, Start, startAdminServer() (+67 more)

### Community 35 - "adapter.ts"
Cohesion: 0.04
Nodes (69): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+61 more)

### Community 36 - "transport-faults.test.ts"
Cohesion: 0.04
Nodes (49): ReadOnlyDatabase, ResultColumn, CoreTransport, Message, MessageType, Report, KeeperGlobals, Ended (+41 more)

### Community 37 - "NodeBlockSource"
Cohesion: 0.05
Nodes (37): CoreBlockItems, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeSubscription, NodeHeader, PreparedBlock (+29 more)

### Community 38 - "cbor.ts"
Cohesion: 0.05
Nodes (77): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+69 more)

### Community 39 - "validateDeclarations"
Cohesion: 0.05
Nodes (77): CoreSettings, HistoryRule, ImportedConfig, plainData, AppliedMigration, Holder, Started, StartupOptions (+69 more)

### Community 4 - "vitest"
Cohesion: 0.02
Nodes (127): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+119 more)

### Community 40 - "LedgerPackage"
Cohesion: 0.06
Nodes (40): LedgerEventKind, LedgerPackage, LedgerTaskBlock, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, Driver (+32 more)

### Community 41 - "validation.ts"
Cohesion: 0.04
Nodes (72): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, PlacedDeclaration, Plain (+64 more)

### Community 42 - "FinalizedLoop"
Cohesion: 0.05
Nodes (18): PointRun, Activity, FinalizedLoop, LoopObserver, UnexpectedCursor, SkipsLockstep, WaitingInRead, ItemsAfterWrite (+10 more)

### Community 43 - "entries.ts"
Cohesion: 0.03
Nodes (73): DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig (+65 more)

### Community 44 - "graph.ts"
Cohesion: 0.04
Nodes (77): Edge, GraphFacts, GraphInput, GraphPart, GraphRule, MidChain, Missing, RangeCheck (+69 more)

### Community 45 - "node.test.ts"
Cohesion: 0.04
Nodes (33): ManualTimers, Metadata, Step, RawClient, Failure, Variant, main(), pageHandler() (+25 more)

### Community 46 - "pause-fixtures.ts"
Cohesion: 0.05
Nodes (60): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, PausesInsideTheHeight (+52 more)

### Community 47 - "src/config/load.ts"
Cohesion: 0.04
Nodes (52): LoadOptions, Served, Row, Finding, BlockImport, ChildResult, CodeBlock, installedProject (+44 more)

### Community 48 - "transform-checks.ts"
Cohesion: 0.07
Nodes (56): Failure, Variant, TapeError, TransformError, CallRecord, NotifyRecord, recordKind, SubscriptionId (+48 more)

### Community 5 - "record-and-replay.test.ts"
Cohesion: 0.02
Nodes (101): ConnectSocket, Answer, Handler, Received, recorded, ConnectionFrames, Failure, Variant (+93 more)

### Community 51 - "loop.ts"
Cohesion: 0.06
Nodes (60): PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointSchedule (+52 more)

### Community 52 - "Process"
Cohesion: 0.06
Nodes (10): PauseHold, Process, isBlockItemSource(), hasLedgerTasks(), asksForChannels(), messageOf(), privateLinkOf(), signalCause() (+2 more)

### Community 53 - "process-build.ts"
Cohesion: 0.07
Nodes (47): EngineBuild, EngineNetwork, ProcessObservation, StartVia, CoreSeen, testBuild, TestProcessInput, A149Observation (+39 more)

### Community 54 - "ledger/types.ts"
Cohesion: 0.05
Nodes (50): FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw, AdapterSpec, LedgerRelease (+42 more)

### Community 55 - "order.property.test.ts"
Cohesion: 0.05
Nodes (56): PointArguments, CallEvent, Contexts, Recorder, WithDb, CheckName, GraphSpec, ModuleSpec (+48 more)

### Community 56 - "config-check.ts"
Cohesion: 0.04
Nodes (50): CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState (+42 more)

### Community 57 - ".from"
Cohesion: 0.04
Nodes (58): ChainBuildOptions, ChangedFile, GenesisFixture, installationCopy, PackageStartup, StartPackageProcess, Seen, chainBackbone() (+50 more)

### Community 58 - "private/lockstep-wait.test.ts"
Cohesion: 0.06
Nodes (59): LockstepCondition, OpenTransaction, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A118Observation, MismatchObservation (+51 more)

### Community 59 - "refcount-restart.ts"
Cohesion: 0.05
Nodes (53): BatchJson, ContentsHash, databaseNow, Hold, Light, Line, NodeSetKeeper, Observed (+45 more)

### Community 6 - "builds.ts"
Cohesion: 0.03
Nodes (106): AdminStarter, DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, A176Options, TickerConfig, PausableConfig (+98 more)

### Community 60 - "boundary.test.ts"
Cohesion: 0.07
Nodes (50): DesignTable, RowCoverage, ModuleReference, Finding, rule(), collationsWritten(), componentCode(), componentExports() (+42 more)

### Community 63 - "client.test.ts"
Cohesion: 0.05
Nodes (37): Connection, NodeClientOptions, NodeSocket, NodeSocketEvents, NodeTimers, SocketFailure, HandSocket, HandSockets (+29 more)

### Community 64 - "start-umbradb.ts"
Cohesion: 0.07
Nodes (54): Finding, MessagePortLike, readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork (+46 more)

### Community 65 - "chain-process.test.ts"
Cohesion: 0.05
Nodes (52): WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation, Failing, Flaky, Seen (+44 more)

### Community 66 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (50): BlockEventSource, LoopInput, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead (+42 more)

### Community 68 - "range.ts"
Cohesion: 0.05
Nodes (49): Arguments, Command, CompletenessRange, Final, Height, RangeRecording, RangeStats, Params (+41 more)

### Community 69 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (50): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import (+42 more)

### Community 7 - "admin-harness.ts"
Cohesion: 0.03
Nodes (122): MountedAdminAnswer, AdminSeams, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer (+114 more)

### Community 71 - "ref_node_timers"
Cohesion: 0.07
Nodes (37): Renamed, RunningCommand, statsConfig, runArguments(), runProcessCommand(), inProcess(), check(), write() (+29 more)

### Community 72 - "guarantees.test.ts"
Cohesion: 0.06
Nodes (32): UmbraDBHandle, CloseHelper, Hold, Signal, Job, Run, FaultedClose, QuietResult (+24 more)

### Community 73 - "loop-stop-harness.ts"
Cohesion: 0.08
Nodes (43): watched, A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation (+35 more)

### Community 75 - "history.test.ts"
Cohesion: 0.06
Nodes (45): HistoryFinding, Simulation, Start, Case, dataHash(), builtWith100(), deletesOnly(), failingSecondWrite() (+37 more)

### Community 76 - "startDatabase"
Cohesion: 0.09
Nodes (40): WriterProcess, WorkerEvent, PauseReport, startDatabase(), startWriter(), expectRefusedBeforeAnyWrite(), noHeight(), blocksIn() (+32 more)

### Community 77 - "config/history.ts"
Cohesion: 0.07
Nodes (44): ConfigRow, CoreVersion, ConfigHashRow, HistoryCheck, HistoryCode, HistoryContext, ProvidesRow, Span (+36 more)

### Community 8 - "migrate.ts"
Cohesion: 0.03
Nodes (113): Transaction, AppliedRow, Runnable, Settling, StartupInput, MultiStatementRunner, BlockWrites, Point (+105 more)

### Community 81 - "resolve.ts"
Cohesion: 0.06
Nodes (42): AddressRequest, Asked, LinkPlan, NetworkContext, NetworkInput, NetworkPlan, NetworkProblem, NetworkRequest (+34 more)

### Community 82 - "paused-harness.ts"
Cohesion: 0.08
Nodes (37): Validator, Body, PausedExpectation, Read, Reader, Running, commandBuild(), schemaFile() (+29 more)

### Community 83 - "post-block-update-checks.ts"
Cohesion: 0.08
Nodes (39): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+31 more)

### Community 84 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 85 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (33): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+25 more)

### Community 86 - "InMemoryBlockSource"
Cohesion: 0.09
Nodes (24): BlockRef, InMemoryBlockSource, InMemorySourceOptions, Flaky, Fetching, Recorder, LateRedelivery, failingSource() (+16 more)

### Community 87 - "binding.test.ts"
Cohesion: 0.08
Nodes (41): PrivateIntakeOptions, A165Options, a165Run, Attempt, A113Observation, A156Observation, Binding, Created (+33 more)

### Community 88 - "status-schema.test.ts"
Cohesion: 0.06
Nodes (33): BlockItemSource, ProcessState, Decision, ReadinessCase, coreBlockFetchOnFetch(), migrating(), "on-compute"(), staysUp() (+25 more)

### Community 9 - "declaration.ts"
Cohesion: 0.03
Nodes (121): StatsRow, Outcome, BlockParsedOptions, BlockTransaction, CoreChainFacts, ChainEvent, RestoreBase, CommandBuildOptions (+113 more)

### Community 90 - "api-server.test.ts"
Cohesion: 0.08
Nodes (30): ChainDataAnswer, HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, AppendsVersion, Client, VersionsAnswersOnly (+22 more)

### Community 91 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (33): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, ChildResult (+25 more)

### Community 93 - "ledger-tasks-checks.ts"
Cohesion: 0.10
Nodes (34): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses(), plainWatchModule(), runTasks() (+26 more)

### Community 94 - "validate.ts"
Cohesion: 0.10
Nodes (40): CursorRule, EntryView, Issue, Plain, SettingsSchema, coreSettingsSchema(), pathOf(), closest() (+32 more)

### Community 95 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.06
Nodes (32): LedgerWorkerFailure, SlowStep, TestLoaderData, errorOf(), beat(), countDeserializations(), hexOf(), loadLedger() (+24 more)

### Community 97 - "ChannelEndpoint"
Cohesion: 0.11
Nodes (12): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), discard(), isChannel(), 00068 — Two readers of a host's channel beside the private link's endpoint read its members outside a guard (+4 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+27 more)

### Community 267 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 70 - "refused"
Cohesion: 0.05
Nodes (50): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+42 more)

### Community 102 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (12): publicLockstepOf(), height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), PUBLIC_POLL_MS (+4 more)

### Community 105 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 124 - ".boolean"
Cohesion: 0.06
Nodes (32): 4.1 Column types, 4.2 Rules, 4.3 Data that is not a function of the chain: `deterministic: false`, 4.4 The ledger's node tables, 4. Deterministic PostgreSQL, 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding (+24 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+25 more)

### Community 130 - ".off"
Cohesion: 0.06
Nodes (29): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, 6. `sweep: off` (O-1), MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing (+21 more)

### Community 135 - "Tasks — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.06
Nodes (29): ownKeys(), Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+21 more)

### Community 172 - ".onClose"
Cohesion: 0.11
Nodes (18): fault(), 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once, Evidence, Problem, Suggested fix, 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format (+10 more)

### Community 173 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 184 - "vendored-ledger-v9.test.ts"
Cohesion: 0.22
Nodes (18): loadProblems(), tagsOf(), freeAll(), bigCell(), cell(), contractAddress(), makeV8State(), makeV9State() (+10 more)

### Community 200 - "local-preprod-sync.mjs"
Cohesion: 0.21
Nodes (17): commitOf(), configText(), docker(), dockerHas(), dockerLater(), imageDigests(), main(), nodeRpc() (+9 more)

### Community 209 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.13
Nodes (14): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers, ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks) (+6 more)

### Community 216 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 222 - "ref_node_worker_threads"
Cohesion: 0.16
Nodes (8): hex(), hex(), requested, store, stored, requested, store, stored

### Community 227 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 230 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 231 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 259 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 263 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 272 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 300 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 355 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 49 - "startUmbraDB"
Cohesion: 0.03
Nodes (67): startUmbraDB(), libraryCore(), readerOf(), 00053 — the exported `startProcess` cannot be called with the package alone, Evidence, Problem, 00057 — The ledger worker and the main thread may load different user-module code, Evidence (+59 more)

### Community 50 - "history"
Cohesion: 0.03
Nodes (69): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+61 more)

### Community 61 - ".put"
Cohesion: 0.04
Nodes (56): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+48 more)

### Community 62 - "data"
Cohesion: 0.04
Nodes (63): params(), n(), data(), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not), Rework (class 3 continued — cross-vendor cold audit, rounds 2-4), Rework (class 3 — cross-vendor audit caught real correctness defects post-self-verify) (+55 more)

### Community 67 - "backupAtStop"
Cohesion: 0.04
Nodes (57): backupAtStop(), text(), transportReader(), transportReaderRule(), both(), memoryTables(), nodeBatchOf(), stepOrHalt() (+49 more)

### Community 74 - "version"
Cohesion: 0.05
Nodes (51): side(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules (+43 more)

### Community 78 - "code"
Cohesion: 0.04
Nodes (48): code(), Added, 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), 14. External claims and their evidence, 15. Relation to the existing design documents, Design — CORE-ARCH: the standalone indexer's core architecture, Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface (+40 more)

### Community 79 - "log"
Cohesion: 0.04
Nodes (45): join(), normalize(), resolve(), log(), delimiter, sep, 00072 — `umbradb run` logs nothing when SIGTERM or SIGINT stops it, Evidence (+37 more)

### Community 80 - "T"
Cohesion: 0.04
Nodes (49): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+41 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): identity(), 1. Starting and storing (TM-1, TM-14), 2. Candidates and classification (TM-2 … TM-5), 3. State (TM-6 … TM-11), 4. The API (TM-12, TM-13, TM-15), 5. Real chain and browser, 6. Documentation, Acceptance — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0 (+36 more)

### Community 96 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.05
Nodes (35): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+27 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 103 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+26 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 133 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 141 - "package.json"
Cohesion: 0.07
Nodes (29): bin, umbradb, bugs, url, description, optional, engines, node (+21 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 156 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 157 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 160 - "Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.08
Nodes (25): 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words, 3.1 Where it runs (+17 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 178 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 179 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 190 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 191 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 197 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 199 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 202 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 204 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.12
Nodes (11): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+3 more)

### Community 205 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 206 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 210 - "Requirement: BK-1 Backup"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+7 more)

### Community 213 - "README.md"
Cohesion: 0.19
Nodes (6): Choosing a database, Launching it, stats-module, Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 214 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 215 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+6 more)

### Community 219 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 220 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 221 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 224 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 225 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 226 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 229 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 233 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 234 - "Tasks — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0"
Cohesion: 0.17
Nodes (11): 0. Baseline, 1. Fixtures (`design.md` D7, D8), 2. Reading and classifying (D6, D7), 3. The module and its state (D1 … D4), 4. The API (D5), 5. Real chain and browser, 6. Verification, 7. Review (+3 more)

### Community 236 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 237 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 240 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 241 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 242 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 243 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.18
Nodes (10): 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents, 7. `core-arch` criteria rewritten by this change, 8. Required test ids, 9. Requirement coverage (+2 more)

### Community 244 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 248 - "[0.10.0] - 2026-10-27"
Cohesion: 0.20
Nodes (9): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changed since `v0.10.0-rc.2`: ledger nodes reclaimed by reference counting (`ledger-refcount`), Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface) (+1 more)

### Community 249 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 250 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 251 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 252 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 253 - "Proposal — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0 (`token-metadata`)"
Cohesion: 0.20
Nodes (9): Capabilities, Decisions taken (2026-11-05), Impact, Modified Capabilities, New Capabilities, Non-goals (what this change does NOT cover), Proposal — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0 (`token-metadata`), What changes (+1 more)

### Community 254 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 255 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 256 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 257 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 258 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 260 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 261 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 262 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 264 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 265 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 266 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 268 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 269 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 271 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 273 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 274 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 275 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 276 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 277 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 278 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 279 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 281 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 283 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 284 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 285 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 286 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 287 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 288 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 289 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 290 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 291 - "Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`), What changes, Why

### Community 292 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 293 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 294 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 295 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 296 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 297 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 298 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 299 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 301 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 303 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 304 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 305 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 306 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 307 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 308 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 309 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 310 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 311 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 312 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 313 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 314 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 315 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 316 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 317 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 318 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 319 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 320 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 321 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 322 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 323 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 324 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 325 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 326 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 327 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 328 - "00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered"
Cohesion: 0.40
Nodes (4): 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered, Evidence, Problem, Suggested fix

### Community 329 - "00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)"
Cohesion: 0.40
Nodes (4): 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …), Evidence, Problem, Suggested fix

### Community 330 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 331 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 332 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 333 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 334 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 335 - "00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream)"
Cohesion: 0.40
Nodes (4): 00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream), Evidence, Problem, Suggested fix (upstream; the ledger team's choice)

### Community 336 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 337 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 338 - "00085 — The fast contract-log provider limits mid-chain use: development-only, and it halts on partial transactions"
Cohesion: 0.40
Nodes (4): 00085 — The fast contract-log provider limits mid-chain use: development-only, and it halts on partial transactions, Evidence, Problem, Suggested fix

### Community 339 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 340 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 341 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 342 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 343 - "Vendored ledger builds"
Cohesion: 0.40
Nodes (4): Rebuilding, Updating a version, Vendored ledger builds, What the patches add

### Community 345 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 346 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.50
Nodes (3): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Suggested fix

### Community 347 - "00083 — Four timing-bound tests fail when the machine runs several test lanes at once"
Cohesion: 0.50
Nodes (3): 00083 — Four timing-bound tests fail when the machine runs several test lanes at once, Problem, Suggested fix

### Community 348 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 349 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 350 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 351 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 352 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 353 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 359 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-8949`, `RFC-3339`, `RFC-8949` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4442 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `column-rules.ts`, `UmbraError`, `api.ts`, `process-backends.ts`, `record-and-replay.test.ts`, `builds.ts`, `admin-harness.ts`, `migrate.ts`, `declaration.ts`, `ref_node_fs`, `messages.ts`, `core-block-commit.test.ts`, `fetch-fixtures.ts`, `ledger-storage.test.ts`, `core-ledger-state.ts`, `module-api.ts`, `adapter-fixtures.ts`, `version-checks.ts`, `change-capture.ts`, `tape/index.ts`, `NodeClient`, `configured.ts`, `channel-queue.test.ts`, `contract-data-checks.ts`, `process-admin.ts`, `loop.test.ts`, `host.ts`, `runner/process.ts`, `chain-placement.test.ts`, `ledger-refcount-backup.test.ts`, `roles.ts`, `refcount-histories.ts`, `mounted-admin.test.ts`, `refused-configuration.test.ts`, `adapter.ts`, `transport-faults.test.ts`, `NodeBlockSource`, `cbor.ts`, `validateDeclarations`, `validation.ts`, `entries.ts`, `graph.ts`, `node.test.ts`, `pause-fixtures.ts`, `src/config/load.ts`, `transform-checks.ts`, `loop.ts`, `process-build.ts`, `ledger/types.ts`, `order.property.test.ts`, `config-check.ts`, `.from`, `private/lockstep-wait.test.ts`, `refcount-restart.ts`, `boundary.test.ts`, `client.test.ts`, `start-umbradb.ts`, `chain-process.test.ts`, `slow-block-harness.ts`, `range.ts`, `ref_node_timers`, `guarantees.test.ts`, `loop-stop-harness.ts`, `history.test.ts`, `startDatabase`, `resolve.ts`, `paused-harness.ts`, `post-block-update-checks.ts`, `retirement.test.ts`, `file-mode.test.ts`, `binding.test.ts`, `status-schema.test.ts`, `api-server.test.ts`, `pglite-lock.ts`, `ledger-tasks-checks.ts`, `ledger/ledger-tasks.test.ts`, `process-context.test.ts`, `core-private-source.test.ts`, `refcount-model.ts`, `Worker`, `cold-boot-recovery.integration.test.ts`, `upgrade-boundary.test.ts`, `hex`, `node-key.test.ts`, `node-format.ts`, `release-version.ts`, `ref_node_crypto`, `halts.test.ts`, `browser/build.ts`, `browser.test.ts`, `resolver-boundary.ts`, `network-refusals.ts`, `node-set.test.ts`, `code-registry.ts`, `postgres/transaction-history-storage.ts`, `test/postgres/setup.ts`, `backup/restore.ts`, `Lockstep`, `documents.ts`, `pg-tx-history-adapter.ts`, `package.json`, `intake.test.ts`, `checks.test.ts`, `read-gate.ts`, `sigterm.test.ts`, `core-private-source.ts`, `config/plain-data.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `configuration-refusal.test.ts`, `surface.test.ts`, `node-bridge.ts`, `crash.test.ts`, `start-umbradb.test.ts`, `block-fetch-decode.test.ts`, `harness.ts`, `library-documents.test.ts`, `describeNodeStoreExports`, `vendored-ledger-v9.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `BlockItems`, `chain-events-decode.test.ts`, `excluded-not-exported.test.ts`, `LoopPauses`, `network.test.ts`, `backbone/part-migrations.test.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `Heartbeat`, `facade-merge-loader.ts`, `ledger/plain-data.ts`?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-8949` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `column-rules.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.016039654295882055 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `column-rules.ts`, `api.ts`, `process-backends.ts`, `record-and-replay.test.ts`, `builds.ts`, `migrate.ts`, `declaration.ts`, `ref_node_fs`, `messages.ts`, `core-block-commit.test.ts`, `fetch-fixtures.ts`, `core-ledger-state.ts`, `module-api.ts`, `version-checks.ts`, `change-capture.ts`, `tape/index.ts`, `NodeClient`, `configured.ts`, `channel-queue.test.ts`, `contract-data-checks.ts`, `process-admin.ts`, `loop.test.ts`, `host.ts`, `runner/process.ts`, `roles.ts`, `refused-configuration.test.ts`, `transport-faults.test.ts`, `NodeBlockSource`, `cbor.ts`, `validateDeclarations`, `LedgerPackage`, `validation.ts`, `FinalizedLoop`, `entries.ts`, `graph.ts`, `pause-fixtures.ts`, `src/config/load.ts`, `transform-checks.ts`, `loop.ts`, `Process`, `process-build.ts`, `config-check.ts`, `private/lockstep-wait.test.ts`, `client.test.ts`, `start-umbradb.ts`, `chain-process.test.ts`, `slow-block-harness.ts`, `backupAtStop`, `range.ts`, `ref_node_timers`, `guarantees.test.ts`, `history.test.ts`, `startDatabase`, `config/history.ts`, `resolve.ts`, `InMemoryBlockSource`, `binding.test.ts`, `status-schema.test.ts`, `api-server.test.ts`, `pglite-lock.ts`, `ledger-tasks-checks.ts`, `validate.ts`, `process-context.test.ts`, `core-private-source.test.ts`, `upgrade-boundary.test.ts`, `hex`, `ref_node_crypto`, `halts.test.ts`, `backup/restore.ts`, `checks.test.ts`, `postgres-tls-server.ts`, `core-private-source.ts`, `config/plain-data.ts`, `configuration-refusal.test.ts`, `PrivateBlockSource`, `manifest.ts`, `public-database.ts`, `ProcessContexts`, `backbone/part-migrations.test.ts`, `statementsOf`, `browser/src/config/load.ts`, `sha256`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.023229981647831546 - nodes in this community are weakly interconnected._