# Graph Report - UmbraDB

## Corpus Check
- 837 files · ~1,284,535 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 8844 nodes · 25462 edges · 279 communities (254 shown, 25 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 3050 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `ccb9688a2661fbd5` (837 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- createClient
- PgTransactionHistoryStorage
- tape/index.ts
- no-indexer-or-wallet-sdk.test.ts
- node-format.ts
- determinism-checks.ts
- binding.test.ts
- identity.ts
- admin-harness.ts
- intake.test.ts
- PrivateBlockSource
- node-store-suite.ts
- describeNodeStoreExports
- ws-mutual-tls.test.ts
- 3. Proof-blocking findings
- config/history.ts
- validation.test.ts
- read-height.property.test.ts
- builds.ts
- checkShape
- pglite-timeouts.test.ts
- chain-process.test.ts
- crash-worker.ts
- .show
- attempt
- chain-archive-rollover.ts
- node/client.test.ts
- BlobIntegrityError
- upgrade-boundary.test.ts
- FinalizedLoop
- api-server.test.ts
- Session
- Heartbeat
- component-table.test.ts
- NodeClient
- ProcessItems
- core-config.test.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- range.ts
- Connection
- a114Run
- src/index.ts
- PgTemporalKV
- ReadPool
- process-admin.ts
- mutation-evidence.d.mts
- adapter.ts
- builder.test.ts
- ReadHandle
- EventsRunner
- CliBackend
- adapter-fixtures.ts
- validate.ts
- config-check.ts
- graph.ts
- ValidationError
- vitest
- column-rules.ts
- format.test.ts
- declaration.ts
- entries.ts
- core-block-parsed.ts
- child-processes.test.ts
- harness.ts
- networks.ts
- validation.ts
- ModuleDeclaration
- column-rules.test.ts
- version-checks.ts
- writer-lock-checks.ts
- NodeBlockSource
- opt-out.test.ts
- column-refusals.test.ts
- ledger/types.ts
- cbor.ts
- LedgerPackage
- changes.property.test.ts
- PgTransactionLeaseLayer
- runner/process.ts
- db/durability-probe.test.ts
- chain-placement.test.ts
- .value
- chain-events-decode.test.ts
- boundary.test.ts
- ingest-crash.test.ts
- transform-checks.ts
- differential-equivalence.test.ts
- cbor.property.test.ts
- change-capture.ts
- db/migrate.ts
- shadow-schema.test.ts
- digest.test.ts
- core-private-source.test.ts
- mapping.ts
- crash.test.ts
- height-versioned.property.test.ts
- module-tables.ts
- core-chain.test.ts
- redact.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- tx-replay-decoder.ts
- PgChainArchiveStore
- ref_node_child_process
- containers.test.ts
- UmbraError
- full-sync-soak.integration.test.ts
- private/backends.ts
- ChainArchiveStore
- pglite-writer.worker.ts
- block-fetch-decode.test.ts
- node-source.ts
- PgliteDatabase
- postgres/chain-archive-store.ts
- Problem
- vendored-ledger-v9.test.ts
- mapping.test.ts
- address
- repository
- mutation-per-adapter.mjs
- pg
- twox.ts
- facade-merge-loader.ts
- ADDED Requirements
- history.property.test.ts
- pack-install.mjs
- .query
- midnight-env — reproducible PREPROD dev environment
- .boolean
- fresh-instance.mjs
- T
- Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep
- version
- graph.py
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- table
- ADDED Requirements
- package.json
- UmbraDB third-party component inventory (SBOM)
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- stryker.conf.json
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- scripts
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- devDependencies
- UmbraDB v0.9.5 "Penumbra" — Release Record
- README.md
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Roadmap
- compilerOptions
- UmbraDB module guide
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.1.0: Quint model checking
- compilerOptions
- openspec-explore/SKILL.md
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- UmbraDB
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
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Tasks — v1.0.0-infosec-signoff
- Our Pledge
- Algebraic Specification of the midnight-pg-store Storage Layer
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Security policy & threat model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- Proposal — Sprint 1: project setup + TemporalKV
- Requirement: TransactionKeyReuseError is now reachable through the public put() API
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
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
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Requirement: DB-15 Timeouts by connection role
- Requirement: DB-8 Schema names are unambiguous
- Requirement: MD-4 Modules start mid-chain only when they promise it
- Acceptance criteria — v1.0.0-perf-baseline
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- 9. Backups and browser
- Requirement: DB-10 Migrations of an upgrade never change stored values
- Requirement: set is an idempotent, unconditional overwrite (Law W1)
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
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ROADMAP.md

## God Nodes (most connected - your core abstractions)
1. `vitest` - 261 edges
2. `UmbraError` - 215 edges
3. `ModuleDeclaration` - 124 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `runMigrations()` - 90 edges
6. `ValidationError` - 87 edges
7. `PgCheckpointStore` - 87 edges
8. `NodeClient` - 85 edges
9. `Database` - 84 edges
10. `InMemoryBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`)` --references--> `CheckpointStore`  [INFERRED]
  design/full-chain-storage-design.md → src/interfaces/checkpoint-store.ts
- `6. Backup/restore guidance` --references--> `CheckpointStore`  [INFERRED]
  docs/CONTRACT.md → src/interfaces/checkpoint-store.ts
- `Scope — documented preconditions vs. implemented controls (1.0.0)` --references--> `CheckpointStore`  [INFERRED]
  docs/THREAT_MODEL.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (279 total, 25 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.02
Nodes (189): JsonValue, UmbraDBSql, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, KvRow, SqliteTxRow (+181 more)

### Community 1 - "PgTransactionHistoryStorage"
Cohesion: 0.01
Nodes (205): EntryContent, MergeEntriesFn, TransactionHistoryEntry, TransactionHistoryStatus, TransactionHistoryStorage, PgTransactionHistoryStorage, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter (+197 more)

### Community 10 - "tape/index.ts"
Cohesion: 0.04
Nodes (98): Recorded, BoundaryReading, RecordingProblem, TapeProblem, TransformError, TransformProblem, readRequest, RequestId (+90 more)

### Community 100 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.16
Nodes (14): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), moduleSpecifier() (+6 more)

### Community 103 - "node-format.ts"
Cohesion: 0.23
Nodes (14): Reader, childKey(), concat(), decodeChild(), decodeChildren(), encodeChild(), encodeChildren(), nodeKey() (+6 more)

### Community 104 - "determinism-checks.ts"
Cohesion: 0.17
Nodes (18): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, PRIVATE_ROWS_SQL(), privateModule(), a146Hashes(), a146HashProblems() (+10 more)

### Community 107 - "binding.test.ts"
Cohesion: 0.14
Nodes (12): TestDatabase, A113Observation, Binding, Outcome, privateCursorHeight(), a113Run(), bindingIn(), outcomeOf() (+4 more)

### Community 108 - "identity.ts"
Cohesion: 0.18
Nodes (17): LedgerName, LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerSelection, text(), checkPackageFiles(), manifestSha256() (+9 more)

### Community 11 - "admin-harness.ts"
Cohesion: 0.03
Nodes (114): AdminChannel, FromAdmin, ToAdmin, AdminServer, AdminRun, AdminRunOptions, Answered, Answerer (+106 more)

### Community 112 - "intake.test.ts"
Cohesion: 0.20
Nodes (16): PrivateSeen, PublicCore, A114Observation, A116Observation, against(), directPublic(), a114Problems(), a116Problems() (+8 more)

### Community 113 - "PrivateBlockSource"
Cohesion: 0.24
Nodes (7): PrivateBlockSource, PrivateIntakeOptions, PublicDatabase, PublicWakes, PrivateOptions, 8. Private processes (PP), 14. Private processes

### Community 115 - "node-store-suite.ts"
Cohesion: 0.14
Nodes (15): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, NodeBatch, NodeRoot, runInFreshInstance(), hasEmbeddedChild() (+7 more)

### Community 116 - "describeNodeStoreExports"
Cohesion: 0.18
Nodes (4): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports()

### Community 117 - "ws-mutual-tls.test.ts"
Cohesion: 0.16
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 118 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 12 - "config/history.ts"
Cohesion: 0.04
Nodes (116): CoreVersion, ConfiguredDatabase, ConfiguredDatabaseOptions, CoreSettings, versionEntry, HistoryCheck, HistoryCode, HistoryContext (+108 more)

### Community 122 - "validation.test.ts"
Cohesion: 0.15
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 123 - "read-height.property.test.ts"
Cohesion: 0.17
Nodes (11): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+3 more)

### Community 124 - "builds.ts"
Cohesion: 0.23
Nodes (14): PrivateProcess, PrivateRefusal, genesisBlock(), genesisHex(), launchPrivate(), poll(), privateCoreEntry(), publicCoreEntry() (+6 more)

### Community 127 - "checkShape"
Cohesion: 0.30
Nodes (8): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), 14. External claims and their evidence

### Community 129 - "pglite-timeouts.test.ts"
Cohesion: 0.17
Nodes (12): Run, Job, WorkerEvent, expectNeverCutOffNorHung(), settings(), apiRead(), engine(), report() (+4 more)

### Community 13 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (90): ProcessHandle, ProcessingEnd, Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A90Observation (+82 more)

### Community 130 - "crash-worker.ts"
Cohesion: 0.20
Nodes (14): CoTxCallable, CoTxPauseInfo, CrashHook, describeCaughtError(), main(), observeClientPauseBeforeCursor(), pauseThenResume(), pauseUntilKilled() (+6 more)

### Community 131 - ".show"
Cohesion: 0.19
Nodes (3): AllowedDetail, schemaName(), module()

### Community 134 - "attempt"
Cohesion: 0.15
Nodes (14): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+6 more)

### Community 138 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 14 - "node/client.test.ts"
Cohesion: 0.03
Nodes (64): NodeClientOptions, NodeSocketEvents, Answer, FakeNode, Handler, Received, recorded, ManualTimers (+56 more)

### Community 143 - "BlobIntegrityError"
Cohesion: 0.29
Nodes (10): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation), Requirement: The chain-archive error classes are excluded from the frozen surface, Scenario: Chain-archive classes are not exported and their codes are not frozen (+2 more)

### Community 149 - "upgrade-boundary.test.ts"
Cohesion: 0.23
Nodes (11): A47Observation, CommitsTheBoundary, Version, a47Problems(), a47Run(), big(), buildOf(), moduleM() (+3 more)

### Community 15 - "FinalizedLoop"
Cohesion: 0.04
Nodes (65): HeightRange, ResolvedRange, Callback, EntryBoundary, ParallelPoint, PointSchedule, ReasonCode, Unwrapped (+57 more)

### Community 16 - "api-server.test.ts"
Cohesion: 0.03
Nodes (84): ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, ChainDataAnswer, ChainDataView, ApiError, ApiErrorCode, ApiRequest (+76 more)

### Community 164 - "Heartbeat"
Cohesion: 0.31
Nodes (5): Heartbeat, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 165 - "component-table.test.ts"
Cohesion: 0.18
Nodes (7): DesignTable, RowCoverage, typeScriptFiles(), OPENERS, ROWS, SUITE, REPOSITORY

### Community 17 - "NodeClient"
Cohesion: 0.05
Nodes (62): CoreChainBinding, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription (+54 more)

### Community 18 - "core-config.test.ts"
Cohesion: 0.05
Nodes (74): adminRoutes, AdminServeOptions, AdminStartOptions, AdminAnswer, AdminEndpoint, AdminPart, AdminSnapshot, AdminView (+66 more)

### Community 184 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 19 - "range.ts"
Cohesion: 0.03
Nodes (78): ConnectSocket, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, BoundaryBlockReading, BoundaryOptions (+70 more)

### Community 2 - "src/index.ts"
Cohesion: 0.02
Nodes (215): CheckpointStoreErrorCode, ConnectionError, Retryability, SerializationFailedError, SharedStorageErrorCode, StorageError, HistoryUnavailableError, TemporalKV (+207 more)

### Community 20 - "PgTemporalKV"
Cohesion: 0.04
Nodes (77): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, StoredEntryJson, AsOf, AssertExact (+69 more)

### Community 21 - "process-admin.ts"
Cohesion: 0.05
Nodes (75): ConfigFacts, OpenedConfig, OpenedFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminStarter, DigestRow (+67 more)

### Community 210 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 22 - "adapter.ts"
Cohesion: 0.04
Nodes (72): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+64 more)

### Community 23 - "builder.test.ts"
Cohesion: 0.04
Nodes (41): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Frame, RawClient, Script (+33 more)

### Community 24 - "ReadHandle"
Cohesion: 0.04
Nodes (54): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, BlockContext (+46 more)

### Community 26 - "adapter-fixtures.ts"
Cohesion: 0.07
Nodes (78): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState (+70 more)

### Community 27 - "validate.ts"
Cohesion: 0.04
Nodes (79): EntryView, coreEntry, plainData, ConfigContext, ConfigRule, CursorRule, EntryRef, EntryView (+71 more)

### Community 28 - "config-check.ts"
Cohesion: 0.04
Nodes (63): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName (+55 more)

### Community 29 - "graph.ts"
Cohesion: 0.04
Nodes (75): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+67 more)

### Community 3 - "ValidationError"
Cohesion: 0.02
Nodes (183): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointSummary, ChunkIntegrityError, ChunkMissingError, ContentHash (+175 more)

### Community 30 - "vitest"
Cohesion: 0.04
Nodes (34): Finding, Lockfile, Manifest, Upstream, GuardViolation, ReportedTest, inChild(), filesUnder() (+26 more)

### Community 31 - "column-rules.ts"
Cohesion: 0.04
Nodes (75): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts (+67 more)

### Community 32 - "format.test.ts"
Cohesion: 0.05
Nodes (56): Metadata, Step, FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource (+48 more)

### Community 33 - "declaration.ts"
Cohesion: 0.05
Nodes (52): SchemaWriteHandle, MigrationPart, ApiRegistry, BlockHeader, DefinedModule, FieldKind, FieldSchema, ItemDeclaration (+44 more)

### Community 34 - "entries.ts"
Cohesion: 0.04
Nodes (55): CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+47 more)

### Community 35 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (57): BodyExtrinsic, BlockBody, MetadataVariant, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent (+49 more)

### Community 36 - "child-processes.test.ts"
Cohesion: 0.04
Nodes (51): SignalTarget, ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, terminationSignal() (+43 more)

### Community 37 - "harness.ts"
Cohesion: 0.09
Nodes (47): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+39 more)

### Community 38 - "networks.ts"
Cohesion: 0.06
Nodes (53): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+45 more)

### Community 39 - "validation.ts"
Cohesion: 0.04
Nodes (51): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, PlacedDeclaration, Plain, DeepReadonly, PrivateKeys (+43 more)

### Community 4 - "ModuleDeclaration"
Cohesion: 0.02
Nodes (150): CoreChainFacts, ItemSink, ModuleDeclaration, PointName, EntryRange, GraphInput, ResolvedGraph, StartedModuleApi (+142 more)

### Community 40 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TreeNode, TypeRule, DesignTable (+24 more)

### Community 41 - "version-checks.ts"
Cohesion: 0.09
Nodes (35): MetadataNode, RuntimeMetadata, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, Answers (+27 more)

### Community 42 - "writer-lock-checks.ts"
Cohesion: 0.09
Nodes (40): WriterProcess, WorkerEvent, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf(), startWriterProcess() (+32 more)

### Community 43 - "NodeBlockSource"
Cohesion: 0.10
Nodes (11): HeadWait, NodeBlockSource, NodeHeader, PreparedBlock, QueueRunner, NoWindow, Refetches, TrustsNotifications (+3 more)

### Community 44 - "opt-out.test.ts"
Cohesion: 0.08
Nodes (43): SchemaPlan, Chain, ChainOptions, DigestRow, migrationPart(), identityRow(), captured(), captureFunction() (+35 more)

### Community 45 - "column-refusals.test.ts"
Cohesion: 0.08
Nodes (31): ModuleTable, ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, Case, freshDatabase() (+23 more)

### Community 46 - "ledger/types.ts"
Cohesion: 0.09
Nodes (30): LoadLedger, LedgerReleasePackage, ApplyInput, ApplyOutput, LedgerEvent, LedgerPackageOptions, LedgerTask, LogItem (+22 more)

### Community 47 - "cbor.ts"
Cohesion: 0.08
Nodes (41): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+33 more)

### Community 48 - "LedgerPackage"
Cohesion: 0.05
Nodes (30): LedgerEventKind, LedgerPackage, 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix, 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence (+22 more)

### Community 49 - "changes.property.test.ts"
Cohesion: 0.07
Nodes (42): CanonicalEncodingError, Op, States, TableName, encodeArrayHead(), encodeCanonical(), encodeRow(), contentsHash() (+34 more)

### Community 5 - "PgTransactionLeaseLayer"
Cohesion: 0.03
Nodes (152): TransactionHistoryReader, TransactionHistoryWriter, JsonEncoded, TxHistoryRow, Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError (+144 more)

### Community 50 - "runner/process.ts"
Cohesion: 0.07
Nodes (22): NodeWait, LoadedConfig, LoadOptions, ProcessReason, RetryCode, Process, ProcessCondition, ProcessConfig (+14 more)

### Community 51 - "db/durability-probe.test.ts"
Cohesion: 0.08
Nodes (30): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, Outcome, PostgresOptions, Writer (+22 more)

### Community 53 - "chain-placement.test.ts"
Cohesion: 0.12
Nodes (33): eventsRuntime, Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, inThreadParser() (+25 more)

### Community 54 - ".value"
Cohesion: 0.16
Nodes (20): MetadataStorage, MetadataStorageEntry, MetadataType, TypeDef, ScaleError, ScaleReader, ValueReader, field() (+12 more)

### Community 55 - "chain-events-decode.test.ts"
Cohesion: 0.08
Nodes (35): BlockEventSource, MetadataField, Primitive, isBlockEventSource(), systemEventsKey(), bindCoreChainEvents(), boundEventSource(), chainEventsItemOf() (+27 more)

### Community 58 - "boundary.test.ts"
Cohesion: 0.13
Nodes (34): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+26 more)

### Community 6 - "ingest-crash.test.ts"
Cohesion: 0.03
Nodes (152): BlockParsed, MetadataBlock, RuntimeMetadataEntry, NodeCallOptions, itemsSeen, BlockSpec, EventSpec, Json (+144 more)

### Community 61 - "transform-checks.ts"
Cohesion: 0.10
Nodes (16): Failure, Variant, until(), baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape(), expectVariantOutput() (+8 more)

### Community 62 - "differential-equivalence.test.ts"
Cohesion: 0.10
Nodes (32): Adapters, Fault, adaptersFor(), adaptersOf(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch() (+24 more)

### Community 64 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 65 - "change-capture.ts"
Cohesion: 0.12
Nodes (25): CapturedTable, CaptureState, GuardTableRow, optOut, captureDefinitions(), capturedTables(), captureFunctionName(), captureReady() (+17 more)

### Community 7 - "db/migrate.ts"
Cohesion: 0.03
Nodes (132): AppliedRow, Runnable, Settling, StartupInput, Difference, OwnPart, PlannedSchema, Provision (+124 more)

### Community 70 - "shadow-schema.test.ts"
Cohesion: 0.07
Nodes (17): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, CHECK_FUNCTIONS_SQL, CHECKED_TYPES (+9 more)

### Community 72 - "digest.test.ts"
Cohesion: 0.09
Nodes (29): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+21 more)

### Community 73 - "core-private-source.test.ts"
Cohesion: 0.09
Nodes (9): AdmittedKey, privateBackbone(), fakePublic(), fakeRead(), CORE_KEY_REGISTRY, CORE_KEY_REGISTRY_MIGRATIONS, NONE, PUBLIC_POLL_MS (+1 more)

### Community 75 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 76 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+15 more)

### Community 78 - "height-versioned.property.test.ts"
Cohesion: 0.13
Nodes (20): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Key, Model (+12 more)

### Community 79 - "module-tables.ts"
Cohesion: 0.09
Nodes (19): CaptureColumn, ModuleColumn, PageOptions, ColumnType, RefusalCode, RefusalPlace, describeTable(), moduleTables() (+11 more)

### Community 8 - "core-chain.test.ts"
Cohesion: 0.02
Nodes (108): BlockHeaderItem, BlockItemSource, CoreBlockHeader, QueuedBlock, Bound, ChainCheck, ChainCheckInput, ChainSource (+100 more)

### Community 80 - "redact.ts"
Cohesion: 0.13
Nodes (20): RedactionForms, SecretForm, TextPattern, Needs, configRedactor(), credentialsIn(), decoded(), kindOf() (+12 more)

### Community 81 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 82 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 83 - "tx-replay-decoder.ts"
Cohesion: 0.11
Nodes (23): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+15 more)

### Community 84 - "PgChainArchiveStore"
Cohesion: 0.19
Nodes (10): BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf(), sha256Hex() (+2 more)

### Community 86 - "ref_node_child_process"
Cohesion: 0.09
Nodes (21): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), end(), removeContainers(), check, checker (+13 more)

### Community 89 - "containers.test.ts"
Cohesion: 0.10
Nodes (16): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, removeAttempt(), startContainers(), parentWithContainer(), LABEL_ATTEMPT (+8 more)

### Community 9 - "UmbraError"
Cohesion: 0.03
Nodes (106): CommittedHeight, Database, ReadOnlyDatabase, ReadOptions, Transaction, ReadTimeoutSetting, MultiStatementRunner, Job (+98 more)

### Community 90 - "full-sync-soak.integration.test.ts"
Cohesion: 0.08
Nodes (13): Adapters, GcPass, HistGroup, SampleObservation, adaptersOf(), kvMapKey(), newPool(), readCurrentState() (+5 more)

### Community 91 - "private/backends.ts"
Cohesion: 0.14
Nodes (15): PrivateBackend, SessionSeen, A112Observation, Wiring, a146RefusalProblems(), schemaPlan(), a112Run(), PRIVATE_BACKENDS (+7 more)

### Community 92 - "ChainArchiveStore"
Cohesion: 0.09
Nodes (10): ChainArchiveStore, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents, `transactions` (chain_archive) (+2 more)

### Community 93 - "pglite-writer.worker.ts"
Cohesion: 0.16
Nodes (17): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor() (+9 more)

### Community 94 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 96 - "node-source.ts"
Cohesion: 0.13
Nodes (17): ExtrinsicCall, CoreBlockItems, MetadataPallet, RuntimeMetadataView, NodeSourceOptions, Prefetch, NodeSubscription, SourceCondition (+9 more)

### Community 97 - "PgliteDatabase"
Cohesion: 0.19
Nodes (5): JobQueue, PgliteDatabase, handleClosed(), failedEarlier(), openOn()

### Community 98 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (17): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind (+9 more)

### Community 214 - "Problem"
Cohesion: 0.33
Nodes (4): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix

### Community 102 - "vendored-ledger-v9.test.ts"
Cohesion: 0.25
Nodes (18): freeAll(), bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex() (+10 more)

### Community 105 - "mapping.test.ts"
Cohesion: 0.14
Nodes (10): mapRows(), mapValue(), parseJsonLossless(), identity(), RESULT_TYPES, RFC-3339, 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence (+2 more)

### Community 110 - "address"
Cohesion: 0.12
Nodes (17): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite (+9 more)

### Community 133 - "repository"
Cohesion: 0.14
Nodes (15): repository(), 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA (+7 more)

### Community 135 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 137 - "pg"
Cohesion: 0.15
Nodes (12): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 2. Node-side query correlation (+4 more)

### Community 142 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 153 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 156 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value (+3 more)

### Community 161 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 166 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 176 - ".query"
Cohesion: 0.24
Nodes (8): readPrivateCursor(), present(), readPublicBlock(), snapshot(), "on-after-db-write"(), "on-compute"(), problems(), rowCounts()

### Community 185 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 204 - ".boolean"
Cohesion: 0.33
Nodes (6): Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 242 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 25 - "T"
Cohesion: 0.02
Nodes (88): T(), 1. TemporalKV — event-sourced right action with a CAS guard, 5.1 Layer A: per-key temporal history, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window (+80 more)

### Community 252 - "Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep"
Cohesion: 0.50
Nodes (3): Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Scenario: Reused content after a deletion, Scenario: Same deletions on two machines

### Community 52 - "version"
Cohesion: 0.05
Nodes (41): version(), 1. The invariant: the cursor is never ahead of its data, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()` (+33 more)

### Community 59 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 60 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 67 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): listen(), ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret (+25 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): integer(), ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 87 - "table"
Cohesion: 0.09
Nodes (24): table(), Data that is not a function of the chain, Height-versioned tables, 6. Determinism, Requirement: DB-6 Each module's schema is guarded by its own database role, Scenario: Writing into another module's schema is rejected by the database, Requirement: LG-16 What `core-ledger-state` provides, Scenario: A partially successful transaction (+16 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.09
Nodes (20): 1. Schema, ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+12 more)

### Community 101 - "package.json"
Cohesion: 0.10
Nodes (20): bin, umbradb, description, exports, files, homepage, license, main (+12 more)

### Community 106 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 109 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 114 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 120 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.12
Nodes (16): 0. Package layout, 2.1 Where the probe runs (the one real design decision), 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire (+8 more)

### Community 121 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 125 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 126 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+7 more)

### Community 128 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 132 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 136 - "README.md"
Cohesion: 0.24
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 139 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 141 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 144 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 145 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 147 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 150 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 151 - "UmbraDB module guide"
Cohesion: 0.17
Nodes (11): Cursor tables, Migrations, Private modules, Reading through `db`, Start and stop heights, Stored values and digests, Time values, UmbraDB module guide (+3 more)

### Community 152 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.17
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

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

### Community 163 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 167 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 168 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 169 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 170 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 171 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer) (+1 more)

### Community 172 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 173 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 174 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 175 - "UmbraDB"
Cohesion: 0.20
Nodes (10): Contents, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB, Verification: what is proved, checked, and tested (+2 more)

### Community 178 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.22
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 179 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 180 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.22
Nodes (9): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 8. Test infrastructure (open decision — resolve in Task 1) (+1 more)

### Community 181 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 182 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 183 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
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

### Community 191 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 192 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 193 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 194 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 195 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 196 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

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

### Community 202 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 203 - "Security policy & threat model"
Cohesion: 0.29
Nodes (7): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

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

### Community 211 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 212 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 213 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 215 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.33
Nodes (5): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Problem, Resolution, Suggested fix

### Community 216 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 217 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 218 - "Requirement: TransactionKeyReuseError is now reachable through the public put() API"
Cohesion: 0.33
Nodes (5): ADDED Requirements, MODIFIED Requirements, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API, temporal-kv (transaction-participation wiring)

### Community 219 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 220 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 221 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 222 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 223 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 224 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 225 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 226 - "Performance — design"
Cohesion: 0.33
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 227 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 228 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 229 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 230 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 231 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 232 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 233 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 234 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 235 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 236 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 237 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 238 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 239 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 240 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 243 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 244 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 245 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 246 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 247 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 248 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 249 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 250 - "Requirement: DB-15 Timeouts by connection role"
Cohesion: 0.50
Nodes (4): Requirement: DB-15 Timeouts by connection role, Scenario: A hung API query is cut off, Scenario: A long migration is never cut off, Scenario: The writer keeps its session between blocks

### Community 251 - "Requirement: DB-8 Schema names are unambiguous"
Cohesion: 0.50
Nodes (4): Requirement: DB-8 Schema names are unambiguous, Scenario: An id that aliases a backbone schema, Scenario: An id that is too long, Scenario: Two providers of one item with different migrations

### Community 253 - "Requirement: MD-4 Modules start mid-chain only when they promise it"
Cohesion: 0.50
Nodes (4): Requirement: MD-4 Modules start mid-chain only when they promise it, Scenario: A late module on a provider that has run all along, Scenario: A module that needs history, at an S above genesis, Scenario: A module that needs history from S

### Community 254 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 255 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 256 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 260 - "9. Backups and browser"
Cohesion: 0.67
Nodes (3): 9.1 Backups (BK; Q83, Q85), 9.2 Browser build (BR), 9. Backups and browser

### Community 261 - "Requirement: DB-10 Migrations of an upgrade never change stored values"
Cohesion: 0.67
Nodes (3): Requirement: DB-10 Migrations of an upgrade never change stored values, Scenario: A version that needs a resync, as an upgrade, Scenario: Restarting a database built with that version

### Community 262 - "Requirement: set is an idempotent, unconditional overwrite (Law W1)"
Cohesion: 0.67
Nodes (3): Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A new set always overwrites, with no conflict possible, Scenario: Setting the same value twice leaves the stored state unchanged

### Community 263 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 56 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 57 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 63 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 66 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 68 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-17 Ledger tasks give modules the native objects, Requirement: LG-1 Each block's ledger version comes from its `MNSV` digest (+23 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 71 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height, Requirement: DB-3 Writes only through a write handle (+22 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 85 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.08
Nodes (26): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+18 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-5 Independent instances lag as they need (+16 more)

### Community 99 - "ROADMAP.md"
Cohesion: 0.10
Nodes (16): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+8 more)

## Knowledge Gaps
- **47 isolated node(s):** `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx`, `typedoc`, `@types/node` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3081 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `createClient`, `PgTransactionHistoryStorage`, `src/index.ts`, `ValidationError`, `ModuleDeclaration`, `PgTransactionLeaseLayer`, `ingest-crash.test.ts`, `db/migrate.ts`, `core-chain.test.ts`, `UmbraError`, `tape/index.ts`, `admin-harness.ts`, `config/history.ts`, `chain-process.test.ts`, `node/client.test.ts`, `FinalizedLoop`, `api-server.test.ts`, `NodeClient`, `core-config.test.ts`, `range.ts`, `PgTemporalKV`, `process-admin.ts`, `adapter.ts`, `builder.test.ts`, `ReadHandle`, `adapter-fixtures.ts`, `validate.ts`, `config-check.ts`, `graph.ts`, `format.test.ts`, `declaration.ts`, `entries.ts`, `child-processes.test.ts`, `networks.ts`, `validation.ts`, `column-rules.test.ts`, `version-checks.ts`, `writer-lock-checks.ts`, `opt-out.test.ts`, `column-refusals.test.ts`, `ledger/types.ts`, `changes.property.test.ts`, `db/durability-probe.test.ts`, `chain-placement.test.ts`, `chain-events-decode.test.ts`, `boundary.test.ts`, `transform-checks.ts`, `differential-equivalence.test.ts`, `cbor.property.test.ts`, `shadow-schema.test.ts`, `digest.test.ts`, `core-private-source.test.ts`, `crash.test.ts`, `height-versioned.property.test.ts`, `redact.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `ref_node_child_process`, `containers.test.ts`, `full-sync-soak.integration.test.ts`, `private/backends.ts`, `block-fetch-decode.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `package.json`, `vendored-ledger-v9.test.ts`, `mapping.test.ts`, `binding.test.ts`, `identity.ts`, `intake.test.ts`, `node-store-suite.ts`, `ws-mutual-tls.test.ts`, `validation.test.ts`, `read-height.property.test.ts`, `pglite-timeouts.test.ts`, `mutation-per-adapter.mjs`, `twox.ts`, `excluded-not-exported.test.ts`, `upgrade-boundary.test.ts`, `facade-merge-loader.ts`, `history.property.test.ts`, `Heartbeat`, `component-table.test.ts`?**
  _High betweenness centrality (0.335) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.015567765567765568 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `ModuleDeclaration`, `ingest-crash.test.ts`, `db/migrate.ts`, `core-chain.test.ts`, `tape/index.ts`, `admin-harness.ts`, `config/history.ts`, `chain-process.test.ts`, `node/client.test.ts`, `FinalizedLoop`, `api-server.test.ts`, `NodeClient`, `core-config.test.ts`, `range.ts`, `process-admin.ts`, `upgrade-boundary.test.ts`, `ReadHandle`, `validate.ts`, `config-check.ts`, `graph.ts`, `vitest`, `Session`, `declaration.ts`, `entries.ts`, `networks.ts`, `validation.ts`, `version-checks.ts`, `writer-lock-checks.ts`, `NodeBlockSource`, `opt-out.test.ts`, `ledger/types.ts`, `cbor.ts`, `LedgerPackage`, `changes.property.test.ts`, `runner/process.ts`, `db/durability-probe.test.ts`, `shadow-schema.test.ts`, `core-private-source.test.ts`, `mapping.ts`, `module-tables.ts`, `pglite-writer.worker.ts`, `node-source.ts`, `PgliteDatabase`, `mapping.test.ts`, `identity.ts`, `validation.test.ts`, `checkShape`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `PgTransactionHistoryStorage` be split into smaller, more focused modules?**
  _Cohesion score 0.014295476288096215 - nodes in this community are weakly interconnected._