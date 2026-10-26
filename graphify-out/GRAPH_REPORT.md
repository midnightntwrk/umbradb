# Graph Report - UmbraDB

## Corpus Check
- 840 files · ~1,288,377 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 8856 nodes · 25487 edges · 265 communities (241 shown, 24 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 3051 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `e7bdf9a9bf7e108e` (840 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionLeaseLayer
- PgTransactionHistoryStorage
- UmbraError
- config-check.ts
- tx-replay-decoder.ts
- builds.ts
- version-table.ts
- PrivateBlockSource
- RuntimeMetadataEntry
- config/history.ts
- ChainArchiveStore
- identity.ts
- Database
- 3. Proof-blocking findings
- no-indexer-or-wallet-sdk.test.ts
- checkShape
- placement.ts
- chain-process.test.ts
- read-height.property.test.ts
- cursor-table.property.test.ts
- chain-archive-rollover.ts
- attempt
- tape/index.ts
- BlobIntegrityError
- NodeClient
- intake.test.ts
- opt-out.test.ts
- core-block-commit.test.ts
- type-check.ts
- ProcessItems
- postgres-image.test.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- admin-harness.ts
- a114Run
- .save
- ReadPool
- mutation-evidence.d.mts
- src/index.ts
- validate.test.ts
- process-admin.ts
- saveAndAdvance
- EventsRunner
- builder.test.ts
- ref_node_url
- CliBackend
- runner/process.ts
- adapter.ts
- core-config.test.ts
- describeNodeStoreExports
- node/client.test.ts
- checks.test.ts
- column-rules.ts
- range.ts
- changes.property.test.ts
- halts.test.ts
- chain-placement.test.ts
- order.property.test.ts
- transform-checks.ts
- loop.test.ts
- FinalizedLoop
- db/migrate.ts
- adapter-fixtures.ts
- config-check-database.test.ts
- column-rules.test.ts
- ledger/types.ts
- loop.ts
- writer-lock-checks.ts
- real-tapes.negative-control.test.ts
- core-block-parsed.ts
- NodeBlockSource
- cbor.ts
- api-server.test.ts
- serve.test.ts
- boundary.test.ts
- BlockRef
- postgres/chain-archive-store.ts
- graph.ts
- ref_node_fs
- LedgerPackage
- core-settings.ts
- ProcessAdmin
- ingest-crash.test.ts
- plain-data.ts
- post-block-update-checks.ts
- TemporalKV
- chain-events-decode.test.ts
- networks.ts
- declaration.ts
- validate.ts
- .value
- .show
- cbor.property.test.ts
- digest.test.ts
- version-checks.ts
- runMigrations
- binding.test.ts
- core-private-source.test.ts
- validation.ts
- determinism-checks.ts
- mapping.ts
- crash.test.ts
- test/postgres/setup.ts
- height-versioned.property.test.ts
- ws-mutual-tls.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- node-source.ts
- block-fetch-decode.test.ts
- full-sync-soak.integration.test.ts
- pglite-writer.worker.ts
- pg
- height
- repository
- mutation-per-adapter.mjs
- twox.ts
- .boolean
- facade-merge-loader.ts
- 001_chain_archive_core.ts
- pack-install.mjs
- scoped-review-manifest
- orphan-watcher.mjs
- fresh-instance.mjs
- Requirement: DT-4 Per-block changes of every module table
- T
- code
- version
- graph.py
- ADDED Requirements
- ADDED Requirements
- vitest
- address
- ROADMAP.md
- UmbraDB third-party component inventory (SBOM)
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- package.json
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- ADDED Requirements
- Design — Postgres+JSONB storage rebuild
- Full-Chain Storage — Design
- stryker.conf.json
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- devDependencies
- README.md
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB module guide
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Roadmap
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- UmbraDB V1.0.0 Implementation Guideline
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- UmbraDB
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Security policy & threat model
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Tasks — v1.0.0-infosec-signoff
- Our Pledge
- Algebraic Specification of the midnight-pg-store Storage Layer
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 5. Recommended candidate model
- Requirement: TransactionKeyReuseError is now reachable through the public put() API
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
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
- 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
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
- Tasks — Sprint 1: project setup + TemporalKV
- Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints
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
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

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
- `Scenario: a release failure after a successful fn, with a callback, resolves and reports` --references--> `LeaseFaultError`  [INFERRED]
  openspec/changes/v1.0.0-durable-checkpoint-cursor/specs/durable-composition/spec.md → src/interfaces/transaction-lease.ts
- `Scenario: a release failure after a successful fn, with no callback, rejects` --references--> `LeaseFaultError`  [INFERRED]
  openspec/changes/v1.0.0-durable-checkpoint-cursor/specs/durable-composition/spec.md → src/interfaces/transaction-lease.ts
- `2.1 Historical implementation baseline` --references--> `PgTemporalKV`  [INFERRED]
  Formal/STORAGE_ALGEBRA_LEAN_RESEARCH.md → src/postgres/temporal-kv.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (265 total, 24 thin omitted)

### Community 0 - "PgTransactionLeaseLayer"
Cohesion: 0.02
Nodes (229): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, Rollback, TransactionFaultError, TransactionHandle (+221 more)

### Community 1 - "PgTransactionHistoryStorage"
Cohesion: 0.01
Nodes (217): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryEntry (+209 more)

### Community 10 - "UmbraError"
Cohesion: 0.04
Nodes (77): ReadOptions, Transaction, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, ReadTimeoutSetting, MultiStatementRunner (+69 more)

### Community 100 - "config-check.ts"
Cohesion: 0.11
Nodes (20): CheckFinding, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, databaseFinding() (+12 more)

### Community 102 - "tx-replay-decoder.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+12 more)

### Community 103 - "builds.ts"
Cohesion: 0.15
Nodes (19): privateIntake, PrivateProcess, PrivateRefusal, PublicCoreOptions, privateBackbone(), directPublic(), genesisHex(), launchPrivate() (+11 more)

### Community 104 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 107 - "PrivateBlockSource"
Cohesion: 0.20
Nodes (9): PrivateBlockSource, PrivateIntakeOptions, PublicDatabase, PublicWakes, PrivateOptions, readPrivateCursor(), readPublicIdentity(), 8. Private processes (PP) (+1 more)

### Community 108 - "RuntimeMetadataEntry"
Cohesion: 0.14
Nodes (7): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, OwnStateMetadata, hexOf()

### Community 11 - "config/history.ts"
Cohesion: 0.04
Nodes (110): ConfigFacts, OpenedFacts, CheckState, CoreVersion, CoreSettings, versionEntry, HistoryCheck, HistoryCode (+102 more)

### Community 111 - "ChainArchiveStore"
Cohesion: 0.10
Nodes (7): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations, Boundary enforcement, Table of contents, UmbraDB Postgres Schema Reference

### Community 117 - "identity.ts"
Cohesion: 0.19
Nodes (16): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+8 more)

### Community 12 - "Database"
Cohesion: 0.03
Nodes (81): ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, Database, PgliteOptions, PostgresOptions (+73 more)

### Community 121 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 124 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.19
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 127 - "checkShape"
Cohesion: 0.30
Nodes (8): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), 14. External claims and their evidence

### Community 129 - "placement.ts"
Cohesion: 0.19
Nodes (15): BlockTransaction, ChainTransaction, EventPhase, callVariant(), carried(), is(), placeTransactions(), refuse() (+7 more)

### Community 13 - "chain-process.test.ts"
Cohesion: 0.04
Nodes (84): InMemoryBlockSource, ProcessHandle, Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A90Observation (+76 more)

### Community 134 - "read-height.property.test.ts"
Cohesion: 0.20
Nodes (10): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+2 more)

### Community 135 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 136 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 137 - "attempt"
Cohesion: 0.16
Nodes (13): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+5 more)

### Community 14 - "tape/index.ts"
Cohesion: 0.04
Nodes (73): Recorded, Link, TapeBuilderOptions, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId (+65 more)

### Community 142 - "BlobIntegrityError"
Cohesion: 0.29
Nodes (10): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation), Requirement: The chain-archive error classes are excluded from the frozen surface, Scenario: Chain-archive classes are not exported and their codes are not frozen (+2 more)

### Community 15 - "NodeClient"
Cohesion: 0.05
Nodes (64): CoreChainBinding, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+56 more)

### Community 155 - "intake.test.ts"
Cohesion: 0.33
Nodes (11): PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), follow(), heights(), readProblems() (+3 more)

### Community 16 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (74): CheckedMigration, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, CatalogTable (+66 more)

### Community 17 - "core-block-commit.test.ts"
Cohesion: 0.03
Nodes (66): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, BlockContext (+58 more)

### Community 170 - "type-check.ts"
Cohesion: 0.33
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 172 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 177 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 18 - "admin-harness.ts"
Cohesion: 0.04
Nodes (92): BlockItemSource, ProcessState, AdminRun, AdminRunOptions, Answered, Answerer, Expected, gate (+84 more)

### Community 19 - ".save"
Cohesion: 0.04
Nodes (93): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+85 more)

### Community 199 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 2 - "src/index.ts"
Cohesion: 0.02
Nodes (212): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStore, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError (+204 more)

### Community 20 - "validate.test.ts"
Cohesion: 0.03
Nodes (84): coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+76 more)

### Community 21 - "process-admin.ts"
Cohesion: 0.05
Nodes (84): OpenedConfig, ProcessAdminOptions, RevisionSettings, AdminStarter, DigestRow, ModuleFacts, PartTable, SnapshotFacts (+76 more)

### Community 22 - "saveAndAdvance"
Cohesion: 0.03
Nodes (88): Watermarks, exceedsMaxDepth(), saveAndAdvance(), tx(), EntrySectionsSchema, Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7), The cross-vendor audit (two codex cold rounds, then bounded at convergence) (+80 more)

### Community 23 - "builder.test.ts"
Cohesion: 0.04
Nodes (40): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step, Frame (+32 more)

### Community 24 - "ref_node_url"
Cohesion: 0.03
Nodes (67): SignalTarget, ParentJob, Kill, Orphaned, SourceFile, FailsOnceStarted, SlowToReportPorts, SourceFile (+59 more)

### Community 25 - "runner/process.ts"
Cohesion: 0.04
Nodes (52): Bound, ChainCheck, ChainCheckInput, ChainSource, CoreChainFacts, NodeWait, WaitingListener, PublicIdentity (+44 more)

### Community 27 - "adapter.ts"
Cohesion: 0.04
Nodes (60): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+52 more)

### Community 28 - "core-config.test.ts"
Cohesion: 0.07
Nodes (48): adminRoutes, AdminEndpoint, AdminPart, ReadinessFacts, CoreLedgerVersion, LedgerPackageIdentity, DeclarationSet, StatusFacts (+40 more)

### Community 29 - "describeNodeStoreExports"
Cohesion: 0.07
Nodes (51): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+43 more)

### Community 3 - "node/client.test.ts"
Cohesion: 0.02
Nodes (95): NodeRetry, ConnectSocket, NodeSocketEvents, Answer, FakeNode, Handler, Received, recorded (+87 more)

### Community 30 - "checks.test.ts"
Cohesion: 0.05
Nodes (55): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, Outcome, openBlockWrites() (+47 more)

### Community 31 - "column-rules.ts"
Cohesion: 0.04
Nodes (70): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+62 more)

### Community 32 - "range.ts"
Cohesion: 0.05
Nodes (63): NodeClientOptions, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange (+55 more)

### Community 33 - "changes.property.test.ts"
Cohesion: 0.05
Nodes (58): Chain, ChainOptions, DigestRow, Op, States, TableName, identityRow(), captured() (+50 more)

### Community 34 - "halts.test.ts"
Cohesion: 0.05
Nodes (53): ChainDataView, ProcessReason, ProcessingEnd, ProcessStatus, A43Case, A43Observation, Outcome, SilentHalt (+45 more)

### Community 35 - "chain-placement.test.ts"
Cohesion: 0.08
Nodes (57): BlockSpec, EventSpec, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry (+49 more)

### Community 36 - "order.property.test.ts"
Cohesion: 0.05
Nodes (57): PointArguments, CallEvent, Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, reader() (+49 more)

### Community 37 - "transform-checks.ts"
Cohesion: 0.08
Nodes (45): Failure, Variant, TransformError, CallRecord, NotifyRecord, recordKind, SubscriptionId, CallSelection (+37 more)

### Community 38 - "loop.test.ts"
Cohesion: 0.05
Nodes (37): QueuedBlock, ItemSink, BlockItems, LateUse, Broken, EagerItems, EagerLoop, FailingAfter (+29 more)

### Community 39 - "FinalizedLoop"
Cohesion: 0.07
Nodes (19): ResolvedRange, EntryBoundary, PointRun, PointSchedule, FinalizedLoop, HeightRun, Startup, SkipsAfterReconnect (+11 more)

### Community 4 - "db/migrate.ts"
Cohesion: 0.02
Nodes (135): CaptureColumn, CapturedTable, CaptureState, AppliedRow, MigrationPart, Runnable, Settling, StartupInput (+127 more)

### Community 40 - "adapter-fixtures.ts"
Cohesion: 0.10
Nodes (49): Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState, expectNoV8Logs() (+41 more)

### Community 41 - "config-check-database.test.ts"
Cohesion: 0.07
Nodes (39): CommandHandler, CommandIo, MainProcess, CheckStep, cliProject, CommandResult, CheckTarget, checkArguments() (+31 more)

### Community 42 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (33): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+25 more)

### Community 43 - "ledger/types.ts"
Cohesion: 0.06
Nodes (45): BlockParsedOptions, LoadLedger, TransactionParser, LedgerName, AdapterSpec, LedgerRelease, LedgerReleasePackage, AppliedBlock (+37 more)

### Community 44 - "loop.ts"
Cohesion: 0.08
Nodes (47): PointName, HeightRange, Callback, CallbackFailure, ParallelPoint, ReasonCode, Unwrapped, HeightFailure (+39 more)

### Community 45 - "writer-lock-checks.ts"
Cohesion: 0.09
Nodes (41): WriterProcess, WorkerEvent, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf(), startWriterProcess() (+33 more)

### Community 46 - "real-tapes.negative-control.test.ts"
Cohesion: 0.07
Nodes (43): FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+35 more)

### Community 47 - "core-block-parsed.ts"
Cohesion: 0.06
Nodes (45): BlockEventSource, ChainOutcome, blockBodyOf(), blockParsedItemOf(), blockParsedOf(), coreBlockParsedOnParse(), writeTransactionRows(), boundEventSource() (+37 more)

### Community 48 - "NodeBlockSource"
Cohesion: 0.10
Nodes (11): HeadWait, NodeBlockSource, NodeHeader, PreparedBlock, QueueRunner, NoWindow, Refetches, TrustsNotifications (+3 more)

### Community 49 - "cbor.ts"
Cohesion: 0.09
Nodes (40): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+32 more)

### Community 5 - "api-server.test.ts"
Cohesion: 0.02
Nodes (113): ReadOnlyDatabase, ApiRegistry, Revision, ResolvedGraph, Connection, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart (+105 more)

### Community 50 - "serve.test.ts"
Cohesion: 0.07
Nodes (32): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer, AdminSnapshot (+24 more)

### Community 51 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 52 - "BlockRef"
Cohesion: 0.07
Nodes (21): BlockRef, InMemoryItems, InMemorySourceOptions, Wait, LoopObserver, Fetching, Recorder, LateRedelivery (+13 more)

### Community 53 - "postgres/chain-archive-store.ts"
Cohesion: 0.10
Nodes (27): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+19 more)

### Community 54 - "graph.ts"
Cohesion: 0.07
Nodes (45): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+37 more)

### Community 55 - "ref_node_fs"
Cohesion: 0.06
Nodes (28): Finding, Upstream, GuardViolation, ReportedTest, filesUnder(), patchesOf(), patchText(), extractStringLiterals() (+20 more)

### Community 56 - "LedgerPackage"
Cohesion: 0.06
Nodes (25): LedgerEventKind, LedgerPackage, expectSmallStateReloadsByKey(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix, 00019 — `evictKeys` does not refuse the root node of a live ledger state (+17 more)

### Community 57 - "core-settings.ts"
Cohesion: 0.06
Nodes (39): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+31 more)

### Community 59 - "ProcessAdmin"
Cohesion: 0.10
Nodes (15): ProcessAdmin, ConfigInput, Process, moduleFacts(), recordedHistory(), writerLockHeld(), earlyRedactor(), tableKey() (+7 more)

### Community 6 - "ingest-crash.test.ts"
Cohesion: 0.03
Nodes (131): BlockParsed, BlockHeader, NodeCallOptions, itemsSeen, Json, Scenario, RecordingClient, ArgType (+123 more)

### Community 60 - "plain-data.ts"
Cohesion: 0.07
Nodes (31): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+23 more)

### Community 61 - "post-block-update-checks.ts"
Cohesion: 0.10
Nodes (34): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+26 more)

### Community 62 - "TemporalKV"
Cohesion: 0.06
Nodes (32): TemporalKV, 1.2 Async pattern, 1.3 Transaction participation, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 4. Composition with `WalletStateStore` / `PrivateStateProvider`, 5. Documentation-Generation Tooling, Storage Layer Interface Specification (+24 more)

### Community 65 - "chain-events-decode.test.ts"
Cohesion: 0.08
Nodes (32): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive, ChainEvent (+24 more)

### Community 68 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 7 - "declaration.ts"
Cohesion: 0.03
Nodes (122): SchemaWriteHandle, AppliedMigration, DefinedModule, FieldKind, FieldSchema, ItemDeclaration, KnownPointsOnly, Lifetime (+114 more)

### Community 71 - "validate.ts"
Cohesion: 0.10
Nodes (35): HistoryFinding, ConfigRule, CursorRule, Finding, Issue, Plain, coreSettingsSchema(), closest() (+27 more)

### Community 72 - ".value"
Cohesion: 0.20
Nodes (14): TypeDef, ScaleError, ScaleReader, ValueReader, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+6 more)

### Community 73 - ".show"
Cohesion: 0.07
Nodes (22): AllowedDetail, schemaName(), module(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 75 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 76 - "digest.test.ts"
Cohesion: 0.08
Nodes (33): ChangeKind, tableChanges, TouchedRow, encodeCanonical(), run(), changeOf(), concat(), sameBytes() (+25 more)

### Community 79 - "version-checks.ts"
Cohesion: 0.15
Nodes (25): CountingNode, MetadataSelector, Select, Walk, Answers, toHex(), H(), blockWith() (+17 more)

### Community 8 - "runMigrations"
Cohesion: 0.03
Nodes (114): UmbraDBConnectionOptions, DurabilityContractError, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, TransactionPoolerDetectedError, Migration, MigrationLockTimeoutError (+106 more)

### Community 81 - "binding.test.ts"
Cohesion: 0.08
Nodes (21): PrivateBackend, SessionSeen, A113Observation, Binding, Outcome, A112Observation, Wiring, outcomeOf() (+13 more)

### Community 83 - "core-private-source.test.ts"
Cohesion: 0.08
Nodes (9): AdmittedKey, fakePublic(), fakeRead(), identity(), CORE_KEY_REGISTRY, CORE_KEY_REGISTRY_MIGRATIONS, NONE, PUBLIC_POLL_MS (+1 more)

### Community 84 - "validation.ts"
Cohesion: 0.08
Nodes (27): PlacedDeclaration, Plain, Validator, schemaFile(), text(), validatorOf(), body(), moded() (+19 more)

### Community 85 - "determinism-checks.ts"
Cohesion: 0.15
Nodes (25): PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, privateCursorHeight(), a113Run(), against() (+17 more)

### Community 86 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 87 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+15 more)

### Community 9 - "test/postgres/setup.ts"
Cohesion: 0.02
Nodes (128): BatchSpec, CurrentState, InvariantResult, Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, CurrentState (+120 more)

### Community 90 - "height-versioned.property.test.ts"
Cohesion: 0.13
Nodes (20): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Key, Model (+12 more)

### Community 91 - "ws-mutual-tls.test.ts"
Cohesion: 0.09
Nodes (20): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+12 more)

### Community 92 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 93 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 96 - "node-source.ts"
Cohesion: 0.12
Nodes (21): BlockHeaderItem, BodyExtrinsic, ExtrinsicCall, BlockBody, CoreBlockHeader, CoreBlockItems, RuntimeMetadataView, NodeSourceOptions (+13 more)

### Community 97 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 98 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (12): CurrentState, GcPass, HistGroup, SampleObservation, kvMapKey(), newPool(), readCurrentState(), { connectionUri } (+4 more)

### Community 99 - "pglite-writer.worker.ts"
Cohesion: 0.16
Nodes (17): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor() (+9 more)

### Community 109 - "pg"
Cohesion: 0.11
Nodes (17): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 1. Postgres-side profiling (+9 more)

### Community 110 - "height"
Cohesion: 0.12
Nodes (18): height(), 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy, 4. Schema design (+10 more)

### Community 132 - "repository"
Cohesion: 0.14
Nodes (15): repository(), 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA (+7 more)

### Community 133 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 141 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 145 - ".boolean"
Cohesion: 0.18
Nodes (11): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Same data, two backends (+3 more)

### Community 150 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 158 - "001_chain_archive_core.ts"
Cohesion: 0.24
Nodes (9): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, Revision history, v2 — 2026-07-22, revised in response to a 3-reviewer design-council audit (Fable 5 / Opus / GPT-5.6 Sol), v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol) (+1 more)

### Community 161 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 162 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 214 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 230 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 238 - "Requirement: DT-4 Per-block changes of every module table"
Cohesion: 0.50
Nodes (4): insert(), Requirement: DT-4 Per-block changes of every module table, Scenario: Insert then update in one block, Scenario: Rewriting the same value

### Community 26 - "T"
Cohesion: 0.03
Nodes (79): T(), 5.1 Layer A: per-key temporal history, ADDED Requirements, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+71 more)

### Community 63 - "code"
Cohesion: 0.05
Nodes (38): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`), Scope and pre-1.0 note (+30 more)

### Community 66 - "version"
Cohesion: 0.05
Nodes (36): validateSaveOptions(), version(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+28 more)

### Community 69 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 70 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): listen(), ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret (+25 more)

### Community 80 - "vitest"
Cohesion: 0.06
Nodes (6): settings, ALGEBRA_PATH, DOC_PATH, CORE_ARCH, DURABILITY, vitest

### Community 94 - "address"
Cohesion: 0.08
Nodes (24): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md` (+16 more)

### Community 101 - "ROADMAP.md"
Cohesion: 0.09
Nodes (16): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+8 more)

### Community 105 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (18): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 6. Nix — nixpkgs packages (from the locked nixpkgs), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies (+10 more)

### Community 106 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.10
Nodes (21): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+13 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 113 - "package.json"
Cohesion: 0.10
Nodes (19): description, exports, files, homepage, license, main, name, type (+11 more)

### Community 114 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 118 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.11
Nodes (14): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+6 more)

### Community 119 - "Full-Chain Storage — Design"
Cohesion: 0.11
Nodes (17): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+9 more)

### Community 120 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 123 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 125 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 126 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+7 more)

### Community 128 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 130 - "README.md"
Cohesion: 0.22
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 131 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 140 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 143 - "UmbraDB module guide"
Cohesion: 0.15
Nodes (12): Cursor tables, Data that is not a function of the chain, Migrations, Private modules, Reading through `db`, Start and stop heights, Stored values and digests, Time values (+4 more)

### Community 144 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 148 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 149 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 153 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 154 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 156 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 157 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 159 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.18
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 160 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 163 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 164 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 165 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 166 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 167 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 168 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 169 - "UmbraDB"
Cohesion: 0.20
Nodes (10): Contents, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB, Verification: what is proved, checked, and tested (+2 more)

### Community 173 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 174 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 175 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 176 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 178 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 179 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 180 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 181 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 182 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 183 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 184 - "Security policy & threat model"
Cohesion: 0.25
Nodes (8): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 185 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 186 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 187 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 189 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 190 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.29
Nodes (5): 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 191 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 192 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 193 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

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

### Community 204 - "5. Recommended candidate model"
Cohesion: 0.33
Nodes (6): 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 205 - "Requirement: TransactionKeyReuseError is now reachable through the public put() API"
Cohesion: 0.33
Nodes (5): ADDED Requirements, MODIFIED Requirements, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API, temporal-kv (transaction-participation wiring)

### Community 206 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 207 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 208 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 209 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 210 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 211 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 212 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 213 - "Midnight Foundation Security Policy"
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

### Community 222 - "00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond"
Cohesion: 0.40
Nodes (4): 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix

### Community 223 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 224 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 225 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 226 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 227 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 228 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 231 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 232 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 233 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 234 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 235 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 236 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 237 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 239 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 240 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 241 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 246 - "Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints"
Cohesion: 0.67
Nodes (3): Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Two runs, one difference

### Community 247 - "Requirement: set is an idempotent, unconditional overwrite (Law W1)"
Cohesion: 0.67
Nodes (3): Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A new set always overwrites, with no conflict possible, Scenario: Setting the same value twice leaves the stored state unchanged

### Community 248 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 58 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 64 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 67 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 77 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

## Knowledge Gaps
- **47 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-8785`, `RFC-8785` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3083 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionLeaseLayer`, `PgTransactionHistoryStorage`, `src/index.ts`, `node/client.test.ts`, `db/migrate.ts`, `mutation-per-adapter.mjs`, `ingest-crash.test.ts`, `read-height.property.test.ts`, `cursor-table.property.test.ts`, `runMigrations`, `UmbraError`, `config/history.ts`, `Database`, `chain-process.test.ts`, `test/postgres/setup.ts`, `declaration.ts`, `opt-out.test.ts`, `core-block-commit.test.ts`, `admin-harness.ts`, `NodeClient`, `validate.test.ts`, `process-admin.ts`, `facade-merge-loader.ts`, `builder.test.ts`, `ref_node_url`, `runner/process.ts`, `api-server.test.ts`, `adapter.ts`, `core-config.test.ts`, `describeNodeStoreExports`, `checks.test.ts`, `intake.test.ts`, `changes.property.test.ts`, `halts.test.ts`, `chain-placement.test.ts`, `order.property.test.ts`, `transform-checks.ts`, `loop.test.ts`, `adapter-fixtures.ts`, `config-check-database.test.ts`, `column-rules.test.ts`, `postgres-image.test.ts`, `writer-lock-checks.ts`, `loop.ts`, `real-tapes.negative-control.test.ts`, `serve.test.ts`, `boundary.test.ts`, `BlockRef`, `ref_node_fs`, `core-settings.ts`, `plain-data.ts`, `post-block-update-checks.ts`, `chain-events-decode.test.ts`, `networks.ts`, `twox.ts`, `tape/index.ts`, `cbor.property.test.ts`, `digest.test.ts`, `version-checks.ts`, `binding.test.ts`, `core-private-source.test.ts`, `validation.ts`, `crash.test.ts`, `height-versioned.property.test.ts`, `ws-mutual-tls.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `block-fetch-decode.test.ts`, `full-sync-soak.integration.test.ts`, `package.json`, `identity.ts`, `no-indexer-or-wallet-sdk.test.ts`?**
  _High betweenness centrality (0.324) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionLeaseLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.017500434253951713 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `node/client.test.ts`, `db/migrate.ts`, `api-server.test.ts`, `ingest-crash.test.ts`, `declaration.ts`, `config/history.ts`, `Database`, `chain-process.test.ts`, `tape/index.ts`, `NodeClient`, `opt-out.test.ts`, `core-block-commit.test.ts`, `admin-harness.ts`, `validate.test.ts`, `process-admin.ts`, `builder.test.ts`, `runner/process.ts`, `checks.test.ts`, `range.ts`, `changes.property.test.ts`, `halts.test.ts`, `transform-checks.ts`, `loop.test.ts`, `FinalizedLoop`, `ledger/types.ts`, `loop.ts`, `writer-lock-checks.ts`, `NodeBlockSource`, `cbor.ts`, `BlockRef`, `graph.ts`, `LedgerPackage`, `core-settings.ts`, `ProcessAdmin`, `plain-data.ts`, `validate.ts`, `version-checks.ts`, `core-private-source.test.ts`, `validation.ts`, `mapping.ts`, `node-source.ts`, `pglite-writer.worker.ts`, `config-check.ts`, `version-table.ts`, `RuntimeMetadataEntry`, `identity.ts`, `checkShape`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `PgTransactionHistoryStorage` be split into smaller, more focused modules?**
  _Cohesion score 0.013888888888888888 - nodes in this community are weakly interconnected._