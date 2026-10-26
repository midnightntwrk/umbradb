# Graph Report - UmbraDB

## Corpus Check
- 809 files · ~1,253,098 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 8645 nodes · 24606 edges · 270 communities (247 shown, 23 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 3014 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `cd82b85dd20991fe` (809 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionLeaseLayer
- src/index.ts
- change-capture.ts
- mapping.ts
- intake.test.ts
- containers.test.ts
- process.test.ts
- ledger/metadata.ts
- version.negative-control.test.ts
- block-fetch-decode.test.ts
- version-table.ts
- writer-lock-checks.ts
- height
- ChainArchiveStore
- binding.test.ts
- determinism-checks.ts
- translatePostgresError
- BlobIntegrityError
- envelope.ts
- builds.ts
- TapeNode
- opt-out.test.ts
- FakeNode
- ws-mutual-tls.test.ts
- checkShape
- chain-events-decode.test.ts
- chain-archive-rollover.ts
- RawClient
- 3. Proof-blocking findings
- NodeClient
- midnight-env — reproducible PREPROD dev environment
- halts.test.ts
- api-server.test.ts
- postgres-image.test.ts
- admin-harness.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- .name
- tape/index.ts
- ValidationError
- runMigrations
- ReadPool
- mutation-evidence.d.mts
- process-admin.ts
- vendored-ledger-files.test.ts
- config-check.ts
- node/client.test.ts
- describeNodeStoreExports
- chain-placement.test.ts
- ReadOnlyDatabase
- status-schema.test.ts
- runner/process.ts
- record-and-replay.test.ts
- NodeBlockSource
- PgTransactionHistoryStorage
- column-rules.ts
- api.ts
- PointName
- .value
- declaration.ts
- FinalizedLoop
- transform-checks.ts
- crash-worker.ts
- chain-data-tapes.ts
- lifecycle.test.ts
- db/migrate.ts
- config/history.ts
- adapter-core.test.ts
- module-api.test.ts
- history.test.ts
- loop.test.ts
- adapter-fixtures.ts
- loop.ts
- column-rules.test.ts
- boundary.test.ts
- UmbraError
- ref_node_fs
- zero-timeouts-checks.ts
- order.property.test.ts
- LedgerPackage
- InMemoryBlockSource
- graph.ts
- entries.ts
- cbor.ts
- postgres/chain-archive-store.ts
- chain-process.test.ts
- createClient
- validate.ts
- core-settings.ts
- replay-check.ts
- validate.test.ts
- post-block-update-checks.ts
- cbor.property.test.ts
- vitest
- networks.ts
- ProcessContexts
- .show
- core-private-source.ts
- plain-data.ts
- format.test.ts
- ref_node_crypto
- core-private-source.test.ts
- redact.ts
- core-block-commit.test.ts
- chain-events-source.test.ts
- checks.test.ts
- 5. Runner
- ingest-crash.test.ts
- height-versioned.property.test.ts
- chain-archive-replay-decode.integration.test.ts
- version-checks.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- no-indexer-or-wallet-sdk.test.ts
- private/backends.ts
- crash.test.ts
- address
- ref_node_url
- mutation-per-adapter.mjs
- pg
- facade-merge-loader.ts
- ADDED Requirements
- history.property.test.ts
- 001_chain_archive_core.ts
- pack-install.mjs
- .boolean
- orphan-watcher.mjs
- fresh-instance.mjs
- T
- version
- graph.py
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- ADDED Requirements
- ROADMAP.md
- ADDED Requirements
- package.json
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- Full-Chain Storage — Design
- Storage Algebra Lean Formalization — Approved Design and Status
- stryker.conf.json
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- devDependencies
- UmbraDB v0.9.5 "Penumbra" — Release Record
- README.md
- UmbraDB module guide
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Roadmap
- compilerOptions
- UmbraDB V1.0.0 Implementation Guideline
- Proposal — v1.0.0-perf-baseline
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.1.0: Quint model checking
- compilerOptions
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- UmbraDB
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- Design — Postgres+JSONB storage rebuild
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Our Pledge
- Algebraic Specification of the midnight-pg-store Storage Layer
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- Global Constraints
- Security policy & threat model
- 12. Milestone status
- Design — CORE-ARCH: the standalone indexer's core architecture
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 5. Recommended candidate model
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
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
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
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
- ADDED Requirements
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 246 edges
2. `UmbraError` - 213 edges
3. `ModuleDeclaration` - 119 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `runMigrations()` - 90 edges
6. `PgCheckpointStore` - 87 edges
7. `ValidationError` - 87 edges
8. `Database` - 84 edges
9. `InMemoryBlockSource` - 79 edges
10. `NodeClient` - 78 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: save on a caller transaction behaves identically to the internal-transaction path for a reader` --references--> `CheckpointSummary`  [INFERRED]
  openspec/changes/v1.0.0-durable-checkpoint-cursor/specs/durable-composition/spec.md → src/interfaces/checkpoint-store.ts
- `The honest-test pattern (what makes each required test non-vacuous)` --references--> `ChunkMissingError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/checkpoint-store.ts
- `Scenario: A chunk shared across wallets survives one wallet's prune` --references--> `ChunkMissingError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts
- `CheckpointStore: content-addressed snapshots` --references--> `ManifestCorruptError`  [INFERRED]
  README.md → src/interfaces/checkpoint-store.ts
- `Rework (class 1 — infra)` --references--> `ConnectionError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/storage-errors.ts

## Import Cycles
- None detected.

## Communities (270 total, 23 thin omitted)

### Community 0 - "PgTransactionLeaseLayer"
Cohesion: 0.01
Nodes (221): JsonValue, PgCheckpointStore, KvRow, PgTransactionLeaseLayer, PgWatermarks, Adapters, BatchSpec, CurrentState (+213 more)

### Community 1 - "src/index.ts"
Cohesion: 0.02
Nodes (190): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError, ChunkMissingError (+182 more)

### Community 10 - "change-capture.ts"
Cohesion: 0.03
Nodes (103): CapturedTable, CaptureState, SchemaPlan, ChangeKind, tableChanges, TouchedRow, Chain, ChainOptions (+95 more)

### Community 102 - "mapping.ts"
Cohesion: 0.13
Nodes (23): ResultColumn, ResultType, arrayLiteral(), hexOf(), isInfinity(), malformed(), malformedArray(), parseArrayText() (+15 more)

### Community 103 - "intake.test.ts"
Cohesion: 0.15
Nodes (17): PrivateSeen, PublicCore, A114Observation, A116Observation, TestLink, directPublic(), a114Problems(), a114Run() (+9 more)

### Community 104 - "containers.test.ts"
Cohesion: 0.10
Nodes (16): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, removeAttempt(), startContainers(), parentWithContainer(), LABEL_ATTEMPT (+8 more)

### Community 105 - "process.test.ts"
Cohesion: 0.09
Nodes (16): plainData, ConfigContext, EntryView, upgradeBoundary, UpgradeCondition, A149Observation, A149Startup, validateDeclarations() (+8 more)

### Community 106 - "ledger/metadata.ts"
Cohesion: 0.14
Nodes (8): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, MetadataSelector, OwnStateMetadata, contentStateOf(), hexOf()

### Community 107 - "version.negative-control.test.ts"
Cohesion: 0.15
Nodes (19): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, Select, text(), checkPackageFiles(), manifestSha256(), mismatch() (+11 more)

### Community 108 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (17): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), concatBytes(), encodeCompact() (+9 more)

### Community 109 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 11 - "writer-lock-checks.ts"
Cohesion: 0.03
Nodes (73): Held, PgliteLockUse, CheckTarget, CliBackend, Snapshot, WriterProcess, Job, WorkerEvent (+65 more)

### Community 111 - "height"
Cohesion: 0.11
Nodes (19): Broken, height(), 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy (+11 more)

### Community 114 - "ChainArchiveStore"
Cohesion: 0.10
Nodes (7): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations, Boundary enforcement, Table of contents, UmbraDB Postgres Schema Reference

### Community 117 - "binding.test.ts"
Cohesion: 0.14
Nodes (13): TestDatabase, A113Observation, Binding, Outcome, readIdentity(), a113Run(), against(), bindingIn() (+5 more)

### Community 118 - "determinism-checks.ts"
Cohesion: 0.19
Nodes (17): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, privateCursorHeight(), PRIVATE_ROWS_SQL(), privateModule(), a146Hashes() (+9 more)

### Community 12 - "translatePostgresError"
Cohesion: 0.04
Nodes (100): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionFaultError, TransactionLeaseError, TransactionOptions (+92 more)

### Community 120 - "BlobIntegrityError"
Cohesion: 0.20
Nodes (12): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+4 more)

### Community 124 - "envelope.ts"
Cohesion: 0.22
Nodes (14): ChainDataView, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions(), chainApi() (+6 more)

### Community 126 - "builds.ts"
Cohesion: 0.21
Nodes (15): PrivateProcess, PrivateRefusal, genesisBlock(), genesisHex(), launchPrivate(), poll(), privateCoreEntry(), publicCoreEntry() (+7 more)

### Community 127 - "TapeNode"
Cohesion: 0.19
Nodes (3): TapeClock, TapeNode, SYSTEM_CLOCK

### Community 13 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (78): CaptureColumn, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions (+70 more)

### Community 131 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 139 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 14 - "chain-events-decode.test.ts"
Cohesion: 0.03
Nodes (96): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, MetadataVariant, BlockParsed, BlockParsedOptions, ChainTransaction (+88 more)

### Community 143 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 149 - "3. Proof-blocking findings"
Cohesion: 0.15
Nodes (13): Absent, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces (+5 more)

### Community 15 - "NodeClient"
Cohesion: 0.05
Nodes (60): NodeSourceOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+52 more)

### Community 150 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 16 - "halts.test.ts"
Cohesion: 0.04
Nodes (81): ProcessingEnd, ProcessStatus, A43Observation, Outcome, ProcessDatabase, testBuild, A42Observation, Seen (+73 more)

### Community 17 - "api-server.test.ts"
Cohesion: 0.03
Nodes (69): ApiRegistry, Connection, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, ChainDataAnswer, ApiError, ApiErrorCode (+61 more)

### Community 176 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 18 - "admin-harness.ts"
Cohesion: 0.04
Nodes (78): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStarter, AdminStartOptions (+70 more)

### Community 184 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 19 - "tape/index.ts"
Cohesion: 0.05
Nodes (67): Failure, Variant, Link, TapeBuilderOptions, RecordingProblem, TapeProblem, TransformProblem, readRequest (+59 more)

### Community 2 - "ValidationError"
Cohesion: 0.02
Nodes (144): TransactionHistoryReader, TransactionHistoryWriter, ValidationError, AsOf, AssertExact, Key, Namespace, Scope (+136 more)

### Community 20 - "runMigrations"
Cohesion: 0.03
Nodes (88): UmbraDBConnectionOptions, bootstrapChainArchiveSchema(), runMigrations(), runMigrationsImpl(), withReservedTransaction(), migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), 8. Migration (+80 more)

### Community 209 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 21 - "process-admin.ts"
Cohesion: 0.05
Nodes (52): ProcessAdmin, ProcessAdminOptions, DigestRow, ModuleFacts, PartTable, SnapshotFacts, ConfigSnapshot, ModuleStatus (+44 more)

### Community 210 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 22 - "config-check.ts"
Cohesion: 0.05
Nodes (63): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckState, CheckStep, ConfigCheckReport, ConfigCheckSeams (+55 more)

### Community 23 - "node/client.test.ts"
Cohesion: 0.04
Nodes (45): NodeRetry, ManualTimers, connectWebSocket(), "on-compute"(), quiet(), result(), quietConnect(), withNode() (+37 more)

### Community 24 - "describeNodeStoreExports"
Cohesion: 0.07
Nodes (51): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+43 more)

### Community 25 - "chain-placement.test.ts"
Cohesion: 0.06
Nodes (60): BlockTransaction, LoadLedger, TransactionParser, LedgerName, AdapterSpec, Binding, EventKind, Native (+52 more)

### Community 26 - "status-schema.test.ts"
Cohesion: 0.05
Nodes (57): ReadinessFacts, ProcessState, gate, Observation, StatusBody, Validator, Decision, ReadinessCase (+49 more)

### Community 27 - "runner/process.ts"
Cohesion: 0.05
Nodes (41): OpenedFacts, Bound, ChainCheck, ChainCheckInput, ChainIdentity, ChainSource, CoreChainBinding, CoreChainFacts (+33 more)

### Community 28 - "record-and-replay.test.ts"
Cohesion: 0.05
Nodes (37): Answer, Handler, Received, recorded, ConnectionFrames, Recorded, Failure, Variant (+29 more)

### Community 29 - "NodeBlockSource"
Cohesion: 0.07
Nodes (23): BlockEventSource, CoreBlockItems, RuntimeMetadataView, HeadWait, NodeBlockSource, Prefetch, NodeSubscription, NodeBlock (+15 more)

### Community 3 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (151): TransactionHistoryEntry, TransactionHistoryStorage, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, CheckpointStore, EnvelopeCorruptError, WalletStateEnvelope, PgWalletStateEnvelopeStore (+143 more)

### Community 30 - "column-rules.ts"
Cohesion: 0.04
Nodes (69): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+61 more)

### Community 31 - "api.ts"
Cohesion: 0.05
Nodes (39): BlockWriteHandle, ReadHandle, SchemaWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+31 more)

### Community 32 - "PointName"
Cohesion: 0.04
Nodes (45): OwnPart, FieldKind, FieldSchema, ItemDeclaration, ItemSink, Lifetime, PendingKey, PointName (+37 more)

### Community 33 - ".value"
Cohesion: 0.09
Nodes (40): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef (+32 more)

### Community 34 - "declaration.ts"
Cohesion: 0.05
Nodes (51): DefinedModule, KnownPointsOnly, TableDeclaration, DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase (+43 more)

### Community 35 - "FinalizedLoop"
Cohesion: 0.06
Nodes (19): EntryBoundary, FinalizedLoop, HeightRun, LoopObserver, Startup, SkipsAfterReconnect, Batching, WaitingInRead (+11 more)

### Community 36 - "transform-checks.ts"
Cohesion: 0.08
Nodes (44): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, until() (+36 more)

### Community 37 - "crash-worker.ts"
Cohesion: 0.05
Nodes (51): WatermarkKey, WatermarkKind, Watermarks, WatermarkValue, WatermarkRow, CoTxCallable, CoTxPauseInfo, CrashHook (+43 more)

### Community 38 - "chain-data-tapes.ts"
Cohesion: 0.08
Nodes (55): BlockSpec, EventSpec, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry (+47 more)

### Community 39 - "lifecycle.test.ts"
Cohesion: 0.05
Nodes (47): SignalTarget, Child, ParentJob, Kill, Orphaned, SourceFile, LockResult, terminationSignal() (+39 more)

### Community 4 - "db/migrate.ts"
Cohesion: 0.03
Nodes (121): AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference, PlannedSchema, Provision (+113 more)

### Community 40 - "config/history.ts"
Cohesion: 0.07
Nodes (56): CoreVersion, CoreSettings, HistoryCheck, HistoryCode, HistoryContext, HistoryInput, HistoryOptions, Span (+48 more)

### Community 41 - "adapter-core.test.ts"
Cohesion: 0.05
Nodes (44): RawEvent, RawLedgerPackage, RawState, RawSystemTransaction, RawTransaction, RawTransactionResult, SyntheticCost, FakeTransaction (+36 more)

### Community 42 - "module-api.test.ts"
Cohesion: 0.06
Nodes (53): GraphInput, ApiRequest, PastFaultCase, RefusalCase, resolveGraph(), keysModule(), contractLogs(), declaration() (+45 more)

### Community 43 - "history.test.ts"
Cohesion: 0.06
Nodes (56): versionEntry, HistoryRow, HistoryRule, AppliedMigration, Simulation, Start, Holder, Started (+48 more)

### Community 45 - "loop.test.ts"
Cohesion: 0.06
Nodes (45): Contexts, LoopClass, RunnerDatabase, SeenCall, Started, Lost, Seen, Shifted (+37 more)

### Community 46 - "adapter-fixtures.ts"
Cohesion: 0.10
Nodes (50): Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState, expectNoV8Logs() (+42 more)

### Community 47 - "loop.ts"
Cohesion: 0.06
Nodes (42): ProcessContext, Revision, EntryRange, ResolvedGraph, StartedModuleApi, LateUse, Invoke, ReadOpener (+34 more)

### Community 48 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+24 more)

### Community 49 - "boundary.test.ts"
Cohesion: 0.08
Nodes (43): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+35 more)

### Community 5 - "UmbraError"
Cohesion: 0.03
Nodes (91): ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, ReadOptions, Transaction, DurabilityProbeOptions (+83 more)

### Community 50 - "ref_node_fs"
Cohesion: 0.06
Nodes (31): LoadOptions, Finding, GuardViolation, ReportedTest, graphInputOf(), invalid(), isFile(), loadConfig() (+23 more)

### Community 51 - "zero-timeouts-checks.ts"
Cohesion: 0.08
Nodes (39): Settings, Run, Job, WorkerEvent, Outcome, openBlockWrites(), expectNeverCutOffNorHung(), settings() (+31 more)

### Community 52 - "order.property.test.ts"
Cohesion: 0.06
Nodes (44): PointArguments, PointRun, CallEvent, Recorder, CheckName, GraphSpec, ModuleSpec, Pipeline (+36 more)

### Community 53 - "LedgerPackage"
Cohesion: 0.05
Nodes (30): LedgerEventKind, LedgerPackage, released(), listen(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix (+22 more)

### Community 54 - "InMemoryBlockSource"
Cohesion: 0.07
Nodes (27): BlockItemSource, QueuedBlock, BlockContext, BlockRef, InMemoryBlockSource, InMemoryItems, InMemorySourceOptions, Wait (+19 more)

### Community 55 - "graph.ts"
Cohesion: 0.07
Nodes (46): Edge, GraphFacts, GraphPart, GraphRule, HeightRange, MidChain, Missing, RangeFacts (+38 more)

### Community 56 - "entries.ts"
Cohesion: 0.06
Nodes (40): CoreLedgerVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+32 more)

### Community 57 - "cbor.ts"
Cohesion: 0.09
Nodes (38): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+30 more)

### Community 58 - "postgres/chain-archive-store.ts"
Cohesion: 0.10
Nodes (27): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+19 more)

### Community 59 - "chain-process.test.ts"
Cohesion: 0.07
Nodes (34): ProcessHandle, Job, WorkerEvent, A77Observation, A78Observation, A90Observation, Failing, Flaky (+26 more)

### Community 6 - "createClient"
Cohesion: 0.04
Nodes (84): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+76 more)

### Community 60 - "validate.ts"
Cohesion: 0.09
Nodes (42): HistoryFinding, CursorRule, Finding, Issue, Plain, SettingsSchema, coreSettingsSchema(), pathOf() (+34 more)

### Community 61 - "core-settings.ts"
Cohesion: 0.06
Nodes (39): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+31 more)

### Community 62 - "replay-check.ts"
Cohesion: 0.07
Nodes (28): NodeClientOptions, Refusal, TapeBuilder, TapeCommandIo, RecordingError, ConnectionFrames, RecordAndReplayOptions, RecordAndReplayResult (+20 more)

### Community 63 - "validate.test.ts"
Cohesion: 0.07
Nodes (36): coreEntry, ConfigRule, EntryRef, CursorRow, Expected, checked(), checked(), declarations() (+28 more)

### Community 66 - "post-block-update-checks.ts"
Cohesion: 0.10
Nodes (34): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+26 more)

### Community 68 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (36): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+28 more)

### Community 7 - "vitest"
Cohesion: 0.03
Nodes (87): Database, Committed, TestBackend, TestDatabase, Case, LoadOutcome, OutsideRead, Traced (+79 more)

### Community 70 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 73 - "ProcessContexts"
Cohesion: 0.09
Nodes (14): ProcessContexts, ProcessItems, ChainStarted, bindCoreBlockFetch(), bindCoreChain(), readOnlyDatabase(), startModuleApi(), providesProcessItem() (+6 more)

### Community 74 - ".show"
Cohesion: 0.07
Nodes (22): AllowedDetail, schemaName(), module(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 77 - "core-private-source.ts"
Cohesion: 0.12
Nodes (20): PrivateBlockSource, privateIntake, PrivateIntakeOptions, PublicDatabase, PublicIdentity, PublicWakes, PrivateOptions, bindingRefusal() (+12 more)

### Community 78 - "plain-data.ts"
Cohesion: 0.09
Nodes (25): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+17 more)

### Community 79 - "format.test.ts"
Cohesion: 0.10
Nodes (20): Metadata, Step, TapeError, Tape, expectGoldenRoundTrip(), changedLines(), recordLine(), sessionCheck() (+12 more)

### Community 8 - "ref_node_crypto"
Cohesion: 0.03
Nodes (100): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryStatus (+92 more)

### Community 81 - "core-private-source.test.ts"
Cohesion: 0.08
Nodes (10): AdmittedKey, privateBackbone(), fakePublic(), fakeRead(), identity(), CORE_KEY_REGISTRY, CORE_KEY_REGISTRY_MIGRATIONS, NONE (+2 more)

### Community 83 - "redact.ts"
Cohesion: 0.12
Nodes (22): RevisionSettings, PlainObject, RedactableConfig, RedactionForms, SecretForm, TextPattern, fieldKinds, Needs (+14 more)

### Community 84 - "core-block-commit.test.ts"
Cohesion: 0.11
Nodes (22): Commit, blockHeaderOf(), checkParent(), commitBlock(), hex(), ledgerVersionOf(), sameBytes(), writeBlockRow() (+14 more)

### Community 85 - "chain-events-source.test.ts"
Cohesion: 0.09
Nodes (16): NodeCallOptions, ConnectSocket, RecordingClient, isBlockEventSource(), in8Methods(), outsideIn8(), quietConnect(), setUp() (+8 more)

### Community 86 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+14 more)

### Community 88 - "5. Runner"
Cohesion: 0.16
Nodes (27): Callback, ParallelPoint, PointSchedule, LoopEnd, SilentHalt, CoreStopsFirst, boundaryModules(), dispatch() (+19 more)

### Community 9 - "ingest-crash.test.ts"
Cohesion: 0.04
Nodes (100): BlockHeader, Scenario, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded (+92 more)

### Community 90 - "height-versioned.property.test.ts"
Cohesion: 0.13
Nodes (20): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Key, Model (+12 more)

### Community 91 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.12
Nodes (24): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+16 more)

### Community 92 - "version-checks.ts"
Cohesion: 0.19
Nodes (21): CountingNode, Walk, Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked() (+13 more)

### Community 93 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 94 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 95 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.12
Nodes (16): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), isRegularFile(), packageType(), typeCheckFile() (+8 more)

### Community 98 - "private/backends.ts"
Cohesion: 0.12
Nodes (18): PrivateBackend, SessionSeen, A112Observation, Wiring, pgliteBackend(), a146HashProblems(), a146RefusalProblems(), optedOutProblems() (+10 more)

### Community 99 - "crash.test.ts"
Cohesion: 0.13
Nodes (21): CrashCall, CrashEvent, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule(), hex() (+13 more)

### Community 100 - "address"
Cohesion: 0.09
Nodes (23): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md` (+15 more)

### Community 133 - "ref_node_url"
Cohesion: 0.12
Nodes (10): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli (+2 more)

### Community 138 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 141 - "pg"
Cohesion: 0.15
Nodes (12): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 2. Node-side query correlation (+4 more)

### Community 157 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 160 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value (+3 more)

### Community 164 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 166 - "001_chain_archive_core.ts"
Cohesion: 0.24
Nodes (9): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, Revision history, v2 — 2026-07-22, revised in response to a 3-reviewer design-council audit (Fable 5 / Opus / GPT-5.6 Sol), v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol) (+1 more)

### Community 168 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 194 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 226 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 241 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 44 - "T"
Cohesion: 0.03
Nodes (61): T(), 1. TemporalKV — event-sourced right action with a CAS guard, ADDED Requirements, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+53 more)

### Community 65 - "version"
Cohesion: 0.05
Nodes (38): version(), 1. The invariant: the cursor is never ahead of its data, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay, 5.1 Layer A: per-key temporal history (+30 more)

### Community 71 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 96 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.08
Nodes (24): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1** (+16 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0, Requirement: the baseline reflects the batched (shipped) save shape (+17 more)

### Community 110 - "ROADMAP.md"
Cohesion: 0.10
Nodes (16): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+8 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 113 - "package.json"
Cohesion: 0.10
Nodes (20): bin, umbradb, description, exports, files, homepage, license, main (+12 more)

### Community 115 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 119 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 122 - "Full-Chain Storage — Design"
Cohesion: 0.11
Nodes (17): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+9 more)

### Community 123 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.11
Nodes (18): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+10 more)

### Community 125 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 128 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 129 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 132 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 134 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+7 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 136 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 137 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 140 - "README.md"
Cohesion: 0.24
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 142 - "UmbraDB module guide"
Cohesion: 0.14
Nodes (13): Blocks from the node, Cursor tables, Data that is not a function of the chain, Migrations, Private modules, Reading through `db`, Start and stop heights, Stored values and digests (+5 more)

### Community 144 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 145 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 146 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 148 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 153 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 155 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 156 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.17
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 158 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.15
Nodes (10): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why, 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change) (+2 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 162 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 163 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 165 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 167 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 169 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 170 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 171 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 172 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 173 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 174 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 175 - "UmbraDB"
Cohesion: 0.20
Nodes (10): Contents, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB, Verification: what is proved, checked, and tested (+2 more)

### Community 177 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.22
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 178 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 179 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 180 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.22
Nodes (9): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 8. Test infrastructure (open decision — resolve in Task 1) (+1 more)

### Community 181 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 182 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 183 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 185 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 186 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 187 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 188 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 190 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 191 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 192 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 193 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 195 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 196 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.29
Nodes (5): 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 197 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 198 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 199 - "Global Constraints"
Cohesion: 0.29
Nodes (6): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 200 - "Security policy & threat model"
Cohesion: 0.29
Nodes (7): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 201 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 202 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.29
Nodes (6): 14. External claims and their evidence, 15. Relation to the existing design documents, 9.1 Backups (BK; Q83, Q85), 9.2 Browser build (BR), 9. Backups and browser, Design — CORE-ARCH: the standalone indexer's core architecture

### Community 203 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.29
Nodes (6): 13. Contract data, 15. Backups, 16. Browser, 18. Whole-system faults, differentials and measurements, 19. Close-out, Tasks — CORE-ARCH: the standalone indexer's core architecture

### Community 204 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 205 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 206 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 207 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 211 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 212 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 213 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 214 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 215 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 216 - "5. Recommended candidate model"
Cohesion: 0.33
Nodes (6): 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

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

### Community 221 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 222 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 223 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 224 - "Performance — design"
Cohesion: 0.33
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 225 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 227 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 228 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 229 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 230 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 231 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 232 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 233 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 234 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 235 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 236 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 237 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 238 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 239 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 240 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 242 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 243 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 244 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 245 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 246 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 247 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 248 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 249 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 250 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 254 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 64 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 67 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 76 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races (+22 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+21 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

## Knowledge Gaps
- **47 isolated node(s):** `RFC-8949`, `RFC-8949`, `RFC-8949`, `RFC-8949`, `RFC-3339` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3021 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionLeaseLayer`, `src/index.ts`, `ValidationError`, `PgTransactionHistoryStorage`, `db/migrate.ts`, `UmbraError`, `createClient`, `ref_node_crypto`, `ingest-crash.test.ts`, `change-capture.ts`, `writer-lock-checks.ts`, `translatePostgresError`, `opt-out.test.ts`, `chain-events-decode.test.ts`, `NodeClient`, `halts.test.ts`, `api-server.test.ts`, `admin-harness.ts`, `tape/index.ts`, `process-admin.ts`, `config-check.ts`, `node/client.test.ts`, `describeNodeStoreExports`, `chain-placement.test.ts`, `status-schema.test.ts`, `runner/process.ts`, `record-and-replay.test.ts`, `api.ts`, `PointName`, `.value`, `declaration.ts`, `transform-checks.ts`, `crash-worker.ts`, `lifecycle.test.ts`, `adapter-core.test.ts`, `module-api.test.ts`, `history.test.ts`, `loop.test.ts`, `adapter-fixtures.ts`, `loop.ts`, `column-rules.test.ts`, `boundary.test.ts`, `ref_node_fs`, `zero-timeouts-checks.ts`, `order.property.test.ts`, `InMemoryBlockSource`, `entries.ts`, `chain-process.test.ts`, `core-settings.ts`, `validate.test.ts`, `post-block-update-checks.ts`, `cbor.property.test.ts`, `networks.ts`, `plain-data.ts`, `format.test.ts`, `core-private-source.test.ts`, `redact.ts`, `core-block-commit.test.ts`, `chain-events-source.test.ts`, `checks.test.ts`, `height-versioned.property.test.ts`, `chain-archive-replay-decode.integration.test.ts`, `version-checks.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `Tasks — v1.0.0-infosec-signoff`, `private/backends.ts`, `crash.test.ts`, `intake.test.ts`, `containers.test.ts`, `process.test.ts`, `version.negative-control.test.ts`, `block-fetch-decode.test.ts`, `package.json`, `binding.test.ts`, `BlobIntegrityError`, `envelope.ts`, `ws-mutual-tls.test.ts`, `ref_node_url`, `mutation-per-adapter.mjs`, `midnight-env — reproducible PREPROD dev environment`, `excluded-not-exported.test.ts`, `facade-merge-loader.ts`, `history.property.test.ts`, `postgres-image.test.ts`, `vendored-ledger-files.test.ts`?**
  _High betweenness centrality (0.288) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-8949`, `RFC-8949` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionLeaseLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.01355610854366631 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `db/migrate.ts`, `vitest`, `ingest-crash.test.ts`, `change-capture.ts`, `writer-lock-checks.ts`, `checkShape`, `opt-out.test.ts`, `NodeClient`, `halts.test.ts`, `api-server.test.ts`, `process-admin.ts`, `config-check.ts`, `node/client.test.ts`, `chain-placement.test.ts`, `status-schema.test.ts`, `runner/process.ts`, `NodeBlockSource`, `api.ts`, `PointName`, `declaration.ts`, `FinalizedLoop`, `transform-checks.ts`, `lifecycle.test.ts`, `config/history.ts`, `module-api.test.ts`, `history.test.ts`, `loop.test.ts`, `loop.ts`, `ref_node_fs`, `zero-timeouts-checks.ts`, `LedgerPackage`, `InMemoryBlockSource`, `graph.ts`, `entries.ts`, `cbor.ts`, `chain-process.test.ts`, `validate.ts`, `core-settings.ts`, `replay-check.ts`, `validate.test.ts`, `ProcessContexts`, `core-private-source.ts`, `plain-data.ts`, `core-private-source.test.ts`, `core-block-commit.test.ts`, `chain-events-source.test.ts`, `checks.test.ts`, `version-checks.ts`, `mapping.ts`, `process.test.ts`, `ledger/metadata.ts`, `version.negative-control.test.ts`, `version-table.ts`, `envelope.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02364943194991885 - nodes in this community are weakly interconnected._