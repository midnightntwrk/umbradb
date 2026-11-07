# Graph Report - UmbraDB

## Corpus Check
- 339 files · ~561,749 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .lean 25, (none) 8, .toml 1)

## Summary
- 2994 nodes · 6675 edges · 214 communities (191 shown, 23 thin omitted)
- Extraction: 79% EXTRACTED · 21% INFERRED · 0% AMBIGUOUS · INFERRED: 1419 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `849474ac379be859` (339 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- src/index.ts
- createClient
- PgTransactionLeaseLayer
- Watermarks
- PgWatermarks
- ValidationError
- sync-service.ts
- no-chain-sync-import-guard.test.ts
- CrashWorkerHandle
- PgTransactionHistoryStorage
- TransactionHistoryEntry
- mutation-evidence.d.mts
- differential-equivalence.test.ts
- PgTemporalKV
- cursor-durability.crash.test.ts
- setup.ts
- ChunkMissingError
- pg-tx-history-adapter.ts
- check-required-tests.ts
- TransactionHandle
- CheckpointStore
- saveAndAdvance
- cold-boot-recovery.integration.test.ts
- chain-archive-replay-decode.integration.test.ts
- chain-archive-rollover.ts
- PgWalletStateEnvelopeStore
- harness.ts
- frozen-types.test.ts
- full-sync-soak.integration.test.ts
- ChainArchiveStore
- pg-kill-save.crash.test.ts
- CheckpointSummary
- TemporalKV
- What changes — the 1.0.0 gate items this change addresses
- interfaces/chain-archive-store.ts
- transaction-history-storage.property.test.ts
- NodeRpcClient
- PgCheckpointStore
- crash-worker.ts
- load-under-prune.integration.test.ts
- UmbraDBSql
- postgres/transaction-lease.ts
- save-and-advance.test.ts
- errors.ts
- UmbraDBConnectionOptions
- postgres/transaction-history-storage.ts
- interfaces/transaction-history-storage.ts
- Added
- translatePostgresError
- durability-probe.test.ts
- VersionConflictError
- gc.ts
- hasPostgresUnsafeText
- transaction-history-storage.test.ts
- watermarks.test.ts
- decode
- wallet-state-envelope.property.test.ts
- runMigrations
- registerSuiteLifecycle
- ADDED Requirements
- ref_node_fs
- withSuiteWatchdog
- pack-install.mjs
- graph.py
- .loadImpl
- mutation-per-adapter.mjs
- lease-nonwedge.crash.test.ts
- Design — Sprint 7: Transaction History Storage
- Design — v1.0.0-perf-baseline
- facade-merge-loader.ts
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- README.md
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB 0.9.5 "Penumbra"
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- ADDED Requirements
- Tasks — v1.1.0: Quint model checking
- Scalability ceilings (v1.0.0)
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- midnight-env — reproducible PREPROD dev environment
- Tasks — Sprint 7: Transaction History Storage
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0-infosec-signoff
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Contributing
- Algebraic Specification of the midnight-pg-store Storage Layer
- UmbraDB 1.0.0 Release Contracts
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Global Constraints
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Design — Sprint 4: Watermarks
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 12. Milestone status
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-perf-baseline
- Tasks — v1.0.0-perf-baseline
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 2.1 The boundary rule (the feature's key design decision)
- 1. The twenty gate items
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Proposal — Sprint 1: project setup + TemporalKV
- temporal-kv (transaction-participation wiring)
- Tasks — Sprint 4: Watermarks
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.1.0: Quint model checking
- Midnight Foundation Security Policy
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- ADDED Requirements
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network
- Requirement: load and history distinguish "no checkpoint" from "checkpoint exists elsewhere"
- Proposal — Sprint 4: Watermarks
- GC architecture and query-tracing: research findings
- PULL_REQUEST_CHECKLIST.md
- UmbraDB third-party component inventory (SBOM)
- documentation-improvement.md
- Overview
- Test wallets
- Proposal — Sprint 3: CheckpointStore
- Requirement: load always fully verifies chunk integrity before returning
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- 6. Lean 4 feasibility
- start-stack.sh
- ADDED Requirements
- Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed
- Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed
- dependencies
- repository
- run.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bugs
- engines
- Full-Chain Storage — Design
- Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- scripts
- ROADMAP.md
- Storage Algebra Lean Formalization — Approved Design and Status
- Roadmap
- devDependencies
- UmbraDB
- Storage Algebra Lean M2 Retention Sprint
- UmbraDB V1.0.0 Implementation Guideline
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — Postgres+JSONB storage rebuild
- UmbraDB v0.9.5 "Penumbra" — Release Record
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- openspec-explore/SKILL.md
- 3. Proof-blocking findings
- Design — Sprint 3: CheckpointStore
- Design — v1.0.0 API Surface & Release Contract

## God Nodes (most connected - your core abstractions)
1. `PgTransactionLeaseLayer` - 91 edges
2. `ValidationError` - 87 edges
3. `PgCheckpointStore` - 85 edges
4. `runMigrations()` - 84 edges
5. `translatePostgresError()` - 78 edges
6. `createClient()` - 74 edges
7. `UmbraDBSql` - 72 edges
8. `StorageError` - 70 edges
9. `PgTransactionHistoryStorage` - 70 edges
10. `TransactionHandle` - 70 edges

## Surprising Connections (you probably didn't know these)
- `Rework (class 1 — infra)` --references--> `ConnectionError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/storage-errors.ts
- `The cross-vendor audit (two codex cold rounds, then bounded at convergence)` --references--> `ConnectionError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/storage-errors.ts
- `Scenario: A connection failure surfaces as ConnectionError` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/specs/temporal-kv/spec.md → src/interfaces/storage-errors.ts
- `Scenario: A connection failure during any method surfaces as ConnectionError` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → src/interfaces/storage-errors.ts
- `G4 — Contract doc set (all true)` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/acceptance.md → src/interfaces/storage-errors.ts

## Import Cycles
- None detected.

## Communities (214 total, 23 thin omitted)

### Community 0 - "src/index.ts"
Cohesion: 0.07
Nodes (61): ConnectionError, Retryability, SerializationFailedError, SharedStorageErrorCode, StorageError, HistoryUnavailableError, TemporalKVError, TemporalKVErrorCode (+53 more)

### Community 1 - "createClient"
Cohesion: 0.07
Nodes (24): BlockRow, TxRow, assertNoConflictingSearchPath(), createClient(), bundleFixture(), makeBlock(), DEFAULT_IDLE_IN_TX_TIMEOUT_MS, DEFAULT_LOCK_TIMEOUT_MS (+16 more)

### Community 10 - "PgTransactionLeaseLayer"
Cohesion: 0.06
Nodes (23): PgTransactionLeaseLayer, Method, Adapters, store(), store(), makeStore(), store(), txLayer() (+15 more)

### Community 114 - "Watermarks"
Cohesion: 0.25
Nodes (7): Watermarks, 2. `storage-errors.ts` — shared base (new file), 4. Composition with `WalletStateStore` / `PrivateStateProvider`, 5. Documentation-Generation Tooling, Storage Layer Interface Specification, Scenario: The barrel re-exports every frozen primitive and its interface type, What it does

### Community 118 - "PgWatermarks"
Cohesion: 0.22
Nodes (8): PgWatermarks, Adapters, Adapters, adaptersOf(), deps(), §4.1 — Closing one gate item (G-N), §4.2 — The 1.0.0 tag gate, §4 — Gate-item close criteria and the 1.0.0 tag gate

### Community 12 - "ValidationError"
Cohesion: 0.09
Nodes (32): ValidationError, LeaseFaultError, UnrecognizedPostgresError, exceedsMaxDepth(), Requirement: Connection loss during lease acquisition or holding surfaces as LeaseFaultError, Requirement: releaseLease rejects a lease that is not currently held, Scenario: A dead held connection surfaces as LeaseFaultError on release, not LeaseNotHeldError, Scenario: A reservation failure during acquireLease surfaces as LeaseFaultError (+24 more)

### Community 13 - "sync-service.ts"
Cohesion: 0.11
Nodes (18): IndexerBlock, IndexerClient, IndexerClientError, IndexerClientOptions, IndexerClientParseError, IndexerTransaction, NodeRpcClientOptions, ChainArchiveSyncService (+10 more)

### Community 136 - "no-chain-sync-import-guard.test.ts"
Cohesion: 0.43
Nodes (5): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles()

### Community 14 - "PgTransactionHistoryStorage"
Cohesion: 0.10
Nodes (31): TransactionHistoryStorage, PgTransactionHistoryStorage, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation), Do not build (obsoleted — confirmed against real source) (+23 more)

### Community 15 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 152 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 16 - "differential-equivalence.test.ts"
Cohesion: 0.11
Nodes (29): Fault, adaptersFor(), adaptersOf(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1() (+21 more)

### Community 2 - "PgTemporalKV"
Cohesion: 0.10
Nodes (36): AsOf, AssertExact, JsonValue, Key, Namespace, Scope, Version, VersionedEntry (+28 more)

### Community 20 - "cursor-durability.crash.test.ts"
Cohesion: 0.09
Nodes (27): InvariantResult, adaptersFor(), adaptersOf(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs(), durableKvValues(), itemKey() (+19 more)

### Community 24 - "setup.ts"
Cohesion: 0.09
Nodes (25): Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount() (+17 more)

### Community 25 - "ChunkMissingError"
Cohesion: 0.14
Nodes (23): CheckpointNotFoundError, CheckpointStoreError, ChunkIntegrityError, ChunkMissingError, ManifestCorruptError, 3.3 CheckpointStore, CheckpointStore tables, 5. Testable-law deliverable (fast-check + Vitest) (+15 more)

### Community 28 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 29 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 3 - "TransactionHandle"
Cohesion: 0.08
Nodes (38): TransactionHistoryReader, TransactionHistoryWriter, Rollback, TransactionHandle, TransactionHandleInvalidError, ApplicationError, withAbort(), raceAgainstAbort() (+30 more)

### Community 30 - "CheckpointStore"
Cohesion: 0.13
Nodes (21): CheckpointStore, encode(), Build (one product module + one thin envelope — corrected from the original "exactly two things, zero new code" framing; see finding below), The surface, Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary (+13 more)

### Community 32 - "saveAndAdvance"
Cohesion: 0.12
Nodes (22): SaveAndAdvanceCursor, SaveAndAdvanceDeps, saveAndAdvance(), 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state (+14 more)

### Community 34 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.18
Nodes (19): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+11 more)

### Community 37 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+12 more)

### Community 38 - "chain-archive-rollover.ts"
Cohesion: 0.13
Nodes (21): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+13 more)

### Community 39 - "PgWalletStateEnvelopeStore"
Cohesion: 0.08
Nodes (20): PgWalletStateEnvelopeStore, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on), Scenario: The restored wallet resumes from its snapshot cursor and still sees the prior transaction, Acceptance — v1.0.0 API Surface & Release Contract, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG (+12 more)

### Community 4 - "harness.ts"
Cohesion: 0.14
Nodes (33): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, HotRatio, LatencyStats (+25 more)

### Community 40 - "frozen-types.test.ts"
Cohesion: 0.14
Nodes (17): CheckpointSequence, CheckpointStoreErrorCode, HistoryOptions, SaveCheckpointOptions, WalletStateEnvelope, AggregateRow, ChunkJoinRow, ManifestRow (+9 more)

### Community 41 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (11): GcPass, HistGroup, SampleObservation, kvMapKey(), newPool(), readCurrentState(), { connectionUri }, DECLARED_ENVELOPE (+3 more)

### Community 43 - "ChainArchiveStore"
Cohesion: 0.10
Nodes (10): ChainArchiveStore, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents, `transactions` (chain_archive) (+2 more)

### Community 45 - "pg-kill-save.crash.test.ts"
Cohesion: 0.12
Nodes (18): C5AnyFn, assertSaveNotAutoRetriedUnderRetriableFault(), assertSaveNotInAnyAutoRetryAllowlist(), completeManifestCount(), completeManifestCountAtSeq(), danglingChunkCount(), listSrcTsFiles(), makeSerializationFaultInjectingClient() (+10 more)

### Community 47 - "CheckpointSummary"
Cohesion: 0.12
Nodes (19): CheckpointRecord, CheckpointSummary, ContentHash, CheckpointStore (`src/interfaces/checkpoint-store.ts`), 4. `load` — full verification, no exceptions, 5. `history` — pagination, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: load rejects a manifest whose recorded chunk-hash sequence was tampered with, even when every chunk individually verifies (+11 more)

### Community 48 - "TemporalKV"
Cohesion: 0.14
Nodes (14): TemporalKV, 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.5 Naming, 1. Shared Conventions, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout (+6 more)

### Community 49 - "What changes — the 1.0.0 gate items this change addresses"
Cohesion: 0.23
Nodes (12): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+4 more)

### Community 53 - "interfaces/chain-archive-store.ts"
Cohesion: 0.13
Nodes (16): BlobRole, BlockBundle, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult, VerifierKeyObservationRecord (+8 more)

### Community 54 - "transaction-history-storage.property.test.ts"
Cohesion: 0.12
Nodes (15): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+7 more)

### Community 55 - "NodeRpcClient"
Cohesion: 0.18
Nodes (6): NodeRpcClient, NodeRpcError, NodeRpcInvalidHeightError, NodeRpcParseError, SubstrateBlock, SubstrateHeader

### Community 63 - "PgCheckpointStore"
Cohesion: 0.26
Nodes (11): PruneResult, PgCheckpointStore, countChunks(), measureDedup(), runCheckpointWorkloads(), assertValidCheckpointIds(), invoke(), Requirement: load and history read a consistent snapshot immune to a concurrently-committing prune (+3 more)

### Community 67 - "crash-worker.ts"
Cohesion: 0.20
Nodes (14): CoTxCallable, CoTxPauseInfo, CrashHook, describeCaughtError(), main(), observeClientPauseBeforeCursor(), pauseThenResume(), pauseUntilKilled() (+6 more)

### Community 68 - "load-under-prune.integration.test.ts"
Cohesion: 0.14
Nodes (13): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), runUnSnapshottedReadUnderPrune(), seedCheckpoints() (+5 more)

### Community 69 - "UmbraDBSql"
Cohesion: 0.18
Nodes (7): BenchEnv, UmbraDBSql, bootstrapChainArchiveSchema(), MAX_BLOCKS, service, sql, MAX

### Community 7 - "postgres/transaction-lease.ts"
Cohesion: 0.10
Nodes (24): Lease, LeaseAcquireOptions, TransactionOptions, TransactionRollbackCause, HeldLease, InjectedReleaseFaultLayer, abortError(), reserveBounded() (+16 more)

### Community 70 - "save-and-advance.test.ts"
Cohesion: 0.22
Nodes (8): WatermarkKey, WatermarkKind, WatermarkValue, WatermarkRow, { sql: getSql, connectionUri }, 3.4 Watermarks, Watermarks (`src/interfaces/watermarks.ts`), 4. Large-integer cursor values — a documented convention, not a schema change

### Community 71 - "errors.ts"
Cohesion: 0.17
Nodes (13): PgDriverError, isConnectionFailure(), isPgDriverError(), isStatementTimeout(), CHAIN_ARCHIVE_CHECK_TABLE_PREFIXES, CHAIN_ARCHIVE_INVARIANT_CONSTRAINT_NAMES, CONNECTION_FAILURE_CODES, 0. Package layout (+5 more)

### Community 72 - "UmbraDBConnectionOptions"
Cohesion: 0.15
Nodes (14): UmbraDBConnectionOptions, Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, Whole-change gates (non-goal compliance + sequencing), 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+6 more)

### Community 74 - "postgres/transaction-history-storage.ts"
Cohesion: 0.24
Nodes (14): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+6 more)

### Community 77 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.14
Nodes (13): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, EntryContentSchema, EntryLifecycleSchema, EntrySectionsSchema, FinalizedLifecycleSchema (+5 more)

### Community 79 - "Added"
Cohesion: 0.21
Nodes (7): TransactionLeaseLayer, Migration, RunMigrationsOptions, contendOnce(), Added, 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), 4. The freeze: the public barrel (G1)

### Community 8 - "translatePostgresError"
Cohesion: 0.14
Nodes (19): BlockMeta, BlockRecord, Hex32, TransactionMeta, BlockRow, ChainArchiveTx, PgChainArchiveStore, TxRow (+11 more)

### Community 84 - "durability-probe.test.ts"
Cohesion: 0.31
Nodes (9): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit(), probeAdvisoryLockVisibility() (+1 more)

### Community 86 - "VersionConflictError"
Cohesion: 0.20
Nodes (11): VersionConflictError, 3.1 Transaction/Lease layer, 3.2 TemporalKV, 3. Module Interfaces, Requirement: put's CAS guard distinguishes conflict from absence, Scenario: CAS against a never-written key reports actual as undefined, Scenario: CAS conflict against an existing key reports the actual version, Requirement: put's CAS guard distinguishes conflict from absence (+3 more)

### Community 94 - "gc.ts"
Cohesion: 0.24
Nodes (10): GcCurve, GcPoint, GcScaleOpts, adjudicate(), measureGcPass(), populateChunks(), runGcScale(), ENVELOPE_MAX_CHUNKS (+2 more)

### Community 101 - "hasPostgresUnsafeText"
Cohesion: 0.18
Nodes (11): hasPostgresUnsafeText(), jsonValueHasUnsafeText(), CheckpointIdSchema, JsonValueInnerSchema, HashSchema, IdentifierSchema, SafeObjectKeySchema, SafeStringSchema (+3 more)

### Community 102 - "transaction-history-storage.test.ts"
Cohesion: 0.20
Nodes (7): decodeSerializedContent(), decodeSerializedEntry(), store(), txLayer(), THS_RESERVED_KEY_PREFIX, FAKE_TX, { sql: getSql }

### Community 138 - "watermarks.test.ts"
Cohesion: 0.25
Nodes (4): store(), txLayer(), FAKE_TX, { sql: getSql, connectionUri }

### Community 146 - "decode"
Cohesion: 0.48
Nodes (7): decode(), Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Scenario: A future-versioned envelope is rejected cleanly, Scenario: An unknown top-level field is rejected as a typed envelope error (F7), Scenario: Non-JSON bytes are rejected as a typed envelope error, Scenario: Structurally invalid JSON is rejected as a typed envelope error

### Community 153 - "wallet-state-envelope.property.test.ts"
Cohesion: 0.33
Nodes (6): safeNonEmptyString(), safeString(), envelope(), ENVELOPE_VERSION, arbitraryEnvelope, subWalletSlot

### Community 22 - "runMigrations"
Cohesion: 0.10
Nodes (28): isLockTimeout(), runMigrations(), runMigrationsImpl(), withReservedTransaction(), 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 3. `synchronous_commit` — probe-warned, never refused, 4. Session-mode connection pooling only — probe-enforced (best-effort) (+20 more)

### Community 27 - "registerSuiteLifecycle"
Cohesion: 0.09
Nodes (19): store(), store(), registerSuiteLifecycle(), startTestDatabase(), stopTestDatabase(), kv(), store(), { sql: getSql } (+11 more)

### Community 31 - "ADDED Requirements"
Cohesion: 0.08
Nodes (26): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence (+18 more)

### Community 35 - "ref_node_fs"
Cohesion: 0.11
Nodes (10): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli (+2 more)

### Community 46 - "withSuiteWatchdog"
Cohesion: 0.14
Nodes (19): completeManifestCount(), completeManifestCountAtSeq(), danglingChunkCount(), junctionRowCount(), manifestRowCountAtSeq(), orphanJunctionCount(), pool(), completeManifestCount() (+11 more)

### Community 50 - "pack-install.mjs"
Cohesion: 0.17
Nodes (15): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin (+7 more)

### Community 6 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 65 - ".loadImpl"
Cohesion: 0.16
Nodes (12): sha256(), splitChunks(), toHex(), toSummary(), Requirement: save accepts and joins a caller-supplied transaction handle, Scenario: A checkpoint saved on a caller transaction commits with it, Scenario: A checkpoint saved on a caller transaction that rolls back leaves no trace, Scenario: save on a caller transaction behaves identically to the internal-transaction path for a reader (+4 more)

### Community 73 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 78 - "lease-nonwedge.crash.test.ts"
Cohesion: 0.18
Nodes (13): worker(), class2AdvisoryLockCountForHash(), pollForLockGone(), pool(), sleep(), worker(), worker(), worker() (+5 more)

### Community 80 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.15
Nodes (12): entry(), tier1_wallet lineage, `transaction_history`, Wallet State Envelope, `watermarks`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers (+4 more)

### Community 88 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.18
Nodes (11): coerceToSafeNumber(), 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6) (+3 more)

### Community 92 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 100 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 103 - "README.md"
Cohesion: 0.40
Nodes (3): Scope and pre-1.0 note, The three commitments, UmbraDB Stability Policy (SemVer)

### Community 104 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 105 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 106 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.20
Nodes (9): Benchmarks, Compatibility, and what 1.0.0 needs, If you build from source, Installing, Security, The fix this release exists for, UmbraDB 0.9.5 "Penumbra", What is proved, and what that is worth (+1 more)

### Community 107 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 108 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 109 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 11 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+29 more)

### Community 110 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 111 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 112 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 113 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 115 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 116 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 117 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 119 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.22
Nodes (8): 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 120 - "Tasks — Sprint 7: Transaction History Storage"
Cohesion: 0.22
Nodes (8): 0. Specification freeze, 1. Vendor/pin manifest, 2. Schema + interface, 3. PgTransactionHistoryStorage implementation, 4. WalletState envelope, 6. Live-sync tier (nightly/labeled — blocked on design.md §7's open question), 7. Close-out, Tasks — Sprint 7: Transaction History Storage

### Community 121 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding), 7. Testing strategy (post-implementation), Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 122 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 123 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 124 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 125 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 126 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.25
Nodes (6): Superseded — see `Formal/STORAGE_ALGEBRA.md`, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 127 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.25
Nodes (8): 1. Durability contract, 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 128 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 129 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 130 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 131 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 132 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 133 - "Design — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 9. Migration (`003_watermarks.ts`), Design — Sprint 4: Watermarks

### Community 134 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.25
Nodes (7): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 4. Pg-only conformance suite (required merge gate) — `test:conformance`, 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 135 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 139 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 140 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 141 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 142 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 143 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 144 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 145 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 147 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.29
Nodes (6): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, What changes, Why

### Community 148 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.29
Nodes (6): 1. G13 — perf-correctness fixes (LAND FIRST), 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 149 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 150 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 151 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 154 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 155 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 156 - "2.1 The boundary rule (the feature's key design decision)"
Cohesion: 0.33
Nodes (5): 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 5. Acceptance criteria status, Full-Chain Storage

### Community 157 - "1. The twenty gate items"
Cohesion: 0.33
Nodes (6): 1. The twenty gate items, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`), Track B — Durable composition (`openspec/changes/v1.0.0-durable-checkpoint-cursor`, merged `e5fcdaa`, `2cb5d00`), Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`), Track E — Security posture (`openspec/changes/v1.0.0-infosec-signoff`, merged `7ee8a4b`)

### Community 158 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 159 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 160 - "temporal-kv (transaction-participation wiring)"
Cohesion: 0.33
Nodes (5): ADDED Requirements, MODIFIED Requirements, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API, temporal-kv (transaction-participation wiring)

### Community 161 - "Tasks — Sprint 4: Watermarks"
Cohesion: 0.33
Nodes (5): 0. Schema, 2. `get`, 4. Property test (`Formal/STORAGE_ALGEBRA.md` §5), 5. Sprint close-out, Tasks — Sprint 4: Watermarks

### Community 162 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 163 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 164 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 165 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 166 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 167 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 168 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 169 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 17 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+23 more)

### Community 170 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 171 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 172 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 173 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 174 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 175 - "Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network"
Cohesion: 0.40
Nodes (5): Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Scenario: A rolled-back save consumes no sequence number, Scenario: Concurrent saves for one wallet+network still produce a gapless, non-repeating sequence, Scenario: Different wallet+network pairs have independent sequence counters, Scenario: Sequential saves for one wallet+network produce consecutive sequence numbers

### Community 176 - "Requirement: load and history distinguish "no checkpoint" from "checkpoint exists elsewhere""
Cohesion: 0.40
Nodes (5): Requirement: load and history distinguish "no checkpoint" from "checkpoint exists elsewhere", Scenario: history for a wallet+network with no checkpoints resolves empty, Scenario: No checkpoint exists for the wallet+network at all, Scenario: Omitting sequence loads the latest checkpoint, Scenario: The wallet+network has checkpoints but not at the requested sequence

### Community 177 - "Proposal — Sprint 4: Watermarks"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, Why

### Community 178 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 179 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 18 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (28): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 6. Nix — nixpkgs packages (from the locked nixpkgs), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies (+20 more)

### Community 180 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 181 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 182 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 183 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.50
Nodes (3): Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes

### Community 184 - "Requirement: load always fully verifies chunk integrity before returning"
Cohesion: 0.50
Nodes (4): Requirement: load always fully verifies chunk integrity before returning, Scenario: A checkpoint whose stored chunk content matches its recorded hash loads successfully, Scenario: A chunk whose stored content no longer matches its recorded hash is rejected, Scenario: A manifest referencing a chunk absent from storage is rejected

### Community 185 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 186 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 188 - "6. Lean 4 feasibility"
Cohesion: 0.67
Nodes (3): 6.1 Approved M1 module layout, 6.2 First theorem tranche, 6. Lean 4 feasibility

### Community 19 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+22 more)

### Community 190 - "Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed"
Cohesion: 0.67
Nodes (3): Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level, Scenario: Sequential puts to the same key in separate transactions succeed, outside the millisecond-collision caveat

### Community 191 - "Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed"
Cohesion: 0.67
Nodes (3): Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level, Scenario: Sequential puts to the same key in separate transactions succeed, outside the millisecond-collision caveat

### Community 192 - "dependencies"
Cohesion: 0.67
Nodes (3): dependencies, postgres, zod

### Community 193 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 21 - "Full-Chain Storage — Design"
Cohesion: 0.07
Nodes (29): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+21 more)

### Community 23 - "Requirements"
Cohesion: 0.07
Nodes (28): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy (+20 more)

### Community 26 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy (+19 more)

### Community 33 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: a caller-supplied transaction handle is honored, not silently ignored, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: set rejects an invalid value with ValidationError before any statement (+17 more)

### Community 36 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1), Requirement: Transactions commit or roll back atomically (+16 more)

### Community 42 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.09
Nodes (22): Boundary held, Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7), Rework (class 1 — infra) (+14 more)

### Community 44 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 5 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 51 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 52 - "package.json"
Cohesion: 0.11
Nodes (18): description, exports, files, homepage, license, main, name, type (+10 more)

### Community 56 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 57 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 58 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 59 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.12
Nodes (16): 0. Package layout, 1.1 The gap, confirmed in source, 1.2 Change `save` to accept a caller transaction, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 2.2 The three durability settings, 2.3 Transaction-pooler detection (+8 more)

### Community 60 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: PgCheckpointStore validates walletId and networkId at every entry point, Requirement: the required Postgres configuration is published as a binding Durability Contract, Requirement: withLease surfaces a lease-release failure instead of swallowing it, Scenario: a clean release is unaffected, Scenario: a release failure after a successful fn, with a callback, resolves and reports (+8 more)

### Community 61 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, archive:sync, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 62 - "ROADMAP.md"
Cohesion: 0.12
Nodes (11): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+3 more)

### Community 64 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.12
Nodes (16): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+8 more)

### Community 66 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 75 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, effect, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql, tinybench (+6 more)

### Community 76 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 81 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 82 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.15
Nodes (13): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §5 — Run log (+5 more)

### Community 83 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 85 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.17
Nodes (12): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`) (+4 more)

### Community 87 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.17
Nodes (10): 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, UmbraDB v0.9.5 "Penumbra" — Release Record, UmbraDB v1.0.0 — Release Record (PENDING) (+2 more)

### Community 89 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover), 7. What this change deliberately does not verify (traceability of the non-goals) (+3 more)

### Community 9 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+30 more)

### Community 90 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 91 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 93 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 95 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.18
Nodes (7): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Storage Types — reference for formalization, What's NOT in scope for this formalization

### Community 96 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 97 - "3. Proof-blocking findings"
Cohesion: 0.18
Nodes (11): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption (+3 more)

### Community 98 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.18
Nodes (10): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 6. Migration (`002_checkpoint_store.ts`) (+2 more)

### Community 99 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.18
Nodes (10): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 3.1 The frozen catalog (the machine-facing API), 3. G3 — Frozen, cleaned error-code catalog with `retryable`, 5. G20 — Freeze the Lean cut-line (+2 more)

## Knowledge Gaps
- **12 isolated node(s):** `local>midnightntwrk/renovate-config`, `PGPASSFILE`, `PYTHONHASHSEED`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1391 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `runMigrations()` connect `runMigrations` to `src/index.ts`, `createClient`, `PgTemporalKV`, `TransactionHandle`, `harness.ts`, `translatePostgresError`, `ADDED Requirements`, `ValidationError`, `cursor-durability.crash.test.ts`, `Full-Chain Storage — Design`, `Tasks — v1.0.0-perf-baseline`, `setup.ts`, `registerSuiteLifecycle`, `1. The twenty gate items`, `saveAndAdvance`, `Tasks — Sprint 4: Watermarks`, `chain-archive-rollover.ts`, `PgWalletStateEnvelopeStore`, `frozen-types.test.ts`, `Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)`, `CheckpointSummary`, `TemporalKV`, `What changes — the 1.0.0 gate items this change addresses`, `Design — v1.0.0-durable-checkpoint-cursor`, `UmbraDBSql`, `UmbraDBConnectionOptions`, `UmbraDB`, `Added`, `Design — Sprint 7: Transaction History Storage`, `durability-probe.test.ts`, `Design — v1.0.0 API Surface & Release Contract`, `README.md`, `PgWatermarks`, `UmbraDB 1.0.0 Release Contracts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 19 INFERRED edges - model-reasoned connections that need verification._
- **What connects `local>midnightntwrk/renovate-config`, `PGPASSFILE`, `PYTHONHASHSEED` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06758742286218043 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `createClient` to `src/index.ts`, `PgTemporalKV`, `TransactionHandle`, `postgres/transaction-lease.ts`, `no-chain-sync-import-guard.test.ts`, `PgTransactionLeaseLayer`, `watermarks.test.ts`, `sync-service.ts`, `differential-equivalence.test.ts`, `cursor-durability.crash.test.ts`, `setup.ts`, `wallet-state-envelope.property.test.ts`, `registerSuiteLifecycle`, `pg-tx-history-adapter.ts`, `check-required-tests.ts`, `cold-boot-recovery.integration.test.ts`, `ref_node_fs`, `chain-archive-replay-decode.integration.test.ts`, `frozen-types.test.ts`, `full-sync-soak.integration.test.ts`, `pg-kill-save.crash.test.ts`, `withSuiteWatchdog`, `What changes — the 1.0.0 gate items this change addresses`, `package.json`, `interfaces/chain-archive-store.ts`, `transaction-history-storage.property.test.ts`, `NodeRpcClient`, `load-under-prune.integration.test.ts`, `UmbraDBSql`, `save-and-advance.test.ts`, `mutation-per-adapter.mjs`, `lease-nonwedge.crash.test.ts`, `durability-probe.test.ts`, `facade-merge-loader.ts`, `transaction-history-storage.test.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Are the 41 inferred relationships involving `ValidationError` (e.g. with `1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors` and `1.4 Runtime validation`) actually correct?**
  _`ValidationError` has 41 INFERRED edges - model-reasoned connections that need verification._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.06892230576441102 - nodes in this community are weakly interconnected._