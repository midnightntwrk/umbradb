# Graph Report - UmbraDB

## Corpus Check
- 980 files · ~1,448,877 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10435 nodes · 30234 edges · 345 communities (310 shown, 35 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2443 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `4858df6d746973d3` (980 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- client.test.ts
- migrate.ts
- tape/index.ts
- postgres/transaction-history-storage.ts
- code-registry.ts
- TransactionHistoryEntry
- browser/build.ts
- mapping.ts
- ledger-sweep.test.ts
- Lockstep
- fetch-fixtures.ts
- test/postgres/setup.ts
- crash.test.ts
- net.test.ts
- interfaces/transaction-history-storage.ts
- routes.ts
- private/lockstep-wait.test.ts
- lockstep-refusals.test.ts
- NodeClient
- check-required-tests.ts
- legacy-excluded.test.ts
- PrivateTransport
- BlockContext
- order.property.test.ts
- 5.1 Layer A: per-key temporal history
- sweep.ts
- node-bridge.ts
- type-check.ts
- items.ts
- block-fetch-decode.test.ts
- core-block-fetch/metadata.ts
- .value
- process-build.ts
- version-table.ts
- transaction-history-storage.property.test.ts
- opt-out.test.ts
- source-scan.ts
- FakeNode
- admin-harness.ts
- retention.ts
- statementsOf
- package-identity.test.ts
- InMemoryBlockSource
- ChromeTab
- lockstep-reads.test.ts
- Buffer
- ws-mutual-tls.test.ts
- checkShape
- browser-harness.ts
- adapter.ts
- chrome.ts
- database-fixtures.ts
- transport-intake.test.ts
- config-hash-checks.ts
- TapeBuilder
- ws.ts
- vitest
- PortSocket
- worker-threads.test.ts
- history.property.test.ts
- UmbraError
- FinalizedLoop
- component-table.test.ts
- RawClient
- worker-threads-worker.ts
- buffer.ts
- Worker
- intake.test.ts
- declaration.ts
- sha256
- cbor.ts
- attempt
- extrinsics.ts
- ledger-storage.test.ts
- scale-value.ts
- ProcessItems
- stats.ts
- page-server.ts
- node-format.ts
- checkParent
- validate.ts
- validation.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- runner/process.ts
- adapter-fixtures.ts
- core-block-parsed.ts
- config/history.ts
- spawnChild
- core-transport.ts
- https.ts
- PageState
- NodeFS
- ModuleDeclaration
- TickerProcess
- cli/command.ts
- backup-fixtures.ts
- ledger/types.ts
- contract-modules.test.ts
- PgTransactionHistoryStorage
- loop.ts
- api-server.test.ts
- height-versioned.test.ts
- backup/backup.ts
- range.ts
- process-admin.ts
- format.test.ts
- .from
- ReadHandle
- NodeBlockSource
- chain-process.test.ts
- builds.ts
- ref_node_crypto
- chain-placement.test.ts
- LedgerPackage
- pglite-queue.test.ts
- Process
- process-worker.ts
- contract-data-checks.ts
- slow-block-harness.ts
- TapeRecord
- backup/restore.ts
- transform-checks.ts
- loggingModule
- ref_node_timers
- BlockRef
- state-trees.test.ts
- serve.test.ts
- core-settings.ts
- post-block-update-checks.ts
- db/api.ts
- retirement.test.ts
- determinism-checks.ts
- .concat
- cursor-harness.ts
- process-context.test.ts
- graph.ts
- version-checks.ts
- column-rules.ts
- sweep-tapes.ts
- checks.test.ts
- process.test.ts
- pg-tx-history-adapter.ts
- transport-faults.test.ts
- worker-host.test.ts
- src/db/postgres.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- core-ledger-state.ts
- restore-private.ts
- networks.ts
- Design — Sprint 1: project setup + TemporalKV
- browser.test.ts
- page.ts
- ADDED Requirements
- .position
- restoreBackup
- code
- decode
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- .boolean
- boundary.test.ts
- migrations
- mapping.test.ts
- .slowBlockMs
- mutation-per-adapter.mjs
- core-ledger-state.test.ts
- twox.ts
- UmbraDB third-party component inventory (SBOM)
- midnight-env — reproducible PREPROD dev environment
- test-processes.test.ts
- path.ts
- Performance — design
- parseJsonLossless
- Requirement: CF-4 Every field is data, operational or secret
- orphan-watcher.mjs
- crash-worker.ts
- leanProblems
- .put
- fn
- history
- version
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- graph.py
- ADDED Requirements
- cold-boot-recovery.integration.test.ts
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- ADDED Requirements
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB
- stryker.conf.json
- README.md
- chain_archive lineage
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- ROADMAP.md
- Storage Layer Interface Specification
- Roadmap
- ADDED Requirements
- UmbraDB module guide
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Design — v1.0.0 API Surface & Release Contract
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- Design — Sprint 4: Watermarks
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- explore.md
- Full-Chain Storage
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- Security policy & threat model
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- Tasks — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- Checkpoint-store composition contract — cursor ordering and replay
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Storage Algebra Lean M3a Watermarks Sprint
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- UmbraDB Durability Contract
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- Proposal — Sprint 1: project setup + TemporalKV
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0 API Surface & Release Contract
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- Vendored ledger builds
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- bug-report.md
- feature-request.md
- Requirement: RN-16 Chain-data reads name their view and height
- GC architecture and query-tracing: research findings
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- peerDependenciesMeta
- repository
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- engines
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 302 edges
2. `UmbraError` - 295 edges
3. `ModuleDeclaration` - 161 edges
4. `FinalizedLoop` - 118 edges
5. `InMemoryBlockSource` - 101 edges
6. `NodeClient` - 100 edges
7. `Database` - 97 edges
8. `BlockRef` - 93 edges
9. `ReadHandle` - 84 edges
10. `5. Runner` - 75 edges

## Surprising Connections (you probably didn't know these)
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `Review notes` --references--> `JsonValue`  [INFERRED]
  design/design-interfaces.md → src/private/messages.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (345 total, 35 thin omitted)

### Community 0 - "client.test.ts"
Cohesion: 0.02
Nodes (124): NodeCallOptions, RecordingClient, Answer, Handler, Received, recorded, ManualTimers, ConnectionFrames (+116 more)

### Community 1 - "migrate.ts"
Cohesion: 0.03
Nodes (126): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference (+118 more)

### Community 10 - "tape/index.ts"
Cohesion: 0.04
Nodes (78): Failure, Variant, Link, TapeBuilderOptions, RecordingProblem, TapeProblem, TransformProblem, readRequest (+70 more)

### Community 101 - "postgres/transaction-history-storage.ts"
Cohesion: 0.09
Nodes (21): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+13 more)

### Community 102 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 103 - "TransactionHistoryEntry"
Cohesion: 0.12
Nodes (17): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), abortErrorLike() (+9 more)

### Community 104 - "browser/build.ts"
Cohesion: 0.09
Nodes (24): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+16 more)

### Community 107 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 108 - "ledger-sweep.test.ts"
Cohesion: 0.14
Nodes (15): SweepState, SweepWrites, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel, sweepReset() (+7 more)

### Community 109 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 11 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (98): ProcessCondition, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded, FetchSeen (+90 more)

### Community 110 - "test/postgres/setup.ts"
Cohesion: 0.10
Nodes (22): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker() (+14 more)

### Community 111 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+15 more)

### Community 112 - "net.test.ts"
Cohesion: 0.12
Nodes (15): NetworkBroker, IncomingMessage, Server, NetworkMessage, WebSocket, createServer(), connect(), listen() (+7 more)

### Community 113 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 115 - "routes.ts"
Cohesion: 0.14
Nodes (18): adminRoutes, AdminEndpoint, AdminPart, AdminView, ReadinessFacts, frozenMap(), readinessOf(), ADMIN_PARTS (+10 more)

### Community 116 - "private/lockstep-wait.test.ts"
Cohesion: 0.12
Nodes (18): Report, ExpectedWait, ReportRelay, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf() (+10 more)

### Community 119 - "lockstep-refusals.test.ts"
Cohesion: 0.15
Nodes (25): LockstepCondition, A118Observation, MismatchObservation, WaitSample, privateCursorHeight(), bindingIn(), createdIn(), rowsIn() (+17 more)

### Community 12 - "NodeClient"
Cohesion: 0.05
Nodes (70): CoreChainBinding, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription (+62 more)

### Community 120 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 121 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 125 - "PrivateTransport"
Cohesion: 0.14
Nodes (8): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), reject(), resolve(), client()

### Community 127 - "BlockContext"
Cohesion: 0.08
Nodes (20): ContractStateRow, CoreContractStatesOptions, CoreLedgerStateOptions, GreyPicker, BlockContext, StandInOptions, coreContractStates(), writeStateRows() (+12 more)

### Community 13 - "order.property.test.ts"
Cohesion: 0.03
Nodes (102): EntryRange, GraphInput, GraphRule, PointArguments, PointRun, PastFaultCase, RefusalCase, CallEvent (+94 more)

### Community 132 - "5.1 Layer A: per-key temporal history"
Cohesion: 0.08
Nodes (23): Key, Version, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap (+15 more)

### Community 133 - "sweep.ts"
Cohesion: 0.12
Nodes (12): GreyView, SweepPhase, SweepTables, byBytes(), BYTE_ORDER(), hexOf(), merged(), sweepStep() (+4 more)

### Community 134 - "node-bridge.ts"
Cohesion: 0.14
Nodes (17): BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 135 - "type-check.ts"
Cohesion: 0.15
Nodes (15): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), moduleSpecifier() (+7 more)

### Community 136 - "items.ts"
Cohesion: 0.14
Nodes (10): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, MetadataBlock, RuntimeMetadata, RuntimeMetadataEntry, LedgerTable, contentStateOf() (+2 more)

### Community 137 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 138 - "core-block-fetch/metadata.ts"
Cohesion: 0.27
Nodes (14): MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 139 - ".value"
Cohesion: 0.26
Nodes (7): ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 14 - "process-build.ts"
Cohesion: 0.04
Nodes (90): A43Case, A43Observation, Outcome, CoreSeen, testBuild, AlwaysLost, Fault, Recorded (+82 more)

### Community 142 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 145 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 15 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (72): ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ConsistentRead, ColumnType, RefusalPlace (+64 more)

### Community 155 - "source-scan.ts"
Cohesion: 0.20
Nodes (17): ModuleReference, boundaryViolations(), codeFingerprints(), declaredNames(), eachNode(), isInside(), lineOf(), literalText() (+9 more)

### Community 16 - "admin-harness.ts"
Cohesion: 0.04
Nodes (90): AdminStarter, ProcessConfig, AdminRunOptions, Answered, Answerer, Expected, Observation, Prober (+82 more)

### Community 164 - "retention.ts"
Cohesion: 0.17
Nodes (12): retainedStates, CoreRevision, boundLedger(), revisionsOf(), sweepOf(), coreRevisionsOf(), releasedBy(), retainedFrom() (+4 more)

### Community 165 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 166 - "package-identity.test.ts"
Cohesion: 0.22
Nodes (14): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest() (+6 more)

### Community 17 - "InMemoryBlockSource"
Cohesion: 0.04
Nodes (74): InMemoryBlockSource, LockstepWait, Flaky, Contexts, Faults, LostCommit, Seen, AtGate (+66 more)

### Community 172 - "lockstep-reads.test.ts"
Cohesion: 0.17
Nodes (12): Pause, Q142Observation, SkipsLockstep, genesisBlock(), launchPublicCore(), PRIVATE_ROWS_SQL(), publicCoreEntry(), publicReads() (+4 more)

### Community 173 - "Buffer"
Cohesion: 0.15
Nodes (8): Buffer, Hash, createHash(), 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 174 - "ws-mutual-tls.test.ts"
Cohesion: 0.19
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 178 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 179 - "browser-harness.ts"
Cohesion: 0.27
Nodes (13): ProcessName, backupThrough(), call(), eventsOf(), eventWhen(), logOf(), pageWhen(), restoreThrough() (+5 more)

### Community 18 - "adapter.ts"
Cohesion: 0.03
Nodes (74): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+66 more)

### Community 180 - "chrome.ts"
Cohesion: 0.23
Nodes (11): Cdp, CdpEvent, Download, PageRequest, chrome(), chrome(), chromePath(), chromeVersion() (+3 more)

### Community 181 - "database-fixtures.ts"
Cohesion: 0.15
Nodes (8): CheckTarget, CliBackend, Snapshot, blocksSql(), postgresCliBackend(), record(), rowsSql(), snapshotWith()

### Community 183 - "config-hash-checks.ts"
Cohesion: 0.20
Nodes (13): PrivateProcess, A162Options, a162Run, HeaderSeen, a162Problems(), asLogin(), formsOf(), headersOf() (+5 more)

### Community 184 - "TapeBuilder"
Cohesion: 0.19
Nodes (4): TapeBuilder, RecordingError, frameText(), whenClosed()

### Community 185 - "ws.ts"
Cohesion: 0.18
Nodes (6): Emitter, Frame, Listener, PortUpgrade, RawData, WebSocketServer

### Community 19 - "vitest"
Cohesion: 0.03
Nodes (65): Finding, Lockfile, Manifest, RepositoryFile, Upstream, Leftover, RemovedName, ReportedTest (+57 more)

### Community 193 - "PortSocket"
Cohesion: 0.29
Nodes (3): PortSocket, pair(), Contract states and contract logs

### Community 194 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 199 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 2 - "UmbraError"
Cohesion: 0.03
Nodes (88): LoadedConfig, LoadOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresOptions, PgliteLockUse, ConfiguredDatabaseOptions (+80 more)

### Community 20 - "FinalizedLoop"
Cohesion: 0.04
Nodes (26): ResolvedRange, EntryBoundary, Activity, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, Startup (+18 more)

### Community 200 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 203 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 204 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 209 - "intake.test.ts"
Cohesion: 0.33
Nodes (11): PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), follow(), heights(), readProblems() (+3 more)

### Community 21 - "declaration.ts"
Cohesion: 0.04
Nodes (79): ProcessConfiguration, coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+71 more)

### Community 216 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 22 - "cbor.ts"
Cohesion: 0.05
Nodes (77): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+69 more)

### Community 220 - "attempt"
Cohesion: 0.24
Nodes (9): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+1 more)

### Community 229 - "extrinsics.ts"
Cohesion: 0.29
Nodes (8): ExtrinsicCall, MetadataPallet, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), isCompactU64(), TIMESTAMP

### Community 23 - "ledger-storage.test.ts"
Cohesion: 0.05
Nodes (72): BlockHeader, CrashJob, ingest, SourceClass, watched, Call, SeenLoad, RestartEvent (+64 more)

### Community 230 - "scale-value.ts"
Cohesion: 0.20
Nodes (8): MetadataField, MetadataType, Primitive, littleEndian(), BIT_STORES, INTEGERS, MAX_DEPTH, SMALL

### Community 232 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 233 - "page-server.ts"
Cohesion: 0.28
Nodes (6): BrowserBuild, pageBench, PageServer, servePage(), ISOLATION_HEADERS, TYPES

### Community 24 - "node-format.ts"
Cohesion: 0.06
Nodes (56): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+48 more)

### Community 246 - "checkParent"
Cohesion: 0.32
Nodes (7): AlwaysLanded, checkParent(), sameBytes(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 25 - "validate.ts"
Cohesion: 0.05
Nodes (75): RevisionSettings, HistoryFinding, RedactableConfig, RedactionForms, redactor, SecretForm, TextPattern, ConfigRule (+67 more)

### Community 26 - "validation.ts"
Cohesion: 0.04
Nodes (68): DeclarationRule, PlacedDeclaration, Plain, StatusFacts, Case, ShapeCase, Stats, commitBlock() (+60 more)

### Community 261 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 27 - "runner/process.ts"
Cohesion: 0.04
Nodes (49): ChainIdentity, ChainSource, NodeWait, WaitingListener, ManifestHistoryRow, RetryCode, ProcessContexts, RetryCondition (+41 more)

### Community 28 - "adapter-fixtures.ts"
Cohesion: 0.07
Nodes (61): StoredNode, CallTx, Upstream, contractFixture, AdapterSubject, AdapterWorkerHost, Nodes, Probe (+53 more)

### Community 29 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (71): BlockEventSource, BodyExtrinsic, BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsedOptions, TransactionParser, ChainTransaction (+63 more)

### Community 3 - "config/history.ts"
Cohesion: 0.03
Nodes (126): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreSettings, versionEntry, ConfigHashRow, HistoryCheck, HistoryCode (+118 more)

### Community 30 - "spawnChild"
Cohesion: 0.04
Nodes (64): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+56 more)

### Community 31 - "core-transport.ts"
Cohesion: 0.04
Nodes (65): Session, TransportLimits, TransportTls, Committed, Hello, JsonValue, MessageFault, Parsed (+57 more)

### Community 32 - "ModuleDeclaration"
Cohesion: 0.05
Nodes (67): OpenedConfig, OpenedFacts, CoreChainFacts, RestoreBase, BackupText, CheckFinding, CheckState, ConfigCheckOptions (+59 more)

### Community 33 - "cli/command.ts"
Cohesion: 0.05
Nodes (59): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, CommandResult, statsConfig, backupArguments() (+51 more)

### Community 34 - "backup-fixtures.ts"
Cohesion: 0.08
Nodes (52): RestoreInput, BackupBackend, BackupDatabase, killedRestore, TickerConfig, ledgerBackup, RestoreBuild, cliProject (+44 more)

### Community 35 - "ledger/types.ts"
Cohesion: 0.07
Nodes (48): LoadLedger, LedgerStateItem, LedgerName, ChainOutcome, LedgerPackageOptions, LedgerTask, NodeBatch, ParsedTransaction (+40 more)

### Community 36 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (60): ContractLog, BlockTransaction, CoreContractLogsFastOptions, UnsureLog, FastLogReader, LoadAdapter, LogSite, Program (+52 more)

### Community 37 - "PgTransactionHistoryStorage"
Cohesion: 0.04
Nodes (58): TransactionHistoryStorage, PgTransactionHistoryStorage, rowToEntry(), reason(), Added, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage (+50 more)

### Community 38 - "loop.ts"
Cohesion: 0.06
Nodes (53): PointName, HeightRange, LateUse, Callback, CallbackFailure, ParallelPoint, PointSchedule, HeightActivity (+45 more)

### Community 4 - "api-server.test.ts"
Cohesion: 0.03
Nodes (101): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, ModuleTableOptions, ApiRegistry, Connection, HeadersArgument (+93 more)

### Community 40 - "height-versioned.test.ts"
Cohesion: 0.05
Nodes (52): heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Migration, Control, StoredVersion, Block, BlockFails (+44 more)

### Community 41 - "backup/backup.ts"
Cohesion: 0.06
Nodes (62): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestMigration, ManifestTool (+54 more)

### Community 42 - "range.ts"
Cohesion: 0.05
Nodes (65): NodeClientOptions, ConnectSocket, IngestOptions, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command (+57 more)

### Community 43 - "process-admin.ts"
Cohesion: 0.06
Nodes (64): ConfigFacts, AllowedDetail, PrivateSideFacts, ProcessAdminOptions, DigestRow, ModuleFacts, PartTable, PrivateInstanceFacts (+56 more)

### Community 44 - "format.test.ts"
Cohesion: 0.05
Nodes (52): Metadata, Step, FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+44 more)

### Community 45 - ".from"
Cohesion: 0.06
Nodes (55): ChildReader, recordedGenesis, Reader, contractStatesOf(), hex(), retainedStatesOf(), childRefKeys(), readChildren() (+47 more)

### Community 46 - "ReadHandle"
Cohesion: 0.05
Nodes (46): ReadHandle, OwnPart, FieldKind, FieldSchema, ItemDeclaration, ItemSink, Lifetime, PointCallbacks (+38 more)

### Community 47 - "NodeBlockSource"
Cohesion: 0.06
Nodes (22): HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeSubscription, NodeHeader, PreparedBlock, QueueRunner (+14 more)

### Community 48 - "chain-process.test.ts"
Cohesion: 0.04
Nodes (43): InMemoryItems, Wait, ProcessHandle, Job, WorkerEvent, A77Observation, A78Observation, A78Refusal (+35 more)

### Community 49 - "builds.ts"
Cohesion: 0.05
Nodes (49): PrivateBackend, SessionSeen, A113Observation, A156Observation, Binding, Created, Outcome, PrivateOptions (+41 more)

### Community 5 - "ref_node_crypto"
Cohesion: 0.03
Nodes (112): CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow, GuardTableRow, optOut (+104 more)

### Community 50 - "chain-placement.test.ts"
Cohesion: 0.08
Nodes (54): ChainEvent, ScaleValue, Field, PalletMetadata, Registry, RuntimeShape, StorageSpec, decodeExtrinsics() (+46 more)

### Community 51 - "LedgerPackage"
Cohesion: 0.07
Nodes (26): LedgerPackage, NodeStore, StateHandle, EngineOptions, LedgerEngine, Settled, stagenetReplay, hexOf() (+18 more)

### Community 52 - "pglite-queue.test.ts"
Cohesion: 0.05
Nodes (42): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, Run, Job (+34 more)

### Community 54 - "Process"
Cohesion: 0.07
Nodes (23): ProcessAdmin, CoreTransport, ProcessReason, ReasonCode, Unwrapped, Process, recordedHistory(), configurationFindings() (+15 more)

### Community 55 - "process-worker.ts"
Cohesion: 0.06
Nodes (43): BrowserConfiguration, BrowserRun, PrivateInstance, Scope, crossedError, StartRun, ToProcessWorker, privateIntake (+35 more)

### Community 56 - "contract-data-checks.ts"
Cohesion: 0.09
Nodes (50): contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran, ScenarioTx, handoff (+42 more)

### Community 58 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (47): ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, HoldSpec (+39 more)

### Community 59 - "TapeRecord"
Cohesion: 0.08
Nodes (53): BlockParsed, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime (+45 more)

### Community 6 - "backup/restore.ts"
Cohesion: 0.03
Nodes (74): ChainCheck, ChainCheckInput, ConfiguredGenesis, PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, SourceTransport, PublicConfiguration (+66 more)

### Community 60 - "transform-checks.ts"
Cohesion: 0.10
Nodes (34): TransformError, SubscriptionId, NotificationRange, baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape(), expectVariantOutput() (+26 more)

### Community 61 - "loggingModule"
Cohesion: 0.07
Nodes (43): AdminRun, Hold, ProbeRecord, databaseReadingAdmin(), dbKeeper(), listenOf(), mainThreadAdmin(), newHold() (+35 more)

### Community 62 - "ref_node_timers"
Cohesion: 0.06
Nodes (33): BlockItemSource, gate, Validator, Decision, ReadinessCase, answerAdmin(), coreBlockFetchOnFetch(), statusOf() (+25 more)

### Community 63 - "BlockRef"
Cohesion: 0.07
Nodes (17): QueuedBlock, BlockItems, BlockRef, InMemorySourceOptions, CommitOutcome, HeldHeight, Fetching, Recorder (+9 more)

### Community 65 - "state-trees.test.ts"
Cohesion: 0.06
Nodes (39): ApplyInput, ApplyOutput, StateSummary, LedgerHeight, Ledger, NodeRoot, AdapterWorkerAnswer, AdapterWorkerRequest (+31 more)

### Community 66 - "serve.test.ts"
Cohesion: 0.08
Nodes (28): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer, AdminSnapshot (+20 more)

### Community 67 - "core-settings.ts"
Cohesion: 0.06
Nodes (41): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+33 more)

### Community 69 - "post-block-update-checks.ts"
Cohesion: 0.10
Nodes (36): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+28 more)

### Community 7 - "db/api.ts"
Cohesion: 0.03
Nodes (92): Bound, Database, ReadOnlyDatabase, ReadOptions, SchemaPlan, Commit, Committed, Chain (+84 more)

### Community 70 - "retirement.test.ts"
Cohesion: 0.07
Nodes (39): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), manifestProblems(), mutationProblems() (+31 more)

### Community 71 - "determinism-checks.ts"
Cohesion: 0.11
Nodes (32): PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, TestLink, withCore(), directPublic() (+24 more)

### Community 72 - ".concat"
Cohesion: 0.05
Nodes (31): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+23 more)

### Community 75 - "cursor-harness.ts"
Cohesion: 0.07
Nodes (30): BlockWriteHandle, cursorTable, CursorTableOptions, CursorValue, BlockOptions, cursorDatabase, Access, Block (+22 more)

### Community 76 - "process-context.test.ts"
Cohesion: 0.07
Nodes (27): ProcessContext, ResolvedGraph, LoopInput, MisuseListener, MisuseReports, ProcessContextsInput, PublishRefusal, RunnerBackend (+19 more)

### Community 77 - "graph.ts"
Cohesion: 0.08
Nodes (40): Edge, GraphFacts, GraphPart, MidChain, Missing, RangeFacts, Spanned, DeclarationOrigin (+32 more)

### Community 79 - "version-checks.ts"
Cohesion: 0.13
Nodes (29): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, Answers, toHex() (+21 more)

### Community 8 - "column-rules.ts"
Cohesion: 0.02
Nodes (105): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+97 more)

### Community 80 - "sweep-tapes.ts"
Cohesion: 0.11
Nodes (34): TableSnapshot, FixtureNode, FakeState, committed(), hex(), insertionOrder(), firstVersion(), hex() (+26 more)

### Community 81 - "checks.test.ts"
Cohesion: 0.07
Nodes (26): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, integer() (+18 more)

### Community 82 - "process.test.ts"
Cohesion: 0.07
Nodes (25): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, A149Observation, A149Startup, copyArray() (+17 more)

### Community 85 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (26): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys(), describeStatusValue() (+18 more)

### Community 86 - "transport-faults.test.ts"
Cohesion: 0.10
Nodes (27): Message, MessageType, Ended, rawClient, hexOf(), endedWithin(), hello(), tlsProblems() (+19 more)

### Community 88 - "worker-host.test.ts"
Cohesion: 0.09
Nodes (25): LedgerReleasePackage, V9Logs, SlowStep, TestLoaderData, loadLedgerPackage(), createV8Adapter(), createV9Adapter(), createV9Rc3Adapter() (+17 more)

### Community 9 - "src/db/postgres.ts"
Cohesion: 0.04
Nodes (89): BenchEnv, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, DriverError, Outcome, PostgresOptions (+81 more)

### Community 90 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.05
Nodes (38): Absent, 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion (+30 more)

### Community 91 - "core-ledger-state.ts"
Cohesion: 0.09
Nodes (33): BlockLedgerSource, LedgerBinding, RetainedState, blockHeaderOf(), ledgerVersionOf(), writeBlockRow(), applyBlock(), bytesOf() (+25 more)

### Community 92 - "restore-private.ts"
Cohesion: 0.10
Nodes (28): RestoreOutcome, RestoreJob, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions (+20 more)

### Community 93 - "networks.ts"
Cohesion: 0.07
Nodes (33): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+25 more)

### Community 96 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.06
Nodes (34): Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4a. Error translation (`src/postgres/errors.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV (+26 more)

### Community 98 - "browser.test.ts"
Cohesion: 0.09
Nodes (33): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+25 more)

### Community 99 - "page.ts"
Cohesion: 0.08
Nodes (29): ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog(), backUp() (+21 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): Private modules, ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database (+21 more)

### Community 249 - ".position"
Cohesion: 0.32
Nodes (6): 4. `load` — full verification, no exceptions, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Why

### Community 122 - "restoreBackup"
Cohesion: 0.11
Nodes (18): createReadStream(), dumpLines(), isEmptyDatabase(), restoreBackup(), textOf(), blobChunks(), blobText(), firstLineOf() (+10 more)

### Community 126 - "code"
Cohesion: 0.10
Nodes (25): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21), The catalog, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog (+17 more)

### Community 141 - "decode"
Cohesion: 0.11
Nodes (20): decode(), Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Scenario: A future-versioned envelope is rejected cleanly, Scenario: An unknown top-level field is rejected as a typed envelope error (F7), Scenario: Non-JSON bytes are rejected as a typed envelope error, Scenario: Structurally invalid JSON is rejected as a typed envelope error, 0. Specification freeze (+12 more)

### Community 146 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (17): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface (+9 more)

### Community 147 - ".boolean"
Cohesion: 0.12
Nodes (17): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights (+9 more)

### Community 149 - "boundary.test.ts"
Cohesion: 0.25
Nodes (15): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+7 more)

### Community 150 - "migrations"
Cohesion: 0.11
Nodes (16): migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Migrations, 6. Storage helpers, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes (+8 more)

### Community 153 - "mapping.test.ts"
Cohesion: 0.16
Nodes (7): mapRows(), mapValue(), oid(), identity(), RESULT_COLUMNS, RESULT_TYPES, RFC-3339

### Community 169 - ".slowBlockMs"
Cohesion: 0.15
Nodes (13): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+5 more)

### Community 176 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 177 - "core-ledger-state.test.ts"
Cohesion: 0.13
Nodes (7): boundLedgerParser(), itemsOf(), writeBlock(), bound(), CORE_LEDGER_STATE_MIGRATIONS, NODES_PER_STATEMENT, STORED_ROOT

### Community 192 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 212 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 239 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 242 - "test-processes.test.ts"
Cohesion: 0.28
Nodes (7): namesRunner(), runnerStarts(), sources(), valueNames(), REPOSITORY, RUNNER, TESTS

### Community 243 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 251 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 265 - "parseJsonLossless"
Cohesion: 0.40
Nodes (5): parseJsonLossless(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 270 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.33
Nodes (6): released(), vendored(), Requirement: CF-4 Every field is data, operational or secret, Scenario: A PGlite directory whose parent is missing, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases

### Community 281 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 314 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 315 - "leanProblems"
Cohesion: 0.50
Nodes (4): leanImports(), leanProblems(), leanTheorems(), retiredLean()

### Community 39 - ".put"
Cohesion: 0.03
Nodes (68): T(), input(), "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated) (+60 more)

### Community 53 - "fn"
Cohesion: 0.04
Nodes (60): fn(), 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure (+52 more)

### Community 57 - "history"
Cohesion: 0.05
Nodes (54): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+46 more)

### Community 64 - "version"
Cohesion: 0.05
Nodes (44): version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5) (+36 more)

### Community 84 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (34): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change) (+26 more)

### Community 89 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides, Requirement: LG-17 Ledger tasks give modules the native objects (+27 more)

### Community 95 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (22): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile(), buildUnshieldedConfig(), firstStateWhere() (+14 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points (+25 more)

### Community 105 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (30): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+22 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+19 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence (+18 more)

### Community 124 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 128 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 130 - "package.json"
Cohesion: 0.08
Nodes (24): bin, umbradb, bugs, url, description, exports, files, homepage (+16 more)

### Community 131 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 144 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.10
Nodes (13): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Superseded — see `Formal/STORAGE_ALGEBRA.md`, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan (+5 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 151 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.11
Nodes (16): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+8 more)

### Community 152 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 154 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 157 - "README.md"
Cohesion: 0.18
Nodes (9): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased], Generate your local wallet, Test wallets (+1 more)

### Community 158 - "chain_archive lineage"
Cohesion: 0.12
Nodes (17): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, `chain_blobs` / `chain_blob_roles`, CheckpointStore tables, How the two lineages coexist (+9 more)

### Community 159 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (17): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+9 more)

### Community 160 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 162 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 163 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 167 - "ROADMAP.md"
Cohesion: 0.12
Nodes (11): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+3 more)

### Community 168 - "Storage Layer Interface Specification"
Cohesion: 0.12
Nodes (15): 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 3.1 Transaction/Lease layer (+7 more)

### Community 170 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 175 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 186 - "UmbraDB module guide"
Cohesion: 0.14
Nodes (13): Cursor tables, Data that is not a function of the chain, Height-versioned tables, Reading through `db`, Running a module with the `umbradb` command, Start and stop heights, Stored values and digests, The ledger state (+5 more)

### Community 187 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A fault of the build's declarations ends the process (+5 more)

### Community 188 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 189 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 190 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.14
Nodes (13): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 3.1 The frozen catalog (the machine-facing API), 3.2 Promote retryability to a machine-readable field, 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+5 more)

### Community 195 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 196 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 198 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 202 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 206 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 207 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 208 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 210 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 211 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 213 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 214 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 215 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Both backends write a restorable file (+2 more)

### Community 217 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 218 - "Full-Chain Storage"
Cohesion: 0.20
Nodes (9): 1. Overview / purpose, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 3. Semantic decode: `chain-archive-sync/tx-replay-decoder.ts`, 4. How to run it, 5. Acceptance criteria status, 6. Known limitations (+1 more)

### Community 219 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 221 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 222 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 223 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 224 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 225 - "Tasks — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 1. Pre-freeze: retryability field (G3), 2. Pre-freeze: strip / mark-experimental the chain-archive error classes (G3), 3. The freeze: build + package.json (G1), 4. The freeze: the public barrel (G1), 5. Release contract docs (G2, G4), 6. Freeze the Lean cut-line (G20), 7. Packed-tarball install smoke test (G1), 8. Change close-out (+1 more)

### Community 226 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 227 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 228 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 234 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 235 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 236 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 237 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 238 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 240 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 241 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 244 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 245 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 247 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 248 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 250 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 252 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 253 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 254 - "UmbraDB Durability Contract"
Cohesion: 0.29
Nodes (6): 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 4. Session-mode connection pooling only — probe-enforced (best-effort), 5. Server-side timeouts — applied by `createClient` (documented), Summary, UmbraDB Durability Contract

### Community 255 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 256 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 257 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 258 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 259 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 260 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 263 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 264 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 266 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 267 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 268 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 269 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 271 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.33
Nodes (5): 11. Chain data, 13. Contract data, 18. Whole-system faults, differentials and measurements, 19. Close-out, Tasks — CORE-ARCH: the standalone indexer's core architecture

### Community 272 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 273 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 274 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 275 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 276 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, What changes — the 1.0.0 gate items this change addresses, Why

### Community 277 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 278 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 279 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 280 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 282 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 283 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 284 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 285 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 286 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 287 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 288 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 289 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 290 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 291 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 292 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 293 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 294 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 295 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 296 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 297 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 298 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 299 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 300 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 301 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 302 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 303 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 304 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

### Community 305 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 306 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 307 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 308 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 309 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 310 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 311 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 312 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 313 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 321 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 322 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 68 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 83 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-8259`, `RFC-3339`, `RFC-3339`, `RFC-6455`, `@stryker-mutator/core` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3617 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `client.test.ts`, `migrate.ts`, `UmbraError`, `config/history.ts`, `api-server.test.ts`, `ref_node_crypto`, `backup/restore.ts`, `db/api.ts`, `column-rules.ts`, `src/db/postgres.ts`, `tape/index.ts`, `fetch-fixtures.ts`, `NodeClient`, `order.property.test.ts`, `process-build.ts`, `opt-out.test.ts`, `admin-harness.ts`, `InMemoryBlockSource`, `adapter.ts`, `declaration.ts`, `cbor.ts`, `ledger-storage.test.ts`, `node-format.ts`, `validate.ts`, `validation.ts`, `runner/process.ts`, `adapter-fixtures.ts`, `core-block-parsed.ts`, `spawnChild`, `core-transport.ts`, `ModuleDeclaration`, `cli/command.ts`, `backup-fixtures.ts`, `contract-modules.test.ts`, `loop.ts`, `height-versioned.test.ts`, `backup/backup.ts`, `process-admin.ts`, `format.test.ts`, `ReadHandle`, `chain-process.test.ts`, `builds.ts`, `chain-placement.test.ts`, `pglite-queue.test.ts`, `contract-data-checks.ts`, `slow-block-harness.ts`, `TapeRecord`, `transform-checks.ts`, `loggingModule`, `ref_node_timers`, `state-trees.test.ts`, `serve.test.ts`, `core-settings.ts`, `post-block-update-checks.ts`, `retirement.test.ts`, `determinism-checks.ts`, `cursor-harness.ts`, `process-context.test.ts`, `version-checks.ts`, `sweep-tapes.ts`, `checks.test.ts`, `process.test.ts`, `pg-tx-history-adapter.ts`, `transport-faults.test.ts`, `worker-host.test.ts`, `core-ledger-state.ts`, `restore-private.ts`, `networks.ts`, `cold-boot-recovery.integration.test.ts`, `browser.test.ts`, `postgres/transaction-history-storage.ts`, `code-registry.ts`, `TransactionHistoryEntry`, `browser/build.ts`, `ledger-sweep.test.ts`, `Lockstep`, `test/postgres/setup.ts`, `crash.test.ts`, `net.test.ts`, `routes.ts`, `private/lockstep-wait.test.ts`, `lockstep-refusals.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `restoreBackup`, `package.json`, `node-bridge.ts`, `type-check.ts`, `block-fetch-decode.test.ts`, `transaction-history-storage.property.test.ts`, `boundary.test.ts`, `mapping.test.ts`, `retention.ts`, `statementsOf`, `package-identity.test.ts`, `lockstep-reads.test.ts`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `core-ledger-state.test.ts`, `transport-intake.test.ts`, `excluded-not-exported.test.ts`, `twox.ts`, `worker-threads.test.ts`, `history.property.test.ts`, `component-table.test.ts`, `intake.test.ts`, `test-processes.test.ts`?**
  _High betweenness centrality (0.248) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8259`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `client.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.018226694513005504 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `client.test.ts`, `migrate.ts`, `config/history.ts`, `api-server.test.ts`, `ref_node_crypto`, `backup/restore.ts`, `db/api.ts`, `items.ts`, `src/db/postgres.ts`, `tape/index.ts`, `fetch-fixtures.ts`, `NodeClient`, `order.property.test.ts`, `version-table.ts`, `opt-out.test.ts`, `process-build.ts`, `InMemoryBlockSource`, `admin-harness.ts`, `vitest`, `FinalizedLoop`, `declaration.ts`, `cbor.ts`, `ledger-storage.test.ts`, `validate.ts`, `validation.ts`, `runner/process.ts`, `mapping.test.ts`, `core-transport.ts`, `ModuleDeclaration`, `ledger/types.ts`, `contract-modules.test.ts`, `statementsOf`, `package-identity.test.ts`, `loop.ts`, `height-versioned.test.ts`, `backup/backup.ts`, `range.ts`, `process-admin.ts`, `ReadHandle`, `NodeBlockSource`, `chain-process.test.ts`, `core-ledger-state.test.ts`, `checkShape`, `builds.ts`, `pglite-queue.test.ts`, `Process`, `process-worker.ts`, `slow-block-harness.ts`, `UmbraDB module guide`, `transform-checks.ts`, `ref_node_timers`, `BlockRef`, `core-settings.ts`, `cursor-harness.ts`, `process-context.test.ts`, `graph.ts`, `version-checks.ts`, `checks.test.ts`, `process.test.ts`, `transport-faults.test.ts`, `sha256`, `core-ledger-state.ts`, `mapping.ts`, `checkParent`, `lockstep-refusals.test.ts`, `PrivateTransport`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `migrate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.028345373237014103 - nodes in this community are weakly interconnected._