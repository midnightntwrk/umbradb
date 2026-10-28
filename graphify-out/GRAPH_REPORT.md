# Graph Report - UmbraDB

## Corpus Check
- 1020 files · ~1,466,193 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10907 nodes · 32899 edges · 340 communities (308 shown, 32 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2555 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `a8866a9ae7fd0e6b` (1020 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- admin-harness.ts
- tape/index.ts
- backup/restore.ts
- core-block-commit.test.ts
- code-registry.ts
- src/ledger/identity.ts
- postgres/transaction-history-storage.ts
- paused-harness.ts
- migrate.ts
- PortSocket
- mapping.ts
- recovery.test.ts
- containers.test.ts
- restore-private.ts
- version-checks.ts
- node-fields-harness.ts
- Lockstep
- test/postgres/setup.ts
- crash.test.ts
- column-rules.ts
- net.test.ts
- interfaces/transaction-history-storage.ts
- documents.ts
- PrivateTransport
- check-required-tests.ts
- legacy-excluded.test.ts
- loop.ts
- read-gate.ts
- .concat
- compact
- threat-model.test.ts
- ws-mutual-tls.test.ts
- BlockItems
- node-bridge.ts
- InMemoryBlockSource
- database-fixtures.ts
- items.ts
- chain-events-decode.test.ts
- sweep.ts
- relays.ts
- transaction-history-storage.property.test.ts
- block-fetch-decode.test.ts
- NodeClient
- core-block-fetch/metadata.ts
- intake.test.ts
- lockstep-refusals.test.ts
- .value
- ledger-sweep.test.ts
- builder.test.ts
- worker-storage.test.ts
- chrome.ts
- InMemoryTransactionHistoryStorage
- childRefKeys
- fast-check
- range.test.ts
- version-table.ts
- ledger-table-config.test.ts
- LoopPauses
- shims.test.ts
- private/lockstep-wait.test.ts
- db/errors.ts
- read-height.property.test.ts
- Design — Sprint 1: project setup + TemporalKV
- statementsOf
- Process
- browser-harness.ts
- config/plain-data.test.ts
- roles.ts
- web-lock.ts
- upgrade-boundary.test.ts
- source-scan.ts
- no-indexer-or-wallet-sdk.test.ts
- fetch-fixtures.ts
- opt-out.test.ts
- extrinsics.ts
- history.property.test.ts
- component-table.test.ts
- worker-threads-worker.ts
- buffer.ts
- Worker
- db/api.ts
- .send
- cbor.ts
- Heartbeat
- ledger/plain-data.test.ts
- TapeAnswers
- sha256
- FinalizedLoop
- postgres-image.test.ts
- stats.ts
- devnet-upgrade.test.ts
- type-check.ts
- .#close
- worker-threads.test.ts
- core-block-parsed.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- adapter.ts
- ref_node_crypto
- pageBench
- 9.2 Browser build (BR)
- worker-threads-host.ts
- validate.test.ts
- vitest
- api-server.test.ts
- startProcess
- CoreTransport
- ingest-harness.ts
- PauseHold
- https.ts
- NodeFS
- builds.ts
- durability-probe.test.ts
- backup-fixtures.ts
- config-check.ts
- process-context.test.ts
- core-transport.ts
- validate.ts
- ref_node_timers
- client.test.ts
- spawnChild
- contract-modules.test.ts
- NodeBlockSource
- LedgerPackage
- refused-configuration.test.ts
- ReadHandle
- process-backends.ts
- ledger/types.ts
- contract-data-checks.ts
- transport-faults.test.ts
- adapter-fixtures.ts
- slow-block-harness.ts
- backup/backup.ts
- height-versioned.test.ts
- .from
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- range.ts
- UmbraError
- pause-fixtures.ts
- chain-process.test.ts
- cli/command.ts
- runner/process.ts
- launchPrivate
- ledger-state.test.ts
- binding.test.ts
- graph.ts
- BlockRef
- networks.ts
- process-worker.ts
- retirement.test.ts
- file-mode.test.ts
- PgTransactionHistoryStorage
- configured.ts
- checkShape
- durability-probe.ts
- ledger-tasks-checks.ts
- openPglite
- host.ts
- graph.test.ts
- page.ts
- checks.test.ts
- core-ledger-state.ts
- config/history.ts
- browser.test.ts
- pg-tx-history-adapter.ts
- TransactionHistoryStorage
- release-version.test.ts
- browser/build.ts
- ledger-storage.test.ts
- refused
- Design — Sprint 3: CheckpointStore
- cold-boot-recovery.integration.test.ts
- UmbraDB module guide
- .slowBlockMs
- boundary.test.ts
- mapping.test.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- T
- core-ledger-state.test.ts
- mutation-per-adapter.mjs
- .#open
- twox.ts
- Design — v1.1.0: Quint model checking
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- pack-install.mjs
- path.ts
- v9
- crash-worker.ts
- code
- history
- ADDED Requirements
- .put
- graph.py
- version
- ADDED Requirements
- Repository agent policy
- ADDED Requirements
- ADDED Requirements
- UmbraDB
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- Boundaries, threats and controls
- ADDED Requirements
- ADDED Requirements
- stryker.conf.json
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- compilerOptions
- ADDED Requirements
- Design — Sprint 4: Watermarks
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- Design — Sprint 2: Transaction/Lease
- explore.md
- UmbraDB software supply-chain directory
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- ADDED Requirements
- Tasks — Sprint 7: Transaction History Storage
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0-infosec-signoff
- Contributing
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- UmbraDB — project instructions
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
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
- 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- Problem
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
- graphify/run.sh
- build-in-container.sh
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
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json

## God Nodes (most connected - your core abstractions)
1. `vitest` - 345 edges
2. `UmbraError` - 306 edges
3. `ModuleDeclaration` - 174 edges
4. `FinalizedLoop` - 131 edges
5. `InMemoryBlockSource` - 116 edges
6. `NodeClient` - 113 edges
7. `Database` - 97 edges
8. `BlockRef` - 94 edges
9. `ReadHandle` - 85 edges
10. `NodeBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (340 total, 32 thin omitted)

### Community 0 - "admin-harness.ts"
Cohesion: 0.03
Nodes (161): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+153 more)

### Community 1 - "tape/index.ts"
Cohesion: 0.03
Nodes (116): Recorded, Failure, Variant, RecordingProblem, TapeError, TapeProblem, TransformError, TransformProblem (+108 more)

### Community 10 - "backup/restore.ts"
Cohesion: 0.03
Nodes (75): ConfiguredGenesis, PrivateBlockSource, PrivateChecks, PrivateShared, PrivateSourceOptions, SourceTransport, StartHashes, PublicConfiguration (+67 more)

### Community 101 - "core-block-commit.test.ts"
Cohesion: 0.08
Nodes (25): StandInOptions, Commit, Committed, blockFetchStandIn(), standInHeader(), standInItems(), a145Stored(), blockAt() (+17 more)

### Community 102 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 106 - "src/ledger/identity.ts"
Cohesion: 0.13
Nodes (26): ManifestLine, LedgerSource, LedgerSourceSettings, checkLedgerPackages(), text(), checkLedgerPackage(), checkLedgerPackages(), checkPackageFiles() (+18 more)

### Community 108 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (19): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+11 more)

### Community 109 - "paused-harness.ts"
Cohesion: 0.15
Nodes (25): ProcessHandle, Body, PausedExpectation, Read, Reader, Running, keepingPause(), pausedOf() (+17 more)

### Community 11 - "migrate.ts"
Cohesion: 0.04
Nodes (95): Transaction, CaptureColumn, CapturedTable, CaptureState, AppliedRow, Runnable, Settling, StartupInput (+87 more)

### Community 110 - "PortSocket"
Cohesion: 0.11
Nodes (11): Emitter, Frame, Listener, PortSocket, PortUpgrade, RawData, WebSocketServer, 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket (+3 more)

### Community 111 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 112 - "recovery.test.ts"
Cohesion: 0.11
Nodes (24): CommitOutcome, HeldHeight, Outcomes, AlwaysLanded, AlwaysLost, DropsHeld, Fault, Recorded (+16 more)

### Community 113 - "containers.test.ts"
Cohesion: 0.10
Nodes (21): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), guardPid(), watcherInput(), removeAttempt() (+13 more)

### Community 114 - "restore-private.ts"
Cohesion: 0.15
Nodes (23): BackupDatabase, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, emptied() (+15 more)

### Community 115 - "version-checks.ts"
Cohesion: 0.13
Nodes (20): MetadataNode, Boundary, CallRecord, CountingNode, MetadataSelector, Select, UpgradeCase, Walk (+12 more)

### Community 116 - "node-fields-harness.ts"
Cohesion: 0.10
Nodes (23): A168Observation, A168Phase, A168RunOptions, Expected, GatedConnector, StatusReader, a(), a168Run() (+15 more)

### Community 117 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 118 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 119 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+15 more)

### Community 12 - "column-rules.ts"
Cohesion: 0.02
Nodes (104): DumpInput, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+96 more)

### Community 120 - "net.test.ts"
Cohesion: 0.12
Nodes (15): NetworkBroker, IncomingMessage, Server, NetworkMessage, createServer(), connect(), listen(), pagePort() (+7 more)

### Community 121 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 123 - "documents.ts"
Cohesion: 0.12
Nodes (26): EngineeringRule, MarkdownLink, TextFile, agentsProblems(), changelogDocumentProblems(), descriptionProblems(), linkedPath(), linkProblems() (+18 more)

### Community 125 - "PrivateTransport"
Cohesion: 0.13
Nodes (8): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), reject(), resolve(), client()

### Community 126 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 127 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 13 - "loop.ts"
Cohesion: 0.04
Nodes (101): PointName, ProcessContext, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint (+93 more)

### Community 130 - "read-gate.ts"
Cohesion: 0.15
Nodes (23): readRefusal, ReadRefusalReason, refusedStatement, Token, Unreadable, foldAscii(), isDigit(), isRefusedName() (+15 more)

### Community 131 - ".concat"
Cohesion: 0.10
Nodes (14): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+6 more)

### Community 132 - "compact"
Cohesion: 0.21
Nodes (16): Field, Registry, metadataWith(), metadataV14(), midnightMetadata(), signedExtrinsic(), some(), text() (+8 more)

### Community 133 - "threat-model.test.ts"
Cohesion: 0.14
Nodes (23): Citation, citationProblems(), citations(), headingProblems(), headings(), knownGapProblems(), lineCountOf(), lineLengthProblems() (+15 more)

### Community 134 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 138 - "BlockItems"
Cohesion: 0.12
Nodes (12): QueuedBlock, ItemSink, BlockItems, LateUse, EagerItems, EagerLoop, KeptItems, KeptLoop (+4 more)

### Community 139 - "node-bridge.ts"
Cohesion: 0.13
Nodes (18): Thread, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes() (+10 more)

### Community 14 - "InMemoryBlockSource"
Cohesion: 0.04
Nodes (88): Bound, ReadOnlyDatabase, InMemoryBlockSource, LockstepWait, SlowWindow, KeeperGlobals, Contexts, Faults (+80 more)

### Community 140 - "database-fixtures.ts"
Cohesion: 0.09
Nodes (14): CheckTarget, CliBackend, Snapshot, blocksSql(), postgresCliBackend(), record(), rowsSql(), snapshotWith() (+6 more)

### Community 144 - "items.ts"
Cohesion: 0.13
Nodes (10): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, MetadataBlock, RuntimeMetadata, RuntimeMetadataEntry, contentStateOf(), hexOf() (+2 more)

### Community 145 - "chain-events-decode.test.ts"
Cohesion: 0.11
Nodes (20): MetadataField, MetadataType, Primitive, bindCoreChainEvents(), canonicalJson(), hexOf(), littleEndian(), fill() (+12 more)

### Community 146 - "sweep.ts"
Cohesion: 0.12
Nodes (13): GreyView, SweepPhase, SweepTables, byBytes(), BYTE_ORDER(), hexOf(), merged(), sweepStep() (+5 more)

### Community 147 - "relays.ts"
Cohesion: 0.13
Nodes (8): Report, HeldLink, HoldingRelay, ReportRelay, hostPort(), sendable(), typeOf(), RFC-6455

### Community 148 - "transaction-history-storage.property.test.ts"
Cohesion: 0.10
Nodes (18): EntryContent, Command, ReplayableStorage, isPlainObject(), mergeSections(), applyCommand(), replay(), arbitraryCommand (+10 more)

### Community 149 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 15 - "NodeClient"
Cohesion: 0.05
Nodes (68): CoreChainBinding, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter, NodeBlock (+60 more)

### Community 150 - "core-block-fetch/metadata.ts"
Cohesion: 0.27
Nodes (14): MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 151 - "intake.test.ts"
Cohesion: 0.17
Nodes (13): PrivateSeen, A114Observation, A116Observation, TestLink, a114Problems(), a114Run(), a116Problems(), follow() (+5 more)

### Community 153 - "lockstep-refusals.test.ts"
Cohesion: 0.18
Nodes (20): LockstepCondition, PublicCore, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn() (+12 more)

### Community 156 - ".value"
Cohesion: 0.26
Nodes (7): ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 158 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (12): SweepState, SweepWrites, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints(), compare() (+4 more)

### Community 16 - "builder.test.ts"
Cohesion: 0.03
Nodes (54): NodeRunResult, ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step (+46 more)

### Community 160 - "worker-storage.test.ts"
Cohesion: 0.16
Nodes (13): StoredNode, StagenetBlockJson, StagenetFixtureJson, Nodes, bytes(), at(), input(), rows() (+5 more)

### Community 161 - "chrome.ts"
Cohesion: 0.16
Nodes (14): Cdp, CdpEvent, ChromeBrowser, Download, PageRequest, chrome(), chrome(), chromePath() (+6 more)

### Community 163 - "InMemoryTransactionHistoryStorage"
Cohesion: 0.16
Nodes (7): MergeEntriesFn, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 166 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 169 - "fast-check"
Cohesion: 0.15
Nodes (13): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, FixtureRunOptions, releasesOf(), revisionsOf(), coreRevisionsOf() (+5 more)

### Community 17 - "range.test.ts"
Cohesion: 0.03
Nodes (69): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+61 more)

### Community 171 - "version-table.ts"
Cohesion: 0.21
Nodes (18): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+10 more)

### Community 172 - "ledger-table-config.test.ts"
Cohesion: 0.25
Nodes (17): Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts() (+9 more)

### Community 173 - "LoopPauses"
Cohesion: 0.16
Nodes (5): LoopPause, LoopPaused, LoopPauses, LoopPausesOptions, watched()

### Community 174 - "shims.test.ts"
Cohesion: 0.18
Nodes (9): databaseTarget, crossedError, StartRun, Buffer, Hash, hexOf(), jsonSafe(), createHash() (+1 more)

### Community 176 - "private/lockstep-wait.test.ts"
Cohesion: 0.20
Nodes (13): ExpectedWait, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf(), rowsIn(), sampleWait() (+5 more)

### Community 18 - "db/errors.ts"
Cohesion: 0.03
Nodes (65): ConfiguredDatabase, ConfiguredDatabaseOptions, ConfiguredDatabaseOptions, CommittedHeight, ReadOptions, ReadTimeoutSetting, Job, Outcome (+57 more)

### Community 180 - "read-height.property.test.ts"
Cohesion: 0.17
Nodes (11): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+3 more)

### Community 181 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (15): Key, Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`) (+7 more)

### Community 183 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 185 - "browser-harness.ts"
Cohesion: 0.32
Nodes (14): ProcessName, backupThrough(), byDeadline(), call(), eventsOf(), eventWhen(), logOf(), noAnswer() (+6 more)

### Community 189 - "config/plain-data.test.ts"
Cohesion: 0.16
Nodes (8): Row, failures(), refusal(), thrown(), valueOf(), A26, files, OTHERS

### Community 19 - "roles.ts"
Cohesion: 0.03
Nodes (75): MigrationPart, Difference, OwnPart, PlannedSchema, Provision, QualifiedTable, SchemaItem, SchemaMigration (+67 more)

### Community 190 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 194 - "upgrade-boundary.test.ts"
Cohesion: 0.21
Nodes (13): ProcessingEnd, RunObservation, A47Observation, Controls, Version, a47Problems(), a47Run(), big() (+5 more)

### Community 195 - "source-scan.ts"
Cohesion: 0.29
Nodes (13): ModuleReference, boundaryViolations(), codeFingerprints(), declaredNames(), eachNode(), lineOf(), literalText(), moduleReferences() (+5 more)

### Community 197 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 2 - "fetch-fixtures.ts"
Cohesion: 0.03
Nodes (142): NodeCallOptions, ProcessCondition, BlockSpec, EventSpec, Scenario, transactionSpec, RecordingClient, eventsRuntime (+134 more)

### Community 20 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (68): ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, ConsistentRead, ColumnType (+60 more)

### Community 203 - "extrinsics.ts"
Cohesion: 0.23
Nodes (9): ExtrinsicCall, MetadataPallet, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), decodeExtrinsics(), isCompactU64() (+1 more)

### Community 204 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 205 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 207 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 208 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 21 - "db/api.ts"
Cohesion: 0.04
Nodes (75): Database, SchemaWriteHandle, cursorTable, CursorTableOptions, CursorValue, Settings, TestBackend, TestDatabase (+67 more)

### Community 22 - "cbor.ts"
Cohesion: 0.04
Nodes (86): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+78 more)

### Community 222 - "Heartbeat"
Cohesion: 0.31
Nodes (5): Heartbeat, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 223 - "ledger/plain-data.test.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 224 - "TapeAnswers"
Cohesion: 0.35
Nodes (7): TapeAnswers, nodeRootAt(), expectTableHolds(), devnetOf(), bytesOf(), devnetUpgradeOf(), isCall()

### Community 226 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 23 - "FinalizedLoop"
Cohesion: 0.04
Nodes (27): Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, Startup, SkipsAfterReconnect, SkipsUnseen (+19 more)

### Community 234 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 235 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 24 - "devnet-upgrade.test.ts"
Cohesion: 0.05
Nodes (63): Asked, Side, FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable (+55 more)

### Community 241 - "type-check.ts"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 25 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (86): BlockEventSource, BodyExtrinsic, BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsed, BlockParsedOptions, ChainTransaction (+78 more)

### Community 256 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "adapter.ts"
Cohesion: 0.04
Nodes (74): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+66 more)

### Community 27 - "ref_node_crypto"
Cohesion: 0.04
Nodes (83): ChangeKind, tableChanges, TouchedRow, DigestRow, Op, States, TableName, digestBlock() (+75 more)

### Community 276 - "pageBench"
Cohesion: 0.40
Nodes (3): BrowserBuild, pageBench, PageServer

### Community 277 - "9.2 Browser build (BR)"
Cohesion: 0.40
Nodes (3): WebSocket, 9.2 Browser build (BR), 9. Backups and browser

### Community 278 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 28 - "validate.test.ts"
Cohesion: 0.03
Nodes (78): coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+70 more)

### Community 29 - "vitest"
Cohesion: 0.03
Nodes (54): Finding, Lockfile, Manifest, Upstream, Pem, Leftover, RemovedName, ReportedTest (+46 more)

### Community 3 - "api-server.test.ts"
Cohesion: 0.03
Nodes (107): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, ApiRegistry, Connection, HeadersArgument, ModuleApiServer (+99 more)

### Community 30 - "startProcess"
Cohesion: 0.05
Nodes (66): ChangedFile, GenesisFixture, installationCopy, PackageStartup, StartPackageProcess, ProcessDatabase, testBuild, A42Observation (+58 more)

### Community 31 - "ingest-harness.ts"
Cohesion: 0.05
Nodes (75): CrashEvent, CrashJob, ingest, IngestOptions, SourceClass, watched, retentionSeen, ledgerScenario (+67 more)

### Community 32 - "builds.ts"
Cohesion: 0.05
Nodes (55): PrivateBackend, SessionSeen, PrivateProcess, PrivateRefusal, A162Options, a162Run, HeaderSeen, Pause (+47 more)

### Community 33 - "durability-probe.test.ts"
Cohesion: 0.06
Nodes (61): BenchEnv, PostgresOptions, WriterProcess, WorkerEvent, PostgresTestDatabase, PauseReport, openPostgres(), allowWriterStart() (+53 more)

### Community 34 - "backup-fixtures.ts"
Cohesion: 0.07
Nodes (56): BackupBackend, killedRestore, TickerConfig, WORKER, SignalEvent, restoreCommand(), withNodeRoot(), catalogOf() (+48 more)

### Community 35 - "config-check.ts"
Cohesion: 0.04
Nodes (66): CheckFinding, CheckState, CheckStep, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState (+58 more)

### Community 36 - "process-context.test.ts"
Cohesion: 0.05
Nodes (45): Revision, EntryRange, ResolvedGraph, StartedModuleApi, LoopInput, MisuseListener, MisuseReports, ProcessContexts (+37 more)

### Community 37 - "core-transport.ts"
Cohesion: 0.04
Nodes (62): Session, TransportLimits, TransportTls, Committed, Hello, JsonValue, MessageFault, MessageType (+54 more)

### Community 38 - "validate.ts"
Cohesion: 0.04
Nodes (70): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, CheckedEntry, ConfigRule, CursorRule, Finding, Issue (+62 more)

### Community 39 - "ref_node_timers"
Cohesion: 0.05
Nodes (51): ConfigCheckReport, cliProject, RunningCommand, statsConfig, ProcessObservation, configText(), coreSettings(), emitDeclarations() (+43 more)

### Community 4 - "client.test.ts"
Cohesion: 0.02
Nodes (82): Connection, NodeClientOptions, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, HandSocket (+74 more)

### Community 40 - "spawnChild"
Cohesion: 0.04
Nodes (60): ParentJob, Kill, Orphaned, SourceFile, Run, WorkerEvent, LockResult, Report (+52 more)

### Community 41 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (59): ContractLog, BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, LogSite, Program, UnsureReason (+51 more)

### Community 42 - "NodeBlockSource"
Cohesion: 0.06
Nodes (24): HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeSubscription, PreparedBlock, QueueRunner, EventsRunner (+16 more)

### Community 43 - "LedgerPackage"
Cohesion: 0.08
Nodes (30): LedgerName, LedgerPackage, LedgerTaskBlock, StateHandle, Held, LedgerEngine, LedgerTaskFailed, stagenetReplay (+22 more)

### Community 44 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (62): ProcessConfig, Answered, Observation, Start, Refusal, Start, listenError(), startAdminServer() (+54 more)

### Community 45 - "ReadHandle"
Cohesion: 0.04
Nodes (44): ReadHandle, BlockHeader, FieldKind, FieldSchema, ItemDeclaration, Lifetime, PointCallbacks, RangeCheck (+36 more)

### Community 46 - "process-backends.ts"
Cohesion: 0.07
Nodes (44): A169Observation, LoopStopScenario, SourceOf, ProcessBackend, A167Observation, CheckOf, NodeWatch, PrivateObservation (+36 more)

### Community 47 - "ledger/types.ts"
Cohesion: 0.06
Nodes (48): LoadLedger, TransactionParser, LedgerReleasePackage, ApplyInput, LedgerPackageOptions, NodeBatch, ParsedTransaction, V9Logs (+40 more)

### Community 48 - "contract-data-checks.ts"
Cohesion: 0.08
Nodes (56): ContractStateRow, CoreContractStatesOptions, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+48 more)

### Community 49 - "transport-faults.test.ts"
Cohesion: 0.07
Nodes (45): Message, TestCertificates, Ended, rawClient, Escape, publicState, Refused, mutualTlsOptions() (+37 more)

### Community 5 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (115): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer, AdapterWorkerHost (+107 more)

### Community 50 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (51): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+43 more)

### Community 51 - "backup/backup.ts"
Cohesion: 0.08
Nodes (53): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+45 more)

### Community 52 - "height-versioned.test.ts"
Cohesion: 0.07
Nodes (39): BlockWriteHandle, heightVersionedTable, HeightVersionedTableOptions, VersionedValue, BlockContext, Migration, Control, StoredVersion (+31 more)

### Community 53 - ".from"
Cohesion: 0.08
Nodes (53): FixtureRun, TableSnapshot, startLedgerWorker(), hex(), hex(), refusalHalt(), refusalHeight(), runFixture() (+45 more)

### Community 54 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.05
Nodes (47): RestoreChain, BackupText, createReadStream(), backupAtStop(), firstLine(), ownerOnlyFile(), hex(), checkBeforeLoading() (+39 more)

### Community 55 - "range.ts"
Cohesion: 0.06
Nodes (51): BoundaryBlockReading, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange, Final, Height (+43 more)

### Community 56 - "UmbraError"
Cohesion: 0.07
Nodes (23): LoadedConfig, LoadOptions, PostgresOptions, JobQueue, PgliteDatabase, BoundedRead, Session, UmbraError (+15 more)

### Community 57 - "pause-fixtures.ts"
Cohesion: 0.06
Nodes (38): BackupSignals, TickerOptions, BackupOnSignal, LoopClass, Pausable, PausableConfig, PausableOptions, RecorderGlobals (+30 more)

### Community 58 - "chain-process.test.ts"
Cohesion: 0.06
Nodes (40): Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+32 more)

### Community 59 - "cli/command.ts"
Cohesion: 0.07
Nodes (39): RestoreSeams, BackupOutcome, CommandHandler, CommandIo, MainProcess, commandTarget, Chain, RestoreCommandOptions (+31 more)

### Community 6 - "runner/process.ts"
Cohesion: 0.02
Nodes (102): ConfigFacts, OpenedFacts, AdminStarter, BlockItemSource, ChainCheck, ChainCheckInput, ChainSource, CoreChainFacts (+94 more)

### Community 60 - "launchPrivate"
Cohesion: 0.09
Nodes (42): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A155Observation, Outcome, a113Run(), a156Run() (+34 more)

### Community 61 - "ledger-state.test.ts"
Cohesion: 0.09
Nodes (43): Call, SeenLoad, LedgerTx, a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows() (+35 more)

### Community 62 - "binding.test.ts"
Cohesion: 0.07
Nodes (40): PrivateIntakeOptions, startHashDecision, A165Options, a165Run, Attempt, TestDatabase, A113Observation, A156Observation (+32 more)

### Community 63 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeFacts, Spanned (+39 more)

### Community 64 - "BlockRef"
Cohesion: 0.07
Nodes (17): BlockRef, InMemoryItems, InMemorySourceOptions, Wait, Fetching, Recorder, LateRedelivery, bindCoreBlockFetch() (+9 more)

### Community 65 - "networks.ts"
Cohesion: 0.06
Nodes (43): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+35 more)

### Community 66 - "process-worker.ts"
Cohesion: 0.07
Nodes (35): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, messageAdmin(), core(), databaseOf(), withDevelopmentOptIn() (+27 more)

### Community 67 - "retirement.test.ts"
Cohesion: 0.07
Nodes (42): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+34 more)

### Community 68 - "file-mode.test.ts"
Cohesion: 0.07
Nodes (31): TickerProcess, Place, After, ModeObservation, ModeOracleOptions, ModeWatch, PgDumpRun, PgDumpWatch (+23 more)

### Community 69 - "PgTransactionHistoryStorage"
Cohesion: 0.08
Nodes (33): TransactionHistoryEntry, PgTransactionHistoryStorage, rowToEntry(), referenceMergeEntries(), Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built), 5. WalletState envelope (+25 more)

### Community 7 - "configured.ts"
Cohesion: 0.04
Nodes (116): OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, DigestRow, ModuleFacts (+108 more)

### Community 73 - "checkShape"
Cohesion: 0.08
Nodes (34): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+26 more)

### Community 74 - "durability-probe.ts"
Cohesion: 0.07
Nodes (26): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, ReadPool, Writer, WriterStart, assertNoTransactionPooler() (+18 more)

### Community 76 - "ledger-tasks-checks.ts"
Cohesion: 0.10
Nodes (34): TasksRun, CallArgsItem, CallArguments, taskSeen, V9Raw, countMainThreadParses(), plainWatchModule(), runTasks() (+26 more)

### Community 77 - "openPglite"
Cohesion: 0.08
Nodes (32): Held, PgliteLockUse, Job, Job, open(), pgliteNeedsDevelopmentOptIn(), acquirePgliteLock(), directoryPath() (+24 more)

### Community 8 - "host.ts"
Cohesion: 0.03
Nodes (96): LedgerStateItem, RetainedState, ApplyOutput, ChainOutcome, LedgerTask, StateSummary, AppliedState, ApplyBlock (+88 more)

### Community 81 - "graph.test.ts"
Cohesion: 0.09
Nodes (37): GraphInput, PastFaultCase, RefusalCase, resolveGraph(), reader(), backboneWithout(), blockItem(), consumer() (+29 more)

### Community 82 - "page.ts"
Cohesion: 0.06
Nodes (32): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, Scope, CallMethod, FromProcessWorker (+24 more)

### Community 84 - "checks.test.ts"
Cohesion: 0.07
Nodes (26): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, integer() (+18 more)

### Community 88 - "core-ledger-state.ts"
Cohesion: 0.08
Nodes (34): BlockLedgerSource, LedgerBinding, applyBlock(), boundLedger(), bytesOf(), contractsOf(), deployedBelow(), hex() (+26 more)

### Community 9 - "config/history.ts"
Cohesion: 0.04
Nodes (120): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreSettings, versionEntry, ConfigHashRow, HistoryCheck, HistoryCode (+112 more)

### Community 92 - "browser.test.ts"
Cohesion: 0.09
Nodes (34): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+26 more)

### Community 93 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (25): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys(), describeStatusValue() (+17 more)

### Community 94 - "TransactionHistoryStorage"
Cohesion: 0.07
Nodes (32): TransactionHistoryStorage, reason(), [0.9.5] - 2026-07-25 — "Penumbra", Added, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), 1. Schema, 2. Dependency direction: structural mirror, not a runtime import (+24 more)

### Community 95 - "release-version.test.ts"
Cohesion: 0.11
Nodes (33): FoundDeclaration, SourceText, Lock, changelogProblems(), declarationProblems(), idOf(), importedFile(), isDeclaration() (+25 more)

### Community 96 - "browser/build.ts"
Cohesion: 0.08
Nodes (25): BrowserBuildOptions, BrowserControl, CheckedLedgers, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles() (+17 more)

### Community 99 - "ledger-storage.test.ts"
Cohesion: 0.13
Nodes (29): RestartEvent, RestartJob, retainedStatesOf(), a100Problems(), a102Problems(), a104KeyProblems(), a104Scenario(), bytesOf() (+21 more)

### Community 103 - "refused"
Cohesion: 0.07
Nodes (28): refused(), A paused loop on `/status`, A private process and a changed public configuration, The database, The node on `/status`, UmbraDB operator guide, 7. Storage helpers, 11. Refusals and halts (IN-12) (+20 more)

### Community 155 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.10
Nodes (19): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 4. `load` — full verification, no exceptions (+11 more)

### Community 104 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.13
Nodes (19): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), registerSuiteLifecycle(), startTestDatabase(), registerSuiteLifecycle(), startTestDatabase() (+11 more)

### Community 107 - "UmbraDB module guide"
Cohesion: 0.06
Nodes (30): migrations(), Contract states and contract logs, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Private modules, Reading through `db` (+22 more)

### Community 142 - ".slowBlockMs"
Cohesion: 0.10
Nodes (20): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+12 more)

### Community 152 - "boundary.test.ts"
Cohesion: 0.19
Nodes (19): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+11 more)

### Community 154 - "mapping.test.ts"
Cohesion: 0.12
Nodes (10): mapValue(), parseJsonLossless(), oid(), identity(), RESULT_COLUMNS, RFC-3339, 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence (+2 more)

### Community 164 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (17): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+9 more)

### Community 167 - "T"
Cohesion: 0.12
Nodes (18): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, Scenario: Version and timestamp addressing agree, 3. `get`, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape (+10 more)

### Community 170 - "core-ledger-state.test.ts"
Cohesion: 0.12
Nodes (12): bindLedgerParser(), boundLedgerParser(), bindCoreLedgerState(), itemsOf(), writeBlock(), applied(), bound(), query() (+4 more)

### Community 187 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 188 - ".#open"
Cohesion: 0.26
Nodes (3): messageOf(), namedStartDb(), nodeSignals()

### Community 196 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 202 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.15
Nodes (12): clock(), 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable (+4 more)

### Community 210 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 217 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 225 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 242 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 263 - "v9"
Cohesion: 0.47
Nodes (5): v9(), 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 316 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 70 - "code"
Cohesion: 0.05
Nodes (43): code(), Acceptance — v1.0.0 API Surface & Release Contract, G1 — Public API surface, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G3 — Frozen, cleaned error catalog, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in) (+35 more)

### Community 72 - "history"
Cohesion: 0.06
Nodes (41): history(), Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate, Scenario: A call with an already-aborted signal is rejected before any database work, Scenario: A label given at save time is returned by history and load, Scenario: A signal aborting after the call has begun does not interrupt it, Scenario: byteLength, chunkCount, and createdAt reflect the saved payload (+33 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): up(), name, 4. G4 — The contract doc set (all *true*), ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition (+32 more)

### Community 79 - ".put"
Cohesion: 0.05
Nodes (37): "on-fetch"(), Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level, Scenario: Sequential puts to the same key in separate transactions succeed, outside the millisecond-collision caveat, Scenario: Sequential unconditional writes produce consecutive versions, Scenario: The CAS-guarded and unconditional paths agree on version assignment, Impact (+29 more)

### Community 89 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 90 - "version"
Cohesion: 0.06
Nodes (35): version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Scenario: The kv_current HOT ratio is measured and recorded under the soak workload, Scenario: The kv_current table reports fillfactor=90 after migration (+27 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+24 more)

### Community 105 - "Repository agent policy"
Cohesion: 0.06
Nodes (25): Bounded review, Engineering rules, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes (+17 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 128 - "UmbraDB"
Cohesion: 0.07
Nodes (24): [0.10.0] - 2026-10-27, Added, Breaking changes, Changelog, [Unreleased], 1. Status of each law, 2. T5 — versions over heights (the height-versioned table), 3. W1 — last write wins (the cursor table) (+16 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: the batching fixes preserve save/history behavior exactly (equivalence) (+16 more)

### Community 137 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 141 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 157 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 162 - "Boundaries, threats and controls"
Cohesion: 0.10
Nodes (17): 10. Dependency producers and build pipeline → installed code, 1. Operator files and module code → process, 2. Midnight node → public process, 3. Runner and modules → PostgreSQL 18 or PGlite, 4. Main thread ↔ ledger worker, 5. Module API readers → process, 6. Admin callers → admin worker, 7. Public process/database ↔ private process (+9 more)

### Community 165 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 175 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 177 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 178 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 179 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 182 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 186 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 191 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 192 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 198 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.15
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+5 more)

### Community 199 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 200 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 201 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 206 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 211 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 212 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 2. `set`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 213 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 5. Full-sync soak + load-under-concurrent-prune (G10), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring (+3 more)

### Community 215 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 216 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 218 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 219 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 220 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 221 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.18
Nodes (10): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 4. Wiring `PgTemporalKV`'s `opts.tx`, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure (+2 more)

### Community 227 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 228 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 229 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 230 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 231 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 232 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 233 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 236 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.22
Nodes (8): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Evidence, Further occurrences, Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again"), Problem, Suggested fix, Suggested fix

### Community 237 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 238 - "Tasks — Sprint 7: Transaction History Storage"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest, 3. PgTransactionHistoryStorage implementation, 4. WalletState envelope, 5. Storage-swappable conformance harness (Pg-only tier — required merge gate), 6. Live-sync tier (nightly/labeled — blocked on design.md §7's open question), 7. Close-out, Tasks — Sprint 7: Transaction History Storage

### Community 239 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 2. Envelope module (Pg-only — required gate), 4. Pg-only conformance suite (required merge gate) — `test:conformance`, 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 240 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 243 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 244 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 247 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 248 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 249 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 250 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 251 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 252 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 253 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 254 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 255 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 258 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 259 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 260 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 261 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 262 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 264 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 265 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 266 - "Proposal — Sprint 4: Watermarks"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes, Why

### Community 267 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 268 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 269 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 270 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 271 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 272 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 273 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 274 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 275 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 279 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 280 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 281 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 282 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 283 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 284 - "00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond"
Cohesion: 0.40
Nodes (4): 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix

### Community 285 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 286 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 287 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 288 - "Problem"
Cohesion: 0.40
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 289 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 290 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 291 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 292 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 293 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 294 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 295 - "00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true"
Cohesion: 0.40
Nodes (4): 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true, Evidence, Problem, Suggested fix

### Community 296 - "00045 — Mutual TLS does not bind a certificate to an instance id"
Cohesion: 0.40
Nodes (4): 00045 — Mutual TLS does not bind a certificate to an instance id, Evidence, Problem, Suggested fix

### Community 297 - "00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy"
Cohesion: 0.40
Nodes (4): 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy, Evidence, Problem, Suggested fix

### Community 298 - "00047 — Resource limits are per message or connection, not per service"
Cohesion: 0.40
Nodes (4): 00047 — Resource limits are per message or connection, not per service, Evidence, Problem, Suggested fix

### Community 299 - "00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance"
Cohesion: 0.40
Nodes (4): 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance, Evidence, Problem, Suggested fix

### Community 300 - "00049 — A141's "within 2 s" on PostgreSQL fails once under load"
Cohesion: 0.40
Nodes (4): 00049 — A141's "within 2 s" on PostgreSQL fails once under load, Evidence, Problem, Suggested fix

### Community 301 - "00050 — A165's race step on PostgreSQL with a transport failed once under load"
Cohesion: 0.40
Nodes (4): 00050 — A165's race step on PostgreSQL with a transport failed once under load, Evidence, Problem, Suggested fix

### Community 302 - "00051 — The transport's instance id is any text: line breaks reach the core's log"
Cohesion: 0.40
Nodes (4): 00051 — The transport's instance id is any text: line breaks reach the core's log, Evidence, Problem, Suggested fix

### Community 303 - "00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents"
Cohesion: 0.40
Nodes (4): 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents, Evidence, Problem, Suggested fix

### Community 304 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 305 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 307 - "manifest.json"
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

### Community 313 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 314 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 71 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+32 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 86 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+25 more)

### Community 98 - "package.json"
Cohesion: 0.06
Nodes (33): bin, umbradb, bugs, url, description, optional, engines, node (+25 more)

## Knowledge Gaps
- **55 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3632 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `admin-harness.ts`, `tape/index.ts`, `fetch-fixtures.ts`, `api-server.test.ts`, `client.test.ts`, `adapter-fixtures.ts`, `runner/process.ts`, `configured.ts`, `host.ts`, `config/history.ts`, `backup/restore.ts`, `migrate.ts`, `column-rules.ts`, `loop.ts`, `InMemoryBlockSource`, `NodeClient`, `builder.test.ts`, `range.test.ts`, `db/errors.ts`, `roles.ts`, `opt-out.test.ts`, `db/api.ts`, `cbor.ts`, `devnet-upgrade.test.ts`, `core-block-parsed.ts`, `adapter.ts`, `ref_node_crypto`, `validate.test.ts`, `startProcess`, `ingest-harness.ts`, `builds.ts`, `durability-probe.test.ts`, `backup-fixtures.ts`, `config-check.ts`, `process-context.test.ts`, `core-transport.ts`, `validate.ts`, `ref_node_timers`, `spawnChild`, `contract-modules.test.ts`, `NodeBlockSource`, `refused-configuration.test.ts`, `ReadHandle`, `process-backends.ts`, `ledger/types.ts`, `contract-data-checks.ts`, `transport-faults.test.ts`, `slow-block-harness.ts`, `backup/backup.ts`, `height-versioned.test.ts`, `.from`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `pause-fixtures.ts`, `chain-process.test.ts`, `cli/command.ts`, `launchPrivate`, `ledger-state.test.ts`, `binding.test.ts`, `BlockRef`, `networks.ts`, `retirement.test.ts`, `file-mode.test.ts`, `ledger-tasks-checks.ts`, `openPglite`, `graph.test.ts`, `checks.test.ts`, `core-ledger-state.ts`, `browser.test.ts`, `pg-tx-history-adapter.ts`, `release-version.test.ts`, `browser/build.ts`, `package.json`, `ledger-storage.test.ts`, `core-block-commit.test.ts`, `code-registry.ts`, `cold-boot-recovery.integration.test.ts`, `src/ledger/identity.ts`, `postgres/transaction-history-storage.ts`, `recovery.test.ts`, `containers.test.ts`, `restore-private.ts`, `version-checks.ts`, `Lockstep`, `test/postgres/setup.ts`, `crash.test.ts`, `net.test.ts`, `documents.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `read-gate.ts`, `threat-model.test.ts`, `ws-mutual-tls.test.ts`, `BlockItems`, `node-bridge.ts`, `database-fixtures.ts`, `chain-events-decode.test.ts`, `transaction-history-storage.property.test.ts`, `block-fetch-decode.test.ts`, `intake.test.ts`, `boundary.test.ts`, `lockstep-refusals.test.ts`, `mapping.test.ts`, `ledger-sweep.test.ts`, `worker-storage.test.ts`, `fast-check`, `core-ledger-state.test.ts`, `ledger-table-config.test.ts`, `LoopPauses`, `shims.test.ts`, `private/lockstep-wait.test.ts`, `read-height.property.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `config/plain-data.test.ts`, `web-lock.ts`, `excluded-not-exported.test.ts`, `upgrade-boundary.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `history.property.test.ts`, `component-table.test.ts`, `facade-merge-loader.ts`, `Heartbeat`, `ledger/plain-data.test.ts`, `postgres-image.test.ts`, `worker-threads.test.ts`?**
  _High betweenness centrality (0.225) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `UmbraError` (e.g. with `Engineering rules` and `The ledger state`) actually correct?**
  _`UmbraError` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.025301157849596505 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `admin-harness.ts`, `tape/index.ts`, `fetch-fixtures.ts`, `api-server.test.ts`, `client.test.ts`, `runner/process.ts`, `configured.ts`, `host.ts`, `config/history.ts`, `backup/restore.ts`, `migrate.ts`, `loop.ts`, `InMemoryBlockSource`, `NodeClient`, `db/errors.ts`, `roles.ts`, `opt-out.test.ts`, `db/api.ts`, `cbor.ts`, `FinalizedLoop`, `ref_node_crypto`, `validate.test.ts`, `vitest`, `ingest-harness.ts`, `durability-probe.test.ts`, `config-check.ts`, `process-context.test.ts`, `core-transport.ts`, `validate.ts`, `ref_node_timers`, `contract-modules.test.ts`, `NodeBlockSource`, `refused-configuration.test.ts`, `ReadHandle`, `transport-faults.test.ts`, `slow-block-harness.ts`, `backup/backup.ts`, `height-versioned.test.ts`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `range.ts`, `pause-fixtures.ts`, `chain-process.test.ts`, `cli/command.ts`, `launchPrivate`, `ledger-state.test.ts`, `binding.test.ts`, `graph.ts`, `BlockRef`, `process-worker.ts`, `checkShape`, `durability-probe.ts`, `ledger-tasks-checks.ts`, `openPglite`, `graph.test.ts`, `checks.test.ts`, `core-ledger-state.ts`, `core-block-commit.test.ts`, `refused`, `Repository agent policy`, `src/ledger/identity.ts`, `UmbraDB module guide`, `mapping.ts`, `recovery.test.ts`, `version-checks.ts`, `PrivateTransport`, `items.ts`, `lockstep-refusals.test.ts`, `mapping.test.ts`, `core-ledger-state.test.ts`, `version-table.ts`, `ledger-table-config.test.ts`, `shims.test.ts`, `statementsOf`, `config/plain-data.test.ts`, `web-lock.ts`, `upgrade-boundary.test.ts`, `sha256`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `tape/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03359488520778843 - nodes in this community are weakly interconnected._