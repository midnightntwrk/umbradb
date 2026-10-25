# Graph Report - UmbraDB

## Corpus Check
- 493 files · ~793,292 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 53 file(s) not represented in the graph (top: .lean 25, (none) 13, .patch 8)

## Summary
- 4829 nodes · 11230 edges · 244 communities (228 shown, 16 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 1931 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `629eb5e25a3ceaaa` (493 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionLeaseLayer
- validation.ts
- TransactionHandle
- ws-mutual-tls.test.ts
- load-under-prune.integration.test.ts
- chain-archive-rollover.ts
- barrel-resolves.test.ts
- IndexerClient
- PgTransactionHistoryStorage
- ref_node_crypto
- component-table.test.ts
- cbor.ts
- gc.ts
- Reader
- roles.ts
- column-rules.ts
- read-height.property.test.ts
- storage-errors.ts
- column-rules.test.ts
- sqlite-writer-lock.test.ts
- mutation-evidence.d.mts
- setup.ts
- translatePostgresError
- UmbraError
- harness.ts
- zero-timeouts-checks.ts
- postgres/chain-archive-store.ts
- checkShape
- graph.ts
- sync-service.ts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- postgres/migrate.ts
- postgres/transaction-lease.ts
- interfaces/transaction-history-storage.ts
- cursor-durability.crash.test.ts
- cbor.property.test.ts
- ref_node_fs
- graph.test.ts
- db/migrate.ts
- resolveTransaction
- saveAndAdvance
- chain-archive-sync-retry.integration.test.ts
- cold-boot-recovery.integration.test.ts
- TransactionHistoryEntry
- differential-equivalence.test.ts
- mapping.ts
- catalog.ts
- src/index.ts
- ValidationError
- writer-lock-checks.ts
- check-required-tests.ts
- pg-tx-history-adapter.ts
- vitest
- describeNodeStoreExports
- writer-lock.test.ts
- runMigrations
- What changes — the 1.0.0 gate items this change addresses
- full-sync-soak.integration.test.ts
- api.ts
- chain-archive-replay-decode.integration.test.ts
- postgres.ts
- TransactionPoolerDetectedError
- pglite-writer.worker.ts
- contents-hash.ts
- module-tables.ts
- postgres-image.test.ts
- db/migrate.test.ts
- pg-kill-save.crash.test.ts
- source-scan.ts
- NodeRpcClient
- postgres/checkpoint-store.ts
- postgres/transaction-history-storage.ts
- node-format.ts
- UmbraDBConnectionOptions
- mutation-per-adapter.mjs
- migrations
- transaction-history-storage.test.ts
- facade-merge-loader.ts
- scoped-review-manifest
- 001_chain_archive_core.ts
- chain_archive lineage
- pack-install.mjs
- midnight-env — reproducible PREPROD dev environment
- .database
- cursor
- fresh-instance.mjs
- ADDED Requirements
- graph.py
- context
- createClient
- boundary.test.ts
- vendored-ledger-v9.test.ts
- T
- ROADMAP.md
- UmbraDB V1.0.0 Implementation Guideline
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Roadmap
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- README.md
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- 3. Proof-blocking findings
- Design — CORE-ARCH: the standalone indexer's core architecture
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Design — Postgres+JSONB storage rebuild
- Full-Chain Storage — Design
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB third-party component inventory (SBOM)
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- 3. Live-node/indexer confirmation
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- 4. Schema design
- UmbraDB 1.0.0 Release Contracts
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Global Constraints
- Storage Algebra Lean M3a Watermarks Sprint
- Security policy & threat model
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- 3. Adapter seam (Pg-only for its own tier — required gate)
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 5. Recommended candidate model
- Design — Sprint 1: project setup + TemporalKV
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — v1.0.0-perf-baseline
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-perf-baseline
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- bug-report.md
- feature-request.md
- Acceptance criteria — v1.0.0-perf-baseline
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data
- GC architecture and query-tracing: research findings
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- Requirement: CF-3 Every entry is validated at startup
- Requirement: DB-11 Exactly one writer per database
- Requirement: DB-15 Timeouts by connection role
- Requirement: DB-2 A read handle sees one committed height
- Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence
- Spec — capability `formal-completion`
- renovate.json
- Vendored ledger builds
- Environment changelog
- start-stack.sh
- Requirement: DB-7 Cross-module functions are owned by the provider
- repository
- run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
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
- Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB software supply-chain directory
- ADDED Requirements
- ADDED Requirements
- package.json
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- Algebraic Specification of the midnight-pg-store Storage Layer
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 128 edges
2. `UmbraError` - 95 edges
3. `PgTransactionLeaseLayer` - 93 edges
4. `PgCheckpointStore` - 87 edges
5. `ValidationError` - 87 edges
6. `runMigrations()` - 86 edges
7. `translatePostgresError()` - 78 edges
8. `createClient()` - 74 edges
9. `UmbraDBSql` - 72 edges
10. `TransactionHandle` - 70 edges

## Surprising Connections (you probably didn't know these)
- `What changes` --references--> `PgCheckpointStore`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/proposal.md → src/postgres/checkpoint-store.ts
- `4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`)` --references--> `CheckpointStore`  [INFERRED]
  design/full-chain-storage-design.md → src/interfaces/checkpoint-store.ts
- `6. Backup/restore guidance` --references--> `CheckpointStore`  [INFERRED]
  docs/CONTRACT.md → src/interfaces/checkpoint-store.ts
- `Scope — documented preconditions vs. implemented controls (1.0.0)` --references--> `CheckpointStore`  [INFERRED]
  docs/THREAT_MODEL.md → src/interfaces/checkpoint-store.ts
- `6. On not adding a Merkle/authenticated data structure` --references--> `CheckpointStore`  [INFERRED]
  Formal/STORAGE_ALGEBRA.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (244 total, 16 thin omitted)

### Community 0 - "PgTransactionLeaseLayer"
Cohesion: 0.04
Nodes (62): PgCheckpointStore, UmbraDBSql, PgTransactionLeaseLayer, PgWatermarks, WatermarkRow, Adapters, Adapters, Method (+54 more)

### Community 1 - "validation.ts"
Cohesion: 0.04
Nodes (68): BlockWriteHandle, ReadHandle, SchemaWriteHandle, ApiRegistry, BlockContext, BlockHeader, FieldKind, FieldSchema (+60 more)

### Community 10 - "TransactionHandle"
Cohesion: 0.05
Nodes (42): CheckpointStore, TemporalKV, TransactionHistoryReader, TransactionHistoryWriter, TransactionHandle, Watermarks, 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`), 9. Module → module mapping (source of truth for `tasks.md`) (+34 more)

### Community 101 - "ws-mutual-tls.test.ts"
Cohesion: 0.19
Nodes (11): Attempt, connect(), file(), makeCa(), makeLeaf(), openssl(), read(), tlsClientErrors (+3 more)

### Community 107 - "load-under-prune.integration.test.ts"
Cohesion: 0.15
Nodes (12): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), runUnSnapshottedReadUnderPrune(), seedCheckpoints() (+4 more)

### Community 108 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 11 - "barrel-resolves.test.ts"
Cohesion: 0.06
Nodes (49): CheckpointNotFoundError, CheckpointStoreError, ChunkIntegrityError, ChunkMissingError, ManifestCorruptError, SerializationFailedError, TransactionKeyReuseError, TransactionRolledBackError (+41 more)

### Community 114 - "IndexerClient"
Cohesion: 0.22
Nodes (4): IndexerClient, IndexerClientError, IndexerClientParseError, IndexerTransaction

### Community 12 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (49): TransactionHistoryStorage, PgTransactionHistoryStorage, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation), Build (one product module + one thin envelope — corrected from the original "exactly two things, zero new code" framing; see finding below) (+41 more)

### Community 120 - "ref_node_crypto"
Cohesion: 0.18
Nodes (10): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, runInFreshInstance(), fixtures, packages (+2 more)

### Community 121 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 13 - "cbor.ts"
Cohesion: 0.08
Nodes (45): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+37 more)

### Community 131 - "gc.ts"
Cohesion: 0.24
Nodes (10): GcCurve, GcPoint, GcScaleOpts, adjudicate(), measureGcPass(), populateChunks(), runGcScale(), ENVELOPE_MAX_CHUNKS (+2 more)

### Community 138 - "Reader"
Cohesion: 0.36
Nodes (5): Reader, decodeChild(), decodeChildren(), readChild(), readChildList()

### Community 14 - "roles.ts"
Cohesion: 0.07
Nodes (39): MigrationPart, Difference, OwnPart, PlannedSchema, Provision, QualifiedTable, SchemaMigration, SchemaModule (+31 more)

### Community 15 - "column-rules.ts"
Cohesion: 0.05
Nodes (51): AllowedRule, DesignRow, PlacedRefusal, RefusalOptions, RefusedRule, RelationFacts, RuleBase, Token (+43 more)

### Community 16 - "read-height.property.test.ts"
Cohesion: 0.06
Nodes (29): TestBackend, TestDatabase, Case, HeldRead, Job, Outcome, Reads, Step (+21 more)

### Community 17 - "storage-errors.ts"
Cohesion: 0.08
Nodes (41): Retryability, EnvelopeCorruptError, EnvelopeVersionUnsupportedError, WalletStateEnvelope, WalletStateEnvelopeError, PgWalletStateEnvelopeStore, Row, decode() (+33 more)

### Community 18 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (31): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+23 more)

### Community 183 - "sqlite-writer-lock.test.ts"
Cohesion: 0.29
Nodes (3): LockResult, kill(), children

### Community 184 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 19 - "setup.ts"
Cohesion: 0.06
Nodes (47): Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount() (+39 more)

### Community 2 - "translatePostgresError"
Cohesion: 0.04
Nodes (85): ConnectionError, StorageError, TransactionFaultError, ClockRegressionError, ExclusionViolationError, PgDriverError, UnrecognizedPostgresError, withAbort() (+77 more)

### Community 20 - "UmbraError"
Cohesion: 0.08
Nodes (27): MultiStatementRunner, Job, JobQueue, Outcome, PgliteDatabase, ServerErrorFields, UmbraError, pgliteNeedsDevelopmentOptIn() (+19 more)

### Community 21 - "harness.ts"
Cohesion: 0.12
Nodes (36): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, HotRatio (+28 more)

### Community 22 - "zero-timeouts-checks.ts"
Cohesion: 0.08
Nodes (31): Run, Job, WorkerEvent, Outcome, openBlockWrites(), expectNeverCutOffNorHung(), settings(), idleBlock() (+23 more)

### Community 23 - "postgres/chain-archive-store.ts"
Cohesion: 0.10
Nodes (27): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+19 more)

### Community 24 - "checkShape"
Cohesion: 0.07
Nodes (37): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), insert() (+29 more)

### Community 25 - "graph.ts"
Cohesion: 0.08
Nodes (44): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, HeightRange, MidChain, Missing (+36 more)

### Community 26 - "sync-service.ts"
Cohesion: 0.08
Nodes (21): IndexerBlock, IndexerClientOptions, NodeRpcClientOptions, ChainArchiveSyncService, ChainArchiveSyncServiceOptions, SyncOnceResult, ChainArchiveStore, extrinsicsBytes() (+13 more)

### Community 27 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (35): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+27 more)

### Community 29 - "postgres/migrate.ts"
Cohesion: 0.08
Nodes (22): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit() (+14 more)

### Community 3 - "postgres/transaction-lease.ts"
Cohesion: 0.04
Nodes (77): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionLeaseError, HeldLease, ApplicationError (+69 more)

### Community 31 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.06
Nodes (35): EntryContent, Command, ReplayableStorage, hasPostgresUnsafeText(), jsonValueHasUnsafeText(), applyCommand(), replay(), CheckpointIdSchema (+27 more)

### Community 32 - "cursor-durability.crash.test.ts"
Cohesion: 0.07
Nodes (30): BatchSpec, CurrentState, InvariantResult, CrashWorkerHandle, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs() (+22 more)

### Community 35 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (34): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+26 more)

### Community 37 - "ref_node_fs"
Cohesion: 0.09
Nodes (16): Lockfile, Manifest, Upstream, GuardViolation, filesUnder(), patchesOf(), patchText(), extractStringLiterals() (+8 more)

### Community 38 - "graph.test.ts"
Cohesion: 0.10
Nodes (31): GraphInput, ResolvedGraph, RefusalCase, resolveGraph(), keysModule(), contractLogs(), declaration(), blockAt() (+23 more)

### Community 4 - "db/migrate.ts"
Cohesion: 0.05
Nodes (67): Transaction, AppliedMigration, AppliedRow, Runnable, StartupInput, SchemaPlan, BlockWrites, Point (+59 more)

### Community 40 - "resolveTransaction"
Cohesion: 0.08
Nodes (31): TransactionHandleInvalidError, registerTransaction(), resolveTransaction(), unregisterTransaction(), 2. The transaction-handle registry (the one new design decision this sprint makes), ADDED Requirements, MODIFIED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored (+23 more)

### Community 42 - "saveAndAdvance"
Cohesion: 0.09
Nodes (30): CoTxCallable, CoTxPauseInfo, CrashHook, saveAndAdvance(), describeCaughtError(), main(), observeClientPauseBeforeCursor(), pauseThenResume() (+22 more)

### Community 43 - "chain-archive-sync-retry.integration.test.ts"
Cohesion: 0.13
Nodes (15): FakeChainBlock, BlockRow, TxRow, bootstrapChainArchiveSchema(), fakeChain(), fakeIndexerFetch(), fakeNodeFetch(), hx() (+7 more)

### Community 44 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.13
Nodes (26): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+18 more)

### Community 45 - "TransactionHistoryEntry"
Cohesion: 0.11
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), `transaction_history`, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 47 - "differential-equivalence.test.ts"
Cohesion: 0.12
Nodes (26): CurrentState, Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1() (+18 more)

### Community 48 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 49 - "catalog.ts"
Cohesion: 0.12
Nodes (27): CatalogColumn, CatalogTable, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference, TableFacts (+19 more)

### Community 5 - "src/index.ts"
Cohesion: 0.06
Nodes (69): CheckpointStoreErrorCode, HistoryOptions, SharedStorageErrorCode, AsOf, AssertExact, HistoryUnavailableError, JsonValue, Key (+61 more)

### Community 52 - "ValidationError"
Cohesion: 0.10
Nodes (24): ValidationError, Requirement: prune rejects a retainCount that is not a positive safe integer, before any deletion runs, Requirement: save rejects invalid options with ValidationError before any chunking or hashing work, Scenario: A chunkSize above the schema's 16 MiB bound is rejected with no work done, Scenario: A non-integer or non-finite retainCount is rejected with no effect, Scenario: An integer retainCount outside the safe integer range is rejected with no effect, Scenario: retainCount of zero is rejected with no effect, Requirement: set rejects a top-level null value with ValidationError before any statement (+16 more)

### Community 53 - "writer-lock-checks.ts"
Cohesion: 0.15
Nodes (22): WriterProcess, WorkerEvent, PauseReport, blocksIn(), cleanUp(), firstOf(), startWriterProcess(), workDirectory() (+14 more)

### Community 54 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 57 - "pg-tx-history-adapter.ts"
Cohesion: 0.12
Nodes (21): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+13 more)

### Community 6 - "vitest"
Cohesion: 0.04
Nodes (46): CommittedHeight, Database, PgliteOptions, PostgresOptions, Settings, LoadOutcome, OutsideRead, Traced (+38 more)

### Community 61 - "describeNodeStoreExports"
Cohesion: 0.16
Nodes (12): NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), 12. Ledger, 5.1 The `LedgerPackage` interface (LG-6), 5.2 Vendored builds (LG-5), 5.3 The ledger worker and the node-store bridge (LG-10, LG-11), 5.4 Storage, retention and sweep (LG-11 to LG-14) (+4 more)

### Community 63 - "writer-lock.test.ts"
Cohesion: 0.18
Nodes (16): PostgresTestDatabase, startWriter(), opened(), loginOn(), expectLockLostWhenTakenMeanwhile(), expectLockRetakenAfterTermination(), expectSecondPostgresWriterRefused(), lockReleased() (+8 more)

### Community 65 - "runMigrations"
Cohesion: 0.14
Nodes (23): DurabilityContractError, runMigrations(), 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 3. `synchronous_commit` — probe-warned, never refused, 4. Session-mode connection pooling only — probe-enforced (best-effort), 5. Server-side timeouts — applied by `createClient` (documented), Summary (+15 more)

### Community 66 - "What changes — the 1.0.0 gate items this change addresses"
Cohesion: 0.16
Nodes (16): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+8 more)

### Community 67 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (11): CurrentState, GcPass, HistGroup, SampleObservation, kvMapKey(), readCurrentState(), { connectionUri }, DECLARED_ENVELOPE (+3 more)

### Community 68 - "api.ts"
Cohesion: 0.12
Nodes (13): ReadOnlyDatabase, ReadOptions, OffersReadOnly, readOnlyDatabase(), block(), namesOf(), prototypesOf(), readOnlyProblems() (+5 more)

### Community 69 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.15
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+12 more)

### Community 7 - "postgres.ts"
Cohesion: 0.06
Nodes (44): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, ReadTimeoutSetting, BoundedRead, DriverError, Outcome (+36 more)

### Community 71 - "TransactionPoolerDetectedError"
Cohesion: 0.10
Nodes (19): TransactionPoolerDetectedError, MigrationLockTimeoutError, Audit (round 1) — the confirmation-bias control paid off, Reconciliation rationale (why 24, not the design's earlier 21), 1. The twenty gate items, Benchmarks, Compatibility, and what 1.0.0 needs, Durability (+11 more)

### Community 75 - "pglite-writer.worker.ts"
Cohesion: 0.17
Nodes (15): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), main() (+7 more)

### Community 77 - "contents-hash.ts"
Cohesion: 0.16
Nodes (15): ModuleColumn, PageOptions, ColumnType, contentsHash(), encodeTableRow(), renderKeyValue(), countRows(), fromClause() (+7 more)

### Community 8 - "module-tables.ts"
Cohesion: 0.06
Nodes (37): ModuleContentsError, ModuleContentsFailure, ModuleTable, ConsistentRead, RefusalCode, RefusalPlace, DeterminismBackend, TestDatabase (+29 more)

### Community 80 - "postgres-image.test.ts"
Cohesion: 0.11
Nodes (17): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), check, checker, env, forwarded (+9 more)

### Community 81 - "db/migrate.test.ts"
Cohesion: 0.15
Nodes (14): SchemaItem, MigrationRow, PartOptions, TestPart, exists(), halfFailedViolations(), migrationRows(), owner() (+6 more)

### Community 82 - "pg-kill-save.crash.test.ts"
Cohesion: 0.13
Nodes (17): C5AnyFn, assertSaveNotAutoRetriedUnderRetriableFault(), assertSaveNotInAnyAutoRetryAllowlist(), completeManifestCount(), completeManifestCountAtSeq(), danglingChunkCount(), listSrcTsFiles(), makeSerializationFaultInjectingClient() (+9 more)

### Community 83 - "source-scan.ts"
Cohesion: 0.20
Nodes (17): ModuleReference, boundaryViolations(), codeFingerprints(), declaredNames(), eachNode(), isInside(), lineOf(), literalText() (+9 more)

### Community 87 - "NodeRpcClient"
Cohesion: 0.18
Nodes (6): NodeRpcClient, NodeRpcError, NodeRpcInvalidHeightError, NodeRpcParseError, SubstrateBlock, SubstrateHeader

### Community 9 - "postgres/checkpoint-store.ts"
Cohesion: 0.06
Nodes (51): CheckpointRecord, CheckpointSequence, CheckpointSummary, ContentHash, PruneResult, SaveCheckpointOptions, AggregateRow, ChunkJoinRow (+43 more)

### Community 94 - "postgres/transaction-history-storage.ts"
Cohesion: 0.21
Nodes (15): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+7 more)

### Community 95 - "node-format.ts"
Cohesion: 0.25
Nodes (14): Child, Disposable, childKey(), concat(), encodeChild(), encodeChildren(), hasEmbeddedChild(), nodeKey() (+6 more)

### Community 99 - "UmbraDBConnectionOptions"
Cohesion: 0.14
Nodes (14): UmbraDBConnectionOptions, Acceptance — v1.0.0-durable-checkpoint-cursor, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, Whole-change gates (non-goal compliance + sequencing), Requirement: the UmbraDB connection sets bounded server-side timeouts by default, Scenario: a caller can override each timeout default, Scenario: a raised idle-in-transaction default is honoured for a long in-transaction workload (+6 more)

### Community 106 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 115 - "migrations"
Cohesion: 0.15
Nodes (12): migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), Data that is not a function of the chain, Migrations, Reading through `db`, Time values, UmbraDB module guide, Upgrades (+4 more)

### Community 128 - "transaction-history-storage.test.ts"
Cohesion: 0.18
Nodes (7): decodeSerializedContent(), decodeSerializedEntry(), store(), txLayer(), THS_RESERVED_KEY_PREFIX, FAKE_TX, { sql: getSql }

### Community 129 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 132 - "scoped-review-manifest"
Cohesion: 0.20
Nodes (10): explain(), explainRefusal(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation (+2 more)

### Community 133 - "001_chain_archive_core.ts"
Cohesion: 0.24
Nodes (9): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, Revision history, v2 — 2026-07-22, revised in response to a 3-reviewer design-council audit (Fable 5 / Opus / GPT-5.6 Sol), v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol) (+1 more)

### Community 134 - "chain_archive lineage"
Cohesion: 0.18
Nodes (10): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, How the two lineages coexist, Table of contents, `transactions` (chain_archive) (+2 more)

### Community 139 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 144 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.22
Nodes (9): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS) (+1 more)

### Community 175 - ".database"
Cohesion: 0.33
Nodes (6): 4. Configuration, 14. External claims and their evidence, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-9 The development opt-in gates development-only features, Scenario: A secret never appears, Scenario: PGlite without the opt-in

### Community 189 - "cursor"
Cohesion: 0.33
Nodes (6): cursor(), 8. Admin endpoints, Requirement: AE-5 `/status` and `/config` contents, Scenario: Before the first block, Requirement: PP-4 The process transport, Scenario: A read through the core

### Community 198 - "fresh-instance.mjs"
Cohesion: 0.40
Nodes (4): hex(), requested, store, stored

### Community 30 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data responses name their view and height (+30 more)

### Community 33 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 39 - "context"
Cohesion: 0.07
Nodes (22): schemaName(), module(), context(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 59 - "createClient"
Cohesion: 0.11
Nodes (22): overridingUrlParameter(), assertNoConflictingSearchPath(), createClient(), pool(), class2AdvisoryLockCountForHash(), pollForLockGone(), pool(), sleep() (+14 more)

### Community 64 - "boundary.test.ts"
Cohesion: 0.16
Nodes (18): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+10 more)

### Community 70 - "vendored-ledger-v9.test.ts"
Cohesion: 0.23
Nodes (18): bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex(), nodesOf() (+10 more)

### Community 91 - "T"
Cohesion: 0.14
Nodes (16): T(), 4. Law-by-law repair map, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, Scenario: Version and timestamp addressing agree, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error (+8 more)

### Community 100 - "ROADMAP.md"
Cohesion: 0.13
Nodes (10): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+2 more)

### Community 102 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.13
Nodes (15): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N) (+7 more)

### Community 103 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (14): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+6 more)

### Community 104 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.13
Nodes (14): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4, 2. G9 — the four crash tests, 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12) (+6 more)

### Community 105 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception (+5 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 111 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 112 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 113 - "Roadmap"
Cohesion: 0.14
Nodes (14): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+6 more)

### Community 116 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 119 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.15
Nodes (12): 0. Package layout, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire, 3. G7 — Server-side timeouts, 5.1 Archival reconciliation note (Opus N6), 5. Boundaries and non-goals respected, 6.1 The Fable-vs-Opus factual dispute (resolved by live test), 6.2 Blocking findings applied (+4 more)

### Community 122 - "README.md"
Cohesion: 0.30
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 123 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.17
Nodes (10): 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, UmbraDB v0.9.5 "Penumbra" — Release Record, UmbraDB v1.0.0 — Release Record (PENDING) (+2 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 126 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 127 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 130 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 135 - "3. Proof-blocking findings"
Cohesion: 0.18
Nodes (11): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption (+3 more)

### Community 136 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.18
Nodes (10): 10. Tables, 11. Refusals and halts (IN-12), 15. Relation to the existing design documents, 3. Block source and ingest, 7. Configuration, 8. Private processes (PP), 9.1 Backups (BK; Q83, Q85), 9.2 Browser build (BR) (+2 more)

### Community 137 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 140 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.20
Nodes (10): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 7. Driver / toolkit choice (+2 more)

### Community 141 - "Full-Chain Storage — Design"
Cohesion: 0.20
Nodes (9): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 6. Reorg / rollback handling — summary, 7. The data categories — explicit judgment calls (revised), 8. Migration, 9. Generalizing the verifiable-snapshot L0–L3 layers to full-chain-archive snapshots (+1 more)

### Community 142 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 143 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 145 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.20
Nodes (9): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 4. Live preprod DB-sync verification (nightly/labeled), 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding), 7. Testing strategy (post-implementation) (+1 more)

### Community 146 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 147 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 148 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 149 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 150 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 151 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 152 - "3. Live-node/indexer confirmation"
Cohesion: 0.22
Nodes (9): 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs, 3.5 Dust generation + ledger events (generic), 3.6 Contract state/actions — confirmed absent, not confirmed present, 3.7 Governance / bridge, 3.8 SPO/staking (+1 more)

### Community 153 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 154 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 155 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 156 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 157 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 158 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 159 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 160 - "4. Schema design"
Cohesion: 0.25
Nodes (8): 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy, 4. Schema design, v4 rewrite — the rollover runbook, rebuilt from four reproduced failures, run end-to-end for real

### Community 161 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.25
Nodes (8): 1. Durability contract, 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 162 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 163 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 164 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 165 - "Security policy & threat model"
Cohesion: 0.25
Nodes (8): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 166 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 167 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 168 - "3. Adapter seam (Pg-only for its own tier — required gate)"
Cohesion: 0.25
Nodes (7): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 3. Adapter seam (Pg-only for its own tier — required gate), 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 169 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 170 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 171 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 172 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 173 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 174 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.29
Nodes (6): 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV

### Community 176 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 177 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 178 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.29
Nodes (6): 1. G13 — perf-correctness fixes (LAND FIRST), 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 179 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 180 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 181 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 182 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 185 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 186 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 187 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 188 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 190 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 191 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 192 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 193 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 194 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 195 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, Why

### Community 196 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 197 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 199 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 200 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 201 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 202 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 203 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 204 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 205 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 206 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.40
Nodes (4): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Problem, Resolution, Suggested fix

### Community 207 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 208 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.40
Nodes (4): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Suggested fix

### Community 209 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 210 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 211 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.40
Nodes (4): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first), G14 — benchmark harness + recorded baseline

### Community 212 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 213 - "Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data"
Cohesion: 0.40
Nodes (5): Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data, Scenario: replay from the durable cursor converges on current state, Scenario: the durable watermark is never ahead of durable data, Scenario: the invariant holds under synchronous_commit = off, Scenario: the invariant holds under synchronous_commit = on

### Community 214 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 215 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 216 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 217 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 218 - "Requirement: CF-3 Every entry is validated at startup"
Cohesion: 0.50
Nodes (4): Requirement: CF-3 Every entry is validated at startup, Scenario: A wrong type, Scenario: An upgrade that renames a setting, Scenario: Scheduling a newer version from the current build

### Community 219 - "Requirement: DB-11 Exactly one writer per database"
Cohesion: 0.50
Nodes (4): Requirement: DB-11 Exactly one writer per database, Scenario: A crashed writer's lock is released, Scenario: A paused writer keeps its lock, Scenario: A second writer refuses

### Community 220 - "Requirement: DB-15 Timeouts by connection role"
Cohesion: 0.50
Nodes (4): Requirement: DB-15 Timeouts by connection role, Scenario: A hung API query is cut off, Scenario: A long migration is never cut off, Scenario: The writer keeps its session between blocks

### Community 221 - "Requirement: DB-2 A read handle sees one committed height"
Cohesion: 0.50
Nodes (4): Requirement: DB-2 A read handle sees one committed height, Scenario: A multi-statement read does not straddle a commit, Scenario: Large JSON integers stay distinct, Scenario: Times read the same in every time zone

### Community 222 - "Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence"
Cohesion: 0.50
Nodes (4): Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Scenario: the evidence run is not a required CI gate, Scenario: the pre-tag run resumes from the durable cursor with no resync or drift, Scenario: the run's evidence is recorded as a release artifact

### Community 223 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 224 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 225 - "Vendored ledger builds"
Cohesion: 0.50
Nodes (3): Rebuilding, Updating a version, Vendored ledger builds

### Community 228 - "Requirement: DB-7 Cross-module functions are owned by the provider"
Cohesion: 0.67
Nodes (3): Requirement: DB-7 Cross-module functions are owned by the provider, Scenario: A consumer changes the provider's table only through its function, Scenario: An unrelated module is not granted the function

### Community 229 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 28 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 34 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+30 more)

### Community 36 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+27 more)

### Community 41 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races (+26 more)

### Community 46 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: history() computes per-manifest aggregates in a single grouped query (HP-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+22 more)

### Community 50 - "Requirements"
Cohesion: 0.07
Nodes (28): Purpose, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+20 more)

### Community 51 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+19 more)

### Community 55 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 56 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form (+18 more)

### Community 58 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-1 One API over two backends, Requirement: DB-3 Writes only through a write handle, Requirement: DB-4 PGlite serializes all work in one queue (+17 more)

### Community 60 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.08
Nodes (25): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+17 more)

### Community 62 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+13 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 74 - "UmbraDB software supply-chain directory"
Cohesion: 0.10
Nodes (18): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists, 1. What SLSA v1.0 defines (+10 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A bare numeric watermark value round-trips exactly (+12 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically, Requirement: the required Postgres configuration is published as a binding Durability Contract, Requirement: withLease surfaces a lease-release failure instead of swallowing it, Scenario: a clean release is unaffected (+11 more)

### Community 79 - "package.json"
Cohesion: 0.10
Nodes (19): description, exports, files, homepage, license, main, name, type (+11 more)

### Community 84 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.11
Nodes (19): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence, Requirement: the adapter round-trips SDK lifecycle detail so getAll yields schema-valid SDK entries (+11 more)

### Community 88 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, archive:sync, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 89 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 90 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 92 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (16): 10. Node client and ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups, 16. Browser, 17. Library surface and gates (+8 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 96 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.12
Nodes (10): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside (+2 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor first, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+7 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+7 more)

## Knowledge Gaps
- **30 isolated node(s):** `./tsconfig.json`, `RFC-3339`, `RFC-8949`, `RFC-3339`, `RFC-8949` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2031 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionLeaseLayer`, `validation.ts`, `translatePostgresError`, `facade-merge-loader.ts`, `db/migrate.ts`, `src/index.ts`, `transaction-history-storage.test.ts`, `postgres.ts`, `module-tables.ts`, `postgres/transaction-lease.ts`, `barrel-resolves.test.ts`, `roles.ts`, `read-height.property.test.ts`, `storage-errors.ts`, `column-rules.test.ts`, `setup.ts`, `UmbraError`, `zero-timeouts-checks.ts`, `postgres/migrate.ts`, `interfaces/transaction-history-storage.ts`, `cursor-durability.crash.test.ts`, `cbor.property.test.ts`, `ref_node_fs`, `graph.test.ts`, `chain-archive-sync-retry.integration.test.ts`, `cold-boot-recovery.integration.test.ts`, `differential-equivalence.test.ts`, `writer-lock-checks.ts`, `check-required-tests.ts`, `sqlite-writer-lock.test.ts`, `pg-tx-history-adapter.ts`, `createClient`, `writer-lock.test.ts`, `boundary.test.ts`, `What changes — the 1.0.0 gate items this change addresses`, `full-sync-soak.integration.test.ts`, `api.ts`, `chain-archive-replay-decode.integration.test.ts`, `vendored-ledger-v9.test.ts`, `package.json`, `postgres-image.test.ts`, `db/migrate.test.ts`, `pg-kill-save.crash.test.ts`, `NodeRpcClient`, `node-format.ts`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `load-under-prune.integration.test.ts`, `IndexerClient`, `ref_node_crypto`, `component-table.test.ts`?**
  _High betweenness centrality (0.254) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `UmbraError` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`UmbraError` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `./tsconfig.json`, `RFC-3339`, `RFC-8949` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionLeaseLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.037341299477221805 - nodes in this community are weakly interconnected._
- **Why does `runMigrations()` connect `runMigrations` to `PgTransactionLeaseLayer`, `translatePostgresError`, `postgres/transaction-lease.ts`, `db/migrate.ts`, `src/index.ts`, `chain_archive lineage`, `barrel-resolves.test.ts`, `Full-Chain Storage — Design`, `storage-errors.ts`, `setup.ts`, `harness.ts`, `postgres/migrate.ts`, `cursor-durability.crash.test.ts`, `4. Schema design`, `UmbraDB 1.0.0 Release Contracts`, `ADDED Requirements`, `resolveTransaction`, `saveAndAdvance`, `chain-archive-sync-retry.integration.test.ts`, `cold-boot-recovery.integration.test.ts`, `Design — Sprint 1: project setup + TemporalKV`, `Tasks — v1.0.0-perf-baseline`, `ValidationError`, `Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)`, `What changes — the 1.0.0 gate items this change addresses`, `TransactionPoolerDetectedError`, `ADDED Requirements`, `Acceptance criteria — v1.0.0-perf-baseline`, `UmbraDBConnectionOptions`, `chain-archive-rollover.ts`, `UmbraDB`, `Design — v1.0.0-durable-checkpoint-cursor`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Should `validation.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03575757575757576 - nodes in this community are weakly interconnected._