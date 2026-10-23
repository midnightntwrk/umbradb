# Graph Report - UmbraDB

## Corpus Check
- 386 files · ~608,239 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 53 file(s) not represented in the graph (top: .lean 25, (none) 13, .patch 8)

## Summary
- 3580 nodes · 7468 edges · 231 communities (202 shown, 29 thin omitted)
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 1483 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `d2137c6946427747` (386 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- barrel-resolves.test.ts
- harness.ts
- node-store-suite.ts
- migrate.ts
- no-chain-sync-import-guard.test.ts
- runMigrations
- registerSuiteLifecycle
- sync-service.ts
- sqlite-writer-lock.test.ts
- chain-archive-sync-retry.integration.test.ts
- CrashWorkerHandle
- mutation-evidence.d.mts
- PgWalletStateEnvelopeStore
- ChunkMissingError
- TransactionHistoryEntry
- ref_node_fs
- StorageError
- src/index.ts
- translatePostgresError
- interfaces/temporal-kv.ts
- ValidationError
- CheckpointStore
- vendored-ledger-v9.test.ts
- cursor-durability.crash.test.ts
- TemporalKV
- differential-equivalence.test.ts
- pg-tx-history-adapter.ts
- TransactionHandle
- setup.ts
- cold-boot-recovery.integration.test.ts
- postgres/watermarks.ts
- check-required-tests.ts
- ws-mutual-tls.test.ts
- chain-archive-replay-decode.integration.test.ts
- full-sync-soak.integration.test.ts
- PgTransactionLeaseLayer
- ChainArchiveStore
- ConnectionError
- pg-kill-save.crash.test.ts
- node-format.ts
- .put
- describeNodeStoreExports
- transaction-history-storage.property.test.ts
- 0. Preconditions (blocking gate — verify before any freeze work)
- NodeRpcClient
- postgres/transaction-lease.ts
- Migration
- UmbraDBConnectionOptions
- postgres/chain-archive-store.ts
- crash-worker.ts
- PgTransactionHistoryStorage
- postgres/transaction-history-storage.ts
- load-under-prune.integration.test.ts
- chain-archive-rollover.ts
- Design — v1.0.0-perf-baseline
- facade-merge-loader.ts
- transaction-history-storage.test.ts
- .getAt
- graph.py
- watermarks.test.ts
- report
- exceedsMaxDepth
- temporal-kv.test.ts
- fresh-instance.mjs
- pglite.test.ts
- decode
- createClient
- withSuiteWatchdog
- .save
- saveAndAdvance
- pack-install.mjs
- 4. The freeze: the public barrel (G1)
- mutation-per-adapter.mjs
- Design — Sprint 7: Transaction History Storage
- lease-nonwedge.crash.test.ts
- Storage Layer Interface Specification
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- ROADMAP.md
- Design — Postgres+JSONB storage rebuild
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- openspec-explore/SKILL.md
- 3. Proof-blocking findings
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Design — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Global Constraints
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Tasks — Sprint 7: Transaction History Storage
- Acceptance criteria — v1.0.0-infosec-signoff
- vitest
- Our Pledge
- Midnight infra verification checklist
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 12. Milestone status
- 5. Recommended candidate model
- Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored
- Design — Sprint 5: Lean M3a Watermarks W1
- ADDED Requirements
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — v1.0.0-perf-baseline
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- UmbraDB — project instructions
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- ADDED Requirements
- Preprod connection — endpoints, wallet, faucet
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Algebraic Specification of the midnight-pg-store Storage Layer
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- What changes
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- ADDED Requirements
- feature-request.md
- 5. Ledger
- GC architecture and query-tracing: research findings
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- Test wallets
- 1. TemporalKV
- 2. Schema — two corrections to `design/design.md` §3
- Spec — capability `formal-completion`
- renovate.json
- Vendored ledger builds
- Environment changelog
- 6. Lean 4 feasibility
- start-stack.sh
- 9. Snapshots and browser
- Gate notes — Task 6: differential state-equivalence gate (G11)
- repository
- ADDED Requirements
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
- Requirements
- ADDED Requirements
- UmbraDB third-party component inventory (SBOM)
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- UmbraDB
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- devDependencies
- Roadmap
- ADDED Requirements
- REMOVED Requirements
- Storage Algebra Lean M2 Retention Sprint
- Design — CORE-ARCH: the standalone indexer's core architecture

## God Nodes (most connected - your core abstractions)
1. `PgTransactionLeaseLayer` - 93 edges
2. `ValidationError` - 87 edges
3. `PgCheckpointStore` - 87 edges
4. `runMigrations()` - 85 edges
5. `translatePostgresError()` - 78 edges
6. `vitest` - 77 edges
7. `createClient()` - 74 edges
8. `UmbraDBSql` - 72 edges
9. `StorageError` - 70 edges
10. `TransactionHandle` - 70 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: load before any save rejects with CheckpointNotFoundError` --references--> `CheckpointNotFoundError`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/specs/wallet-state-envelope/spec.md → src/interfaces/checkpoint-store.ts
- ``watermarks`` --references--> `HistoryUnavailableError`  [INFERRED]
  docs/SCHEMA.md → src/interfaces/temporal-kv.ts
- `2. TemporalKV → Postgres` --references--> `TransactionKeyReuseError`  [INFERRED]
  design/design.md → src/interfaces/temporal-kv.ts
- `Scenario: A transaction-key-reuse violation surfaces as TransactionKeyReuseError` --references--> `TransactionKeyReuseError`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts
- `Scenario: A transaction-key-reuse violation surfaces as TransactionKeyReuseError` --references--> `TransactionKeyReuseError`  [INFERRED]
  openspec/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts

## Import Cycles
- None detected.

## Communities (231 total, 29 thin omitted)

### Community 0 - "barrel-resolves.test.ts"
Cohesion: 0.06
Nodes (52): CheckpointNotFoundError, HistoryUnavailableError, TemporalKVError, TransactionKeyReuseError, VersionConflictError, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError (+44 more)

### Community 1 - "harness.ts"
Cohesion: 0.09
Nodes (48): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+40 more)

### Community 102 - "node-store-suite.ts"
Cohesion: 0.19
Nodes (10): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Disposable, NodeBatch, runInFreshInstance(), hasEmbeddedChild() (+2 more)

### Community 11 - "migrate.ts"
Cohesion: 0.07
Nodes (20): BlockRow, TxRow, isLockTimeout(), runMigrationsImpl(), withReservedTransaction(), apply(), bundleFixture(), makeBlock() (+12 more)

### Community 118 - "no-chain-sync-import-guard.test.ts"
Cohesion: 0.27
Nodes (7): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles(), ANSWER_WASM, esbuild

### Community 12 - "runMigrations"
Cohesion: 0.08
Nodes (38): DurabilityContractError, MigrationLockTimeoutError, runMigrations(), 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 3. `synchronous_commit` — probe-warned, never refused, 4. Session-mode connection pooling only — probe-enforced (best-effort), 5. Server-side timeouts — applied by `createClient` (documented) (+30 more)

### Community 13 - "registerSuiteLifecycle"
Cohesion: 0.06
Nodes (24): Method, ApplicationError, InjectedReleaseFaultLayer, txLayer(), registerSuiteLifecycle(), kv(), kv(), txLayer() (+16 more)

### Community 14 - "sync-service.ts"
Cohesion: 0.09
Nodes (21): IndexerBlock, IndexerClient, IndexerClientError, IndexerClientOptions, IndexerClientParseError, IndexerTransaction, NodeRpcClientOptions, ChainArchiveSyncService (+13 more)

### Community 147 - "sqlite-writer-lock.test.ts"
Cohesion: 0.25
Nodes (3): LockResult, kill(), children

### Community 149 - "chain-archive-sync-retry.integration.test.ts"
Cohesion: 0.39
Nodes (6): FakeChainBlock, fakeChain(), fakeIndexerFetch(), fakeNodeFetch(), hx(), newService()

### Community 165 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 18 - "PgWalletStateEnvelopeStore"
Cohesion: 0.06
Nodes (32): PgWalletStateEnvelopeStore, envelopeStore(), T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on), 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 2. Module layout and dependency direction (+24 more)

### Community 2 - "ChunkMissingError"
Cohesion: 0.06
Nodes (51): CheckpointRecord, CheckpointStoreError, CheckpointSummary, ChunkIntegrityError, ChunkMissingError, ManifestCorruptError, PruneResult, assertValidCheckpointIds() (+43 more)

### Community 20 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (13): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces (+5 more)

### Community 22 - "ref_node_fs"
Cohesion: 0.08
Nodes (17): Lockfile, Manifest, Upstream, filesUnder(), patchesOf(), patchText(), check, checker (+9 more)

### Community 23 - "StorageError"
Cohesion: 0.07
Nodes (32): Retryability, StorageError, Row, Boundary held, Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7), The cross-vendor audit (two codex cold rounds, then bounded at convergence), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable (+24 more)

### Community 24 - "src/index.ts"
Cohesion: 0.11
Nodes (26): CheckpointStoreErrorCode, ContentHash, SharedStorageErrorCode, TemporalKVErrorCode, EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle (+18 more)

### Community 26 - "translatePostgresError"
Cohesion: 0.14
Nodes (21): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, ClockRegressionError, PgDriverError (+13 more)

### Community 28 - "interfaces/temporal-kv.ts"
Cohesion: 0.10
Nodes (28): AssertExact, JsonValue, _VersionedEntryInSync, KvRow, BatchSpec, CurrentState, CurrentState, CurrentState (+20 more)

### Community 3 - "ValidationError"
Cohesion: 0.07
Nodes (40): CheckpointSequence, HistoryOptions, SaveCheckpointOptions, ValidationError, EnvelopeCorruptError, EnvelopeVersionUnsupportedError, WalletStateEnvelope, WalletStateEnvelopeError (+32 more)

### Community 31 - "CheckpointStore"
Cohesion: 0.07
Nodes (27): CheckpointStore, Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, The chunk pool is one global trust domain with an observable cross-wallet side channel (+19 more)

### Community 34 - "vendored-ledger-v9.test.ts"
Cohesion: 0.17
Nodes (23): NodeRoot, bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex() (+15 more)

### Community 35 - "cursor-durability.crash.test.ts"
Cohesion: 0.09
Nodes (26): InvariantResult, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs(), durableKvValues(), itemKey(), itemValue() (+18 more)

### Community 36 - "TemporalKV"
Cohesion: 0.08
Nodes (24): TemporalKV, 3. Replay convergence is judged on CURRENT state, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 5. Test infrastructure (+16 more)

### Community 37 - "differential-equivalence.test.ts"
Cohesion: 0.13
Nodes (25): Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1(), injectT2() (+17 more)

### Community 38 - "pg-tx-history-adapter.ts"
Cohesion: 0.12
Nodes (23): SerializationFailedError, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 4 - "TransactionHandle"
Cohesion: 0.07
Nodes (45): TransactionHandle, TransactionHandleInvalidError, TransactionLeaseLayer, Watermarks, SaveAndAdvanceDeps, sha256(), splitChunks(), resolveTransaction() (+37 more)

### Community 40 - "setup.ts"
Cohesion: 0.09
Nodes (25): Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount() (+17 more)

### Community 42 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.17
Nodes (22): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+14 more)

### Community 43 - "postgres/watermarks.ts"
Cohesion: 0.15
Nodes (15): WatermarkKey, WatermarkKind, WatermarkValue, SaveAndAdvanceCursor, WatermarkRow, WatermarkValueSchema, { sql: getSql, connectionUri }, RFC-8259 (+7 more)

### Community 45 - "check-required-tests.ts"
Cohesion: 0.14
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 47 - "ws-mutual-tls.test.ts"
Cohesion: 0.10
Nodes (21): Attempt, locked(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+13 more)

### Community 48 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+12 more)

### Community 49 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (11): GcPass, HistGroup, SampleObservation, kvMapKey(), newPool(), readCurrentState(), { connectionUri }, DECLARED_ENVELOPE (+3 more)

### Community 5 - "PgTransactionLeaseLayer"
Cohesion: 0.09
Nodes (41): PgCheckpointStore, UmbraDBSql, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters, Adapters (+33 more)

### Community 50 - "ChainArchiveStore"
Cohesion: 0.09
Nodes (11): ChainArchiveStore, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, How the two lineages coexist, Table of contents (+3 more)

### Community 51 - "ConnectionError"
Cohesion: 0.12
Nodes (19): ConnectionError, TransactionFaultError, 4. Save-retry caveat, Requirement: A transaction timeout surfaces as TransactionFaultError, Scenario: A slow statement under a tight timeout fails the transaction, Requirement: Postgres errors surface as the shared StorageError hierarchy, Scenario: A connection failure during get surfaces as ConnectionError, not undefined, Scenario: A connection failure during set surfaces as ConnectionError (+11 more)

### Community 56 - "pg-kill-save.crash.test.ts"
Cohesion: 0.12
Nodes (18): C5AnyFn, assertSaveNotAutoRetriedUnderRetriableFault(), assertSaveNotInAnyAutoRetryAllowlist(), completeManifestCount(), completeManifestCountAtSeq(), danglingChunkCount(), listSrcTsFiles(), makeSerializationFaultInjectingClient() (+10 more)

### Community 58 - "node-format.ts"
Cohesion: 0.23
Nodes (14): Reader, childKey(), concat(), decodeChild(), decodeChildren(), encodeChild(), encodeChildren(), nodeKey() (+6 more)

### Community 59 - ".put"
Cohesion: 0.28
Nodes (11): AsOf, Key, Namespace, Scope, Version, VersionedEntry, toEntry(), 3.2 TemporalKV (+3 more)

### Community 64 - "describeNodeStoreExports"
Cohesion: 0.24
Nodes (6): NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), 5.2 Vendored builds (LG-5), 0. Pins and verification, What the patches add

### Community 66 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (15): Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS, goodLeaf (+7 more)

### Community 67 - "0. Preconditions (blocking gate — verify before any freeze work)"
Cohesion: 0.24
Nodes (13): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, TransactionPoolerDetectedError, RunMigrationsOptions, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites() (+5 more)

### Community 68 - "NodeRpcClient"
Cohesion: 0.18
Nodes (6): NodeRpcClient, NodeRpcError, NodeRpcInvalidHeightError, NodeRpcParseError, SubstrateBlock, SubstrateHeader

### Community 7 - "postgres/transaction-lease.ts"
Cohesion: 0.09
Nodes (37): Lease, LeaseAcquireOptions, Rollback, TransactionOptions, HeldLease, abortError(), withAbort(), isConnectionFailure() (+29 more)

### Community 73 - "Migration"
Cohesion: 0.12
Nodes (16): Migration, 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), 1. Durability contract, 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer (+8 more)

### Community 78 - "UmbraDBConnectionOptions"
Cohesion: 0.13
Nodes (15): UmbraDBConnectionOptions, Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, Whole-change gates (non-goal compliance + sequencing), Requirement: the UmbraDB connection sets bounded server-side timeouts by default, Scenario: a caller can override each timeout default (+7 more)

### Community 8 - "postgres/chain-archive-store.ts"
Cohesion: 0.11
Nodes (27): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+19 more)

### Community 85 - "crash-worker.ts"
Cohesion: 0.20
Nodes (14): CoTxCallable, CoTxPauseInfo, CrashHook, describeCaughtError(), main(), observeClientPauseBeforeCursor(), pauseThenResume(), pauseUntilKilled() (+6 more)

### Community 9 - "PgTransactionHistoryStorage"
Cohesion: 0.09
Nodes (37): TransactionHistoryStorage, PgTransactionHistoryStorage, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation), Build (one product module + one thin envelope — corrected from the original "exactly two things, zero new code" framing; see finding below) (+29 more)

### Community 90 - "postgres/transaction-history-storage.ts"
Cohesion: 0.23
Nodes (14): JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), encodeContent() (+6 more)

### Community 91 - "load-under-prune.integration.test.ts"
Cohesion: 0.15
Nodes (12): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), runUnSnapshottedReadUnderPrune(), seedCheckpoints() (+4 more)

### Community 92 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 110 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.18
Nodes (10): coerceToSafeNumber(), 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected (+2 more)

### Community 113 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 119 - "transaction-history-storage.test.ts"
Cohesion: 0.20
Nodes (7): decodeSerializedContent(), decodeSerializedEntry(), store(), txLayer(), THS_RESERVED_KEY_PREFIX, FAKE_TX, { sql: getSql }

### Community 139 - ".getAt"
Cohesion: 0.25
Nodes (5): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why, Performance

### Community 15 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 151 - "watermarks.test.ts"
Cohesion: 0.25
Nodes (4): store(), txLayer(), FAKE_TX, { sql: getSql, connectionUri }

### Community 157 - "report"
Cohesion: 0.29
Nodes (7): report(), 14. Private processes, 8. Private processes (PP), Requirement: PP-6 Lockstep instances process each height at that height, Requirement: PP-9 What the public side may call, Scenario: A lockstep instance is stopped, Scenario: The core's view of an instance

### Community 161 - "exceedsMaxDepth"
Cohesion: 0.33
Nodes (6): exceedsMaxDepth(), EntrySectionsSchema, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-durable-checkpoint-cursor, What changes

### Community 166 - "temporal-kv.test.ts"
Cohesion: 0.29
Nodes (4): kv(), txLayer(), FAKE_TX, { sql: getSql }

### Community 181 - "fresh-instance.mjs"
Cohesion: 0.40
Nodes (4): hex(), requested, store, stored

### Community 41 - "decode"
Cohesion: 0.08
Nodes (28): decode(), ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+20 more)

### Community 46 - "createClient"
Cohesion: 0.12
Nodes (15): bootstrapChainArchiveSchema(), assertNoConflictingSearchPath(), createClient(), MAX_BLOCKS, service, sql, DEFAULT_IDLE_IN_TX_TIMEOUT_MS, DEFAULT_LOCK_TIMEOUT_MS (+7 more)

### Community 57 - "withSuiteWatchdog"
Cohesion: 0.14
Nodes (19): completeManifestCount(), completeManifestCountAtSeq(), danglingChunkCount(), junctionRowCount(), manifestRowCountAtSeq(), orphanJunctionCount(), pool(), completeManifestCount() (+11 more)

### Community 6 - ".save"
Cohesion: 0.04
Nodes (47): validateSaveOptions(), ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: CheckpointSummary metadata is populated and label round-trips (+39 more)

### Community 62 - "saveAndAdvance"
Cohesion: 0.15
Nodes (18): saveAndAdvance(), 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay, If you build from source (+10 more)

### Community 63 - "pack-install.mjs"
Cohesion: 0.17
Nodes (15): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin (+7 more)

### Community 74 - "4. The freeze: the public barrel (G1)"
Cohesion: 0.15
Nodes (14): assertValidSchemaName(), createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 8. Migration, 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`) (+6 more)

### Community 89 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 93 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.14
Nodes (13): entry(), tier1_wallet lineage, `transaction_history`, Wallet State Envelope, `watermarks`, 4. Configuration, 4. Configuration, 1. Schema (+5 more)

### Community 96 - "lease-nonwedge.crash.test.ts"
Cohesion: 0.18
Nodes (13): worker(), class2AdvisoryLockCountForHash(), pollForLockGone(), pool(), sleep(), worker(), worker(), worker() (+5 more)

### Community 97 - "Storage Layer Interface Specification"
Cohesion: 0.15
Nodes (10): 1.2 Async pattern, 1.3 Transaction participation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 3.4 Watermarks, 3. Module Interfaces, 4. Composition with `WalletStateStore` / `PrivateStateProvider` (+2 more)

### Community 10 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: SN-1 Export, Requirement: SN-2 The file format, Requirement: SN-3 Import into an empty database, Requirement: SN-4 Import is all or nothing, Requirement: SN-5 A restored database continues like one that never stopped, Scenario: A tampered snapshot, Scenario: An import killed half-way (+4 more)

### Community 101 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 103 - "ROADMAP.md"
Cohesion: 0.17
Nodes (9): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+1 more)

### Community 104 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.17
Nodes (12): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`) (+4 more)

### Community 105 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.17
Nodes (10): 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, UmbraDB v0.9.5 "Penumbra" — Release Record, UmbraDB v1.0.0 — Release Record (PENDING) (+2 more)

### Community 106 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.17
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's snapshot, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Importing a snapshot in the page (+3 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: Fast equals full (+3 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 111 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 112 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 114 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 115 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 116 - "3. Proof-blocking findings"
Cohesion: 0.18
Nodes (11): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption (+3 more)

### Community 117 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 120 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 121 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 122 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 123 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer) (+1 more)

### Community 124 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 125 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

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
Nodes (8): Benchmarks, Compatibility, and what 1.0.0 needs, Errors, Installing, Security, UmbraDB 0.9.5 "Penumbra", What is proved, and what that is worth, What this is not

### Community 132 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 133 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 134 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 135 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 136 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 138 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 140 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 141 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 142 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 143 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 144 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 145 - "Tasks — Sprint 7: Transaction History Storage"
Cohesion: 0.25
Nodes (7): 0. Specification freeze, 1. Vendor/pin manifest, 2. Schema + interface, 3. PgTransactionHistoryStorage implementation, 6. Live-sync tier (nightly/labeled — blocked on design.md §7's open question), 7. Close-out, Tasks — Sprint 7: Transaction History Storage

### Community 146 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 148 - "vitest"
Cohesion: 0.25
Nodes (3): settings, DURABILITY, vitest

### Community 152 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 153 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 154 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 155 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 156 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 158 - "Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Scenario: A stale transaction handle is rejected before any query runs, Scenario: Two puts inside one withTransaction both commit together, Scenario: Two puts inside one withTransaction either both commit or neither does, temporal-kv (transaction-participation wiring)

### Community 159 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 16 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+30 more)

### Community 160 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 162 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.29
Nodes (6): 1. G13 — perf-correctness fixes (LAND FIRST), 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 163 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 164 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 167 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 168 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 17 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+30 more)

### Community 170 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 171 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 172 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.33
Nodes (6): 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 173 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 174 - "What changes"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, What changes, Why

### Community 175 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 176 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 177 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 178 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 179 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 180 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 182 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 183 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 184 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 185 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 186 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 187 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 188 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 189 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 19 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data responses name their view and height (+28 more)

### Community 190 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 191 - "5. Ledger"
Cohesion: 0.40
Nodes (5): 5.1 The `LedgerPackage` interface (LG-6), 5.3 The ledger worker and the node-store bridge (LG-10, LG-11), 5.4 Storage, retention and sweep (LG-11 to LG-14), 5.5 Ledger tasks (LG-17, Q49), 5. Ledger

### Community 192 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 194 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 195 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 196 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 197 - "Test wallets"
Cohesion: 0.50
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 198 - "1. TemporalKV"
Cohesion: 0.50
Nodes (3): 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV

### Community 199 - "2. Schema — two corrections to `design/design.md` §3"
Cohesion: 0.50
Nodes (4): 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3

### Community 200 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 201 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 202 - "Vendored ledger builds"
Cohesion: 0.50
Nodes (3): Rebuilding, Updating a version, Vendored ledger builds

### Community 205 - "6. Lean 4 feasibility"
Cohesion: 0.67
Nodes (3): 6.1 Approved M1 module layout, 6.2 First theorem tranche, 6. Lean 4 feasibility

### Community 207 - "9. Snapshots and browser"
Cohesion: 0.67
Nodes (3): 9.1 Snapshots (SN), 9.2 Browser build (BR), 9. Snapshots and browser

### Community 209 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 21 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 25 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+25 more)

### Community 27 - "Requirements"
Cohesion: 0.06
Nodes (32): Purpose, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy (+24 more)

### Community 29 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy (+23 more)

### Community 30 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (28): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+20 more)

### Community 32 - "Full-Chain Storage — Design"
Cohesion: 0.07
Nodes (29): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+21 more)

### Community 33 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)` (+21 more)

### Community 39 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

### Community 44 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 52 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 53 - "package.json"
Cohesion: 0.09
Nodes (21): bugs, url, description, exports, files, homepage, license, main (+13 more)

### Community 54 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not snapshotted, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+12 more)

### Community 55 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: A bare numeric watermark value round-trips exactly (+12 more)

### Community 60 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (19): 10. Node client and ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Snapshots, 16. Browser, 17. Library surface and gates (+11 more)

### Community 61 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1), Requirement: Transactions commit or roll back atomically, Requirement: withLease always releases its lease, even when fn throws, Scenario: A callback that returns normally commits (+11 more)

### Community 65 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block digests for modules that opt in, Requirement: DT-5 The `core-digest` part chains the digests, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A fractional JSON number (+9 more)

### Community 70 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+9 more)

### Community 71 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, archive:sync, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 72 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 75 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 76 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (16): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 15. Snapshots and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+8 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 79 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.12
Nodes (15): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not), Rework (class 3 continued — cross-vendor cold audit, rounds 2-4) (+7 more)

### Community 80 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.12
Nodes (16): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+8 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor first, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+7 more)

### Community 83 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.12
Nodes (15): 0. Package layout, 2.1 Where the probe runs (the one real design decision), 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+7 more)

### Community 84 - "UmbraDB"
Cohesion: 0.12
Nodes (16): CheckpointStore: content-addressed snapshots, Contents, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security, Status (+8 more)

### Community 86 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.13
Nodes (14): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4, 2. G9 — the four crash tests, 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12) (+6 more)

### Community 87 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 88 - "Roadmap"
Cohesion: 0.13
Nodes (15): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`) (+7 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+5 more)

### Community 95 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 98 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 99 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.15
Nodes (12): 10. Tables, 11. Refusals and halts (IN-12), 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 2. Points, 3. Block source and ingest (+4 more)

## Knowledge Gaps
- **13 isolated node(s):** `./tsconfig.json`, `local>midnightntwrk/renovate-config`, `PGPASSFILE`, `PYTHONHASHSEED`, `RFC-8259` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1676 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `barrel-resolves.test.ts`, `ValidationError`, `PgTransactionLeaseLayer`, `migrate.ts`, `registerSuiteLifecycle`, `sync-service.ts`, `sqlite-writer-lock.test.ts`, `chain-archive-sync-retry.integration.test.ts`, `ref_node_fs`, `watermarks.test.ts`, `src/index.ts`, `translatePostgresError`, `interfaces/temporal-kv.ts`, `vendored-ledger-v9.test.ts`, `cursor-durability.crash.test.ts`, `differential-equivalence.test.ts`, `pg-tx-history-adapter.ts`, `temporal-kv.test.ts`, `setup.ts`, `cold-boot-recovery.integration.test.ts`, `postgres/watermarks.ts`, `check-required-tests.ts`, `createClient`, `ws-mutual-tls.test.ts`, `chain-archive-replay-decode.integration.test.ts`, `full-sync-soak.integration.test.ts`, `package.json`, `pg-kill-save.crash.test.ts`, `withSuiteWatchdog`, `pglite.test.ts`, `transaction-history-storage.property.test.ts`, `0. Preconditions (blocking gate — verify before any freeze work)`, `NodeRpcClient`, `mutation-per-adapter.mjs`, `load-under-prune.integration.test.ts`, `lease-nonwedge.crash.test.ts`, `node-store-suite.ts`, `facade-merge-loader.ts`, `no-chain-sync-import-guard.test.ts`, `transaction-history-storage.test.ts`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `./tsconfig.json`, `local>midnightntwrk/renovate-config`, `PGPASSFILE` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `barrel-resolves.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05780885780885781 - nodes in this community are weakly interconnected._
- **Why does `PgTemporalKV` connect `PgTransactionLeaseLayer` to `barrel-resolves.test.ts`, `harness.ts`, `ChunkMissingError`, `TransactionHandle`, `postgres/transaction-lease.ts`, `registerSuiteLifecycle`, `src/index.ts`, `translatePostgresError`, `interfaces/temporal-kv.ts`, `Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored`, `cursor-durability.crash.test.ts`, `TemporalKV`, `differential-equivalence.test.ts`, `temporal-kv.test.ts`, `createClient`, `full-sync-soak.integration.test.ts`, `.put`, `ADDED Requirements`, `1. TemporalKV`, `Storage Algebra Lean Formalization — Approved Design and Status`, `crash-worker.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Are the 41 inferred relationships involving `ValidationError` (e.g. with `1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors` and `1.4 Runtime validation`) actually correct?**
  _`ValidationError` has 41 INFERRED edges - model-reasoned connections that need verification._
- **Should `harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0898995240613432 - nodes in this community are weakly interconnected._