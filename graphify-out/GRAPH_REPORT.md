# Graph Report - UmbraDB

## Corpus Check
- 367 files · ~600,238 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .lean 25, (none) 8, .toml 1)

## Summary
- 3465 nodes · 7187 edges · 245 communities (219 shown, 26 thin omitted)
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 1457 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `57b65f7c4dee1183` (367 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- StorageError
- createClient
- CheckpointStore
- setup.ts
- no-chain-sync-import-guard.test.ts
- TransactionHandle
- withSuiteWatchdog
- chain-archive-sync-retry.integration.test.ts
- mutation-evidence.d.mts
- cursor-durability.crash.test.ts
- interfaces/transaction-history-storage.ts
- harness.ts
- LeaseFaultError
- pg-tx-history-adapter.ts
- cold-boot-recovery.integration.test.ts
- ChunkMissingError
- ValidationError
- storage-errors.ts
- check-required-tests.ts
- translatePostgresError
- PgTemporalKV
- TransactionHistoryEntry
- chain-archive-replay-decode.integration.test.ts
- full-sync-soak.integration.test.ts
- sync-service.ts
- ChainArchiveStore
- PgTransactionLeaseLayer
- interfaces/temporal-kv.ts
- What changes — the 1.0.0 gate items this change addresses
- withAbort
- ref_node_path
- pg-kill-save.crash.test.ts
- chain-archive-rollover.ts
- PgTransactionHistoryStorage
- .save
- postgres/chain-archive-store.ts
- transaction-history-storage.property.test.ts
- NodeRpcClient
- src/index.ts
- durability-probe.test.ts
- postgres/transaction-history-storage.ts
- PgWatermarks
- PgCheckpointStore
- crash-worker.ts
- load-under-prune.integration.test.ts
- differential-equivalence.test.ts
- postgres/checkpoint-store.ts
- IndexerClient
- ws-mutual-tls.test.ts
- midnight-env — reproducible PREPROD dev environment
- 4. The freeze: the public barrel (G1)
- DurabilityContractError
- Design — v1.0.0-perf-baseline
- facade-merge-loader.ts
- Design — Sprint 7: Transaction History Storage
- read
- graph.py
- .getAt
- lease-nonwedge.crash.test.ts
- pglite.test.ts
- runMigrations
- vitest
- mutation-per-adapter.mjs
- pack-install.mjs
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- 3. Proof-blocking findings
- Design — Sprint 2: Transaction/Lease
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- explore.md
- Design — Postgres+JSONB storage rebuild
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Design — Sprint 3: CheckpointStore
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Design — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- Scalability ceilings (v1.0.0)
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- Design — Sprint 4: Watermarks
- Tasks — v1.0.0-infosec-signoff
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Contributing
- Checkpoint-store composition contract — cursor ordering and replay
- UmbraDB 1.0.0 Release Contracts
- Global Constraints
- Storage Algebra Lean M3a Watermarks Sprint
- Security policy & threat model
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- ADDED Requirements
- Acceptance criteria — v1.0.0-infosec-signoff
- ROADMAP.md
- Repository agent policy
- Our Pledge
- Midnight infra verification checklist
- 2.1 The boundary rule (the feature's key design decision)
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 12. Milestone status
- ADDED Requirements
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — v1.0.0 API Surface & Release Contract
- Proposal — v1.0.0-perf-baseline
- Tasks — v1.0.0-perf-baseline
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- ADDED Requirements
- [0.9.5] - 2026-07-25 — "Penumbra"
- UmbraDB — project instructions
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Preprod connection — endpoints, wallet, faucet
- 1. The twenty gate items
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Algebraic Specification of the midnight-pg-store Storage Layer
- Proposal — Sprint 1: project setup + TemporalKV
- 5. Ledger
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0-durable-checkpoint-cursor
- Design — v1.0.0: Formal completion (`formal-completion`)
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network
- Proposal — v1.0.0 API Surface & Release Contract
- Acceptance criteria — v1.0.0-perf-baseline
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- ADDED Requirements
- GC architecture and query-tracing: research findings
- PULL_REQUEST_CHECKLIST.md
- 9. Trust and refinement boundary
- documentation-improvement.md
- Overview
- Test wallets
- Requirement: listKeys streams without materializing the full result set first, and orders results correctly
- 1. TemporalKV
- What changes
- Spec — capability `formal-completion`
- Requirement: listKeys streams without materializing the full result set first, and orders results correctly
- renovate.json
- Environment changelog
- UmbraDB Stability Policy (SemVer)
- start-stack.sh
- Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed
- Requirement: put's CAS guard distinguishes conflict from absence
- Requirement: Schema isolation is the default, not opt-in
- Requirement: Unconditional writes are gapless and monotonic (Law T1)
- ADDED Requirements
- temporal-kv (transaction-participation wiring)
- Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed
- Requirement: Migrations are idempotent and ordered
- Requirement: put's CAS guard distinguishes conflict from absence
- Requirement: Schema isolation is the default, not opt-in
- repository
- run.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bugs
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- ADDED Requirements
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- scripts
- Design — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- ADDED Requirements
- Roadmap
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- devDependencies
- REMOVED Requirements
- UmbraDB
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `PgTransactionLeaseLayer` - 93 edges
2. `ValidationError` - 87 edges
3. `PgCheckpointStore` - 87 edges
4. `runMigrations()` - 85 edges
5. `translatePostgresError()` - 78 edges
6. `createClient()` - 74 edges
7. `vitest` - 73 edges
8. `UmbraDBSql` - 72 edges
9. `StorageError` - 70 edges
10. `TransactionHandle` - 70 edges

## Surprising Connections (you probably didn't know these)
- `Rework (class 1 — infra)` --references--> `ConnectionError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/storage-errors.ts
- `G4 — Contract doc set (all true)` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/acceptance.md → src/interfaces/storage-errors.ts
- `Scenario: The save-retry caveat states the re-check rule and the deferral` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/specs/release-contract/spec.md → src/interfaces/storage-errors.ts
- `2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2)` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/v1.0.0-recovery-testing/tasks.md → src/interfaces/storage-errors.ts
- `3.2 Lifecycle-detail fidelity — the correctness-gate open question` --references--> `SerializationFailedError`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → src/interfaces/storage-errors.ts

## Import Cycles
- None detected.

## Communities (245 total, 26 thin omitted)

### Community 0 - "StorageError"
Cohesion: 0.05
Nodes (69): ConnectionError, Retryability, SerializationFailedError, StorageError, HistoryUnavailableError, TemporalKVError, TransactionKeyReuseError, VersionConflictError (+61 more)

### Community 1 - "createClient"
Cohesion: 0.06
Nodes (28): BlockRow, TxRow, bootstrapChainArchiveSchema(), assertNoConflictingSearchPath(), assertValidSchemaName(), createClient(), apply(), bundleFixture() (+20 more)

### Community 10 - "CheckpointStore"
Cohesion: 0.08
Nodes (35): CheckpointStore, TemporalKV, Watermarks, 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`), 9. Module → module mapping (source of truth for `tasks.md`), 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation (+27 more)

### Community 11 - "setup.ts"
Cohesion: 0.07
Nodes (31): Method, Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, InjectedReleaseFaultLayer, makeStore() (+23 more)

### Community 114 - "no-chain-sync-import-guard.test.ts"
Cohesion: 0.27
Nodes (7): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles(), ANSWER_WASM, esbuild

### Community 12 - "TransactionHandle"
Cohesion: 0.09
Nodes (31): TransactionHistoryReader, TransactionHistoryWriter, TransactionHandle, TransactionHandleInvalidError, registerTransaction(), resolveTransaction(), unregisterTransaction(), Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored (+23 more)

### Community 13 - "withSuiteWatchdog"
Cohesion: 0.08
Nodes (37): SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount(), pool(), watermarkCount(), worker(), worker(), worker() (+29 more)

### Community 139 - "chain-archive-sync-retry.integration.test.ts"
Cohesion: 0.33
Nodes (7): BlockBundle, FakeChainBlock, fakeChain(), fakeIndexerFetch(), fakeNodeFetch(), hx(), newService()

### Community 169 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 18 - "cursor-durability.crash.test.ts"
Cohesion: 0.07
Nodes (29): InvariantResult, CrashWorkerHandle, adaptersFor(), adaptersOf(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs(), durableKvValues() (+21 more)

### Community 19 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.07
Nodes (29): MergeEntriesFn, isPlainObject(), mergeSections(), referenceMergeEntries(), decodeSerializedContent(), decodeSerializedEntry(), store(), txLayer() (+21 more)

### Community 2 - "harness.ts"
Cohesion: 0.09
Nodes (47): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+39 more)

### Community 21 - "LeaseFaultError"
Cohesion: 0.11
Nodes (28): Lease, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, abortError(), raceAgainstAbort(), reserveBounded(), resetStatementTimeout() (+20 more)

### Community 23 - "pg-tx-history-adapter.ts"
Cohesion: 0.08
Nodes (29): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+21 more)

### Community 25 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.13
Nodes (17): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), EXPECTED_NIGHT_VALUE, EXPECTED_UNSHIELDED_ADDRESS (+9 more)

### Community 27 - "ChunkMissingError"
Cohesion: 0.12
Nodes (27): CheckpointNotFoundError, CheckpointStoreError, ChunkIntegrityError, ChunkMissingError, ManifestCorruptError, CheckpointStore tables, tier1_wallet lineage, Wallet State Envelope (+19 more)

### Community 29 - "ValidationError"
Cohesion: 0.11
Nodes (27): ValidationError, UnrecognizedPostgresError, exceedsMaxDepth(), Requirement: prune rejects a retainCount that is not a positive safe integer, before any deletion runs, Scenario: A non-integer or non-finite retainCount is rejected with no effect, Scenario: An integer retainCount outside the safe integer range is rejected with no effect, Scenario: retainCount of zero is rejected with no effect, 2. `set` (+19 more)

### Community 3 - "storage-errors.ts"
Cohesion: 0.06
Nodes (44): EnvelopeCorruptError, EnvelopeVersionUnsupportedError, WalletStateEnvelope, WalletStateEnvelopeError, PgDriverError, PgWalletStateEnvelopeStore, decode(), encode() (+36 more)

### Community 31 - "check-required-tests.ts"
Cohesion: 0.14
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 32 - "translatePostgresError"
Cohesion: 0.22
Nodes (10): Hex32, TransactionMeta, PgChainArchiveStore, assertHex32(), hexToBuf(), sha256Hex(), toTxMeta(), translatePostgresError() (+2 more)

### Community 34 - "PgTemporalKV"
Cohesion: 0.24
Nodes (15): AsOf, Key, Namespace, Scope, Version, VersionedEntry, PgTemporalKV, toEntry() (+7 more)

### Community 35 - "TransactionHistoryEntry"
Cohesion: 0.15
Nodes (7): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 36 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+12 more)

### Community 37 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (11): GcPass, HistGroup, SampleObservation, kvMapKey(), newPool(), readCurrentState(), { connectionUri }, DECLARED_ENVELOPE (+3 more)

### Community 38 - "sync-service.ts"
Cohesion: 0.18
Nodes (14): IndexerBlock, IndexerClientOptions, NodeRpcClientOptions, ChainArchiveSyncService, ChainArchiveSyncServiceOptions, SyncOnceResult, BridgeObservationRecord, TransactionRecord (+6 more)

### Community 39 - "ChainArchiveStore"
Cohesion: 0.09
Nodes (11): ChainArchiveStore, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, How the two lineages coexist, Table of contents (+3 more)

### Community 4 - "PgTransactionLeaseLayer"
Cohesion: 0.05
Nodes (31): BenchEnv, UmbraDBSql, HeldLease, PgTransactionLeaseLayer, ApplicationError, validateTransactionOptions(), store(), store() (+23 more)

### Community 41 - "interfaces/temporal-kv.ts"
Cohesion: 0.14
Nodes (21): AssertExact, JsonValue, _VersionedEntryInSync, KvRow, BatchSpec, CurrentState, CurrentState, CurrentState (+13 more)

### Community 42 - "What changes — the 1.0.0 gate items this change addresses"
Cohesion: 0.18
Nodes (15): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.1 The frozen catalog (the machine-facing API) (+7 more)

### Community 43 - "withAbort"
Cohesion: 0.13
Nodes (20): CheckpointRecord, assertValidCheckpointIds(), withAbort(), invoke(), Requirement: load always fully verifies chunk integrity before returning, Requirement: load and history distinguish "no checkpoint" from "checkpoint exists elsewhere", Requirement: load and history read a consistent snapshot immune to a concurrently-committing prune, Requirement: load rejects a manifest whose recorded chunk-hash sequence was tampered with, even when every chunk individually verifies (+12 more)

### Community 45 - "ref_node_path"
Cohesion: 0.10
Nodes (11): LockResult, kill(), check, checker, env, forwarded, repoRoot, reportPath (+3 more)

### Community 46 - "pg-kill-save.crash.test.ts"
Cohesion: 0.11
Nodes (19): C5AnyFn, assertSaveNotAutoRetriedUnderRetriableFault(), assertSaveNotInAnyAutoRetryAllowlist(), completeManifestCount(), completeManifestCountAtSeq(), danglingChunkCount(), listSrcTsFiles(), makeSerializationFaultInjectingClient() (+11 more)

### Community 47 - "chain-archive-rollover.ts"
Cohesion: 0.15
Nodes (18): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+10 more)

### Community 5 - "PgTransactionHistoryStorage"
Cohesion: 0.07
Nodes (43): TransactionHistoryStorage, PgTransactionHistoryStorage, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation), Build (one product module + one thin envelope — corrected from the original "exactly two things, zero new code" framing; see finding below) (+35 more)

### Community 50 - ".save"
Cohesion: 0.14
Nodes (16): CheckpointSummary, validateSaveOptions(), 1. Chunking and write path, 5. Sprint close-out, Tasks — Sprint 3: CheckpointStore, Requirement: save accepts and joins a caller-supplied transaction handle, Scenario: A checkpoint saved on a caller transaction commits with it, Scenario: A checkpoint saved on a caller transaction that rolls back leaves no trace (+8 more)

### Community 53 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (16): BlobRole, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult (+8 more)

### Community 55 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 58 - "NodeRpcClient"
Cohesion: 0.18
Nodes (6): NodeRpcClient, NodeRpcError, NodeRpcInvalidHeightError, NodeRpcParseError, SubstrateBlock, SubstrateHeader

### Community 6 - "src/index.ts"
Cohesion: 0.10
Nodes (43): CheckpointStoreErrorCode, ContentHash, HistoryOptions, SaveCheckpointOptions, SharedStorageErrorCode, TemporalKVErrorCode, EntryLifecycleStatus, FinalizedLifecycle (+35 more)

### Community 63 - "durability-probe.test.ts"
Cohesion: 0.23
Nodes (12): DurabilityViolation, DurabilityWarning, TransactionPoolerDetectedError, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit(), probeAdvisoryLockVisibility() (+4 more)

### Community 67 - "postgres/transaction-history-storage.ts"
Cohesion: 0.21
Nodes (15): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+7 more)

### Community 7 - "PgWatermarks"
Cohesion: 0.07
Nodes (34): WatermarkKey, WatermarkKind, WatermarkValue, PgWatermarks, WatermarkRow, Adapters, Adapters, adaptersOf() (+26 more)

### Community 72 - "PgCheckpointStore"
Cohesion: 0.15
Nodes (13): PruneResult, PgCheckpointStore, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+5 more)

### Community 75 - "crash-worker.ts"
Cohesion: 0.20
Nodes (14): CoTxCallable, CoTxPauseInfo, CrashHook, describeCaughtError(), main(), observeClientPauseBeforeCursor(), pauseThenResume(), pauseUntilKilled() (+6 more)

### Community 76 - "load-under-prune.integration.test.ts"
Cohesion: 0.14
Nodes (13): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), runUnSnapshottedReadUnderPrune(), seedCheckpoints() (+5 more)

### Community 8 - "differential-equivalence.test.ts"
Cohesion: 0.06
Nodes (43): Adapters, Fault, adaptersFor(), adaptersOf(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch() (+35 more)

### Community 81 - "postgres/checkpoint-store.ts"
Cohesion: 0.19
Nodes (11): CheckpointSequence, AggregateRow, ChunkJoinRow, ManifestRow, sha256(), splitChunks(), toHex(), toSummary() (+3 more)

### Community 84 - "IndexerClient"
Cohesion: 0.22
Nodes (4): IndexerClient, IndexerClientError, IndexerClientParseError, IndexerTransaction

### Community 86 - "ws-mutual-tls.test.ts"
Cohesion: 0.21
Nodes (9): Attempt, file(), makeCa(), makeLeaf(), openssl(), tlsClientErrors, ws, 6. Nix — nixpkgs packages (from the locked nixpkgs) (+1 more)

### Community 88 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 93 - "4. The freeze: the public barrel (G1)"
Cohesion: 0.26
Nodes (11): Migration, isConnectionFailure(), isLockTimeout(), isPgDriverError(), isStatementTimeout(), runMigrationsImpl(), withReservedTransaction(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5) (+3 more)

### Community 99 - "DurabilityContractError"
Cohesion: 0.21
Nodes (11): DurabilityContractError, 2.1 Where the probe runs (the one real design decision), 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract, Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap, Scenario: a standby-oriented synchronous_commit is treated as durable, not warned (+3 more)

### Community 100 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.18
Nodes (11): coerceToSafeNumber(), 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 4. G14 — benchmark harness, 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6) (+3 more)

### Community 104 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 107 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.18
Nodes (10): entry(), `transaction_history`, 4. Configuration, 4. Configuration, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted) (+2 more)

### Community 110 - "read"
Cohesion: 0.22
Nodes (11): connect(), read(), report(), 14. Private processes, 8. Private processes (PP), Requirement: PP-4 The process transport, Requirement: PP-6 Lockstep instances process each height at that height, Requirement: PP-9 What the public side may call (+3 more)

### Community 14 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 142 - ".getAt"
Cohesion: 0.25
Nodes (5): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why, Performance

### Community 151 - "lease-nonwedge.crash.test.ts"
Cohesion: 0.32
Nodes (7): class2AdvisoryLockCountForHash(), pollForLockGone(), pool(), sleep(), liveWorkers, openPools, { sql: getSql, connectionUri }

### Community 68 - "runMigrations"
Cohesion: 0.20
Nodes (15): runMigrations(), 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 3. `synchronous_commit` — probe-warned, never refused, 4. Session-mode connection pooling only — probe-enforced (best-effort), 5. Server-side timeouts — applied by `createClient` (documented), Summary, UmbraDB Durability Contract (+7 more)

### Community 73 - "vitest"
Cohesion: 0.12
Nodes (7): store(), txLayer(), settings, FAKE_TX, { sql: getSql, connectionUri }, DURABILITY, vitest

### Community 80 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 87 - "pack-install.mjs"
Cohesion: 0.31
Nodes (10): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin (+2 more)

### Community 101 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover), 7. What this change deliberately does not verify (traceability of the non-goals) (+3 more)

### Community 102 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 103 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 105 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 106 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 108 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 109 - "3. Proof-blocking findings"
Cohesion: 0.18
Nodes (11): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption (+3 more)

### Community 111 - "Design — Sprint 2: Transaction/Lease"
Cohesion: 0.16
Nodes (9): 0. Package layout, 6. Test infrastructure, Design — Sprint 2: Transaction/Lease, Prerequisite: Sprint 1 merged and archived (RESOLVED 2026-07-21), Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease, What changes (+1 more)

### Community 112 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.18
Nodes (10): 0. Package layout, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire, 3. G7 — Server-side timeouts, 6.1 The Fable-vs-Opus factual dispute (resolved by live test), 6.2 Blocking findings applied, 6.3 Non-blocking findings applied, 6.4 Non-blocking findings NOT changed (with reasoning — no finding rejected) (+2 more)

### Community 113 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 115 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 116 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.20
Nodes (10): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 7. Driver / toolkit choice (+2 more)

### Community 117 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 118 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 119 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 120 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 6. Migration (`002_checkpoint_store.ts`), 9. Test infrastructure (+1 more)

### Community 121 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.20
Nodes (9): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 4. Live preprod DB-sync verification (nightly/labeled), 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding), 7. Testing strategy (post-implementation) (+1 more)

### Community 122 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer), Audit resolution (+1 more)

### Community 123 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 124 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 125 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 126 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 127 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 128 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 129 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 130 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 131 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.22
Nodes (8): Benchmarks, Compatibility, and what 1.0.0 needs, Durability, Installing, Security, UmbraDB 0.9.5 "Penumbra", What is proved, and what that is worth, What this is not

### Community 132 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 133 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.22
Nodes (9): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, License summary (+1 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 135 - "Design — Sprint 4: Watermarks"
Cohesion: 0.22
Nodes (8): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 5. Accepted tradeoffs (explicit, not silently possible), 6. Composing Transaction/Lease, 7. Cancellation (`opts.signal`), 9. Migration (`003_watermarks.ts`), Design — Sprint 4: Watermarks

### Community 136 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 137 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 138 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 141 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 143 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 144 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.25
Nodes (8): 1. Durability contract, 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 145 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 146 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 147 - "Security policy & threat model"
Cohesion: 0.25
Nodes (8): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 148 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 149 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 15 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+30 more)

### Community 150 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 153 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 154 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 155 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 156 - "2.1 The boundary rule (the feature's key design decision)"
Cohesion: 0.29
Nodes (6): 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 5. Acceptance criteria status, Full-Chain Storage

### Community 157 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 158 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 159 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 16 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+30 more)

### Community 160 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 161 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 162 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 163 - "Tasks — v1.0.0 API Surface & Release Contract"
Cohesion: 0.29
Nodes (6): 3. The freeze: build + package.json (G1), 5. Release contract docs (G2, G4), 6. Freeze the Lean cut-line (G20), 7. Packed-tarball install smoke test (G1), 8. Change close-out, Tasks — v1.0.0 API Surface & Release Contract

### Community 164 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.29
Nodes (6): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, What changes, Why

### Community 165 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.29
Nodes (6): 1. G13 — perf-correctness fixes (LAND FIRST), 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 166 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 167 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 168 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 17 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+30 more)

### Community 170 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 171 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 173 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 174 - "1. The twenty gate items"
Cohesion: 0.33
Nodes (6): 1. The twenty gate items, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`), Track B — Durable composition (`openspec/changes/v1.0.0-durable-checkpoint-cursor`, merged `e5fcdaa`, `2cb5d00`), Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`), Track E — Security posture (`openspec/changes/v1.0.0-infosec-signoff`, merged `7ee8a4b`)

### Community 175 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 176 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.33
Nodes (6): 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 177 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 178 - "5. Ledger"
Cohesion: 0.33
Nodes (6): 5.1 The `LedgerPackage` interface (LG-6), 5.2 Vendored builds (LG-5), 5.3 The ledger worker and the node-store bridge (LG-10, LG-11), 5.4 Storage, retention and sweep (LG-11 to LG-14), 5.5 Ledger tasks (LG-17, Q49), 5. Ledger

### Community 179 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 180 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 181 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 182 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 183 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 184 - "Acceptance — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.33
Nodes (5): Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, Whole-change gates (non-goal compliance + sequencing)

### Community 185 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.33
Nodes (5): §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 186 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 187 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 188 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 189 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 190 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 191 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 192 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 193 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 194 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 195 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 196 - "Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network"
Cohesion: 0.40
Nodes (5): Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Scenario: A rolled-back save consumes no sequence number, Scenario: Concurrent saves for one wallet+network still produce a gapless, non-repeating sequence, Scenario: Different wallet+network pairs have independent sequence counters, Scenario: Sequential saves for one wallet+network produce consecutive sequence numbers

### Community 197 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, Why

### Community 198 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.40
Nodes (4): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first), G14 — benchmark harness + recorded baseline

### Community 199 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 20 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data responses name their view and height (+28 more)

### Community 200 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 202 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 203 - "9. Trust and refinement boundary"
Cohesion: 0.50
Nodes (4): 9. Trust and refinement boundary, Completed M1/M2/W1 claims, Deferred M2–M5 proof work, Named external obligations

### Community 204 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 205 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 206 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 207 - "Requirement: listKeys streams without materializing the full result set first, and orders results correctly"
Cohesion: 0.50
Nodes (4): Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Scenario: Aborting mid-iteration rejects with AbortError and releases the cursor, Scenario: Only the newest version of each key is yielded, Scenario: The first key is yielded before the full scan completes

### Community 208 - "1. TemporalKV"
Cohesion: 0.50
Nodes (3): 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV

### Community 209 - "What changes"
Cohesion: 0.50
Nodes (3): Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-durable-checkpoint-cursor, What changes

### Community 210 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 211 - "Requirement: listKeys streams without materializing the full result set first, and orders results correctly"
Cohesion: 0.50
Nodes (4): Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Scenario: Aborting mid-iteration rejects with AbortError and releases the cursor, Scenario: Only the newest version of each key is yielded, Scenario: The first key is yielded before the full scan completes

### Community 212 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 214 - "UmbraDB Stability Policy (SemVer)"
Cohesion: 0.67
Nodes (3): Scope and pre-1.0 note, The three commitments, UmbraDB Stability Policy (SemVer)

### Community 216 - "Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed"
Cohesion: 0.67
Nodes (3): Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level, Scenario: Sequential puts to the same key in separate transactions succeed, outside the millisecond-collision caveat

### Community 217 - "Requirement: put's CAS guard distinguishes conflict from absence"
Cohesion: 0.67
Nodes (3): Requirement: put's CAS guard distinguishes conflict from absence, Scenario: CAS against a never-written key reports actual as undefined, Scenario: CAS conflict against an existing key reports the actual version

### Community 218 - "Requirement: Schema isolation is the default, not opt-in"
Cohesion: 0.67
Nodes (3): Requirement: Schema isolation is the default, not opt-in, Scenario: A custom schema is honored end to end, Scenario: Default schema is used when none is specified

### Community 219 - "Requirement: Unconditional writes are gapless and monotonic (Law T1)"
Cohesion: 0.67
Nodes (3): Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: Sequential unconditional writes produce consecutive versions, Scenario: The CAS-guarded and unconditional paths agree on version assignment

### Community 22 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 221 - "Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed"
Cohesion: 0.67
Nodes (3): Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level, Scenario: Sequential puts to the same key in separate transactions succeed, outside the millisecond-collision caveat

### Community 222 - "Requirement: Migrations are idempotent and ordered"
Cohesion: 0.67
Nodes (3): Requirement: Migrations are idempotent and ordered, Scenario: A migration failure does not partially apply, Scenario: Running migrations twice is a no-op the second time

### Community 223 - "Requirement: put's CAS guard distinguishes conflict from absence"
Cohesion: 0.67
Nodes (3): Requirement: put's CAS guard distinguishes conflict from absence, Scenario: CAS against a never-written key reports actual as undefined, Scenario: CAS conflict against an existing key reports the actual version

### Community 224 - "Requirement: Schema isolation is the default, not opt-in"
Cohesion: 0.67
Nodes (3): Requirement: Schema isolation is the default, not opt-in, Scenario: A custom schema is honored end to end, Scenario: Default schema is used when none is specified

### Community 225 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 24 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+23 more)

### Community 26 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (30): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+22 more)

### Community 28 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)` (+21 more)

### Community 30 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 33 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate, Requirement: manifestHash is computed once at write time from the ordered chunk-hash sequence (+17 more)

### Community 40 - "ADDED Requirements"
Cohesion: 0.09
Nodes (22): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1), Requirement: Transactions commit or roll back atomically, Requirement: withLease always releases its lease, even when fn throws (+14 more)

### Community 44 - "package.json"
Cohesion: 0.09
Nodes (21): description, engines, node, exports, files, homepage, license, main (+13 more)

### Community 48 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not snapshotted, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+12 more)

### Community 49 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (20): 0. Pins and verification, 10. Node client and ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Snapshots, 16. Browser (+12 more)

### Community 51 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: A bare numeric watermark value round-trips exactly (+12 more)

### Community 52 - "ADDED Requirements"
Cohesion: 0.10
Nodes (21): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence, Requirement: the adapter round-trips SDK lifecycle detail so getAll yields schema-valid SDK entries (+13 more)

### Community 54 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 56 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 57 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 59 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (17): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 15. Snapshots and browser, 16. Whole system, 17. Required test ids added to the manifest, 1. Library surface (+9 more)

### Community 60 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block digests for modules that opt in, Requirement: DT-5 The `core-digest` part chains the digests, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A fractional JSON number (+9 more)

### Community 61 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+9 more)

### Community 62 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 64 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 65 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 66 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, archive:sync, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check (+9 more)

### Community 69 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Tables, 11. Refusals and halts (IN-12), 12. Exported surface and command (LS-1, LS-6), 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 2. Points, 3. Block source and ingest (+7 more)

### Community 70 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 71 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor first, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+7 more)

### Community 74 - "Roadmap"
Cohesion: 0.12
Nodes (16): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 2 — Core implementation (module implementations complete), Milestone 3 — Testing (complete for 1.0.0) (+8 more)

### Community 77 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.13
Nodes (15): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+7 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically, Requirement: the required Postgres configuration is published as a binding Durability Contract, Scenario: A crash before the single commit leaves neither the checkpoint nor the cursor, Scenario: a direct (session-mode) connection passes the pooler check (+6 more)

### Community 79 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 82 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 83 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 85 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 9 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: SN-1 Export, Requirement: SN-2 The file format, Requirement: SN-3 Import into an empty database, Requirement: SN-4 Import is all or nothing, Requirement: SN-5 A restored database continues like one that never stopped, Scenario: A tampered snapshot, Scenario: An import killed half-way (+4 more)

### Community 91 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 92 - "Requirements"
Cohesion: 0.15
Nodes (12): Purpose, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: Unconditional writes are gapless and monotonic (Law T1), Requirements, Scenario: An attempt to create overlapping history intervals is rejected, Scenario: getAt matches an independent replay for an arbitrary put sequence (+4 more)

### Community 94 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.17
Nodes (10): 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, UmbraDB v0.9.5 "Penumbra" — Release Record, UmbraDB v1.0.0 — Release Record (PENDING) (+2 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: Migrations are idempotent and ordered, Scenario: A migration failure does not partially apply, Scenario: An attempt to create overlapping history intervals is rejected, Scenario: getAt matches an independent replay for an arbitrary put sequence (+3 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's snapshot, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Importing a snapshot in the page (+3 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: Fast equals full (+3 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

## Knowledge Gaps
- **13 isolated node(s):** `./tsconfig.json`, `local>midnightntwrk/renovate-config`, `PGPASSFILE`, `PYTHONHASHSEED`, `@stryker-mutator/core` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1655 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `StorageError`, `createClient`, `storage-errors.ts`, `PgTransactionLeaseLayer`, `src/index.ts`, `PgWatermarks`, `differential-equivalence.test.ts`, `chain-archive-sync-retry.integration.test.ts`, `setup.ts`, `withSuiteWatchdog`, `cursor-durability.crash.test.ts`, `interfaces/transaction-history-storage.ts`, `lease-nonwedge.crash.test.ts`, `pg-tx-history-adapter.ts`, `cold-boot-recovery.integration.test.ts`, `check-required-tests.ts`, `chain-archive-replay-decode.integration.test.ts`, `full-sync-soak.integration.test.ts`, `What changes — the 1.0.0 gate items this change addresses`, `package.json`, `ref_node_path`, `pg-kill-save.crash.test.ts`, `transaction-history-storage.property.test.ts`, `NodeRpcClient`, `durability-probe.test.ts`, `pglite.test.ts`, `load-under-prune.integration.test.ts`, `mutation-per-adapter.mjs`, `IndexerClient`, `ws-mutual-tls.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `facade-merge-loader.ts`, `no-chain-sync-import-guard.test.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `./tsconfig.json`, `local>midnightntwrk/renovate-config`, `PGPASSFILE` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `StorageError` be split into smaller, more focused modules?**
  _Cohesion score 0.05048766494549627 - nodes in this community are weakly interconnected._
- **Why does `CheckpointStore` connect `CheckpointStore` to `StorageError`, `storage-errors.ts`, `PgTransactionHistoryStorage`, `src/index.ts`, `Tasks — v1.0.0-infosec-signoff`, `ADDED Requirements`, `TransactionHandle`, `UmbraDB 1.0.0 Release Contracts`, `Security policy & threat model`, `Full-Chain Storage — Design`, `ChunkMissingError`, `Proposal — v1.0.0-perf-baseline`, `Algebraic Specification of the midnight-pg-store Storage Layer`, `ADDED Requirements`, `PgCheckpointStore`, `Roadmap`, `postgres/checkpoint-store.ts`, `4. The freeze: the public barrel (G1)`, `Design — Sprint 7: Transaction History Storage`, `Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery`, `Design — v1.0.0 API Surface & Release Contract`, `Design — v1.0.0-infosec-signoff`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Are the 41 inferred relationships involving `ValidationError` (e.g. with `1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors` and `1.4 Runtime validation`) actually correct?**
  _`ValidationError` has 41 INFERRED edges - model-reasoned connections that need verification._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.06349206349206349 - nodes in this community are weakly interconnected._