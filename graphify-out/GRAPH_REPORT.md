# Graph Report - UmbraDB

## Corpus Check
- 986 files · ~1,456,078 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10488 nodes · 30516 edges · 341 communities (310 shown, 31 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2456 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `a434c8498109576f` (986 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- adapter-fixtures.ts
- LedgerPackage
- loop.ts
- cbor.property.test.ts
- crash.test.ts
- BlockRef
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- core-block-fetch/metadata.ts
- node-run.ts
- chain-placement.test.ts
- code-registry.ts
- binding.test.ts
- block-source.ts
- loggingModule
- chrome.ts
- config-hash-checks.ts
- process-worker.ts
- NodeClient
- interfaces/transaction-history-storage.ts
- pg-tx-history-adapter.ts
- shims.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- TransactionHistoryEntry
- node-format.ts
- sigterm.test.ts
- ProcessContexts
- core-block-parsed.ts
- ws-mutual-tls.test.ts
- referenceMergeEntries
- .value
- ledger-liveness.test.ts
- block-fetch-decode.test.ts
- config-check.ts
- no-indexer-or-wallet-sdk.test.ts
- placement.ts
- BlockItems
- HeightRun
- ingest-faults.test.ts
- height-versioned.test.ts
- transaction-history-storage.property.test.ts
- tape/index.ts
- lockstep-refusals.test.ts
- checkShape
- package-identity.test.ts
- checks.test.ts
- version-table.ts
- run.test.ts
- ref_node_path
- tapes.ts
- FakeNode
- commit-proxy.ts
- PortSocket
- ledger-storage.test.ts
- ledger/metadata.ts
- statementsOf
- attempt
- migrate.ts
- recovery.test.ts
- web-lock.ts
- height-versioned.property.test.ts
- config/history.ts
- InMemoryBlockSource
- 3. Proof-blocking findings
- ref_node_crypto
- run-fixtures.ts
- history.property.test.ts
- worker-threads-worker.ts
- buffer.ts
- adapter.ts
- Worker
- holds
- lifecycle.test.ts
- intake.test.ts
- builds.ts
- roles.ts
- postgres-image.test.ts
- stats.ts
- src/db/postgres.ts
- 5.1 Layer A: per-key temporal history
- worker-threads.test.ts
- UmbraError
- range.test.ts
- mutation-evidence.d.mts
- AsyncLocalStorage
- admin/configuration.ts
- process-build.ts
- worker-threads-host.ts
- Database
- runner/process.ts
- ReadHandle
- range.ts
- https.ts
- NodeFS
- .from
- TickerProcess
- entries.ts
- spawnChild
- refused-configuration.test.ts
- FinalizedLoop
- ModuleDeclaration
- fetch-fixtures.ts
- backup/backup.ts
- client.test.ts
- node.test.ts
- NodeBlockSource
- core-transport.ts
- admin-harness.ts
- writer-lock-checks.ts
- .read
- transform-checks.ts
- process-backends.ts
- vitest
- private/backends.ts
- core-ledger-state.ts
- cursor-table.test.ts
- contents-hash.ts
- chain-process.test.ts
- PgTransactionHistoryStorage
- determinism-checks.ts
- ledger-checks.ts
- cbor.ts
- opt-out.test.ts
- ingest-harness.ts
- ref_node_fs
- api-server.test.ts
- .put
- mapping.ts
- boundary.test.ts
- browser.test.ts
- graph.ts
- retirement.test.ts
- core-chain-events.ts
- zero-timeouts-checks.ts
- validate.ts
- restore-private.ts
- real-tapes.ts
- test/postgres/setup.ts
- declaration.ts
- db/errors.ts
- net.test.ts
- column-rules.ts
- transport-faults.test.ts
- changes.property.test.ts
- version-checks.ts
- graph.test.ts
- private/lockstep-wait.test.ts
- messages.ts
- browser/build.ts
- networks.ts
- backup/restore.ts
- process-context.test.ts
- database-fixtures.ts
- cold-boot-recovery.integration.test.ts
- change-capture.ts
- page.ts
- postgres/transaction-history-storage.ts
- 4. Schema design
- halted
- ADDED Requirements
- version
- restoreBackup
- .concat
- code
- decode
- .slowBlockMs
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- twox.ts
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- umbradb.test.ts
- pack-install.mjs
- scoped-review-manifest
- path.ts
- Performance — design
- crash-worker.ts
- fn
- history
- T
- table
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- graph.py
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
- ADDED Requirements
- package.json
- ROADMAP.md
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Full-Chain Storage — Design
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- UmbraDB
- stryker.conf.json
- README.md
- Storage Layer Interface Specification
- chain_archive lineage
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- Roadmap
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Design — Sprint 3: CheckpointStore
- Design — v1.0.0 API Surface & Release Contract
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- Security policy & threat model
- ADDED Requirements
- Tasks — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Contributing
- Checkpoint-store composition contract — cursor ordering and replay
- UmbraDB 1.0.0 Release Contracts
- Storage Algebra Lean M3a Watermarks Sprint
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- UmbraDB Durability Contract
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 12. Milestone status
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0-durable-checkpoint-cursor
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
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
- Proposal — v1.0.0 API Surface & Release Contract
- Tasks — v1.0.0-perf-baseline
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
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
- 00039 — A103's PostgreSQL case times out inside the full conformance run under load
- bug-report.md
- feature-request.md
- Design — CORE-ARCH: the standalone indexer's core architecture
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 306 edges
2. `UmbraError` - 295 edges
3. `ModuleDeclaration` - 162 edges
4. `FinalizedLoop` - 118 edges
5. `NodeClient` - 102 edges
6. `InMemoryBlockSource` - 101 edges
7. `Database` - 97 edges
8. `BlockRef` - 93 edges
9. `ReadHandle` - 84 edges
10. `5. Runner` - 75 edges

## Surprising Connections (you probably didn't know these)
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `Review notes` --references--> `JsonValue`  [INFERRED]
  design/design-interfaces.md → src/private/messages.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (341 total, 31 thin omitted)

### Community 0 - "adapter-fixtures.ts"
Cohesion: 0.04
Nodes (134): ApplyInput, ApplyOutput, StateSummary, StoredNode, AppliedState, LedgerHeight, recordedGenesis, Upstream (+126 more)

### Community 1 - "LedgerPackage"
Cohesion: 0.03
Nodes (97): BlockParsedOptions, LoadLedger, TransactionParser, RetainedState, LedgerName, LedgerEventKind, LedgerPackage, LedgerTask (+89 more)

### Community 10 - "loop.ts"
Cohesion: 0.04
Nodes (99): BlockHeader, PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, ParallelPoint, PointArguments (+91 more)

### Community 104 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 105 - "crash.test.ts"
Cohesion: 0.09
Nodes (27): EntryBoundary, CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, SkipsStartAtRestart, WORKER (+19 more)

### Community 106 - "BlockRef"
Cohesion: 0.10
Nodes (13): BlockLedgerSource, BlockRef, CommitOutcome, HeldHeight, Fetching, Recorder, LateRedelivery, Outcomes (+5 more)

### Community 107 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.06
Nodes (27): Key, Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws (+19 more)

### Community 108 - "core-block-fetch/metadata.ts"
Cohesion: 0.16
Nodes (22): ExtrinsicCall, MetadataPallet, MetadataStorage, MetadataStorageEntry, RuntimeMetadataView, TypeDef, ScaleError, callOf() (+14 more)

### Community 109 - "node-run.ts"
Cohesion: 0.11
Nodes (23): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, NodeRunResult, core(), databaseOf(), withDevelopmentOptIn() (+15 more)

### Community 11 - "chain-placement.test.ts"
Cohesion: 0.05
Nodes (103): BlockParsed, itemsSeen, BlockSpec, Json, Scenario, transactionSpec, eventsRuntime, Field (+95 more)

### Community 110 - "code-registry.ts"
Cohesion: 0.10
Nodes (28): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+20 more)

### Community 111 - "binding.test.ts"
Cohesion: 0.11
Nodes (26): TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), a113Problems() (+18 more)

### Community 114 - "block-source.ts"
Cohesion: 0.09
Nodes (18): FinalityStallCondition, gate, Decision, ReadinessCase, PrivateProcess, ae4(), caseText(), readinessProblems() (+10 more)

### Community 115 - "loggingModule"
Cohesion: 0.11
Nodes (26): AdminRun, dbKeeper(), listenOf(), startWithAdmin(), busy(), holder(), withRoute(), migrating() (+18 more)

### Community 116 - "chrome.ts"
Cohesion: 0.12
Nodes (13): Cdp, CdpEvent, ChromeBrowser, ChromeTab, Download, PageRequest, chrome(), chrome() (+5 more)

### Community 118 - "config-hash-checks.ts"
Cohesion: 0.10
Nodes (18): Report, A162Options, a162Run, HeaderSeen, ReportRelay, RetargetProxy, a162Problems(), asLogin() (+10 more)

### Community 119 - "process-worker.ts"
Cohesion: 0.13
Nodes (21): Scope, crossedError, StartRun, ToProcessWorker, openedProcess, adminAnswer(), messageAdmin(), databaseOptions() (+13 more)

### Community 12 - "NodeClient"
Cohesion: 0.05
Nodes (68): NodeSourceOptions, CoreChainBinding, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+60 more)

### Community 120 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryWriter, StoredEntryJson (+13 more)

### Community 121 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (23): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 124 - "shims.test.ts"
Cohesion: 0.11
Nodes (13): Buffer, Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL, K (+5 more)

### Community 126 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 127 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 128 - "TransactionHistoryEntry"
Cohesion: 0.14
Nodes (8): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), TransactionHistoryEntrySchema, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 13 - "node-format.ts"
Cohesion: 0.05
Nodes (69): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+61 more)

### Community 131 - "sigterm.test.ts"
Cohesion: 0.11
Nodes (21): Job, WorkEvent, WorkOptions, A48Observation, WORKER, Job, WorkerEvent, report() (+13 more)

### Community 136 - "ProcessContexts"
Cohesion: 0.11
Nodes (5): MisuseReports, ProcessContexts, ProcessItems, providesProcessItem(), sealed()

### Community 14 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (90): ContractLog, BlockTransaction, ChainTransaction, EventPhase, CoreContractLogsFastOptions, UnsureLog, FastLogReader, LoadAdapter (+82 more)

### Community 142 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 143 - "referenceMergeEntries"
Cohesion: 0.11
Nodes (19): MergeEntriesFn, isPlainObject(), mergeSections(), referenceMergeEntries(), 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 3.1 Field mapping (write path) (+11 more)

### Community 145 - ".value"
Cohesion: 0.24
Nodes (8): ScaleReader, ValueReader, blockTimeOf(), bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 146 - "ledger-liveness.test.ts"
Cohesion: 0.11
Nodes (19): SlowStep, TestLoaderData, hex(), beat(), countDeserializations(), hexOf(), loadLedger(), probe() (+11 more)

### Community 147 - "block-fetch-decode.test.ts"
Cohesion: 0.14
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 15 - "config-check.ts"
Cohesion: 0.04
Nodes (77): privateIntake, ManifestHistoryRow, ManifestMigration, CommandBuildOptions, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams (+69 more)

### Community 151 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.14
Nodes (12): Finding, Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), CONFIG (+4 more)

### Community 153 - "placement.ts"
Cohesion: 0.14
Nodes (19): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, CoreBlockItems, decodeExtrinsics(), callVariant(), carried() (+11 more)

### Community 154 - "BlockItems"
Cohesion: 0.13
Nodes (11): QueuedBlock, BlockItems, LateUse, EagerItems, EagerLoop, KeptItems, KeptLoop, revisionAt() (+3 more)

### Community 155 - "HeightRun"
Cohesion: 0.11
Nodes (8): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, WaitsInTransaction, ComputeAtH, WritingLoop

### Community 156 - "ingest-faults.test.ts"
Cohesion: 0.15
Nodes (16): ProcessCondition, A84Observation, LoggedRetry, OutageObservation, RetrySample, a84Run(), a84Tape(), askingAgain() (+8 more)

### Community 157 - "height-versioned.test.ts"
Cohesion: 0.14
Nodes (14): BlockFails, Height, tokenMetadata(), versionedDatabase(), versionsOf(), outcome(), secondChangeProblems(), stateOf() (+6 more)

### Community 159 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 16 - "tape/index.ts"
Cohesion: 0.05
Nodes (60): Recorded, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError (+52 more)

### Community 161 - "lockstep-refusals.test.ts"
Cohesion: 0.21
Nodes (18): LockstepCondition, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn(), haltOf() (+10 more)

### Community 162 - "checkShape"
Cohesion: 0.25
Nodes (10): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), Requirement: DT-2 Primary-key order (+2 more)

### Community 164 - "package-identity.test.ts"
Cohesion: 0.19
Nodes (16): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+8 more)

### Community 165 - "checks.test.ts"
Cohesion: 0.11
Nodes (10): IntegerRules, Case, outcome(), started(), write(), INTEGER_CHECK_PREFIX, INTEGER_RULES, CASES (+2 more)

### Community 166 - "version-table.ts"
Cohesion: 0.21
Nodes (18): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+10 more)

### Community 167 - "run.test.ts"
Cohesion: 0.13
Nodes (15): statsConfig, inProcess(), check(), check(), write(), runCoreSettings(), runInChild(), headAt() (+7 more)

### Community 17 - "ref_node_path"
Cohesion: 0.06
Nodes (68): CommandHandler, CommandIo, MainProcess, BackupBackend, BackupDatabase, killedRestore, TickerConfig, cliProject (+60 more)

### Community 172 - "tapes.ts"
Cohesion: 0.24
Nodes (16): EventSpec, browserChain, blockRef(), headRead(), opening(), restartTape(), outageTape(), at() (+8 more)

### Community 174 - "commit-proxy.ts"
Cohesion: 0.16
Nodes (8): Armed, CommitArm, CommitFault, CommitProxy, Pair, tailOf(), COMMIT_COMPLETE, COMMIT_QUERY

### Community 175 - "PortSocket"
Cohesion: 0.19
Nodes (6): PortSocket, 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix, Contract states and contract logs

### Community 18 - "ledger-storage.test.ts"
Cohesion: 0.06
Nodes (82): FixtureRun, ingest, SeenLoad, retentionSeen, LedgerTx, TableSnapshot, ledgerBackup, FixtureNode (+74 more)

### Community 185 - "ledger/metadata.ts"
Cohesion: 0.20
Nodes (5): MetadataBlock, RuntimeMetadata, RuntimeMetadataEntry, contentStateOf(), hexOf()

### Community 186 - "statementsOf"
Cohesion: 0.25
Nodes (11): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+3 more)

### Community 187 - "attempt"
Cohesion: 0.15
Nodes (14): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+6 more)

### Community 19 - "migrate.ts"
Cohesion: 0.05
Nodes (77): Transaction, AppliedRow, Runnable, Settling, StartupInput, MultiStatementRunner, PlannedSchema, BlockWrites (+69 more)

### Community 190 - "recovery.test.ts"
Cohesion: 0.23
Nodes (14): AlwaysLost, Fault, Recorded, RecoveryObservation, committedProblems(), count(), landedProblems(), neitherProblems() (+6 more)

### Community 191 - "web-lock.ts"
Cohesion: 0.21
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 197 - "height-versioned.property.test.ts"
Cohesion: 0.15
Nodes (12): Block, BlockFails, Counts, Effect, Op, canonicalText(), readBack(), structureProblems() (+4 more)

### Community 2 - "config/history.ts"
Cohesion: 0.04
Nodes (125): CoreVersion, CoreSettings, versionEntry, ConfigHashRow, HistoryCode, HistoryContext, HistoryFinding, HistoryOptions (+117 more)

### Community 20 - "InMemoryBlockSource"
Cohesion: 0.05
Nodes (70): InMemoryBlockSource, LockstepWait, Flaky, Contexts, Faults, LostCommit, Seen, AtGate (+62 more)

### Community 202 - "3. Proof-blocking findings"
Cohesion: 0.15
Nodes (13): Absent, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces (+5 more)

### Community 204 - "ref_node_crypto"
Cohesion: 0.19
Nodes (11): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, JsonbNumberRule, checkFunctionsSql(), numericOkPredicate(), refusedNumbersPath(), verdicts() (+3 more)

### Community 205 - "run-fixtures.ts"
Cohesion: 0.19
Nodes (9): RunningCommand, adminPortIn(), chainNode(), chainTape(), exitWithin(), statsModule(), CHAIN, HEAD (+1 more)

### Community 206 - "history.property.test.ts"
Cohesion: 0.22
Nodes (10): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 208 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 209 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 21 - "adapter.ts"
Cohesion: 0.04
Nodes (72): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+64 more)

### Community 213 - "holds"
Cohesion: 0.42
Nodes (5): VersionedValue, StoredVersion, Model, holds(), same()

### Community 214 - "lifecycle.test.ts"
Cohesion: 0.18
Nodes (7): Child, heldPort(), startChild(), startWorker(), ADMIN_GENESIS, REPOSITORY, WORKER

### Community 215 - "intake.test.ts"
Cohesion: 0.33
Nodes (11): PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), follow(), heights(), readProblems() (+3 more)

### Community 22 - "builds.ts"
Cohesion: 0.05
Nodes (60): adminRoutes, AdminServer, AdminStartOptions, AdminAnswer, AdminEndpoint, AdminPart, AdminSnapshot, AdminView (+52 more)

### Community 23 - "roles.ts"
Cohesion: 0.04
Nodes (66): SchemaWriteHandle, MigrationPart, Difference, Provision, QualifiedTable, SchemaItem, SchemaMigration, SchemaModule (+58 more)

### Community 233 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 234 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 24 - "src/db/postgres.ts"
Cohesion: 0.04
Nodes (57): BenchEnv, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, BoundedRead, DriverError, Outcome (+49 more)

### Community 246 - "5.1 Layer A: per-key temporal history"
Cohesion: 0.25
Nodes (8): Version, 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 25 - "UmbraError"
Cohesion: 0.05
Nodes (51): LoadedConfig, LoadOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, ConfiguredDatabaseOptions, CommittedHeight, ReadOptions (+43 more)

### Community 26 - "range.test.ts"
Cohesion: 0.04
Nodes (49): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Script, ScriptedNode, ScriptedRequest (+41 more)

### Community 262 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 27 - "admin/configuration.ts"
Cohesion: 0.05
Nodes (69): AllowedDetail, RevisionSettings, DeclarationView, EntryView, RecordedView, SanitizedError, databaseTarget, coreEntry (+61 more)

### Community 28 - "process-build.ts"
Cohesion: 0.06
Nodes (59): ProcessingEnd, A43Observation, CommitsDespiteLastWrite, Outcome, CoreSeen, testBuild, A42Observation, Seen (+51 more)

### Community 284 - "worker-threads-host.ts"
Cohesion: 0.40
Nodes (4): Listener, isMainThread, parentPort, workerData

### Community 29 - "Database"
Cohesion: 0.04
Nodes (58): Bound, Database, ReadOnlyDatabase, SchemaPlan, Commit, Committed, TestBackend, TestDatabase (+50 more)

### Community 3 - "runner/process.ts"
Cohesion: 0.03
Nodes (76): ChainIdentity, ChainSource, NodeWait, WaitingListener, LedgerTable, CoreTransport, ProcessReason, ReasonCode (+68 more)

### Community 30 - "ReadHandle"
Cohesion: 0.04
Nodes (52): ReadHandle, OwnPart, ApiRegistry, FieldKind, FieldSchema, ItemDeclaration, Lifetime, PointCallbacks (+44 more)

### Community 31 - "range.ts"
Cohesion: 0.04
Nodes (62): BoundaryBlockReading, BoundaryOptions, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command (+54 more)

### Community 32 - ".from"
Cohesion: 0.07
Nodes (67): ContractStateRow, CoreContractStatesOptions, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+59 more)

### Community 33 - "entries.ts"
Cohesion: 0.04
Nodes (60): ConfiguredDatabase, CoreEntryInput, CoreSettingsBase, Entry, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+52 more)

### Community 34 - "spawnChild"
Cohesion: 0.04
Nodes (56): ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+48 more)

### Community 35 - "refused-configuration.test.ts"
Cohesion: 0.06
Nodes (66): ProcessConfig, Answered, Observation, Start, Refusal, Start, startProcess(), adminCore() (+58 more)

### Community 36 - "FinalizedLoop"
Cohesion: 0.06
Nodes (16): Activity, FinalizedLoop, LoopObserver, UnexpectedCursor, Startup, WaitingInRead, SilentHalt, FailingAfter (+8 more)

### Community 37 - "ModuleDeclaration"
Cohesion: 0.06
Nodes (60): ConfigFacts, OpenedConfig, OpenedFacts, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, AdminStarter, DigestRow (+52 more)

### Community 38 - "fetch-fixtures.ts"
Cohesion: 0.06
Nodes (58): ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded, FetchSeen, Watched (+50 more)

### Community 39 - "backup/backup.ts"
Cohesion: 0.06
Nodes (61): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestTool, DumpInput (+53 more)

### Community 4 - "client.test.ts"
Cohesion: 0.03
Nodes (86): Connection, NodeCallOptions, NodeClientOptions, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers (+78 more)

### Community 40 - "node.test.ts"
Cohesion: 0.05
Nodes (33): Metadata, Step, Frame, RawClient, Failure, Variant, TapeError, TapeClock (+25 more)

### Community 41 - "NodeBlockSource"
Cohesion: 0.07
Nodes (19): HeadWait, NodeBlockSource, Prefetch, NodeSubscription, NodeHeader, PreparedBlock, QueueRunner, SourceCondition (+11 more)

### Community 42 - "core-transport.ts"
Cohesion: 0.06
Nodes (39): PublicSide, Session, TransportLimits, TransportTls, Hello, HelloAck, JsonValue, ReadResult (+31 more)

### Community 43 - "admin-harness.ts"
Cohesion: 0.05
Nodes (49): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, Heartbeat, Answerer, Expected, Hold (+41 more)

### Community 44 - "writer-lock-checks.ts"
Cohesion: 0.07
Nodes (45): PostgresOptions, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PostgresTestServer, PauseReport, startWriter() (+37 more)

### Community 45 - ".read"
Cohesion: 0.05
Nodes (56): Chain, ChainOptions, DigestRow, identityRow(), captured(), hex(), moduleM(), restart() (+48 more)

### Community 46 - "transform-checks.ts"
Cohesion: 0.08
Nodes (43): Failure, Variant, TransformError, NotifyRecord, recordKind, SubscriptionId, CallSelection, NotificationRange (+35 more)

### Community 47 - "process-backends.ts"
Cohesion: 0.08
Nodes (51): BlockItemSource, LoopInput, ReadOpener, SlowWindow, StatusBody, Times, Wait, askedSource (+43 more)

### Community 48 - "vitest"
Cohesion: 0.06
Nodes (29): Settings, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, askedLater() (+21 more)

### Community 49 - "private/backends.ts"
Cohesion: 0.06
Nodes (36): PrivateBackend, SessionSeen, Pem, TestCertificates, Pause, Q142Observation, SkipsLockstep, InstancesOptions (+28 more)

### Community 5 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (92): CoreLedgerStateOptions, LedgerBinding, LedgerStateItem, retainedStates, CoreRevision, GreyPicker, GreyView, SweepPhase (+84 more)

### Community 50 - "cursor-table.test.ts"
Cohesion: 0.05
Nodes (42): BlockWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, BlockContext, Migration (+34 more)

### Community 51 - "contents-hash.ts"
Cohesion: 0.07
Nodes (42): ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, ConsistentRead, DeterminismBackend, TestDatabase (+34 more)

### Community 52 - "chain-process.test.ts"
Cohesion: 0.06
Nodes (45): InMemoryItems, InMemorySourceOptions, Wait, ProcessHandle, WorkerEvent, A77Observation, A78Observation, A78Refusal (+37 more)

### Community 53 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (50): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order) (+42 more)

### Community 54 - "determinism-checks.ts"
Cohesion: 0.08
Nodes (41): PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, TestLink, A155Observation, Outcome (+33 more)

### Community 55 - "ledger-checks.ts"
Cohesion: 0.07
Nodes (40): ChildReader, LedgerEvent, NodeStore, TransactionResult, VmLog, Thread, BridgeServer, bridgeStore (+32 more)

### Community 56 - "cbor.ts"
Cohesion: 0.08
Nodes (45): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+37 more)

### Community 57 - "opt-out.test.ts"
Cohesion: 0.09
Nodes (28): CheckedMigration, RefusalCode, RefusalPlace, optOut, Case, settle(), attachIntegerChecks(), refuseNonDeterministic() (+20 more)

### Community 58 - "ingest-harness.ts"
Cohesion: 0.08
Nodes (44): Restored, RestoreInput, CrashEvent, CrashJob, SourceClass, watched, RestartEvent, RestartJob (+36 more)

### Community 59 - "ref_node_fs"
Cohesion: 0.05
Nodes (37): Lockfile, Manifest, Upstream, Leftover, RemovedName, ReportedTest, filesUnder(), patchesOf() (+29 more)

### Community 6 - "api-server.test.ts"
Cohesion: 0.03
Nodes (91): ModuleApiServer, ModuleApiStart, StartedModuleApi, ResolvedGraph, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions (+83 more)

### Community 60 - ".put"
Cohesion: 0.05
Nodes (46): ItemSink, "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks (+38 more)

### Community 61 - "mapping.ts"
Cohesion: 0.07
Nodes (36): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+28 more)

### Community 62 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, own(), collationsWritten(), componentCode(), componentExports(), componentTexts() (+34 more)

### Community 65 - "browser.test.ts"
Cohesion: 0.08
Nodes (46): Reachable, RestoreAttempt, PageBackup, PageEvent, PageRestore, ProcessName, StatusBody, continuedProblems() (+38 more)

### Community 66 - "graph.ts"
Cohesion: 0.07
Nodes (46): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeFacts, Spanned (+38 more)

### Community 67 - "retirement.test.ts"
Cohesion: 0.07
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 68 - "core-chain-events.ts"
Cohesion: 0.08
Nodes (39): BlockEventSource, MetadataField, MetadataType, MetadataVariant, Primitive, ChainEvent, RecordTypes, ScaleValue (+31 more)

### Community 69 - "zero-timeouts-checks.ts"
Cohesion: 0.08
Nodes (35): Run, Job, WorkerEvent, Outcome, openBlockWrites(), expectNeverCutOffNorHung(), settings(), apiRead() (+27 more)

### Community 7 - "validate.ts"
Cohesion: 0.03
Nodes (111): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfigRule, CursorRule, EntryRef, Finding, Issue (+103 more)

### Community 70 - "restore-private.ts"
Cohesion: 0.08
Nodes (34): RestoreChain, RestoreSeams, Chain, RestoreCommandOptions, RestoreCommandSeams, RestoreOutcome, RestoreJob, FileProcess (+26 more)

### Community 72 - "real-tapes.ts"
Cohesion: 0.07
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 73 - "test/postgres/setup.ts"
Cohesion: 0.06
Nodes (35): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, Sql, SuiteWatchdogTimeoutError, pool() (+27 more)

### Community 76 - "declaration.ts"
Cohesion: 0.06
Nodes (37): EntryBuilder, DefinedModule, KnownPointsOnly, TableDeclaration, DeclarationRule, PlacedDeclaration, Plain, Case (+29 more)

### Community 77 - "db/errors.ts"
Cohesion: 0.08
Nodes (28): PostgresOptions, ReadTimeoutSetting, ErrorCode, ErrorDetails, Case, HeldRead, Job, Outcome (+20 more)

### Community 78 - "net.test.ts"
Cohesion: 0.08
Nodes (21): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortUpgrade (+13 more)

### Community 8 - "column-rules.ts"
Cohesion: 0.02
Nodes (102): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+94 more)

### Community 81 - "transport-faults.test.ts"
Cohesion: 0.09
Nodes (29): ResultColumn, Message, MessageType, Ended, rawClient, endedWithin(), hello(), tlsProblems() (+21 more)

### Community 83 - "changes.property.test.ts"
Cohesion: 0.08
Nodes (36): ChangeKind, tableChanges, TouchedRow, Op, States, TableName, digestBlock(), encodeCanonical() (+28 more)

### Community 84 - "version-checks.ts"
Cohesion: 0.13
Nodes (29): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, Answers, toHex() (+21 more)

### Community 85 - "graph.test.ts"
Cohesion: 0.08
Nodes (36): EntryRange, GraphInput, PastFaultCase, RefusalCase, reader(), backboneWithout(), blockItem(), consumer() (+28 more)

### Community 86 - "private/lockstep-wait.test.ts"
Cohesion: 0.08
Nodes (24): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+16 more)

### Community 87 - "messages.ts"
Cohesion: 0.07
Nodes (34): Committed, MessageFault, Parsed, Read, bytesOf(), decodeParameter(), decodeValue(), describe() (+26 more)

### Community 88 - "browser/build.ts"
Cohesion: 0.07
Nodes (30): BrowserBuild, BrowserBuildOptions, BrowserControl, pageBench, PageServer, browserLedgerEntry(), browserPlugin(), buildBrowser() (+22 more)

### Community 89 - "networks.ts"
Cohesion: 0.06
Nodes (35): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, ConfiguredLedgerTable (+27 more)

### Community 9 - "backup/restore.ts"
Cohesion: 0.03
Nodes (63): ChainCheck, ChainCheckInput, ConfiguredGenesis, PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, SourceTransport, PublicConfiguration (+55 more)

### Community 93 - "process-context.test.ts"
Cohesion: 0.08
Nodes (26): MisuseListener, PublishRefusal, AcceptsDuplicates, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass, serving() (+18 more)

### Community 95 - "database-fixtures.ts"
Cohesion: 0.06
Nodes (28): CheckTarget, CliBackend, Snapshot, Report, Job, openPgliteOn(), blocksSql(), pgliteCliBackend() (+20 more)

### Community 96 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.10
Nodes (22): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), registerSuiteLifecycle() (+14 more)

### Community 97 - "change-capture.ts"
Cohesion: 0.09
Nodes (29): CaptureColumn, CapturedTable, CaptureState, ModuleColumn, GuardTableRow, ColumnType, captureDefinitions(), capturedTables() (+21 more)

### Community 98 - "page.ts"
Cohesion: 0.07
Nodes (30): PageState, ProcessView, RestoreRecord, SavedBackup, WorkerView, CallMethod, FromProcessWorker, appendLog() (+22 more)

### Community 99 - "postgres/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (22): JsonEncoded, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent(), encodeSections() (+14 more)

### Community 133 - "4. Schema design"
Cohesion: 0.08
Nodes (23): 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy, 4. Schema design, v4 rewrite — the rollover runbook, rebuilt from four reproduced failures, run end-to-end for real (+15 more)

### Community 100 - "halted"
Cohesion: 0.07
Nodes (34): refused(), halted(), When a callback fails, 7. Storage helpers, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions (+26 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.06
Nodes (28): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage, ADDED Requirements (+20 more)

### Community 113 - "version"
Cohesion: 0.07
Nodes (27): version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5) (+19 more)

### Community 117 - "restoreBackup"
Cohesion: 0.10
Nodes (21): createReadStream(), readPrivateBinding(), dumpLines(), isEmptyDatabase(), load(), notEmpty(), restoreBackup(), textOf() (+13 more)

### Community 132 - ".concat"
Cohesion: 0.08
Nodes (22): probe(), holds(), records, 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness (+14 more)

### Community 134 - "code"
Cohesion: 0.10
Nodes (25): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21), The catalog, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog (+17 more)

### Community 149 - "decode"
Cohesion: 0.11
Nodes (20): decode(), Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Scenario: A future-versioned envelope is rejected cleanly, Scenario: An unknown top-level field is rejected as a typed envelope error (F7), Scenario: Non-JSON bytes are rejected as a typed envelope error, Scenario: Structurally invalid JSON is rejected as a typed envelope error, 0. Specification freeze (+12 more)

### Community 158 - ".slowBlockMs"
Cohesion: 0.12
Nodes (17): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross, Evidence, Problem, Suggested fix (+9 more)

### Community 160 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (18): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface (+10 more)

### Community 189 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 198 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 211 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 218 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 221 - "umbradb.test.ts"
Cohesion: 0.24
Nodes (10): configText(), coreSettings(), inChild(), lineOf(), core(), fileOf(), coreOnly(), withStats() (+2 more)

### Community 222 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 224 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 241 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 248 - "Performance — design"
Cohesion: 0.25
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 312 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 63 - "fn"
Cohesion: 0.05
Nodes (48): fn(), 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure (+40 more)

### Community 64 - "history"
Cohesion: 0.05
Nodes (47): integer(), history(), Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate, Scenario: A call with an already-aborted signal is rejected before any database work, Scenario: A label given at save time is returned by history and load, Scenario: A signal aborting after the call has begun does not interrupt it (+39 more)

### Community 79 - "T"
Cohesion: 0.05
Nodes (37): n(), T(), input(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 4. Transaction / Lease — the control algebra the other three run inside, 5. Testable-law deliverable (fast-check + Vitest) (+29 more)

### Community 80 - "table"
Cohesion: 0.05
Nodes (38): migrations(), table(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, Cursor tables (+30 more)

### Community 91 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (34): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change) (+26 more)

### Community 94 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 102 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+29 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 130 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+18 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence (+17 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence (+17 more)

### Community 139 - "package.json"
Cohesion: 0.08
Nodes (24): bin, umbradb, bugs, url, description, exports, files, homepage (+16 more)

### Community 140 - "ROADMAP.md"
Cohesion: 0.08
Nodes (18): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+10 more)

### Community 141 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 144 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+15 more)

### Community 148 - "Full-Chain Storage — Design"
Cohesion: 0.09
Nodes (22): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+14 more)

### Community 150 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 163 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 168 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.11
Nodes (16): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+8 more)

### Community 169 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.11
Nodes (17): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.2 Postgres-kill mid-save + retry-duplication contract (T2) — `02`-T2; `council/B` §3 item 2, 2.3 Crash between data and cursor — the keystone (T5) — `02`-T5; `council/B` §3 item 3; §5 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4, 2. G9 — the four crash tests, 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3) (+9 more)

### Community 170 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 171 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 176 - "README.md"
Cohesion: 0.18
Nodes (9): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased], Generate your local wallet, Test wallets (+1 more)

### Community 177 - "Storage Layer Interface Specification"
Cohesion: 0.12
Nodes (16): 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 3.1 Transaction/Lease layer (+8 more)

### Community 178 - "chain_archive lineage"
Cohesion: 0.12
Nodes (17): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, `chain_blobs` / `chain_blob_roles`, CheckpointStore tables, How the two lineages coexist (+9 more)

### Community 179 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (17): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+9 more)

### Community 180 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 181 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 182 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 183 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 184 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 188 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 192 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 193 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 194 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.14
Nodes (13): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 5. `history` — pagination (+5 more)

### Community 195 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.14
Nodes (13): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 3.1 The frozen catalog (the machine-facing API), 3.2 Promote retryability to a machine-readable field, 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+5 more)

### Community 199 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 200 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 201 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.15
Nodes (13): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol, 6.1 Approved M1 module layout (+5 more)

### Community 203 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 207 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 212 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 216 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 217 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 219 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 220 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 223 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 225 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 226 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 227 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 228 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 229 - "Tasks — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 1. Pre-freeze: retryability field (G3), 2. Pre-freeze: strip / mark-experimental the chain-archive error classes (G3), 3. The freeze: build + package.json (G1), 4. The freeze: the public barrel (G1), 5. Release contract docs (G2, G4), 6. Freeze the Lean cut-line (G20), 7. Packed-tarball install smoke test (G1), 8. Change close-out (+1 more)

### Community 230 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 231 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 232 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

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

### Community 239 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 240 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 242 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 243 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 244 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.25
Nodes (8): 1. Durability contract, 3. Cancellation semantics, 4. Save-retry caveat, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 245 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 247 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 250 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 251 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 252 - "UmbraDB Durability Contract"
Cohesion: 0.29
Nodes (6): 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 4. Session-mode connection pooling only — probe-enforced (best-effort), 5. Server-side timeouts — applied by `createClient` (documented), Summary, UmbraDB Durability Contract

### Community 253 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 254 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 255 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 256 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 257 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, G8 — Contract-integrity fixes, Whole-change gates (non-goal compliance + sequencing)

### Community 258 - "Tasks — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.29
Nodes (6): 0. G5 — Co-transactional watermark + checkpoint data (do first; pre-freeze, signature-changing), 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts, 3. G8 — Contract-integrity fixes, 4. Change close-out, Tasks — v1.0.0-durable-checkpoint-cursor

### Community 259 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 260 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 261 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 264 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 265 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
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

### Community 270 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 271 - "Proposal — Sprint 4: Watermarks"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes, Why

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

### Community 277 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 278 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 279 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 280 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 281 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 282 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 283 - "Vendored ledger builds"
Cohesion: 0.33
Nodes (5): Rebuilding, Updating a version, v9-rc3: ledger v9 as runtime 2.0 built it, Vendored ledger builds, What the patches add

### Community 285 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 286 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 287 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 288 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 289 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 290 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 291 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 292 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 293 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 294 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 295 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 296 - "00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 297 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 298 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 299 - "00039 — A103's PostgreSQL case times out inside the full conformance run under load"
Cohesion: 0.40
Nodes (4): 00039 — A103's PostgreSQL case times out inside the full conformance run under load, Evidence, Problem, Suggested fix

### Community 300 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 301 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 302 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.40
Nodes (4): 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), 14. External claims and their evidence, 15. Relation to the existing design documents, Design — CORE-ARCH: the standalone indexer's core architecture

### Community 303 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 304 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 305 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 306 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 307 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 308 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 309 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 310 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 311 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 317 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 318 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 71 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 90 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-8949`, `RFC-8949`, `RFC-3339`, `RFC-8949`, `RFC-3339` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3628 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `adapter-fixtures.ts`, `LedgerPackage`, `config/history.ts`, `runner/process.ts`, `client.test.ts`, `core-ledger-state.ts`, `api-server.test.ts`, `validate.ts`, `column-rules.ts`, `backup/restore.ts`, `loop.ts`, `chain-placement.test.ts`, `NodeClient`, `node-format.ts`, `core-block-parsed.ts`, `config-check.ts`, `tape/index.ts`, `ref_node_path`, `ledger-storage.test.ts`, `migrate.ts`, `InMemoryBlockSource`, `adapter.ts`, `builds.ts`, `roles.ts`, `src/db/postgres.ts`, `UmbraError`, `range.test.ts`, `admin/configuration.ts`, `process-build.ts`, `Database`, `ReadHandle`, `.from`, `entries.ts`, `spawnChild`, `refused-configuration.test.ts`, `fetch-fixtures.ts`, `backup/backup.ts`, `node.test.ts`, `core-transport.ts`, `admin-harness.ts`, `writer-lock-checks.ts`, `.read`, `transform-checks.ts`, `process-backends.ts`, `private/backends.ts`, `cursor-table.test.ts`, `contents-hash.ts`, `chain-process.test.ts`, `determinism-checks.ts`, `ledger-checks.ts`, `opt-out.test.ts`, `ingest-harness.ts`, `ref_node_fs`, `mapping.ts`, `boundary.test.ts`, `browser.test.ts`, `retirement.test.ts`, `core-chain-events.ts`, `zero-timeouts-checks.ts`, `restore-private.ts`, `real-tapes.ts`, `test/postgres/setup.ts`, `declaration.ts`, `db/errors.ts`, `net.test.ts`, `transport-faults.test.ts`, `changes.property.test.ts`, `version-checks.ts`, `graph.test.ts`, `private/lockstep-wait.test.ts`, `messages.ts`, `browser/build.ts`, `networks.ts`, `process-context.test.ts`, `database-fixtures.ts`, `cold-boot-recovery.integration.test.ts`, `postgres/transaction-history-storage.ts`, `cbor.property.test.ts`, `crash.test.ts`, `code-registry.ts`, `binding.test.ts`, `block-source.ts`, `loggingModule`, `restoreBackup`, `pg-tx-history-adapter.ts`, `shims.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `sigterm.test.ts`, `package.json`, `ws-mutual-tls.test.ts`, `ledger-liveness.test.ts`, `block-fetch-decode.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `BlockItems`, `ingest-faults.test.ts`, `height-versioned.test.ts`, `transaction-history-storage.property.test.ts`, `lockstep-refusals.test.ts`, `package-identity.test.ts`, `checks.test.ts`, `run.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `recovery.test.ts`, `web-lock.ts`, `excluded-not-exported.test.ts`, `height-versioned.property.test.ts`, `twox.ts`, `history.property.test.ts`, `facade-merge-loader.ts`, `lifecycle.test.ts`, `intake.test.ts`, `umbradb.test.ts`, `postgres-image.test.ts`, `worker-threads.test.ts`?**
  _High betweenness centrality (0.267) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `adapter-fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03557852221430269 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `LedgerPackage`, `config/history.ts`, `runner/process.ts`, `client.test.ts`, `core-ledger-state.ts`, `api-server.test.ts`, `validate.ts`, `ProcessContexts`, `backup/restore.ts`, `loop.ts`, `NodeClient`, `range.ts`, `core-block-parsed.ts`, `config-check.ts`, `migrate.ts`, `InMemoryBlockSource`, `builds.ts`, `roles.ts`, `src/db/postgres.ts`, `admin/configuration.ts`, `process-build.ts`, `Database`, `ReadHandle`, `ingest-faults.test.ts`, `height-versioned.test.ts`, `entries.ts`, `checkShape`, `refused-configuration.test.ts`, `package-identity.test.ts`, `checks.test.ts`, `version-table.ts`, `backup/backup.ts`, `fetch-fixtures.ts`, `NodeBlockSource`, `core-transport.ts`, `lockstep-refusals.test.ts`, `writer-lock-checks.ts`, `FinalizedLoop`, `ModuleDeclaration`, `process-backends.ts`, `vitest`, `transform-checks.ts`, `cursor-table.test.ts`, `contents-hash.ts`, `chain-process.test.ts`, `determinism-checks.ts`, `cbor.ts`, `opt-out.test.ts`, `statementsOf`, `ingest-harness.ts`, `ledger/metadata.ts`, `mapping.ts`, `web-lock.ts`, `graph.ts`, `zero-timeouts-checks.ts`, `restore-private.ts`, `declaration.ts`, `db/errors.ts`, `table`, `transport-faults.test.ts`, `changes.property.test.ts`, `version-checks.ts`, `graph.test.ts`, `process-context.test.ts`, `BlockRef`, `binding.test.ts`, `block-source.ts`, `restoreBackup`, `shims.test.ts`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `LedgerPackage` be split into smaller, more focused modules?**
  _Cohesion score 0.029000062770698637 - nodes in this community are weakly interconnected._