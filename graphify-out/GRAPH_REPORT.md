# Graph Report - UmbraDB

## Corpus Check
- 399 files · ~641,207 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 53 file(s) not represented in the graph (top: .lean 25, (none) 13, .patch 8)

## Summary
- 3806 nodes · 8043 edges · 237 communities (213 shown, 24 thin omitted)
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 1556 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `5bff371d104852fd` (399 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- postgres/checkpoint-store.ts
- translatePostgresError
- PgTransactionHistoryStorage
- Reader
- vitest
- src/index.ts
- TransactionHandle
- cbor.ts
- cursor-durability.crash.test.ts
- mutation-evidence.d.mts
- vendored-ledger-files.test.ts
- ValidationError
- saveAndAdvance
- cbor.property.test.ts
- ref_node_fs
- column-refusals.test.ts
- harness.ts
- CheckpointStore
- differential-equivalence.test.ts
- DurabilityContractError
- sync-service.ts
- interfaces/temporal-kv.ts
- crash-worker.ts
- cold-boot-recovery.integration.test.ts
- pg-tx-history-adapter.ts
- public-tables.ts
- check-required-tests.ts
- ChainArchiveStore
- describeNodeStoreExports
- TransactionHistoryEntry
- StorageError
- chain-archive-store.test.ts
- PgChainArchiveStore
- full-sync-soak.integration.test.ts
- chain-archive-replay-decode.integration.test.ts
- pg-kill-save.crash.test.ts
- chain-archive-rollover.ts
- column-rules.ts
- postgres/chain-archive-store.ts
- transaction-history-storage.property.test.ts
- chain-archive-preprod-cloud-crossval.integration.test.ts
- NodeRpcClient
- contents-hash.ts
- PgTransactionLeaseLayer
- node-format.ts
- vendored-ledger-node-roots.test.ts
- setup.ts
- UmbraDBConnectionOptions
- postgres/transaction-history-storage.ts
- ws-mutual-tls.test.ts
- createClient
- load-under-prune.integration.test.ts
- chain-archive-sync-retry.integration.test.ts
- midnight-env — reproducible PREPROD dev environment
- facade-merge-loader.ts
- transaction-history-storage.test.ts
- pack-install.mjs
- report
- key
- lease-nonwedge.crash.test.ts
- decode
- graph.py
- pglite.test.ts
- encodeContent
- .save
- ADDED Requirements
- runMigrations
- ADDED Requirements
- vendored-ledger-v9.test.ts
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- Design — Sprint 7: Transaction History Storage
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — Postgres+JSONB storage rebuild
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- UmbraDB
- compilerOptions
- compilerOptions
- README.md
- openspec-explore/SKILL.md
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- 3. Proof-blocking findings
- Design — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-durable-checkpoint-cursor
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0-infosec-signoff
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- ADDED Requirements
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Global Constraints
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Algebraic Specification of the midnight-pg-store Storage Layer
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 12. Milestone status
- 5. Recommended candidate model
- Design — Sprint 1: project setup + TemporalKV
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0 API Surface & Release Contract
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
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — v1.0.0 API Surface & Release Contract
- Acceptance — v1.1.0: Quint model checking
- dependencies
- ADDED Requirements
- Midnight Foundation Security Policy
- lib.sh
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- ADDED Requirements
- feature-request.md
- Proposal — Sprint 2: Transaction/Lease
- Proposal — Sprint 4: Watermarks
- Proposal — v1.0.0 API Surface & Release Contract
- Acceptance criteria — v1.0.0-perf-baseline
- GC architecture and query-tracing: research findings
- PULL_REQUEST_CHECKLIST.md
- 9. Trust and refinement boundary
- documentation-improvement.md
- ADDED Requirements
- Overview
- Test wallets
- 2. Schema — two corrections to `design/design.md` §3
- Proposal — Sprint 3: CheckpointStore
- Requirement: a non-object JSON value round-trips correctly
- Spec — capability `formal-completion`
- renovate.json
- Vendored ledger builds
- Environment changelog
- start-stack.sh
- ADDED Requirements
- Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease
- Requirement: Aborting opts.signal during lease acquisition rejects with AbortError
- Requirement: Connection loss during lease acquisition or holding surfaces as LeaseFaultError
- Requirement: get returns exactly the last value set, scoped per (kind, key)
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
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- Full-Chain Storage — Design
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- UmbraDB V1.0.0 Implementation Guideline
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ROADMAP.md
- Storage Algebra Lean Formalization — Approved Design and Status
- Design — CORE-ARCH: the standalone indexer's core architecture
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- devDependencies
- Roadmap
- REMOVED Requirements
- ADDED Requirements
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `PgTransactionLeaseLayer` - 93 edges
2. `ValidationError` - 87 edges
3. `PgCheckpointStore` - 87 edges
4. `runMigrations()` - 85 edges
5. `vitest` - 83 edges
6. `translatePostgresError()` - 78 edges
7. `createClient()` - 74 edges
8. `UmbraDBSql` - 72 edges
9. `PgTransactionHistoryStorage` - 70 edges
10. `TransactionHandle` - 70 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: load before any save rejects with CheckpointNotFoundError` --references--> `CheckpointNotFoundError`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/specs/wallet-state-envelope/spec.md → src/interfaces/checkpoint-store.ts
- `Scenario: save on a caller transaction behaves identically to the internal-transaction path for a reader` --references--> `CheckpointSummary`  [INFERRED]
  openspec/changes/v1.0.0-durable-checkpoint-cursor/specs/durable-composition/spec.md → src/interfaces/checkpoint-store.ts
- `Scenario: A history page issues two queries regardless of page size` --references--> `CheckpointSummary`  [INFERRED]
  openspec/changes/v1.0.0-perf-baseline/specs/performance-baseline/spec.md → src/interfaces/checkpoint-store.ts
- `The honest-test pattern (what makes each required test non-vacuous)` --references--> `ChunkMissingError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/checkpoint-store.ts
- `Scenario: A chunk shared across wallets survives one wallet's prune` --references--> `ChunkMissingError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (237 total, 24 thin omitted)

### Community 0 - "postgres/checkpoint-store.ts"
Cohesion: 0.05
Nodes (76): CheckpointNotFoundError, CheckpointRecord, CheckpointStoreError, CheckpointSummary, ChunkIntegrityError, ChunkMissingError, ContentHash, ManifestCorruptError (+68 more)

### Community 1 - "translatePostgresError"
Cohesion: 0.06
Nodes (64): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, Rollback, TransactionFaultError, TransactionLeaseError (+56 more)

### Community 10 - "PgTransactionHistoryStorage"
Cohesion: 0.07
Nodes (41): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation) (+33 more)

### Community 102 - "Reader"
Cohesion: 0.29
Nodes (3): Reader, decodeChild(), readChild()

### Community 11 - "vitest"
Cohesion: 0.05
Nodes (28): Method, InjectedReleaseFaultLayer, makeStore(), store(), store(), registerSuiteLifecycle(), kv(), store() (+20 more)

### Community 12 - "src/index.ts"
Cohesion: 0.12
Nodes (35): CheckpointStoreErrorCode, HistoryOptions, SaveCheckpointOptions, SharedStorageErrorCode, AsOf, JsonValue, Key, Namespace (+27 more)

### Community 13 - "TransactionHandle"
Cohesion: 0.07
Nodes (35): TransactionHistoryReader, TransactionHistoryWriter, TransactionHandle, TransactionHandleInvalidError, TransactionLeaseLayer, resolveTransaction(), Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Scenario: Passing a transaction handle throws before any query runs (+27 more)

### Community 15 - "cbor.ts"
Cohesion: 0.12
Nodes (33): ColumnMode, Mode, PathNode, Task, Writer, checkSafeInteger(), compareBytes(), encodeCanonical() (+25 more)

### Community 16 - "cursor-durability.crash.test.ts"
Cohesion: 0.07
Nodes (30): BatchSpec, CurrentState, InvariantResult, CrashWorkerHandle, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs() (+22 more)

### Community 167 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 168 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 2 - "ValidationError"
Cohesion: 0.05
Nodes (59): ValidationError, TemporalKV, Watermarks, WatermarkValue, UnrecognizedPostgresError, WatermarkRow, exceedsMaxDepth(), EntrySectionsSchema (+51 more)

### Community 22 - "saveAndAdvance"
Cohesion: 0.09
Nodes (35): RunMigrationsOptions, SaveAndAdvanceCursor, SaveAndAdvanceDeps, PgWalletStateEnvelopeStore, saveAndAdvance(), envelopeStore(), Added, 1. The invariant: the cursor is never ahead of its data (+27 more)

### Community 25 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (33): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+25 more)

### Community 26 - "ref_node_fs"
Cohesion: 0.08
Nodes (18): LockResult, GuardViolation, kill(), extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles(), check (+10 more)

### Community 27 - "column-refusals.test.ts"
Cohesion: 0.12
Nodes (22): ConsistentRead, Case, TestDatabase, TestServer, publicTables(), freshDatabase(), freshDatabase(), hashOf() (+14 more)

### Community 3 - "harness.ts"
Cohesion: 0.08
Nodes (50): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+42 more)

### Community 30 - "CheckpointStore"
Cohesion: 0.09
Nodes (25): CheckpointStore, encode(), 1.2 Async pattern, Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0) (+17 more)

### Community 36 - "differential-equivalence.test.ts"
Cohesion: 0.12
Nodes (26): CurrentState, Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1() (+18 more)

### Community 37 - "DurabilityContractError"
Cohesion: 0.13
Nodes (23): DurabilityContractError, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, TransactionPoolerDetectedError, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites() (+15 more)

### Community 39 - "sync-service.ts"
Cohesion: 0.13
Nodes (17): IndexerBlock, IndexerClientOptions, NodeRpcClientOptions, ChainArchiveSyncService, ChainArchiveSyncServiceOptions, SyncOnceResult, BridgeObservationRecord, TransactionRecord (+9 more)

### Community 4 - "interfaces/temporal-kv.ts"
Cohesion: 0.06
Nodes (47): CheckpointSequence, AssertExact, _VersionedEntryInSync, EnvelopeCorruptError, WalletStateEnvelope, KvRow, hasPostgresUnsafeText(), jsonValueHasUnsafeText() (+39 more)

### Community 40 - "crash-worker.ts"
Cohesion: 0.12
Nodes (20): WatermarkKey, WatermarkKind, CoTxCallable, CoTxPauseInfo, CrashHook, describeCaughtError(), main(), observeClientPauseBeforeCursor() (+12 more)

### Community 42 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.17
Nodes (22): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+14 more)

### Community 44 - "pg-tx-history-adapter.ts"
Cohesion: 0.12
Nodes (21): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+13 more)

### Community 45 - "public-tables.ts"
Cohesion: 0.11
Nodes (24): ColumnType, ColumnFacts, keyOrder, RefusalCode, TableFacts, CatalogColumn, CatalogTable, PageOptions (+16 more)

### Community 46 - "check-required-tests.ts"
Cohesion: 0.14
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 47 - "ChainArchiveStore"
Cohesion: 0.08
Nodes (14): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage (+6 more)

### Community 48 - "describeNodeStoreExports"
Cohesion: 0.15
Nodes (12): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), 5.1 The `LedgerPackage` interface (LG-6), 5.2 Vendored builds (LG-5), 5.3 The ledger worker and the node-store bridge (LG-10, LG-11), 5.4 Storage, retention and sweep (LG-11 to LG-14) (+4 more)

### Community 49 - "TransactionHistoryEntry"
Cohesion: 0.14
Nodes (8): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends, 3.1 Field mapping (write path)

### Community 5 - "StorageError"
Cohesion: 0.06
Nodes (47): ConnectionError, Retryability, StorageError, HistoryUnavailableError, TemporalKVError, TransactionKeyReuseError, EnvelopeVersionUnsupportedError, WalletStateEnvelopeError (+39 more)

### Community 50 - "chain-archive-store.test.ts"
Cohesion: 0.16
Nodes (17): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, BlockRow, TxRow (+9 more)

### Community 51 - "PgChainArchiveStore"
Cohesion: 0.20
Nodes (9): BlockRecord, Hex32, TransactionMeta, PgChainArchiveStore, assertHex32(), hexToBuf(), sha256Hex(), toTxMeta() (+1 more)

### Community 52 - "full-sync-soak.integration.test.ts"
Cohesion: 0.08
Nodes (12): CurrentState, GcPass, HistGroup, SampleObservation, kvMapKey(), newPool(), readCurrentState(), { connectionUri } (+4 more)

### Community 53 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+12 more)

### Community 58 - "pg-kill-save.crash.test.ts"
Cohesion: 0.11
Nodes (19): C5AnyFn, assertSaveNotAutoRetriedUnderRetriableFault(), assertSaveNotInAnyAutoRetryAllowlist(), completeManifestCount(), completeManifestCountAtSeq(), danglingChunkCount(), listSrcTsFiles(), makeSerializationFaultInjectingClient() (+11 more)

### Community 59 - "chain-archive-rollover.ts"
Cohesion: 0.15
Nodes (18): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+10 more)

### Community 6 - "column-rules.ts"
Cohesion: 0.05
Nodes (54): ScalarColumnType, AllowedRule, Because, columnVerdict, DesignRow, Refusal, RefusalPlace, RefusedRule (+46 more)

### Community 62 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (16): BlobRole, BlockBundle, BlockMeta, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult (+8 more)

### Community 63 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 65 - "chain-archive-preprod-cloud-crossval.integration.test.ts"
Cohesion: 0.16
Nodes (5): IndexerClient, IndexerClientError, IndexerClientParseError, IndexerTransaction, MAX

### Community 66 - "NodeRpcClient"
Cohesion: 0.18
Nodes (6): NodeRpcClient, NodeRpcError, NodeRpcInvalidHeightError, NodeRpcParseError, SubstrateBlock, SubstrateHeader

### Community 67 - "contents-hash.ts"
Cohesion: 0.24
Nodes (14): CanonicalEncodingError, PublicContentsError, BlockWriteHandle, ReadHandle, encodeArrayHead(), encodeRow(), explain(), valueFailureBecause() (+6 more)

### Community 7 - "PgTransactionLeaseLayer"
Cohesion: 0.07
Nodes (38): PgCheckpointStore, UmbraDBSql, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters, Adapters, adaptersOf() (+30 more)

### Community 71 - "node-format.ts"
Cohesion: 0.25
Nodes (16): Child, NodeBatch, childKey(), concat(), decodeChildren(), encodeChild(), encodeChildren(), hasEmbeddedChild() (+8 more)

### Community 74 - "vendored-ledger-node-roots.test.ts"
Cohesion: 0.14
Nodes (13): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeRoot, hex(), runInFreshInstance(), requested, store (+5 more)

### Community 8 - "setup.ts"
Cohesion: 0.06
Nodes (48): Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount() (+40 more)

### Community 81 - "UmbraDBConnectionOptions"
Cohesion: 0.14
Nodes (14): UmbraDBConnectionOptions, Acceptance — v1.0.0-durable-checkpoint-cursor, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, Whole-change gates (non-goal compliance + sequencing), Requirement: the UmbraDB connection sets bounded server-side timeouts by default, Scenario: a caller can override each timeout default, Scenario: a raised idle-in-transaction default is honoured for a long in-transaction workload (+6 more)

### Community 82 - "postgres/transaction-history-storage.ts"
Cohesion: 0.24
Nodes (14): SerializationFailedError, EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow() (+6 more)

### Community 84 - "ws-mutual-tls.test.ts"
Cohesion: 0.19
Nodes (11): Attempt, connect(), file(), makeCa(), makeLeaf(), openssl(), read(), tlsClientErrors (+3 more)

### Community 9 - "createClient"
Cohesion: 0.07
Nodes (25): Migration, assertNoConflictingSearchPath(), assertValidSchemaName(), createClient(), isLockTimeout(), runMigrationsImpl(), withReservedTransaction(), pool() (+17 more)

### Community 91 - "load-under-prune.integration.test.ts"
Cohesion: 0.15
Nodes (12): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), seedCheckpoints(), sha256() (+4 more)

### Community 92 - "chain-archive-sync-retry.integration.test.ts"
Cohesion: 0.20
Nodes (10): FakeChainBlock, bootstrapChainArchiveSchema(), fakeChain(), fakeIndexerFetch(), fakeNodeFetch(), hx(), newService(), MAX_BLOCKS (+2 more)

### Community 97 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 111 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 120 - "transaction-history-storage.test.ts"
Cohesion: 0.20
Nodes (7): decodeSerializedContent(), decodeSerializedEntry(), store(), txLayer(), THS_RESERVED_KEY_PREFIX, FAKE_TX, { sql: getSql }

### Community 121 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 134 - "report"
Cohesion: 0.22
Nodes (9): report(), 14. Private processes, 8. Private processes (PP), Requirement: PP-4 The process transport, Requirement: PP-6 Lockstep instances process each height at that height, Requirement: PP-9 What the public side may call, Scenario: A lockstep instance is stopped, Scenario: A read through the core (+1 more)

### Community 136 - "key"
Cohesion: 0.28
Nodes (9): column(), key(), Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1), Requirement: withLease always releases its lease, even when fn throws, Scenario: A second acquireLease for a held key blocks until release, Scenario: Concurrent withLease calls on one key never overlap, Scenario: tryAcquireLease with no timeoutMs returns null promptly under contention (+1 more)

### Community 149 - "lease-nonwedge.crash.test.ts"
Cohesion: 0.32
Nodes (7): class2AdvisoryLockCountForHash(), pollForLockGone(), sleep(), worker(), liveWorkers, openPools, { sql: getSql, connectionUri }

### Community 160 - "decode"
Cohesion: 0.48
Nodes (7): decode(), Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Scenario: A future-versioned envelope is rejected cleanly, Scenario: An unknown top-level field is rejected as a typed envelope error (F7), Scenario: Non-JSON bytes are rejected as a typed envelope error, Scenario: Structurally invalid JSON is rejected as a typed envelope error

### Community 17 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 216 - "encodeContent"
Cohesion: 0.67
Nodes (3): encodeContent(), encodeSections(), encodeStoredEntry()

### Community 28 - ".save"
Cohesion: 0.06
Nodes (29): Benchmarks, Compatibility, and what 1.0.0 needs, If you build from source, Installing, Security, The fix this release exists for, The surface, UmbraDB 0.9.5 "Penumbra" (+21 more)

### Community 34 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)` (+21 more)

### Community 38 - "runMigrations"
Cohesion: 0.11
Nodes (28): runMigrations(), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7), The cross-vendor audit (two codex cold rounds, then bounded at convergence), 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 3. `synchronous_commit` — probe-warned, never refused, 4. Session-mode connection pooling only — probe-enforced (best-effort) (+20 more)

### Community 41 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: a sub-wallet absent from the envelope is skipped on restore, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence (+17 more)

### Community 55 - "vendored-ledger-v9.test.ts"
Cohesion: 0.23
Nodes (18): bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex(), nodesOf() (+10 more)

### Community 60 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (20): apply(), 12. Ledger, 10. Node client and ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Snapshots (+12 more)

### Community 90 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 95 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.15
Nodes (12): entry(), `transaction_history`, 4. Configuration, 4. Configuration, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity (+4 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: SN-1 Export, Requirement: SN-2 The file format, Requirement: SN-3 Import into an empty database, Requirement: SN-4 Import is all or nothing, Requirement: SN-5 A restored database continues like one that never stopped, Scenario: A tampered snapshot, Scenario: An import killed half-way (+4 more)

### Community 101 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 103 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.17
Nodes (12): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`) (+4 more)

### Community 104 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.17
Nodes (10): 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, UmbraDB v0.9.5 "Penumbra" — Release Record, UmbraDB v1.0.0 — Release Record (PENDING) (+2 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's snapshot, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Importing a snapshot in the page (+3 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Transactions commit or roll back atomically, Scenario: A callback that returns normally commits, Scenario: A callback that throws an unrelated error still rolls back, and that error propagates unchanged, Scenario: A callback that throws Rollback rolls back and rejects with TransactionRolledBackError, Scenario: A signal aborted after withTransaction has already started does not affect that call (+3 more)

### Community 108 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 109 - "UmbraDB"
Cohesion: 0.17
Nodes (12): Contents, Durability and crash semantics, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB (+4 more)

### Community 110 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 112 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 113 - "README.md"
Cohesion: 0.35
Nodes (3): Scope and pre-1.0 note, The three commitments, UmbraDB Stability Policy (SemVer)

### Community 114 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 115 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.18
Nodes (10): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG) (+2 more)

### Community 116 - "3. Proof-blocking findings"
Cohesion: 0.18
Nodes (11): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption (+3 more)

### Community 117 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.18
Nodes (10): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 3.1 The frozen catalog (the machine-facing API), 3. G3 — Frozen, cleaned error-code catalog with `retryable`, 5. G20 — Freeze the Lean cut-line (+2 more)

### Community 118 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.18
Nodes (10): 0. Package layout, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire, 3. G7 — Server-side timeouts, 6.1 The Fable-vs-Opus factual dispute (resolved by live test), 6.2 Blocking findings applied, 6.3 Non-blocking findings applied, 6.4 Non-blocking findings NOT changed (with reasoning — no finding rejected) (+2 more)

### Community 119 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 122 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 123 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 124 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 125 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 126 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 127 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 128 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.22
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 129 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 130 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 131 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 132 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 133 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 135 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 137 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding), 7. Testing strategy (post-implementation), Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 138 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 139 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 14 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 140 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 141 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 142 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 143 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 144 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 145 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 146 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 147 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 148 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 150 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 151 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.29
Nodes (5): 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 152 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 153 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 154 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 155 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 156 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 157 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.29
Nodes (6): 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV

### Community 158 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 159 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 161 - "Acceptance — v1.0.0 API Surface & Release Contract"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0 API Surface & Release Contract, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in), Precondition (blocks the whole change)

### Community 162 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.29
Nodes (6): 1. G13 — perf-correctness fixes (LAND FIRST), 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 163 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 164 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 165 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 166 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 169 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 170 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 171 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 172 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 173 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 174 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 175 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 176 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 177 - "Tasks — v1.0.0 API Surface & Release Contract"
Cohesion: 0.33
Nodes (5): 3. The freeze: build + package.json (G1), 5. Release contract docs (G2, G4), 6. Freeze the Lean cut-line (G20), 7. Packed-tarball install smoke test (G1), Tasks — v1.0.0 API Surface & Release Contract

### Community 178 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 179 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 18 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+30 more)

### Community 180 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 181 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 182 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 183 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 184 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 185 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 186 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 187 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.40
Nodes (4): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Suggested fix

### Community 188 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 189 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 19 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+30 more)

### Community 190 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 191 - "Proposal — Sprint 2: Transaction/Lease"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease, Why

### Community 192 - "Proposal — Sprint 4: Watermarks"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, Why

### Community 193 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, Why

### Community 194 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.40
Nodes (4): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first), G14 — benchmark harness + recorded baseline

### Community 195 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 197 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 198 - "9. Trust and refinement boundary"
Cohesion: 0.50
Nodes (4): 9. Trust and refinement boundary, Completed M1/M2/W1 claims, Deferred M2–M5 proof work, Named external obligations

### Community 199 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 20 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+30 more)

### Community 200 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 201 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 202 - "2. Schema — two corrections to `design/design.md` §3"
Cohesion: 0.50
Nodes (4): 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3

### Community 203 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.50
Nodes (3): Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes

### Community 204 - "Requirement: a non-object JSON value round-trips correctly"
Cohesion: 0.50
Nodes (4): Requirement: a non-object JSON value round-trips correctly, Scenario: A bare numeric watermark value round-trips exactly, Scenario: A bare string watermark value round-trips exactly, Scenario: A large integer encoded as a decimal string round-trips exactly

### Community 205 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 206 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 207 - "Vendored ledger builds"
Cohesion: 0.50
Nodes (3): Rebuilding, Updating a version, Vendored ledger builds

### Community 21 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+29 more)

### Community 210 - "Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease"
Cohesion: 0.67
Nodes (3): Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Scenario: acquireLease with a timeout throws LeaseTimeoutError on expiry, Scenario: tryAcquireLease with a timeout resolves null on expiry, not an error

### Community 211 - "Requirement: Aborting opts.signal during lease acquisition rejects with AbortError"
Cohesion: 0.67
Nodes (3): Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Scenario: Aborting while waiting for a contended lease releases nothing and rejects, Scenario: An already-aborted signal rejects before any connection is reserved

### Community 212 - "Requirement: Connection loss during lease acquisition or holding surfaces as LeaseFaultError"
Cohesion: 0.67
Nodes (3): Requirement: Connection loss during lease acquisition or holding surfaces as LeaseFaultError, Scenario: A dead held connection surfaces as LeaseFaultError on release, not LeaseNotHeldError, Scenario: A reservation failure during acquireLease surfaces as LeaseFaultError

### Community 213 - "Requirement: get returns exactly the last value set, scoped per (kind, key)"
Cohesion: 0.67
Nodes (3): Requirement: get returns exactly the last value set, scoped per (kind, key), Scenario: A different kind or key is never affected by an unrelated set, Scenario: get reflects the most recent set among several

### Community 214 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 23 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data responses name their view and height (+28 more)

### Community 24 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: CheckpointSummary metadata is populated and label round-trips (+28 more)

### Community 29 - "Requirements"
Cohesion: 0.06
Nodes (32): Purpose, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy (+24 more)

### Community 31 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy (+23 more)

### Community 32 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (30): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+22 more)

### Community 33 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (28): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+20 more)

### Community 35 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: history() computes per-manifest aggregates in a single grouped query (HP-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+22 more)

### Community 43 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 54 - "ADDED Requirements"
Cohesion: 0.09
Nodes (22): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block digests for modules that opt in, Requirement: DT-5 The `core-digest` part chains the digests, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A fractional JSON number (+14 more)

### Community 56 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 57 - "package.json"
Cohesion: 0.09
Nodes (21): bugs, url, description, exports, files, homepage, license, main (+13 more)

### Community 61 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not snapshotted, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+12 more)

### Community 64 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 68 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+9 more)

### Community 69 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, archive:sync, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 70 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 72 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 75 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.12
Nodes (15): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not), Rework (class 3 continued — cross-vendor cold audit, rounds 2-4) (+7 more)

### Community 76 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N) (+8 more)

### Community 77 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 15. Snapshots and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API, 3. Modules (+7 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor first, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+7 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: set rejects an invalid value with ValidationError before any statement, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: A get whose signal aborts after the call has begun likewise completes normally, Scenario: A new set always overwrites, with no conflict possible (+7 more)

### Community 83 - "ROADMAP.md"
Cohesion: 0.13
Nodes (10): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+2 more)

### Community 85 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.13
Nodes (15): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+7 more)

### Community 86 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (14): 10. Tables, 11. Refusals and halts (IN-12), 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 2. Points, 3. Block source and ingest, 4. The database API (+6 more)

### Community 87 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.13
Nodes (14): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4, 2. G9 — the four crash tests, 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12) (+6 more)

### Community 88 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 89 - "Roadmap"
Cohesion: 0.13
Nodes (15): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`) (+7 more)

### Community 93 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: the required Postgres configuration is published as a binding Durability Contract, Requirement: withLease surfaces a lease-release failure instead of swallowing it, Scenario: a clean release is unaffected, Scenario: a release failure after a successful fn, with a callback, resolves and reports, Scenario: a release failure after a successful fn, with no callback, rejects (+5 more)

### Community 96 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

## Knowledge Gaps
- **19 isolated node(s):** `./tsconfig.json`, `RFC-8949`, `local>midnightntwrk/renovate-config`, `PGPASSFILE`, `PYTHONHASHSEED` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1743 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `translatePostgresError`, `harness.ts`, `interfaces/temporal-kv.ts`, `StorageError`, `column-rules.ts`, `PgTransactionLeaseLayer`, `setup.ts`, `createClient`, `src/index.ts`, `cursor-durability.crash.test.ts`, `lease-nonwedge.crash.test.ts`, `cbor.property.test.ts`, `ref_node_fs`, `column-refusals.test.ts`, `differential-equivalence.test.ts`, `DurabilityContractError`, `vendored-ledger-files.test.ts`, `cold-boot-recovery.integration.test.ts`, `pg-tx-history-adapter.ts`, `check-required-tests.ts`, `chain-archive-store.test.ts`, `full-sync-soak.integration.test.ts`, `chain-archive-replay-decode.integration.test.ts`, `vendored-ledger-v9.test.ts`, `package.json`, `pg-kill-save.crash.test.ts`, `transaction-history-storage.property.test.ts`, `chain-archive-preprod-cloud-crossval.integration.test.ts`, `NodeRpcClient`, `pglite.test.ts`, `node-format.ts`, `vendored-ledger-node-roots.test.ts`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `load-under-prune.integration.test.ts`, `chain-archive-sync-retry.integration.test.ts`, `midnight-env — reproducible PREPROD dev environment`, `facade-merge-loader.ts`, `transaction-history-storage.test.ts`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `./tsconfig.json`, `RFC-8949`, `local>midnightntwrk/renovate-config` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `postgres/checkpoint-store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04610606784519828 - nodes in this community are weakly interconnected._
- **Why does `PgTemporalKV` connect `src/index.ts` to `postgres/checkpoint-store.ts`, `translatePostgresError`, `ValidationError`, `harness.ts`, `interfaces/temporal-kv.ts`, `StorageError`, `PgTransactionLeaseLayer`, `vitest`, `TransactionHandle`, `cursor-durability.crash.test.ts`, `saveAndAdvance`, `differential-equivalence.test.ts`, `crash-worker.ts`, `chain-archive-store.test.ts`, `full-sync-soak.integration.test.ts`, `Proposal — Sprint 2: Transaction/Lease`, `UmbraDB V1.0.0 Implementation Guideline`, `Storage Algebra Lean Formalization — Approved Design and Status`, `ADDED Requirements`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Are the 41 inferred relationships involving `ValidationError` (e.g. with `1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors` and `1.4 Runtime validation`) actually correct?**
  _`ValidationError` has 41 INFERRED edges - model-reasoned connections that need verification._
- **Should `translatePostgresError` be split into smaller, more focused modules?**
  _Cohesion score 0.05643513789581205 - nodes in this community are weakly interconnected._