# Graph Report - UmbraDB

## Corpus Check
- 390 files · ~617,022 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 53 file(s) not represented in the graph (top: .lean 25, (none) 13, .patch 8)

## Summary
- 3663 nodes · 7681 edges · 243 communities (216 shown, 27 thin omitted)
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 1503 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `0d6e0b33abbbce74` (390 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- postgres/transaction-lease.ts
- runMigrations
- IndexerClient
- midnight-env — reproducible PREPROD dev environment
- ValidationError
- gc.ts
- interfaces/temporal-kv.ts
- no-chain-sync-import-guard.test.ts
- CheckpointNotFoundError
- withSuiteWatchdog
- cursor-durability.crash.test.ts
- mutation-evidence.d.mts
- TransactionHistoryEntry
- setup.ts
- pg-tx-history-adapter.ts
- TemporalKV
- cbor.ts
- StorageError
- barrel-resolves.test.ts
- src/index.ts
- differential-equivalence.test.ts
- TransactionHandle
- cbor.property.test.ts
- chain-archive-sync-retry.integration.test.ts
- check-required-tests.ts
- translatePostgresError
- describeNodeStoreExports
- PgTransactionHistoryStorage
- cold-boot-recovery.integration.test.ts
- node-format.ts
- VersionConflictError
- chain-archive-replay-decode.integration.test.ts
- withAbort
- .save
- full-sync-soak.integration.test.ts
- sync-service.ts
- crash-worker.ts
- ref_node_fs
- ClockRegressionError
- What changes — the 1.0.0 gate items this change addresses
- ChainArchiveStore
- wallet-state-envelope.test.ts
- cbor.test.ts
- vitest
- postgres/chain-archive-store.ts
- pg-kill-save.crash.test.ts
- .history
- postgres/checkpoint-store.ts
- interfaces/transaction-history-storage.ts
- ws-mutual-tls.test.ts
- TransactionKeyReuseError
- vendored-ledger-node-roots.test.ts
- CheckpointStore
- PgWalletStateEnvelopeStore
- PgTransactionLeaseLayer
- conformance-gate.mjs
- postgres/transaction-history-storage.ts
- harness.ts
- error-catalog-drift.test.ts
- load-under-prune.integration.test.ts
- chain-archive-rollover.ts
- Design — Sprint 7: Transaction History Storage
- facade-merge-loader.ts
- 001_chain_archive_core.ts
- encode
- Design — v1.0.0-perf-baseline
- pack-install.mjs
- graph.py
- lease-nonwedge.crash.test.ts
- watermarks.test.ts
- decode
- temporal-kv.test.ts
- pglite.test.ts
- migrate.ts
- vendored-ledger-v9.test.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- ADDED Requirements
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — Postgres+JSONB storage rebuild
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- README.md
- openspec-explore/SKILL.md
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- 3. Proof-blocking findings
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Design — Sprint 3: CheckpointStore
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- UmbraDB
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- 3. Live-node/indexer confirmation
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- ADDED Requirements
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Design — v1.0.0 API Surface & Release Contract
- Tasks — v1.0.0-infosec-signoff
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- ADDED Requirements
- Checkpoint-store composition contract — cursor ordering and replay
- UmbraDB 1.0.0 Release Contracts
- UmbraDB 0.9.5 "Penumbra"
- Global Constraints
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Repository agent policy
- Our Pledge
- Midnight infra verification checklist
- 2.1 The boundary rule (the feature's key design decision)
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 12. Milestone status
- 5. Recommended candidate model
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
- ADDED Requirements
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — v1.0.0 API Surface & Release Contract
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
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Acceptance criteria — v1.0.0-perf-baseline
- GC architecture and query-tracing: research findings
- PULL_REQUEST_CHECKLIST.md
- 9. Trust and refinement boundary
- documentation-improvement.md
- Overview
- Test wallets
- Proposal — Sprint 2: Transaction/Lease
- Proposal — Sprint 3: CheckpointStore
- Requirement: load always fully verifies chunk integrity before returning
- ADDED Requirements
- Proposal — v1.0.0-durable-checkpoint-cursor
- Spec — capability `formal-completion`
- renovate.json
- Vendored ledger builds
- Environment changelog
- 6. Lean 4 feasibility
- start-stack.sh
- temporal-kv (transaction-participation wiring)
- Requirement: CheckpointSummary metadata is populated and label round-trips
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
- ADDED Requirements
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- scripts
- stryker.conf.json
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ROADMAP.md
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- ADDED Requirements
- UmbraDB V1.0.0 Implementation Guideline
- devDependencies
- Roadmap
- Design — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- REMOVED Requirements

## God Nodes (most connected - your core abstractions)
1. `PgTransactionLeaseLayer` - 93 edges
2. `ValidationError` - 87 edges
3. `PgCheckpointStore` - 87 edges
4. `runMigrations()` - 85 edges
5. `vitest` - 79 edges
6. `translatePostgresError()` - 78 edges
7. `createClient()` - 74 edges
8. `UmbraDBSql` - 72 edges
9. `StorageError` - 70 edges
10. `TransactionHandle` - 70 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: acquireLease with a timeout throws LeaseTimeoutError on expiry` --references--> `LeaseTimeoutError`  [INFERRED]
  openspec/changes/sprint-2-transaction-lease/specs/transaction-lease/spec.md → src/interfaces/transaction-lease.ts
- `Scenario: A callback that throws Rollback rolls back and rejects with TransactionRolledBackError` --references--> `TransactionRolledBackError`  [INFERRED]
  openspec/changes/sprint-2-transaction-lease/specs/transaction-lease/spec.md → src/interfaces/transaction-lease.ts
- `LL-002 — A7 watermark-participation negative control did not fire; survived fix-round-1, caught by round-2 cold cross-vendor Codex` --references--> `ValidationError`  [INFERRED]
  docs/v1-lessons-learned.md → src/interfaces/storage-errors.ts
- `1. Chunking` --references--> `ValidationError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/design.md → src/interfaces/storage-errors.ts
- `Scenario: A chunkSize above the schema's 16 MiB bound is rejected with no work done` --references--> `ValidationError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/storage-errors.ts

## Import Cycles
- None detected.

## Communities (243 total, 27 thin omitted)

### Community 0 - "postgres/transaction-lease.ts"
Cohesion: 0.06
Nodes (51): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionFaultError, TransactionLeaseError, TransactionRolledBackError (+43 more)

### Community 1 - "runMigrations"
Cohesion: 0.07
Nodes (52): DurabilityContractError, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, TransactionPoolerDetectedError, MigrationLockTimeoutError, assertNoTransactionPooler(), classifyFsync() (+44 more)

### Community 100 - "IndexerClient"
Cohesion: 0.22
Nodes (4): IndexerClient, IndexerClientError, IndexerClientParseError, IndexerTransaction

### Community 108 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.18
Nodes (9): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS) (+1 more)

### Community 11 - "ValidationError"
Cohesion: 0.06
Nodes (38): ValidationError, exceedsMaxDepth(), EntrySectionsSchema, Requirement: prune rejects a retainCount that is not a positive safe integer, before any deletion runs, Scenario: A non-integer or non-finite retainCount is rejected with no effect, Scenario: An integer retainCount outside the safe integer range is rejected with no effect, Scenario: retainCount of zero is rejected with no effect, Requirement: set rejects an invalid value with ValidationError before any statement (+30 more)

### Community 116 - "gc.ts"
Cohesion: 0.24
Nodes (10): GcCurve, GcPoint, GcScaleOpts, adjudicate(), measureGcPass(), populateChunks(), runGcScale(), ENVELOPE_MAX_CHUNKS (+2 more)

### Community 12 - "interfaces/temporal-kv.ts"
Cohesion: 0.13
Nodes (28): AsOf, AssertExact, JsonValue, Key, Namespace, Scope, Version, VersionedEntry (+20 more)

### Community 125 - "no-chain-sync-import-guard.test.ts"
Cohesion: 0.27
Nodes (7): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles(), ANSWER_WASM, esbuild

### Community 142 - "CheckpointNotFoundError"
Cohesion: 0.33
Nodes (8): CheckpointNotFoundError, Requirement: load and history distinguish "no checkpoint" from "checkpoint exists elsewhere", Scenario: history for a wallet+network with no checkpoints resolves empty, Scenario: No checkpoint exists for the wallet+network at all, Scenario: Omitting sequence loads the latest checkpoint, Scenario: The wallet+network has checkpoints but not at the requested sequence, Requirement: loading a never-saved wallet surfaces a typed not-found, not a silent empty result, Scenario: load before any save rejects with CheckpointNotFoundError

### Community 16 - "withSuiteWatchdog"
Cohesion: 0.08
Nodes (35): SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount(), pool(), watermarkCount(), worker(), worker(), completeManifestCount() (+27 more)

### Community 17 - "cursor-durability.crash.test.ts"
Cohesion: 0.07
Nodes (28): InvariantResult, CrashWorkerHandle, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs(), durableKvValues(), itemKey() (+20 more)

### Community 174 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 19 - "TransactionHistoryEntry"
Cohesion: 0.10
Nodes (15): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends (+7 more)

### Community 2 - "setup.ts"
Cohesion: 0.05
Nodes (36): Method, Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, getTestContainer(), registerSuiteLifecycle() (+28 more)

### Community 20 - "pg-tx-history-adapter.ts"
Cohesion: 0.08
Nodes (29): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+21 more)

### Community 22 - "TemporalKV"
Cohesion: 0.08
Nodes (27): SerializationFailedError, TemporalKV, 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.3 Transaction participation, 1.5 Naming, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file), 3.4 Watermarks (+19 more)

### Community 23 - "cbor.ts"
Cohesion: 0.14
Nodes (28): ColumnMode, Mode, PathNode, ScalarColumnType, Task, Writer, checkSafeInteger(), compareBytes() (+20 more)

### Community 24 - "StorageError"
Cohesion: 0.09
Nodes (31): ConnectionError, Retryability, StorageError, Row, Boundary held, Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24), Reconciliations recorded as consolidating-lead decisions (spec written pre-G6/G7), The cross-vendor audit (two codex cold rounds, then bounded at convergence) (+23 more)

### Community 28 - "barrel-resolves.test.ts"
Cohesion: 0.12
Nodes (25): CheckpointStoreError, ChunkIntegrityError, ChunkMissingError, ManifestCorruptError, EnvelopeVersionUnsupportedError, 3.3 CheckpointStore, The catalog, CheckpointStore tables (+17 more)

### Community 3 - "src/index.ts"
Cohesion: 0.10
Nodes (46): CheckpointStoreErrorCode, SharedStorageErrorCode, TemporalKVErrorCode, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryStatus (+38 more)

### Community 30 - "differential-equivalence.test.ts"
Cohesion: 0.13
Nodes (26): Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1(), injectT2() (+18 more)

### Community 32 - "TransactionHandle"
Cohesion: 0.13
Nodes (22): TransactionHistoryReader, TransactionHistoryWriter, TransactionHandle, TransactionHandleInvalidError, resolveTransaction(), Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Scenario: A stale transaction handle is rejected before any query runs, Scenario: Two puts inside one withTransaction both commit together (+14 more)

### Community 34 - "cbor.property.test.ts"
Cohesion: 0.11
Nodes (27): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+19 more)

### Community 35 - "chain-archive-sync-retry.integration.test.ts"
Cohesion: 0.12
Nodes (13): NodeRpcClient, NodeRpcError, NodeRpcInvalidHeightError, NodeRpcParseError, SubstrateBlock, SubstrateHeader, BlockBundle, FakeChainBlock (+5 more)

### Community 37 - "check-required-tests.ts"
Cohesion: 0.14
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 38 - "translatePostgresError"
Cohesion: 0.22
Nodes (10): Hex32, TransactionMeta, PgChainArchiveStore, assertHex32(), hexToBuf(), sha256Hex(), toTxMeta(), translatePostgresError() (+2 more)

### Community 39 - "describeNodeStoreExports"
Cohesion: 0.15
Nodes (12): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), 5.1 The `LedgerPackage` interface (LG-6), 5.2 Vendored builds (LG-5), 5.3 The ledger worker and the node-store bridge (LG-10, LG-11), 5.4 Storage, retention and sweep (LG-11 to LG-14) (+4 more)

### Community 4 - "PgTransactionHistoryStorage"
Cohesion: 0.07
Nodes (44): TransactionHistoryStorage, PgTransactionHistoryStorage, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation), Build (one product module + one thin envelope — corrected from the original "exactly two things, zero new code" framing; see finding below) (+36 more)

### Community 40 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.18
Nodes (19): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+11 more)

### Community 41 - "node-format.ts"
Cohesion: 0.19
Nodes (18): Child, Reader, childKey(), concat(), decodeChild(), decodeChildren(), encodeChild(), encodeChildren() (+10 more)

### Community 42 - "VersionConflictError"
Cohesion: 0.09
Nodes (21): HistoryUnavailableError, VersionConflictError, Superseded — see `Formal/STORAGE_ALGEBRA.md`, `kv_current` / `kv_history` — TemporalKV, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 5. Testable-law deliverable (fast-check + Vitest) (+13 more)

### Community 45 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+12 more)

### Community 46 - "withAbort"
Cohesion: 0.12
Nodes (21): PgDriverError, withAbort(), isChainArchiveCheckConstraintName(), isConnectionFailure(), isLockTimeout(), isPgDriverError(), isStatementTimeout(), registerTransaction() (+13 more)

### Community 47 - ".save"
Cohesion: 0.12
Nodes (20): CheckpointSummary, SaveCheckpointOptions, splitChunks(), validateSaveOptions(), Requirement: save rejects invalid options with ValidationError before any chunking or hashing work, Scenario: A chunkSize above the schema's 16 MiB bound is rejected with no work done, 1. Chunking and write path, Scenario: A set issued inside a caller's transaction is visible to a get using the same handle before commit (+12 more)

### Community 48 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (11): GcPass, HistGroup, SampleObservation, kvMapKey(), newPool(), readCurrentState(), { connectionUri }, DECLARED_ENVELOPE (+3 more)

### Community 49 - "sync-service.ts"
Cohesion: 0.18
Nodes (14): IndexerBlock, IndexerClientOptions, NodeRpcClientOptions, ChainArchiveSyncService, ChainArchiveSyncServiceOptions, SyncOnceResult, BridgeObservationRecord, TransactionRecord (+6 more)

### Community 5 - "crash-worker.ts"
Cohesion: 0.07
Nodes (34): WatermarkKey, WatermarkKind, WatermarkRow, CoTxCallable, CoTxPauseInfo, CrashHook, describeCaughtError(), main() (+26 more)

### Community 52 - "ref_node_fs"
Cohesion: 0.14
Nodes (7): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir, ALGEBRA_PATH, DOC_PATH

### Community 53 - "ClockRegressionError"
Cohesion: 0.09
Nodes (20): ClockRegressionError, `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, The retryable set, 1. TemporalKV — event-sourced right action with a CAS guard, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A second UPDATE to the same key's row in one transaction is rejected at the trigger level, Scenario: Sequential puts to the same key in separate transactions succeed, outside the millisecond-collision caveat (+12 more)

### Community 54 - "What changes — the 1.0.0 gate items this change addresses"
Cohesion: 0.18
Nodes (15): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.1 The frozen catalog (the machine-facing API) (+7 more)

### Community 55 - "ChainArchiveStore"
Cohesion: 0.10
Nodes (10): ChainArchiveStore, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents, `transactions` (chain_archive) (+2 more)

### Community 57 - "wallet-state-envelope.test.ts"
Cohesion: 0.16
Nodes (14): EnvelopeCorruptError, WalletStateEnvelope, WalletStateEnvelopeError, safeNonEmptyString(), safeString(), checkpointStore(), envelope(), envelopeStore() (+6 more)

### Community 59 - "cbor.test.ts"
Cohesion: 0.13
Nodes (18): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnType, encodeCanonical(), encodeRow(), kindOf(), render() (+10 more)

### Community 6 - "vitest"
Cohesion: 0.09
Nodes (23): BenchEnv, UmbraDBSql, BlockRow, TxRow, bootstrapChainArchiveSchema(), assertNoConflictingSearchPath(), createClient(), bundleFixture() (+15 more)

### Community 63 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (16): BlobRole, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult (+8 more)

### Community 64 - "pg-kill-save.crash.test.ts"
Cohesion: 0.12
Nodes (18): C5AnyFn, assertSaveNotAutoRetriedUnderRetriableFault(), assertSaveNotInAnyAutoRetryAllowlist(), completeManifestCount(), completeManifestCountAtSeq(), danglingChunkCount(), listSrcTsFiles(), makeSerializationFaultInjectingClient() (+10 more)

### Community 66 - ".history"
Cohesion: 0.14
Nodes (15): HistoryOptions, PruneResult, countChunks(), measureDedup(), runCheckpointWorkloads(), assertValidCheckpointIds(), validateHistoryOptions(), invoke() (+7 more)

### Community 69 - "postgres/checkpoint-store.ts"
Cohesion: 0.20
Nodes (15): CheckpointRecord, CheckpointSequence, ContentHash, AggregateRow, ChunkJoinRow, ManifestRow, sha256(), toHex() (+7 more)

### Community 7 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (39): EntryContent, Command, ReplayableStorage, hasPostgresUnsafeText(), applyCommand(), replay(), decodeSerializedContent(), decodeSerializedEntry() (+31 more)

### Community 70 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (14): Attempt, connect(), file(), makeCa(), makeLeaf(), openssl(), read(), tlsClientErrors (+6 more)

### Community 71 - "TransactionKeyReuseError"
Cohesion: 0.12
Nodes (16): TemporalKVError, TransactionKeyReuseError, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4a. Error translation (`src/postgres/errors.ts`), 5. Test infrastructure (+8 more)

### Community 75 - "vendored-ledger-node-roots.test.ts"
Cohesion: 0.13
Nodes (14): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, hex(), runInFreshInstance(), requested (+6 more)

### Community 77 - "CheckpointStore"
Cohesion: 0.15
Nodes (13): CheckpointStore, 1.2 Async pattern, 2. Module layout and dependency direction, Requirement: load returns the persisted envelope, by latest or explicit sequence, Requirement: the envelope module has no wallet-SDK runtime import, Scenario: save then load returns the same envelope, Scenario: The envelope modules' runtime imports resolve to no wallet-SDK package, 2. Envelope module (Pg-only — required gate) (+5 more)

### Community 79 - "PgWalletStateEnvelopeStore"
Cohesion: 0.13
Nodes (15): PgWalletStateEnvelopeStore, Commit policy — what may and may not go into git, Data at rest — NO encryption is provided (a binding deployer precondition), Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain (+7 more)

### Community 8 - "PgTransactionLeaseLayer"
Cohesion: 0.10
Nodes (39): PgCheckpointStore, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters, Adapters, loadBaseline() (+31 more)

### Community 84 - "conformance-gate.mjs"
Cohesion: 0.12
Nodes (11): LockResult, kill(), check, checker, env, forwarded, repoRoot, reportPath (+3 more)

### Community 85 - "postgres/transaction-history-storage.ts"
Cohesion: 0.21
Nodes (15): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+7 more)

### Community 9 - "harness.ts"
Cohesion: 0.13
Nodes (32): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, HotRatio, LatencyStats (+24 more)

### Community 94 - "error-catalog-drift.test.ts"
Cohesion: 0.14
Nodes (10): ExclusionViolationError, UnrecognizedPostgresError, CatalogRow, AS_OF, EXPORTED_CONCRETE, ROLLBACK_CAUSE, SURFACE_INSTANCES, AS_OF (+2 more)

### Community 95 - "load-under-prune.integration.test.ts"
Cohesion: 0.15
Nodes (12): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), runUnSnapshottedReadUnderPrune(), seedCheckpoints() (+4 more)

### Community 96 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 101 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.15
Nodes (12): entry(), tier1_wallet lineage, `transaction_history`, `watermarks`, 4. Configuration, 4. Configuration, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import (+4 more)

### Community 114 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 119 - "001_chain_archive_core.ts"
Cohesion: 0.24
Nodes (9): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, Revision history, v2 — 2026-07-22, revised in response to a 3-reviewer design-council audit (Fable 5 / Opus / GPT-5.6 Sol), v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol) (+1 more)

### Community 122 - "encode"
Cohesion: 0.20
Nodes (10): encode(), 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 7.1 Unit / property (Pg-only, required gate) — `test:conformance`, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding), 7. Testing strategy (post-implementation) (+2 more)

### Community 123 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (10): coerceToSafeNumber(), 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected (+2 more)

### Community 126 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 13 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 148 - "lease-nonwedge.crash.test.ts"
Cohesion: 0.28
Nodes (8): class2AdvisoryLockCountForHash(), pollForLockGone(), pool(), sleep(), worker(), liveWorkers, openPools, { sql: getSql, connectionUri }

### Community 158 - "watermarks.test.ts"
Cohesion: 0.25
Nodes (4): store(), txLayer(), FAKE_TX, { sql: getSql, connectionUri }

### Community 168 - "decode"
Cohesion: 0.48
Nodes (7): decode(), Requirement: a corrupt or non-JSON envelope payload is rejected with a typed error, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Scenario: A future-versioned envelope is rejected cleanly, Scenario: An unknown top-level field is rejected as a typed envelope error (F7), Scenario: Non-JSON bytes are rejected as a typed envelope error, Scenario: Structurally invalid JSON is rejected as a typed envelope error

### Community 175 - "temporal-kv.test.ts"
Cohesion: 0.29
Nodes (4): kv(), txLayer(), FAKE_TX, { sql: getSql }

### Community 29 - "migrate.ts"
Cohesion: 0.09
Nodes (13): runMigrationsImpl(), withReservedTransaction(), DEFAULT_MIGRATION_LOCK_TIMEOUT_MS, tier1WalletMigrations, name, name, name, name (+5 more)

### Community 51 - "vendored-ledger-v9.test.ts"
Cohesion: 0.23
Nodes (18): bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex(), nodesOf() (+10 more)

### Community 58 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (20): report(), 10. Ingest, 13. Contract data, 14. Private processes, 15. Snapshots and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+12 more)

### Community 60 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (20): apply(), 12. Ledger, 10. Node client and ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Snapshots (+12 more)

### Community 93 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 10 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 102 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: SN-1 Export, Requirement: SN-2 The file format, Requirement: SN-3 Import into an empty database, Requirement: SN-4 Import is all or nothing, Requirement: SN-5 A restored database continues like one that never stopped, Scenario: A tampered snapshot, Scenario: An import killed half-way (+4 more)

### Community 105 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 106 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.17
Nodes (12): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`) (+4 more)

### Community 107 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.17
Nodes (12): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+4 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's snapshot, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Importing a snapshot in the page (+3 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 111 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover), 7. What this change deliberately does not verify (traceability of the non-goals) (+3 more)

### Community 112 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 113 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 115 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 117 - "README.md"
Cohesion: 0.35
Nodes (3): Scope and pre-1.0 note, The three commitments, UmbraDB Stability Policy (SemVer)

### Community 118 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 120 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.18
Nodes (10): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG) (+2 more)

### Community 121 - "3. Proof-blocking findings"
Cohesion: 0.18
Nodes (11): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption (+3 more)

### Community 124 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 127 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 128 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 129 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 6. Migration (`002_checkpoint_store.ts`), 9. Test infrastructure (+1 more)

### Community 130 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 131 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 132 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 133 - "UmbraDB"
Cohesion: 0.20
Nodes (10): Contents, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB, Verification: what is proved, checked, and tested (+2 more)

### Community 134 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.22
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 135 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 136 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 137 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 138 - "3. Live-node/indexer confirmation"
Cohesion: 0.22
Nodes (9): 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs, 3.5 Dust generation + ledger events (generic), 3.6 Contract state/actions — confirmed absent, not confirmed present, 3.7 Governance / bridge, 3.8 SPO/staking (+1 more)

### Community 139 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 14 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+30 more)

### Community 140 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 141 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 143 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.22
Nodes (8): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer), Design — v1.0.0 API Surface & Release Contract

### Community 144 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 145 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 146 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 147 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 149 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 15 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+30 more)

### Community 150 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.25
Nodes (7): 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 151 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.25
Nodes (8): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 4. Save-retry caveat, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 152 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.25
Nodes (7): Benchmarks, Compatibility, and what 1.0.0 needs, Installing, Security, UmbraDB 0.9.5 "Penumbra", What is proved, and what that is worth, What this is not

### Community 153 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 154 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 155 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 156 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 157 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 159 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 160 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 161 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 162 - "2.1 The boundary rule (the feature's key design decision)"
Cohesion: 0.29
Nodes (6): 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 5. Acceptance criteria status, Full-Chain Storage

### Community 163 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 164 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 165 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 166 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 167 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 169 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.29
Nodes (6): 1. G13 — perf-correctness fixes (LAND FIRST), 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 170 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 171 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 172 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 173 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 176 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 177 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 178 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 179 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 18 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data responses name their view and height (+28 more)

### Community 180 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 181 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 182 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 183 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 184 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 185 - "Tasks — v1.0.0 API Surface & Release Contract"
Cohesion: 0.33
Nodes (5): 3. The freeze: build + package.json (G1), 5. Release contract docs (G2, G4), 6. Freeze the Lean cut-line (G20), 7. Packed-tarball install smoke test (G1), Tasks — v1.0.0 API Surface & Release Contract

### Community 186 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, Why

### Community 187 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 188 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 189 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 190 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 191 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 192 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 193 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 194 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 195 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 196 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 197 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 198 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 199 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.40
Nodes (4): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first), G14 — benchmark harness + recorded baseline

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

### Community 207 - "Proposal — Sprint 2: Transaction/Lease"
Cohesion: 0.50
Nodes (3): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease

### Community 208 - "Proposal — Sprint 3: CheckpointStore"
Cohesion: 0.50
Nodes (3): Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes

### Community 209 - "Requirement: load always fully verifies chunk integrity before returning"
Cohesion: 0.50
Nodes (4): Requirement: load always fully verifies chunk integrity before returning, Scenario: A checkpoint whose stored chunk content matches its recorded hash loads successfully, Scenario: A chunk whose stored content no longer matches its recorded hash is rejected, Scenario: A manifest referencing a chunk absent from storage is rejected

### Community 21 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 210 - "Proposal — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.50
Nodes (3): Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-durable-checkpoint-cursor, Why

### Community 211 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 212 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 213 - "Vendored ledger builds"
Cohesion: 0.50
Nodes (3): Rebuilding, Updating a version, Vendored ledger builds

### Community 216 - "6. Lean 4 feasibility"
Cohesion: 0.67
Nodes (3): 6.1 Approved M1 module layout, 6.2 First theorem tranche, 6. Lean 4 feasibility

### Community 219 - "Requirement: CheckpointSummary metadata is populated and label round-trips"
Cohesion: 0.67
Nodes (3): Requirement: CheckpointSummary metadata is populated and label round-trips, Scenario: A label given at save time is returned by history and load, Scenario: byteLength, chunkCount, and createdAt reflect the saved payload

### Community 221 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 25 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+25 more)

### Community 26 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (29): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 6. Nix — nixpkgs packages (from the locked nixpkgs), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies (+21 more)

### Community 27 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+23 more)

### Community 31 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)` (+21 more)

### Community 33 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

### Community 36 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 43 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy (+16 more)

### Community 44 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Schema isolation is the default, not opt-in (+16 more)

### Community 50 - "ADDED Requirements"
Cohesion: 0.09
Nodes (22): ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1), Requirement: Transactions commit or roll back atomically, Requirement: withLease always releases its lease, even when fn throws (+14 more)

### Community 56 - "package.json"
Cohesion: 0.09
Nodes (21): bugs, url, description, exports, files, homepage, license, main (+13 more)

### Community 61 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not snapshotted, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+12 more)

### Community 62 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: set rejects a top-level null value with ValidationError before any statement, Scenario: A bare numeric watermark value round-trips exactly (+12 more)

### Community 65 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 67 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 68 - "Full-Chain Storage — Design"
Cohesion: 0.11
Nodes (17): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer") (+9 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block digests for modules that opt in, Requirement: DT-5 The `core-digest` part chains the digests, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A fractional JSON number (+9 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+9 more)

### Community 74 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, archive:sync, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 76 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 78 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.12
Nodes (15): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+7 more)

### Community 80 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.12
Nodes (17): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: the adapter round-trips SDK lifecycle detail so getAll yields schema-valid SDK entries, Requirement: the envelope is persisted with a single CheckpointStore.save call per (walletId, networkId) (+9 more)

### Community 83 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.12
Nodes (16): 0. Package layout, 1.1 The gap, confirmed in source, 1.3 The `saveAndAdvance` combinator, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire, 3. G7 — Server-side timeouts (+8 more)

### Community 86 - "ROADMAP.md"
Cohesion: 0.12
Nodes (10): For historical reference only, Tasks — superseded by per-sprint openspec changes, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity (+2 more)

### Community 87 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.12
Nodes (15): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not), Rework (class 3 continued — cross-vendor cold audit, rounds 2-4) (+7 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor first, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+7 more)

### Community 90 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.13
Nodes (15): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N) (+7 more)

### Community 91 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 92 - "Roadmap"
Cohesion: 0.13
Nodes (15): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`) (+7 more)

### Community 97 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (13): 11. Refusals and halts (IN-12), 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 2. Points, 3. Block source and ingest, 4. The database API, 6. Modules (+5 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+5 more)

### Community 99 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

## Knowledge Gaps
- **17 isolated node(s):** `./tsconfig.json`, `local>midnightntwrk/renovate-config`, `PGPASSFILE`, `PYTHONHASHSEED`, `RFC-8949` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1698 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `postgres/transaction-lease.ts`, `runMigrations`, `setup.ts`, `src/index.ts`, `crash-worker.ts`, `interfaces/transaction-history-storage.ts`, `PgTransactionLeaseLayer`, `withSuiteWatchdog`, `cursor-durability.crash.test.ts`, `lease-nonwedge.crash.test.ts`, `pg-tx-history-adapter.ts`, `barrel-resolves.test.ts`, `migrate.ts`, `differential-equivalence.test.ts`, `watermarks.test.ts`, `cbor.property.test.ts`, `chain-archive-sync-retry.integration.test.ts`, `check-required-tests.ts`, `cold-boot-recovery.integration.test.ts`, `node-format.ts`, `chain-archive-replay-decode.integration.test.ts`, `temporal-kv.test.ts`, `full-sync-soak.integration.test.ts`, `vendored-ledger-v9.test.ts`, `ref_node_fs`, `What changes — the 1.0.0 gate items this change addresses`, `package.json`, `wallet-state-envelope.test.ts`, `cbor.test.ts`, `pg-kill-save.crash.test.ts`, `ws-mutual-tls.test.ts`, `pglite.test.ts`, `vendored-ledger-node-roots.test.ts`, `conformance-gate.mjs`, `mutation-per-adapter.mjs`, `error-catalog-drift.test.ts`, `load-under-prune.integration.test.ts`, `IndexerClient`, `midnight-env — reproducible PREPROD dev environment`, `facade-merge-loader.ts`, `no-chain-sync-import-guard.test.ts`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `./tsconfig.json`, `local>midnightntwrk/renovate-config`, `PGPASSFILE` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `postgres/transaction-lease.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06180733162830349 - nodes in this community are weakly interconnected._
- **Why does `PgTemporalKV` connect `PgTransactionLeaseLayer` to `postgres/transaction-lease.ts`, `setup.ts`, `src/index.ts`, `crash-worker.ts`, `harness.ts`, `interfaces/temporal-kv.ts`, `cursor-durability.crash.test.ts`, `TemporalKV`, `StorageError`, `barrel-resolves.test.ts`, `differential-equivalence.test.ts`, `TransactionHandle`, `ADDED Requirements`, `Requirements`, `withAbort`, `temporal-kv.test.ts`, `full-sync-soak.integration.test.ts`, `ADDED Requirements`, `What changes — the 1.0.0 gate items this change addresses`, `TransactionKeyReuseError`, `temporal-kv (transaction-participation wiring)`, `Storage Algebra Lean Formalization — Approved Design and Status`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Are the 41 inferred relationships involving `ValidationError` (e.g. with `1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors` and `1.4 Runtime validation`) actually correct?**
  _`ValidationError` has 41 INFERRED edges - model-reasoned connections that need verification._
- **Should `runMigrations` be split into smaller, more focused modules?**
  _Cohesion score 0.07231638418079096 - nodes in this community are weakly interconnected._