# Graph Report - UmbraDB

## Corpus Check
- 713 files · ~1,133,985 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 65 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 7670 nodes · 20782 edges · 274 communities (250 shown, 24 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 2676 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `be2a76efbc41da95` (713 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- ValidationError
- test/postgres/setup.ts
- postgres/checkpoint-store.ts
- full-sync-soak.integration.test.ts
- postgres/chain-archive-store.ts
- validation.ts
- height-versioned.test.ts
- runMigrations
- BlobIntegrityError
- PrivateBlockSource
- 3. Proof-blocking findings
- Database
- validation.test.ts
- MergeEntriesFn
- height-versioned.property.test.ts
- tape/index.ts
- checkShape
- cursor-table.property.test.ts
- chain-archive-rollover.ts
- node/client.test.ts
- binding.test.ts
- RawClient
- no-indexer-or-wallet-sdk.test.ts
- core-block-commit.test.ts
- height-versioned.ts
- vitest
- holds
- TransactionHandle
- type-check.ts
- RuntimeMetadata
- postgres-image.test.ts
- Global Constraints
- adapter.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- ProcessItems
- config-check.ts
- src/index.ts
- order.property.test.ts
- ReadPool
- mutation-evidence.d.mts
- vendored-ledger-files.test.ts
- declaration.ts
- no-chain-sync-import-guard.test.ts
- writer-lock-checks.ts
- chain-process.test.ts
- runner/process.ts
- history.test.ts
- CliBackend
- loop.test.ts
- node.test.ts
- FinalizedLoop
- PgTransactionHistoryStorage
- UmbraError
- networks.ts
- config/history.ts
- process-context.test.ts
- adapter-suite.ts
- harness.ts
- node/client.ts
- mapping.ts
- changes.property.test.ts
- validate.test.ts
- entries.ts
- process.test.ts
- change-capture.ts
- boundary.test.ts
- version-checks.ts
- cbor.ts
- module-tables.ts
- transform-checks.ts
- db/migrate.test.ts
- graph.ts
- format.test.ts
- LedgerPackage
- roles.ts
- describeNodeStoreExports
- interfaces/transaction-history-storage.ts
- failures.test.ts
- plain-data.ts
- zero-timeouts-checks.ts
- crash-worker.ts
- contents-hash.test.ts
- intake.test.ts
- api-server.test.ts
- builders.test.ts
- builder.ts
- validate.ts
- determinism-checks.ts
- cbor.property.test.ts
- column-rules.ts
- loop.ts
- builder.test.ts
- TransactionHistoryEntry
- vendored-ledger-v9.test.ts
- redact.test.ts
- ledger/types.ts
- core-private-source.test.ts
- identity.ts
- .error
- ModuleDeclaration
- ref_node_fs
- pg-tx-history-adapter.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- contents-hash.ts
- translatePostgresError
- PgChainArchiveStore
- NodeClient
- cold-boot-recovery.integration.test.ts
- ws-mutual-tls.test.ts
- chain-archive-replay-decode.integration.test.ts
- ChainArchiveStore
- version
- address
- T
- repository
- Design — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- Design — Sprint 7: Transaction History Storage
- facade-merge-loader.ts
- ADDED Requirements
- pack-install.mjs
- Full-Chain Storage
- .boolean
- a114Problems
- graph.py
- Full-Chain Storage — Design
- context
- table
- .getAll
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- README.md
- UmbraDB third-party component inventory (SBOM)
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- scripts
- Algebraic Specification of the midnight-pg-store Storage Layer
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Roadmap
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.1.0: Quint model checking
- compilerOptions
- Design — v1.0.0 API Surface & Release Contract
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Design — Postgres+JSONB storage rebuild
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB v0.9.5 "Penumbra" — Release Record
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Tasks — v1.0.0-infosec-signoff
- Repository agent policy
- Our Pledge
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Security policy & threat model
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0 API Surface & Release Contract
- Proposal — v1.0.0-perf-baseline
- Tasks — v1.0.0-perf-baseline
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
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 00023 — The blocks table's height partitions end at 5,000,000
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data
- GC architecture and query-tracing: research findings
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Acceptance criteria — v1.0.0-perf-baseline
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- repository
- esbuild-worker-bundle.test.ts
- run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- Requirement: the envelope module has no wallet-SDK runtime import
- bugs
- engines
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 214 edges
2. `UmbraError` - 197 edges
3. `ModuleDeclaration` - 105 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `runMigrations()` - 90 edges
6. `ValidationError` - 87 edges
7. `PgCheckpointStore` - 87 edges
8. `Database` - 81 edges
9. `translatePostgresError()` - 78 edges
10. `FinalizedLoop` - 73 edges

## Surprising Connections (you probably didn't know these)
- `Rework (class 1 — infra)` --references--> `ConnectionError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/storage-errors.ts
- `Scenario: A connection failure surfaces as ConnectionError` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/specs/temporal-kv/spec.md → src/interfaces/storage-errors.ts
- `Scenario: A connection failure during any method surfaces as ConnectionError` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → src/interfaces/storage-errors.ts
- `G4 — Contract doc set (all true)` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/acceptance.md → src/interfaces/storage-errors.ts
- `2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2)` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/v1.0.0-recovery-testing/tasks.md → src/interfaces/storage-errors.ts

## Import Cycles
- None detected.

## Communities (274 total, 24 thin omitted)

### Community 0 - "ValidationError"
Cohesion: 0.02
Nodes (154): JsonEncoded, TxHistoryRow, ConnectionError, Retryability, SerializationFailedError, StorageError, ValidationError, AssertExact (+146 more)

### Community 1 - "test/postgres/setup.ts"
Cohesion: 0.02
Nodes (146): JsonValue, KvRow, BatchSpec, CurrentState, InvariantResult, C5AnyFn, CurrentState, CurrentState (+138 more)

### Community 10 - "postgres/checkpoint-store.ts"
Cohesion: 0.03
Nodes (98): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointSummary, ChunkIntegrityError, ChunkMissingError, ContentHash (+90 more)

### Community 100 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (11): GcPass, HistGroup, SampleObservation, kvMapKey(), newPool(), readCurrentState(), { connectionUri }, DECLARED_ENVELOPE (+3 more)

### Community 102 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (17): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind (+9 more)

### Community 103 - "validation.ts"
Cohesion: 0.09
Nodes (20): PlacedDeclaration, Plain, FIELD_KINDS, LIFETIMES, TABLE_KINDS, badId, DECLARATION_PROPERTIES, duplicateId (+12 more)

### Community 108 - "height-versioned.test.ts"
Cohesion: 0.14
Nodes (14): BlockFails, Height, tokenMetadata(), versionedDatabase(), versionsOf(), outcome(), secondChangeProblems(), stateOf() (+6 more)

### Community 11 - "runMigrations"
Cohesion: 0.03
Nodes (102): DurabilityContractError, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, TransactionPoolerDetectedError, bootstrapChainArchiveSchema(), assertNoTransactionPooler(), classifyFsync() (+94 more)

### Community 112 - "BlobIntegrityError"
Cohesion: 0.20
Nodes (12): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+4 more)

### Community 115 - "PrivateBlockSource"
Cohesion: 0.24
Nodes (7): PrivateBlockSource, PrivateIntakeOptions, PublicDatabase, PublicWakes, PrivateOptions, 8. Private processes (PP), 14. Private processes

### Community 118 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 12 - "Database"
Cohesion: 0.03
Nodes (71): CoreChainFacts, Database, ReadOnlyDatabase, ChainStarted, Settings, TestBackend, TestDatabase, Case (+63 more)

### Community 122 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 125 - "MergeEntriesFn"
Cohesion: 0.13
Nodes (13): MergeEntriesFn, 3.1 Field mapping (write path), 3.2 Lifecycle-detail fidelity — the correctness-gate open question, 3.3 No runtime SDK import in core, 3. The adapter (the seam), 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature (+5 more)

### Community 127 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (14): Block, BlockFails, Counts, Effect, Key, Op, canonicalText(), readBack() (+6 more)

### Community 13 - "tape/index.ts"
Cohesion: 0.05
Nodes (73): Failure, Variant, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest, RequestId (+65 more)

### Community 134 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 135 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 136 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 14 - "node/client.test.ts"
Cohesion: 0.03
Nodes (56): NodeClientOptions, NodeRetry, ConnectSocket, NodeSocketEvents, Answer, FakeNode, Handler, Received (+48 more)

### Community 142 - "binding.test.ts"
Cohesion: 0.15
Nodes (7): TestDatabase, A113Observation, Binding, Outcome, outcomeOf(), A, B

### Community 145 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 15 - "core-block-commit.test.ts"
Cohesion: 0.04
Nodes (63): privateIntake, PublicIdentity, BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, PointCallbacks (+55 more)

### Community 158 - "height-versioned.ts"
Cohesion: 0.23
Nodes (6): heightVersionedTable, HeightVersionedTableOptions, Migration, Control, checkName(), migrationSql()

### Community 16 - "vitest"
Cohesion: 0.04
Nodes (52): Migration, Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, BlockRow, TxRow, Method (+44 more)

### Community 162 - "holds"
Cohesion: 0.47
Nodes (4): VersionedValue, StoredVersion, Model, holds()

### Community 17 - "TransactionHandle"
Cohesion: 0.04
Nodes (76): AsOf, Key, Namespace, Scope, Version, VersionedEntry, TransactionHandle, TransactionHandleInvalidError (+68 more)

### Community 172 - "type-check.ts"
Cohesion: 0.33
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 174 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 179 - "Global Constraints"
Cohesion: 0.22
Nodes (8): Write, Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 18 - "adapter.ts"
Cohesion: 0.04
Nodes (64): AdapterSpec, Binding, EventKind, Native, NormalizedCost, Proof, RawBlockContext, RawEvent (+56 more)

### Community 181 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 19 - "config-check.ts"
Cohesion: 0.04
Nodes (64): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckState, CheckStep, ConfigCheckReport, StepName (+56 more)

### Community 2 - "src/index.ts"
Cohesion: 0.04
Nodes (133): CheckpointStore, CheckpointStoreErrorCode, SharedStorageErrorCode, TemporalKV, TemporalKVErrorCode, Rollback, TransactionLeaseErrorCode, TransactionLeaseLayer (+125 more)

### Community 20 - "order.property.test.ts"
Cohesion: 0.05
Nodes (71): GraphInput, PastFaultCase, RefusalCase, Recorder, CheckName, GraphSpec, ModuleSpec, TESTED (+63 more)

### Community 208 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 209 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 21 - "declaration.ts"
Cohesion: 0.04
Nodes (60): BlockHeaderItem, UmbraConfig, BlockContext, BlockHeader, DefinedModule, FieldKind, FieldSchema, ItemSink (+52 more)

### Community 210 - "no-chain-sync-import-guard.test.ts"
Cohesion: 0.53
Nodes (5): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles()

### Community 22 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (58): Held, PgliteLockUse, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, acquirePgliteLock() (+50 more)

### Community 23 - "chain-process.test.ts"
Cohesion: 0.04
Nodes (50): BlockRef, InMemorySourceOptions, Wait, LoopObserver, SignalTarget, Job, WorkerEvent, A77Observation (+42 more)

### Community 24 - "runner/process.ts"
Cohesion: 0.05
Nodes (46): Bound, ChainCheck, ChainCheckInput, ChainIdentity, ChainSource, NodeWait, WaitingListener, CheckedConfig (+38 more)

### Community 25 - "history.test.ts"
Cohesion: 0.06
Nodes (65): versionEntry, HistoryInput, HistoryOptions, HistoryRow, HistoryRule, AppliedMigration, Simulation, Start (+57 more)

### Community 26 - "loop.test.ts"
Cohesion: 0.06
Nodes (47): InMemoryBlockSource, Contexts, LoopClass, RunnerBackend, RunnerDatabase, SeenCall, Started, Broken (+39 more)

### Community 27 - "node.test.ts"
Cohesion: 0.06
Nodes (25): ManualTimers, Failure, Variant, TapeClock, TapeNode, scriptedSockets(), turns(), until() (+17 more)

### Community 28 - "FinalizedLoop"
Cohesion: 0.06
Nodes (20): FinalizedLoop, HeightRun, SkipsAfterReconnect, Batching, WaitingInRead, ItemsAfterWrite, SkipsStartAtRestart, CommitsDespiteLastWrite (+12 more)

### Community 29 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (51): TransactionHistoryReader, TransactionHistoryStorage, TransactionHistoryWriter, PgTransactionHistoryStorage, store(), reason(), 1. Decisive scope, 2. Live-sync conformance test plan (+43 more)

### Community 3 - "UmbraError"
Cohesion: 0.04
Nodes (81): ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, ReadOptions, Transaction, DurabilityProbeOptions (+73 more)

### Community 30 - "networks.ts"
Cohesion: 0.05
Nodes (59): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+51 more)

### Community 31 - "config/history.ts"
Cohesion: 0.07
Nodes (52): CoreVersion, CoreSettings, HistoryCheck, HistoryCode, HistoryContext, Span, CheckedEntry, PlacedEntry (+44 more)

### Community 32 - "process-context.test.ts"
Cohesion: 0.06
Nodes (43): Revision, ResolvedGraph, MisuseListener, MisuseReports, ProcessContexts, ProcessContextsInput, PublishRefusal, Seen (+35 more)

### Community 33 - "adapter-suite.ts"
Cohesion: 0.09
Nodes (50): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState (+42 more)

### Community 34 - "harness.ts"
Cohesion: 0.09
Nodes (47): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+39 more)

### Community 35 - "node/client.ts"
Cohesion: 0.08
Nodes (44): Connection, HeadSubscriber, NodeCallOptions, NodeSubscription, Pending, State, Subscription, Waiter (+36 more)

### Community 36 - "mapping.ts"
Cohesion: 0.06
Nodes (38): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+30 more)

### Community 37 - "changes.property.test.ts"
Cohesion: 0.06
Nodes (50): ChangeKind, tableChanges, TouchedRow, Op, States, TableName, digestBlock(), takeChanges() (+42 more)

### Community 38 - "validate.test.ts"
Cohesion: 0.06
Nodes (47): ConfigCheckOptions, ProcessSide, coreEntry, plainData, ConfigContext, ConfigInput, EntryRef, CursorRow (+39 more)

### Community 39 - "entries.ts"
Cohesion: 0.04
Nodes (49): LedgerTableSettings, CoreEntryInput, CoreSettingsBase, EntryBuilder, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+41 more)

### Community 4 - "process.test.ts"
Cohesion: 0.04
Nodes (90): ProcessingEnd, ProcessStatus, LockResult, A43Case, A43Observation, Outcome, ProcessBackend, ProcessDatabase (+82 more)

### Community 40 - "change-capture.ts"
Cohesion: 0.06
Nodes (44): CaptureColumn, CapturedTable, CaptureState, ModuleColumn, ModuleTableOptions, GuardTableRow, CheckFunctionsOptions, IntegerCheckRow (+36 more)

### Community 41 - "boundary.test.ts"
Cohesion: 0.08
Nodes (44): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+36 more)

### Community 42 - "version-checks.ts"
Cohesion: 0.11
Nodes (37): MetadataBlock, MetadataNode, RuntimeMetadataEntry, LedgerTable, CountingNode, MetadataSelector, Select, Walk (+29 more)

### Community 43 - "cbor.ts"
Cohesion: 0.09
Nodes (43): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, checkSafeInteger() (+35 more)

### Community 44 - "module-tables.ts"
Cohesion: 0.08
Nodes (25): CheckedMigration, RefusalCode, RefusalPlace, Case, refuseNonDeterministic(), describeTable(), moduleTables(), catalogRelations() (+17 more)

### Community 45 - "transform-checks.ts"
Cohesion: 0.11
Nodes (29): TransformError, NotificationRange, baseRecords(), expectedText(), expectVariantOutput(), changedLines(), checkTape(), notificationRange() (+21 more)

### Community 46 - "db/migrate.test.ts"
Cohesion: 0.06
Nodes (22): SchemaItem, Snapshot, MigrationRow, PartOptions, TestPart, Phase, PostgresTestServer, openPostgres() (+14 more)

### Community 47 - "graph.ts"
Cohesion: 0.07
Nodes (45): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+37 more)

### Community 48 - "format.test.ts"
Cohesion: 0.07
Nodes (28): Metadata, Step, TapeCommandIo, Tape, expectGoldenRoundTrip(), fakeResult(), forkRecords(), isWebSocketUrl() (+20 more)

### Community 49 - "LedgerPackage"
Cohesion: 0.06
Nodes (25): LedgerEventKind, LedgerPackage, expectSmallStateReloadsByKey(), replay(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix (+17 more)

### Community 5 - "roles.ts"
Cohesion: 0.03
Nodes (89): MultiStatementRunner, Difference, OwnPart, Provision, QualifiedTable, SchemaMigration, SchemaModule, SchemaTable (+81 more)

### Community 50 - "describeNodeStoreExports"
Cohesion: 0.10
Nodes (24): StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports, NodeStoreSubject, childKey() (+16 more)

### Community 51 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.06
Nodes (40): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, StoredEntryJson, Command (+32 more)

### Community 52 - "failures.test.ts"
Cohesion: 0.09
Nodes (22): CoreChainBinding, ProcessReason, ReasonCode, RetryCode, UnexpectedCursor, Process, RetryCondition, StatusFacts (+14 more)

### Community 53 - "plain-data.ts"
Cohesion: 0.07
Nodes (33): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+25 more)

### Community 54 - "zero-timeouts-checks.ts"
Cohesion: 0.09
Nodes (32): Run, Job, WorkerEvent, Outcome, openBlockWrites(), expectNeverCutOffNorHung(), settings(), apiRead() (+24 more)

### Community 55 - "crash-worker.ts"
Cohesion: 0.06
Nodes (39): SaveCheckpointOptions, CoTxCallable, CoTxPauseInfo, CrashHook, validateSaveOptions(), describeCaughtError(), main(), observeClientPauseBeforeCursor() (+31 more)

### Community 57 - "contents-hash.test.ts"
Cohesion: 0.09
Nodes (27): ModuleTable, ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, freshDatabase(), hashOf() (+19 more)

### Community 59 - "intake.test.ts"
Cohesion: 0.11
Nodes (30): PrivateSeen, A114Observation, A116Observation, TestLink, privateCursorHeight(), a113Run(), withCore(), directPublic() (+22 more)

### Community 6 - "api-server.test.ts"
Cohesion: 0.03
Nodes (81): ApiRegistry, Connection, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, StartedModuleApi, ChainDataAnswer, ChainDataView (+73 more)

### Community 61 - "builders.test.ts"
Cohesion: 0.07
Nodes (29): Entry, TestKey, LoadOptions, Accepts, ConfigOf, CoreSettingsGiven, Minimal, PricesSettings (+21 more)

### Community 63 - "builder.ts"
Cohesion: 0.08
Nodes (15): Refusal, ScriptedNode, Link, TapeBuilder, TapeBuilderOptions, RecordingError, SessionEnd, withBuilder() (+7 more)

### Community 64 - "validate.ts"
Cohesion: 0.10
Nodes (35): HistoryFinding, ConfigRule, CursorRule, Finding, Issue, Plain, coreSettingsSchema(), closest() (+27 more)

### Community 67 - "determinism-checks.ts"
Cohesion: 0.09
Nodes (27): PrivateBackend, SessionSeen, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A112Observation, Wiring (+19 more)

### Community 68 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 7 - "column-rules.ts"
Cohesion: 0.02
Nodes (100): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+92 more)

### Community 70 - "loop.ts"
Cohesion: 0.15
Nodes (31): HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments, PointSchedule (+23 more)

### Community 71 - "builder.test.ts"
Cohesion: 0.09
Nodes (21): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Frame, Script, ScriptedRequest (+13 more)

### Community 72 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (13): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, ReplayableStorage, capitalize(), encodeContent(), encodeSections(), encodeStoredEntry(), rowToEntry() (+5 more)

### Community 73 - "vendored-ledger-v9.test.ts"
Cohesion: 0.14
Nodes (27): FreshInstanceRequest, FreshInstanceResult, NodeRoot, freeAll(), runInFreshInstance(), bigCell(), cell(), contractAddress() (+19 more)

### Community 74 - "redact.test.ts"
Cohesion: 0.12
Nodes (25): ConfigCheckSeams, PlainObject, RedactableConfig, RedactionForms, redactor, SecretForm, TextPattern, EntryView (+17 more)

### Community 75 - "ledger/types.ts"
Cohesion: 0.10
Nodes (26): ApplyInput, ApplyOutput, LedgerEvent, LedgerTask, LogItem, ParsedTransaction, StateHandle, StoredNode (+18 more)

### Community 77 - "core-private-source.test.ts"
Cohesion: 0.09
Nodes (9): AdmittedKey, privateBackbone(), fakePublic(), fakeRead(), CORE_KEY_REGISTRY, CORE_KEY_REGISTRY_MIGRATIONS, NONE, PUBLIC_POLL_MS (+1 more)

### Community 78 - "identity.ts"
Cohesion: 0.14
Nodes (22): LedgerName, LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerPackageOptions, text(), checkPackageFiles() (+14 more)

### Community 79 - ".error"
Cohesion: 0.15
Nodes (7): connectionFailure, Lost, backoffDelay(), clientClosed(), run(), BACKOFF_BASE_MS, SYSTEM_TIMERS

### Community 8 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (92): SchemaWriteHandle, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, PlannedSchema, SchemaPlan (+84 more)

### Community 80 - "ref_node_fs"
Cohesion: 0.09
Nodes (12): Lockfile, Manifest, check, checker, env, forwarded, repoRoot, reportPath (+4 more)

### Community 81 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 84 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 85 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 89 - "contents-hash.ts"
Cohesion: 0.11
Nodes (21): PageOptions, contentsHash(), encodeTableRow(), renderKeyValue(), countRows(), fromClause(), rowsInKeyOrder(), explain() (+13 more)

### Community 9 - "translatePostgresError"
Cohesion: 0.03
Nodes (101): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionFaultError, TransactionLeaseError, TransactionOptions (+93 more)

### Community 90 - "PgChainArchiveStore"
Cohesion: 0.19
Nodes (10): BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf(), sha256Hex() (+2 more)

### Community 91 - "NodeClient"
Cohesion: 0.20
Nodes (10): NodeClient, bytesParameter(), countParameter(), hashParameter(), heightParameter(), blockUnavailable(), invalidParameter(), walkOver() (+2 more)

### Community 94 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.19
Nodes (19): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+11 more)

### Community 96 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (18): Attempt, locked(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+10 more)

### Community 97 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.15
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+12 more)

### Community 98 - "ChainArchiveStore"
Cohesion: 0.09
Nodes (10): ChainArchiveStore, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents, `transactions` (chain_archive) (+2 more)

### Community 104 - "version"
Cohesion: 0.10
Nodes (19): version(), Requirement: CF-2 Builders fill identity and version from the build, Scenario: A misspelled setting is a type error, 3. The freeze: build + package.json (G1), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Scenario: The kv_current HOT ratio is measured and recorded under the soak workload, Scenario: The kv_current table reports fillfactor=90 after migration, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`) (+11 more)

### Community 113 - "address"
Cohesion: 0.12
Nodes (17): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite (+9 more)

### Community 119 - "T"
Cohesion: 0.14
Nodes (16): T(), input(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, Scenario: Version and timestamp addressing agree, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error (+8 more)

### Community 128 - "repository"
Cohesion: 0.14
Nodes (15): repository(), 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA (+7 more)

### Community 130 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (13): fakePackage(), regular(), system(), 10. Tables, 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 9.1 Backups (BK; Q83, Q85) (+5 more)

### Community 133 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 140 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.14
Nodes (12): 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 5. WalletState envelope, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage (+4 more)

### Community 152 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 154 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value (+3 more)

### Community 163 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 178 - "Full-Chain Storage"
Cohesion: 0.22
Nodes (7): 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 4. How to run it, 5. Acceptance criteria status, 6. Known limitations, Full-Chain Storage

### Community 201 - ".boolean"
Cohesion: 0.33
Nodes (6): Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 227 - "a114Problems"
Cohesion: 0.60
Nodes (6): a114Problems(), a116Problems(), heights(), readProblems(), rowProblems(), writes()

### Community 62 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 65 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 69 - "context"
Cohesion: 0.07
Nodes (22): schemaName(), module(), context(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 86 - "table"
Cohesion: 0.09
Nodes (24): table(), against(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, Cursor tables, Data that is not a function of the chain (+16 more)

### Community 87 - ".getAll"
Cohesion: 0.08
Nodes (25): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+17 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: Schema isolation is the default, not opt-in, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A connection failure surfaces as ConnectionError (+13 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: set rejects a top-level null value with ValidationError before any statement, Scenario: A bare numeric watermark value round-trips exactly (+12 more)

### Community 107 - "package.json"
Cohesion: 0.10
Nodes (20): bin, umbradb, description, exports, files, homepage, license, main (+12 more)

### Community 109 - "README.md"
Cohesion: 0.16
Nodes (5): For historical reference only, Tasks — superseded by per-sprint openspec changes, UmbraDB v1.0.0 — Release Record (PENDING), What 1.0.0 additionally requires, What must happen before this record can be completed

### Community 110 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 111 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 116 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 117 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 121 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 123 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.12
Nodes (10): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside (+2 more)

### Community 124 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+8 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 129 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (14): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 3. Modules (+6 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note), Scenario: A connection failure during any method surfaces as ConnectionError (+6 more)

### Community 132 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 139 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 141 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 144 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 148 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.15
Nodes (12): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover) (+4 more)

### Community 149 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 151 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 156 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 157 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 159 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 160 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.18
Nodes (10): 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 3.1 The frozen catalog (the machine-facing API), 3. G3 — Frozen, cleaned error-code catalog with `retryable`, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line (+2 more)

### Community 161 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 164 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.20
Nodes (10): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 7. Driver / toolkit choice (+2 more)

### Community 165 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 166 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.20
Nodes (10): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+2 more)

### Community 167 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 168 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 169 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 170 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 171 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 175 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 176 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 177 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 180 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 182 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 183 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.22
Nodes (8): 11. Chain data, 13. Contract data, 15. Backups, 16. Browser, 18. Whole-system faults, differentials and measurements, 19. Close-out, 8. Admin endpoints, Tasks — CORE-ARCH: the standalone indexer's core architecture

### Community 184 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 185 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 187 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 188 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 189 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 190 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 191 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 192 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 193 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 194 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 195 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 196 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 197 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 198 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 199 - "Security policy & threat model"
Cohesion: 0.29
Nodes (7): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 200 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 202 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 203 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 204 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 205 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 207 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 211 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 212 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 213 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 214 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 215 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 216 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 217 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 218 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 219 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 220 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 221 - "Acceptance — v1.0.0 API Surface & Release Contract"
Cohesion: 0.33
Nodes (5): Acceptance — v1.0.0 API Surface & Release Contract, G20 — Lean cut-line, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in), Precondition (blocks the whole change)

### Community 222 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, Why

### Community 223 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 224 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 225 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 226 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 228 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 229 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 230 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 231 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 232 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 233 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 234 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 235 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 236 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.40
Nodes (4): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Suggested fix

### Community 237 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 238 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 239 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 240 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 241 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 242 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 243 - "Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data"
Cohesion: 0.40
Nodes (5): Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data, Scenario: replay from the durable cursor converges on current state, Scenario: the durable watermark is never ahead of durable data, Scenario: the invariant holds under synchronous_commit = off, Scenario: the invariant holds under synchronous_commit = on

### Community 244 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 245 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 246 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.50
Nodes (3): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Suggested fix

### Community 247 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 248 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 249 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 250 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 251 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 252 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 253 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 257 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 56 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+33 more)

### Community 58 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 60 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 66 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+19 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+19 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0, Requirement: the baseline reflects the batched (shipped) save shape (+17 more)

### Community 93 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.08
Nodes (25): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+17 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form, Requirement: G9/T3 — a killed lease-holder does not wedge the lease, Requirement: G9 — the crash and soak suites terminate within a bounded wall-clock even when Postgres is half-dead (+17 more)

### Community 99 - "Requirements"
Cohesion: 0.09
Nodes (22): Purpose, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: Schema isolation is the default, not opt-in, Requirement: Unconditional writes are gapless and monotonic (Law T1), Requirements (+14 more)

## Knowledge Gaps
- **40 isolated node(s):** `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx`, `typedoc`, `@types/node` (+35 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2794 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ValidationError`, `test/postgres/setup.ts`, `src/index.ts`, `UmbraError`, `process.test.ts`, `roles.ts`, `api-server.test.ts`, `column-rules.ts`, `ModuleDeclaration`, `translatePostgresError`, `postgres/checkpoint-store.ts`, `runMigrations`, `Database`, `tape/index.ts`, `node/client.test.ts`, `core-block-commit.test.ts`, `adapter.ts`, `config-check.ts`, `order.property.test.ts`, `declaration.ts`, `writer-lock-checks.ts`, `chain-process.test.ts`, `runner/process.ts`, `history.test.ts`, `loop.test.ts`, `node.test.ts`, `networks.ts`, `process-context.test.ts`, `adapter-suite.ts`, `mapping.ts`, `changes.property.test.ts`, `validate.test.ts`, `entries.ts`, `boundary.test.ts`, `version-checks.ts`, `module-tables.ts`, `transform-checks.ts`, `db/migrate.test.ts`, `format.test.ts`, `describeNodeStoreExports`, `interfaces/transaction-history-storage.ts`, `failures.test.ts`, `plain-data.ts`, `zero-timeouts-checks.ts`, `contents-hash.test.ts`, `intake.test.ts`, `builders.test.ts`, `determinism-checks.ts`, `cbor.property.test.ts`, `builder.test.ts`, `vendored-ledger-v9.test.ts`, `redact.test.ts`, `core-private-source.test.ts`, `identity.ts`, `.error`, `ref_node_fs`, `pg-tx-history-adapter.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `cold-boot-recovery.integration.test.ts`, `ws-mutual-tls.test.ts`, `chain-archive-replay-decode.integration.test.ts`, `full-sync-soak.integration.test.ts`, `package.json`, `height-versioned.test.ts`, `BlobIntegrityError`, `validation.test.ts`, `height-versioned.property.test.ts`, `mutation-per-adapter.mjs`, `cursor-table.property.test.ts`, `binding.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `excluded-not-exported.test.ts`, `facade-merge-loader.ts`, `postgres-image.test.ts`, `vendored-ledger-files.test.ts`, `no-chain-sync-import-guard.test.ts`, `esbuild-worker-bundle.test.ts`?**
  _High betweenness centrality (0.342) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 11 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx` to the rest of the system?**
  _40 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ValidationError` be split into smaller, more focused modules?**
  _Cohesion score 0.021940298507462687 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `Design — CORE-ARCH: the standalone indexer's core architecture`, `process.test.ts`, `roles.ts`, `checkShape`, `api-server.test.ts`, `ModuleDeclaration`, `Database`, `node/client.test.ts`, `core-block-commit.test.ts`, `config-check.ts`, `order.property.test.ts`, `declaration.ts`, `writer-lock-checks.ts`, `chain-process.test.ts`, `runner/process.ts`, `history.test.ts`, `loop.test.ts`, `FinalizedLoop`, `networks.ts`, `config/history.ts`, `process-context.test.ts`, `node/client.ts`, `mapping.ts`, `changes.property.test.ts`, `validate.test.ts`, `version-checks.ts`, `cbor.ts`, `module-tables.ts`, `RuntimeMetadata`, `db/migrate.test.ts`, `graph.ts`, `transform-checks.ts`, `failures.test.ts`, `plain-data.ts`, `zero-timeouts-checks.ts`, `builders.test.ts`, `builder.ts`, `validate.ts`, `loop.ts`, `ledger/types.ts`, `core-private-source.test.ts`, `identity.ts`, `.error`, `NodeClient`, `validation.ts`, `height-versioned.test.ts`, `validation.test.ts`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `test/postgres/setup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020980757293606454 - nodes in this community are weakly interconnected._