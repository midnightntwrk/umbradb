# Graph Report - UmbraDB

## Corpus Check
- 870 files · ~1,332,269 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 9201 nodes · 26838 edges · 282 communities (260 shown, 22 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 3163 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `5da66a40f5e36bb9` (870 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionHistoryStorage
- src/index.ts
- admin-harness.ts
- crash.test.ts
- tape/command.test.ts
- config-check.ts
- block-fetch-decode.test.ts
- tx-replay-decoder.ts
- tape/index.ts
- ModuleApi
- height
- ChainArchiveStore
- core-ledger-state.ts
- BlobIntegrityError
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- binding.test.ts
- HeightRun
- determinism-checks.ts
- intake.test.ts
- writer-lock-checks.ts
- readiness.test.ts
- chain-events-source.test.ts
- height-versioned.property.test.ts
- 3. Proof-blocking findings
- declaration.ts
- builds.ts
- checkShape
- chain-archive-rollover.ts
- core-config.test.ts
- attempt
- deterministic-postgresql/checks.ts
- read-height.property.test.ts
- no-indexer-or-wallet-sdk.test.ts
- vitest
- component-table.test.ts
- config/history.ts
- holds
- ApiRoutes
- ingest-harness.ts
- type-check.ts
- socket.ts
- record-and-replay.test.ts
- UmbraDBSql
- PgWatermarks
- a114Run
- createClient
- mutation-evidence.d.mts
- module-tables.ts
- adapter.ts
- column-rules.ts
- process-admin.ts
- ledger/types.ts
- ReadOnlyDatabase
- LoopEnd
- db/backends.ts
- adapter-fixtures.ts
- child-processes.test.ts
- runMigrations
- runner/process.ts
- node-format.ts
- version-checks.ts
- node.test.ts
- .value
- history-startup.ts
- entries.ts
- NodeBlockSource
- networks.ts
- node/client.test.ts
- db/migrate.ts
- harness.ts
- post-block-update-checks.ts
- LedgerPackage
- node/client.ts
- chain-placement.test.ts
- chain-process.test.ts
- config-check-database.test.ts
- column-rules.test.ts
- range.ts
- module-api.test.ts
- PgTransactionLeaseLayer
- transform-checks.ts
- cbor.ts
- FinalizedLoop
- NodeClient
- plain-data.ts
- builder.test.ts
- changes.property.test.ts
- graph.ts
- postgres/chain-archive-store.ts
- translatePostgresError
- dispatch.test.ts
- real-tapes.ts
- failures.ts
- chain-data.test.ts
- node-bridge.ts
- change-capture.ts
- api-server.test.ts
- ws-mutual-tls.test.ts
- loop.test.ts
- validate.test.ts
- digests.test.ts
- cbor.property.test.ts
- ledger-state.test.ts
- core-private-source.ts
- chain-data.negative-control.test.ts
- boundary.test.ts
- UmbraError
- validation.ts
- validate.ts
- BlockRef
- .show
- api-server.ts
- core-block-fetch.test.ts
- order.property.test.ts
- 5. Runner
- InMemoryBlockSource
- core-private-source.test.ts
- mapping.ts
- LedgerEngine
- redact.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- private/backends.ts
- Tasks — v1.0.0-infosec-signoff
- ADDED Requirements
- halted
- pg
- mapping.test.ts
- address
- version
- shadow-schema.test.ts
- twox.ts
- facade-merge-loader.ts
- ADDED Requirements
- 001_chain_archive_core.ts
- pack-install.mjs
- scoped-review-manifest
- .boolean
- orphan-watcher.mjs
- Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data
- fresh-instance.mjs
- T
- ADDED Requirements
- graph.py
- table
- ADDED Requirements
- ADDED Requirements
- ROADMAP.md
- Storage Algebra Lean Formalization — Approved Design and Status
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- package.json
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- Design — Postgres+JSONB storage rebuild
- Full-Chain Storage — Design
- stryker.conf.json
- UmbraDB module guide
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- Design — v1.0.0-durable-checkpoint-cursor
- devDependencies
- UmbraDB v0.9.5 "Penumbra" — Release Record
- README.md
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Roadmap
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- UmbraDB
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- Security policy & threat model
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Algebraic Specification of the midnight-pg-store Storage Layer
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-perf-baseline
- Tasks — v1.0.0-perf-baseline
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
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00023 — The blocks table's height partitions end at 5,000,000
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Acceptance criteria — v1.0.0-perf-baseline
- Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference
- Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence
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
- bin
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 274 edges
2. `UmbraError` - 220 edges
3. `ModuleDeclaration` - 129 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `runMigrations()` - 90 edges
6. `ValidationError` - 87 edges
7. `PgCheckpointStore` - 87 edges
8. `NodeClient` - 87 edges
9. `Database` - 84 edges
10. `InMemoryBlockSource` - 82 edges

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

## Communities (282 total, 22 thin omitted)

### Community 0 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (204): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryEntry (+196 more)

### Community 1 - "src/index.ts"
Cohesion: 0.02
Nodes (192): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStore, CheckpointStoreError, CheckpointSummary, ChunkIntegrityError, ChunkMissingError (+184 more)

### Community 10 - "admin-harness.ts"
Cohesion: 0.04
Nodes (112): AdminServer, coreEntry, versionEntry, AdminRun, Answered, Answerer, Expected, gate (+104 more)

### Community 100 - "crash.test.ts"
Cohesion: 0.12
Nodes (22): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+14 more)

### Community 104 - "tape/command.test.ts"
Cohesion: 0.11
Nodes (8): ScriptedNode, RecordAndReplayResult, started(), fakeResult(), withScripted(), withChain(), started(), withScripted()

### Community 106 - "config-check.ts"
Cohesion: 0.10
Nodes (21): CheckFinding, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, databaseFinding() (+13 more)

### Community 107 - "block-fetch-decode.test.ts"
Cohesion: 0.14
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), concatBytes(), encodeCompact() (+10 more)

### Community 109 - "tx-replay-decoder.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+12 more)

### Community 11 - "tape/index.ts"
Cohesion: 0.04
Nodes (85): Failure, Variant, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest, RequestId (+77 more)

### Community 111 - "ModuleApi"
Cohesion: 0.17
Nodes (9): Connection, ModuleApi, errorMessage(), encodeJson(), hex(), matches(), read(), specificity() (+1 more)

### Community 114 - "height"
Cohesion: 0.12
Nodes (18): Broken, height(), 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy (+10 more)

### Community 115 - "ChainArchiveStore"
Cohesion: 0.10
Nodes (7): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations, Boundary enforcement, Table of contents, UmbraDB Postgres Schema Reference

### Community 12 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (108): BlockParsedOptions, BlockTransaction, ChainEvent, CoreLedgerStateOptions, BlockContext, ItemSink, StandInOptions, Commit (+100 more)

### Community 120 - "BlobIntegrityError"
Cohesion: 0.20
Nodes (12): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+4 more)

### Community 122 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.11
Nodes (17): Hash, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence) (+9 more)

### Community 126 - "binding.test.ts"
Cohesion: 0.15
Nodes (12): TestDatabase, A113Observation, Binding, Outcome, privateCursorHeight(), a113Run(), bindingIn(), outcomeOf() (+4 more)

### Community 127 - "HeightRun"
Cohesion: 0.12
Nodes (8): HeightRun, SkipsAfterReconnect, Batching, LateRedelivery, SkipsStartAtRestart, CommitsDespiteLastWrite, ComputeAtH, StartsAtEveryRevision

### Community 128 - "determinism-checks.ts"
Cohesion: 0.20
Nodes (16): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, PRIVATE_ROWS_SQL(), privateModule(), a146Hashes(), a146Refusals() (+8 more)

### Community 129 - "intake.test.ts"
Cohesion: 0.20
Nodes (16): PrivateSeen, PublicCore, A114Observation, A116Observation, against(), directPublic(), a114Problems(), a116Problems() (+8 more)

### Community 13 - "writer-lock-checks.ts"
Cohesion: 0.04
Nodes (76): Held, PgliteLockUse, PostgresOptions, CheckTarget, CliBackend, Snapshot, WriterProcess, Job (+68 more)

### Community 132 - "readiness.test.ts"
Cohesion: 0.18
Nodes (13): ProcessState, Decision, ReadinessCase, ae4(), caseText(), readinessProblems(), holding(), observedProblems() (+5 more)

### Community 133 - "chain-events-source.test.ts"
Cohesion: 0.15
Nodes (10): NodeCallOptions, RecordingClient, open(), quiet(), eventsRead(), in8Methods(), outsideIn8(), chain (+2 more)

### Community 135 - "height-versioned.property.test.ts"
Cohesion: 0.12
Nodes (16): Block, BlockFails, Counts, Effect, Key, Op, canonicalText(), readBack() (+8 more)

### Community 137 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 14 - "declaration.ts"
Cohesion: 0.03
Nodes (66): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, ApiRegistry (+58 more)

### Community 144 - "builds.ts"
Cohesion: 0.23
Nodes (13): PrivateProcess, PrivateRefusal, genesisBlock(), genesisHex(), launchPrivate(), poll(), privateCoreEntry(), publicCoreEntry() (+5 more)

### Community 147 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 149 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 15 - "core-config.test.ts"
Cohesion: 0.05
Nodes (74): adminRoutes, AdminChannel, AdminServeOptions, ToAdmin, AdminStartOptions, AdminAnswer, AdminEndpoint, AdminPart (+66 more)

### Community 150 - "attempt"
Cohesion: 0.16
Nodes (13): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+5 more)

### Community 155 - "deterministic-postgresql/checks.ts"
Cohesion: 0.18
Nodes (13): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, checkFunctionsSql(), numericOkPredicate(), refusedNumbersPath() (+5 more)

### Community 156 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 159 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 16 - "vitest"
Cohesion: 0.03
Nodes (59): FromAdmin, Finding, Lockfile, Manifest, RepositoryFile, Upstream, GuardViolation, ReportedTest (+51 more)

### Community 166 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 17 - "config/history.ts"
Cohesion: 0.04
Nodes (89): CoreVersion, HistoryCode, HistoryContext, HistoryFinding, HistoryOptions, Span, Finding, UpgradeEntry (+81 more)

### Community 173 - "holds"
Cohesion: 0.41
Nodes (5): VersionedValue, StoredVersion, Model, holds(), store

### Community 178 - "ApiRoutes"
Cohesion: 0.24
Nodes (5): ApiRoutes, AcceptsDuplicates, parsePath(), shapeOf(), routesOf()

### Community 18 - "ingest-harness.ts"
Cohesion: 0.05
Nodes (82): BlockHeader, Scenario, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded (+74 more)

### Community 187 - "type-check.ts"
Cohesion: 0.36
Nodes (8): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), isRegularFile(), packageType(), typeCheckFile(), typescript

### Community 188 - "socket.ts"
Cohesion: 0.24
Nodes (5): Connection, NodeSocket, NodeSocketEvents, SocketFailure, DEFAULT_HEARTBEAT_MS

### Community 19 - "record-and-replay.test.ts"
Cohesion: 0.04
Nodes (54): NodeClientOptions, NodeRetry, ConnectSocket, Script, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions (+46 more)

### Community 2 - "UmbraDBSql"
Cohesion: 0.02
Nodes (169): BenchEnv, JsonValue, UmbraDBSql, KvRow, Adapters, BatchSpec, CurrentState, InvariantResult (+161 more)

### Community 20 - "PgWatermarks"
Cohesion: 0.03
Nodes (65): WatermarkKey, WatermarkKind, Watermarks, WatermarkValue, PgWatermarks, WatermarkRow, CoTxCallable, CoTxPauseInfo (+57 more)

### Community 21 - "createClient"
Cohesion: 0.05
Nodes (57): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, Started, SqliteTxRow, BlockRow, TxRow (+49 more)

### Community 212 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 22 - "module-tables.ts"
Cohesion: 0.04
Nodes (54): CaptureColumn, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions (+46 more)

### Community 23 - "adapter.ts"
Cohesion: 0.04
Nodes (70): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+62 more)

### Community 24 - "column-rules.ts"
Cohesion: 0.03
Nodes (91): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts (+83 more)

### Community 25 - "process-admin.ts"
Cohesion: 0.05
Nodes (65): OpenedConfig, ProcessAdmin, ProcessAdminOptions, RevisionSettings, DigestRow, ModuleFacts, PartTable, SnapshotFacts (+57 more)

### Community 26 - "ledger/types.ts"
Cohesion: 0.05
Nodes (59): LoadLedger, TransactionParser, LedgerStateItem, LedgerName, ApplyOutput, ChainOutcome, LedgerPackageOptions, LedgerTask (+51 more)

### Community 27 - "db/backends.ts"
Cohesion: 0.05
Nodes (53): Settings, Case, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer (+45 more)

### Community 28 - "adapter-fixtures.ts"
Cohesion: 0.07
Nodes (63): StoredNode, Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerAnswer, AdapterWorkerHost (+55 more)

### Community 29 - "child-processes.test.ts"
Cohesion: 0.04
Nodes (62): ParentJob, Kill, Orphaned, SourceFile, FailsOnceStarted, SlowToReportPorts, SourceFile, Run (+54 more)

### Community 3 - "runMigrations"
Cohesion: 0.02
Nodes (180): CheckpointStoreErrorCode, ConnectionError, SharedStorageErrorCode, StorageError, TemporalKVErrorCode, Rollback, TransactionLeaseErrorCode, TransactionRollbackCause (+172 more)

### Community 30 - "runner/process.ts"
Cohesion: 0.05
Nodes (56): ConfigFacts, OpenedFacts, AdminStarter, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, CoreChainFacts (+48 more)

### Community 31 - "node-format.ts"
Cohesion: 0.07
Nodes (52): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+44 more)

### Community 32 - "version-checks.ts"
Cohesion: 0.06
Nodes (52): CoreBlockItems, LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry (+44 more)

### Community 33 - "node.test.ts"
Cohesion: 0.05
Nodes (29): ManualTimers, Metadata, Step, Frame, RawClient, Failure, Variant, TapeClock (+21 more)

### Community 34 - ".value"
Cohesion: 0.08
Nodes (44): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+36 more)

### Community 35 - "history-startup.ts"
Cohesion: 0.05
Nodes (39): HistoryRule, AppliedMigration, ProcessContexts, ProcessItems, PublishRefusal, ChainStarted, Started, StartupOptions (+31 more)

### Community 36 - "entries.ts"
Cohesion: 0.04
Nodes (65): LedgerTableSettings, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+57 more)

### Community 37 - "NodeBlockSource"
Cohesion: 0.07
Nodes (25): BlockEventSource, RuntimeMetadataView, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeSubscription, NodeHeader (+17 more)

### Community 38 - "networks.ts"
Cohesion: 0.05
Nodes (61): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+53 more)

### Community 39 - "node/client.test.ts"
Cohesion: 0.05
Nodes (32): Answer, FakeNode, Handler, Received, recorded, "on-compute"(), result(), caught() (+24 more)

### Community 4 - "db/migrate.ts"
Cohesion: 0.03
Nodes (130): Bound, SchemaWriteHandle, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference (+122 more)

### Community 40 - "harness.ts"
Cohesion: 0.09
Nodes (46): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+38 more)

### Community 41 - "post-block-update-checks.ts"
Cohesion: 0.07
Nodes (45): LedgerReleasePackage, ApplyInput, RawPackage, AdapterWorkerRequest, Decimal, Fullness, OracleAfter, oracleCase (+37 more)

### Community 42 - "LedgerPackage"
Cohesion: 0.05
Nodes (32): LedgerPackage, LedgerWorkerFailure, released(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix, 00019 — `evictKeys` does not refuse the root node of a live ledger state (+24 more)

### Community 43 - "node/client.ts"
Cohesion: 0.10
Nodes (43): State, Subscription, NodeBlock, NodeRuntimeVersion, NodeCallMethod, SubscribeMethod, Final, positive() (+35 more)

### Community 44 - "chain-placement.test.ts"
Cohesion: 0.09
Nodes (44): Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, chainHashOf(), inThreadParser() (+36 more)

### Community 45 - "chain-process.test.ts"
Cohesion: 0.05
Nodes (45): SignalTarget, Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation (+37 more)

### Community 46 - "config-check-database.test.ts"
Cohesion: 0.07
Nodes (39): CommandHandler, CommandIo, MainProcess, CheckStep, cliProject, CommandResult, checkArguments(), configCommand() (+31 more)

### Community 47 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (31): Because, columnVerdict, DefaultPart, keyOrder, PlacedRefusal, Refusal, TableRule, TreeNode (+23 more)

### Community 48 - "range.ts"
Cohesion: 0.06
Nodes (51): BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange, Height (+43 more)

### Community 49 - "module-api.test.ts"
Cohesion: 0.05
Nodes (44): ChainDataView, ApiError, ApiErrorCode, ApiRequest, HttpMethod, ModuleApiOptions, ModuleRegistration, PathSegment (+36 more)

### Community 5 - "PgTransactionLeaseLayer"
Cohesion: 0.03
Nodes (141): TransactionHistoryReader, TransactionHistoryWriter, Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionFaultError (+133 more)

### Community 50 - "transform-checks.ts"
Cohesion: 0.10
Nodes (36): TransformError, reason(), baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape(), expectVariantOutput(), forkRecords() (+28 more)

### Community 51 - "cbor.ts"
Cohesion: 0.08
Nodes (43): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+35 more)

### Community 52 - "FinalizedLoop"
Cohesion: 0.08
Nodes (14): FinalizedLoop, LoopObserver, Startup, PublicCoreOptions, WaitingInRead, ItemsAfterWrite, FailingAfter, WritingLoop (+6 more)

### Community 54 - "NodeClient"
Cohesion: 0.09
Nodes (20): CoreChainBinding, HeadSubscriber, NodeClient, Pending, Waiter, connectionFailure, NodeMethod, NodeTimers (+12 more)

### Community 55 - "plain-data.ts"
Cohesion: 0.06
Nodes (39): LoadedConfig, LoadOptions, PlainArray, plainData, PlainDataNode, PlainDataRule, Walk, Row (+31 more)

### Community 56 - "builder.test.ts"
Cohesion: 0.07
Nodes (28): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Link, TapeBuilder (+20 more)

### Community 57 - "changes.property.test.ts"
Cohesion: 0.06
Nodes (44): ChangeKind, tableChanges, TouchedRow, Op, States, TableName, digestBlock(), encodeCanonical() (+36 more)

### Community 58 - "graph.ts"
Cohesion: 0.07
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, HeightRange, MidChain, Missing, RangeCheck (+39 more)

### Community 59 - "postgres/chain-archive-store.ts"
Cohesion: 0.10
Nodes (27): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+19 more)

### Community 6 - "translatePostgresError"
Cohesion: 0.02
Nodes (131): AsOf, AssertExact, Key, Namespace, Scope, TemporalKV, TemporalKVError, TransactionKeyReuseError (+123 more)

### Community 60 - "dispatch.test.ts"
Cohesion: 0.07
Nodes (35): PointName, CallbackFailure, PointArguments, PointRun, HeightFailure, Misuse, CallEvent, Recorder (+27 more)

### Community 61 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError, TapeTestOptions (+26 more)

### Community 63 - "failures.ts"
Cohesion: 0.09
Nodes (21): StartedModuleApi, ProcessReason, ReasonCode, RetryCode, Unwrapped, Process, RetryCondition, StatusFacts (+13 more)

### Community 64 - "chain-data.test.ts"
Cohesion: 0.10
Nodes (38): BlockSpec, EventSpec, transactionSpec, eventsRuntime, LedgerHeight, ledgerScenario, LedgerScenarioOptions, a91RangeScenario() (+30 more)

### Community 65 - "node-bridge.ts"
Cohesion: 0.08
Nodes (27): ChildReader, NodeStore, EngineOptions, BridgeServer, bridgeStore, Growable, childRefKeys(), readChildren() (+19 more)

### Community 66 - "change-capture.ts"
Cohesion: 0.09
Nodes (31): CapturedTable, CaptureState, GuardTableRow, optOut, captureDefinitions(), capturedTables(), captureFunctionName(), captureReady() (+23 more)

### Community 67 - "api-server.test.ts"
Cohesion: 0.08
Nodes (28): ChainDataAnswer, HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, AppendsVersion, Client, VersionsAnswersOnly (+20 more)

### Community 68 - "ws-mutual-tls.test.ts"
Cohesion: 0.06
Nodes (30): Attempt, gateAdapters(), tallyMutants(), server(), locked(), connect(), file(), makeCa() (+22 more)

### Community 7 - "loop.test.ts"
Cohesion: 0.03
Nodes (121): Database, DurabilityViolation, SchemaPlan, ErrorCode, Revision, EntryRange, GraphInput, ResolvedGraph (+113 more)

### Community 70 - "validate.test.ts"
Cohesion: 0.07
Nodes (32): ConfigRule, EntryRef, CursorRow, Expected, declarations(), input(), refusal(), rowInput() (+24 more)

### Community 71 - "digests.test.ts"
Cohesion: 0.09
Nodes (36): Chain, ChainOptions, DigestRow, identityRow(), captured(), triggerEnabled(), blockAt(), checkpointRows() (+28 more)

### Community 72 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (36): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+28 more)

### Community 75 - "ledger-state.test.ts"
Cohesion: 0.11
Nodes (32): LedgerTx, recordedGenesis, ProcessBackend, FoundTape, a106Problems(), a107Problems(), a99Problems(), blockZeroProblems() (+24 more)

### Community 77 - "core-private-source.ts"
Cohesion: 0.12
Nodes (23): PrivateBlockSource, privateIntake, PrivateIntakeOptions, PublicDatabase, PublicIdentity, PublicWakes, PrivateOptions, readIdentity() (+15 more)

### Community 78 - "chain-data.negative-control.test.ts"
Cohesion: 0.09
Nodes (32): BodyExtrinsic, BlockBody, BlockParsed, ChainTransaction, EventPhase, itemsSeen, Json, bytesArgument() (+24 more)

### Community 79 - "boundary.test.ts"
Cohesion: 0.13
Nodes (33): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+25 more)

### Community 8 - "UmbraError"
Cohesion: 0.03
Nodes (88): ReadDatabaseOptions, CommittedHeight, ReadOptions, Transaction, DurabilityProbeOptions, DurabilityWarning, ProbeSession, ReadTimeoutSetting (+80 more)

### Community 80 - "validation.ts"
Cohesion: 0.07
Nodes (31): DeclarationRule, Plain, Case, ShapeCase, Stats, first(), validateWith(), failures() (+23 more)

### Community 81 - "validate.ts"
Cohesion: 0.11
Nodes (34): CursorRule, Issue, Plain, SettingsSchema, coreSettingsSchema(), pathOf(), closest(), configFindings() (+26 more)

### Community 82 - "BlockRef"
Cohesion: 0.09
Nodes (14): BlockLedgerSource, QueuedBlock, LedgerBinding, BlockItems, BlockRef, InMemorySourceOptions, EventsRunner, Fetching (+6 more)

### Community 83 - ".show"
Cohesion: 0.07
Nodes (22): AllowedDetail, schemaName(), module(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 85 - "api-server.ts"
Cohesion: 0.09
Nodes (27): HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, VersionedResponse, ApiResponse, ApiStartup, answerHead() (+19 more)

### Community 87 - "core-block-fetch.test.ts"
Cohesion: 0.09
Nodes (13): BlockHeaderItem, BlockItemSource, CoreBlockHeader, bindCoreBlockFetch(), coreBlockFetchOnFetch(), isBlockItemSource(), failingSource(), chainBackbone() (+5 more)

### Community 88 - "order.property.test.ts"
Cohesion: 0.10
Nodes (29): CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce(), checkParallelWaits() (+21 more)

### Community 89 - "5. Runner"
Cohesion: 0.15
Nodes (27): Callback, EntryBoundary, ParallelPoint, PointSchedule, UnexpectedCursor, CoreStopsFirst, boundaryModules(), dispatch() (+19 more)

### Community 9 - "InMemoryBlockSource"
Cohesion: 0.04
Nodes (89): BlockSource, FinalityStallCondition, InMemoryBlockSource, InMemoryItems, Wait, LoopInput, ProcessHandle, ProcessingEnd (+81 more)

### Community 90 - "core-private-source.test.ts"
Cohesion: 0.09
Nodes (8): AdmittedKey, privateBackbone(), fakePublic(), fakeRead(), CORE_KEY_REGISTRY, CORE_KEY_REGISTRY_MIGRATIONS, NONE, PRIVATE_CORE_DIGEST

### Community 91 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 92 - "LedgerEngine"
Cohesion: 0.15
Nodes (12): LedgerEngine, hexOf(), idOf(), same(), sameBytes(), run(), atGenesis(), blankGenesis() (+4 more)

### Community 96 - "redact.ts"
Cohesion: 0.13
Nodes (21): RedactionForms, SecretForm, TextPattern, Needs, findings(), configRedactor(), credentialsIn(), decoded() (+13 more)

### Community 97 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 98 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 99 - "private/backends.ts"
Cohesion: 0.12
Nodes (19): PrivateBackend, SessionSeen, A112Observation, Wiring, pgliteBackend(), startPrivate(), a146HashProblems(), a146RefusalProblems() (+11 more)

### Community 101 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.08
Nodes (23): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1** (+15 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): integer(), ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+18 more)

### Community 110 - "halted"
Cohesion: 0.10
Nodes (21): bindCoreChainEvents(), halted(), 2. Points, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness (+13 more)

### Community 113 - "pg"
Cohesion: 0.11
Nodes (17): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 1. Postgres-side profiling (+9 more)

### Community 121 - "mapping.test.ts"
Cohesion: 0.14
Nodes (8): mapValue(), parseJsonLossless(), identity(), RFC-3339, 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 123 - "address"
Cohesion: 0.12
Nodes (17): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite (+9 more)

### Community 124 - "version"
Cohesion: 0.11
Nodes (17): version(), Requirement: PP-4 The process transport, Scenario: A read through the core, 3. The freeze: build + package.json (G1), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Scenario: The kv_current HOT ratio is measured and recorded under the soak workload, Scenario: The kv_current table reports fillfactor=90 after migration, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`) (+9 more)

### Community 146 - "shadow-schema.test.ts"
Cohesion: 0.13
Nodes (8): run(), changeCaptureLayout(), CHANGED, EXPECTED_CBOR, EXPECTED_HASH, MODULE_M, UNCHANGED, RFC-8949

### Community 157 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 168 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 170 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value (+3 more)

### Community 176 - "001_chain_archive_core.ts"
Cohesion: 0.24
Nodes (9): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, Revision history, v2 — 2026-07-22, revised in response to a 3-reviewer design-council audit (Fable 5 / Opus / GPT-5.6 Sol), v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol) (+1 more)

### Community 179 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 180 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 200 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 229 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 245 - "Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data"
Cohesion: 0.40
Nodes (4): 2. Database API, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Scenario: A function in the configuration, Scenario: A user module from the configuration file

### Community 248 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 53 - "T"
Cohesion: 0.04
Nodes (50): T(), input(), 1. TemporalKV — event-sourced right action with a CAS guard, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, Scenario: Version and timestamp addressing agree, ADDED Requirements (+42 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): 10. Tables, ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked (+29 more)

### Community 76 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 95 - "table"
Cohesion: 0.08
Nodes (26): expectKeyOrder(), table(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports (+18 more)

### Community 102 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+18 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.08
Nodes (26): ADDED Requirements, Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form, Requirement: G9/T3 — a killed lease-holder does not wedge the lease, Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data (+18 more)

### Community 108 - "ROADMAP.md"
Cohesion: 0.09
Nodes (16): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+8 more)

### Community 112 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.10
Nodes (21): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+13 more)

### Community 116 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 118 - "package.json"
Cohesion: 0.10
Nodes (19): description, exports, files, homepage, license, main, name, type (+11 more)

### Community 119 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 130 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.11
Nodes (14): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+6 more)

### Community 131 - "Full-Chain Storage — Design"
Cohesion: 0.11
Nodes (17): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+9 more)

### Community 134 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 136 - "UmbraDB module guide"
Cohesion: 0.12
Nodes (16): Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Private modules, Reading through `db`, Settings (+8 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 139 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 140 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+8 more)

### Community 141 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 142 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.12
Nodes (15): 0. Package layout, 1.1 The gap, confirmed in source, 1.4 The ordering contract (for callers composing manually), 1. G5 — Co-transactional watermark + checkpoint data, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire, 3. G7 — Server-side timeouts, 4.2 Depth bound on `JsonValueSchema` (+7 more)

### Community 143 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 145 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 148 - "README.md"
Cohesion: 0.24
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 151 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (13): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 3. Modules (+5 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 154 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 158 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 162 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.15
Nodes (12): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover) (+4 more)

### Community 163 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 164 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 167 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 169 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 171 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 172 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 174 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 175 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 177 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 181 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 182 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 183 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 184 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 185 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 186 - "UmbraDB"
Cohesion: 0.20
Nodes (10): Contents, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB, Verification: what is proved, checked, and tested (+2 more)

### Community 189 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 190 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 191 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 192 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 193 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 194 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 195 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 196 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 197 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 198 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 199 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 201 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 203 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 204 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 205 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 206 - "Security policy & threat model"
Cohesion: 0.29
Nodes (7): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 207 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 208 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 209 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 210 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 211 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 213 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.33
Nodes (4): 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 214 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 215 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 216 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 217 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 218 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 219 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 220 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 221 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 222 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 223 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 224 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, Why

### Community 225 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 226 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 227 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 228 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 230 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 231 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 232 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 233 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 234 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 235 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 236 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 237 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 238 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 239 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 240 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 241 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 242 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 243 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 244 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 246 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 247 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 249 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 250 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 251 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 252 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 253 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 254 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 255 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 256 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 257 - "Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference"
Cohesion: 0.50
Nodes (4): Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Scenario: fault-schedule end state matches the fault-free reference on current state, Scenario: negative control — a dropped range makes the equivalence assertion fire, Scenario: the differential gate imports no foreign consumer application

### Community 258 - "Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence"
Cohesion: 0.50
Nodes (4): Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Scenario: the evidence run is not a required CI gate, Scenario: the pre-tag run resumes from the durable cursor with no resync or drift, Scenario: the run's evidence is recorded as a release artifact

### Community 259 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 260 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 264 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 62 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 84 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

## Knowledge Gaps
- **49 isolated node(s):** `RFC-3339`, `RFC-7693`, `RFC-7693`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3168 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionHistoryStorage`, `src/index.ts`, `UmbraDBSql`, `runMigrations`, `db/migrate.ts`, `PgTransactionLeaseLayer`, `translatePostgresError`, `loop.test.ts`, `UmbraError`, `InMemoryBlockSource`, `admin-harness.ts`, `tape/index.ts`, `core-ledger-state.ts`, `writer-lock-checks.ts`, `declaration.ts`, `core-config.test.ts`, `config/history.ts`, `ingest-harness.ts`, `record-and-replay.test.ts`, `PgWatermarks`, `createClient`, `module-tables.ts`, `adapter.ts`, `process-admin.ts`, `db/backends.ts`, `adapter-fixtures.ts`, `child-processes.test.ts`, `runner/process.ts`, `node-format.ts`, `version-checks.ts`, `node.test.ts`, `history-startup.ts`, `entries.ts`, `networks.ts`, `node/client.test.ts`, `post-block-update-checks.ts`, `chain-placement.test.ts`, `chain-process.test.ts`, `config-check-database.test.ts`, `column-rules.test.ts`, `module-api.test.ts`, `transform-checks.ts`, `NodeClient`, `plain-data.ts`, `builder.test.ts`, `changes.property.test.ts`, `dispatch.test.ts`, `real-tapes.ts`, `failures.ts`, `chain-data.test.ts`, `node-bridge.ts`, `change-capture.ts`, `api-server.test.ts`, `ws-mutual-tls.test.ts`, `validate.test.ts`, `digests.test.ts`, `cbor.property.test.ts`, `ledger-state.test.ts`, `chain-data.negative-control.test.ts`, `boundary.test.ts`, `validation.ts`, `core-block-fetch.test.ts`, `order.property.test.ts`, `core-private-source.test.ts`, `redact.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `private/backends.ts`, `crash.test.ts`, `Tasks — v1.0.0-infosec-signoff`, `tape/command.test.ts`, `block-fetch-decode.test.ts`, `package.json`, `BlobIntegrityError`, `mapping.test.ts`, `binding.test.ts`, `intake.test.ts`, `readiness.test.ts`, `chain-events-source.test.ts`, `height-versioned.property.test.ts`, `shadow-schema.test.ts`, `read-height.property.test.ts`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `excluded-not-exported.test.ts`, `component-table.test.ts`, `facade-merge-loader.ts`?**
  _High betweenness centrality (0.303) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-7693`, `RFC-7693` to the rest of the system?**
  _49 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionHistoryStorage` be split into smaller, more focused modules?**
  _Cohesion score 0.015494568324757005 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `db/migrate.ts`, `readiness.test.ts`, `loop.test.ts`, `InMemoryBlockSource`, `admin-harness.ts`, `tape/index.ts`, `core-ledger-state.ts`, `writer-lock-checks.ts`, `declaration.ts`, `vitest`, `config/history.ts`, `ingest-harness.ts`, `checkShape`, `record-and-replay.test.ts`, `module-tables.ts`, `column-rules.ts`, `process-admin.ts`, `db/backends.ts`, `adapter-fixtures.ts`, `runner/process.ts`, `version-checks.ts`, `history-startup.ts`, `NodeBlockSource`, `networks.ts`, `node/client.test.ts`, `LedgerPackage`, `node/client.ts`, `chain-process.test.ts`, `column-rules.test.ts`, `range.ts`, `module-api.test.ts`, `ApiRoutes`, `cbor.ts`, `FinalizedLoop`, `transform-checks.ts`, `NodeClient`, `plain-data.ts`, `changes.property.test.ts`, `graph.ts`, `failures.ts`, `api-server.test.ts`, `validate.test.ts`, `core-private-source.ts`, `validation.ts`, `validate.ts`, `core-block-fetch.test.ts`, `core-private-source.test.ts`, `mapping.ts`, `config-check.ts`, `halted`, `mapping.test.ts`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020463415491719702 - nodes in this community are weakly interconnected._