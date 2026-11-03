# Graph Report - UmbraDB

## Corpus Check
- 1252 files · ~1,795,889 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13129 nodes · 40742 edges · 374 communities (339 shown, 35 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3419 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `7b7d9487f388ecdd` (1252 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- UmbraError
- builds.ts
- ingest-harness.ts
- backup/restore.ts
- openPostgres
- networks.ts
- test/postgres/setup.ts
- paused-harness.ts
- Worker
- node-fields-harness.ts
- childRefKeys
- refcount-tables.test.ts
- startup-stop-harness.ts
- release-version.ts
- adapter-fixtures.ts
- core.ts
- pglite-queue.test.ts
- cbor.property.test.ts
- browser/build.ts
- resolver-boundary.ts
- code-registry.ts
- version-checks.ts
- NodeBlockSource
- node-set.test.ts
- FinalizedLoop
- shims.test.ts
- ChannelEndpoint
- checks.test.ts
- sigterm.test.ts
- crash.test.ts
- PgliteDatabase
- refcount-step.test.ts
- LoopPauses
- documents.ts
- validate.ts
- UmbraDBHandle
- pg-tx-history-adapter.ts
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- recovery.test.ts
- mapping.ts
- validation.ts
- Lockstep
- vitest
- config/plain-data.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- restore-private.ts
- api-socket.ts
- .send
- surface.test.ts
- Writer
- tape/index.ts
- node-bridge.ts
- pack-install.mjs
- start-umbradb.test.ts
- browser-harness.ts
- demo-handlers.test.ts
- library-documents.test.ts
- NodeClient
- stop-heights.test.ts
- listening.test.ts
- BlockRef
- version-table.ts
- api-session.test.ts
- messagePortChannel
- connectChannel
- network.test.ts
- core-transport.ts
- api-session.ts
- QueueRunner
- node-key-tapes.ts
- ledger-table-config.test.ts
- describeNodeStoreExports
- client.test.ts
- statementsOf
- HeldHeight
- SubscriptionConnection
- quiet-host.child.ts
- web-lock.ts
- declaration.ts
- backup-fixtures.ts
- postgres-tls-server.ts
- core-block-fetch.test.ts
- Session
- no-indexer-or-wallet-sdk.test.ts
- browser/src/config/load.ts
- core-private-source.test.ts
- text.test.ts
- upgrade-boundary.test.ts
- stats-module.ts
- config-check.ts
- ws-mutual-tls.test.ts
- TapeAnswers
- startUmbraDB
- .#finalizedAt
- host.ts
- RuntimeMetadata
- ProcessItems
- pglite-directory-fixtures.ts
- zod
- Requirement: BK-1 Backup
- .read
- core-status.test.ts
- json-schema.ts
- mutation-evidence.d.mts
- EventsRunner
- TransportProxy
- runner/process.ts
- spawnChild
- pageBench
- core-block-parsed.ts
- chain-placement.test.ts
- hex
- resolve.ts
- chain-process.test.ts
- adapter.ts
- BlockLedgerSource
- NodeFS
- builder.test.ts
- Process
- process-backends.ts
- connectWebSocket
- InMemoryBlockSource
- graph.ts
- cli-fixtures.ts
- range.ts
- backup/backup.ts
- entries.ts
- library/modules.test.ts
- ledger/ledger-tasks.test.ts
- mounted-admin.test.ts
- messages.ts
- sweep-tapes.ts
- admin/configuration.ts
- pause-fixtures.ts
- contract-modules.test.ts
- core-ledger-state.ts
- contract-data-checks.ts
- refused-configuration.test.ts
- process-build.ts
- .from
- admin-harness.ts
- column-rules.ts
- ledger/types.ts
- private/lockstep-wait.test.ts
- transform-checks.ts
- PgTransactionHistoryStorage
- refcount-model.ts
- interfaces/transaction-history-storage.ts
- worker-host.test.ts
- height-versioned.test.ts
- opt-out.test.ts
- LedgerPackage
- validateDeclarations
- slow-block-harness.ts
- core-ledger-state/sql.ts
- src/config/load.ts
- cbor.ts
- column-rules.test.ts
- boundary.test.ts
- writer-lock-checks.ts
- ModuleDeclaration
- containers.test.ts
- checkShape
- retirement.test.ts
- ref_node_timers
- file-mode.test.ts
- ledger-sweep.test.ts
- start-umbradb.ts
- page.ts
- transaction-history-storage.property.test.ts
- src/db/postgres.ts
- config/history.ts
- pglite-lock.ts
- process-worker.ts
- .off
- cold-boot-recovery.integration.test.ts
- browser.test.ts
- real-tapes.ts
- history
- refused
- table
- .slowBlockMs
- T
- graph.py
- ADDED Requirements
- mapping.test.ts
- .disconnect
- mutation-per-adapter.mjs
- twox.ts
- openssl
- Boundaries, threats and controls
- scoped-review-manifest
- path.ts
- Requirement: BK-1 Backup
- test-processes.test.ts
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- .blockItems
- The laws of UmbraDB's storage helpers
- orphan-watcher.mjs
- fresh-instance.mjs
- package-keys-walk.mjs
- crash-worker.ts
- fs.ts
- version
- .put
- code
- ADDED Requirements
- .concat
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
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
- Proposal — Sprint 5: Lean M3a Watermarks W1
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
- 00023 — The blocks table's height partitions end at 5,000,000
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
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
- 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- bug-report.md
- feature-request.md
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- MODIFIED Requirements
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
1. `vitest` - 438 edges
2. `UmbraError` - 357 edges
3. `ModuleDeclaration` - 208 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 135 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `Database` - 104 edges
9. `startUmbraDB()` - 103 edges
10. `ReadHandle` - 96 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (374 total, 35 thin omitted)

### Community 0 - "UmbraError"
Cohesion: 0.02
Nodes (202): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, SslMode, CommittedHeight, Database (+194 more)

### Community 1 - "builds.ts"
Cohesion: 0.02
Nodes (170): AdminStarter, DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, A168RunOptions, TickerConfig, PausableConfig (+162 more)

### Community 10 - "ingest-harness.ts"
Cohesion: 0.04
Nodes (124): CrashEvent, CrashJob, ingest, SourceClass, watched, Call, SeenLoad, RestartEvent (+116 more)

### Community 102 - "backup/restore.ts"
Cohesion: 0.10
Nodes (35): PublicIdentity, Checked, PublicSide, RestoreChain, Restored, RestoreInput, RestoreTarget, isBlockLedgerSource() (+27 more)

### Community 103 - "openPostgres"
Cohesion: 0.10
Nodes (23): Phase, Job, openPostgres(), postgresBackend(), databaseAs(), postgresCliBackend(), postgresBackend(), connectionOfUrl() (+15 more)

### Community 104 - "networks.ts"
Cohesion: 0.06
Nodes (36): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+28 more)

### Community 105 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 107 - "paused-harness.ts"
Cohesion: 0.11
Nodes (31): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, a176Project() (+23 more)

### Community 108 - "Worker"
Cohesion: 0.07
Nodes (15): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+7 more)

### Community 11 - "node-fields-harness.ts"
Cohesion: 0.03
Nodes (112): NodeCallOptions, ProcessCondition, RecordingClient, A168Observation, A168Phase, Expected, GatedConnector, StatusReader (+104 more)

### Community 110 - "childRefKeys"
Cohesion: 0.08
Nodes (27): ChildReader, ChildVisitor, childRefKeys(), readChildList(), readChildren(), 0. Baseline and decisions, 10. The halt code (O-6), 12.1 Setup (+19 more)

### Community 111 - "refcount-tables.test.ts"
Cohesion: 0.07
Nodes (29): NodeSetFault, NodeSetOptions, NodeTableCheck, ContentDefinition, ContentDefinedBuildOptions, Tables, first(), hexOf() (+21 more)

### Community 114 - "startup-stop-harness.ts"
Cohesion: 0.11
Nodes (28): A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, StartVia, stopBy, StopHandle (+20 more)

### Community 119 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 12 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (113): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer, AdapterWorkerHost (+105 more)

### Community 120 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 121 - "pglite-queue.test.ts"
Cohesion: 0.10
Nodes (21): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, openPgliteOn(), pgliteCliBackend() (+13 more)

### Community 122 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 123 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 124 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 125 - "code-registry.ts"
Cohesion: 0.10
Nodes (30): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, changeTasks(), allTasks(), input() (+22 more)

### Community 127 - "version-checks.ts"
Cohesion: 0.10
Nodes (21): MetadataNode, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk, OwnStateMetadata (+13 more)

### Community 128 - "NodeBlockSource"
Cohesion: 0.09
Nodes (14): NodeBlockSource, SourceCondition, SourceNodeView, NoWindow, Refetches, TrustsNotifications, Opened, RootWithoutSignal (+6 more)

### Community 129 - "node-set.test.ts"
Cohesion: 0.08
Nodes (28): StoredRow, Tables, changedRow(), database(), databaseSql(), hexOf(), keyOf(), literal() (+20 more)

### Community 13 - "FinalizedLoop"
Cohesion: 0.03
Nodes (57): ResolvedRange, Callback, EntryBoundary, ParallelPoint, PointRun, PointSchedule, Activity, FinalizedLoop (+49 more)

### Community 130 - "shims.test.ts"
Cohesion: 0.10
Nodes (18): Buffer, BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText(), charCodes() (+10 more)

### Community 132 - "ChannelEndpoint"
Cohesion: 0.15
Nodes (6): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), 4. Channels

### Community 133 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+14 more)

### Community 134 - "sigterm.test.ts"
Cohesion: 0.10
Nodes (25): Job, WorkerEvent, WORKER, WorkEvent, WorkOptions, A48Observation, WORKER, Job (+17 more)

### Community 135 - "crash.test.ts"
Cohesion: 0.10
Nodes (25): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, SkipsStartAtRestart, WORKER, CrashJob (+17 more)

### Community 136 - "PgliteDatabase"
Cohesion: 0.13
Nodes (7): AsyncLocalStorage, AsyncResource, JobQueue, PgliteDatabase, handleClosed(), failedEarlier(), openOn()

### Community 137 - "refcount-step.test.ts"
Cohesion: 0.10
Nodes (22): ComputedBlock, refcountStep, RefcountTables, RefcountBatch, refcountModelStep, Given, Halt, Outcome (+14 more)

### Community 138 - "LoopPauses"
Cohesion: 0.08
Nodes (17): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, clock(), watched(), 1. Module layout, 2. Backend routing (the one non-obvious constraint) (+9 more)

### Community 139 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 14 - "validate.ts"
Cohesion: 0.03
Nodes (123): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, ImportedConfig, plainData (+115 more)

### Community 140 - "UmbraDBHandle"
Cohesion: 0.10
Nodes (24): MessagePortLike, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork, UmbraDBOptions (+16 more)

### Community 141 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 143 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.07
Nodes (27): GreyPicker, sweepReset(), 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents (+19 more)

### Community 144 - "recovery.test.ts"
Cohesion: 0.11
Nodes (20): Armed, CommitArm, CommitFault, CommitProxy, Pair, Fault, holds(), tailOf() (+12 more)

### Community 145 - "mapping.ts"
Cohesion: 0.13
Nodes (26): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+18 more)

### Community 147 - "validation.ts"
Cohesion: 0.08
Nodes (27): PlacedDeclaration, Plain, withNetwork(), body(), moded(), FIELD_KINDS, LIFETIMES, TABLE_KINDS (+19 more)

### Community 148 - "Lockstep"
Cohesion: 0.11
Nodes (11): InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal, byId() (+3 more)

### Community 15 - "vitest"
Cohesion: 0.03
Nodes (85): Served, Finding, Lockfile, Manifest, RepositoryFile, BlockImport, ChildResult, CodeBlock (+77 more)

### Community 150 - "config/plain-data.ts"
Cohesion: 0.11
Nodes (23): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, copyArray(), copyObject(), instanceOf() (+15 more)

### Community 151 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 152 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 153 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 154 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 155 - "restore-private.ts"
Cohesion: 0.16
Nodes (21): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+13 more)

### Community 156 - "api-socket.ts"
Cohesion: 0.17
Nodes (21): coreHeaders, StartedModuleApi, connectionRules, FetchHandler, ModuleApiLimits, ModuleApiHandlerOptions, moduleApiHandlers, ModuleApiServer (+13 more)

### Community 157 - ".send"
Cohesion: 0.14
Nodes (10): Cdp, ChromeBrowser, ChromeTab, chrome(), chrome(), chromePath(), exitsWithin(), launchChrome() (+2 more)

### Community 158 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 159 - "Writer"
Cohesion: 0.11
Nodes (11): ReadPool, Writer, rollBack(), Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes (+3 more)

### Community 16 - "tape/index.ts"
Cohesion: 0.04
Nodes (81): Boundary, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest, RequestId, Json (+73 more)

### Community 160 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 164 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 165 - "start-umbradb.test.ts"
Cohesion: 0.14
Nodes (16): ModuleListRule, GoneCwdResult, moduleListProblems(), closedByItself(), hostile(), optionProblems(), throwing(), problemsOf() (+8 more)

### Community 166 - "browser-harness.ts"
Cohesion: 0.17
Nodes (19): PageApiChannel, PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf() (+11 more)

### Community 167 - "demo-handlers.test.ts"
Cohesion: 0.15
Nodes (17): Compared, ConnectSeen, PortPeer, comparedOfExchange(), comparedOfResponse(), connected(), engineOf(), fetchProblems() (+9 more)

### Community 169 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 17 - "NodeClient"
Cohesion: 0.05
Nodes (78): FinalizedHeightOptions, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription, Waiter (+70 more)

### Community 170 - "stop-heights.test.ts"
Cohesion: 0.11
Nodes (15): ProcessingEnd, ProcessStatus, Q142Observation, A43Observation, Halt, Recorded, RecoveryObservation, StatusRead (+7 more)

### Community 171 - "listening.test.ts"
Cohesion: 0.13
Nodes (8): TestCertificates, until(), waitsForLockstep(), hostServer(), mountHandlers(), upgradeHead(), makeCertificates(), CONFIG_SCHEMA

### Community 172 - "BlockRef"
Cohesion: 0.16
Nodes (5): BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery

### Community 173 - "version-table.ts"
Cohesion: 0.18
Nodes (20): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+12 more)

### Community 174 - "api-session.test.ts"
Cohesion: 0.15
Nodes (17): HeadersArgument, LifecycleStatus, answerNotServing(), byteLength(), lifecycleBody(), lifecycleHeaders(), notServingResponse(), refuseChannelNotServing() (+9 more)

### Community 175 - "messagePortChannel"
Cohesion: 0.12
Nodes (17): demoLink, onLink(), messagePortChannel(), found(), ownKeys(), Rework (class 4), 4. Channels, 8. The browser demo on the engine (owner decision D-21) (+9 more)

### Community 176 - "connectChannel"
Cohesion: 0.16
Nodes (13): ServedConnection, discard(), isChannel(), connectChannel(), 00068 — Two readers of a host's channel beside the private link's endpoint read its members outside a guard, Evidence, Problem, Suggested fix (+5 more)

### Community 177 - "network.test.ts"
Cohesion: 0.22
Nodes (16): NetworkRuleName, Parsed, Expected, runProcess(), commandRun(), schemaCase(), commandRefusalProblems(), listeningSockets() (+8 more)

### Community 18 - "core-transport.ts"
Cohesion: 0.03
Nodes (75): PrivateLinkAddress, PublicSide, ResultColumn, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected (+67 more)

### Community 181 - "api-session.ts"
Cohesion: 0.16
Nodes (18): ChannelConnectOptions, isCoreHeader(), withCoreHeaders(), answerRequest(), bodyTooLarge(), fetchBody(), moduleApiFetch(), responseOf() (+10 more)

### Community 184 - "QueueRunner"
Cohesion: 0.27
Nodes (5): NodeHeader, PreparedBlock, QueueRunner, refOf(), sameBytes()

### Community 185 - "node-key-tapes.ts"
Cohesion: 0.19
Nodes (11): nodeKeys, NodeKeyTape, Written, hashNode(), checkTape(), devnetSettings(), nodeKeyTapeTest(), recording() (+3 more)

### Community 186 - "ledger-table-config.test.ts"
Cohesion: 0.27
Nodes (16): Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts(), haltOf() (+8 more)

### Community 188 - "describeNodeStoreExports"
Cohesion: 0.18
Nodes (4): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports()

### Community 19 - "client.test.ts"
Cohesion: 0.03
Nodes (62): Connection, NodeClientOptions, NodeSocket, NodeSocketEvents, NodeTimers, SocketFailure, IngestOptions, HandSocket (+54 more)

### Community 192 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 193 - "HeldHeight"
Cohesion: 0.16
Nodes (10): CommitOutcome, HeldHeight, Outcomes, AlwaysLanded, AlwaysLost, DropsHeld, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence (+2 more)

### Community 197 - "SubscriptionConnection"
Cohesion: 0.26
Nodes (6): SubscriptionCarrier, SubscriptionConnection, errorMessage(), socketConnection(), encodeJson(), hex()

### Community 198 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 199 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 2 - "declaration.ts"
Cohesion: 0.02
Nodes (140): UmbraConfig, BlockWriteHandle, ReadHandle, ReadOptions, SchemaWriteHandle, ErrorCode, ErrorDetails, cursorTable (+132 more)

### Community 20 - "backup-fixtures.ts"
Cohesion: 0.05
Nodes (81): FileEntries, BackupBackend, BackupDatabase, killedRestore, TickerHandle, FileRow, RestoreBuild, WORKER (+73 more)

### Community 203 - "postgres-tls-server.ts"
Cohesion: 0.22
Nodes (9): driverConnectionOptions, PostgresConnection, TlsPostgres, makeCertificates(), startTlsPostgres(), noHeight(), readError(), sessionSsl() (+1 more)

### Community 204 - "core-block-fetch.test.ts"
Cohesion: 0.15
Nodes (4): LedgerTable, coreBlockFetchOnFetch(), blockContext(), KNOWN_NETWORKS

### Community 205 - "Session"
Cohesion: 0.21
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 207 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 208 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 21 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (61): PrivateBlockSource, PrivateChecks, privateIntake, PrivateIntakeOptions, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision (+53 more)

### Community 212 - "text.test.ts"
Cohesion: 0.23
Nodes (6): BackupText, blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir

### Community 213 - "upgrade-boundary.test.ts"
Cohesion: 0.23
Nodes (11): A47Observation, CommitsTheBoundary, Version, a47Problems(), a47Run(), big(), buildOf(), moduleM() (+3 more)

### Community 218 - "stats-module.ts"
Cohesion: 0.32
Nodes (10): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+2 more)

### Community 22 - "config-check.ts"
Cohesion: 0.03
Nodes (92): RestoreSeams, BackupOutcome, CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckSeams (+84 more)

### Community 220 - "ws-mutual-tls.test.ts"
Cohesion: 0.23
Nodes (8): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), read(), tlsClientErrors

### Community 221 - "TapeAnswers"
Cohesion: 0.32
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 23 - "startUmbraDB"
Cohesion: 0.03
Nodes (101): UmbraDBStarted, backupAtStop(), text(), transportReader(), transportReaderRule(), startUmbraDB(), libraryCore(), readerOf() (+93 more)

### Community 24 - "host.ts"
Cohesion: 0.04
Nodes (74): LoadLedger, LedgerStateItem, RetainedState, LedgerName, ChainOutcome, LedgerPackageOptions, ParsedTransaction, AppliedState (+66 more)

### Community 240 - "RuntimeMetadata"
Cohesion: 0.27
Nodes (3): RuntimeMetadata, contentStateOf(), hexOf()

### Community 242 - "pglite-directory-fixtures.ts"
Cohesion: 0.29
Nodes (8): ProcessObservation, StartVia, committedIn(), processOn(), processProblems(), rowsIn(), S, control

### Community 25 - "zod"
Cohesion: 0.04
Nodes (84): EndpointOptions, Envelope, PrivateLinkChannel, EngineInput, controlledTimers, PeerEnd, PeerMessage, rawPeer (+76 more)

### Community 256 - "Requirement: BK-1 Backup"
Cohesion: 0.25
Nodes (7): BackupWritten, 15. Backups and browser, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`

### Community 26 - ".read"
Cohesion: 0.03
Nodes (96): TableDigest, TableDigestRow, CapturedTable, ChangeKind, tableChanges, TouchedRow, DigestRow, Op (+88 more)

### Community 27 - "core-status.test.ts"
Cohesion: 0.04
Nodes (79): NetworkShown, AdminSeams, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, AdminServer, AdminStartOptions, DigestRow (+71 more)

### Community 271 - "json-schema.ts"
Cohesion: 0.33
Nodes (5): Validator, schemaFile(), text(), validatorOf(), ajv

### Community 272 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 28 - "runner/process.ts"
Cohesion: 0.03
Nodes (76): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait, WaitingListener, ConfigRow, ConfigHashRow (+68 more)

### Community 29 - "spawnChild"
Cohesion: 0.03
Nodes (80): CdpEvent, Download, ParentJob, Kill, Orphaned, SourceFile, Run, Job (+72 more)

### Community 293 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 3 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (150): BlockHeaderItem, BlockEventSource, BodyExtrinsic, ExtrinsicCall, BlockBody, CoreBlockHeader, CoreBlockItems, MetadataField (+142 more)

### Community 30 - "chain-placement.test.ts"
Cohesion: 0.05
Nodes (87): BlockSpec, EventSpec, Scenario, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase (+79 more)

### Community 31 - "hex"
Cohesion: 0.05
Nodes (79): FreshInstanceRequest, FreshInstanceResult, StoredNode, Reader, GenesisNodes, NodeBatch, byReference, KeyOf (+71 more)

### Community 32 - "resolve.ts"
Cohesion: 0.04
Nodes (88): ConfigFacts, CoreChainFacts, RestoreBase, CommandBuildOptions, CheckState, ConfigCheckOptions, ProcessSide, HistoryInput (+80 more)

### Community 33 - "chain-process.test.ts"
Cohesion: 0.04
Nodes (70): BlockRow, InMemoryItems, Wait, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation (+62 more)

### Community 34 - "adapter.ts"
Cohesion: 0.04
Nodes (72): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+64 more)

### Community 35 - "builder.test.ts"
Cohesion: 0.04
Nodes (47): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Metadata, Step, Frame (+39 more)

### Community 37 - "Process"
Cohesion: 0.05
Nodes (27): RetryCode, PauseHold, LibraryChecks, Process, RetryCondition, SignalTarget, Resolved, configurationFindings() (+19 more)

### Community 38 - "process-backends.ts"
Cohesion: 0.05
Nodes (63): Fault, FaultRun, TasksRun, taskSeen, ChangedFile, GenesisFixture, installationCopy, PackageStartup (+55 more)

### Community 39 - "connectWebSocket"
Cohesion: 0.04
Nodes (50): Script, ScriptedNode, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, TapeCommandIo (+42 more)

### Community 4 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (134): ReadOnlyDatabase, Transaction, EntryRange, GraphInput, InMemoryBlockSource, LockstepWait, LoopEnd, SlowBlockEvent (+126 more)

### Community 40 - "graph.ts"
Cohesion: 0.04
Nodes (78): Edge, GraphFacts, GraphPart, GraphRule, HeightRange, MidChain, Missing, RangeCheck (+70 more)

### Community 41 - "cli-fixtures.ts"
Cohesion: 0.05
Nodes (56): ConfigCheckReport, IgnoredJob, Renamed, RunningCommand, statsConfig, runArguments(), runProcessCommand(), runFailed() (+48 more)

### Community 42 - "range.ts"
Cohesion: 0.04
Nodes (56): NodeSubscription, ConnectSocket, Outage, Refusal, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link (+48 more)

### Community 43 - "backup/backup.ts"
Cohesion: 0.05
Nodes (68): BackupInput, BackupSeams, BackupTarget, BackupFacts, Manifest, ManifestMigration, ManifestTool, PgliteDump (+60 more)

### Community 44 - "entries.ts"
Cohesion: 0.03
Nodes (62): DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig (+54 more)

### Community 46 - "library/modules.test.ts"
Cohesion: 0.04
Nodes (43): CloseHelper, Hold, Signal, Job, Run, FaultedClose, QuietResult, Job (+35 more)

### Community 47 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.04
Nodes (57): Path, SlowStep, TestLoaderData, CallArgsItem, CallArguments, V9Raw, described(), differs() (+49 more)

### Community 48 - "mounted-admin.test.ts"
Cohesion: 0.04
Nodes (60): ApiRequest, ApiResponse, Answered, gate, Observation, SecretHashes, SecretVariant, Expected (+52 more)

### Community 49 - "messages.ts"
Cohesion: 0.04
Nodes (62): Committed, MessageFault, MessageType, Parsed, Read, readRefusal, ReadRefusalReason, refusedStatement (+54 more)

### Community 5 - "sweep-tapes.ts"
Cohesion: 0.03
Nodes (156): NodeBatch, FixtureRun, Touches, Cbor, DigestRow, DigestRows, Reader, FixtureConfig (+148 more)

### Community 50 - "admin/configuration.ts"
Cohesion: 0.05
Nodes (62): OpenedConfig, AllowedDetail, RevisionSettings, EntryView, RecordedView, SanitizedError, ChainIdentity, ManifestHistoryRow (+54 more)

### Community 51 - "pause-fixtures.ts"
Cohesion: 0.05
Nodes (58): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, StaysPaused (+50 more)

### Community 52 - "contract-modules.test.ts"
Cohesion: 0.06
Nodes (57): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+49 more)

### Community 53 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (58): CoreLedgerStateOptions, retainedStates, RefcountCheck, RefcountFault, CoreRevision, FixtureRunOptions, blockHeaderOf(), ledgerVersionOf() (+50 more)

### Community 54 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (62): CoreContractStatesOptions, ContractStateRow, DefinedModule, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+54 more)

### Community 55 - "refused-configuration.test.ts"
Cohesion: 0.07
Nodes (60): EngineConfig, ProcessHandle, Start, Refusal, Start, startProcess(), adminCore(), adminCoreSettings() (+52 more)

### Community 58 - "process-build.ts"
Cohesion: 0.07
Nodes (48): LoopStopScenario, CoreSeen, testBuild, TestProcessInput, A149Observation, A149Startup, Hold, Phase (+40 more)

### Community 59 - ".from"
Cohesion: 0.05
Nodes (62): BlockParsed, itemsSeen, Json, a91Problems(), a92Problems(), a93Problems(), parsedRows(), resultRows() (+54 more)

### Community 6 - "admin-harness.ts"
Cohesion: 0.03
Nodes (128): MountedAdminAnswer, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminEndpoint, AdminPart (+120 more)

### Community 60 - "column-rules.ts"
Cohesion: 0.04
Nodes (67): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+59 more)

### Community 61 - "ledger/types.ts"
Cohesion: 0.07
Nodes (51): AdapterSpec, ManifestLine, VerifyLedgerPackagesOptions, LedgerRelease, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, ApplyInput (+43 more)

### Community 63 - "private/lockstep-wait.test.ts"
Cohesion: 0.06
Nodes (44): LockstepCondition, Report, OpenTransaction, A118Observation, MismatchObservation, ExpectedWait, WaitSample, HeldLink (+36 more)

### Community 64 - "transform-checks.ts"
Cohesion: 0.08
Nodes (41): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, baseRecords() (+33 more)

### Community 65 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (54): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers (+46 more)

### Community 66 - "refcount-model.ts"
Cohesion: 0.07
Nodes (39): Node, BlockKind, BlockScript, BoundaryRewrite, Dice, DrivenBlock, GeneratedBlock, GeneratedState (+31 more)

### Community 67 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (42): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+34 more)

### Community 68 - "worker-host.test.ts"
Cohesion: 0.08
Nodes (24): LedgerTask, NodeStore, StoredNode, EngineOptions, LedgerEngine, LedgerTaskFailed, Nodes, hexOf() (+16 more)

### Community 69 - "height-versioned.test.ts"
Cohesion: 0.05
Nodes (46): TestBackend, TestDatabase, HeldRead, Job, Outcome, Reads, Step, BlockOptions (+38 more)

### Community 7 - "opt-out.test.ts"
Cohesion: 0.03
Nodes (114): DumpInput, CaptureColumn, CaptureState, CheckedMigration, SchemaTable, ContentDefinedTables, ContentFunction, ContentOptions (+106 more)

### Community 70 - "LedgerPackage"
Cohesion: 0.05
Nodes (36): LedgerPackage, StateHandle, Settled, Driver, StagenetBlockJson, StagenetFixtureJson, stagenetReplay, expectSmallStateReloadsByKey() (+28 more)

### Community 71 - "validateDeclarations"
Cohesion: 0.05
Nodes (42): DeclarationRule, NodeRunResult, Case, ShapeCase, Stats, schemaName(), migrationPart(), schemaItem() (+34 more)

### Community 72 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (49): BlockItemSource, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+41 more)

### Community 73 - "core-ledger-state/sql.ts"
Cohesion: 0.08
Nodes (49): KeyCounts, RefcountStatement, StateRow, StoredState, GreyView, SweepPhase, chunksOf(), invalid() (+41 more)

### Community 75 - "src/config/load.ts"
Cohesion: 0.05
Nodes (42): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, LoadOptions, BackupSignals, UserModulesSource (+34 more)

### Community 76 - "cbor.ts"
Cohesion: 0.07
Nodes (47): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+39 more)

### Community 77 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, DesignTable (+24 more)

### Community 78 - "boundary.test.ts"
Cohesion: 0.08
Nodes (45): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+37 more)

### Community 79 - "writer-lock-checks.ts"
Cohesion: 0.09
Nodes (39): WriterProcess, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf() (+31 more)

### Community 8 - "ModuleDeclaration"
Cohesion: 0.02
Nodes (110): OpenedFacts, QueuedBlock, ChainCheck, ChainCheckInput, ModuleDeclaration, PointName, ProcessContext, Revision (+102 more)

### Community 80 - "containers.test.ts"
Cohesion: 0.06
Nodes (36): BenchEnv, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer() (+28 more)

### Community 81 - "checkShape"
Cohesion: 0.07
Nodes (40): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+32 more)

### Community 82 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 83 - "ref_node_timers"
Cohesion: 0.08
Nodes (27): Message, Ended, rawClient, Escape, Refused, mutualTlsOptions(), endedWithin(), hello() (+19 more)

### Community 84 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (31): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+23 more)

### Community 85 - "ledger-sweep.test.ts"
Cohesion: 0.08
Nodes (24): SweepState, SweepTables, SweepWrites, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel (+16 more)

### Community 86 - "start-umbradb.ts"
Cohesion: 0.10
Nodes (41): Finding, readOptions, addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding(), guarded() (+33 more)

### Community 87 - "page.ts"
Cohesion: 0.06
Nodes (33): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+25 more)

### Community 88 - "transaction-history-storage.property.test.ts"
Cohesion: 0.07
Nodes (22): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, ReplayableStorage, capitalize(), abortErrorLike(), capitalize(), applyCommand(), replay() (+14 more)

### Community 89 - "src/db/postgres.ts"
Cohesion: 0.08
Nodes (37): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, DriverError, Outcome, PostgresOptions (+29 more)

### Community 9 - "config/history.ts"
Cohesion: 0.03
Nodes (131): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, ConfiguredDatabase, ConfiguredDatabaseOptions, CoreSettings, versionEntry, HistoryCheck (+123 more)

### Community 90 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (33): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, ChildResult (+25 more)

### Community 92 - "process-worker.ts"
Cohesion: 0.08
Nodes (30): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, Scope, crossedError, FromProcessWorker, StartRun (+22 more)

### Community 93 - ".off"
Cohesion: 0.05
Nodes (39): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+31 more)

### Community 95 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 97 - "browser.test.ts"
Cohesion: 0.07
Nodes (38): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, PageRequest, heldClock (+30 more)

### Community 98 - "real-tapes.ts"
Cohesion: 0.08
Nodes (35): FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+27 more)

### Community 36 - "history"
Cohesion: 0.03
Nodes (85): history(), n(), data(), 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8), 2.3 Invariants, 2.4 Migrations: one per part (O-2), 2.5 Content-based determinism (O-8; DT-3, DT-4) (+77 more)

### Community 45 - "refused"
Cohesion: 0.03
Nodes (70): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+62 more)

### Community 62 - "table"
Cohesion: 0.03
Nodes (61): side(), params(), migrations(), table(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix (+53 more)

### Community 100 - ".slowBlockMs"
Cohesion: 0.06
Nodes (34): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+26 more)

### Community 101 - "T"
Cohesion: 0.05
Nodes (39): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+31 more)

### Community 115 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 163 - "mapping.test.ts"
Cohesion: 0.11
Nodes (11): mapRows(), mapValue(), parseJsonLossless(), oid(), identity(), RESULT_COLUMNS, RFC-3339, 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug (+3 more)

### Community 194 - ".disconnect"
Cohesion: 0.16
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 196 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 206 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 216 - "openssl"
Cohesion: 0.20
Nodes (11): locked(), openssl(), 6. Nix — nixpkgs packages (from the locked nixpkgs), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known (+3 more)

### Community 217 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 230 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 243 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 248 - "Requirement: BK-1 Backup"
Cohesion: 0.22
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 250 - "test-processes.test.ts"
Cohesion: 0.28
Nodes (7): namesRunner(), runnerStarts(), sources(), valueNames(), REPOSITORY, RUNNER, TESTS

### Community 252 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 263 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.33
Nodes (6): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers

### Community 291 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 332 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 333 - "package-keys-walk.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 345 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 56 - "version"
Cohesion: 0.03
Nodes (69): deferred(), version(), Engineering rules, 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2 (+61 more)

### Community 57 - ".put"
Cohesion: 0.03
Nodes (63): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+55 more)

### Community 74 - "code"
Cohesion: 0.04
Nodes (55): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+47 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 99 - ".concat"
Cohesion: 0.05
Nodes (37): probe(), records, 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6) (+29 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 109 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning (+30 more)

### Community 113 - "package.json"
Cohesion: 0.05
Nodes (38): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+30 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 131 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 161 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 162 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 168 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 179 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 182 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 183 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 187 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 189 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 190 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Requirement: LM-8 An in-memory block source (+8 more)

### Community 191 - "devDependencies"
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

### Community 209 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 210 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 211 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 214 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 215 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 219 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 222 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 223 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 224 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 225 - "README.md"
Cohesion: 0.29
Nodes (3): Choosing a database, Launching it, stats-module

### Community 226 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 227 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 228 - "Requirement: DT-3 The contents hash"
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

### Community 244 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 245 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 246 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 247 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 249 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 251 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 253 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 254 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 255 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 257 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 258 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 260 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 261 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 262 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 264 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 265 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 266 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 267 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 268 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 269 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 270 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 273 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 276 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 277 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 278 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 279 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 280 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 281 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 282 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 283 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 284 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 285 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 286 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 287 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 288 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 289 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 290 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 292 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 294 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 295 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 296 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 297 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 298 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 299 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 300 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 301 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 302 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 303 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 304 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 305 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 306 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 307 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 308 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 309 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 310 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.40
Nodes (4): 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 311 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 312 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 313 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 314 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 315 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 316 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 317 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 318 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 319 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 320 - "00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail"
Cohesion: 0.40
Nodes (4): 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail, Evidence, Problem, Suggested fix

### Community 321 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 322 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 323 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 324 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 325 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 326 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 327 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 328 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 329 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 330 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.40
Nodes (4): 11. Chain data, 18. Whole-system faults, differentials and measurements, 19. Close-out, Tasks — CORE-ARCH: the standalone indexer's core architecture

### Community 331 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 334 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 335 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 336 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 337 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 338 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 339 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 340 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 341 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 342 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 343 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4317 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `UmbraError`, `builds.ts`, `declaration.ts`, `core-block-parsed.ts`, `InMemoryBlockSource`, `sweep-tapes.ts`, `admin-harness.ts`, `opt-out.test.ts`, `ModuleDeclaration`, `config/history.ts`, `ingest-harness.ts`, `node-fields-harness.ts`, `adapter-fixtures.ts`, `FinalizedLoop`, `validate.ts`, `tape/index.ts`, `NodeClient`, `core-transport.ts`, `client.test.ts`, `backup-fixtures.ts`, `core-private-source.test.ts`, `config-check.ts`, `host.ts`, `zod`, `.read`, `core-status.test.ts`, `runner/process.ts`, `spawnChild`, `chain-placement.test.ts`, `hex`, `resolve.ts`, `chain-process.test.ts`, `adapter.ts`, `builder.test.ts`, `process-backends.ts`, `connectWebSocket`, `graph.ts`, `cli-fixtures.ts`, `backup/backup.ts`, `entries.ts`, `library/modules.test.ts`, `ledger/ledger-tasks.test.ts`, `mounted-admin.test.ts`, `messages.ts`, `admin/configuration.ts`, `pause-fixtures.ts`, `contract-modules.test.ts`, `core-ledger-state.ts`, `contract-data-checks.ts`, `refused-configuration.test.ts`, `process-build.ts`, `.from`, `ledger/types.ts`, `private/lockstep-wait.test.ts`, `transform-checks.ts`, `refcount-model.ts`, `interfaces/transaction-history-storage.ts`, `worker-host.test.ts`, `height-versioned.test.ts`, `LedgerPackage`, `validateDeclarations`, `slow-block-harness.ts`, `core-ledger-state/sql.ts`, `src/config/load.ts`, `column-rules.test.ts`, `boundary.test.ts`, `writer-lock-checks.ts`, `containers.test.ts`, `retirement.test.ts`, `ref_node_timers`, `file-mode.test.ts`, `ledger-sweep.test.ts`, `start-umbradb.ts`, `transaction-history-storage.property.test.ts`, `src/db/postgres.ts`, `pglite-lock.ts`, `cold-boot-recovery.integration.test.ts`, `browser.test.ts`, `real-tapes.ts`, `backup/restore.ts`, `openPostgres`, `networks.ts`, `test/postgres/setup.ts`, `paused-harness.ts`, `Worker`, `refcount-tables.test.ts`, `package.json`, `startup-stop-harness.ts`, `release-version.ts`, `core.ts`, `pglite-queue.test.ts`, `cbor.property.test.ts`, `browser/build.ts`, `resolver-boundary.ts`, `code-registry.ts`, `version-checks.ts`, `node-set.test.ts`, `shims.test.ts`, `checks.test.ts`, `sigterm.test.ts`, `crash.test.ts`, `refcount-step.test.ts`, `LoopPauses`, `documents.ts`, `pg-tx-history-adapter.ts`, `recovery.test.ts`, `validation.ts`, `Lockstep`, `config/plain-data.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `restore-private.ts`, `surface.test.ts`, `node-bridge.ts`, `mapping.test.ts`, `start-umbradb.test.ts`, `demo-handlers.test.ts`, `library-documents.test.ts`, `stop-heights.test.ts`, `listening.test.ts`, `api-session.test.ts`, `network.test.ts`, `excluded-not-exported.test.ts`, `node-key-tapes.ts`, `ledger-table-config.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `web-lock.ts`, `postgres-tls-server.ts`, `core-block-fetch.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `text.test.ts`, `upgrade-boundary.test.ts`, `ws-mutual-tls.test.ts`, `pglite-directory-fixtures.ts`, `test-processes.test.ts`?**
  _High betweenness centrality (0.263) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.017987913259864912 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `builds.ts`, `declaration.ts`, `core-block-parsed.ts`, `InMemoryBlockSource`, `sweep-tapes.ts`, `admin-harness.ts`, `opt-out.test.ts`, `ModuleDeclaration`, `config/history.ts`, `ingest-harness.ts`, `node-fields-harness.ts`, `FinalizedLoop`, `validate.ts`, `vitest`, `tape/index.ts`, `NodeClient`, `core-transport.ts`, `client.test.ts`, `backup-fixtures.ts`, `core-private-source.test.ts`, `config-check.ts`, `startUmbraDB`, `zod`, `.read`, `core-status.test.ts`, `runner/process.ts`, `resolve.ts`, `chain-process.test.ts`, `Process`, `process-backends.ts`, `graph.ts`, `cli-fixtures.ts`, `range.ts`, `backup/backup.ts`, `refused`, `library/modules.test.ts`, `ledger/ledger-tasks.test.ts`, `mounted-admin.test.ts`, `admin/configuration.ts`, `pause-fixtures.ts`, `contract-modules.test.ts`, `core-ledger-state.ts`, `refused-configuration.test.ts`, `version`, `process-build.ts`, `ledger/types.ts`, `private/lockstep-wait.test.ts`, `transform-checks.ts`, `height-versioned.test.ts`, `validateDeclarations`, `slow-block-harness.ts`, `core-ledger-state/sql.ts`, `src/config/load.ts`, `cbor.ts`, `writer-lock-checks.ts`, `checkShape`, `ref_node_timers`, `start-umbradb.ts`, `src/db/postgres.ts`, `pglite-lock.ts`, `backup/restore.ts`, `openPostgres`, `refcount-tables.test.ts`, `pglite-queue.test.ts`, `version-checks.ts`, `shims.test.ts`, `checks.test.ts`, `PgliteDatabase`, `refcount-step.test.ts`, `UmbraDBHandle`, `mapping.ts`, `validation.ts`, `config/plain-data.ts`, `Writer`, `mapping.test.ts`, `version-table.ts`, `QueueRunner`, `ledger-table-config.test.ts`, `statementsOf`, `web-lock.ts`, `postgres-tls-server.ts`, `Session`, `browser/src/config/load.ts`, `upgrade-boundary.test.ts`, `RuntimeMetadata`, `pglite-directory-fixtures.ts`, `.blockItems`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `builds.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0234027846351338 - nodes in this community are weakly interconnected._