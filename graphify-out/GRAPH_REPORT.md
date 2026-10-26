# Graph Report - UmbraDB

## Corpus Check
- 777 files · ~1,210,698 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 8315 nodes · 23170 edges · 261 communities (234 shown, 27 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 2888 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `151dd44a20625893` (777 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- db/migrate.ts
- declaration.ts
- PgTransactionLeaseLayer
- mapping.ts
- chain-archive-replay-decode.integration.test.ts
- TransactionKeyReuseError
- pg-tx-history-adapter.ts
- block-fetch-decode.test.ts
- interfaces/transaction-history-storage.ts
- determinism-checks.ts
- module-rules.ts
- check-required-tests.ts
- ingest-crash.test.ts
- legacy-excluded.test.ts
- crash.test.ts
- digest.test.ts
- version-table.ts
- cold-boot-recovery.integration.test.ts
- Process
- version-checks.ts
- ws-mutual-tls.test.ts
- TransactionHandle
- full-sync-soak.integration.test.ts
- What changes — the 1.0.0 gate items this change addresses
- separation.test.ts
- height
- chain-archive-rollover.ts
- node/client.test.ts
- sigterm.worker.ts
- ChainArchiveStore
- identity.ts
- HeightRun
- FakeNode
- tape/index.ts
- ref_node_worker_threads
- binding.test.ts
- builds.ts
- postgres/transaction-history-storage.ts
- admin-harness.ts
- read-height.property.test.ts
- load-under-prune.integration.test.ts
- no-indexer-or-wallet-sdk.test.ts
- process.test.ts
- component-table.test.ts
- child-processes.test.ts
- intake.test.ts
- adapter.ts
- ProcessItems
- Design — v1.0.0: Formal completion (`formal-completion`)
- NodeBlockSource
- a114Run
- loop.ts
- version
- ReadPool
- mutation-evidence.d.mts
- builder.negative-control.test.ts
- ReadHandle
- src/index.ts
- CheckpointStore
- builder.test.ts
- CliBackend
- describeNodeStoreExports
- WaitingInRead
- FailingAfter
- NoRedelivery
- CommitsTheBoundary
- ref_node_fs
- history.test.ts
- withSuiteWatchdog
- config/history.ts
- db/errors.ts
- snapshot.test.ts
- ClockRegressionError
- UmbraError
- translatePostgresError
- vitest
- transform-checks.ts
- loop.test.ts
- node/client.ts
- UmbraDBSql
- PgTransactionHistoryStorage
- api-server.test.ts
- changes.property.test.ts
- plain-data.ts
- NodeClient
- config-check-database.test.ts
- column-refusals.test.ts
- ValidationError
- postgres/client.ts
- validate.test.ts
- height-versioned.property.test.ts
- core-block-commit.test.ts
- runner/process.ts
- format.test.ts
- cbor.ts
- LedgerPackage
- chain-process.test.ts
- post-block-update-checks.ts
- adapter-suite.ts
- postgres/chain-archive-store.ts
- graph.ts
- module-tables.ts
- column-rules.ts
- ledger/types.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- checkShape
- admin/types.ts
- core-block-fetch/metadata.ts
- validate.ts
- config-check.ts
- db/durability-probe.test.ts
- networks.ts
- postgres/migrate.ts
- version.negative-control.test.ts
- core-settings.ts
- cbor.property.test.ts
- StorageError
- boundary.test.ts
- .show
- core-private-source.ts
- FinalizedLoop
- differential-equivalence.test.ts
- UmbraDBConnectionOptions
- postgres/transaction-lease.ts
- entries.ts
- transaction-history-storage.property.test.ts
- TransactionHistoryEntry
- core-private-source.test.ts
- cursor-durability.crash.test.ts
- records.ts
- 1. Determinism primitives
- address
- pg
- Storage Algebra Lean M3a Watermarks Sprint
- repository
- Design — Sprint 7: Transaction History Storage
- mutation-per-adapter.mjs
- mapping.test.ts
- facade-merge-loader.ts
- scoped-review-manifest
- call
- migrations
- .closed
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- runMigrations
- graph.py
- ADDED Requirements
- ADDED Requirements
- .getAll
- ADDED Requirements
- ADDED Requirements
- ROADMAP.md
- Full-Chain Storage — Design
- UmbraDB third-party component inventory (SBOM)
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- stryker.conf.json
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- ADDED Requirements
- UmbraDB module guide
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- README.md
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Roadmap
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- compilerOptions
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Tasks — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-perf-baseline
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- UmbraDB — project instructions
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.1.0: Quint model checking
- Midnight Foundation Security Policy
- lib.sh
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00023 — The blocks table's height partitions end at 5,000,000
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- oracle/run.sh
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- main.rs
- package.json
- ADDED Requirements
- scripts
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 235 edges
2. `UmbraError` - 209 edges
3. `ModuleDeclaration` - 111 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `runMigrations()` - 90 edges
6. `PgCheckpointStore` - 87 edges
7. `ValidationError` - 87 edges
8. `Database` - 82 edges
9. `translatePostgresError()` - 78 edges
10. `InMemoryBlockSource` - 76 edges

## Surprising Connections (you probably didn't know these)
- `2.1 Historical implementation baseline` --references--> `PgTemporalKV`  [INFERRED]
  Formal/STORAGE_ALGEBRA_LEAN_RESEARCH.md → src/postgres/temporal-kv.ts
- `Scenario: A transaction-key-reuse violation surfaces as TransactionKeyReuseError` --references--> `TransactionKeyReuseError`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts
- `Scenario: A transaction-key-reuse violation surfaces as TransactionKeyReuseError` --references--> `TransactionKeyReuseError`  [INFERRED]
  openspec/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts
- `Scenario: A custom schema is honored end to end` --references--> `TemporalKV`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts
- `Non-goals (explicitly out of scope for this sprint)` --references--> `TemporalKV`  [INFERRED]
  openspec/changes/sprint-4-watermarks/proposal.md → src/interfaces/temporal-kv.ts

## Import Cycles
- None detected.

## Communities (261 total, 27 thin omitted)

### Community 0 - "db/migrate.ts"
Cohesion: 0.03
Nodes (129): Transaction, CapturedTable, AppliedRow, Runnable, Settling, StartupInput, MultiStatementRunner, Difference (+121 more)

### Community 1 - "declaration.ts"
Cohesion: 0.03
Nodes (128): SchemaWriteHandle, DurabilityViolation, MigrationPart, OwnPart, ErrorCode, BlockContext, BlockHeader, DefinedModule (+120 more)

### Community 10 - "PgTransactionLeaseLayer"
Cohesion: 0.04
Nodes (92): BaselineLoad, PgCheckpointStore, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, CoTxCallable, CoTxPauseInfo, CrashHook (+84 more)

### Community 100 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 101 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.12
Nodes (25): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, bootstrapChainArchiveSchema() (+17 more)

### Community 102 - "TransactionKeyReuseError"
Cohesion: 0.08
Nodes (20): TransactionKeyReuseError, kv(), txLayer(), FAKE_TX, { sql: getSql }, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+12 more)

### Community 103 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+14 more)

### Community 105 - "block-fetch-decode.test.ts"
Cohesion: 0.13
Nodes (23): PalletSpec, blake2b256(), compress(), rotateRight(), words(), decodeExtrinsics(), encodeHeader(), headerHash() (+15 more)

### Community 106 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus, TransactionHistoryWriter, EntryContentSchema (+13 more)

### Community 107 - "determinism-checks.ts"
Cohesion: 0.17
Nodes (23): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, privateCursorHeight(), withCore(), privateModule(), refusalOf() (+15 more)

### Community 108 - "module-rules.ts"
Cohesion: 0.10
Nodes (17): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, optOut, attachIntegerChecks() (+9 more)

### Community 109 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 11 - "ingest-crash.test.ts"
Cohesion: 0.05
Nodes (81): ChainBuildOptions, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded, FetchSeen (+73 more)

### Community 110 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 111 - "crash.test.ts"
Cohesion: 0.12
Nodes (22): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+14 more)

### Community 114 - "digest.test.ts"
Cohesion: 0.12
Nodes (24): ChangeKind, tableChanges, TouchedRow, digestBlock(), encodeCanonical(), changeOf(), concat(), isCheckpointHeight() (+16 more)

### Community 115 - "version-table.ts"
Cohesion: 0.14
Nodes (24): LedgerName, VerifyLedgerPackagesOptions, ConfiguredLedgerTable, LedgerPin, LedgerRow, LedgerSelection, LedgerTableIssue, VersionedBlock (+16 more)

### Community 116 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.19
Nodes (19): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+11 more)

### Community 117 - "Process"
Cohesion: 0.18
Nodes (8): Process, isListenFailure(), reasonOf(), retryOf(), unwrap(), messageOf(), namedStartDb(), pause()

### Community 118 - "version-checks.ts"
Cohesion: 0.21
Nodes (21): Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectEveryPackageFileChecked(), expectPinsChecked() (+13 more)

### Community 119 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 12 - "TransactionHandle"
Cohesion: 0.04
Nodes (82): AssertExact, HistoryUnavailableError, Key, Namespace, Scope, TemporalKV, TemporalKVError, Version (+74 more)

### Community 120 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (12): CurrentState, GcPass, HistGroup, SampleObservation, kvMapKey(), newPool(), readCurrentState(), { connectionUri } (+4 more)

### Community 123 - "What changes — the 1.0.0 gate items this change addresses"
Cohesion: 0.18
Nodes (16): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+8 more)

### Community 124 - "separation.test.ts"
Cohesion: 0.12
Nodes (15): PrivateBackend, SessionSeen, A112Observation, Wiring, a146HashProblems(), a146RefusalProblems(), optedOutProblems(), schemaPlan() (+7 more)

### Community 126 - "height"
Cohesion: 0.12
Nodes (18): Broken, height(), 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy (+10 more)

### Community 129 - "chain-archive-rollover.ts"
Cohesion: 0.16
Nodes (14): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+6 more)

### Community 13 - "node/client.test.ts"
Cohesion: 0.03
Nodes (57): NodeClientOptions, NodeRetry, ConnectSocket, Answer, Handler, Received, recorded, ConnectionFrames (+49 more)

### Community 131 - "sigterm.worker.ts"
Cohesion: 0.13
Nodes (15): Job, WorkEvent, WorkOptions, WORKER, Job, WorkerEvent, report(), report() (+7 more)

### Community 132 - "ChainArchiveStore"
Cohesion: 0.11
Nodes (6): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, Boundary enforcement, Table of contents, UmbraDB Postgres Schema Reference

### Community 133 - "identity.ts"
Cohesion: 0.20
Nodes (15): LedgerSource, ManifestLine, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest() (+7 more)

### Community 134 - "HeightRun"
Cohesion: 0.13
Nodes (7): HeightRun, SkipsAfterReconnect, Batching, LateRedelivery, SkipsStartAtRestart, CommitsDespiteLastWrite, StartsAtEveryRevision

### Community 14 - "tape/index.ts"
Cohesion: 0.05
Nodes (53): Link, TapeBuilderOptions, RecordingProblem, readRequest, RequestId, Json, NotJsonError, Connection (+45 more)

### Community 141 - "ref_node_worker_threads"
Cohesion: 0.18
Nodes (9): Heartbeat, lastTick(), tickAgeMs(), beat(), hex(), HEARTBEAT_INTERVAL_MS, requested, store (+1 more)

### Community 142 - "binding.test.ts"
Cohesion: 0.15
Nodes (10): TestDatabase, A113Observation, Binding, Outcome, a113Run(), against(), bindingIn(), outcomeOf() (+2 more)

### Community 143 - "builds.ts"
Cohesion: 0.15
Nodes (14): PrivateProcess, PrivateRefusal, directPublic(), genesisHex(), launchPrivate(), poll(), PRIVATE_ROWS_SQL(), privateCoreEntry() (+6 more)

### Community 145 - "postgres/transaction-history-storage.ts"
Cohesion: 0.23
Nodes (15): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+7 more)

### Community 15 - "admin-harness.ts"
Cohesion: 0.04
Nodes (68): FromAdmin, ToAdmin, AdminServer, AdminStartOptions, BlockSource, AdminRun, AdminRunOptions, Answered (+60 more)

### Community 155 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 156 - "load-under-prune.integration.test.ts"
Cohesion: 0.16
Nodes (11): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), seedCheckpoints(), sha256() (+3 more)

### Community 159 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 16 - "process.test.ts"
Cohesion: 0.05
Nodes (61): ProcessingEnd, ProcessStatus, A43Observation, ProcessDatabase, CoreSeen, testBuild, A149Observation, A149Startup (+53 more)

### Community 165 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 17 - "child-processes.test.ts"
Cohesion: 0.03
Nodes (69): SignalTarget, ParentJob, Kill, Orphaned, SourceFile, Run, Job, WorkerEvent (+61 more)

### Community 171 - "intake.test.ts"
Cohesion: 0.33
Nodes (11): PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), follow(), heights(), readProblems() (+3 more)

### Community 18 - "adapter.ts"
Cohesion: 0.04
Nodes (62): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+54 more)

### Community 185 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 19 - "NodeBlockSource"
Cohesion: 0.06
Nodes (30): BlockHeaderItem, BodyExtrinsic, BlockBody, BlockItemSource, CoreBlockHeader, CoreBlockItems, RuntimeMetadataView, HeadWait (+22 more)

### Community 2 - "loop.ts"
Cohesion: 0.03
Nodes (127): ItemSink, PointName, HeightRange, BlockItems, LateUse, FinalityStallCondition, Callback, CallbackFailure (+119 more)

### Community 20 - "version"
Cohesion: 0.03
Nodes (73): CheckpointNotFoundError, CheckpointStoreError, ChunkIntegrityError, ChunkMissingError, version(), { sql: getSql, connectionUri }, 3.3 CheckpointStore, 2.1 `ckpt_manifest_chunks` needs an explicit position (+65 more)

### Community 204 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 205 - "builder.negative-control.test.ts"
Cohesion: 0.29
Nodes (3): Failure, Variant, WrongRecording

### Community 21 - "ReadHandle"
Cohesion: 0.04
Nodes (39): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, Migration (+31 more)

### Community 22 - "src/index.ts"
Cohesion: 0.07
Nodes (61): CheckpointRecord, CheckpointSequence, CheckpointStoreErrorCode, CheckpointSummary, ContentHash, HistoryOptions, ManifestCorruptError, PruneResult (+53 more)

### Community 23 - "CheckpointStore"
Cohesion: 0.05
Nodes (62): CheckpointStore, EnvelopeCorruptError, EnvelopeVersionUnsupportedError, WalletStateEnvelope, WalletStateEnvelopeError, PgWalletStateEnvelopeStore, decode(), encode() (+54 more)

### Community 24 - "builder.test.ts"
Cohesion: 0.05
Nodes (36): ConnectionFrames, Recorded, Refusal, Frame, RawClient, Script, ScriptedNode, ScriptedRequest (+28 more)

### Community 25 - "describeNodeStoreExports"
Cohesion: 0.07
Nodes (49): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+41 more)

### Community 26 - "ref_node_fs"
Cohesion: 0.04
Nodes (50): Finding, Lockfile, Manifest, RepositoryFile, Upstream, GuardViolation, ReportedTest, statusOf() (+42 more)

### Community 27 - "history.test.ts"
Cohesion: 0.05
Nodes (65): versionEntry, HistoryInput, HistoryOptions, HistoryRow, HistoryRule, AppliedMigration, Simulation, Start (+57 more)

### Community 28 - "withSuiteWatchdog"
Cohesion: 0.04
Nodes (63): C5AnyFn, CrashWorkerHandle, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount(), pool(), watermarkCount(), worker() (+55 more)

### Community 29 - "config/history.ts"
Cohesion: 0.06
Nodes (58): CoreVersion, ConfiguredDatabase, ConfiguredDatabaseOptions, CoreSettings, HistoryCheck, HistoryCode, HistoryContext, Span (+50 more)

### Community 3 - "db/errors.ts"
Cohesion: 0.03
Nodes (100): CommittedHeight, Database, ReadOptions, ReadTimeoutSetting, Job, Outcome, PgliteOptions, ServerErrorFields (+92 more)

### Community 30 - "snapshot.test.ts"
Cohesion: 0.07
Nodes (49): ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminStarter, SnapshotFacts, ConfigSnapshot, SanitizedError, PlainObject (+41 more)

### Community 31 - "ClockRegressionError"
Cohesion: 0.03
Nodes (62): ClockRegressionError, T(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, The retryable set, 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix (+54 more)

### Community 32 - "UmbraError"
Cohesion: 0.06
Nodes (30): DurabilityWarning, JobQueue, PgliteDatabase, BoundedRead, Session, Writer, WriterStart, UmbraError (+22 more)

### Community 33 - "translatePostgresError"
Cohesion: 0.05
Nodes (54): TransactionHandleInvalidError, coerceToSafeNumber(), sha256(), splitChunks(), toHex(), toSummary(), isChainArchiveCheckConstraintName(), translatePostgresError() (+46 more)

### Community 34 - "vitest"
Cohesion: 0.05
Nodes (35): Method, Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, registerSuiteLifecycle(), startTestDatabase() (+27 more)

### Community 35 - "transform-checks.ts"
Cohesion: 0.08
Nodes (41): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, until() (+33 more)

### Community 36 - "loop.test.ts"
Cohesion: 0.07
Nodes (47): ReadOnlyDatabase, Contexts, LoopClass, RunnerDatabase, SeenCall, Started, ComputeAtH, Lost (+39 more)

### Community 37 - "node/client.ts"
Cohesion: 0.09
Nodes (44): NodeCallOptions, State, Subscription, NodeBlock, NodeRuntimeVersion, NodeCallMethod, SubscribeMethod, SocketFailure (+36 more)

### Community 38 - "UmbraDBSql"
Cohesion: 0.08
Nodes (45): BenchEnv, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+37 more)

### Community 39 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (54): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence (+46 more)

### Community 4 - "api-server.test.ts"
Cohesion: 0.03
Nodes (98): ApiRegistry, Connection, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, ChainDataAnswer, ChainDataView, ApiError (+90 more)

### Community 40 - "changes.property.test.ts"
Cohesion: 0.05
Nodes (54): Op, States, TableName, captured(), captureFunction(), moduleM(), restart(), sha256() (+46 more)

### Community 41 - "plain-data.ts"
Cohesion: 0.05
Nodes (44): CoreLedgerVersion, LedgerPackageIdentity, LoadOptions, PlainArray, PlainDataNode, PlainDataRule, Walk, Row (+36 more)

### Community 42 - "NodeClient"
Cohesion: 0.07
Nodes (25): Connection, HeadSubscriber, NodeClient, Pending, Waiter, connectionFailure, NodeMethod, NodeSocket (+17 more)

### Community 43 - "config-check-database.test.ts"
Cohesion: 0.07
Nodes (41): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, cliProject, CommandResult, checkArguments() (+33 more)

### Community 44 - "column-refusals.test.ts"
Cohesion: 0.07
Nodes (32): ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, Case, moduleTables(), failure() (+24 more)

### Community 45 - "ValidationError"
Cohesion: 0.04
Nodes (52): ValidationError, runUnSnapshottedReadUnderPrune(), 0. Package layout, 1. Chunking, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 6. Migration (`002_checkpoint_store.ts`), 7. Error translation — no additions to `src/postgres/errors.ts`, 9. Test infrastructure (+44 more)

### Community 46 - "postgres/client.ts"
Cohesion: 0.08
Nodes (32): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, BlockRow, TxRow, overridingUrlParameter(), assertNoConflictingSearchPath() (+24 more)

### Community 47 - "validate.test.ts"
Cohesion: 0.06
Nodes (44): coreEntry, plainData, EntryRef, EntryView, CursorRow, Expected, validateConfig(), checked() (+36 more)

### Community 48 - "height-versioned.property.test.ts"
Cohesion: 0.06
Nodes (42): VersionedValue, Access, Block, BlockFails, Counts, Write, StoredVersion, Block (+34 more)

### Community 49 - "core-block-commit.test.ts"
Cohesion: 0.07
Nodes (39): InMemoryItems, Wait, StandInOptions, Commit, blockHeaderOf(), checkParent(), commitBlock(), hex() (+31 more)

### Community 5 - "runner/process.ts"
Cohesion: 0.03
Nodes (90): Bound, ChainCheckInput, ChainIdentity, ChainSource, CoreChainBinding, CoreChainFacts, NodeWait, WaitingListener (+82 more)

### Community 50 - "format.test.ts"
Cohesion: 0.06
Nodes (24): Metadata, Step, TapeBuilder, TapeCommandIo, RecordingError, fakeResult(), frameText(), isWebSocketUrl() (+16 more)

### Community 52 - "cbor.ts"
Cohesion: 0.09
Nodes (41): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+33 more)

### Community 53 - "LedgerPackage"
Cohesion: 0.05
Nodes (31): LedgerEventKind, LedgerPackage, released(), expectSmallStateReloadsByKey(), vendored(), replay(), listen(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed (+23 more)

### Community 54 - "chain-process.test.ts"
Cohesion: 0.08
Nodes (29): InMemoryBlockSource, ProcessHandle, WorkerEvent, A77Observation, A78Observation, A90Observation, Failing, Flaky (+21 more)

### Community 55 - "post-block-update-checks.ts"
Cohesion: 0.10
Nodes (41): contractFixture, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+33 more)

### Community 56 - "adapter-suite.ts"
Cohesion: 0.10
Nodes (40): Upstream, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState, expectNoV8Logs() (+32 more)

### Community 57 - "postgres/chain-archive-store.ts"
Cohesion: 0.10
Nodes (27): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+19 more)

### Community 58 - "graph.ts"
Cohesion: 0.08
Nodes (45): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+37 more)

### Community 59 - "module-tables.ts"
Cohesion: 0.07
Nodes (28): CaptureColumn, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ColumnType, RefusalCode (+20 more)

### Community 6 - "column-rules.ts"
Cohesion: 0.02
Nodes (102): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+94 more)

### Community 60 - "ledger/types.ts"
Cohesion: 0.09
Nodes (32): LedgerReleasePackage, AppliedBlock, ApplyInput, ApplyOutput, ChainOutcome, LedgerEvent, LedgerPackageOptions, LedgerTask (+24 more)

### Community 61 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.05
Nodes (44): Absent, 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion (+36 more)

### Community 63 - "checkShape"
Cohesion: 0.07
Nodes (34): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), insert() (+26 more)

### Community 64 - "admin/types.ts"
Cohesion: 0.11
Nodes (28): adminRoutes, AdminChannel, AdminServeOptions, AdminAnswer, AdminEndpoint, AdminPart, AdminSnapshot, AdminView (+20 more)

### Community 65 - "core-block-fetch/metadata.ts"
Cohesion: 0.13
Nodes (25): ExtrinsicCall, MetadataField, MetadataPallet, MetadataType, MetadataVariant, Primitive, TypeDef, ScaleError (+17 more)

### Community 66 - "validate.ts"
Cohesion: 0.09
Nodes (39): HistoryFinding, ConfigRule, CursorRule, Finding, Issue, Plain, SettingsSchema, coreSettingsSchema() (+31 more)

### Community 68 - "config-check.ts"
Cohesion: 0.07
Nodes (35): CheckFinding, CheckState, ConfigCheckOptions, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState (+27 more)

### Community 7 - "db/durability-probe.test.ts"
Cohesion: 0.04
Nodes (81): DurabilityProbeOptions, ProbeSession, Held, PgliteLockUse, PostgresOptions, WriterProcess, Job, WorkerEvent (+73 more)

### Community 70 - "networks.ts"
Cohesion: 0.07
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 71 - "postgres/migrate.ts"
Cohesion: 0.08
Nodes (21): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit() (+13 more)

### Community 76 - "version.negative-control.test.ts"
Cohesion: 0.10
Nodes (16): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, CountingNode, MetadataSelector, Select (+8 more)

### Community 77 - "core-settings.ts"
Cohesion: 0.07
Nodes (32): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+24 more)

### Community 79 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (33): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+25 more)

### Community 8 - "StorageError"
Cohesion: 0.03
Nodes (102): ConnectionError, Retryability, StorageError, Rollback, DurabilityContractError, TransactionPoolerDetectedError, MigrationLockTimeoutError, CatalogRow (+94 more)

### Community 80 - "boundary.test.ts"
Cohesion: 0.14
Nodes (32): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+24 more)

### Community 81 - ".show"
Cohesion: 0.07
Nodes (22): AllowedDetail, schemaName(), module(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 82 - "core-private-source.ts"
Cohesion: 0.12
Nodes (20): ChainCheck, PrivateBlockSource, PrivateIntakeOptions, PublicDatabase, PublicIdentity, PublicWakes, PrivateOptions, bindingRefusal() (+12 more)

### Community 84 - "FinalizedLoop"
Cohesion: 0.12
Nodes (8): EntryBoundary, FinalizedLoop, LoopObserver, Startup, ItemsAfterWrite, Controls, runFinalized(), runTo()

### Community 87 - "differential-equivalence.test.ts"
Cohesion: 0.10
Nodes (30): CurrentState, Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1() (+22 more)

### Community 88 - "UmbraDBConnectionOptions"
Cohesion: 0.06
Nodes (31): UmbraDBConnectionOptions, Acceptance — v1.0.0-durable-checkpoint-cursor, G5 — Co-transactional watermark + checkpoint data, G6 — Durability startup probe + binding contract, G7 — Server-side timeouts, Whole-change gates (non-goal compliance + sequencing), 0. Package layout, 2.2 The three durability settings (+23 more)

### Community 9 - "postgres/transaction-lease.ts"
Cohesion: 0.04
Nodes (92): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionFaultError, TransactionLeaseError, TransactionRolledBackError (+84 more)

### Community 90 - "entries.ts"
Cohesion: 0.07
Nodes (31): CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+23 more)

### Community 91 - "transaction-history-storage.property.test.ts"
Cohesion: 0.07
Nodes (23): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), decodeSerializedContent(), decodeSerializedEntry(), store() (+15 more)

### Community 92 - "TransactionHistoryEntry"
Cohesion: 0.12
Nodes (11): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends (+3 more)

### Community 95 - "core-private-source.test.ts"
Cohesion: 0.09
Nodes (11): AdmittedKey, privateIntake, pollingWakes(), readPublicIdentity(), privateBackbone(), fakePublic(), fakeRead(), CORE_KEY_REGISTRY (+3 more)

### Community 96 - "cursor-durability.crash.test.ts"
Cohesion: 0.08
Nodes (28): BatchSpec, CurrentState, InvariantResult, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs(), durableKvValues() (+20 more)

### Community 97 - "records.ts"
Cohesion: 0.11
Nodes (28): TapeError, TapeProblem, TransformProblem, DisconnectRecord, FaultRecord, Params, Tape, expectGoldenRoundTrip() (+20 more)

### Community 98 - "1. Determinism primitives"
Cohesion: 0.10
Nodes (28): CaptureState, capturedTables(), describeTables(), refuseNonDeterministic(), catalogRelations(), catalogTables(), compareUtf8(), schemaFilter() (+20 more)

### Community 113 - "address"
Cohesion: 0.09
Nodes (23): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md` (+15 more)

### Community 125 - "pg"
Cohesion: 0.11
Nodes (17): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 1. Postgres-side profiling (+9 more)

### Community 144 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.12
Nodes (14): some(), Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix (+6 more)

### Community 146 - "repository"
Cohesion: 0.14
Nodes (15): repository(), 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA (+7 more)

### Community 147 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.13
Nodes (13): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 5. WalletState envelope, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier (+5 more)

### Community 148 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 154 - "mapping.test.ts"
Cohesion: 0.20
Nodes (5): mapRows(), mapValue(), identity(), RESULT_TYPES, RFC-3339

### Community 167 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 173 - "scoped-review-manifest"
Cohesion: 0.20
Nodes (10): explain(), explainRefusal(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation (+2 more)

### Community 176 - "migrations"
Cohesion: 0.22
Nodes (9): runMigrationsImpl(), migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), How the two lineages coexist, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks, Why (+1 more)

### Community 197 - ".closed"
Cohesion: 0.29
Nodes (5): scriptedSockets(), 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 51 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.05
Nodes (48): halted(), cursorRead(), following(), When a callback fails, 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes (+40 more)

### Community 67 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): integer(), Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first), G14 — benchmark harness + recorded baseline, ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate) (+31 more)

### Community 72 - "runMigrations"
Cohesion: 0.08
Nodes (35): assertValidSchemaName(), createClient(), runMigrations(), createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS (+27 more)

### Community 73 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): n(), 1. TemporalKV — event-sourced right action with a CAS guard, ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network (+28 more)

### Community 85 - ".getAll"
Cohesion: 0.06
Nodes (32): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live` (+24 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 121 - "ROADMAP.md"
Cohesion: 0.09
Nodes (16): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+8 more)

### Community 122 - "Full-Chain Storage — Design"
Cohesion: 0.09
Nodes (21): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+13 more)

### Community 127 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 128 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 135 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 137 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.12
Nodes (15): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`), Track B — Durable composition (`openspec/changes/v1.0.0-durable-checkpoint-cursor`, merged `e5fcdaa`, `2cb5d00`) (+7 more)

### Community 138 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.12
Nodes (17): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+9 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 149 - "UmbraDB module guide"
Cohesion: 0.14
Nodes (13): Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Private modules, Reading through `db`, Start and stop heights (+5 more)

### Community 150 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 152 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 153 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 157 - "README.md"
Cohesion: 0.27
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 158 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 162 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note), Scenario: A pending entry clears against a finalized entry whose identifiers grew via two prior merges, Scenario: A pending entry does not clear when its identifiers are not a subset (+4 more)

### Community 163 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 166 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 169 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 170 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 172 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 174 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.18
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 177 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 178 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 179 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 180 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 182 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 183 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 184 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 186 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 187 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 188 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 189 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 190 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 191 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 192 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 194 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 195 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 196 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 198 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 199 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 200 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.29
Nodes (6): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, What changes, Why

### Community 201 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 202 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 206 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 207 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 208 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 209 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 210 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 211 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 212 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 213 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 214 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 215 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 216 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 217 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 218 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 219 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 220 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 221 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 222 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 223 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 224 - "00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone"
Cohesion: 0.40
Nodes (4): 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone, Problem, Resolution, Suggested fix

### Community 225 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 226 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 227 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 228 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 229 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 230 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 231 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 233 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 234 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 235 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 236 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 237 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 238 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 239 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 240 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 62 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+29 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 86 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 89 - "package.json"
Cohesion: 0.06
Nodes (33): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+25 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 94 - "scripts"
Cohesion: 0.06
Nodes (32): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+24 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+21 more)

## Knowledge Gaps
- **42 isolated node(s):** `RFC-3339`, `RFC-8259`, `RFC-7693`, `RFC-7693`, `RFC-8949` (+37 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2952 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `db/migrate.ts`, `declaration.ts`, `loop.ts`, `db/errors.ts`, `api-server.test.ts`, `runner/process.ts`, `column-rules.ts`, `db/durability-probe.test.ts`, `StorageError`, `postgres/transaction-lease.ts`, `PgTransactionLeaseLayer`, `ingest-crash.test.ts`, `TransactionHandle`, `node/client.test.ts`, `tape/index.ts`, `admin-harness.ts`, `process.test.ts`, `child-processes.test.ts`, `adapter.ts`, `version`, `ReadHandle`, `src/index.ts`, `CheckpointStore`, `builder.test.ts`, `describeNodeStoreExports`, `ref_node_fs`, `history.test.ts`, `withSuiteWatchdog`, `config/history.ts`, `snapshot.test.ts`, `ClockRegressionError`, `transform-checks.ts`, `loop.test.ts`, `node/client.ts`, `UmbraDBSql`, `changes.property.test.ts`, `plain-data.ts`, `config-check-database.test.ts`, `column-refusals.test.ts`, `postgres/client.ts`, `validate.test.ts`, `height-versioned.property.test.ts`, `core-block-commit.test.ts`, `format.test.ts`, `chain-process.test.ts`, `post-block-update-checks.ts`, `adapter-suite.ts`, `module-tables.ts`, `ledger/types.ts`, `admin/types.ts`, `core-block-fetch/metadata.ts`, `networks.ts`, `postgres/migrate.ts`, `version.negative-control.test.ts`, `core-settings.ts`, `cbor.property.test.ts`, `boundary.test.ts`, `differential-equivalence.test.ts`, `package.json`, `entries.ts`, `transaction-history-storage.property.test.ts`, `core-private-source.test.ts`, `cursor-durability.crash.test.ts`, `chain-archive-replay-decode.integration.test.ts`, `TransactionKeyReuseError`, `pg-tx-history-adapter.ts`, `block-fetch-decode.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `crash.test.ts`, `digest.test.ts`, `cold-boot-recovery.integration.test.ts`, `version-checks.ts`, `ws-mutual-tls.test.ts`, `full-sync-soak.integration.test.ts`, `separation.test.ts`, `chain-archive-rollover.ts`, `identity.ts`, `ref_node_worker_threads`, `binding.test.ts`, `mutation-per-adapter.mjs`, `mapping.test.ts`, `read-height.property.test.ts`, `load-under-prune.integration.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `excluded-not-exported.test.ts`, `component-table.test.ts`, `facade-merge-loader.ts`, `intake.test.ts`, `builder.negative-control.test.ts`, `.source`?**
  _High betweenness centrality (0.301) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8259`, `RFC-7693` to the rest of the system?**
  _42 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `db/migrate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.028937292072060763 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `db/migrate.ts`, `declaration.ts`, `loop.ts`, `db/errors.ts`, `api-server.test.ts`, `runner/process.ts`, `identity.ts`, `db/durability-probe.test.ts`, `ingest-crash.test.ts`, `node/client.test.ts`, `admin-harness.ts`, `process.test.ts`, `NodeBlockSource`, `ReadHandle`, `mapping.test.ts`, `history.test.ts`, `config/history.ts`, `snapshot.test.ts`, `transform-checks.ts`, `loop.test.ts`, `node/client.ts`, `changes.property.test.ts`, `plain-data.ts`, `NodeClient`, `validate.test.ts`, `core-block-commit.test.ts`, `cbor.ts`, `chain-process.test.ts`, `graph.ts`, `module-tables.ts`, `ledger/types.ts`, `checkShape`, `validate.ts`, `config-check.ts`, `version.negative-control.test.ts`, `core-private-source.ts`, `FinalizedLoop`, `core-private-source.test.ts`, `1. Determinism primitives`, `mapping.ts`, `module-rules.ts`, `version-table.ts`, `version-checks.ts`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `declaration.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.029211607601438108 - nodes in this community are weakly interconnected._