# Graph Report - UmbraDB

## Corpus Check
- 449 files · ~721,460 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 53 file(s) not represented in the graph (top: .lean 25, (none) 13, .patch 8)

## Summary
- 4332 nodes · 9570 edges · 237 communities (217 shown, 20 thin omitted)
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 1775 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `fcacc3ea1b89b79d` (449 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- module-tables.ts
- UmbraError
- pglite.ts
- CheckpointNotFoundError
- InMemoryTransactionHistoryStorage
- encodeRow
- error-catalog-drift.test.ts
- component-table.test.ts
- node-store-suite.ts
- IndexerClient
- column-rules.test.ts
- cbor.test.ts
- column-rules.ts
- createClient
- interfaces/chain-archive-store.ts
- postgres-image.test.ts
- ref_node_fs
- block
- PgTransactionHistoryStorage
- mutation-evidence.d.mts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- vendored-ledger-files.test.ts
- StorageError
- boundary.test.ts
- migrate.ts
- postgres/chain-archive-store.ts
- api.ts
- pg-tx-history-adapter.ts
- src/index.ts
- cbor.ts
- pglite-queue.test.ts
- cursor-durability.crash.test.ts
- translatePostgresError
- .save
- mapping.ts
- PgTransactionLeaseLayer
- postgres/checkpoint-store.ts
- PgTemporalKV
- CheckpointStore
- differential-equivalence.test.ts
- describeNodeStoreExports
- ChunkMissingError
- ref_node_crypto
- full-sync-soak.integration.test.ts
- sync-service.ts
- runMigrations
- setup.ts
- cbor.property.test.ts
- check-required-tests.ts
- chain-archive-replay-decode.integration.test.ts
- TransactionHandle
- postgres/watermarks.ts
- read-height.property.test.ts
- ChainArchiveStore
- chain-archive-rollover.ts
- ValidationError
- harness.ts
- node-format.ts
- transaction-history-storage.property.test.ts
- NodeRpcClient
- What changes — the 1.0.0 gate items this change addresses
- withSuiteWatchdog
- Watermarks
- ws-mutual-tls.test.ts
- postgres/transaction-lease.ts
- catalog.ts
- crash-worker.ts
- postgres/transaction-history-storage.ts
- load-under-prune.integration.test.ts
- decode
- Design — Sprint 7: Transaction History Storage
- Design — v1.0.0-perf-baseline
- facade-merge-loader.ts
- transaction-history-storage.test.ts
- pack-install.mjs
- watermarks.property.test.ts
- Requirement: PP-4 The process transport
- storage-errors.ts
- midnight-env — reproducible PREPROD dev environment
- lease-nonwedge.crash.test.ts
- report
- notImmutableParts
- fresh-instance.mjs
- ADDED Requirements
- run
- graph.py
- fn
- ADDED Requirements
- vitest
- saveAndAdvance
- cold-boot-recovery.integration.test.ts
- .save
- mutation-per-adapter.mjs
- ADDED Requirements
- REMOVED Requirements
- Roadmap
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- Design — Sprint 3: CheckpointStore
- Design — Postgres+JSONB storage rebuild
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- 3. Proof-blocking findings
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- Scalability ceilings (v1.0.0)
- ROADMAP.md
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — Sprint 7: Transaction History Storage
- Tasks — v1.0.0-infosec-signoff
- Contributing
- 4. Schema design
- Global Constraints
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Design — v1.0.0 API Surface & Release Contract
- Acceptance criteria — v1.0.0-infosec-signoff
- Repository agent policy
- Our Pledge
- Midnight infra verification checklist
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 12. Milestone status
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- UmbraDB 1.0.0 Release Contracts
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-perf-baseline
- ADDED Requirements
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- ADDED Requirements
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- bug-report.md
- feature-request.md
- Proposal — Sprint 2: Transaction/Lease
- GC architecture and query-tracing: research findings
- PULL_REQUEST_CHECKLIST.md
- 9. Trust and refinement boundary
- documentation-improvement.md
- Overview
- Test wallets
- Proposal — Sprint 3: CheckpointStore
- 6.2 — fault-schedule differential (`test/postgres/differential-equivalence.test.ts`)
- Spec — capability `formal-completion`
- renovate.json
- Vendored ledger builds
- Environment changelog
- UmbraDB module guide
- start-stack.sh
- Requirement: Chunk storage is content-addressed and globally deduplicated
- run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- package.json
- Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- Storage Algebra Lean Formalization — Approved Design and Status
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- devDependencies
- UmbraDB

## God Nodes (most connected - your core abstractions)
1. `vitest` - 107 edges
2. `PgTransactionLeaseLayer` - 93 edges
3. `PgCheckpointStore` - 87 edges
4. `ValidationError` - 87 edges
5. `runMigrations()` - 85 edges
6. `translatePostgresError()` - 78 edges
7. `createClient()` - 74 edges
8. `UmbraDBSql` - 72 edges
9. `PgTransactionHistoryStorage` - 70 edges
10. `StorageError` - 70 edges

## Surprising Connections (you probably didn't know these)
- `1. Source layout` --references--> `UmbraError`  [INFERRED]
  openspec/changes/core-arch/design.md → src/deterministic-postgresql/errors.ts
- `2. TemporalKV → Postgres` --references--> `TransactionKeyReuseError`  [INFERRED]
  design/design.md → src/interfaces/temporal-kv.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → src/interfaces/transaction-history-storage.ts
- `2. Schema + interface` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/tasks.md → src/interfaces/transaction-history-storage.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (237 total, 20 thin omitted)

### Community 0 - "module-tables.ts"
Cohesion: 0.05
Nodes (67): CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ConsistentRead, ColumnType (+59 more)

### Community 1 - "UmbraError"
Cohesion: 0.05
Nodes (50): Difference, PlannedSchema, Provision, QualifiedTable, SchemaItem, SchemaMigration, SchemaModule, SchemaPlan (+42 more)

### Community 10 - "pglite.ts"
Cohesion: 0.07
Nodes (29): CommittedHeight, Transaction, Job, JobQueue, Outcome, PgliteDatabase, PgliteOptions, ServerErrorFields (+21 more)

### Community 102 - "CheckpointNotFoundError"
Cohesion: 0.19
Nodes (9): CheckpointNotFoundError, { sql: getSql, connectionUri }, Requirement: load and history distinguish "no checkpoint" from "checkpoint exists elsewhere", Scenario: history for a wallet+network with no checkpoints resolves empty, Scenario: No checkpoint exists for the wallet+network at all, Scenario: Omitting sequence loads the latest checkpoint, Scenario: The wallet+network has checkpoints but not at the requested sequence, Requirement: loading a never-saved wallet surfaces a typed not-found, not a silent empty result (+1 more)

### Community 103 - "InMemoryTransactionHistoryStorage"
Cohesion: 0.23
Nodes (5): InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 105 - "encodeRow"
Cohesion: 0.29
Nodes (7): Writer, checkSafeInteger(), encodeArrayHead(), encodeRow(), writeBytes(), writeInteger(), 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx)

### Community 11 - "error-catalog-drift.test.ts"
Cohesion: 0.04
Nodes (47): HistoryUnavailableError, TransactionKeyReuseError, ClockRegressionError, CatalogRow, AS_OF, EXPORTED_CONCRETE, ROLLBACK_CAUSE, SURFACE_INSTANCES (+39 more)

### Community 110 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 111 - "node-store-suite.ts"
Cohesion: 0.19
Nodes (10): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Disposable, NodeBatch, runInFreshInstance(), hasEmbeddedChild() (+2 more)

### Community 112 - "IndexerClient"
Cohesion: 0.24
Nodes (4): IndexerClient, IndexerClientError, IndexerClientParseError, IndexerTransaction

### Community 12 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (27): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+19 more)

### Community 127 - "cbor.test.ts"
Cohesion: 0.24
Nodes (9): CanonicalEncodingFailure, CanonicalValue, toHex(), expectFailure(), failure(), hexOf(), rowHex(), RFC-3339 (+1 more)

### Community 13 - "column-rules.ts"
Cohesion: 0.05
Nodes (49): AllowedRule, DesignRow, PlacedRefusal, RefusalCode, RefusedRule, RuleBase, Token, TreeItem (+41 more)

### Community 14 - "createClient"
Cohesion: 0.11
Nodes (25): UmbraDBSql, BlockRow, TxRow, bootstrapChainArchiveSchema(), overridingUrlParameter(), assertNoConflictingSearchPath(), createClient(), fakeChain() (+17 more)

### Community 140 - "interfaces/chain-archive-store.ts"
Cohesion: 0.20
Nodes (9): BlobRole, BlockBundle, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult, VerifierKeyScope (+1 more)

### Community 141 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 15 - "ref_node_fs"
Cohesion: 0.06
Nodes (22): Lockfile, Manifest, LockResult, GuardViolation, kill(), extractStringLiterals(), findChainSyncViolations(), scanDirectory() (+14 more)

### Community 16 - "block"
Cohesion: 0.05
Nodes (42): BlockWriteHandle, ReadHandle, SchemaWriteHandle, block(), 5. Runner, 10. Tables, 11. Refusals and halts (IN-12), 12. Exported surface and command (LS-1, LS-6) (+34 more)

### Community 17 - "PgTransactionHistoryStorage"
Cohesion: 0.07
Nodes (39): TransactionHistoryStorage, PgTransactionHistoryStorage, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation), Build (one product module + one thin envelope — corrected from the original "exactly two things, zero new code" framing; see finding below) (+31 more)

### Community 179 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 18 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (35): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+27 more)

### Community 181 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 2 - "StorageError"
Cohesion: 0.05
Nodes (74): ConnectionError, Retryability, StorageError, TemporalKVError, Rollback, TransactionLeaseLayer, EnvelopeCorruptError, EnvelopeVersionUnsupportedError (+66 more)

### Community 22 - "boundary.test.ts"
Cohesion: 0.12
Nodes (34): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+26 more)

### Community 24 - "migrate.ts"
Cohesion: 0.09
Nodes (20): DurabilityViolation, DurabilityWarning, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit(), probeAdvisoryLockVisibility(), probeDurability() (+12 more)

### Community 25 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (19): BlockMeta, BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, VerifierKeyObservationRecord, BlockRow (+11 more)

### Community 26 - "api.ts"
Cohesion: 0.10
Nodes (17): ErrorCode, ErrorDetails, Case, mapRows(), mapValue(), outcome(), shape(), TRUNCATE_NOT_ALLOWED_SQLSTATE (+9 more)

### Community 27 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (25): SerializationFailedError, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+17 more)

### Community 28 - "src/index.ts"
Cohesion: 0.10
Nodes (27): CheckpointStoreErrorCode, SharedStorageErrorCode, TemporalKVErrorCode, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle (+19 more)

### Community 29 - "cbor.ts"
Cohesion: 0.09
Nodes (33): ColumnMode, DateTimeFields, Mode, PathNode, Task, ScalarColumnType, compareBytes(), daysInMonth() (+25 more)

### Community 3 - "pglite-queue.test.ts"
Cohesion: 0.05
Nodes (43): Database, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, Phase (+35 more)

### Community 30 - "cursor-durability.crash.test.ts"
Cohesion: 0.07
Nodes (28): InvariantResult, CrashWorkerHandle, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs(), durableKvValues(), itemKey() (+20 more)

### Community 31 - "translatePostgresError"
Cohesion: 0.09
Nodes (28): TransactionFaultError, ExclusionViolationError, PgDriverError, UnrecognizedPostgresError, isChainArchiveCheckConstraintName(), isConnectionFailure(), isLockTimeout(), isPgDriverError() (+20 more)

### Community 32 - ".save"
Cohesion: 0.07
Nodes (30): CheckpointSummary, splitChunks(), validateHistoryOptions(), validateSaveOptions(), invoke(), 1. Chunking and write path, 4.1 Validate `walletId`/`networkId` at all four entry points, Requirement: save accepts and joins a caller-supplied transaction handle (+22 more)

### Community 33 - "mapping.ts"
Cohesion: 0.10
Nodes (32): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+24 more)

### Community 34 - "PgTransactionLeaseLayer"
Cohesion: 0.11
Nodes (29): PgCheckpointStore, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters, adaptersOf(), store(), store() (+21 more)

### Community 39 - "postgres/checkpoint-store.ts"
Cohesion: 0.12
Nodes (28): CheckpointRecord, CheckpointSequence, CheckpointStoreError, ContentHash, HistoryOptions, ManifestCorruptError, PruneResult, SaveCheckpointOptions (+20 more)

### Community 4 - "PgTemporalKV"
Cohesion: 0.06
Nodes (55): AsOf, AssertExact, Key, Namespace, Scope, Version, VersionConflictError, VersionedEntry (+47 more)

### Community 41 - "CheckpointStore"
Cohesion: 0.11
Nodes (25): CheckpointStore, WalletStateEnvelope, PgWalletStateEnvelopeStore, encode(), phaseB_freshProcessRestoreAndVerify(), 1.2 Async pattern, Wallet State Envelope, Commit policy — what may and may not go into git (+17 more)

### Community 42 - "differential-equivalence.test.ts"
Cohesion: 0.12
Nodes (27): Adapters, Fault, adaptersFor(), adaptersOf(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch() (+19 more)

### Community 43 - "describeNodeStoreExports"
Cohesion: 0.12
Nodes (16): NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), apply(), 12. Ledger, 5.1 The `LedgerPackage` interface (LG-6), 5.2 Vendored builds (LG-5), Impact (+8 more)

### Community 44 - "ChunkMissingError"
Cohesion: 0.10
Nodes (26): ChunkIntegrityError, ChunkMissingError, Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: load always fully verifies chunk integrity before returning, Scenario: A checkpoint whose stored chunk content matches its recorded hash loads successfully, Scenario: A chunk shared across wallets survives one wallet's prune, Scenario: A chunk whose stored content no longer matches its recorded hash is rejected, Scenario: A manifest referencing a chunk absent from storage is rejected (+18 more)

### Community 46 - "ref_node_crypto"
Cohesion: 0.17
Nodes (23): NodeRoot, bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex() (+15 more)

### Community 47 - "full-sync-soak.integration.test.ts"
Cohesion: 0.07
Nodes (17): JsonValue, KvRow, BatchSpec, CurrentState, CurrentState, GcPass, HistGroup, SampleObservation (+9 more)

### Community 48 - "sync-service.ts"
Cohesion: 0.13
Nodes (18): IndexerBlock, IndexerClientOptions, NodeRpcClientOptions, ChainArchiveSyncService, ChainArchiveSyncServiceOptions, SyncOnceResult, extrinsicsBytes(), headerBytes() (+10 more)

### Community 5 - "runMigrations"
Cohesion: 0.04
Nodes (66): UmbraDBConnectionOptions, DurabilityContractError, TransactionPoolerDetectedError, MigrationLockTimeoutError, runMigrations(), runMigrationsImpl(), Audit (round 1) — the confirmation-bias control paid off, 1. Durability contract (+58 more)

### Community 51 - "setup.ts"
Cohesion: 0.08
Nodes (21): Method, Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, getTestContainer(), restartTestContainer() (+13 more)

### Community 56 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (25): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+17 more)

### Community 57 - "check-required-tests.ts"
Cohesion: 0.14
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 59 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+12 more)

### Community 6 - "TransactionHandle"
Cohesion: 0.05
Nodes (52): TemporalKV, TransactionHistoryEntry, TransactionHandle, TransactionHandleInvalidError, rowToEntry(), resolveTransaction(), 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.3 Transaction participation (+44 more)

### Community 60 - "postgres/watermarks.ts"
Cohesion: 0.16
Nodes (13): WatermarkKey, WatermarkKind, WatermarkValue, WatermarkRow, WatermarkValueSchema, { sql: getSql, connectionUri }, RFC-8259, Watermarks (`src/interfaces/watermarks.ts`) (+5 more)

### Community 61 - "read-height.property.test.ts"
Cohesion: 0.12
Nodes (15): TestBackend, TestDatabase, HeldRead, Job, Outcome, Reads, Step, concurrent() (+7 more)

### Community 65 - "ChainArchiveStore"
Cohesion: 0.10
Nodes (10): ChainArchiveStore, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents, `transactions` (chain_archive) (+2 more)

### Community 66 - "chain-archive-rollover.ts"
Cohesion: 0.15
Nodes (19): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+11 more)

### Community 68 - "ValidationError"
Cohesion: 0.14
Nodes (20): ValidationError, Requirement: prune rejects a retainCount that is not a positive safe integer, before any deletion runs, Requirement: save rejects invalid options with ValidationError before any chunking or hashing work, Scenario: A chunkSize above the schema's 16 MiB bound is rejected with no work done, Scenario: A non-integer or non-finite retainCount is rejected with no effect, Scenario: An integer retainCount outside the safe integer range is rejected with no effect, Scenario: retainCount of zero is rejected with no effect, 3. GC (`prune`) (+12 more)

### Community 7 - "harness.ts"
Cohesion: 0.09
Nodes (47): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+39 more)

### Community 71 - "node-format.ts"
Cohesion: 0.23
Nodes (14): Reader, childKey(), concat(), decodeChild(), decodeChildren(), encodeChild(), encodeChildren(), nodeKey() (+6 more)

### Community 74 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 77 - "NodeRpcClient"
Cohesion: 0.18
Nodes (6): NodeRpcClient, NodeRpcError, NodeRpcInvalidHeightError, NodeRpcParseError, SubstrateBlock, SubstrateHeader

### Community 78 - "What changes — the 1.0.0 gate items this change addresses"
Cohesion: 0.24
Nodes (13): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+5 more)

### Community 8 - "withSuiteWatchdog"
Cohesion: 0.05
Nodes (55): C5AnyFn, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount(), pool(), watermarkCount(), worker(), worker() (+47 more)

### Community 82 - "Watermarks"
Cohesion: 0.13
Nodes (14): Watermarks, 2. `storage-errors.ts` — shared base (new file), 3.4 Watermarks, 3. Module Interfaces, 4. Composition with `WalletStateStore` / `PrivateStateProvider`, 5. Documentation-Generation Tooling, Review notes, Storage Layer Interface Specification (+6 more)

### Community 83 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (13): Attempt, connect(), file(), makeCa(), makeLeaf(), openssl(), read(), tlsClientErrors (+5 more)

### Community 9 - "postgres/transaction-lease.ts"
Cohesion: 0.07
Nodes (44): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionLeaseError, TransactionRolledBackError, HeldLease (+36 more)

### Community 91 - "catalog.ts"
Cohesion: 0.16
Nodes (15): CatalogColumn, CatalogTable, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference, RelationFacts (+7 more)

### Community 92 - "crash-worker.ts"
Cohesion: 0.20
Nodes (14): CoTxCallable, CoTxPauseInfo, CrashHook, describeCaughtError(), main(), observeClientPauseBeforeCursor(), pauseThenResume(), pauseUntilKilled() (+6 more)

### Community 98 - "postgres/transaction-history-storage.ts"
Cohesion: 0.23
Nodes (14): JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), capitalize(), decodeContent(), decodeRow(), decodeSections() (+6 more)

### Community 99 - "load-under-prune.integration.test.ts"
Cohesion: 0.15
Nodes (12): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), runUnSnapshottedReadUnderPrune(), seedCheckpoints() (+4 more)

### Community 109 - "decode"
Cohesion: 0.22
Nodes (12): decode(), safeNonEmptyString(), safeString(), envelope(), arbitraryEnvelope, subWalletSlot, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored (+4 more)

### Community 114 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.17
Nodes (11): entry(), `transaction_history`, 4. Configuration, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 5. WalletState envelope (+3 more)

### Community 118 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.18
Nodes (10): coerceToSafeNumber(), 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected (+2 more)

### Community 121 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 128 - "transaction-history-storage.test.ts"
Cohesion: 0.20
Nodes (7): decodeSerializedContent(), decodeSerializedEntry(), store(), txLayer(), THS_RESERVED_KEY_PREFIX, FAKE_TX, { sql: getSql }

### Community 129 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 134 - "watermarks.property.test.ts"
Cohesion: 0.18
Nodes (7): store(), arbitraryWatermarkValue, { sql: getSql }, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, Why

### Community 149 - "Requirement: PP-4 The process transport"
Cohesion: 0.22
Nodes (8): module(), rows(), Requirement: PP-4 The process transport, Scenario: A read through the core, 1.2 `package.json` — make it publishable with a strict `exports`, Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, Why

### Community 153 - "storage-errors.ts"
Cohesion: 0.36
Nodes (4): ENVELOPE_VERSION, SubWalletSlotSchema, { sql: getSql }, zod

### Community 161 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.29
Nodes (7): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 164 - "lease-nonwedge.crash.test.ts"
Cohesion: 0.32
Nodes (7): class2AdvisoryLockCountForHash(), pollForLockGone(), pool(), sleep(), liveWorkers, openPools, { sql: getSql, connectionUri }

### Community 172 - "report"
Cohesion: 0.29
Nodes (7): report(), 14. Private processes, 8. Private processes (PP), Requirement: PP-6 Lockstep instances process each height at that height, Requirement: PP-9 What the public side may call, Scenario: A lockstep instance is stopped, Scenario: The core's view of an instance

### Community 180 - "notImmutableParts"
Cohesion: 0.29
Nodes (7): listed(), notImmutableParts(), parseExpressionTree(), tokenize(), does(), parts(), references()

### Community 192 - "fresh-instance.mjs"
Cohesion: 0.40
Nodes (4): hex(), requested, store, stored

### Community 21 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): provider(), ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup (+31 more)

### Community 215 - "run"
Cohesion: 0.50
Nodes (4): run(), failureReason(), failure(), refusalOf()

### Community 23 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 40 - "fn"
Cohesion: 0.09
Nodes (32): column(), fn(), key(), 1.5 Naming, Storage Types — reference for formalization, Transaction/Lease (`src/interfaces/transaction-lease.ts`), What's NOT in scope for this formalization, ADDED Requirements (+24 more)

### Community 45 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only (+20 more)

### Community 55 - "vitest"
Cohesion: 0.07
Nodes (8): txLayer(), settings, FAKE_TX, { sql: getSql, connectionUri }, { sql: getSql, connectionUri }, CORE_ARCH, DURABILITY, vitest

### Community 58 - "saveAndAdvance"
Cohesion: 0.11
Nodes (23): saveAndAdvance(), 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay (+15 more)

### Community 62 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.19
Nodes (20): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject(), mergeSections(), referenceMergeEntries() (+12 more)

### Community 72 - ".save"
Cohesion: 0.11
Nodes (17): Benchmarks, Compatibility, and what 1.0.0 needs, If you build from source, Installing, Security, The fix this release exists for, The surface, UmbraDB 0.9.5 "Penumbra" (+9 more)

### Community 97 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+5 more)

### Community 101 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 104 - "Roadmap"
Cohesion: 0.14
Nodes (14): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+6 more)

### Community 106 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 108 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.15
Nodes (12): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 5. `history` — pagination (+4 more)

### Community 113 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.17
Nodes (12): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`) (+4 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Backup while syncing (+3 more)

### Community 116 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 119 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 120 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 122 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 123 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 124 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 125 - "3. Proof-blocking findings"
Cohesion: 0.18
Nodes (11): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption (+3 more)

### Community 126 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.18
Nodes (10): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding) (+2 more)

### Community 130 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 131 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 132 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 133 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 135 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 136 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.20
Nodes (9): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover), 7. What this change deliberately does not verify (traceability of the non-goals), 8. Dependencies and sequencing (from `ROADMAP` §"Critical path"), Audit resolution (+1 more)

### Community 137 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 138 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 139 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 142 - "ROADMAP.md"
Cohesion: 0.22
Nodes (3): For historical reference only, Tasks — superseded by per-sprint openspec changes, Performance

### Community 143 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.22
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 144 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 145 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 146 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 147 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 148 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 150 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 151 - "Tasks — Sprint 7: Transaction History Storage"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest, 2. Schema + interface, 3. PgTransactionHistoryStorage implementation, 5. Storage-swappable conformance harness (Pg-only tier — required merge gate), 6. Live-sync tier (nightly/labeled — blocked on design.md §7's open question), 7. Close-out, Tasks — Sprint 7: Transaction History Storage

### Community 152 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 155 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 156 - "4. Schema design"
Cohesion: 0.25
Nodes (8): 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy, 4. Schema design, v4 rewrite — the rollover runbook, rebuilt from four reproduced failures, run end-to-end for real

### Community 157 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 158 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 159 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 160 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 162 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.25
Nodes (7): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer), Design — v1.0.0 API Surface & Release Contract

### Community 163 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 165 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 166 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 167 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 168 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 169 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 170 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 171 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 173 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 174 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 175 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 176 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 177 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 178 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 182 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 183 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 184 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.33
Nodes (6): 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 185 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 186 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 187 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 188 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 189 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, Why

### Community 19 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 190 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 191 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 193 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 194 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 195 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 196 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 197 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 198 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 199 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 20 - "ADDED Requirements"
Cohesion: 0.05
Nodes (42): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+34 more)

### Community 200 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.40
Nodes (4): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Problem, Resolution, Suggested fix

### Community 201 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 202 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 203 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 204 - "Proposal — Sprint 2: Transaction/Lease"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease, Why

### Community 205 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 206 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 207 - "9. Trust and refinement boundary"
Cohesion: 0.50
Nodes (4): 9. Trust and refinement boundary, Completed M1/M2/W1 claims, Deferred M2–M5 proof work, Named external obligations

### Community 208 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 209 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 210 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 211 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.50
Nodes (3): Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes

### Community 212 - "6.2 — fault-schedule differential (`test/postgres/differential-equivalence.test.ts`)"
Cohesion: 0.50
Nodes (3): 6.1 — P3 is the differential gate's replay-equivalence / fold anchor (documentation, no new test code), 6.2 — fault-schedule differential (`test/postgres/differential-equivalence.test.ts`), Gate notes — Task 6: differential state-equivalence gate (G11)

### Community 213 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 214 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 216 - "Vendored ledger builds"
Cohesion: 0.50
Nodes (3): Rebuilding, Updating a version, Vendored ledger builds

### Community 220 - "Requirement: Chunk storage is content-addressed and globally deduplicated"
Cohesion: 0.67
Nodes (3): Requirement: Chunk storage is content-addressed and globally deduplicated, Scenario: Identical chunk content across different checkpoints is stored once, Scenario: Re-referencing an existing chunk refreshes its GC clock

### Community 35 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+27 more)

### Community 36 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 37 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races (+25 more)

### Community 38 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+25 more)

### Community 49 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

### Community 50 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+19 more)

### Community 52 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default (+18 more)

### Community 53 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 54 - "package.json"
Cohesion: 0.07
Nodes (26): bugs, url, description, engines, node, exports, files, homepage (+18 more)

### Community 63 - "Requirements"
Cohesion: 0.09
Nodes (22): Purpose, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Schema isolation is the default, not opt-in, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+14 more)

### Community 64 - "Full-Chain Storage — Design"
Cohesion: 0.09
Nodes (21): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs, 3.5 Dust generation + ledger events (generic) (+13 more)

### Community 67 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Schema isolation is the default, not opt-in, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+13 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+12 more)

### Community 70 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: A bare numeric watermark value round-trips exactly (+12 more)

### Community 73 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.09
Nodes (18): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9) (+10 more)

### Community 75 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+9 more)

### Community 80 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, archive:sync, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 81 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 84 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 85 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (16): 10. Node client and ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups, 16. Browser, 17. Library surface and gates, 18. Whole-system faults, differentials and measurements (+8 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note), Scenario: A pending entry clears against a finalized entry whose identifiers grew via two prior merges (+8 more)

### Community 88 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.12
Nodes (14): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`) (+6 more)

### Community 89 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N) (+8 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 93 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.13
Nodes (15): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+7 more)

### Community 94 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (14): 10. Ingest, 11. Chain data, 13. Contract data, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API, 3. Modules (+6 more)

### Community 95 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 96 - "UmbraDB"
Cohesion: 0.13
Nodes (15): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+7 more)

## Knowledge Gaps
- **30 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-3339`, `./tsconfig.json`, `RFC-3339` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1896 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `module-tables.ts`, `UmbraError`, `StorageError`, `pglite-queue.test.ts`, `PgTemporalKV`, `transaction-history-storage.test.ts`, `watermarks.property.test.ts`, `withSuiteWatchdog`, `postgres/transaction-lease.ts`, `error-catalog-drift.test.ts`, `column-rules.test.ts`, `postgres-image.test.ts`, `createClient`, `ref_node_fs`, `boundary.test.ts`, `migrate.ts`, `storage-errors.ts`, `api.ts`, `pg-tx-history-adapter.ts`, `src/index.ts`, `cursor-durability.crash.test.ts`, `translatePostgresError`, `PgTransactionLeaseLayer`, `lease-nonwedge.crash.test.ts`, `differential-equivalence.test.ts`, `ref_node_crypto`, `full-sync-soak.integration.test.ts`, `setup.ts`, `vendored-ledger-files.test.ts`, `package.json`, `cbor.property.test.ts`, `check-required-tests.ts`, `chain-archive-replay-decode.integration.test.ts`, `postgres/watermarks.ts`, `read-height.property.test.ts`, `cold-boot-recovery.integration.test.ts`, `transaction-history-storage.property.test.ts`, `NodeRpcClient`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `load-under-prune.integration.test.ts`, `CheckpointNotFoundError`, `decode`, `component-table.test.ts`, `node-store-suite.ts`, `IndexerClient`, `facade-merge-loader.ts`, `cbor.test.ts`?**
  _High betweenness centrality (0.242) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `module-tables.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0521978021978022 - nodes in this community are weakly interconnected._
- **Why does `block()` connect `block` to `UmbraError`, `ADDED Requirements`, `ADDED Requirements`, `describeNodeStoreExports`, `ADDED Requirements`, `sync-service.ts`, `ADDED Requirements`, `ADDED Requirements`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 29 inferred relationships involving `PgCheckpointStore` (e.g. with `Added` and `Phase → current status map`) actually correct?**
  _`PgCheckpointStore` has 29 INFERRED edges - model-reasoned connections that need verification._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.04929971988795518 - nodes in this community are weakly interconnected._