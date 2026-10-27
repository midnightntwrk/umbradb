# Graph Report - UmbraDB

## Corpus Check
- 970 files · ~1,431,130 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 66 file(s) not represented in the graph (top: .patch 18, (none) 14, .lean 11)

## Summary
- 10361 nodes · 29902 edges · 328 communities (299 shown, 29 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2402 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `38da05c9759d1a84` (970 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- admin-harness.ts
- Database
- durability-probe.test.ts
- core-contract-logs-fast.ts
- src/config/load.ts
- mapping.ts
- in-memory-source.ts
- ledger/load.ts
- node-run.ts
- module-tables.ts
- TransactionHistoryEntry
- validation.ts
- cli/command.ts
- version-checks.ts
- private/lockstep-wait.test.ts
- browser/build.ts
- lockstep-refusals.test.ts
- process-context.test.ts
- core-private-source.test.ts
- Lockstep
- crash.test.ts
- builds.ts
- binding.test.ts
- intake.test.ts
- height-versioned.property.test.ts
- module-api.test.ts
- chrome.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- pg-tx-history-adapter.ts
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- node-source.ts
- runner/process.ts
- code-registry.ts
- type-check.ts
- core-block-fetch/metadata.ts
- sweep.ts
- node-bridge.ts
- validate.ts
- pglite-writer.worker.ts
- block-fetch-decode.test.ts
- .value
- ledger-sweep.test.ts
- version-table.ts
- run.test.ts
- order.property.test.ts
- transaction-history-storage.property.test.ts
- childRefKeys
- sigterm.worker.ts
- validation.test.ts
- FinalizedLoop
- recovery.test.ts
- shims.test.ts
- adapter-fixtures.ts
- ws-mutual-tls.test.ts
- core-chain-events/events.ts
- upgrade-boundary.test.ts
- sha256
- HeldHeight
- retention.ts
- ref_node_crypto
- checkShape
- attempt
- version-selection.test.ts
- worker-threads.test.ts
- UmbraError
- declaration.ts
- worker-threads-worker.ts
- buffer.ts
- Worker
- adapter.ts
- Roadmap for the missing formalization
- chain-placement.test.ts
- RuntimeMetadata
- stats.ts
- range.ts
- ref_node_fs
- core-block-parsed.ts
- mutation-evidence.d.mts
- EventsRunner
- AsyncLocalStorage
- loop.test.ts
- key-checks.ts
- entries.ts
- ReadHandle
- config/history.ts
- ledger-state.test.ts
- https.ts
- NodeFS
- chain-data-tapes.ts
- db/backends.ts
- refused-configuration.test.ts
- client.test.ts
- process-build.ts
- contract-data-checks.ts
- history
- column-rules.ts
- transform-checks.ts
- record-and-replay.test.ts
- backup/backup.ts
- vitest
- config-check.ts
- loop.ts
- api-server.test.ts
- core-transport.ts
- node.test.ts
- containers.test.ts
- ledger/types.ts
- ingest-harness.ts
- net.test.ts
- column-rules.test.ts
- worker-host.test.ts
- private/backends.ts
- interfaces/transaction-history-storage.ts
- post-block-update-checks.ts
- PgTransactionHistoryStorage
- version
- InMemoryBlockSource
- change-capture.ts
- transport-faults.test.ts
- NodeBlockSource
- checks.test.ts
- Process
- slow-block-harness.ts
- zero-timeouts-checks.ts
- cold-boot-recovery.integration.test.ts
- boundary.test.ts
- cbor.ts
- graph.ts
- NodeClient
- retirement.test.ts
- LedgerPackage
- real-tapes.ts
- browser.test.ts
- process-worker.ts
- .concat
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- tape/index.ts
- test/postgres/setup.ts
- ledger-storage.test.ts
- networks.ts
- spawnChild
- plain-data.ts
- core-block-commit.test.ts
- chain-process.test.ts
- process-admin.ts
- messages.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- backup/restore.ts
- cbor.property.test.ts
- core-ledger-state.ts
- core-key-registry.test.ts
- sweep-tapes.ts
- 4. Schema design
- UmbraDB 1.0.0 Release Contracts
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- T
- .from
- migrations
- decode
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- .boolean
- UmbraDB module guide
- mutation-per-adapter.mjs
- core-ledger-state.test.ts
- twox.ts
- Full-Chain Storage
- .slowBlockMs
- facade-merge-loader.ts
- UmbraDB third-party component inventory (SBOM)
- Design — CORE-ARCH: the standalone indexer's core architecture
- midnight-env — reproducible PREPROD dev environment
- path.ts
- read-only-checks.ts
- fresh-instance.mjs
- crash-worker.ts
- fn
- code
- .put
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- Requirements
- Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)
- ADDED Requirements
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Full-Chain Storage — Design
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- UmbraDB
- stryker.conf.json
- Storage Layer Interface Specification
- chain_archive lineage
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- scripts
- ADDED Requirements
- Roadmap
- ADDED Requirements
- REMOVED Requirements
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- compilerOptions
- ADDED Requirements
- Design — Sprint 4: Watermarks
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- Security policy & threat model
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Repository agent policy
- Contributing
- Checkpoint-store composition contract — cursor ordering and replay
- Storage Algebra Lean M3a Watermarks Sprint
- Tasks — Sprint 4: Watermarks
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
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
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00023 — The blocks table's height partitions end at 5,000,000
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`
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
- peerDependenciesMeta
- repository
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bin
- post-block-update/oracle/run.sh
- state-trees/oracle/run.sh
- v8/build.sh
- v9/build.sh
- v9-rc3/build.sh
- vendor-ledger.sh
- workerData
- ADDED Requirements
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- post-block-update/oracle/main.rs
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 296 edges
2. `UmbraError` - 295 edges
3. `ModuleDeclaration` - 166 edges
4. `FinalizedLoop` - 116 edges
5. `InMemoryBlockSource` - 102 edges
6. `NodeClient` - 99 edges
7. `Database` - 95 edges
8. `BlockRef` - 87 edges
9. `ReadHandle` - 84 edges
10. `NodeBlockSource` - 72 edges

## Surprising Connections (you probably didn't know these)
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?` --references--> `Buffer`  [INFERRED]
  docs/research/a1-unbounded-bytea-insert.md → browser/src/shims/buffer.ts
- `Review notes` --references--> `JsonValue`  [INFERRED]
  design/design-interfaces.md → src/private/messages.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: The barrel re-exports every frozen primitive and its interface type` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (328 total, 29 thin omitted)

### Community 0 - "admin-harness.ts"
Cohesion: 0.03
Nodes (151): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStarter, AdminStartOptions (+143 more)

### Community 1 - "Database"
Cohesion: 0.03
Nodes (146): Database, SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput (+138 more)

### Community 10 - "durability-probe.test.ts"
Cohesion: 0.04
Nodes (76): DurabilityProbeOptions, DurabilityViolation, ProbeSession, PostgresOptions, CheckTarget, CliBackend, Snapshot, WriterProcess (+68 more)

### Community 100 - "core-contract-logs-fast.ts"
Cohesion: 0.10
Nodes (32): ContractLog, CoreContractLogsFastOptions, FastLogReader, CoreContractLogsFullOptions, LogEventType, contractLogsItem(), contractLogsItemOf(), contractLogsMigrations() (+24 more)

### Community 102 - "src/config/load.ts"
Cohesion: 0.08
Nodes (26): privateIntake, RunOptions, SignalSource, stopSignal, LoadOptions, Finding, nodeSourceOf(), commandBuild() (+18 more)

### Community 103 - "mapping.ts"
Cohesion: 0.10
Nodes (32): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+24 more)

### Community 105 - "in-memory-source.ts"
Cohesion: 0.07
Nodes (20): ChainCheck, ChainCheckInput, RunSeams, BlockSource, FinalityStallCondition, InMemoryItems, InMemorySourceOptions, Wait (+12 more)

### Community 106 - "ledger/load.ts"
Cohesion: 0.09
Nodes (29): AdapterSpec, LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerRelease, LedgerReleasePackage, LedgerPackageOptions, V9Logs (+21 more)

### Community 109 - "node-run.ts"
Cohesion: 0.10
Nodes (24): BrowserConfiguration, BrowserRun, PrivateInstance, ProcessConfiguration, NodeRunResult, core(), databaseOf(), withDevelopmentOptIn() (+16 more)

### Community 11 - "module-tables.ts"
Cohesion: 0.05
Nodes (72): CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, CatalogTable (+64 more)

### Community 110 - "TransactionHistoryEntry"
Cohesion: 0.11
Nodes (12): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends (+4 more)

### Community 112 - "validation.ts"
Cohesion: 0.08
Nodes (26): PlacedDeclaration, Plain, Validator, schemaFile(), text(), validatorOf(), moded(), FIELD_KINDS (+18 more)

### Community 113 - "cli/command.ts"
Cohesion: 0.12
Nodes (24): CommandHandler, CommandIo, MainProcess, CommandResult, backupArguments(), backupCommand(), checkArguments(), configCommand() (+16 more)

### Community 114 - "version-checks.ts"
Cohesion: 0.11
Nodes (19): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, copyVendoredLedger(), expectEveryPackageFileChecked() (+11 more)

### Community 116 - "private/lockstep-wait.test.ts"
Cohesion: 0.11
Nodes (20): Session, Hello, Report, ExpectedWait, ReportRelay, RetargetProxy, a117Problems(), firstWait() (+12 more)

### Community 117 - "browser/build.ts"
Cohesion: 0.09
Nodes (23): BrowserBuildOptions, BrowserControl, browserLedgerEntry(), browserPlugin(), buildBrowser(), common(), listFiles(), main() (+15 more)

### Community 118 - "lockstep-refusals.test.ts"
Cohesion: 0.12
Nodes (26): LockstepCondition, PublicCore, A118Observation, MismatchObservation, WaitSample, a118Problems(), a118Run(), coreOn() (+18 more)

### Community 119 - "process-context.test.ts"
Cohesion: 0.09
Nodes (19): PublishRefusal, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass, a74Problems(), consumer(), latePublisher() (+11 more)

### Community 12 - "core-private-source.test.ts"
Cohesion: 0.04
Nodes (62): PrivateBlockSource, SourceTransport, PublicDatabase, PublicIdentity, PublicWakes, ReadOnlyDatabase, Seen, Process (+54 more)

### Community 120 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 121 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+15 more)

### Community 126 - "builds.ts"
Cohesion: 0.10
Nodes (23): PrivateChecks, PrivateIntakeOptions, PublicItem, PrivateOptions, PrivateRefusal, A155Observation, Outcome, privateBackbone() (+15 more)

### Community 127 - "binding.test.ts"
Cohesion: 0.12
Nodes (23): TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), a113Problems() (+15 more)

### Community 128 - "intake.test.ts"
Cohesion: 0.13
Nodes (17): PrivateSeen, A114Observation, A116Observation, TestLink, against(), directPublic(), a114Problems(), a114Run() (+9 more)

### Community 129 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (19): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Model, Op (+11 more)

### Community 13 - "module-api.test.ts"
Cohesion: 0.03
Nodes (72): ModuleApiServer, ModuleApiStart, StartedModuleApi, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart (+64 more)

### Community 130 - "chrome.ts"
Cohesion: 0.14
Nodes (12): Cdp, CdpEvent, ChromeBrowser, ChromeTab, PageRequest, chrome(), chrome(), chromePath() (+4 more)

### Community 131 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 132 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 134 - "pg-tx-history-adapter.ts"
Cohesion: 0.12
Nodes (21): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+13 more)

### Community 135 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (21): BlockTransaction, UnsureLog, LoadAdapter, LogSite, Program, UnsureReason, V9Raw, inThreadLogReader() (+13 more)

### Community 137 - "node-source.ts"
Cohesion: 0.10
Nodes (19): ExtrinsicCall, RuntimeMetadataView, NodeSourceOptions, Prefetch, NodeSubscription, PreparedBlock, SourceCondition, systemEventsKey() (+11 more)

### Community 14 - "runner/process.ts"
Cohesion: 0.04
Nodes (67): ConfigFacts, BlockItemSource, Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, CoreChainFacts, NodeWait (+59 more)

### Community 143 - "code-registry.ts"
Cohesion: 0.14
Nodes (22): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+14 more)

### Community 144 - "type-check.ts"
Cohesion: 0.14
Nodes (15): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), moduleSpecifier() (+7 more)

### Community 147 - "core-block-fetch/metadata.ts"
Cohesion: 0.25
Nodes (15): MetadataPallet, MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata() (+7 more)

### Community 148 - "sweep.ts"
Cohesion: 0.12
Nodes (13): GreyPicker, GreyView, SweepPhase, SweepTables, byBytes(), BYTE_ORDER(), hexOf(), merged() (+5 more)

### Community 149 - "node-bridge.ts"
Cohesion: 0.14
Nodes (17): BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 15 - "validate.ts"
Cohesion: 0.04
Nodes (89): coreEntry, plainData, ConfigInput, ConfigRule, CursorRule, EntryRef, Issue, Plain (+81 more)

### Community 150 - "pglite-writer.worker.ts"
Cohesion: 0.16
Nodes (17): Held, PgliteLockUse, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor(), main() (+9 more)

### Community 151 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 154 - ".value"
Cohesion: 0.26
Nodes (7): ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read(), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued

### Community 157 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (12): SweepState, SweepWrites, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints(), compare() (+4 more)

### Community 158 - "version-table.ts"
Cohesion: 0.17
Nodes (21): LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable() (+13 more)

### Community 159 - "run.test.ts"
Cohesion: 0.11
Nodes (15): RunningCommand, statsConfig, write(), adminPortIn(), exitWithin(), runInChild(), statsModule(), headAt() (+7 more)

### Community 16 - "order.property.test.ts"
Cohesion: 0.04
Nodes (89): EntryRange, GraphInput, HeightRange, PastFaultCase, RefusalCase, Recorder, CheckName, GraphSpec (+81 more)

### Community 160 - "transaction-history-storage.property.test.ts"
Cohesion: 0.10
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 163 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 166 - "sigterm.worker.ts"
Cohesion: 0.13
Nodes (15): Job, WorkEvent, WorkOptions, WORKER, Job, WorkerEvent, report(), report() (+7 more)

### Community 168 - "validation.test.ts"
Cohesion: 0.14
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 17 - "FinalizedLoop"
Cohesion: 0.04
Nodes (28): ResolvedRange, EntryBoundary, PointRun, PointSchedule, FinalizedLoop, HeightRun, LoopObserver, Startup (+20 more)

### Community 177 - "recovery.test.ts"
Cohesion: 0.21
Nodes (16): ProcessStatus, Q142Observation, A43Observation, Fault, Recorded, RecoveryObservation, StatusRead, committedProblems() (+8 more)

### Community 178 - "shims.test.ts"
Cohesion: 0.19
Nodes (10): PgliteLockUse, acquirePgliteLock(), lockHeld(), pgliteLockFile(), takeWebLock(), held, PGLITE_LOCK_BUSY_TIMEOUT_MS, PGLITE_LOCK_SUFFIX (+2 more)

### Community 18 - "adapter-fixtures.ts"
Cohesion: 0.06
Nodes (75): Freeable, Upstream, contractFixture, AdapterSubject, AdapterWorkerAnswer, AdapterWorkerHost, LoadedState, Replayed (+67 more)

### Community 180 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 181 - "core-chain-events/events.ts"
Cohesion: 0.17
Nodes (12): MetadataField, MetadataType, MetadataVariant, Primitive, RecordTypes, ScaleValue, namedField(), littleEndian() (+4 more)

### Community 182 - "upgrade-boundary.test.ts"
Cohesion: 0.18
Nodes (14): HistoryOptions, AdminRunOptions, TestBuildOptions, A47Observation, CommitsTheBoundary, Controls, a47Problems(), a47Run() (+6 more)

### Community 183 - "sha256"
Cohesion: 0.20
Nodes (7): Hash, sha256, hex(), instantiateLedger(), createHash(), INITIAL, K

### Community 184 - "HeldHeight"
Cohesion: 0.16
Nodes (10): CommitOutcome, HeldHeight, Outcomes, AlwaysLanded, AlwaysLost, DropsHeld, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence (+2 more)

### Community 189 - "retention.ts"
Cohesion: 0.20
Nodes (9): retainedStates, CoreRevision, releasesOf(), revisionsOf(), coreRevisionsOf(), releasedBy(), retainedFrom(), retentionWindow() (+1 more)

### Community 19 - "ref_node_crypto"
Cohesion: 0.05
Nodes (60): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+52 more)

### Community 190 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 191 - "attempt"
Cohesion: 0.16
Nodes (13): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+5 more)

### Community 194 - "version-selection.test.ts"
Cohesion: 0.35
Nodes (13): Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts(), haltOf() (+5 more)

### Community 196 - "worker-threads.test.ts"
Cohesion: 0.19
Nodes (6): Listener, FakeWorker, Listener, isMainThread, parentPort, workerData

### Community 2 - "UmbraError"
Cohesion: 0.03
Nodes (91): LoadedConfig, LoadOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PostgresOptions, commandTarget, ReadDatabaseOptions (+83 more)

### Community 20 - "declaration.ts"
Cohesion: 0.04
Nodes (58): OpenedFacts, QueuedBlock, OwnPart, ApiRegistry, BlockContext, BlockHeader, DefinedModule, FieldKind (+50 more)

### Community 201 - "worker-threads-worker.ts"
Cohesion: 0.18
Nodes (7): Scope, Worker, runEntry(), firstMessage, held, isMainThread, parentPort

### Community 202 - "buffer.ts"
Cohesion: 0.24
Nodes (10): BufferEncoding, bytesOfText(), charCodes(), encodingOf(), fromBase64(), fromHex(), toBase64(), decoder (+2 more)

### Community 21 - "adapter.ts"
Cohesion: 0.04
Nodes (67): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+59 more)

### Community 219 - "Roadmap for the missing formalization"
Cohesion: 0.20
Nodes (9): Key, Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec (+1 more)

### Community 22 - "chain-placement.test.ts"
Cohesion: 0.05
Nodes (59): LoadLedger, TransactionParser, LedgerStateItem, LedgerName, NodeBatch, ParsedTransaction, AppliedState, ApplyBlock (+51 more)

### Community 226 - "RuntimeMetadata"
Cohesion: 0.27
Nodes (3): RuntimeMetadata, contentStateOf(), hexOf()

### Community 227 - "stats.ts"
Cohesion: 0.25
Nodes (4): ManualOpts, TinybenchOpts, LatencyStats, tinybench

### Community 23 - "range.ts"
Cohesion: 0.04
Nodes (69): NodeClientOptions, Refusal, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command, TapeCommandIo (+61 more)

### Community 24 - "ref_node_fs"
Cohesion: 0.07
Nodes (58): recordedGenesis, BackupBackend, BackupDatabase, killedRestore, TickerConfig, ledgerBackup, RestoreBuild, cliProject (+50 more)

### Community 25 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (75): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, CoreBlockItems, BlockParsedOptions, ChainTransaction, ChainEvent (+67 more)

### Community 250 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 26 - "loop.test.ts"
Cohesion: 0.06
Nodes (61): Contexts, Faults, LostCommit, Seen, Seen, AtGate, LoopClass, RunnerDatabase (+53 more)

### Community 27 - "key-checks.ts"
Cohesion: 0.06
Nodes (75): PrivateProcess, Admission, AdmittedSeen, Blocking, KeyCall, KeyRefusal, KeyRow, Restarts (+67 more)

### Community 28 - "entries.ts"
Cohesion: 0.03
Nodes (71): CoreLedgerVersion, LedgerPackageIdentity, LedgerTableSettings, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig (+63 more)

### Community 29 - "ReadHandle"
Cohesion: 0.04
Nodes (47): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, Migration (+39 more)

### Community 3 - "config/history.ts"
Cohesion: 0.03
Nodes (117): CoreVersion, CoreSettings, versionEntry, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding, HistoryRule (+109 more)

### Community 30 - "ledger-state.test.ts"
Cohesion: 0.06
Nodes (69): BlockParsed, itemsSeen, Json, ingest, Call, ProcessBackend, FoundTape, refused() (+61 more)

### Community 31 - "chain-data-tapes.ts"
Cohesion: 0.06
Nodes (70): BlockSpec, EventSpec, Scenario, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase (+62 more)

### Community 32 - "db/backends.ts"
Cohesion: 0.04
Nodes (51): Settings, TestBackend, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer (+43 more)

### Community 33 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (63): ProcessConfig, SignalTarget, Answered, Start, Child, Refusal, Start, listenError() (+55 more)

### Community 34 - "client.test.ts"
Cohesion: 0.03
Nodes (37): NodeRetry, FakeNode, ManualTimers, connectWebSocket(), "on-compute"(), bytes(), caught(), client() (+29 more)

### Community 35 - "process-build.ts"
Cohesion: 0.06
Nodes (49): ProcessingEnd, ProcessDatabase, CoreSeen, testBuild, A149Observation, A149Startup, A42Observation, Seen (+41 more)

### Community 36 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (62): ContractStateRow, CoreContractStatesOptions, CallTx, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program (+54 more)

### Community 37 - "history"
Cohesion: 0.04
Nodes (61): Buffer, history(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+53 more)

### Community 38 - "column-rules.ts"
Cohesion: 0.04
Nodes (69): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+61 more)

### Community 39 - "transform-checks.ts"
Cohesion: 0.08
Nodes (45): Failure, Variant, TapeError, TransformError, NotificationRange, until(), baseRecords(), expectedText() (+37 more)

### Community 4 - "record-and-replay.test.ts"
Cohesion: 0.03
Nodes (76): ConnectSocket, Answer, Handler, Received, recorded, ConnectionFrames, Failure, Variant (+68 more)

### Community 40 - "backup/backup.ts"
Cohesion: 0.06
Nodes (59): BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration, ManifestTool (+51 more)

### Community 41 - "vitest"
Cohesion: 0.03
Nodes (33): Lockfile, Manifest, RepositoryFile, Upstream, ReportedTest, canPin(), pinViolations(), repositoryFiles() (+25 more)

### Community 43 - "config-check.ts"
Cohesion: 0.05
Nodes (49): CheckFinding, CheckStep, ConfigCheckOptions, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus (+41 more)

### Community 44 - "loop.ts"
Cohesion: 0.07
Nodes (45): PointName, Callback, CallbackFailure, ParallelPoint, ReasonCode, Unwrapped, Activity, HeightActivity (+37 more)

### Community 45 - "api-server.test.ts"
Cohesion: 0.06
Nodes (43): ChainDataView, HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, AppendsVersion, Client, VersionsAnswersOnly (+35 more)

### Community 46 - "core-transport.ts"
Cohesion: 0.06
Nodes (34): PublicSide, PublicSideOptions, TransportLimits, TransportTls, HelloAck, JsonValue, Read, ReadResult (+26 more)

### Community 47 - "node.test.ts"
Cohesion: 0.05
Nodes (22): Metadata, Step, RawClient, Failure, Variant, TapeClock, servePage(), expectAnswersByOccurrence() (+14 more)

### Community 48 - "containers.test.ts"
Cohesion: 0.06
Nodes (40): BenchEnv, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), guardPid(), watcherInput() (+32 more)

### Community 49 - "ledger/types.ts"
Cohesion: 0.06
Nodes (51): CoreLedgerStateOptions, ApplyInput, ApplyOutput, ChainOutcome, LedgerEvent, LedgerTask, LogItem, StateHandle (+43 more)

### Community 5 - "ingest-harness.ts"
Cohesion: 0.04
Nodes (101): NodeCallOptions, ProcessCondition, RecordingClient, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME (+93 more)

### Community 50 - "net.test.ts"
Cohesion: 0.06
Nodes (26): NetworkBroker, IncomingMessage, Server, NetworkMessage, Emitter, Frame, Listener, PortSocket (+18 more)

### Community 51 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, TableRule, TreeNode, TypeRule, DesignTable, becauseOf() (+24 more)

### Community 52 - "worker-host.test.ts"
Cohesion: 0.08
Nodes (26): NodeStore, StoredNode, EngineOptions, LedgerEngine, Nodes, hexOf(), idOf(), same() (+18 more)

### Community 53 - "private/backends.ts"
Cohesion: 0.07
Nodes (33): PrivateBackend, SessionSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, Pause, SkipsLockstep (+25 more)

### Community 55 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (39): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus, TransactionHistoryWriter (+31 more)

### Community 56 - "post-block-update-checks.ts"
Cohesion: 0.07
Nodes (43): RawPackage, AdapterWorkerRequest, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness (+35 more)

### Community 57 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (47): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Added, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order) (+39 more)

### Community 58 - "version"
Cohesion: 0.04
Nodes (51): Version, restart(), version(), 5.1 Layer A: per-key temporal history, TemporalKV (`src/interfaces/temporal-kv.ts`), 0. Project setup, 1. TemporalKV, 2. Sprint close-out (+43 more)

### Community 59 - "InMemoryBlockSource"
Cohesion: 0.06
Nodes (21): BlockRef, InMemoryBlockSource, Failing, Flaky, Fetching, Recorder, TickerProcess, RestoreJob (+13 more)

### Community 6 - "change-capture.ts"
Cohesion: 0.03
Nodes (111): CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow, ChainOptions, DigestRow (+103 more)

### Community 60 - "transport-faults.test.ts"
Cohesion: 0.08
Nodes (36): Message, Pem, TestCertificates, Ended, rawClient, codeOf(), mutualTlsOptions(), splitAddress() (+28 more)

### Community 61 - "NodeBlockSource"
Cohesion: 0.10
Nodes (13): HeadWait, NodeBlockSource, NodeHeader, QueueRunner, NoWindow, Refetches, TrustsNotifications, Opened (+5 more)

### Community 62 - "checks.test.ts"
Cohesion: 0.06
Nodes (35): BackupInput, ModuleTableOptions, GuardTableRow, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule (+27 more)

### Community 63 - "Process"
Cohesion: 0.08
Nodes (18): CoreTransport, StartedModuleApi, ProcessReason, Heartbeat, SlowBlockEvent, Process, configurationFindings(), configurationRefusalLines() (+10 more)

### Community 64 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (41): BlockEventSource, LoopInput, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead (+33 more)

### Community 65 - "zero-timeouts-checks.ts"
Cohesion: 0.08
Nodes (33): Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead(), engine() (+25 more)

### Community 66 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.08
Nodes (28): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+20 more)

### Community 67 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 68 - "cbor.ts"
Cohesion: 0.09
Nodes (38): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+30 more)

### Community 69 - "graph.ts"
Cohesion: 0.07
Nodes (45): Edge, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts, Spanned (+37 more)

### Community 7 - "NodeClient"
Cohesion: 0.05
Nodes (75): Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter, NodeBlock (+67 more)

### Community 70 - "retirement.test.ts"
Cohesion: 0.07
Nodes (43): Floor, ManifestShape, VitestConfig, acceptanceIds(), exportProblems(), floorProblems(), leanImports(), leanProblems() (+35 more)

### Community 72 - "LedgerPackage"
Cohesion: 0.06
Nodes (28): RetainedState, LedgerPackage, released(), carriedLoadProblems(), flushInto(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem (+20 more)

### Community 74 - "real-tapes.ts"
Cohesion: 0.08
Nodes (35): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+27 more)

### Community 75 - "browser.test.ts"
Cohesion: 0.09
Nodes (37): BrowserBuild, Reachable, pageBench, PageEvent, ProcessName, StatusBody, PageServer, midChainProblems() (+29 more)

### Community 76 - "process-worker.ts"
Cohesion: 0.08
Nodes (32): PageState, ProcessView, Scope, CallMethod, crossedError, FromProcessWorker, StartRun, ToProcessWorker (+24 more)

### Community 77 - ".concat"
Cohesion: 0.05
Nodes (30): Armed, CommitArm, CommitFault, CommitProxy, Pair, probe(), holds(), tailOf() (+22 more)

### Community 79 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (35): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+27 more)

### Community 8 - "tape/index.ts"
Cohesion: 0.05
Nodes (73): Recorded, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError (+65 more)

### Community 80 - "test/postgres/setup.ts"
Cohesion: 0.06
Nodes (35): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, SpawnCrashWorkerOptions, Sql, SuiteWatchdogTimeoutError, pool() (+27 more)

### Community 82 - "ledger-storage.test.ts"
Cohesion: 0.10
Nodes (38): SeenLoad, RestartEvent, RestartJob, retentionSeen, ledgerScenario, retainedStatesOf(), report(), a100Problems() (+30 more)

### Community 83 - "networks.ts"
Cohesion: 0.06
Nodes (40): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+32 more)

### Community 84 - "spawnChild"
Cohesion: 0.06
Nodes (34): ParentJob, Kill, Orphaned, SourceFile, LockResult, startWorker(), alive(), bystander() (+26 more)

### Community 85 - "plain-data.ts"
Cohesion: 0.07
Nodes (31): PlainArray, PlainDataNode, PlainDataRule, Walk, Hash, Row, copyArray(), copyObject() (+23 more)

### Community 87 - "core-block-commit.test.ts"
Cohesion: 0.08
Nodes (32): StandInOptions, Commit, blockHeaderOf(), checkParent(), commitBlock(), hex(), sameBytes(), writeBlockRow() (+24 more)

### Community 88 - "chain-process.test.ts"
Cohesion: 0.08
Nodes (32): ProcessHandle, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Flaky (+24 more)

### Community 9 - "process-admin.ts"
Cohesion: 0.04
Nodes (92): OpenedConfig, AllowedDetail, PrivateSideFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, DigestRow, ModuleFacts (+84 more)

### Community 90 - "messages.ts"
Cohesion: 0.07
Nodes (34): Committed, MessageFault, MessageType, Parsed, bytesOf(), decodeParameter(), decodeValue(), describe() (+26 more)

### Community 91 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.05
Nodes (40): Absent, 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion (+32 more)

### Community 92 - "backup/restore.ts"
Cohesion: 0.10
Nodes (32): RestoreSeams, RestoreTarget, MetaCommands, Piece, State, StatementSplitter, RestoreCommandOptions, RestoreCommandSeams (+24 more)

### Community 93 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (36): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+28 more)

### Community 96 - "core-ledger-state.ts"
Cohesion: 0.08
Nodes (34): BlockLedgerSource, LedgerBinding, applyBlock(), boundLedger(), bytesOf(), contractsOf(), deployedBelow(), hex() (+26 more)

### Community 97 - "core-key-registry.test.ts"
Cohesion: 0.08
Nodes (25): AdmittedKey, KeyRegistryOptions, Run, RunKey, TestKey, admittedOf(), bytesOfHex(), coreKeyRegistry() (+17 more)

### Community 99 - "sweep-tapes.ts"
Cohesion: 0.12
Nodes (33): TableSnapshot, FixtureNode, coreLedgerState(), writeSweep(), coreWith(), hex(), insertionOrder(), firstVersion() (+25 more)

### Community 179 - "4. Schema design"
Cohesion: 0.14
Nodes (14): 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy, 4. Schema design, v4 rewrite — the rollover runbook, rebuilt from four reproduced failures, run end-to-end for real (+6 more)

### Community 107 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.06
Nodes (33): up(), name, 8. Migration, 1. Durability contract, 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 4. Save-retry caveat, 5. Lease limitation (+25 more)

### Community 108 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.06
Nodes (34): repository(), 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go (+26 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.06
Nodes (28): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage, ADDED Requirements (+20 more)

### Community 122 - "T"
Cohesion: 0.08
Nodes (26): n(), T(), input(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside (+18 more)

### Community 133 - ".from"
Cohesion: 0.14
Nodes (25): hex(), hex(), bytesOf(), expectedId(), a106Problems(), a107Problems(), a99Problems(), blockZeroProblems() (+17 more)

### Community 139 - "migrations"
Cohesion: 0.08
Nodes (23): migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Migrations, ADDED Requirements, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser (+15 more)

### Community 155 - "decode"
Cohesion: 0.11
Nodes (20): decode(), Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Scenario: A future-versioned envelope is rejected cleanly, Scenario: An unknown top-level field is rejected as a typed envelope error (F7), Scenario: Non-JSON bytes are rejected as a typed envelope error, Scenario: Structurally invalid JSON is rejected as a typed envelope error, 0. Specification freeze (+12 more)

### Community 162 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (17): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 1. Library surface, 2. Database API (+9 more)

### Community 164 - ".boolean"
Cohesion: 0.12
Nodes (17): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights (+9 more)

### Community 171 - "UmbraDB module guide"
Cohesion: 0.12
Nodes (16): params(), Blocks from the node, Contract states and contract logs, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Process items and APIs, Reading through `db` (+8 more)

### Community 187 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 188 - "core-ledger-state.test.ts"
Cohesion: 0.13
Nodes (7): boundLedgerParser(), itemsOf(), writeBlock(), bound(), CORE_LEDGER_STATE_MIGRATIONS, NODES_PER_STATEMENT, STORED_ROOT

### Community 195 - "twox.ts"
Cohesion: 0.24
Nodes (9): hex(), littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian() (+1 more)

### Community 204 - "Full-Chain Storage"
Cohesion: 0.17
Nodes (11): store(), 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 3. Semantic decode: `chain-archive-sync/tx-replay-decoder.ts`, 4. How to run it (+3 more)

### Community 205 - ".slowBlockMs"
Cohesion: 0.20
Nodes (10): 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask, Evidence, Problem, Suggested fix, 16. Whole system, 5. Runner, Requirement: RN-17 A slow block is reported, never cut off, Scenario: A slow callback (+2 more)

### Community 206 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 213 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 228 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.22
Nodes (7): 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 9.2 Browser build (BR), 9. Backups and browser, Design — CORE-ARCH: the standalone indexer's core architecture

### Community 234 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 237 - "path.ts"
Cohesion: 0.32
Nodes (5): join(), normalize(), resolve(), delimiter, sep

### Community 288 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 289 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 299 - "crash-worker.ts"
Cohesion: 0.83
Nodes (3): main(), pauseUntilKilled(), requireEnv()

### Community 42 - "fn"
Cohesion: 0.04
Nodes (60): fn(), 0. Package layout, 1. `withTransaction`, 2. The transaction-handle registry (the one new design decision this sprint makes), 3. Lease acquisition, release, and timeout, 3a. `raceAgainstAbort` — the real mid-wait cancellation `acquireLease`/`tryAcquireLease` need, 5. Error translation additions (`src/postgres/errors.ts`), 6. Test infrastructure (+52 more)

### Community 54 - "code"
Cohesion: 0.04
Nodes (52): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, Reconciliation rationale (why 24, not the design's earlier 21), The catalog, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog (+44 more)

### Community 71 - ".put"
Cohesion: 0.05
Nodes (43): "on-fetch"(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+35 more)

### Community 98 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A lease-limitation contract states the single-process boundary, Requirement: A packed-tarball install smoke test proves the surface resolves for a real consumer (+27 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points (+24 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-14 A changed public configuration halts a private process, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: set is an idempotent, unconditional overwrite (Law W1) (+19 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 138 - "package.json"
Cohesion: 0.08
Nodes (25): bugs, url, description, engines, node, exports, files, homepage (+17 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence (+17 more)

### Community 142 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 145 - "Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24)"
Cohesion: 0.08
Nodes (23): Audit (round 1) — the confirmation-bias control paid off, Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+15 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 152 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.09
Nodes (17): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort (+9 more)

### Community 153 - "Full-Chain Storage — Design"
Cohesion: 0.09
Nodes (21): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+13 more)

### Community 156 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+13 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 165 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 167 - "UmbraDB"
Cohesion: 0.11
Nodes (18): CheckpointStore: content-addressed snapshots, Contents, Durability and crash semantics, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security (+10 more)

### Community 169 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 170 - "Storage Layer Interface Specification"
Cohesion: 0.12
Nodes (16): 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 3.1 Transaction/Lease layer (+8 more)

### Community 172 - "chain_archive lineage"
Cohesion: 0.12
Nodes (17): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, `chain_blobs` / `chain_blob_roles`, CheckpointStore tables, How the two lineages coexist (+9 more)

### Community 173 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 174 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 175 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 176 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, build:browser, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 185 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+6 more)

### Community 186 - "Roadmap"
Cohesion: 0.13
Nodes (15): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+7 more)

### Community 192 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 193 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 197 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.15
Nodes (12): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Errors, If you build from source, Installing, Security, The fix this release exists for (+4 more)

### Community 198 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 199 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 200 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 207 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 208 - "Design — Sprint 4: Watermarks"
Cohesion: 0.17
Nodes (11): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 3. `get`, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`) (+3 more)

### Community 209 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.17
Nodes (11): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction, 4. Live preprod DB-sync verification (nightly/labeled), 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live` (+3 more)

### Community 210 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 211 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 212 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 214 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 215 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 216 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 217 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 218 - "Security policy & threat model"
Cohesion: 0.20
Nodes (10): Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator (+2 more)

### Community 220 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 221 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 222 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 223 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 224 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 225 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 229 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 230 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 231 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 232 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 233 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 235 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 236 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 238 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 239 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 240 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 241 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Schema, 1. `set`, 2. `get`, 3. Cancellation and errors, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 242 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 243 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 244 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 245 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 246 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 247 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 248 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 249 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 253 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 254 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 255 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 256 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 257 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 258 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 259 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 260 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 261 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 262 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 263 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), What changes (the 1.0.0 gate items this change addresses), Why

### Community 264 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 265 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 266 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 267 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 268 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 269 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 270 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 271 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 272 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 273 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 274 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 275 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 276 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 277 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 278 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 279 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 280 - "00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 281 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.40
Nodes (4): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Suggested fix

### Community 282 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 283 - "00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`"
Cohesion: 0.40
Nodes (4): 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`, Evidence, Problem, Suggested fix

### Community 284 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 285 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 286 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.40
Nodes (5): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The configuration hash holds no secret, Scenario: The core leaves an answer as the module wrote it

### Community 287 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 290 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 291 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 292 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 293 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 294 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 295 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`, Layout, TransactionHistory (kept, not built)

### Community 296 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 297 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 298 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 304 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 305 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 73 - "ADDED Requirements"
Cohesion: 0.04
Nodes (44): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+36 more)

### Community 78 - "README.md"
Cohesion: 0.06
Nodes (29): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased], For historical reference only, Phase → current status map (+21 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Requirement: a transaction-pooling proxy is detected and refused, Requirement: JsonValueSchema rejects values exceeding the maximum nesting depth, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: save accepts and joins a caller-supplied transaction handle (+33 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+32 more)

### Community 94 - "post-block-update/oracle/main.rs"
Cohesion: 0.09
Nodes (18): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+10 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G10 — load during a concurrent prune never corrupts a live checkpoint's retrieval, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+30 more)

## Knowledge Gaps
- **53 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-8259` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3591 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `admin-harness.ts`, `Database`, `UmbraError`, `config/history.ts`, `record-and-replay.test.ts`, `ingest-harness.ts`, `change-capture.ts`, `NodeClient`, `tape/index.ts`, `process-admin.ts`, `durability-probe.test.ts`, `module-tables.ts`, `core-private-source.test.ts`, `module-api.test.ts`, `runner/process.ts`, `validate.ts`, `order.property.test.ts`, `adapter-fixtures.ts`, `ref_node_crypto`, `declaration.ts`, `adapter.ts`, `chain-placement.test.ts`, `ref_node_fs`, `core-block-parsed.ts`, `loop.test.ts`, `key-checks.ts`, `entries.ts`, `ReadHandle`, `ledger-state.test.ts`, `db/backends.ts`, `refused-configuration.test.ts`, `client.test.ts`, `process-build.ts`, `contract-data-checks.ts`, `transform-checks.ts`, `backup/backup.ts`, `config-check.ts`, `loop.ts`, `api-server.test.ts`, `core-transport.ts`, `node.test.ts`, `containers.test.ts`, `ledger/types.ts`, `net.test.ts`, `column-rules.test.ts`, `worker-host.test.ts`, `private/backends.ts`, `post-block-update-checks.ts`, `transport-faults.test.ts`, `checks.test.ts`, `Process`, `slow-block-harness.ts`, `zero-timeouts-checks.ts`, `cold-boot-recovery.integration.test.ts`, `boundary.test.ts`, `retirement.test.ts`, `real-tapes.ts`, `browser.test.ts`, `test/postgres/setup.ts`, `ledger-storage.test.ts`, `networks.ts`, `spawnChild`, `plain-data.ts`, `core-block-commit.test.ts`, `chain-process.test.ts`, `messages.ts`, `backup/restore.ts`, `cbor.property.test.ts`, `core-ledger-state.ts`, `core-key-registry.test.ts`, `sweep-tapes.ts`, `src/config/load.ts`, `in-memory-source.ts`, `validation.ts`, `cli/command.ts`, `version-checks.ts`, `private/lockstep-wait.test.ts`, `browser/build.ts`, `lockstep-refusals.test.ts`, `process-context.test.ts`, `Lockstep`, `crash.test.ts`, `builds.ts`, `binding.test.ts`, `intake.test.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `pg-tx-history-adapter.ts`, `package.json`, `code-registry.ts`, `type-check.ts`, `node-bridge.ts`, `block-fetch-decode.test.ts`, `ledger-sweep.test.ts`, `run.test.ts`, `transaction-history-storage.property.test.ts`, `validation.test.ts`, `recovery.test.ts`, `shims.test.ts`, `ws-mutual-tls.test.ts`, `upgrade-boundary.test.ts`, `mutation-per-adapter.mjs`, `core-ledger-state.test.ts`, `retention.ts`, `version-selection.test.ts`, `twox.ts`, `worker-threads.test.ts`, `facade-merge-loader.ts`?**
  _High betweenness centrality (0.250) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.027450980392156862 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `admin-harness.ts`, `Database`, `config/history.ts`, `record-and-replay.test.ts`, `ingest-harness.ts`, `change-capture.ts`, `NodeClient`, `tape/index.ts`, `process-admin.ts`, `durability-probe.test.ts`, `module-tables.ts`, `core-private-source.test.ts`, `module-api.test.ts`, `runner/process.ts`, `validate.ts`, `node-source.ts`, `order.property.test.ts`, `adapter-fixtures.ts`, `FinalizedLoop`, `declaration.ts`, `pglite-writer.worker.ts`, `range.ts`, `core-block-parsed.ts`, `loop.test.ts`, `entries.ts`, `ReadHandle`, `version-table.ts`, `ledger-state.test.ts`, `db/backends.ts`, `refused-configuration.test.ts`, `client.test.ts`, `process-build.ts`, `transform-checks.ts`, `backup/backup.ts`, `validation.test.ts`, `config-check.ts`, `loop.ts`, `api-server.test.ts`, `core-transport.ts`, `UmbraDB module guide`, `ledger/types.ts`, `shims.test.ts`, `upgrade-boundary.test.ts`, `sha256`, `InMemoryBlockSource`, `transport-faults.test.ts`, `NodeBlockSource`, `checkShape`, `Process`, `core-ledger-state.test.ts`, `zero-timeouts-checks.ts`, `checks.test.ts`, `slow-block-harness.ts`, `cbor.ts`, `graph.ts`, `plain-data.ts`, `core-block-commit.test.ts`, `chain-process.test.ts`, `backup/restore.ts`, `core-ledger-state.ts`, `core-key-registry.test.ts`, `RuntimeMetadata`, `core-contract-logs-fast.ts`, `Design — CORE-ARCH: the standalone indexer's core architecture`, `src/config/load.ts`, `mapping.ts`, `in-memory-source.ts`, `ledger/load.ts`, `validation.ts`, `version-checks.ts`, `lockstep-refusals.test.ts`, `process-context.test.ts`, `builds.ts`, `binding.test.ts`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.028011204481792718 - nodes in this community are weakly interconnected._