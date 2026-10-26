# Graph Report - UmbraDB

## Corpus Check
- 796 files · ~1,236,548 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 8547 nodes · 24159 edges · 261 communities (237 shown, 24 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 3000 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `1628eb655aee6c46` (796 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- runMigrations
- PgTransactionHistoryStorage
- admin-harness.ts
- version-table.ts
- ChainArchiveStore
- pglite-writer.worker.ts
- binding.test.ts
- config/history.ts
- BlobIntegrityError
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- builds.ts
- identity.ts
- FakeNode
- 1.1 The barrel: `src/index.ts`
- intake.test.ts
- ws-mutual-tls.test.ts
- ingest-crash.test.ts
- checkShape
- chain-archive-rollover.ts
- chain-events-source.test.ts
- upgrade-boundary.test.ts
- opt-out.test.ts
- Session
- cursor-durability.crash.test.ts
- RuntimeMetadata
- component-table.test.ts
- NodeClient
- ProcessItems
- builder.test.ts
- node/client.test.ts
- a114Run
- config-check.ts
- n
- mutation-evidence.d.mts
- PgTransactionLeaseLayer
- process.test.ts
- core-block-commit.test.ts
- api.ts
- SkipsAfterReconnect
- tape/index.ts
- createClient
- CliBackend
- plain-data.ts
- runner/process.ts
- adapter.ts
- chain-data.negative-control.test.ts
- describeNodeStoreExports
- loop.test.ts
- ReadHandle
- validate.test.ts
- vitest
- column-rules.ts
- child-processes.test.ts
- chain-placement.test.ts
- NodeBlockSource
- chain-process.test.ts
- checks.test.ts
- LeaseFaultError
- Database
- adapter-fixtures.ts
- transform-checks.ts
- .value
- LedgerPackage
- column-refusals.test.ts
- column-rules.test.ts
- module-tables.ts
- height-versioned.property.test.ts
- FinalizedLoop
- containers.test.ts
- UmbraError
- mapping.ts
- cbor.ts
- writer-lock-checks.ts
- postgres/chain-archive-store.ts
- graph.ts
- validate.ts
- chain-events-decode.test.ts
- ledger/types.ts
- cbor.property.test.ts
- src/index.ts
- failures.ts
- postgres.ts
- core-settings.ts
- networks.ts
- version-checks.ts
- pglite.ts
- boundary.test.ts
- interfaces/temporal-kv.ts
- height
- builder.ts
- .show
- openPostgres
- post-block-update-checks.ts
- ValidationError
- core-private-source.ts
- Writer
- declaration.ts
- plain-data.test.ts
- InMemoryBlockSource
- core-private-source.test.ts
- records.ts
- openPglite
- check-required-tests.ts
- legacy-excluded.test.ts
- TransactionHandle
- ref_node_child_process
- chain-archive-replay-decode.integration.test.ts
- determinism-checks.ts
- private/backends.ts
- block-fetch-decode.test.ts
- digest.test.ts
- Tasks — v1.0.0-infosec-signoff
- version
- halted
- mutation-per-adapter.mjs
- pg
- facade-merge-loader.ts
- ADDED Requirements
- history.property.test.ts
- 001_chain_archive_core.ts
- pack-install.mjs
- midnight-env — reproducible PREPROD dev environment
- .boolean
- fresh-instance.mjs
- integer
- 000_schema.ts
- graph.py
- ADDED Requirements
- address
- package.json
- README.md
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- Full-Chain Storage — Design
- stryker.conf.json
- ADDED Requirements
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- devDependencies
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Roadmap
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- compilerOptions
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB v0.9.5 "Penumbra" — Release Record
- 3. Proof-blocking findings
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- UmbraDB
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- Design — Postgres+JSONB storage rebuild
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Repository agent policy
- Our Pledge
- Algebraic Specification of the midnight-pg-store Storage Layer
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- Security policy & threat model
- 12. Milestone status
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-perf-baseline
- Tasks — v1.0.0-perf-baseline
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Performance — design
- Midnight Foundation Security Policy
- lib.sh
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- 9. Trust and refinement boundary
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Acceptance criteria — v1.0.0-perf-baseline
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- repository
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bugs
- engines
- oracle/run.sh
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 240 edges
2. `UmbraError` - 209 edges
3. `ModuleDeclaration` - 113 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `runMigrations()` - 90 edges
6. `PgCheckpointStore` - 87 edges
7. `ValidationError` - 87 edges
8. `Database` - 82 edges
9. `InMemoryBlockSource` - 79 edges
10. `NodeClient` - 78 edges

## Surprising Connections (you probably didn't know these)
- `Rework (class 1 — infra)` --references--> `ConnectionError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/storage-errors.ts
- `Scenario: A connection failure surfaces as ConnectionError` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/specs/temporal-kv/spec.md → src/interfaces/storage-errors.ts
- `2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2)` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/v1.0.0-recovery-testing/tasks.md → src/interfaces/storage-errors.ts
- `Scenario: A connection failure surfaces as ConnectionError` --references--> `ConnectionError`  [INFERRED]
  openspec/specs/temporal-kv/spec.md → src/interfaces/storage-errors.ts
- `3. PgTransactionHistoryStorage implementation` --references--> `StorageError`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/tasks.md → src/interfaces/storage-errors.ts

## Import Cycles
- None detected.

## Communities (261 total, 24 thin omitted)

### Community 0 - "runMigrations"
Cohesion: 0.02
Nodes (196): ConnectionError, StorageError, TransactionFaultError, TransactionLeaseError, TransactionRolledBackError, EnvelopeVersionUnsupportedError, WalletStateEnvelopeError, UmbraDBConnectionOptions (+188 more)

### Community 1 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (157): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryEntry (+149 more)

### Community 10 - "admin-harness.ts"
Cohesion: 0.04
Nodes (89): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+81 more)

### Community 101 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 102 - "ChainArchiveStore"
Cohesion: 0.10
Nodes (7): ChainArchiveStore, 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 5. Acceptance criteria status, 6. Known limitations, Full-Chain Storage

### Community 103 - "pglite-writer.worker.ts"
Cohesion: 0.18
Nodes (16): Held, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor(), main(), open() (+8 more)

### Community 109 - "binding.test.ts"
Cohesion: 0.14
Nodes (13): TestDatabase, A113Observation, Binding, Outcome, privateCursorHeight(), a113Run(), against(), bindingIn() (+5 more)

### Community 11 - "config/history.ts"
Cohesion: 0.04
Nodes (106): CoreVersion, CoreSettings, versionEntry, HistoryCheck, HistoryCode, HistoryContext, HistoryInput, HistoryOptions (+98 more)

### Community 111 - "BlobIntegrityError"
Cohesion: 0.20
Nodes (12): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+4 more)

### Community 112 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.11
Nodes (17): Hash, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence) (+9 more)

### Community 115 - "builds.ts"
Cohesion: 0.19
Nodes (17): privateIntake, PrivateProcess, PrivateRefusal, pollingWakes(), genesisBlock(), genesisHex(), launchPrivate(), poll() (+9 more)

### Community 116 - "identity.ts"
Cohesion: 0.19
Nodes (16): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+8 more)

### Community 12 - "1.1 The barrel: `src/index.ts`"
Cohesion: 0.03
Nodes (109): TransactionHistoryStorage, CheckpointStore, Rollback, TransactionLeaseLayer, Watermarks, RunMigrationsOptions, SaveAndAdvanceCursor, SaveAndAdvanceDeps (+101 more)

### Community 123 - "intake.test.ts"
Cohesion: 0.22
Nodes (14): PrivateSeen, A114Observation, A116Observation, directPublic(), a114Problems(), a116Problems(), a116Run(), against() (+6 more)

### Community 124 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 13 - "ingest-crash.test.ts"
Cohesion: 0.04
Nodes (95): MetadataBlock, RuntimeMetadataEntry, SourceShared, Scenario, ArgType, BlockOptions, CallSpec, chainBlock (+87 more)

### Community 130 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 132 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 137 - "chain-events-source.test.ts"
Cohesion: 0.19
Nodes (7): NodeCallOptions, RecordingClient, open(), quiet(), chain, closing, SYSTEM_EVENTS_STORAGE

### Community 138 - "upgrade-boundary.test.ts"
Cohesion: 0.21
Nodes (12): A47Observation, CommitsTheBoundary, Controls, Version, a47Problems(), a47Run(), big(), buildOf() (+4 more)

### Community 14 - "opt-out.test.ts"
Cohesion: 0.03
Nodes (93): CapturedTable, CaptureState, CheckedMigration, ConsistentRead, optOut, Op, States, TableName (+85 more)

### Community 144 - "Session"
Cohesion: 0.22
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 15 - "cursor-durability.crash.test.ts"
Cohesion: 0.03
Nodes (103): InvariantResult, C5AnyFn, Fault, CrashWorkerHandle, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount(), pool() (+95 more)

### Community 156 - "RuntimeMetadata"
Cohesion: 0.24
Nodes (4): RuntimeMetadata, contentStateOf(), hexOf(), walkOver()

### Community 157 - "component-table.test.ts"
Cohesion: 0.18
Nodes (7): DesignTable, RowCoverage, typeScriptFiles(), OPENERS, ROWS, SUITE, REPOSITORY

### Community 16 - "NodeClient"
Cohesion: 0.05
Nodes (65): NodeSourceOptions, CoreChainBinding, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State (+57 more)

### Community 17 - "builder.test.ts"
Cohesion: 0.03
Nodes (47): ConnectionFrames, Failure, Variant, WrongRecording, Metadata, Step, Frame, RawClient (+39 more)

### Community 18 - "node/client.test.ts"
Cohesion: 0.03
Nodes (62): NodeClientOptions, ConnectSocket, Answer, Handler, Received, recorded, ManualTimers, ConnectionFrames (+54 more)

### Community 19 - "config-check.ts"
Cohesion: 0.04
Nodes (77): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName (+69 more)

### Community 192 - "n"
Cohesion: 0.29
Nodes (7): Absent, n(), 3.3 T3 omits the current event and cannot replay a pruned suffix, 4. Law-by-law repair map, Requirement: CheckpointSummary metadata is populated and label round-trips, Scenario: A label given at save time is returned by history and load, Scenario: byteLength, chunkCount, and createdAt reflect the saved payload

### Community 198 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 2 - "PgTransactionLeaseLayer"
Cohesion: 0.02
Nodes (134): AggregateRow, ChunkJoinRow, ManifestRow, PgCheckpointStore, UmbraDBSql, PgTemporalKV, HeldLease, PgTransactionLeaseLayer (+126 more)

### Community 20 - "process.test.ts"
Cohesion: 0.05
Nodes (71): ProcessingEnd, CrashEvent, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, ProcessDatabase, CoreSeen (+63 more)

### Community 21 - "core-block-commit.test.ts"
Cohesion: 0.03
Nodes (64): BlockHeaderItem, BlockItemSource, CoreBlockHeader, CoreBlockItems, QueuedBlock, BlockItems, LateUse, BlockSource (+56 more)

### Community 22 - "api.ts"
Cohesion: 0.04
Nodes (62): CommittedHeight, ReadOnlyDatabase, ReadOptions, Settings, TestBackend, TestDatabase, Case, LoadOutcome (+54 more)

### Community 23 - "tape/index.ts"
Cohesion: 0.05
Nodes (58): Recorded, RecordingProblem, readRequest, RequestId, Json, NotJsonError, Connection, TapeCall (+50 more)

### Community 24 - "createClient"
Cohesion: 0.05
Nodes (65): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+57 more)

### Community 25 - "plain-data.ts"
Cohesion: 0.05
Nodes (68): ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminStarter, SnapshotFacts, ConfigSnapshot, SanitizedError, PlainArray (+60 more)

### Community 26 - "runner/process.ts"
Cohesion: 0.04
Nodes (58): Bound, ChainCheck, ChainCheckInput, ChainIdentity, ChainSource, CoreChainFacts, NodeWait, WaitingListener (+50 more)

### Community 27 - "adapter.ts"
Cohesion: 0.04
Nodes (66): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+58 more)

### Community 28 - "chain-data.negative-control.test.ts"
Cohesion: 0.04
Nodes (71): BodyExtrinsic, BlockBody, MetadataVariant, BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction (+63 more)

### Community 29 - "describeNodeStoreExports"
Cohesion: 0.07
Nodes (51): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+43 more)

### Community 3 - "loop.test.ts"
Cohesion: 0.02
Nodes (158): ErrorCode, BlockHeader, PointName, GraphInput, HeightRange, ResolvedRange, Callback, CallbackFailure (+150 more)

### Community 30 - "ReadHandle"
Cohesion: 0.05
Nodes (37): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, BlockContext (+29 more)

### Community 31 - "validate.test.ts"
Cohesion: 0.04
Nodes (65): coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+57 more)

### Community 32 - "vitest"
Cohesion: 0.05
Nodes (35): Finding, Lockfile, Manifest, Upstream, Finding, GuardViolation, ReportedTest, inChild() (+27 more)

### Community 33 - "column-rules.ts"
Cohesion: 0.04
Nodes (72): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts (+64 more)

### Community 34 - "child-processes.test.ts"
Cohesion: 0.04
Nodes (57): SignalTarget, ParentJob, Kill, Orphaned, SourceFile, Run, WorkerEvent, LockResult (+49 more)

### Community 35 - "chain-placement.test.ts"
Cohesion: 0.07
Nodes (61): BlockSpec, EventSpec, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry (+53 more)

### Community 36 - "NodeBlockSource"
Cohesion: 0.07
Nodes (17): HeadWait, NodeBlockSource, Prefetch, NodeSubscription, NodeBlock, PreparedBlock, QueueRunner, EventsRunner (+9 more)

### Community 37 - "chain-process.test.ts"
Cohesion: 0.05
Nodes (44): ProcessHandle, Job, WorkerEvent, A77Observation, A78Observation, A90Observation, Failing, Flaky (+36 more)

### Community 38 - "checks.test.ts"
Cohesion: 0.06
Nodes (47): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, Outcome, openBlockWrites() (+39 more)

### Community 39 - "LeaseFaultError"
Cohesion: 0.06
Nodes (54): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, abortError(), raceAgainstAbort(), reserveBounded() (+46 more)

### Community 4 - "Database"
Cohesion: 0.02
Nodes (131): Database, SchemaPlan, ApiRegistry, ResolvedGraph, Connection, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart (+123 more)

### Community 40 - "adapter-fixtures.ts"
Cohesion: 0.10
Nodes (50): StoredNode, Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState (+42 more)

### Community 41 - "transform-checks.ts"
Cohesion: 0.08
Nodes (36): Failure, Variant, TransformError, NotificationRange, turns(), baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect() (+28 more)

### Community 42 - ".value"
Cohesion: 0.11
Nodes (34): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, RuntimeMetadataView (+26 more)

### Community 43 - "LedgerPackage"
Cohesion: 0.04
Nodes (36): LedgerEventKind, LedgerPackage, NodeStore, released(), listen(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem (+28 more)

### Community 44 - "column-refusals.test.ts"
Cohesion: 0.07
Nodes (31): ModuleContentsFailure, ModuleTable, DeterminismBackend, TestDatabase, TestServer, Backend, Case, freshDatabase() (+23 more)

### Community 45 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (33): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+25 more)

### Community 46 - "module-tables.ts"
Cohesion: 0.06
Nodes (39): CaptureColumn, ModuleColumn, ModuleContentsError, PageOptions, ColumnType, RefusalCode, RefusalPlace, contentsHash() (+31 more)

### Community 47 - "height-versioned.property.test.ts"
Cohesion: 0.06
Nodes (42): VersionedValue, Access, Block, BlockFails, Counts, Write, StoredVersion, Block (+34 more)

### Community 48 - "FinalizedLoop"
Cohesion: 0.09
Nodes (13): EntryBoundary, FinalizedLoop, Startup, WaitingInRead, ItemsAfterWrite, SkipsStartAtRestart, FailingAfter, StartsAtEveryRevision (+5 more)

### Community 49 - "containers.test.ts"
Cohesion: 0.08
Nodes (30): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, BlockRow, TxRow, guardContainers(), removeAttempt() (+22 more)

### Community 5 - "UmbraError"
Cohesion: 0.03
Nodes (128): SchemaWriteHandle, Transaction, ReadTimeoutSetting, AppliedRow, Runnable, Settling, StartupInput, MultiStatementRunner (+120 more)

### Community 50 - "mapping.ts"
Cohesion: 0.07
Nodes (36): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+28 more)

### Community 51 - "cbor.ts"
Cohesion: 0.09
Nodes (40): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+32 more)

### Community 52 - "writer-lock-checks.ts"
Cohesion: 0.11
Nodes (37): WriterProcess, Job, WorkerEvent, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf() (+29 more)

### Community 53 - "postgres/chain-archive-store.ts"
Cohesion: 0.10
Nodes (27): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+19 more)

### Community 54 - "graph.ts"
Cohesion: 0.08
Nodes (44): Edge, EntryRange, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+36 more)

### Community 55 - "validate.ts"
Cohesion: 0.09
Nodes (42): HistoryFinding, ConfigRule, CursorRule, Finding, Issue, Plain, coreSettingsSchema(), pathOf() (+34 more)

### Community 57 - "chain-events-decode.test.ts"
Cohesion: 0.08
Nodes (36): BlockEventSource, ledgerVersionOf(), blockBodyOf(), blockParsedOf(), bindCoreChainEvents(), boundEventSource(), chainEventsItemOf(), chainEventsOf() (+28 more)

### Community 58 - "ledger/types.ts"
Cohesion: 0.10
Nodes (29): LoadLedger, LedgerName, AdapterSpec, LedgerRelease, LedgerReleasePackage, ApplyInput, ApplyOutput, LedgerEvent (+21 more)

### Community 59 - "cbor.property.test.ts"
Cohesion: 0.07
Nodes (40): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+32 more)

### Community 6 - "src/index.ts"
Cohesion: 0.02
Nodes (147): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError, ChunkMissingError (+139 more)

### Community 60 - "failures.ts"
Cohesion: 0.10
Nodes (19): ProcessReason, ReasonCode, RetryCode, Unwrapped, Process, RetryCondition, StatusFacts, isListenFailure() (+11 more)

### Community 61 - "postgres.ts"
Cohesion: 0.09
Nodes (33): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, DriverError, Outcome, Role, WriterSession (+25 more)

### Community 62 - "core-settings.ts"
Cohesion: 0.06
Nodes (35): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+27 more)

### Community 64 - "networks.ts"
Cohesion: 0.07
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 65 - "version-checks.ts"
Cohesion: 0.14
Nodes (27): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, Answers, toHex() (+19 more)

### Community 66 - "pglite.ts"
Cohesion: 0.10
Nodes (18): Job, JobQueue, Outcome, PgliteDatabase, ServerErrorFields, commitRolledBack(), handleClosed(), statementRefused() (+10 more)

### Community 68 - "boundary.test.ts"
Cohesion: 0.13
Nodes (34): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+26 more)

### Community 7 - "interfaces/temporal-kv.ts"
Cohesion: 0.02
Nodes (132): AsOf, AssertExact, HistoryUnavailableError, JsonValue, Key, Namespace, Scope, TemporalKVError (+124 more)

### Community 70 - "height"
Cohesion: 0.06
Nodes (35): Broken, height(), 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy (+27 more)

### Community 72 - "builder.ts"
Cohesion: 0.10
Nodes (21): Refusal, Link, TapeBuilder, TapeBuilderOptions, TapeCommandIo, RecordingError, SessionEnd, withBuilder() (+13 more)

### Community 73 - ".show"
Cohesion: 0.07
Nodes (22): AllowedDetail, schemaName(), module(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 74 - "openPostgres"
Cohesion: 0.08
Nodes (13): Phase, PostgresTestDatabase, PostgresTestServer, openPostgres(), postgresCliBackend(), postgresBackend(), opened(), startPostgresServer() (+5 more)

### Community 75 - "post-block-update-checks.ts"
Cohesion: 0.12
Nodes (30): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+22 more)

### Community 76 - "ValidationError"
Cohesion: 0.08
Nodes (33): ValidationError, LL-002 — A7 watermark-participation negative control did not fire; survived fix-round-1, caught by round-2 cold cross-vendor Codex, Requirement: prune rejects a retainCount that is not a positive safe integer, before any deletion runs, Requirement: save rejects invalid options with ValidationError before any chunking or hashing work, Scenario: A chunkSize above the schema's 16 MiB bound is rejected with no work done, Scenario: A non-integer or non-finite retainCount is rejected with no effect, Scenario: An integer retainCount outside the safe integer range is rejected with no effect, Scenario: retainCount of zero is rejected with no effect (+25 more)

### Community 77 - "core-private-source.ts"
Cohesion: 0.13
Nodes (20): PrivateBlockSource, PrivateIntakeOptions, PublicDatabase, PublicIdentity, PublicWakes, PrivateOptions, bindingRefusal(), hex() (+12 more)

### Community 79 - "Writer"
Cohesion: 0.09
Nodes (16): ReadPool, Writer, allowMultiStatement(), rollBack(), Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts (+8 more)

### Community 8 - "declaration.ts"
Cohesion: 0.03
Nodes (118): AppliedMigration, MigrationPart, DefinedModule, FieldKind, FieldSchema, ItemDeclaration, ItemSink, KnownPointsOnly (+110 more)

### Community 81 - "plain-data.test.ts"
Cohesion: 0.09
Nodes (18): LoadOptions, Row, invalid(), isFile(), loadConfig(), failures(), refusal(), thrown() (+10 more)

### Community 82 - "InMemoryBlockSource"
Cohesion: 0.14
Nodes (9): BlockRef, InMemoryBlockSource, InMemorySourceOptions, LoopObserver, Fetching, Recorder, LateRedelivery, failingSource() (+1 more)

### Community 83 - "core-private-source.test.ts"
Cohesion: 0.09
Nodes (8): AdmittedKey, privateBackbone(), fakePublic(), fakeRead(), CORE_KEY_REGISTRY, CORE_KEY_REGISTRY_MIGRATIONS, NONE, PRIVATE_CORE_DIGEST

### Community 84 - "records.ts"
Cohesion: 0.12
Nodes (26): TapeError, TapeProblem, TransformProblem, DisconnectRecord, FaultRecord, Params, expectGoldenRoundTrip(), checkRecord() (+18 more)

### Community 86 - "openPglite"
Cohesion: 0.09
Nodes (23): ConfiguredDatabase, ConfiguredDatabaseOptions, PgliteLockUse, PgliteOptions, PostgresOptions, Job, Job, databaseOptions() (+15 more)

### Community 88 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 89 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 9 - "TransactionHandle"
Cohesion: 0.03
Nodes (105): TransactionHistoryReader, TransactionHistoryWriter, TemporalKV, TransactionHandle, TransactionHandleInvalidError, WatermarkKey, WatermarkKind, WatermarkValue (+97 more)

### Community 94 - "ref_node_child_process"
Cohesion: 0.09
Nodes (21): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), end(), removeContainers(), check, checker (+13 more)

### Community 95 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.14
Nodes (22): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, bootstrapChainArchiveSchema() (+14 more)

### Community 96 - "determinism-checks.ts"
Cohesion: 0.17
Nodes (20): PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, privateModule(), refusalOf(), a146Hashes() (+12 more)

### Community 97 - "private/backends.ts"
Cohesion: 0.13
Nodes (14): PrivateBackend, SessionSeen, A112Observation, Wiring, schemaPlan(), a112Run(), PRIVATE_BACKENDS, PRIVATE_LOGIN (+6 more)

### Community 98 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 99 - "digest.test.ts"
Cohesion: 0.12
Nodes (20): ChangeKind, tableChanges, TouchedRow, changeOf(), concat(), sameBytes(), hex(), hex() (+12 more)

### Community 100 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.10
Nodes (21): repository(), 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA (+13 more)

### Community 104 - "version"
Cohesion: 0.10
Nodes (20): version(), Requirement: CF-7 The history row and its hash, Scenario: The same entry gives the same hash, 3. The freeze: build + package.json (G1), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3) (+12 more)

### Community 113 - "halted"
Cohesion: 0.12
Nodes (18): halted(), ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked (+10 more)

### Community 129 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 131 - "pg"
Cohesion: 0.15
Nodes (12): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 2. Node-side query correlation (+4 more)

### Community 147 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 149 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value (+3 more)

### Community 152 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 154 - "001_chain_archive_core.ts"
Cohesion: 0.24
Nodes (9): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, Revision history, v2 — 2026-07-22, revised in response to a 3-reviewer design-council audit (Fable 5 / Opus / GPT-5.6 Sol), v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol) (+1 more)

### Community 158 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 174 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 183 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 228 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 238 - "integer"
Cohesion: 0.50
Nodes (4): integer(), Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Scenario: The history aggregate reads size_bytes, not octet_length(data), Scenario: The size_bytes column exists and equals the payload length

### Community 69 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 71 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 90 - "address"
Cohesion: 0.08
Nodes (24): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md` (+16 more)

### Community 105 - "package.json"
Cohesion: 0.10
Nodes (20): bin, umbradb, description, exports, files, homepage, license, main (+12 more)

### Community 106 - "README.md"
Cohesion: 0.16
Nodes (5): For historical reference only, Tasks — superseded by per-sprint openspec changes, UmbraDB v1.0.0 — Release Record (PENDING), What 1.0.0 additionally requires, What must happen before this record can be completed

### Community 107 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 110 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 117 - "Full-Chain Storage — Design"
Cohesion: 0.11
Nodes (17): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+9 more)

### Community 118 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.12
Nodes (17): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+9 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 122 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 125 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+8 more)

### Community 126 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 127 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+7 more)

### Community 128 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 133 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.14
Nodes (14): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+6 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 136 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 139 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 142 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 143 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 146 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 150 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 151 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 153 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 155 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 159 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 160 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.20
Nodes (10): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+2 more)

### Community 161 - "3. Proof-blocking findings"
Cohesion: 0.20
Nodes (10): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption, 3.8 C2 safety and liveness are different theorem classes (+2 more)

### Community 162 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 163 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 164 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 165 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 166 - "UmbraDB"
Cohesion: 0.20
Nodes (10): Contents, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB, Verification: what is proved, checked, and tested (+2 more)

### Community 168 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.22
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 169 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 170 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.22
Nodes (9): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 8. Test infrastructure (open decision — resolve in Task 1) (+1 more)

### Community 171 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 172 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 173 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 175 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 176 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 177 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 178 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 179 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 180 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 181 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 182 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 185 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 186 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 187 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.29
Nodes (5): 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 188 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 189 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 190 - "Security policy & threat model"
Cohesion: 0.29
Nodes (7): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 191 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 193 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 194 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 195 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 196 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 197 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 199 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 200 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 201 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 202 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 203 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 204 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 205 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 206 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 207 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 208 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 209 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, Why

### Community 210 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 211 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 212 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 213 - "Performance — design"
Cohesion: 0.33
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 214 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 215 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 216 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 217 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 218 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 219 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 220 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 221 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 222 - "00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone"
Cohesion: 0.40
Nodes (4): 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone, Problem, Resolution, Suggested fix

### Community 223 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 224 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 225 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 226 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 227 - "Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data"
Cohesion: 0.40
Nodes (5): Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data, Scenario: replay from the durable cursor converges on current state, Scenario: the durable watermark is never ahead of durable data, Scenario: the invariant holds under synchronous_commit = off, Scenario: the invariant holds under synchronous_commit = on

### Community 230 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 231 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 232 - "9. Trust and refinement boundary"
Cohesion: 0.50
Nodes (4): 9. Trust and refinement boundary, Completed M1/M2/W1 claims, Deferred M2–M5 proof work, Named external obligations

### Community 233 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 234 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 235 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 236 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 237 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 239 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 240 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 244 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 56 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 63 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 67 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 78 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+19 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form (+18 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0, Requirement: the baseline reflects the batched (shipped) save shape (+17 more)

## Knowledge Gaps
- **42 isolated node(s):** `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx`, `typedoc`, `@types/node` (+37 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3000 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `runMigrations`, `PgTransactionHistoryStorage`, `PgTransactionLeaseLayer`, `mutation-per-adapter.mjs`, `loop.test.ts`, `UmbraError`, `src/index.ts`, `Database`, `declaration.ts`, `chain-events-source.test.ts`, `admin-harness.ts`, `config/history.ts`, `upgrade-boundary.test.ts`, `ingest-crash.test.ts`, `opt-out.test.ts`, `cursor-durability.crash.test.ts`, `NodeClient`, `excluded-not-exported.test.ts`, `node/client.test.ts`, `facade-merge-loader.ts`, `config-check.ts`, `core-block-commit.test.ts`, `api.ts`, `process.test.ts`, `history.property.test.ts`, `plain-data.ts`, `runner/process.ts`, `adapter.ts`, `chain-data.negative-control.test.ts`, `component-table.test.ts`, `ReadHandle`, `validate.test.ts`, `describeNodeStoreExports`, `createClient`, `child-processes.test.ts`, `chain-placement.test.ts`, `chain-process.test.ts`, `checks.test.ts`, `adapter-fixtures.ts`, `transform-checks.ts`, `column-refusals.test.ts`, `column-rules.test.ts`, `height-versioned.property.test.ts`, `containers.test.ts`, `mapping.ts`, `writer-lock-checks.ts`, `chain-events-decode.test.ts`, `ledger/types.ts`, `cbor.property.test.ts`, `failures.ts`, `postgres.ts`, `core-settings.ts`, `networks.ts`, `version-checks.ts`, `pglite.ts`, `boundary.test.ts`, `openPostgres`, `post-block-update-checks.ts`, `plain-data.test.ts`, `core-private-source.test.ts`, `builder.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `ref_node_child_process`, `chain-archive-replay-decode.integration.test.ts`, `determinism-checks.ts`, `private/backends.ts`, `block-fetch-decode.test.ts`, `digest.test.ts`, `package.json`, `binding.test.ts`, `BlobIntegrityError`, `identity.ts`, `tape/index.ts`, `intake.test.ts`, `ws-mutual-tls.test.ts`?**
  _High betweenness centrality (0.302) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx` to the rest of the system?**
  _42 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `runMigrations` be split into smaller, more focused modules?**
  _Cohesion score 0.016666666666666666 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `checkShape`, `loop.test.ts`, `Database`, `declaration.ts`, `admin-harness.ts`, `config/history.ts`, `upgrade-boundary.test.ts`, `ingest-crash.test.ts`, `opt-out.test.ts`, `Session`, `NodeClient`, `node/client.test.ts`, `config-check.ts`, `process.test.ts`, `core-block-commit.test.ts`, `api.ts`, `plain-data.ts`, `runner/process.ts`, `RuntimeMetadata`, `ReadHandle`, `validate.test.ts`, `NodeBlockSource`, `chain-process.test.ts`, `checks.test.ts`, `transform-checks.ts`, `module-tables.ts`, `FinalizedLoop`, `mapping.ts`, `cbor.ts`, `writer-lock-checks.ts`, `graph.ts`, `validate.ts`, `ledger/types.ts`, `failures.ts`, `postgres.ts`, `core-settings.ts`, `version-checks.ts`, `pglite.ts`, `builder.ts`, `openPostgres`, `core-private-source.ts`, `Writer`, `plain-data.test.ts`, `InMemoryBlockSource`, `core-private-source.test.ts`, `openPglite`, `version-table.ts`, `pglite-writer.worker.ts`, `identity.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `PgTransactionHistoryStorage` be split into smaller, more focused modules?**
  _Cohesion score 0.019853574504737296 - nodes in this community are weakly interconnected._