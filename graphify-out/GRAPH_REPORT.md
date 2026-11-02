# Graph Report - UmbraDB

## Corpus Check
- 1202 files · ~1,701,738 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 12515 nodes · 38586 edges · 358 communities (323 shown, 35 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3253 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `54bc500ccf37b2b1` (1202 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- loop.ts
- Database
- admin-harness.ts
- boundary.test.ts
- release-version.ts
- recovery.test.ts
- pg-tx-history-adapter.ts
- TransactionHistoryStorage
- core.ts
- browser/build.ts
- contract-data-checks.ts
- node-fields-harness.ts
- .#process
- node-source.test.ts
- options.ts
- restore-private.ts
- core-ledger-state.ts
- documents.ts
- mapping.ts
- code-registry.ts
- postgres/transaction-history-storage.ts
- crash.test.ts
- read-gate.ts
- test/postgres/setup.ts
- fixtures/configuration.ts
- InMemoryBlockSource
- height-versioned.property.test.ts
- signal-ignored-fixtures.ts
- example-checks.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- ProcessAdmin
- runtime-metadata.test.ts
- backup-fixtures.ts
- version-checks.ts
- node-bridge.ts
- networks.ts
- configuration-refusal.test.ts
- pack-install.mjs
- .#close
- fetch-fixtures.ts
- block-fetch-decode.test.ts
- entries.ts
- chrome.ts
- key-handling-checks.ts
- shims.test.ts
- validateConfig
- browser-harness.ts
- durability-probe.test.ts
- binding.test.ts
- text.test.ts
- statementsOf
- pglite-outside-reads.ts
- version.negative-control.test.ts
- adapter-fixtures.ts
- ws-mutual-tls.test.ts
- core-block-fetch.test.ts
- pglite-timeouts.test.ts
- cursor-table.property.test.ts
- TapeBuilder
- read-height.property.test.ts
- networks.test.ts
- in-memory-source.ts
- web-lock.ts
- stats-module.ts
- backupSignalRelay
- component-table.test.ts
- .write
- no-indexer-or-wallet-sdk.test.ts
- browser/src/config/load.ts
- .from
- worker-threads.test.ts
- history.property.test.ts
- worker-threads-worker.ts
- buffer.ts
- runner/process.ts
- ModuleDeclaration
- LoopPauses
- .send
- Worker
- NodeClient
- Design — Sprint 1: project setup + TemporalKV
- TapeAnswers
- sha256
- config-check.ts
- ProcessItems
- postgres-image.test.ts
- core-transport.ts
- client.test.ts
- tape/index.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- api-session.test.ts
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- devnet-upgrade.test.ts
- pageBench
- channel-queue.test.ts
- ledger/types.ts
- builder.test.ts
- api-server.test.ts
- SkipsAfterReconnect
- record-and-replay.test.ts
- PageState
- PageApiChannel
- validation.ts
- NodeFS
- vitest
- core-block-parsed.ts
- backup/backup.ts
- ledger/ledger-tasks.test.ts
- chain-placement.test.ts
- messages.ts
- ingest-harness.ts
- range.ts
- private/backends.ts
- mounted-admin.test.ts
- loop-stop-harness.ts
- spawnChild
- column-rules.ts
- NodeBlockSource
- transform-checks.ts
- resolve.ts
- declaration.ts
- PrivateLinkChannel
- process-backends.ts
- FinalizedLoop
- PgTransactionHistoryStorage
- slow-block-harness.ts
- containers.test.ts
- core-settings.ts
- .value
- writer-lock-checks.ts
- BlockRef
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- column-refusals.test.ts
- column-rules.test.ts
- core-block-commit.test.ts
- validate.test.ts
- Process
- file-mode.test.ts
- interfaces/transaction-history-storage.ts
- src/config/load.ts
- builds.ts
- checkShape
- surface.test.ts
- retirement.test.ts
- private-transport.ts
- cbor.ts
- real-tapes.ts
- changes.property.test.ts
- resolver-boundary.ts
- chain-process.test.ts
- UmbraError
- cbor.property.test.ts
- private/lockstep-wait.test.ts
- pglite-lock.ts
- paused-harness.ts
- startUmbraDB
- browser.test.ts
- validate.ts
- version-table.ts
- redact.ts
- page.ts
- .configHash
- Problem
- refused
- data
- cold-boot-recovery.integration.test.ts
- .slowBlockMs
- .disconnect
- mapping.test.ts
- Design — v1.1.0: Quint model checking
- Boundaries, threats and controls
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- scoped-review-manifest
- path.ts
- midnight-env — reproducible PREPROD dev environment
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
- selectLedgerVersion
- tableRefusals
- .put
- checked-ledgers.test.ts
- crash-worker.ts
- history
- version
- transportReader
- code
- ADDED Requirements
- graph.py
- .off
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- UmbraDB v1.0.0 — Autonomous Run Log
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
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
- README.md
- ADDED Requirements
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB 0.9.5 "Penumbra"
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- explore.md
- ROADMAP.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- After 0.10.0
- [0.10.0] - 2026-10-27
- UmbraDB in a browser
- try.sh
- ADDED Requirements
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0-infosec-signoff
- Repository agent policy
- Contributing
- UmbraDB 0.10.0 threat model
- stats-module/tsconfig.json
- try-module/tsconfig.json
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
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
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
- 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00023 — The blocks table's height partitions end at 5,000,000
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
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
- 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module
- 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs
- 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes
- 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why
- 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block
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
- ADDED Requirements
- post-block-update/oracle/main.rs

## God Nodes (most connected - your core abstractions)
1. `vitest` - 413 edges
2. `UmbraError` - 346 edges
3. `ModuleDeclaration` - 196 edges
4. `InMemoryBlockSource` - 177 edges
5. `FinalizedLoop` - 135 edges
6. `NodeClient` - 116 edges
7. `BlockRef` - 105 edges
8. `startUmbraDB()` - 103 edges
9. `Database` - 101 edges
10. `ReadHandle` - 92 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `3. Modules` --references--> `RangeCheck`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/modules/graph.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (358 total, 35 thin omitted)

### Community 0 - "loop.ts"
Cohesion: 0.01
Nodes (285): QueuedBlock, PointName, Revision, GraphInput, HeightRange, ResolvedRange, BlockItems, LateUse (+277 more)

### Community 1 - "Database"
Cohesion: 0.01
Nodes (249): TableDigest, TableDigestRow, Database, CaptureColumn, CapturedTable, CaptureState, AppliedRow, MigrationPart (+241 more)

### Community 10 - "admin-harness.ts"
Cohesion: 0.03
Nodes (145): BlockItemSource, EngineConfig, ProcessState, AdminRun, AdminRunOptions, Answerer, Expected, Hold (+137 more)

### Community 101 - "boundary.test.ts"
Cohesion: 0.14
Nodes (32): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+24 more)

### Community 102 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 103 - "recovery.test.ts"
Cohesion: 0.09
Nodes (24): Armed, CommitArm, CommitFault, CommitProxy, Pair, AlwaysLost, Fault, exchange() (+16 more)

### Community 104 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (24): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+16 more)

### Community 105 - "TransactionHistoryStorage"
Cohesion: 0.07
Nodes (32): TransactionHistoryStorage, reason(), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier (+24 more)

### Community 108 - "core.ts"
Cohesion: 0.12
Nodes (25): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+17 more)

### Community 109 - "browser/build.ts"
Cohesion: 0.08
Nodes (26): BrowserBuildOptions, BrowserControl, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+18 more)

### Community 11 - "contract-data-checks.ts"
Cohesion: 0.03
Nodes (143): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+135 more)

### Community 111 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (26): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Problems() (+18 more)

### Community 112 - ".#process"
Cohesion: 0.08
Nodes (5): Activity, LoopObserver, cursorText(), isRetryable(), tracked()

### Community 114 - "node-source.test.ts"
Cohesion: 0.09
Nodes (22): Fetching, Recorder, RootWithoutSignal, at(), cursorRead(), expectRootsEndWithTheirRun(), following(), hashAndBlock() (+14 more)

### Community 116 - "options.ts"
Cohesion: 0.13
Nodes (30): Finding, readOptions, named(), addressFindings(), configFindings(), cwdUnreadable(), elementsOf(), finding() (+22 more)

### Community 119 - "restore-private.ts"
Cohesion: 0.13
Nodes (22): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, runRestore() (+14 more)

### Community 12 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (115): BlockLedgerSource, CoreLedgerStateOptions, LedgerBinding, retainedStates, CoreRevision, StateRow, StoredState, GreyPicker (+107 more)

### Community 120 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 121 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 122 - "code-registry.ts"
Cohesion: 0.11
Nodes (26): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+18 more)

### Community 123 - "postgres/transaction-history-storage.ts"
Cohesion: 0.10
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+11 more)

### Community 125 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 126 - "read-gate.ts"
Cohesion: 0.13
Nodes (24): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+16 more)

### Community 127 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 128 - "fixtures/configuration.ts"
Cohesion: 0.11
Nodes (21): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, PgliteMemoryParts, core(), databaseOf(), defineConfig() (+13 more)

### Community 13 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (118): InMemoryBlockSource, EngineBuild, EngineNetwork, ProcessingEnd, ProcessStatus, upgradeBoundary, UpgradeCondition, Job (+110 more)

### Community 130 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 131 - "signal-ignored-fixtures.ts"
Cohesion: 0.09
Nodes (20): IgnoredJob, ListenedRun, WorkerSignals, RunningCommand, listenerProblems(), namesUnder(), runWorkerInChild(), signalLines() (+12 more)

### Community 132 - "example-checks.ts"
Cohesion: 0.15
Nodes (19): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+11 more)

### Community 133 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 134 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 135 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 136 - "ProcessAdmin"
Cohesion: 0.14
Nodes (7): ProcessAdmin, NodeFacts, Heartbeat, recordedHistory(), writerLockHeld(), beat(), 8. Admin endpoints

### Community 139 - "runtime-metadata.test.ts"
Cohesion: 0.12
Nodes (13): MetadataBlock, RuntimeMetadata, RuntimeMetadataEntry, Boundary, UpgradeCase, contentStateOf(), hexOf(), quietConnect() (+5 more)

### Community 14 - "backup-fixtures.ts"
Cohesion: 0.04
Nodes (103): RestoreInput, BackupBackend, BackupDatabase, killedRestore, TickerConfig, TickerHandle, BackupOnSignal, LoopClass (+95 more)

### Community 140 - "version-checks.ts"
Cohesion: 0.20
Nodes (23): VersionedBlock, CallRecord, Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts() (+15 more)

### Community 141 - "node-bridge.ts"
Cohesion: 0.12
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 144 - "networks.ts"
Cohesion: 0.09
Nodes (23): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, ConfiguredLedgerTable (+15 more)

### Community 145 - "configuration-refusal.test.ts"
Cohesion: 0.16
Nodes (18): ConfigFinding, findingText(), refusalFindings(), configurationFindings(), configurationRefusalLines(), isConfigurationRefusal(), messageOf(), redactedFindings() (+10 more)

### Community 146 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 147 - ".#close"
Cohesion: 0.10
Nodes (6): SignalTarget, 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Resolution, Suggested fix

### Community 15 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (111): NodeCallOptions, ProcessCondition, Scenario, RecordingClient, ArgType, BlockOptions, CallSpec, chainBlock (+103 more)

### Community 150 - "block-fetch-decode.test.ts"
Cohesion: 0.16
Nodes (16): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), concatBytes(), encodeCompact() (+8 more)

### Community 151 - "entries.ts"
Cohesion: 0.10
Nodes (20): TransportReader, CoreEntryInput, CoreSettingsBase, EntryBuilder, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+12 more)

### Community 152 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 153 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 154 - "shims.test.ts"
Cohesion: 0.15
Nodes (13): ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker, connectLink() (+5 more)

### Community 155 - "validateConfig"
Cohesion: 0.12
Nodes (18): BlockParsed, validateConfig(), checked(), checked(), findings(), checked(), declarations(), input() (+10 more)

### Community 156 - "browser-harness.ts"
Cohesion: 0.24
Nodes (18): PageLink, ProcessName, apiChannel(), backupThrough(), byDeadline(), call(), eventsOf(), eventWhen() (+10 more)

### Community 159 - "durability-probe.test.ts"
Cohesion: 0.21
Nodes (15): DurabilityProbeOptions, DurabilityViolation, ProbeSession, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit(), durabilityRefusal() (+7 more)

### Community 16 - "binding.test.ts"
Cohesion: 0.03
Nodes (114): PrivateIntakeOptions, startHashDecision, PglitePathParts, LockstepCondition, A165Options, a165Run, Attempt, A113Observation (+106 more)

### Community 161 - "text.test.ts"
Cohesion: 0.16
Nodes (9): BackupText, createReadStream(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir (+1 more)

### Community 167 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 168 - "pglite-outside-reads.ts"
Cohesion: 0.21
Nodes (11): LoadOutcome, OutsideRead, Traced, PgliteTestDatabase, expectNoOutsideReads(), outsideReads(), runUnderReadLoad(), turn() (+3 more)

### Community 169 - "version.negative-control.test.ts"
Cohesion: 0.17
Nodes (9): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, expectUpgradeDecoding(), runtimeAt() (+1 more)

### Community 17 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (104): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer, AdapterWorkerHost (+96 more)

### Community 171 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 172 - "core-block-fetch.test.ts"
Cohesion: 0.14
Nodes (7): builtInNetwork, LedgerTable, coreBlockFetchOnFetch(), builtInLedgerTable(), blockContext(), KNOWN_NETWORKS, IN_MEMORY_START_MS

### Community 174 - "pglite-timeouts.test.ts"
Cohesion: 0.17
Nodes (12): Run, Job, WorkerEvent, expectNeverCutOffNorHung(), settings(), apiRead(), engine(), report() (+4 more)

### Community 175 - "cursor-table.property.test.ts"
Cohesion: 0.17
Nodes (15): Access, Block, BlockFails, Counts, Write, canonicalText(), expectValue(), holds() (+7 more)

### Community 176 - "TapeBuilder"
Cohesion: 0.18
Nodes (5): Refusal, TapeBuilder, withBuilder(), frameText(), whenClosed()

### Community 178 - "read-height.property.test.ts"
Cohesion: 0.20
Nodes (10): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+2 more)

### Community 179 - "networks.test.ts"
Cohesion: 0.15
Nodes (11): Answers, File, FormatRow, FoundTape, H(), validFile(), BUILT_IN_NETWORKS, NETWORKS_FORMAT (+3 more)

### Community 18 - "in-memory-source.ts"
Cohesion: 0.03
Nodes (84): UmbraDBHandle, InMemoryItems, InMemorySourceOptions, Wait, CloseHelper, RestoreJob, Hold, Signal (+76 more)

### Community 180 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 181 - "stats-module.ts"
Cohesion: 0.26
Nodes (11): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+3 more)

### Community 185 - "backupSignalRelay"
Cohesion: 0.19
Nodes (7): backupSignalRelay, SignalSource, stopSignal, BackupSignals, TickerOptions, PausableOptions, relayOf()

### Community 186 - "component-table.test.ts"
Cohesion: 0.15
Nodes (10): DesignTable, RowCoverage, rule(), opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS (+2 more)

### Community 187 - ".write"
Cohesion: 0.13
Nodes (8): DoesNotHold, EndsTheRun, IgnoresTheStop, PausesInsideTheHeight, StaysPaused, aborted(), abortOf(), never()

### Community 188 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 189 - "browser/src/config/load.ts"
Cohesion: 0.23
Nodes (12): ImportedConfig, LoadedConfig, LoadOptions, configModules(), configModuleUrl(), configPath(), importConfig(), loadConfig() (+4 more)

### Community 19 - ".from"
Cohesion: 0.03
Nodes (96): Buffer, Hash, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent (+88 more)

### Community 190 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 195 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 197 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 198 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 2 - "runner/process.ts"
Cohesion: 0.02
Nodes (222): Bound, ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, ConfigRow, CoreLedgerVersion, CoreVersion (+214 more)

### Community 20 - "ModuleDeclaration"
Cohesion: 0.03
Nodes (108): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, RevisionSettings, EntryView, RecordedView, SanitizedError (+100 more)

### Community 204 - "LoopPauses"
Cohesion: 0.26
Nodes (3): LoopPaused, LoopPauses, watched()

### Community 21 - "NodeClient"
Cohesion: 0.05
Nodes (73): CoreChainBinding, FinalizedHeightOptions, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription (+65 more)

### Community 213 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.20
Nodes (10): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+2 more)

### Community 215 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 216 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 22 - "config-check.ts"
Cohesion: 0.03
Nodes (87): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName (+79 more)

### Community 228 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 23 - "core-transport.ts"
Cohesion: 0.03
Nodes (70): PrivateLinkAddress, PrivateLinkConnect, LinkTimers, CoreChannelSeams, CoreChannelsOptions, Queued, Connected, CoreTransport (+62 more)

### Community 24 - "client.test.ts"
Cohesion: 0.03
Nodes (63): Connection, NodeClientOptions, NodeSocket, NodeSocketEvents, NodeTimers, SocketFailure, HandSocket, HandSockets (+55 more)

### Community 25 - "tape/index.ts"
Cohesion: 0.05
Nodes (70): Recorded, Link, TapeBuilderOptions, RecordingError, RecordingProblem, TapeProblem, TransformProblem, readRequest (+62 more)

### Community 253 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "api-session.test.ts"
Cohesion: 0.04
Nodes (82): coreHeaders, HeadersArgument, LifecycleStatus, ModuleApiStart, MountedApiSeams, StartedModuleApi, ChannelConnectOptions, connectionRules (+74 more)

### Community 263 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 27 - "devnet-upgrade.test.ts"
Cohesion: 0.05
Nodes (69): Side, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch (+61 more)

### Community 279 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 28 - "channel-queue.test.ts"
Cohesion: 0.04
Nodes (73): EndpointOptions, Envelope, MessagePortLike, controlledTimers, PeerEnd, PeerMessage, rawPeer, TestEnd (+65 more)

### Community 3 - "ledger/types.ts"
Cohesion: 0.02
Nodes (153): LoadLedger, TransactionParser, LedgerStateItem, RetainedState, LedgerName, AdapterSpec, LedgerSource, ApplyInput (+145 more)

### Community 30 - "builder.test.ts"
Cohesion: 0.04
Nodes (46): ConnectionFrames, Failure, Variant, WrongRecording, Metadata, Step, Frame, RawClient (+38 more)

### Community 31 - "api-server.test.ts"
Cohesion: 0.04
Nodes (68): ChainDataAnswer, ChainDataView, ApiError, ApiErrorCode, ApiRequest, ApiStartup, HttpHandler, HttpMethod (+60 more)

### Community 32 - "record-and-replay.test.ts"
Cohesion: 0.04
Nodes (42): ConnectSocket, Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault (+34 more)

### Community 33 - "validation.ts"
Cohesion: 0.03
Nodes (81): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+73 more)

### Community 34 - "vitest"
Cohesion: 0.03
Nodes (50): Served, Finding, Lockfile, Manifest, Upstream, Pem, ReportedTest, checkLedgerPackage() (+42 more)

### Community 35 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (74): BlockHeaderItem, BlockEventSource, BodyExtrinsic, BlockBody, CoreBlockHeader, MetadataType, RuntimeMetadataView, BlockParsedOptions (+66 more)

### Community 36 - "backup/backup.ts"
Cohesion: 0.04
Nodes (72): BackupInput, BackupSeams, BackupTarget, BackupWritten, ManifestMigration, ManifestTool, SnapshotSeams, Environment (+64 more)

### Community 37 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.04
Nodes (65): Path, TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, described(), differs() (+57 more)

### Community 38 - "chain-placement.test.ts"
Cohesion: 0.06
Nodes (72): BlockSpec, EventSpec, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry (+64 more)

### Community 39 - "messages.ts"
Cohesion: 0.04
Nodes (63): Committed, Message, MessageFault, MessageType, Ended, rawClient, Escape, Refused (+55 more)

### Community 4 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (177): Restored, itemsSeen, Json, FixtureRun, ingest, SourceClass, Call, SeenLoad (+169 more)

### Community 40 - "range.ts"
Cohesion: 0.04
Nodes (69): NodeSubscription, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange (+61 more)

### Community 41 - "private/backends.ts"
Cohesion: 0.05
Nodes (47): Keeping, PrivateBackend, SessionSeen, TestDatabase, TestCertificates, A162Options, a162Run, HeaderSeen (+39 more)

### Community 42 - "mounted-admin.test.ts"
Cohesion: 0.05
Nodes (65): AdminSeams, NodeHttpHandler, NodeUpgradeHandler, EngineOptions, Answered, gate, Compared, Expected (+57 more)

### Community 43 - "loop-stop-harness.ts"
Cohesion: 0.06
Nodes (62): CrashEvent, CrashJob, watched, A169Observation, LoopStopScenario, Outage, SourceOf, A167Observation (+54 more)

### Community 44 - "spawnChild"
Cohesion: 0.03
Nodes (63): ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, GateRun, Pids (+55 more)

### Community 45 - "column-rules.ts"
Cohesion: 0.04
Nodes (75): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog (+67 more)

### Community 46 - "NodeBlockSource"
Cohesion: 0.06
Nodes (21): CoreBlockItems, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeHeader, PreparedBlock, QueueRunner (+13 more)

### Community 47 - "transform-checks.ts"
Cohesion: 0.07
Nodes (49): Failure, Variant, TapeError, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange (+41 more)

### Community 48 - "resolve.ts"
Cohesion: 0.05
Nodes (64): AddressRequest, Asked, LinkPlan, NetworkContext, NetworkInput, NetworkPlan, NetworkProblem, NetworkRequest (+56 more)

### Community 5 - "declaration.ts"
Cohesion: 0.03
Nodes (125): UmbraConfig, BlockWriteHandle, ReadHandle, SchemaWriteHandle, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable (+117 more)

### Community 50 - "PrivateLinkChannel"
Cohesion: 0.06
Nodes (32): demoLink, ChannelEndpoint, EndpointEvents, PrivateLinkChannel, CoreChannels, Link, onLink(), controlEnvelope() (+24 more)

### Community 51 - "process-backends.ts"
Cohesion: 0.07
Nodes (45): DatabaseParts, PostgresParts, PostgresPartsInput, Renamed, ChangedFile, GenesisFixture, installationCopy, PackageStartup (+37 more)

### Community 52 - "FinalizedLoop"
Cohesion: 0.06
Nodes (20): FinalizedLoop, Startup, SkipsLockstep, SkipsUnseen, WaitsInTransaction, WaitingInRead, ItemsAfterWrite, SkipsStartAtRestart (+12 more)

### Community 53 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (36): MergeEntriesFn, TransactionHistoryEntry, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, encodeStoredEntry(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema (+28 more)

### Community 54 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (49): ReadOpener, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec, Observed (+41 more)

### Community 56 - "containers.test.ts"
Cohesion: 0.05
Nodes (38): BenchEnv, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, TlsPostgres, guardContainers(), removeAttempt() (+30 more)

### Community 57 - "core-settings.ts"
Cohesion: 0.04
Nodes (49): LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, PrivateCoreSettings, PublicCoreSettings, Absent, DeepReadonly (+41 more)

### Community 58 - ".value"
Cohesion: 0.12
Nodes (32): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataVariant, Primitive, TypeDef (+24 more)

### Community 59 - "writer-lock-checks.ts"
Cohesion: 0.09
Nodes (42): WriterProcess, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), expectRefusedBeforeAnyWrite(), noHeight(), blocksIn() (+34 more)

### Community 6 - "BlockRef"
Cohesion: 0.02
Nodes (108): ChainCheck, ChainCheckInput, ChainIdentity, PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions (+100 more)

### Community 61 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (27): DurabilityWarning, BoundedRead, ReadPool, Session, Writer, WriterStart, rollBack(), 0. Scaffolding + Trust reach (+19 more)

### Community 62 - "column-refusals.test.ts"
Cohesion: 0.08
Nodes (29): ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, Case, freshDatabase(), hashOf() (+21 more)

### Community 63 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (29): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TreeNode, TypeRule, DesignTable (+21 more)

### Community 64 - "core-block-commit.test.ts"
Cohesion: 0.07
Nodes (39): BlockRow, StandInOptions, Commit, checkParent(), commitBlock(), hex(), sameBytes(), writeBlockRow() (+31 more)

### Community 65 - "validate.test.ts"
Cohesion: 0.06
Nodes (38): DatabasePartsInput, Entry, ConfigRule, EntryRef, Accepts, ConfigOf, CoreSettingsGiven, Minimal (+30 more)

### Community 66 - "Process"
Cohesion: 0.09
Nodes (8): PauseHold, Process, asksForChannels(), closeSteps(), messageOf(), privateLinkOf(), signalCause(), sourceOf()

### Community 67 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (33): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+25 more)

### Community 68 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (37): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter (+29 more)

### Community 69 - "src/config/load.ts"
Cohesion: 0.06
Nodes (35): ImportedConfig, LoadOptions, PlainDataRule, SignalJob, Row, configModules(), configModuleUrl(), configPath() (+27 more)

### Community 7 - "builds.ts"
Cohesion: 0.03
Nodes (135): NetworkShown, MountedAdminAnswer, PrivateSideFacts, ProcessAdminOptions, adminRoutes, AdminChannel, AdminServeOptions, FromAdmin (+127 more)

### Community 71 - "checkShape"
Cohesion: 0.07
Nodes (39): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+31 more)

### Community 72 - "surface.test.ts"
Cohesion: 0.07
Nodes (45): Document, EntryInput, Renamed, Surface, SurfaceAmendment, changelogEntryProblems(), entryTerms(), namesWord() (+37 more)

### Community 73 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 74 - "private-transport.ts"
Cohesion: 0.07
Nodes (20): PublicSide, HelloAck, JsonValue, ReadResult, StatementResult, CarrierConnection, Pending, PrivateCarrier (+12 more)

### Community 75 - "cbor.ts"
Cohesion: 0.09
Nodes (37): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+29 more)

### Community 76 - "real-tapes.ts"
Cohesion: 0.08
Nodes (35): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+27 more)

### Community 77 - "changes.property.test.ts"
Cohesion: 0.07
Nodes (41): CanonicalEncodingError, ChangeKind, tableChanges, TouchedRow, Op, States, TableName, encodeArrayHead() (+33 more)

### Community 78 - "resolver-boundary.ts"
Cohesion: 0.08
Nodes (38): TypeCheckFinding, TypeCheckResult, Access, AllowedRead, Boundary, Crossing, Guard, configCompilerOptions() (+30 more)

### Community 79 - "chain-process.test.ts"
Cohesion: 0.06
Nodes (32): AdminStarter, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+24 more)

### Community 8 - "UmbraError"
Cohesion: 0.03
Nodes (111): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresConnection, PostgresOptions, ConfiguredDatabaseOptions, SslMode, CommittedHeight (+103 more)

### Community 80 - "cbor.property.test.ts"
Cohesion: 0.07
Nodes (41): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+33 more)

### Community 81 - "private/lockstep-wait.test.ts"
Cohesion: 0.07
Nodes (25): Report, OpenTransaction, ExpectedWait, WaitSample, HeldLink, HoldingRelay, ReportRelay, RetargetProxy (+17 more)

### Community 83 - "pglite-lock.ts"
Cohesion: 0.08
Nodes (31): CreatedDirectory, EmitWarning, Held, PgliteLockUse, WarningArguments, WarningHook, Job, ChildResult (+23 more)

### Community 89 - "paused-harness.ts"
Cohesion: 0.11
Nodes (31): ReadOnlyDatabase, Validator, Body, KeeperGlobals, PausedExpectation, Read, Reader, Running (+23 more)

### Community 9 - "startUmbraDB"
Cohesion: 0.02
Nodes (140): RunOptions, RunSeams, coreEntry, Address, UmbraDBBackup, UmbraDBCondition, UmbraDBEnd, UmbraDBNetwork (+132 more)

### Community 90 - "browser.test.ts"
Cohesion: 0.08
Nodes (36): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, heldClock, continuedProblems() (+28 more)

### Community 93 - "validate.ts"
Cohesion: 0.11
Nodes (37): CursorRule, Issue, Plain, SettingsSchema, coreSettingsSchema(), closest(), configFindings(), contextOf() (+29 more)

### Community 94 - "version-table.ts"
Cohesion: 0.10
Nodes (34): ManifestLine, VerifyLedgerPackagesOptions, LedgerRelease, LedgerReleasePackage, LedgerSourceSettings, LedgerPin, LedgerRow, LedgerSelection (+26 more)

### Community 96 - "redact.ts"
Cohesion: 0.09
Nodes (30): RedactableConfig, RedactionForms, SecretForm, TextPattern, fieldKinds, Needs, findings(), databaseText() (+22 more)

### Community 98 - "page.ts"
Cohesion: 0.07
Nodes (30): ApiChannel, LinkRecord, RestoreRecord, SavedBackup, WorkerView, appendLog(), backUp(), beginCore() (+22 more)

### Community 193 - ".configHash"
Cohesion: 0.17
Nodes (11): Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport, Scenario: A read through the core, Scenario: The core restarts with another configuration, 8. Mounted admin, the database, security through the new paths, MODIFIED Requirements, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-4 The process transport (+3 more)

### Community 261 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 92 - "refused"
Cohesion: 0.07
Nodes (34): refused(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence, Problem, Suggested fix, A paused loop on `/status`, A private process and a changed public configuration, The node on `/status` (+26 more)

### Community 97 - "data"
Cohesion: 0.07
Nodes (36): params(), n(), data(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules (+28 more)

### Community 106 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (22): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), isPlainObject(), mergeSections(), referenceMergeEntries() (+14 more)

### Community 113 - ".slowBlockMs"
Cohesion: 0.07
Nodes (30): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+22 more)

### Community 170 - ".disconnect"
Cohesion: 0.15
Nodes (14): fault(), Suggested fix, 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants (+6 more)

### Community 173 - "mapping.test.ts"
Cohesion: 0.16
Nodes (6): mapValue(), oid(), identity(), RESULT_COLUMNS, RESULT_TYPES, RFC-3339

### Community 194 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 200 - "Boundaries, threats and controls"
Cohesion: 0.17
Nodes (12): ownerOnlyFile(), 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker (+4 more)

### Community 201 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 209 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 218 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 229 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 233 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 245 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.38
Nodes (6): continueTo(), endedText(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 255 - "selectLedgerVersion"
Cohesion: 0.52
Nodes (7): blockNamed(), checkPins(), hexOf(), isMnsvItem(), ledgerOfSpecVersion(), mnsvSpecVersion(), selectLedgerVersion()

### Community 260 - "tableRefusals"
Cohesion: 0.33
Nodes (5): tableRefusals(), 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 29 - ".put"
Cohesion: 0.02
Nodes (96): T(), input(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, ADDED Requirements (+88 more)

### Community 317 - "checked-ledgers.test.ts"
Cohesion: 0.40
Nodes (3): copyVendoredLedger(), copy, VENDORED_ROOT

### Community 330 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 49 - "history"
Cohesion: 0.04
Nodes (62): history(), revision(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+54 more)

### Community 55 - "version"
Cohesion: 0.04
Nodes (54): side(), migrations(), deferred(), version(), Engineering rules, 1. Overview, Appendix A. Reference, 0. Project setup (+46 more)

### Community 60 - "transportReader"
Cohesion: 0.04
Nodes (49): text(), transportReader(), transportReaderRule(), admin(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix (+41 more)

### Community 70 - "code"
Cohesion: 0.05
Nodes (45): code(), Added, 15. Relation to the existing design documents, Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog (+37 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 95 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 99 - ".off"
Cohesion: 0.06
Nodes (33): Durability, Requirement: DB-12 The durability probe guards PostgreSQL, Scenario: PGlite without the development opt-in, MODIFIED Requirements, Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases (+25 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+27 more)

### Community 110 - "package.json"
Cohesion: 0.06
Nodes (34): bin, umbradb, bugs, url, description, optional, engines, node (+26 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 118 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+23 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 138 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 142 - "UmbraDB v1.0.0 — Autonomous Run Log"
Cohesion: 0.08
Nodes (24): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `start-umbradb` — UmbraDB as a library (2026-11-01), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24) (+16 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 149 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 162 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 163 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 164 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 165 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker, Requirement: LM-9 The handle and its failures (+8 more)

### Community 166 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 182 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 183 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 184 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 191 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 192 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 196 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 199 - "README.md"
Cohesion: 0.26
Nodes (3): Choosing a database, Launching it, stats-module

### Community 202 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 203 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 206 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 207 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 210 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 211 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.18
Nodes (11): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, If you build from source, Installing, Security, The fix this release exists for, The surface (+3 more)

### Community 212 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 214 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 217 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 219 - "ROADMAP.md"
Cohesion: 0.20
Nodes (4): Build commands, Build the package and install it, Building from source, Run from a clone

### Community 220 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 221 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 222 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 223 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 224 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 225 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 226 - "After 0.10.0"
Cohesion: 0.20
Nodes (10): 0.10.0: the core architecture (`openspec/changes/core-arch`), 0.9.5 (released), After 0.10.0, Also next, Deferred network coverage (Q195), Feature modules, Later core work, Non-goals (+2 more)

### Community 230 - "[0.10.0] - 2026-10-27"
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 231 - "UmbraDB in a browser"
Cohesion: 0.22
Nodes (8): Backups and status, Build and serve, Differences from `umbradb run`, How the page is built, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 232 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 234 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 235 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 2. Envelope module (Pg-only — required gate), 4. Pg-only conformance suite (required merge gate) — `test:conformance`, 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 236 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 237 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 238 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 239 - "UmbraDB 0.10.0 threat model"
Cohesion: 0.25
Nodes (8): Assets and actors, Backups and restore, Exposure defaults and hash limits, Known gaps, Private reads of public data, Residual risks and scope, The Midnight node, UmbraDB 0.10.0 threat model

### Community 240 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 241 - "try-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 242 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 243 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 244 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 246 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 247 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 248 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 249 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 250 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 251 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 252 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 254 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 257 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 258 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 259 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 262 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 264 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 265 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.33
Nodes (5): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Seen again (2026-11-01, `start-umbradb` P9), Suggested fix

### Community 266 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 267 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 268 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 269 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 270 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

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

### Community 277 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 278 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

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

### Community 286 - "00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone"
Cohesion: 0.40
Nodes (4): 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone, Problem, Resolution, Suggested fix

### Community 287 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 288 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 289 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 290 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 291 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 292 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 293 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 294 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 295 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 296 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 297 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 298 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 299 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 300 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 301 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 302 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 303 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 304 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 305 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 306 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 307 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 308 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 309 - "00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module"
Cohesion: 0.40
Nodes (4): 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module, Evidence, Problem, Suggested fix

### Community 310 - "00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs"
Cohesion: 0.40
Nodes (4): 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs, Evidence, Problem, Suggested fix

### Community 311 - "00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes"
Cohesion: 0.40
Nodes (4): 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes, Evidence, Problem, Suggested fix

### Community 312 - "00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why"
Cohesion: 0.40
Nodes (4): 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why, Evidence, Problem, Suggested fix

### Community 313 - "00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block"
Cohesion: 0.40
Nodes (4): 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block, Evidence, Problem, Suggested fix

### Community 314 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 315 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 316 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 319 - "manifest.json"
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

### Community 326 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 327 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 328 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 82 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+33 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated, Requirement: load always fully verifies chunk integrity before returning (+33 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+31 more)

### Community 91 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

## Knowledge Gaps
- **57 isolated node(s):** `RFC-8949`, `RFC-8949`, `RFC-3339`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 4115 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `loop.ts`, `Database`, `runner/process.ts`, `ledger/types.ts`, `ingest-harness.ts`, `declaration.ts`, `BlockRef`, `builds.ts`, `UmbraError`, `startUmbraDB`, `admin-harness.ts`, `contract-data-checks.ts`, `core-ledger-state.ts`, `InMemoryBlockSource`, `backup-fixtures.ts`, `fetch-fixtures.ts`, `binding.test.ts`, `adapter-fixtures.ts`, `in-memory-source.ts`, `.from`, `ModuleDeclaration`, `NodeClient`, `config-check.ts`, `core-transport.ts`, `client.test.ts`, `tape/index.ts`, `api-session.test.ts`, `devnet-upgrade.test.ts`, `channel-queue.test.ts`, `builder.test.ts`, `api-server.test.ts`, `record-and-replay.test.ts`, `validation.ts`, `core-block-parsed.ts`, `backup/backup.ts`, `ledger/ledger-tasks.test.ts`, `chain-placement.test.ts`, `messages.ts`, `range.ts`, `private/backends.ts`, `mounted-admin.test.ts`, `loop-stop-harness.ts`, `spawnChild`, `transform-checks.ts`, `resolve.ts`, `process-backends.ts`, `slow-block-harness.ts`, `containers.test.ts`, `core-settings.ts`, `writer-lock-checks.ts`, `column-refusals.test.ts`, `column-rules.test.ts`, `core-block-commit.test.ts`, `validate.test.ts`, `file-mode.test.ts`, `interfaces/transaction-history-storage.ts`, `src/config/load.ts`, `surface.test.ts`, `retirement.test.ts`, `real-tapes.ts`, `changes.property.test.ts`, `resolver-boundary.ts`, `chain-process.test.ts`, `cbor.property.test.ts`, `private/lockstep-wait.test.ts`, `pglite-lock.ts`, `browser.test.ts`, `version-table.ts`, `redact.ts`, `boundary.test.ts`, `release-version.ts`, `recovery.test.ts`, `pg-tx-history-adapter.ts`, `cold-boot-recovery.integration.test.ts`, `core.ts`, `browser/build.ts`, `package.json`, `node-fields-harness.ts`, `node-source.test.ts`, `options.ts`, `restore-private.ts`, `documents.ts`, `code-registry.ts`, `postgres/transaction-history-storage.ts`, `crash.test.ts`, `read-gate.ts`, `test/postgres/setup.ts`, `height-versioned.property.test.ts`, `example-checks.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `runtime-metadata.test.ts`, `version-checks.ts`, `node-bridge.ts`, `configuration-refusal.test.ts`, `block-fetch-decode.test.ts`, `key-handling-checks.ts`, `shims.test.ts`, `durability-probe.test.ts`, `excluded-not-exported.test.ts`, `text.test.ts`, `statementsOf`, `pglite-outside-reads.ts`, `version.negative-control.test.ts`, `ws-mutual-tls.test.ts`, `core-block-fetch.test.ts`, `mapping.test.ts`, `pglite-timeouts.test.ts`, `cursor-table.property.test.ts`, `read-height.property.test.ts`, `networks.test.ts`, `web-lock.ts`, `backupSignalRelay`, `component-table.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-threads.test.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `LoopPauses`, `postgres-image.test.ts`, `checked-ledgers.test.ts`?**
  _High betweenness centrality (0.222) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)`) actually correct?**
  _`UmbraError` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `loop.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.012709664018279066 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `loop.ts`, `Database`, `runner/process.ts`, `ledger/types.ts`, `declaration.ts`, `BlockRef`, `ProcessAdmin`, `startUmbraDB`, `admin-harness.ts`, `contract-data-checks.ts`, `core-ledger-state.ts`, `runtime-metadata.test.ts`, `InMemoryBlockSource`, `fetch-fixtures.ts`, `binding.test.ts`, `configuration-refusal.test.ts`, `backup-fixtures.ts`, `version-checks.ts`, `ModuleDeclaration`, `NodeClient`, `config-check.ts`, `core-transport.ts`, `in-memory-source.ts`, `client.test.ts`, `api-session.test.ts`, `shims.test.ts`, `channel-queue.test.ts`, `tape/index.ts`, `durability-probe.test.ts`, `api-server.test.ts`, `validation.ts`, `backup/backup.ts`, `ledger/ledger-tasks.test.ts`, `ADDED Requirements`, `statementsOf`, `messages.ts`, `range.ts`, `mounted-admin.test.ts`, `loop-stop-harness.ts`, `mapping.test.ts`, `NodeBlockSource`, `transform-checks.ts`, `resolve.ts`, `process-backends.ts`, `web-lock.ts`, `FinalizedLoop`, `slow-block-harness.ts`, `version`, `core-settings.ts`, `.write`, `writer-lock-checks.ts`, `Tasks — v1.1.0: Formal completion (`formal-completion`)`, `browser/src/config/load.ts`, `transportReader`, `core-block-commit.test.ts`, `validate.test.ts`, `Process`, `src/config/load.ts`, `checkShape`, `private-transport.ts`, `cbor.ts`, `changes.property.test.ts`, `chain-process.test.ts`, `pglite-lock.ts`, `sha256`, `validate.ts`, `version-table.ts`, `node-source.test.ts`, `options.ts`, `mapping.ts`, `selectLedgerVersion`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.013799690412673319 - nodes in this community are weakly interconnected._