# Graph Report - UmbraDB

## Corpus Check
- 777 files · ~1,210,905 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 8316 nodes · 23171 edges · 273 communities (250 shown, 23 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 2888 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `a3faa196827530de` (777 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- Database
- PgTransactionLeaseLayer
- api-server.test.ts
- ledger/metadata.ts
- version.negative-control.test.ts
- determinism-checks.ts
- digest.test.ts
- version-table.ts
- builds.ts
- height
- tape/index.ts
- transaction-history-storage.property.test.ts
- height-versioned.property.test.ts
- separation.test.ts
- writer-lock-checks.ts
- intake.test.ts
- read-height.property.test.ts
- ws-mutual-tls.test.ts
- declaration.ts
- postgres/transaction-history-storage.ts
- TapeBuilder
- source-scan.ts
- vitest
- chain-archive-rollover.ts
- RawClient
- 3. Proof-blocking findings
- deterministic-postgresql/index.ts
- MergeEntriesFn
- no-indexer-or-wallet-sdk.test.ts
- ChainArchiveStore
- component-table.test.ts
- TransactionHandle
- ingest-crash.test.ts
- type-check.ts
- Model
- runner/process.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- postgres/transaction-lease.ts
- StorageError
- ValidationError
- a114Run
- ref_node_fs
- ReadPool
- mutation-evidence.d.mts
- history.test.ts
- adapter.ts
- admin-harness.ts
- translatePostgresError
- gate
- CliBackend
- config-check.ts
- node/client.test.ts
- snapshot.test.ts
- describeNodeStoreExports
- db/errors.ts
- core-private-source.test.ts
- module-api.test.ts
- column-rules.ts
- loop.test.ts
- process-context.test.ts
- loop.ts
- FinalizedLoop
- child-processes.test.ts
- NodeBlockSource
- transform-checks.ts
- test/postgres/setup.ts
- harness.ts
- node/client.ts
- adapter-suite.ts
- config/history.ts
- column-rules.test.ts
- format.test.ts
- PgTransactionHistoryStorage
- validation.ts
- ModuleDeclaration
- NodeClient
- UmbraError
- cbor.ts
- halts.test.ts
- node.test.ts
- storage-errors.ts
- LedgerPackage
- admin/types.ts
- builder.test.ts
- graph.ts
- validate.ts
- post-block-update-checks.ts
- runMigrations
- chain-process.test.ts
- core-block-fetch/metadata.ts
- core-settings.ts
- ledger/types.ts
- plain-data.ts
- networks.ts
- .show
- opt-out.test.ts
- cbor.property.test.ts
- order.property.test.ts
- entries.ts
- crash.test.ts
- mapping.ts
- pg-tx-history-adapter.ts
- interfaces/temporal-kv.ts
- version-checks.ts
- TransactionHistoryEntry
- checks.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- block-fetch-decode.test.ts
- Process
- src/index.ts
- cold-boot-recovery.integration.test.ts
- tx-replay-decoder.ts
- BlockRef
- Problem
- boundary.test.ts
- version
- Design — Postgres+JSONB storage rebuild
- connectWebSocket
- Storage Algebra Lean M3a Watermarks Sprint
- integer
- .refused
- Design — Sprint 7: Transaction History Storage
- mutation-per-adapter.mjs
- facade-merge-loader.ts
- scoped-review-manifest
- midnight-env — reproducible PREPROD dev environment
- 001_chain_archive_core.ts
- failingSource
- a113Run
- orphan-watcher.mjs
- read-only-checks.ts
- fresh-instance.mjs
- graph.py
- address
- Tasks — v1.0.0-infosec-signoff
- .getAll
- Requirement: DT-6 Stored data avoids non-deterministic values
- ADDED Requirements
- README.md
- UmbraDB third-party component inventory (SBOM)
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- Storage Algebra Lean Formalization — Approved Design and Status
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 Implementation Guideline
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- devDependencies
- UmbraDB module guide
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Roadmap
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- compilerOptions
- Full-Chain Storage — Design
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- compilerOptions
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Design — v1.1.0: Quint model checking
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- ADDED Requirements
- Design — v1.0.0-perf-baseline
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- 3. Live-node/indexer confirmation
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- UmbraDB 0.9.5 "Penumbra"
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Design — CORE-ARCH: the standalone indexer's core architecture
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- Repository agent policy
- Our Pledge
- Algebraic Specification of the midnight-pg-store Storage Layer
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Global Constraints
- 12. Milestone status
- 5. Recommended candidate model
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
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
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00023 — The blocks table's height partitions end at 5,000,000
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Requirement: RN-16 Chain-data reads name their view and height
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- Requirement: RN-5 The block context carries one height's items
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
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
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
- `2.1 Historical implementation baseline` --references--> `PgTemporalKV`  [INFERRED]
  Formal/STORAGE_ALGEBRA_LEAN_RESEARCH.md → src/postgres/temporal-kv.ts
- `Scenario: A chunk whose stored content no longer matches its recorded hash is rejected` --references--> `ChunkIntegrityError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts
- `The honest-test pattern (what makes each required test non-vacuous)` --references--> `ChunkMissingError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/checkpoint-store.ts
- `Scenario: A manifest referencing a chunk absent from storage is rejected` --references--> `ChunkMissingError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts
- `CheckpointStore: content-addressed snapshots` --references--> `ManifestCorruptError`  [INFERRED]
  README.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (273 total, 23 thin omitted)

### Community 0 - "Database"
Cohesion: 0.02
Nodes (123): BlockWriteHandle, Database, ReadHandle, OwnPart, SchemaPlan, cursorTable, CursorTableOptions, CursorValue (+115 more)

### Community 1 - "PgTransactionLeaseLayer"
Cohesion: 0.02
Nodes (118): PgCheckpointStore, UmbraDBSql, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, CoTxCallable, CoTxPauseInfo, CrashHook (+110 more)

### Community 10 - "api-server.test.ts"
Cohesion: 0.03
Nodes (76): ApiRegistry, Connection, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, StartedModuleApi, ChainDataAnswer, ApiError (+68 more)

### Community 100 - "ledger/metadata.ts"
Cohesion: 0.14
Nodes (9): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, MetadataSelector, OwnStateMetadata, contentStateOf() (+1 more)

### Community 101 - "version.negative-control.test.ts"
Cohesion: 0.15
Nodes (19): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, Select, text(), checkPackageFiles(), manifestSha256(), mismatch() (+11 more)

### Community 102 - "determinism-checks.ts"
Cohesion: 0.17
Nodes (18): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, PRIVATE_ROWS_SQL(), privateModule(), refusalOf(), a146Hashes() (+10 more)

### Community 103 - "digest.test.ts"
Cohesion: 0.13
Nodes (20): ChangeKind, tableChanges, TouchedRow, changeOf(), concat(), sameBytes(), hex(), hex() (+12 more)

### Community 105 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 107 - "builds.ts"
Cohesion: 0.17
Nodes (18): PrivateProcess, PrivateRefusal, PublicCoreOptions, chainDeclarations(), genesisBlock(), genesisHex(), launchPrivate(), poll() (+10 more)

### Community 109 - "height"
Cohesion: 0.12
Nodes (18): Broken, height(), 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy (+10 more)

### Community 11 - "tape/index.ts"
Cohesion: 0.05
Nodes (70): Recorded, Link, TapeBuilderOptions, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest (+62 more)

### Community 111 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 115 - "height-versioned.property.test.ts"
Cohesion: 0.14
Nodes (17): Block, BlockFails, Counts, Effect, Key, Op, canonicalText(), holds() (+9 more)

### Community 116 - "separation.test.ts"
Cohesion: 0.15
Nodes (13): PrivateBackend, SessionSeen, A112Observation, Wiring, a146HashProblems(), a146RefusalProblems(), schemaPlan(), PRIVATE_BACKENDS (+5 more)

### Community 12 - "writer-lock-checks.ts"
Cohesion: 0.04
Nodes (74): Held, PgliteLockUse, Snapshot, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PostgresTestServer (+66 more)

### Community 124 - "intake.test.ts"
Cohesion: 0.22
Nodes (15): PrivateSeen, A114Observation, A116Observation, hashAt(), inMemoryBlock(), blockAt(), a114Problems(), a116Problems() (+7 more)

### Community 125 - "read-height.property.test.ts"
Cohesion: 0.17
Nodes (11): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+3 more)

### Community 128 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 13 - "declaration.ts"
Cohesion: 0.05
Nodes (75): DefinedModule, KnownPointsOnly, TableDeclaration, InMemoryBlockSource, InMemoryItems, Wait, ProcessDatabase, CoreSeen (+67 more)

### Community 130 - "postgres/transaction-history-storage.ts"
Cohesion: 0.22
Nodes (15): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+7 more)

### Community 131 - "TapeBuilder"
Cohesion: 0.17
Nodes (5): TapeBuilder, RecordingError, frameText(), whenClosed(), 11. Refusals and halts (IN-12)

### Community 133 - "source-scan.ts"
Cohesion: 0.23
Nodes (15): ModuleReference, copiedCode(), settingsElsewhere(), boundaryViolations(), codeFingerprints(), declaredNames(), eachNode(), lineOf() (+7 more)

### Community 14 - "vitest"
Cohesion: 0.04
Nodes (73): Settings, Case, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer (+65 more)

### Community 141 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 149 - "3. Proof-blocking findings"
Cohesion: 0.15
Nodes (13): Absent, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces (+5 more)

### Community 15 - "deterministic-postgresql/index.ts"
Cohesion: 0.04
Nodes (86): CaptureColumn, CapturedTable, CaptureState, GuardTableRow, optOut, ChainOptions, DigestRow, Op (+78 more)

### Community 150 - "MergeEntriesFn"
Cohesion: 0.17
Nodes (10): EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, 17. Library surface and gates, 3.1 Field mapping (write path), 3.2 Lifecycle-detail fidelity — the correctness-gate open question (+2 more)

### Community 151 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 157 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 16 - "TransactionHandle"
Cohesion: 0.03
Nodes (83): TransactionHistoryReader, TransactionHistoryWriter, TransactionHandle, TransactionHandleInvalidError, withAbort(), coerceToSafeNumber(), sha256(), toHex() (+75 more)

### Community 17 - "ingest-crash.test.ts"
Cohesion: 0.05
Nodes (82): BlockHeader, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded, FetchSeen (+74 more)

### Community 178 - "type-check.ts"
Cohesion: 0.33
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 179 - "Model"
Cohesion: 0.42
Nodes (3): VersionedValue, StoredVersion, Model

### Community 18 - "runner/process.ts"
Cohesion: 0.04
Nodes (67): BlockHeaderItem, BodyExtrinsic, BlockBody, BlockItemSource, CoreBlockHeader, Bound, ChainCheck, ChainCheckInput (+59 more)

### Community 186 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 19 - "postgres/transaction-lease.ts"
Cohesion: 0.04
Nodes (87): Lease, LeaseAcquireOptions, LeaseFaultError, HeldLease, InjectedReleaseFaultLayer, exceedsMaxDepth(), abortError(), isConnectionFailure() (+79 more)

### Community 2 - "StorageError"
Cohesion: 0.03
Nodes (146): CheckpointNotFoundError, CheckpointStoreError, ChunkIntegrityError, ChunkMissingError, ManifestCorruptError, ConnectionError, Retryability, SerializationFailedError (+138 more)

### Community 20 - "ValidationError"
Cohesion: 0.03
Nodes (88): ValidationError, 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade (+80 more)

### Community 21 - "ref_node_fs"
Cohesion: 0.04
Nodes (57): Finding, Lockfile, Manifest, RepositoryFile, Upstream, GuardViolation, ReportedTest, statusOf() (+49 more)

### Community 215 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 22 - "history.test.ts"
Cohesion: 0.04
Nodes (76): AdmittedKey, CoreLedgerVersion, LedgerPackageIdentity, versionEntry, HistoryOptions, HistoryRow, HistoryRule, AppliedMigration (+68 more)

### Community 23 - "adapter.ts"
Cohesion: 0.04
Nodes (61): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+53 more)

### Community 24 - "admin-harness.ts"
Cohesion: 0.05
Nodes (65): FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminSnapshot, coreEntry, AdminRun, Answered (+57 more)

### Community 25 - "translatePostgresError"
Cohesion: 0.06
Nodes (54): BlobIntegrityError, BlobMissingError, BlobRole, BlockBundle, BlockMeta, BlockNotFoundError, BlockRecord, BlockStatus (+46 more)

### Community 26 - "config-check.ts"
Cohesion: 0.05
Nodes (61): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName (+53 more)

### Community 27 - "node/client.test.ts"
Cohesion: 0.04
Nodes (36): Answer, FakeNode, Handler, Received, recorded, result(), caught(), client() (+28 more)

### Community 28 - "snapshot.test.ts"
Cohesion: 0.06
Nodes (53): ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminStarter, SnapshotFacts, ConfigSnapshot, SanitizedError, PlainObject (+45 more)

### Community 29 - "describeNodeStoreExports"
Cohesion: 0.07
Nodes (50): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+42 more)

### Community 3 - "db/errors.ts"
Cohesion: 0.03
Nodes (90): ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, ReadOnlyDatabase, ReadOptions, DurabilityProbeOptions (+82 more)

### Community 30 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (36): PrivateBlockSource, privateIntake, PrivateIntakeOptions, PublicDatabase, PublicIdentity, PublicWakes, TestDatabase, A113Observation (+28 more)

### Community 31 - "module-api.test.ts"
Cohesion: 0.05
Nodes (58): GraphInput, PastFaultCase, RefusalCase, CallEvent, Recorder, reader(), backboneWithout(), blockItem() (+50 more)

### Community 32 - "column-rules.ts"
Cohesion: 0.04
Nodes (66): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+58 more)

### Community 33 - "loop.test.ts"
Cohesion: 0.05
Nodes (42): ItemSink, LateUse, WaitingInRead, LoopClass, RunnerDatabase, EagerItems, EagerLoop, FailingAfter (+34 more)

### Community 34 - "process-context.test.ts"
Cohesion: 0.05
Nodes (36): Revision, ResolvedGraph, MisuseListener, MisuseReports, ProcessContexts, ProcessContextsInput, ProcessItems, PublishRefusal (+28 more)

### Community 35 - "loop.ts"
Cohesion: 0.07
Nodes (51): PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+43 more)

### Community 36 - "FinalizedLoop"
Cohesion: 0.06
Nodes (18): FinalizedLoop, HeightRun, LoopObserver, SkipsAfterReconnect, Batching, ItemsAfterWrite, SkipsStartAtRestart, CommitsDespiteLastWrite (+10 more)

### Community 37 - "child-processes.test.ts"
Cohesion: 0.05
Nodes (49): SignalTarget, ParentJob, Kill, Orphaned, SourceFile, Run, Job, WorkerEvent (+41 more)

### Community 38 - "NodeBlockSource"
Cohesion: 0.08
Nodes (20): CoreBlockItems, RuntimeMetadataView, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeSubscription, NodeBlock (+12 more)

### Community 39 - "transform-checks.ts"
Cohesion: 0.08
Nodes (40): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, baseRecords() (+32 more)

### Community 4 - "test/postgres/setup.ts"
Cohesion: 0.02
Nodes (133): JsonValue, KvRow, BatchSpec, CurrentState, InvariantResult, C5AnyFn, CurrentState, CurrentState (+125 more)

### Community 40 - "harness.ts"
Cohesion: 0.09
Nodes (48): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+40 more)

### Community 41 - "node/client.ts"
Cohesion: 0.08
Nodes (49): Connection, NodeCallOptions, NodeClientOptions, NodeRetry, State, Subscription, NodeRuntimeVersion, NodeCallMethod (+41 more)

### Community 42 - "adapter-suite.ts"
Cohesion: 0.10
Nodes (49): Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState, expectNoV8Logs() (+41 more)

### Community 43 - "config/history.ts"
Cohesion: 0.08
Nodes (50): CoreVersion, CoreSettings, HistoryCheck, HistoryCode, HistoryContext, Span, CheckedEntry, PlacedEntry (+42 more)

### Community 44 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (35): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+27 more)

### Community 45 - "format.test.ts"
Cohesion: 0.05
Nodes (37): Metadata, Step, TapeCommandIo, ConnectionFrames, RecordAndReplayOptions, RecordAndReplayResult, ReplaySession, Tape (+29 more)

### Community 46 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (49): TransactionHistoryStorage, PgTransactionHistoryStorage, reason(), 1.3 Transaction participation, 3.4 Watermarks, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage (+41 more)

### Community 47 - "validation.ts"
Cohesion: 0.06
Nodes (43): DeclarationRule, PlacedDeclaration, Plain, Shape, Case, ShapeCase, Stats, checkItem() (+35 more)

### Community 48 - "ModuleDeclaration"
Cohesion: 0.06
Nodes (48): CheckState, ConfigCheckOptions, ProcessSide, LoadedConfig, LoadOptions, plainData, ConfigContext, ConfigInput (+40 more)

### Community 49 - "NodeClient"
Cohesion: 0.09
Nodes (17): HeadSubscriber, NodeClient, Pending, Waiter, connectionFailure, NodeMethod, IngestOptions, Opened (+9 more)

### Community 5 - "UmbraError"
Cohesion: 0.04
Nodes (111): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference (+103 more)

### Community 50 - "cbor.ts"
Cohesion: 0.08
Nodes (45): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+37 more)

### Community 51 - "halts.test.ts"
Cohesion: 0.06
Nodes (42): ChainDataView, ProcessingEnd, ProcessStatus, A43Observation, Outcome, RunObservation, answerChainData(), chainDataHeaders() (+34 more)

### Community 52 - "node.test.ts"
Cohesion: 0.08
Nodes (24): ManualTimers, Failure, Variant, TapeClock, scriptedSockets(), turns(), until(), expectAnswersByOccurrence() (+16 more)

### Community 53 - "storage-errors.ts"
Cohesion: 0.08
Nodes (35): EnvelopeCorruptError, EnvelopeVersionUnsupportedError, WalletStateEnvelope, WalletStateEnvelopeError, decode(), encode(), safeNonEmptyString(), safeString() (+27 more)

### Community 54 - "LedgerPackage"
Cohesion: 0.05
Nodes (30): LedgerEventKind, LedgerPackage, NodeStore, released(), vendored(), listen(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence (+22 more)

### Community 55 - "admin/types.ts"
Cohesion: 0.09
Nodes (31): adminRoutes, AdminChannel, AdminServeOptions, AdminAnswer, AdminEndpoint, AdminPart, AdminView, StatusSnapshot (+23 more)

### Community 56 - "builder.test.ts"
Cohesion: 0.08
Nodes (27): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Frame, Script, ScriptedNode (+19 more)

### Community 57 - "graph.ts"
Cohesion: 0.08
Nodes (43): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeFacts, Spanned (+35 more)

### Community 58 - "validate.ts"
Cohesion: 0.08
Nodes (41): HistoryFinding, ConfigRule, CursorRule, Finding, Issue, Plain, SettingsSchema, coreSettingsSchema() (+33 more)

### Community 59 - "post-block-update-checks.ts"
Cohesion: 0.10
Nodes (35): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+27 more)

### Community 6 - "runMigrations"
Cohesion: 0.03
Nodes (99): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+91 more)

### Community 60 - "chain-process.test.ts"
Cohesion: 0.07
Nodes (33): ProcessHandle, StandInOptions, Job, WorkerEvent, A77Observation, A78Observation, A90Observation, Failing (+25 more)

### Community 62 - "core-block-fetch/metadata.ts"
Cohesion: 0.13
Nodes (26): ExtrinsicCall, MetadataField, MetadataPallet, MetadataType, MetadataVariant, Primitive, TypeDef, ScaleError (+18 more)

### Community 63 - "core-settings.ts"
Cohesion: 0.06
Nodes (36): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+28 more)

### Community 64 - "ledger/types.ts"
Cohesion: 0.10
Nodes (32): LedgerName, AdapterSpec, LedgerRelease, LedgerReleasePackage, AppliedBlock, ApplyInput, ApplyOutput, ChainOutcome (+24 more)

### Community 65 - "plain-data.ts"
Cohesion: 0.07
Nodes (30): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+22 more)

### Community 67 - "networks.ts"
Cohesion: 0.07
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 69 - ".show"
Cohesion: 0.07
Nodes (22): AllowedDetail, schemaName(), module(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 7 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (85): CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions (+77 more)

### Community 70 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 71 - "order.property.test.ts"
Cohesion: 0.09
Nodes (32): PointRun, CheckName, GraphSpec, ModuleSpec, Pipeline, TESTED, byBytes(), checkDigestLast() (+24 more)

### Community 72 - "entries.ts"
Cohesion: 0.07
Nodes (32): CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+24 more)

### Community 76 - "crash.test.ts"
Cohesion: 0.09
Nodes (21): BlockSource, FinalityStallCondition, LoopInput, CrashCall, CrashEvent, CrashObservation, WORKER, CrashJob (+13 more)

### Community 78 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 79 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): TransactionHistoryStatus, LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+14 more)

### Community 8 - "interfaces/temporal-kv.ts"
Cohesion: 0.02
Nodes (115): AsOf, AssertExact, Key, Namespace, Scope, Version, VersionedEntry, _VersionedEntryInSync (+107 more)

### Community 81 - "version-checks.ts"
Cohesion: 0.18
Nodes (21): CountingNode, Walk, Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked() (+13 more)

### Community 82 - "TransactionHistoryEntry"
Cohesion: 0.13
Nodes (8): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 83 - "checks.test.ts"
Cohesion: 0.10
Nodes (20): CheckFunctionsOptions, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName(), integerCheckStatements() (+12 more)

### Community 84 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 85 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 88 - "block-fetch-decode.test.ts"
Cohesion: 0.14
Nodes (22): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+14 more)

### Community 89 - "Process"
Cohesion: 0.16
Nodes (6): Process, startModuleApi(), messageOf(), namedStartDb(), pause(), sealed()

### Community 9 - "src/index.ts"
Cohesion: 0.04
Nodes (108): CheckpointRecord, CheckpointSequence, CheckpointStore, CheckpointStoreErrorCode, CheckpointSummary, ContentHash, HistoryOptions, PruneResult (+100 more)

### Community 94 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.19
Nodes (19): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+11 more)

### Community 98 - "tx-replay-decoder.ts"
Cohesion: 0.12
Nodes (21): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+13 more)

### Community 99 - "BlockRef"
Cohesion: 0.15
Nodes (9): QueuedBlock, BlockItems, BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, KeptItems (+1 more)

### Community 220 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 104 - "boundary.test.ts"
Cohesion: 0.18
Nodes (17): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedTexts(), redeclared(), where(), exportedDeclarations() (+9 more)

### Community 113 - "version"
Cohesion: 0.11
Nodes (18): version(), Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-7 The history row and its hash, Scenario: A misspelled setting is a type error, Scenario: The same entry gives the same hash, 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), Audit resolution, recovery-testing (crash-injection, soak, differential & live-evidence gate) (+10 more)

### Community 117 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.11
Nodes (17): pg(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+9 more)

### Community 126 - "connectWebSocket"
Cohesion: 0.13
Nodes (11): connectWebSocket(), "on-compute"(), quietConnect(), 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix, 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time (+3 more)

### Community 127 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.12
Nodes (14): some(), Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix (+6 more)

### Community 132 - "integer"
Cohesion: 0.12
Nodes (14): integer(), Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first), G14 — benchmark harness + recorded baseline, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Scenario: The history aggregate reads size_bytes, not octet_length(data), Scenario: The size_bytes column exists and equals the payload length (+6 more)

### Community 134 - ".refused"
Cohesion: 0.18
Nodes (14): halted(), When a callback fails, 5. Runner, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Scenario: A refused start stays up, Scenario: Before the first block (+6 more)

### Community 135 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.13
Nodes (13): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 5. WalletState envelope, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier (+5 more)

### Community 139 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 161 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 169 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 187 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 192 - "001_chain_archive_core.ts"
Cohesion: 0.36
Nodes (6): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol)

### Community 200 - "a113Run"
Cohesion: 0.25
Nodes (6): a113Run(), against(), outcomeOf(), withCore(), directPublic(), against()

### Community 230 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 245 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 246 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 68 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 86 - "address"
Cohesion: 0.08
Nodes (24): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md` (+16 more)

### Community 90 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.08
Nodes (23): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1** (+15 more)

### Community 93 - ".getAll"
Cohesion: 0.09
Nodes (24): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+16 more)

### Community 95 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (24): insert(), ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default (+16 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 108 - "README.md"
Cohesion: 0.16
Nodes (6): For historical reference only, Tasks — superseded by per-sprint openspec changes, UmbraDB v1.0.0 — Release Record (PENDING), What 1.0.0 additionally requires, What must happen before this record can be completed, Performance

### Community 110 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 112 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 118 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.11
Nodes (18): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+10 more)

### Community 119 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 120 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 121 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.11
Nodes (15): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why, 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 4. Live preprod DB-sync verification (nightly/labeled) (+7 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 123 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 129 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+8 more)

### Community 136 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (14): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+6 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: one storage instance is bound to exactly one wallet at construction, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note), Scenario: A pending entry clears against a finalized entry whose identifiers grew via two prior merges (+6 more)

### Community 138 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 140 - "UmbraDB module guide"
Cohesion: 0.14
Nodes (13): Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Private modules, Process items and APIs, Reading through `db`, Start and stop heights (+5 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 144 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 145 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 146 - "Roadmap"
Cohesion: 0.14
Nodes (14): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`) (+6 more)

### Community 148 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 154 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.15
Nodes (12): 0. Package layout, 2.1 Where the probe runs (the one real design decision), 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+4 more)

### Community 158 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 159 - "Full-Chain Storage — Design"
Cohesion: 0.17
Nodes (11): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 6. Reorg / rollback handling — summary, 7. The data categories — explicit judgment calls (revised), 9. Generalizing the verifiable-snapshot L0–L3 layers to full-chain-archive snapshots, Full-Chain Storage — Design (+3 more)

### Community 160 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.17
Nodes (12): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`), Track B — Durable composition (`openspec/changes/v1.0.0-durable-checkpoint-cursor`, merged `e5fcdaa`, `2cb5d00`) (+4 more)

### Community 162 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 163 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 164 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 165 - "Performance — design"
Cohesion: 0.15
Nodes (10): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design, Decision: GC architecture, Decision: query tracing (+2 more)

### Community 166 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 167 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover), 7. What this change deliberately does not verify (traceability of the non-goals) (+2 more)

### Community 168 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.18
Nodes (10): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds, 8. CI (+2 more)

### Community 170 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 171 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 172 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness, Scenario: Endpoints answer while the database is busy (+1 more)

### Community 173 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 174 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.20
Nodes (9): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Postgres-kill mid-save + retry contract (G9 / T2), Process-kill mid-save (G9 / T1) (+1 more)

### Community 175 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.20
Nodes (9): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC, 9. Change close-out (+1 more)

### Community 176 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 177 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 180 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.22
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 181 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 182 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 183 - "3. Live-node/indexer confirmation"
Cohesion: 0.22
Nodes (9): 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs, 3.5 Dust generation + ledger events (generic), 3.6 Contract state/actions — confirmed absent, not confirmed present, 3.7 Governance / bridge, 3.8 SPO/staking (+1 more)

### Community 184 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 185 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 188 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 189 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 190 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 191 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 193 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 194 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.25
Nodes (7): Benchmarks, Compatibility, and what 1.0.0 needs, Installing, Security, UmbraDB 0.9.5 "Penumbra", What is proved, and what that is worth, What this is not

### Community 195 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 196 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 197 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.25
Nodes (7): 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 9.1 Backups (BK; Q83, Q85), 9.2 Browser build (BR), 9. Backups and browser, Design — CORE-ARCH: the standalone indexer's core architecture

### Community 198 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.25
Nodes (7): 11. Chain data, 13. Contract data, 15. Backups, 16. Browser, 18. Whole-system faults, differentials and measurements, 19. Close-out, Tasks — CORE-ARCH: the standalone indexer's core architecture

### Community 202 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 203 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 204 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.29
Nodes (5): 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 205 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 206 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 207 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 208 - "Global Constraints"
Cohesion: 0.29
Nodes (6): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 209 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 210 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 211 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 212 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 213 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 216 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 217 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 218 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 219 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 221 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 222 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 223 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 224 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 225 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 226 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 227 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 228 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 229 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 231 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 232 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 233 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 234 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 235 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 236 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 237 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 238 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 239 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 240 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 241 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 242 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 243 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 244 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 247 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 248 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 249 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 250 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 251 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 252 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.50
Nodes (4): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The core leaves an answer as the module wrote it

### Community 253 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 254 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 259 - "Requirement: RN-5 The block context carries one height's items"
Cohesion: 0.67
Nodes (3): Requirement: RN-5 The block context carries one height's items, Scenario: A second put is an error, Scenario: An item reaches a later callback of the same block

### Community 61 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 66 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 73 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides, Requirement: LG-17 Ledger tasks give modules the native objects (+25 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+25 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-17 A slow block is reported, never cut off (+23 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 87 - "package.json"
Cohesion: 0.07
Nodes (26): bin, umbradb, bugs, url, description, engines, node, exports (+18 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-8 One version per build (+17 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0, Requirement: the baseline reflects the batched (shipped) save shape (+17 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form, Requirement: G9/T3 — a killed lease-holder does not wedge the lease (+17 more)

## Knowledge Gaps
- **42 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-9110`, `RFC-8949`, `RFC-3339` (+37 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2953 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `Database`, `PgTransactionLeaseLayer`, `StorageError`, `db/errors.ts`, `test/postgres/setup.ts`, `UmbraError`, `runMigrations`, `opt-out.test.ts`, `src/index.ts`, `api-server.test.ts`, `tape/index.ts`, `writer-lock-checks.ts`, `declaration.ts`, `deterministic-postgresql/index.ts`, `ingest-crash.test.ts`, `runner/process.ts`, `postgres/transaction-lease.ts`, `ref_node_fs`, `history.test.ts`, `adapter.ts`, `admin-harness.ts`, `translatePostgresError`, `config-check.ts`, `node/client.test.ts`, `snapshot.test.ts`, `describeNodeStoreExports`, `core-private-source.test.ts`, `module-api.test.ts`, `loop.test.ts`, `process-context.test.ts`, `loop.ts`, `child-processes.test.ts`, `transform-checks.ts`, `node/client.ts`, `adapter-suite.ts`, `column-rules.test.ts`, `format.test.ts`, `validation.ts`, `ModuleDeclaration`, `halts.test.ts`, `node.test.ts`, `storage-errors.ts`, `admin/types.ts`, `builder.test.ts`, `post-block-update-checks.ts`, `chain-process.test.ts`, `core-block-fetch/metadata.ts`, `core-settings.ts`, `plain-data.ts`, `networks.ts`, `cbor.property.test.ts`, `order.property.test.ts`, `entries.ts`, `crash.test.ts`, `pg-tx-history-adapter.ts`, `version-checks.ts`, `checks.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `package.json`, `block-fetch-decode.test.ts`, `Tasks — v1.0.0-infosec-signoff`, `cold-boot-recovery.integration.test.ts`, `version.negative-control.test.ts`, `digest.test.ts`, `boundary.test.ts`, `transaction-history-storage.property.test.ts`, `height-versioned.property.test.ts`, `separation.test.ts`, `intake.test.ts`, `read-height.property.test.ts`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `no-indexer-or-wallet-sdk.test.ts`, `excluded-not-exported.test.ts`, `component-table.test.ts`, `facade-merge-loader.ts`?**
  _High betweenness centrality (0.316) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-9110` to the rest of the system?**
  _42 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.02425989311235213 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `Database`, `db/errors.ts`, `TapeBuilder`, `opt-out.test.ts`, `api-server.test.ts`, `writer-lock-checks.ts`, `declaration.ts`, `vitest`, `deterministic-postgresql/index.ts`, `ingest-crash.test.ts`, `runner/process.ts`, `ref_node_fs`, `history.test.ts`, `admin-harness.ts`, `config-check.ts`, `node/client.test.ts`, `snapshot.test.ts`, `core-private-source.test.ts`, `module-api.test.ts`, `loop.test.ts`, `process-context.test.ts`, `loop.ts`, `FinalizedLoop`, `NodeBlockSource`, `transform-checks.ts`, `node/client.ts`, `config/history.ts`, `validation.ts`, `ModuleDeclaration`, `NodeClient`, `cbor.ts`, `halts.test.ts`, `graph.ts`, `validate.ts`, `chain-process.test.ts`, `core-settings.ts`, `ledger/types.ts`, `plain-data.ts`, `Design — CORE-ARCH: the standalone indexer's core architecture`, `failingSource`, `mapping.ts`, `version-checks.ts`, `checks.test.ts`, `ledger/metadata.ts`, `version.negative-control.test.ts`, `version-table.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `PgTransactionLeaseLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.021485573971761818 - nodes in this community are weakly interconnected._