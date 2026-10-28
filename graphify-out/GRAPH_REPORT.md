# Graph Report - UmbraDB

## Corpus Check
- 1070 files · ~1,499,314 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11207 nodes · 34195 edges · 327 communities (293 shown, 34 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2640 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `5a58aa9e16bd4813` (1070 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- UmbraError
- api-server.test.ts
- node-fields-harness.ts
- page.ts
- worker-host.test.ts
- order.property.test.ts
- browser/build.ts
- pg-tx-history-adapter.ts
- code-registry.ts
- ref_node_url
- ledger-sweep.test.ts
- Lockstep
- src/ledger/identity.ts
- pglite-processes.ts
- documents.ts
- node-source.ts
- checks.test.ts
- test/postgres/setup.ts
- ws-mutual-tls.test.ts
- tape/index.ts
- ledger/load.ts
- read-gate.ts
- crash.test.ts
- intake.test.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- node-source.test.ts
- pglite-server.ts
- accepted-hash-checks.ts
- restore-private.ts
- shims.test.ts
- node-bridge.ts
- NodeClient
- HeightRun
- block-fetch-decode.test.ts
- call
- replay-check.ts
- lockstep-refusals.test.ts
- example-checks.ts
- .from
- chrome.ts
- key-handling-checks.ts
- browser-harness.ts
- commit-proxy.ts
- process-admin.ts
- sweep.ts
- LoopPauses
- TapeNode
- validation.test.ts
- signal-backup.test.ts
- client.test.ts
- PortSocket
- statementsOf
- pglite-timeouts.test.ts
- fixtures/configuration.ts
- backupAtStop
- core-contract-states.ts
- web-lock.ts
- process-backends.ts
- browser/serve.ts
- worker-threads-worker.ts
- buffer.ts
- validate.ts
- Worker
- .send
- migrate.ts
- config-check.ts
- .query
- sweepStep
- RuntimeMetadata
- childRefKeys
- ledger/plain-data.ts
- TapeAnswers
- adapter-fixtures.ts
- ProcessItems
- core-transport.ts
- worker-threads.test.ts
- vendored-ledger-files.test.ts
- core-block-parsed.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- core-config.test.ts
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- tools_tape_index_taperecord
- worker-threads-host.ts
- ledger-tapes.ts
- builds.ts
- ref_node_fs
- EventsRunner
- ref_node_timers
- https.ts
- NodeFS
- admin-harness.ts
- node-format.ts
- core-private-source.test.ts
- contract-data-checks.ts
- ledger/types.ts
- pause-fixtures.ts
- host.ts
- .read
- binding.test.ts
- LedgerPackage
- InMemoryBlockSource
- validation.ts
- backup/backup.ts
- FinalizedLoop
- transport-faults.test.ts
- column-rules.ts
- real-tapes.ts
- .value
- slow-block-harness.ts
- declaration.ts
- networks.ts
- PgTransactionHistoryStorage
- interfaces/transaction-history-storage.ts
- version-checks.ts
- worker-storage.test.ts
- column-rules.test.ts
- ingest-harness.ts
- loop-stop-harness.ts
- boundary.test.ts
- mapping.ts
- ModuleDeclaration
- transaction-history-storage.property.test.ts
- NodeBlockSource
- backup/restore.ts
- graph.ts
- vitest
- checkShape
- cbor.ts
- file-mode.test.ts
- retirement.test.ts
- config/history.ts
- in-memory-source.ts
- paused-harness.ts
- core-ledger-state.ts
- net.test.ts
- config/plain-data.ts
- opt-out.test.ts
- ledger/ledger-tasks.test.ts
- private/lockstep-wait.test.ts
- pack-install.mjs
- cbor.property.test.ts
- transform-checks.ts
- process-worker.ts
- dispatch.test.ts
- runner/process.ts
- cold-boot-recovery.integration.test.ts
- Design — Sprint 1: project setup + TemporalKV
- BlockRef
- browser.test.ts
- release-version.ts
- core.ts
- 7. Storage helpers
- Proposal — Sprint 3: CheckpointStore
- T
- 2. Points
- .slowBlockMs
- core-ledger-state.test.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- following
- twox.ts
- facade-merge-loader.ts
- Design — v1.1.0: Quint model checking
- UmbraDB third-party component inventory (SBOM)
- path.ts
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- firstRegularAtParentTime
- fresh-instance.mjs
- crash-worker.ts
- history
- .put
- version
- code
- ADDED Requirements
- ledger-state.test.ts
- graph.py
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- README.md
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Boundaries, threats and controls
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
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
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- scoped-review-manifest
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- stats-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
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
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00033 — `umbradb restore` fails on a configuration with a module whose entry starts above the backup's height
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
- bug-report.md
- feature-request.md
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
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
- post-block-update/oracle/main.rs
- ADDED Requirements
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

## Communities (327 total, 34 thin omitted)

### Community 0 - "UmbraError"
Cohesion: 0.02
Nodes (166): LoadedConfig, LoadOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, SslMode (+158 more)

### Community 1 - "api-server.test.ts"
Cohesion: 0.02
Nodes (163): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, ReadOnlyDatabase, ModuleTableOptions, Connection, HeadersArgument (+155 more)

### Community 10 - "node-fields-harness.ts"
Cohesion: 0.04
Nodes (114): ProcessCondition, Scenario, A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader (+106 more)

### Community 100 - "page.ts"
Cohesion: 0.07
Nodes (29): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog(), backUp() (+21 more)

### Community 102 - "worker-host.test.ts"
Cohesion: 0.07
Nodes (28): LedgerWorkerFailure, SlowStep, TestLoaderData, isEvictionRefused(), errorOf(), beat(), countDeserializations(), hexOf() (+20 more)

### Community 103 - "order.property.test.ts"
Cohesion: 0.09
Nodes (30): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce() (+22 more)

### Community 104 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 106 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (24): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+16 more)

### Community 107 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 11 - "ref_node_url"
Cohesion: 0.02
Nodes (103): BenchEnv, ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts (+95 more)

### Community 110 - "ledger-sweep.test.ts"
Cohesion: 0.12
Nodes (16): GreyPicker, SweepState, NodeBatch, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel (+8 more)

### Community 111 - "Lockstep"
Cohesion: 0.10
Nodes (13): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+5 more)

### Community 112 - "src/ledger/identity.ts"
Cohesion: 0.13
Nodes (25): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, checkLedgerPackage(), checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages() (+17 more)

### Community 113 - "pglite-processes.ts"
Cohesion: 0.11
Nodes (24): WriterProcess, WorkerEvent, blocksIn(), cleanUp(), startWriterProcess(), workDirectory(), dataDirectory(), expectPausedWriterKeepsLock() (+16 more)

### Community 114 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 115 - "node-source.ts"
Cohesion: 0.10
Nodes (18): BlockHeaderItem, BlockEventSource, BlockItemSource, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, Prefetch, LedgerBinding (+10 more)

### Community 116 - "checks.test.ts"
Cohesion: 0.09
Nodes (21): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), numericOkPredicate() (+13 more)

### Community 117 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 118 - "ws-mutual-tls.test.ts"
Cohesion: 0.09
Nodes (21): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+13 more)

### Community 12 - "tape/index.ts"
Cohesion: 0.05
Nodes (96): Recorded, Link, TapeBuilderOptions, RecordingProblem, TapeProblem, TransformError, TransformProblem, readRequest (+88 more)

### Community 120 - "ledger/load.ts"
Cohesion: 0.15
Nodes (14): LedgerReleasePackage, V9Logs, loadLedgerPackage(), createV8Adapter(), createV9Adapter(), createV9Rc3Adapter(), cost(), expectNodeState() (+6 more)

### Community 121 - "read-gate.ts"
Cohesion: 0.14
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 122 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 124 - "intake.test.ts"
Cohesion: 0.12
Nodes (16): PrivateSeen, A114Observation, A116Observation, TransportProxy, checkHeight(), hashAt(), inMemoryBlock(), blockAt() (+8 more)

### Community 125 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 126 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 127 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 128 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 129 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (16): BackupText, createReadStream(), firstLine(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst() (+8 more)

### Community 13 - "node-source.test.ts"
Cohesion: 0.02
Nodes (89): NodeCallOptions, ConnectSocket, RecordingClient, Outage, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault (+81 more)

### Community 134 - "pglite-server.ts"
Cohesion: 0.13
Nodes (16): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, pgliteBackend(), expectNoOutsideReads() (+8 more)

### Community 135 - "accepted-hash-checks.ts"
Cohesion: 0.13
Nodes (21): a165Run, Attempt, TestDatabase, privateCursorHeight(), a165Problems(), contentsOf(), cursorOf(), headerHash() (+13 more)

### Community 136 - "restore-private.ts"
Cohesion: 0.16
Nodes (21): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+13 more)

### Community 137 - "shims.test.ts"
Cohesion: 0.12
Nodes (11): Buffer, Hash, sha256, hex(), instantiateLedger(), createHash(), probe(), INITIAL (+3 more)

### Community 139 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 14 - "NodeClient"
Cohesion: 0.05
Nodes (79): NodeSourceOptions, CoreChainBinding, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+71 more)

### Community 140 - "HeightRun"
Cohesion: 0.09
Nodes (10): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, LateRedelivery, SkipsStartAtRestart, CommitsDespiteLastWrite (+2 more)

### Community 141 - "block-fetch-decode.test.ts"
Cohesion: 0.13
Nodes (19): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), concatBytes(), encodeCompact() (+11 more)

### Community 142 - "call"
Cohesion: 0.13
Nodes (6): PointRun, UnexpectedCursor, call(), isBlock(), sameBytes(), tracked()

### Community 143 - "replay-check.ts"
Cohesion: 0.12
Nodes (22): Arguments, Command, ConnectionFrames, ReplaySession, boundaries(), check(), parse(), range() (+14 more)

### Community 146 - "lockstep-refusals.test.ts"
Cohesion: 0.18
Nodes (20): LockstepCondition, PublicCore, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn() (+12 more)

### Community 147 - "example-checks.ts"
Cohesion: 0.17
Nodes (16): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+8 more)

### Community 15 - ".from"
Cohesion: 0.03
Nodes (95): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+87 more)

### Community 151 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 152 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 154 - "browser-harness.ts"
Cohesion: 0.23
Nodes (17): ProcessName, NodeRunResult, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf() (+9 more)

### Community 159 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 16 - "process-admin.ts"
Cohesion: 0.04
Nodes (99): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+91 more)

### Community 162 - "sweep.ts"
Cohesion: 0.16
Nodes (11): GreyView, SweepPhase, SweepWrites, BYTE_ORDER(), sqlSweepTables(), sweepReset(), writeSweep(), hex() (+3 more)

### Community 163 - "LoopPauses"
Cohesion: 0.17
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 165 - "TapeNode"
Cohesion: 0.19
Nodes (3): TapeClock, TapeNode, SYSTEM_CLOCK

### Community 168 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 169 - "signal-backup.test.ts"
Cohesion: 0.18
Nodes (12): WORKER, SignalEvent, SignalJob, report(), PGLITE, REPOSITORY, handle, job (+4 more)

### Community 17 - "client.test.ts"
Cohesion: 0.03
Nodes (57): Connection, NodeClientOptions, NodeRetry, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket, HandSockets (+49 more)

### Community 170 - "PortSocket"
Cohesion: 0.22
Nodes (6): PortSocket, params(), pair(), 7. The module API, Requirement: RN-15 Module APIs are registered once, at startup, Scenario: Two modules claim one path

### Community 171 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 172 - "pglite-timeouts.test.ts"
Cohesion: 0.17
Nodes (12): Run, Job, WorkerEvent, expectNeverCutOffNorHung(), settings(), apiRead(), engine(), report() (+4 more)

### Community 173 - "fixtures/configuration.ts"
Cohesion: 0.20
Nodes (13): ProcessConfiguration, core(), databaseOf(), defineConfig(), coreConfiguration(), param(), privateConfiguration(), configuration (+5 more)

### Community 174 - "backupAtStop"
Cohesion: 0.15
Nodes (14): BackupWritten, backupAtStop(), A backup at the core's stop, A backup of a running process (SIGUSR2), Backups, Restoring a backup, What a backup holds, Writing a backup (+6 more)

### Community 178 - "core-contract-states.ts"
Cohesion: 0.13
Nodes (12): ContractStateRow, CoreContractStatesOptions, LedgerStateItem, ContractKeys, DefinedModule, coreContractStates(), writeStateRows(), CONTRACT_STATES_ITEM (+4 more)

### Community 179 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 18 - "process-backends.ts"
Cohesion: 0.05
Nodes (91): CoreLedgerStateOptions, FixtureRun, FixtureRunOptions, ingest, SeenLoad, LedgerTx, recordedGenesis, Flaky (+83 more)

### Community 184 - "browser/serve.ts"
Cohesion: 0.22
Nodes (9): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), CONTENT_TYPES, PAGE_HEADERS (+1 more)

### Community 188 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 189 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 19 - "validate.ts"
Cohesion: 0.03
Nodes (96): EntryView, coreEntry, HistoryFinding, plainData, ConfigContext, ConfigRule, CursorRule, EntryRef (+88 more)

### Community 2 - "migrate.ts"
Cohesion: 0.02
Nodes (146): AppliedRow, Runnable, Settling, StartupInput, MultiStatementRunner, Difference, OwnPart, PlannedSchema (+138 more)

### Community 20 - "config-check.ts"
Cohesion: 0.03
Nodes (88): CheckFinding, CheckStep, ConfigCheckSeams, StepName, StepReport, StepStatus, commandTarget, DatabaseState (+80 more)

### Community 202 - ".query"
Cohesion: 0.24
Nodes (9): Outcome, rowAt(), snapshot(), "on-after-db-write"(), "on-compute"(), problems(), rowCounts(), statsModule (+1 more)

### Community 204 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 205 - "RuntimeMetadata"
Cohesion: 0.24
Nodes (3): RuntimeMetadata, hexOf(), walkOver()

### Community 206 - "childRefKeys"
Cohesion: 0.40
Nodes (3): ChildReader, childRefKeys(), readChildren()

### Community 207 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 208 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 21 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (91): DeployTx, Upstream, contractFixture, RawPackage, AdapterSubject, AdapterWorkerHost, Decimal, Fullness (+83 more)

### Community 22 - "core-transport.ts"
Cohesion: 0.03
Nodes (75): CoreTransport, Session, TransportLimits, TransportTls, Committed, Hello, HelloAck, JsonValue (+67 more)

### Community 228 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 23 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (94): BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsed, BlockParsedOptions, TransactionParser, ChainTransaction, ChainEvent (+86 more)

### Community 237 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 24 - "core-config.test.ts"
Cohesion: 0.04
Nodes (73): adminRoutes, AdminChannel, AdminServeOptions, ToAdmin, AdminStartOptions, AdminAnswer, AdminEndpoint, AdminPart (+65 more)

### Community 243 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 25 - "tools_tape_index_taperecord"
Cohesion: 0.04
Nodes (49): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step, Frame (+41 more)

### Community 257 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 26 - "ledger-tapes.ts"
Cohesion: 0.05
Nodes (88): BlockSpec, EventSpec, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry (+80 more)

### Community 27 - "builds.ts"
Cohesion: 0.04
Nodes (73): startHashDecision, DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, TickerConfig, PausableConfig, CheckTarget (+65 more)

### Community 28 - "ref_node_fs"
Cohesion: 0.07
Nodes (57): RestoreCommandSeams, BackupBackend, BackupDatabase, killedRestore, cliProject, Pem, catalogOf(), connectionOf() (+49 more)

### Community 29 - "ref_node_timers"
Cohesion: 0.04
Nodes (68): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, IgnoredJob, CommandResult, RunningCommand, statsConfig (+60 more)

### Community 3 - "admin-harness.ts"
Cohesion: 0.03
Nodes (158): FromAdmin, AdminServer, ProcessConfig, AdminRun, AdminRunOptions, Answered, Answerer, Expected (+150 more)

### Community 30 - "node-format.ts"
Cohesion: 0.05
Nodes (59): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+51 more)

### Community 31 - "core-private-source.test.ts"
Cohesion: 0.04
Nodes (40): PrivateBlockSource, privateIntake, PrivateIntakeOptions, SourceTransport, StartHashes, PublicConfiguration, PublicDatabase, PublicSide (+32 more)

### Community 32 - "contract-data-checks.ts"
Cohesion: 0.06
Nodes (80): contractScenario, ContractScenarioOptions, LogLine, Program, Ran, ScenarioTx, handoff, HandoffAt (+72 more)

### Community 33 - "ledger/types.ts"
Cohesion: 0.05
Nodes (72): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+64 more)

### Community 34 - "pause-fixtures.ts"
Cohesion: 0.04
Nodes (63): backupSignalRelay, SignalSource, stopSignal, BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable (+55 more)

### Community 35 - "host.ts"
Cohesion: 0.06
Nodes (51): LoadLedger, RetainedState, LedgerName, ChainOutcome, LedgerPackageOptions, ParsedTransaction, AppliedState, ApplyBlock (+43 more)

### Community 36 - ".read"
Cohesion: 0.04
Nodes (72): SchemaPlan, Chain, ChainOptions, DigestRow, Op, States, TableName, identityRow() (+64 more)

### Community 38 - "binding.test.ts"
Cohesion: 0.06
Nodes (57): A113Observation, A156Observation, Binding, Created, Outcome, InstanceHashes, OptedOutObservation, Refusal (+49 more)

### Community 39 - "LedgerPackage"
Cohesion: 0.06
Nodes (31): LedgerPackage, LedgerTaskBlock, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, hexOf(), idOf() (+23 more)

### Community 4 - "InMemoryBlockSource"
Cohesion: 0.02
Nodes (149): InMemoryBlockSource, ProcessingEnd, ProcessStatus, Job, WorkerEvent, A77Observation, A78Observation, A78Refusal (+141 more)

### Community 40 - "validation.ts"
Cohesion: 0.03
Nodes (64): LedgerTableSettings, TransportReaderSettings, DatabasePartsInput, PrivateCoreSettings, PublicCoreSettings, PlacedDeclaration, Plain, Absent (+56 more)

### Community 42 - "backup/backup.ts"
Cohesion: 0.06
Nodes (61): BackupInput, BackupSeams, BackupTarget, BackupFacts, ManifestHistoryRow, ManifestMigration, ManifestTool, DumpInput (+53 more)

### Community 43 - "FinalizedLoop"
Cohesion: 0.05
Nodes (20): Activity, FinalizedLoop, LoopObserver, Startup, SkipsLockstep, WaitingInRead, ItemsAfterWrite, SilentHalt (+12 more)

### Community 45 - "transport-faults.test.ts"
Cohesion: 0.05
Nodes (47): ResultColumn, Message, MessageType, TestCertificates, Ended, rawClient, Escape, publicState (+39 more)

### Community 46 - "column-rules.ts"
Cohesion: 0.04
Nodes (67): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+59 more)

### Community 47 - "real-tapes.ts"
Cohesion: 0.05
Nodes (43): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+35 more)

### Community 48 - ".value"
Cohesion: 0.09
Nodes (39): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef (+31 more)

### Community 49 - "slow-block-harness.ts"
Cohesion: 0.08
Nodes (52): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+44 more)

### Community 5 - "declaration.ts"
Cohesion: 0.02
Nodes (124): BlockWriteHandle, ReadHandle, SchemaWriteHandle, MigrationPart, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable (+116 more)

### Community 50 - "networks.ts"
Cohesion: 0.05
Nodes (56): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+48 more)

### Community 51 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (54): TransactionHistoryStorage, PgTransactionHistoryStorage, [0.9.5] - 2026-07-25 — "Penumbra", Added, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout (+46 more)

### Community 52 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (42): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+34 more)

### Community 53 - "version-checks.ts"
Cohesion: 0.08
Nodes (43): MetadataBlock, MetadataNode, RuntimeMetadataEntry, Boundary, CallRecord, CountingNode, MetadataSelector, Select (+35 more)

### Community 54 - "worker-storage.test.ts"
Cohesion: 0.05
Nodes (45): ApplyInput, ApplyOutput, StateSummary, StoredNode, LedgerHeight, Ledger, NodeRoot, AdapterWorkerAnswer (+37 more)

### Community 55 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (34): Because, columnVerdict, DefaultPart, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+26 more)

### Community 56 - "ingest-harness.ts"
Cohesion: 0.08
Nodes (48): BodyExtrinsic, Manifest, Restored, ChainBuildOptions, IngestOptions, SourceClass, watched, RestartEvent (+40 more)

### Community 57 - "loop-stop-harness.ts"
Cohesion: 0.08
Nodes (40): A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore (+32 more)

### Community 58 - "boundary.test.ts"
Cohesion: 0.08
Nodes (44): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+36 more)

### Community 59 - "mapping.ts"
Cohesion: 0.07
Nodes (38): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+30 more)

### Community 6 - "ModuleDeclaration"
Cohesion: 0.03
Nodes (144): Transaction, ErrorCode, ItemSink, ModuleDeclaration, PointName, EntryRange, GraphInput, HeightRange (+136 more)

### Community 60 - "transaction-history-storage.property.test.ts"
Cohesion: 0.06
Nodes (27): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, ReplayableStorage, capitalize(), abortErrorLike(), capitalize(), applyCommand() (+19 more)

### Community 61 - "NodeBlockSource"
Cohesion: 0.10
Nodes (12): HeadWait, NodeBlockSource, NodeHeader, QueueRunner, NoWindow, Refetches, TrustsNotifications, decodeExtrinsics() (+4 more)

### Community 62 - "backup/restore.ts"
Cohesion: 0.08
Nodes (42): PrivateChecks, PrivateShared, PrivateSourceOptions, PublicIdentity, Checked, PublicSide, RestoreChain, RestoreInput (+34 more)

### Community 63 - "graph.ts"
Cohesion: 0.07
Nodes (49): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+41 more)

### Community 64 - "vitest"
Cohesion: 0.06
Nodes (22): Served, Finding, Finding, isolationProblems(), serveCommand(), moduleSpecifier(), scanRoots(), scanSource() (+14 more)

### Community 65 - "checkShape"
Cohesion: 0.07
Nodes (39): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+31 more)

### Community 66 - "cbor.ts"
Cohesion: 0.09
Nodes (38): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+30 more)

### Community 67 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (32): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+24 more)

### Community 68 - "retirement.test.ts"
Cohesion: 0.07
Nodes (42): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+34 more)

### Community 7 - "config/history.ts"
Cohesion: 0.03
Nodes (149): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, TransportReader, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder (+141 more)

### Community 70 - "in-memory-source.ts"
Cohesion: 0.08
Nodes (32): InMemoryItems, Wait, StandInOptions, Commit, Committed, blockHeaderOf(), checkParent(), commitBlock() (+24 more)

### Community 71 - "paused-harness.ts"
Cohesion: 0.09
Nodes (37): A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running, commandBuild() (+29 more)

### Community 75 - "core-ledger-state.ts"
Cohesion: 0.09
Nodes (37): retainedStates, CoreRevision, applyBlock(), boundLedger(), bytesOf(), computeBlock(), contractsOf(), deployedBelow() (+29 more)

### Community 76 - "net.test.ts"
Cohesion: 0.08
Nodes (21): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortUpgrade (+13 more)

### Community 77 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (31): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, Row, copyArray(), copyObject() (+23 more)

### Community 8 - "opt-out.test.ts"
Cohesion: 0.03
Nodes (121): CaptureColumn, CapturedTable, CaptureState, CheckedMigration, CanonicalEncodingError, ChangeKind, tableChanges, TouchedRow (+113 more)

### Community 80 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.07
Nodes (29): LedgerTask, EngineOptions, bindLedgerTasks(), boundHost(), frozen(), hasLedgerTasks(), resultsOf(), withItems() (+21 more)

### Community 81 - "private/lockstep-wait.test.ts"
Cohesion: 0.08
Nodes (21): Report, ExpectedWait, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, a117Problems(), firstWait() (+13 more)

### Community 83 - "pack-install.mjs"
Cohesion: 0.09
Nodes (35): Surface, SmokeFailure, coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), runtimeValues(), section12() (+27 more)

### Community 84 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (37): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+29 more)

### Community 86 - "transform-checks.ts"
Cohesion: 0.09
Nodes (19): Failure, Variant, TapeError, baseRecords(), expectedText(), expectVariantOutput(), forkRecords(), changedLines() (+11 more)

### Community 87 - "process-worker.ts"
Cohesion: 0.09
Nodes (27): BrowserConfiguration, BrowserRun, PrivateInstance, Scope, crossedError, FromProcessWorker, StartRun, ToProcessWorker (+19 more)

### Community 88 - "dispatch.test.ts"
Cohesion: 0.11
Nodes (32): Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointSchedule, CoreStopsFirst, boundaryModules(), dispatch() (+24 more)

### Community 9 - "runner/process.ts"
Cohesion: 0.02
Nodes (77): Bound, ChainCheck, ChainCheckInput, ChainIdentity, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait (+69 more)

### Community 90 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (24): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+16 more)

### Community 92 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.05
Nodes (36): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+28 more)

### Community 94 - "BlockRef"
Cohesion: 0.09
Nodes (11): QueuedBlock, BlockItems, BlockRef, InMemorySourceOptions, Fetching, Recorder, KeptItems, KeptLoop (+3 more)

### Community 95 - "browser.test.ts"
Cohesion: 0.08
Nodes (35): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+27 more)

### Community 96 - "release-version.ts"
Cohesion: 0.12
Nodes (35): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+27 more)

### Community 99 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 191 - "7. Storage helpers"
Cohesion: 0.17
Nodes (10): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The node on `/status`, The transport reader, TLS to PostgreSQL: `ssl` (+2 more)

### Community 225 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 108 - "T"
Cohesion: 0.07
Nodes (29): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get` (+21 more)

### Community 130 - "2. Points"
Cohesion: 0.09
Nodes (24): refused(), 2. Points, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents (+16 more)

### Community 150 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 153 - "core-ledger-state.test.ts"
Cohesion: 0.12
Nodes (13): bindLedgerParser(), boundLedgerParser(), workerParser(), bindCoreLedgerState(), itemsOf(), writeBlock(), applied(), bound() (+5 more)

### Community 175 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (13): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+5 more)

### Community 177 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 182 - "following"
Cohesion: 0.18
Nodes (14): text(), transportReader(), following(), Backup and restore, Configuration files, Example: loading `stats-module`, Private processes, briefly, Project status, development and links (+6 more)

### Community 183 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 193 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 195 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 199 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 221 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 223 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 230 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 254 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 286 - "firstRegularAtParentTime"
Cohesion: 0.60
Nodes (3): parentTimeOf(), firstRegularAtParentTime(), parentTimestampMs()

### Community 288 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 297 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 37 - "history"
Cohesion: 0.03
Nodes (70): integer(), history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+62 more)

### Community 41 - ".put"
Cohesion: 0.03
Nodes (64): coreTxResultsOnParse(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+56 more)

### Community 44 - "version"
Cohesion: 0.03
Nodes (67): side(), migrations(), version(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules (+59 more)

### Community 69 - "code"
Cohesion: 0.05
Nodes (42): code(), Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in) (+34 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 85 - "ledger-state.test.ts"
Cohesion: 0.12
Nodes (37): a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows(), expectedStates(), ledgerItemsWatcher(), nodeProblems() (+29 more)

### Community 91 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 101 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.06
Nodes (31): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict, 1. The twenty gate items (+23 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 133 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 144 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 145 - "README.md"
Cohesion: 0.10
Nodes (16): [0.10.0] - 2026-10-27, Added, Breaking changes, Changelog, [Unreleased], Choosing a database, Generate your local wallet, Test wallets (+8 more)

### Community 148 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.09
Nodes (20): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+12 more)

### Community 149 - "package.json"
Cohesion: 0.09
Nodes (21): bugs, url, description, exports, files, homepage, license, main (+13 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 156 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 160 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (18): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+10 more)

### Community 161 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 164 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 166 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 167 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 180 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 181 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 186 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 187 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 192 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 194 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 197 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 198 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 200 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 201 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 203 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 209 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 210 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 211 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

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

### Community 217 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 218 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 219 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 220 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 222 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 224 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 226 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 229 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 231 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 232 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 233 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 234 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 235 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 236 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 239 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 240 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 241 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 242 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 244 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 245 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 246 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 247 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 248 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 249 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 250 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 251 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 252 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 253 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 255 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 256 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 258 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 259 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 260 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 261 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 262 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 263 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 264 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 265 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 266 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 267 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 268 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 269 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 270 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 271 - "00033 — `umbradb restore` fails on a configuration with a module whose entry starts above the backup's height"
Cohesion: 0.40
Nodes (4): 00033 — `umbradb restore` fails on a configuration with a module whose entry starts above the backup's height, Evidence, Problem, Suggested fix

### Community 272 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 273 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 274 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 275 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 276 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 277 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 278 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 279 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 280 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 281 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 282 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 283 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 284 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 285 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 289 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 290 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 291 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 292 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 293 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 294 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 295 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 296 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 301 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 302 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 72 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped (+32 more)

### Community 89 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-16 Chain-data reads name their view and height, Requirement: RN-1 The main program is a fixed sequence of points (+29 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-9110`, `RFC-6455`, `RFC-6455`, `RFC-3339`, `RFC-7693` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3735 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `UmbraError`, `api-server.test.ts`, `migrate.ts`, `admin-harness.ts`, `InMemoryBlockSource`, `declaration.ts`, `ModuleDeclaration`, `config/history.ts`, `opt-out.test.ts`, `runner/process.ts`, `node-fields-harness.ts`, `ref_node_url`, `tape/index.ts`, `node-source.test.ts`, `NodeClient`, `.from`, `process-admin.ts`, `client.test.ts`, `process-backends.ts`, `validate.ts`, `config-check.ts`, `adapter-fixtures.ts`, `core-transport.ts`, `core-block-parsed.ts`, `core-config.test.ts`, `tools_tape_index_taperecord`, `ledger-tapes.ts`, `builds.ts`, `ref_node_fs`, `ref_node_timers`, `node-format.ts`, `core-private-source.test.ts`, `contract-data-checks.ts`, `ledger/types.ts`, `pause-fixtures.ts`, `.read`, `binding.test.ts`, `validation.ts`, `backup/backup.ts`, `transport-faults.test.ts`, `real-tapes.ts`, `slow-block-harness.ts`, `networks.ts`, `interfaces/transaction-history-storage.ts`, `version-checks.ts`, `worker-storage.test.ts`, `column-rules.test.ts`, `ingest-harness.ts`, `loop-stop-harness.ts`, `boundary.test.ts`, `mapping.ts`, `transaction-history-storage.property.test.ts`, `backup/restore.ts`, `file-mode.test.ts`, `retirement.test.ts`, `in-memory-source.ts`, `paused-harness.ts`, `core-ledger-state.ts`, `net.test.ts`, `config/plain-data.ts`, `ledger/ledger-tasks.test.ts`, `private/lockstep-wait.test.ts`, `pack-install.mjs`, `cbor.property.test.ts`, `ledger-state.test.ts`, `transform-checks.ts`, `dispatch.test.ts`, `cold-boot-recovery.integration.test.ts`, `browser.test.ts`, `release-version.ts`, `core.ts`, `worker-host.test.ts`, `order.property.test.ts`, `browser/build.ts`, `pg-tx-history-adapter.ts`, `code-registry.ts`, `ledger-sweep.test.ts`, `Lockstep`, `src/ledger/identity.ts`, `pglite-processes.ts`, `documents.ts`, `checks.test.ts`, `test/postgres/setup.ts`, `ws-mutual-tls.test.ts`, `ledger/load.ts`, `read-gate.ts`, `crash.test.ts`, `intake.test.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `pglite-server.ts`, `restore-private.ts`, `shims.test.ts`, `node-bridge.ts`, `block-fetch-decode.test.ts`, `lockstep-refusals.test.ts`, `example-checks.ts`, `package.json`, `key-handling-checks.ts`, `core-ledger-state.test.ts`, `excluded-not-exported.test.ts`, `sweep.ts`, `LoopPauses`, `validation.test.ts`, `signal-backup.test.ts`, `statementsOf`, `pglite-timeouts.test.ts`, `mutation-per-adapter.mjs`, `web-lock.ts`, `twox.ts`, `facade-merge-loader.ts`, `ledger/plain-data.ts`, `worker-threads.test.ts`, `vendored-ledger-files.test.ts`, `firstRegularAtParentTime`?**
  _High betweenness centrality (0.236) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-9110`, `RFC-6455`, `RFC-6455` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.019839041736851956 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `api-server.test.ts`, `migrate.ts`, `admin-harness.ts`, `InMemoryBlockSource`, `declaration.ts`, `ModuleDeclaration`, `config/history.ts`, `opt-out.test.ts`, `shims.test.ts`, `runner/process.ts`, `node-fields-harness.ts`, `tape/index.ts`, `node-source.test.ts`, `NodeClient`, `2. Points`, `process-admin.ts`, `client.test.ts`, `process-backends.ts`, `validate.ts`, `config-check.ts`, `lockstep-refusals.test.ts`, `core-transport.ts`, `core-ledger-state.test.ts`, `tools_tape_index_taperecord`, `builds.ts`, `ref_node_fs`, `core-private-source.test.ts`, `ledger/types.ts`, `pause-fixtures.ts`, `host.ts`, `.read`, `binding.test.ts`, `validation.ts`, `validation.test.ts`, `backup/backup.ts`, `statementsOf`, `FinalizedLoop`, `transport-faults.test.ts`, `backupAtStop`, `slow-block-harness.ts`, `networks.ts`, `web-lock.ts`, `version-checks.ts`, `ingest-harness.ts`, `mapping.ts`, `NodeBlockSource`, `backup/restore.ts`, `graph.ts`, `vitest`, `checkShape`, `cbor.ts`, `in-memory-source.ts`, `core-ledger-state.ts`, `config/plain-data.ts`, `RuntimeMetadata`, `ledger/ledger-tasks.test.ts`, `BlockRef`, `src/ledger/identity.ts`, `node-source.ts`, `checks.test.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `api-server.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01870557426112982 - nodes in this community are weakly interconnected._