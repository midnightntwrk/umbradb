# Graph Report - UmbraDB

## Corpus Check
- 493 files · ~798,284 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 53 file(s) not represented in the graph (top: .lean 25, (none) 13, .patch 8)

## Summary
- 4843 nodes · 11259 edges · 224 communities (207 shown, 17 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 1936 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `260ddf01257b6a81` (493 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- runMigrations
- roles.ts
- postgres.ts
- TransactionHistoryEntry
- chain-archive-sync-retry.integration.test.ts
- cbor.ts
- load-under-prune.integration.test.ts
- midnight-env — reproducible PREPROD dev environment
- writer-lock-checks.ts
- postgres-image.test.ts
- UmbraError
- ClockRegressionError
- harness.ts
- interfaces/chain-archive-store.ts
- PgTransactionHistoryStorage
- vitest
- mutation-evidence.d.mts
- module-tables.ts
- column-rules.test.ts
- boundary.test.ts
- PgTransactionLeaseLayer
- declaration.ts
- graph.ts
- column-refusals.test.ts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- zero-timeouts-checks.ts
- graph.test.ts
- cursor-durability.crash.test.ts
- api.ts
- createClient
- postgres/chain-archive-store.ts
- interfaces/transaction-history-storage.ts
- pg-tx-history-adapter.ts
- postgres/migrate.ts
- ref_node_fs
- wallet-state-envelope.test.ts
- postgres/checkpoint-store.ts
- resolveTransaction
- saveAndAdvance
- validation.ts
- differential-equivalence.test.ts
- src/index.ts
- ref_node_crypto
- mapping.ts
- 0. Pins and verification
- ValidationError
- check-required-tests.ts
- sync-service.ts
- TransactionHandle
- cbor.property.test.ts
- chain-archive-rollover.ts
- opt-out.test.ts
- column-rules.ts
- What changes — the 1.0.0 gate items this change addresses
- full-sync-soak.integration.test.ts
- db/migrate.test.ts
- chain-archive-replay-decode.integration.test.ts
- read-height.property.test.ts
- ChainArchiveStore
- pglite-timeouts.test.ts
- ws-mutual-tls.test.ts
- postgres/transaction-lease.ts
- checkShape
- postgres/transaction-history-storage.ts
- node-format.ts
- transaction-history-storage.property.test.ts
- describeNodeStoreExports
- setup.ts
- NodeRpcClient
- chain-archive-preprod-cloud-crossval.integration.test.ts
- mutation-per-adapter.mjs
- facade-merge-loader.ts
- pack-install.mjs
- lease-nonwedge.crash.test.ts
- fresh-instance.mjs
- fn
- graph.py
- table
- Requirement: DT-6 Stored data avoids non-deterministic values
- context
- cold-boot-recovery.integration.test.ts
- T
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ROADMAP.md
- UmbraDB V1.0.0 Implementation Guideline
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- devDependencies
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Roadmap
- Storage Algebra Lean M2 Retention Sprint
- Design — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- openspec-explore/SKILL.md
- 3. Proof-blocking findings
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- UmbraDB 0.9.5 "Penumbra"
- Global Constraints
- Storage Algebra Lean M3a Watermarks Sprint
- Security policy & threat model
- Roadmap for the missing formalization
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
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
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- bug-report.md
- feature-request.md
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data
- GC architecture and query-tracing: research findings
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- Test wallets
- Proposal — Sprint 2: Transaction/Lease
- 2. Schema — two corrections to `design/design.md` §3
- Acceptance criteria — v1.0.0-perf-baseline
- Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
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
- ADDED Requirements
- Design — Postgres+JSONB storage rebuild
- ADDED Requirements
- UmbraDB third-party component inventory (SBOM)
- Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Full-Chain Storage — Design
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- scripts
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record

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
10. `StorageError` - 70 edges

## Surprising Connections (you probably didn't know these)
- `4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`)` --references--> `CheckpointStore`  [INFERRED]
  design/full-chain-storage-design.md → src/interfaces/checkpoint-store.ts
- `6. Backup/restore guidance` --references--> `CheckpointStore`  [INFERRED]
  docs/CONTRACT.md → src/interfaces/checkpoint-store.ts
- `Scope — documented preconditions vs. implemented controls (1.0.0)` --references--> `CheckpointStore`  [INFERRED]
  docs/THREAT_MODEL.md → src/interfaces/checkpoint-store.ts
- `6. On not adding a Merkle/authenticated data structure` --references--> `CheckpointStore`  [INFERRED]
  Formal/STORAGE_ALGEBRA.md → src/interfaces/checkpoint-store.ts
- `6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted)` --references--> `CheckpointStore`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (224 total, 17 thin omitted)

### Community 0 - "runMigrations"
Cohesion: 0.03
Nodes (123): CheckpointStore, CheckpointStoreError, ConnectionError, Retryability, SerializationFailedError, StorageError, TemporalKVError, Rollback (+115 more)

### Community 1 - "roles.ts"
Cohesion: 0.04
Nodes (90): AppliedMigration, AppliedRow, MigrationPart, Runnable, StartupInput, Difference, PlannedSchema, Provision (+82 more)

### Community 10 - "postgres.ts"
Cohesion: 0.06
Nodes (39): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, BoundedRead, DriverError, Outcome (+31 more)

### Community 105 - "TransactionHistoryEntry"
Cohesion: 0.29
Nodes (6): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 109 - "chain-archive-sync-retry.integration.test.ts"
Cohesion: 0.20
Nodes (10): FakeChainBlock, bootstrapChainArchiveSchema(), fakeChain(), fakeIndexerFetch(), fakeNodeFetch(), hx(), newService(), MAX_BLOCKS (+2 more)

### Community 11 - "cbor.ts"
Cohesion: 0.07
Nodes (54): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+46 more)

### Community 114 - "load-under-prune.integration.test.ts"
Cohesion: 0.16
Nodes (11): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), seedCheckpoints(), sha256() (+3 more)

### Community 116 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 12 - "writer-lock-checks.ts"
Cohesion: 0.07
Nodes (40): PostgresOptions, WriterProcess, WorkerEvent, PostgresTestDatabase, PostgresTestServer, PauseReport, startWriter(), blocksIn() (+32 more)

### Community 129 - "postgres-image.test.ts"
Cohesion: 0.22
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 13 - "UmbraError"
Cohesion: 0.07
Nodes (39): Job, JobQueue, Held, PgliteLockUse, PgliteDatabase, ServerErrorFields, UmbraError, Job (+31 more)

### Community 131 - "ClockRegressionError"
Cohesion: 0.24
Nodes (8): ClockRegressionError, `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, The retryable set, 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, 1. TemporalKV — event-sourced right action with a CAS guard

### Community 14 - "harness.ts"
Cohesion: 0.09
Nodes (45): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+37 more)

### Community 146 - "interfaces/chain-archive-store.ts"
Cohesion: 0.22
Nodes (8): BlobRole, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult, VerifierKeyScope, Hex32Schema

### Community 15 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (49): TransactionHistoryStorage, PgTransactionHistoryStorage, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation), Build (one product module + one thin envelope — corrected from the original "exactly two things, zero new code" framing; see finding below) (+41 more)

### Community 16 - "vitest"
Cohesion: 0.06
Nodes (28): ReadTimeoutSetting, ModuleContentsFailure, ErrorCode, ErrorDetails, Case, mapRows(), mapValue(), parseJsonLossless() (+20 more)

### Community 169 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 17 - "module-tables.ts"
Cohesion: 0.07
Nodes (39): ModuleColumn, ModuleContentsError, ModuleTable, PageOptions, ColumnType, RefusalCode, RefusalPlace, contentsHash() (+31 more)

### Community 18 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (30): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+22 more)

### Community 19 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+34 more)

### Community 2 - "PgTransactionLeaseLayer"
Cohesion: 0.04
Nodes (64): PgCheckpointStore, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters, Method, Adapters (+56 more)

### Community 20 - "declaration.ts"
Cohesion: 0.06
Nodes (29): OwnPart, ApiRegistry, BlockContext, BlockHeader, FieldKind, FieldSchema, ItemDeclaration, ItemSink (+21 more)

### Community 21 - "graph.ts"
Cohesion: 0.09
Nodes (43): Edge, GraphPart, GraphRule, MidChain, Missing, RangeFacts, ResolvedRange, Spanned (+35 more)

### Community 22 - "column-refusals.test.ts"
Cohesion: 0.08
Nodes (20): DeterminismBackend, TestDatabase, TestServer, Backend, Case, freshDatabase(), hashOf(), hex() (+12 more)

### Community 23 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (35): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+27 more)

### Community 26 - "zero-timeouts-checks.ts"
Cohesion: 0.09
Nodes (28): Job, Outcome, openBlockWrites(), apiRead(), engine(), report(), idleBlock(), migrated() (+20 more)

### Community 28 - "graph.test.ts"
Cohesion: 0.09
Nodes (38): EntryRange, GraphInput, HeightRange, ResolvedGraph, PastFaultCase, RefusalCase, schemaPlan(), declaration() (+30 more)

### Community 29 - "cursor-durability.crash.test.ts"
Cohesion: 0.07
Nodes (30): BatchSpec, CurrentState, InvariantResult, CrashWorkerHandle, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs() (+22 more)

### Community 3 - "api.ts"
Cohesion: 0.04
Nodes (60): BlockWriteHandle, CommittedHeight, Database, ReadHandle, ReadOnlyDatabase, ReadOptions, SchemaWriteHandle, Transaction (+52 more)

### Community 31 - "createClient"
Cohesion: 0.12
Nodes (19): BenchEnv, UmbraDBSql, BlockRow, TxRow, overridingUrlParameter(), assertNoConflictingSearchPath(), createClient(), pool() (+11 more)

### Community 32 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (19): BlockBundle, BlockMeta, BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, VerifierKeyObservationRecord (+11 more)

### Community 33 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.07
Nodes (29): MergeEntriesFn, isPlainObject(), mergeSections(), referenceMergeEntries(), decodeSerializedContent(), decodeSerializedEntry(), store(), txLayer() (+21 more)

### Community 36 - "pg-tx-history-adapter.ts"
Cohesion: 0.08
Nodes (25): LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+17 more)

### Community 37 - "postgres/migrate.ts"
Cohesion: 0.09
Nodes (20): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit(), probeAdvisoryLockVisibility() (+12 more)

### Community 38 - "ref_node_fs"
Cohesion: 0.08
Nodes (20): Upstream, GuardViolation, filesUnder(), patchesOf(), patchText(), extractStringLiterals(), findChainSyncViolations(), scanDirectory() (+12 more)

### Community 39 - "wallet-state-envelope.test.ts"
Cohesion: 0.09
Nodes (28): EnvelopeCorruptError, EnvelopeVersionUnsupportedError, WalletStateEnvelope, decode(), encode(), safeNonEmptyString(), safeString(), checkpointStore() (+20 more)

### Community 4 - "postgres/checkpoint-store.ts"
Cohesion: 0.04
Nodes (75): CheckpointNotFoundError, CheckpointSummary, ChunkIntegrityError, ChunkMissingError, ManifestCorruptError, SaveCheckpointOptions, AggregateRow, ChunkJoinRow (+67 more)

### Community 40 - "resolveTransaction"
Cohesion: 0.08
Nodes (33): TransactionKeyReuseError, TransactionHandleInvalidError, resolveTransaction(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV (+25 more)

### Community 41 - "saveAndAdvance"
Cohesion: 0.08
Nodes (32): CoTxCallable, CoTxPauseInfo, CrashHook, saveAndAdvance(), describeCaughtError(), main(), observeClientPauseBeforeCursor(), pauseThenResume() (+24 more)

### Community 43 - "validation.ts"
Cohesion: 0.07
Nodes (29): DeclarationRule, DeclarationSet, Plain, Case, ShapeCase, Stats, first(), validateWith() (+21 more)

### Community 49 - "differential-equivalence.test.ts"
Cohesion: 0.12
Nodes (26): CurrentState, Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1() (+18 more)

### Community 5 - "src/index.ts"
Cohesion: 0.06
Nodes (65): CheckpointRecord, CheckpointSequence, CheckpointStoreErrorCode, ContentHash, HistoryOptions, PruneResult, SharedStorageErrorCode, AsOf (+57 more)

### Community 50 - "ref_node_crypto"
Cohesion: 0.17
Nodes (23): NodeRoot, bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex() (+15 more)

### Community 51 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 54 - "0. Pins and verification"
Cohesion: 0.11
Nodes (17): NodeStoreExports, 12. Ledger, 5.1 The `LedgerPackage` interface (LG-6), 5.2 Vendored builds (LG-5), 5.3 The ledger worker and the node-store bridge (LG-10, LG-11), 5.4 Storage, retention and sweep (LG-11 to LG-14), 5.5 Ledger tasks (LG-17, Q49), 5. Ledger (+9 more)

### Community 56 - "ValidationError"
Cohesion: 0.10
Nodes (26): ValidationError, 0. Package layout, 1. Chunking, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 6. Migration (`002_checkpoint_store.ts`), 7. Error translation — no additions to `src/postgres/errors.ts`, 9. Test infrastructure, Design — Sprint 3: CheckpointStore (+18 more)

### Community 58 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 59 - "sync-service.ts"
Cohesion: 0.14
Nodes (17): IndexerBlock, IndexerClientOptions, NodeRpcClientOptions, ChainArchiveSyncService, ChainArchiveSyncServiceOptions, SyncOnceResult, extrinsicsBytes(), headerBytes() (+9 more)

### Community 6 - "TransactionHandle"
Cohesion: 0.04
Nodes (56): TemporalKV, TransactionHistoryReader, TransactionHistoryWriter, TransactionHandle, WatermarkKey, WatermarkKind, Watermarks, WatermarkValue (+48 more)

### Community 63 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (25): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+17 more)

### Community 65 - "chain-archive-rollover.ts"
Cohesion: 0.12
Nodes (22): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+14 more)

### Community 67 - "opt-out.test.ts"
Cohesion: 0.17
Nodes (17): ModuleDeclaration, ProcessContext, GraphFacts, PlacedDeclaration, migrationPart(), schemaItem(), schemaModule(), schemaModules() (+9 more)

### Community 7 - "column-rules.ts"
Cohesion: 0.04
Nodes (79): CatalogColumn, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+71 more)

### Community 70 - "What changes — the 1.0.0 gate items this change addresses"
Cohesion: 0.16
Nodes (16): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+8 more)

### Community 72 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (11): CurrentState, GcPass, HistGroup, SampleObservation, kvMapKey(), readCurrentState(), { connectionUri }, DECLARED_ENVELOPE (+3 more)

### Community 73 - "db/migrate.test.ts"
Cohesion: 0.12
Nodes (17): MultiStatementRunner, SchemaItem, MigrationRow, PartOptions, TestPart, exists(), halfFailedViolations(), migrationRows() (+9 more)

### Community 74 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.15
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+12 more)

### Community 75 - "read-height.property.test.ts"
Cohesion: 0.13
Nodes (14): TestBackend, TestDatabase, HeldRead, Job, Outcome, Reads, Step, concurrent() (+6 more)

### Community 76 - "ChainArchiveStore"
Cohesion: 0.10
Nodes (10): ChainArchiveStore, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents, `transactions` (chain_archive) (+2 more)

### Community 78 - "pglite-timeouts.test.ts"
Cohesion: 0.11
Nodes (13): Run, WorkerEvent, LockResult, expectNeverCutOffNorHung(), settings(), kill(), children, directories (+5 more)

### Community 79 - "ws-mutual-tls.test.ts"
Cohesion: 0.12
Nodes (16): Attempt, connect(), file(), makeCa(), makeLeaf(), openssl(), read(), tlsClientErrors (+8 more)

### Community 8 - "postgres/transaction-lease.ts"
Cohesion: 0.06
Nodes (60): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionFaultError, TransactionLeaseError, TransactionOptions (+52 more)

### Community 80 - "checkShape"
Cohesion: 0.21
Nodes (12): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), Requirement: DT-2 Primary-key order (+4 more)

### Community 83 - "postgres/transaction-history-storage.ts"
Cohesion: 0.17
Nodes (16): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow() (+8 more)

### Community 84 - "node-format.ts"
Cohesion: 0.23
Nodes (14): Reader, childKey(), concat(), decodeChild(), decodeChildren(), encodeChild(), encodeChildren(), nodeKey() (+6 more)

### Community 86 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 89 - "describeNodeStoreExports"
Cohesion: 0.18
Nodes (12): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Disposable, NodeBatch, NodeStoreSubject, runInFreshInstance() (+4 more)

### Community 9 - "setup.ts"
Cohesion: 0.05
Nodes (65): C5AnyFn, Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash() (+57 more)

### Community 90 - "NodeRpcClient"
Cohesion: 0.18
Nodes (6): NodeRpcClient, NodeRpcError, NodeRpcInvalidHeightError, NodeRpcParseError, SubstrateBlock, SubstrateHeader

### Community 93 - "chain-archive-preprod-cloud-crossval.integration.test.ts"
Cohesion: 0.16
Nodes (5): IndexerClient, IndexerClientError, IndexerClientParseError, IndexerTransaction, MAX

### Community 108 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 124 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 130 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 147 - "lease-nonwedge.crash.test.ts"
Cohesion: 0.28
Nodes (8): class2AdvisoryLockCountForHash(), pollForLockGone(), pool(), sleep(), worker(), liveWorkers, openPools, { sql: getSql, connectionUri }

### Community 182 - "fresh-instance.mjs"
Cohesion: 0.40
Nodes (4): hex(), requested, store, stored

### Community 27 - "fn"
Cohesion: 0.07
Nodes (39): isLockTimeout(), runMigrationsImpl(), migrations(), column(), fn(), key(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), How the two lineages coexist (+31 more)

### Community 30 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 47 - "table"
Cohesion: 0.07
Nodes (29): table(), Data that is not a function of the chain, Migrations, Reading through `db`, Time values, UmbraDB module guide, Upgrades, Writing in callbacks (+21 more)

### Community 68 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (24): insert(), ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default (+16 more)

### Community 69 - "context"
Cohesion: 0.11
Nodes (12): schemaName(), module(), context(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+4 more)

### Community 71 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.17
Nodes (20): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), startTestDatabase(), stopTestDatabase(), EXPECTED_NIGHT_VALUE, EXPECTED_UNSHIELDED_ADDRESS (+12 more)

### Community 95 - "T"
Cohesion: 0.14
Nodes (16): T(), 4. Law-by-law repair map, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, Scenario: Version and timestamp addressing agree, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error (+8 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor first, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+7 more)

### Community 102 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.12
Nodes (15): 0. Package layout, 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire, 3. G7 — Server-side timeouts (+7 more)

### Community 103 - "ROADMAP.md"
Cohesion: 0.13
Nodes (10): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+2 more)

### Community 104 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.13
Nodes (15): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N) (+7 more)

### Community 106 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.13
Nodes (14): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4, 2. G9 — the four crash tests, 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12) (+6 more)

### Community 107 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

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

### Community 115 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 117 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.15
Nodes (12): 10. Tables, 11. Refusals and halts (IN-12), 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 3. Block source and ingest, 7. Configuration, 8. Private processes (PP) (+4 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 122 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 123 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 125 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 126 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 127 - "3. Proof-blocking findings"
Cohesion: 0.18
Nodes (11): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption (+3 more)

### Community 128 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 132 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 133 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.20
Nodes (9): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 4. Live preprod DB-sync verification (nightly/labeled), 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding), 7. Testing strategy (post-implementation) (+1 more)

### Community 134 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 135 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 136 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 137 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 138 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 139 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 140 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 141 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 142 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 143 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 144 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 145 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 148 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 149 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 150 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.25
Nodes (7): Benchmarks, Compatibility, and what 1.0.0 needs, Installing, Security, UmbraDB 0.9.5 "Penumbra", What is proved, and what that is worth, What this is not

### Community 151 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 152 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 153 - "Security policy & threat model"
Cohesion: 0.25
Nodes (8): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 154 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 155 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 157 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 158 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 159 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 160 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 161 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 162 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 163 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 164 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.29
Nodes (6): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 165 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 166 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 167 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 168 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 170 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 171 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 172 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 173 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 174 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 175 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 176 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 177 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 178 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, Why

### Community 179 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 180 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 181 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 183 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 184 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 185 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 186 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 187 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 188 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 189 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 190 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 191 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.40
Nodes (4): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Suggested fix

### Community 192 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 193 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 194 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 195 - "Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data"
Cohesion: 0.40
Nodes (5): Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data, Scenario: replay from the durable cursor converges on current state, Scenario: the durable watermark is never ahead of durable data, Scenario: the invariant holds under synchronous_commit = off, Scenario: the invariant holds under synchronous_commit = on

### Community 196 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 197 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 198 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 199 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 200 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 201 - "Proposal — Sprint 2: Transaction/Lease"
Cohesion: 0.50
Nodes (3): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease

### Community 202 - "2. Schema — two corrections to `design/design.md` §3"
Cohesion: 0.50
Nodes (4): 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3

### Community 203 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 204 - "Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence"
Cohesion: 0.50
Nodes (4): Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Scenario: the evidence run is not a required CI gate, Scenario: the pre-tag run resumes from the durable cursor with no resync or drift, Scenario: the run's evidence is recorded as a release artifact

### Community 205 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 206 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 209 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 24 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 25 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 34 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+30 more)

### Community 35 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data responses name their view and height (+30 more)

### Community 42 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+27 more)

### Community 44 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races (+26 more)

### Community 45 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.06
Nodes (27): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+19 more)

### Community 46 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: history() computes per-manifest aggregates in a single grouped query (HP-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1) (+25 more)

### Community 48 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (28): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+20 more)

### Community 52 - "Requirements"
Cohesion: 0.07
Nodes (28): Purpose, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+20 more)

### Community 53 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: put's CAS guard distinguishes conflict from absence, Requirement: Schema isolation is the default, not opt-in (+19 more)

### Community 55 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+19 more)

### Community 57 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: migration advisory-lock acquisition is bounded and fails fast, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically, Requirement: the required Postgres configuration is published as a binding Durability Contract, Requirement: the UmbraDB connection sets bounded server-side timeouts by default (+19 more)

### Community 60 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 61 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 62 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form (+18 more)

### Community 64 - "Full-Chain Storage — Design"
Cohesion: 0.08
Nodes (25): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+17 more)

### Community 66 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.08
Nodes (25): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+17 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A bare numeric watermark value round-trips exactly (+12 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.10
Nodes (21): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence (+13 more)

### Community 85 - "package.json"
Cohesion: 0.10
Nodes (19): description, exports, files, homepage, license, main, name, type (+11 more)

### Community 87 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 91 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, archive:sync, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 92 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 94 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 96 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (16): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+8 more)

### Community 97 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (16): 10. Node client and ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups, 16. Browser, 17. Library surface and gates (+8 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 99 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.12
Nodes (14): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`) (+6 more)

## Knowledge Gaps
- **30 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-3339`, `RFC-8949`, `./tsconfig.json` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2038 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `runMigrations`, `roles.ts`, `PgTransactionLeaseLayer`, `api.ts`, `postgres/checkpoint-store.ts`, `src/index.ts`, `postgres-image.test.ts`, `TransactionHandle`, `postgres/transaction-lease.ts`, `setup.ts`, `postgres.ts`, `cbor.ts`, `writer-lock-checks.ts`, `module-tables.ts`, `column-rules.test.ts`, `boundary.test.ts`, `lease-nonwedge.crash.test.ts`, `declaration.ts`, `column-refusals.test.ts`, `zero-timeouts-checks.ts`, `graph.test.ts`, `cursor-durability.crash.test.ts`, `createClient`, `interfaces/transaction-history-storage.ts`, `pg-tx-history-adapter.ts`, `postgres/migrate.ts`, `ref_node_fs`, `wallet-state-envelope.test.ts`, `validation.ts`, `differential-equivalence.test.ts`, `ref_node_crypto`, `check-required-tests.ts`, `cbor.property.test.ts`, `opt-out.test.ts`, `What changes — the 1.0.0 gate items this change addresses`, `cold-boot-recovery.integration.test.ts`, `full-sync-soak.integration.test.ts`, `db/migrate.test.ts`, `chain-archive-replay-decode.integration.test.ts`, `read-height.property.test.ts`, `pglite-timeouts.test.ts`, `ws-mutual-tls.test.ts`, `package.json`, `transaction-history-storage.property.test.ts`, `describeNodeStoreExports`, `NodeRpcClient`, `chain-archive-preprod-cloud-crossval.integration.test.ts`, `mutation-per-adapter.mjs`, `chain-archive-sync-retry.integration.test.ts`, `load-under-prune.integration.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `facade-merge-loader.ts`?**
  _High betweenness centrality (0.255) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `UmbraError` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`UmbraError` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `runMigrations` be split into smaller, more focused modules?**
  _Cohesion score 0.032798187727765195 - nodes in this community are weakly interconnected._
- **Why does `runMigrations()` connect `runMigrations` to `roles.ts`, `PgTransactionLeaseLayer`, `postgres/checkpoint-store.ts`, `src/index.ts`, `TransactionHandle`, `postgres/transaction-lease.ts`, `setup.ts`, `harness.ts`, `fn`, `cursor-durability.crash.test.ts`, `UmbraDB 1.0.0 Release Contracts`, `createClient`, `postgres/migrate.ts`, `resolveTransaction`, `saveAndAdvance`, `ADDED Requirements`, `ValidationError`, `ADDED Requirements`, `Full-Chain Storage — Design`, `chain-archive-rollover.ts`, `What changes — the 1.0.0 gate items this change addresses`, `cold-boot-recovery.integration.test.ts`, `Design — v1.0.0-durable-checkpoint-cursor`, `chain-archive-sync-retry.integration.test.ts`, `UmbraDB`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Should `roles.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03912010998625172 - nodes in this community are weakly interconnected._