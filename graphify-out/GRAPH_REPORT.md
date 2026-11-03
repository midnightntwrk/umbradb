# Graph Report - UmbraDB

## Corpus Check
- 1225 files · ~1,758,712 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12866 nodes · 39534 edges · 383 communities (344 shown, 39 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3351 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `f5a3813b1e37e393` (1225 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- opt-out.test.ts
- startUmbraDB
- core-chain-events.ts
- paused-harness.ts
- childRefKeys
- core-config.test.ts
- order.property.test.ts
- release-version.ts
- src/config/load.ts
- api-socket.ts
- browser/build.ts
- code-registry.ts
- version-checks.ts
- hex
- builds.ts
- process-context.test.ts
- ingest-faults.test.ts
- process-worker.ts
- LoopPauses
- documents.ts
- Buffer
- mapping.ts
- config/history.ts
- containers.test.ts
- crash.test.ts
- node-fields-harness.ts
- read-gate.ts
- core.ts
- fixtures/configuration.ts
- ws-mutual-tls.test.ts
- pg-tx-history-adapter.ts
- core-block-parsed.ts
- example-checks.ts
- following
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- BlockRef
- NodeClient
- surface.test.ts
- PrivateLinkChannel
- refcount-tables.test.ts
- pack-install.mjs
- node-bridge.ts
- options.ts
- messages.ts
- block-fetch-decode.test.ts
- validation.ts
- HeightRun
- CheckedEntry
- library-documents.test.ts
- vitest
- api-session.ts
- version-table.ts
- catalog.ts
- signal-ignored-fixtures.ts
- chrome.ts
- client.test.ts
- ledger/metadata.ts
- browser-harness.ts
- height-versioned.test.ts
- text.test.ts
- configuration-refusal.ts
- ref_node_fs
- GraphWorld
- signal-backup.test.ts
- source-scan.ts
- commit-proxy.ts
- checkShape
- version-selection.test.ts
- ModuleDeclaration
- fetch-fixtures.ts
- validation.test.ts
- backbone/part-migrations.test.ts
- statementsOf
- config/plain-data.ts
- ModuleApi
- runner/process.ts
- quiet-host.child.ts
- browser/serve.ts
- component-table.test.ts
- no-indexer-or-wallet-sdk.test.ts
- browser/src/config/load.ts
- tape/index.ts
- api-answers.ts
- connectChannel
- history.property.test.ts
- worker-threads-worker.ts
- .send
- host.ts
- TapeAnswers
- Worker
- db/backends.ts
- ApiRoutes
- TapeClock
- spawnChild
- ProcessItems
- channels.ts
- worker-threads.test.ts
- InMemoryBlockSource
- mutation-evidence.d.mts
- adapter.ts
- stats.ts
- AsyncLocalStorage
- LedgerPackage
- loop.ts
- worker-threads-host.ts
- channel-queue.test.ts
- range.ts
- lockstep-refusals.test.ts
- cli/command.ts
- PageApiChannel
- builder.test.ts
- SilentHalt
- NodeFS
- NodeBlockSource
- ItemsAfterWrite
- connectWebSocket
- DropsHeld
- NoRedelivery
- .from
- core-ledger-state/sql.ts
- Database
- entries.ts
- FinalizedLoop
- core-private-source.ts
- contract-data-checks.ts
- ledger/ledger-tasks.test.ts
- PgTransactionHistoryStorage
- Process
- transport-faults.test.ts
- node-format.ts
- backup/backup.ts
- UmbraError
- interfaces/transaction-history-storage.ts
- process-admin.ts
- .value
- redact.ts
- cursor-table.test.ts
- core-ledger-state.ts
- resolve.ts
- slow-block-harness.ts
- ledger/types.ts
- ledger-units.test.ts
- transform-checks.ts
- config-check.ts
- refcount-model.ts
- pause-fixtures.ts
- private/lockstep-wait.test.ts
- ledger-tapes.ts
- column-rules.ts
- column-rules.test.ts
- declaration.ts
- chain-events-decode.test.ts
- cold-boot-recovery.integration.test.ts
- core-settings.ts
- graph.ts
- transaction-history-storage.property.test.ts
- retirement.test.ts
- core-block-commit.test.ts
- readiness.test.ts
- backup/restore.ts
- cbor.ts
- src/db/postgres.ts
- page.ts
- file-mode.test.ts
- validate.test.ts
- refcount-step.test.ts
- resolver-boundary.ts
- binding.test.ts
- dispatch.test.ts
- admin-harness.ts
- core-chain.ts
- networks.ts
- test/postgres/setup.ts
- chain-placement.test.ts
- validate.ts
- cbor.property.test.ts
- browser.test.ts
- real-tapes.ts
- .configHash
- version
- refused
- core-private-source.test.ts
- graph.py
- .off
- ADDED Requirements
- Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting
- T
- .slowBlockMs
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Design — START-UMBRADB: UmbraDB as a library
- transportReader
- Boundaries, threats and controls
- boundary.test.ts
- mapping.test.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- Tasks — START-UMBRADB: UmbraDB as a library
- twox.ts
- ledger-node-write.test.ts
- UmbraDB third-party component inventory (SBOM)
- path.ts
- .boolean
- host-signal.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- api-session.test.ts
- Evidence
- history
- orphan-watcher.mjs
- crash-worker.ts
- code
- .put
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- package.json
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- UmbraDB v1.0.0 — Autonomous Run Log
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
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
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Requirement: DT-3 The contents hash
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- MODIFIED Requirements
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- scoped-review-manifest
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Repository agent policy
- Contributing
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- Requirement: BK-1 Backup
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
- Tasks — Sprint 2: Transaction/Lease
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
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
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
- 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
- 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs
- 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- start-stack.sh
- peerDependenciesMeta
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 423 edges
2. `UmbraError` - 351 edges
3. `ModuleDeclaration` - 197 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 135 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `Database` - 103 edges
9. `startUmbraDB()` - 103 edges
10. `ReadHandle` - 94 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
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

## Communities (383 total, 39 thin omitted)

### Community 0 - "opt-out.test.ts"
Cohesion: 0.02
Nodes (203): TableDigest, TableDigestRow, DumpInput, CaptureColumn, CapturedTable, CaptureState, CheckedMigration, CanonicalEncodingError (+195 more)

### Community 1 - "startUmbraDB"
Cohesion: 0.02
Nodes (187): AdminSeams, UmbraDBHandle, UmbraDBOptions, CloseHelper, EngineOptions, NetworkRuleName, gate, SecretHashes (+179 more)

### Community 10 - "core-chain-events.ts"
Cohesion: 0.03
Nodes (137): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, ingest, SeenLoad, recordedGenesis, TableSnapshot (+129 more)

### Community 104 - "paused-harness.ts"
Cohesion: 0.12
Nodes (30): Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, a176Project(), keeperModule() (+22 more)

### Community 107 - "childRefKeys"
Cohesion: 0.08
Nodes (28): ChildReader, childRefKeys(), readChildren(), 10. The halt code (O-6), 12.1 Setup, 12.2 The before-picture, 12.3 The performance comparison (O-4), 12. Local preprod runs (R23–R25) (+20 more)

### Community 11 - "core-config.test.ts"
Cohesion: 0.03
Nodes (108): OpenedConfig, MountedAdminAnswer, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminStartOptions (+100 more)

### Community 110 - "order.property.test.ts"
Cohesion: 0.09
Nodes (31): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce() (+23 more)

### Community 111 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 113 - "src/config/load.ts"
Cohesion: 0.10
Nodes (26): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, ImportedConfig, LoadOptions, BackupSignals (+18 more)

### Community 114 - "api-socket.ts"
Cohesion: 0.12
Nodes (28): coreHeaders, NodeHttpHandler, NodeUpgradeHandler, MountedApiSeams, StartedModuleApi, connectionRules, FetchHandler, ModuleApiLimits (+20 more)

### Community 115 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 116 - "code-registry.ts"
Cohesion: 0.10
Nodes (31): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, changeTasks(), allTasks(), input() (+23 more)

### Community 117 - "version-checks.ts"
Cohesion: 0.11
Nodes (24): MetadataNode, Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk (+16 more)

### Community 118 - "hex"
Cohesion: 0.13
Nodes (30): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, freeAll(), runInFreshInstance(), bigCell() (+22 more)

### Community 12 - "builds.ts"
Cohesion: 0.03
Nodes (96): AdminStarter, PrivateIntakeOptions, DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, A176Options, TickerConfig (+88 more)

### Community 120 - "process-context.test.ts"
Cohesion: 0.08
Nodes (23): MisuseListener, PublishRefusal, AcceptsDuplicates, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass, a74Problems() (+15 more)

### Community 122 - "ingest-faults.test.ts"
Cohesion: 0.08
Nodes (20): NodeCallOptions, ProcessCondition, RecordingClient, A84Observation, LoggedRetry, OutageObservation, RetrySample, isBlockEventSource() (+12 more)

### Community 123 - "process-worker.ts"
Cohesion: 0.11
Nodes (22): demoLink, Scope, crossedError, StartRun, ToProcessWorker, withDevelopmentOptIn(), answer(), backUp() (+14 more)

### Community 124 - "LoopPauses"
Cohesion: 0.08
Nodes (17): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, clock(), watched(), 1. Module layout, 2. Backend routing (the one non-obvious constraint) (+9 more)

### Community 126 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 127 - "Buffer"
Cohesion: 0.10
Nodes (18): Buffer, BufferEncoding, Hash, sha256, hex(), instantiateLedger(), bytesOfText(), charCodes() (+10 more)

### Community 128 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 13 - "config/history.ts"
Cohesion: 0.03
Nodes (129): OpenedFacts, ConfigRow, CoreVersion, ConfigHashRow, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding (+121 more)

### Community 130 - "containers.test.ts"
Cohesion: 0.08
Nodes (20): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), parentWithContainer(), LABEL_ATTEMPT (+12 more)

### Community 133 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 134 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (23): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Run() (+15 more)

### Community 135 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 136 - "core.ts"
Cohesion: 0.15
Nodes (21): BaselineLoad, Comparison, CommitOptions, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline() (+13 more)

### Community 137 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (21): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+13 more)

### Community 138 - "ws-mutual-tls.test.ts"
Cohesion: 0.09
Nodes (21): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+13 more)

### Community 139 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 14 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (109): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+101 more)

### Community 140 - "example-checks.ts"
Cohesion: 0.15
Nodes (20): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+12 more)

### Community 141 - "following"
Cohesion: 0.08
Nodes (26): AlwaysLanded, cursorRead(), following(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix, 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began (+18 more)

### Community 143 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 144 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 145 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 146 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 147 - "BlockRef"
Cohesion: 0.11
Nodes (11): BlockLedgerSource, LedgerBinding, BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail (+3 more)

### Community 15 - "NodeClient"
Cohesion: 0.05
Nodes (76): NodeSourceOptions, CoreChainBinding, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State (+68 more)

### Community 150 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 154 - "PrivateLinkChannel"
Cohesion: 0.09
Nodes (18): PrivateLinkChannel, Link, 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once, Evidence, Problem, Suggested fix, ADDED Requirements, Requirement: TT-1 The tape file format (+10 more)

### Community 156 - "refcount-tables.test.ts"
Cohesion: 0.08
Nodes (16): Tables, bytes(), clear(), h(), lit(), seed(), tablesOf(), tablesOfModel() (+8 more)

### Community 157 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 158 - "node-bridge.ts"
Cohesion: 0.13
Nodes (17): Thread, BridgeServer, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 159 - "options.ts"
Cohesion: 0.21
Nodes (23): readOptions, addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding(), guarded(), isHost() (+15 more)

### Community 16 - "messages.ts"
Cohesion: 0.03
Nodes (83): PrivateLinkAddress, Queued, Connected, CoreTransportOptions, CoreLink, CoreSessionOptions, coreSessions, LinkConnection (+75 more)

### Community 162 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 163 - "validation.ts"
Cohesion: 0.09
Nodes (22): PlacedDeclaration, Plain, FIELD_KINDS, LIFETIMES, TABLE_KINDS, badId, DECLARATION_PROPERTIES, duplicateId (+14 more)

### Community 164 - "HeightRun"
Cohesion: 0.10
Nodes (9): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, WaitsInTransaction (+1 more)

### Community 168 - "CheckedEntry"
Cohesion: 0.21
Nodes (20): ConfigFacts, CoreChainFacts, RestoreBase, CommandBuildOptions, CheckState, ConfigCheckOptions, CommandConfig, ProcessSide (+12 more)

### Community 169 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 17 - "vitest"
Cohesion: 0.02
Nodes (75): Served, Row, Finding, RepositoryFile, Upstream, Pem, Leftover, RemovedName (+67 more)

### Community 171 - "api-session.ts"
Cohesion: 0.13
Nodes (19): ChannelConnectOptions, answerRequest(), bodyTooLarge(), fetchBody(), moduleApiFetch(), responseOf(), utf8Text(), readBody() (+11 more)

### Community 174 - "version-table.ts"
Cohesion: 0.18
Nodes (20): LedgerPin, LedgerSelection, VersionedBlock, ledgerTableRule(), ledgerTableIssuesOf(), blockNamed(), checkPins(), covers() (+12 more)

### Community 175 - "catalog.ts"
Cohesion: 0.11
Nodes (20): CatalogColumn, CatalogOptions, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference, defaultCatalog() (+12 more)

### Community 176 - "signal-ignored-fixtures.ts"
Cohesion: 0.14
Nodes (17): ListenedRun, WorkerSignals, listenerProblems(), namesUnder(), pacedNode(), runWorkerInChild(), signalLines(), sigusr2Ignored() (+9 more)

### Community 177 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 18 - "client.test.ts"
Cohesion: 0.03
Nodes (60): HandSocket, HandSockets, Answer, FakeNode, Handler, Received, recorded, ManualTimers (+52 more)

### Community 182 - "ledger/metadata.ts"
Cohesion: 0.16
Nodes (6): MetadataBlock, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, contentStateOf(), hexOf()

### Community 185 - "browser-harness.ts"
Cohesion: 0.25
Nodes (17): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+9 more)

### Community 186 - "height-versioned.test.ts"
Cohesion: 0.16
Nodes (12): BlockFails, Height, tokenMetadata(), versionedDatabase(), versionsOf(), outcome(), secondChangeProblems(), stateOf() (+4 more)

### Community 187 - "text.test.ts"
Cohesion: 0.16
Nodes (9): BackupText, createReadStream(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir (+1 more)

### Community 188 - "configuration-refusal.ts"
Cohesion: 0.16
Nodes (16): ConfigFinding, configurationFindings(), configurationRefusalLines(), isConfigurationRefusal(), messageOf(), redactedFindings(), redactedFindingText(), redactedValue() (+8 more)

### Community 19 - "ref_node_fs"
Cohesion: 0.05
Nodes (82): RestoreOutcome, BackupBackend, BackupDatabase, killedRestore, TickerHandle, TickerProcess, ledgerBackup, FileProcess (+74 more)

### Community 193 - "signal-backup.test.ts"
Cohesion: 0.16
Nodes (13): WORKER, SignalEvent, SignalJob, startWorker(), report(), PGLITE, REPOSITORY, handle (+5 more)

### Community 194 - "source-scan.ts"
Cohesion: 0.20
Nodes (17): ModuleReference, boundaryViolations(), codeFingerprints(), declaredNames(), eachNode(), isInside(), lineOf(), literalText() (+9 more)

### Community 195 - "commit-proxy.ts"
Cohesion: 0.16
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 196 - "checkShape"
Cohesion: 0.31
Nodes (9): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+1 more)

### Community 199 - "version-selection.test.ts"
Cohesion: 0.26
Nodes (15): Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts(), haltOf() (+7 more)

### Community 2 - "ModuleDeclaration"
Cohesion: 0.02
Nodes (178): ModuleDeclaration, EngineBuild, EngineNetwork, AdminRunOptions, ChainBuildOptions, IngestOptions, SourceClass, watched (+170 more)

### Community 20 - "fetch-fixtures.ts"
Cohesion: 0.05
Nodes (96): Scenario, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded, FetchSeen (+88 more)

### Community 200 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 201 - "backbone/part-migrations.test.ts"
Cohesion: 0.21
Nodes (14): FoldedPart, RecordedMigration, earlierBootstrapSql(), earlierRefusalProblems(), earlierRows(), earlierRowsSql(), recorded(), rowsSql() (+6 more)

### Community 202 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 203 - "config/plain-data.ts"
Cohesion: 0.21
Nodes (13): PlainArray, PlainDataNode, PlainDataRule, Walk, copyArray(), copyObject(), instanceOf(), integer() (+5 more)

### Community 205 - "ModuleApi"
Cohesion: 0.17
Nodes (9): ApiResponse, ModuleApi, Leaking, apiErrorResponse(), encodeJson(), hex(), matches(), read() (+1 more)

### Community 21 - "runner/process.ts"
Cohesion: 0.03
Nodes (78): BlockItemSource, NodeWait, RetryCode, InMemoryItems, Wait, PauseBy, BoundAddress, CloseStep (+70 more)

### Community 210 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 211 - "browser/serve.ts"
Cohesion: 0.20
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 216 - "component-table.test.ts"
Cohesion: 0.15
Nodes (10): DesignTable, RowCoverage, rule(), opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS (+2 more)

### Community 218 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 219 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 22 - "tape/index.ts"
Cohesion: 0.05
Nodes (67): RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError, Connection (+59 more)

### Community 222 - "api-answers.ts"
Cohesion: 0.27
Nodes (11): HeadersArgument, answerNotServing(), byteLength(), isCoreHeader(), lifecycleBody(), lifecycleHeaders(), notServingResponse(), refuseChannelNotServing() (+3 more)

### Community 224 - "connectChannel"
Cohesion: 0.33
Nodes (5): SubscriptionCarrier, SubscriptionConnection, connectChannel(), errorMessage(), socketConnection()

### Community 225 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 227 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 23 - "host.ts"
Cohesion: 0.04
Nodes (67): LoadLedger, TransactionParser, LedgerName, LedgerPackageOptions, NodeBatch, ParsedTransaction, AppliedState, ApplyBlock (+59 more)

### Community 230 - "TapeAnswers"
Cohesion: 0.32
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 24 - "db/backends.ts"
Cohesion: 0.03
Nodes (66): Settings, Case, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer (+58 more)

### Community 240 - "ApiRoutes"
Cohesion: 0.31
Nodes (6): ApiRoutes, parsePath(), shapeOf(), routesOf(), api(), routesOf()

### Community 241 - "TapeClock"
Cohesion: 0.25
Nodes (3): Outage, TapeClock, SYSTEM_CLOCK

### Community 25 - "spawnChild"
Cohesion: 0.03
Nodes (81): EmitWarning, WarningHook, ParentJob, Kill, Orphaned, SourceFile, Run, WorkerEvent (+73 more)

### Community 26 - "channels.ts"
Cohesion: 0.04
Nodes (56): PrivateLinkConnect, ChannelEndpoint, EndpointEvents, EndpointOptions, Envelope, LinkTimers, MessagePortLike, CoreChannels (+48 more)

### Community 27 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (68): InMemoryBlockSource, Job, WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+60 more)

### Community 277 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 28 - "adapter.ts"
Cohesion: 0.04
Nodes (76): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+68 more)

### Community 280 - "stats.ts"
Cohesion: 0.33
Nodes (4): ManualOpts, TinybenchOpts, measureManual(), tinybench

### Community 29 - "LedgerPackage"
Cohesion: 0.05
Nodes (47): LedgerEventKind, LedgerPackage, LedgerTask, LedgerTaskBlock, NodeStore, StateHandle, EngineOptions, LedgerEngine (+39 more)

### Community 3 - "loop.ts"
Cohesion: 0.02
Nodes (170): QueuedBlock, ErrorCode, PointName, EntryRange, GraphInput, BlockItems, LateUse, CallbackFailure (+162 more)

### Community 303 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 31 - "channel-queue.test.ts"
Cohesion: 0.05
Nodes (56): PublicSide, HelloAck, CarrierConnection, PrivateCarrier, PrivateTransport, Waiter, controlledTimers, PeerEnd (+48 more)

### Community 32 - "range.ts"
Cohesion: 0.04
Nodes (74): NodeClientOptions, ConnectSocket, Refusal, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder (+66 more)

### Community 33 - "lockstep-refusals.test.ts"
Cohesion: 0.05
Nodes (67): PrivateProcess, PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation (+59 more)

### Community 34 - "cli/command.ts"
Cohesion: 0.04
Nodes (66): BackupSeams, CommandHandler, CommandIo, MainProcess, IgnoredJob, CommandResult, Renamed, RunningCommand (+58 more)

### Community 35 - "builder.test.ts"
Cohesion: 0.04
Nodes (45): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Metadata, Step, Frame (+37 more)

### Community 36 - "NodeBlockSource"
Cohesion: 0.05
Nodes (30): BlockEventSource, CoreBlockItems, RuntimeMetadataView, HeadWait, NodeBlockSource, Prefetch, NodeSubscription, NodeHeader (+22 more)

### Community 37 - "connectWebSocket"
Cohesion: 0.05
Nodes (39): Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+31 more)

### Community 38 - ".from"
Cohesion: 0.05
Nodes (71): LedgerEvent, TransactionResult, VmLog, ledgerItemsSeen, hex(), hex(), hex(), heightsIn() (+63 more)

### Community 39 - "core-ledger-state/sql.ts"
Cohesion: 0.06
Nodes (54): StateRow, StoredState, GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, Block (+46 more)

### Community 4 - "Database"
Cohesion: 0.02
Nodes (168): Database, ReadOnlyDatabase, SchemaWriteHandle, AppliedRow, MigrationPart, Runnable, Settling, StartupInput (+160 more)

### Community 40 - "entries.ts"
Cohesion: 0.04
Nodes (69): DatabasePartsInput, TransportReader, coreEntry, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder (+61 more)

### Community 41 - "FinalizedLoop"
Cohesion: 0.06
Nodes (17): Activity, FinalizedLoop, LoopObserver, Startup, SkipsLockstep, WaitingInRead, FailingAfter, call() (+9 more)

### Community 42 - "core-private-source.ts"
Cohesion: 0.06
Nodes (51): PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision, StartHashes (+43 more)

### Community 43 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (67): CoreContractStatesOptions, ContractStateRow, DefinedModule, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+59 more)

### Community 44 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (59): TasksRun, SlowStep, TestLoaderData, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses() (+51 more)

### Community 45 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (65): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import (+57 more)

### Community 46 - "Process"
Cohesion: 0.06
Nodes (13): LifecycleStatus, ProcessReason, PauseHold, Process, SignalTarget, bindCoreChainEvents(), asksForChannels(), messageOf() (+5 more)

### Community 47 - "transport-faults.test.ts"
Cohesion: 0.05
Nodes (48): CoreTransport, Message, MessageType, Ended, rawClient, Escape, publicState, Refused (+40 more)

### Community 48 - "node-format.ts"
Cohesion: 0.07
Nodes (37): GeneratedBlock, GeneratedState, Child, Reader, Disposable, NodeStoreExports, NodeStoreSubject, Readable (+29 more)

### Community 49 - "backup/backup.ts"
Cohesion: 0.07
Nodes (59): BackupInput, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool (+51 more)

### Community 5 - "UmbraError"
Cohesion: 0.02
Nodes (124): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, PgliteLockUse, commandTarget, ReadDatabaseOptions (+116 more)

### Community 50 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.04
Nodes (42): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+34 more)

### Community 51 - "process-admin.ts"
Cohesion: 0.06
Nodes (46): NetworkShown, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, DigestRow, ModuleFacts, NodeFacts, PartTable (+38 more)

### Community 52 - ".value"
Cohesion: 0.10
Nodes (37): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef (+29 more)

### Community 53 - "redact.ts"
Cohesion: 0.06
Nodes (50): AllowedDetail, RevisionSettings, SanitizedError, BackupOutcome, PlainObject, RedactableConfig, RedactionForms, redactor (+42 more)

### Community 54 - "cursor-table.test.ts"
Cohesion: 0.04
Nodes (47): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, CursorValue, Case, cursorDatabase (+39 more)

### Community 55 - "core-ledger-state.ts"
Cohesion: 0.06
Nodes (48): LedgerStateItem, RetainedState, retainedStates, CoreRevision, ContractKeys, blockHeaderOf(), bindLedgerParser(), boundLedgerParser() (+40 more)

### Community 57 - "resolve.ts"
Cohesion: 0.06
Nodes (56): AddressRequest, Asked, LinkPlan, NetworkContext, NetworkInput, NetworkPlan, NetworkProblem, NetworkRequest (+48 more)

### Community 59 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (49): ReadOpener, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec, Observed (+41 more)

### Community 6 - "ledger/types.ts"
Cohesion: 0.03
Nodes (143): ApplyInput, ApplyOutput, StateSummary, StoredNode, LedgerHeight, Upstream, contractFixture, Ledger (+135 more)

### Community 60 - "ledger-units.test.ts"
Cohesion: 0.06
Nodes (45): ManifestLine, VerifyLedgerPackagesOptions, Path, LedgerSource, LedgerSourceSettings, Point, checkLedgerPackages(), checkLedgerPackage() (+37 more)

### Community 61 - "transform-checks.ts"
Cohesion: 0.10
Nodes (38): TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, baseRecords(), expectedText(), expectVariantOutput() (+30 more)

### Community 62 - "config-check.ts"
Cohesion: 0.05
Nodes (41): CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState (+33 more)

### Community 63 - "refcount-model.ts"
Cohesion: 0.07
Nodes (38): BlockKind, BlockScript, BoundaryRewrite, DrivenBlock, GraphNode, HistoryScript, OracleReport, R1Case (+30 more)

### Community 64 - "pause-fixtures.ts"
Cohesion: 0.08
Nodes (39): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, PausesInsideTheHeight (+31 more)

### Community 66 - "private/lockstep-wait.test.ts"
Cohesion: 0.06
Nodes (30): InstanceView, PrivateInstance, Entry, Lockstep, LockstepCondition, LockstepInstance, LockstepOptions, LockstepRefusal (+22 more)

### Community 67 - "ledger-tapes.ts"
Cohesion: 0.08
Nodes (50): BlockParsed, itemsSeen, BlockSpec, EventSpec, Json, transactionSpec, eventsRuntime, ledgerScenario (+42 more)

### Community 68 - "column-rules.ts"
Cohesion: 0.04
Nodes (54): AllowedRule, DesignRow, keyOrder, PlacedRefusal, RefusalCode, RefusalOptions, RefusedRule, RuleBase (+46 more)

### Community 69 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (27): Because, columnVerdict, DefaultPart, Refusal, TreeNode, TypeRule, DesignTable, becauseOf() (+19 more)

### Community 7 - "declaration.ts"
Cohesion: 0.02
Nodes (134): StatsRow, Outcome, UmbraConfig, BlockWriteHandle, ReadHandle, ReadOptions, cursorTable, CursorTableOptions (+126 more)

### Community 70 - "chain-events-decode.test.ts"
Cohesion: 0.10
Nodes (38): Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, chainEventsOf(), metadataView() (+30 more)

### Community 71 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (32): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+24 more)

### Community 72 - "core-settings.ts"
Cohesion: 0.05
Nodes (42): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, Absent, DeepReadonly, PrivateKeys, PrivateOnly (+34 more)

### Community 73 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+40 more)

### Community 74 - "transaction-history-storage.property.test.ts"
Cohesion: 0.06
Nodes (24): EntryContent, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, Command, ReplayableStorage, capitalize(), abortErrorLike(), capitalize() (+16 more)

### Community 75 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 76 - "core-block-commit.test.ts"
Cohesion: 0.08
Nodes (35): BlockRow, BlockContext, StandInOptions, Commit, checkParent(), commitBlock(), hex(), sameBytes() (+27 more)

### Community 77 - "readiness.test.ts"
Cohesion: 0.07
Nodes (41): Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork, UmbraDBReason, UmbraDBStarted, UmbraDBStatus (+33 more)

### Community 78 - "backup/restore.ts"
Cohesion: 0.09
Nodes (39): PublicIdentity, Checked, PublicSide, RestoreInput, RestoreTarget, isBlockLedgerSource(), bindingRefusal(), hex() (+31 more)

### Community 79 - "cbor.ts"
Cohesion: 0.09
Nodes (37): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+29 more)

### Community 8 - "src/db/postgres.ts"
Cohesion: 0.03
Nodes (124): BenchEnv, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, driverConnectionOptions, DriverError, Outcome (+116 more)

### Community 80 - "page.ts"
Cohesion: 0.06
Nodes (34): ApiChannel, LinkRecord, PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod (+26 more)

### Community 81 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (32): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+24 more)

### Community 82 - "validate.test.ts"
Cohesion: 0.06
Nodes (37): ConfigRule, EntryRef, CursorRow, Expected, Row, declarations(), input(), refusal() (+29 more)

### Community 83 - "refcount-step.test.ts"
Cohesion: 0.07
Nodes (35): KeyCounts, RefcountFault, RefcountStatement, refcountStep, RefcountTables, RefcountBatch, Given, Halt (+27 more)

### Community 84 - "resolver-boundary.ts"
Cohesion: 0.08
Nodes (38): TypeCheckFinding, TypeCheckResult, Access, AllowedRead, Boundary, Crossing, Guard, configCompilerOptions() (+30 more)

### Community 85 - "binding.test.ts"
Cohesion: 0.08
Nodes (39): a165Run, Attempt, A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight() (+31 more)

### Community 87 - "dispatch.test.ts"
Cohesion: 0.10
Nodes (33): HeightRange, Callback, EntryBoundary, ParallelPoint, PointArguments, PointRun, PointSchedule, CoreStopsFirst (+25 more)

### Community 9 - "admin-harness.ts"
Cohesion: 0.03
Nodes (131): AdminServer, EngineConfig, ProcessHandle, AdminRun, Answered, Answerer, Expected, Hold (+123 more)

### Community 90 - "core-chain.ts"
Cohesion: 0.08
Nodes (26): Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, WaitingListener, ChainIdentity, RestoreChain (+18 more)

### Community 92 - "networks.ts"
Cohesion: 0.06
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 94 - "test/postgres/setup.ts"
Cohesion: 0.07
Nodes (32): Key, Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, Sql, SuiteWatchdogTimeoutError (+24 more)

### Community 95 - "chain-placement.test.ts"
Cohesion: 0.09
Nodes (35): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, MetadataVariant, BlockParsedOptions, ChainTransaction, ChainEvent (+27 more)

### Community 96 - "validate.ts"
Cohesion: 0.10
Nodes (38): CursorRule, Issue, Plain, SettingsSchema, coreSettingsSchema(), pathOf(), closest(), configFindings() (+30 more)

### Community 97 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (37): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+29 more)

### Community 98 - "browser.test.ts"
Cohesion: 0.07
Nodes (37): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, heldClock, continuedProblems() (+29 more)

### Community 99 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 221 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 65 - "version"
Cohesion: 0.05
Nodes (51): side(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules (+43 more)

### Community 93 - "refused"
Cohesion: 0.07
Nodes (36): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, A paused loop on `/status`, A private process and a changed public configuration, The node on `/status` (+28 more)

### Community 102 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (11): publicLockstepOf(), height(), fakePublic(), fakeRead(), hexOf(), publicAnswers(), reconnecting(), PRIVATE_CORE_DIGEST (+3 more)

### Community 105 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 106 - ".off"
Cohesion: 0.05
Nodes (34): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 0. Baseline and decisions, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears (+26 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 132 - "Acceptance — LEDGER-REFCOUNT: ledger nodes stored as the node stores them, compared by content, reclaimed by reference counting"
Cohesion: 0.07
Nodes (27): sweepReset(), 1. The rules, on the reference model (LG-14), 2. The implementation, on both backends, 3. Removal, codes and the required test, 4. The recorded tapes and the conversion, 5. Local preprod runs (`design.md` §12; never in CI), 6. Documents, 7. `core-arch` criteria rewritten by this change (+19 more)

### Community 153 - "T"
Cohesion: 0.09
Nodes (24): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get` (+16 more)

### Community 160 - ".slowBlockMs"
Cohesion: 0.11
Nodes (19): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+11 more)

### Community 161 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (22): deferred(), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4 (+14 more)

### Community 165 - "Design — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.10
Nodes (18): transportReaderRule(), 00061 — The threat model's `path:line` citations drift as the code moves, Evidence, Problem, Suggested fix, 0. Baseline, 1. Source layout, 2. Architecture (+10 more)

### Community 172 - "transportReader"
Cohesion: 0.11
Nodes (18): text(), transportReader(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 10. Requirement coverage, 1. Library-mode guarantees (+10 more)

### Community 178 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (20): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+12 more)

### Community 183 - "boundary.test.ts"
Cohesion: 0.25
Nodes (15): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+7 more)

### Community 204 - "mapping.test.ts"
Cohesion: 0.16
Nodes (6): mapValue(), oid(), identity(), RESULT_COLUMNS, RESULT_TYPES, RFC-3339

### Community 206 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (13): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface (+5 more)

### Community 209 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 212 - "Tasks — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.14
Nodes (12): ownKeys(), 5.3 Standard service lifecycle (owner decisions D-18, D-19, D-23), 0. Baseline, 10. Review (AGENTS.md stage 4, bounded), 11. Close-out, 2. The private link's settings renamed (D-6; CF-4), 5. Mounted handlers and the service lifecycle (LM-4, LM-5; design §5.3), 6. The private link over channels (LM-6; design §5.4) (+4 more)

### Community 217 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 223 - "ledger-node-write.test.ts"
Cohesion: 0.21
Nodes (12): writeBlock(), addRootCounts(), insertEvents(), insertNodes(), insertSegmentResults(), insertStateRow(), applied(), hex() (+4 more)

### Community 234 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 257 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 261 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 265 - "host-signal.ts"
Cohesion: 0.32
Nodes (5): isAbortSignal(), followSignal(), isSignal(), ABORTED, REASON

### Community 268 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 269 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.29
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 279 - "api-session.test.ts"
Cohesion: 0.33
Nodes (5): unreadableAmount(), db, MALFORMED_CLIENT, POISONED, read

### Community 286 - "Evidence"
Cohesion: 0.40
Nodes (5): readDatabaseState(), 00029 — `umbradb config check --database` reads a private database's cursor from the public cursor table, Evidence, Problem, Suggested fix

### Community 30 - "history"
Cohesion: 0.03
Nodes (90): history(), revision(), params(), n(), data(), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+82 more)

### Community 300 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 350 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 56 - "code"
Cohesion: 0.04
Nodes (58): code(), Added, 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit (+50 more)

### Community 58 - ".put"
Cohesion: 0.04
Nodes (52): coreTxResultsOnParse(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+44 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+31 more)

### Community 103 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 121 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 125 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 129 - "README.md"
Cohesion: 0.08
Nodes (20): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs (+12 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 149 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 151 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.08
Nodes (21): Build commands, Build the package and install it, Building from source, Run from a clone, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence (+13 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 166 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 167 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 170 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.10
Nodes (20): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+12 more)

### Community 173 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric` (+12 more)

### Community 179 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 180 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 181 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 189 - "Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting"
Cohesion: 0.11
Nodes (17): MODIFIED Requirements, RENAMED Requirements, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting, Scenario: A node queued and referenced again is kept, Scenario: A node written again unchanged changes no count, Scenario: A node written again with another child list (+9 more)

### Community 190 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 191 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 198 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 207 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 208 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Scenario: A body over the limit, mounted (+6 more)

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

### Community 228 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 231 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 232 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 235 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 236 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 237 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 238 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 239 - "Requirement: DT-3 The contents hash"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Scenario: A changed node row, Scenario: A content-defined table is not captured, Scenario: Insert then update in one block, Scenario: Rewriting the same value, Scenario: Same data, two backends (+2 more)

### Community 242 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 243 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 244 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 245 - "MODIFIED Requirements"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A long awaiting callback does not fail liveness, Scenario: Before the first block, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 246 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 247 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 248 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 249 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 251 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 252 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 253 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 254 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 255 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 256 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 258 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 259 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 260 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 262 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 263 - "Requirement: BK-1 Backup"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 264 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 267 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 270 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 271 - "Requirement: BK-3 Restore into an empty database, checked before and after loading"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: BK-3 Restore into an empty database, checked before and after loading, Scenario: A changed ledger node row, Scenario: A changed row, Scenario: The same node, spelled the other way, Spec delta — `backups` capability

### Community 272 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 273 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 274 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 275 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 276 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 278 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 282 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 283 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 284 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 285 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 287 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 288 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 289 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 290 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 291 - "Tasks — Sprint 2: Transaction/Lease"
Cohesion: 0.33
Nodes (5): 0. `PgTransactionLeaseLayer` — transactions, 1. `PgTransactionLeaseLayer` — leases, 2. Wire `PgTemporalKV`'s `opts.tx`, 3. Sprint close-out, Tasks — Sprint 2: Transaction/Lease

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

### Community 302 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 304 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 305 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 306 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 307 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 308 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 309 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 310 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 311 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 312 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 313 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 314 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

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

### Community 328 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 329 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 330 - "00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)"
Cohesion: 0.40
Nodes (4): 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …), Evidence, Problem, Suggested fix

### Community 331 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 332 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 333 - "00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why"
Cohesion: 0.40
Nodes (4): 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why, Evidence, Problem, Suggested fix

### Community 334 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 335 - "00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs"
Cohesion: 0.40
Nodes (4): 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs, Evidence, Problem, Suggested fix

### Community 336 - "00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history"
Cohesion: 0.40
Nodes (4): 00078 — A stored ledger node can arrive again in another child-list form, so the batch may depend on the worker's history, Evidence, Fix (specified in `ledger-refcount`), Problem

### Community 337 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 338 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 339 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 340 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 341 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 342 - "00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes"
Cohesion: 0.50
Nodes (3): 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes, Evidence, Suggested fix

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

### Community 354 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 86 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning (+33 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-8949`, `RFC-3339`, `RFC-8949` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4249 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `opt-out.test.ts`, `startUmbraDB`, `ModuleDeclaration`, `loop.ts`, `Database`, `UmbraError`, `ledger/types.ts`, `declaration.ts`, `src/db/postgres.ts`, `admin-harness.ts`, `core-chain-events.ts`, `core-config.test.ts`, `builds.ts`, `config/history.ts`, `core-block-parsed.ts`, `NodeClient`, `messages.ts`, `client.test.ts`, `ref_node_fs`, `fetch-fixtures.ts`, `runner/process.ts`, `tape/index.ts`, `host.ts`, `db/backends.ts`, `spawnChild`, `channels.ts`, `InMemoryBlockSource`, `adapter.ts`, `channel-queue.test.ts`, `lockstep-refusals.test.ts`, `cli/command.ts`, `builder.test.ts`, `connectWebSocket`, `.from`, `core-ledger-state/sql.ts`, `entries.ts`, `core-private-source.ts`, `contract-data-checks.ts`, `ledger/ledger-tasks.test.ts`, `transport-faults.test.ts`, `node-format.ts`, `backup/backup.ts`, `interfaces/transaction-history-storage.ts`, `process-admin.ts`, `redact.ts`, `cursor-table.test.ts`, `core-ledger-state.ts`, `resolve.ts`, `slow-block-harness.ts`, `ledger-units.test.ts`, `transform-checks.ts`, `config-check.ts`, `refcount-model.ts`, `pause-fixtures.ts`, `private/lockstep-wait.test.ts`, `ledger-tapes.ts`, `column-rules.test.ts`, `chain-events-decode.test.ts`, `cold-boot-recovery.integration.test.ts`, `core-settings.ts`, `transaction-history-storage.property.test.ts`, `retirement.test.ts`, `core-block-commit.test.ts`, `readiness.test.ts`, `backup/restore.ts`, `file-mode.test.ts`, `validate.test.ts`, `refcount-step.test.ts`, `resolver-boundary.ts`, `binding.test.ts`, `dispatch.test.ts`, `core-chain.ts`, `networks.ts`, `test/postgres/setup.ts`, `chain-placement.test.ts`, `cbor.property.test.ts`, `browser.test.ts`, `real-tapes.ts`, `core-private-source.test.ts`, `paused-harness.ts`, `order.property.test.ts`, `release-version.ts`, `src/config/load.ts`, `browser/build.ts`, `code-registry.ts`, `version-checks.ts`, `hex`, `process-context.test.ts`, `ingest-faults.test.ts`, `LoopPauses`, `package.json`, `documents.ts`, `containers.test.ts`, `crash.test.ts`, `read-gate.ts`, `core.ts`, `ws-mutual-tls.test.ts`, `pg-tx-history-adapter.ts`, `example-checks.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `surface.test.ts`, `refcount-tables.test.ts`, `node-bridge.ts`, `block-fetch-decode.test.ts`, `library-documents.test.ts`, `boundary.test.ts`, `excluded-not-exported.test.ts`, `height-versioned.test.ts`, `text.test.ts`, `signal-backup.test.ts`, `version-selection.test.ts`, `validation.test.ts`, `backbone/part-migrations.test.ts`, `statementsOf`, `mapping.test.ts`, `mutation-per-adapter.mjs`, `component-table.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `ledger-node-write.test.ts`, `history.property.test.ts`, `host-signal.ts`, `worker-threads.test.ts`, `api-session.test.ts`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-8949` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `opt-out.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01863799283154122 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `opt-out.test.ts`, `startUmbraDB`, `ModuleDeclaration`, `loop.ts`, `Database`, `ledger/types.ts`, `declaration.ts`, `src/db/postgres.ts`, `admin-harness.ts`, `core-config.test.ts`, `builds.ts`, `config/history.ts`, `core-block-parsed.ts`, `NodeClient`, `messages.ts`, `vitest`, `client.test.ts`, `ref_node_fs`, `fetch-fixtures.ts`, `runner/process.ts`, `tape/index.ts`, `db/backends.ts`, `channels.ts`, `InMemoryBlockSource`, `LedgerPackage`, `channel-queue.test.ts`, `range.ts`, `lockstep-refusals.test.ts`, `cli/command.ts`, `NodeBlockSource`, `entries.ts`, `FinalizedLoop`, `core-private-source.ts`, `Process`, `transport-faults.test.ts`, `backup/backup.ts`, `process-admin.ts`, `redact.ts`, `cursor-table.test.ts`, `core-ledger-state.ts`, `resolve.ts`, `slow-block-harness.ts`, `ledger-units.test.ts`, `transform-checks.ts`, `config-check.ts`, `pause-fixtures.ts`, `core-settings.ts`, `graph.ts`, `core-block-commit.test.ts`, `readiness.test.ts`, `backup/restore.ts`, `cbor.ts`, `validate.test.ts`, `refcount-step.test.ts`, `binding.test.ts`, `core-chain.ts`, `validate.ts`, `core-private-source.test.ts`, `src/config/load.ts`, `version-checks.ts`, `process-context.test.ts`, `ingest-faults.test.ts`, `Buffer`, `mapping.ts`, `refcount-tables.test.ts`, `options.ts`, `validation.ts`, `CheckedEntry`, `version-table.ts`, `ledger/metadata.ts`, `height-versioned.test.ts`, `configuration-refusal.ts`, `checkShape`, `validation.test.ts`, `backbone/part-migrations.test.ts`, `statementsOf`, `config/plain-data.ts`, `mapping.test.ts`, `browser/src/config/load.ts`, `ApiRoutes`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `startUmbraDB` be split into smaller, more focused modules?**
  _Cohesion score 0.019364419364419364 - nodes in this community are weakly interconnected._