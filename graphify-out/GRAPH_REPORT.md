# Graph Report - UmbraDB

## Corpus Check
- 1192 files · ~1,687,714 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12446 nodes · 38390 edges · 362 communities (317 shown, 45 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3207 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `cefcbd81fd7d360a` (1192 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- declaration.ts
- migrate.ts
- core-ledger-state.ts
- page.ts
- browser/build.ts
- api-socket.ts
- transaction-history-storage.property.test.ts
- private/lockstep-wait.test.ts
- InMemoryBlockSource
- redact.ts
- cold-boot-recovery.integration.test.ts
- src/config/load.ts
- release-version.ts
- core-config.test.ts
- contract-data-checks.ts
- resolver-boundary.ts
- process-worker.ts
- .concat
- postgres/transaction-history-storage.ts
- ChannelEndpoint
- chrome.ts
- code-registry.ts
- pg-tx-history-adapter.ts
- ingest-harness.ts
- test/postgres/setup.ts
- paused-harness.ts
- documents.ts
- node-run.ts
- LoopPauses
- Lockstep
- core.ts
- interfaces/transaction-history-storage.ts
- validate.ts
- relays.ts
- crash.test.ts
- cli/run.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- restore-private.ts
- .from
- HeightRun
- surface.test.ts
- node-source.test.ts
- node-bridge.ts
- start-umbradb.test.ts
- signal-ignored-fixtures.ts
- pack-install.mjs
- runner/process.ts
- core-block-fetch.test.ts
- ledger/metadata.ts
- block-fetch-decode.test.ts
- library-documents.test.ts
- version-table.ts
- key-handling-checks.ts
- column-rules.ts
- ModuleApi
- ws-mutual-tls.test.ts
- ApiRoutes
- client.test.ts
- quiet-host.child.ts
- no-indexer-or-wallet-sdk.test.ts
- web-lock.ts
- sha256
- Buffer
- vitest
- api-answers.ts
- browser/src/config/load.ts
- worker-threads.test.ts
- deterministic-postgresql/checks.ts
- Heartbeat
- src/db/postgres.ts
- core-status.test.ts
- worker-threads-worker.ts
- buffer.ts
- Design — Sprint 1: project setup + TemporalKV
- SubscriptionConnection
- TapeAnswers
- Worker
- NodeClient
- backup/backup.ts
- sqlite-warning.test.ts
- ProcessItems
- tape/index.ts
- .slowBlock
- .write
- builds.ts
- ledger/plain-data.ts
- Activity
- renamed-setting.test.ts
- vendored-ledger-files.test.ts
- entries.ts
- mutation-evidence.d.mts
- stats.ts
- process-backends.ts
- AsyncLocalStorage
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- builder.test.ts
- HeldRead
- chain-placement.test.ts
- refused-configuration.test.ts
- api-server.test.ts
- zod
- aborted
- core-block-parsed.ts
- config-check.ts
- PageApiChannel
- Outage
- NodeFS
- node-format.ts
- adapter.ts
- SkipsLockstep
- WaitingInRead
- ItemsAfterWrite
- SilentHalt
- EagerLoop
- FailingAfter
- DropsHeld
- NeverClears
- NeverClears
- NoRedelivery
- LedgerPackage
- CommitsTheBoundary
- core-transport.ts
- library/modules.test.ts
- .value
- database-parts.ts
- ledger/types.ts
- 5. Runner
- validation.ts
- config/history.ts
- listening.test.ts
- UmbraError
- range.ts
- transform-checks.ts
- messages.ts
- cbor.property.test.ts
- NodeBlockSource
- ref_node_fs
- module-tables.ts
- loop-stop-harness.ts
- chain-process.test.ts
- range.test.ts
- start-umbradb.ts
- ref_node_crypto
- admin-harness.ts
- ledger/ledger-tasks.test.ts
- post-block-update-checks.ts
- slow-block-harness.ts
- core-chain.test.ts
- sweep-tapes.ts
- FinalizedLoop
- browser.test.ts
- PgTransactionHistoryStorage
- ledger-storage.test.ts
- api.ts
- cbor.ts
- configured.ts
- package-startup-checks.ts
- version-checks.ts
- transport.test.ts
- boundary.test.ts
- ledger-storage-checks.ts
- resolve.ts
- checkShape
- retirement.test.ts
- backup/restore.ts
- file-mode.test.ts
- change-capture.ts
- private-transport.ts
- binding.test.ts
- contents-hash.ts
- BlockRef
- example-checks.ts
- mapping.ts
- core-block-commit.test.ts
- config/plain-data.ts
- startUmbraDB
- cursor-table.test.ts
- ingest-faults.test.ts
- real-tapes.ts
- networks.ts
- containers.test.ts
- ADDED Requirements
- ADDED Requirements
- table
- data
- .off
- graph.py
- ADDED Requirements
- .slowBlockMs
- connectChannel
- .disconnect
- conformance-gate.mjs
- mutation-per-adapter.mjs
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- api-session.test.ts
- readBody
- midnight-env — reproducible PREPROD dev environment
- .block
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- fresh-instance.mjs
- crash-worker.ts
- .put
- history
- code
- T
- ADDED Requirements
- version
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- The laws of UmbraDB's storage helpers
- README.md
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- Boundaries, threats and controls
- ADDED Requirements
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- try.sh
- ADDED Requirements
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- After 0.10.0
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- sqlite-warning.child.ts
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
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
- Proposal — Sprint 5: Lean M3a Watermarks W1
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
- 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 409 edges
2. `UmbraError` - 346 edges
3. `ModuleDeclaration` - 195 edges
4. `InMemoryBlockSource` - 172 edges
5. `FinalizedLoop` - 133 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 102 edges
8. `Database` - 101 edges
9. `startUmbraDB()` - 100 edges
10. `ReadHandle` - 92 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (362 total, 45 thin omitted)

### Community 0 - "declaration.ts"
Cohesion: 0.02
Nodes (240): OpenedFacts, Database, MigrationPart, SchemaPlan, KnownPointsOnly, ModuleDeclaration, PointName, ProcessContext (+232 more)

### Community 1 - "migrate.ts"
Cohesion: 0.02
Nodes (132): SchemaWriteHandle, AppliedRow, Runnable, Settling, StartupInput, CheckedMigration, Difference, OwnPart (+124 more)

### Community 10 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (113): LedgerStateItem, RetainedState, retainedStates, CoreRevision, StateRow, StoredState, GreyView, SweepPhase (+105 more)

### Community 100 - "page.ts"
Cohesion: 0.06
Nodes (31): ApiChannel, LinkRecord, PageState, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp() (+23 more)

### Community 101 - "browser/build.ts"
Cohesion: 0.07
Nodes (29): BrowserBuild, BrowserBuildOptions, BrowserControl, checkedLedgers, pageBench, PageServer, browserLedgerEntry(), browserPlugin() (+21 more)

### Community 103 - "api-socket.ts"
Cohesion: 0.12
Nodes (31): coreHeaders, StartedModuleApi, ChannelConnectOptions, connectionRules, FetchHandler, ModuleApiLimits, ServedConnection, ModuleApiHandlerOptions (+23 more)

### Community 106 - "transaction-history-storage.property.test.ts"
Cohesion: 0.08
Nodes (23): EntryContent, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, Command, ReplayableStorage, abortErrorLike(), capitalize(), applyCommand() (+15 more)

### Community 107 - "private/lockstep-wait.test.ts"
Cohesion: 0.11
Nodes (36): LockstepCondition, OpenTransaction, A118Observation, MismatchObservation, ExpectedWait, WaitSample, hashAt(), inMemoryBlock() (+28 more)

### Community 11 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (114): ProcessReason, InMemoryBlockSource, ProcessingEnd, ProcessStatus, Observation, Flaky, ProcessObservation, StartVia (+106 more)

### Community 111 - "redact.ts"
Cohesion: 0.10
Nodes (29): RedactionForms, SecretForm, TextPattern, transportReaderFacts, Needs, findings(), databaseText(), isMemoryDatabase() (+21 more)

### Community 112 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (22): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+14 more)

### Community 115 - "src/config/load.ts"
Cohesion: 0.08
Nodes (27): ImportedConfig, LoadOptions, WORKER, SignalEvent, SignalJob, configModules(), configModuleUrl(), configPath() (+19 more)

### Community 116 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 118 - "core-config.test.ts"
Cohesion: 0.11
Nodes (20): CommandBuildOptions, ChainBuildOptions, privateBackbone(), core(), get(), CORE_BLOCK_COMMIT, CORE_BLOCK_FETCH, CORE_CHAIN (+12 more)

### Community 12 - "contract-data-checks.ts"
Cohesion: 0.03
Nodes (123): ContractLog, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason, V9Raw (+115 more)

### Community 120 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 122 - "process-worker.ts"
Cohesion: 0.10
Nodes (23): ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker, withDevelopmentOptIn() (+15 more)

### Community 123 - ".concat"
Cohesion: 0.08
Nodes (20): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+12 more)

### Community 124 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (20): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+12 more)

### Community 125 - "ChannelEndpoint"
Cohesion: 0.15
Nodes (6): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), 4. Channels

### Community 126 - "chrome.ts"
Cohesion: 0.12
Nodes (15): Cdp, CdpEvent, ChromeBrowser, ChromeTab, Download, PageRequest, chrome(), chrome() (+7 more)

### Community 127 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 128 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 13 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (115): Scenario, A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, ArgType (+107 more)

### Community 130 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (24): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+16 more)

### Community 132 - "paused-harness.ts"
Cohesion: 0.15
Nodes (25): Body, PausedExpectation, Read, Reader, commandBuild(), keeperModule(), keepingPause(), pausedOf() (+17 more)

### Community 133 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 134 - "node-run.ts"
Cohesion: 0.10
Nodes (22): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, NodeRunResult, core(), databaseOf() (+14 more)

### Community 136 - "LoopPauses"
Cohesion: 0.09
Nodes (17): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, clock(), watched(), 1. Module layout, 2. Backend routing (the one non-obvious constraint) (+9 more)

### Community 137 - "Lockstep"
Cohesion: 0.11
Nodes (11): InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal, byId() (+3 more)

### Community 138 - "core.ts"
Cohesion: 0.15
Nodes (21): BaselineLoad, Comparison, CommitOptions, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline() (+13 more)

### Community 139 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 14 - "validate.ts"
Cohesion: 0.02
Nodes (129): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, HistoryFinding, plainData (+121 more)

### Community 140 - "relays.ts"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 141 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 143 - "cli/run.ts"
Cohesion: 0.11
Nodes (19): backupSignalRelay, RunOptions, RunSeams, SignalSource, stopSignal, BackupSignals, UserModulesSource, PausableOptions (+11 more)

### Community 144 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 145 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 146 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 147 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 149 - "restore-private.ts"
Cohesion: 0.17
Nodes (20): Manifest, FileProcess, privateBackup, PublicSetting, PublicSide, PublicSideOptions, heightsFrom(), pmModule() (+12 more)

### Community 15 - ".from"
Cohesion: 0.04
Nodes (109): StateSummary, CallTx, DeployTx, Call, LedgerHeight, recordedGenesis, Upstream, contractFixture (+101 more)

### Community 150 - "HeightRun"
Cohesion: 0.09
Nodes (10): EntryBoundary, HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite (+2 more)

### Community 151 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 153 - "node-source.test.ts"
Cohesion: 0.11
Nodes (22): Opened, RootWithoutSignal, at(), cursorRead(), expectRootsEndWithTheirRun(), following(), hashAndBlock(), open() (+14 more)

### Community 154 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 155 - "start-umbradb.test.ts"
Cohesion: 0.13
Nodes (17): ModuleListRule, GoneCwdResult, moduleListProblems(), closedByItself(), hostile(), optionProblems(), throwing(), runQuietChild() (+9 more)

### Community 158 - "signal-ignored-fixtures.ts"
Cohesion: 0.11
Nodes (18): ListenedRun, WorkerSignals, RunningCommand, listenerProblems(), namesUnder(), pacedNode(), runWorkerInChild(), signalLines() (+10 more)

### Community 159 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 16 - "runner/process.ts"
Cohesion: 0.03
Nodes (66): NodeWait, CoreVersion, ConfigFinding, ReasonCode, RetryCode, Unwrapped, PauseBy, PauseHold (+58 more)

### Community 160 - "core-block-fetch.test.ts"
Cohesion: 0.11
Nodes (12): BlockHeaderItem, BlockItemSource, CoreBlockHeader, CoreBlockItems, coreBlockFetchOnFetch(), isBlockItemSource(), chainBackbone(), blockContext() (+4 more)

### Community 161 - "ledger/metadata.ts"
Cohesion: 0.13
Nodes (9): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, OwnStateMetadata, contentStateOf(), hexOf() (+1 more)

### Community 163 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 164 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 165 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 166 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 17 - "column-rules.ts"
Cohesion: 0.02
Nodes (111): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+103 more)

### Community 170 - "ModuleApi"
Cohesion: 0.14
Nodes (11): ApiResponse, ModuleApi, Leaking, apiErrorResponse(), encodeJson(), hex(), matches(), read() (+3 more)

### Community 177 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 178 - "ApiRoutes"
Cohesion: 0.20
Nodes (10): ModuleApiStart, MountedApiSeams, ApiRoutes, ModuleApiOptions, parsePath(), registerModuleApis(), shapeOf(), routesOf() (+2 more)

### Community 18 - "client.test.ts"
Cohesion: 0.03
Nodes (70): Connection, NodeClientOptions, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, SocketFailure (+62 more)

### Community 184 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 185 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 186 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 187 - "sha256"
Cohesion: 0.22
Nodes (7): Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 188 - "Buffer"
Cohesion: 0.15
Nodes (9): Buffer, Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser (+1 more)

### Community 19 - "vitest"
Cohesion: 0.02
Nodes (85): Served, ParentJob, Kill, Orphaned, SourceFile, Lockfile, Manifest, RepositoryFile (+77 more)

### Community 191 - "api-answers.ts"
Cohesion: 0.23
Nodes (12): HeadersArgument, LifecycleStatus, answerNotServing(), byteLength(), lifecycleBody(), lifecycleHeaders(), notServingResponse(), refuseChannelNotServing() (+4 more)

### Community 192 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 193 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 197 - "deterministic-postgresql/checks.ts"
Cohesion: 0.19
Nodes (12): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, checkFunctionsSql(), numericOkPredicate(), refusedNumbersPath() (+4 more)

### Community 198 - "Heartbeat"
Cohesion: 0.24
Nodes (7): Heartbeat, HeartbeatOptions, TimerHandle, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 2 - "src/db/postgres.ts"
Cohesion: 0.03
Nodes (120): BenchEnv, Transaction, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, driverConnectionOptions (+112 more)

### Community 20 - "core-status.test.ts"
Cohesion: 0.04
Nodes (93): ConfigFacts, NetworkShown, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings (+85 more)

### Community 200 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 201 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 203 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.18
Nodes (11): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+3 more)

### Community 205 - "SubscriptionConnection"
Cohesion: 0.35
Nodes (4): SubscriptionCarrier, SubscriptionConnection, errorMessage(), socketConnection()

### Community 206 - "TapeAnswers"
Cohesion: 0.32
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 21 - "NodeClient"
Cohesion: 0.05
Nodes (73): NodeSourceOptions, CoreChainBinding, FinalizedHeightOptions, HeadSubscriber, NodeClient, Pending, State, Subscription (+65 more)

### Community 22 - "backup/backup.ts"
Cohesion: 0.03
Nodes (99): BackupInput, BackupSeams, BackupTarget, BackupWritten, ManifestMigration, ManifestTool, DumpInput, PgliteDump (+91 more)

### Community 223 - "sqlite-warning.test.ts"
Cohesion: 0.24
Nodes (6): EmitWarning, WarningHook, ChildResult, isSqliteWarning(), quietImport(), SQLITE

### Community 23 - "tape/index.ts"
Cohesion: 0.05
Nodes (75): Link, TapeBuilderOptions, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json (+67 more)

### Community 236 - ".write"
Cohesion: 0.22
Nodes (5): IgnoresTheStop, PausesInsideTheHeight, StaysPaused, abortOf(), never()

### Community 24 - "builds.ts"
Cohesion: 0.04
Nodes (88): AdminStarter, PrivateIntakeOptions, ReadOnlyDatabase, A176Options, KeeperGlobals, A165Options, PrivateOptions, PrivateProcess (+80 more)

### Community 244 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 245 - "Activity"
Cohesion: 0.25
Nodes (3): PointRun, Activity, tracked()

### Community 246 - "renamed-setting.test.ts"
Cohesion: 0.39
Nodes (6): Renamed, databaseOf(), dataOf(), escaped(), fileOf(), FINDING()

### Community 247 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 25 - "entries.ts"
Cohesion: 0.03
Nodes (94): CoreLedgerVersion, LedgerPackageIdentity, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder (+86 more)

### Community 257 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 259 - "stats.ts"
Cohesion: 0.33
Nodes (4): ManualOpts, TinybenchOpts, measureManual(), tinybench

### Community 26 - "process-backends.ts"
Cohesion: 0.04
Nodes (83): NodeHttpHandler, NodeUpgradeHandler, gate, SecretHashes, Compared, ConnectSeen, PortPeer, Expected (+75 more)

### Community 265 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 27 - "builder.test.ts"
Cohesion: 0.03
Nodes (46): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata, Step (+38 more)

### Community 277 - "HeldRead"
Cohesion: 0.60
Nodes (3): HeldRead, concurrent(), queued()

### Community 28 - "chain-placement.test.ts"
Cohesion: 0.05
Nodes (89): BlockSpec, EventSpec, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry (+81 more)

### Community 29 - "refused-configuration.test.ts"
Cohesion: 0.04
Nodes (82): EngineConfig, Start, Refusal, Start, startProcess(), adminCore(), adminSnapshot(), adminSource() (+74 more)

### Community 3 - "api-server.test.ts"
Cohesion: 0.02
Nodes (127): StatsRow, Outcome, UmbraConfig, BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, heightVersionedTable (+119 more)

### Community 30 - "zod"
Cohesion: 0.04
Nodes (72): EndpointOptions, Envelope, MessagePortLike, controlledTimers, PeerEnd, PeerMessage, rawPeer, TestEnd (+64 more)

### Community 309 - "aborted"
Cohesion: 0.40
Nodes (3): DoesNotHold, EndsTheRun, aborted()

### Community 31 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (83): BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent, EventPhase, itemsSeen (+75 more)

### Community 32 - "config-check.ts"
Cohesion: 0.04
Nodes (72): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, StepName, StepReport (+64 more)

### Community 33 - "node-format.ts"
Cohesion: 0.05
Nodes (59): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+51 more)

### Community 34 - "adapter.ts"
Cohesion: 0.04
Nodes (67): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+59 more)

### Community 35 - "LedgerPackage"
Cohesion: 0.05
Nodes (43): LedgerPackage, LedgerEngine, LedgerTaskFailed, StagenetBlockJson, StagenetFixtureJson, stagenetReplay, hexOf(), idOf() (+35 more)

### Community 36 - "core-transport.ts"
Cohesion: 0.04
Nodes (61): PrivateLinkAddress, PrivateLinkConnect, ResultColumn, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected (+53 more)

### Community 37 - "library/modules.test.ts"
Cohesion: 0.04
Nodes (55): UmbraDBHandle, NetworkRuleName, Hold, Signal, Job, Run, QuietResult, Job (+47 more)

### Community 38 - ".value"
Cohesion: 0.07
Nodes (56): BodyExtrinsic, ExtrinsicCall, BlockBody, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType (+48 more)

### Community 39 - "database-parts.ts"
Cohesion: 0.05
Nodes (52): DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, EngineInput, AdminRunOptions, TickerConfig, PausableConfig (+44 more)

### Community 4 - "ledger/types.ts"
Cohesion: 0.03
Nodes (118): LoadLedger, LedgerName, ApplyInput, ApplyOutput, ChainOutcome, LedgerTask, LedgerTaskBlock, NodeStore (+110 more)

### Community 40 - "5. Runner"
Cohesion: 0.05
Nodes (71): BlockHeader, Callback, ParallelPoint, PointArguments, PointSchedule, AppendsVersion, CallEvent, Recorder (+63 more)

### Community 41 - "validation.ts"
Cohesion: 0.04
Nodes (76): ErrorCode, Edge, GraphFacts, GraphInput, GraphPart, GraphRule, MidChain, Missing (+68 more)

### Community 42 - "config/history.ts"
Cohesion: 0.05
Nodes (63): CoreChainFacts, RestoreBase, BackupText, CheckState, ConfigCheckOptions, ConfigCheckSeams, CommandConfig, ProcessSide (+55 more)

### Community 43 - "listening.test.ts"
Cohesion: 0.04
Nodes (53): demoLink, coreEntry, PrivateLinkChannel, EngineOptions, NetworkInput, NetworkRequest, NetworkRule, PlannedNetwork (+45 more)

### Community 44 - "UmbraError"
Cohesion: 0.05
Nodes (37): databaseTarget, PostgresConnection, PostgresOptions, SslMode, ReadTimeoutSetting, JobQueue, PgliteDatabase, BoundedRead (+29 more)

### Community 45 - "range.ts"
Cohesion: 0.05
Nodes (63): BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange, Final (+55 more)

### Community 46 - "transform-checks.ts"
Cohesion: 0.07
Nodes (47): Failure, Variant, TapeError, TransformError, NotificationRange, expectGoldenRoundTrip(), baseRecords(), expectedText() (+39 more)

### Community 47 - "messages.ts"
Cohesion: 0.05
Nodes (58): Committed, MessageFault, readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, instanceIdSchema() (+50 more)

### Community 48 - "cbor.property.test.ts"
Cohesion: 0.04
Nodes (65): CaptureColumn, CanonicalEncodingFailure, CanonicalValue, ChangeKind, tableChanges, TouchedRow, ModuleColumn, ColumnType (+57 more)

### Community 49 - "NodeBlockSource"
Cohesion: 0.07
Nodes (21): BlockLedgerSource, HeadWait, NodeBlockSource, Prefetch, LedgerBinding, NodeSubscription, NodeHeader, PreparedBlock (+13 more)

### Community 5 - "ref_node_fs"
Cohesion: 0.04
Nodes (118): RestoreInput, BackupBackend, BackupDatabase, killedRestore, TickerHandle, BackupOnSignal, LoopClass, Pausable (+110 more)

### Community 53 - "module-tables.ts"
Cohesion: 0.06
Nodes (35): ModuleContentsFailure, ModuleTable, PageOptions, ConsistentRead, RefusalCode, DeterminismBackend, TestDatabase, TestServer (+27 more)

### Community 54 - "loop-stop-harness.ts"
Cohesion: 0.07
Nodes (53): SignalTarget, watched, A169Observation, LoopStopScenario, SourceOf, A167Observation, CheckOf, NodeWatch (+45 more)

### Community 56 - "chain-process.test.ts"
Cohesion: 0.04
Nodes (47): InMemoryItems, Wait, Job, WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation (+39 more)

### Community 57 - "range.test.ts"
Cohesion: 0.06
Nodes (29): Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+21 more)

### Community 58 - "start-umbradb.ts"
Cohesion: 0.07
Nodes (57): readOptions, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork, UmbraDBOptions, UmbraDBReason (+49 more)

### Community 59 - "ref_node_crypto"
Cohesion: 0.04
Nodes (46): Op, States, TableName, identityRow(), captured(), captureFunction(), moduleM(), restart() (+38 more)

### Community 6 - "admin-harness.ts"
Cohesion: 0.03
Nodes (131): MountedAdminAnswer, AdminSeams, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer (+123 more)

### Community 60 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.06
Nodes (46): IngestOptions, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses(), expectedCallArgs(), plainWatchModule() (+38 more)

### Community 61 - "post-block-update-checks.ts"
Cohesion: 0.07
Nodes (43): LedgerPackageOptions, V9Logs, LoadAdapter, RawPackage, Decimal, Fullness, OracleAfter, oracleCase (+35 more)

### Community 63 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (49): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+41 more)

### Community 64 - "core-chain.test.ts"
Cohesion: 0.06
Nodes (38): ChainSource, ConfiguredGenesis, WaitingListener, ConfigRow, HistoryCheck, HistoryRule, AppliedMigration, Holder (+30 more)

### Community 65 - "sweep-tapes.ts"
Cohesion: 0.09
Nodes (50): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, FixtureNode, FakeState, RefusalData (+42 more)

### Community 66 - "FinalizedLoop"
Cohesion: 0.09
Nodes (10): FinalizedLoop, UnexpectedCursor, call(), cursorText(), isBlock(), isRetryable(), runFinalized(), sameBytes() (+2 more)

### Community 67 - "browser.test.ts"
Cohesion: 0.08
Nodes (53): Reachable, RestoreAttempt, PageBackup, PageEvent, PageLink, PageRestore, ProcessName, StatusBody (+45 more)

### Community 68 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (42): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity (+34 more)

### Community 69 - "ledger-storage.test.ts"
Cohesion: 0.06
Nodes (45): Restored, ingest, RestartEvent, RestartJob, retentionSeen, TasksRun, WindowBackup, run() (+37 more)

### Community 7 - "api.ts"
Cohesion: 0.02
Nodes (112): ConfiguredDatabase, ConfiguredDatabaseOptions, Bound, ConfiguredDatabaseOptions, CommittedHeight, ReadOptions, MultiStatementRunner, Job (+104 more)

### Community 70 - "cbor.ts"
Cohesion: 0.08
Nodes (44): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+36 more)

### Community 71 - "configured.ts"
Cohesion: 0.07
Nodes (45): ReadDatabaseOptions, ConfiguredDatabase, databaseTarget, CoreSettings, CreatedDirectory, Held, PgliteLockUse, WarningArguments (+37 more)

### Community 72 - "package-startup-checks.ts"
Cohesion: 0.07
Nodes (40): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, ChangedFile, GenesisFixture, installationCopy, PackageStartup (+32 more)

### Community 73 - "version-checks.ts"
Cohesion: 0.10
Nodes (40): LedgerTable, Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk (+32 more)

### Community 74 - "transport.test.ts"
Cohesion: 0.07
Nodes (35): Message, MessageType, TestCertificates, Ended, rawClient, Escape, publicState, Refused (+27 more)

### Community 75 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, rule(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+34 more)

### Community 76 - "ledger-storage-checks.ts"
Cohesion: 0.09
Nodes (39): ChildReader, SeenLoad, LedgerTx, childRefKeys(), readChildren(), heightsIn(), a106Problems(), a107Problems() (+31 more)

### Community 77 - "resolve.ts"
Cohesion: 0.06
Nodes (46): AddressRequest, Asked, LinkPlan, NetworkContext, NetworkPlan, NetworkProblem, PlannedAddress, ServicePlan (+38 more)

### Community 78 - "checkShape"
Cohesion: 0.07
Nodes (39): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+31 more)

### Community 79 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 8 - "backup/restore.ts"
Cohesion: 0.03
Nodes (93): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport (+85 more)

### Community 80 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (32): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+24 more)

### Community 81 - "change-capture.ts"
Cohesion: 0.09
Nodes (37): TableDigest, TableDigestRow, CapturedTable, CaptureState, GuardTableRow, optOut, capturedOf(), digestBlock() (+29 more)

### Community 82 - "private-transport.ts"
Cohesion: 0.08
Nodes (19): PublicSide, HelloAck, JsonValue, ReadResult, StatementResult, CarrierConnection, Pending, PrivateCarrier (+11 more)

### Community 83 - "binding.test.ts"
Cohesion: 0.08
Nodes (41): startHashDecision, a165Run, Attempt, A113Observation, A156Observation, Binding, Created, Outcome (+33 more)

### Community 84 - "contents-hash.ts"
Cohesion: 0.07
Nodes (39): CanonicalEncodingError, ModuleContentsError, encodeRow(), contentsHash(), encodeTableRow(), renderKeyValue(), countRows(), fromClause() (+31 more)

### Community 85 - "BlockRef"
Cohesion: 0.07
Nodes (18): BlockEventSource, QueuedBlock, BlockItems, BlockRef, InMemorySourceOptions, EventsRunner, Fetching, Recorder (+10 more)

### Community 86 - "example-checks.ts"
Cohesion: 0.08
Nodes (31): TypeCheckFinding, TypeCheckResult, Finding, BlockImport, ChildResult, CodeBlock, installedProject, configCompilerOptions() (+23 more)

### Community 87 - "mapping.ts"
Cohesion: 0.08
Nodes (32): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+24 more)

### Community 88 - "core-block-commit.test.ts"
Cohesion: 0.08
Nodes (34): BlockRow, StandInOptions, Commit, Committed, checkParent(), commitBlock(), hex(), sameBytes() (+26 more)

### Community 89 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (33): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, Row, copyArray(), copyObject() (+25 more)

### Community 9 - "startUmbraDB"
Cohesion: 0.02
Nodes (141): UmbraDBStarted, join(), normalize(), resolve(), refused(), text(), transportReader(), transportReaderRule() (+133 more)

### Community 91 - "cursor-table.test.ts"
Cohesion: 0.06
Nodes (32): CursorValue, TestBackend, Job, Outcome, Reads, Step, Access, Block (+24 more)

### Community 92 - "ingest-faults.test.ts"
Cohesion: 0.06
Nodes (32): NodeCallOptions, ProcessCondition, RecordingClient, A84Observation, LoggedRetry, OutageObservation, RetrySample, connectWebSocket() (+24 more)

### Community 93 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 97 - "networks.ts"
Cohesion: 0.06
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 98 - "containers.test.ts"
Cohesion: 0.07
Nodes (30): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers() (+22 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+27 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.08
Nodes (22): The node on `/status`, 7. Storage helpers, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+14 more)

### Community 51 - "table"
Cohesion: 0.04
Nodes (65): side(), migrations(), table(), fakePackage(), regular(), system(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence (+57 more)

### Community 52 - "data"
Cohesion: 0.03
Nodes (67): params(), n(), data(), 2.1 The declaration, 2.2 Its table, 2.3 Writing each block, 2.4 Serving it, 2.5 The configuration file (+59 more)

### Community 104 - ".off"
Cohesion: 0.05
Nodes (35): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases (+27 more)

### Community 108 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.06
Nodes (37): 5. WalletState envelope, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll (+29 more)

### Community 119 - ".slowBlockMs"
Cohesion: 0.07
Nodes (29): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+21 more)

### Community 173 - "connectChannel"
Cohesion: 0.19
Nodes (11): discard(), isChannel(), connectChannel(), 00068 — Two readers of a host's channel beside the private link's endpoint read its members outside a guard, Evidence, Problem, Suggested fix, 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once (+3 more)

### Community 180 - ".disconnect"
Cohesion: 0.16
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 182 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 183 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 202 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 210 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 216 - "api-session.test.ts"
Cohesion: 0.24
Nodes (9): answerRequest(), moduleApiFetch(), responseOf(), serve(), unreadableAmount(), db, MALFORMED_CLIENT, POISONED (+1 more)

### Community 226 - "readBody"
Cohesion: 0.25
Nodes (8): bodyTooLarge(), fetchBody(), utf8Text(), readBody(), 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 228 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 234 - ".block"
Cohesion: 0.47
Nodes (3): failingSource(), lookalike(), flakySource()

### Community 249 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 278 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 310 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 321 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 50 - ".put"
Cohesion: 0.03
Nodes (61): "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level (+53 more)

### Community 55 - "history"
Cohesion: 0.04
Nodes (61): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+53 more)

### Community 62 - "code"
Cohesion: 0.04
Nodes (57): code(), Added, 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit (+49 more)

### Community 94 - "T"
Cohesion: 0.05
Nodes (41): T(), input(), ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+33 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 99 - "version"
Cohesion: 0.06
Nodes (38): deferred(), version(), Engineering rules, 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, 0. Test-infrastructure layout (+30 more)

### Community 102 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 105 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 129 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 131 - "package.json"
Cohesion: 0.06
Nodes (30): bin, umbradb, bugs, url, description, engines, node, exports (+22 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 156 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 157 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 162 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 171 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 172 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 174 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 175 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 176 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.12
Nodes (10): Build commands, Build the package and install it, Building from source, Run from a clone, 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model (+2 more)

### Community 179 - "README.md"
Cohesion: 0.19
Nodes (6): Choosing a database, Launching it, stats-module, Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 181 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 189 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 190 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 194 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 195 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 196 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 199 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 204 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 207 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 208 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 211 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 212 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 213 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 214 - "Boundaries, threats and controls"
Cohesion: 0.18
Nodes (11): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+3 more)

### Community 215 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 217 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 218 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 219 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 220 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 221 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 222 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 225 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 227 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 229 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 230 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 2. Envelope module (Pg-only — required gate), 4. Pg-only conformance suite (required merge gate) — `test:conformance`, 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 231 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 232 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 233 - "After 0.10.0"
Cohesion: 0.22
Nodes (9): 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals, Release gates still to run (+1 more)

### Community 237 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 238 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 239 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 240 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 241 - "sqlite-warning.child.ts"
Cohesion: 0.29
Nodes (6): PGLITE_LOCK_SUFFIX, SQLITE_WARNING_HOOK, job, replacement, root, warnings

### Community 242 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 243 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 248 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 250 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 251 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 252 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 253 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 254 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 255 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 256 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 258 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 261 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 262 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 263 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 264 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 266 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 267 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 268 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 269 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 270 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 271 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 272 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 273 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 274 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 275 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 276 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 279 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 280 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 281 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 282 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 283 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 284 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 285 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 286 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 287 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 288 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 289 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 290 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 291 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 292 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 293 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 294 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 295 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 296 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 297 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 298 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 299 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 300 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 301 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 302 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 303 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 304 - "00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered"
Cohesion: 0.40
Nodes (4): 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered, Evidence, Problem, Suggested fix

### Community 305 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 306 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 307 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 308 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 311 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 312 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 313 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 314 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 315 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 316 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 317 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 318 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 319 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 325 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 90 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-6455`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx`, `typedoc` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4087 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `declaration.ts`, `migrate.ts`, `src/db/postgres.ts`, `api-server.test.ts`, `ledger/types.ts`, `ref_node_fs`, `admin-harness.ts`, `api.ts`, `backup/restore.ts`, `core-ledger-state.ts`, `InMemoryBlockSource`, `contract-data-checks.ts`, `ingest-harness.ts`, `validate.ts`, `.from`, `runner/process.ts`, `column-rules.ts`, `client.test.ts`, `core-status.test.ts`, `NodeClient`, `backup/backup.ts`, `tape/index.ts`, `builds.ts`, `entries.ts`, `process-backends.ts`, `builder.test.ts`, `chain-placement.test.ts`, `refused-configuration.test.ts`, `zod`, `core-block-parsed.ts`, `config-check.ts`, `node-format.ts`, `adapter.ts`, `LedgerPackage`, `core-transport.ts`, `library/modules.test.ts`, `database-parts.ts`, `5. Runner`, `listening.test.ts`, `UmbraError`, `range.ts`, `transform-checks.ts`, `messages.ts`, `cbor.property.test.ts`, `module-tables.ts`, `loop-stop-harness.ts`, `chain-process.test.ts`, `range.test.ts`, `start-umbradb.ts`, `ref_node_crypto`, `ledger/ledger-tasks.test.ts`, `post-block-update-checks.ts`, `slow-block-harness.ts`, `core-chain.test.ts`, `sweep-tapes.ts`, `browser.test.ts`, `ledger-storage.test.ts`, `package-startup-checks.ts`, `version-checks.ts`, `transport.test.ts`, `boundary.test.ts`, `resolve.ts`, `retirement.test.ts`, `file-mode.test.ts`, `binding.test.ts`, `example-checks.ts`, `mapping.ts`, `core-block-commit.test.ts`, `config/plain-data.ts`, `cursor-table.test.ts`, `ingest-faults.test.ts`, `real-tapes.ts`, `networks.ts`, `containers.test.ts`, `browser/build.ts`, `transaction-history-storage.property.test.ts`, `private/lockstep-wait.test.ts`, `redact.ts`, `cold-boot-recovery.integration.test.ts`, `src/config/load.ts`, `release-version.ts`, `core-config.test.ts`, `resolver-boundary.ts`, `postgres/transaction-history-storage.ts`, `code-registry.ts`, `pg-tx-history-adapter.ts`, `test/postgres/setup.ts`, `package.json`, `documents.ts`, `LoopPauses`, `Lockstep`, `core.ts`, `crash.test.ts`, `cli/run.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `restore-private.ts`, `surface.test.ts`, `node-source.test.ts`, `node-bridge.ts`, `start-umbradb.test.ts`, `core-block-fetch.test.ts`, `block-fetch-decode.test.ts`, `library-documents.test.ts`, `key-handling-checks.ts`, `excluded-not-exported.test.ts`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `web-lock.ts`, `worker-threads.test.ts`, `Heartbeat`, `facade-merge-loader.ts`, `api-session.test.ts`, `sqlite-warning.test.ts`, `renamed-setting.test.ts`, `vendored-ledger-files.test.ts`?**
  _High betweenness centrality (0.220) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-6455`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `declaration.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01757693180429736 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `declaration.ts`, `migrate.ts`, `src/db/postgres.ts`, `api-server.test.ts`, `ledger/types.ts`, `ref_node_fs`, `admin-harness.ts`, `api.ts`, `backup/restore.ts`, `startUmbraDB`, `core-ledger-state.ts`, `InMemoryBlockSource`, `contract-data-checks.ts`, `validate.ts`, `runner/process.ts`, `client.test.ts`, `core-status.test.ts`, `NodeClient`, `backup/backup.ts`, `tape/index.ts`, `builds.ts`, `entries.ts`, `node-source.test.ts`, `process-backends.ts`, `builder.test.ts`, `refused-configuration.test.ts`, `zod`, `config-check.ts`, `ledger/metadata.ts`, `core-transport.ts`, `version-table.ts`, `library/modules.test.ts`, `database-parts.ts`, `validation.ts`, `config/history.ts`, `listening.test.ts`, `range.ts`, `transform-checks.ts`, `NodeBlockSource`, `ApiRoutes`, `aborted`, `module-tables.ts`, `chain-process.test.ts`, `web-lock.ts`, `sha256`, `start-umbradb.ts`, `ref_node_crypto`, `slow-block-harness.ts`, `browser/src/config/load.ts`, `core-chain.test.ts`, `FinalizedLoop`, `cbor.ts`, `configured.ts`, `package-startup-checks.ts`, `version-checks.ts`, `resolve.ts`, `checkShape`, `private-transport.ts`, `binding.test.ts`, `contents-hash.ts`, `mapping.ts`, `core-block-commit.test.ts`, `config/plain-data.ts`, `cursor-table.test.ts`, `ingest-faults.test.ts`, `version`, `.block`, `private/lockstep-wait.test.ts`, `src/config/load.ts`, `renamed-setting.test.ts`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `migrate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02136638000106832 - nodes in this community are weakly interconnected._