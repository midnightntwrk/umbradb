# Graph Report - UmbraDB

## Corpus Check
- 386 files · ~608,605 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 53 file(s) not represented in the graph (top: .lean 25, (none) 13, .patch 8)

## Summary
- 3581 nodes · 7476 edges · 238 communities (210 shown, 28 thin omitted)
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 1490 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `1d51916bd1870e0e` (386 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- sync-service.ts
- vitest
- translatePostgresError
- midnight-env — reproducible PREPROD dev environment
- DurabilityContractError
- TransactionHandle
- no-chain-sync-import-guard.test.ts
- fresh-instance.ts
- sqlite-writer-lock.test.ts
- PgTransactionHistoryStorage
- mutation-evidence.d.mts
- vendored-ledger-files.test.ts
- cursor-durability.crash.test.ts
- harness.ts
- ValidationError
- postgres/transaction-lease.ts
- ChunkMissingError
- postgres/watermarks.ts
- createClient
- vendored-ledger-v9.test.ts
- full-sync-soak.integration.test.ts
- differential-equivalence.test.ts
- pg-tx-history-adapter.ts
- describeNodeStoreExports
- check-required-tests.ts
- src/index.ts
- chain-archive-replay-decode.integration.test.ts
- CheckpointStore
- ClockRegressionError
- interfaces/temporal-kv.ts
- withSuiteWatchdog
- .put
- transaction-history-storage.property.test.ts
- TransactionKeyReuseError
- postgres/checkpoint-store.ts
- node-format.ts
- VersionConflictError
- ws-mutual-tls.test.ts
- postgres/transaction-history-storage.ts
- interfaces/transaction-lease.ts
- errors.ts
- crash-worker.ts
- TransactionPoolerDetectedError
- MergeEntriesFn
- TransactionHistoryEntry
- StorageError
- PgWalletSdkTransactionHistoryAdapter
- load-under-prune.integration.test.ts
- chain-archive-sync-retry.integration.test.ts
- Reader
- chain-archive-rollover.ts
- PgTransactionLeaseLayer
- durability-probe.test.ts
- wallet-state-envelope.test.ts
- facade-merge-loader.ts
- transaction-history-storage.test.ts
- Design — Sprint 7: Transaction History Storage
- graph.py
- lease-nonwedge.crash.test.ts
- .getAt
- report
- pglite.test.ts
- saveAndAdvance
- encode
- interfaces/transaction-history-storage.ts
- runMigrations
- cold-boot-recovery.integration.test.ts
- mutation-per-adapter.mjs
- ref_node_path
- pack-install.mjs
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- openspec-explore/SKILL.md
- 3. Proof-blocking findings
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB 0.9.5 "Penumbra"
- ADDED Requirements
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Design — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- UmbraDB
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- ADDED Requirements
- UmbraDB 1.0.0 Release Contracts
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Global Constraints
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Design — Sprint 4: Watermarks
- Tasks — Sprint 7: Transaction History Storage
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- ADDED Requirements
- Acceptance criteria — v1.0.0-infosec-signoff
- Repository agent policy
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Our Pledge
- Midnight infra verification checklist
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 12. Milestone status
- 5. Recommended candidate model
- Design — Sprint 1: project setup + TemporalKV
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — v1.0.0-perf-baseline
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- ROADMAP.md
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 1. The twenty gate items
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Algebraic Specification of the midnight-pg-store Storage Layer
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- ADDED Requirements
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — Sprint 7: Transaction History Storage (Wallet Integration Surface)
- Tasks — v1.0.0 API Surface & Release Contract
- Proposal — v1.0.0-perf-baseline
- Design — v1.0.0: Formal completion (`formal-completion`)
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- UmbraDB — project instructions
- ADDED Requirements
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — v1.0.0 API Surface & Release Contract
- Acceptance criteria — v1.0.0-perf-baseline
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- GC architecture and query-tracing: research findings
- The five primitives
- PULL_REQUEST_CHECKLIST.md
- 9. Trust and refinement boundary
- documentation-improvement.md
- Overview
- Test wallets
- Spec — capability `formal-completion`
- renovate.json
- ADDED Requirements
- Vendored ledger builds
- Environment changelog
- UmbraDB Stability Policy (SemVer)
- 11. Evidence matrix
- start-stack.sh
- Gate notes — Task 6: differential state-equivalence gate (G11)
- repository
- run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- engines
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- Design — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- ADDED Requirements
- UmbraDB V1.0.0 Implementation Guideline
- devDependencies
- Roadmap
- REMOVED Requirements
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — Postgres+JSONB storage rebuild
- UmbraDB v0.9.5 "Penumbra" — Release Record

## God Nodes (most connected - your core abstractions)
1. `PgTransactionLeaseLayer` - 93 edges
2. `ValidationError` - 87 edges
3. `PgCheckpointStore` - 87 edges
4. `runMigrations()` - 85 edges
5. `translatePostgresError()` - 78 edges
6. `vitest` - 77 edges
7. `createClient()` - 74 edges
8. `UmbraDBSql` - 72 edges
9. `TransactionHandle` - 70 edges
10. `PgTransactionHistoryStorage` - 70 edges

## Surprising Connections (you probably didn't know these)
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → src/interfaces/transaction-history-storage.ts
- `Why` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → src/interfaces/transaction-history-storage.ts
- `2. Schema + interface` --references--> `TransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/tasks.md → src/interfaces/transaction-history-storage.ts
- `2. Dependency direction: structural mirror, not a runtime import` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → src/postgres/transaction-history-storage.ts
- `Impact` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/proposal.md → src/postgres/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (238 total, 28 thin omitted)

### Community 0 - "sync-service.ts"
Cohesion: 0.04
Nodes (39): IndexerBlock, IndexerClient, IndexerClientError, IndexerClientOptions, IndexerClientParseError, IndexerTransaction, NodeRpcClient, NodeRpcClientOptions (+31 more)

### Community 1 - "vitest"
Cohesion: 0.04
Nodes (39): BenchEnv, UmbraDBSql, Method, Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions (+31 more)

### Community 10 - "translatePostgresError"
Cohesion: 0.11
Nodes (28): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+20 more)

### Community 101 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.18
Nodes (9): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS) (+1 more)

### Community 105 - "DurabilityContractError"
Cohesion: 0.18
Nodes (10): DurabilityContractError, 2.1 Where the probe runs (the one real design decision), 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract, 1. G6 — Durability startup probe + binding contract, 2. G7 — Server-side timeouts (+2 more)

### Community 11 - "TransactionHandle"
Cohesion: 0.07
Nodes (34): TransactionHistoryReader, TransactionHistoryWriter, TransactionHandle, TransactionHandleInvalidError, splitChunks(), resolveTransaction(), MODIFIED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored (+26 more)

### Community 115 - "no-chain-sync-import-guard.test.ts"
Cohesion: 0.27
Nodes (7): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles(), ANSWER_WASM, esbuild

### Community 127 - "fresh-instance.ts"
Cohesion: 0.22
Nodes (7): FreshInstanceRequest, FreshInstanceResult, hex(), runInFreshInstance(), requested, store, stored

### Community 151 - "sqlite-writer-lock.test.ts"
Cohesion: 0.25
Nodes (3): LockResult, kill(), children

### Community 16 - "PgTransactionHistoryStorage"
Cohesion: 0.11
Nodes (30): TransactionHistoryStorage, PgTransactionHistoryStorage, 3.4 Watermarks, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation) (+22 more)

### Community 167 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 168 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 17 - "cursor-durability.crash.test.ts"
Cohesion: 0.07
Nodes (28): InvariantResult, CrashWorkerHandle, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs(), durableKvValues(), itemKey() (+20 more)

### Community 2 - "harness.ts"
Cohesion: 0.08
Nodes (49): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+41 more)

### Community 20 - "ValidationError"
Cohesion: 0.08
Nodes (31): ValidationError, 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+23 more)

### Community 22 - "postgres/transaction-lease.ts"
Cohesion: 0.11
Nodes (24): Lease, HeldLease, InjectedReleaseFaultLayer, abortError(), withAbort(), raceAgainstAbort(), registerTransaction(), reserveBounded() (+16 more)

### Community 25 - "ChunkMissingError"
Cohesion: 0.12
Nodes (27): CheckpointNotFoundError, CheckpointStoreError, ChunkIntegrityError, ChunkMissingError, ManifestCorruptError, 3.3 CheckpointStore, 3. Module Interfaces, CheckpointStore tables (+19 more)

### Community 27 - "postgres/watermarks.ts"
Cohesion: 0.11
Nodes (20): WatermarkKey, WatermarkKind, WatermarkValue, WatermarkRow, WatermarkValueSchema, { sql: getSql, connectionUri }, RFC-8259, Storage Types — reference for formalization (+12 more)

### Community 3 - "createClient"
Cohesion: 0.06
Nodes (31): BlockRow, TxRow, assertNoConflictingSearchPath(), assertValidSchemaName(), createClient(), isLockTimeout(), runMigrationsImpl(), withReservedTransaction() (+23 more)

### Community 31 - "vendored-ledger-v9.test.ts"
Cohesion: 0.17
Nodes (23): NodeRoot, bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex() (+15 more)

### Community 32 - "full-sync-soak.integration.test.ts"
Cohesion: 0.07
Nodes (17): JsonValue, KvRow, BatchSpec, CurrentState, CurrentState, GcPass, HistGroup, SampleObservation (+9 more)

### Community 33 - "differential-equivalence.test.ts"
Cohesion: 0.13
Nodes (25): Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1(), injectT2() (+17 more)

### Community 34 - "pg-tx-history-adapter.ts"
Cohesion: 0.12
Nodes (23): SerializationFailedError, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 37 - "describeNodeStoreExports"
Cohesion: 0.15
Nodes (14): NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), apply(), 12. Ledger, 5.1 The `LedgerPackage` interface (LG-6), 5.2 Vendored builds (LG-5), 5.3 The ledger worker and the node-store bridge (LG-10, LG-11) (+6 more)

### Community 39 - "check-required-tests.ts"
Cohesion: 0.14
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 4 - "src/index.ts"
Cohesion: 0.09
Nodes (53): CheckpointStoreErrorCode, HistoryOptions, SharedStorageErrorCode, TemporalKV, TemporalKVErrorCode, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle (+45 more)

### Community 41 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+12 more)

### Community 42 - "CheckpointStore"
Cohesion: 0.12
Nodes (17): CheckpointStore, EnvelopeCorruptError, WalletStateEnvelope, 1.2 Async pattern, Wallet State Envelope, Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability (+9 more)

### Community 43 - "ClockRegressionError"
Cohesion: 0.17
Nodes (16): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, ClockRegressionError, `CLOCK_REGRESSION` is conditional, not uniformly non-retryable (+8 more)

### Community 49 - "interfaces/temporal-kv.ts"
Cohesion: 0.15
Nodes (16): AssertExact, _VersionedEntryInSync, jsonValueHasUnsafeText(), escapeLikePrefix(), ExpectedVersionSchema, JsonValueInnerSchema, JsonValueSchema, KeySchema (+8 more)

### Community 5 - "withSuiteWatchdog"
Cohesion: 0.05
Nodes (54): C5AnyFn, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount(), pool(), watermarkCount(), worker(), assertSaveNotAutoRetriedUnderRetriableFault() (+46 more)

### Community 50 - ".put"
Cohesion: 0.28
Nodes (11): AsOf, Key, Namespace, Scope, Version, VersionedEntry, toEntry(), 3.2 TemporalKV (+3 more)

### Community 55 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 57 - "TransactionKeyReuseError"
Cohesion: 0.11
Nodes (18): TransactionKeyReuseError, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Postgres errors surface as the shared StorageError hierarchy, Scenario: A connection failure surfaces as ConnectionError, Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level, Scenario: A transaction-key-reuse violation surfaces as TransactionKeyReuseError, Scenario: An exclusion-constraint violation is identified by its correct SQLSTATE, Scenario: Sequential puts to the same key in separate transactions succeed, outside the millisecond-collision caveat (+10 more)

### Community 6 - "postgres/checkpoint-store.ts"
Cohesion: 0.07
Nodes (47): CheckpointRecord, CheckpointSequence, CheckpointSummary, ContentHash, PruneResult, SaveCheckpointOptions, AggregateRow, ChunkJoinRow (+39 more)

### Community 60 - "node-format.ts"
Cohesion: 0.22
Nodes (16): StoredNode, Child, Disposable, NodeBatch, childKey(), concat(), encodeChild(), encodeChildren() (+8 more)

### Community 65 - "VersionConflictError"
Cohesion: 0.13
Nodes (13): VersionConflictError, kv(), txLayer(), FAKE_TX, { sql: getSql }, `kv_current` / `kv_history` — TemporalKV, 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), Requirement: put's CAS guard distinguishes conflict from absence (+5 more)

### Community 67 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (13): Attempt, connect(), file(), makeCa(), makeLeaf(), openssl(), read(), tlsClientErrors (+5 more)

### Community 69 - "postgres/transaction-history-storage.ts"
Cohesion: 0.21
Nodes (15): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+7 more)

### Community 7 - "interfaces/transaction-lease.ts"
Cohesion: 0.07
Nodes (43): HistoryUnavailableError, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionFaultError, TransactionLeaseError, TransactionRolledBackError, EnvelopeVersionUnsupportedError (+35 more)

### Community 74 - "errors.ts"
Cohesion: 0.16
Nodes (14): PgDriverError, isChainArchiveCheckConstraintName(), isConnectionFailure(), isPgDriverError(), isStatementTimeout(), CHAIN_ARCHIVE_CHECK_TABLE_PREFIXES, CHAIN_ARCHIVE_INVARIANT_CONSTRAINT_NAMES, CONNECTION_FAILURE_CODES (+6 more)

### Community 75 - "crash-worker.ts"
Cohesion: 0.20
Nodes (14): CoTxCallable, CoTxPauseInfo, CrashHook, describeCaughtError(), main(), observeClientPauseBeforeCursor(), pauseThenResume(), pauseUntilKilled() (+6 more)

### Community 76 - "TransactionPoolerDetectedError"
Cohesion: 0.19
Nodes (13): TransactionPoolerDetectedError, MigrationLockTimeoutError, assertNoTransactionPooler(), Audit (round 1) — the confirmation-bias control paid off, 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 4. Session-mode connection pooling only — probe-enforced (best-effort), 5. Server-side timeouts — applied by `createClient` (documented) (+5 more)

### Community 77 - "MergeEntriesFn"
Cohesion: 0.18
Nodes (11): MergeEntriesFn, isPlainObject(), mergeSections(), referenceMergeEntries(), tier1_wallet lineage, `transaction_history`, `watermarks`, 3.1 Field mapping (write path) (+3 more)

### Community 79 - "TransactionHistoryEntry"
Cohesion: 0.29
Nodes (6): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 8 - "StorageError"
Cohesion: 0.06
Nodes (48): ConnectionError, Retryability, StorageError, TemporalKVError, WalletStateEnvelopeError, Row, Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7) (+40 more)

### Community 83 - "PgWalletSdkTransactionHistoryAdapter"
Cohesion: 0.17
Nodes (4): PgWalletSdkTransactionHistoryAdapter, capitalize(), phaseB_freshProcessRestoreAndVerify(), makeAdapter()

### Community 84 - "load-under-prune.integration.test.ts"
Cohesion: 0.15
Nodes (12): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), runUnSnapshottedReadUnderPrune(), seedCheckpoints() (+4 more)

### Community 85 - "chain-archive-sync-retry.integration.test.ts"
Cohesion: 0.20
Nodes (10): FakeChainBlock, bootstrapChainArchiveSchema(), fakeChain(), fakeIndexerFetch(), fakeNodeFetch(), hx(), newService(), MAX_BLOCKS (+2 more)

### Community 86 - "Reader"
Cohesion: 0.25
Nodes (5): Reader, decodeChild(), decodeChildren(), readChild(), readChildList()

### Community 87 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 9 - "PgTransactionLeaseLayer"
Cohesion: 0.08
Nodes (43): PgCheckpointStore, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters, Adapters, adaptersOf() (+35 more)

### Community 90 - "durability-probe.test.ts"
Cohesion: 0.29
Nodes (9): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit(), probeAdvisoryLockVisibility(), probeDurability() (+1 more)

### Community 104 - "wallet-state-envelope.test.ts"
Cohesion: 0.24
Nodes (10): decode(), checkpointStore(), envelopeStore(), { sql: getSql }, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Scenario: A future-versioned envelope is rejected cleanly, Scenario: An unknown top-level field is rejected as a typed envelope error (F7) (+2 more)

### Community 109 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 116 - "transaction-history-storage.test.ts"
Cohesion: 0.20
Nodes (7): decodeSerializedContent(), decodeSerializedEntry(), store(), txLayer(), THS_RESERVED_KEY_PREFIX, FAKE_TX, { sql: getSql }

### Community 121 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.20
Nodes (9): entry(), 4. Configuration, 4. Configuration, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier (+1 more)

### Community 13 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 137 - "lease-nonwedge.crash.test.ts"
Cohesion: 0.28
Nodes (8): class2AdvisoryLockCountForHash(), pollForLockGone(), pool(), sleep(), worker(), liveWorkers, openPools, { sql: getSql, connectionUri }

### Community 140 - ".getAt"
Cohesion: 0.25
Nodes (5): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why, Performance

### Community 160 - "report"
Cohesion: 0.29
Nodes (7): report(), 14. Private processes, 8. Private processes (PP), Requirement: PP-6 Lockstep instances process each height at that height, Requirement: PP-9 What the public side may call, Scenario: A lockstep instance is stopped, Scenario: The core's view of an instance

### Community 28 - "saveAndAdvance"
Cohesion: 0.08
Nodes (29): saveAndAdvance(), 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay (+21 more)

### Community 30 - "encode"
Cohesion: 0.07
Nodes (27): encode(), 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 4. Live preprod DB-sync verification (nightly/labeled), 6. Relationship to the future verifiable-snapshot-recovery feature, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live` (+19 more)

### Community 35 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.10
Nodes (26): exceedsMaxDepth(), hasPostgresUnsafeText(), safeNonEmptyString(), safeString(), envelope(), CheckpointIdSchema, EntryContentSchema, EntryLifecycleSchema (+18 more)

### Community 46 - "runMigrations"
Cohesion: 0.13
Nodes (20): runMigrations(), Acceptance — v1.0.0-durable-checkpoint-cursor, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, Whole-change gates (non-goal compliance + sequencing), ADDED Requirements, durable-composition (implementation), Requirement: a durability probe asserts the server's crash-safety settings at client bootstrap (+12 more)

### Community 47 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.20
Nodes (17): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), registerSuiteLifecycle(), startTestDatabase(), stopTestDatabase(), EXPECTED_NIGHT_VALUE (+9 more)

### Community 82 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 89 - "ref_node_path"
Cohesion: 0.15
Nodes (8): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli

### Community 92 - "pack-install.mjs"
Cohesion: 0.31
Nodes (10): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin (+2 more)

### Community 100 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.17
Nodes (12): 10. Sprint 2 transaction/lease proposal, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol, 4. Law-by-law repair map, 6.1 Approved M1 module layout, 6.2 First theorem tranche (+4 more)

### Community 102 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's snapshot, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Importing a snapshot in the page (+3 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 106 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover), 7. What this change deliberately does not verify (traceability of the non-goals) (+3 more)

### Community 107 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 108 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 110 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 111 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 112 - "3. Proof-blocking findings"
Cohesion: 0.18
Nodes (11): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption (+3 more)

### Community 113 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Full-sync soak + load-under-prune (G10), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Postgres-kill mid-save + retry contract (G9 / T2) (+2 more)

### Community 114 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 117 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 118 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 119 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.20
Nodes (9): Benchmarks, Compatibility, and what 1.0.0 needs, If you build from source, Installing, Security, The fix this release exists for, UmbraDB 0.9.5 "Penumbra", What is proved, and what that is worth (+1 more)

### Community 12 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 120 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 122 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer) (+1 more)

### Community 123 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 124 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 125 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 126 - "UmbraDB"
Cohesion: 0.20
Nodes (10): Contents, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB, Verification: what is proved, checked, and tested (+2 more)

### Community 128 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 129 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 130 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 131 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 132 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 133 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 134 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 135 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 136 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 139 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 14 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+30 more)

### Community 141 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.25
Nodes (8): 1. Durability contract, 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 142 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 143 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 144 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 145 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 146 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 147 - "Design — Sprint 4: Watermarks"
Cohesion: 0.25
Nodes (7): 0. Package layout, 10. Test infrastructure, 1. Schema — one physical-parameter correction to `design/design.md` §4, 4. Large-integer cursor values — a documented convention, not a schema change, 5. Accepted tradeoffs (explicit, not silently possible), 9. Migration (`003_watermarks.ts`), Design — Sprint 4: Watermarks

### Community 148 - "Tasks — Sprint 7: Transaction History Storage"
Cohesion: 0.25
Nodes (7): 0. Specification freeze, 1. Vendor/pin manifest, 2. Schema + interface, 3. PgTransactionHistoryStorage implementation, 6. Live-sync tier (nightly/labeled — blocked on design.md §7's open question), 7. Close-out, Tasks — Sprint 7: Transaction History Storage

### Community 149 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.25
Nodes (7): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 4. Pg-only conformance suite (required merge gate) — `test:conformance`, 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 15 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+30 more)

### Community 150 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 152 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 154 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 155 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 156 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 157 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 158 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 159 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.29
Nodes (6): 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV

### Community 161 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 162 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 163 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.29
Nodes (6): 1. G13 — perf-correctness fixes (LAND FIRST), 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 164 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 165 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 166 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 170 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 171 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 172 - "1. The twenty gate items"
Cohesion: 0.33
Nodes (6): 1. The twenty gate items, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`), Track B — Durable composition (`openspec/changes/v1.0.0-durable-checkpoint-cursor`, merged `e5fcdaa`, `2cb5d00`), Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`), Track E — Security posture (`openspec/changes/v1.0.0-infosec-signoff`, merged `7ee8a4b`)

### Community 173 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 174 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.33
Nodes (6): 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 175 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 176 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 177 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 178 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 179 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 18 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data responses name their view and height (+28 more)

### Community 180 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 181 - "Proposal — Sprint 7: Transaction History Storage (Wallet Integration Surface)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 7: Transaction History Storage (Wallet Integration Surface), Why, Why this sprint is numbered 7, not 5

### Community 182 - "Tasks — v1.0.0 API Surface & Release Contract"
Cohesion: 0.33
Nodes (5): 3. The freeze: build + package.json (G1), 5. Release contract docs (G2, G4), 6. Freeze the Lean cut-line (G20), 7. Packed-tarball install smoke test (G1), Tasks — v1.0.0 API Surface & Release Contract

### Community 183 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, Why

### Community 184 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.33
Nodes (5): §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 185 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 186 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 187 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 188 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 189 - "UmbraDB — project instructions"
Cohesion: 0.40
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 19 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 190 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 191 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 192 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 193 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 194 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 195 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 196 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 197 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, Why

### Community 198 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.40
Nodes (4): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first), G14 — benchmark harness + recorded baseline

### Community 199 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 200 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 201 - "The five primitives"
Cohesion: 0.40
Nodes (5): CheckpointStore: content-addressed snapshots, TemporalKV: versioned KV with history, The five primitives, Transaction/Lease: the control algebra, Watermarks: sync cursors

### Community 203 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 204 - "9. Trust and refinement boundary"
Cohesion: 0.50
Nodes (4): 9. Trust and refinement boundary, Completed M1/M2/W1 claims, Deferred M2–M5 proof work, Named external obligations

### Community 205 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 206 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 207 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 208 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 209 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 21 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+25 more)

### Community 210 - "Vendored ledger builds"
Cohesion: 0.50
Nodes (3): Rebuilding, Updating a version, Vendored ledger builds

### Community 212 - "UmbraDB Stability Policy (SemVer)"
Cohesion: 0.67
Nodes (3): Scope and pre-1.0 note, The three commitments, UmbraDB Stability Policy (SemVer)

### Community 213 - "11. Evidence matrix"
Cohesion: 0.67
Nodes (3): 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix

### Community 216 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 23 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (29): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 6. Nix — nixpkgs packages (from the locked nixpkgs), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies (+21 more)

### Community 24 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+23 more)

### Community 26 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (30): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+22 more)

### Community 29 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)` (+21 more)

### Community 36 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

### Community 38 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 40 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 44 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Schema isolation is the default, not opt-in (+15 more)

### Community 45 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: one storage instance is bound to exactly one wallet at construction, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 48 - "package.json"
Cohesion: 0.09
Nodes (21): bugs, url, description, exports, files, homepage, license, main (+13 more)

### Community 51 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not snapshotted, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+12 more)

### Community 52 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: A bare numeric watermark value round-trips exactly (+12 more)

### Community 53 - "ADDED Requirements"
Cohesion: 0.10
Nodes (21): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence, Requirement: the adapter round-trips SDK lifecycle detail so getAll yields schema-valid SDK entries (+13 more)

### Community 54 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1), Requirement: Transactions commit or roll back atomically, Requirement: withLease always releases its lease, even when fn throws, Scenario: A callback that returns normally commits (+11 more)

### Community 56 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 58 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (18): 10. Node client and ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Snapshots, 16. Browser, 17. Library surface and gates, 18. Whole-system faults, differentials and measurements (+10 more)

### Community 59 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 61 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block digests for modules that opt in, Requirement: DT-5 The `core-digest` part chains the digests, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A fractional JSON number (+9 more)

### Community 62 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+9 more)

### Community 63 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, archive:sync, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 64 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 66 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 68 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 70 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 15. Snapshots and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API, 3. Modules (+7 more)

### Community 71 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Tables, 11. Refusals and halts (IN-12), 12. Exported surface and command (LS-1, LS-6), 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 2. Points, 3. Block source and ingest (+7 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor first, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+7 more)

### Community 78 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.13
Nodes (15): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N) (+7 more)

### Community 80 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 81 - "Roadmap"
Cohesion: 0.13
Nodes (15): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`) (+7 more)

### Community 88 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 91 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: SN-1 Export, Requirement: SN-2 The file format, Requirement: SN-3 Import into an empty database, Requirement: SN-4 Import is all or nothing, Requirement: SN-5 A restored database continues like one that never stopped, Scenario: A tampered snapshot, Scenario: An import killed half-way (+4 more)

### Community 96 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.15
Nodes (12): 0. Package layout, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire, 3. G7 — Server-side timeouts, 4.3 Stop `withLease` swallowing release failures, 4. G8 — Contract-integrity fixes, 6.1 The Fable-vs-Opus factual dispute (resolved by live test), 6.2 Blocking findings applied (+4 more)

### Community 97 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 98 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.17
Nodes (12): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`) (+4 more)

### Community 99 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.17
Nodes (10): 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, UmbraDB v0.9.5 "Penumbra" — Release Record, UmbraDB v1.0.0 — Release Record (PENDING) (+2 more)

## Knowledge Gaps
- **13 isolated node(s):** `./tsconfig.json`, `local>midnightntwrk/renovate-config`, `PGPASSFILE`, `PYTHONHASHSEED`, `RFC-8259` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1674 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `sync-service.ts`, `harness.ts`, `createClient`, `src/index.ts`, `withSuiteWatchdog`, `interfaces/transaction-lease.ts`, `PgTransactionLeaseLayer`, `lease-nonwedge.crash.test.ts`, `cursor-durability.crash.test.ts`, `postgres/transaction-lease.ts`, `sqlite-writer-lock.test.ts`, `postgres/watermarks.ts`, `vendored-ledger-v9.test.ts`, `full-sync-soak.integration.test.ts`, `differential-equivalence.test.ts`, `pg-tx-history-adapter.ts`, `interfaces/transaction-history-storage.ts`, `check-required-tests.ts`, `vendored-ledger-files.test.ts`, `chain-archive-replay-decode.integration.test.ts`, `ClockRegressionError`, `cold-boot-recovery.integration.test.ts`, `package.json`, `interfaces/temporal-kv.ts`, `transaction-history-storage.property.test.ts`, `node-format.ts`, `VersionConflictError`, `ws-mutual-tls.test.ts`, `pglite.test.ts`, `mutation-per-adapter.mjs`, `load-under-prune.integration.test.ts`, `chain-archive-sync-retry.integration.test.ts`, `ref_node_path`, `durability-probe.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `wallet-state-envelope.test.ts`, `facade-merge-loader.ts`, `no-chain-sync-import-guard.test.ts`, `transaction-history-storage.test.ts`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `./tsconfig.json`, `local>midnightntwrk/renovate-config`, `PGPASSFILE` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04360298336201951 - nodes in this community are weakly interconnected._
- **Why does `CheckpointStore` connect `CheckpointStore` to `src/index.ts`, `postgres/checkpoint-store.ts`, `interfaces/transaction-lease.ts`, `Tasks — v1.0.0-infosec-signoff`, `PgTransactionLeaseLayer`, `TransactionHandle`, `ADDED Requirements`, `UmbraDB 1.0.0 Release Contracts`, `PgTransactionHistoryStorage`, `ChunkMissingError`, `Full-Chain Storage — Design`, `postgres/watermarks.ts`, `saveAndAdvance`, `encode`, `Algebraic Specification of the midnight-pg-store Storage Layer`, `ADDED Requirements`, `Proposal — v1.0.0-perf-baseline`, `Roadmap`, `Design — Postgres+JSONB storage rebuild`, `UmbraDB 0.9.5 "Penumbra"`, `Design — Sprint 7: Transaction History Storage`, `Design — v1.0.0 API Surface & Release Contract`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 41 inferred relationships involving `ValidationError` (e.g. with `1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors` and `1.4 Runtime validation`) actually correct?**
  _`ValidationError` has 41 INFERRED edges - model-reasoned connections that need verification._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.03716744913928013 - nodes in this community are weakly interconnected._