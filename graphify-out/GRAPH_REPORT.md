# Graph Report - UmbraDB

## Corpus Check
- 1245 files · ~1,783,043 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13049 nodes · 40326 edges · 388 communities (351 shown, 37 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3402 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `e59fbd63b6fe0aeb` (1245 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- Database
- loop.test.ts
- UmbraError
- post-block-update-checks.ts
- page.ts
- ledger/load.ts
- example-checks.ts
- validate.ts
- core.ts
- InMemoryBlockSource
- Worker
- pg-tx-history-adapter.ts
- release-version.ts
- api-server.test.ts
- module-api.ts
- process-admin.ts
- code-registry.ts
- network.test.ts
- NodeClient
- node-set.test.ts
- browser/build.ts
- reason
- config-check-database.test.ts
- paused-harness.ts
- browser.test.ts
- tape/index.ts
- process-worker.ts
- cbor.ts
- checks.test.ts
- test/postgres/setup.ts
- ref_node_crypto
- LoopPauses
- documents.ts
- postgres/transaction-history-storage.ts
- entries.ts
- worker-storage.test.ts
- Lockstep
- read-gate.ts
- recovery.test.ts
- fixtures/configuration.ts
- chain-events-decode.test.ts
- node-bridge.ts
- node-fields-harness.ts
- core-transport.ts
- ProcessContexts
- refcount-step.test.ts
- height-versioned.property.test.ts
- networks.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- column-rules.ts
- HeightRun
- validation.test.ts
- dispatch.ts
- .value
- cbor.property.test.ts
- crash.test.ts
- hex
- pack-install.mjs
- configuration-refusal.test.ts
- ledger/types.ts
- api-session.test.ts
- block-fetch-decode.test.ts
- accepted-hash-checks.ts
- browser-harness.ts
- builder.test.ts
- core-block-fetch/metadata.ts
- envelope.ts
- chrome.ts
- module-api.test.ts
- ledger-tapes.ts
- FakeNode
- backbone/part-migrations.test.ts
- statementsOf
- config/plain-data.test.ts
- cbor.test.ts
- client.test.ts
- fetch-fixtures.ts
- node-refs.ts
- ApiRoutes
- source-scan.ts
- quiet-host.child.ts
- stats-module.ts
- sweep-tapes.ts
- ReadHandle
- .head
- connectChannel
- chain-events-source.test.ts
- no-indexer-or-wallet-sdk.test.ts
- browser/src/config/load.ts
- Process
- ws-mutual-tls.test.ts
- refcount-checks.ts
- component-table.test.ts
- .send
- refused-configuration.test.ts
- Design — Sprint 1: project setup + TemporalKV
- ledger/plain-data.ts
- ref_node_fs
- extrinsics.ts
- admin/configuration.ts
- pageBench
- signal-backup.worker.ts
- adapter-fixtures.ts
- core-ledger-state/sql.ts
- mutation-evidence.d.mts
- node-run.ts
- AsyncLocalStorage
- range.ts
- mounted-admin.test.ts
- opt-out.test.ts
- runner/process.ts
- in-memory-source.ts
- ref_node_timers
- resolve.ts
- HeightActivity
- restore-kill.worker.ts
- adapter.ts
- listenerProblems
- zod
- PageApiChannel
- NodeFS
- FinalizedLoop
- core-block-parsed.ts
- core-private-source.ts
- db/backends.ts
- startUmbraDB
- client.ts
- declaration.ts
- host.ts
- loop-stop-harness.ts
- restore-ledger.ts
- vitest
- NodeBlockSource
- chain-process.test.ts
- refcount-model.ts
- version-checks.ts
- process-backends.ts
- core-ledger-state.ts
- intake.test.ts
- digests.test.ts
- spawnChild
- core-block-commit.test.ts
- LedgerPackage
- backup/backup.ts
- configured.ts
- config/history.ts
- contract-data-checks.ts
- private/lockstep-wait.test.ts
- backup/restore.ts
- containers.test.ts
- slow-block-harness.ts
- pause-fixtures.ts
- .from
- BACKENDS
- builds.ts
- start-umbradb.ts
- PgTransactionHistoryStorage
- transport-faults.test.ts
- order.property.test.ts
- LedgerHost
- core-config.test.ts
- api-socket.ts
- ledger-sweep.test.ts
- admin-harness.ts
- transform-checks.ts
- graph.ts
- resolver-boundary.ts
- private-transport.ts
- interfaces/transaction-history-storage.ts
- ledger-tasks-checks.ts
- height-versioned.test.ts
- surface.test.ts
- retirement.test.ts
- src/db/postgres.ts
- mapping.ts
- networks.ts
- validation.ts
- file-mode.test.ts
- ChannelEndpoint
- config-check.ts
- BlockRef
- ADDED Requirements
- Proposal — Sprint 3: CheckpointStore
- Problem
- refused
- ADDED Requirements
- core-private-source.test.ts
- graph.py
- .slowBlockMs
- boundary.test.ts
- T
- .disconnect
- conformance-gate.mjs
- twox.ts
- openssl
- Boundaries, threats and controls
- shiftedSource
- Requirement: BK-1 Backup
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- backupAtStop
- parseJsonLossless
- v9
- read-only-checks.ts
- fresh-instance.mjs
- package-keys-walk.mjs
- crash-worker.ts
- version
- history
- .put
- data
- table
- .off
- code
- cold-boot-recovery.integration.test.ts
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- package.json
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- Requirement: BK-1 Backup
- ADDED Requirements
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
- README.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- Requirement: DT-3 The contents hash
- Design — Sprint 4: Watermarks
- explore.md
- ROADMAP.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- scoped-review-manifest
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
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
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 2: Transaction/Lease
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
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
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
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream)
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- bug-report.md
- feature-request.md
- Design — CORE-ARCH: the standalone indexer's core architecture
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Test wallets
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 433 edges
2. `UmbraError` - 356 edges
3. `ModuleDeclaration` - 204 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 135 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `Database` - 104 edges
9. `startUmbraDB()` - 103 edges
10. `ReadHandle` - 94 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (388 total, 37 thin omitted)

### Community 0 - "Database"
Cohesion: 0.02
Nodes (165): Database, SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput (+157 more)

### Community 1 - "loop.test.ts"
Cohesion: 0.02
Nodes (153): EntryRange, GraphInput, CommitOutcome, HeightFailure, HeldHeight, LockstepWait, LoopEnd, SlowBlockEvent (+145 more)

### Community 10 - "UmbraError"
Cohesion: 0.03
Nodes (75): ConfiguredDatabase, databaseTarget, PostgresConnection, PostgresOptions, PgliteLockUse, sha256, ReadOptions, ReadTimeoutSetting (+67 more)

### Community 100 - "post-block-update-checks.ts"
Cohesion: 0.11
Nodes (34): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+26 more)

### Community 103 - "page.ts"
Cohesion: 0.06
Nodes (31): ApiChannel, LinkRecord, PageState, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp() (+23 more)

### Community 105 - "ledger/load.ts"
Cohesion: 0.08
Nodes (32): AdapterSpec, LedgerRelease, LedgerReleasePackage, StateSummary, V9Logs, LedgerHeight, SlowStep, OracleState (+24 more)

### Community 106 - "example-checks.ts"
Cohesion: 0.10
Nodes (25): Served, BlockImport, ChildResult, CodeBlock, installedProject, isolationProblems(), serveCommand(), allowedSource() (+17 more)

### Community 108 - "validate.ts"
Cohesion: 0.11
Nodes (37): ConfigRule, CursorRule, Issue, Plain, coreSettingsSchema(), pathOf(), closest(), configFindings() (+29 more)

### Community 109 - "core.ts"
Cohesion: 0.11
Nodes (28): BaselineLoad, Comparison, CommitOptions, PostgresRun, BenchEnv, ManualOpts, TinybenchOpts, Backend (+20 more)

### Community 11 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (106): InMemoryBlockSource, ProcessingEnd, ProcessStatus, ProcessObservation, StartVia, ChangedFile, GenesisFixture, installationCopy (+98 more)

### Community 114 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 115 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (25): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+17 more)

### Community 117 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 118 - "api-server.test.ts"
Cohesion: 0.10
Nodes (24): AppendsVersion, Client, probe(), configHashesOf(), duplicateProblems(), exchange(), helperProblems(), hex() (+16 more)

### Community 119 - "module-api.ts"
Cohesion: 0.09
Nodes (23): ChainDataAnswer, ApiError, ApiErrorCode, HttpHandler, HttpMethod, HttpRoute, ModuleApi, PathSegment (+15 more)

### Community 12 - "process-admin.ts"
Cohesion: 0.03
Nodes (108): MountedAdminAnswer, AdminSeams, PrivateSideFacts, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin (+100 more)

### Community 120 - "code-registry.ts"
Cohesion: 0.10
Nodes (32): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, changeTasks(), allTasks(), input() (+24 more)

### Community 121 - "network.test.ts"
Cohesion: 0.10
Nodes (27): RunOptions, RunSeams, SignalSource, stopSignal, UserModulesSource, NetworkRuleName, IgnoredJob, Parsed (+19 more)

### Community 122 - "NodeClient"
Cohesion: 0.12
Nodes (14): FinalizedHeightOptions, HeadSubscriber, NodeClient, Opened, finalizedHeight(), invalidOption(), timedOut(), isRecord() (+6 more)

### Community 123 - "node-set.test.ts"
Cohesion: 0.07
Nodes (31): StoredRow, Tables, contentDefinedLedgerState(), countsAndQueue(), writeCountsAndQueue(), changedRow(), database(), databaseSql() (+23 more)

### Community 124 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 125 - "reason"
Cohesion: 0.07
Nodes (31): TransactionHistoryStorage, reason(), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier (+23 more)

### Community 126 - "config-check-database.test.ts"
Cohesion: 0.08
Nodes (22): CheckStep, CheckTarget, CliBackend, configCheck(), configText(), coreSettings(), inChild(), lineOf() (+14 more)

### Community 128 - "paused-harness.ts"
Cohesion: 0.13
Nodes (28): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, loadConfig() (+20 more)

### Community 129 - "browser.test.ts"
Cohesion: 0.10
Nodes (31): Reachable, RestoreAttempt, PageRestore, continuedProblems(), midChainProblems(), networkProblems(), plain(), restoreProblems() (+23 more)

### Community 13 - "tape/index.ts"
Cohesion: 0.04
Nodes (87): heldClock, Failure, Variant, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest (+79 more)

### Community 130 - "process-worker.ts"
Cohesion: 0.11
Nodes (23): ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker, answer() (+15 more)

### Community 132 - "cbor.ts"
Cohesion: 0.09
Nodes (28): ColumnMode, DateTimeFields, Mode, PathNode, Task, ScalarColumnType, checkSafeInteger(), compareBytes() (+20 more)

### Community 133 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+14 more)

### Community 134 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 135 - "ref_node_crypto"
Cohesion: 0.13
Nodes (25): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages() (+17 more)

### Community 137 - "LoopPauses"
Cohesion: 0.08
Nodes (17): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, clock(), watched(), 1. Module layout, 2. Backend routing (the one non-obvious constraint) (+9 more)

### Community 138 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 139 - "postgres/transaction-history-storage.ts"
Cohesion: 0.10
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+11 more)

### Community 14 - "entries.ts"
Cohesion: 0.02
Nodes (120): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput (+112 more)

### Community 141 - "worker-storage.test.ts"
Cohesion: 0.11
Nodes (20): ApplyInput, StoredNode, AdapterWorkerRequest, FreshInstanceRequest, FreshInstanceResult, StagenetBlockJson, StagenetFixtureJson, Nodes (+12 more)

### Community 142 - "Lockstep"
Cohesion: 0.11
Nodes (11): InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal, byId() (+3 more)

### Community 143 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 144 - "recovery.test.ts"
Cohesion: 0.11
Nodes (20): Armed, CommitArm, CommitFault, CommitProxy, Pair, Fault, holds(), tailOf() (+12 more)

### Community 145 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (21): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration() (+13 more)

### Community 146 - "chain-events-decode.test.ts"
Cohesion: 0.11
Nodes (24): MetadataField, MetadataVariant, Primitive, RuntimeMetadataView, RecordTypes, ScaleValue, systemEventsKey(), namedField() (+16 more)

### Community 148 - "node-bridge.ts"
Cohesion: 0.11
Nodes (20): NodeStore, EngineOptions, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes() (+12 more)

### Community 149 - "node-fields-harness.ts"
Cohesion: 0.11
Nodes (22): A168Observation, A168Phase, Expected, GatedConnector, StatusReader, a(), a168Run(), atLeast() (+14 more)

### Community 15 - "core-transport.ts"
Cohesion: 0.03
Nodes (99): demoLink, EndpointOptions, Envelope, LinkTimers, MessagePortLike, PrivateLinkChannel, CoreChannelSeams, CoreChannelsOptions (+91 more)

### Community 150 - "ProcessContexts"
Cohesion: 0.10
Nodes (7): ProcessContexts, ProcessItems, AllowsOutside, AllowsTwice, names(), providesProcessItem(), sealed()

### Community 153 - "refcount-step.test.ts"
Cohesion: 0.11
Nodes (19): ComputedBlock, refcountStep, RefcountTables, Given, Halt, Outcome, bytesOf(), hexOf() (+11 more)

### Community 154 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 155 - "networks.test.ts"
Cohesion: 0.11
Nodes (20): Answers, File, FormatRow, TapeAnswers, FoundTape, found(), nodeRootAt(), expectTableHolds() (+12 more)

### Community 156 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 157 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 158 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 16 - "column-rules.ts"
Cohesion: 0.02
Nodes (103): ModuleTableOptions, CatalogColumn, CatalogOptions, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+95 more)

### Community 161 - "HeightRun"
Cohesion: 0.08
Nodes (11): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, LateRedelivery, SkipsStartAtRestart, CommitsDespiteLastWrite (+3 more)

### Community 163 - "validation.test.ts"
Cohesion: 0.10
Nodes (17): DeclarationRule, Case, ShapeCase, Stats, schemaName(), first(), validateWith(), module() (+9 more)

### Community 165 - "dispatch.ts"
Cohesion: 0.18
Nodes (23): Callback, EntryBoundary, ParallelPoint, PointArguments, PointSchedule, CoreStopsFirst, boundaryModules(), dispatch() (+15 more)

### Community 166 - ".value"
Cohesion: 0.22
Nodes (9): MetadataType, ScaleReader, ValueReader, blockTimeOf(), bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement (+1 more)

### Community 167 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (23): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+15 more)

### Community 168 - "crash.test.ts"
Cohesion: 0.13
Nodes (20): CrashCall, CrashEvent, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule(), a44Problems() (+12 more)

### Community 17 - "hex"
Cohesion: 0.04
Nodes (83): nodeKeys, StoredNode, Reader, NodeKeyTape, Written, GenesisNodes, Disposable, NodeBatch (+75 more)

### Community 170 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 171 - "configuration-refusal.test.ts"
Cohesion: 0.14
Nodes (20): ConfigFinding, ReasonCode, Unwrapped, earlyRedactor(), configurationFindings(), configurationRefusalLines(), isConfigurationRefusal(), messageOf() (+12 more)

### Community 172 - "ledger/types.ts"
Cohesion: 0.18
Nodes (21): LedgerEvent, LedgerTaskBlock, LogItem, TransactionResult, VmLog, ledgerItemsSeen, a106Problems(), a107Problems() (+13 more)

### Community 174 - "api-session.test.ts"
Cohesion: 0.13
Nodes (17): HeadersArgument, answerNotServing(), byteLength(), lifecycleBody(), lifecycleHeaders(), notServingResponse(), refuseChannelNotServing(), refuseNotServing() (+9 more)

### Community 175 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 176 - "accepted-hash-checks.ts"
Cohesion: 0.17
Nodes (21): a165Run, Attempt, privateCursorHeight(), a165Problems(), contentsOf(), cursorOf(), headerHash(), hexOf() (+13 more)

### Community 177 - "browser-harness.ts"
Cohesion: 0.19
Nodes (21): PageBackup, PageEvent, PageLink, ProcessName, StatusBody, apiChannel(), backupThrough(), byDeadline() (+13 more)

### Community 18 - "builder.test.ts"
Cohesion: 0.03
Nodes (59): ManualTimers, ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata (+51 more)

### Community 182 - "core-block-fetch/metadata.ts"
Cohesion: 0.29
Nodes (14): MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 183 - "envelope.ts"
Cohesion: 0.19
Nodes (17): ChainDataView, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions(), chainApi() (+9 more)

### Community 184 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 188 - "module-api.test.ts"
Cohesion: 0.12
Nodes (13): ApiRequest, ApiResponse, Leaking, bodyOf(), errorOf(), ok(), "on-start-api"(), API_ERROR_STATUS (+5 more)

### Community 19 - "ledger-tapes.ts"
Cohesion: 0.04
Nodes (104): BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime, Field, PalletMetadata (+96 more)

### Community 195 - "backbone/part-migrations.test.ts"
Cohesion: 0.21
Nodes (14): FoldedPart, RecordedMigration, earlierBootstrapSql(), earlierRefusalProblems(), earlierRows(), earlierRowsSql(), recorded(), rowsSql() (+6 more)

### Community 197 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 198 - "config/plain-data.test.ts"
Cohesion: 0.16
Nodes (9): Row, plainDataWith(), failures(), refusal(), thrown(), valueOf(), A26, files (+1 more)

### Community 199 - "cbor.test.ts"
Cohesion: 0.15
Nodes (14): CanonicalEncodingFailure, CanonicalValue, run(), refusal(), toHex(), failureReason(), expectFailure(), failure() (+6 more)

### Community 2 - "client.test.ts"
Cohesion: 0.02
Nodes (101): NodeClientOptions, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, IngestOptions, HandSocket (+93 more)

### Community 20 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (95): ProcessCondition, ArgType, BlockOptions, CallSpec, RUNTIME, Decoded, FetchSeen, CrashEvent (+87 more)

### Community 203 - "node-refs.ts"
Cohesion: 0.29
Nodes (4): ChildReader, ChildVisitor, readChildList(), readChildren()

### Community 204 - "ApiRoutes"
Cohesion: 0.21
Nodes (8): ApiRoutes, ModuleRegistration, AcceptsDuplicates, registerModuleApis(), shapeOf(), routesOf(), api(), routesOf()

### Community 205 - "source-scan.ts"
Cohesion: 0.27
Nodes (14): ModuleReference, boundaryViolations(), calledNames(), codeFingerprints(), declaredNames(), eachNode(), lineOf(), literalText() (+6 more)

### Community 206 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 207 - "stats-module.ts"
Cohesion: 0.26
Nodes (11): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+3 more)

### Community 21 - "sweep-tapes.ts"
Cohesion: 0.04
Nodes (106): CoreLedgerStateOptions, RefcountCheck, RefcountFault, NodeBatch, FixtureRun, FixtureRunOptions, FaultRun, Block (+98 more)

### Community 212 - ".head"
Cohesion: 0.32
Nodes (9): Writer, encodeGeneric(), encodeOne(), enter(), pushArray(), pushMap(), utf8Of(), writeBytes() (+1 more)

### Community 213 - "connectChannel"
Cohesion: 0.30
Nodes (6): SubscriptionCarrier, SubscriptionConnection, exceedsUtf8(), connectChannel(), errorMessage(), socketConnection()

### Community 214 - "chain-events-source.test.ts"
Cohesion: 0.19
Nodes (7): NodeCallOptions, RecordingClient, open(), quiet(), chain, closing, SYSTEM_EVENTS_STORAGE

### Community 216 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 217 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 22 - "Process"
Cohesion: 0.04
Nodes (30): ConfigFacts, NetworkShown, ProcessAdmin, ProcessAdminOptions, NodeFacts, redactor, CoreChannels, CoreLink (+22 more)

### Community 221 - "ws-mutual-tls.test.ts"
Cohesion: 0.21
Nodes (8): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), read(), tlsClientErrors

### Community 222 - "refcount-checks.ts"
Cohesion: 0.35
Nodes (12): Reach, closureProblems(), fixtureProblems(), fixtureReach(), leakProblems(), reachIn(), reachProblems(), referenceCounts() (+4 more)

### Community 227 - "component-table.test.ts"
Cohesion: 0.17
Nodes (8): DesignTable, RowCoverage, rule(), typeScriptFiles(), OPENERS, ROWS, SUITE, REPOSITORY

### Community 23 - "refused-configuration.test.ts"
Cohesion: 0.04
Nodes (83): CommandHandler, CommandIo, MainProcess, EngineConfig, Refusal, Start, CommandResult, Renamed (+75 more)

### Community 235 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.20
Nodes (10): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+2 more)

### Community 238 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 24 - "ref_node_fs"
Cohesion: 0.06
Nodes (70): BackupBackend, killedRestore, TickerHandle, TickerProcess, WORKER, SignalEvent, WorkerSignals, cliProject (+62 more)

### Community 249 - "extrinsics.ts"
Cohesion: 0.27
Nodes (8): ExtrinsicCall, MetadataPallet, callOf(), callVariants(), decodeExtrinsic(), decodeExtrinsics(), isCompactU64(), TIMESTAMP

### Community 25 - "admin/configuration.ts"
Cohesion: 0.04
Nodes (88): AllowedDetail, RevisionSettings, EntryView, SanitizedError, ImportedConfig, PlainArray, plainData, PlainDataNode (+80 more)

### Community 250 - "pageBench"
Cohesion: 0.31
Nodes (6): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage()

### Community 258 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 26 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (83): ApplyOutput, Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerAnswer, AdapterWorkerHost (+75 more)

### Community 27 - "core-ledger-state/sql.ts"
Cohesion: 0.03
Nodes (85): NodeSetFault, NodeSetOptions, NodeTableCheck, KeyCounts, RefcountStatement, StateRow, StoredState, GreyView (+77 more)

### Community 276 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 278 - "node-run.ts"
Cohesion: 0.47
Nodes (5): NodeRunResult, withDevelopmentOptIn(), hex(), nodeRun(), PATIENCE_MS

### Community 28 - "range.ts"
Cohesion: 0.04
Nodes (85): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+77 more)

### Community 29 - "mounted-admin.test.ts"
Cohesion: 0.05
Nodes (73): gate, SecretHashes, SecretVariant, Compared, ConnectSeen, PortPeer, Expected, SubscriptionSeen (+65 more)

### Community 3 - "opt-out.test.ts"
Cohesion: 0.03
Nodes (130): CaptureColumn, CapturedTable, CaptureState, CheckedMigration, CanonicalEncodingError, ContentOptions, TableContent, ChangeKind (+122 more)

### Community 30 - "runner/process.ts"
Cohesion: 0.03
Nodes (69): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait, WaitingListener, RetryCode, PauseBy (+61 more)

### Community 31 - "in-memory-source.ts"
Cohesion: 0.04
Nodes (57): UmbraDBHandle, InMemoryItems, Wait, CloseHelper, ChannelCoreOptions, Hold, Signal, Job (+49 more)

### Community 32 - "ref_node_timers"
Cohesion: 0.04
Nodes (64): ReadOnlyDatabase, Committed, Message, MessageFault, MessageType, Ended, rawClient, Escape (+56 more)

### Community 33 - "resolve.ts"
Cohesion: 0.04
Nodes (82): CoreChainFacts, RestoreBase, CommandBuildOptions, CheckState, ConfigCheckOptions, ProcessSide, HistoryInput, CheckedConfig (+74 more)

### Community 338 - "HeightActivity"
Cohesion: 0.60
Nodes (3): HeightActivity, NeverClears, NeverClears

### Community 339 - "restore-kill.worker.ts"
Cohesion: 0.40
Nodes (3): RestoreJob, job, orphanGuard

### Community 34 - "adapter.ts"
Cohesion: 0.04
Nodes (67): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+59 more)

### Community 35 - "zod"
Cohesion: 0.05
Nodes (63): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+55 more)

### Community 36 - "FinalizedLoop"
Cohesion: 0.05
Nodes (22): FinalizedLoop, LoopObserver, UnexpectedCursor, Startup, SkipsLockstep, WaitingInRead, ItemsAfterWrite, SilentHalt (+14 more)

### Community 37 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (73): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser (+65 more)

### Community 38 - "core-private-source.ts"
Cohesion: 0.05
Nodes (56): PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision, StartHashes (+48 more)

### Community 39 - "db/backends.ts"
Cohesion: 0.04
Nodes (50): ConfiguredDatabaseOptions, ConfiguredDatabaseOptions, CommittedHeight, Settings, TestBackend, Case, LoadOutcome, OutsideRead (+42 more)

### Community 4 - "startUmbraDB"
Cohesion: 0.02
Nodes (143): UmbraDBStarted, GoneCwdResult, join(), normalize(), resolve(), text(), transportReader(), transportReaderRule() (+135 more)

### Community 40 - "client.ts"
Cohesion: 0.06
Nodes (58): Connection, Pending, State, Subscription, Waiter, NodeRuntimeVersion, connectionFailure, NodeCallMethod (+50 more)

### Community 41 - "declaration.ts"
Cohesion: 0.05
Nodes (55): UmbraConfig, BlockWriteHandle, OwnPart, SchemaTable, ContentFunction, cursorTable, CursorTableOptions, heightVersionedTable (+47 more)

### Community 42 - "host.ts"
Cohesion: 0.05
Nodes (60): LoadLedger, LedgerName, LedgerPackageOptions, AppliedState, ApplyBlock, BlockId, EngineHolding, GenesisBlock (+52 more)

### Community 43 - "loop-stop-harness.ts"
Cohesion: 0.05
Nodes (55): ChainCheck, ChainCheckInput, ChainIdentity, FinalityStallCondition, EngineOptions, SignalTarget, HookedSource, PlainSubclass (+47 more)

### Community 44 - "restore-ledger.ts"
Cohesion: 0.05
Nodes (63): BackupSeams, RestoreSeams, BackupOutcome, CommandConfig, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome (+55 more)

### Community 45 - "vitest"
Cohesion: 0.03
Nodes (49): Lockfile, Manifest, Upstream, Leftover, RemovedName, ReportedTest, gateAdapters(), tallyMutants() (+41 more)

### Community 46 - "NodeBlockSource"
Cohesion: 0.06
Nodes (26): BlockItemSource, CoreBlockItems, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeSubscription, NodeBlock (+18 more)

### Community 47 - "chain-process.test.ts"
Cohesion: 0.04
Nodes (53): BackupWritten, ProcessHandle, Job, WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation (+45 more)

### Community 48 - "refcount-model.ts"
Cohesion: 0.06
Nodes (42): Node, BlockKind, BlockScript, BoundaryRewrite, Dice, DrivenBlock, GeneratedBlock, GeneratedState (+34 more)

### Community 49 - "version-checks.ts"
Cohesion: 0.07
Nodes (47): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, builtInNetwork, LedgerTable, Boundary, CallRecord (+39 more)

### Community 5 - "process-backends.ts"
Cohesion: 0.03
Nodes (129): RetainedState, Restored, itemsSeen, ingest, SourceClass, watched, Fault, SeenLoad (+121 more)

### Community 50 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (59): LedgerStateItem, retainedStates, CoreRevision, ContractKeys, boundLedgerParser(), workerParser(), applyBlock(), boundLedger() (+51 more)

### Community 51 - "intake.test.ts"
Cohesion: 0.06
Nodes (49): PrivateProcess, PrivateSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation, A116Observation (+41 more)

### Community 53 - "digests.test.ts"
Cohesion: 0.05
Nodes (63): TableDigest, TableDigestRow, TouchedRow, Chain, ChainOptions, DigestRow, capturedOf(), digestBlock() (+55 more)

### Community 54 - "spawnChild"
Cohesion: 0.04
Nodes (57): ParentJob, Kill, Orphaned, SourceFile, LockResult, GateRun, Pids, QuietRun (+49 more)

### Community 56 - "core-block-commit.test.ts"
Cohesion: 0.05
Nodes (56): BlockRow, StandInOptions, Commit, AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock(), hex() (+48 more)

### Community 57 - "LedgerPackage"
Cohesion: 0.08
Nodes (25): LedgerPackage, StateHandle, EvictionRefused, LedgerEngine, LedgerTaskFailed, stagenetReplay, withLedgerTaskPoints(), hexOf() (+17 more)

### Community 58 - "backup/backup.ts"
Cohesion: 0.07
Nodes (58): BackupInput, BackupTarget, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool, DumpInput (+50 more)

### Community 59 - "configured.ts"
Cohesion: 0.06
Nodes (52): commandTarget, ReadDatabaseOptions, ConfiguredDatabase, databaseTarget, CreatedDirectory, EmitWarning, Held, PgliteLockUse (+44 more)

### Community 6 - "config/history.ts"
Cohesion: 0.03
Nodes (136): OpenedConfig, OpenedFacts, ConfigRow, CoreVersion, CoreSettings, versionEntry, ConfigHashRow, HistoryCheck (+128 more)

### Community 61 - "contract-data-checks.ts"
Cohesion: 0.08
Nodes (57): CoreContractStatesOptions, ContractStateRow, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+49 more)

### Community 62 - "private/lockstep-wait.test.ts"
Cohesion: 0.06
Nodes (44): LockstepCondition, Report, OpenTransaction, A118Observation, MismatchObservation, ExpectedWait, WaitSample, HeldLink (+36 more)

### Community 63 - "backup/restore.ts"
Cohesion: 0.06
Nodes (49): PublicIdentity, Checked, PublicSide, RestoreChain, RestoreInput, RestoreTarget, BackupText, createReadStream() (+41 more)

### Community 64 - "containers.test.ts"
Cohesion: 0.05
Nodes (46): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, TlsPostgres, RepositoryFile, guardContainers(), removeAttempt() (+38 more)

### Community 65 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (50): BlockEventSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+42 more)

### Community 66 - "pause-fixtures.ts"
Cohesion: 0.07
Nodes (41): backupSignalRelay, BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable, PausableOptions, RecorderGlobals (+33 more)

### Community 67 - ".from"
Cohesion: 0.04
Nodes (48): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+40 more)

### Community 69 - "BACKENDS"
Cohesion: 0.06
Nodes (45): Run, Job, WorkerEvent, Report, Outcome, applied(), hex(), key() (+37 more)

### Community 7 - "builds.ts"
Cohesion: 0.03
Nodes (110): AdminStarter, PrivateIntakeOptions, DatabaseParts, PgliteMemoryParts, PglitePathParts, PostgresParts, PostgresPartsInput, EngineInput (+102 more)

### Community 71 - "start-umbradb.ts"
Cohesion: 0.08
Nodes (54): HistoryFinding, Finding, readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork (+46 more)

### Community 72 - "PgTransactionHistoryStorage"
Cohesion: 0.07
Nodes (32): MergeEntriesFn, TransactionHistoryEntry, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, encodeStoredEntry(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema (+24 more)

### Community 73 - "transport-faults.test.ts"
Cohesion: 0.06
Nodes (34): PrivateLinkAddress, Connected, CoreTransport, CoreTransportOptions, CoreSessionOptions, coreSessions, LinkConnection, LinkSession (+26 more)

### Community 74 - "order.property.test.ts"
Cohesion: 0.06
Nodes (45): PointName, CallbackFailure, PointRun, Activity, Misuse, SlowBlockCondition, CrashOptions, CallEvent (+37 more)

### Community 75 - "LedgerHost"
Cohesion: 0.07
Nodes (31): LedgerHost, LedgerWorkerFailure, NodeDatabase, NodeReader, PackageStartup, isEvictionRefused(), errorOf(), heightOf() (+23 more)

### Community 76 - "core-config.test.ts"
Cohesion: 0.07
Nodes (30): contentsHash, StatusFacts, ChainBuildOptions, validateDeclarations(), chainBackbone(), blockContext(), checked(), refusal() (+22 more)

### Community 77 - "api-socket.ts"
Cohesion: 0.09
Nodes (47): coreHeaders, NodeHttpHandler, NodeUpgradeHandler, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules (+39 more)

### Community 78 - "ledger-sweep.test.ts"
Cohesion: 0.06
Nodes (34): GreyPicker, SweepState, SweepTables, SweepWrites, MemoryTables, ModelSnapshot, hexOf(), merged() (+26 more)

### Community 8 - "admin-harness.ts"
Cohesion: 0.03
Nodes (132): AdminRun, Answered, Answerer, Expected, Hold, Observation, Prober, ProbeRecord (+124 more)

### Community 80 - "transform-checks.ts"
Cohesion: 0.10
Nodes (32): TransformError, SubscriptionId, NotificationRange, baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape(), expectVariantOutput() (+24 more)

### Community 81 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+40 more)

### Community 82 - "resolver-boundary.ts"
Cohesion: 0.07
Nodes (41): TypeCheckFinding, TypeCheckResult, Finding, Access, AllowedRead, Boundary, Crossing, Guard (+33 more)

### Community 83 - "private-transport.ts"
Cohesion: 0.08
Nodes (21): HelloAck, JsonValue, ReadResult, StatementResult, CarrierConnection, Pending, PrivateCarrier, PrivateTransport (+13 more)

### Community 85 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (37): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+29 more)

### Community 86 - "ledger-tasks-checks.ts"
Cohesion: 0.08
Nodes (37): Call, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, plainWatchModule(), tasksScenario() (+29 more)

### Community 87 - "height-versioned.test.ts"
Cohesion: 0.06
Nodes (36): CursorValue, cursorDatabase, Access, Block, BlockFails, Counts, Write, BlockFails (+28 more)

### Community 88 - "surface.test.ts"
Cohesion: 0.07
Nodes (45): Document, EntryInput, Renamed, Surface, SurfaceAmendment, changelogEntryProblems(), entryTerms(), namesWord() (+37 more)

### Community 89 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 9 - "src/db/postgres.ts"
Cohesion: 0.03
Nodes (117): SslMode, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, driverConnectionOptions, DriverError (+109 more)

### Community 91 - "mapping.ts"
Cohesion: 0.08
Nodes (33): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+25 more)

### Community 92 - "networks.ts"
Cohesion: 0.07
Nodes (44): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, ConfiguredLedgerTable (+36 more)

### Community 93 - "validation.ts"
Cohesion: 0.08
Nodes (36): PlacedDeclaration, Plain, Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject() (+28 more)

### Community 95 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (31): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+23 more)

### Community 96 - "ChannelEndpoint"
Cohesion: 0.08
Nodes (16): ChannelEndpoint, EndpointEvents, CarrierEvents, controlEnvelope(), messageEnvelope(), discard(), isChannel(), 00068 — Two readers of a host's channel beside the private link's endpoint read its members outside a guard (+8 more)

### Community 98 - "config-check.ts"
Cohesion: 0.07
Nodes (36): CheckFinding, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, LoadedConfig (+28 more)

### Community 99 - "BlockRef"
Cohesion: 0.07
Nodes (18): BlockLedgerSource, QueuedBlock, LedgerBinding, BlockItems, BlockRef, InMemorySourceOptions, EventsRunner, Fetching (+10 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+27 more)

### Community 263 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 284 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 52 - "refused"
Cohesion: 0.04
Nodes (66): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+58 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 104 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (12): height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), identity(), PUBLIC_POLL_MS (+4 more)

### Community 112 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 136 - ".slowBlockMs"
Cohesion: 0.08
Nodes (26): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+18 more)

### Community 147 - "boundary.test.ts"
Cohesion: 0.13
Nodes (22): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+14 more)

### Community 173 - "T"
Cohesion: 0.10
Nodes (21): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 0. Schema (+13 more)

### Community 200 - ".disconnect"
Cohesion: 0.16
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 202 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 215 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 224 - "openssl"
Cohesion: 0.20
Nodes (11): locked(), openssl(), 6. Nix — nixpkgs packages (from the locked nixpkgs), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known (+3 more)

### Community 225 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 239 - "shiftedSource"
Cohesion: 0.47
Nodes (4): failingSource(), lookalike(), shiftedSource(), flakySource()

### Community 256 - "Requirement: BK-1 Backup"
Cohesion: 0.22
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 266 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 267 - "backupAtStop"
Cohesion: 0.38
Nodes (7): backupAtStop(), A backup at the core's stop, A backup of a running process (SIGUSR2), Backups, Restoring a backup, What a backup holds, Writing a backup

### Community 282 - "parseJsonLossless"
Cohesion: 0.40
Nodes (5): parseJsonLossless(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 287 - "v9"
Cohesion: 0.47
Nodes (5): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 341 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 342 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 343 - "package-keys-walk.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 355 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 55 - "version"
Cohesion: 0.03
Nodes (69): deferred(), version(), Engineering rules, 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2 (+61 more)

### Community 60 - "history"
Cohesion: 0.04
Nodes (60): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+52 more)

### Community 68 - ".put"
Cohesion: 0.04
Nodes (52): coreBlockFetchOnFetch(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+44 more)

### Community 70 - "data"
Cohesion: 0.04
Nodes (58): params(), n(), data(), 7. The module API, 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8), 2.3 Invariants, 2.4 Migrations: one per part (O-2) (+50 more)

### Community 79 - "table"
Cohesion: 0.05
Nodes (49): side(), migrations(), table(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 13. Providing items to other modules, 14. Private modules, 15. Migrations (+41 more)

### Community 84 - ".off"
Cohesion: 0.04
Nodes (46): Durability, 0. Baseline and decisions, 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate) (+38 more)

### Community 90 - "code"
Cohesion: 0.05
Nodes (44): code(), Added, Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true) (+36 more)

### Community 94 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.10
Nodes (28): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed(), ledgerV8NodeEntry() (+20 more)

### Community 102 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 110 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+30 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 160 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 162 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (25): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+17 more)

### Community 164 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 169 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+15 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 179 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 180 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 181 - "package.json"
Cohesion: 0.09
Nodes (21): bugs, url, description, exports, files, homepage, license, main (+13 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 186 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 189 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 190 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 191 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 193 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 194 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 196 - "Requirement: BK-1 Backup"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row (+7 more)

### Community 201 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 208 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 209 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 210 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 218 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 219 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 220 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 223 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 226 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 229 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 230 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 231 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 232 - "README.md"
Cohesion: 0.29
Nodes (3): Choosing a database, Launching it, stats-module

### Community 233 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 234 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 236 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 237 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 240 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 241 - "ROADMAP.md"
Cohesion: 0.20
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 242 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 243 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 244 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 245 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 246 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 247 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 248 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 251 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 252 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 253 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 254 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 255 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 257 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 259 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 260 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 261 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 262 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 264 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 265 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 268 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 269 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 270 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 271 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 272 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 273 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 274 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 275 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 277 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 280 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 281 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 283 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 285 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 286 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
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

### Community 291 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 292 - "Proposal — Sprint 2: Transaction/Lease"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease, What changes, Why

### Community 293 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

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

### Community 300 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 301 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 302 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 303 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 304 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 305 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 306 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 307 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 308 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 309 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 310 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 311 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 312 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 313 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 314 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 315 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 316 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 317 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 318 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 319 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 320 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 321 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 322 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 323 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 324 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 325 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 326 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 327 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 328 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 329 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 330 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 331 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 332 - "00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream)"
Cohesion: 0.40
Nodes (4): 00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream), Evidence, Problem, Suggested fix (upstream; the ledger team's choice)

### Community 333 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 334 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 335 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 336 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.40
Nodes (4): 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), 14. External claims and their evidence, 15. Relation to the existing design documents, Design — CORE-ARCH: the standalone indexer's core architecture

### Community 337 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 344 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 345 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 346 - "00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes"
Cohesion: 0.50
Nodes (3): 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes, Evidence, Suggested fix

### Community 347 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 348 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 349 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 350 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 351 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 352 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 353 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 358 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 359 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 97 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

## Knowledge Gaps
- **58 isolated node(s):** `RFC-3339`, `RFC-6455`, `RFC-9110`, `RFC-3339`, `RFC-3339` (+53 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4296 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `Database`, `loop.test.ts`, `client.test.ts`, `opt-out.test.ts`, `startUmbraDB`, `process-backends.ts`, `config/history.ts`, `builds.ts`, `admin-harness.ts`, `src/db/postgres.ts`, `UmbraError`, `InMemoryBlockSource`, `process-admin.ts`, `tape/index.ts`, `entries.ts`, `core-transport.ts`, `column-rules.ts`, `hex`, `builder.test.ts`, `ledger-tapes.ts`, `fetch-fixtures.ts`, `sweep-tapes.ts`, `refused-configuration.test.ts`, `ref_node_fs`, `admin/configuration.ts`, `adapter-fixtures.ts`, `core-ledger-state/sql.ts`, `range.ts`, `mounted-admin.test.ts`, `runner/process.ts`, `in-memory-source.ts`, `ref_node_timers`, `resolve.ts`, `adapter.ts`, `zod`, `core-block-parsed.ts`, `core-private-source.ts`, `db/backends.ts`, `client.ts`, `declaration.ts`, `host.ts`, `loop-stop-harness.ts`, `restore-ledger.ts`, `chain-process.test.ts`, `refcount-model.ts`, `version-checks.ts`, `core-ledger-state.ts`, `intake.test.ts`, `digests.test.ts`, `spawnChild`, `core-block-commit.test.ts`, `LedgerPackage`, `backup/backup.ts`, `configured.ts`, `contract-data-checks.ts`, `private/lockstep-wait.test.ts`, `backup/restore.ts`, `containers.test.ts`, `slow-block-harness.ts`, `pause-fixtures.ts`, `.from`, `BACKENDS`, `transport-faults.test.ts`, `order.property.test.ts`, `LedgerHost`, `core-config.test.ts`, `ledger-sweep.test.ts`, `transform-checks.ts`, `resolver-boundary.ts`, `interfaces/transaction-history-storage.ts`, `ledger-tasks-checks.ts`, `height-versioned.test.ts`, `surface.test.ts`, `retirement.test.ts`, `mapping.ts`, `cold-boot-recovery.integration.test.ts`, `file-mode.test.ts`, `post-block-update-checks.ts`, `core-private-source.test.ts`, `ledger/load.ts`, `example-checks.ts`, `core.ts`, `Worker`, `pg-tx-history-adapter.ts`, `release-version.ts`, `api-server.test.ts`, `code-registry.ts`, `network.test.ts`, `node-set.test.ts`, `browser/build.ts`, `config-check-database.test.ts`, `browser.test.ts`, `checks.test.ts`, `test/postgres/setup.ts`, `ref_node_crypto`, `LoopPauses`, `documents.ts`, `postgres/transaction-history-storage.ts`, `worker-storage.test.ts`, `Lockstep`, `read-gate.ts`, `recovery.test.ts`, `chain-events-decode.test.ts`, `boundary.test.ts`, `node-bridge.ts`, `refcount-step.test.ts`, `height-versioned.property.test.ts`, `networks.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `validation.test.ts`, `cbor.property.test.ts`, `crash.test.ts`, `configuration-refusal.test.ts`, `api-session.test.ts`, `block-fetch-decode.test.ts`, `package.json`, `envelope.ts`, `excluded-not-exported.test.ts`, `module-api.test.ts`, `backbone/part-migrations.test.ts`, `statementsOf`, `config/plain-data.test.ts`, `cbor.test.ts`, `chain-events-source.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `ws-mutual-tls.test.ts`, `component-table.test.ts`, `ledger/plain-data.ts`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-6455`, `RFC-9110` to the rest of the system?**
  _58 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.0235482907896701 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `Database`, `loop.test.ts`, `client.test.ts`, `opt-out.test.ts`, `startUmbraDB`, `process-backends.ts`, `config/history.ts`, `builds.ts`, `admin-harness.ts`, `src/db/postgres.ts`, `InMemoryBlockSource`, `tape/index.ts`, `entries.ts`, `core-transport.ts`, `builder.test.ts`, `fetch-fixtures.ts`, `sweep-tapes.ts`, `Process`, `refused-configuration.test.ts`, `ref_node_fs`, `admin/configuration.ts`, `core-ledger-state/sql.ts`, `range.ts`, `mounted-admin.test.ts`, `runner/process.ts`, `in-memory-source.ts`, `resolve.ts`, `zod`, `FinalizedLoop`, `core-private-source.ts`, `db/backends.ts`, `client.ts`, `declaration.ts`, `restore-ledger.ts`, `vitest`, `NodeBlockSource`, `chain-process.test.ts`, `version-checks.ts`, `core-ledger-state.ts`, `version`, `core-block-commit.test.ts`, `LedgerPackage`, `backup/backup.ts`, `configured.ts`, `private/lockstep-wait.test.ts`, `backup/restore.ts`, `slow-block-harness.ts`, `pause-fixtures.ts`, `BACKENDS`, `start-umbradb.ts`, `transport-faults.test.ts`, `transform-checks.ts`, `graph.ts`, `private-transport.ts`, `ledger-tasks-checks.ts`, `height-versioned.test.ts`, `mapping.ts`, `networks.ts`, `validation.ts`, `config-check.ts`, `core-private-source.test.ts`, `validate.ts`, `api-server.test.ts`, `module-api.ts`, `NodeClient`, `cbor.ts`, `checks.test.ts`, `ref_node_crypto`, `fixtures/configuration.ts`, `ProcessContexts`, `refcount-step.test.ts`, `validation.test.ts`, `configuration-refusal.test.ts`, `envelope.ts`, `module-api.test.ts`, `backbone/part-migrations.test.ts`, `statementsOf`, `config/plain-data.test.ts`, `ApiRoutes`, `browser/src/config/load.ts`, `shiftedSource`, `backupAtStop`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `loop.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.022982036489845693 - nodes in this community are weakly interconnected._