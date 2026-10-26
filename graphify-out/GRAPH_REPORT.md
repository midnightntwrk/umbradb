# Graph Report - UmbraDB

## Corpus Check
- 841 files · ~1,292,726 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 8883 nodes · 25550 edges · 259 communities (237 shown, 22 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 3057 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `f7375f3dc3fbf1b5` (841 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionLeaseLayer
- src/index.ts
- NodeClient
- binding.test.ts
- PrivateBlockSource
- builds.ts
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- version-table.ts
- config/history.ts
- determinism-checks.ts
- checkShape
- process-admin.ts
- attempt
- chain-events-source.test.ts
- chain-archive-rollover.ts
- tape/index.ts
- RawClient
- no-indexer-or-wallet-sdk.test.ts
- BlobIntegrityError
- InMemoryBlockSource
- ProcessItems
- a114Run
- intake.test.ts
- api-server.test.ts
- BlockItems
- component-table.test.ts
- opt-out.test.ts
- builder.test.ts
- db/errors.ts
- loop.test.ts
- n
- mutation-evidence.d.mts
- builder.negative-control.test.ts
- UmbraError
- FinalizedLoop
- height-versioned.test.ts
- node/client.test.ts
- runner/process.ts
- admin-harness.ts
- config-check.ts
- adapter.ts
- vitest
- ingest-crash.test.ts
- child-processes.test.ts
- PgTransactionHistoryStorage
- range.ts
- changes.property.test.ts
- cbor.ts
- validate.ts
- range.test.ts
- ModuleDeclaration
- describeNodeStoreExports
- module-api.test.ts
- ValidationError
- core-config.test.ts
- order.property.test.ts
- UmbraDBSql
- adapter-fixtures.ts
- chain-data.test.ts
- .value
- transform-checks.ts
- change-capture.ts
- NodeBlockSource
- entries.ts
- postgres/transaction-history-storage.ts
- crash-worker.ts
- LedgerPackage
- ledger/types.ts
- validation.ts
- failures.ts
- mapping.ts
- zero-timeouts-checks.ts
- serve.test.ts
- chain-process.test.ts
- networks.ts
- runMigrations
- graph.ts
- post-block-update-checks.ts
- fetch-fixtures.ts
- version-checks.ts
- chain-events-decode.test.ts
- plain-data.ts
- boundary.test.ts
- declaration.ts
- chain-placement.test.ts
- .show
- checks.test.ts
- db/migrate.ts
- core-private-source.test.ts
- database-fixtures.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- items.ts
- column-rules.ts
- tx-replay-decoder.ts
- PgChainArchiveStore
- private/backends.ts
- ws-mutual-tls.test.ts
- BlockRef
- ChainArchiveStore
- 3. Block source and ingest
- readiness.test.ts
- postgres/chain-archive-store.ts
- address
- Tasks — v1.0.0-infosec-signoff
- mutation-per-adapter.mjs
- pg
- twox.ts
- ADDED Requirements
- history.property.test.ts
- .boolean
- failingSource
- T
- saveAndAdvance
- graph.py
- Full-Chain Storage — Design
- ADDED Requirements
- fn
- ADDED Requirements
- UmbraDB software supply-chain directory
- ADDED Requirements
- package.json
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- stryker.conf.json
- ADDED Requirements
- scripts
- Algebraic Specification of the midnight-pg-store Storage Layer
- UmbraDB module guide
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- devDependencies
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Storage Algebra Lean M2 Retention Sprint
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Roadmap
- compilerOptions
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB third-party component inventory (SBOM)
- 3. Proof-blocking findings
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- UmbraDB
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- Design — Postgres+JSONB storage rebuild
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.1.0: Quint model checking
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Repository agent policy
- Our Pledge
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Security policy & threat model
- 12. Milestone status
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0 API Surface & Release Contract
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 5. Recommended candidate model
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
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00023 — The blocks table's height partitions end at 5,000,000
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- bug-report.md
- feature-request.md
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Acceptance criteria — v1.0.0-perf-baseline
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- Requirement: set is an idempotent, unconditional overwrite (Law W1)
- repository
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bin
- bugs
- engines
- oracle/run.sh
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- README.md

## God Nodes (most connected - your core abstractions)
1. `vitest` - 261 edges
2. `UmbraError` - 215 edges
3. `ModuleDeclaration` - 124 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `runMigrations()` - 90 edges
6. `PgCheckpointStore` - 87 edges
7. `ValidationError` - 87 edges
8. `NodeClient` - 85 edges
9. `Database` - 84 edges
10. `InMemoryBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `2.1 Historical implementation baseline` --references--> `PgTemporalKV`  [INFERRED]
  Formal/STORAGE_ALGEBRA_LEAN_RESEARCH.md → src/postgres/temporal-kv.ts
- `Scenario: load before any save rejects with CheckpointNotFoundError` --references--> `CheckpointNotFoundError`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/specs/wallet-state-envelope/spec.md → src/interfaces/checkpoint-store.ts
- `Scenario: save on a caller transaction behaves identically to the internal-transaction path for a reader` --references--> `CheckpointSummary`  [INFERRED]
  openspec/changes/v1.0.0-durable-checkpoint-cursor/specs/durable-composition/spec.md → src/interfaces/checkpoint-store.ts
- `The honest-test pattern (what makes each required test non-vacuous)` --references--> `ChunkMissingError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/checkpoint-store.ts
- `Scenario: A chunk shared across wallets survives one wallet's prune` --references--> `ChunkMissingError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (259 total, 22 thin omitted)

### Community 0 - "PgTransactionLeaseLayer"
Cohesion: 0.01
Nodes (246): JsonValue, PgCheckpointStore, KvRow, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, Adapters, BatchSpec (+238 more)

### Community 1 - "src/index.ts"
Cohesion: 0.02
Nodes (206): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError, ChunkMissingError (+198 more)

### Community 10 - "NodeClient"
Cohesion: 0.04
Nodes (77): NodeSourceOptions, CoreChainBinding, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription (+69 more)

### Community 102 - "binding.test.ts"
Cohesion: 0.13
Nodes (13): TestDatabase, A113Observation, Binding, Outcome, privateCursorHeight(), readPrivateCursor(), a113Run(), bindingIn() (+5 more)

### Community 103 - "PrivateBlockSource"
Cohesion: 0.22
Nodes (9): PrivateBlockSource, PrivateIntakeOptions, PublicDatabase, PublicWakes, PrivateOptions, publicNotStarted(), openPublicDatabase(), 8. Private processes (PP) (+1 more)

### Community 105 - "builds.ts"
Cohesion: 0.19
Nodes (17): PrivateProcess, PrivateRefusal, privateBackbone(), directPublic(), genesisBlock(), genesisHex(), launchPrivate(), poll() (+9 more)

### Community 107 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.11
Nodes (17): Hash, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence) (+9 more)

### Community 109 - "version-table.ts"
Cohesion: 0.21
Nodes (18): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+10 more)

### Community 11 - "config/history.ts"
Cohesion: 0.04
Nodes (107): CoreVersion, ConfiguredDatabase, CoreSettings, versionEntry, HistoryCheck, HistoryCode, HistoryContext, HistoryOptions (+99 more)

### Community 110 - "determinism-checks.ts"
Cohesion: 0.20
Nodes (16): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, startPrivate(), a146Hashes(), a146Refusals(), against() (+8 more)

### Community 119 - "checkShape"
Cohesion: 0.30
Nodes (8): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), 14. External claims and their evidence

### Community 12 - "process-admin.ts"
Cohesion: 0.04
Nodes (102): ConfigFacts, OpenedConfig, OpenedFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, DigestRow, ModuleFacts (+94 more)

### Community 122 - "attempt"
Cohesion: 0.15
Nodes (14): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+6 more)

### Community 125 - "chain-events-source.test.ts"
Cohesion: 0.17
Nodes (7): NodeCallOptions, RecordingClient, open(), quiet(), chain, closing, SYSTEM_EVENTS_STORAGE

### Community 127 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 13 - "tape/index.ts"
Cohesion: 0.05
Nodes (80): Recorded, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest, RequestId, Json (+72 more)

### Community 134 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 135 - "BlobIntegrityError"
Cohesion: 0.29
Nodes (10): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation), Requirement: The chain-archive error classes are excluded from the frozen surface, Scenario: Chain-archive classes are not exported and their codes are not frozen (+2 more)

### Community 14 - "InMemoryBlockSource"
Cohesion: 0.04
Nodes (89): BlockItemSource, InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, ItemsAfterWrite, A43Case, A43Observation (+81 more)

### Community 143 - "a114Run"
Cohesion: 0.24
Nodes (5): PublicCore, TestLink, against(), a114Run(), against()

### Community 144 - "intake.test.ts"
Cohesion: 0.32
Nodes (12): PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), a116Run(), follow(), heights() (+4 more)

### Community 15 - "api-server.test.ts"
Cohesion: 0.03
Nodes (79): Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, VersionedResponse, ChainDataAnswer, ApiError (+71 more)

### Community 151 - "BlockItems"
Cohesion: 0.24
Nodes (5): BlockItems, EagerItems, EagerLoop, KeptItems, KeptLoop

### Community 155 - "component-table.test.ts"
Cohesion: 0.18
Nodes (7): DesignTable, RowCoverage, typeScriptFiles(), OPENERS, ROWS, SUITE, REPOSITORY

### Community 16 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (73): CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, ConsistentRead (+65 more)

### Community 17 - "builder.test.ts"
Cohesion: 0.04
Nodes (71): ConnectionFrames, Metadata, Step, Frame, FindTapeOptions, FoundTape, ReportedTest, RealTape (+63 more)

### Community 18 - "db/errors.ts"
Cohesion: 0.04
Nodes (66): ConfiguredDatabaseOptions, CommittedHeight, Database, ReadTimeoutSetting, PgliteOptions, ErrorDetails, Settings, TestBackend (+58 more)

### Community 19 - "loop.test.ts"
Cohesion: 0.04
Nodes (73): ReadOnlyDatabase, Commit, Committed, WaitingInRead, Contexts, LoopClass, RunnerDatabase, Started (+65 more)

### Community 190 - "n"
Cohesion: 0.29
Nodes (7): Absent, n(), 3.3 T3 omits the current event and cannot replay a pruned suffix, 4. Law-by-law repair map, Requirement: CheckpointSummary metadata is populated and label round-trips, Scenario: A label given at save time is returned by history and load, Scenario: byteLength, chunkCount, and createdAt reflect the saved payload

### Community 196 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 197 - "builder.negative-control.test.ts"
Cohesion: 0.29
Nodes (3): Failure, Variant, WrongRecording

### Community 2 - "UmbraError"
Cohesion: 0.02
Nodes (132): ReadOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, MultiStatementRunner, Job, JobQueue (+124 more)

### Community 20 - "FinalizedLoop"
Cohesion: 0.05
Nodes (52): HeightRange, ResolvedRange, LateUse, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+44 more)

### Community 21 - "height-versioned.test.ts"
Cohesion: 0.04
Nodes (69): BlockWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Migration (+61 more)

### Community 22 - "node/client.test.ts"
Cohesion: 0.03
Nodes (46): NodeRetry, NodeTimers, Answer, FakeNode, Handler, Received, recorded, ManualTimers (+38 more)

### Community 23 - "runner/process.ts"
Cohesion: 0.04
Nodes (60): AdminStarter, Bound, ChainCheck, ChainCheckInput, ChainSource, CoreChainFacts, NodeWait, WaitingListener (+52 more)

### Community 24 - "admin-harness.ts"
Cohesion: 0.05
Nodes (76): ProcessHandle, AdminRun, Answered, Answerer, Expected, Hold, Observation, Prober (+68 more)

### Community 25 - "config-check.ts"
Cohesion: 0.04
Nodes (70): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, StepName, StepReport (+62 more)

### Community 26 - "adapter.ts"
Cohesion: 0.04
Nodes (68): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+60 more)

### Community 27 - "vitest"
Cohesion: 0.03
Nodes (55): Finding, Lockfile, Manifest, RepositoryFile, Upstream, GuardViolation, ReportedTest, canPin() (+47 more)

### Community 28 - "ingest-crash.test.ts"
Cohesion: 0.05
Nodes (72): BlockHeader, RUNTIME, Decoded, FetchSeen, CrashEvent, CrashJob, ingest, SourceClass (+64 more)

### Community 29 - "child-processes.test.ts"
Cohesion: 0.03
Nodes (65): ParentJob, Kill, Orphaned, SourceFile, FailsOnceStarted, SlowToReportPorts, SourceFile, LockResult (+57 more)

### Community 3 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (166): TransactionHistoryStorage, PgTransactionHistoryStorage, CheckpointStore, Watermarks, PgWalletStateEnvelopeStore, decode(), encode(), splitChunks() (+158 more)

### Community 30 - "range.ts"
Cohesion: 0.04
Nodes (66): NodeClientOptions, NodeSubscription, Refusal, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command (+58 more)

### Community 31 - "changes.property.test.ts"
Cohesion: 0.04
Nodes (74): DigestRow, Op, States, TableName, identityRow(), captured(), captureFunction(), hex() (+66 more)

### Community 32 - "cbor.ts"
Cohesion: 0.04
Nodes (73): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+65 more)

### Community 33 - "validate.ts"
Cohesion: 0.04
Nodes (71): coreEntry, HistoryFinding, ConfigRule, CursorRule, EntryRef, Finding, Issue, Plain (+63 more)

### Community 34 - "range.test.ts"
Cohesion: 0.04
Nodes (42): ConnectSocket, Script, ScriptedNode, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, BoundaryOptions (+34 more)

### Community 36 - "ModuleDeclaration"
Cohesion: 0.05
Nodes (54): AppliedMigration, ModuleDeclaration, Revision, EntryRange, ResolvedGraph, StartedModuleApi, LoopInput, MisuseListener (+46 more)

### Community 37 - "describeNodeStoreExports"
Cohesion: 0.07
Nodes (51): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+43 more)

### Community 39 - "module-api.test.ts"
Cohesion: 0.06
Nodes (59): ErrorCode, GraphInput, PastFaultCase, RefusalCase, resolveGraph(), declaration(), logsProvider(), reader() (+51 more)

### Community 4 - "ValidationError"
Cohesion: 0.02
Nodes (145): TransactionHistoryReader, TransactionHistoryWriter, ValidationError, AsOf, AssertExact, Key, Namespace, Scope (+137 more)

### Community 40 - "core-config.test.ts"
Cohesion: 0.06
Nodes (51): adminRoutes, AdminEndpoint, AdminPart, AdminView, ReadinessFacts, CoreSeen, answerAdmin(), frozenMap() (+43 more)

### Community 41 - "order.property.test.ts"
Cohesion: 0.04
Nodes (60): PointName, HeightFailure, Misuse, CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER (+52 more)

### Community 42 - "UmbraDBSql"
Cohesion: 0.07
Nodes (49): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+41 more)

### Community 43 - "adapter-fixtures.ts"
Cohesion: 0.09
Nodes (56): ApplyOutput, StoredNode, Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+48 more)

### Community 44 - "chain-data.test.ts"
Cohesion: 0.07
Nodes (60): BlockParsed, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime (+52 more)

### Community 45 - ".value"
Cohesion: 0.09
Nodes (37): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef (+29 more)

### Community 46 - "transform-checks.ts"
Cohesion: 0.08
Nodes (41): Failure, Variant, TransformError, NotificationRange, until(), reason(), baseRecords(), expectedText() (+33 more)

### Community 47 - "change-capture.ts"
Cohesion: 0.06
Nodes (46): CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow, GuardTableRow, optOut (+38 more)

### Community 48 - "NodeBlockSource"
Cohesion: 0.09
Nodes (16): BlockEventSource, CoreBlockItems, HeadWait, NodeBlockSource, Prefetch, NodeHeader, PreparedBlock, QueueRunner (+8 more)

### Community 49 - "entries.ts"
Cohesion: 0.04
Nodes (52): LedgerTableSettings, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+44 more)

### Community 5 - "postgres/transaction-history-storage.ts"
Cohesion: 0.03
Nodes (120): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryEntry (+112 more)

### Community 50 - "crash-worker.ts"
Cohesion: 0.06
Nodes (42): WatermarkKey, WatermarkKind, WatermarkValue, WatermarkRow, CoTxCallable, CoTxPauseInfo, CrashHook, describeCaughtError() (+34 more)

### Community 51 - "LedgerPackage"
Cohesion: 0.05
Nodes (33): LedgerEventKind, LedgerPackage, 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix, 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence (+25 more)

### Community 52 - "ledger/types.ts"
Cohesion: 0.08
Nodes (40): BlockParsedOptions, LoadLedger, TransactionParser, LedgerName, LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage (+32 more)

### Community 53 - "validation.ts"
Cohesion: 0.06
Nodes (42): ProcessContext, DeclarationRule, PlacedDeclaration, Plain, ShapeCase, Stats, schemaItem(), schemaModule() (+34 more)

### Community 54 - "failures.ts"
Cohesion: 0.07
Nodes (24): ProcessReason, ReasonCode, RetryCode, Unwrapped, Heartbeat, UnexpectedCursor, Process, RetryCondition (+16 more)

### Community 55 - "mapping.ts"
Cohesion: 0.07
Nodes (35): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+27 more)

### Community 56 - "zero-timeouts-checks.ts"
Cohesion: 0.08
Nodes (36): Run, Job, WorkerEvent, Outcome, openBlockWrites(), expectNeverCutOffNorHung(), settings(), apiRead() (+28 more)

### Community 57 - "serve.test.ts"
Cohesion: 0.07
Nodes (33): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer, AdminSnapshot (+25 more)

### Community 58 - "chain-process.test.ts"
Cohesion: 0.06
Nodes (33): Job, WorkerEvent, A77Observation, A78Observation, A90Observation, Failing, Flaky, Seen (+25 more)

### Community 59 - "networks.ts"
Cohesion: 0.06
Nodes (43): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+35 more)

### Community 6 - "runMigrations"
Cohesion: 0.03
Nodes (116): UmbraDBConnectionOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, RunMigrationsOptions, Started, SqliteTxRow (+108 more)

### Community 60 - "graph.ts"
Cohesion: 0.08
Nodes (44): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeFacts, Spanned (+36 more)

### Community 62 - "post-block-update-checks.ts"
Cohesion: 0.10
Nodes (34): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+26 more)

### Community 64 - "fetch-fixtures.ts"
Cohesion: 0.09
Nodes (34): ArgType, BlockOptions, CallSpec, chainBlock, PalletSpec, blake2b256(), compress(), rotateRight() (+26 more)

### Community 65 - "version-checks.ts"
Cohesion: 0.14
Nodes (30): CountingNode, MetadataSelector, Select, Walk, Answers, toHex(), H(), withCore() (+22 more)

### Community 67 - "chain-events-decode.test.ts"
Cohesion: 0.13
Nodes (26): Field, Registry, fill(), le(), merge(), metadataWith(), rotl(), round() (+18 more)

### Community 68 - "plain-data.ts"
Cohesion: 0.09
Nodes (29): LoadedConfig, LoadOptions, PlainArray, plainData, PlainDataNode, PlainDataRule, Walk, Row (+21 more)

### Community 69 - "boundary.test.ts"
Cohesion: 0.13
Nodes (34): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+26 more)

### Community 7 - "declaration.ts"
Cohesion: 0.02
Nodes (105): BlockTransaction, UmbraConfig, ReadHandle, ApiRegistry, BlockContext, DefinedModule, FieldKind, FieldSchema (+97 more)

### Community 71 - "chain-placement.test.ts"
Cohesion: 0.09
Nodes (33): BodyExtrinsic, BlockBody, MetadataVariant, RuntimeMetadataView, ChainTransaction, ChainEvent, EventPhase, RecordTypes (+25 more)

### Community 74 - ".show"
Cohesion: 0.07
Nodes (22): AllowedDetail, schemaName(), module(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 76 - "checks.test.ts"
Cohesion: 0.08
Nodes (23): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql() (+15 more)

### Community 8 - "db/migrate.ts"
Cohesion: 0.04
Nodes (104): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference (+96 more)

### Community 83 - "core-private-source.test.ts"
Cohesion: 0.09
Nodes (8): AdmittedKey, fakePublic(), fakeRead(), CORE_KEY_REGISTRY, CORE_KEY_REGISTRY_MIGRATIONS, NONE, PUBLIC_POLL_MS, PRIVATE_CORE_DIGEST

### Community 84 - "database-fixtures.ts"
Cohesion: 0.08
Nodes (20): CheckTarget, CliBackend, Snapshot, Job, openPgliteOn(), blocksSql(), pgliteCliBackend(), postgresCliBackend() (+12 more)

### Community 86 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 87 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 89 - "items.ts"
Cohesion: 0.12
Nodes (11): BlockHeaderItem, CoreBlockHeader, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, OwnStateMetadata (+3 more)

### Community 9 - "column-rules.ts"
Cohesion: 0.02
Nodes (105): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+97 more)

### Community 90 - "tx-replay-decoder.ts"
Cohesion: 0.11
Nodes (23): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+15 more)

### Community 91 - "PgChainArchiveStore"
Cohesion: 0.19
Nodes (10): BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf(), sha256Hex() (+2 more)

### Community 92 - "private/backends.ts"
Cohesion: 0.13
Nodes (17): PrivateBackend, SessionSeen, A112Observation, Wiring, pgliteBackend(), a146HashProblems(), a146RefusalProblems(), optedOutProblems() (+9 more)

### Community 93 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 94 - "BlockRef"
Cohesion: 0.13
Nodes (8): QueuedBlock, BlockRef, InMemorySourceOptions, EventsRunner, Fetching, Recorder, LateRedelivery, systemEventsKey()

### Community 95 - "ChainArchiveStore"
Cohesion: 0.09
Nodes (10): ChainArchiveStore, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents, `transactions` (chain_archive) (+2 more)

### Community 96 - "3. Block source and ingest"
Cohesion: 0.16
Nodes (19): ChainDataView, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions(), chainApi() (+11 more)

### Community 97 - "readiness.test.ts"
Cohesion: 0.13
Nodes (17): ProcessState, gate, Decision, ReadinessCase, adminSource(), ae4(), caseText(), readinessProblems() (+9 more)

### Community 98 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (17): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind (+9 more)

### Community 111 - "address"
Cohesion: 0.13
Nodes (16): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite (+8 more)

### Community 113 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.12
Nodes (13): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1 (+5 more)

### Community 124 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 126 - "pg"
Cohesion: 0.15
Nodes (12): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 2. Node-side query correlation (+4 more)

### Community 133 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 148 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value (+3 more)

### Community 152 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 179 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 35 - "T"
Cohesion: 0.03
Nodes (78): T(), 1. TemporalKV — event-sourced right action with a CAS guard, 5.1 Layer A: per-key temporal history, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window (+70 more)

### Community 38 - "saveAndAdvance"
Cohesion: 0.03
Nodes (72): saveAndAdvance(), version(), 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference (+64 more)

### Community 70 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 72 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): listen(), ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret (+25 more)

### Community 79 - "fn"
Cohesion: 0.08
Nodes (31): fn(), ADDED Requirements, MODIFIED Requirements, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API, temporal-kv (transaction-participation wiring), ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease (+23 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): integer(), ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 100 - "UmbraDB software supply-chain directory"
Cohesion: 0.10
Nodes (18): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists, 1. What SLSA v1.0 defines (+10 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 104 - "package.json"
Cohesion: 0.10
Nodes (19): description, exports, files, homepage, license, main, name, type (+11 more)

### Community 106 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 112 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 115 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 116 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.12
Nodes (10): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside (+2 more)

### Community 117 - "UmbraDB module guide"
Cohesion: 0.12
Nodes (15): Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Private modules, Reading through `db`, Settings (+7 more)

### Community 118 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 121 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 123 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (14): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+6 more)

### Community 128 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.13
Nodes (12): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling (+4 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 131 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 136 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 137 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.15
Nodes (13): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol, 6.1 Approved M1 module layout (+5 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 139 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 140 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 145 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 146 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.17
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 150 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 153 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 154 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 156 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 157 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.20
Nodes (10): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+2 more)

### Community 158 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 159 - "3. Proof-blocking findings"
Cohesion: 0.20
Nodes (10): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption, 3.8 C2 safety and liveness are different theorem classes (+2 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-4 One provider of contract logs at a time, Scenario: A log in a failed fallible segment, Scenario: A v8 log, Scenario: Full until a backup, fast after it, Scenario: Two calls to one contract in one block (+1 more)

### Community 161 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 162 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer) (+1 more)

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

### Community 167 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 168 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 169 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.22
Nodes (9): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 8. Test infrastructure (open decision — resolve in Task 1) (+1 more)

### Community 170 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 171 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 172 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 173 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 174 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 175 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 176 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 177 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 178 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 180 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 182 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 183 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 184 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 185 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 186 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 187 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 188 - "Security policy & threat model"
Cohesion: 0.29
Nodes (7): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 189 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 191 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 192 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 193 - "Acceptance — v1.0.0 API Surface & Release Contract"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0 API Surface & Release Contract, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in), Precondition (blocks the whole change)

### Community 194 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 195 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 198 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 199 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 200 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 201 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 202 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 203 - "5. Recommended candidate model"
Cohesion: 0.33
Nodes (6): 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 204 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 205 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 206 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 207 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 208 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, Why

### Community 209 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 210 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 211 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 212 - "Performance — design"
Cohesion: 0.33
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 213 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 214 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 215 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 216 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 217 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 218 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 219 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 220 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 221 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 222 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 223 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 224 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 225 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 226 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 227 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 228 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 229 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 230 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 231 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 232 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 233 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 234 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 235 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 236 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 237 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 238 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 241 - "Requirement: set is an idempotent, unconditional overwrite (Law W1)"
Cohesion: 0.67
Nodes (3): Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A new set always overwrites, with no conflict possible, Scenario: Setting the same value twice leaves the stored state unchanged

### Community 242 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 61 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 63 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 66 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 77 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+21 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 99 - "README.md"
Cohesion: 0.15
Nodes (5): For historical reference only, Tasks — superseded by per-sprint openspec changes, UmbraDB v1.0.0 — Release Record (PENDING), What 1.0.0 additionally requires, What must happen before this record can be completed

## Knowledge Gaps
- **49 isolated node(s):** `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx`, `typedoc`, `@types/node` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3090 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionLeaseLayer`, `src/index.ts`, `UmbraError`, `PgTransactionHistoryStorage`, `postgres/transaction-history-storage.ts`, `runMigrations`, `declaration.ts`, `db/migrate.ts`, `column-rules.ts`, `NodeClient`, `config/history.ts`, `process-admin.ts`, `tape/index.ts`, `InMemoryBlockSource`, `api-server.test.ts`, `opt-out.test.ts`, `builder.test.ts`, `db/errors.ts`, `loop.test.ts`, `height-versioned.test.ts`, `node/client.test.ts`, `runner/process.ts`, `admin-harness.ts`, `config-check.ts`, `adapter.ts`, `ingest-crash.test.ts`, `child-processes.test.ts`, `changes.property.test.ts`, `cbor.ts`, `validate.ts`, `range.test.ts`, `ModuleDeclaration`, `describeNodeStoreExports`, `module-api.test.ts`, `core-config.test.ts`, `order.property.test.ts`, `UmbraDBSql`, `adapter-fixtures.ts`, `chain-data.test.ts`, `transform-checks.ts`, `change-capture.ts`, `entries.ts`, `crash-worker.ts`, `ledger/types.ts`, `validation.ts`, `failures.ts`, `mapping.ts`, `zero-timeouts-checks.ts`, `serve.test.ts`, `chain-process.test.ts`, `networks.ts`, `post-block-update-checks.ts`, `fetch-fixtures.ts`, `version-checks.ts`, `chain-events-decode.test.ts`, `plain-data.ts`, `boundary.test.ts`, `chain-placement.test.ts`, `checks.test.ts`, `core-private-source.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `private/backends.ts`, `ws-mutual-tls.test.ts`, `3. Block source and ingest`, `readiness.test.ts`, `binding.test.ts`, `package.json`, `Tasks — v1.0.0-infosec-signoff`, `mutation-per-adapter.mjs`, `chain-events-source.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `excluded-not-exported.test.ts`, `intake.test.ts`, `history.property.test.ts`, `component-table.test.ts`, `builder.negative-control.test.ts`?**
  _High betweenness centrality (0.294) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx` to the rest of the system?**
  _49 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionLeaseLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.012461059190031152 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `declaration.ts`, `db/migrate.ts`, `NodeClient`, `config/history.ts`, `process-admin.ts`, `tape/index.ts`, `ProcessItems`, `api-server.test.ts`, `opt-out.test.ts`, `InMemoryBlockSource`, `db/errors.ts`, `loop.test.ts`, `FinalizedLoop`, `height-versioned.test.ts`, `node/client.test.ts`, `runner/process.ts`, `admin-harness.ts`, `config-check.ts`, `vitest`, `ingest-crash.test.ts`, `range.ts`, `changes.property.test.ts`, `cbor.ts`, `validate.ts`, `ModuleDeclaration`, `module-api.test.ts`, `transform-checks.ts`, `NodeBlockSource`, `LedgerPackage`, `ledger/types.ts`, `failingSource`, `validation.ts`, `mapping.ts`, `failures.ts`, `zero-timeouts-checks.ts`, `chain-process.test.ts`, `graph.ts`, `version-checks.ts`, `plain-data.ts`, `checks.test.ts`, `core-private-source.test.ts`, `items.ts`, `3. Block source and ingest`, `readiness.test.ts`, `PrivateBlockSource`, `version-table.ts`, `checkShape`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024304641572343598 - nodes in this community are weakly interconnected._