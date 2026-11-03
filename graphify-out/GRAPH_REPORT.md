# Graph Report - UmbraDB

## Corpus Check
- 1289 files · ~1,822,943 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13281 nodes · 41533 edges · 368 communities (334 shown, 34 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3457 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `989e1ff3a70de305` (1289 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- UmbraError
- migrate.ts
- config/history.ts
- config-hash-checks.ts
- start-umbradb.ts
- core-block-fetch/metadata.ts
- cold-boot-recovery.integration.test.ts
- test/postgres/setup.ts
- ledger/types.ts
- core-block-parsed.ts
- validate.ts
- browser/build.ts
- .value
- ledger-graph-tapes.ts
- paused-harness.ts
- private/lockstep-wait.test.ts
- Worker
- loop.test.ts
- recovery.test.ts
- stop-heights.test.ts
- refcount-histories.ts
- transport.test.ts
- release-version.ts
- BlockRef
- InMemoryBlockSource
- cbor.property.test.ts
- process-worker.ts
- node-run.ts
- TransactionHistoryEntry
- node-set.test.ts
- chrome.ts
- code-registry.ts
- backup/restore.ts
- options.ts
- postgres/transaction-history-storage.ts
- pg-tx-history-adapter.ts
- LoopPauses
- node-fields-harness.ts
- documents.ts
- crash.test.ts
- core.ts
- contract-data-checks.ts
- node-set.ts
- height-versioned.property.test.ts
- read-gate.ts
- example-checks.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- NodeClient
- node-bridge.ts
- core-ledger-state/sql.ts
- refcount.ts
- tape/command.ts
- pack-install.mjs
- start-umbradb.test.ts
- spawnChild
- refcount-tables.test.ts
- Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- deterministic-postgresql/checks.ts
- GraphWorld
- fetch-fixtures.ts
- node-refs.ts
- validation.test.ts
- listening.test.ts
- process-admin.ts
- ws-mutual-tls.test.ts
- statementsOf
- network.test.ts
- stats-module.ts
- api-server.test.ts
- ref_node_path
- quiet-host.child.ts
- web-lock.ts
- no-indexer-or-wallet-sdk.test.ts
- browser/src/config/load.ts
- column-rules.ts
- text.test.ts
- sha256
- buffer.ts
- Design — Sprint 1: project setup + TemporalKV
- vitest
- ledger/plain-data.ts
- compare.ts
- browser/serve.ts
- record-and-replay.test.ts
- core-transport.ts
- ProcessItems
- signal-backup.worker.ts
- serve-checks.ts
- real-tapes.ts
- channel-queue.test.ts
- mutation-evidence.d.mts
- core-config.test.ts
- TransportProxy
- AsyncLocalStorage
- zod
- refused-configuration.test.ts
- declaration.ts
- restore-ledger.ts
- LedgerPackage
- adapter.ts
- PageApiChannel
- messages.ts
- NodeFS
- Keeping
- .from
- client.test.ts
- ref_node_fs
- ProcessHandle
- graph.ts
- builds.ts
- runner/process.ts
- Database
- admin-harness.ts
- Process
- ref_node_timers
- backup/backup.ts
- ledger-storage.test.ts
- NodeBlockSource
- transform-checks.ts
- resolve.ts
- FinalizedLoop
- process-harness.ts
- ledger-restart.ts
- version-checks.ts
- cli/command.ts
- determinism/contents-hash.ts
- configured.ts
- chain-placement.test.ts
- in-memory-source.ts
- loop-stop-harness.ts
- validation.ts
- opt-out.test.ts
- library/modules.test.ts
- change-capture.ts
- PgTransactionHistoryStorage
- slow-block-harness.ts
- core-chain-events.ts
- refcount-restart.ts
- hex
- networks.ts
- browser.test.ts
- digests.test.ts
- ingest-faults.test.ts
- ledger-tasks-checks.ts
- src/ledger/identity.ts
- DatabaseParts
- cbor.ts
- config-check.ts
- ChannelEndpoint
- tape/index.ts
- checkShape
- interfaces/transaction-history-storage.ts
- chain-events-decode.test.ts
- resolver-boundary.ts
- boundary.test.ts
- status-schema.test.ts
- surface.test.ts
- retirement.test.ts
- binding.test.ts
- adapter-fixtures.ts
- refcount-conversion.ts
- node-source.ts
- core-ledger-state.ts
- page.ts
- mapping.ts
- pglite-lock.ts
- config/plain-data.ts
- Problem
- history
- refused
- ADDED Requirements
- graph.py
- .off
- .slowBlockMs
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- core-ledger-state.test.ts
- local-preprod-sync.mjs
- The laws of UmbraDB's storage helpers
- Requirement: BK-1 Backup
- .disconnect
- Tasks — START-UMBRADB: UmbraDB as a library
- twox.ts
- Boundaries, threats and controls
- path.ts
- midnight-env — reproducible PREPROD dev environment
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- fresh-instance.mjs
- package-keys-walk.mjs
- crash-worker.ts
- .put
- code
- startUmbraDB
- version
- backupAtStop
- T
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- Requirements
- Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- UmbraDB
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- README.md
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Requirement: DT-3 The contents hash
- [0.10.0] - 2026-10-27
- explore.md
- ROADMAP.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- scoped-review-manifest
- UmbraDB in a browser
- try.sh
- Tasks — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Repository agent policy
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- Requirement: BK-3 Restore into an empty database, checked before and after loading
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
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- UmbraDB node architecture
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
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
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true
- 00045 — Mutual TLS does not bind a certificate to an instance id
- 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy
- 00047 — Resource limits are per message or connection, not per service
- 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance
- 00049 — A141's "within 2 s" on PostgreSQL fails once under load
- 00050 — A165's race step on PostgreSQL with a transport failed once under load
- 00051 — The transport's instance id is any text: line breaks reach the core's log
- 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why
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
- modules-missing.ts
- modules-not-a-list.ts
- v8/build.sh
- v9/build.sh
- v9-rc3/build.sh
- vendor-ledger.sh
- workerData
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 465 edges
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
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (368 total, 34 thin omitted)

### Community 0 - "UmbraError"
Cohesion: 0.02
Nodes (154): PostgresConnection, PostgresOptions, SslMode, ReadOptions, Transaction, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning (+146 more)

### Community 1 - "migrate.ts"
Cohesion: 0.02
Nodes (192): AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference, OwnPart, PlannedSchema (+184 more)

### Community 10 - "config/history.ts"
Cohesion: 0.03
Nodes (135): ConfigRow, CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreSettings, UmbraConfig, versionEntry, ConfigHashRow (+127 more)

### Community 100 - "config-hash-checks.ts"
Cohesion: 0.08
Nodes (20): Report, a162Run, HeaderSeen, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, a162Problems() (+12 more)

### Community 104 - "start-umbradb.ts"
Cohesion: 0.10
Nodes (33): MessagePortLike, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork, UmbraDBOptions (+25 more)

### Community 105 - "core-block-fetch/metadata.ts"
Cohesion: 0.07
Nodes (33): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive, BlockParsedOptions (+25 more)

### Community 106 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 107 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+19 more)

### Community 11 - "ledger/types.ts"
Cohesion: 0.03
Nodes (106): LoadLedger, TransactionParser, LedgerStateItem, RetainedState, LedgerName, ApplyInput, ApplyOutput, LedgerPackageOptions (+98 more)

### Community 110 - "core-block-parsed.ts"
Cohesion: 0.08
Nodes (35): BlockEventSource, ChainTransaction, EventPhase, decodeExtrinsics(), blockBodyOf(), blockParsedOf(), chainHashOf(), coreBlockParsedOnParse() (+27 more)

### Community 111 - "validate.ts"
Cohesion: 0.10
Nodes (36): ConfigRule, CursorRule, Issue, Plain, SettingsSchema, coreSettingsSchema(), closest(), configFindings() (+28 more)

### Community 112 - "browser/build.ts"
Cohesion: 0.07
Nodes (28): BrowserBuild, BrowserBuildOptions, BrowserControl, checkedLedgers, pageBench, browserLedgerEntry(), browserPlugin(), buildBrowser() (+20 more)

### Community 114 - ".value"
Cohesion: 0.19
Nodes (17): TypeDef, ScaleError, ScaleReader, ValueReader, decodeExtrinsic(), field(), pallet(), readRuntimeMetadata() (+9 more)

### Community 116 - "ledger-graph-tapes.ts"
Cohesion: 0.11
Nodes (29): Reader, Seen, Fault, FaultRun, RefcountModel, RefcountTables, bytesOf(), hex() (+21 more)

### Community 117 - "paused-harness.ts"
Cohesion: 0.12
Nodes (30): Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, loadConfig(), a176Project() (+22 more)

### Community 118 - "private/lockstep-wait.test.ts"
Cohesion: 0.11
Nodes (35): LockstepCondition, OpenTransaction, A118Observation, MismatchObservation, ExpectedWait, WaitSample, launchPrivate(), poll() (+27 more)

### Community 119 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 12 - "loop.test.ts"
Cohesion: 0.03
Nodes (127): ErrorCode, GraphInput, LockstepWait, SlowBlockEvent, SlowWindow, PastFaultCase, RefusalCase, Faults (+119 more)

### Community 120 - "recovery.test.ts"
Cohesion: 0.09
Nodes (25): Armed, CommitArm, CommitFault, CommitProxy, Pair, Fault, Recorded, RecoveryObservation (+17 more)

### Community 123 - "stop-heights.test.ts"
Cohesion: 0.09
Nodes (26): ChainDataView, NoRedelivery, RunObservation, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView() (+18 more)

### Community 125 - "refcount-histories.ts"
Cohesion: 0.09
Nodes (34): contentsHash, ReadableDatabase, FacetOptions, Facets, NodeSetCache, tapeDeterminism, TapeDeterminismOptions, tapeHistory (+26 more)

### Community 126 - "transport.test.ts"
Cohesion: 0.10
Nodes (25): Message, MessageType, Ended, rawClient, Escape, Refused, endedWithin(), hello() (+17 more)

### Community 127 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 128 - "BlockRef"
Cohesion: 0.11
Nodes (14): QueuedBlock, BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, failingSource(), lookalike() (+6 more)

### Community 13 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (122): InMemoryBlockSource, EngineBuild, EngineNetwork, ProcessingEnd, Job, WorkerEvent, A77Observation, A78Observation (+114 more)

### Community 130 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 131 - "process-worker.ts"
Cohesion: 0.10
Nodes (25): databaseTarget, Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, RestoreSeams, databaseOptions() (+17 more)

### Community 133 - "node-run.ts"
Cohesion: 0.09
Nodes (25): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, NodeRunResult, core(), databaseOf() (+17 more)

### Community 134 - "TransactionHistoryEntry"
Cohesion: 0.11
Nodes (12): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+4 more)

### Community 137 - "node-set.test.ts"
Cohesion: 0.07
Nodes (29): StoredRow, Node, Tables, changedRow(), database(), databaseSql(), hexOf(), literal() (+21 more)

### Community 138 - "chrome.ts"
Cohesion: 0.12
Nodes (15): Cdp, CdpEvent, ChromeBrowser, ChromeTab, Download, PageRequest, chrome(), chrome() (+7 more)

### Community 139 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 14 - "backup/restore.ts"
Cohesion: 0.03
Nodes (92): PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision, StartHashes (+84 more)

### Community 141 - "options.ts"
Cohesion: 0.14
Nodes (28): readOptions, addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding(), guarded(), isAbortSignal() (+20 more)

### Community 142 - "postgres/transaction-history-storage.ts"
Cohesion: 0.10
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+11 more)

### Community 143 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 144 - "LoopPauses"
Cohesion: 0.08
Nodes (17): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, clock(), watched(), 1. Module layout, 2. Backend routing (the one non-obvious constraint) (+9 more)

### Community 145 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (24): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Run() (+16 more)

### Community 146 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 147 - "crash.test.ts"
Cohesion: 0.11
Nodes (24): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+16 more)

### Community 149 - "core.ts"
Cohesion: 0.13
Nodes (21): CommitOptions, PostgresRun, BenchEnv, ManualOpts, TinybenchOpts, Backend, Baseline, LatencyStats (+13 more)

### Community 15 - "contract-data-checks.ts"
Cohesion: 0.03
Nodes (126): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+118 more)

### Community 151 - "node-set.ts"
Cohesion: 0.10
Nodes (24): NodeSetFault, NodeSetOptions, NodeTableCheck, SchemaTable, ContentFunction, TableContent, ContentDefinition, ContentDefinedBuildOptions (+16 more)

### Community 152 - "height-versioned.property.test.ts"
Cohesion: 0.13
Nodes (20): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+12 more)

### Community 153 - "read-gate.ts"
Cohesion: 0.14
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 155 - "example-checks.ts"
Cohesion: 0.15
Nodes (19): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+11 more)

### Community 156 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 157 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 158 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 16 - "NodeClient"
Cohesion: 0.04
Nodes (84): ConfiguredGenesis, FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, NodeClientOptions, Pending, State (+76 more)

### Community 160 - "node-bridge.ts"
Cohesion: 0.12
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 161 - "core-ledger-state/sql.ts"
Cohesion: 0.12
Nodes (25): StateRow, StoredState, writeBlock(), sqlRefcountTables(), addRootCounts(), bytesOf(), changedNodes(), insertEvents() (+17 more)

### Community 162 - "refcount.ts"
Cohesion: 0.14
Nodes (19): ComputedBlock, KeyCounts, RefcountCheck, RefcountStatement, refcountStep, RefcountTables, bytesOf(), chunksOf() (+11 more)

### Community 165 - "tape/command.ts"
Cohesion: 0.15
Nodes (22): BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, isPositive(), readBoundaries(), isWebSocketUrl() (+14 more)

### Community 166 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 167 - "start-umbradb.test.ts"
Cohesion: 0.14
Nodes (16): ModuleListRule, GoneCwdResult, moduleListProblems(), closedByItself(), hostile(), optionProblems(), throwing(), problemsOf() (+8 more)

### Community 17 - "spawnChild"
Cohesion: 0.02
Nodes (101): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+93 more)

### Community 170 - "refcount-tables.test.ts"
Cohesion: 0.09
Nodes (15): Tables, insertNodes(), bytes(), clear(), h(), list(), lit(), seed() (+7 more)

### Community 174 - "Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.11
Nodes (13): ModelBatch, ModelSnapshot, SweepModel, compare(), hexOf(), 0. Baseline, 1. Measurements on the recorded tapes (`design.md` §9, §13 phase 0), 2. The reference model and the reachability oracle (`design.md` §2.3, §3.2, §4; §13 phase 1) (+5 more)

### Community 175 - "deterministic-postgresql/checks.ts"
Cohesion: 0.12
Nodes (17): ModuleTableOptions, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, RefusalOptions, RelationFacts (+9 more)

### Community 18 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (105): NodeCallOptions, RecordingClient, ArgType, BlockOptions, CallSpec, chainBlock, PalletSpec, RUNTIME (+97 more)

### Community 184 - "node-refs.ts"
Cohesion: 0.24
Nodes (6): nodeKeys, ChildReader, ChildVisitor, hashNode(), readChildList(), readChildren()

### Community 185 - "validation.test.ts"
Cohesion: 0.15
Nodes (15): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), contentDeclared(), failures() (+7 more)

### Community 187 - "listening.test.ts"
Cohesion: 0.12
Nodes (9): TestCertificates, configWhen(), libraryCore(), privateData(), readerOf(), until(), waitsForLockstep(), makeCertificates() (+1 more)

### Community 19 - "process-admin.ts"
Cohesion: 0.04
Nodes (99): ConfiguredDatabase, ConfiguredDatabaseOptions, ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts (+91 more)

### Community 190 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 193 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 194 - "network.test.ts"
Cohesion: 0.23
Nodes (13): NetworkRuleName, Parsed, Expected, schemaCase(), commandRefusalProblems(), listeningSockets(), portFree(), refusedProblems() (+5 more)

### Community 196 - "stats-module.ts"
Cohesion: 0.23
Nodes (12): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+4 more)

### Community 2 - "api-server.test.ts"
Cohesion: 0.02
Nodes (136): coreHeaders, HeadersArgument, LifecycleStatus, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules (+128 more)

### Community 20 - "ref_node_path"
Cohesion: 0.05
Nodes (85): RestoreCommandSeams, RestoreOutcome, BackupBackend, BackupDatabase, killedRestore, TickerHandle, FileProcess, privateBackup (+77 more)

### Community 200 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 202 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 207 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 208 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 21 - "column-rules.ts"
Cohesion: 0.02
Nodes (101): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+93 more)

### Community 211 - "text.test.ts"
Cohesion: 0.23
Nodes (6): BackupText, blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir

### Community 213 - "sha256"
Cohesion: 0.26
Nodes (6): sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 214 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 218 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 22 - "vitest"
Cohesion: 0.06
Nodes (81): NodeBatch, FixtureRun, SourceClass, TableSnapshot, Touches, DigestRow, DigestRows, Reader (+73 more)

### Community 227 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 228 - "compare.ts"
Cohesion: 0.27
Nodes (7): BaselineLoad, Comparison, compareToBaseline(), loadBaseline(), BASELINE_PATH, REGRESSION_FACTOR, dir

### Community 229 - "browser/serve.ts"
Cohesion: 0.29
Nodes (7): PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS, PREVIEW_NODE

### Community 23 - "record-and-replay.test.ts"
Cohesion: 0.03
Nodes (55): NodeRetry, ManualTimers, ConnectionFrames, Failure, Variant, WrongRecording, Metadata, Step (+47 more)

### Community 24 - "core-transport.ts"
Cohesion: 0.03
Nodes (74): PrivateLinkAddress, PrivateLinkConnect, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected, CoreTransportOptions (+66 more)

### Community 248 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 249 - "serve-checks.ts"
Cohesion: 0.33
Nodes (4): Served, isolationProblems(), serveCommand(), ISOLATION

### Community 25 - "real-tapes.ts"
Cohesion: 0.03
Nodes (72): Outage, FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+64 more)

### Community 26 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (89): demoLink, EndpointOptions, Envelope, PrivateLinkChannel, EngineInput, controlledTimers, PeerEnd, PeerMessage (+81 more)

### Community 268 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 27 - "core-config.test.ts"
Cohesion: 0.04
Nodes (74): MountedAdminAnswer, adminRoutes, AdminAnswer, AdminEndpoint, AdminPart, ChainView, DeclarationView, InstanceStatus (+66 more)

### Community 28 - "zod"
Cohesion: 0.04
Nodes (84): AdminSeams, Answered, gate, Observation, SecretHashes, SecretVariant, Compared, ConnectSeen (+76 more)

### Community 29 - "refused-configuration.test.ts"
Cohesion: 0.04
Nodes (84): EngineConfig, Start, Child, Refusal, Start, listenError(), startAdminServer(), startProcess() (+76 more)

### Community 3 - "declaration.ts"
Cohesion: 0.03
Nodes (115): EntryBuilder, BlockWriteHandle, ReadHandle, SchemaWriteHandle, SchemaPlan, ContentDefinedTables, cursorTable, CursorTableOptions (+107 more)

### Community 31 - "restore-ledger.ts"
Cohesion: 0.04
Nodes (83): Manifest, Restored, DatabaseState, ReadDatabaseOptions, ingest, watched, FileEntries, RestartEvent (+75 more)

### Community 32 - "LedgerPackage"
Cohesion: 0.04
Nodes (51): LedgerPackage, StateHandle, LedgerEngine, Settled, Driver, StagenetFixtureJson, stagenetReplay, hexOf() (+43 more)

### Community 33 - "adapter.ts"
Cohesion: 0.04
Nodes (69): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+61 more)

### Community 34 - "messages.ts"
Cohesion: 0.04
Nodes (55): PublicSide, Committed, HelloAck, JsonValue, MessageFault, ReadResult, StatementResult, CarrierConnection (+47 more)

### Community 35 - ".from"
Cohesion: 0.04
Nodes (77): Buffer, Hash, Cbor, DagRunOptions, FixtureDag, ExtendedState, FakeState, FixtureData (+69 more)

### Community 36 - "client.test.ts"
Cohesion: 0.04
Nodes (45): NodeSocketEvents, HandSocket, HandSockets, Answer, FakeNode, Handler, Received, recorded (+37 more)

### Community 37 - "ref_node_fs"
Cohesion: 0.03
Nodes (63): Lockfile, Manifest, RepositoryFile, Upstream, Leftover, RemovedName, ReportedTest, gateAdapters() (+55 more)

### Community 38 - "ProcessHandle"
Cohesion: 0.04
Nodes (58): ConfigCheckReport, backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, ProcessHandle (+50 more)

### Community 39 - "graph.ts"
Cohesion: 0.04
Nodes (78): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck (+70 more)

### Community 4 - "builds.ts"
Cohesion: 0.03
Nodes (111): PglitePathParts, PostgresParts, PostgresPartsInput, PrivateBackend, SessionSeen, TestDatabase, PrivateOptions, PrivateProcess (+103 more)

### Community 40 - "runner/process.ts"
Cohesion: 0.04
Nodes (61): Bound, ChainSource, CoreChainBinding, NodeWait, WaitingListener, ImportedConfig, LoadOptions, plainData (+53 more)

### Community 41 - "Database"
Cohesion: 0.05
Nodes (52): CommittedHeight, Database, TestDatabase, Case, LoadOutcome, OutsideRead, Traced, Opened (+44 more)

### Community 42 - "admin-harness.ts"
Cohesion: 0.05
Nodes (62): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStarter, AdminStartOptions, AdminSnapshot (+54 more)

### Community 43 - "Process"
Cohesion: 0.05
Nodes (15): CoreTransport, transportReaderFacts, BlockSource, ProcessReason, PauseHold, Opened, Process, SignalTarget (+7 more)

### Community 44 - "ref_node_timers"
Cohesion: 0.05
Nodes (59): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, StaysPaused (+51 more)

### Community 45 - "backup/backup.ts"
Cohesion: 0.05
Nodes (68): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, ManifestMigration, ManifestTool, DumpInput (+60 more)

### Community 46 - "ledger-storage.test.ts"
Cohesion: 0.06
Nodes (68): SeenLoad, retentionSeen, ledgerScenario, RestorableBackup, ProcessDatabase, coreLedgerState(), heightsIn(), a106Problems() (+60 more)

### Community 47 - "NodeBlockSource"
Cohesion: 0.06
Nodes (23): HeadWait, NodeBlockSource, Prefetch, NodeSubscription, NodeHeader, PreparedBlock, QueueRunner, SourceCondition (+15 more)

### Community 48 - "transform-checks.ts"
Cohesion: 0.07
Nodes (52): Failure, Variant, TapeError, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange (+44 more)

### Community 49 - "resolve.ts"
Cohesion: 0.05
Nodes (66): AddressRequest, Asked, LinkPlan, NetworkInput, NetworkPlan, NetworkProblem, NetworkRequest, NetworkRule (+58 more)

### Community 5 - "FinalizedLoop"
Cohesion: 0.03
Nodes (81): HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointRun, PointSchedule (+73 more)

### Community 50 - "process-harness.ts"
Cohesion: 0.05
Nodes (44): ReadOnlyDatabase, MisuseListener, MisuseReports, ProcessContexts, PublishRefusal, ChainStarted, Seen, RunnerBackend (+36 more)

### Community 51 - "ledger-restart.ts"
Cohesion: 0.06
Nodes (49): CoreLedgerStateOptions, RefcountFault, FixtureRunOptions, workerRecord, Call, StoredCheck, Reader, RefcountTape (+41 more)

### Community 52 - "version-checks.ts"
Cohesion: 0.07
Nodes (48): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, LedgerTable, Boundary, CallRecord, CountingNode (+40 more)

### Community 53 - "cli/command.ts"
Cohesion: 0.05
Nodes (52): CommandHandler, CommandIo, MainProcess, TickerProcess, Place, After, ModeObservation, ModeOracleOptions (+44 more)

### Community 54 - "determinism/contents-hash.ts"
Cohesion: 0.07
Nodes (53): CanonicalEncodingError, ContentOptions, ModuleContentsError, PageOptions, ConsistentRead, DeterminismBackend, Call, TestDatabase (+45 more)

### Community 55 - "configured.ts"
Cohesion: 0.06
Nodes (56): RestoreChain, BackupOutcome, CommandConfig, commandTarget, Chain, RestoreCommandOptions, ConfiguredDatabase, ConfiguredDatabaseOptions (+48 more)

### Community 56 - "chain-placement.test.ts"
Cohesion: 0.05
Nodes (65): ChainOutcome, BlockSpec, EventSpec, transactionSpec, CallTx, eventsRuntime, LedgerHeight, LedgerScenarioOptions (+57 more)

### Community 58 - "in-memory-source.ts"
Cohesion: 0.05
Nodes (53): BlockRow, InMemoryItems, Wait, StandInOptions, Commit, Committed, AlwaysLanded, blockHeaderOf() (+45 more)

### Community 59 - "loop-stop-harness.ts"
Cohesion: 0.06
Nodes (47): ChainCheck, ChainCheckInput, EngineOptions, HookedSource, PlainSubclass, A169Observation, LoopStopScenario, SourceOf (+39 more)

### Community 6 - "validation.ts"
Cohesion: 0.02
Nodes (151): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput (+143 more)

### Community 60 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (33): CheckedMigration, ModuleContentsFailure, ModuleTable, PlacedRefusal, Refusal, RefusalCode, RefusalPlace, Backend (+25 more)

### Community 61 - "library/modules.test.ts"
Cohesion: 0.06
Nodes (37): CloseHelper, Hold, Signal, Job, Run, FaultedClose, QuietResult, Job (+29 more)

### Community 62 - "change-capture.ts"
Cohesion: 0.06
Nodes (51): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow (+43 more)

### Community 63 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (52): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 2. The implementation, on both backends, 1. Schema (+44 more)

### Community 64 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (51): LoopInput, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+43 more)

### Community 68 - "core-chain-events.ts"
Cohesion: 0.06
Nodes (43): NodeDatabase, WorkerWithStreams, ChangedFile, GenesisFixture, installationCopy, PackageStartup, StartPackageProcess, Seen (+35 more)

### Community 69 - "refcount-restart.ts"
Cohesion: 0.05
Nodes (46): BatchJson, databaseNow, Hold, Light, Line, NodeSetKeeper, Observed, observedRun (+38 more)

### Community 7 - "hex"
Cohesion: 0.03
Nodes (124): BlockKind, BlockScript, BoundaryRewrite, DrivenBlock, GeneratedBlock, GeneratedState, GraphNode, HistoryScript (+116 more)

### Community 70 - "networks.ts"
Cohesion: 0.05
Nodes (53): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, ConfiguredLedgerTable (+45 more)

### Community 71 - "browser.test.ts"
Cohesion: 0.08
Nodes (53): Reachable, RestoreAttempt, PageBackup, PageEvent, PageLink, PageRestore, ProcessName, StatusBody (+45 more)

### Community 72 - "digests.test.ts"
Cohesion: 0.06
Nodes (50): Op, States, TableName, captured(), hex(), moduleM(), restart(), sha256() (+42 more)

### Community 73 - "ingest-faults.test.ts"
Cohesion: 0.07
Nodes (44): ProcessCondition, itemsSeen, Json, Scenario, A84Observation, LoggedRetry, OutageObservation, RetrySample (+36 more)

### Community 74 - "ledger-tasks-checks.ts"
Cohesion: 0.07
Nodes (45): TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses() (+37 more)

### Community 75 - "src/ledger/identity.ts"
Cohesion: 0.08
Nodes (39): AdapterSpec, ManifestLine, VerifyLedgerPackagesOptions, LedgerRelease, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, V9Logs (+31 more)

### Community 76 - "DatabaseParts"
Cohesion: 0.06
Nodes (37): DatabaseParts, TickerConfig, PausableConfig, PrivateConfig, CheckTarget, CliBackend, Snapshot, Renamed (+29 more)

### Community 77 - "cbor.ts"
Cohesion: 0.08
Nodes (42): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+34 more)

### Community 78 - "config-check.ts"
Cohesion: 0.07
Nodes (40): CheckFinding, CheckStep, StepName, StepReport, StepStatus, ConfigFinding, HistoryFinding, Finding (+32 more)

### Community 79 - "ChannelEndpoint"
Cohesion: 0.09
Nodes (19): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), exceedsUtf8(), refuseChannel(), discard(), isChannel() (+11 more)

### Community 8 - "tape/index.ts"
Cohesion: 0.03
Nodes (107): ConnectSocket, Recorded, Refusal, Link, TapeBuilder, TapeBuilderOptions, CompletenessRange, RecordingError (+99 more)

### Community 80 - "checkShape"
Cohesion: 0.07
Nodes (41): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+33 more)

### Community 81 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (38): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+30 more)

### Community 82 - "chain-events-decode.test.ts"
Cohesion: 0.10
Nodes (38): Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, fill(), le() (+30 more)

### Community 83 - "resolver-boundary.ts"
Cohesion: 0.07
Nodes (41): TypeCheckFinding, TypeCheckResult, Finding, Access, AllowedRead, Boundary, Crossing, Guard (+33 more)

### Community 84 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+34 more)

### Community 86 - "status-schema.test.ts"
Cohesion: 0.06
Nodes (38): ProcessState, Validator, Decision, ReadinessCase, answerAdmin(), statusOf(), busy(), holder() (+30 more)

### Community 87 - "surface.test.ts"
Cohesion: 0.07
Nodes (45): Document, EntryInput, Renamed, Surface, SurfaceAmendment, changelogEntryProblems(), entryTerms(), namesWord() (+37 more)

### Community 88 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 89 - "binding.test.ts"
Cohesion: 0.08
Nodes (43): PrivateIntakeOptions, builtInNetwork, LedgerRow, A165Options, a165Run, Attempt, A113Observation, A156Observation (+35 more)

### Community 9 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (125): StateSummary, StoredNode, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot (+117 more)

### Community 90 - "refcount-conversion.ts"
Cohesion: 0.09
Nodes (43): FixtureConfig, ContractRow, conversionRun, Released, seenTables(), after(), batchOf(), classify() (+35 more)

### Community 92 - "node-source.ts"
Cohesion: 0.08
Nodes (33): BlockHeaderItem, BodyExtrinsic, ExtrinsicCall, BlockBody, CoreBlockHeader, CoreBlockItems, RuntimeMetadataView, NodeSourceOptions (+25 more)

### Community 93 - "core-ledger-state.ts"
Cohesion: 0.09
Nodes (35): BlockLedgerSource, LedgerBinding, retainedStates, CoreRevision, applyBlock(), boundLedger(), computeBlock(), contractsOf() (+27 more)

### Community 94 - "page.ts"
Cohesion: 0.06
Nodes (33): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+25 more)

### Community 95 - "mapping.ts"
Cohesion: 0.08
Nodes (32): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+24 more)

### Community 96 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (33): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, ChildResult (+25 more)

### Community 98 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (32): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, Row, copyArray(), copyObject() (+24 more)

### Community 275 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 30 - "history"
Cohesion: 0.03
Nodes (91): integer(), history(), params(), n(), data(), 7. The module API, 2.1 The tables of `core-ledger-state`, 2.2 Forms, and storing them as the node does (O-8) (+83 more)

### Community 65 - "refused"
Cohesion: 0.05
Nodes (53): refused(), cursorRead(), following(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+45 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 115 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 121 - ".off"
Cohesion: 0.06
Nodes (33): Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, 6. `sweep: off` (O-1), MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears (+25 more)

### Community 122 - ".slowBlockMs"
Cohesion: 0.06
Nodes (31): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+23 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+26 more)

### Community 168 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 169 - "core-ledger-state.test.ts"
Cohesion: 0.11
Nodes (15): boundLedgerParser(), bindCoreLedgerState(), itemsOf(), applied(), bound(), query(), refusing(), applied() (+7 more)

### Community 183 - "local-preprod-sync.mjs"
Cohesion: 0.21
Nodes (17): commitOf(), configText(), docker(), dockerHas(), dockerLater(), imageDigests(), main(), nodeRpc() (+9 more)

### Community 191 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.13
Nodes (14): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers, ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks) (+6 more)

### Community 195 - "Requirement: BK-1 Backup"
Cohesion: 0.13
Nodes (11): 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented, Evidence, Problem, Suggested fix, MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing (+3 more)

### Community 197 - ".disconnect"
Cohesion: 0.16
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 201 - "Tasks — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.14
Nodes (11): ownKeys(), Rework (class 4), 0. Baseline, 10. Review (AGENTS.md stage 4, bounded), 11. Close-out, 2. The private link's settings renamed (D-6; CF-4), 4. The network request and plan (LM-3; design §5.1, §5.2), 7. The browser demo on the engine (LM-11; design §8) (+3 more)

### Community 206 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 217 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 241 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 245 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 258 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 328 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 329 - "package-keys-walk.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 339 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 57 - ".put"
Cohesion: 0.03
Nodes (62): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+54 more)

### Community 66 - "code"
Cohesion: 0.04
Nodes (57): code(), Added, 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit (+49 more)

### Community 67 - "startUmbraDB"
Cohesion: 0.05
Nodes (55): text(), transportReader(), startUmbraDB(), both(), memoryTables(), nodeBatchOf(), stepOrHalt(), stepOutcome() (+47 more)

### Community 85 - "version"
Cohesion: 0.05
Nodes (45): side(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules (+37 more)

### Community 91 - "backupAtStop"
Cohesion: 0.06
Nodes (40): backupAtStop(), transportReaderRule(), ledgerWorkerEntry(), log(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix (+32 more)

### Community 99 - "T"
Cohesion: 0.05
Nodes (41): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+33 more)

### Community 102 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning (+33 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+31 more)

### Community 113 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 136 - "package.json"
Cohesion: 0.06
Nodes (33): bin, umbradb, bugs, url, description, optional, engines, node (+25 more)

### Community 140 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 150 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 163 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 164 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 171 - "Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.09
Nodes (21): 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words, 4.1 Reachability does not depend on the form (+13 more)

### Community 172 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 173 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 178 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 180 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 181 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+9 more)

### Community 182 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 186 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 188 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 189 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 192 - "UmbraDB"
Cohesion: 0.12
Nodes (16): Backup and restore, Check and run, Create a project, Example: loading `stats-module`, In your own program: `startUmbraDB`, Install UmbraDB, Private processes, briefly, Project status, development and links (+8 more)

### Community 198 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 199 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+6 more)

### Community 203 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 204 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 205 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 209 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 210 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 212 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 215 - "README.md"
Cohesion: 0.26
Nodes (4): Choosing a database, Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 216 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 219 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 220 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 221 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 222 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 223 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 224 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 225 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.18
Nodes (10): 1. The rules, on the reference model (LG-14), 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents, 7. `core-arch` criteria rewritten by this change, 8. Required test ids, 9. Requirement coverage (+2 more)

### Community 226 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 230 - "[0.10.0] - 2026-10-27"
Cohesion: 0.20
Nodes (9): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changed since `v0.10.0-rc.2`: ledger nodes reclaimed by reference counting (`ledger-refcount`), Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface) (+1 more)

### Community 231 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 232 - "ROADMAP.md"
Cohesion: 0.20
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 233 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 234 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 235 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 236 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 237 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 238 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 239 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 242 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 243 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 244 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 246 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 247 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.22
Nodes (8): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution, Design — v1.0.0-perf-baseline

### Community 250 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 251 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 252 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 253 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 254 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 255 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 256 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 257 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 259 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 260 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.29
Nodes (6): 13. Contract data, 18. Whole-system faults, differentials and measurements, 19. Close-out, 6. Storage helpers, 7. Digests, Tasks — CORE-ARCH: the standalone indexer's core architecture

### Community 261 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 262 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 263 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 264 - "Requirement: PP-4 The process transport"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, Spec delta — `private-processes` capability

### Community 265 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 266 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 267 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 269 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 272 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 273 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 274 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 276 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.33
Nodes (5): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Problem, Resolution, Suggested fix

### Community 277 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 278 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 279 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 280 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 281 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 282 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 283 - "Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting (`ledger-refcount`), What changes, Why

### Community 284 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 285 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

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

### Community 291 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 292 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 293 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 294 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 295 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 296 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 297 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 298 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 299 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 300 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 301 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 302 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 303 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 304 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 305 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 306 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.40
Nodes (4): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Suggested fix

### Community 307 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 308 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 309 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 310 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 311 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 312 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 313 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 314 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 315 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 316 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 317 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 318 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 319 - "00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why"
Cohesion: 0.40
Nodes (4): 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why, Evidence, Problem, Suggested fix

### Community 320 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 321 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 322 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 323 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 324 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 325 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 326 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 327 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 330 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 331 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 332 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 333 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 334 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 335 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 336 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 337 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 97 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-3339`, `RFC-8785`, `RFC-8785`, `RFC-6455`, `RFC-3339` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4369 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `UmbraError`, `migrate.ts`, `api-server.test.ts`, `declaration.ts`, `builds.ts`, `FinalizedLoop`, `validation.ts`, `hex`, `tape/index.ts`, `adapter-fixtures.ts`, `config/history.ts`, `ledger/types.ts`, `loop.test.ts`, `InMemoryBlockSource`, `backup/restore.ts`, `contract-data-checks.ts`, `NodeClient`, `spawnChild`, `fetch-fixtures.ts`, `process-admin.ts`, `ref_node_path`, `column-rules.ts`, `record-and-replay.test.ts`, `core-transport.ts`, `real-tapes.ts`, `channel-queue.test.ts`, `core-config.test.ts`, `zod`, `refused-configuration.test.ts`, `restore-ledger.ts`, `adapter.ts`, `messages.ts`, `.from`, `client.test.ts`, `ref_node_fs`, `ProcessHandle`, `graph.ts`, `runner/process.ts`, `Database`, `admin-harness.ts`, `Process`, `ref_node_timers`, `backup/backup.ts`, `ledger-storage.test.ts`, `transform-checks.ts`, `resolve.ts`, `process-harness.ts`, `ledger-restart.ts`, `version-checks.ts`, `cli/command.ts`, `determinism/contents-hash.ts`, `configured.ts`, `chain-placement.test.ts`, `in-memory-source.ts`, `loop-stop-harness.ts`, `opt-out.test.ts`, `library/modules.test.ts`, `change-capture.ts`, `slow-block-harness.ts`, `core-chain-events.ts`, `refcount-restart.ts`, `networks.ts`, `browser.test.ts`, `digests.test.ts`, `ingest-faults.test.ts`, `ledger-tasks-checks.ts`, `src/ledger/identity.ts`, `DatabaseParts`, `config-check.ts`, `interfaces/transaction-history-storage.ts`, `chain-events-decode.test.ts`, `resolver-boundary.ts`, `boundary.test.ts`, `status-schema.test.ts`, `surface.test.ts`, `retirement.test.ts`, `binding.test.ts`, `refcount-conversion.ts`, `node-source.ts`, `core-ledger-state.ts`, `mapping.ts`, `pglite-lock.ts`, `config/plain-data.ts`, `config-hash-checks.ts`, `cold-boot-recovery.integration.test.ts`, `test/postgres/setup.ts`, `browser/build.ts`, `ledger-graph-tapes.ts`, `paused-harness.ts`, `private/lockstep-wait.test.ts`, `Worker`, `recovery.test.ts`, `stop-heights.test.ts`, `transport.test.ts`, `release-version.ts`, `cbor.property.test.ts`, `process-worker.ts`, `package.json`, `node-set.test.ts`, `code-registry.ts`, `options.ts`, `postgres/transaction-history-storage.ts`, `pg-tx-history-adapter.ts`, `LoopPauses`, `documents.ts`, `crash.test.ts`, `node-set.ts`, `height-versioned.property.test.ts`, `read-gate.ts`, `example-checks.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `node-bridge.ts`, `start-umbradb.test.ts`, `core-ledger-state.test.ts`, `refcount-tables.test.ts`, `excluded-not-exported.test.ts`, `validation.test.ts`, `listening.test.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `network.test.ts`, `web-lock.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `text.test.ts`, `ledger/plain-data.ts`, `compare.ts`, `serve-checks.ts`?**
  _High betweenness centrality (0.209) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8785`, `RFC-8785` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.020822852031974957 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `migrate.ts`, `api-server.test.ts`, `declaration.ts`, `builds.ts`, `FinalizedLoop`, `validation.ts`, `hex`, `tape/index.ts`, `config/history.ts`, `ledger/types.ts`, `loop.test.ts`, `InMemoryBlockSource`, `backup/restore.ts`, `contract-data-checks.ts`, `NodeClient`, `fetch-fixtures.ts`, `process-admin.ts`, `ref_node_path`, `vitest`, `record-and-replay.test.ts`, `core-transport.ts`, `channel-queue.test.ts`, `zod`, `refused-configuration.test.ts`, `restore-ledger.ts`, `messages.ts`, `client.test.ts`, `graph.ts`, `runner/process.ts`, `Database`, `Process`, `ref_node_timers`, `backup/backup.ts`, `NodeBlockSource`, `transform-checks.ts`, `resolve.ts`, `process-harness.ts`, `version-checks.ts`, `determinism/contents-hash.ts`, `configured.ts`, `in-memory-source.ts`, `opt-out.test.ts`, `library/modules.test.ts`, `slow-block-harness.ts`, `startUmbraDB`, `core-chain-events.ts`, `networks.ts`, `digests.test.ts`, `ingest-faults.test.ts`, `ledger-tasks-checks.ts`, `src/ledger/identity.ts`, `DatabaseParts`, `cbor.ts`, `config-check.ts`, `checkShape`, `status-schema.test.ts`, `binding.test.ts`, `backupAtStop`, `node-source.ts`, `core-ledger-state.ts`, `mapping.ts`, `pglite-lock.ts`, `config/plain-data.ts`, `start-umbradb.ts`, `validate.ts`, `ledger-graph-tapes.ts`, `private/lockstep-wait.test.ts`, `stop-heights.test.ts`, `BlockRef`, `process-worker.ts`, `options.ts`, `node-set.ts`, `refcount.ts`, `core-ledger-state.test.ts`, `refcount-tables.test.ts`, `validation.test.ts`, `UmbraDB`, `statementsOf`, `web-lock.ts`, `browser/src/config/load.ts`, `sha256`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `migrate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017895940537449972 - nodes in this community are weakly interconnected._