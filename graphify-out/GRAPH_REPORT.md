# Graph Report - UmbraDB

## Corpus Check
- 1193 files · ~1,692,350 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12462 nodes · 38447 edges · 351 communities (313 shown, 38 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3234 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `a73ddb83ac5966f4` (1193 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- admin-harness.ts
- vitest
- tape/index.ts
- placement.ts
- release-version.ts
- channel-queue.test.ts
- browser/build.ts
- validate.ts
- vendored-ledger-v9.test.ts
- resolver-boundary.ts
- page.ts
- client.test.ts
- read-confinement-checks.ts
- node-fields-harness.ts
- .concat
- paused-harness.ts
- documents.ts
- test/postgres/setup.ts
- src/ledger/identity.ts
- version-checks.ts
- interfaces/transaction-history-storage.ts
- pg-tx-history-adapter.ts
- node-bridge.ts
- read-gate.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- contract-data-checks.ts
- .value
- core-block-fetch/metadata.ts
- surface.test.ts
- code-registry.ts
- options.ts
- ProcessContexts
- NodeClient
- ledger-sweep.test.ts
- pack-install.mjs
- block-fetch-decode.test.ts
- harness.ts
- process-worker.ts
- library-documents.test.ts
- config/history.ts
- src/config/load.ts
- chrome.ts
- read-height.property.test.ts
- key-handling-checks.ts
- describeNodeStoreExports
- browser-harness.ts
- module-tables.ts
- Lockstep
- HoldingRelay
- ws-mutual-tls.test.ts
- statementsOf
- validation.ts
- LoopPauses
- validation.test.ts
- quiet-host.child.ts
- module-api.ts
- worker-threads.test.ts
- worker-threads-worker.ts
- midnight-env — reproducible PREPROD dev environment
- core-private-source.test.ts
- childRefKeys
- .send
- src/protocol.ts
- Worker
- startUmbraDB
- BlockRef
- Design — Sprint 1: project setup + TemporalKV
- typescript
- sweepStep
- ledger-test-loader.ts
- column-rules.ts
- UmbraError
- HeldHeight
- renamed-setting.test.ts
- signal-backup.worker.ts
- process-admin.ts
- ledger/plain-data.ts
- vendored-ledger-files.test.ts
- ref_node_fs
- mutation-evidence.d.mts
- backup/restore.ts
- ref_node_crypto
- adapter.ts
- stats.ts
- pageBench
- cbor.ts
- FinalizedLoop
- ingest-harness.ts
- loop.test.ts
- listenerProblems
- PageState
- ToProcessWorker
- declaration.ts
- PageApiChannel
- CliBackend
- host.ts
- ApiChannel
- NodeFS
- Keeping
- resolve.ts
- LedgerPackage
- writer-lock-checks.ts
- runner/process.ts
- api-server.test.ts
- height-versioned.test.ts
- order.property.test.ts
- .from
- config/build.ts
- core-block-parsed.ts
- ledger/ledger-tasks.test.ts
- checks.test.ts
- pause-fixtures.ts
- core-ledger-state.ts
- refused-configuration.test.ts
- chain-process.test.ts
- core-transport.ts
- cli/command.ts
- db/errors.ts
- boundary.test.ts
- channels.ts
- ref_node_timers
- slow-block-harness.ts
- src/index.ts
- code
- spawnChild
- mapping.ts
- migrate.ts
- PgTransactionHistoryStorage
- core-block-commit.test.ts
- graph.ts
- postgres/transaction-history-storage.ts
- loop.ts
- cold-boot-recovery.integration.test.ts
- retirement.test.ts
- InMemoryBlockSource
- private-transport.ts
- zero-timeouts-checks.ts
- failures.ts
- file-mode.test.ts
- checkShape
- example-checks.ts
- ChannelEndpoint
- crash.test.ts
- builder.test.ts
- core-ledger-state/sql.ts
- config/plain-data.ts
- restore-private.ts
- messages.ts
- node-format.ts
- containers.test.ts
- adapter-fixtures.ts
- config-check.ts
- browser.test.ts
- config-check-database.test.ts
- transport-faults.test.ts
- TransactionHistoryEntry
- .configHash
- Proposal — Sprint 3: CheckpointStore
- .off
- backupAtStop
- T
- .onClose
- refused
- conformance-gate.mjs
- mutation-per-adapter.mjs
- twox.ts
- Design — v1.1.0: Quint model checking
- UmbraDB third-party component inventory (SBOM)
- path.ts
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- host-signal.ts
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- orphan-watcher.mjs
- read-only-checks.ts
- fresh-instance.mjs
- crash-worker.ts
- history
- .put
- transportReader
- ADDED Requirements
- version
- data
- ADDED Requirements
- graph.py
- .slowBlockMs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- Requirements
- ADDED Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-13 SIGTERM stops cleanly
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- README.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Design — Sprint 4: Watermarks
- explore.md
- ROADMAP.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Boundaries, threats and controls
- MODIFIED Requirements
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.10.0] - 2026-10-27
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- After 0.10.0
- Contributing
- The database
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance map — START-UMBRADB: UmbraDB as a library
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
- The laws of UmbraDB's storage helpers
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 4: Watermarks
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Requirement: MD-7 Process items are published once, at startup
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
- 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- bug-report.md
- feature-request.md
- MODIFIED Requirements
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
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
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 409 edges
2. `UmbraError` - 346 edges
3. `ModuleDeclaration` - 195 edges
4. `InMemoryBlockSource` - 174 edges
5. `FinalizedLoop` - 134 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 102 edges
8. `Database` - 101 edges
9. `startUmbraDB()` - 101 edges
10. `ReadHandle` - 92 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `What changes — the 1.0.0 gate items this change addresses` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts
- `Evidence` --references--> `probedThrough()`  [INFERRED]
  docs/issues/00064-full-suite-timing-budgets-under-a-loaded-machine.md → test/backbone/core-health/liveness.test.ts

## Import Cycles
- None detected.

## Communities (351 total, 38 thin omitted)

### Community 0 - "admin-harness.ts"
Cohesion: 0.02
Nodes (217): MountedAdminAnswer, AdminSeams, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer (+209 more)

### Community 1 - "vitest"
Cohesion: 0.02
Nodes (205): AdminStarter, PrivateIntakeOptions, DatabaseParts, PglitePathParts, PostgresParts, PostgresPartsInput, LockstepCondition, LockstepInstance (+197 more)

### Community 10 - "tape/index.ts"
Cohesion: 0.03
Nodes (125): Failure, Variant, Link, CompletenessRange, RecordingError, RecordingProblem, TapeError, TapeProblem (+117 more)

### Community 100 - "placement.ts"
Cohesion: 0.08
Nodes (32): MetadataField, MetadataVariant, Primitive, ChainTransaction, EventPhase, RecordTypes, ScaleValue, callVariant() (+24 more)

### Community 101 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 102 - "channel-queue.test.ts"
Cohesion: 0.09
Nodes (25): EngineInput, ChannelCoreOptions, ChannelPrivateOptions, Logged, A162Options, messagePortChannel(), channelCore(), channelPrivate() (+17 more)

### Community 104 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 105 - "validate.ts"
Cohesion: 0.12
Nodes (33): CursorRule, Issue, Plain, coreSettingsSchema(), closest(), configFindings(), contextOf(), cursorFindings() (+25 more)

### Community 106 - "vendored-ledger-v9.test.ts"
Cohesion: 0.13
Nodes (30): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, freeAll(), runInFreshInstance(), bigCell() (+22 more)

### Community 107 - "resolver-boundary.ts"
Cohesion: 0.10
Nodes (31): Access, AllowedRead, Boundary, Crossing, Guard, bare(), callsPathResolve(), checked() (+23 more)

### Community 108 - "page.ts"
Cohesion: 0.08
Nodes (29): LinkRecord, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp(), beginCore(), element() (+21 more)

### Community 11 - "client.test.ts"
Cohesion: 0.02
Nodes (100): NodeClientOptions, ConnectSocket, IngestOptions, HandSocket, HandSockets, Answer, FakeNode, Handler (+92 more)

### Community 110 - "read-confinement-checks.ts"
Cohesion: 0.10
Nodes (23): Message, MessageType, Ended, rawClient, Escape, publicState, Refused, confinementProblems() (+15 more)

### Community 111 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (25): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+17 more)

### Community 113 - ".concat"
Cohesion: 0.08
Nodes (20): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+12 more)

### Community 115 - "paused-harness.ts"
Cohesion: 0.15
Nodes (25): A176Options, Body, PausedExpectation, Read, Reader, Running, keepingPause(), pausedOf() (+17 more)

### Community 116 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 118 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 119 - "src/ledger/identity.ts"
Cohesion: 0.14
Nodes (24): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages(), checkPackageFiles() (+16 more)

### Community 12 - "version-checks.ts"
Cohesion: 0.03
Nodes (120): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, Boundary, BoundaryBlock, builtInNetwork, Issue (+112 more)

### Community 120 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 121 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 122 - "node-bridge.ts"
Cohesion: 0.11
Nodes (20): NodeStore, EngineOptions, Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes() (+12 more)

### Community 123 - "read-gate.ts"
Cohesion: 0.14
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 127 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 128 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 129 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 13 - "contract-data-checks.ts"
Cohesion: 0.03
Nodes (133): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+125 more)

### Community 130 - ".value"
Cohesion: 0.20
Nodes (10): MetadataType, ScaleReader, ValueReader, blockTimeOf(), isCompactU64(), bytesArgument(), decodeChainEvents(), read() (+2 more)

### Community 133 - "core-block-fetch/metadata.ts"
Cohesion: 0.21
Nodes (18): MetadataPallet, MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, callOf(), callVariants(), decodeExtrinsic() (+10 more)

### Community 134 - "surface.test.ts"
Cohesion: 0.14
Nodes (25): Surface, SurfaceAmendment, amendedSurface(), coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), pinnedSurface() (+17 more)

### Community 135 - "code-registry.ts"
Cohesion: 0.12
Nodes (23): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+15 more)

### Community 137 - "options.ts"
Cohesion: 0.18
Nodes (25): Finding, readOptions, named(), addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding() (+17 more)

### Community 138 - "ProcessContexts"
Cohesion: 0.11
Nodes (6): ProcessContexts, ProcessItems, names(), providesProcessItem(), configOf(), startChain()

### Community 14 - "NodeClient"
Cohesion: 0.04
Nodes (96): NodeSourceOptions, CoreChainBinding, FinalizedHeightOptions, Connection, HeadSubscriber, NodeCallOptions, NodeClient, NodeRetry (+88 more)

### Community 141 - "ledger-sweep.test.ts"
Cohesion: 0.17
Nodes (13): SweepState, SweepWrites, Block, MemoryTables, ModelBatch, ModelSnapshot, sweepReset(), bigints() (+5 more)

### Community 142 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 144 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 145 - "harness.ts"
Cohesion: 0.16
Nodes (15): BaselineLoad, Comparison, PostgresRun, Backend, Baseline, LatencyStats, compareToBaseline(), loadBaseline() (+7 more)

### Community 146 - "process-worker.ts"
Cohesion: 0.15
Nodes (15): demoLink, withDevelopmentOptIn(), answer(), backUp(), connectLink(), coreCommittedHeight(), onLink(), openedProcess() (+7 more)

### Community 149 - "library-documents.test.ts"
Cohesion: 0.14
Nodes (20): Document, EntryInput, Renamed, changelogEntryProblems(), entryTerms(), namesWord(), newRefusalCodes(), paragraphs() (+12 more)

### Community 15 - "config/history.ts"
Cohesion: 0.03
Nodes (126): OpenedFacts, CoreVersion, CoreSettings, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding, HistoryOptions (+118 more)

### Community 150 - "src/config/load.ts"
Cohesion: 0.16
Nodes (15): LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), invalid(), isFile(), loadModuleList() (+7 more)

### Community 151 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 152 - "read-height.property.test.ts"
Cohesion: 0.13
Nodes (12): TestBackend, HeldRead, Job, Outcome, Reads, Step, concurrent(), queued() (+4 more)

### Community 153 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 154 - "describeNodeStoreExports"
Cohesion: 0.16
Nodes (5): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), sortedHex()

### Community 155 - "browser-harness.ts"
Cohesion: 0.24
Nodes (18): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+10 more)

### Community 16 - "module-tables.ts"
Cohesion: 0.03
Nodes (102): CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ConsistentRead (+94 more)

### Community 160 - "Lockstep"
Cohesion: 0.15
Nodes (4): Lockstep, publicLockstepOf(), downText(), holds()

### Community 163 - "HoldingRelay"
Cohesion: 0.16
Nodes (4): Report, HoldingRelay, ReportRelay, sendable()

### Community 165 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (12): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+4 more)

### Community 169 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 17 - "validation.ts"
Cohesion: 0.02
Nodes (124): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput, TransportReader, CoreEntryInput, CoreSettingsBase (+116 more)

### Community 170 - "LoopPauses"
Cohesion: 0.18
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 171 - "validation.test.ts"
Cohesion: 0.16
Nodes (12): DeclarationRule, Case, ShapeCase, Stats, validateWith(), failures(), loose(), refusal() (+4 more)

### Community 175 - "quiet-host.child.ts"
Cohesion: 0.15
Nodes (11): Job, Outcome, Stated, event(), until(), added, before, db (+3 more)

### Community 18 - "module-api.ts"
Cohesion: 0.03
Nodes (103): coreHeaders, HeadersArgument, NodeHttpHandler, NodeUpgradeHandler, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions (+95 more)

### Community 180 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 186 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 187 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.18
Nodes (9): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS) (+1 more)

### Community 19 - "core-private-source.test.ts"
Cohesion: 0.03
Nodes (74): PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, startHashDecision, StartHashes (+66 more)

### Community 190 - "childRefKeys"
Cohesion: 0.38
Nodes (3): ChildReader, childRefKeys(), readChildren()

### Community 194 - "src/protocol.ts"
Cohesion: 0.24
Nodes (8): ProcessView, CallMethod, crossedError, FromProcessWorker, StartRun, hexOf(), jsonSafe(), HEX

### Community 2 - "startUmbraDB"
Cohesion: 0.02
Nodes (188): UmbraDBHandle, UmbraDBOptions, transportReaderFacts, EngineOptions, NetworkRuleName, gate, Compared, ConnectSeen (+180 more)

### Community 20 - "BlockRef"
Cohesion: 0.03
Nodes (53): BlockHeaderItem, BlockEventSource, BodyExtrinsic, ExtrinsicCall, BlockBody, BlockItemSource, CoreBlockHeader, CoreBlockItems (+45 more)

### Community 201 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.20
Nodes (10): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+2 more)

### Community 204 - "typescript"
Cohesion: 0.31
Nodes (8): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), isRegularFile(), packageType(), typeCheckFile(), typescript

### Community 205 - "sweepStep"
Cohesion: 0.27
Nodes (4): SweepTables, hexOf(), merged(), sweepStep()

### Community 206 - "ledger-test-loader.ts"
Cohesion: 0.24
Nodes (10): SlowStep, beat(), countDeserializations(), hexOf(), loadLedger(), deserialized, evictions, forgotten (+2 more)

### Community 21 - "column-rules.ts"
Cohesion: 0.02
Nodes (104): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+96 more)

### Community 22 - "UmbraError"
Cohesion: 0.03
Nodes (69): ImportedConfig, LoadedConfig, LoadOptions, AsyncLocalStorage, AsyncResource, JobQueue, PgliteDatabase, BoundedRead (+61 more)

### Community 223 - "HeldHeight"
Cohesion: 0.28
Nodes (5): CommitOutcome, HeldHeight, Outcomes, AlwaysLost, DropsHeld

### Community 224 - "renamed-setting.test.ts"
Cohesion: 0.33
Nodes (7): EngineConfig, Renamed, databaseOf(), dataOf(), escaped(), fileOf(), FINDING()

### Community 225 - "signal-backup.worker.ts"
Cohesion: 0.28
Nodes (8): SignalJob, report(), handle, job, orphanGuard, source, termination, watch

### Community 23 - "process-admin.ts"
Cohesion: 0.04
Nodes (47): NetworkShown, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, DigestRow, ModuleFacts, NodeFacts, PartTable (+39 more)

### Community 234 - "ledger/plain-data.ts"
Cohesion: 0.43
Nodes (7): Path, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 236 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 24 - "ref_node_fs"
Cohesion: 0.05
Nodes (73): BackupBackend, BackupDatabase, killedRestore, TickerConfig, TickerHandle, TickerProcess, WORKER, SignalEvent (+65 more)

### Community 247 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 25 - "backup/restore.ts"
Cohesion: 0.04
Nodes (88): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+80 more)

### Community 26 - "ref_node_crypto"
Cohesion: 0.03
Nodes (91): TableDigest, TableDigestRow, CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow (+83 more)

### Community 27 - "adapter.ts"
Cohesion: 0.03
Nodes (83): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+75 more)

### Community 271 - "stats.ts"
Cohesion: 0.40
Nodes (3): ManualOpts, TinybenchOpts, tinybench

### Community 272 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 28 - "cbor.ts"
Cohesion: 0.04
Nodes (94): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+86 more)

### Community 29 - "FinalizedLoop"
Cohesion: 0.04
Nodes (29): EntryBoundary, Activity, FinalizedLoop, HeightRun, LoopObserver, Startup, SkipsAfterReconnect, SkipsLockstep (+21 more)

### Community 3 - "ingest-harness.ts"
Cohesion: 0.02
Nodes (197): FinalityStallCondition, ProcessCondition, BlockSpec, EventSpec, Scenario, transactionSpec, eventsRuntime, Field (+189 more)

### Community 30 - "loop.test.ts"
Cohesion: 0.04
Nodes (79): LockstepWait, LoopEnd, SlowBlockEvent, Contexts, Faults, LostCommit, Seen, AtGate (+71 more)

### Community 31 - "declaration.ts"
Cohesion: 0.04
Nodes (72): UmbraConfig, BlockHeader, FieldKind, FieldSchema, ItemDeclaration, ItemSink, KnownPointsOnly, Lifetime (+64 more)

### Community 32 - "host.ts"
Cohesion: 0.05
Nodes (61): LoadLedger, TransactionParser, LedgerName, ChainOutcome, LedgerPackageOptions, NodeBatch, ParsedTransaction, AppliedState (+53 more)

### Community 33 - "resolve.ts"
Cohesion: 0.04
Nodes (86): AddressRequest, Asked, LinkPlan, NetworkContext, NetworkInput, NetworkPlan, NetworkProblem, NetworkRequest (+78 more)

### Community 34 - "LedgerPackage"
Cohesion: 0.05
Nodes (46): LedgerPackage, LedgerTaskBlock, StateHandle, EvictionRefused, LedgerEngine, LedgerTaskFailed, stagenetReplay, createV9Rc3Adapter() (+38 more)

### Community 35 - "writer-lock-checks.ts"
Cohesion: 0.05
Nodes (72): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, WriterProcess, Job (+64 more)

### Community 36 - "runner/process.ts"
Cohesion: 0.04
Nodes (68): Bound, ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, ConfigRow, ConfigHashRow, RetryCode (+60 more)

### Community 37 - "api-server.test.ts"
Cohesion: 0.04
Nodes (57): ReadHandle, ApiRegistry, PointCallbacks, ChainDataAnswer, ChainDataView, HttpHandler, HttpRoute, AddsExtensions (+49 more)

### Community 38 - "height-versioned.test.ts"
Cohesion: 0.04
Nodes (64): cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Migration, cursorDatabase (+56 more)

### Community 39 - "order.property.test.ts"
Cohesion: 0.04
Nodes (78): GraphInput, PointRun, PastFaultCase, RefusalCase, Recorder, CheckName, GraphSpec, ModuleSpec (+70 more)

### Community 4 - ".from"
Cohesion: 0.02
Nodes (206): SourceShared, FixtureRun, CrashEvent, CrashJob, ingest, watched, Call, SeenLoad (+198 more)

### Community 40 - "config/build.ts"
Cohesion: 0.05
Nodes (72): OpenedConfig, AllowedDetail, RevisionSettings, SnapshotFacts, ConfigSnapshot, DeclarationView, EntryView, RecordedView (+64 more)

### Community 41 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (65): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, BlockParsed, BlockParsedOptions, ChainEvent, PgliteMemoryParts (+57 more)

### Community 42 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.05
Nodes (59): LedgerTask, TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, bindLedgerTasks(), boundHost() (+51 more)

### Community 43 - "checks.test.ts"
Cohesion: 0.04
Nodes (52): databaseTarget, PgliteLockUse, Buffer, BufferEncoding, Hash, sha256, CheckFunctionsOptions, IntegerCheckRow (+44 more)

### Community 44 - "pause-fixtures.ts"
Cohesion: 0.05
Nodes (55): backupSignalRelay, SignalSource, stopSignal, BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable (+47 more)

### Community 45 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (61): CoreLedgerStateOptions, LedgerStateItem, RetainedState, retainedStates, CoreRevision, GreyPicker, ContractKeys, FixtureRunOptions (+53 more)

### Community 46 - "refused-configuration.test.ts"
Cohesion: 0.06
Nodes (59): RunOptions, RunSeams, ProcessHandle, UserModulesSource, Answered, Start, Refusal, Start (+51 more)

### Community 47 - "chain-process.test.ts"
Cohesion: 0.04
Nodes (59): CommitOptions, WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation, Failing, Flaky (+51 more)

### Community 48 - "core-transport.ts"
Cohesion: 0.05
Nodes (44): PrivateLinkConnect, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected, CoreTransportOptions, CoreLink (+36 more)

### Community 49 - "cli/command.ts"
Cohesion: 0.06
Nodes (51): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, CommandResult, RunningCommand, statsConfig, backupArguments() (+43 more)

### Community 5 - "db/errors.ts"
Cohesion: 0.02
Nodes (163): BenchEnv, ConfiguredDatabase, ConfiguredDatabaseOptions, PostgresConnection, PostgresOptions, DatabaseState, ReadDatabaseOptions, ConfiguredDatabase (+155 more)

### Community 50 - "boundary.test.ts"
Cohesion: 0.06
Nodes (53): DesignTable, RowCoverage, ModuleReference, Finding, rule(), collationsWritten(), componentCode(), componentExports() (+45 more)

### Community 51 - "channels.ts"
Cohesion: 0.06
Nodes (53): EndpointOptions, Envelope, controlledTimers, PeerEnd, PeerMessage, rawPeer, TestEnd, TestEndOptions (+45 more)

### Community 52 - "ref_node_timers"
Cohesion: 0.06
Nodes (40): ChainCheck, ChainCheckInput, coreEntry, HookedSource, PlainSubclass, A167Observation, CheckOf, NodeWatch (+32 more)

### Community 54 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (51): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+43 more)

### Community 55 - "src/index.ts"
Cohesion: 0.05
Nodes (44): StatsRow, Outcome, MessagePortLike, PrivateLinkChannel, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd (+36 more)

### Community 56 - "code"
Cohesion: 0.04
Nodes (53): RepositoryFile, canPin(), code(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS (+45 more)

### Community 57 - "spawnChild"
Cohesion: 0.05
Nodes (47): ParentJob, Kill, Orphaned, SourceFile, GateRun, Pids, ReportedTest, dockerExec() (+39 more)

### Community 58 - "mapping.ts"
Cohesion: 0.06
Nodes (40): ResultType, Case, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+32 more)

### Community 6 - "migrate.ts"
Cohesion: 0.02
Nodes (163): ReadOnlyDatabase, SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput (+155 more)

### Community 60 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (47): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import (+39 more)

### Community 61 - "core-block-commit.test.ts"
Cohesion: 0.06
Nodes (37): BlockRow, BlockWriteHandle, BlockContext, StandInOptions, Commit, heightPartitionsSql(), blockFetchStandIn(), standInHeader() (+29 more)

### Community 64 - "graph.ts"
Cohesion: 0.07
Nodes (49): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck (+41 more)

### Community 65 - "postgres/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (35): EntryContent, JsonEncoded, TxHistoryRow, Command, ReplayableStorage, assertStoredEntryShape(), decodeContent(), decodeRow() (+27 more)

### Community 66 - "loop.ts"
Cohesion: 0.08
Nodes (43): PointName, HeightRange, Callback, CallbackFailure, ParallelPoint, PointSchedule, HeightActivity, HeightFailure (+35 more)

### Community 67 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.09
Nodes (32): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+24 more)

### Community 69 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 7 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (152): BlockSource, InMemoryBlockSource, InMemoryItems, Wait, LoopInput, ProcessingEnd, ProcessStatus, Job (+144 more)

### Community 70 - "private-transport.ts"
Cohesion: 0.08
Nodes (20): PublicSide, HelloAck, JsonValue, ReadResult, StatementResult, CarrierConnection, Pending, PrivateCarrier (+12 more)

### Community 72 - "zero-timeouts-checks.ts"
Cohesion: 0.09
Nodes (34): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+26 more)

### Community 73 - "failures.ts"
Cohesion: 0.07
Nodes (34): ConfigFinding, LifecycleStatus, ProcessReason, ReasonCode, Unwrapped, UnexpectedCursor, StatusFacts, configurationRefused() (+26 more)

### Community 74 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (31): Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch, watchedBackup() (+23 more)

### Community 75 - "checkShape"
Cohesion: 0.08
Nodes (34): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+26 more)

### Community 77 - "example-checks.ts"
Cohesion: 0.08
Nodes (27): Served, Finding, BlockImport, ChildResult, CodeBlock, installedProject, isolationProblems(), serveCommand() (+19 more)

### Community 78 - "ChannelEndpoint"
Cohesion: 0.11
Nodes (14): ChannelEndpoint, EndpointEvents, CoreChannels, controlEnvelope(), refuseChannel(), discard(), isChannel(), queuedSlowProblems() (+6 more)

### Community 79 - "crash.test.ts"
Cohesion: 0.07
Nodes (31): LockResult, Pem, TestCertificates, CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER (+23 more)

### Community 8 - "builder.test.ts"
Cohesion: 0.02
Nodes (122): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata, Step (+114 more)

### Community 80 - "core-ledger-state/sql.ts"
Cohesion: 0.10
Nodes (36): StateRow, StoredState, GreyView, SweepPhase, allGreyKeys(), bytesOf(), clearGrey(), clearMarks() (+28 more)

### Community 81 - "config/plain-data.ts"
Cohesion: 0.07
Nodes (31): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, Row, copyArray(), copyObject() (+23 more)

### Community 85 - "restore-private.ts"
Cohesion: 0.09
Nodes (32): RestoreChain, RestoreSeams, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome, RestoreJob, FileProcess (+24 more)

### Community 86 - "messages.ts"
Cohesion: 0.07
Nodes (34): Committed, MessageFault, instanceIdSchema(), bytesOf(), decodeParameter(), decodeValue(), describe(), elementType() (+26 more)

### Community 87 - "node-format.ts"
Cohesion: 0.12
Nodes (24): Child, Reader, Readable, Reader, TableNode, node(), childKey(), concat() (+16 more)

### Community 88 - "containers.test.ts"
Cohesion: 0.07
Nodes (29): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers() (+21 more)

### Community 9 - "adapter-fixtures.ts"
Cohesion: 0.03
Nodes (145): ApplyInput, ApplyOutput, StateSummary, StoredNode, LedgerHeight, Upstream, contractFixture, Ledger (+137 more)

### Community 90 - "config-check.ts"
Cohesion: 0.10
Nodes (36): ConfigFacts, CoreChainFacts, RestoreBase, CheckFinding, CheckState, ConfigCheckOptions, ConfigCheckSeams, StepName (+28 more)

### Community 91 - "browser.test.ts"
Cohesion: 0.08
Nodes (36): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, heldClock, continuedProblems() (+28 more)

### Community 93 - "config-check-database.test.ts"
Cohesion: 0.07
Nodes (28): CheckStep, CheckTarget, readPrivateCursor(), configCheck(), commandCommittedHeight(), readDatabaseState(), configText(), coreSettings() (+20 more)

### Community 95 - "transport-faults.test.ts"
Cohesion: 0.09
Nodes (30): PrivateLinkAddress, ResultColumn, CoreTransport, TransportTls, PrivateSocketTransportOptions, SocketLimits, PrivateTransportOptions, splitAddress() (+22 more)

### Community 97 - "TransactionHistoryEntry"
Cohesion: 0.09
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 183 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 232 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 112 - ".off"
Cohesion: 0.06
Nodes (30): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, 2.1 Where the probe runs (the one real design decision), 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract (+22 more)

### Community 114 - "backupAtStop"
Cohesion: 0.07
Nodes (28): backupAtStop(), A backup at the core's stop, A backup of a running process (SIGUSR2), Backups, Restoring a backup, What a backup holds, Writing a backup, Requirement: BK-1 Backup (+20 more)

### Community 143 - "T"
Cohesion: 0.10
Nodes (21): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 0. Schema (+13 more)

### Community 147 - ".onClose"
Cohesion: 0.11
Nodes (18): fault(), 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once, Evidence, Problem, Suggested fix, 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format (+10 more)

### Community 156 - "refused"
Cohesion: 0.16
Nodes (17): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, Requirement: AE-3 States and conditions, Scenario: A fault of the build's declarations ends the process, Scenario: A paused loop (+9 more)

### Community 173 - "conformance-gate.mjs"
Cohesion: 0.13
Nodes (11): check, checker, deadlineMs, env, forwarded, killGraceMs, repoRoot, reportPath (+3 more)

### Community 174 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 179 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 184 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 196 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 216 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 227 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.25
Nodes (5): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 235 - "host-signal.ts"
Cohesion: 0.32
Nodes (5): isAbortSignal(), followSignal(), isSignal(), ABORTED, REASON

### Community 238 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 268 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 303 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 304 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 319 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 53 - "history"
Cohesion: 0.04
Nodes (57): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+49 more)

### Community 59 - ".put"
Cohesion: 0.04
Nodes (48): coreBlockFetchOnFetch(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+40 more)

### Community 62 - "transportReader"
Cohesion: 0.04
Nodes (48): text(), transportReader(), transportReaderRule(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 00061 — The threat model's `path:line` citations drift as the code moves (+40 more)

### Community 63 - "ADDED Requirements"
Cohesion: 0.04
Nodes (50): 5. WalletState envelope, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled) (+42 more)

### Community 68 - "version"
Cohesion: 0.05
Nodes (46): side(), migrations(), deferred(), version(), 1. Overview, Appendix A. Reference, 0. Project setup, 1. TemporalKV (+38 more)

### Community 71 - "data"
Cohesion: 0.05
Nodes (44): integer(), params(), n(), data(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules (+36 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 94 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 96 - ".slowBlockMs"
Cohesion: 0.06
Nodes (31): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+23 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 126 - "package.json"
Cohesion: 0.07
Nodes (27): bin, umbradb, bugs, url, description, engines, node, exports (+19 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 132 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 139 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 148 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+10 more)

### Community 162 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 164 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 166 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker (+8 more)

### Community 168 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 172 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 176 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 177 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 178 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 181 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 182 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 185 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 188 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 189 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 192 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 193 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 197 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 198 - "README.md"
Cohesion: 0.29
Nodes (3): Choosing a database, Launching it, stats-module

### Community 199 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 200 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 202 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 203 - "Design — Sprint 4: Watermarks"
Cohesion: 0.18
Nodes (10): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 8. Error translation — no additions to `src/postgres/errors.ts` (+2 more)

### Community 207 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 208 - "ROADMAP.md"
Cohesion: 0.20
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 209 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 210 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 211 - "Boundaries, threats and controls"
Cohesion: 0.20
Nodes (10): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+2 more)

### Community 212 - "MODIFIED Requirements"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A long awaiting callback does not fail liveness, Scenario: Before the first block, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 213 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 214 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 215 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 217 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 218 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 219 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 220 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 221 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 222 - "After 0.10.0"
Cohesion: 0.22
Nodes (9): 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals, Release gates still to run (+1 more)

### Community 226 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 228 - "The database"
Cohesion: 0.25
Nodes (8): A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Checking a configuration against its database, The database, The transport reader, TLS to PostgreSQL: `ssl`, UmbraDB operator guide

### Community 229 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 230 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 231 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 233 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 237 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 239 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 240 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 241 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 242 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 243 - "Acceptance map — START-UMBRADB: UmbraDB as a library"
Cohesion: 0.29
Nodes (6): 10. Definition of done, item by item, 1. Library-mode guarantees, 3. Lifecycle, 5. Modules and the ledger worker, 7. The command and shared resolution, Acceptance map — START-UMBRADB: UmbraDB as a library

### Community 244 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 245 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 246 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 248 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 249 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 250 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 251 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 252 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 253 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 254 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 255 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 256 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.33
Nodes (6): 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model, 5. Property tests, The laws of UmbraDB's storage helpers

### Community 257 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 258 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 259 - "Proposal — Sprint 4: Watermarks"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes, Why

### Community 260 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 261 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 262 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 263 - "Requirement: MD-7 Process items are published once, at startup"
Cohesion: 0.33
Nodes (5): MODIFIED Requirements, Requirement: MD-7 Process items are published once, at startup, Scenario: A required process item is never published, Scenario: `node-client` with an in-memory source, Spec delta — `modules` capability

### Community 264 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 265 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 266 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 267 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 269 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 270 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 273 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 274 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 275 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 276 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 277 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 278 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 279 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 280 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 281 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 282 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 283 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 284 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 285 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 286 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 287 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 288 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 289 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 290 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 291 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 292 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 293 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 294 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 295 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 296 - "00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered"
Cohesion: 0.40
Nodes (4): 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered, Evidence, Problem, Suggested fix

### Community 297 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 298 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 299 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 300 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 301 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 305 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 308 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 309 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 310 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 311 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 312 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 313 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 314 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 315 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 323 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 324 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 76 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning (+33 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 92 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically (+28 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-6455` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4091 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **38 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `admin-harness.ts`, `startUmbraDB`, `ingest-harness.ts`, `.from`, `db/errors.ts`, `migrate.ts`, `InMemoryBlockSource`, `builder.test.ts`, `adapter-fixtures.ts`, `tape/index.ts`, `client.test.ts`, `version-checks.ts`, `contract-data-checks.ts`, `NodeClient`, `config/history.ts`, `module-tables.ts`, `validation.ts`, `module-api.ts`, `core-private-source.test.ts`, `column-rules.ts`, `UmbraError`, `process-admin.ts`, `ref_node_fs`, `backup/restore.ts`, `ref_node_crypto`, `adapter.ts`, `cbor.ts`, `loop.test.ts`, `declaration.ts`, `resolve.ts`, `writer-lock-checks.ts`, `runner/process.ts`, `api-server.test.ts`, `height-versioned.test.ts`, `order.property.test.ts`, `config/build.ts`, `core-block-parsed.ts`, `ledger/ledger-tasks.test.ts`, `checks.test.ts`, `pause-fixtures.ts`, `core-ledger-state.ts`, `refused-configuration.test.ts`, `chain-process.test.ts`, `core-transport.ts`, `cli/command.ts`, `boundary.test.ts`, `channels.ts`, `ref_node_timers`, `slow-block-harness.ts`, `code`, `spawnChild`, `mapping.ts`, `core-block-commit.test.ts`, `postgres/transaction-history-storage.ts`, `cold-boot-recovery.integration.test.ts`, `retirement.test.ts`, `zero-timeouts-checks.ts`, `failures.ts`, `file-mode.test.ts`, `example-checks.ts`, `crash.test.ts`, `core-ledger-state/sql.ts`, `config/plain-data.ts`, `restore-private.ts`, `messages.ts`, `node-format.ts`, `containers.test.ts`, `browser.test.ts`, `config-check-database.test.ts`, `transport-faults.test.ts`, `release-version.ts`, `channel-queue.test.ts`, `browser/build.ts`, `vendored-ledger-v9.test.ts`, `resolver-boundary.ts`, `node-fields-harness.ts`, `documents.ts`, `test/postgres/setup.ts`, `src/ledger/identity.ts`, `pg-tx-history-adapter.ts`, `node-bridge.ts`, `read-gate.ts`, `package.json`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `surface.test.ts`, `code-registry.ts`, `ledger-sweep.test.ts`, `block-fetch-decode.test.ts`, `harness.ts`, `library-documents.test.ts`, `src/config/load.ts`, `read-height.property.test.ts`, `key-handling-checks.ts`, `excluded-not-exported.test.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `LoopPauses`, `validation.test.ts`, `mutation-per-adapter.mjs`, `twox.ts`, `worker-threads.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `renamed-setting.test.ts`, `host-signal.ts`, `vendored-ledger-files.test.ts`, `pglite.test.ts`?**
  _High betweenness centrality (0.235) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01712643936163049 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `admin-harness.ts`, `vitest`, `startUmbraDB`, `ingest-harness.ts`, `.from`, `db/errors.ts`, `migrate.ts`, `InMemoryBlockSource`, `options.ts`, `ProcessContexts`, `client.test.ts`, `version-checks.ts`, `contract-data-checks.ts`, `NodeClient`, `config/history.ts`, `module-tables.ts`, `validation.ts`, `module-api.ts`, `core-private-source.test.ts`, `BlockRef`, `src/config/load.ts`, `process-admin.ts`, `ref_node_fs`, `backup/restore.ts`, `cbor.ts`, `FinalizedLoop`, `loop.test.ts`, `declaration.ts`, `resolve.ts`, `LedgerPackage`, `writer-lock-checks.ts`, `runner/process.ts`, `api-server.test.ts`, `height-versioned.test.ts`, `order.property.test.ts`, `config/build.ts`, `statementsOf`, `ledger/ledger-tasks.test.ts`, `checks.test.ts`, `pause-fixtures.ts`, `core-ledger-state.ts`, `refused-configuration.test.ts`, `chain-process.test.ts`, `core-transport.ts`, `validation.test.ts`, `channels.ts`, `tape/index.ts`, `slow-block-harness.ts`, `src/index.ts`, `mapping.ts`, `core-block-commit.test.ts`, `graph.ts`, `loop.ts`, `private-transport.ts`, `zero-timeouts-checks.ts`, `failures.ts`, `checkShape`, `config/plain-data.ts`, `restore-private.ts`, `config-check.ts`, `transport-faults.test.ts`, `renamed-setting.test.ts`, `channel-queue.test.ts`, `validate.ts`, `backupAtStop`, `src/ledger/identity.ts`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.021089300004707434 - nodes in this community are weakly interconnected._