# Graph Report - UmbraDB

## Corpus Check
- 1263 files · ~1,801,852 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13175 nodes · 40965 edges · 357 communities (327 shown, 30 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3432 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `31c001fdb4d0723b` (1263 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- column-rules.ts
- startUmbraDB
- cbor.ts
- transaction-history-storage.property.test.ts
- browser.test.ts
- Worker
- pg-tx-history-adapter.ts
- release-version.ts
- core.ts
- process-worker.ts
- host.ts
- BlockRef
- browser/build.ts
- shims.test.ts
- resolver-boundary.ts
- file-modes.ts
- code-registry.ts
- sweep-tapes.ts
- containers.test.ts
- chrome.ts
- .concat
- test/postgres/setup.ts
- refcount-step.test.ts
- refcount-tapes.ts
- paused-harness.ts
- documents.ts
- db/errors.ts
- src/ledger/identity.ts
- read-gate.ts
- node-fields-harness.ts
- example-checks.ts
- crash.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- binding.test.ts
- threat-model.test.ts
- surface.test.ts
- backup/restore.ts
- node-bridge.ts
- recovery.test.ts
- core-block-fetch/metadata.ts
- core-private-source.test.ts
- .value
- pack-install.mjs
- signal-ignored-fixtures.ts
- core-block-fetch.test.ts
- postgres-tls-server.ts
- fixtures/configuration.ts
- vitest
- library-documents.test.ts
- manifest.ts
- checks.test.ts
- key-handling-checks.ts
- cli/run.ts
- NodeClient
- text.test.ts
- validation.test.ts
- LoopPauses
- browser-harness.ts
- core-config.test.ts
- earlier-build.ts
- node-refs.ts
- ledger-liveness.test.ts
- core-block-commit.test.ts
- read-height.property.test.ts
- api.ts
- statementsOf
- ref_node_fs
- module-api.ts
- quiet-host.child.ts
- browser/serve.ts
- browser/src/config/load.ts
- tape/index.ts
- ws-mutual-tls.test.ts
- history.property.test.ts
- stats-module.ts
- FinalizedLoop
- Design — Sprint 1: project setup + TemporalKV
- extrinsics.ts
- ledger/plain-data.ts
- core-block-parsed.ts
- BlockItems
- validate.ts
- signal-backup.worker.ts
- core-transport.ts
- Finding
- ledger/types.ts
- mutation-evidence.d.mts
- node-run.ts
- AsyncLocalStorage
- channel-queue.test.ts
- runner/process.ts
- resolve.ts
- InMemoryBlockSource
- config/history.ts
- order.property.test.ts
- restore-kill.worker.ts
- cli/command.ts
- PageApiChannel
- BlockWriteHandle
- NodeFS
- database-parts.ts
- loop.test.ts
- hex
- Process
- builds.ts
- openPostgres
- client.test.ts
- contract-data-checks.ts
- contract-modules.test.ts
- NodeBlockSource
- messages.ts
- chain-placement.test.ts
- .read
- LedgerPackage
- admin/configuration.ts
- version-checks.ts
- core-ledger-state.ts
- UmbraError
- range.ts
- config-check.ts
- node-set.test.ts
- declaration.ts
- process-harness.ts
- node.test.ts
- .from
- boundary.test.ts
- refcount-model.ts
- admin-harness.ts
- PgTransactionHistoryStorage
- loop.ts
- ledger-sweep.test.ts
- interfaces/transaction-history-storage.ts
- private/lockstep-wait.test.ts
- networks.ts
- core-ledger-state/sql.ts
- transform-checks.ts
- module-api.test.ts
- ingest-harness.ts
- slow-block-harness.ts
- code
- validation.ts
- real-tapes.ts
- chain-events-decode.test.ts
- config/plain-data.ts
- transport.test.ts
- checkShape
- graph.ts
- adapter-fixtures.ts
- retirement.test.ts
- backup/backup.ts
- api-server.test.ts
- mapping.ts
- page.ts
- pglite-lock.ts
- sweep-fixture.test.ts
- ChannelEndpoint
- loop-stop-harness.ts
- refcount-conversion.ts
- ledger-refcount-backup.test.ts
- data
- .configHash
- refused
- .slowBlockMs
- ADDED Requirements
- .off
- transportReader
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- following
- options.ts
- Tasks — START-UMBRADB: UmbraDB as a library
- T
- Design — START-UMBRADB: UmbraDB as a library
- .disconnect
- conformance-gate.mjs
- mutation-per-adapter.mjs
- backupAtStop
- twox.ts
- Design — v1.1.0: Quint model checking
- header.ts
- openssl
- Boundaries, threats and controls
- path.ts
- host-signal.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- v9
- orphan-watcher.mjs
- crash-worker.ts
- history
- .put
- version
- cold-boot-recovery.integration.test.ts
- ADDED Requirements
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- README.md
- ADDED Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- ADDED Requirements
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Requirement: DT-3 The contents hash
- Design — Sprint 4: Watermarks
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Requirement: CF-4 Every field is data, operational or secret
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- UmbraDB in a browser
- try.sh
- Tasks — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Repository agent policy
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
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
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it
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
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- post-block-update/oracle/main.rs
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 447 edges
2. `UmbraError` - 357 edges
3. `ModuleDeclaration` - 209 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 135 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `Database` - 104 edges
9. `startUmbraDB()` - 103 edges
10. `ReadHandle` - 96 edges

## Surprising Connections (you probably didn't know these)
- `1. Executable Watermarks model` --references--> `Address`  [INFERRED]
  openspec/changes/sprint-5-formal-watermarks/tasks.md → src/library/start-umbradb.ts
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

## Communities (357 total, 30 thin omitted)

### Community 0 - "column-rules.ts"
Cohesion: 0.02
Nodes (200): CaptureState, CheckedMigration, ContentDefinedTables, ContentOptions, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions (+192 more)

### Community 1 - "startUmbraDB"
Cohesion: 0.02
Nodes (188): coreEntry, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork, UmbraDBOptions (+180 more)

### Community 10 - "cbor.ts"
Cohesion: 0.03
Nodes (129): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode (+121 more)

### Community 100 - "transaction-history-storage.property.test.ts"
Cohesion: 0.08
Nodes (24): EntryContent, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, Command, ReplayableStorage, abortErrorLike(), capitalize(), applyCommand() (+16 more)

### Community 102 - "browser.test.ts"
Cohesion: 0.08
Nodes (35): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+27 more)

### Community 103 - "Worker"
Cohesion: 0.07
Nodes (14): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+6 more)

### Community 105 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (24): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+16 more)

### Community 107 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 108 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 109 - "process-worker.ts"
Cohesion: 0.10
Nodes (25): BrowserRun, PrivateInstance, Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker, PgliteMemoryParts (+17 more)

### Community 11 - "host.ts"
Cohesion: 0.03
Nodes (92): LoadLedger, LedgerName, LedgerTask, ParsedTransaction, AppliedState, ApplyBlock, BlockId, EngineHolding (+84 more)

### Community 110 - "BlockRef"
Cohesion: 0.11
Nodes (14): CoreBlockItems, BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, failingSource(), lookalike() (+6 more)

### Community 111 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 112 - "shims.test.ts"
Cohesion: 0.09
Nodes (22): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PgliteLockUse, sha256, CommittedHeight, PgliteOptions, databaseOptions() (+14 more)

### Community 115 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 116 - "file-modes.ts"
Cohesion: 0.09
Nodes (25): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+17 more)

### Community 117 - "code-registry.ts"
Cohesion: 0.10
Nodes (30): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, changeTasks(), allTasks(), input() (+22 more)

### Community 12 - "sweep-tapes.ts"
Cohesion: 0.04
Nodes (119): CoreLedgerStateOptions, RefcountFault, FixtureRun, FixtureRunOptions, Touches, Fault, FaultRun, RefcountModel (+111 more)

### Community 120 - "containers.test.ts"
Cohesion: 0.09
Nodes (23): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers() (+15 more)

### Community 121 - "chrome.ts"
Cohesion: 0.12
Nodes (15): Cdp, CdpEvent, ChromeBrowser, ChromeTab, Download, PageRequest, chrome(), chrome() (+7 more)

### Community 122 - ".concat"
Cohesion: 0.08
Nodes (20): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+12 more)

### Community 124 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 126 - "refcount-step.test.ts"
Cohesion: 0.10
Nodes (22): ComputedBlock, refcountStep, RefcountTables, RefcountBatch, Given, Halt, Outcome, bytesOf() (+14 more)

### Community 127 - "refcount-tapes.ts"
Cohesion: 0.12
Nodes (19): NodeBatch, Block, StoredCheck, Reader, RefcountTape, Sampler, TapeReplay, TapeReplayOptions (+11 more)

### Community 128 - "paused-harness.ts"
Cohesion: 0.15
Nodes (25): Body, PausedExpectation, Read, Reader, Running, keeperModule(), keepingPause(), pausedOf() (+17 more)

### Community 129 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 13 - "db/errors.ts"
Cohesion: 0.03
Nodes (80): PostgresConnection, PostgresOptions, SslMode, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, ReadTimeoutSetting (+72 more)

### Community 130 - "src/ledger/identity.ts"
Cohesion: 0.14
Nodes (24): ManifestLine, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages(), checkPackageFiles() (+16 more)

### Community 132 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 134 - "node-fields-harness.ts"
Cohesion: 0.11
Nodes (22): A168Observation, A168Phase, Expected, GatedConnector, StatusReader, a(), a168Run(), atLeast() (+14 more)

### Community 135 - "example-checks.ts"
Cohesion: 0.15
Nodes (20): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+12 more)

### Community 136 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 138 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 139 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 14 - "binding.test.ts"
Cohesion: 0.03
Nodes (103): PrivateIntakeOptions, A165Options, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding (+95 more)

### Community 140 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 143 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 145 - "backup/restore.ts"
Cohesion: 0.17
Nodes (24): RestoreChain, RestoreInput, RestoreTarget, isBlockLedgerSource(), bindingRefusal(), hex(), networkRefusal(), publicNotStarted() (+16 more)

### Community 146 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 147 - "recovery.test.ts"
Cohesion: 0.13
Nodes (20): CommitOutcome, HeldHeight, Outcomes, AlwaysLanded, AlwaysLost, DropsHeld, Fault, Recorded (+12 more)

### Community 148 - "core-block-fetch/metadata.ts"
Cohesion: 0.23
Nodes (16): MetadataPallet, MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata() (+8 more)

### Community 15 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (78): PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision, StartHashes (+70 more)

### Community 151 - ".value"
Cohesion: 0.23
Nodes (8): MetadataType, ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 152 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 153 - "signal-ignored-fixtures.ts"
Cohesion: 0.11
Nodes (17): ListenedRun, WorkerSignals, RunningCommand, listenerProblems(), namesUnder(), runWorkerInChild(), signalLines(), sigusr2Ignored() (+9 more)

### Community 156 - "core-block-fetch.test.ts"
Cohesion: 0.13
Nodes (10): BlockItemSource, LedgerTable, coreBlockFetchOnFetch(), isBlockItemSource(), chainBackbone(), BOUND, CORE_BLOCK_FETCH, CORE_BLOCK_FETCH_ID (+2 more)

### Community 157 - "postgres-tls-server.ts"
Cohesion: 0.13
Nodes (15): BenchEnv, PostgresConnection, TlsPostgres, makeCertificates(), startTlsPostgres(), PG_SETTINGS, container, { guarded, fixture } (+7 more)

### Community 158 - "fixtures/configuration.ts"
Cohesion: 0.13
Nodes (17): BrowserConfiguration, ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration(), param(), privateConfiguration() (+9 more)

### Community 16 - "vitest"
Cohesion: 0.02
Nodes (93): Served, ParentJob, Kill, Orphaned, SourceFile, Finding, Run, WorkerEvent (+85 more)

### Community 163 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 164 - "manifest.ts"
Cohesion: 0.13
Nodes (13): BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool, PublicSide, Restored, isPrivateDatabase() (+5 more)

### Community 165 - "checks.test.ts"
Cohesion: 0.11
Nodes (14): IntegerRules, Case, checkFunctionsSql(), numericOkPredicate(), refusedNumbersPath(), outcome(), started(), verdicts() (+6 more)

### Community 167 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 168 - "cli/run.ts"
Cohesion: 0.15
Nodes (12): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, TickerOptions (+4 more)

### Community 17 - "NodeClient"
Cohesion: 0.04
Nodes (80): FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription (+72 more)

### Community 171 - "text.test.ts"
Cohesion: 0.15
Nodes (10): BackupText, createReadStream(), firstLine(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst() (+2 more)

### Community 175 - "validation.test.ts"
Cohesion: 0.14
Nodes (16): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), contentDeclared(), failures() (+8 more)

### Community 177 - "LoopPauses"
Cohesion: 0.16
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 178 - "browser-harness.ts"
Cohesion: 0.26
Nodes (17): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+9 more)

### Community 18 - "core-config.test.ts"
Cohesion: 0.04
Nodes (99): MountedAdminAnswer, AdminSeams, PrivateSideFacts, adminRoutes, AdminChannel, AdminServeOptions, ToAdmin, AdminStartOptions (+91 more)

### Community 181 - "earlier-build.ts"
Cohesion: 0.16
Nodes (17): FoldedPart, RecordedMigration, isObject(), readManifestLine(), earlierBackup(), earlierBootstrapSql(), earlierRefusalProblems(), earlierRows() (+9 more)

### Community 182 - "node-refs.ts"
Cohesion: 0.24
Nodes (6): nodeKeys, ChildReader, ChildVisitor, hashNode(), readChildList(), readChildren()

### Community 184 - "ledger-liveness.test.ts"
Cohesion: 0.15
Nodes (15): SlowStep, TestLoaderData, beat(), countDeserializations(), hexOf(), loadLedger(), probe(), backend (+7 more)

### Community 187 - "core-block-commit.test.ts"
Cohesion: 0.17
Nodes (9): Commit, Committed, standInHeader(), standInItems(), a145Stored(), contextAt(), partWrite(), A145_TIMES (+1 more)

### Community 188 - "read-height.property.test.ts"
Cohesion: 0.17
Nodes (11): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+3 more)

### Community 19 - "api.ts"
Cohesion: 0.03
Nodes (80): Database, ReadOnlyDatabase, ReadOptions, KeeperGlobals, Settings, Case, LoadOutcome, OutsideRead (+72 more)

### Community 190 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 2 - "ref_node_fs"
Cohesion: 0.03
Nodes (170): RestoreSeams, BackupOutcome, commandTarget, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome, BackupBackend (+162 more)

### Community 20 - "module-api.ts"
Cohesion: 0.04
Nodes (95): coreHeaders, HeadersArgument, NodeHttpHandler, NodeUpgradeHandler, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions (+87 more)

### Community 200 - "quiet-host.child.ts"
Cohesion: 0.16
Nodes (10): Job, Outcome, Stated, until(), added, before, db, during (+2 more)

### Community 202 - "browser/serve.ts"
Cohesion: 0.22
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 203 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 21 - "tape/index.ts"
Cohesion: 0.04
Nodes (78): heldClock, Recorded, BoundaryReading, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId (+70 more)

### Community 210 - "ws-mutual-tls.test.ts"
Cohesion: 0.21
Nodes (8): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), read(), tlsClientErrors

### Community 212 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 216 - "stats-module.ts"
Cohesion: 0.32
Nodes (10): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+2 more)

### Community 22 - "FinalizedLoop"
Cohesion: 0.03
Nodes (42): ResolvedRange, EntryBoundary, PointRun, PointSchedule, Activity, FinalizedLoop, HeightRun, LoopObserver (+34 more)

### Community 224 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.20
Nodes (10): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+2 more)

### Community 228 - "extrinsics.ts"
Cohesion: 0.25
Nodes (9): BodyExtrinsic, ExtrinsicCall, BlockBody, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), isCompactU64() (+1 more)

### Community 229 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 23 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (104): BlockHeaderItem, BlockRow, CoreBlockHeader, CoreContractStatesOptions, ContractStateRow, CoreLedgerVersion, LedgerPackageIdentity, DefinedModule (+96 more)

### Community 238 - "BlockItems"
Cohesion: 0.27
Nodes (5): QueuedBlock, BlockItems, KeptItems, KeptLoop, reporting()

### Community 24 - "validate.ts"
Cohesion: 0.03
Nodes (108): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, ConfigRule, CursorRule (+100 more)

### Community 244 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 25 - "core-transport.ts"
Cohesion: 0.03
Nodes (75): PrivateLinkAddress, PrivateLinkConnect, ResultColumn, EndpointOptions, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued (+67 more)

### Community 251 - "Finding"
Cohesion: 0.39
Nodes (8): Finding, readOptions, named(), elementsOf(), guarded(), keysOf(), readValue(), snapshot()

### Community 26 - "ledger/types.ts"
Cohesion: 0.03
Nodes (94): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+86 more)

### Community 262 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 264 - "node-run.ts"
Cohesion: 0.47
Nodes (5): NodeRunResult, withDevelopmentOptIn(), hex(), nodeRun(), PATIENCE_MS

### Community 27 - "channel-queue.test.ts"
Cohesion: 0.03
Nodes (86): demoLink, Envelope, MessagePortLike, PrivateLinkChannel, controlledTimers, PeerEnd, PeerMessage, rawPeer (+78 more)

### Community 28 - "runner/process.ts"
Cohesion: 0.03
Nodes (91): ConfigFacts, Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, CoreChainBinding, CoreChainFacts (+83 more)

### Community 29 - "resolve.ts"
Cohesion: 0.04
Nodes (99): HistoryRule, plainData, ConfigInput, AppliedMigration, AddressRequest, Asked, LinkPlan, NetworkInput (+91 more)

### Community 3 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (168): InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, Job, WorkerEvent, A77Observation, A78Observation (+160 more)

### Community 30 - "config/history.ts"
Cohesion: 0.04
Nodes (95): CoreVersion, versionEntry, HistoryCode, HistoryContext, HistoryFinding, HistoryOptions, ProvidesRow, Span (+87 more)

### Community 31 - "order.property.test.ts"
Cohesion: 0.04
Nodes (95): ErrorCode, GraphInput, PastFaultCase, RefusalCase, Seen, Recorder, CheckName, GraphSpec (+87 more)

### Community 319 - "restore-kill.worker.ts"
Cohesion: 0.40
Nodes (3): RestoreJob, job, orphanGuard

### Community 32 - "cli/command.ts"
Cohesion: 0.03
Nodes (77): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, IgnoredJob, CommandResult, CheckTarget (+69 more)

### Community 33 - "BlockWriteHandle"
Cohesion: 0.04
Nodes (73): BlockWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Migration (+65 more)

### Community 34 - "database-parts.ts"
Cohesion: 0.04
Nodes (83): DatabaseParts, PostgresParts, PostgresPartsInput, Answered, gate, Observation, TickerConfig, PausableConfig (+75 more)

### Community 35 - "loop.test.ts"
Cohesion: 0.04
Nodes (78): LockstepWait, LoopEnd, LoopInput, SlowBlockEvent, SlowWindow, Contexts, Faults, LostCommit (+70 more)

### Community 36 - "hex"
Cohesion: 0.05
Nodes (70): FreshInstanceRequest, FreshInstanceResult, StoredNode, Reader, NodeKeyTape, Written, GenesisNodes, Disposable (+62 more)

### Community 37 - "Process"
Cohesion: 0.05
Nodes (27): NetworkShown, ProcessAdmin, ProcessAdminOptions, AdminStarter, NodeFacts, NodeStatus, NodeConnection, ProcessReason (+19 more)

### Community 38 - "builds.ts"
Cohesion: 0.04
Nodes (59): PglitePathParts, Keeping, PrivateBackend, SessionSeen, PrivateRefusal, A162Options, a162Run, HeaderSeen (+51 more)

### Community 39 - "openPostgres"
Cohesion: 0.05
Nodes (62): PostgresOptions, WriterProcess, WorkerEvent, Phase, PostgresTestDatabase, PostgresTestServer, PauseReport, Job (+54 more)

### Community 4 - "client.test.ts"
Cohesion: 0.02
Nodes (118): NodeClientOptions, ConnectSocket, IngestOptions, HandSocket, HandSockets, Answer, FakeNode, Handler (+110 more)

### Community 40 - "contract-data-checks.ts"
Cohesion: 0.05
Nodes (82): contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx, handoff (+74 more)

### Community 41 - "contract-modules.test.ts"
Cohesion: 0.04
Nodes (74): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+66 more)

### Community 42 - "NodeBlockSource"
Cohesion: 0.05
Nodes (31): BlockEventSource, BlockLedgerSource, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, LedgerBinding, NodeSubscription (+23 more)

### Community 43 - "messages.ts"
Cohesion: 0.04
Nodes (55): PublicSide, Committed, HelloAck, JsonValue, MessageFault, MessageType, ReadResult, StatementResult (+47 more)

### Community 44 - "chain-placement.test.ts"
Cohesion: 0.05
Nodes (72): BlockSpec, EventSpec, Json, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase (+64 more)

### Community 45 - ".read"
Cohesion: 0.04
Nodes (69): driverConnectionOptions, SchemaItem, SchemaPlan, Chain, ChainOptions, DigestRow, MigrationRow, PartOptions (+61 more)

### Community 46 - "LedgerPackage"
Cohesion: 0.05
Nodes (37): LedgerPackage, LedgerEngine, LedgerTaskFailed, hexOf(), idOf(), same(), sameBytes(), runLedgerWorker() (+29 more)

### Community 47 - "admin/configuration.ts"
Cohesion: 0.05
Nodes (69): OpenedConfig, AllowedDetail, OpenedFacts, RevisionSettings, SnapshotFacts, ConfigSnapshot, DeclarationView, EntryView (+61 more)

### Community 48 - "version-checks.ts"
Cohesion: 0.06
Nodes (51): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, Boundary, CallRecord, CountingNode, MetadataSelector (+43 more)

### Community 49 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (62): LedgerStateItem, RetainedState, retainedStates, CoreRevision, ContractKeys, bindLedgerParser(), boundLedgerParser(), workerParser() (+54 more)

### Community 5 - "UmbraError"
Cohesion: 0.03
Nodes (153): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference (+145 more)

### Community 50 - "range.ts"
Cohesion: 0.05
Nodes (57): Refusal, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command, TapeCommandIo, RecordingError (+49 more)

### Community 51 - "config-check.ts"
Cohesion: 0.05
Nodes (60): CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, ReadDatabaseOptions, TypeCheckFinding (+52 more)

### Community 53 - "node-set.test.ts"
Cohesion: 0.04
Nodes (59): NodeSetFault, NodeSetOptions, NodeTableCheck, ContentDefinition, ContentDefinedBuildOptions, StoredRow, Tables, Tables (+51 more)

### Community 54 - "declaration.ts"
Cohesion: 0.05
Nodes (45): UmbraConfig, ReadHandle, OwnPart, ApiRegistry, BlockHeader, FieldKind, FieldSchema, ItemDeclaration (+37 more)

### Community 55 - "process-harness.ts"
Cohesion: 0.05
Nodes (36): EntryRange, ResolvedGraph, MisuseListener, MisuseReports, ProcessContexts, ProcessContextsInput, ProcessItems, PublishRefusal (+28 more)

### Community 56 - "node.test.ts"
Cohesion: 0.04
Nodes (26): ManualTimers, Metadata, Step, RawClient, Failure, Variant, expectAnswersByOccurrence(), expectDelayHonoured() (+18 more)

### Community 57 - ".from"
Cohesion: 0.04
Nodes (56): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+48 more)

### Community 58 - "boundary.test.ts"
Cohesion: 0.06
Nodes (51): DesignTable, RowCoverage, ModuleReference, Finding, rule(), collationsWritten(), componentCode(), componentExports() (+43 more)

### Community 59 - "refcount-model.ts"
Cohesion: 0.07
Nodes (40): Node, BlockKind, BlockScript, BoundaryRewrite, Dice, DrivenBlock, GeneratedBlock, GeneratedState (+32 more)

### Community 6 - "admin-harness.ts"
Cohesion: 0.02
Nodes (159): FromAdmin, AdminServer, BlockSource, EngineConfig, WorkerWithStreams, AdminRun, AdminRunOptions, Answerer (+151 more)

### Community 60 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (53): TransactionHistoryStorage, PgTransactionHistoryStorage, encodeStoredEntry(), reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema (+45 more)

### Community 61 - "loop.ts"
Cohesion: 0.07
Nodes (52): PointName, HeightRange, Callback, CallbackFailure, ParallelPoint, ReasonCode, Unwrapped, HeightActivity (+44 more)

### Community 62 - "ledger-sweep.test.ts"
Cohesion: 0.05
Nodes (44): GreyPicker, SweepState, SweepTables, SweepWrites, MemoryTables, ModelBatch, ModelSnapshot, hexOf() (+36 more)

### Community 63 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.04
Nodes (41): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+33 more)

### Community 64 - "private/lockstep-wait.test.ts"
Cohesion: 0.06
Nodes (41): LockstepCondition, Report, OpenTransaction, A118Observation, MismatchObservation, ExpectedWait, WaitSample, HeldLink (+33 more)

### Community 65 - "networks.ts"
Cohesion: 0.05
Nodes (57): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+49 more)

### Community 66 - "core-ledger-state/sql.ts"
Cohesion: 0.07
Nodes (52): KeyCounts, RefcountCheck, RefcountStatement, StateRow, StoredState, GreyView, SweepPhase, chunksOf() (+44 more)

### Community 67 - "transform-checks.ts"
Cohesion: 0.09
Nodes (37): Failure, Variant, TransformError, NotificationRange, until(), baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect() (+29 more)

### Community 69 - "module-api.test.ts"
Cohesion: 0.05
Nodes (45): ChainDataView, cursorHeight(), bindCoreBlockFetch(), bindCoreChain(), bindCoreChainEvents(), readOnlyDatabase(), answerChainData(), chainDataHeaders() (+37 more)

### Community 7 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (159): BlockParsed, BlockParsedOptions, TransactionParser, NodeCallOptions, ProcessCondition, itemsSeen, Scenario, RecordingClient (+151 more)

### Community 70 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (48): ReadOpener, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec, Observed (+40 more)

### Community 71 - "code"
Cohesion: 0.04
Nodes (53): RepositoryFile, canPin(), code(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS (+45 more)

### Community 72 - "validation.ts"
Cohesion: 0.04
Nodes (54): DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder, EntryConfig (+46 more)

### Community 73 - "real-tapes.ts"
Cohesion: 0.07
Nodes (44): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+36 more)

### Community 75 - "chain-events-decode.test.ts"
Cohesion: 0.06
Nodes (45): MetadataField, MetadataVariant, Primitive, RuntimeMetadataView, ChainTransaction, ChainEvent, EventPhase, RecordTypes (+37 more)

### Community 76 - "config/plain-data.ts"
Cohesion: 0.06
Nodes (38): ImportedConfig, LoadOptions, PlainArray, PlainDataNode, PlainDataRule, Walk, Row, configModules() (+30 more)

### Community 77 - "transport.test.ts"
Cohesion: 0.07
Nodes (33): Message, PublicCoreOptions, Ended, rawClient, Escape, publicState, Refused, confinementProblems() (+25 more)

### Community 78 - "checkShape"
Cohesion: 0.07
Nodes (40): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+32 more)

### Community 79 - "graph.ts"
Cohesion: 0.07
Nodes (46): Edge, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts, Spanned (+38 more)

### Community 8 - "adapter-fixtures.ts"
Cohesion: 0.03
Nodes (131): ChainOutcome, StoredNode, CallTx, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject (+123 more)

### Community 80 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 81 - "backup/backup.ts"
Cohesion: 0.09
Nodes (41): BackupInput, BackupSeams, BackupTarget, BackupWritten, DumpInput, PgliteDump, SnapshotSeams, Environment (+33 more)

### Community 82 - "api-server.test.ts"
Cohesion: 0.07
Nodes (32): ChainDataAnswer, HttpHandler, HttpRoute, AcceptsDuplicates, AddsExtensions, AddsHeaders, AppendsVersion, Client (+24 more)

### Community 83 - "mapping.ts"
Cohesion: 0.08
Nodes (33): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+25 more)

### Community 85 - "page.ts"
Cohesion: 0.06
Nodes (33): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+25 more)

### Community 86 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (33): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, ChildResult (+25 more)

### Community 88 - "sweep-fixture.test.ts"
Cohesion: 0.08
Nodes (33): Readable, Reader, TableNode, Driver, node(), childKeys(), node(), bytesOf() (+25 more)

### Community 89 - "ChannelEndpoint"
Cohesion: 0.11
Nodes (14): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), messageEnvelope(), refuseChannel(), discard(), isChannel() (+6 more)

### Community 9 - "loop-stop-harness.ts"
Cohesion: 0.03
Nodes (131): SourceShared, CrashEvent, CrashJob, watched, Call, SeenLoad, RestartEvent, RestartJob (+123 more)

### Community 95 - "refcount-conversion.ts"
Cohesion: 0.14
Nodes (35): FixtureConfig, Reach, ContractRow, conversionRun, Released, storedKeep, closureProblems(), fixtureProblems() (+27 more)

### Community 98 - "ledger-refcount-backup.test.ts"
Cohesion: 0.08
Nodes (31): contentsHash, FileEntries, Cbor, DigestRow, DigestRows, Reader, ReadableDatabase, RestorableBackup (+23 more)

### Community 119 - "data"
Cohesion: 0.08
Nodes (31): params(), n(), data(), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not), Rework (class 3 continued — cross-vendor cold audit, rounds 2-4), Rework (class 3 — cross-vendor audit caught real correctness defects post-self-verify) (+23 more)

### Community 206 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 104 - "refused"
Cohesion: 0.07
Nodes (33): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, A paused loop on `/status`, A private process and a changed public configuration, The node on `/status` (+25 more)

### Community 113 - ".slowBlockMs"
Cohesion: 0.07
Nodes (29): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+21 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): 5. WalletState envelope, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only (+26 more)

### Community 125 - ".off"
Cohesion: 0.07
Nodes (28): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, 2.1 Where the probe runs (the one real design decision), 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc (+20 more)

### Community 154 - "transportReader"
Cohesion: 0.10
Nodes (20): text(), transportReader(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 10. Requirement coverage, 1. Library-mode guarantees (+12 more)

### Community 155 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 159 - "following"
Cohesion: 0.10
Nodes (21): cursorRead(), following(), 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began, Evidence, Problem, Suggested fix, Backup and restore, Check and run (+13 more)

### Community 166 - "options.ts"
Cohesion: 0.19
Nodes (20): addressFindings(), configFindings(), cwdUnreadable(), finding(), isHost(), isObject(), networkFindings(), optionFindings() (+12 more)

### Community 170 - "Tasks — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.11
Nodes (15): found(), ownKeys(), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Rework (class 4), 5.3 Standard service lifecycle (owner decisions D-18, D-19, D-23), 0. Baseline, 10. Review (AGENTS.md stage 4, bounded), 11. Close-out (+7 more)

### Community 172 - "T"
Cohesion: 0.12
Nodes (18): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 0. Schema (+10 more)

### Community 189 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.14
Nodes (14): transportReaderRule(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout, 2. Architecture (+6 more)

### Community 191 - ".disconnect"
Cohesion: 0.16
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 194 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 195 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 196 - "backupAtStop"
Cohesion: 0.18
Nodes (13): backupAtStop(), A backup at the core's stop, A backup of a running process (SIGUSR2), Backups, Restoring a backup, What a backup holds, Writing a backup, 15. Backups and browser (+5 more)

### Community 201 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 209 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 211 - "header.ts"
Cohesion: 0.26
Nodes (11): blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes(), encodeCompact() (+3 more)

### Community 214 - "openssl"
Cohesion: 0.20
Nodes (11): locked(), openssl(), 6. Nix — nixpkgs packages (from the locked nixpkgs), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known (+3 more)

### Community 215 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 246 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 252 - "host-signal.ts"
Cohesion: 0.32
Nodes (5): isAbortSignal(), followSignal(), isSignal(), ABORTED, REASON

### Community 254 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 271 - "v9"
Cohesion: 0.47
Nodes (5): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 282 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 329 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 52 - "history"
Cohesion: 0.04
Nodes (66): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+58 more)

### Community 68 - ".put"
Cohesion: 0.04
Nodes (51): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+43 more)

### Community 74 - "version"
Cohesion: 0.04
Nodes (50): side(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules (+42 more)

### Community 84 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.10
Nodes (28): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed(), ledgerV8NodeEntry() (+20 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 99 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+29 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 123 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 133 - "README.md"
Cohesion: 0.08
Nodes (19): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:, Choosing a database (+11 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 141 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.07
Nodes (21): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+13 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 144 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 150 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 160 - "Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.09
Nodes (21): 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words, 4.1 Reachability does not depend on the form (+13 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 162 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 169 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.11
Nodes (18): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7), Rework (class 1 — infra) (+10 more)

### Community 173 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 174 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 179 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 180 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 183 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 186 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 192 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 193 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+6 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 198 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 199 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 204 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 205 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 207 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 208 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 213 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 217 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 218 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 219 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 220 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 221 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 222 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 223 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 225 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 226 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 227 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 230 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 231 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 232 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 233 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 234 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-4 Every field is data, operational or secret, Scenario: A function in the configuration, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: A user module from the configuration file, Scenario: Two `core` revisions with different databases (+1 more)

### Community 235 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 236 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 237 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 239 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 240 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 241 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 242 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 243 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 245 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 247 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 248 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 249 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 250 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 253 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 255 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 256 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 257 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 258 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 259 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 260 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 261 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 263 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 266 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 267 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 268 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 269 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 270 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 272 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 273 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 274 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 275 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 276 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 277 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 278 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 279 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 280 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 281 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 283 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 284 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 285 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 286 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 287 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 288 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 289 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 290 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 291 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 292 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 293 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 294 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 295 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 296 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

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

### Community 306 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 307 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 308 - "00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it"
Cohesion: 0.40
Nodes (4): 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it, Evidence, Problem, Suggested fix

### Community 309 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 310 - "00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why"
Cohesion: 0.40
Nodes (4): 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why, Evidence, Problem, Suggested fix

### Community 311 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 312 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 313 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 314 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 315 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 316 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 317 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

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

### Community 325 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 326 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 327 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 87 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+31 more)

### Community 94 - "package.json"
Cohesion: 0.05
Nodes (39): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+31 more)

### Community 96 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning, Requirement: load and history read a consistent snapshot immune to a concurrently-committing prune (+30 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-3339`, `RFC-8949`, `RFC-3339` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4326 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `column-rules.ts`, `startUmbraDB`, `ref_node_fs`, `InMemoryBlockSource`, `client.test.ts`, `UmbraError`, `admin-harness.ts`, `ingest-harness.ts`, `adapter-fixtures.ts`, `loop-stop-harness.ts`, `cbor.ts`, `host.ts`, `sweep-tapes.ts`, `db/errors.ts`, `binding.test.ts`, `core-private-source.test.ts`, `NodeClient`, `core-config.test.ts`, `api.ts`, `module-api.ts`, `tape/index.ts`, `core-block-parsed.ts`, `validate.ts`, `core-transport.ts`, `ledger/types.ts`, `channel-queue.test.ts`, `runner/process.ts`, `resolve.ts`, `config/history.ts`, `order.property.test.ts`, `cli/command.ts`, `BlockWriteHandle`, `database-parts.ts`, `loop.test.ts`, `hex`, `Process`, `builds.ts`, `openPostgres`, `contract-data-checks.ts`, `contract-modules.test.ts`, `messages.ts`, `chain-placement.test.ts`, `.read`, `admin/configuration.ts`, `version-checks.ts`, `core-ledger-state.ts`, `config-check.ts`, `node-set.test.ts`, `declaration.ts`, `process-harness.ts`, `node.test.ts`, `boundary.test.ts`, `refcount-model.ts`, `loop.ts`, `ledger-sweep.test.ts`, `interfaces/transaction-history-storage.ts`, `private/lockstep-wait.test.ts`, `networks.ts`, `core-ledger-state/sql.ts`, `transform-checks.ts`, `module-api.test.ts`, `slow-block-harness.ts`, `code`, `validation.ts`, `real-tapes.ts`, `chain-events-decode.test.ts`, `config/plain-data.ts`, `transport.test.ts`, `retirement.test.ts`, `backup/backup.ts`, `api-server.test.ts`, `mapping.ts`, `cold-boot-recovery.integration.test.ts`, `pglite-lock.ts`, `sweep-fixture.test.ts`, `package.json`, `refcount-conversion.ts`, `ledger-refcount-backup.test.ts`, `transaction-history-storage.property.test.ts`, `browser.test.ts`, `Worker`, `pg-tx-history-adapter.ts`, `release-version.ts`, `core.ts`, `browser/build.ts`, `shims.test.ts`, `resolver-boundary.ts`, `code-registry.ts`, `containers.test.ts`, `test/postgres/setup.ts`, `refcount-step.test.ts`, `refcount-tapes.ts`, `documents.ts`, `src/ledger/identity.ts`, `read-gate.ts`, `example-checks.ts`, `crash.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `surface.test.ts`, `node-bridge.ts`, `recovery.test.ts`, `core-block-fetch.test.ts`, `library-documents.test.ts`, `manifest.ts`, `checks.test.ts`, `key-handling-checks.ts`, `cli/run.ts`, `text.test.ts`, `validation.test.ts`, `excluded-not-exported.test.ts`, `LoopPauses`, `ledger-liveness.test.ts`, `core-block-commit.test.ts`, `read-height.property.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `twox.ts`, `ws-mutual-tls.test.ts`, `history.property.test.ts`, `ledger/plain-data.ts`, `host-signal.ts`?**
  _High betweenness centrality (0.203) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `column-rules.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01542736929589902 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `column-rules.ts`, `startUmbraDB`, `ref_node_fs`, `InMemoryBlockSource`, `client.test.ts`, `admin-harness.ts`, `ingest-harness.ts`, `loop-stop-harness.ts`, `cbor.ts`, `host.ts`, `sweep-tapes.ts`, `db/errors.ts`, `binding.test.ts`, `core-private-source.test.ts`, `NodeClient`, `api.ts`, `module-api.ts`, `tape/index.ts`, `FinalizedLoop`, `core-block-parsed.ts`, `validate.ts`, `core-transport.ts`, `ledger/types.ts`, `channel-queue.test.ts`, `runner/process.ts`, `resolve.ts`, `config/history.ts`, `order.property.test.ts`, `cli/command.ts`, `BlockWriteHandle`, `database-parts.ts`, `loop.test.ts`, `Process`, `openPostgres`, `contract-modules.test.ts`, `NodeBlockSource`, `messages.ts`, `.read`, `admin/configuration.ts`, `version-checks.ts`, `core-ledger-state.ts`, `range.ts`, `config-check.ts`, `node-set.test.ts`, `declaration.ts`, `process-harness.ts`, `loop.ts`, `private/lockstep-wait.test.ts`, `networks.ts`, `core-ledger-state/sql.ts`, `transform-checks.ts`, `module-api.test.ts`, `slow-block-harness.ts`, `validation.ts`, `config/plain-data.ts`, `transport.test.ts`, `checkShape`, `graph.ts`, `backup/backup.ts`, `api-server.test.ts`, `mapping.ts`, `pglite-lock.ts`, `BlockRef`, `shims.test.ts`, `refcount-step.test.ts`, `src/ledger/identity.ts`, `backup/restore.ts`, `following`, `manifest.ts`, `checks.test.ts`, `options.ts`, `validation.test.ts`, `earlier-build.ts`, `core-block-commit.test.ts`, `statementsOf`, `backupAtStop`, `browser/src/config/load.ts`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `startUmbraDB` be split into smaller, more focused modules?**
  _Cohesion score 0.017193928216768337 - nodes in this community are weakly interconnected._