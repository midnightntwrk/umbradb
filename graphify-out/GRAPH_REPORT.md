# Graph Report - UmbraDB

## Corpus Check
- 475 files · ~761,731 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 53 file(s) not represented in the graph (top: .lean 25, (none) 13, .patch 8)

## Summary
- 4591 nodes · 10499 edges · 221 communities (202 shown, 19 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 1831 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `f2c864cc51bb6a63` (475 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- translatePostgresError
- db/migrate.test.ts
- db/durability-probe.test.ts
- component-table.test.ts
- node-store-suite.ts
- src/index.ts
- LeaseFaultError
- postgres-image.test.ts
- vitest
- harness.ts
- postgres/checkpoint-store.ts
- CrashWorkerHandle
- PgTransactionHistoryStorage
- mutation-evidence.d.mts
- vendored-ledger-files.test.ts
- no-chain-sync-import-guard.test.ts
- deterministic-postgresql/index.ts
- createClient
- PgWalletStateEnvelopeStore
- UmbraError
- mapping.ts
- column-rules.test.ts
- cbor.ts
- postgres/chain-archive-store.ts
- interfaces/temporal-kv.ts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- cbor.property.test.ts
- interfaces/transaction-history-storage.ts
- PgTransactionLeaseLayer
- pg-tx-history-adapter.ts
- boundary.test.ts
- TemporalKV
- postgres/migrate.ts
- module-tables.ts
- ref_node_crypto
- full-sync-soak.integration.test.ts
- cursor-durability.crash.test.ts
- differential-equivalence.test.ts
- ValidationError
- chain-archive-rollover.ts
- postgres/transaction-lease.ts
- check-required-tests.ts
- ref_node_fs
- withSuiteWatchdog
- TransactionHistoryEntry
- api.ts
- describeNodeStoreExports
- chain-archive-replay-decode.integration.test.ts
- pglite-writer.worker.ts
- What changes — the 1.0.0 gate items this change addresses
- transaction-history-storage.test.ts
- column-rules.ts
- pg-kill-save.crash.test.ts
- node-format.ts
- ws-mutual-tls.test.ts
- sync-service.ts
- crash-worker.ts
- runMigrations
- load-under-prune.integration.test.ts
- setup.ts
- postgres/transaction-history-storage.ts
- facade-merge-loader.ts
- scoped-review-manifest
- pack-install.mjs
- schemaName
- .getAt
- midnight-env — reproducible PREPROD dev environment
- fresh-instance.mjs
- ADDED Requirements
- graph.py
- Requirement: DT-6 Stored data avoids non-deterministic values
- cold-boot-recovery.integration.test.ts
- saveandadvance-cotx.crash.test.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- ADDED Requirements
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- README.md
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- 3. Proof-blocking findings
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- explore.md
- Design — Postgres+JSONB storage rebuild
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Design — v1.0.0 API Surface & Release Contract
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
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- Checkpoint-store composition contract — cursor ordering and replay
- UmbraDB 1.0.0 Release Contracts
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 12. Milestone status
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0-perf-baseline
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- [0.9.5] - 2026-07-25 — "Penumbra"
- UmbraDB — project instructions
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Preprod connection — endpoints, wallet, faucet
- UmbraDB module guide
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
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- bug-report.md
- feature-request.md
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- GC architecture and query-tracing: research findings
- PULL_REQUEST_CHECKLIST.md
- 9. Trust and refinement boundary
- documentation-improvement.md
- Overview
- Proposal — Sprint 2: Transaction/Lease
- Spec — capability `formal-completion`
- renovate.json
- Vendored ledger builds
- Environment changelog
- start-stack.sh
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
- ADDED Requirements
- Requirements
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- ADDED Requirements
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- scripts
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB V1.0.0 Implementation Guideline
- Storage Algebra Lean Formalization — Approved Design and Status
- Design — CORE-ARCH: the standalone indexer's core architecture
- Design — v1.0.0-durable-checkpoint-cursor
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- devDependencies
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Roadmap
- ROADMAP.md
- Storage Algebra Lean M2 Retention Sprint

## God Nodes (most connected - your core abstractions)
1. `vitest` - 121 edges
2. `PgTransactionLeaseLayer` - 93 edges
3. `PgCheckpointStore` - 87 edges
4. `ValidationError` - 87 edges
5. `runMigrations()` - 86 edges
6. `UmbraError` - 83 edges
7. `translatePostgresError()` - 78 edges
8. `createClient()` - 74 edges
9. `UmbraDBSql` - 72 edges
10. `StorageError` - 70 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: A chunk whose stored content no longer matches its recorded hash is rejected` --references--> `ChunkIntegrityError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts
- `The honest-test pattern (what makes each required test non-vacuous)` --references--> `ChunkMissingError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/checkpoint-store.ts
- `Scenario: A manifest referencing a chunk absent from storage is rejected` --references--> `ChunkMissingError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts
- `Audit resolution` --references--> `ChunkMissingError`  [INFERRED]
  openspec/changes/v1.0.0-recovery-testing/design.md → src/interfaces/checkpoint-store.ts
- `Rework (class 1 — infra)` --references--> `ConnectionError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/storage-errors.ts

## Import Cycles
- None detected.

## Communities (221 total, 19 thin omitted)

### Community 0 - "translatePostgresError"
Cohesion: 0.04
Nodes (109): CheckpointStoreError, ChunkIntegrityError, ChunkMissingError, ConnectionError, Retryability, SerializationFailedError, StorageError, HistoryUnavailableError (+101 more)

### Community 1 - "db/migrate.test.ts"
Cohesion: 0.04
Nodes (92): Transaction, AppliedMigration, AppliedRow, MigrationPart, Runnable, StartupInput, Difference, PlannedSchema (+84 more)

### Community 10 - "db/durability-probe.test.ts"
Cohesion: 0.07
Nodes (48): PostgresOptions, WriterProcess, WorkerEvent, PostgresTestDatabase, PauseReport, LockResult, openPostgres(), startWriter() (+40 more)

### Community 102 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 103 - "node-store-suite.ts"
Cohesion: 0.19
Nodes (10): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Disposable, NodeBatch, runInFreshInstance(), hasEmbeddedChild() (+2 more)

### Community 11 - "src/index.ts"
Cohesion: 0.07
Nodes (58): CheckpointRecord, CheckpointSequence, CheckpointStore, CheckpointStoreErrorCode, ContentHash, HistoryOptions, PruneResult, SaveCheckpointOptions (+50 more)

### Community 12 - "LeaseFaultError"
Cohesion: 0.04
Nodes (61): LeaseFaultError, exceedsMaxDepth(), column(), fn(), key(), 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced) (+53 more)

### Community 129 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 13 - "vitest"
Cohesion: 0.05
Nodes (37): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, Report, Job (+29 more)

### Community 14 - "harness.ts"
Cohesion: 0.09
Nodes (47): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+39 more)

### Community 15 - "postgres/checkpoint-store.ts"
Cohesion: 0.06
Nodes (47): CheckpointNotFoundError, CheckpointSummary, ManifestCorruptError, AggregateRow, ChunkJoinRow, ManifestRow, assertValidCheckpointIds(), coerceToSafeNumber() (+39 more)

### Community 16 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (48): TransactionHistoryStorage, PgTransactionHistoryStorage, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation), Build (one product module + one thin envelope — corrected from the original "exactly two things, zero new code" framing; see finding below) (+40 more)

### Community 166 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 167 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 168 - "no-chain-sync-import-guard.test.ts"
Cohesion: 0.53
Nodes (5): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles()

### Community 17 - "deterministic-postgresql/index.ts"
Cohesion: 0.07
Nodes (38): Settings, Run, Job, WorkerEvent, Outcome, openBlockWrites(), expectNeverCutOffNorHung(), settings() (+30 more)

### Community 18 - "createClient"
Cohesion: 0.08
Nodes (30): FakeChainBlock, BlockRow, TxRow, bootstrapChainArchiveSchema(), overridingUrlParameter(), assertNoConflictingSearchPath(), createClient(), fakeChain() (+22 more)

### Community 19 - "PgWalletStateEnvelopeStore"
Cohesion: 0.07
Nodes (42): EnvelopeCorruptError, EnvelopeVersionUnsupportedError, WalletStateEnvelope, WalletStateEnvelopeError, PgWalletStateEnvelopeStore, decode(), encode(), checkpointStore() (+34 more)

### Community 2 - "UmbraError"
Cohesion: 0.04
Nodes (62): CommittedHeight, ReadOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, ReadTimeoutSetting, Job (+54 more)

### Community 20 - "mapping.ts"
Cohesion: 0.07
Nodes (37): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+29 more)

### Community 21 - "column-rules.test.ts"
Cohesion: 0.05
Nodes (30): Because, columnVerdict, keyOrder, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+22 more)

### Community 22 - "cbor.ts"
Cohesion: 0.09
Nodes (40): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+32 more)

### Community 23 - "postgres/chain-archive-store.ts"
Cohesion: 0.10
Nodes (27): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+19 more)

### Community 24 - "interfaces/temporal-kv.ts"
Cohesion: 0.11
Nodes (28): AsOf, AssertExact, Key, Namespace, Scope, Version, VersionedEntry, _VersionedEntryInSync (+20 more)

### Community 25 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (35): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+27 more)

### Community 28 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (39): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+31 more)

### Community 29 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.06
Nodes (37): EntryContent, Command, ReplayableStorage, hasPostgresUnsafeText(), jsonValueHasUnsafeText(), applyCommand(), replay(), safeNonEmptyString() (+29 more)

### Community 3 - "PgTransactionLeaseLayer"
Cohesion: 0.04
Nodes (69): PgCheckpointStore, UmbraDBSql, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters, Method (+61 more)

### Community 34 - "pg-tx-history-adapter.ts"
Cohesion: 0.08
Nodes (25): LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+17 more)

### Community 36 - "boundary.test.ts"
Cohesion: 0.13
Nodes (32): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+24 more)

### Community 38 - "TemporalKV"
Cohesion: 0.07
Nodes (27): TemporalKV, migrations(), 1.2 Async pattern, 1.3 Transaction participation, 1. Shared Conventions, 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010), Impact, Non-goals (explicitly out of scope for this sprint) (+19 more)

### Community 39 - "postgres/migrate.ts"
Cohesion: 0.08
Nodes (18): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit(), probeAdvisoryLockVisibility() (+10 more)

### Community 4 - "module-tables.ts"
Cohesion: 0.05
Nodes (51): ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ConsistentRead, ColumnType, RefusalCode (+43 more)

### Community 44 - "ref_node_crypto"
Cohesion: 0.17
Nodes (23): NodeRoot, bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex() (+15 more)

### Community 45 - "full-sync-soak.integration.test.ts"
Cohesion: 0.07
Nodes (17): JsonValue, KvRow, BatchSpec, CurrentState, CurrentState, GcPass, HistGroup, SampleObservation (+9 more)

### Community 46 - "cursor-durability.crash.test.ts"
Cohesion: 0.09
Nodes (26): InvariantResult, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs(), durableKvValues(), itemKey(), itemValue() (+18 more)

### Community 47 - "differential-equivalence.test.ts"
Cohesion: 0.13
Nodes (25): Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1(), injectT2() (+17 more)

### Community 48 - "ValidationError"
Cohesion: 0.09
Nodes (26): ValidationError, isLockTimeout(), runMigrationsImpl(), 0. Package layout, 1. Chunking, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 5. `history` — pagination, 6. Migration (`002_checkpoint_store.ts`) (+18 more)

### Community 49 - "chain-archive-rollover.ts"
Cohesion: 0.11
Nodes (25): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+17 more)

### Community 5 - "postgres/transaction-lease.ts"
Cohesion: 0.05
Nodes (64): TransactionHistoryReader, TransactionHistoryWriter, Lease, TransactionHandle, TransactionHandleInvalidError, WatermarkKey, WatermarkKind, HeldLease (+56 more)

### Community 52 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 53 - "ref_node_fs"
Cohesion: 0.10
Nodes (12): Lockfile, Manifest, check, checker, env, forwarded, repoRoot, reportPath (+4 more)

### Community 57 - "withSuiteWatchdog"
Cohesion: 0.12
Nodes (23): SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount(), pool(), watermarkCount(), completeManifestCount(), completeManifestCountAtSeq(), danglingChunkCount() (+15 more)

### Community 58 - "TransactionHistoryEntry"
Cohesion: 0.14
Nodes (13): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), encodeContent(), encodeSections(), encodeStoredEntry(), abortErrorLike(), capitalize() (+5 more)

### Community 6 - "api.ts"
Cohesion: 0.05
Nodes (49): BlockWriteHandle, Database, ReadHandle, SchemaWriteHandle, MultiStatementRunner, BlockWrites, TestBackend, TestDatabase (+41 more)

### Community 60 - "describeNodeStoreExports"
Cohesion: 0.17
Nodes (11): NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), 5.1 The `LedgerPackage` interface (LG-6), 5.2 Vendored builds (LG-5), 5.3 The ledger worker and the node-store bridge (LG-10, LG-11), 5.4 Storage, retention and sweep (LG-11 to LG-14), 5.5 Ledger tasks (LG-17, Q49) (+3 more)

### Community 61 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.15
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+12 more)

### Community 62 - "pglite-writer.worker.ts"
Cohesion: 0.16
Nodes (17): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor() (+9 more)

### Community 66 - "What changes — the 1.0.0 gate items this change addresses"
Cohesion: 0.18
Nodes (16): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+8 more)

### Community 69 - "transaction-history-storage.test.ts"
Cohesion: 0.13
Nodes (15): MergeEntriesFn, isPlainObject(), mergeSections(), referenceMergeEntries(), decodeSerializedContent(), decodeSerializedEntry(), store(), txLayer() (+7 more)

### Community 7 - "column-rules.ts"
Cohesion: 0.04
Nodes (78): CatalogColumn, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultPart (+70 more)

### Community 70 - "pg-kill-save.crash.test.ts"
Cohesion: 0.12
Nodes (18): C5AnyFn, assertSaveNotAutoRetriedUnderRetriableFault(), assertSaveNotInAnyAutoRetryAllowlist(), completeManifestCount(), completeManifestCountAtSeq(), danglingChunkCount(), listSrcTsFiles(), makeSerializationFaultInjectingClient() (+10 more)

### Community 71 - "node-format.ts"
Cohesion: 0.23
Nodes (14): Reader, childKey(), concat(), decodeChild(), decodeChildren(), encodeChild(), encodeChildren(), nodeKey() (+6 more)

### Community 78 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (13): Attempt, connect(), file(), makeCa(), makeLeaf(), openssl(), read(), tlsClientErrors (+5 more)

### Community 8 - "sync-service.ts"
Cohesion: 0.05
Nodes (34): IndexerBlock, IndexerClient, IndexerClientError, IndexerClientOptions, IndexerClientParseError, IndexerTransaction, NodeRpcClient, NodeRpcClientOptions (+26 more)

### Community 83 - "crash-worker.ts"
Cohesion: 0.20
Nodes (14): CoTxCallable, CoTxPauseInfo, CrashHook, describeCaughtError(), main(), observeClientPauseBeforeCursor(), pauseThenResume(), pauseUntilKilled() (+6 more)

### Community 9 - "runMigrations"
Cohesion: 0.04
Nodes (68): UmbraDBConnectionOptions, runMigrations(), 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 3. `synchronous_commit` — probe-warned, never refused, 4. Session-mode connection pooling only — probe-enforced (best-effort), 5. Server-side timeouts — applied by `createClient` (documented), Summary (+60 more)

### Community 91 - "load-under-prune.integration.test.ts"
Cohesion: 0.15
Nodes (12): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), runUnSnapshottedReadUnderPrune(), seedCheckpoints() (+4 more)

### Community 92 - "setup.ts"
Cohesion: 0.15
Nodes (13): Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, getTestContainer(), restartTestContainer(), stopTestContainer() (+5 more)

### Community 97 - "postgres/transaction-history-storage.ts"
Cohesion: 0.25
Nodes (12): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+4 more)

### Community 109 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 113 - "scoped-review-manifest"
Cohesion: 0.20
Nodes (10): explain(), explainRefusal(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation (+2 more)

### Community 117 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 140 - ".getAt"
Cohesion: 0.25
Nodes (5): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why, Performance

### Community 148 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.29
Nodes (7): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 184 - "fresh-instance.mjs"
Cohesion: 0.40
Nodes (4): hex(), requested, store, stored

### Community 30 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): provider(), ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup (+31 more)

### Community 31 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 51 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.07
Nodes (27): insert(), ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values (+19 more)

### Community 59 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.17
Nodes (20): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), startTestDatabase(), stopTestDatabase(), EXPECTED_NIGHT_VALUE, EXPECTED_UNSHIELDED_ADDRESS (+12 more)

### Community 65 - "saveandadvance-cotx.crash.test.ts"
Cohesion: 0.10
Nodes (21): worker(), class2AdvisoryLockCountForHash(), pollForLockGone(), pool(), sleep(), worker(), worker(), worker() (+13 more)

### Community 67 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.09
Nodes (21): entry(), 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system (+13 more)

### Community 90 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 104 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.17
Nodes (10): 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, UmbraDB v0.9.5 "Penumbra" — Release Record, UmbraDB v1.0.0 — Release Record (PENDING) (+2 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 107 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 108 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 110 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 111 - "README.md"
Cohesion: 0.35
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 112 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 114 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 115 - "3. Proof-blocking findings"
Cohesion: 0.18
Nodes (11): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption (+3 more)

### Community 116 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 118 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 119 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.20
Nodes (10): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 7. Driver / toolkit choice (+2 more)

### Community 120 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 121 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 122 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 123 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.20
Nodes (9): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 4. Live preprod DB-sync verification (nightly/labeled), 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding), 7. Testing strategy (post-implementation) (+1 more)

### Community 124 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer) (+1 more)

### Community 125 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 126 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 127 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 128 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 131 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 132 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 133 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 134 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 135 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 136 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 137 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 138 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 139 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 141 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 142 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.25
Nodes (7): Benchmarks, Compatibility, and what 1.0.0 needs, Installing, Security, UmbraDB 0.9.5 "Penumbra", What is proved, and what that is worth, What this is not

### Community 143 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 144 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 145 - "Security policy & threat model"
Cohesion: 0.25
Nodes (8): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 146 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 147 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 149 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 151 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 152 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 153 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.29
Nodes (6): 1. The invariant: the cursor is never ahead of its data, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 154 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 155 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 156 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 157 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 158 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 159 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 160 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.29
Nodes (6): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 161 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.29
Nodes (6): 1. G13 — perf-correctness fixes (LAND FIRST), 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 162 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 163 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 164 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 165 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 169 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 170 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 172 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 173 - "UmbraDB module guide"
Cohesion: 0.33
Nodes (5): Migrations, Time values, UmbraDB module guide, Upgrades, Writing in callbacks

### Community 174 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

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

### Community 180 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 181 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, Why

### Community 182 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 183 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 185 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 186 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 187 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 188 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 189 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 190 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 191 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.40
Nodes (4): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Problem, Resolution, Suggested fix

### Community 192 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 193 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 194 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 195 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 196 - "GC architecture and query-tracing: research findings"
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

### Community 200 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 201 - "Proposal — Sprint 2: Transaction/Lease"
Cohesion: 0.50
Nodes (3): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease

### Community 202 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 203 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 204 - "Vendored ledger builds"
Cohesion: 0.50
Nodes (3): Rebuilding, Updating a version, Vendored ledger builds

### Community 26 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 27 - "ADDED Requirements"
Cohesion: 0.05
Nodes (42): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+34 more)

### Community 32 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+30 more)

### Community 33 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races (+30 more)

### Community 35 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+29 more)

### Community 37 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+27 more)

### Community 40 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: an in-repo benchmark harness drives the real adapters against a pinned Postgres, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: history() computes per-manifest aggregates in a single grouped query (HP-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1) (+25 more)

### Community 41 - "Requirements"
Cohesion: 0.06
Nodes (32): Purpose, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy (+24 more)

### Community 42 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy (+23 more)

### Community 43 - "Full-Chain Storage — Design"
Cohesion: 0.07
Nodes (29): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+21 more)

### Community 50 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+19 more)

### Community 54 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 55 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 56 - "package.json"
Cohesion: 0.07
Nodes (26): bugs, url, description, engines, node, exports, files, homepage (+18 more)

### Community 63 - "ADDED Requirements"
Cohesion: 0.09
Nodes (22): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: set rejects an invalid value with ValidationError before any statement, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape (+14 more)

### Community 64 - "ADDED Requirements"
Cohesion: 0.09
Nodes (23): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence (+15 more)

### Community 68 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 72 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+9 more)

### Community 75 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (17): 10. Node client and ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups, 16. Browser, 17. Library surface and gates (+9 more)

### Community 76 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, archive:sync, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 77 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 79 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor first, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+7 more)

### Community 84 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.13
Nodes (15): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N) (+7 more)

### Community 85 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.13
Nodes (15): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+7 more)

### Community 86 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (14): 10. Tables, 11. Refusals and halts (IN-12), 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 2. Points, 3. Block source and ingest, 6. Modules (+6 more)

### Community 87 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.13
Nodes (14): 0. Package layout, 2.1 Where the probe runs (the one real design decision), 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract, 5.1 Archival reconciliation note (Opus N6), 5. Boundaries and non-goals respected (+6 more)

### Community 88 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.13
Nodes (14): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 2.1 Process-kill mid-save (T1) — `02` §"Fault-injection test plan" T1; `council/B` §3 item 1, 2.4 Lease non-wedge cold start (T3) — `02`-T3; `council/B` §3 item 4, 2. G9 — the four crash tests, 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12) (+6 more)

### Community 89 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 94 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 95 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 96 - "Roadmap"
Cohesion: 0.14
Nodes (14): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+6 more)

### Community 98 - "ROADMAP.md"
Cohesion: 0.15
Nodes (9): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+1 more)

### Community 99 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

## Knowledge Gaps
- **30 isolated node(s):** `./tsconfig.json`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-8259` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1966 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `translatePostgresError`, `db/migrate.test.ts`, `UmbraError`, `PgTransactionLeaseLayer`, `postgres-image.test.ts`, `module-tables.ts`, `api.ts`, `sync-service.ts`, `db/durability-probe.test.ts`, `src/index.ts`, `deterministic-postgresql/index.ts`, `createClient`, `PgWalletStateEnvelopeStore`, `mapping.ts`, `column-rules.test.ts`, `interfaces/temporal-kv.ts`, `cbor.property.test.ts`, `interfaces/transaction-history-storage.ts`, `pg-tx-history-adapter.ts`, `boundary.test.ts`, `vendored-ledger-files.test.ts`, `postgres/migrate.ts`, `no-chain-sync-import-guard.test.ts`, `ref_node_crypto`, `full-sync-soak.integration.test.ts`, `cursor-durability.crash.test.ts`, `differential-equivalence.test.ts`, `check-required-tests.ts`, `ref_node_fs`, `package.json`, `withSuiteWatchdog`, `cold-boot-recovery.integration.test.ts`, `chain-archive-replay-decode.integration.test.ts`, `saveandadvance-cotx.crash.test.ts`, `transaction-history-storage.test.ts`, `pg-kill-save.crash.test.ts`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `load-under-prune.integration.test.ts`, `setup.ts`, `component-table.test.ts`, `node-store-suite.ts`, `facade-merge-loader.ts`?**
  _High betweenness centrality (0.263) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **What connects `./tsconfig.json`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `translatePostgresError` be split into smaller, more focused modules?**
  _Cohesion score 0.0383442265795207 - nodes in this community are weakly interconnected._
- **Why does `runMigrations()` connect `runMigrations` to `translatePostgresError`, `db/migrate.test.ts`, `PgTransactionLeaseLayer`, `postgres/transaction-lease.ts`, `sync-service.ts`, `src/index.ts`, `LeaseFaultError`, `harness.ts`, `createClient`, `PgWalletStateEnvelopeStore`, `UmbraDB 1.0.0 Release Contracts`, `Tasks — v1.0.0-perf-baseline`, `ADDED Requirements`, `TemporalKV`, `postgres/migrate.ts`, `Full-Chain Storage — Design`, `cursor-durability.crash.test.ts`, `ValidationError`, `chain-archive-rollover.ts`, `Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)`, `TransactionHistoryEntry`, `cold-boot-recovery.integration.test.ts`, `What changes — the 1.0.0 gate items this change addresses`, `Design — v1.0.0-durable-checkpoint-cursor`, `setup.ts`, `UmbraDB`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 29 inferred relationships involving `PgCheckpointStore` (e.g. with `Added` and `Phase → current status map`) actually correct?**
  _`PgCheckpointStore` has 29 INFERRED edges - model-reasoned connections that need verification._
- **Should `db/migrate.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03899001761597182 - nodes in this community are weakly interconnected._