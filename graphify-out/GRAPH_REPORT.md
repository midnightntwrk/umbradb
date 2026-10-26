# Graph Report - UmbraDB

## Corpus Check
- 776 files · ~1,205,763 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 8301 nodes · 23113 edges · 262 communities (242 shown, 20 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 2882 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `3b1c2fd0ab8502da` (776 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- src/index.ts
- vitest
- Database
- builds.ts
- node-source.test.ts
- version-table.ts
- version.negative-control.test.ts
- TapeNode
- tx-replay-decoder.ts
- ledger/metadata.ts
- graph.test.ts
- runner/process.ts
- ChainArchiveStore
- validation.ts
- height
- What changes — the 1.0.0 gate items this change addresses
- NodeClient
- binding.test.ts
- digest.test.ts
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- determinism-checks.ts
- 3. Proof-blocking findings
- createClient
- validation.test.ts
- read-height.property.test.ts
- builder.test.ts
- plain-data.test.ts
- module-api.test.ts
- checkShape
- chain-archive-rollover.ts
- node/client.test.ts
- plain-data.ts
- no-indexer-or-wallet-sdk.test.ts
- TransactionHandle
- ingest-crash.worker.ts
- node.ts
- type-check.ts
- ProcessItems
- postgres-image.test.ts
- ValidationError
- intake.test.ts
- interfaces/temporal-kv.ts
- a114Run
- PgTransactionHistoryStorage
- ReadHandle
- mutation-evidence.d.mts
- vendored-ledger-files.test.ts
- declaration.ts
- adapter.ts
- config-check.ts
- loop.test.ts
- ingest-crash.test.ts
- tape/index.ts
- chain-process.test.ts
- runMigrations
- describeNodeStoreExports
- UmbraError
- loop.ts
- module-api.ts
- NodeBlockSource
- roles.ts
- FinalizedLoop
- harness.ts
- writer-lock-checks.ts
- snapshot.test.ts
- cbor.ts
- zero-timeouts-checks.ts
- postgres/transaction-history-storage.ts
- boundary.test.ts
- child-processes.test.ts
- column-rules.test.ts
- adapter-suite.ts
- column-rules.ts
- ref_node_fs
- entries.ts
- validate.test.ts
- column-refusals.test.ts
- admin-harness.ts
- history.test.ts
- config/history.ts
- mapping.ts
- postgres/chain-archive-store.ts
- ledger/types.ts
- graph.ts
- catalog.ts
- core-settings.ts
- replay-check.ts
- core-block-fetch/metadata.ts
- InMemoryBlockSource
- LedgerPackage
- core-block-commit.test.ts
- order.property.test.ts
- postgres/transaction-lease.ts
- history-startup.ts
- redact.ts
- cursor-durability.crash.test.ts
- validate.ts
- checks.test.ts
- api-server.test.ts
- post-block-update-checks.ts
- networks.ts
- .show
- cbor.property.test.ts
- module-tables.ts
- db/migrate.ts
- core-private-source.ts
- core-private-source.test.ts
- process-context.test.ts
- version-checks.ts
- height-versioned.property.test.ts
- db/backends.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- block-fetch-decode.test.ts
- loop-harness.ts
- private/backends.ts
- ws-mutual-tls.test.ts
- table
- version
- T
- Design — Sprint 1: project setup + TemporalKV
- Storage Algebra Lean M3a Watermarks Sprint
- .boolean
- integer
- mutation-per-adapter.mjs
- history.property.test.ts
- pack-install.mjs
- orphan-watcher.mjs
- fresh-instance.mjs
- Requirement: CF-4 Every field is data, operational or secret
- Requirement: DT-4 Per-block changes of every module table
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- graph.py
- Tasks — v1.0.0-infosec-signoff
- address
- Full-Chain Storage — Design
- ROADMAP.md
- Requirements
- package.json
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- ADDED Requirements
- Design — Postgres+JSONB storage rebuild
- Storage Algebra Lean Formalization — Approved Design and Status
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- scripts
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB V1.0.0 Implementation Guideline
- devDependencies
- README.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Roadmap
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Performance — design
- compilerOptions
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Requirement: DT-6 Stored data avoids non-deterministic values
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
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- conformance-gate.mjs
- Contributing
- Algebraic Specification of the midnight-pg-store Storage Layer
- Security policy & threat model
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Our Pledge
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Global Constraints
- 12. Milestone status
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
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
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00023 — The blocks table's height partitions end at 5,000,000
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — v1.0.0 API Surface & Release Contract
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
- repository
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bugs
- engines
- oracle/run.sh
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
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

## Communities (262 total, 20 thin omitted)

### Community 0 - "src/index.ts"
Cohesion: 0.02
Nodes (202): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError, ChunkMissingError (+194 more)

### Community 1 - "vitest"
Cohesion: 0.02
Nodes (149): WatermarkKey, WatermarkKind, WatermarkValue, AggregateRow, ChunkJoinRow, ManifestRow, PgCheckpointStore, UmbraDBSql (+141 more)

### Community 10 - "Database"
Cohesion: 0.04
Nodes (93): Database, ReadOnlyDatabase, SchemaPlan, Committed, Chain, ChainOptions, DigestRow, Op (+85 more)

### Community 100 - "builds.ts"
Cohesion: 0.15
Nodes (20): PrivateRefusal, PublicCore, directPublic(), genesisBlock(), genesisHex(), launchPrivate(), poll(), privateCoreEntry() (+12 more)

### Community 101 - "node-source.test.ts"
Cohesion: 0.12
Nodes (10): Fetching, Opened, Recorder, open(), quiet(), NEW_HEADS, chain, extra (+2 more)

### Community 102 - "version-table.ts"
Cohesion: 0.15
Nodes (23): LedgerName, VerifyLedgerPackagesOptions, ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed() (+15 more)

### Community 104 - "version.negative-control.test.ts"
Cohesion: 0.16
Nodes (18): LedgerSource, ManifestLine, Select, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+10 more)

### Community 105 - "TapeNode"
Cohesion: 0.15
Nodes (6): TapeClock, TapeNode, SessionPlan, quietConnect(), withNode(), SYSTEM_CLOCK

### Community 107 - "tx-replay-decoder.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+12 more)

### Community 108 - "ledger/metadata.ts"
Cohesion: 0.15
Nodes (7): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, contentStateOf(), hexOf()

### Community 109 - "graph.test.ts"
Cohesion: 0.13
Nodes (19): GraphInput, HeightRange, PastFaultCase, RefusalCase, backboneWithout(), range(), ids(), orders() (+11 more)

### Community 11 - "runner/process.ts"
Cohesion: 0.04
Nodes (72): BlockHeaderItem, BodyExtrinsic, BlockBody, BlockItemSource, CoreBlockHeader, Bound, ChainCheck, ChainCheckInput (+64 more)

### Community 110 - "ChainArchiveStore"
Cohesion: 0.10
Nodes (8): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, 6. Known limitations, Boundary enforcement, Table of contents, UmbraDB Postgres Schema Reference

### Community 114 - "validation.ts"
Cohesion: 0.10
Nodes (20): PlacedDeclaration, Plain, FIELD_KINDS, LIFETIMES, TABLE_KINDS, badId, DECLARATION_PROPERTIES, duplicateId (+12 more)

### Community 115 - "height"
Cohesion: 0.12
Nodes (18): Broken, height(), 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy (+10 more)

### Community 116 - "What changes — the 1.0.0 gate items this change addresses"
Cohesion: 0.21
Nodes (13): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+5 more)

### Community 12 - "NodeClient"
Cohesion: 0.05
Nodes (62): CoreChainBinding, Connection, HeadSubscriber, NodeCallOptions, NodeClient, NodeClientOptions, Pending, State (+54 more)

### Community 121 - "binding.test.ts"
Cohesion: 0.14
Nodes (13): TestDatabase, A113Observation, Binding, Outcome, privateCursorHeight(), a113Run(), against(), bindingIn() (+5 more)

### Community 122 - "digest.test.ts"
Cohesion: 0.14
Nodes (17): ChangeKind, tableChanges, TouchedRow, encodeCanonical(), changeOf(), concat(), sameBytes(), DIGEST_BYTES (+9 more)

### Community 124 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.11
Nodes (17): Hash, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence) (+9 more)

### Community 127 - "determinism-checks.ts"
Cohesion: 0.20
Nodes (16): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, PRIVATE_ROWS_SQL(), privateModule(), a146Hashes(), a146Refusals() (+8 more)

### Community 129 - "3. Proof-blocking findings"
Cohesion: 0.11
Nodes (18): Absent, n(), 1. TemporalKV — event-sourced right action with a CAS guard, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant (+10 more)

### Community 13 - "createClient"
Cohesion: 0.04
Nodes (66): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Started, FailsOnceStarted, SlowToReportPorts, SourceFile, SqliteTxRow (+58 more)

### Community 131 - "validation.test.ts"
Cohesion: 0.14
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 136 - "read-height.property.test.ts"
Cohesion: 0.17
Nodes (11): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+3 more)

### Community 14 - "builder.test.ts"
Cohesion: 0.04
Nodes (48): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step, Frame (+40 more)

### Community 143 - "plain-data.test.ts"
Cohesion: 0.16
Nodes (9): Row, plainDataWith(), failures(), refusal(), thrown(), valueOf(), A26, files (+1 more)

### Community 144 - "module-api.test.ts"
Cohesion: 0.14
Nodes (11): ApiRequest, Shaped, bodyOf(), errorOf(), ok(), "on-start-api"(), API_ERROR_STATUS, BACKBONE_PUBLISHING (+3 more)

### Community 147 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 149 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 15 - "node/client.test.ts"
Cohesion: 0.03
Nodes (47): NodeRetry, Answer, FakeNode, Handler, Received, recorded, ManualTimers, connectWebSocket() (+39 more)

### Community 155 - "plain-data.ts"
Cohesion: 0.24
Nodes (12): PlainArray, PlainDataNode, PlainDataRule, Walk, copyArray(), copyObject(), instanceOf(), isElementKey() (+4 more)

### Community 157 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 16 - "TransactionHandle"
Cohesion: 0.03
Nodes (80): TransactionHistoryReader, TransactionHistoryWriter, TransactionHandle, TransactionHandleInvalidError, TransactionLeaseLayer, contendOnce(), coerceToSafeNumber(), sha256() (+72 more)

### Community 169 - "ingest-crash.worker.ts"
Cohesion: 0.24
Nodes (9): CrashEvent, CrashJob, nodeSourceOf(), report(), tipWriter(), handle, job, orphanGuard (+1 more)

### Community 17 - "node.ts"
Cohesion: 0.05
Nodes (65): Recorded, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest, RequestId, Json (+57 more)

### Community 177 - "type-check.ts"
Cohesion: 0.33
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 179 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 18 - "ValidationError"
Cohesion: 0.03
Nodes (88): ValidationError, assertValidCheckpointIds(), validateHistoryOptions(), validateSaveOptions(), runUnSnapshottedReadUnderPrune(), invoke(), 0. Package layout, 1. Chunking (+80 more)

### Community 180 - "intake.test.ts"
Cohesion: 0.44
Nodes (9): PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), heights(), readProblems(), rowProblems() (+1 more)

### Community 19 - "interfaces/temporal-kv.ts"
Cohesion: 0.04
Nodes (73): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, AsOf, AssertExact, Key, Namespace (+65 more)

### Community 2 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (182): TransactionHistoryStorage, PgTransactionHistoryStorage, CheckpointStore, TemporalKV, Watermarks, decode(), encode(), saveAndAdvance() (+174 more)

### Community 20 - "ReadHandle"
Cohesion: 0.04
Nodes (49): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, Migration (+41 more)

### Community 205 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 206 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 21 - "declaration.ts"
Cohesion: 0.04
Nodes (59): QueuedBlock, OwnPart, BlockContext, DefinedModule, FieldKind, FieldSchema, ItemDeclaration, ItemSink (+51 more)

### Community 22 - "adapter.ts"
Cohesion: 0.04
Nodes (60): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+52 more)

### Community 23 - "config-check.ts"
Cohesion: 0.05
Nodes (62): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, StepName, StepReport (+54 more)

### Community 24 - "loop.test.ts"
Cohesion: 0.04
Nodes (65): PointArguments, CallEvent, Contexts, FailingAfter, Given, Lost, Seen, Shifted (+57 more)

### Community 25 - "ingest-crash.test.ts"
Cohesion: 0.07
Nodes (66): BlockHeader, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded, FetchSeen (+58 more)

### Community 26 - "tape/index.ts"
Cohesion: 0.07
Nodes (53): Failure, Variant, TransformError, CallRecord, recordKind, SubscriptionId, Entry, CallSelection (+45 more)

### Community 27 - "chain-process.test.ts"
Cohesion: 0.04
Nodes (52): BlockRef, InMemoryItems, InMemorySourceOptions, Wait, LoopObserver, StandInOptions, Job, WorkerEvent (+44 more)

### Community 28 - "runMigrations"
Cohesion: 0.03
Nodes (74): UmbraDBConnectionOptions, runMigrations(), migrations(), 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 3. `synchronous_commit` — probe-warned, never refused, 4. Session-mode connection pooling only — probe-enforced (best-effort), 5. Server-side timeouts — applied by `createClient` (documented) (+66 more)

### Community 29 - "describeNodeStoreExports"
Cohesion: 0.07
Nodes (51): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+43 more)

### Community 3 - "UmbraError"
Cohesion: 0.03
Nodes (98): ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, ReadOptions, DurabilityProbeOptions, DurabilityViolation (+90 more)

### Community 30 - "loop.ts"
Cohesion: 0.06
Nodes (50): ProcessContext, ResolvedGraph, ResolvedRange, LateUse, Callback, CallbackFailure, EntryBoundary, ParallelPoint (+42 more)

### Community 31 - "module-api.ts"
Cohesion: 0.05
Nodes (52): Connection, ModuleApiServerOptions, ModuleApiStart, StartedModuleApi, ChainDataAnswer, ChainDataView, ApiError, ApiErrorCode (+44 more)

### Community 32 - "NodeBlockSource"
Cohesion: 0.08
Nodes (22): CoreBlockItems, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeSubscription, NodeBlock, NodeHeader (+14 more)

### Community 33 - "roles.ts"
Cohesion: 0.05
Nodes (53): MigrationPart, Difference, PlannedSchema, Provision, QualifiedTable, SchemaItem, SchemaMigration, SchemaModule (+45 more)

### Community 34 - "FinalizedLoop"
Cohesion: 0.07
Nodes (18): FinalizedLoop, HeightRun, Startup, SkipsAfterReconnect, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, SilentHalt (+10 more)

### Community 35 - "harness.ts"
Cohesion: 0.09
Nodes (46): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+38 more)

### Community 36 - "writer-lock-checks.ts"
Cohesion: 0.08
Nodes (43): WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), blocksIn(), cleanUp() (+35 more)

### Community 37 - "snapshot.test.ts"
Cohesion: 0.08
Nodes (27): ProcessAdmin, ProcessAdminOptions, AdminServer, AdminStarter, SnapshotFacts, ConfigSnapshot, Process, errorMessage() (+19 more)

### Community 38 - "cbor.ts"
Cohesion: 0.08
Nodes (46): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+38 more)

### Community 39 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (34): Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead(), engine() (+26 more)

### Community 4 - "postgres/transaction-history-storage.ts"
Cohesion: 0.03
Nodes (103): EntryContent, EntryLifecycle, MergeEntriesFn, TransactionHistoryEntry, TransactionHistoryStatus, JsonEncoded, StoredEntryJson, TxHistoryRow (+95 more)

### Community 40 - "boundary.test.ts"
Cohesion: 0.08
Nodes (44): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+36 more)

### Community 41 - "child-processes.test.ts"
Cohesion: 0.06
Nodes (42): SignalTarget, ParentJob, Kill, Orphaned, SourceFile, LockResult, terminationSignal(), heldPort() (+34 more)

### Community 42 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (33): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+25 more)

### Community 43 - "adapter-suite.ts"
Cohesion: 0.11
Nodes (47): Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerHost, expectNoV8Logs(), expectRecordedRelease() (+39 more)

### Community 44 - "column-rules.ts"
Cohesion: 0.05
Nodes (51): ModuleTableOptions, AllowedRule, DesignRow, PlacedRefusal, RefusalOptions, RefusedRule, RelationFacts, RuleBase (+43 more)

### Community 45 - "ref_node_fs"
Cohesion: 0.06
Nodes (26): LoadOptions, Lockfile, Manifest, GuardViolation, ReportedTest, invalid(), isFile(), loadConfig() (+18 more)

### Community 47 - "entries.ts"
Cohesion: 0.05
Nodes (45): CoreLedgerVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder, EntryConfig (+37 more)

### Community 48 - "validate.test.ts"
Cohesion: 0.06
Nodes (40): coreEntry, EntryRef, Finding, CursorRow, Expected, defineModule(), checked(), checked() (+32 more)

### Community 49 - "column-refusals.test.ts"
Cohesion: 0.08
Nodes (28): ModuleTable, ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, Case, freshDatabase() (+20 more)

### Community 5 - "admin-harness.ts"
Cohesion: 0.03
Nodes (88): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminStartOptions, AdminAnswer, AdminEndpoint (+80 more)

### Community 50 - "history.test.ts"
Cohesion: 0.07
Nodes (42): versionEntry, HistoryFinding, Simulation, Start, Case, builtWith100(), m(), recorded() (+34 more)

### Community 51 - "config/history.ts"
Cohesion: 0.09
Nodes (42): CoreVersion, HistoryCode, HistoryContext, Span, CheckedEntry, PlacedEntry, StartedProcess, UpgradeEntry (+34 more)

### Community 52 - "mapping.ts"
Cohesion: 0.07
Nodes (32): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+24 more)

### Community 53 - "postgres/chain-archive-store.ts"
Cohesion: 0.10
Nodes (27): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+19 more)

### Community 54 - "ledger/types.ts"
Cohesion: 0.10
Nodes (30): LedgerReleasePackage, ApplyInput, ApplyOutput, ChainOutcome, LedgerEvent, LedgerPackageOptions, LedgerTask, LogItem (+22 more)

### Community 55 - "graph.ts"
Cohesion: 0.07
Nodes (44): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+36 more)

### Community 56 - "catalog.ts"
Cohesion: 0.07
Nodes (43): CatalogColumn, CatalogOptions, CatalogTable, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+35 more)

### Community 57 - "core-settings.ts"
Cohesion: 0.06
Nodes (39): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+31 more)

### Community 58 - "replay-check.ts"
Cohesion: 0.08
Nodes (28): Link, TapeBuilder, TapeBuilderOptions, TapeCommandIo, RecordingError, SessionEnd, ConnectionFrames, RecordAndReplayOptions (+20 more)

### Community 59 - "core-block-fetch/metadata.ts"
Cohesion: 0.13
Nodes (26): ExtrinsicCall, MetadataField, MetadataPallet, MetadataType, MetadataVariant, Primitive, RuntimeMetadataView, TypeDef (+18 more)

### Community 6 - "InMemoryBlockSource"
Cohesion: 0.04
Nodes (88): HistoryOptions, InMemoryBlockSource, ProcessHandle, ProcessingEnd, ProcessStatus, A43Observation, Outcome, ProcessDatabase (+80 more)

### Community 62 - "LedgerPackage"
Cohesion: 0.06
Nodes (23): LedgerEventKind, LedgerPackage, 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix, 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence (+15 more)

### Community 63 - "core-block-commit.test.ts"
Cohesion: 0.08
Nodes (29): Commit, blockHeaderOf(), checkParent(), commitBlock(), cursorHeight(), hex(), ledgerVersionOf(), readCursor() (+21 more)

### Community 64 - "order.property.test.ts"
Cohesion: 0.08
Nodes (37): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, dispatch(), isParallelPoint(), runSchedule() (+29 more)

### Community 65 - "postgres/transaction-lease.ts"
Cohesion: 0.08
Nodes (33): Lease, LeaseAcquireOptions, HeldLease, abortError(), withAbort(), raceAgainstAbort(), reserveBounded(), resetStatementTimeout() (+25 more)

### Community 66 - "history-startup.ts"
Cohesion: 0.10
Nodes (34): HistoryCheck, HistoryInput, HistoryRule, plainData, AppliedMigration, EntryRange, Holder, Started (+26 more)

### Community 69 - "redact.ts"
Cohesion: 0.10
Nodes (31): RevisionSettings, SanitizedError, StatusSnapshot, ConfigCheckSeams, HistoryRow, PlainObject, RedactableConfig, RedactionForms (+23 more)

### Community 7 - "cursor-durability.crash.test.ts"
Cohesion: 0.03
Nodes (109): JsonValue, KvRow, BatchSpec, CurrentState, InvariantResult, C5AnyFn, CurrentState, CurrentState (+101 more)

### Community 70 - "validate.ts"
Cohesion: 0.10
Nodes (36): ConfigRule, CursorRule, Finding, Issue, Plain, SettingsSchema, coreSettingsSchema(), closest() (+28 more)

### Community 71 - "checks.test.ts"
Cohesion: 0.07
Nodes (24): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, createCheckFunctions() (+16 more)

### Community 72 - "api-server.test.ts"
Cohesion: 0.08
Nodes (20): ApiRegistry, ModuleApiServer, ApiRoutes, AcceptsDuplicates, Client, parsePath(), shapeOf(), duplicateProblems() (+12 more)

### Community 75 - "post-block-update-checks.ts"
Cohesion: 0.11
Nodes (32): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+24 more)

### Community 76 - "networks.ts"
Cohesion: 0.07
Nodes (34): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+26 more)

### Community 77 - ".show"
Cohesion: 0.07
Nodes (22): AllowedDetail, schemaName(), module(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 78 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 79 - "module-tables.ts"
Cohesion: 0.11
Nodes (23): CaptureColumn, ModuleColumn, ModuleContentsError, PageOptions, ColumnType, RefusalCode, RefusalPlace, contentsHash() (+15 more)

### Community 8 - "db/migrate.ts"
Cohesion: 0.04
Nodes (92): SchemaWriteHandle, Transaction, CapturedTable, CaptureState, AppliedRow, Runnable, Settling, StartupInput (+84 more)

### Community 80 - "core-private-source.ts"
Cohesion: 0.11
Nodes (21): PrivateBlockSource, privateIntake, PrivateIntakeOptions, PublicDatabase, PublicIdentity, PublicWakes, PrivateOptions, PrivateProcess (+13 more)

### Community 83 - "core-private-source.test.ts"
Cohesion: 0.09
Nodes (10): AdmittedKey, privateBackbone(), fakePublic(), fakeRead(), identity(), CORE_KEY_REGISTRY, CORE_KEY_REGISTRY_MIGRATIONS, NONE (+2 more)

### Community 84 - "process-context.test.ts"
Cohesion: 0.09
Nodes (22): MisuseListener, PublishRefusal, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass, a74Problems(), consumer() (+14 more)

### Community 86 - "version-checks.ts"
Cohesion: 0.17
Nodes (22): CountingNode, MetadataSelector, Walk, Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts() (+14 more)

### Community 88 - "height-versioned.property.test.ts"
Cohesion: 0.13
Nodes (20): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Key, Model (+12 more)

### Community 9 - "db/backends.ts"
Cohesion: 0.03
Nodes (69): ReadPool, CliBackend, Snapshot, Settings, TestBackend, Case, LoadOutcome, OutsideRead (+61 more)

### Community 90 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 91 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 94 - "block-fetch-decode.test.ts"
Cohesion: 0.14
Nodes (22): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+14 more)

### Community 95 - "loop-harness.ts"
Cohesion: 0.11
Nodes (21): WaitingInRead, LoopClass, RunnerDatabase, SeenCall, Started, blockFetchStandIn(), openWhileWaiting(), waitAndResume() (+13 more)

### Community 96 - "private/backends.ts"
Cohesion: 0.12
Nodes (18): PrivateBackend, SessionSeen, A112Observation, Wiring, pgliteBackend(), a146HashProblems(), a146RefusalProblems(), optedOutProblems() (+10 more)

### Community 99 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 67 - "table"
Cohesion: 0.05
Nodes (37): table(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, Blocks from the node, Cursor tables, Data that is not a function of the chain (+29 more)

### Community 111 - "version"
Cohesion: 0.10
Nodes (19): version(), Requirement: CF-7 The history row and its hash, Scenario: The same entry gives the same hash, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`) (+11 more)

### Community 118 - "T"
Cohesion: 0.12
Nodes (19): T(), input(), 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state (+11 more)

### Community 137 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.13
Nodes (14): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 0. Schema naming, now that UmbraDB is standalone (+6 more)

### Community 139 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.12
Nodes (14): some(), Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix (+6 more)

### Community 141 - ".boolean"
Cohesion: 0.14
Nodes (14): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Map key order (+6 more)

### Community 142 - "integer"
Cohesion: 0.12
Nodes (14): integer(), Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first), G14 — benchmark harness + recorded baseline, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Scenario: The history aggregate reads size_bytes, not octet_length(data), Scenario: The size_bytes column exists and equals the payload length (+6 more)

### Community 146 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 166 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 170 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 218 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 233 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 240 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.50
Nodes (4): listen(), Requirement: CF-4 Every field is data, operational or secret, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases

### Community 241 - "Requirement: DT-4 Per-block changes of every module table"
Cohesion: 0.50
Nodes (4): insert(), Requirement: DT-4 Per-block changes of every module table, Scenario: Insert then update in one block, Scenario: Rewriting the same value

### Community 46 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.05
Nodes (48): halted(), cursorRead(), following(), When a callback fails, 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes (+40 more)

### Community 60 - "ADDED Requirements"
Cohesion: 0.05
Nodes (42): fakePackage(), regular(), system(), 10. Tables, Requirement: CD-5 `core-block-parsed` parses each block once, Scenario: A system transaction between regular ones, ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread (+34 more)

### Community 73 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 92 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.08
Nodes (24): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1** (+16 more)

### Community 97 - "address"
Cohesion: 0.09
Nodes (23): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md` (+15 more)

### Community 103 - "Full-Chain Storage — Design"
Cohesion: 0.09
Nodes (22): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+14 more)

### Community 106 - "ROADMAP.md"
Cohesion: 0.09
Nodes (16): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+8 more)

### Community 112 - "Requirements"
Cohesion: 0.10
Nodes (20): Purpose, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Schema isolation is the default, not opt-in, Requirement: Unconditional writes are gapless and monotonic (Law T1), Requirements (+12 more)

### Community 113 - "package.json"
Cohesion: 0.10
Nodes (20): bin, umbradb, description, exports, files, homepage, license, main (+12 more)

### Community 117 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Schema isolation is the default, not opt-in, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A custom schema is honored end to end (+11 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 123 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A bare numeric watermark value round-trips exactly, Scenario: A bare string watermark value round-trips exactly (+10 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 128 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.11
Nodes (14): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+6 more)

### Community 130 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.11
Nodes (18): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+10 more)

### Community 132 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 133 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 135 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 138 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.12
Nodes (14): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`), Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`) (+6 more)

### Community 140 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+8 more)

### Community 145 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 148 - "README.md"
Cohesion: 0.24
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 150 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+5 more)

### Community 153 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 154 - "Roadmap"
Cohesion: 0.14
Nodes (14): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`) (+6 more)

### Community 156 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 159 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.15
Nodes (12): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover) (+4 more)

### Community 160 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 162 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 163 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 164 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 165 - "Performance — design"
Cohesion: 0.15
Nodes (10): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design, Decision: GC architecture, Decision: query tracing (+2 more)

### Community 167 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 168 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 171 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 172 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 173 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 174 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 175 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 176 - "UmbraDB"
Cohesion: 0.20
Nodes (10): Contents, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB, Verification: what is proved, checked, and tested (+2 more)

### Community 181 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 182 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 183 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 184 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 185 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
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

### Community 189 - "conformance-gate.mjs"
Cohesion: 0.22
Nodes (8): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli

### Community 190 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 191 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.25
Nodes (6): Superseded — see `Formal/STORAGE_ALGEBRA.md`, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 192 - "Security policy & threat model"
Cohesion: 0.25
Nodes (8): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 193 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 194 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 196 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 197 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 198 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 199 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 200 - "Global Constraints"
Cohesion: 0.29
Nodes (6): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 201 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 202 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 203 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 204 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

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

### Community 216 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 217 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 219 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 220 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 221 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 222 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 223 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 224 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 225 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 226 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 227 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 228 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 229 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 230 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 231 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, Why

### Community 232 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 234 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 235 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 236 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 237 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 238 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 239 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 242 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 243 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 246 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 61 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 68 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+29 more)

### Community 81 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.07
Nodes (30): ADDED Requirements, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form, Requirement: G9/T3 — a killed lease-holder does not wedge the lease, Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data (+22 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+19 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0, Requirement: the baseline reflects the batched (shipped) save shape (+17 more)

## Knowledge Gaps
- **42 isolated node(s):** `RFC-8259`, `RFC-8949`, `RFC-8949`, `RFC-8949`, `@stryker-mutator/core` (+37 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2947 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `src/index.ts`, `UmbraError`, `postgres/transaction-history-storage.ts`, `admin-harness.ts`, `InMemoryBlockSource`, `cursor-durability.crash.test.ts`, `db/migrate.ts`, `db/backends.ts`, `Database`, `runner/process.ts`, `NodeClient`, `createClient`, `builder.test.ts`, `node/client.test.ts`, `node.ts`, `interfaces/temporal-kv.ts`, `ReadHandle`, `declaration.ts`, `adapter.ts`, `config-check.ts`, `loop.test.ts`, `ingest-crash.test.ts`, `tape/index.ts`, `chain-process.test.ts`, `describeNodeStoreExports`, `loop.ts`, `roles.ts`, `writer-lock-checks.ts`, `snapshot.test.ts`, `zero-timeouts-checks.ts`, `boundary.test.ts`, `child-processes.test.ts`, `column-rules.test.ts`, `adapter-suite.ts`, `ref_node_fs`, `entries.ts`, `validate.test.ts`, `column-refusals.test.ts`, `history.test.ts`, `mapping.ts`, `ledger/types.ts`, `core-settings.ts`, `core-block-fetch/metadata.ts`, `core-block-commit.test.ts`, `order.property.test.ts`, `history-startup.ts`, `redact.ts`, `checks.test.ts`, `api-server.test.ts`, `post-block-update-checks.ts`, `networks.ts`, `cbor.property.test.ts`, `core-private-source.test.ts`, `process-context.test.ts`, `version-checks.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `Tasks — v1.0.0-infosec-signoff`, `block-fetch-decode.test.ts`, `loop-harness.ts`, `private/backends.ts`, `ws-mutual-tls.test.ts`, `node-source.test.ts`, `version.negative-control.test.ts`, `graph.test.ts`, `package.json`, `What changes — the 1.0.0 gate items this change addresses`, `binding.test.ts`, `digest.test.ts`, `validation.test.ts`, `read-height.property.test.ts`, `plain-data.test.ts`, `module-api.test.ts`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `excluded-not-exported.test.ts`, `history.property.test.ts`, `postgres-image.test.ts`, `intake.test.ts`, `vendored-ledger-files.test.ts`?**
  _High betweenness centrality (0.306) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8259`, `RFC-8949`, `RFC-8949` to the rest of the system?**
  _42 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02498271946282216 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `validation.test.ts`, `admin-harness.ts`, `InMemoryBlockSource`, `db/migrate.ts`, `db/backends.ts`, `Database`, `runner/process.ts`, `NodeClient`, `node/client.test.ts`, `plain-data.test.ts`, `module-api.test.ts`, `checkShape`, `ReadHandle`, `declaration.ts`, `config-check.ts`, `loop.test.ts`, `tape/index.ts`, `plain-data.ts`, `chain-process.test.ts`, `loop.ts`, `module-api.ts`, `NodeBlockSource`, `roles.ts`, `FinalizedLoop`, `writer-lock-checks.ts`, `snapshot.test.ts`, `cbor.ts`, `zero-timeouts-checks.ts`, `ingest-crash.worker.ts`, `ref_node_fs`, `Acceptance — CORE-ARCH: the standalone indexer's core architecture`, `entries.ts`, `validate.test.ts`, `history.test.ts`, `config/history.ts`, `mapping.ts`, `ledger/types.ts`, `graph.ts`, `catalog.ts`, `core-settings.ts`, `replay-check.ts`, `core-block-commit.test.ts`, `history-startup.ts`, `validate.ts`, `checks.test.ts`, `api-server.test.ts`, `module-tables.ts`, `core-private-source.ts`, `core-private-source.test.ts`, `process-context.test.ts`, `version-checks.ts`, `node-source.test.ts`, `version-table.ts`, `version.negative-control.test.ts`, `ledger/metadata.ts`, `graph.test.ts`, `validation.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.019957097985137517 - nodes in this community are weakly interconnected._