# Graph Report - UmbraDB

## Corpus Check
- 878 files · ~1,348,874 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 9326 nodes · 27241 edges · 266 communities (240 shown, 26 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 3183 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `3b1d716a265291b8` (878 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- createClient
- chain-process.test.ts
- chain-placement.test.ts
- chain-archive-replay-decode.integration.test.ts
- height
- TapeNode
- pglite-writer.worker.ts
- ChainArchiveStore
- version-table.ts
- private/backends.ts
- ValidationError
- intake.test.ts
- BlobIntegrityError
- commit-proxy.ts
- runner/process.ts
- builds.ts
- read-height.property.test.ts
- no-indexer-or-wallet-sdk.test.ts
- ws-mutual-tls.test.ts
- binding.test.ts
- ingest-harness.ts
- attempt
- chain-archive-rollover.ts
- NodeClient
- midnight-env — reproducible PREPROD dev environment
- identity.ts
- admin-harness.ts
- component-table.test.ts
- process-backends.ts
- Heartbeat
- version-selection.test.ts
- vitest
- type-check.ts
- a114Run
- postgres-image.test.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- UmbraError
- RuntimeMetadata
- column-rules.ts
- n
- ReadPool
- mutation-evidence.d.mts
- PgTransactionHistoryStorage
- node/client.test.ts
- no-chain-sync-import-guard.test.ts
- order.property.test.ts
- adapter-fixtures.ts
- BlockRef
- ReadHandle
- gate
- tape/index.ts
- loop.test.ts
- .value
- process-admin.ts
- ledger/types.ts
- src/index.ts
- db/backends.ts
- adapter.ts
- range.test.ts
- node-format.ts
- config-check.ts
- ModuleDeclaration
- FinalizedLoop
- changes.property.test.ts
- real-tapes.ts
- range.ts
- PgTransactionLeaseLayer
- validate.test.ts
- LedgerPackage
- builder.test.ts
- postgres/client.ts
- ref_node_crypto
- CheckpointStore
- history-startup.ts
- mapping.ts
- contents-hash.ts
- PgCheckpointStore
- block-source.ts
- checks.test.ts
- ref_node_url
- cbor.ts
- loop.ts
- containers.test.ts
- opt-out.test.ts
- transform-checks.ts
- deterministic-postgresql/index.ts
- postgres/chain-archive-store.ts
- Database
- core-ledger-state.ts
- change-capture.ts
- graph.ts
- checkShape
- node-bridge.ts
- plain-data.ts
- core-settings.ts
- config/history.ts
- validate.ts
- postgres/migrate.ts
- redact.ts
- boundary.test.ts
- networks.ts
- validation.ts
- api-server.test.ts
- cbor.property.test.ts
- version-checks.ts
- .show
- ledger-state.test.ts
- post-block-update.negative-control.test.ts
- declaration.ts
- db/errors.ts
- core-private-source.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- code-registry.ts
- determinism-checks.ts
- table
- address
- mutation-per-adapter.mjs
- pg
- twox.ts
- 10. Tables
- scoped-review-manifest
- pack-install.mjs
- orphan-watcher.mjs
- fresh-instance.mjs
- T
- graph.py
- version
- fn
- ADDED Requirements
- Full-Chain Storage — Design
- Tasks — v1.0.0-infosec-signoff
- ADDED Requirements
- ROADMAP.md
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- package.json
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- stryker.conf.json
- ADDED Requirements
- scripts
- Algebraic Specification of the midnight-pg-store Storage Layer
- UmbraDB module guide
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- devDependencies
- README.md
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Storage Algebra Lean M2 Retention Sprint
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ADDED Requirements
- Roadmap
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- 3. Proof-blocking findings
- ADDED Requirements
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- Design — Postgres+JSONB storage rebuild
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
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Security policy & threat model
- 12. Milestone status
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 5. Recommended candidate model
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
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 2: Transaction/Lease
- manifest.json
- Vendored ledger builds
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- Requirement: LG-17 Ledger tasks give modules the native objects
- repository
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- Requirement: LG-13 Contract states stay alive
- Requirement: LG-3 Built-in tables per network
- Requirement: LG-8 The replay rules are reproduced
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
- ADDED Requirements
- ADDED Requirements
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 279 edges
2. `UmbraError` - 224 edges
3. `ModuleDeclaration` - 131 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `NodeClient` - 91 edges
6. `runMigrations()` - 90 edges
7. `FinalizedLoop` - 89 edges
8. `ValidationError` - 87 edges
9. `PgCheckpointStore` - 87 edges
10. `InMemoryBlockSource` - 86 edges

## Surprising Connections (you probably didn't know these)
- `1. Chunking` --references--> `ValidationError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/design.md → src/interfaces/storage-errors.ts
- `Scenario: A custom schema is honored end to end` --references--> `TemporalKV`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts
- `Scenario: A custom schema is honored end to end` --references--> `TemporalKV`  [INFERRED]
  openspec/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts
- `SC-1 — `kv_history` unbounded growth` --references--> `TemporalKV`  [INFERRED]
  Performance/CEILINGS.md → src/interfaces/temporal-kv.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (266 total, 26 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.01
Nodes (195): PgWatermarks, Adapters, BatchSpec, CurrentState, InvariantResult, C5AnyFn, Adapters, CurrentState (+187 more)

### Community 1 - "chain-process.test.ts"
Cohesion: 0.02
Nodes (168): InMemoryBlockSource, ProcessHandle, ProcessingEnd, Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation (+160 more)

### Community 10 - "chain-placement.test.ts"
Cohesion: 0.04
Nodes (118): BlockParsed, BlockParsedOptions, ChainTransaction, ChainEvent, ScaleValue, itemsSeen, BlockSpec, EventSpec (+110 more)

### Community 100 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.14
Nodes (22): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, bootstrapChainArchiveSchema() (+14 more)

### Community 102 - "height"
Cohesion: 0.09
Nodes (22): Broken, height(), 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy (+14 more)

### Community 103 - "TapeNode"
Cohesion: 0.14
Nodes (7): TapeClock, TapeNode, open(), quiet(), quietConnect(), withNode(), SYSTEM_CLOCK

### Community 105 - "pglite-writer.worker.ts"
Cohesion: 0.17
Nodes (16): Held, PgliteLockUse, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor(), main() (+8 more)

### Community 106 - "ChainArchiveStore"
Cohesion: 0.10
Nodes (7): ChainArchiveStore, 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 5. Acceptance criteria status, 6. Known limitations, Full-Chain Storage

### Community 107 - "version-table.ts"
Cohesion: 0.18
Nodes (20): LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable() (+12 more)

### Community 108 - "private/backends.ts"
Cohesion: 0.15
Nodes (13): PrivateBackend, SessionSeen, A112Observation, Wiring, pgliteBackend(), schemaPlan(), PRIVATE_BACKENDS, PRIVATE_LOGIN (+5 more)

### Community 11 - "ValidationError"
Cohesion: 0.02
Nodes (126): ValidationError, TemporalKV, exceedsMaxDepth(), tx(), migrations(), EntrySectionsSchema, 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.3 Transaction participation (+118 more)

### Community 112 - "intake.test.ts"
Cohesion: 0.19
Nodes (17): PrivateSeen, PublicCore, A114Observation, A116Observation, against(), directPublic(), a114Problems(), a116Problems() (+9 more)

### Community 114 - "BlobIntegrityError"
Cohesion: 0.20
Nodes (12): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+4 more)

### Community 116 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 12 - "runner/process.ts"
Cohesion: 0.03
Nodes (76): Bound, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait, WaitingListener, ReasonCode, RetryCode (+68 more)

### Community 121 - "builds.ts"
Cohesion: 0.20
Nodes (14): PrivateProcess, PrivateRefusal, genesisBlock(), genesisHex(), launchPrivate(), poll(), PRIVATE_ROWS_SQL(), privateCoreEntry() (+6 more)

### Community 122 - "read-height.property.test.ts"
Cohesion: 0.17
Nodes (11): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+3 more)

### Community 123 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.19
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 126 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 129 - "binding.test.ts"
Cohesion: 0.16
Nodes (10): TestDatabase, A113Observation, Binding, Outcome, a113Run(), bindingIn(), outcomeOf(), withCore() (+2 more)

### Community 13 - "ingest-harness.ts"
Cohesion: 0.04
Nodes (99): BlockHeader, ConnectSocket, ProcessCondition, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME (+91 more)

### Community 132 - "attempt"
Cohesion: 0.15
Nodes (14): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+6 more)

### Community 135 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 14 - "NodeClient"
Cohesion: 0.05
Nodes (78): NodeSourceOptions, CoreChainBinding, HeadSubscriber, NodeCallOptions, NodeClient, Pending, State, Subscription (+70 more)

### Community 144 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 149 - "identity.ts"
Cohesion: 0.27
Nodes (12): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest() (+4 more)

### Community 15 - "admin-harness.ts"
Cohesion: 0.04
Nodes (86): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+78 more)

### Community 150 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 16 - "process-backends.ts"
Cohesion: 0.03
Nodes (102): AdminRun, Answered, Hold, ProbeRecord, Start, Decision, ReadinessCase, startProcess() (+94 more)

### Community 160 - "Heartbeat"
Cohesion: 0.31
Nodes (5): Heartbeat, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 161 - "version-selection.test.ts"
Cohesion: 0.35
Nodes (10): Answers, blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts(), haltOf(), mnsvItem(), U32_MAX (+2 more)

### Community 17 - "vitest"
Cohesion: 0.04
Nodes (69): PostgresOptions, Finding, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PostgresTestServer, PauseReport (+61 more)

### Community 170 - "type-check.ts"
Cohesion: 0.33
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 172 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 178 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 18 - "UmbraError"
Cohesion: 0.04
Nodes (70): ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, DurabilityProbeOptions, DurabilityWarning, ProbeSession (+62 more)

### Community 19 - "column-rules.ts"
Cohesion: 0.03
Nodes (101): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+93 more)

### Community 193 - "n"
Cohesion: 0.29
Nodes (7): Absent, n(), 3.3 T3 omits the current event and cannot replay a pruned suffix, 4. Law-by-law repair map, Requirement: CheckpointSummary metadata is populated and label round-trips, Scenario: A label given at save time is returned by history and load, Scenario: byteLength, chunkCount, and createdAt reflect the saved payload

### Community 199 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 2 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (167): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryEntry (+159 more)

### Community 20 - "node/client.test.ts"
Cohesion: 0.03
Nodes (60): Connection, NodeClientOptions, NodeRetry, NodeSocket, NodeSocketEvents, NodeTimers, SocketFailure, IngestOptions (+52 more)

### Community 200 - "no-chain-sync-import-guard.test.ts"
Cohesion: 0.53
Nodes (5): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles()

### Community 21 - "order.property.test.ts"
Cohesion: 0.03
Nodes (96): GraphInput, PastFaultCase, RefusalCase, CallEvent, Recorder, CheckName, GraphSpec, ModuleSpec (+88 more)

### Community 22 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (94): StoredNode, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+86 more)

### Community 23 - "BlockRef"
Cohesion: 0.04
Nodes (39): BlockEventSource, BodyExtrinsic, BlockBody, BlockItemSource, CoreBlockItems, RuntimeMetadataView, HeadWait, NodeBlockSource (+31 more)

### Community 24 - "ReadHandle"
Cohesion: 0.03
Nodes (69): ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Migration (+61 more)

### Community 25 - "tape/index.ts"
Cohesion: 0.05
Nodes (76): Failure, Variant, CompletenessRange, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId (+68 more)

### Community 26 - "loop.test.ts"
Cohesion: 0.03
Nodes (69): EntryRange, BlockItems, CommitOutcome, HeldHeight, WaitingInRead, Contexts, Faults, LostCommit (+61 more)

### Community 27 - ".value"
Cohesion: 0.06
Nodes (62): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+54 more)

### Community 28 - "process-admin.ts"
Cohesion: 0.05
Nodes (77): ConfigFacts, OpenedConfig, OpenedFacts, ProcessAdmin, ProcessAdminOptions, AdminStarter, DigestRow, ModuleFacts (+69 more)

### Community 29 - "ledger/types.ts"
Cohesion: 0.05
Nodes (60): LoadLedger, TransactionParser, LedgerStateItem, LedgerName, ApplyInput, ApplyOutput, ChainOutcome, LedgerEvent (+52 more)

### Community 3 - "src/index.ts"
Cohesion: 0.03
Nodes (154): Retryability, SharedStorageErrorCode, AsOf, AssertExact, HistoryUnavailableError, JsonValue, Key, Namespace (+146 more)

### Community 30 - "db/backends.ts"
Cohesion: 0.04
Nodes (53): CheckTarget, CliBackend, Snapshot, Settings, LoadOutcome, OutsideRead, Traced, Opened (+45 more)

### Community 31 - "adapter.ts"
Cohesion: 0.04
Nodes (58): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+50 more)

### Community 32 - "range.test.ts"
Cohesion: 0.04
Nodes (45): ScriptedNode, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, TapeCommandIo, RangeOptions (+37 more)

### Community 33 - "node-format.ts"
Cohesion: 0.07
Nodes (52): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+44 more)

### Community 34 - "config-check.ts"
Cohesion: 0.05
Nodes (58): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, StepName, StepReport (+50 more)

### Community 35 - "ModuleDeclaration"
Cohesion: 0.05
Nodes (43): ModuleDeclaration, Revision, ResolvedGraph, StartedModuleApi, LoopInput, ApiStartup, MisuseListener, MisuseReports (+35 more)

### Community 36 - "FinalizedLoop"
Cohesion: 0.05
Nodes (22): FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, SkipsAfterReconnect, Batching, ItemsAfterWrite, SkipsStartAtRestart (+14 more)

### Community 37 - "changes.property.test.ts"
Cohesion: 0.05
Nodes (62): ChainOptions, DigestRow, Op, States, TableName, shadowTableName(), encodeCanonical(), captured() (+54 more)

### Community 38 - "real-tapes.ts"
Cohesion: 0.05
Nodes (52): Metadata, Step, FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource (+44 more)

### Community 39 - "range.ts"
Cohesion: 0.04
Nodes (52): Refusal, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command, RecordingError, Final (+44 more)

### Community 4 - "PgTransactionLeaseLayer"
Cohesion: 0.02
Nodes (185): CheckpointStoreErrorCode, ConnectionError, StorageError, Rollback, TransactionLeaseLayer, EnvelopeVersionUnsupportedError, WalletStateEnvelopeError, WalletStateEnvelopeErrorCode (+177 more)

### Community 40 - "validate.test.ts"
Cohesion: 0.05
Nodes (58): coreEntry, LoadedConfig, LoadOptions, plainData, EntryRef, CursorRow, Expected, invalid() (+50 more)

### Community 41 - "LedgerPackage"
Cohesion: 0.06
Nodes (32): LedgerEventKind, LedgerPackage, LedgerEngine, hexOf(), idOf(), same(), sameBytes(), run() (+24 more)

### Community 43 - "builder.test.ts"
Cohesion: 0.05
Nodes (33): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Frame, RawClient, Script (+25 more)

### Community 44 - "postgres/client.ts"
Cohesion: 0.08
Nodes (48): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+40 more)

### Community 45 - "ref_node_crypto"
Cohesion: 0.06
Nodes (48): LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath(), facadeMergeAvailable() (+40 more)

### Community 46 - "CheckpointStore"
Cohesion: 0.04
Nodes (57): CheckpointStore, EnvelopeCorruptError, Watermarks, decode(), encode(), 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`), 9. Module → module mapping (source of truth for `tasks.md`), 1.2 Async pattern (+49 more)

### Community 47 - "history-startup.ts"
Cohesion: 0.05
Nodes (54): AppliedMigration, OwnPart, FieldKind, FieldSchema, ItemDeclaration, Lifetime, PendingKey, ProcessContext (+46 more)

### Community 48 - "mapping.ts"
Cohesion: 0.05
Nodes (44): ResultColumn, ResultType, Case, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject() (+36 more)

### Community 49 - "contents-hash.ts"
Cohesion: 0.07
Nodes (43): CaptureColumn, ModuleColumn, ModuleContentsError, ModuleTable, PageOptions, ColumnType, DeterminismBackend, TestDatabase (+35 more)

### Community 5 - "PgCheckpointStore"
Cohesion: 0.02
Nodes (149): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointSummary, ChunkIntegrityError, ChunkMissingError, ContentHash (+141 more)

### Community 50 - "block-source.ts"
Cohesion: 0.07
Nodes (30): ChainCheck, ChainCheckInput, PrivateBlockSource, privateIntake, PrivateIntakeOptions, PublicDatabase, PublicIdentity, PublicWakes (+22 more)

### Community 51 - "checks.test.ts"
Cohesion: 0.05
Nodes (34): CheckedMigration, GuardTableRow, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, optOut (+26 more)

### Community 52 - "ref_node_url"
Cohesion: 0.04
Nodes (44): ParentJob, Kill, Orphaned, SourceFile, ReportedTest, guardPid(), alive(), bystander() (+36 more)

### Community 53 - "cbor.ts"
Cohesion: 0.08
Nodes (44): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+36 more)

### Community 54 - "loop.ts"
Cohesion: 0.09
Nodes (44): PointName, HeightRange, ResolvedRange, LateUse, Callback, CallbackFailure, EntryBoundary, ParallelPoint (+36 more)

### Community 55 - "containers.test.ts"
Cohesion: 0.07
Nodes (31): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, BlockRow, TxRow, guardContainers(), removeAttempt() (+23 more)

### Community 56 - "opt-out.test.ts"
Cohesion: 0.08
Nodes (21): PlacedRefusal, Refusal, RefusalCode, RefusalPlace, Case, describeTable(), moduleTables(), catalogRelations() (+13 more)

### Community 57 - "transform-checks.ts"
Cohesion: 0.11
Nodes (30): TransformError, NotificationRange, baseRecords(), expectedText(), expectVariantOutput(), forkRecords(), changedLines(), checkTape() (+22 more)

### Community 58 - "deterministic-postgresql/index.ts"
Cohesion: 0.08
Nodes (35): Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead(), engine() (+27 more)

### Community 59 - "postgres/chain-archive-store.ts"
Cohesion: 0.10
Nodes (27): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+19 more)

### Community 6 - "Database"
Cohesion: 0.03
Nodes (116): BlockWriteHandle, Database, SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling (+108 more)

### Community 60 - "core-ledger-state.ts"
Cohesion: 0.06
Nodes (36): BlockLedgerSource, CoreLedgerStateOptions, LedgerBinding, boundLedgerParser(), workerParser(), applyBlock(), boundLedger(), chainOutcomesOf() (+28 more)

### Community 61 - "change-capture.ts"
Cohesion: 0.09
Nodes (37): CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow, ConsistentRead, digestBlock(), captureDefinitions() (+29 more)

### Community 62 - "graph.ts"
Cohesion: 0.08
Nodes (43): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeFacts, Spanned (+35 more)

### Community 64 - "checkShape"
Cohesion: 0.07
Nodes (34): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), insert() (+26 more)

### Community 66 - "node-bridge.ts"
Cohesion: 0.08
Nodes (28): ChildReader, NodeStore, EngineOptions, BridgeServer, bridgeStore, Growable, childRefKeys(), readChildren() (+20 more)

### Community 67 - "plain-data.ts"
Cohesion: 0.07
Nodes (31): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+23 more)

### Community 68 - "core-settings.ts"
Cohesion: 0.06
Nodes (36): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys (+28 more)

### Community 7 - "config/history.ts"
Cohesion: 0.03
Nodes (129): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder (+121 more)

### Community 70 - "validate.ts"
Cohesion: 0.10
Nodes (36): ConfigRule, CursorRule, Issue, Plain, SettingsSchema, coreSettingsSchema(), pathOf(), closest() (+28 more)

### Community 71 - "postgres/migrate.ts"
Cohesion: 0.09
Nodes (19): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit(), probeAdvisoryLockVisibility() (+11 more)

### Community 73 - "redact.ts"
Cohesion: 0.10
Nodes (30): RevisionSettings, EntryView, RecordedView, ConfigCheckSeams, PlainObject, RedactableConfig, RedactionForms, redactor (+22 more)

### Community 74 - "boundary.test.ts"
Cohesion: 0.13
Nodes (33): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+25 more)

### Community 77 - "networks.ts"
Cohesion: 0.07
Nodes (34): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+26 more)

### Community 79 - "validation.ts"
Cohesion: 0.07
Nodes (30): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+22 more)

### Community 8 - "api-server.test.ts"
Cohesion: 0.03
Nodes (98): ApiRegistry, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, VersionedResponse, ChainDataAnswer (+90 more)

### Community 82 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 83 - "version-checks.ts"
Cohesion: 0.12
Nodes (21): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, contentStateOf(), toHex() (+13 more)

### Community 84 - ".show"
Cohesion: 0.07
Nodes (22): AllowedDetail, schemaName(), module(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 85 - "ledger-state.test.ts"
Cohesion: 0.13
Nodes (28): recordedGenesis, ProcessDatabase, coreLedgerState(), heightsIn(), a106Problems(), a107Problems(), a99Problems(), blockZeroProblems() (+20 more)

### Community 87 - "post-block-update.negative-control.test.ts"
Cohesion: 0.12
Nodes (21): LedgerReleasePackage, LedgerPackageOptions, AdapterWorkerRequest, SlowStep, TestLoaderData, loadLedgerPackage(), createV8Adapter(), createV9Adapter() (+13 more)

### Community 9 - "declaration.ts"
Cohesion: 0.03
Nodes (104): BlockHeaderItem, CoreBlockHeader, BlockTransaction, EventPhase, BlockContext, DefinedModule, ItemSink, KnownPointsOnly (+96 more)

### Community 90 - "db/errors.ts"
Cohesion: 0.11
Nodes (17): ReadOnlyDatabase, ReadOptions, DurabilityViolation, ReadTimeoutSetting, ModuleContentsFailure, ErrorCode, ErrorDetails, OffersReadOnly (+9 more)

### Community 95 - "core-private-source.test.ts"
Cohesion: 0.09
Nodes (10): AdmittedKey, privateBackbone(), fakePublic(), fakeRead(), identity(), CORE_KEY_REGISTRY, CORE_KEY_REGISTRY_MIGRATIONS, NONE (+2 more)

### Community 96 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 97 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 98 - "code-registry.ts"
Cohesion: 0.13
Nodes (24): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+16 more)

### Community 99 - "determinism-checks.ts"
Cohesion: 0.17
Nodes (22): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, privateCursorHeight(), privateModule(), refusalOf(), startPrivate() (+14 more)

### Community 65 - "table"
Cohesion: 0.05
Nodes (39): table(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, 10. Ingest, 11. Chain data, 13. Contract data (+31 more)

### Community 117 - "address"
Cohesion: 0.13
Nodes (16): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite (+8 more)

### Community 133 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 134 - "pg"
Cohesion: 0.15
Nodes (12): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 2. Node-side query correlation (+4 more)

### Community 140 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 141 - "10. Tables"
Cohesion: 0.18
Nodes (11): fakePackage(), regular(), system(), Chain events, transactions and their outcomes, 10. Tables, Requirement: CD-5 `core-block-parsed` parses each block once, Scenario: A system transaction between regular ones, Scenario: A transaction no event accounts for (+3 more)

### Community 158 - "scoped-review-manifest"
Cohesion: 0.20
Nodes (10): explain(), explainRefusal(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation (+2 more)

### Community 162 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 215 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 232 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 42 - "T"
Cohesion: 0.03
Nodes (69): T(), 1. TemporalKV — event-sourced right action with a CAS guard, 5. Testable-law deliverable (fast-check + Vitest), 5.1 Layer A: per-key temporal history, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4) (+61 more)

### Community 75 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 76 - "version"
Cohesion: 0.06
Nodes (35): version(), Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Postgres-kill mid-save + retry contract (G9 / T2) (+27 more)

### Community 78 - "fn"
Cohesion: 0.07
Nodes (35): fn(), ADDED Requirements, MODIFIED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: A stale transaction handle is rejected before any query runs, Scenario: Two puts inside one withTransaction both commit together, Scenario: Two puts inside one withTransaction either both commit or neither does (+27 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): 2. Database API, ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)` (+22 more)

### Community 91 - "Full-Chain Storage — Design"
Cohesion: 0.08
Nodes (26): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+18 more)

### Community 94 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.08
Nodes (24): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1** (+16 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides, Requirement: LG-1 Each block's ledger version comes from its `MNSV` digest, Requirement: LG-2 Height pins check the table (+16 more)

### Community 104 - "ROADMAP.md"
Cohesion: 0.09
Nodes (16): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+8 more)

### Community 109 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 111 - "package.json"
Cohesion: 0.10
Nodes (19): description, exports, files, homepage, license, main, name, type (+11 more)

### Community 113 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 118 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 120 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 124 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.12
Nodes (10): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside (+2 more)

### Community 125 - "UmbraDB module guide"
Cohesion: 0.12
Nodes (15): Blocks from the node, Cursor tables, Data that is not a function of the chain, Migrations, Private modules, Process items and APIs, Reading through `db`, Start and stop heights (+7 more)

### Community 127 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 128 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 130 - "README.md"
Cohesion: 0.22
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 131 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 138 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 139 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 142 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 143 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.15
Nodes (13): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol, 6.1 Approved M1 module layout (+5 more)

### Community 145 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 147 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 151 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 154 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 155 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 156 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 157 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 159 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.18
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 163 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 164 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 165 - "3. Proof-blocking findings"
Cohesion: 0.20
Nodes (10): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption, 3.8 C2 safety and liveness are different theorem classes (+2 more)

### Community 166 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 167 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 168 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 169 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 173 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 174 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.22
Nodes (9): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 8. Test infrastructure (open decision — resolve in Task 1) (+1 more)

### Community 175 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 176 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 177 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 179 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 180 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 181 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 183 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 184 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 185 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 186 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 187 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 188 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 189 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 190 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 191 - "Security policy & threat model"
Cohesion: 0.29
Nodes (7): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 192 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 194 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 195 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 196 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 197 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 201 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 202 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 203 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 204 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 205 - "5. Recommended candidate model"
Cohesion: 0.33
Nodes (6): 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 206 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 207 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 208 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 209 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 210 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 211 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 212 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 213 - "Performance — design"
Cohesion: 0.33
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 214 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 216 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 217 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 218 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 219 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 220 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 221 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 222 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 223 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 224 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 225 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 226 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 227 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 228 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 229 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 230 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 231 - "Proposal — Sprint 2: Transaction/Lease"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease, Why

### Community 233 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 234 - "Vendored ledger builds"
Cohesion: 0.40
Nodes (4): Rebuilding, Updating a version, Vendored ledger builds, What the patches add

### Community 235 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 236 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 237 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 238 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 239 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 240 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 241 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 245 - "Requirement: LG-17 Ledger tasks give modules the native objects"
Cohesion: 0.67
Nodes (3): Requirement: LG-17 Ledger tasks give modules the native objects, Scenario: A module reads decoded call arguments, Scenario: A task returns a native object

### Community 246 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 63 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+27 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 86 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+22 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

## Knowledge Gaps
- **49 isolated node(s):** `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx`, `typedoc`, `@types/node` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3198 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `createClient`, `chain-process.test.ts`, `PgTransactionHistoryStorage`, `src/index.ts`, `PgTransactionLeaseLayer`, `PgCheckpointStore`, `Database`, `config/history.ts`, `api-server.test.ts`, `declaration.ts`, `chain-placement.test.ts`, `runner/process.ts`, `ingest-harness.ts`, `NodeClient`, `admin-harness.ts`, `process-backends.ts`, `UmbraError`, `column-rules.ts`, `node/client.test.ts`, `order.property.test.ts`, `adapter-fixtures.ts`, `ReadHandle`, `tape/index.ts`, `loop.test.ts`, `.value`, `process-admin.ts`, `ledger/types.ts`, `db/backends.ts`, `adapter.ts`, `range.test.ts`, `node-format.ts`, `config-check.ts`, `ModuleDeclaration`, `changes.property.test.ts`, `real-tapes.ts`, `validate.test.ts`, `builder.test.ts`, `postgres/client.ts`, `ref_node_crypto`, `history-startup.ts`, `mapping.ts`, `contents-hash.ts`, `block-source.ts`, `checks.test.ts`, `ref_node_url`, `containers.test.ts`, `opt-out.test.ts`, `transform-checks.ts`, `deterministic-postgresql/index.ts`, `core-ledger-state.ts`, `change-capture.ts`, `node-bridge.ts`, `plain-data.ts`, `core-settings.ts`, `postgres/migrate.ts`, `redact.ts`, `boundary.test.ts`, `networks.ts`, `validation.ts`, `cbor.property.test.ts`, `version-checks.ts`, `ledger-state.test.ts`, `post-block-update.negative-control.test.ts`, `db/errors.ts`, `Tasks — v1.0.0-infosec-signoff`, `core-private-source.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `code-registry.ts`, `determinism-checks.ts`, `chain-archive-replay-decode.integration.test.ts`, `private/backends.ts`, `package.json`, `intake.test.ts`, `BlobIntegrityError`, `read-height.property.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `ws-mutual-tls.test.ts`, `binding.test.ts`, `mutation-per-adapter.mjs`, `twox.ts`, `midnight-env — reproducible PREPROD dev environment`, `excluded-not-exported.test.ts`, `component-table.test.ts`, `Heartbeat`, `version-selection.test.ts`, `postgres-image.test.ts`, `no-chain-sync-import-guard.test.ts`?**
  _High betweenness centrality (0.314) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx` to the rest of the system?**
  _49 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.014788844621513943 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `chain-process.test.ts`, `Database`, `config/history.ts`, `api-server.test.ts`, `declaration.ts`, `runner/process.ts`, `ingest-harness.ts`, `NodeClient`, `admin-harness.ts`, `process-backends.ts`, `vitest`, `node/client.test.ts`, `identity.ts`, `adapter-fixtures.ts`, `BlockRef`, `ReadHandle`, `order.property.test.ts`, `loop.test.ts`, `tape/index.ts`, `process-admin.ts`, `ledger/types.ts`, `db/backends.ts`, `config-check.ts`, `ModuleDeclaration`, `FinalizedLoop`, `changes.property.test.ts`, `range.ts`, `validate.test.ts`, `history-startup.ts`, `mapping.ts`, `contents-hash.ts`, `block-source.ts`, `checks.test.ts`, `cbor.ts`, `RuntimeMetadata`, `loop.ts`, `opt-out.test.ts`, `transform-checks.ts`, `deterministic-postgresql/index.ts`, `core-ledger-state.ts`, `graph.ts`, `checkShape`, `plain-data.ts`, `validate.ts`, `validation.ts`, `version-checks.ts`, `db/errors.ts`, `core-private-source.test.ts`, `pglite-writer.worker.ts`, `version-table.ts`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `chain-process.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02116840966462315 - nodes in this community are weakly interconnected._