# Graph Report - UmbraDB

## Corpus Check
- 1005 files · ~1,474,813 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10635 nodes · 31132 edges · 358 communities (326 shown, 32 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2490 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `97b918bd1e30198d` (1005 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- chain-process.test.ts
- fetch-fixtures.ts
- validate.ts
- core-block-commit.test.ts
- cbor.property.test.ts
- task-modules.ts
- PrivateTransport
- vendored-ledger-v9.test.ts
- ModuleApi
- code-registry.ts
- configured.ts
- tape/index.ts
- startup-stop-harness.ts
- change-capture.ts
- api-server.test.ts
- browser/build.ts
- module-api.test.ts
- compact
- config/plain-data.ts
- type-check.ts
- adapter-fixtures.ts
- interfaces/transaction-history-storage.ts
- pg-tx-history-adapter.ts
- restore-private.ts
- ReadHandle
- PointName
- check-required-tests.ts
- declaration.ts
- legacy-excluded.test.ts
- module-rules.ts
- HeightRun
- ProcessContexts
- containers.test.ts
- digest.test.ts
- process-context.test.ts
- builder.test.ts
- test/postgres/setup.ts
- net.test.ts
- api-server.ts
- T
- sweep.ts
- range.test.ts
- core-contract-states.ts
- 5. Runner
- block-fetch-decode.test.ts
- node-bridge.ts
- ledger-sweep.test.ts
- checkShape
- package-identity.test.ts
- client.test.ts
- lockstep-refusals.test.ts
- readiness.test.ts
- key-handling-checks.ts
- describeNodeStoreExports
- transaction-history-storage.property.test.ts
- postgres/transaction-history-storage.ts
- childRefKeys
- version-table.ts
- worker-host.test.ts
- backup/restore.ts
- ws.ts
- src/config/load.ts
- read-height.property.test.ts
- .from
- Buffer
- ws-mutual-tls.test.ts
- statementsOf
- ChromeTab
- PortSocket
- HeldHeight
- builds.ts
- attempt
- browser-harness.ts
- chrome.ts
- web-lock.ts
- Design — Sprint 1: project setup + TemporalKV
- db/api.ts
- migrate.test.ts
- worker-threads.test.ts
- midnight-env — reproducible PREPROD dev environment
- history.property.test.ts
- BlockRef
- worker-threads-worker.ts
- buffer.ts
- Worker
- height-versioned.test.ts
- Connection
- ledger/plain-data.test.ts
- sha256
- cli/command.ts
- Roadmap for the missing formalization
- ingest-crash.worker.ts
- runner/process.ts
- postgres-image.test.ts
- stats.ts
- page-server.ts
- column-rules.ts
- vendored-ledger-files.test.ts
- ref_node_fs
- mutation-evidence.d.mts
- AsyncLocalStorage
- vitest
- writer-lock-checks.ts
- CrashWorkerHandle
- timeouts.test.ts
- db/errors.ts
- migrate.ts
- private/backends.ts
- FinalizedLoop
- crash.test.ts
- https.ts
- NodeFS
- loop.test.ts
- 12. Ledger
- FailsOnceStarted
- core-ledger-state.ts
- UmbraError
- core-block-parsed.ts
- version-checks.ts
- process-worker.ts
- config/history.ts
- backup/backup.ts
- LedgerPackage
- mapping.ts
- slow-block-harness.ts
- declaration
- host.ts
- range.ts
- transform-checks.ts
- .value
- refused-configuration.test.ts
- ledger-storage.test.ts
- cbor.ts
- PgTransactionHistoryStorage
- column-rules.test.ts
- order.property.test.ts
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- contract-data-checks.ts
- column-refusals.test.ts
- zero-timeouts-checks.ts
- admin-harness.ts
- config-check.ts
- config/build.ts
- graph.ts
- process-backends.ts
- .#open
- boundary.test.ts
- private/lockstep-wait.test.ts
- worker-storage.test.ts
- process-admin.ts
- module-tables.ts
- cold-boot-recovery.integration.test.ts
- ledger/types.ts
- loop.ts
- .concat
- retirement.test.ts
- core-transport.ts
- core-chain-events.ts
- node-format.ts
- core-settings.ts
- networks.ts
- validation.ts
- NodeClient
- version
- ledger/load.ts
- browser.test.ts
- page.ts
- TransactionHistoryEntry
- 4. Schema design
- refused
- UmbraDB 1.0.0 Release Contracts
- ADDED Requirements
- migrations
- ledger/ledger-tasks.test.ts
- mutation-per-adapter.mjs
- twox.ts
- Full-Chain Storage
- .answer
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- pack-install.mjs
- .slowBlockMs
- path.ts
- Performance — design
- continueTo
- orphan-watcher.mjs
- .getImpl
- Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data
- crash-worker.ts
- leanProblems
- history
- fn
- code
- table
- .put
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- ADDED Requirements
- package.json
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Full-Chain Storage — Design
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB
- stryker.conf.json
- Storage Layer Interface Specification
- chain_archive lineage
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — Sprint 4: Watermarks
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- Security policy & threat model
- Design — Sprint 2: Transaction/Lease
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- conformance-gate.mjs
- Contributing
- Checkpoint-store composition contract — cursor ordering and replay
- Storage Algebra Lean M3a Watermarks Sprint
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
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
- Proposal — Sprint 2: Transaction/Lease
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0 API Surface & Release Contract
- Proposal — v1.0.0-infosec-signoff
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask
- 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- 00042 — A stop while the loop waits on an unreachable node does not end the process
- bug-report.md
- feature-request.md
- Requirement: RN-16 Chain-data reads name their view and height
- GC architecture and query-tracing: research findings
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- Requirement: RN-13 SIGTERM stops cleanly
- Requirement: RN-3 Callbacks within a point run in a fixed order
- Requirement: RN-5 The block context carries one height's items
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
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements
- ADDED Requirements
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 314 edges
2. `UmbraError` - 296 edges
3. `ModuleDeclaration` - 168 edges
4. `FinalizedLoop` - 118 edges
5. `NodeClient` - 105 edges
6. `InMemoryBlockSource` - 101 edges
7. `Database` - 97 edges
8. `BlockRef` - 93 edges
9. `ReadHandle` - 85 edges
10. `5. Runner` - 76 edges

## Surprising Connections (you probably didn't know these)
- `Problem` --references--> `InMemoryBlockSource`  [INFERRED]
  docs/issues/00036-in-memory-blocks-runtime-2-0-ledger-v9.md → src/runner/in-memory-source.ts
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (358 total, 32 thin omitted)

### Community 0 - "chain-process.test.ts"
Cohesion: 0.02
Nodes (141): BlockItemSource, LateUse, BlockSource, FinalityStallCondition, InMemoryBlockSource, InMemoryItems, Wait, ProcessHandle (+133 more)

### Community 1 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (137): ProcessCondition, BlockSpec, EventSpec, Scenario, transactionSpec, eventsRuntime, PalletMetadata, Phase (+129 more)

### Community 10 - "validate.ts"
Cohesion: 0.03
Nodes (112): coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+104 more)

### Community 100 - "core-block-commit.test.ts"
Cohesion: 0.09
Nodes (27): StandInOptions, Commit, blockHeaderOf(), checkParent(), commitBlock(), hex(), sameBytes(), writeBlockRow() (+19 more)

### Community 101 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 102 - "task-modules.ts"
Cohesion: 0.11
Nodes (30): CallArgsItem, CallArguments, taskSeen, V9Raw, ProcessBackend, plainWatchModule(), tasksScenario(), transactionsOf() (+22 more)

### Community 104 - "PrivateTransport"
Cohesion: 0.10
Nodes (11): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), publicConfigChanged(), reject(), resolve() (+3 more)

### Community 105 - "vendored-ledger-v9.test.ts"
Cohesion: 0.13
Nodes (30): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, freeAll(), runInFreshInstance(), bigCell() (+22 more)

### Community 107 - "ModuleApi"
Cohesion: 0.11
Nodes (18): ModuleApiServer, ModuleApiStart, StartedModuleApi, openedProcess, ModuleTableOptions, ModuleApiStart, ApiRoutes, ApiStartup (+10 more)

### Community 108 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 109 - "configured.ts"
Cohesion: 0.13
Nodes (25): RestoreSeams, Environment, BackupCommandOptions, BackupOutcome, CommandConfig, commandTarget, Chain, RestoreCommandOptions (+17 more)

### Community 11 - "tape/index.ts"
Cohesion: 0.05
Nodes (77): Recorded, Link, TapeBuilderOptions, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId (+69 more)

### Community 110 - "startup-stop-harness.ts"
Cohesion: 0.11
Nodes (21): A167Observation, CheckOf, NodeWatch, PrivateObservation, silentCore, StopBy, stoppedWith(), staysUp() (+13 more)

### Community 111 - "change-capture.ts"
Cohesion: 0.11
Nodes (21): CapturedTable, CaptureState, GuardTableRow, optOut, captureDefinitions(), capturedTables(), captureFunctionName(), captureReady() (+13 more)

### Community 112 - "api-server.test.ts"
Cohesion: 0.11
Nodes (23): Client, names(), configHashesOf(), duplicateProblems(), exchange(), helperProblems(), hex(), isConfigHash() (+15 more)

### Community 113 - "browser/build.ts"
Cohesion: 0.09
Nodes (24): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+16 more)

### Community 114 - "module-api.test.ts"
Cohesion: 0.08
Nodes (22): ApiRegistry, ApiError, ApiErrorCode, ApiRequest, ApiResponse, HttpMethod, ModuleRegistration, PathSegment (+14 more)

### Community 115 - "compact"
Cohesion: 0.16
Nodes (21): Field, Registry, metadataWith(), metadataV14(), midnightMetadata(), phaseBytes(), record(), signedExtrinsic() (+13 more)

### Community 116 - "config/plain-data.ts"
Cohesion: 0.10
Nodes (22): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+14 more)

### Community 117 - "type-check.ts"
Cohesion: 0.10
Nodes (18): TypeCheckFinding, TypeCheckResult, Finding, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile() (+10 more)

### Community 12 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (94): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, Decimal (+86 more)

### Community 120 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 121 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 123 - "restore-private.ts"
Cohesion: 0.15
Nodes (23): RestoreOutcome, FileProcess, privateBackup, PrivateConfig, PublicSetting, PublicSide, PublicSideOptions, heightsFrom() (+15 more)

### Community 125 - "ReadHandle"
Cohesion: 0.11
Nodes (12): ReadHandle, FieldSchema, Lifetime, PointCallbacks, ChainDataAnswer, HttpHandler, HttpRoute, AddsExtensions (+4 more)

### Community 126 - "PointName"
Cohesion: 0.10
Nodes (17): QueuedBlock, PointName, BlockItems, HeightFailure, Misuse, SlowBlockCondition, CrashOptions, A43Case (+9 more)

### Community 129 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 13 - "declaration.ts"
Cohesion: 0.04
Nodes (93): BlockHeader, DefinedModule, KnownPointsOnly, ModuleDeclaration, TableDeclaration, ChainBuildOptions, itemsSeen, Json (+85 more)

### Community 130 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 133 - "module-rules.ts"
Cohesion: 0.09
Nodes (17): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, settle(), attachIntegerChecks() (+9 more)

### Community 134 - "HeightRun"
Cohesion: 0.08
Nodes (11): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, LateRedelivery, SkipsStartAtRestart, CommitsDespiteLastWrite (+3 more)

### Community 135 - "ProcessContexts"
Cohesion: 0.10
Nodes (6): ProcessContexts, ProcessItems, PublishRefusal, AllowsOutside, AllowsTwice, providesProcessItem()

### Community 137 - "containers.test.ts"
Cohesion: 0.12
Nodes (18): Started, SlowToReportPorts, SourceFile, guardContainers(), removeAttempt(), startContainer(), startContainers(), parentWithContainer() (+10 more)

### Community 138 - "digest.test.ts"
Cohesion: 0.14
Nodes (22): ChangeKind, tableChanges, TouchedRow, digestBlock(), takeChanges(), encodeCanonical(), changeOf(), concat() (+14 more)

### Community 139 - "process-context.test.ts"
Cohesion: 0.11
Nodes (17): MisuseListener, RunnerBackend, ContextsClass, a74Problems(), consumer(), latePublisher(), "on-start-db"(), provider() (+9 more)

### Community 14 - "builder.test.ts"
Cohesion: 0.03
Nodes (57): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step, Frame (+49 more)

### Community 140 - "test/postgres/setup.ts"
Cohesion: 0.13
Nodes (23): Cancellable, CrashHook, CrashWorkerReady, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, pool(), worker(), backendPid() (+15 more)

### Community 141 - "net.test.ts"
Cohesion: 0.13
Nodes (13): NetworkBroker, IncomingMessage, Server, NetworkMessage, createServer(), listen(), pagePort(), unlisten() (+5 more)

### Community 145 - "api-server.ts"
Cohesion: 0.12
Nodes (22): HeadersArgument, ModuleApiServer, ModuleApiServerOptions, answerHead(), coreHeaders(), coreHeadersResponse(), isCoreHeader(), listenModuleApi() (+14 more)

### Community 147 - "T"
Cohesion: 0.10
Nodes (23): Absent, n(), T(), input(), 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 4. Transaction / Lease — the control algebra the other three run inside, 5. Testable-law deliverable (fast-check + Vitest) (+15 more)

### Community 149 - "sweep.ts"
Cohesion: 0.12
Nodes (13): GreyView, SweepPhase, SweepTables, byBytes(), BYTE_ORDER(), hexOf(), merged(), sweepStep() (+5 more)

### Community 15 - "range.test.ts"
Cohesion: 0.03
Nodes (67): ConnectSocket, FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+59 more)

### Community 150 - "core-contract-states.ts"
Cohesion: 0.09
Nodes (18): ContractStateRow, contractStatesOf(), coreContractStates(), hex(), writeStateRows(), heightPartitionsSql(), perCall(), CONTRACT_STATES_ITEM (+10 more)

### Community 151 - "5. Runner"
Cohesion: 0.18
Nodes (19): ChainDataView, AppendsVersion, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions() (+11 more)

### Community 153 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 154 - "node-bridge.ts"
Cohesion: 0.14
Nodes (17): Thread, BridgeServer, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 156 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (12): SweepState, SweepWrites, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints(), compare() (+4 more)

### Community 158 - "checkShape"
Cohesion: 0.23
Nodes (12): Shape, checkItem(), checkLedgerTasks(), checkShape(), isObject(), isZodObject(), quoted(), shown() (+4 more)

### Community 159 - "package-identity.test.ts"
Cohesion: 0.16
Nodes (18): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+10 more)

### Community 16 - "client.test.ts"
Cohesion: 0.03
Nodes (58): Answer, FakeNode, Handler, Received, recorded, ManualTimers, connectWebSocket(), connectWebSocket() (+50 more)

### Community 160 - "lockstep-refusals.test.ts"
Cohesion: 0.20
Nodes (19): LockstepCondition, A118Observation, MismatchObservation, WaitSample, hexOf(), a118Problems(), a118Run(), coreOn() (+11 more)

### Community 161 - "readiness.test.ts"
Cohesion: 0.14
Nodes (14): ProcessState, gate, Decision, ReadinessCase, ae4(), caseText(), readinessProblems(), holding() (+6 more)

### Community 162 - "key-handling-checks.ts"
Cohesion: 0.13
Nodes (16): Leftover, RemovedName, described(), keyLeftovers(), leftoversIn(), scannedFiles(), OWN_FILES, REMOVED_NAMES (+8 more)

### Community 163 - "describeNodeStoreExports"
Cohesion: 0.16
Nodes (5): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), sortedHex()

### Community 164 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (15): EntryContent, Command, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS, goodLeaf (+7 more)

### Community 165 - "postgres/transaction-history-storage.ts"
Cohesion: 0.16
Nodes (14): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+6 more)

### Community 166 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 167 - "version-table.ts"
Cohesion: 0.16
Nodes (19): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+11 more)

### Community 168 - "worker-host.test.ts"
Cohesion: 0.13
Nodes (16): SlowStep, TestLoaderData, beat(), countDeserializations(), hexOf(), loadLedger(), applyBlock(), at() (+8 more)

### Community 17 - "backup/restore.ts"
Cohesion: 0.04
Nodes (59): PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, SourceTransport, PublicConfiguration, PublicDatabase, PublicIdentity, PublicSideOptions (+51 more)

### Community 170 - "ws.ts"
Cohesion: 0.14
Nodes (8): Emitter, Frame, Listener, PortUpgrade, RawData, WebSocket, WebSocketServer, connect()

### Community 173 - "src/config/load.ts"
Cohesion: 0.15
Nodes (13): LoadOptions, invalid(), isFile(), loadConfig(), modulesOf(), load(), DEFAULT_CONFIG_FILE, MODULES_EXPORT (+5 more)

### Community 175 - "read-height.property.test.ts"
Cohesion: 0.16
Nodes (12): TestDatabase, HeldRead, Job, Outcome, Reads, Step, concurrent(), queued() (+4 more)

### Community 18 - ".from"
Cohesion: 0.03
Nodes (81): ContractLog, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+73 more)

### Community 182 - "Buffer"
Cohesion: 0.15
Nodes (8): Buffer, Hash, createHash(), 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 184 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 186 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 188 - "PortSocket"
Cohesion: 0.24
Nodes (5): PortSocket, pair(), Contract states and contract logs, Requirement: RN-15 Module APIs are registered once, at startup, Scenario: Two modules claim one path

### Community 189 - "HeldHeight"
Cohesion: 0.16
Nodes (10): CommitOutcome, HeldHeight, Outcomes, AlwaysLanded, AlwaysLost, DropsHeld, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence (+2 more)

### Community 19 - "builds.ts"
Cohesion: 0.05
Nodes (82): PrivateBackend, A113Observation, A156Observation, Binding, Created, Outcome, PrivateProcess, PrivateRefusal (+74 more)

### Community 190 - "attempt"
Cohesion: 0.15
Nodes (14): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+6 more)

### Community 193 - "browser-harness.ts"
Cohesion: 0.27
Nodes (13): ProcessName, backupThrough(), call(), eventsOf(), eventWhen(), logOf(), pageWhen(), restoreThrough() (+5 more)

### Community 194 - "chrome.ts"
Cohesion: 0.23
Nodes (11): Cdp, CdpEvent, Download, PageRequest, chrome(), chrome(), chromePath(), chromeVersion() (+3 more)

### Community 195 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 196 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.15
Nodes (13): Sql, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4a. Error translation (`src/postgres/errors.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV (+5 more)

### Community 2 - "db/api.ts"
Cohesion: 0.03
Nodes (95): ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight (+87 more)

### Community 20 - "migrate.test.ts"
Cohesion: 0.04
Nodes (73): BlockWriteHandle, SchemaWriteHandle, Transaction, MultiStatementRunner, SchemaItem, BlockWrites, Point, MigrationRow (+65 more)

### Community 201 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 204 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 208 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 21 - "BlockRef"
Cohesion: 0.04
Nodes (35): CoreBlockItems, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeCallOptions, NodeSubscription, NodeHeader (+27 more)

### Community 210 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 211 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 22 - "height-versioned.test.ts"
Cohesion: 0.04
Nodes (67): cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Migration, TestBackend (+59 more)

### Community 220 - "Connection"
Cohesion: 0.30
Nodes (4): Connection, errorMessage(), encodeJson(), hex()

### Community 226 - "ledger/plain-data.test.ts"
Cohesion: 0.29
Nodes (8): Path, Point, described(), differs(), key(), plainDataProblem(), walk(), PLAIN_PROTOTYPES

### Community 228 - "sha256"
Cohesion: 0.31
Nodes (5): sha256, hex(), instantiateLedger(), INITIAL, K

### Community 23 - "cli/command.ts"
Cohesion: 0.05
Nodes (66): CommandHandler, CommandIo, MainProcess, CheckStep, cliProject, CommandResult, RunningCommand, statsConfig (+58 more)

### Community 234 - "Roadmap for the missing formalization"
Cohesion: 0.20
Nodes (9): Key, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec (+1 more)

### Community 239 - "ingest-crash.worker.ts"
Cohesion: 0.24
Nodes (9): CrashEvent, CrashJob, report(), tipWriter(), fenceAt(), handle, job, orphanGuard (+1 more)

### Community 24 - "runner/process.ts"
Cohesion: 0.04
Nodes (60): Bound, ChainCheck, ChainCheckInput, ChainIdentity, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait (+52 more)

### Community 240 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 241 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 242 - "page-server.ts"
Cohesion: 0.28
Nodes (6): BrowserBuild, pageBench, PageServer, servePage(), ISOLATION_HEADERS, TYPES

### Community 25 - "column-rules.ts"
Cohesion: 0.04
Nodes (84): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog (+76 more)

### Community 257 - "vendored-ledger-files.test.ts"
Cohesion: 0.29
Nodes (6): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, VERSIONS

### Community 26 - "ref_node_fs"
Cohesion: 0.07
Nodes (50): BackupBackend, BackupDatabase, killedRestore, TickerConfig, Pem, catalogOf(), dockerExec(), hashOf() (+42 more)

### Community 266 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 27 - "vitest"
Cohesion: 0.04
Nodes (56): Op, States, TableName, Accepts, Rest, WithKnownPoints, WithUnknownPoint, captured() (+48 more)

### Community 28 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (58): Held, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, acquirePgliteLock(), lockHeld() (+50 more)

### Community 288 - "timeouts.test.ts"
Cohesion: 0.33
Nodes (5): ReportedTest, CONFIG, FIXTURE_CONFIG, REPOSITORY, VITEST_CLI

### Community 29 - "db/errors.ts"
Cohesion: 0.06
Nodes (52): BenchEnv, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, ReadTimeoutSetting, Outcome, BoundedRead (+44 more)

### Community 3 - "migrate.ts"
Cohesion: 0.03
Nodes (114): AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference, OwnPart, PlannedSchema (+106 more)

### Community 30 - "private/backends.ts"
Cohesion: 0.05
Nodes (46): SessionSeen, TestDatabase, A162Options, a162Run, HeaderSeen, Pause, Q142Observation, SkipsLockstep (+38 more)

### Community 31 - "FinalizedLoop"
Cohesion: 0.06
Nodes (13): Activity, FinalizedLoop, LoopObserver, UnexpectedCursor, ItemsAfterWrite, NoRedelivery, CommitsTheBoundary, call() (+5 more)

### Community 32 - "crash.test.ts"
Cohesion: 0.04
Nodes (59): ParentJob, Kill, Orphaned, SourceFile, LockResult, CrashCall, CrashEvent, CrashObservation (+51 more)

### Community 33 - "loop.test.ts"
Cohesion: 0.06
Nodes (52): WaitingInRead, Faults, LostCommit, Seen, AtGate, LoopClass, RunnerDatabase, FailingAfter (+44 more)

### Community 34 - "12. Ledger"
Cohesion: 0.05
Nodes (42): RetainedState, EvictionRefused, LedgerHost, LedgerWorkerFailure, NodeDatabase, SentParses, NodeReader, workerParser() (+34 more)

### Community 35 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (53): BlockLedgerSource, LedgerBinding, retainedStates, CoreRevision, boundLedgerParser(), applyBlock(), bindCoreLedgerState(), boundLedger() (+45 more)

### Community 36 - "UmbraError"
Cohesion: 0.06
Nodes (29): LoadedConfig, LoadOptions, PostgresOptions, JobQueue, PgliteDatabase, ReadPool, Session, Writer (+21 more)

### Community 37 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (63): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, BlockParsed, BlockParsedOptions, TransactionParser, ChainTransaction (+55 more)

### Community 38 - "version-checks.ts"
Cohesion: 0.07
Nodes (43): CoreChainFacts, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, LedgerTable, OwnStateMetadata, CountingNode (+35 more)

### Community 39 - "process-worker.ts"
Cohesion: 0.06
Nodes (50): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, Scope, crossedError, FromProcessWorker, StartRun (+42 more)

### Community 4 - "config/history.ts"
Cohesion: 0.03
Nodes (120): OpenedFacts, CoreVersion, CoreSettings, ConfigHashRow, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding (+112 more)

### Community 40 - "backup/backup.ts"
Cohesion: 0.07
Nodes (56): BackupInput, BackupSeams, BackupTarget, BackupWritten, ManifestHistoryRow, ManifestMigration, ManifestTool, DumpInput (+48 more)

### Community 41 - "LedgerPackage"
Cohesion: 0.07
Nodes (25): LedgerPackage, LedgerTask, LedgerTaskBlock, NodeStore, StateHandle, EngineOptions, LedgerEngine, LedgerTaskFailed (+17 more)

### Community 42 - "mapping.ts"
Cohesion: 0.05
Nodes (46): ResultType, Case, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+38 more)

### Community 44 - "slow-block-harness.ts"
Cohesion: 0.08
Nodes (52): HeightActivity, LoopInput, SlowBlockEvent, StatusBody, PublicCoreOptions, Times, Wait, askedSource (+44 more)

### Community 45 - "declaration"
Cohesion: 0.06
Nodes (54): GraphInput, HeightRange, PastFaultCase, RefusalCase, resolveGraph(), revisionAt(), keysModule(), contractLogs() (+46 more)

### Community 46 - "host.ts"
Cohesion: 0.07
Nodes (48): LoadLedger, LedgerStateItem, LedgerName, ChainOutcome, LedgerPackageOptions, NodeBatch, ParsedTransaction, AppliedState (+40 more)

### Community 47 - "range.ts"
Cohesion: 0.05
Nodes (53): NodeClientOptions, WatchedClient, Arguments, Command, TapeCommandIo, CompletenessRange, Final, Height (+45 more)

### Community 48 - "transform-checks.ts"
Cohesion: 0.09
Nodes (37): Failure, Variant, TransformError, NotificationRange, until(), baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect() (+29 more)

### Community 49 - ".value"
Cohesion: 0.11
Nodes (32): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef (+24 more)

### Community 5 - "refused-configuration.test.ts"
Cohesion: 0.03
Nodes (120): ProcessConfig, AdminRun, Answered, Hold, ProbeRecord, Start, Child, Refusal (+112 more)

### Community 50 - "ledger-storage.test.ts"
Cohesion: 0.08
Nodes (51): SeenLoad, retentionSeen, LedgerTx, coreLedgerState(), retainedStatesOf(), a76Problems(), heightsIn(), a106Problems() (+43 more)

### Community 51 - "cbor.ts"
Cohesion: 0.08
Nodes (46): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+38 more)

### Community 52 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (48): TransactionHistoryStorage, PgTransactionHistoryStorage, Added, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation) (+40 more)

### Community 54 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (33): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+25 more)

### Community 55 - "order.property.test.ts"
Cohesion: 0.06
Nodes (48): PointArguments, PointRun, CallEvent, Recorder, CheckName, GraphSpec, ModuleSpec, Pipeline (+40 more)

### Community 56 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.06
Nodes (41): RestoreBase, RestoreChain, BackupText, createReadStream(), hex(), checkBeforeLoading(), checkPublicBlock(), dumpLines() (+33 more)

### Community 57 - "contract-data-checks.ts"
Cohesion: 0.10
Nodes (48): BackupFacts, Manifest, Restored, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+40 more)

### Community 58 - "column-refusals.test.ts"
Cohesion: 0.07
Nodes (30): ModuleContentsFailure, ModuleTable, ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, Case (+22 more)

### Community 59 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (35): Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead(), engine() (+27 more)

### Community 6 - "admin-harness.ts"
Cohesion: 0.04
Nodes (89): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+81 more)

### Community 60 - "config-check.ts"
Cohesion: 0.06
Nodes (41): CheckFinding, ConfigCheckOptions, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState (+33 more)

### Community 61 - "config/build.ts"
Cohesion: 0.08
Nodes (40): BlockTransaction, CoreContractLogsFastOptions, FastLogReader, UnsureLog, UnsureReason, CoreContractLogsFullOptions, CoreContractStatesOptions, CoreLedgerVersion (+32 more)

### Community 62 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 64 - "process-backends.ts"
Cohesion: 0.11
Nodes (41): CoreLedgerStateOptions, GreyPicker, FixtureRun, FixtureRunOptions, TableSnapshot, refusalHalt(), refusalHeight(), runFixture() (+33 more)

### Community 65 - ".#open"
Cohesion: 0.09
Nodes (16): CoreTransport, ProcessReason, ReasonCode, Unwrapped, Process, StatusFacts, publicLockstepOf(), isListenFailure() (+8 more)

### Community 66 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 67 - "private/lockstep-wait.test.ts"
Cohesion: 0.07
Nodes (26): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+18 more)

### Community 68 - "worker-storage.test.ts"
Cohesion: 0.07
Nodes (35): ApplyInput, ApplyOutput, StateSummary, StoredNode, LedgerHeight, AdapterWorkerAnswer, AdapterWorkerRequest, LoadedState (+27 more)

### Community 7 - "process-admin.ts"
Cohesion: 0.04
Nodes (95): ConfigFacts, OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminStarter (+87 more)

### Community 70 - "module-tables.ts"
Cohesion: 0.08
Nodes (35): CaptureColumn, ModuleColumn, ModuleContentsError, PageOptions, ColumnType, RefusalCode, RefusalPlace, contentsHash() (+27 more)

### Community 71 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.08
Nodes (27): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+19 more)

### Community 72 - "ledger/types.ts"
Cohesion: 0.08
Nodes (34): LogSite, Program, V9Raw, LedgerEvent, LogItem, TransactionResult, VmLog, Freeable (+26 more)

### Community 73 - "loop.ts"
Cohesion: 0.09
Nodes (39): ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointSchedule, Invoke, LockstepWait (+31 more)

### Community 74 - ".concat"
Cohesion: 0.05
Nodes (32): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+24 more)

### Community 76 - "retirement.test.ts"
Cohesion: 0.07
Nodes (39): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), manifestProblems(), mutationProblems() (+31 more)

### Community 8 - "core-transport.ts"
Cohesion: 0.03
Nodes (96): ResultColumn, Session, TransportLimits, TransportTls, Committed, Hello, JsonValue, Message (+88 more)

### Community 82 - "core-chain-events.ts"
Cohesion: 0.09
Nodes (33): BlockEventSource, MetadataVariant, RuntimeMetadataView, ChainEvent, RecordTypes, ScaleValue, systemEventsKey(), bindCoreChainEvents() (+25 more)

### Community 83 - "node-format.ts"
Cohesion: 0.12
Nodes (24): Child, Reader, Readable, Reader, TableNode, node(), childKey(), concat() (+16 more)

### Community 84 - "core-settings.ts"
Cohesion: 0.06
Nodes (35): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+27 more)

### Community 85 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 89 - "validation.ts"
Cohesion: 0.06
Nodes (34): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+26 more)

### Community 9 - "NodeClient"
Cohesion: 0.05
Nodes (76): Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription, Waiter (+68 more)

### Community 91 - "version"
Cohesion: 0.06
Nodes (35): Version, version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV (+27 more)

### Community 92 - "ledger/load.ts"
Cohesion: 0.10
Nodes (21): AdapterSpec, LedgerRelease, LedgerReleasePackage, V9Logs, loadLedgerPackage(), createV8Adapter(), createV9Adapter(), createV9Rc3Adapter() (+13 more)

### Community 95 - "browser.test.ts"
Cohesion: 0.08
Nodes (34): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, StatusBody, continuedProblems(), midChainProblems() (+26 more)

### Community 96 - "page.ts"
Cohesion: 0.07
Nodes (29): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, appendLog(), backUp() (+21 more)

### Community 98 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (14): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, ReplayableStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema (+6 more)

### Community 183 - "4. Schema design"
Cohesion: 0.14
Nodes (14): 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy, 4. Schema design, v4 rewrite — the rollover runbook, rebuilt from four reproduced failures, run end-to-end for real (+6 more)

### Community 103 - "refused"
Cohesion: 0.06
Nodes (31): refused(), When a callback fails, 7. Storage helpers, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-5 `/status` and `/config` contents (+23 more)

### Community 106 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.06
Nodes (33): up(), name, 8. Migration, 1. Durability contract, 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 4. Save-retry caveat, 5. Lease limitation (+25 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 5. WalletState envelope, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier (+19 more)

### Community 119 - "migrations"
Cohesion: 0.07
Nodes (26): migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Migrations, ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped (+18 more)

### Community 124 - "ledger/ledger-tasks.test.ts"
Cohesion: 0.10
Nodes (22): bindLedgerTasks(), boundHost(), frozen(), hasLedgerTasks(), resultsOf(), withItems(), withLedgerTaskPoints(), withLedgerTasks() (+14 more)

### Community 192 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 200 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 213 - "Full-Chain Storage"
Cohesion: 0.17
Nodes (11): store(), 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 3. Semantic decode: `chain-archive-sync/tx-replay-decoder.ts`, 4. How to run it (+3 more)

### Community 214 - ".answer"
Cohesion: 0.20
Nodes (10): readBody(), serve(), apiErrorResponse(), matches(), read(), specificity(), 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence (+2 more)

### Community 215 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 223 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 227 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 230 - ".slowBlockMs"
Cohesion: 0.27
Nodes (8): 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix, 16. Whole system, Requirement: RN-17 A slow block is reported, never cut off, Scenario: A slow callback, Scenario: A slow callback after the commit

### Community 250 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 256 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 273 - "continueTo"
Cohesion: 0.40
Nodes (5): continueTo(), 00041 — A128 refused once and A130 hung once under load, each passing in every other run, Evidence, Problem, Suggested fix

### Community 286 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 313 - "Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data"
Cohesion: 0.40
Nodes (4): 2. Database API, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Scenario: A function in the configuration, Scenario: A user module from the configuration file

### Community 325 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 326 - "leanProblems"
Cohesion: 0.50
Nodes (4): leanImports(), leanProblems(), leanTheorems(), retiredLean()

### Community 43 - "history"
Cohesion: 0.04
Nodes (60): history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+52 more)

### Community 53 - "fn"
Cohesion: 0.04
Nodes (51): fn(), ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A resolved transaction handle always refers to its own live transaction, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly (+43 more)

### Community 63 - "code"
Cohesion: 0.05
Nodes (47): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21), The catalog, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog (+39 more)

### Community 78 - "table"
Cohesion: 0.05
Nodes (39): table(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, Blocks from the node, Cursor tables, Data that is not a function of the chain (+31 more)

### Community 80 - ".put"
Cohesion: 0.06
Nodes (38): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+30 more)

### Community 87 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (34): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change) (+26 more)

### Community 90 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.06
Nodes (36): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore (+28 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 128 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+19 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+18 more)

### Community 132 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 142 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.08
Nodes (18): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Superseded — see `Formal/STORAGE_ALGEBRA.md`, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan (+10 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 144 - "package.json"
Cohesion: 0.08
Nodes (24): bin, umbradb, bugs, url, description, exports, files, homepage (+16 more)

### Community 146 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 148 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+15 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.09
Nodes (22): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-1 The main program is a fixed sequence of points, Requirement: RN-2 The runner does only its five duties, Requirement: RN-4 Each point has fixed read and write permissions (+14 more)

### Community 155 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 157 - "Full-Chain Storage — Design"
Cohesion: 0.10
Nodes (20): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs, 3.5 Dust generation + ledger events (generic) (+12 more)

### Community 169 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 171 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.11
Nodes (16): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+8 more)

### Community 172 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 174 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 176 - "Storage Layer Interface Specification"
Cohesion: 0.12
Nodes (16): 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 3.1 Transaction/Lease layer (+8 more)

### Community 177 - "chain_archive lineage"
Cohesion: 0.12
Nodes (17): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, `chain_blobs` / `chain_blob_roles`, CheckpointStore tables, How the two lineages coexist (+9 more)

### Community 178 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 179 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 180 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 181 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 185 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 191 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 197 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 198 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 202 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 203 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 205 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.15
Nodes (12): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface (+4 more)

### Community 206 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 207 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.15
Nodes (12): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live` (+4 more)

### Community 209 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 216 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 217 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 218 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 219 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 5. Full-sync soak + load-under-concurrent-prune (G10), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring (+3 more)

### Community 221 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 222 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 224 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 225 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 229 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 231 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 232 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 233 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 235 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure, Design — Sprint 2: Transaction/Lease (+1 more)

### Community 236 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 237 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 238 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 243 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 244 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 245 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 246 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 247 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 248 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 249 - "conformance-gate.mjs"
Cohesion: 0.22
Nodes (8): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli

### Community 251 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 252 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 253 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 254 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 255 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 258 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 259 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 260 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 261 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 262 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 263 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 264 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 265 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 268 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 269 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 270 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 271 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 272 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.33
Nodes (5): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Resolution, Suggested fix

### Community 274 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 275 - "Proposal — Sprint 2: Transaction/Lease"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease, What changes, Why

### Community 276 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 277 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 278 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 279 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 280 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, What changes — the 1.0.0 gate items this change addresses, Why

### Community 281 - "Proposal — v1.0.0-infosec-signoff"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope — per the council rulings), Proposal — v1.0.0-infosec-signoff, What changes (the 1.0.0 gate items addressed), Why

### Community 282 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 283 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 284 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 285 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 289 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 290 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 291 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 292 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 293 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 294 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 295 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 296 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 297 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 298 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 299 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 300 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 301 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 302 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 303 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 304 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 305 - "00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask"
Cohesion: 0.40
Nodes (4): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix

### Community 306 - "00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`"
Cohesion: 0.40
Nodes (4): 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`, Evidence, Problem, Suggested fix

### Community 307 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 308 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 309 - "00042 — A stop while the loop waits on an unreachable node does not end the process"
Cohesion: 0.40
Nodes (4): 00042 — A stop while the loop waits on an unreachable node does not end the process, Evidence, Problem, Suggested fix

### Community 310 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 311 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 314 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

### Community 315 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 316 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 317 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 318 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 319 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 320 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 321 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 322 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 323 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 324 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 331 - "Requirement: RN-13 SIGTERM stops cleanly"
Cohesion: 0.67
Nodes (3): Requirement: RN-13 SIGTERM stops cleanly, Scenario: SIGTERM during a block transaction, Scenario: SIGTERM during startup, the node unreachable

### Community 332 - "Requirement: RN-3 Callbacks within a point run in a fixed order"
Cohesion: 0.67
Nodes (3): Requirement: RN-3 Callbacks within a point run in a fixed order, Scenario: A provider finishes before its consumer starts, Scenario: Unrelated modules write in id order

### Community 333 - "Requirement: RN-5 The block context carries one height's items"
Cohesion: 0.67
Nodes (3): Requirement: RN-5 The block context carries one height's items, Scenario: A second put is an error, Scenario: An item reaches a later callback of the same block

### Community 334 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 335 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 69 - "README.md"
Cohesion: 0.05
Nodes (33): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, [0.9.5] - 2026-07-25 — "Penumbra" (+25 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+32 more)

### Community 86 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 97 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.06
Nodes (36): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+28 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-8949`, `RFC-8949` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3668 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `chain-process.test.ts`, `fetch-fixtures.ts`, `db/api.ts`, `migrate.ts`, `config/history.ts`, `refused-configuration.test.ts`, `admin-harness.ts`, `process-admin.ts`, `core-transport.ts`, `NodeClient`, `validate.ts`, `tape/index.ts`, `adapter-fixtures.ts`, `declaration.ts`, `builder.test.ts`, `range.test.ts`, `client.test.ts`, `backup/restore.ts`, `.from`, `builds.ts`, `migrate.test.ts`, `BlockRef`, `height-versioned.test.ts`, `cli/command.ts`, `runner/process.ts`, `ref_node_fs`, `writer-lock-checks.ts`, `db/errors.ts`, `private/backends.ts`, `crash.test.ts`, `loop.test.ts`, `12. Ledger`, `core-ledger-state.ts`, `core-block-parsed.ts`, `version-checks.ts`, `process-worker.ts`, `backup/backup.ts`, `mapping.ts`, `slow-block-harness.ts`, `declaration`, `transform-checks.ts`, `ledger-storage.test.ts`, `column-rules.test.ts`, `order.property.test.ts`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `contract-data-checks.ts`, `column-refusals.test.ts`, `zero-timeouts-checks.ts`, `config-check.ts`, `process-backends.ts`, `.#open`, `boundary.test.ts`, `private/lockstep-wait.test.ts`, `worker-storage.test.ts`, `module-tables.ts`, `cold-boot-recovery.integration.test.ts`, `ledger/types.ts`, `retirement.test.ts`, `core-chain-events.ts`, `node-format.ts`, `core-settings.ts`, `networks.ts`, `validation.ts`, `ledger/load.ts`, `browser.test.ts`, `core-block-commit.test.ts`, `cbor.property.test.ts`, `task-modules.ts`, `PrivateTransport`, `vendored-ledger-v9.test.ts`, `code-registry.ts`, `startup-stop-harness.ts`, `api-server.test.ts`, `browser/build.ts`, `module-api.test.ts`, `config/plain-data.ts`, `type-check.ts`, `pg-tx-history-adapter.ts`, `restore-private.ts`, `ledger/ledger-tasks.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `containers.test.ts`, `digest.test.ts`, `process-context.test.ts`, `test/postgres/setup.ts`, `net.test.ts`, `package.json`, `5. Runner`, `block-fetch-decode.test.ts`, `node-bridge.ts`, `ledger-sweep.test.ts`, `package-identity.test.ts`, `lockstep-refusals.test.ts`, `readiness.test.ts`, `key-handling-checks.ts`, `transaction-history-storage.property.test.ts`, `worker-host.test.ts`, `src/config/load.ts`, `read-height.property.test.ts`, `ws-mutual-tls.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `web-lock.ts`, `excluded-not-exported.test.ts`, `twox.ts`, `worker-threads.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `history.property.test.ts`, `facade-merge-loader.ts`, `ledger/plain-data.test.ts`, `postgres-image.test.ts`, `vendored-ledger-files.test.ts`, `timeouts.test.ts`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `chain-process.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024321556579621095 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `chain-process.test.ts`, `fetch-fixtures.ts`, `db/api.ts`, `migrate.ts`, `config/history.ts`, `refused-configuration.test.ts`, `module-rules.ts`, `ProcessContexts`, `core-transport.ts`, `NodeClient`, `validate.ts`, `process-admin.ts`, `process-context.test.ts`, `tape/index.ts`, `builder.test.ts`, `client.test.ts`, `backup/restore.ts`, `builds.ts`, `migrate.test.ts`, `BlockRef`, `height-versioned.test.ts`, `5. Runner`, `runner/process.ts`, `column-rules.ts`, `vitest`, `writer-lock-checks.ts`, `db/errors.ts`, `checkShape`, `package-identity.test.ts`, `lockstep-refusals.test.ts`, `loop.test.ts`, `readiness.test.ts`, `core-ledger-state.ts`, `FinalizedLoop`, `12. Ledger`, `version-checks.ts`, `process-worker.ts`, `backup/backup.ts`, `version-table.ts`, `mapping.ts`, `slow-block-harness.ts`, `src/config/load.ts`, `declaration`, `range.ts`, `transform-checks.ts`, `cbor.ts`, `Tasks — CORE-ARCH: the standalone indexer's core architecture`, `statementsOf`, `zero-timeouts-checks.ts`, `config-check.ts`, `config/build.ts`, `graph.ts`, `.#open`, `web-lock.ts`, `module-tables.ts`, `loop.ts`, `table`, `validation.ts`, `core-block-commit.test.ts`, `sha256`, `task-modules.ts`, `PrivateTransport`, `ModuleApi`, `configured.ts`, `api-server.test.ts`, `module-api.test.ts`, `config/plain-data.ts`, `ReadHandle`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `fetch-fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03592552026286966 - nodes in this community are weakly interconnected._