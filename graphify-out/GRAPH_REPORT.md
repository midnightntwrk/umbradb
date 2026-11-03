# Graph Report - UmbraDB

## Corpus Check
- 1288 files · ~1,823,707 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 13318 nodes · 41673 edges · 378 communities (345 shown, 33 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3470 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `3153920d6d5befd2` (1288 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- opt-out.test.ts
- runner/process.ts
- config/history.ts
- real-tapes.ts
- InMemoryBlockSource
- pglite-lock.ts
- config-hash-checks.ts
- worker-storage.test.ts
- containers.test.ts
- order.property.test.ts
- refcount-tapes.ts
- version-checks.ts
- browser/build.ts
- Worker
- cold-boot-recovery.integration.test.ts
- NodeClient
- networks.ts
- page.ts
- release-version.ts
- core.ts
- cbor.property.test.ts
- node-fields-harness.ts
- TransactionHistoryEntry
- ref_node_fs
- cli/command.ts
- code-registry.ts
- ledger/ledger-tasks.test.ts
- test/postgres/setup.ts
- refcount-step.test.ts
- documents.ts
- crash.test.ts
- interfaces/transaction-history-storage.ts
- module-api.ts
- pg-tx-history-adapter.ts
- read-gate.ts
- recovery.test.ts
- fixtures/configuration.ts
- validation.test.ts
- readiness.test.ts
- node-set.ts
- vitest
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- restore-private.ts
- node-bridge.ts
- vendored-ledger-v9.test.ts
- surface.test.ts
- adapter-fixtures.ts
- mapping.ts
- snapshot.test.ts
- pack-install.mjs
- .query
- ledger/metadata.ts
- validation.ts
- process-worker.ts
- backbone/part-migrations.test.ts
- library-documents.test.ts
- version-table.ts
- worker-host.test.ts
- builder.test.ts
- key-handling-checks.ts
- shims.test.ts
- Buffer
- lockstep-refusals.test.ts
- channel-queue.test.ts
- core-block-fetch.test.ts
- checkShape
- FakeNode
- api.ts
- ledger-storage.test.ts
- cursor-table.property.test.ts
- LoopPauses
- node-key-tapes.ts
- statementsOf
- browser.test.ts
- web-lock.ts
- no-indexer-or-wallet-sdk.test.ts
- browser/src/config/load.ts
- checkParent
- mounted-admin.test.ts
- ws-mutual-tls.test.ts
- configuration-refusal.ts
- history.property.test.ts
- loop-stop-harness.ts
- Design — Sprint 1: project setup + TemporalKV
- sweep-fixture.ts
- TapeAnswers
- sha256
- in-memory-source.ts
- messages.ts
- signal-backup.worker.ts
- ledger/plain-data.ts
- UmbraError
- vendored-ledger-files.test.ts
- FinalizedLoop
- mutation-evidence.d.mts
- AsyncLocalStorage
- loop.test.ts
- MessagePortLike
- migrate.ts
- refused-configuration.test.ts
- entries.ts
- process-build.ts
- transport-faults.test.ts
- pause-fixtures.ts
- PageState
- adapter.ts
- NodeFS
- Keeping
- node-format.ts
- contract-modules.test.ts
- api-server.test.ts
- process-backends.ts
- fetch-fixtures.ts
- start-umbradb.ts
- ledger/types.ts
- LedgerPackage
- library/modules.test.ts
- sweep-tapes.ts
- core-config.test.ts
- NodeBlockSource
- writer-lock-checks.ts
- core-ledger-state.ts
- Process
- backup/restore.ts
- database-parts.ts
- builders.test.ts
- contract-data-checks.ts
- column-rules.ts
- binding.test.ts
- core-block-parsed.ts
- process-admin.ts
- loop.ts
- paused-harness.ts
- tape/index.ts
- host.ts
- slow-block-harness.ts
- node-set.test.ts
- 12. Ledger
- refcount-restart.ts
- core-channels.ts
- declaration.ts
- refcount-model.ts
- PgTransactionHistoryStorage
- client.test.ts
- core-ledger-state/sql.ts
- column-rules.test.ts
- cbor.ts
- boundary.test.ts
- server.ts
- BlockRef
- ledger-sweep.test.ts
- graph.ts
- builds.ts
- postgres/transaction-history-storage.ts
- resolver-boundary.ts
- core-chain-events.ts
- ingest
- chain-process.test.ts
- range.ts
- file-mode.test.ts
- validate.test.ts
- retirement.test.ts
- startUmbraDB
- core-settings.ts
- ModuleDeclaration
- refcount-conversion.ts
- .value
- BACKENDS
- height-versioned.test.ts
- private/lockstep-wait.test.ts
- admin-harness.ts
- node-source.ts
- core-block-commit.test.ts
- Design — Sprint 3: CheckpointStore
- 7. Storage helpers
- .configHash
- ADDED Requirements
- .off
- graph.py
- .from
- UmbraDB module guide
- data
- T
- .slowBlockMs
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- refused
- .boolean
- .disconnect
- conformance-gate.mjs
- mutation-per-adapter.mjs
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- twox.ts
- Design — v1.1.0: Quint model checking
- v9
- openssl
- facade-merge-loader.ts
- scoped-review-manifest
- following
- path.ts
- test-processes.test.ts
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- host-signal.ts
- orphan-watcher.mjs
- fresh-instance.mjs
- package-keys-walk.mjs
- crash-worker.ts
- .put
- code
- history
- ADDED Requirements
- ADDED Requirements
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
- ADDED Requirements
- Requirements
- ADDED Requirements
- ADDED Requirements
- Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Boundaries, threats and controls
- Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- Requirement: BK-1 Backup
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Requirement: DT-3 The contents hash
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- build-modules.ts
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- try.sh
- ADDED Requirements
- Tasks — START-UMBRADB: UmbraDB as a library
- Tasks — v1.0.0-infosec-signoff
- Repository agent policy
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Requirement: BK-3 Restore into an empty database, checked before and after loading
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.1.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.1.0: Formal completion (`formal-completion`)
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00054 — A slow-block test hung inside PGlite for over an hour
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Tasks — Sprint 2: Transaction/Lease
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
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
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
- 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs
- 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- Vendored ledger builds
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
- README.md

## God Nodes (most connected - your core abstractions)
1. `vitest` - 465 edges
2. `UmbraError` - 357 edges
3. `ModuleDeclaration` - 211 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 139 edges
6. `NodeClient` - 116 edges
7. `Database` - 105 edges
8. `BlockRef` - 105 edges
9. `startUmbraDB()` - 103 edges
10. `PROCESS_BACKENDS` - 102 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts
- `Impact` --references--> `contentsHash()`  [INFERRED]
  openspec/changes/ledger-refcount/proposal.md → src/determinism/contents-hash.ts

## Import Cycles
- None detected.

## Communities (378 total, 33 thin omitted)

### Community 0 - "opt-out.test.ts"
Cohesion: 0.02
Nodes (220): TableDigest, TableDigestRow, DumpInput, CaptureColumn, CapturedTable, CaptureState, SchemaPlan, CanonicalEncodingError (+212 more)

### Community 1 - "runner/process.ts"
Cohesion: 0.02
Nodes (221): ConfigFacts, OpenedConfig, RevisionSettings, EntryView, RecordedView, CoreChainFacts, NodeWait, ChainIdentity (+213 more)

### Community 10 - "config/history.ts"
Cohesion: 0.03
Nodes (131): OpenedFacts, CoreVersion, CoreSettings, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding, HistoryOptions (+123 more)

### Community 102 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 103 - "InMemoryBlockSource"
Cohesion: 0.08
Nodes (24): InMemoryBlockSource, Flaky, RestoreJob, ProcessObservation, StartVia, HookedSource, PlainSubclass, failingSource() (+16 more)

### Community 104 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (31): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, ChildResult, acquirePgliteLock() (+23 more)

### Community 105 - "config-hash-checks.ts"
Cohesion: 0.07
Nodes (20): Report, a162Run, HeaderSeen, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, a162Problems() (+12 more)

### Community 107 - "worker-storage.test.ts"
Cohesion: 0.07
Nodes (27): StoredNode, AdapterWorkerRequest, OracleState, OracleVersion, StagenetBlockJson, StagenetFixtureJson, Nodes, hex() (+19 more)

### Community 108 - "containers.test.ts"
Cohesion: 0.07
Nodes (28): BenchEnv, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer() (+20 more)

### Community 11 - "order.property.test.ts"
Cohesion: 0.03
Nodes (115): GraphInput, PointRun, MisuseListener, PastFaultCase, RefusalCase, Seen, Recorder, RunnerBackend (+107 more)

### Community 111 - "refcount-tapes.ts"
Cohesion: 0.09
Nodes (22): StoredCheck, Reader, RefcountTape, Sampler, TapeReplay, FoundTape, coreLedgerState(), sweepTapeCase() (+14 more)

### Community 112 - "version-checks.ts"
Cohesion: 0.13
Nodes (31): Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk, Answers (+23 more)

### Community 113 - "browser/build.ts"
Cohesion: 0.07
Nodes (28): BrowserBuild, BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common() (+20 more)

### Community 114 - "Worker"
Cohesion: 0.07
Nodes (15): Listener, Worker, Scope, Worker, FakeWorker, Listener, runEntry(), isMainThread (+7 more)

### Community 118 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (23): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+15 more)

### Community 12 - "NodeClient"
Cohesion: 0.04
Nodes (82): CoreChainBinding, FinalizedHeightOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription (+74 more)

### Community 120 - "networks.ts"
Cohesion: 0.07
Nodes (33): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+25 more)

### Community 121 - "page.ts"
Cohesion: 0.07
Nodes (30): ApiChannel, LinkRecord, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp(), beginCore() (+22 more)

### Community 124 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 125 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 127 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 128 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (27): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+19 more)

### Community 129 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 13 - "ref_node_fs"
Cohesion: 0.05
Nodes (88): RestoreInput, recordedGenesis, BackupBackend, BackupDatabase, killedRestore, TickerHandle, FileRow, ledgerBackup (+80 more)

### Community 130 - "cli/command.ts"
Cohesion: 0.10
Nodes (25): CommandHandler, CommandIo, MainProcess, CommandResult, main(), pageHandler(), backupCommand(), checkArguments() (+17 more)

### Community 131 - "code-registry.ts"
Cohesion: 0.10
Nodes (30): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, changeTasks(), allTasks(), input() (+22 more)

### Community 134 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.09
Nodes (24): LedgerTask, EngineOptions, bindLedgerTasks(), boundHost(), frozen(), hasLedgerTasks(), resultsOf(), withItems() (+16 more)

### Community 135 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 136 - "refcount-step.test.ts"
Cohesion: 0.10
Nodes (22): ComputedBlock, refcountStep, RefcountTables, RefcountBatch, Given, Halt, Outcome, bytesOf() (+14 more)

### Community 137 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 138 - "crash.test.ts"
Cohesion: 0.11
Nodes (24): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+16 more)

### Community 139 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (22): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+14 more)

### Community 14 - "module-api.ts"
Cohesion: 0.04
Nodes (95): coreHeaders, HeadersArgument, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler (+87 more)

### Community 140 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 142 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 143 - "recovery.test.ts"
Cohesion: 0.12
Nodes (20): Armed, CommitArm, CommitFault, CommitProxy, Pair, Fault, holds(), committedProblems() (+12 more)

### Community 144 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (21): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+13 more)

### Community 145 - "validation.test.ts"
Cohesion: 0.09
Nodes (20): ErrorCode, DeclarationRule, Case, ShapeCase, Stats, schemaName(), first(), validateWith() (+12 more)

### Community 146 - "readiness.test.ts"
Cohesion: 0.12
Nodes (22): ReadinessFacts, LifecycleStatus, ProcessState, Decision, ReadinessCase, readinessOf(), ae4(), caseText() (+14 more)

### Community 149 - "node-set.ts"
Cohesion: 0.15
Nodes (15): NodeSetFault, NodeSetOptions, NodeTableCheck, nodeKeys, ChildReader, ChildVisitor, first(), hexOf() (+7 more)

### Community 15 - "vitest"
Cohesion: 0.02
Nodes (91): Child, ParentJob, Kill, Orphaned, SourceFile, Job, Lockfile, Manifest (+83 more)

### Community 150 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 151 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 152 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 155 - "restore-private.ts"
Cohesion: 0.16
Nodes (21): RestoreOutcome, FileProcess, privateBackup, PublicSetting, PublicSideOptions, privateConfig(), heightsFrom(), pmModule() (+13 more)

### Community 156 - "node-bridge.ts"
Cohesion: 0.12
Nodes (19): NodeStore, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 157 - "vendored-ledger-v9.test.ts"
Cohesion: 0.16
Nodes (23): NodeRoot, freeAll(), bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free() (+15 more)

### Community 158 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 16 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (99): ApplyInput, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+91 more)

### Community 160 - "mapping.ts"
Cohesion: 0.13
Nodes (22): ResultType, arrayLiteral(), hexOf(), isInfinity(), malformed(), malformedArray(), parseArrayText(), parseBigint() (+14 more)

### Community 163 - "snapshot.test.ts"
Cohesion: 0.12
Nodes (21): AllowedDetail, StatusFacts, configOf(), entryView(), hex(), originOf(), recordedView(), errorMessage() (+13 more)

### Community 165 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 166 - ".query"
Cohesion: 0.14
Nodes (18): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), snapshot(), "on-after-db-write"() (+10 more)

### Community 168 - "ledger/metadata.ts"
Cohesion: 0.14
Nodes (8): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, contentStateOf(), hexOf(), walkOver()

### Community 169 - "validation.ts"
Cohesion: 0.09
Nodes (22): PlacedDeclaration, Plain, FIELD_KINDS, LIFETIMES, TABLE_KINDS, badId, CONTENT_PROPERTIES, DECLARATION_PROPERTIES (+14 more)

### Community 17 - "process-worker.ts"
Cohesion: 0.03
Nodes (93): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestMigration, ManifestTool (+85 more)

### Community 170 - "backbone/part-migrations.test.ts"
Cohesion: 0.17
Nodes (17): FoldedPart, RecordedMigration, earlierBackup(), earlierBootstrapSql(), earlierRefusalProblems(), earlierRows(), earlierRowsSql(), recorded() (+9 more)

### Community 177 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 178 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 179 - "worker-host.test.ts"
Cohesion: 0.12
Nodes (17): SlowStep, TestLoaderData, beat(), countDeserializations(), hexOf(), loadLedger(), applyBlock(), at() (+9 more)

### Community 18 - "builder.test.ts"
Cohesion: 0.03
Nodes (51): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step, Frame (+43 more)

### Community 180 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 181 - "shims.test.ts"
Cohesion: 0.15
Nodes (13): ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker, connectLink() (+5 more)

### Community 182 - "Buffer"
Cohesion: 0.15
Nodes (13): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+5 more)

### Community 184 - "lockstep-refusals.test.ts"
Cohesion: 0.22
Nodes (18): LockstepCondition, A118Observation, MismatchObservation, a118Problems(), a118Run(), coreOn(), haltOf(), json() (+10 more)

### Community 19 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (89): demoLink, EndpointOptions, Envelope, LinkTimers, PrivateLinkChannel, CoreChannelSeams, Received, TransportLimits (+81 more)

### Community 190 - "core-block-fetch.test.ts"
Cohesion: 0.13
Nodes (8): LedgerTable, coreBlockFetchOnFetch(), isBlockItemSource(), chainBackbone(), BOUND, CORE_BLOCK_FETCH_ID, CORE_BLOCK_ITEMS, KNOWN_NETWORKS

### Community 193 - "checkShape"
Cohesion: 0.31
Nodes (10): Shape, checkContentDefined(), checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted() (+2 more)

### Community 2 - "api.ts"
Cohesion: 0.02
Nodes (155): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresParts (+147 more)

### Community 20 - "ledger-storage.test.ts"
Cohesion: 0.04
Nodes (98): Call, SeenLoad, RestartEvent, RestartJob, retentionSeen, ledgerScenario, LedgerTx, WindowBackup (+90 more)

### Community 200 - "cursor-table.property.test.ts"
Cohesion: 0.16
Nodes (16): CursorValue, Access, Block, BlockFails, Counts, Write, canonicalText(), expectValue() (+8 more)

### Community 202 - "LoopPauses"
Cohesion: 0.19
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 203 - "node-key-tapes.ts"
Cohesion: 0.20
Nodes (10): NodeKeyTape, Written, checkTape(), devnetSettings(), nodeKeyTapeTest(), recording(), walkInFreshInstance(), backend (+2 more)

### Community 209 - "statementsOf"
Cohesion: 0.25
Nodes (10): MetaCommands, Piece, State, StatementSplitter, checkStatement(), checkStatements(), statementsOf(), check() (+2 more)

### Community 21 - "browser.test.ts"
Cohesion: 0.04
Nodes (79): Reachable, RestoreAttempt, PageApiChannel, PageBackup, pageBench, PageEvent, PageLink, PageRestore (+71 more)

### Community 210 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 217 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 218 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 219 - "checkParent"
Cohesion: 0.19
Nodes (11): AlwaysLanded, checkParent(), sameBytes(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix, 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first (+3 more)

### Community 22 - "mounted-admin.test.ts"
Cohesion: 0.04
Nodes (81): AdminRun, gate, Observation, SecretHashes, SecretVariant, Compared, ConnectSeen, PortPeer (+73 more)

### Community 223 - "ws-mutual-tls.test.ts"
Cohesion: 0.21
Nodes (8): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), read(), tlsClientErrors

### Community 224 - "configuration-refusal.ts"
Cohesion: 0.26
Nodes (12): ConfigFinding, configurationFindings(), configurationRefusalLines(), isConfigurationRefusal(), messageOf(), redactedFindings(), redactedFindingText(), redactedValue() (+4 more)

### Community 225 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 23 - "loop-stop-harness.ts"
Cohesion: 0.05
Nodes (85): watched, ChangedFile, GenesisFixture, installationCopy, StartPackageProcess, A169Observation, LoopStopScenario, SourceOf (+77 more)

### Community 237 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.20
Nodes (10): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+2 more)

### Community 24 - "sweep-fixture.ts"
Cohesion: 0.04
Nodes (90): CoreLedgerStateOptions, RefcountCheck, RefcountFault, FixtureRunOptions, Fault, FaultRun, refcountModelStep, DagRunOptions (+82 more)

### Community 242 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 243 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 25 - "in-memory-source.ts"
Cohesion: 0.03
Nodes (78): BlockHeaderItem, BlockItemSource, CoreBlockHeader, CoreBlockItems, BlockSource, FinalityStallCondition, InMemoryItems, Wait (+70 more)

### Community 26 - "messages.ts"
Cohesion: 0.03
Nodes (60): PublicSide, coreSessions, LinkConnection, Committed, HelloAck, JsonValue, MessageFault, Parsed (+52 more)

### Community 262 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 269 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 27 - "UmbraError"
Cohesion: 0.04
Nodes (42): PostgresConnection, PostgresOptions, JobQueue, PgliteDatabase, BoundedRead, ReadPool, Session, Writer (+34 more)

### Community 270 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 28 - "FinalizedLoop"
Cohesion: 0.04
Nodes (23): EntryBoundary, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction (+15 more)

### Community 281 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 29 - "loop.test.ts"
Cohesion: 0.04
Nodes (68): EntryRange, LockstepWait, LoopEnd, SlowBlockEvent, SlowWindow, WaitingInRead, Contexts, SilentHalt (+60 more)

### Community 3 - "migrate.ts"
Cohesion: 0.02
Nodes (176): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, CheckedMigration (+168 more)

### Community 30 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (69): EngineConfig, Refusal, Start, Renamed, RunningCommand, statsConfig, runProcessCommand(), ask() (+61 more)

### Community 31 - "entries.ts"
Cohesion: 0.03
Nodes (70): RunOptions, RunSeams, SignalSource, stopSignal, TransportReader, coreEntry, CoreEntryInput, CoreSettingsBase (+62 more)

### Community 32 - "process-build.ts"
Cohesion: 0.04
Nodes (66): ProcessingEnd, ProcessStatus, Job, PackageStartup, A43Observation, Halt, ProcessDatabase, CoreSeen (+58 more)

### Community 33 - "transport-faults.test.ts"
Cohesion: 0.04
Nodes (63): PrivateLinkAddress, ResultColumn, Connected, CoreTransport, CoreTransportOptions, CoreLink, LinkSession, TransportTls (+55 more)

### Community 34 - "pause-fixtures.ts"
Cohesion: 0.04
Nodes (68): backupSignalRelay, BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable, PausableConfig, PausableOptions (+60 more)

### Community 35 - "adapter.ts"
Cohesion: 0.04
Nodes (67): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+59 more)

### Community 36 - "node-format.ts"
Cohesion: 0.05
Nodes (56): Node, GeneratedBlock, GeneratedState, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader (+48 more)

### Community 37 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (67): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+59 more)

### Community 38 - "api-server.test.ts"
Cohesion: 0.04
Nodes (57): ChainDataAnswer, ChainDataView, HttpHandler, HttpRoute, AcceptsDuplicates, AddsExtensions, AddsHeaders, AppendsVersion (+49 more)

### Community 39 - "process-backends.ts"
Cohesion: 0.07
Nodes (59): NodeBatch, FixtureRun, SourceClass, dagHistory, FacetOptions, Facets, NodeSetCache, tapeDeterminism (+51 more)

### Community 4 - "fetch-fixtures.ts"
Cohesion: 0.02
Nodes (189): BlockParsed, ProcessCondition, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec (+181 more)

### Community 40 - "start-umbradb.ts"
Cohesion: 0.06
Nodes (72): Finding, readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBHandle, UmbraDBNetwork (+64 more)

### Community 41 - "ledger/types.ts"
Cohesion: 0.06
Nodes (51): LoadLedger, TransactionParser, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerSource, LedgerSourceSettings, LedgerPackageOptions (+43 more)

### Community 42 - "LedgerPackage"
Cohesion: 0.06
Nodes (35): LedgerPackage, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, Driver, hexOf(), idOf() (+27 more)

### Community 43 - "library/modules.test.ts"
Cohesion: 0.04
Nodes (48): CloseHelper, Hold, Signal, FaultedClose, QuietResult, Job, ModuleListRule, OwnWords (+40 more)

### Community 44 - "sweep-tapes.ts"
Cohesion: 0.06
Nodes (64): contentsHash, FileEntries, Cbor, DigestRow, DigestRows, Reader, ReadableDatabase, conversionRun (+56 more)

### Community 45 - "core-config.test.ts"
Cohesion: 0.06
Nodes (53): adminRoutes, AdminEndpoint, AdminPart, AdminView, CoreLedgerVersion, LedgerPackageIdentity, answerAdmin(), frozenMap() (+45 more)

### Community 46 - "NodeBlockSource"
Cohesion: 0.06
Nodes (23): HeadWait, NodeBlockSource, NodeHeader, PreparedBlock, QueueRunner, EventsRunner, NoWindow, Refetches (+15 more)

### Community 47 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (58): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, Outcome, WriterSession, WriterStart (+50 more)

### Community 48 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (55): BlockLedgerSource, LedgerBinding, retainedStates, CoreRevision, bindLedgerParser(), boundLedgerParser(), applyBlock(), bindCoreLedgerState() (+47 more)

### Community 49 - "Process"
Cohesion: 0.06
Nodes (11): RetryCode, PauseHold, Process, RetryCondition, SignalTarget, openedCursorHeight(), messageOf(), get() (+3 more)

### Community 5 - "backup/restore.ts"
Cohesion: 0.02
Nodes (138): Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, WaitingListener, ConfigRow, PrivateBlockSource (+130 more)

### Community 51 - "database-parts.ts"
Cohesion: 0.04
Nodes (47): CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState (+39 more)

### Community 52 - "builders.test.ts"
Cohesion: 0.05
Nodes (46): DatabasePartsInput, Entry, Served, Accepts, ConfigOf, CoreSettingsGiven, Minimal, PricesSettings (+38 more)

### Community 53 - "contract-data-checks.ts"
Cohesion: 0.08
Nodes (59): CoreContractStatesOptions, ContractStateRow, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+51 more)

### Community 54 - "column-rules.ts"
Cohesion: 0.04
Nodes (67): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+59 more)

### Community 55 - "binding.test.ts"
Cohesion: 0.06
Nodes (46): startHashDecision, A165Options, a165Run, Attempt, TestDatabase, A113Observation, A156Observation, Binding (+38 more)

### Community 56 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (58): BodyExtrinsic, BlockBody, BlockTransaction, ChainTransaction, EventPhase, blockBodyOf(), blockParsedItemOf(), blockParsedOf() (+50 more)

### Community 57 - "process-admin.ts"
Cohesion: 0.06
Nodes (46): NetworkShown, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, AdminServer, AdminStarter, DigestRow, ModuleFacts (+38 more)

### Community 58 - "loop.ts"
Cohesion: 0.07
Nodes (52): PointName, HeightRange, LateUse, Callback, CallbackFailure, ParallelPoint, PointSchedule, ProcessReason (+44 more)

### Community 59 - "paused-harness.ts"
Cohesion: 0.06
Nodes (51): ImportedConfig, LoadOptions, Body, KeeperGlobals, PausedExpectation, Read, Reader, configModules() (+43 more)

### Community 6 - "tape/index.ts"
Cohesion: 0.03
Nodes (121): Recorded, Failure, Variant, Link, TapeBuilderOptions, RecordingError, RecordingProblem, TapeError (+113 more)

### Community 60 - "host.ts"
Cohesion: 0.06
Nodes (48): LedgerStateItem, LedgerName, ApplyOutput, ChainOutcome, LedgerTaskBlock, StateSummary, AppliedState, ApplyBlock (+40 more)

### Community 61 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (51): HeightActivity, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, Observed (+43 more)

### Community 62 - "node-set.test.ts"
Cohesion: 0.05
Nodes (51): ContentDefinition, ContentDefinedBuildOptions, StoredRow, Tables, Tables, contentDefinedLedgerState(), countsAndQueue(), writeCountsAndQueue() (+43 more)

### Community 63 - "12. Ledger"
Cohesion: 0.07
Nodes (39): RetainedState, EvictionRefused, LedgerHost, LedgerWorkerFailure, NodeDatabase, NodeReader, workerParser(), computeBlock() (+31 more)

### Community 64 - "refcount-restart.ts"
Cohesion: 0.06
Nodes (49): BatchJson, databaseNow, Hold, Light, Line, NodeSetKeeper, observedRun, RestartChain (+41 more)

### Community 65 - "core-channels.ts"
Cohesion: 0.07
Nodes (28): ChannelEndpoint, EndpointEvents, CoreChannels, CoreChannelsOptions, Queued, CoreSessionOptions, Session, Hello (+20 more)

### Community 66 - "declaration.ts"
Cohesion: 0.06
Nodes (39): UmbraConfig, OwnPart, heightVersionedTable, HeightVersionedTableOptions, ApiRegistry, BlockContext, BlockHeader, FieldKind (+31 more)

### Community 67 - "refcount-model.ts"
Cohesion: 0.07
Nodes (33): BlockKind, BlockScript, BoundaryRewrite, Dice, DrivenBlock, GraphNode, GraphWorld, HistoryScript (+25 more)

### Community 68 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (52): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema (+44 more)

### Community 7 - "client.test.ts"
Cohesion: 0.02
Nodes (104): NodeCallOptions, NodeClientOptions, NodeRetry, ConnectSocket, NodeSocketEvents, RecordingClient, HandSocket, HandSockets (+96 more)

### Community 70 - "core-ledger-state/sql.ts"
Cohesion: 0.08
Nodes (49): KeyCounts, RefcountStatement, StateRow, StoredState, GreyView, SweepPhase, chunksOf(), invalid() (+41 more)

### Community 72 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+24 more)

### Community 73 - "cbor.ts"
Cohesion: 0.08
Nodes (46): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+38 more)

### Community 74 - "boundary.test.ts"
Cohesion: 0.08
Nodes (45): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+37 more)

### Community 75 - "server.ts"
Cohesion: 0.06
Nodes (37): MountedAdminAnswer, AdminSeams, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminStartOptions, AdminAnswer (+29 more)

### Community 76 - "BlockRef"
Cohesion: 0.06
Nodes (27): QueuedBlock, BlockItems, BlockRef, InMemorySourceOptions, CommitOutcome, HeldHeight, Fetching, Recorder (+19 more)

### Community 77 - "ledger-sweep.test.ts"
Cohesion: 0.06
Nodes (31): GreyPicker, SweepState, SweepTables, SweepWrites, Block, MemoryTables, ModelBatch, ModelSnapshot (+23 more)

### Community 79 - "graph.ts"
Cohesion: 0.07
Nodes (49): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+41 more)

### Community 8 - "builds.ts"
Cohesion: 0.03
Nodes (111): PglitePathParts, transportReaderFacts, PublicSide, PrivateBackend, SessionSeen, PrivateProcess, PrivateRefusal, PrivateSeen (+103 more)

### Community 80 - "postgres/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (35): EntryContent, JsonEncoded, TxHistoryRow, Command, ReplayableStorage, assertStoredEntryShape(), decodeContent(), decodeRow() (+27 more)

### Community 81 - "resolver-boundary.ts"
Cohesion: 0.07
Nodes (41): TypeCheckFinding, TypeCheckResult, Finding, Access, AllowedRead, Boundary, Crossing, Guard (+33 more)

### Community 82 - "core-chain-events.ts"
Cohesion: 0.07
Nodes (41): BlockEventSource, MetadataField, MetadataVariant, Primitive, RuntimeMetadataView, BlockParsedOptions, ChainEvent, RecordTypes (+33 more)

### Community 83 - "ingest"
Cohesion: 0.08
Nodes (41): ingest, TasksRun, Segment, CallArgsItem, CallArguments, taskSeen, V9Raw, run() (+33 more)

### Community 84 - "chain-process.test.ts"
Cohesion: 0.06
Nodes (34): ProcessHandle, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+26 more)

### Community 85 - "range.ts"
Cohesion: 0.06
Nodes (43): NodeSubscription, Arguments, Command, CompletenessRange, Final, Height, RangeRecording, RangeStats (+35 more)

### Community 86 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (33): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+25 more)

### Community 87 - "validate.test.ts"
Cohesion: 0.06
Nodes (37): ConfigRule, EntryRef, CursorRow, Expected, Row, databaseText(), findings(), checked() (+29 more)

### Community 88 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 9 - "startUmbraDB"
Cohesion: 0.02
Nodes (138): Job, Run, text(), transportReader(), transportReaderRule(), startUmbraDB(), log(), ownKeys() (+130 more)

### Community 90 - "core-settings.ts"
Cohesion: 0.05
Nodes (43): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, Absent, DeepReadonly (+35 more)

### Community 91 - "ModuleDeclaration"
Cohesion: 0.08
Nodes (21): ModuleDeclaration, Revision, ResolvedGraph, LoopInput, MisuseReports, ProcessContexts, ProcessContextsInput, ProcessItems (+13 more)

### Community 92 - "refcount-conversion.ts"
Cohesion: 0.12
Nodes (40): Touches, FixtureConfig, Reach, ContractRow, Released, storedKeep, after(), batchOf() (+32 more)

### Community 93 - ".value"
Cohesion: 0.15
Nodes (22): MetadataStorage, MetadataStorageEntry, MetadataType, TypeDef, ScaleError, ScaleReader, ValueReader, field() (+14 more)

### Community 94 - "BACKENDS"
Cohesion: 0.09
Nodes (35): Settings, Run, Job, WorkerEvent, Outcome, openBlockWrites(), expectNeverCutOffNorHung(), settings() (+27 more)

### Community 95 - "height-versioned.test.ts"
Cohesion: 0.09
Nodes (31): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+23 more)

### Community 96 - "private/lockstep-wait.test.ts"
Cohesion: 0.08
Nodes (26): InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal, OpenTransaction (+18 more)

### Community 97 - "admin-harness.ts"
Cohesion: 0.07
Nodes (38): AdminRunOptions, Answerer, Expected, Hold, Prober, ProbeRecord, TestBuildOptions, databaseReadingAdmin() (+30 more)

### Community 98 - "node-source.ts"
Cohesion: 0.07
Nodes (34): ExtrinsicCall, MetadataPallet, NodeSourceOptions, Prefetch, SourceCondition, SourceNodeView, PalletSpec, blake2b256() (+26 more)

### Community 99 - "core-block-commit.test.ts"
Cohesion: 0.08
Nodes (31): BlockRow, BlockWriteHandle, Commit, Committed, blockHeaderOf(), commitBlock(), hex(), ledgerVersionOf() (+23 more)

### Community 173 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.10
Nodes (19): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions (+11 more)

### Community 201 - "7. Storage helpers"
Cohesion: 0.12
Nodes (13): The node on `/status`, 7. Storage helpers, Requirement: AE-5 `/status` and `/config` contents, Scenario: Before the first block, MODIFIED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents (+5 more)

### Community 221 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 115 - ".off"
Cohesion: 0.05
Nodes (35): Durability, 0. Baseline and decisions, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases, Spec delta — `configuration` capability (+27 more)

### Community 117 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 133 - ".from"
Cohesion: 0.06
Nodes (30): hex(), hex(), hex(), hex(), hex(), hex(), hex(), hex() (+22 more)

### Community 161 - "UmbraDB module guide"
Cohesion: 0.08
Nodes (25): params(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations, 16. Upgrades (+17 more)

### Community 164 - "data"
Cohesion: 0.10
Nodes (24): n(), data(), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not), Rework (class 3 continued — cross-vendor cold audit, rounds 2-4), Rework (class 3 — cross-vendor audit caught real correctness defects post-self-verify), 2.1 The tables of `core-ledger-state` (+16 more)

### Community 167 - "T"
Cohesion: 0.10
Nodes (21): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 0. Schema (+13 more)

### Community 171 - ".slowBlockMs"
Cohesion: 0.11
Nodes (18): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+10 more)

### Community 175 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.10
Nodes (21): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4, 2. G9 — the four crash tests (+13 more)

### Community 183 - "refused"
Cohesion: 0.15
Nodes (18): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, Requirement: AE-3 States and conditions, Scenario: A fault of the build's declarations ends the process, Scenario: A paused loop (+10 more)

### Community 186 - ".boolean"
Cohesion: 0.12
Nodes (17): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights (+9 more)

### Community 204 - ".disconnect"
Cohesion: 0.16
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 207 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 208 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 211 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (12): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+4 more)

### Community 216 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 222 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 227 - "v9"
Cohesion: 0.20
Nodes (11): regular(), v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix, 6. Blocks, events and transactions, Requirement: CD-5 `core-block-parsed` parses each block once (+3 more)

### Community 228 - "openssl"
Cohesion: 0.20
Nodes (11): locked(), openssl(), 6. Nix — nixpkgs packages (from the locked nixpkgs), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known (+3 more)

### Community 229 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 245 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 254 - "following"
Cohesion: 0.28
Nodes (8): cursorRead(), following(), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Rework (class 4), 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began, Evidence, Problem, Suggested fix

### Community 255 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 261 - "test-processes.test.ts"
Cohesion: 0.28
Nodes (7): namesRunner(), runnerStarts(), sources(), valueNames(), REPOSITORY, RUNNER, TESTS

### Community 264 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 272 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 282 - "host-signal.ts"
Cohesion: 0.38
Nodes (4): followSignal(), isSignal(), ABORTED, REASON

### Community 300 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 337 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 338 - "package-keys-walk.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 349 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 50 - ".put"
Cohesion: 0.03
Nodes (61): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+53 more)

### Community 69 - "code"
Cohesion: 0.04
Nodes (56): code(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+48 more)

### Community 78 - "history"
Cohesion: 0.05
Nodes (48): history(), Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate, Scenario: A call with an already-aborted signal is rejected before any database work, Scenario: A label given at save time is returned by history and load, Scenario: A signal aborting after the call has begun does not interrupt it, Scenario: History for one wallet+network never includes another's checkpoints (+40 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.04
Nodes (46): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract (+38 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 110 - "package.json"
Cohesion: 0.05
Nodes (39): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+31 more)

### Community 116 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load and history read a consistent snapshot immune to a concurrently-committing prune (+29 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 154 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 162 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 172 - "Design — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.09
Nodes (21): 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25), 13. Delivery order (for `tasks.md`, written after the stage-1 gate), 1. Words, 4.1 Reachability does not depend on the form (+13 more)

### Community 174 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 176 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 185 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.11
Nodes (18): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7), Rework (class 1 — infra) (+10 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 188 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 189 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 192 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (18): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+10 more)

### Community 194 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 195 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 196 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 198 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 199 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 205 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 206 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+6 more)

### Community 212 - "Requirement: BK-1 Backup"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A backup of a running PGlite process, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 213 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 214 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 215 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 220 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 226 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 230 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 231 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 232 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 233 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 234 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 235 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 236 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 238 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.18
Nodes (10): 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents, 7. `core-arch` criteria rewritten by this change, 8. Required test ids, 9. Requirement coverage (+2 more)

### Community 239 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 240 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 4. Lease non-wedge cold start (G9 / 02-T3), 5. Full-sync soak + load-under-concurrent-prune (G10), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 241 - "build-modules.ts"
Cohesion: 0.35
Nodes (4): CORE_BLOCK_FETCH, CORE_CHAIN, CORE_DIGEST, ADMIN_PARTS

### Community 244 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 246 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 247 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 248 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 249 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 250 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 251 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 252 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 253 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 256 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 257 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 258 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 259 - "Tasks — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.22
Nodes (8): 0. Baseline, 11. Close-out, 2. The private link's settings renamed (D-6; CF-4), 6. The private link over channels (LM-6; design §5.4), 7. The browser demo on the engine (LM-11; design §8), 8. The test sweep, the documents and the pack smoke (design §9; LS-1), 9. Full verification (AGENTS.md stage 3, as far as it runs locally), Tasks — START-UMBRADB: UmbraDB as a library

### Community 260 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 263 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 265 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 266 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 267 - "Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.25
Nodes (7): 0. Baseline, 1. Measurements on the recorded tapes (`design.md` §9, §13 phase 0), 6. Full verification (AGENTS.md stage 3), 7. Local preprod runs (`design.md` §12; manual evidence, never in CI), 8. Review (AGENTS.md stage 4, bounded), 9. Close-out, Tasks — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting

### Community 268 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 271 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 273 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 274 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 275 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 276 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 277 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 278 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 279 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 280 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 284 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 285 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 286 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 287 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 288 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 289 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 290 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 291 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 292 - "Tasks — Sprint 2: Transaction/Lease"
Cohesion: 0.33
Nodes (5): 0. `PgTransactionLeaseLayer` — transactions, 1. `PgTransactionLeaseLayer` — leases, 2. Wire `PgTemporalKV`'s `opts.tx`, 3. Sprint close-out, Tasks — Sprint 2: Transaction/Lease

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

### Community 301 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

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

### Community 308 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 309 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 310 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 311 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 312 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 313 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 314 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 315 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 316 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 317 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 318 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 319 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 320 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 321 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 322 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 323 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 324 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 325 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 326 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 327 - "00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it"
Cohesion: 0.40
Nodes (4): 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it, Evidence, Problem, Suggested fix

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

### Community 332 - "00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs"
Cohesion: 0.40
Nodes (4): 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs, Evidence, Problem, Suggested fix

### Community 333 - "00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container"
Cohesion: 0.40
Nodes (4): 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container, Evidence, Problem, Suggested fix

### Community 334 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 335 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 336 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 339 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 340 - "Vendored ledger builds"
Cohesion: 0.40
Nodes (4): Rebuilding, Updating a version, Vendored ledger builds, What the patches add

### Community 342 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 343 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 344 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 345 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 346 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 347 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 348 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 71 - "README.md"
Cohesion: 0.04
Nodes (43): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:, Backups and status (+35 more)

## Knowledge Gaps
- **59 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-8949`, `RFC-8949`, `RFC-3339` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4361 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `opt-out.test.ts`, `runner/process.ts`, `api.ts`, `migrate.ts`, `fetch-fixtures.ts`, `backup/restore.ts`, `tape/index.ts`, `client.test.ts`, `builds.ts`, `config/history.ts`, `order.property.test.ts`, `NodeClient`, `ref_node_fs`, `module-api.ts`, `adapter-fixtures.ts`, `process-worker.ts`, `builder.test.ts`, `channel-queue.test.ts`, `ledger-storage.test.ts`, `browser.test.ts`, `mounted-admin.test.ts`, `loop-stop-harness.ts`, `sweep-fixture.ts`, `in-memory-source.ts`, `messages.ts`, `UmbraError`, `loop.test.ts`, `refused-configuration.test.ts`, `entries.ts`, `process-build.ts`, `transport-faults.test.ts`, `pause-fixtures.ts`, `adapter.ts`, `node-format.ts`, `contract-modules.test.ts`, `api-server.test.ts`, `process-backends.ts`, `start-umbradb.ts`, `ledger/types.ts`, `library/modules.test.ts`, `sweep-tapes.ts`, `core-config.test.ts`, `NodeBlockSource`, `writer-lock-checks.ts`, `core-ledger-state.ts`, `database-parts.ts`, `builders.test.ts`, `contract-data-checks.ts`, `binding.test.ts`, `loop.ts`, `paused-harness.ts`, `host.ts`, `slow-block-harness.ts`, `node-set.test.ts`, `12. Ledger`, `refcount-restart.ts`, `declaration.ts`, `refcount-model.ts`, `core-ledger-state/sql.ts`, `column-rules.test.ts`, `boundary.test.ts`, `server.ts`, `BlockRef`, `ledger-sweep.test.ts`, `postgres/transaction-history-storage.ts`, `resolver-boundary.ts`, `core-chain-events.ts`, `ingest`, `chain-process.test.ts`, `file-mode.test.ts`, `validate.test.ts`, `retirement.test.ts`, `core-settings.ts`, `refcount-conversion.ts`, `BACKENDS`, `height-versioned.test.ts`, `private/lockstep-wait.test.ts`, `admin-harness.ts`, `node-source.ts`, `core-block-commit.test.ts`, `real-tapes.ts`, `InMemoryBlockSource`, `pglite-lock.ts`, `config-hash-checks.ts`, `worker-storage.test.ts`, `containers.test.ts`, `package.json`, `refcount-tapes.ts`, `version-checks.ts`, `browser/build.ts`, `Worker`, `cold-boot-recovery.integration.test.ts`, `networks.ts`, `release-version.ts`, `core.ts`, `cbor.property.test.ts`, `node-fields-harness.ts`, `cli/command.ts`, `code-registry.ts`, `ledger/ledger-tasks.test.ts`, `test/postgres/setup.ts`, `refcount-step.test.ts`, `documents.ts`, `crash.test.ts`, `pg-tx-history-adapter.ts`, `read-gate.ts`, `recovery.test.ts`, `validation.test.ts`, `readiness.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `restore-private.ts`, `node-bridge.ts`, `vendored-ledger-v9.test.ts`, `surface.test.ts`, `snapshot.test.ts`, `backbone/part-migrations.test.ts`, `library-documents.test.ts`, `worker-host.test.ts`, `key-handling-checks.ts`, `shims.test.ts`, `lockstep-refusals.test.ts`, `core-block-fetch.test.ts`, `excluded-not-exported.test.ts`, `cursor-table.property.test.ts`, `LoopPauses`, `node-key-tapes.ts`, `mutation-per-adapter.mjs`, `statementsOf`, `web-lock.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `ws-mutual-tls.test.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `test-processes.test.ts`, `vendored-ledger-files.test.ts`, `host-signal.ts`?**
  _High betweenness centrality (0.192) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-8949` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `opt-out.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017777378734484074 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `opt-out.test.ts`, `runner/process.ts`, `api.ts`, `migrate.ts`, `fetch-fixtures.ts`, `backup/restore.ts`, `tape/index.ts`, `client.test.ts`, `builds.ts`, `startUmbraDB`, `config/history.ts`, `order.property.test.ts`, `NodeClient`, `ref_node_fs`, `module-api.ts`, `process-worker.ts`, `channel-queue.test.ts`, `mounted-admin.test.ts`, `loop-stop-harness.ts`, `sweep-fixture.ts`, `in-memory-source.ts`, `messages.ts`, `FinalizedLoop`, `loop.test.ts`, `refused-configuration.test.ts`, `process-build.ts`, `transport-faults.test.ts`, `pause-fixtures.ts`, `contract-modules.test.ts`, `api-server.test.ts`, `start-umbradb.ts`, `ledger/types.ts`, `library/modules.test.ts`, `sweep-tapes.ts`, `NodeBlockSource`, `writer-lock-checks.ts`, `core-ledger-state.ts`, `Process`, `database-parts.ts`, `builders.test.ts`, `binding.test.ts`, `process-admin.ts`, `loop.ts`, `paused-harness.ts`, `slow-block-harness.ts`, `node-set.test.ts`, `12. Ledger`, `declaration.ts`, `core-ledger-state/sql.ts`, `cbor.ts`, `BlockRef`, `graph.ts`, `ingest`, `chain-process.test.ts`, `range.ts`, `validate.test.ts`, `ModuleDeclaration`, `BACKENDS`, `height-versioned.test.ts`, `node-source.ts`, `core-block-commit.test.ts`, `InMemoryBlockSource`, `pglite-lock.ts`, `version-checks.ts`, `refcount-step.test.ts`, `validation.test.ts`, `readiness.test.ts`, `node-set.ts`, `mapping.ts`, `snapshot.test.ts`, `ledger/metadata.ts`, `validation.ts`, `backbone/part-migrations.test.ts`, `version-table.ts`, `shims.test.ts`, `lockstep-refusals.test.ts`, `checkShape`, `web-lock.ts`, `browser/src/config/load.ts`, `checkParent`, `configuration-refusal.ts`, `sha256`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `runner/process.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017860485013769686 - nodes in this community are weakly interconnected._