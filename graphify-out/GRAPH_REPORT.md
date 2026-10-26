# Graph Report - UmbraDB

## Corpus Check
- 756 files · ~1,174,238 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 8009 nodes · 21960 edges · 275 communities (253 shown, 22 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 2759 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `8927ff55df18368b` (756 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionHistoryStorage
- src/index.ts
- node/client.ts
- ref_node_timers
- builds.ts
- version-table.ts
- contents-hash.ts
- height
- containers.test.ts
- height-versioned.property.test.ts
- CheckpointStore
- binding.test.ts
- identity.ts
- determinism-checks.ts
- BlobIntegrityError
- PrivateBlockSource
- declaration.ts
- height-versioned.ts
- read-height.property.test.ts
- intake.test.ts
- no-indexer-or-wallet-sdk.test.ts
- ws-mutual-tls.test.ts
- ReadHandle
- Database
- holds
- cursor-table.property.test.ts
- ChainArchiveStore
- checkShape
- chain-archive-rollover.ts
- writer-lock-checks.ts
- source-scan.ts
- 3. Proof-blocking findings
- midnight-env — reproducible PREPROD dev environment
- halts.test.ts
- component-table.test.ts
- adapter.ts
- height-versioned.test.ts
- Global Constraints
- PgTransactionLeaseLayer
- type-check.ts
- a114Run
- RuntimeMetadata
- ProcessItems
- sigterm.worker.ts
- runner/process.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- module-api.ts
- vitest
- config-check.ts
- db/errors.ts
- ReadPool
- mutation-evidence.d.mts
- vendored-ledger-files.test.ts
- UmbraDBSql
- validate.test.ts
- BlockMeta
- typed-config.test.ts
- describeNodeStoreExports
- child-processes.test.ts
- snapshot.test.ts
- serve.test.ts
- column-rules.ts
- chain-process.test.ts
- ValidationError
- FinalizedLoop
- builder.test.ts
- admin-harness.ts
- harness.ts
- .read
- column-rules.test.ts
- loop.test.ts
- history.test.ts
- config/history.ts
- transform-checks.ts
- module-tables.ts
- order.property.test.ts
- ledger/types.ts
- cbor.ts
- plain-data.ts
- validate.ts
- adapter-suite.ts
- node.test.ts
- ref_node_path
- graph.ts
- ref_node_fs
- runMigrations
- core-block-commit.test.ts
- dispatch.test.ts
- LedgerPackage
- cursor-table.test.ts
- failures.ts
- loop.ts
- networks.ts
- db/migrate.ts
- cbor.property.test.ts
- core-settings.ts
- postgres/chain-archive-store.ts
- .show
- builder.ts
- api-server.test.ts
- tape/index.ts
- process.test.ts
- process-context.test.ts
- crash.test.ts
- core-private-source.test.ts
- mapping.ts
- UmbraError
- digest.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- version-checks.ts
- private/backends.ts
- node/client.test.ts
- BlockItems
- tx-replay-decoder.ts
- pglite-writer.worker.ts
- pglite-server.ts
- ledger-table-config.test.ts
- address
- mutation-per-adapter.mjs
- pg
- ADDED Requirements
- history.property.test.ts
- 001_chain_archive_core.ts
- .boolean
- tableRefusals
- graph.py
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- boundary.test.ts
- version
- UmbraDB third-party component inventory (SBOM)
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 Implementation Guideline
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- devDependencies
- UmbraDB module guide
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Roadmap
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.1.0: Quint model checking
- compilerOptions
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB v0.9.5 "Penumbra" — Release Record
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- Design — Postgres+JSONB storage rebuild
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Repository agent policy
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Security policy & threat model
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Algebraic Specification of the midnight-pg-store Storage Layer
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 12. Milestone status
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- Design — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-perf-baseline
- Tasks — v1.0.0-perf-baseline
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Performance — design
- Midnight Foundation Security Policy
- lib.sh
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00023 — The blocks table's height partitions end at 5,000,000
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- 9. Trust and refinement boundary
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Acceptance criteria — v1.0.0-perf-baseline
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- Requirement: manifestHash is computed once at write time from the ordered chunk-hash sequence
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
- ADDED Requirements
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- Requirements
- ADDED Requirements
- ADDED Requirements
- README.md
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 229 edges
2. `UmbraError` - 204 edges
3. `ModuleDeclaration` - 109 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `runMigrations()` - 90 edges
6. `PgCheckpointStore` - 87 edges
7. `ValidationError` - 87 edges
8. `Database` - 82 edges
9. `translatePostgresError()` - 78 edges
10. `FinalizedLoop` - 73 edges

## Surprising Connections (you probably didn't know these)
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: Two instances constructed for different wallets never see each other's rows` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `Scenario: save on a caller transaction behaves identically to the internal-transaction path for a reader` --references--> `CheckpointSummary`  [INFERRED]
  openspec/changes/v1.0.0-durable-checkpoint-cursor/specs/durable-composition/spec.md → src/interfaces/checkpoint-store.ts
- `Scenario: A history page issues two queries regardless of page size` --references--> `CheckpointSummary`  [INFERRED]
  openspec/changes/v1.0.0-perf-baseline/specs/performance-baseline/spec.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (275 total, 22 thin omitted)

### Community 0 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (209): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryEntry (+201 more)

### Community 1 - "src/index.ts"
Cohesion: 0.02
Nodes (191): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError, ChunkMissingError (+183 more)

### Community 10 - "node/client.ts"
Cohesion: 0.05
Nodes (64): Bound, Connection, HeadSubscriber, NodeCallOptions, NodeClient, NodeSubscription, Pending, State (+56 more)

### Community 100 - "ref_node_timers"
Cohesion: 0.13
Nodes (10): Heartbeat, lastTick(), tickAgeMs(), beat(), hex(), HEARTBEAT_INTERVAL_MS, records, requested (+2 more)

### Community 101 - "builds.ts"
Cohesion: 0.18
Nodes (18): PrivateProcess, PrivateRefusal, PublicCoreOptions, privateBackbone(), directPublic(), genesisBlock(), genesisHex(), launchPrivate() (+10 more)

### Community 102 - "version-table.ts"
Cohesion: 0.18
Nodes (20): ConfiguredLedgerTable, LedgerPin, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable() (+12 more)

### Community 103 - "contents-hash.ts"
Cohesion: 0.13
Nodes (15): CaptureColumn, ModuleColumn, ColumnType, encodeTableRow(), renderKeyValue(), explain(), valueFailureBecause(), Cleanup (+7 more)

### Community 104 - "height"
Cohesion: 0.12
Nodes (18): Broken, height(), 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy (+10 more)

### Community 106 - "containers.test.ts"
Cohesion: 0.10
Nodes (12): FailsOnceStarted, SlowToReportPorts, SourceFile, parentWithContainer(), LABEL_ATTEMPT, LABEL_PID, LABEL_REPOSITORY, START_ATTEMPTS (+4 more)

### Community 107 - "height-versioned.property.test.ts"
Cohesion: 0.13
Nodes (17): Block, Counts, Effect, Key, Op, tokenMetadata(), versionedDatabase(), TOKEN_SCAN (+9 more)

### Community 11 - "CheckpointStore"
Cohesion: 0.03
Nodes (90): CheckpointStore, TransactionLeaseLayer, Watermarks, splitChunks(), validateSaveOptions(), saveAndAdvance(), Added, 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`) (+82 more)

### Community 113 - "binding.test.ts"
Cohesion: 0.15
Nodes (12): TestDatabase, A113Observation, Binding, Outcome, privateCursorHeight(), a113Run(), bindingIn(), outcomeOf() (+4 more)

### Community 114 - "identity.ts"
Cohesion: 0.19
Nodes (16): LedgerName, LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerSelection, checkPackageFiles(), manifestSha256(), mismatch() (+8 more)

### Community 115 - "determinism-checks.ts"
Cohesion: 0.20
Nodes (16): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, PRIVATE_ROWS_SQL(), privateModule(), a146Hashes(), a146Refusals() (+8 more)

### Community 117 - "BlobIntegrityError"
Cohesion: 0.23
Nodes (12): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+4 more)

### Community 119 - "PrivateBlockSource"
Cohesion: 0.25
Nodes (7): PrivateBlockSource, PrivateIntakeOptions, PublicDatabase, PublicWakes, PrivateOptions, 8. Private processes (PP), 14. Private processes

### Community 12 - "declaration.ts"
Cohesion: 0.03
Nodes (78): StatusSnapshot, EntryBuilder, UmbraConfig, ApiRegistry, BlockHeader, DefinedModule, FieldKind, FieldSchema (+70 more)

### Community 122 - "height-versioned.ts"
Cohesion: 0.17
Nodes (9): cursorTable, CursorTableOptions, heightVersionedTable, HeightVersionedTableOptions, Migration, Control, checkName(), checkName() (+1 more)

### Community 123 - "read-height.property.test.ts"
Cohesion: 0.17
Nodes (11): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+3 more)

### Community 124 - "intake.test.ts"
Cohesion: 0.22
Nodes (14): PrivateSeen, A114Observation, A116Observation, against(), a114Problems(), a116Problems(), a116Run(), against() (+6 more)

### Community 125 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.19
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 126 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 13 - "Database"
Cohesion: 0.05
Nodes (81): Database, SchemaPlan, Committed, Chain, ChainOptions, DigestRow, Op, States (+73 more)

### Community 130 - "holds"
Cohesion: 0.28
Nodes (9): VersionedValue, StoredVersion, BlockFails, Model, canonicalText(), holds(), readBack(), same() (+1 more)

### Community 131 - "cursor-table.property.test.ts"
Cohesion: 0.17
Nodes (15): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+7 more)

### Community 135 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 138 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 14 - "writer-lock-checks.ts"
Cohesion: 0.04
Nodes (58): CheckTarget, CliBackend, Snapshot, WriterProcess, WorkerEvent, PostgresTestDatabase, PostgresTestServer, PauseReport (+50 more)

### Community 145 - "source-scan.ts"
Cohesion: 0.20
Nodes (13): ModuleReference, boundaryViolations(), isInside(), literalText(), moduleReferences(), printed(), propertyNameText(), resolveSpecifier() (+5 more)

### Community 147 - "3. Proof-blocking findings"
Cohesion: 0.15
Nodes (13): Absent, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces (+5 more)

### Community 148 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 15 - "halts.test.ts"
Cohesion: 0.04
Nodes (66): LoopInput, ProcessingEnd, ProcessStatus, A43Observation, Outcome, ProcessBackend, ProcessDatabase, A42Observation (+58 more)

### Community 153 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 16 - "adapter.ts"
Cohesion: 0.04
Nodes (67): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+59 more)

### Community 161 - "height-versioned.test.ts"
Cohesion: 0.21
Nodes (6): BlockFails, Height, versionsOf(), outcome(), secondChangeProblems(), stateOf()

### Community 167 - "Global Constraints"
Cohesion: 0.20
Nodes (9): CursorValue, Write, Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+1 more)

### Community 17 - "PgTransactionLeaseLayer"
Cohesion: 0.04
Nodes (78): Lease, LeaseAcquireOptions, LeaseFaultError, HeldLease, PgTransactionLeaseLayer, ApplicationError, InjectedReleaseFaultLayer, abortError() (+70 more)

### Community 174 - "type-check.ts"
Cohesion: 0.36
Nodes (8): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), isRegularFile(), packageType(), typeCheckFile(), typescript

### Community 176 - "RuntimeMetadata"
Cohesion: 0.27
Nodes (3): RuntimeMetadata, contentStateOf(), hexOf()

### Community 178 - "sigterm.worker.ts"
Cohesion: 0.24
Nodes (8): WORKER, Job, WorkerEvent, report(), build, handle, hold, keepAlive

### Community 18 - "runner/process.ts"
Cohesion: 0.05
Nodes (61): ChainIdentity, ChainSource, NodeWait, WaitingListener, HistoryCheck, HistoryInput, HistoryRule, plainData (+53 more)

### Community 185 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 19 - "module-api.ts"
Cohesion: 0.04
Nodes (63): Connection, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, ChainDataAnswer, ChainDataView, ApiError, ApiErrorCode (+55 more)

### Community 2 - "vitest"
Cohesion: 0.02
Nodes (184): PgCheckpointStore, BatchSpec, CurrentState, InvariantResult, C5AnyFn, Callable, Deferred, LoadInterleaveObserver (+176 more)

### Community 20 - "config-check.ts"
Cohesion: 0.05
Nodes (61): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName (+53 more)

### Community 21 - "db/errors.ts"
Cohesion: 0.05
Nodes (40): ReadOnlyDatabase, ReadOptions, ReadTimeoutSetting, ErrorCode, ErrorDetails, Settings, TestBackend, Case (+32 more)

### Community 211 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 212 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 22 - "UmbraDBSql"
Cohesion: 0.04
Nodes (52): WatermarkKey, WatermarkKind, WatermarkValue, UmbraDBSql, PgWatermarks, WatermarkRow, CoTxCallable, CoTxPauseInfo (+44 more)

### Community 23 - "validate.test.ts"
Cohesion: 0.04
Nodes (66): coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+58 more)

### Community 231 - "BlockMeta"
Cohesion: 0.47
Nodes (3): BlockMeta, bufToHex(), toBlockMeta()

### Community 232 - "typed-config.test.ts"
Cohesion: 0.33
Nodes (3): Finding, CONFIG, FIXTURES

### Community 24 - "describeNodeStoreExports"
Cohesion: 0.07
Nodes (49): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+41 more)

### Community 25 - "child-processes.test.ts"
Cohesion: 0.04
Nodes (58): SignalTarget, ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, terminationSignal() (+50 more)

### Community 26 - "snapshot.test.ts"
Cohesion: 0.07
Nodes (53): ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminStarter, SnapshotFacts, ConfigSnapshot, SanitizedError, PlainObject (+45 more)

### Community 27 - "serve.test.ts"
Cohesion: 0.06
Nodes (48): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+40 more)

### Community 28 - "column-rules.ts"
Cohesion: 0.04
Nodes (69): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts (+61 more)

### Community 29 - "chain-process.test.ts"
Cohesion: 0.05
Nodes (45): InMemoryBlockSource, InMemorySourceOptions, Wait, Job, WorkerEvent, A77Observation, A78Observation, A90Observation (+37 more)

### Community 3 - "ValidationError"
Cohesion: 0.02
Nodes (160): TransactionHistoryReader, TransactionHistoryWriter, ValidationError, AsOf, AssertExact, HistoryUnavailableError, JsonValue, Key (+152 more)

### Community 30 - "FinalizedLoop"
Cohesion: 0.06
Nodes (21): FinalizedLoop, HeightRun, LoopObserver, Startup, SkipsAfterReconnect, Batching, ItemsAfterWrite, LateRedelivery (+13 more)

### Community 31 - "builder.test.ts"
Cohesion: 0.05
Nodes (27): ConnectionFrames, Failure, Variant, WrongRecording, Frame, RawClient, Script, ScriptedNode (+19 more)

### Community 32 - "admin-harness.ts"
Cohesion: 0.07
Nodes (49): ProcessHandle, AdminRun, Answered, Answerer, Expected, gate, Observation, Prober (+41 more)

### Community 33 - "harness.ts"
Cohesion: 0.09
Nodes (46): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+38 more)

### Community 34 - ".read"
Cohesion: 0.06
Nodes (47): Run, Job, WorkerEvent, Outcome, identityRow(), captured(), captureFunction(), shadowRows() (+39 more)

### Community 35 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (36): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+28 more)

### Community 36 - "loop.test.ts"
Cohesion: 0.07
Nodes (40): WaitingInRead, Contexts, LoopClass, RunnerDatabase, FailingAfter, Given, Seen, Shifted (+32 more)

### Community 37 - "history.test.ts"
Cohesion: 0.07
Nodes (49): CoreLedgerVersion, LedgerPackageIdentity, versionEntry, HistoryOptions, HistoryRow, LedgerReleasePackage, Simulation, Start (+41 more)

### Community 38 - "config/history.ts"
Cohesion: 0.07
Nodes (50): CoreVersion, CoreSettings, HistoryCode, HistoryContext, HistoryFinding, Span, Finding, EntryRange (+42 more)

### Community 39 - "transform-checks.ts"
Cohesion: 0.09
Nodes (36): TransformError, until(), baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape(), expectVariantOutput(), forkRecords() (+28 more)

### Community 4 - "module-tables.ts"
Cohesion: 0.03
Nodes (94): CapturedTable, CaptureState, CheckedMigration, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, GuardTableRow (+86 more)

### Community 40 - "order.property.test.ts"
Cohesion: 0.06
Nodes (47): PointRun, CallEvent, Recorder, CheckName, GraphSpec, ModuleSpec, Pipeline, TESTED (+39 more)

### Community 41 - "ledger/types.ts"
Cohesion: 0.08
Nodes (37): ApplyInput, ApplyOutput, ChainOutcome, LedgerEvent, LedgerPackageOptions, LedgerTask, LogItem, ParsedTransaction (+29 more)

### Community 42 - "cbor.ts"
Cohesion: 0.08
Nodes (44): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+36 more)

### Community 43 - "plain-data.ts"
Cohesion: 0.06
Nodes (36): LoadedConfig, LoadOptions, PlainArray, PlainDataNode, PlainDataRule, Walk, Row, invalid() (+28 more)

### Community 44 - "validate.ts"
Cohesion: 0.08
Nodes (48): CoreChainFacts, CheckState, ConfigCheckOptions, ProcessSide, CheckedConfig, CheckedEntry, ConfigContext, ConfigInput (+40 more)

### Community 45 - "adapter-suite.ts"
Cohesion: 0.11
Nodes (45): Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerHost, expectNoV8Logs(), expectRecordedRelease() (+37 more)

### Community 46 - "node.test.ts"
Cohesion: 0.07
Nodes (24): Metadata, Step, Failure, Variant, TapeClock, expectAnswersByOccurrence(), expectDelayHonoured(), expectGoldenRoundTrip() (+16 more)

### Community 47 - "ref_node_path"
Cohesion: 0.06
Nodes (36): RepositoryFile, GuardViolation, ReportedTest, canPin(), pinViolations(), repositoryFiles(), extractStringLiterals(), findChainSyncViolations() (+28 more)

### Community 48 - "graph.ts"
Cohesion: 0.08
Nodes (45): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+37 more)

### Community 49 - "ref_node_fs"
Cohesion: 0.09
Nodes (36): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+28 more)

### Community 5 - "runMigrations"
Cohesion: 0.03
Nodes (113): UmbraDBConnectionOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, Started, SqliteTxRow, BlockRow (+105 more)

### Community 50 - "core-block-commit.test.ts"
Cohesion: 0.08
Nodes (32): BlockHeaderItem, BlockWriteHandle, BlockContext, StandInOptions, Commit, blockHeaderOf(), checkParent(), commitBlock() (+24 more)

### Community 51 - "dispatch.test.ts"
Cohesion: 0.09
Nodes (38): GraphInput, PastFaultCase, RefusalCase, keysModule(), contractLogs(), declaration(), logsProvider(), reader() (+30 more)

### Community 52 - "LedgerPackage"
Cohesion: 0.06
Nodes (24): LedgerEventKind, LedgerPackage, expectSmallStateReloadsByKey(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix, 00019 — `evictKeys` does not refuse the root node of a live ledger state (+16 more)

### Community 54 - "cursor-table.test.ts"
Cohesion: 0.06
Nodes (30): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, cursorDatabase, BlockFails (+22 more)

### Community 55 - "failures.ts"
Cohesion: 0.10
Nodes (19): CoreChainBinding, StartedModuleApi, ProcessReason, ReasonCode, Unwrapped, Process, StatusFacts, isListenFailure() (+11 more)

### Community 56 - "loop.ts"
Cohesion: 0.12
Nodes (34): HeightRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments, PointSchedule, Invoke (+26 more)

### Community 58 - "networks.ts"
Cohesion: 0.07
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 6 - "db/migrate.ts"
Cohesion: 0.04
Nodes (104): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner (+96 more)

### Community 60 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (36): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+28 more)

### Community 62 - "core-settings.ts"
Cohesion: 0.06
Nodes (33): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+25 more)

### Community 63 - "postgres/chain-archive-store.ts"
Cohesion: 0.12
Nodes (23): BlobRole, BlockBundle, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode, Hex32 (+15 more)

### Community 64 - ".show"
Cohesion: 0.08
Nodes (23): AllowedDetail, schemaName(), module(), context(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness (+15 more)

### Community 65 - "builder.ts"
Cohesion: 0.10
Nodes (21): Refusal, TapeBuilder, TapeBuilderOptions, TapeCommandIo, RecordingError, SessionEnd, withBuilder(), frameText() (+13 more)

### Community 68 - "api-server.test.ts"
Cohesion: 0.09
Nodes (18): ApiRoutes, AcceptsDuplicates, Client, SeenCall, parsePath(), shapeOf(), duplicateProblems(), envelopeProblems() (+10 more)

### Community 7 - "tape/index.ts"
Cohesion: 0.04
Nodes (84): Recorded, Failure, Variant, Link, RecordingProblem, TapeError, TapeProblem, TransformProblem (+76 more)

### Community 71 - "process.test.ts"
Cohesion: 0.10
Nodes (17): ChainCheck, ChainCheckInput, privateIntake, PublicIdentity, BlockRef, BlockSource, A149Observation, A149Startup (+9 more)

### Community 72 - "process-context.test.ts"
Cohesion: 0.09
Nodes (24): MisuseListener, RunnerBackend, ContextsClass, boundTo(), coreChainDbWrite(), coreChainStartDb(), "on-db-write"(), a74Problems() (+16 more)

### Community 74 - "crash.test.ts"
Cohesion: 0.11
Nodes (25): PointName, HeightFailure, CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob (+17 more)

### Community 77 - "core-private-source.test.ts"
Cohesion: 0.08
Nodes (10): AdmittedKey, publicNotStarted(), readPrivateCursor(), fakePublic(), fakeRead(), CORE_KEY_REGISTRY, CORE_KEY_REGISTRY_MIGRATIONS, NONE (+2 more)

### Community 78 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 8 - "UmbraError"
Cohesion: 0.04
Nodes (81): DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, DurabilityProbeOptions, DurabilityViolation (+73 more)

### Community 81 - "digest.test.ts"
Cohesion: 0.10
Nodes (26): ChangeKind, tableChanges, TouchedRow, encodeCanonical(), changeOf(), concat(), sameBytes(), sha256() (+18 more)

### Community 82 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 83 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 87 - "version-checks.ts"
Cohesion: 0.17
Nodes (15): MetadataBlock, MetadataNode, RuntimeMetadataEntry, LedgerTable, MetadataSelector, Select, Walk, OwnStateMetadata (+7 more)

### Community 88 - "private/backends.ts"
Cohesion: 0.12
Nodes (18): PrivateBackend, SessionSeen, A112Observation, Wiring, pgliteBackend(), a146HashProblems(), a146RefusalProblems(), optedOutProblems() (+10 more)

### Community 9 - "node/client.test.ts"
Cohesion: 0.03
Nodes (58): NodeClientOptions, NodeRetry, ConnectSocket, NodeSocketEvents, Answer, FakeNode, Handler, Received (+50 more)

### Community 90 - "BlockItems"
Cohesion: 0.13
Nodes (12): ItemSink, BlockItems, LateUse, EagerItems, EagerLoop, KeptItems, KeptLoop, revisionAt() (+4 more)

### Community 91 - "tx-replay-decoder.ts"
Cohesion: 0.12
Nodes (22): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+14 more)

### Community 92 - "pglite-writer.worker.ts"
Cohesion: 0.15
Nodes (18): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor() (+10 more)

### Community 94 - "pglite-server.ts"
Cohesion: 0.15
Nodes (13): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, expectNoOutsideReads(), outsideReads() (+5 more)

### Community 96 - "ledger-table-config.test.ts"
Cohesion: 0.18
Nodes (19): CountingNode, Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked() (+11 more)

### Community 110 - "address"
Cohesion: 0.12
Nodes (17): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite (+9 more)

### Community 134 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 136 - "pg"
Cohesion: 0.15
Nodes (12): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 2. Node-side query correlation (+4 more)

### Community 156 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value (+3 more)

### Community 160 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 163 - "001_chain_archive_core.ts"
Cohesion: 0.24
Nodes (9): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, Revision history, v2 — 2026-07-22, revised in response to a 3-reviewer design-council audit (Fable 5 / Opus / GPT-5.6 Sol), v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol) (+1 more)

### Community 196 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 217 - "tableRefusals"
Cohesion: 0.33
Nodes (5): tableRefusals(), 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 61 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): listen(), ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret (+23 more)

### Community 84 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.08
Nodes (24): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1** (+16 more)

### Community 95 - "boundary.test.ts"
Cohesion: 0.20
Nodes (20): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+12 more)

### Community 98 - "version"
Cohesion: 0.09
Nodes (22): version(), Requirement: CF-7 The history row and its hash, Scenario: The same entry gives the same hash, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. The freeze: build + package.json (G1) (+14 more)

### Community 105 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 108 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 109 - "Full-Chain Storage — Design"
Cohesion: 0.11
Nodes (18): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+10 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A bare numeric watermark value round-trips exactly, Scenario: A bare string watermark value round-trips exactly (+10 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 116 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 118 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 121 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 127 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+8 more)

### Community 128 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+7 more)

### Community 133 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 137 - "UmbraDB module guide"
Cohesion: 0.14
Nodes (13): Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Private modules, Reading through `db`, Start and stop heights, Stored values and digests (+5 more)

### Community 139 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.14
Nodes (14): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+6 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception (+5 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 143 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 144 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 146 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 150 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 151 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 154 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 158 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 159 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 162 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 164 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 165 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 166 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.20
Nodes (10): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+2 more)

### Community 168 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 169 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 170 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer) (+1 more)

### Community 171 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 172 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 173 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 179 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.22
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 180 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 181 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.22
Nodes (9): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 8. Test infrastructure (open decision — resolve in Task 1) (+1 more)

### Community 182 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 183 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 184 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 186 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 187 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 188 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 189 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 190 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 191 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 192 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 193 - "Security policy & threat model"
Cohesion: 0.25
Nodes (8): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 194 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 195 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 197 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 198 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 199 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.29
Nodes (5): 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

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

### Community 204 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 205 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 206 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 207 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 208 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 209 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 213 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 214 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 215 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 216 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 218 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 219 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 3. Connection factory (`src/postgres/client.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV

### Community 220 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 221 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 222 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 223 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 224 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 225 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, Why

### Community 226 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 227 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 228 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 229 - "Performance — design"
Cohesion: 0.33
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 230 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 233 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 234 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 235 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 236 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 237 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 238 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 239 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 240 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 241 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 242 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 243 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 244 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 245 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 246 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 247 - "Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data"
Cohesion: 0.40
Nodes (5): Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data, Scenario: replay from the durable cursor converges on current state, Scenario: the durable watermark is never ahead of durable data, Scenario: the invariant holds under synchronous_commit = off, Scenario: the invariant holds under synchronous_commit = on

### Community 248 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 249 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 250 - "9. Trust and refinement boundary"
Cohesion: 0.50
Nodes (4): 9. Trust and refinement boundary, Completed M1/M2/W1 claims, Deferred M2–M5 proof work, Named external obligations

### Community 251 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 252 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 253 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 254 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 255 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 256 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 257 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 261 - "Requirement: manifestHash is computed once at write time from the ordered chunk-hash sequence"
Cohesion: 0.67
Nodes (3): Requirement: manifestHash is computed once at write time from the ordered chunk-hash sequence, Scenario: Identical payloads saved as separate checkpoints report the same manifestHash, Scenario: Payloads differing only in chunk order report different manifestHash

### Community 53 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 57 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 59 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+31 more)

### Community 66 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 67 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: CheckpointSummary metadata is populated and label round-trips (+27 more)

### Community 69 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 70 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+25 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: history() computes per-manifest aggregates in a single grouped query (HP-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+22 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+22 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+19 more)

### Community 80 - "package.json"
Cohesion: 0.07
Nodes (27): bin, umbradb, bugs, url, description, engines, node, exports (+19 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 86 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: Schema isolation is the default, not opt-in (+18 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: Schema isolation is the default, not opt-in (+17 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: one storage instance is bound to exactly one wallet at construction, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract (+15 more)

### Community 97 - "README.md"
Cohesion: 0.13
Nodes (8): For historical reference only, Tasks — superseded by per-sprint openspec changes, UmbraDB v1.0.0 — Release Record (PENDING), What 1.0.0 additionally requires, What must happen before this record can be completed, Boundary enforcement, Table of contents, UmbraDB Postgres Schema Reference

### Community 99 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

## Knowledge Gaps
- **40 isolated node(s):** `RFC-8949`, `RFC-8949`, `./tsconfig.json`, `RFC-9110`, `RFC-3339` (+35 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2890 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionHistoryStorage`, `src/index.ts`, `ValidationError`, `module-tables.ts`, `runMigrations`, `db/migrate.ts`, `tape/index.ts`, `UmbraError`, `node/client.test.ts`, `node/client.ts`, `declaration.ts`, `Database`, `writer-lock-checks.ts`, `halts.test.ts`, `adapter.ts`, `PgTransactionLeaseLayer`, `runner/process.ts`, `module-api.ts`, `config-check.ts`, `db/errors.ts`, `UmbraDBSql`, `validate.test.ts`, `describeNodeStoreExports`, `child-processes.test.ts`, `snapshot.test.ts`, `serve.test.ts`, `chain-process.test.ts`, `builder.test.ts`, `admin-harness.ts`, `.read`, `column-rules.test.ts`, `loop.test.ts`, `history.test.ts`, `transform-checks.ts`, `order.property.test.ts`, `ledger/types.ts`, `plain-data.ts`, `adapter-suite.ts`, `node.test.ts`, `ref_node_path`, `ref_node_fs`, `core-block-commit.test.ts`, `dispatch.test.ts`, `cursor-table.test.ts`, `failures.ts`, `networks.ts`, `cbor.property.test.ts`, `core-settings.ts`, `api-server.test.ts`, `process.test.ts`, `process-context.test.ts`, `crash.test.ts`, `core-private-source.test.ts`, `package.json`, `digest.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `Tasks — v1.0.0-infosec-signoff`, `version-checks.ts`, `private/backends.ts`, `BlockItems`, `pglite-server.ts`, `boundary.test.ts`, `ledger-table-config.test.ts`, `ref_node_timers`, `containers.test.ts`, `height-versioned.property.test.ts`, `binding.test.ts`, `identity.ts`, `read-height.property.test.ts`, `intake.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `ws-mutual-tls.test.ts`, `cursor-table.property.test.ts`, `mutation-per-adapter.mjs`, `midnight-env — reproducible PREPROD dev environment`, `excluded-not-exported.test.ts`, `component-table.test.ts`, `history.property.test.ts`, `height-versioned.test.ts`, `vendored-ledger-files.test.ts`, `typed-config.test.ts`, `pglite.test.ts`?**
  _High betweenness centrality (0.326) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8949`, `RFC-8949`, `./tsconfig.json` to the rest of the system?**
  _40 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionHistoryStorage` be split into smaller, more focused modules?**
  _Cohesion score 0.015163757810816634 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `module-tables.ts`, `db/migrate.ts`, `checkShape`, `node/client.test.ts`, `node/client.ts`, `declaration.ts`, `Database`, `writer-lock-checks.ts`, `halts.test.ts`, `runner/process.ts`, `module-api.ts`, `config-check.ts`, `db/errors.ts`, `validate.test.ts`, `snapshot.test.ts`, `chain-process.test.ts`, `FinalizedLoop`, `admin-harness.ts`, `height-versioned.test.ts`, `.read`, `loop.test.ts`, `history.test.ts`, `config/history.ts`, `transform-checks.ts`, `ledger/types.ts`, `cbor.ts`, `plain-data.ts`, `validate.ts`, `RuntimeMetadata`, `graph.ts`, `core-block-commit.test.ts`, `dispatch.test.ts`, `cursor-table.test.ts`, `failures.ts`, `loop.ts`, `builder.ts`, `api-server.test.ts`, `process.test.ts`, `process-context.test.ts`, `core-private-source.test.ts`, `mapping.ts`, `version-checks.ts`, `pglite-writer.worker.ts`, `ledger-table-config.test.ts`, `version-table.ts`, `identity.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024654218533886583 - nodes in this community are weakly interconnected._