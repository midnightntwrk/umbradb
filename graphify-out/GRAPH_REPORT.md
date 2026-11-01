# Graph Report - UmbraDB

## Corpus Check
- 1114 files · ~1,553,657 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .patch 18, (none) 15, .lean 11)

## Summary
- 11605 nodes · 35181 edges · 346 communities (307 shown, 39 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2804 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `62cfa40e9ef88050` (1114 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- db/errors.ts
- ModuleDeclaration
- client.test.ts
- code-registry.ts
- postgres/transaction-history-storage.ts
- Lockstep
- BlockRef
- LoopPauses
- documents.ts
- pg-tx-history-adapter.ts
- adapter-fixtures.ts
- ref_node_http
- src/ledger/identity.ts
- mapping.ts
- interfaces/transaction-history-storage.ts
- development-opt-in.test.ts
- ledger-tapes.ts
- read-gate.ts
- crash.test.ts
- backup/restore.ts
- networks.ts
- config/plain-data.ts
- height-versioned.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- threat-model.test.ts
- core-contract-states.ts
- version-checks.ts
- spawnChild
- net.test.ts
- PgliteDatabase
- .concat
- pglite-lock.ts
- ledger/metadata.ts
- pack-install.mjs
- NodeClient
- Transaction
- networks.test.ts
- ledger-table-config.test.ts
- example-checks.ts
- block-fetch-decode.test.ts
- node-source.ts
- column-rules.ts
- transcripts.ts
- Buffer
- version-table.ts
- chrome.ts
- key-handling-checks.ts
- zod
- transaction-history-storage.property.test.ts
- process-admin.ts
- core-block-fetch.test.ts
- ledger-checks.ts
- browser-harness.ts
- ws.ts
- PortSocket
- text.test.ts
- recovery.test.ts
- ledger/types.ts
- resolver-boundary.ts
- browser/serve.ts
- BlockItems
- surface.test.ts
- ws-mutual-tls.test.ts
- Design — Sprint 1: project setup + TemporalKV
- statementsOf
- vitest
- FakeNode
- config/history.ts
- Session
- read-height.property.test.ts
- RawClient
- worker-threads.test.ts
- api-server.test.ts
- declaration.ts
- worker-threads-worker.ts
- Worker
- .send
- core-ledger-state.ts
- ledger/plain-data.ts
- sha256
- UmbraError
- ReadPool
- ProcessItems
- postgres-image.test.ts
- browser/src/config/load.ts
- ref_node_fs
- typescript
- POSTGRES_IMAGE
- core-transport.ts
- renamed-setting.test.ts
- adapter.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- loop.ts
- builder.test.ts
- LedgerPackage
- ref_node_crypto
- validate.ts
- runner/process.ts
- cli/command.ts
- https.ts
- NodeFS
- core-status.test.ts
- PausesInsideTheHeight
- SkipsUnseen
- WaitsInTransaction
- SilentHalt
- FailingAfter
- NoRedelivery
- CommitsTheBoundary
- config-check.ts
- 12. Ledger
- roles.ts
- pause-fixtures.ts
- core-block-parsed.ts
- FinalizedLoop
- InMemoryBlockSource
- process-worker.ts
- Process
- module-tables.ts
- transport-faults.test.ts
- changes.property.test.ts
- boundary.test.ts
- .from
- private/backends.ts
- slow-block-harness.ts
- fetch-fixtures.ts
- PgTransactionHistoryStorage
- NodeBlockSource
- loop-stop-harness.ts
- intake.test.ts
- builds.ts
- .value
- binding.test.ts
- transform-checks.ts
- tape/index.ts
- cbor.ts
- shadow-schema.test.ts
- core-block-commit.test.ts
- change-capture.ts
- graph.ts
- retirement.test.ts
- file-mode.test.ts
- checkShape
- contract-data-checks.ts
- paused-harness.ts
- core-contract-logs-fast.ts
- page.ts
- cold-boot-recovery.integration.test.ts
- test/postgres/setup.ts
- admin-harness.ts
- chain-events-decode.test.ts
- validation.ts
- lockstep-refusals.test.ts
- browser.test.ts
- loop.test.ts
- release-version.ts
- core.ts
- core-digest.ts
- node-bridge.ts
- TransactionHistoryEntry
- browser/build.ts
- node-fields-harness.ts
- Design — Sprint 3: CheckpointStore
- refused
- table
- transportReader
- T
- mapping.test.ts
- UmbraDB module guide
- mutation-per-adapter.mjs
- fault
- scale-value.ts
- twox.ts
- UmbraDB third-party component inventory (SBOM)
- path.ts
- midnight-env — reproducible PREPROD dev environment
- orphan-watcher.mjs
- crash-worker.ts
- history
- code
- .put
- version
- ADDED Requirements
- graph.py
- ADDED Requirements
- .slowBlockMs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- The laws of UmbraDB's storage helpers
- ADDED Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Design — v1.0.0-durable-checkpoint-cursor
- Boundaries, threats and controls
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- ADDED Requirements
- devDependencies
- README.md
- ADDED Requirements
- UmbraDB
- Backups
- ADDED Requirements
- REMOVED Requirements
- Requirement: RN-16 Chain-data reads name their view and height
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.1.0: Formal completion (`formal-completion`)
- compilerOptions
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- explore.md
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- UmbraDB software supply-chain directory
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- [0.9.5] - 2026-07-25 — "Penumbra"
- try.sh
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Contributing
- UmbraDB in a browser
- stats-module/tsconfig.json
- Tasks — Sprint 4: Watermarks
- MODIFIED Requirements
- Requirement: BK-1 Backup
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — v1.0.0-durable-checkpoint-cursor
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
- UmbraDB node architecture
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 4: Watermarks
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
- 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time
- 00026 — A configuration's `core` revisions may name different networks
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- 00041 — A128 refused once and A130 hung once under load, each passing in every other run
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
- 00054 — A slow-block test hung inside PGlite for over an hour
- 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented
- 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first
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
- ADDED Requirements
- ADDED Requirements
- package.json

## God Nodes (most connected - your core abstractions)
1. `vitest` - 377 edges
2. `UmbraError` - 320 edges
3. `ModuleDeclaration` - 182 edges
4. `FinalizedLoop` - 133 edges
5. `InMemoryBlockSource` - 124 edges
6. `NodeClient` - 113 edges
7. `Database` - 101 edges
8. `BlockRef` - 98 edges
9. `ReadHandle` - 91 edges
10. `NodeBlockSource` - 81 edges

## Surprising Connections (you probably didn't know these)
- `Evidence` --references--> `ManualTimers`  [INFERRED]
  docs/issues/00016-heartbeat-above-timer-limit.md → test/node/manual-timers.ts
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `Scenario: A subclass with a hook` --references--> `InMemoryBlockSource`  [INFERRED]
  openspec/changes/start-umbradb/specs/library-mode/spec.md → src/runner/in-memory-source.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (346 total, 39 thin omitted)

### Community 0 - "db/errors.ts"
Cohesion: 0.02
Nodes (168): PostgresConnection, PostgresOptions, SslMode, CommittedHeight, ReadOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning (+160 more)

### Community 1 - "ModuleDeclaration"
Cohesion: 0.02
Nodes (185): Database, AppliedMigration, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, driverConnectionOptions (+177 more)

### Community 10 - "client.test.ts"
Cohesion: 0.02
Nodes (90): NodeClientOptions, NodeRetry, ConnectSocket, HandSocket, HandSockets, Answer, Handler, Received (+82 more)

### Community 100 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 101 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+11 more)

### Community 102 - "Lockstep"
Cohesion: 0.10
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 104 - "BlockRef"
Cohesion: 0.11
Nodes (11): BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, failingSource(), flakySource(), 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail (+3 more)

### Community 105 - "LoopPauses"
Cohesion: 0.08
Nodes (17): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, clock(), watched(), 1. Module layout, 2. Backend routing (the one non-obvious constraint) (+9 more)

### Community 106 - "documents.ts"
Cohesion: 0.14
Nodes (27): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+19 more)

### Community 107 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 11 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (119): ApplyInput, StoredNode, DeployTx, Freeable, recordedGenesis, Upstream, contractFixture, Ledger (+111 more)

### Community 111 - "ref_node_http"
Cohesion: 0.10
Nodes (9): Report, HeldLink, HoldingRelay, ReportRelay, RetargetProxy, hostPort(), sendable(), typeOf() (+1 more)

### Community 112 - "src/ledger/identity.ts"
Cohesion: 0.14
Nodes (24): ManifestLine, VerifyLedgerPackagesOptions, LedgerSource, LedgerSourceSettings, checkLedgerPackages(), checkLedgerPackage(), checkLedgerPackages(), checkPackageFiles() (+16 more)

### Community 113 - "mapping.ts"
Cohesion: 0.13
Nodes (26): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+18 more)

### Community 114 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 115 - "development-opt-in.test.ts"
Cohesion: 0.11
Nodes (25): LoadOptions, SignalJob, configModuleUrl(), configPath(), invalid(), isFile(), loadConfig(), modulesOf() (+17 more)

### Community 116 - "ledger-tapes.ts"
Cohesion: 0.10
Nodes (23): StateSummary, eventsRuntime, LedgerHeight, LedgerScenarioOptions, RawPackageClass, OracleState, OracleVersion, eventsOf() (+15 more)

### Community 117 - "read-gate.ts"
Cohesion: 0.14
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 118 - "crash.test.ts"
Cohesion: 0.12
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 12 - "backup/restore.ts"
Cohesion: 0.03
Nodes (89): ChainCheck, PrivateBlockSource, PrivateChecks, privateIntake, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes (+81 more)

### Community 120 - "networks.ts"
Cohesion: 0.09
Nodes (26): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+18 more)

### Community 121 - "config/plain-data.ts"
Cohesion: 0.11
Nodes (23): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, copyArray(), copyObject(), instanceOf() (+15 more)

### Community 122 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 123 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 124 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 125 - "threat-model.test.ts"
Cohesion: 0.16
Nodes (24): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+16 more)

### Community 126 - "core-contract-states.ts"
Cohesion: 0.10
Nodes (21): CoreContractStatesOptions, ContractStateRow, DefinedModule, contractStatesOf(), coreContractStates(), hex(), writeStateRows(), insertStateRows() (+13 more)

### Community 129 - "version-checks.ts"
Cohesion: 0.13
Nodes (20): Boundary, CallRecord, MetadataSelector, Select, UpgradeCase, Walk, found(), bytesOf() (+12 more)

### Community 13 - "spawnChild"
Cohesion: 0.02
Nodes (107): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+99 more)

### Community 130 - "net.test.ts"
Cohesion: 0.14
Nodes (14): NetworkBroker, IncomingMessage, Server, NetworkMessage, createServer(), connect(), listen(), pagePort() (+6 more)

### Community 134 - "PgliteDatabase"
Cohesion: 0.18
Nodes (6): JobQueue, PgliteDatabase, handleClosed(), failedEarlier(), nestedCall(), openOn()

### Community 136 - ".concat"
Cohesion: 0.12
Nodes (12): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+4 more)

### Community 137 - "pglite-lock.ts"
Cohesion: 0.15
Nodes (18): CreatedDirectory, Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile() (+10 more)

### Community 138 - "ledger/metadata.ts"
Cohesion: 0.13
Nodes (9): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, contentStateOf(), hexOf(), walkOver() (+1 more)

### Community 139 - "pack-install.mjs"
Cohesion: 0.17
Nodes (20): SmokeFailure, checkConfig(), configFile(), consumerSource(), dockerIndependentOracles(), fail(), main(), run() (+12 more)

### Community 14 - "NodeClient"
Cohesion: 0.04
Nodes (83): Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter, NodeBlock (+75 more)

### Community 140 - "Transaction"
Cohesion: 0.12
Nodes (9): Transaction, HeightRun, SkipsAfterReconnect, Batching, SkipsStartAtRestart, WaitsInTransaction, ComputeAtH, WritingLoop (+1 more)

### Community 141 - "networks.test.ts"
Cohesion: 0.13
Nodes (16): Answers, File, FormatRow, TapeAnswers, FoundTape, nodeRootAt(), expectTableHolds(), H() (+8 more)

### Community 142 - "ledger-table-config.test.ts"
Cohesion: 0.18
Nodes (19): CountingNode, Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts() (+11 more)

### Community 143 - "example-checks.ts"
Cohesion: 0.16
Nodes (17): BlockImport, ChildResult, CodeBlock, installedProject, allowedSource(), codeBlocks(), exampleCopy(), importProblems() (+9 more)

### Community 145 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 149 - "node-source.ts"
Cohesion: 0.11
Nodes (10): BlockLedgerSource, NodeSourceOptions, Prefetch, NodeSubscription, FinalityStallCondition, SourceCondition, SourceNodeView, genesisStateOf() (+2 more)

### Community 15 - "column-rules.ts"
Cohesion: 0.02
Nodes (113): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+105 more)

### Community 150 - "transcripts.ts"
Cohesion: 0.15
Nodes (19): BlockTransaction, UnsureLog, LogSite, Program, UnsureReason, V9Raw, LogItem, bytesOfHex() (+11 more)

### Community 151 - "Buffer"
Cohesion: 0.14
Nodes (13): Buffer, BufferEncoding, Hash, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex() (+5 more)

### Community 152 - "version-table.ts"
Cohesion: 0.18
Nodes (20): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+12 more)

### Community 153 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 154 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 155 - "zod"
Cohesion: 0.16
Nodes (13): StatsRow, Outcome, insertRow(), lastTotal(), recentRows(), rowAt(), migrations, statsModule (+5 more)

### Community 156 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 16 - "process-admin.ts"
Cohesion: 0.04
Nodes (105): ConfigFacts, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, DigestRow (+97 more)

### Community 160 - "core-block-fetch.test.ts"
Cohesion: 0.12
Nodes (9): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, LedgerTable, coreBlockFetchOnFetch(), blockContext(), CORE_BLOCK_ITEMS, KNOWN_NETWORKS (+1 more)

### Community 162 - "ledger-checks.ts"
Cohesion: 0.24
Nodes (18): LedgerEvent, TransactionResult, VmLog, ledgerItemsSeen, a106Problems(), a107Problems(), a99Problems(), blockZeroProblems() (+10 more)

### Community 163 - "browser-harness.ts"
Cohesion: 0.26
Nodes (16): BrowserControl, ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf() (+8 more)

### Community 164 - "ws.ts"
Cohesion: 0.14
Nodes (8): Emitter, Frame, Listener, PortUpgrade, RawData, WebSocket, WebSocketServer, How the page is built

### Community 165 - "PortSocket"
Cohesion: 0.18
Nodes (7): PortSocket, 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix, Requirement: RN-15 Module APIs are registered once, at startup, Scenario: Two modules claim one path

### Community 166 - "text.test.ts"
Cohesion: 0.16
Nodes (9): BackupText, createReadStream(), dumpLines(), blobChunks(), blobText(), firstLineOf(), linesAfterFirst(), dir (+1 more)

### Community 167 - "recovery.test.ts"
Cohesion: 0.18
Nodes (16): AlwaysLanded, AlwaysLost, DropsHeld, Fault, Recorded, RecoveryObservation, committedProblems(), count() (+8 more)

### Community 17 - "ledger/types.ts"
Cohesion: 0.03
Nodes (101): LoadLedger, LedgerName, ApplyOutput, ChainOutcome, LedgerPackageOptions, LedgerTask, LedgerTaskBlock, ParsedTransaction (+93 more)

### Community 171 - "resolver-boundary.ts"
Cohesion: 0.18
Nodes (16): Boundary, Crossing, Guard, boundaryOf(), boundarySources(), guardedSymbols(), hostWith(), inRepository() (+8 more)

### Community 172 - "browser/serve.ts"
Cohesion: 0.17
Nodes (12): BrowserBuild, pageBench, PageServer, main(), pageHandler(), servePage(), listenOnRandomPort(), randomPort() (+4 more)

### Community 175 - "BlockItems"
Cohesion: 0.14
Nodes (6): QueuedBlock, BlockItems, EventsRunner, KeptItems, KeptLoop, reporting()

### Community 176 - "surface.test.ts"
Cohesion: 0.20
Nodes (15): Surface, coreModuleProblems(), identifiersIn(), isValueExport(), paragraph(), runtimeValues(), section12(), section12Surface() (+7 more)

### Community 177 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 178 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 179 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 18 - "vitest"
Cohesion: 0.03
Nodes (68): CheckStep, Served, CheckTarget, CliBackend, Row, Finding, Lockfile, Manifest (+60 more)

### Community 19 - "config/history.ts"
Cohesion: 0.04
Nodes (103): OpenedFacts, CoreVersion, CoreSettings, versionEntry, ConfigHashRow, HistoryCheck, HistoryCode, HistoryContext (+95 more)

### Community 191 - "Session"
Cohesion: 0.21
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 192 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 195 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 2 - "api-server.test.ts"
Cohesion: 0.02
Nodes (160): ModuleApiServer, ModuleApiStart, StartedModuleApi, ReadOnlyDatabase, ResolvedGraph, Connection, HeadersArgument, ModuleApiServer (+152 more)

### Community 20 - "declaration.ts"
Cohesion: 0.03
Nodes (77): UmbraConfig, BlockWriteHandle, ReadHandle, SchemaWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable (+69 more)

### Community 201 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 21 - "core-ledger-state.ts"
Cohesion: 0.04
Nodes (94): CoreLedgerStateOptions, LedgerBinding, LedgerStateItem, RetainedState, retainedStates, CoreRevision, StateRow, StoredState (+86 more)

### Community 213 - "ledger/plain-data.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 214 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 22 - "UmbraError"
Cohesion: 0.04
Nodes (93): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+85 more)

### Community 224 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 225 - "browser/src/config/load.ts"
Cohesion: 0.31
Nodes (8): LoadedConfig, LoadOptions, configModuleUrl(), configPath(), loadConfig(), noFile(), DEFAULT_CONFIG_FILE, MODULES_EXPORT

### Community 23 - "ref_node_fs"
Cohesion: 0.05
Nodes (77): RestoreOutcome, BackupBackend, BackupDatabase, killedRestore, FileProcess, privateBackup, PublicSetting, PublicSide (+69 more)

### Community 233 - "typescript"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 234 - "POSTGRES_IMAGE"
Cohesion: 0.32
Nodes (5): BenchEnv, PG_SETTINGS, container, { guarded, fixture }, POSTGRES_IMAGE

### Community 24 - "core-transport.ts"
Cohesion: 0.03
Nodes (77): PublicSide, CoreTransport, Session, TransportLimits, TransportTls, Committed, Hello, HelloAck (+69 more)

### Community 242 - "renamed-setting.test.ts"
Cohesion: 0.39
Nodes (6): Renamed, databaseOf(), dataOf(), escaped(), fileOf(), FINDING()

### Community 25 - "adapter.ts"
Cohesion: 0.03
Nodes (80): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+72 more)

### Community 252 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "loop.ts"
Cohesion: 0.04
Nodes (88): PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+80 more)

### Community 27 - "builder.test.ts"
Cohesion: 0.03
Nodes (67): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Metadata, Step, Frame (+59 more)

### Community 28 - "LedgerPackage"
Cohesion: 0.05
Nodes (49): LedgerPackage, NodeStore, StateHandle, LedgerEngine, LedgerTaskFailed, Settled, bridgeStore, StagenetBlockJson (+41 more)

### Community 29 - "ref_node_crypto"
Cohesion: 0.05
Nodes (62): Side, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch (+54 more)

### Community 3 - "validate.ts"
Cohesion: 0.02
Nodes (194): CommandBuildOptions, CoreLedgerVersion, LedgerPackageIdentity, LedgerTableSettings, RenamedSetting, SettingPath, TransportReaderSettings, DatabasePartsInput (+186 more)

### Community 30 - "runner/process.ts"
Cohesion: 0.04
Nodes (66): Bound, ChainCheckInput, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait, WaitingListener, ConfigRow (+58 more)

### Community 31 - "cli/command.ts"
Cohesion: 0.04
Nodes (67): CommandHandler, CommandIo, MainProcess, ConfigCheckReport, backupSignalRelay, RunOptions, RunSeams, SignalSource (+59 more)

### Community 32 - "core-status.test.ts"
Cohesion: 0.05
Nodes (64): adminRoutes, AdminServeOptions, AdminAnswer, AdminEndpoint, AdminPart, AdminSnapshot, AdminView, ReadinessFacts (+56 more)

### Community 34 - "config-check.ts"
Cohesion: 0.05
Nodes (77): CoreChainFacts, RestoreBase, CheckFinding, CheckState, ConfigCheckOptions, ConfigCheckSeams, StepName, StepReport (+69 more)

### Community 35 - "12. Ledger"
Cohesion: 0.04
Nodes (55): EvictionRefused, LedgerHost, LedgerWorkerFailure, NodeDatabase, SentParses, NodeReader, SlowStep, TestLoaderData (+47 more)

### Community 36 - "roles.ts"
Cohesion: 0.04
Nodes (57): Difference, OwnPart, PlannedSchema, Provision, QualifiedTable, SchemaTable, Settings, Case (+49 more)

### Community 37 - "pause-fixtures.ts"
Cohesion: 0.05
Nodes (59): BackupOnSignal, LoopClass, Pausable, RecorderGlobals, DoesNotHold, EndsTheRun, IgnoresTheStop, StaysPaused (+51 more)

### Community 38 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (69): BlockEventSource, BodyExtrinsic, BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsedOptions, TransactionParser, ChainTransaction (+61 more)

### Community 39 - "FinalizedLoop"
Cohesion: 0.06
Nodes (19): Activity, FinalizedLoop, LoopObserver, Startup, SkipsLockstep, WaitingInRead, ItemsAfterWrite, CommitsDespiteLastWrite (+11 more)

### Community 4 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (156): BlockItemSource, InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ProcessStatus, Job, WorkerEvent (+148 more)

### Community 40 - "process-worker.ts"
Cohesion: 0.05
Nodes (54): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PgliteLockUse (+46 more)

### Community 41 - "Process"
Cohesion: 0.05
Nodes (22): BlockSource, ProcessReason, ReasonCode, Unwrapped, PauseHold, Process, SignalTarget, StatusFacts (+14 more)

### Community 42 - "module-tables.ts"
Cohesion: 0.07
Nodes (48): CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ConsistentRead, ColumnType (+40 more)

### Community 43 - "transport-faults.test.ts"
Cohesion: 0.06
Nodes (46): ResultColumn, Message, TestCertificates, Ended, rawClient, Escape, publicState, Refused (+38 more)

### Community 44 - "changes.property.test.ts"
Cohesion: 0.05
Nodes (60): CanonicalEncodingFailure, CanonicalValue, Op, States, TableName, Abort, CheckResult, Decoded (+52 more)

### Community 45 - "boundary.test.ts"
Cohesion: 0.07
Nodes (49): DesignTable, RowCoverage, ModuleReference, Finding, collationsWritten(), componentCode(), componentExports(), componentTexts() (+41 more)

### Community 46 - ".from"
Cohesion: 0.06
Nodes (36): SweepState, SweepTables, SweepWrites, NodeBatch, Block, MemoryTables, ModelBatch, ModelSnapshot (+28 more)

### Community 48 - "private/backends.ts"
Cohesion: 0.07
Nodes (37): PostgresParts, PrivateBackend, SessionSeen, A162Options, a162Run, HeaderSeen, A112Observation, Wiring (+29 more)

### Community 49 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (49): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+41 more)

### Community 5 - "fetch-fixtures.ts"
Cohesion: 0.03
Nodes (173): BlockParsed, NodeCallOptions, ProcessCondition, itemsSeen, BlockSpec, EventSpec, Json, Scenario (+165 more)

### Community 50 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (49): TransactionHistoryStorage, PgTransactionHistoryStorage, Added, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 5. WalletState envelope (+41 more)

### Community 51 - "NodeBlockSource"
Cohesion: 0.09
Nodes (15): HeadWait, NodeBlockSource, PreparedBlock, QueueRunner, NoWindow, OwnStateMetadata, Refetches, TrustsNotifications (+7 more)

### Community 52 - "loop-stop-harness.ts"
Cohesion: 0.08
Nodes (38): SourceShared, A169Observation, LoopStopScenario, Outage, SourceOf, A167Observation, CheckOf, NodeWatch (+30 more)

### Community 53 - "intake.test.ts"
Cohesion: 0.08
Nodes (43): PrivateProcess, PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation (+35 more)

### Community 54 - "builds.ts"
Cohesion: 0.07
Nodes (41): AdminStarter, A168RunOptions, PrivateRefusal, PublicCoreOptions, Pause, Q142Observation, InstancesOptions, instancesRun (+33 more)

### Community 55 - ".value"
Cohesion: 0.12
Nodes (30): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef (+22 more)

### Community 56 - "binding.test.ts"
Cohesion: 0.07
Nodes (44): PrivateIntakeOptions, startHashDecision, PglitePathParts, A165Options, a165Run, Attempt, TestDatabase, A113Observation (+36 more)

### Community 59 - "transform-checks.ts"
Cohesion: 0.10
Nodes (35): TransformError, NotificationRange, until(), baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape(), expectVariantOutput() (+27 more)

### Community 6 - "tape/index.ts"
Cohesion: 0.03
Nodes (143): Refusal, Failure, Variant, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command (+135 more)

### Community 60 - "cbor.ts"
Cohesion: 0.08
Nodes (44): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+36 more)

### Community 61 - "shadow-schema.test.ts"
Cohesion: 0.06
Nodes (29): CheckedMigration, Backend, Case, refuseNonDeterministic(), catalogRelations(), catalogTables(), schemaFilter(), tableId() (+21 more)

### Community 62 - "core-block-commit.test.ts"
Cohesion: 0.07
Nodes (38): BlockRow, StandInOptions, Commit, checkParent(), commitBlock(), hex(), sameBytes(), startOf() (+30 more)

### Community 63 - "change-capture.ts"
Cohesion: 0.07
Nodes (41): CaptureColumn, CaptureState, GuardTableRow, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule (+33 more)

### Community 64 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck (+40 more)

### Community 66 - "retirement.test.ts"
Cohesion: 0.06
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 67 - "file-mode.test.ts"
Cohesion: 0.06
Nodes (33): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+25 more)

### Community 69 - "checkShape"
Cohesion: 0.07
Nodes (38): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+30 more)

### Community 7 - "contract-data-checks.ts"
Cohesion: 0.03
Nodes (174): contractScenario, ContractScenarioOptions, LogLine, Program, Ran, ScenarioTx, handoff, HandoffAt (+166 more)

### Community 75 - "paused-harness.ts"
Cohesion: 0.10
Nodes (34): ProcessHandle, Validator, A176Options, Body, KeeperGlobals, PausedExpectation, Read, Reader (+26 more)

### Community 76 - "core-contract-logs-fast.ts"
Cohesion: 0.10
Nodes (34): ContractLog, CoreContractLogsFastOptions, FastLogReader, CoreContractLogsFullOptions, LogEventType, contractLogsItem(), contractLogsItemOf(), contractLogsMigrations() (+26 more)

### Community 77 - "page.ts"
Cohesion: 0.06
Nodes (32): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, Scope, CallMethod, FromProcessWorker (+24 more)

### Community 78 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.11
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), deriveUnshieldedSeed() (+19 more)

### Community 79 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (28): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle(), startTestDatabase() (+20 more)

### Community 8 - "admin-harness.ts"
Cohesion: 0.03
Nodes (145): AdminChannel, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, DatabaseParts, PostgresPartsInput, EngineConfig (+137 more)

### Community 80 - "chain-events-decode.test.ts"
Cohesion: 0.12
Nodes (29): Field, Registry, fill(), hexOf(), le(), merge(), metadataWith(), rotl() (+21 more)

### Community 81 - "validation.ts"
Cohesion: 0.06
Nodes (34): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+26 more)

### Community 82 - "lockstep-refusals.test.ts"
Cohesion: 0.10
Nodes (37): LockstepCondition, A118Observation, MismatchObservation, ExpectedWait, WaitSample, hashAt(), inMemoryBlock(), a77Problems() (+29 more)

### Community 89 - "browser.test.ts"
Cohesion: 0.09
Nodes (34): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+26 more)

### Community 9 - "loop.test.ts"
Cohesion: 0.03
Nodes (130): GraphInput, CommitOutcome, HeightFailure, HeldHeight, LockstepWait, LoopEnd, LoopInput, PastFaultCase (+122 more)

### Community 90 - "release-version.ts"
Cohesion: 0.12
Nodes (34): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+26 more)

### Community 91 - "core.ts"
Cohesion: 0.12
Nodes (26): BaselineLoad, Comparison, CommitOptions, PostgresRun, ManualOpts, TinybenchOpts, Backend, Baseline (+18 more)

### Community 92 - "core-digest.ts"
Cohesion: 0.10
Nodes (29): TableDigest, TableDigestRow, CapturedTable, ChangeKind, tableChanges, TouchedRow, capturedOf(), digestBlock() (+21 more)

### Community 93 - "node-bridge.ts"
Cohesion: 0.10
Nodes (20): ChildReader, Thread, BridgeServer, Growable, childRefKeys(), readChildren(), bridgeMemory(), decodeNodes() (+12 more)

### Community 94 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 95 - "browser/build.ts"
Cohesion: 0.08
Nodes (25): BrowserBuildOptions, checkedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+17 more)

### Community 99 - "node-fields-harness.ts"
Cohesion: 0.09
Nodes (25): A168Observation, A168Phase, Expected, GatedConnector, StatusReader, a(), a168Problems(), a168Run() (+17 more)

### Community 147 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.10
Nodes (19): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions (+11 more)

### Community 33 - "refused"
Cohesion: 0.03
Nodes (77): refused(), cursorRead(), following(), committedHeight(), database(), reason(), 00056 — A private process with no way to read the public data is refused only after its admin listener opens, Evidence (+69 more)

### Community 68 - "table"
Cohesion: 0.04
Nodes (42): table(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, 10. Ingest, 11. Chain data, 12. Ledger (+34 more)

### Community 103 - "transportReader"
Cohesion: 0.08
Nodes (27): text(), transportReader(), transportReaderRule(), 00055 — Settings that cannot take effect are accepted silently, or wait for ever, Evidence, Problem, Suggested fix, 00061 — The threat model's `path:line` citations drift as the code moves (+19 more)

### Community 133 - "T"
Cohesion: 0.09
Nodes (24): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get` (+16 more)

### Community 144 - "mapping.test.ts"
Cohesion: 0.11
Nodes (11): mapRows(), mapValue(), parseJsonLossless(), oid(), identity(), RESULT_COLUMNS, RFC-3339, 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug (+3 more)

### Community 146 - "UmbraDB module guide"
Cohesion: 0.09
Nodes (22): params(), 10. Ready-made tables: cursor and height-versioned, 11. Start and stop heights, 12. When a callback fails, 13. Providing items to other modules, 14. Private modules, 15. Migrations, 16. Upgrades (+14 more)

### Community 184 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 186 - "fault"
Cohesion: 0.14
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 190 - "scale-value.ts"
Cohesion: 0.19
Nodes (11): writeEventRows(), canonicalJson(), hexOf(), littleEndian(), insertEventRows(), BIT_STORES, INTEGERS, MAX_DEPTH (+3 more)

### Community 194 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 208 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 226 - "path.ts"
Cohesion: 0.28
Nodes (6): join(), normalize(), resolve(), delimiter, sep, 1. Library-mode guarantees

### Community 229 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 273 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 314 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 47 - "history"
Cohesion: 0.04
Nodes (56): history(), revision(), n(), Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate, Scenario: A call with an already-aborted signal is rejected before any database work, Scenario: A label given at save time is returned by history and load (+48 more)

### Community 57 - "code"
Cohesion: 0.04
Nodes (50): code(), Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log, The five stages (+42 more)

### Community 58 - ".put"
Cohesion: 0.04
Nodes (48): coreTxResultsOnParse(), "on-fetch"(), 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+40 more)

### Community 65 - "version"
Cohesion: 0.05
Nodes (44): side(), migrations(), version(), 1. Overview, Appendix A. Reference, 0. Project setup, 1. TemporalKV, 2. Sprint close-out (+36 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 85 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 96 - ".slowBlockMs"
Cohesion: 0.07
Nodes (29): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+21 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Current release campaign evidence (owner Q195, 2026-10-28), Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks (+21 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+21 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 128 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 131 - "The laws of UmbraDB's storage helpers"
Cohesion: 0.08
Nodes (20): Build commands, Build the package and install it, Building from source, Run from a clone, 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table), 4. The Lean model (+12 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 135 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 148 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 157 - "Boundaries, threats and controls"
Cohesion: 0.11
Nodes (19): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+11 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: LM-11 The browser demo runs on the engine, Requirement: LM-1 One in-process entry point, Requirement: LM-3 The network request, Requirement: LM-4 Handlers always exist, Requirement: LM-5 A standard service lifecycle, Requirement: LM-6 The private link over channels, Requirement: LM-7 User modules for the ledger worker (+10 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+9 more)

### Community 169 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 170 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 173 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 174 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 181 - "README.md"
Cohesion: 0.19
Nodes (6): Choosing a database, Launching it, stats-module, Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 182 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 183 - "UmbraDB"
Cohesion: 0.13
Nodes (15): Backup and restore, Check and run, Create a project, Example: loading `stats-module`, Install UmbraDB, Private processes, briefly, Project status, development and links, Quick start (browser) (+7 more)

### Community 185 - "Backups"
Cohesion: 0.14
Nodes (14): A backup at the core's stop, A backup of a running process (SIGUSR2), A paused loop on `/status`, A PGlite directory that does not exist, A private process and a changed public configuration, Backups, Checking a configuration against its database, Restoring a backup (+6 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 188 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 189 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.14
Nodes (13): MODIFIED Requirements, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable (+5 more)

### Community 196 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 198 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 199 - "Tasks — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 200 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 203 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.17
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 204 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 206 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 207 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 209 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 210 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 211 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 212 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Full-sync soak + load-under-prune (G10), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Postgres-kill mid-save + retry contract (G9 / T2) (+2 more)

### Community 215 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 216 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.20
Nodes (9): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Occurrence of 2026-10-28, task 17.5b's conformance gate, Problem, Suggested fix (+1 more)

### Community 217 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 218 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 219 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 220 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 221 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 227 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.22
Nodes (8): [0.10.0] - 2026-10-27, [0.9.5] - 2026-07-25 — "Penumbra", Added, Breaking changes, Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 228 - "try.sh"
Cohesion: 0.53
Nodes (8): bad(), block(), latest(), recent(), try.sh script, show(), status(), subscribe()

### Community 230 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 231 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 232 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 235 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 236 - "UmbraDB in a browser"
Cohesion: 0.25
Nodes (7): Backups and status, Build and serve, Differences from `umbradb run`, The configuration, The page's parameters, UmbraDB in a browser, What the default page runs

### Community 237 - "stats-module/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, allowImportingTsExtensions, paths, extends, include, umbradb, ../../tsconfig.json

### Community 238 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 239 - "MODIFIED Requirements"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy, Spec delta — `admin-endpoints` capability

### Community 240 - "Requirement: BK-1 Backup"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: BK-1 Backup, Scenario: A backup of a running PGlite process, Scenario: Backup while syncing, Scenario: No `pg_dump` on the machine, Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`, Spec delta — `backups` capability

### Community 241 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 243 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 244 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 245 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 246 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 247 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 248 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 249 - "Acceptance — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.1.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 250 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 251 - "Proposal — v1.1.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.1.0: Formal completion (`formal-completion`), What changes, Why

### Community 253 - "Midnight Foundation Security Policy"
Cohesion: 0.29
Nodes (7): Commit policy, Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Threat model, Vulnerability management

### Community 255 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 256 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 257 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 258 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.33
Nodes (5): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Problem, Resolution, Suggested fix

### Community 259 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 260 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 261 - "UmbraDB node architecture"
Cohesion: 0.33
Nodes (6): At each start, Best blocks: worked on early, never stored, Finalized heights: one transaction each, Private processes, UmbraDB node architecture, When something fails

### Community 262 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 263 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 264 - "Proposal — Sprint 4: Watermarks"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes, Why

### Community 265 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 266 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 267 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 268 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 269 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 270 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 271 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 272 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 274 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 275 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 276 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 277 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 278 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 279 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 280 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 281 - "00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time"
Cohesion: 0.40
Nodes (4): 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time, Evidence, Problem, Suggested fix

### Community 282 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 283 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 284 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 285 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 286 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 287 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 288 - "00041 — A128 refused once and A130 hung once under load, each passing in every other run"
Cohesion: 0.40
Nodes (4): 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 289 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.40
Nodes (4): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Suggested fix

### Community 290 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 291 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 292 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 293 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 294 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 295 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 296 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 297 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 298 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 299 - "00054 — A slow-block test hung inside PGlite for over an hour"
Cohesion: 0.40
Nodes (4): 00054 — A slow-block test hung inside PGlite for over an hour, Evidence, Problem, Suggested fix

### Community 300 - "00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented"
Cohesion: 0.40
Nodes (4): 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented, Evidence, Problem, Suggested fix

### Community 301 - "00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first"
Cohesion: 0.40
Nodes (4): 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first, Evidence, Problem, Suggested fix

### Community 302 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 303 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 304 - "MODIFIED Requirements"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: LS-1 The package exports exactly the new surface, Scenario: An extra export, Spec delta — `library-surface` capability

### Community 305 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 306 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 307 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 308 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 309 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 310 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 311 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 312 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 313 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 70 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 71 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 83 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-16 Chain-data reads name their view and height, Requirement: RN-1 The main program is a fixed sequence of points (+29 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 98 - "package.json"
Cohesion: 0.06
Nodes (32): bin, umbradb, bugs, url, description, optional, engines, node (+24 more)

## Knowledge Gaps
- **56 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-8949`, `RFC-8949` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3861 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `db/errors.ts`, `ModuleDeclaration`, `api-server.test.ts`, `validate.ts`, `InMemoryBlockSource`, `fetch-fixtures.ts`, `tape/index.ts`, `contract-data-checks.ts`, `admin-harness.ts`, `loop.test.ts`, `client.test.ts`, `adapter-fixtures.ts`, `backup/restore.ts`, `spawnChild`, `NodeClient`, `column-rules.ts`, `process-admin.ts`, `ledger/types.ts`, `config/history.ts`, `declaration.ts`, `core-ledger-state.ts`, `UmbraError`, `ref_node_fs`, `core-transport.ts`, `adapter.ts`, `loop.ts`, `builder.test.ts`, `LedgerPackage`, `ref_node_crypto`, `runner/process.ts`, `cli/command.ts`, `core-status.test.ts`, `config-check.ts`, `12. Ledger`, `roles.ts`, `pause-fixtures.ts`, `process-worker.ts`, `Process`, `module-tables.ts`, `transport-faults.test.ts`, `changes.property.test.ts`, `boundary.test.ts`, `.from`, `private/backends.ts`, `slow-block-harness.ts`, `loop-stop-harness.ts`, `intake.test.ts`, `builds.ts`, `binding.test.ts`, `transform-checks.ts`, `shadow-schema.test.ts`, `core-block-commit.test.ts`, `retirement.test.ts`, `file-mode.test.ts`, `cold-boot-recovery.integration.test.ts`, `test/postgres/setup.ts`, `chain-events-decode.test.ts`, `validation.ts`, `lockstep-refusals.test.ts`, `browser.test.ts`, `release-version.ts`, `core.ts`, `core-digest.ts`, `node-bridge.ts`, `browser/build.ts`, `package.json`, `node-fields-harness.ts`, `code-registry.ts`, `postgres/transaction-history-storage.ts`, `Lockstep`, `LoopPauses`, `documents.ts`, `pg-tx-history-adapter.ts`, `src/ledger/identity.ts`, `development-opt-in.test.ts`, `ledger-tapes.ts`, `read-gate.ts`, `crash.test.ts`, `config/plain-data.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `threat-model.test.ts`, `version-checks.ts`, `net.test.ts`, `networks.test.ts`, `ledger-table-config.test.ts`, `example-checks.ts`, `mapping.test.ts`, `block-fetch-decode.test.ts`, `node-source.ts`, `key-handling-checks.ts`, `zod`, `transaction-history-storage.property.test.ts`, `core-block-fetch.test.ts`, `excluded-not-exported.test.ts`, `text.test.ts`, `recovery.test.ts`, `resolver-boundary.ts`, `surface.test.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `read-height.property.test.ts`, `twox.ts`, `worker-threads.test.ts`, `ledger/plain-data.ts`, `postgres-image.test.ts`, `renamed-setting.test.ts`?**
  _High betweenness centrality (0.244) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 19 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `db/errors.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02072210659668808 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `db/errors.ts`, `ModuleDeclaration`, `api-server.test.ts`, `validate.ts`, `InMemoryBlockSource`, `fetch-fixtures.ts`, `PgliteDatabase`, `contract-data-checks.ts`, `admin-harness.ts`, `pglite-lock.ts`, `ledger/metadata.ts`, `client.test.ts`, `backup/restore.ts`, `version-checks.ts`, `NodeClient`, `ledger-table-config.test.ts`, `process-admin.ts`, `mapping.test.ts`, `vitest`, `config/history.ts`, `declaration.ts`, `core-ledger-state.ts`, `node-source.ts`, `ref_node_fs`, `version-table.ts`, `core-transport.ts`, `loop.ts`, `runner/process.ts`, `tape/index.ts`, `core-status.test.ts`, `refused`, `config-check.ts`, `12. Ledger`, `roles.ts`, `pause-fixtures.ts`, `FinalizedLoop`, `process-worker.ts`, `Process`, `module-tables.ts`, `transport-faults.test.ts`, `changes.property.test.ts`, `loop.test.ts`, `slow-block-harness.ts`, `NodeBlockSource`, `statementsOf`, `builds.ts`, `binding.test.ts`, `code`, `transform-checks.ts`, `cbor.ts`, `shadow-schema.test.ts`, `core-block-commit.test.ts`, `Session`, `graph.ts`, `checkShape`, `core-contract-logs-fast.ts`, `validation.ts`, `lockstep-refusals.test.ts`, `sha256`, `ledger/types.ts`, `browser/src/config/load.ts`, `BlockRef`, `src/ledger/identity.ts`, `mapping.ts`, `renamed-setting.test.ts`, `development-opt-in.test.ts`, `config/plain-data.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `ModuleDeclaration` be split into smaller, more focused modules?**
  _Cohesion score 0.021035992217898834 - nodes in this community are weakly interconnected._