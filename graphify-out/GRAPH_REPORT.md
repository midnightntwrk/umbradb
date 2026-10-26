# Graph Report - UmbraDB

## Corpus Check
- 802 files · ~1,243,285 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 8582 nodes · 24323 edges · 276 communities (251 shown, 25 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 3001 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `678629b195e19b43` (802 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- chain-process.test.ts
- UmbraError
- TransactionHandle
- differential.test.ts
- node-format.ts
- PgTransactionLeaseLayer
- ChainArchiveStore
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- TapeBuilder
- Process
- api-server.test.ts
- pglite-outside-reads.ts
- ref_node_fs
- height-versioned.property.test.ts
- node-store-suite.ts
- describeNodeStoreExports
- FakeNode
- ref_node_crypto
- determinism-checks.ts
- 3. Proof-blocking findings
- column-rules.ts
- .show
- binding.test.ts
- Session
- checkShape
- read-height.property.test.ts
- cursor-table.property.test.ts
- chain-archive-rollover.ts
- ingest-crash.test.ts
- RawClient
- no-indexer-or-wallet-sdk.test.ts
- intake.test.ts
- tape/index.ts
- a114Run
- PgTemporalKV
- holds
- ProcessItems
- node/client.test.ts
- postgres-image.test.ts
- FinalizedLoop
- Connection
- src/index.ts
- config-check.ts
- changes.property.test.ts
- mutation-evidence.d.mts
- EventsRunner
- no-chain-sync-import-guard.test.ts
- module-tables.ts
- db/migrate.ts
- SkipsAfterReconnect
- .value
- serve.test.ts
- Waiter
- snapshot.test.ts
- chain-data.test.ts
- postgres/client.ts
- runner/process.ts
- adapter.ts
- chain-placement.test.ts
- config/history.ts
- transform-checks.ts
- version-checks.ts
- builder.test.ts
- adapter-fixtures.ts
- networks.ts
- column-rules.test.ts
- writer-lock-checks.ts
- ValidationError
- validate.test.ts
- NodeBlockSource
- postgres.ts
- child-processes.test.ts
- history.test.ts
- zero-timeouts-checks.ts
- cbor.ts
- LedgerPackage
- containers.test.ts
- graph.ts
- test/postgres/setup.ts
- records.ts
- vitest
- record-and-replay.test.ts
- NodeClient
- pglite.ts
- post-block-update-checks.ts
- postgres/migrate.ts
- core-settings.ts
- loop.test.ts
- entries.ts
- postgres/chain-archive-store.ts
- validate.ts
- checks.test.ts
- ledger/types.ts
- chain-events-decode.test.ts
- ref_node_path
- block-fetch-decode.test.ts
- PgTransactionHistoryStorage
- plain-data.ts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- adapter-core.test.ts
- events-fixtures.ts
- node/client.ts
- PgliteDatabase
- mapping.ts
- declaration.ts
- source-scan.ts
- chain-archive-replay-decode.integration.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- openPostgres
- private/backends.ts
- core-block-commit.test.ts
- node/errors.ts
- chain-events-source.test.ts
- ws-mutual-tls.test.ts
- interfaces/chain-archive-store.ts
- pglite-writer.worker.ts
- Problem
- version
- vendored-ledger-v9.test.ts
- pg
- height
- boundary.test.ts
- address
- startPublicCore
- in8Tour
- mutation-per-adapter.mjs
- shadow-schema.test.ts
- facade-merge-loader.ts
- ADDED Requirements
- history.property.test.ts
- 001_chain_archive_core.ts
- scoped-review-manifest
- .boolean
- parseJsonLossless
- T
- versionsOf
- graph.py
- ref_node_child_process
- UmbraDB module guide
- Tasks — v1.0.0-infosec-signoff
- Design — v1.0.0-durable-checkpoint-cursor
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- package.json
- README.md
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- Full-Chain Storage — Design
- Storage Algebra Lean Formalization — Approved Design and Status
- stryker.conf.json
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- Algebraic Specification of the midnight-pg-store Storage Layer
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Roadmap
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- compilerOptions
- openspec-explore/SKILL.md
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB v0.9.5 "Penumbra" — Release Record
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-perf-baseline
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- Design — Postgres+JSONB storage rebuild
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.1.0: Quint model checking
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Repository agent policy
- Our Pledge
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
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
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
- 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Acceptance criteria — v1.0.0-perf-baseline
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- 9. Backups and browser
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
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 243 edges
2. `UmbraError` - 211 edges
3. `ModuleDeclaration` - 115 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `runMigrations()` - 90 edges
6. `ValidationError` - 87 edges
7. `PgCheckpointStore` - 87 edges
8. `Database` - 82 edges
9. `InMemoryBlockSource` - 79 edges
10. `NodeClient` - 78 edges

## Surprising Connections (you probably didn't know these)
- `Impact` --references--> `TemporalKV`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/proposal.md → src/interfaces/temporal-kv.ts
- `What changes` --references--> `TemporalKV`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/proposal.md → src/interfaces/temporal-kv.ts
- `Scenario: A custom schema is honored end to end` --references--> `TemporalKV`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts
- `Scenario: A custom schema is honored end to end` --references--> `TemporalKV`  [INFERRED]
  openspec/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts
- `SC-1 — `kv_history` unbounded growth` --references--> `TemporalKV`  [INFERRED]
  Performance/CEILINGS.md → src/interfaces/temporal-kv.ts

## Import Cycles
- None detected.

## Communities (276 total, 25 thin omitted)

### Community 0 - "chain-process.test.ts"
Cohesion: 0.02
Nodes (219): ProcessAdminOptions, AdminStarter, BlockItemSource, HistoryOptions, BlockSource, FinalityStallCondition, InMemoryBlockSource, InMemoryItems (+211 more)

### Community 1 - "UmbraError"
Cohesion: 0.02
Nodes (141): BlockWriteHandle, CommittedHeight, Database, ReadHandle, ReadOnlyDatabase, ReadOptions, SchemaWriteHandle, Transaction (+133 more)

### Community 10 - "TransactionHandle"
Cohesion: 0.02
Nodes (119): TransactionHistoryReader, TransactionHistoryWriter, TemporalKV, TransactionHandle, TransactionHandleInvalidError, TransactionLeaseLayer, contendOnce(), registerTransaction() (+111 more)

### Community 101 - "differential.test.ts"
Cohesion: 0.12
Nodes (9): Case, outcome(), shape(), identity(), RESULT_TYPES, FAILURES, READS, RFC-3339 (+1 more)

### Community 107 - "node-format.ts"
Cohesion: 0.23
Nodes (14): Reader, childKey(), concat(), decodeChild(), decodeChildren(), encodeChild(), encodeChildren(), nodeKey() (+6 more)

### Community 11 - "PgTransactionLeaseLayer"
Cohesion: 0.03
Nodes (97): BenchEnv, Lease, LeaseAcquireOptions, WatermarkKey, WatermarkKind, Watermarks, WatermarkValue, UmbraDBSql (+89 more)

### Community 111 - "ChainArchiveStore"
Cohesion: 0.10
Nodes (7): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations, Boundary enforcement, Table of contents, UmbraDB Postgres Schema Reference

### Community 115 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.11
Nodes (17): Hash, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence) (+9 more)

### Community 117 - "TapeBuilder"
Cohesion: 0.16
Nodes (7): Refusal, TapeBuilder, RecordingError, withBuilder(), frameText(), whenClosed(), 11. Refusals and halts (IN-12)

### Community 119 - "Process"
Cohesion: 0.23
Nodes (3): Process, messageOf(), pause()

### Community 12 - "api-server.test.ts"
Cohesion: 0.03
Nodes (83): ApiRegistry, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, ChainDataAnswer, ChainDataView, ApiError, ApiErrorCode (+75 more)

### Community 120 - "pglite-outside-reads.ts"
Cohesion: 0.19
Nodes (14): LoadOutcome, OutsideRead, Traced, PgliteTestDatabase, pgliteBackend(), expectNoOutsideReads(), outsideReads(), runUnderReadLoad() (+6 more)

### Community 123 - "ref_node_fs"
Cohesion: 0.21
Nodes (14): LedgerSource, ManifestLine, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest() (+6 more)

### Community 125 - "height-versioned.property.test.ts"
Cohesion: 0.12
Nodes (16): Block, BlockFails, Counts, Effect, Key, Op, canonicalText(), readBack() (+8 more)

### Community 126 - "node-store-suite.ts"
Cohesion: 0.14
Nodes (15): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, NodeBatch, NodeRoot, runInFreshInstance(), hasEmbeddedChild() (+7 more)

### Community 127 - "describeNodeStoreExports"
Cohesion: 0.18
Nodes (4): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports()

### Community 13 - "ref_node_crypto"
Cohesion: 0.04
Nodes (80): EntryContent, EntryLifecycle, TransactionHistoryStatus, JsonEncoded, StoredEntryJson, TxHistoryRow, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter (+72 more)

### Community 130 - "determinism-checks.ts"
Cohesion: 0.18
Nodes (16): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, withCore(), PRIVATE_ROWS_SQL(), privateModule(), a146Hashes() (+8 more)

### Community 131 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 14 - "column-rules.ts"
Cohesion: 0.03
Nodes (98): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog (+90 more)

### Community 140 - ".show"
Cohesion: 0.19
Nodes (3): AllowedDetail, schemaName(), module()

### Community 143 - "binding.test.ts"
Cohesion: 0.16
Nodes (9): TestDatabase, A113Observation, Binding, Outcome, a113Run(), against(), outcomeOf(), A (+1 more)

### Community 144 - "Session"
Cohesion: 0.18
Nodes (5): BoundedRead, Session, queryTimeout(), mapRows(), mapValue()

### Community 145 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 146 - "read-height.property.test.ts"
Cohesion: 0.20
Nodes (10): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+2 more)

### Community 147 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 148 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 15 - "ingest-crash.test.ts"
Cohesion: 0.05
Nodes (80): ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded, FetchSeen, CrashEvent (+72 more)

### Community 155 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 159 - "intake.test.ts"
Cohesion: 0.31
Nodes (12): PrivateSeen, A114Observation, A116Observation, privateCursorHeight(), readPrivateCursor(), a114Problems(), a116Problems(), heights() (+4 more)

### Community 16 - "tape/index.ts"
Cohesion: 0.05
Nodes (53): Link, TapeBuilderOptions, RecordingProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError (+45 more)

### Community 160 - "a114Run"
Cohesion: 0.23
Nodes (4): TestLink, directPublic(), a114Run(), against()

### Community 17 - "PgTemporalKV"
Cohesion: 0.05
Nodes (72): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, AsOf, AssertExact, JsonValue, Key (+64 more)

### Community 174 - "holds"
Cohesion: 0.47
Nodes (4): VersionedValue, StoredVersion, Model, holds()

### Community 18 - "node/client.test.ts"
Cohesion: 0.03
Nodes (49): NodeRetry, ManualTimers, Failure, Variant, connectWebSocket(), "on-compute"(), result(), quietConnect() (+41 more)

### Community 186 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 19 - "FinalizedLoop"
Cohesion: 0.05
Nodes (39): ResolvedRange, Callback, EntryBoundary, ParallelPoint, PointRun, PointSchedule, FinalizedLoop, HeightRun (+31 more)

### Community 2 - "src/index.ts"
Cohesion: 0.03
Nodes (196): CheckpointStoreErrorCode, ConnectionError, Retryability, SharedStorageErrorCode, StorageError, HistoryUnavailableError, TemporalKVError, TemporalKVErrorCode (+188 more)

### Community 20 - "config-check.ts"
Cohesion: 0.05
Nodes (64): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName (+56 more)

### Community 21 - "changes.property.test.ts"
Cohesion: 0.04
Nodes (79): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ChangeKind, tableChanges, TouchedRow, Op, States (+71 more)

### Community 212 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 214 - "no-chain-sync-import-guard.test.ts"
Cohesion: 0.53
Nodes (5): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles()

### Community 23 - "module-tables.ts"
Cohesion: 0.06
Nodes (53): CaptureColumn, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, ConsistentRead (+45 more)

### Community 24 - "db/migrate.ts"
Cohesion: 0.06
Nodes (57): CapturedTable, CaptureState, AppliedRow, Runnable, Settling, PlannedSchema, GuardTableRow, optOut (+49 more)

### Community 25 - ".value"
Cohesion: 0.08
Nodes (44): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+36 more)

### Community 26 - "serve.test.ts"
Cohesion: 0.05
Nodes (46): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminStartOptions, AdminAnswer, AdminEndpoint (+38 more)

### Community 27 - "snapshot.test.ts"
Cohesion: 0.07
Nodes (49): ProcessAdmin, RevisionSettings, AdminServer, SnapshotFacts, AdminSnapshot, ConfigSnapshot, SanitizedError, StatusSnapshot (+41 more)

### Community 28 - "chain-data.test.ts"
Cohesion: 0.07
Nodes (60): BlockParsed, ChainEvent, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec (+52 more)

### Community 29 - "postgres/client.ts"
Cohesion: 0.08
Nodes (50): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+42 more)

### Community 3 - "runner/process.ts"
Cohesion: 0.02
Nodes (158): Bound, ChainIdentity, ChainSource, CoreChainFacts, NodeWait, WaitingListener, CheckState, ConfigCheckOptions (+150 more)

### Community 30 - "adapter.ts"
Cohesion: 0.05
Nodes (44): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+36 more)

### Community 31 - "chain-placement.test.ts"
Cohesion: 0.06
Nodes (56): BodyExtrinsic, BlockBody, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, EventPhase, ledgerVersionOf() (+48 more)

### Community 32 - "config/history.ts"
Cohesion: 0.07
Nodes (54): CoreVersion, CoreSettings, HistoryCode, HistoryContext, HistoryRule, Span, PlacedEntry, SettingsSchema (+46 more)

### Community 33 - "transform-checks.ts"
Cohesion: 0.08
Nodes (40): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, baseRecords() (+32 more)

### Community 34 - "version-checks.ts"
Cohesion: 0.08
Nodes (38): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, CountingNode, MetadataSelector, Select, Walk (+30 more)

### Community 35 - "builder.test.ts"
Cohesion: 0.06
Nodes (40): Answer, Handler, Received, recorded, ConnectionFrames, Recorded, Failure, Variant (+32 more)

### Community 36 - "adapter-fixtures.ts"
Cohesion: 0.10
Nodes (50): Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState, expectNoV8Logs() (+42 more)

### Community 37 - "networks.ts"
Cohesion: 0.05
Nodes (57): LedgerName, VerifyLedgerPackagesOptions, Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis (+49 more)

### Community 38 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+24 more)

### Community 39 - "writer-lock-checks.ts"
Cohesion: 0.09
Nodes (43): WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), expectRefusedBeforeAnyWrite(), noHeight() (+35 more)

### Community 4 - "ValidationError"
Cohesion: 0.02
Nodes (186): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointSummary, ChunkIntegrityError, ChunkMissingError, ContentHash (+178 more)

### Community 40 - "validate.test.ts"
Cohesion: 0.06
Nodes (45): coreEntry, EntryRef, Needs, CursorRow, Expected, refusal(), validateConfig(), checked() (+37 more)

### Community 41 - "NodeBlockSource"
Cohesion: 0.09
Nodes (14): HeadWait, NodeBlockSource, Prefetch, NodeBlock, NodeHeader, PreparedBlock, QueueRunner, NoWindow (+6 more)

### Community 42 - "postgres.ts"
Cohesion: 0.07
Nodes (36): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, MultiStatementRunner, DriverError, Outcome, Role (+28 more)

### Community 43 - "child-processes.test.ts"
Cohesion: 0.05
Nodes (43): ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, guardPid(), alive() (+35 more)

### Community 44 - "history.test.ts"
Cohesion: 0.08
Nodes (44): versionEntry, HistoryRow, Simulation, Start, Case, builtWith100(), deletesOnly(), failingSecondWrite() (+36 more)

### Community 45 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (34): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+26 more)

### Community 46 - "cbor.ts"
Cohesion: 0.08
Nodes (41): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+33 more)

### Community 47 - "LedgerPackage"
Cohesion: 0.05
Nodes (29): LedgerEventKind, LedgerPackage, released(), listen(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix (+21 more)

### Community 48 - "containers.test.ts"
Cohesion: 0.08
Nodes (26): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, BlockRow, TxRow, guardContainers(), removeAttempt() (+18 more)

### Community 49 - "graph.ts"
Cohesion: 0.08
Nodes (44): Edge, GraphFacts, GraphPart, GraphRule, HeightRange, MidChain, Missing, RangeFacts (+36 more)

### Community 5 - "test/postgres/setup.ts"
Cohesion: 0.02
Nodes (166): InvariantResult, C5AnyFn, Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, Fault, Cancellable (+158 more)

### Community 50 - "records.ts"
Cohesion: 0.07
Nodes (32): Metadata, Step, TapeError, TapeProblem, DisconnectRecord, FaultRecord, Params, Tape (+24 more)

### Community 51 - "vitest"
Cohesion: 0.06
Nodes (19): Lockfile, Manifest, Upstream, ReportedTest, status(), filesUnder(), patchesOf(), patchText() (+11 more)

### Community 52 - "record-and-replay.test.ts"
Cohesion: 0.07
Nodes (25): NodeClientOptions, ConnectSocket, TapeCommandIo, ConnectionFrames, RecordAndReplayOptions, RecordAndReplayResult, ReplaySession, fakeResult() (+17 more)

### Community 53 - "NodeClient"
Cohesion: 0.11
Nodes (17): NodeSourceOptions, CoreChainBinding, HeadSubscriber, NodeClient, Pending, connectionFailure, NodeMethod, NodeTimers (+9 more)

### Community 54 - "pglite.ts"
Cohesion: 0.06
Nodes (26): Job, Outcome, ServerErrorFields, CheckTarget, CliBackend, Snapshot, Job, nestedCall() (+18 more)

### Community 56 - "post-block-update-checks.ts"
Cohesion: 0.10
Nodes (34): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+26 more)

### Community 58 - "postgres/migrate.ts"
Cohesion: 0.08
Nodes (20): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, bootstrapChainArchiveSchema(), assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit() (+12 more)

### Community 59 - "core-settings.ts"
Cohesion: 0.06
Nodes (34): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys (+26 more)

### Community 6 - "loop.test.ts"
Cohesion: 0.02
Nodes (144): ErrorCode, ItemSink, PointName, GraphInput, BlockItems, PointArguments, HeightFailure, Misuse (+136 more)

### Community 60 - "entries.ts"
Cohesion: 0.06
Nodes (35): CoreLedgerVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+27 more)

### Community 61 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (19): BlockBundle, BlockMeta, BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, VerifierKeyObservationRecord (+11 more)

### Community 63 - "validate.ts"
Cohesion: 0.10
Nodes (36): HistoryFinding, ConfigRule, CursorRule, Finding, Issue, Plain, coreSettingsSchema(), pathOf() (+28 more)

### Community 65 - "checks.test.ts"
Cohesion: 0.07
Nodes (22): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql() (+14 more)

### Community 66 - "ledger/types.ts"
Cohesion: 0.09
Nodes (28): AppliedBlock, ApplyInput, ApplyOutput, ChainOutcome, LedgerEvent, LedgerTask, LogEventType, LogItem (+20 more)

### Community 67 - "chain-events-decode.test.ts"
Cohesion: 0.09
Nodes (29): BlockEventSource, isBlockEventSource(), systemEventsKey(), bindCoreChainEvents(), boundEventSource(), chainEventsItemOf(), chainEventsOf(), coreChainEventsOnFetch() (+21 more)

### Community 68 - "ref_node_path"
Cohesion: 0.08
Nodes (21): LoadedConfig, LoadOptions, Finding, invalid(), isFile(), loadConfig(), load(), resolve() (+13 more)

### Community 69 - "block-fetch-decode.test.ts"
Cohesion: 0.10
Nodes (22): PalletSpec, Fetching, Recorder, blake2b256(), compress(), rotateRight(), words(), decodeExtrinsics() (+14 more)

### Community 7 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (123): MergeEntriesFn, TransactionHistoryEntry, TransactionHistoryStorage, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, CheckpointStore, capitalize(), abortErrorLike() (+115 more)

### Community 72 - "plain-data.ts"
Cohesion: 0.09
Nodes (25): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+17 more)

### Community 73 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.07
Nodes (25): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED) (+17 more)

### Community 74 - "adapter-core.test.ts"
Cohesion: 0.11
Nodes (21): LoadLedger, RawTransactionResult, SyntheticCost, LedgerReleasePackage, LedgerPackageOptions, FakeTransaction, Recorded, loadLedgerPackage() (+13 more)

### Community 75 - "events-fixtures.ts"
Cohesion: 0.17
Nodes (22): Field, PalletMetadata, Registry, RuntimeShape, StorageSpec, metadataWith(), metadataV14(), midnightMetadata() (+14 more)

### Community 77 - "node/client.ts"
Cohesion: 0.16
Nodes (28): NodeSubscription, State, Subscription, NodeRuntimeVersion, NodeCallMethod, SubscribeMethod, isRecord(), isRetryable() (+20 more)

### Community 78 - "PgliteDatabase"
Cohesion: 0.12
Nodes (13): JobQueue, PgliteDatabase, Write, handleClosed(), failedEarlier(), openOn(), Global Constraints, Plan Self-Review (+5 more)

### Community 79 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 8 - "declaration.ts"
Cohesion: 0.03
Nodes (114): OwnPart, BlockHeader, DefinedModule, FieldKind, FieldSchema, ItemDeclaration, KnownPointsOnly, Lifetime (+106 more)

### Community 81 - "source-scan.ts"
Cohesion: 0.11
Nodes (24): DesignTable, RowCoverage, ModuleReference, opensDatabase(), boundaryViolations(), calledNames(), codeFingerprints(), declaredNames() (+16 more)

### Community 82 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.12
Nodes (24): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+16 more)

### Community 84 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 85 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 86 - "openPostgres"
Cohesion: 0.10
Nodes (24): DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, PgliteOptions, PostgresOptions, open() (+16 more)

### Community 89 - "private/backends.ts"
Cohesion: 0.12
Nodes (17): PrivateBackend, SessionSeen, A112Observation, Wiring, pgliteBackend(), a146HashProblems(), a146RefusalProblems(), optedOutProblems() (+9 more)

### Community 9 - "core-block-commit.test.ts"
Cohesion: 0.03
Nodes (86): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, QueuedBlock, ChainCheck, ChainCheckInput, AdmittedKey, PrivateBlockSource (+78 more)

### Community 94 - "node/errors.ts"
Cohesion: 0.12
Nodes (16): Connection, NodeSocket, NodeSocketEvents, SocketFailure, backoffDelay(), positive(), callTimedOut(), invalidOption() (+8 more)

### Community 95 - "chain-events-source.test.ts"
Cohesion: 0.12
Nodes (11): NodeCallOptions, RecordingClient, open(), quiet(), in8Methods(), outsideIn8(), chain, closing (+3 more)

### Community 96 - "ws-mutual-tls.test.ts"
Cohesion: 0.12
Nodes (18): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+10 more)

### Community 97 - "interfaces/chain-archive-store.ts"
Cohesion: 0.15
Nodes (18): BlobIntegrityError, BlobMissingError, BlobRole, BlockNotFoundError, BlockStatus, BridgeObservationKind, ChainArchiveError, ChainArchiveErrorCode (+10 more)

### Community 99 - "pglite-writer.worker.ts"
Cohesion: 0.17
Nodes (16): Held, PgliteLockUse, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor(), main() (+8 more)

### Community 220 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 103 - "version"
Cohesion: 0.10
Nodes (19): version(), Requirement: CF-7 The history row and its hash, Scenario: The same entry gives the same hash, 3. The freeze: build + package.json (G1), 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3) (+11 more)

### Community 106 - "vendored-ledger-v9.test.ts"
Cohesion: 0.25
Nodes (18): freeAll(), bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex() (+10 more)

### Community 109 - "pg"
Cohesion: 0.11
Nodes (17): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 1. Postgres-side profiling (+9 more)

### Community 110 - "height"
Cohesion: 0.12
Nodes (18): height(), 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy, 4. Schema design (+10 more)

### Community 113 - "boundary.test.ts"
Cohesion: 0.24
Nodes (17): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+9 more)

### Community 116 - "address"
Cohesion: 0.12
Nodes (17): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite (+9 more)

### Community 129 - "startPublicCore"
Cohesion: 0.19
Nodes (15): genesisHex(), launchPrivate(), poll(), privateCoreEntry(), publicCoreEntry(), publicReads(), quiet(), refusalOf() (+7 more)

### Community 138 - "in8Tour"
Cohesion: 0.25
Nodes (5): positive(), hashParameter(), blockUnavailable(), passFence(), in8Tour()

### Community 142 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 161 - "shadow-schema.test.ts"
Cohesion: 0.15
Nodes (7): changeCaptureLayout(), CHANGED, EXPECTED_CBOR, EXPECTED_HASH, MODULE_M, UNCHANGED, RFC-8949

### Community 164 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 166 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value (+3 more)

### Community 169 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 172 - "001_chain_archive_core.ts"
Cohesion: 0.24
Nodes (9): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, Revision history, v2 — 2026-07-22, revised in response to a 3-reviewer design-council audit (Fable 5 / Opus / GPT-5.6 Sol), v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol) (+1 more)

### Community 177 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 199 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 218 - "parseJsonLossless"
Cohesion: 0.40
Nodes (5): parseJsonLossless(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 22 - "T"
Cohesion: 0.03
Nodes (80): T(), 1. TemporalKV — event-sourced right action with a CAS guard, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5) (+72 more)

### Community 255 - "versionsOf"
Cohesion: 0.50
Nodes (4): versionsOf(), outcome(), secondChangeProblems(), stateOf()

### Community 64 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 90 - "ref_node_child_process"
Cohesion: 0.11
Nodes (20): end(), removeContainers(), dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), check (+12 more)

### Community 92 - "UmbraDB module guide"
Cohesion: 0.09
Nodes (23): fakePackage(), regular(), system(), Chain events, transactions and their outcomes, Cursor tables, Data that is not a function of the chain, Migrations, Private modules (+15 more)

### Community 98 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.10
Nodes (21): repository(), 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA (+13 more)

### Community 100 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.09
Nodes (21): 0. Package layout, 1.1 The gap, confirmed in source, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc (+13 more)

### Community 102 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (18): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 6. Nix — nixpkgs packages (from the locked nixpkgs), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies (+10 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 105 - "package.json"
Cohesion: 0.10
Nodes (20): bin, umbradb, description, exports, files, homepage, license, main (+12 more)

### Community 108 - "README.md"
Cohesion: 0.16
Nodes (5): For historical reference only, Tasks — superseded by per-sprint openspec changes, UmbraDB v1.0.0 — Release Record (PENDING), What 1.0.0 additionally requires, What must happen before this record can be completed

### Community 112 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 114 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 121 - "Full-Chain Storage — Design"
Cohesion: 0.11
Nodes (17): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+9 more)

### Community 122 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.11
Nodes (18): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+10 more)

### Community 124 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 133 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 134 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+8 more)

### Community 135 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 136 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+7 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 139 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.13
Nodes (9): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure (+1 more)

### Community 141 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 150 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 151 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 152 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 154 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 156 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 158 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 163 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 165 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 167 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 168 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 170 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 171 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 173 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 176 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 178 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 179 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.20
Nodes (10): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+2 more)

### Community 180 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 181 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer) (+1 more)

### Community 182 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 183 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.20
Nodes (9): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Full-sync soak + load-under-prune (G10), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1) (+1 more)

### Community 184 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 185 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 187 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 188 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.22
Nodes (9): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 8. Test infrastructure (open decision — resolve in Task 1) (+1 more)

### Community 189 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 190 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 191 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 192 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 194 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 195 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 196 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 197 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 198 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 200 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 201 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 202 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 203 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 204 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 205 - "Security policy & threat model"
Cohesion: 0.29
Nodes (7): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 206 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 207 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 208 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 209 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 210 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 211 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 215 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 216 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 217 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 219 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 221 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 222 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 223 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 224 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 225 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 226 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 227 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 228 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, Why

### Community 229 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 230 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 231 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 232 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 233 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 234 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 235 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 236 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 237 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 238 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 239 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 240 - "00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone"
Cohesion: 0.40
Nodes (4): 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone, Problem, Resolution, Suggested fix

### Community 241 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 242 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 243 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 244 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 245 - "Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data"
Cohesion: 0.40
Nodes (5): Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data, Scenario: replay from the durable cursor converges on current state, Scenario: the durable watermark is never ahead of durable data, Scenario: the invariant holds under synchronous_commit = off, Scenario: the invariant holds under synchronous_commit = on

### Community 247 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 248 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 249 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 250 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 251 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 252 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 253 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 254 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 258 - "9. Backups and browser"
Cohesion: 0.67
Nodes (3): 9.1 Backups (BK; Q83, Q85), 9.2 Browser build (BR), 9. Backups and browser

### Community 259 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 55 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 57 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 62 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 70 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 71 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides, Requirement: LG-17 Ledger tasks give modules the native objects (+25 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+19 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form, Requirement: G9/T3 — a killed lease-holder does not wedge the lease (+19 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0, Requirement: the baseline reflects the batched (shipped) save shape (+17 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically, Requirement: the required Postgres configuration is published as a binding Durability Contract, Requirement: the UmbraDB connection sets bounded server-side timeouts by default, Requirement: withLease surfaces a lease-release failure instead of swallowing it (+16 more)

## Knowledge Gaps
- **42 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` (+37 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3007 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `chain-process.test.ts`, `UmbraError`, `src/index.ts`, `runner/process.ts`, `ValidationError`, `test/postgres/setup.ts`, `loop.test.ts`, `declaration.ts`, `core-block-commit.test.ts`, `PgTransactionLeaseLayer`, `api-server.test.ts`, `ref_node_crypto`, `ingest-crash.test.ts`, `tape/index.ts`, `PgTemporalKV`, `node/client.test.ts`, `config-check.ts`, `changes.property.test.ts`, `module-tables.ts`, `serve.test.ts`, `snapshot.test.ts`, `chain-data.test.ts`, `postgres/client.ts`, `chain-placement.test.ts`, `transform-checks.ts`, `version-checks.ts`, `builder.test.ts`, `adapter-fixtures.ts`, `networks.ts`, `column-rules.test.ts`, `writer-lock-checks.ts`, `validate.test.ts`, `postgres.ts`, `child-processes.test.ts`, `history.test.ts`, `zero-timeouts-checks.ts`, `containers.test.ts`, `records.ts`, `record-and-replay.test.ts`, `pglite.ts`, `post-block-update-checks.ts`, `postgres/migrate.ts`, `core-settings.ts`, `entries.ts`, `checks.test.ts`, `chain-events-decode.test.ts`, `ref_node_path`, `block-fetch-decode.test.ts`, `plain-data.ts`, `adapter-core.test.ts`, `source-scan.ts`, `chain-archive-replay-decode.integration.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `private/backends.ts`, `node/errors.ts`, `chain-events-source.test.ts`, `ws-mutual-tls.test.ts`, `differential.test.ts`, `package.json`, `vendored-ledger-v9.test.ts`, `boundary.test.ts`, `pglite-outside-reads.ts`, `ref_node_fs`, `height-versioned.property.test.ts`, `node-store-suite.ts`, `mutation-per-adapter.mjs`, `binding.test.ts`, `read-height.property.test.ts`, `cursor-table.property.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `intake.test.ts`, `shadow-schema.test.ts`, `excluded-not-exported.test.ts`, `facade-merge-loader.ts`, `history.property.test.ts`, `postgres-image.test.ts`, `no-chain-sync-import-guard.test.ts`?**
  _High betweenness centrality (0.307) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _42 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `chain-process.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01742852461702302 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `chain-process.test.ts`, `runner/process.ts`, `loop.test.ts`, `declaration.ts`, `core-block-commit.test.ts`, `in8Tour`, `api-server.test.ts`, `column-rules.ts`, `ingest-crash.test.ts`, `Session`, `checkShape`, `node/client.test.ts`, `FinalizedLoop`, `config-check.ts`, `changes.property.test.ts`, `module-tables.ts`, `db/migrate.ts`, `snapshot.test.ts`, `config/history.ts`, `transform-checks.ts`, `version-checks.ts`, `builder.test.ts`, `networks.ts`, `writer-lock-checks.ts`, `validate.test.ts`, `NodeBlockSource`, `postgres.ts`, `history.test.ts`, `zero-timeouts-checks.ts`, `cbor.ts`, `LedgerPackage`, `graph.ts`, `NodeClient`, `pglite.ts`, `core-settings.ts`, `entries.ts`, `validate.ts`, `checks.test.ts`, `ledger/types.ts`, `ref_node_path`, `plain-data.ts`, `node/client.ts`, `PgliteDatabase`, `mapping.ts`, `openPostgres`, `node/errors.ts`, `chain-events-source.test.ts`, `pglite-writer.worker.ts`, `differential.test.ts`, `TapeBuilder`, `ref_node_fs`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.01969911623827835 - nodes in this community are weakly interconnected._