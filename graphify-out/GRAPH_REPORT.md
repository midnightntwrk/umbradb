# Graph Report - UmbraDB

## Corpus Check
- 723 files · ~1,142,743 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 65 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 7760 nodes · 21030 edges · 264 communities (245 shown, 19 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 2698 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `9ae79f37df46e3c6` (723 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- src/index.ts
- UmbraError
- node/client.test.ts
- ProcessContexts
- tx-replay-decoder.ts
- private/backends.ts
- intake.test.ts
- chain-archive-rollover.ts
- pglite-writer.worker.ts
- postgres/chain-archive-store.ts
- version-table.ts
- api.ts
- PgliteDatabase
- read-height.property.test.ts
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- binding.test.ts
- ledger-table-config.test.ts
- runner/process.ts
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- identity.ts
- db/durability-probe.test.ts
- pg-kill-save.crash.test.ts
- time-values.worker.ts
- builder.test.ts
- builds.ts
- 3. Proof-blocking findings
- ws-mutual-tls.test.ts
- process.test.ts
- api-server.ts
- checkShape
- cursor-table.property.test.ts
- adapter.ts
- BlobIntegrityError
- component-table.test.ts
- ref_node_os
- no-indexer-or-wallet-sdk.test.ts
- config-check.ts
- RuntimeMetadata
- Connection
- resolveTransaction
- HeightRun
- ApiRoutes
- Global Constraints
- opt-out.test.ts
- type-check.ts
- withNode
- TransactionHandle
- declaration.ts
- test/postgres/setup.ts
- mutation-evidence.d.mts
- builder.negative-control.test.ts
- vitest
- ref_node_crypto
- ReadHandle
- validate.test.ts
- CheckpointStore
- column-rules.ts
- saveAndAdvance
- transform-checks.ts
- PgTransactionLeaseLayer
- ref_node_fs
- cbor.ts
- contents-hash.ts
- adapter-suite.ts
- harness.ts
- core-block-commit.test.ts
- writer-lock-checks.ts
- loop.test.ts
- column-rules.test.ts
- FinalizedLoop
- PgTransactionHistoryStorage
- postgres.ts
- config/history.ts
- replay-check.ts
- ValidationError
- plain-data.ts
- history.test.ts
- graph.ts
- LedgerPackage
- history-startup.ts
- module-tables.ts
- postgres/transaction-history-storage.ts
- validate.ts
- loop.ts
- boundary.test.ts
- core-settings.ts
- postgres/migrate.ts
- translatePostgresError
- checks.test.ts
- networks.ts
- ledger/types.ts
- entries.ts
- InMemoryBlockSource
- core-private-source.ts
- ModuleDeclaration
- module-api.ts
- chain-process.test.ts
- version-checks.ts
- cursor-durability.crash.test.ts
- core-private-source.test.ts
- dispatch.test.ts
- order.property.test.ts
- differential-equivalence.test.ts
- node/client.ts
- crash.test.ts
- mapping.ts
- sigterm.test.ts
- pglite.ts
- height-versioned.property.test.ts
- cbor.property.test.ts
- PointName
- check-required-tests.ts
- tape/index.ts
- legacy-excluded.test.ts
- PgChainArchiveStore
- digest.test.ts
- pglite-server.ts
- BlockItems
- determinism-checks.ts
- ChainArchiveStore
- version
- Design — Sprint 1: project setup + TemporalKV
- mapping.test.ts
- .on
- UmbraDB v0.9.5 "Penumbra" — Release Record
- .db
- mutation-per-adapter.mjs
- envelope.test.ts
- .boolean
- history.property.test.ts
- scoped-review-manifest
- pack-install.mjs
- midnight-env — reproducible PREPROD dev environment
- fresh-instance.mjs
- Requirement: DT-4 Per-block changes of every module table
- ADDED Requirements
- runMigrations
- graph.py
- context
- address
- Storage Algebra Lean Formalization — Approved Design and Status
- UmbraDB software supply-chain directory
- package.json
- Design — Postgres+JSONB storage rebuild
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- README.md
- ADDED Requirements
- ADDED Requirements
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- scripts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- UmbraDB V1.0.0 Implementation Guideline
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Roadmap
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- compilerOptions
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-perf-baseline
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Tasks — v1.1.0: Quint model checking
- Repository agent policy
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Our Pledge
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails
- 00023 — The blocks table's height partitions end at 5,000,000
- bug-report.md
- feature-request.md
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints
- repository
- run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- Requirement: the envelope module has no wallet-SDK runtime import
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
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 219 edges
2. `UmbraError` - 198 edges
3. `ModuleDeclaration` - 105 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `runMigrations()` - 90 edges
6. `PgCheckpointStore` - 87 edges
7. `ValidationError` - 87 edges
8. `Database` - 82 edges
9. `translatePostgresError()` - 78 edges
10. `FinalizedLoop` - 73 edges

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

## Communities (264 total, 19 thin omitted)

### Community 0 - "src/index.ts"
Cohesion: 0.03
Nodes (156): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError, ChunkMissingError (+148 more)

### Community 1 - "UmbraError"
Cohesion: 0.03
Nodes (142): Transaction, CaptureColumn, CapturedTable, CaptureState, AppliedRow, MigrationPart, Runnable, Settling (+134 more)

### Community 10 - "node/client.test.ts"
Cohesion: 0.03
Nodes (53): NodeRetry, NodeSocketEvents, Answer, FakeNode, Handler, Received, recorded, ManualTimers (+45 more)

### Community 101 - "ProcessContexts"
Cohesion: 0.12
Nodes (5): ProcessContexts, ProcessItems, names(), providesProcessItem(), sealed()

### Community 102 - "tx-replay-decoder.ts"
Cohesion: 0.12
Nodes (22): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+14 more)

### Community 103 - "private/backends.ts"
Cohesion: 0.13
Nodes (15): PrivateBackend, SessionSeen, A112Observation, Wiring, pgliteBackend(), postgresBackend(), schemaPlan(), PRIVATE_BACKENDS (+7 more)

### Community 104 - "intake.test.ts"
Cohesion: 0.17
Nodes (16): PrivateSeen, PublicCore, A114Observation, A116Observation, TestLink, a114Problems(), a114Run(), a116Problems() (+8 more)

### Community 105 - "chain-archive-rollover.ts"
Cohesion: 0.13
Nodes (19): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+11 more)

### Community 106 - "pglite-writer.worker.ts"
Cohesion: 0.16
Nodes (17): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor() (+9 more)

### Community 108 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (16): BlobRole, BlockBundle, BlockMeta, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult (+8 more)

### Community 109 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 11 - "api.ts"
Cohesion: 0.04
Nodes (60): Database, ReadOnlyDatabase, ReadOptions, ReadTimeoutSetting, ErrorDetails, Settings, TestDatabase, Case (+52 more)

### Community 112 - "PgliteDatabase"
Cohesion: 0.20
Nodes (5): JobQueue, PgliteDatabase, handleClosed(), failedEarlier(), openOn()

### Community 113 - "read-height.property.test.ts"
Cohesion: 0.13
Nodes (12): TestBackend, HeldRead, Job, Outcome, Reads, Step, concurrent(), queued() (+4 more)

### Community 116 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.12
Nodes (13): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`) (+5 more)

### Community 117 - "binding.test.ts"
Cohesion: 0.14
Nodes (13): TestDatabase, A113Observation, Binding, Outcome, privateCursorHeight(), a113Run(), against(), bindingIn() (+5 more)

### Community 118 - "ledger-table-config.test.ts"
Cohesion: 0.23
Nodes (18): Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts(), haltOf() (+10 more)

### Community 12 - "runner/process.ts"
Cohesion: 0.04
Nodes (54): ChainCheck, ChainCheckInput, ChainIdentity, ChainSource, CoreChainBinding, CoreChainFacts, NodeWait, WaitingListener (+46 more)

### Community 122 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.11
Nodes (17): Hash, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence) (+9 more)

### Community 125 - "identity.ts"
Cohesion: 0.19
Nodes (16): LedgerName, LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch() (+8 more)

### Community 126 - "db/durability-probe.test.ts"
Cohesion: 0.21
Nodes (15): DurabilityProbeOptions, DurabilityViolation, ProbeSession, Row, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit() (+7 more)

### Community 127 - "pg-kill-save.crash.test.ts"
Cohesion: 0.12
Nodes (16): C5AnyFn, assertSaveNotInAnyAutoRetryAllowlist(), completeManifestCountAtSeq(), danglingChunkCount(), listSrcTsFiles(), makeSerializationFaultInjectingClient(), manifestRowCountAtSeq(), orphanJunctionCount() (+8 more)

### Community 129 - "time-values.worker.ts"
Cohesion: 0.12
Nodes (12): Job, openPgliteOn(), main(), open(), tagged(), PGLITE_START_PARAMS, @electric-sql/pglite, 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder (+4 more)

### Community 13 - "builder.test.ts"
Cohesion: 0.04
Nodes (43): ConnectionFrames, Metadata, Step, Frame, RawClient, Script, ScriptedNode, ScriptedRequest (+35 more)

### Community 132 - "builds.ts"
Cohesion: 0.18
Nodes (16): PrivateProcess, PrivateRefusal, PublicCoreOptions, chainDeclarations(), genesisBlock(), genesisHex(), launchPrivate(), poll() (+8 more)

### Community 135 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 138 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 14 - "process.test.ts"
Cohesion: 0.05
Nodes (68): LoopInput, ProcessingEnd, ProcessStatus, A43Observation, Outcome, ProcessDatabase, CoreSeen, testBuild (+60 more)

### Community 141 - "api-server.ts"
Cohesion: 0.17
Nodes (14): ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, ApiResponse, ApiStartup, listenModuleApi(), parseAddress(), readBody() (+6 more)

### Community 145 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 146 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 15 - "adapter.ts"
Cohesion: 0.04
Nodes (70): AdapterSpec, Binding, EventKind, Native, NormalizedCost, Proof, RawBlockContext, RawEvent (+62 more)

### Community 152 - "BlobIntegrityError"
Cohesion: 0.29
Nodes (10): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation), Requirement: The chain-archive error classes are excluded from the frozen surface, Scenario: Chain-archive classes are not exported and their codes are not frozen (+2 more)

### Community 159 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 16 - "ref_node_os"
Cohesion: 0.03
Nodes (68): SignalTarget, ParentJob, Kill, Orphaned, SourceFile, Run, WorkerEvent, LockResult (+60 more)

### Community 161 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 17 - "config-check.ts"
Cohesion: 0.04
Nodes (68): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckState, CheckStep, ConfigCheckOptions, ConfigCheckReport (+60 more)

### Community 179 - "Connection"
Cohesion: 0.40
Nodes (3): Connection, errorMessage(), encodeJson()

### Community 18 - "resolveTransaction"
Cohesion: 0.04
Nodes (70): TransactionHandleInvalidError, WatermarkKey, WatermarkKind, WatermarkValue, WatermarkRow, CoTxCallable, CoTxPauseInfo, CrashHook (+62 more)

### Community 180 - "HeightRun"
Cohesion: 0.27
Nodes (4): HeightRun, SkipsAfterReconnect, Batching, CommitsDespiteLastWrite

### Community 181 - "ApiRoutes"
Cohesion: 0.31
Nodes (5): ApiRoutes, parsePath(), shapeOf(), routesOf(), routesOf()

### Community 185 - "Global Constraints"
Cohesion: 0.22
Nodes (8): Write, Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 19 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (68): Chain, DigestRow, Op, States, TableName, moduleEntryBuilder(), defineModule(), identityRow() (+60 more)

### Community 192 - "type-check.ts"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 193 - "withNode"
Cohesion: 0.31
Nodes (4): TapeClock, quietConnect(), withNode(), SYSTEM_CLOCK

### Community 2 - "TransactionHandle"
Cohesion: 0.02
Nodes (138): TransactionHistoryReader, TransactionHistoryWriter, AsOf, AssertExact, JsonValue, Key, Namespace, Scope (+130 more)

### Community 20 - "declaration.ts"
Cohesion: 0.04
Nodes (67): SchemaWriteHandle, OwnPart, BlockHeader, DefinedModule, FieldKind, FieldSchema, ItemDeclaration, KnownPointsOnly (+59 more)

### Community 21 - "test/postgres/setup.ts"
Cohesion: 0.04
Nodes (66): Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, registerSuiteLifecycle() (+58 more)

### Community 210 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 211 - "builder.negative-control.test.ts"
Cohesion: 0.29
Nodes (3): Failure, Variant, WrongRecording

### Community 22 - "vitest"
Cohesion: 0.05
Nodes (39): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, SqliteTxRow, BlockRow, TxRow, bootstrapChainArchiveSchema() (+31 more)

### Community 23 - "ref_node_crypto"
Cohesion: 0.07
Nodes (51): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+43 more)

### Community 24 - "ReadHandle"
Cohesion: 0.05
Nodes (38): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, Migration (+30 more)

### Community 25 - "validate.test.ts"
Cohesion: 0.05
Nodes (57): coreEntry, PlainObject, RedactableConfig, RedactionForms, SecretForm, TextPattern, EntryRef, EntryView (+49 more)

### Community 26 - "CheckpointStore"
Cohesion: 0.04
Nodes (62): CheckpointStore, Watermarks, decode(), encode(), splitChunks(), 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`), 9. Module → module mapping (source of truth for `tasks.md`), 1.2 Async pattern (+54 more)

### Community 27 - "column-rules.ts"
Cohesion: 0.04
Nodes (68): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts (+60 more)

### Community 28 - "saveAndAdvance"
Cohesion: 0.04
Nodes (63): UmbraDBConnectionOptions, exceedsMaxDepth(), saveAndAdvance(), EntrySectionsSchema, 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions (+55 more)

### Community 29 - "transform-checks.ts"
Cohesion: 0.08
Nodes (42): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, turns() (+34 more)

### Community 3 - "PgTransactionLeaseLayer"
Cohesion: 0.03
Nodes (106): TransactionLeaseLayer, PgCheckpointStore, UmbraDBSql, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters (+98 more)

### Community 30 - "ref_node_fs"
Cohesion: 0.04
Nodes (39): Finding, Lockfile, Manifest, RepositoryFile, Upstream, GuardViolation, ReportedTest, canPin() (+31 more)

### Community 31 - "cbor.ts"
Cohesion: 0.07
Nodes (51): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+43 more)

### Community 32 - "contents-hash.ts"
Cohesion: 0.07
Nodes (44): ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ConsistentRead, ColumnType, DeterminismBackend, TestDatabase (+36 more)

### Community 33 - "adapter-suite.ts"
Cohesion: 0.10
Nodes (50): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState (+42 more)

### Community 34 - "harness.ts"
Cohesion: 0.09
Nodes (45): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+37 more)

### Community 35 - "core-block-commit.test.ts"
Cohesion: 0.06
Nodes (45): BlockHeaderItem, BlockContext, StandInOptions, ChainBuildOptions, Commit, Committed, blockHeaderOf(), checkParent() (+37 more)

### Community 36 - "writer-lock-checks.ts"
Cohesion: 0.08
Nodes (42): WriterProcess, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), expectRefusedBeforeAnyWrite(), noHeight(), blocksIn() (+34 more)

### Community 37 - "loop.test.ts"
Cohesion: 0.07
Nodes (41): Contexts, LoopClass, RunnerDatabase, SeenCall, Started, ComputeAtH, Seen, WithDb (+33 more)

### Community 38 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (35): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+27 more)

### Community 39 - "FinalizedLoop"
Cohesion: 0.08
Nodes (15): EntryBoundary, FinalizedLoop, LoopObserver, Startup, WaitingInRead, ItemsAfterWrite, SkipsStartAtRestart, FailingAfter (+7 more)

### Community 4 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (115): MergeEntriesFn, TransactionHistoryEntry, TransactionHistoryStorage, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike() (+107 more)

### Community 40 - "postgres.ts"
Cohesion: 0.06
Nodes (28): DurabilityWarning, BoundedRead, DriverError, Outcome, Role, Session, Writer, WriterSession (+20 more)

### Community 41 - "config/history.ts"
Cohesion: 0.09
Nodes (49): CoreSettings, HistoryCode, HistoryInput, Span, recordHistory(), errorCode(), buildCoreVersion(), databaseOptions() (+41 more)

### Community 42 - "replay-check.ts"
Cohesion: 0.07
Nodes (35): Recorded, Refusal, TapeBuilder, TapeBuilderOptions, TapeCommandIo, RecordingError, TapeNodeOptions, Held (+27 more)

### Community 43 - "ValidationError"
Cohesion: 0.05
Nodes (48): ValidationError, 0. Package layout, 1. Chunking, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 6. Migration (`002_checkpoint_store.ts`), 9. Test infrastructure, Design — Sprint 3: CheckpointStore, Requirement: prune rejects a retainCount that is not a positive safe integer, before any deletion runs (+40 more)

### Community 44 - "plain-data.ts"
Cohesion: 0.06
Nodes (35): LoadOptions, PlainArray, PlainDataNode, PlainDataRule, Walk, Row, invalid(), isFile() (+27 more)

### Community 45 - "history.test.ts"
Cohesion: 0.08
Nodes (43): versionEntry, HistoryOptions, HistoryRow, Simulation, Start, Case, TestBuildOptions, builtWith100() (+35 more)

### Community 46 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck (+39 more)

### Community 47 - "LedgerPackage"
Cohesion: 0.06
Nodes (27): LedgerEventKind, LedgerPackage, replay(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix, 00019 — `evictKeys` does not refuse the root node of a live ledger state (+19 more)

### Community 48 - "history-startup.ts"
Cohesion: 0.07
Nodes (36): HistoryRule, plainData, AppliedMigration, CheckTarget, CliBackend, Snapshot, Holder, Started (+28 more)

### Community 49 - "module-tables.ts"
Cohesion: 0.08
Nodes (23): PageOptions, RefusalCode, RefusalPlace, Case, describeTable(), moduleTables(), catalogRelations(), catalogTables() (+15 more)

### Community 5 - "postgres/transaction-history-storage.ts"
Cohesion: 0.03
Nodes (114): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryStatus, JsonEncoded (+106 more)

### Community 52 - "validate.ts"
Cohesion: 0.09
Nodes (38): HistoryFinding, ConfigRule, CursorRule, Finding, Issue, Plain, SettingsSchema, coreSettingsSchema() (+30 more)

### Community 55 - "loop.ts"
Cohesion: 0.11
Nodes (35): HeightRange, Callback, ParallelPoint, PointSchedule, Invoke, LoopEnd, ReadOpener, MisuseReports (+27 more)

### Community 56 - "boundary.test.ts"
Cohesion: 0.12
Nodes (34): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+26 more)

### Community 58 - "core-settings.ts"
Cohesion: 0.06
Nodes (34): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+26 more)

### Community 59 - "postgres/migrate.ts"
Cohesion: 0.08
Nodes (22): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit() (+14 more)

### Community 6 - "translatePostgresError"
Cohesion: 0.03
Nodes (110): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionFaultError, TransactionLeaseError, TransactionOptions (+102 more)

### Community 60 - "checks.test.ts"
Cohesion: 0.07
Nodes (25): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, openBlockWrites() (+17 more)

### Community 61 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 63 - "ledger/types.ts"
Cohesion: 0.12
Nodes (24): LedgerReleasePackage, ApplyInput, ApplyOutput, LedgerEvent, LedgerPackageOptions, LedgerTask, LogItem, ParsedTransaction (+16 more)

### Community 64 - "entries.ts"
Cohesion: 0.07
Nodes (32): CoreLedgerVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+24 more)

### Community 67 - "InMemoryBlockSource"
Cohesion: 0.09
Nodes (16): BlockRef, BlockSource, InMemoryBlockSource, InMemorySourceOptions, Wait, LateRedelivery, Broken, Shifted (+8 more)

### Community 69 - "core-private-source.ts"
Cohesion: 0.12
Nodes (21): PrivateBlockSource, privateIntake, PrivateIntakeOptions, PublicDatabase, PublicIdentity, PublicWakes, PrivateOptions, bindingRefusal() (+13 more)

### Community 7 - "ModuleDeclaration"
Cohesion: 0.03
Nodes (95): ErrorCode, ApiRegistry, ModuleDeclaration, Revision, GraphInput, ResolvedGraph, StartedModuleApi, ApiRequest (+87 more)

### Community 70 - "module-api.ts"
Cohesion: 0.09
Nodes (22): ChainDataAnswer, ChainDataView, ApiError, ApiErrorCode, HttpHandler, HttpMethod, HttpRoute, ModuleApi (+14 more)

### Community 71 - "chain-process.test.ts"
Cohesion: 0.10
Nodes (22): ProcessHandle, WorkerEvent, A77Observation, A78Observation, A90Observation, Failing, Flaky, Seen (+14 more)

### Community 73 - "version-checks.ts"
Cohesion: 0.14
Nodes (18): MetadataBlock, MetadataNode, RuntimeMetadataEntry, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata (+10 more)

### Community 74 - "cursor-durability.crash.test.ts"
Cohesion: 0.08
Nodes (28): BatchSpec, CurrentState, InvariantResult, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs(), durableKvValues() (+20 more)

### Community 75 - "core-private-source.test.ts"
Cohesion: 0.09
Nodes (9): AdmittedKey, privateBackbone(), fakePublic(), fakeRead(), CORE_KEY_REGISTRY, CORE_KEY_REGISTRY_MIGRATIONS, NONE, PUBLIC_POLL_MS (+1 more)

### Community 76 - "dispatch.test.ts"
Cohesion: 0.09
Nodes (22): PointArguments, PointRun, Recorder, Pipeline, ids(), registering(), waveIds(), recording() (+14 more)

### Community 77 - "order.property.test.ts"
Cohesion: 0.11
Nodes (28): CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce(), checkParallelWaits() (+20 more)

### Community 79 - "differential-equivalence.test.ts"
Cohesion: 0.12
Nodes (26): CurrentState, Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1() (+18 more)

### Community 8 - "node/client.ts"
Cohesion: 0.05
Nodes (67): Bound, Connection, HeadSubscriber, NodeCallOptions, NodeClient, NodeClientOptions, NodeSubscription, Pending (+59 more)

### Community 81 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+15 more)

### Community 82 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 83 - "sigterm.test.ts"
Cohesion: 0.10
Nodes (20): Job, ProcessBackend, WorkEvent, WorkOptions, A48Observation, WORKER, Job, WorkerEvent (+12 more)

### Community 84 - "pglite.ts"
Cohesion: 0.12
Nodes (23): DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, Job, Outcome (+15 more)

### Community 85 - "height-versioned.property.test.ts"
Cohesion: 0.13
Nodes (20): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Key, Model (+12 more)

### Community 87 - "cbor.property.test.ts"
Cohesion: 0.11
Nodes (26): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+18 more)

### Community 88 - "PointName"
Cohesion: 0.11
Nodes (19): PointName, CallbackFailure, ProcessReason, ReasonCode, Unwrapped, HeightFailure, Misuse, UnexpectedCursor (+11 more)

### Community 89 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 9 - "tape/index.ts"
Cohesion: 0.05
Nodes (70): Link, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest, RequestId, Json (+62 more)

### Community 90 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 94 - "PgChainArchiveStore"
Cohesion: 0.19
Nodes (11): BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf() (+3 more)

### Community 95 - "digest.test.ts"
Cohesion: 0.11
Nodes (23): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+15 more)

### Community 96 - "pglite-server.ts"
Cohesion: 0.14
Nodes (16): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, pgliteBackend(), expectNoOutsideReads() (+8 more)

### Community 97 - "BlockItems"
Cohesion: 0.12
Nodes (12): ItemSink, BlockItems, LateUse, EagerItems, EagerLoop, KeptItems, KeptLoop, revisionAt() (+4 more)

### Community 98 - "determinism-checks.ts"
Cohesion: 0.16
Nodes (21): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, privateModule(), refusalOf(), startPrivate(), a146Hashes() (+13 more)

### Community 99 - "ChainArchiveStore"
Cohesion: 0.08
Nodes (12): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks` (+4 more)

### Community 107 - "version"
Cohesion: 0.10
Nodes (20): version(), 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling) (+12 more)

### Community 115 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.11
Nodes (17): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 0. Schema naming, now that UmbraDB is standalone (+9 more)

### Community 121 - "mapping.test.ts"
Cohesion: 0.14
Nodes (8): mapValue(), parseJsonLossless(), identity(), RFC-3339, 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 128 - ".on"
Cohesion: 0.12
Nodes (16): listen(), 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix, Requirement: CF-4 Every field is data, operational or secret, Scenario: A secret never appears (+8 more)

### Community 130 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.11
Nodes (17): repository(), 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, UmbraDB v0.9.5 "Penumbra" — Release Record (+9 more)

### Community 133 - ".db"
Cohesion: 0.14
Nodes (15): directPublic(), Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Private modules, Process items and APIs, Reading through `db` (+7 more)

### Community 144 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 151 - "envelope.test.ts"
Cohesion: 0.26
Nodes (11): answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions(), CHAIN_DATA_HEADERS, CHAIN_DATA_VIEW (+3 more)

### Community 154 - ".boolean"
Cohesion: 0.18
Nodes (11): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Same data, two backends (+3 more)

### Community 165 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 167 - "scoped-review-manifest"
Cohesion: 0.20
Nodes (10): explain(), explainRefusal(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation (+2 more)

### Community 168 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 187 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 236 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 242 - "Requirement: DT-4 Per-block changes of every module table"
Cohesion: 0.50
Nodes (4): insert(), Requirement: DT-4 Per-block changes of every module table, Scenario: Insert then update in one block, Scenario: Rewriting the same value

### Community 51 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): integer(), Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first), G14 — benchmark harness + recorded baseline, ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate) (+31 more)

### Community 57 - "runMigrations"
Cohesion: 0.08
Nodes (37): assertNoConflictingSearchPath(), assertValidSchemaName(), createClient(), runMigrations(), newClient(), 8. Migration, 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable) (+29 more)

### Community 62 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 68 - "context"
Cohesion: 0.07
Nodes (22): schemaName(), module(), context(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 91 - "address"
Cohesion: 0.08
Nodes (24): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md` (+16 more)

### Community 100 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.08
Nodes (25): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+17 more)

### Community 110 - "UmbraDB software supply-chain directory"
Cohesion: 0.10
Nodes (18): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists, 1. What SLSA v1.0 defines (+10 more)

### Community 111 - "package.json"
Cohesion: 0.10
Nodes (20): bin, umbradb, description, exports, files, homepage, license, main (+12 more)

### Community 114 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.10
Nodes (14): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+6 more)

### Community 119 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 120 - "README.md"
Cohesion: 0.17
Nodes (5): For historical reference only, Tasks — superseded by per-sprint openspec changes, UmbraDB v1.0.0 — Release Record (PENDING), What 1.0.0 additionally requires, What must happen before this record can be completed

### Community 123 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 131 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 134 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 137 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 139 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+7 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 142 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.13
Nodes (15): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N) (+7 more)

### Community 143 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 149 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 150 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 153 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 156 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 157 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 160 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 162 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 163 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 164 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 166 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 169 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 170 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 171 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-4 One provider of contract logs at a time, Scenario: A log in a failed fallible segment, Scenario: A v8 log, Scenario: Full until a backup, fast after it, Scenario: Two calls to one contract in one block (+1 more)

### Community 172 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 173 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer) (+1 more)

### Community 174 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 175 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.20
Nodes (9): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC, 9. Change close-out (+1 more)

### Community 176 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 177 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 182 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 183 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 184 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 186 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 188 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 189 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.22
Nodes (8): 11. Chain data, 13. Contract data, 15. Backups, 16. Browser, 18. Whole-system faults, differentials and measurements, 19. Close-out, 8. Admin endpoints, Tasks — CORE-ARCH: the standalone indexer's core architecture

### Community 190 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 191 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 194 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 195 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 196 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 197 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 198 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 199 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 200 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 201 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 202 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 203 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 204 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 205 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 206 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 207 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 208 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 209 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 212 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 213 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 214 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 215 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 216 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 217 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 218 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 219 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 220 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 221 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 222 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 223 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 224 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 225 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 226 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 227 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 228 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 229 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 230 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.40
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 231 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 232 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 233 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 234 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 235 - "Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data"
Cohesion: 0.40
Nodes (5): Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data, Scenario: replay from the durable cursor converges on current state, Scenario: the durable watermark is never ahead of durable data, Scenario: the invariant holds under synchronous_commit = off, Scenario: the invariant holds under synchronous_commit = on

### Community 237 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 238 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 239 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 240 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 241 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 243 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 244 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 247 - "Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints"
Cohesion: 0.67
Nodes (3): Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Two runs, one difference

### Community 248 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 50 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 53 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 54 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 65 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 66 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races (+27 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 78 - "Full-Chain Storage — Design"
Cohesion: 0.07
Nodes (29): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+21 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+21 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+19 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form, Requirement: G9/T3 — a killed lease-holder does not wedge the lease (+19 more)

## Knowledge Gaps
- **40 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` (+35 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2834 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `src/index.ts`, `UmbraError`, `PgTransactionLeaseLayer`, `postgres/transaction-history-storage.ts`, `translatePostgresError`, `ModuleDeclaration`, `node/client.ts`, `tape/index.ts`, `node/client.test.ts`, `api.ts`, `runner/process.ts`, `builder.test.ts`, `process.test.ts`, `adapter.ts`, `ref_node_os`, `config-check.ts`, `resolveTransaction`, `opt-out.test.ts`, `declaration.ts`, `test/postgres/setup.ts`, `ref_node_crypto`, `ReadHandle`, `validate.test.ts`, `transform-checks.ts`, `ref_node_fs`, `cbor.ts`, `contents-hash.ts`, `adapter-suite.ts`, `core-block-commit.test.ts`, `writer-lock-checks.ts`, `loop.test.ts`, `column-rules.test.ts`, `plain-data.ts`, `history.test.ts`, `module-tables.ts`, `boundary.test.ts`, `core-settings.ts`, `postgres/migrate.ts`, `checks.test.ts`, `networks.ts`, `ledger/types.ts`, `entries.ts`, `InMemoryBlockSource`, `chain-process.test.ts`, `version-checks.ts`, `cursor-durability.crash.test.ts`, `core-private-source.test.ts`, `dispatch.test.ts`, `order.property.test.ts`, `differential-equivalence.test.ts`, `crash.test.ts`, `sigterm.test.ts`, `height-versioned.property.test.ts`, `cbor.property.test.ts`, `PointName`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `digest.test.ts`, `pglite-server.ts`, `BlockItems`, `determinism-checks.ts`, `private/backends.ts`, `intake.test.ts`, `package.json`, `read-height.property.test.ts`, `binding.test.ts`, `ledger-table-config.test.ts`, `mapping.test.ts`, `identity.ts`, `db/durability-probe.test.ts`, `pg-kill-save.crash.test.ts`, `time-values.worker.ts`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `cursor-table.property.test.ts`, `envelope.test.ts`, `excluded-not-exported.test.ts`, `component-table.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `history.property.test.ts`, `builder.negative-control.test.ts`?**
  _High betweenness centrality (0.309) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 11 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _40 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02914704343275772 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `ModuleDeclaration`, `node/client.ts`, `node/client.test.ts`, `api.ts`, `runner/process.ts`, `process.test.ts`, `checkShape`, `config-check.ts`, `opt-out.test.ts`, `declaration.ts`, `envelope.test.ts`, `ReadHandle`, `validate.test.ts`, `transform-checks.ts`, `cbor.ts`, `contents-hash.ts`, `core-block-commit.test.ts`, `writer-lock-checks.ts`, `loop.test.ts`, `FinalizedLoop`, `postgres.ts`, `config/history.ts`, `plain-data.ts`, `history.test.ts`, `graph.ts`, `module-tables.ts`, `RuntimeMetadata`, `validate.ts`, `ApiRoutes`, `loop.ts`, `checks.test.ts`, `ledger/types.ts`, `entries.ts`, `core-private-source.ts`, `module-api.ts`, `chain-process.test.ts`, `version-checks.ts`, `core-private-source.test.ts`, `mapping.ts`, `pglite.ts`, `PointName`, `ProcessContexts`, `pglite-writer.worker.ts`, `version-table.ts`, `PgliteDatabase`, `ledger-table-config.test.ts`, `mapping.test.ts`, `identity.ts`, `db/durability-probe.test.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.027967221781654773 - nodes in this community are weakly interconnected._