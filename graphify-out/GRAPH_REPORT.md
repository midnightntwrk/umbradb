# Graph Report - UmbraDB

## Corpus Check
- 882 files · ~1,358,283 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 9383 nodes · 27477 edges · 273 communities (250 shown, 23 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 3192 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `232a4ac4d6e2c5bc` (882 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionHistoryStorage
- ValidationError
- api-server.test.ts
- serve.ts
- block-fetch-decode.test.ts
- version-table.ts
- height
- chain-archive-rollover.ts
- NodeClient
- postgres/chain-archive-store.ts
- binding.test.ts
- adapter-worker-host.ts
- declaration.ts
- .value
- ledger-table-config.test.ts
- tx-replay-decoder.ts
- height-versioned.property.test.ts
- 3. Proof-blocking findings
- ws-mutual-tls.test.ts
- src/index.ts
- readRuntimeMetadata
- attempt
- config/history.ts
- BlobIntegrityError
- height-versioned.test.ts
- deterministic-postgresql/checks.ts
- validation.test.ts
- component-table.test.ts
- a114Run
- intake.test.ts
- stop-heights.test.ts
- cursor-durability.crash.test.ts
- no-indexer-or-wallet-sdk.test.ts
- holds
- config-check.ts
- extrinsics.ts
- ProcessItems
- postgres-image.test.ts
- runner/process.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- tape/index.ts
- ledger-state.test.ts
- NodeBlockSource
- ReadPool
- mutation-evidence.d.mts
- node/client.test.ts
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- process-admin.ts
- HeldRead
- loop.ts
- core-config.test.ts
- exitWithin
- SkipsAfterReconnect
- opt-out.test.ts
- CliBackend
- loop.test.ts
- ref_node_fs
- ledger/types.ts
- adapter.ts
- UmbraError
- interfaces/temporal-kv.ts
- transform-checks.ts
- validate.ts
- ref_node_path
- node-format.ts
- LedgerPackage
- postgres/client.ts
- column-rules.ts
- builds.ts
- db/migrate.ts
- vitest
- cold-boot-recovery.integration.test.ts
- writer-lock-checks.ts
- validation.ts
- TemporalKV
- harness.ts
- column-refusals.test.ts
- FinalizedLoop
- cbor.ts
- translatePostgresError
- column-rules.test.ts
- module-tables.ts
- core-block-commit.test.ts
- spawnChild
- node.test.ts
- graph.ts
- checkShape
- core-ledger-state.ts
- zero-timeouts-checks.ts
- chain-process.test.ts
- builder.test.ts
- boundary.test.ts
- cbor.property.test.ts
- retries.test.ts
- networks.ts
- node-bridge.ts
- recovery.test.ts
- PgTransactionLeaseLayer
- .show
- ref_node_crypto
- digest.test.ts
- test/postgres/setup.ts
- containers.test.ts
- InMemoryBlockSource
- chain-placement.test.ts
- crash.test.ts
- db/durability-probe.test.ts
- mapping.ts
- determinism-checks.ts
- check-required-tests.ts
- admin-harness.ts
- legacy-excluded.test.ts
- core-block-fetch/metadata.ts
- version-checks.ts
- PgChainArchiveStore
- upgrade-boundary.test.ts
- sigterm.test.ts
- code-registry.ts
- ChainArchiveStore
- private/backends.ts
- pglite-writer.worker.ts
- table
- fn
- pg
- address
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- repository
- mutation-per-adapter.mjs
- twox.ts
- 10. Tables
- history.property.test.ts
- scoped-review-manifest
- pack-install.mjs
- midnight-env — reproducible PREPROD dev environment
- read-only-checks.ts
- launchPrivate
- runMigrations
- T
- graph.py
- ADDED Requirements
- version
- Full-Chain Storage — Design
- ROADMAP.md
- package.json
- UmbraDB third-party component inventory (SBOM)
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- ADDED Requirements
- stryker.conf.json
- UmbraDB module guide
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- devDependencies
- README.md
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Roadmap
- compilerOptions
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
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
- conformance-gate.mjs
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Tasks — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
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
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Requirement: DB-11 Exactly one writer per database
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
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
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 281 edges
2. `UmbraError` - 224 edges
3. `ModuleDeclaration` - 132 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `NodeClient` - 91 edges
6. `runMigrations()` - 90 edges
7. `FinalizedLoop` - 89 edges
8. `ValidationError` - 87 edges
9. `PgCheckpointStore` - 87 edges
10. `InMemoryBlockSource` - 86 edges

## Surprising Connections (you probably didn't know these)
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`)` --references--> `CheckpointStore`  [INFERRED]
  design/full-chain-storage-design.md → src/interfaces/checkpoint-store.ts
- `6. Backup/restore guidance` --references--> `CheckpointStore`  [INFERRED]
  docs/CONTRACT.md → src/interfaces/checkpoint-store.ts
- `6. On not adding a Merkle/authenticated data structure` --references--> `CheckpointStore`  [INFERRED]
  Formal/STORAGE_ALGEBRA.md → src/interfaces/checkpoint-store.ts
- `2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite` --references--> `CheckpointStore`  [INFERRED]
  openspec/changes/v1.0.0-infosec-signoff/design.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (273 total, 23 thin omitted)

### Community 0 - "PgTransactionHistoryStorage"
Cohesion: 0.01
Nodes (191): EntryContent, EntryLifecycle, MergeEntriesFn, TransactionHistoryEntry, TransactionHistoryStorage, JsonEncoded, PgTransactionHistoryStorage, StoredEntryJson (+183 more)

### Community 1 - "ValidationError"
Cohesion: 0.02
Nodes (176): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointSummary, ChunkIntegrityError, ChunkMissingError, ContentHash (+168 more)

### Community 10 - "api-server.test.ts"
Cohesion: 0.03
Nodes (98): ReadHandle, PointCallbacks, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, VersionedResponse (+90 more)

### Community 100 - "serve.ts"
Cohesion: 0.15
Nodes (13): AdminChannel, AdminServeOptions, ToAdmin, AdminAnswer, Heartbeat, isMessage(), serveAdmin(), lastTick() (+5 more)

### Community 101 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 102 - "version-table.ts"
Cohesion: 0.16
Nodes (22): ConfiguredLedgerTable, LedgerPin, LedgerRow, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins() (+14 more)

### Community 104 - "height"
Cohesion: 0.10
Nodes (20): Broken, height(), 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy (+12 more)

### Community 108 - "chain-archive-rollover.ts"
Cohesion: 0.15
Nodes (18): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+10 more)

### Community 11 - "NodeClient"
Cohesion: 0.04
Nodes (99): CoreChainBinding, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter, NodeBlock (+91 more)

### Community 110 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (16): BlobRole, BlockMeta, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult, VerifierKeyObservationRecord (+8 more)

### Community 113 - "binding.test.ts"
Cohesion: 0.14
Nodes (13): TestDatabase, A113Observation, Binding, Outcome, privateCursorHeight(), a113Run(), against(), bindingIn() (+5 more)

### Community 119 - "adapter-worker-host.ts"
Cohesion: 0.14
Nodes (14): ApplyInput, StoredNode, AdapterWorkerAnswer, AdapterWorkerRequest, hex(), storeOf(), hex(), ANSWER_WASM (+6 more)

### Community 12 - "declaration.ts"
Cohesion: 0.03
Nodes (106): DefinedModule, ItemDeclaration, KnownPointsOnly, ModuleDeclaration, Revision, TableDeclaration, EntryRange, GraphInput (+98 more)

### Community 120 - ".value"
Cohesion: 0.31
Nodes (6): ScaleReader, ValueReader, blockTimeOf(), bytesArgument(), decodeChainEvents(), read()

### Community 121 - "ledger-table-config.test.ts"
Cohesion: 0.25
Nodes (17): Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts() (+9 more)

### Community 122 - "tx-replay-decoder.ts"
Cohesion: 0.18
Nodes (17): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+9 more)

### Community 124 - "height-versioned.property.test.ts"
Cohesion: 0.12
Nodes (16): Block, BlockFails, Counts, Effect, Key, Op, canonicalText(), readBack() (+8 more)

### Community 126 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 129 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 13 - "src/index.ts"
Cohesion: 0.04
Nodes (112): TransactionHistoryReader, TransactionHistoryWriter, CheckpointStoreErrorCode, SharedStorageErrorCode, TemporalKVErrorCode, Lease, LeaseAcquireOptions, Rollback (+104 more)

### Community 132 - "readRuntimeMetadata"
Cohesion: 0.43
Nodes (9): TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry(), storageEntry(), strings() (+1 more)

### Community 138 - "attempt"
Cohesion: 0.16
Nodes (13): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+5 more)

### Community 14 - "config/history.ts"
Cohesion: 0.03
Nodes (122): CoreVersion, CoreSettings, versionEntry, HistoryCode, HistoryContext, HistoryInput, HistoryOptions, HistoryRow (+114 more)

### Community 145 - "BlobIntegrityError"
Cohesion: 0.29
Nodes (10): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation), Requirement: The chain-archive error classes are excluded from the frozen surface, Scenario: Chain-archive classes are not exported and their codes are not frozen (+2 more)

### Community 15 - "height-versioned.test.ts"
Cohesion: 0.03
Nodes (102): BlockWriteHandle, OwnPart, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, ApiRegistry (+94 more)

### Community 150 - "deterministic-postgresql/checks.ts"
Cohesion: 0.19
Nodes (12): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, checkFunctionsSql(), numericOkPredicate(), refusedNumbersPath() (+4 more)

### Community 152 - "validation.test.ts"
Cohesion: 0.18
Nodes (10): Case, ShapeCase, Stats, failures(), loose(), refusal(), thrown(), DECLARATION_RULES (+2 more)

### Community 153 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 154 - "a114Run"
Cohesion: 0.24
Nodes (5): PublicCore, TestLink, directPublic(), a114Run(), against()

### Community 155 - "intake.test.ts"
Cohesion: 0.32
Nodes (12): PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), a116Run(), follow(), heights() (+4 more)

### Community 156 - "stop-heights.test.ts"
Cohesion: 0.18
Nodes (6): CoreStopsFirst, NoRedelivery, a45Problems(), anyAbove(), at(), POINTS

### Community 16 - "cursor-durability.crash.test.ts"
Cohesion: 0.03
Nodes (119): InvariantResult, C5AnyFn, Fault, CrashWorkerHandle, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount(), pool() (+111 more)

### Community 160 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 169 - "holds"
Cohesion: 0.47
Nodes (4): VersionedValue, StoredVersion, Model, holds()

### Community 17 - "config-check.ts"
Cohesion: 0.03
Nodes (106): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckOptions, ConfigCheckReport, ConfigCheckSeams (+98 more)

### Community 177 - "extrinsics.ts"
Cohesion: 0.27
Nodes (8): ExtrinsicCall, MetadataPallet, callOf(), callVariants(), decodeExtrinsic(), decodeExtrinsics(), isCompactU64(), TIMESTAMP

### Community 179 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 18 - "runner/process.ts"
Cohesion: 0.03
Nodes (76): ConfigFacts, OpenedConfig, OpenedFacts, Bound, ChainCheck, ChainCheckInput, ChainIdentity, ChainSource (+68 more)

### Community 185 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 19 - "tape/index.ts"
Cohesion: 0.04
Nodes (77): Link, TapeBuilderOptions, RecordingError, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId (+69 more)

### Community 2 - "ledger-state.test.ts"
Cohesion: 0.03
Nodes (162): ProcessCondition, itemsSeen, Json, Scenario, transactionSpec, ArgType, BlockOptions, CallSpec (+154 more)

### Community 20 - "NodeBlockSource"
Cohesion: 0.03
Nodes (53): BlockHeaderItem, BodyExtrinsic, BlockBody, BlockItemSource, CoreBlockHeader, CoreBlockItems, RuntimeMetadataView, HeadWait (+45 more)

### Community 206 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 21 - "node/client.test.ts"
Cohesion: 0.03
Nodes (63): Connection, NodeClientOptions, NodeRetry, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, IngestOptions (+55 more)

### Community 211 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 22 - "process-admin.ts"
Cohesion: 0.04
Nodes (91): ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminStarter, DigestRow, ModuleFacts, PartTable, SnapshotFacts (+83 more)

### Community 221 - "HeldRead"
Cohesion: 0.60
Nodes (3): HeldRead, concurrent(), queued()

### Community 23 - "loop.ts"
Cohesion: 0.04
Nodes (94): PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+86 more)

### Community 24 - "core-config.test.ts"
Cohesion: 0.04
Nodes (70): adminRoutes, AdminServer, AdminStartOptions, AdminEndpoint, AdminPart, AdminSnapshot, AdminView, ReadinessFacts (+62 more)

### Community 25 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (84): CapturedTable, CaptureState, CheckedMigration, optOut, Chain, ChainOptions, DigestRow, Op (+76 more)

### Community 26 - "loop.test.ts"
Cohesion: 0.04
Nodes (70): ItemSink, BlockItems, LateUse, FinalityStallCondition, CommitOutcome, HeightRun, HeldHeight, Batching (+62 more)

### Community 27 - "ref_node_fs"
Cohesion: 0.06
Nodes (82): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState (+74 more)

### Community 28 - "ledger/types.ts"
Cohesion: 0.05
Nodes (63): LoadLedger, LedgerStateItem, LedgerName, ApplyOutput, ChainOutcome, LedgerPackageOptions, LedgerTask, NodeBatch (+55 more)

### Community 29 - "adapter.ts"
Cohesion: 0.04
Nodes (68): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+60 more)

### Community 3 - "UmbraError"
Cohesion: 0.03
Nodes (104): CommittedHeight, Database, ReadOnlyDatabase, ReadOptions, ReadTimeoutSetting, MultiStatementRunner, Job, JobQueue (+96 more)

### Community 31 - "interfaces/temporal-kv.ts"
Cohesion: 0.05
Nodes (72): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, AsOf, AssertExact, HistoryUnavailableError, JsonValue (+64 more)

### Community 32 - "transform-checks.ts"
Cohesion: 0.06
Nodes (56): Metadata, Step, Failure, Variant, TapeError, TransformError, NotificationRange, until() (+48 more)

### Community 33 - "validate.ts"
Cohesion: 0.04
Nodes (75): coreEntry, HistoryFinding, ConfigRule, CursorRule, EntryRef, Finding, Issue, Plain (+67 more)

### Community 34 - "ref_node_path"
Cohesion: 0.03
Nodes (62): CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+54 more)

### Community 35 - "node-format.ts"
Cohesion: 0.07
Nodes (52): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+44 more)

### Community 36 - "LedgerPackage"
Cohesion: 0.05
Nodes (35): LedgerEventKind, LedgerPackage, LedgerEngine, hexOf(), idOf(), same(), sameBytes(), run() (+27 more)

### Community 37 - "postgres/client.ts"
Cohesion: 0.06
Nodes (40): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, SqliteTxRow, BlockRow, TxRow, bootstrapChainArchiveSchema() (+32 more)

### Community 38 - "column-rules.ts"
Cohesion: 0.04
Nodes (70): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts (+62 more)

### Community 39 - "builds.ts"
Cohesion: 0.06
Nodes (33): PrivateBlockSource, privateIntake, PrivateIntakeOptions, PublicDatabase, PublicIdentity, PublicWakes, CommandBuildOptions, PrivateRefusal (+25 more)

### Community 4 - "db/migrate.ts"
Cohesion: 0.03
Nodes (131): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference (+123 more)

### Community 40 - "vitest"
Cohesion: 0.04
Nodes (31): Lockfile, Manifest, Report, Upstream, GuardViolation, ReportedTest, inTimeZone(), filesUnder() (+23 more)

### Community 42 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.06
Nodes (49): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), facadeDistIndexPath() (+41 more)

### Community 43 - "writer-lock-checks.ts"
Cohesion: 0.08
Nodes (47): PostgresOptions, WriterProcess, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), expectRefusedBeforeAnyWrite(), noHeight() (+39 more)

### Community 44 - "validation.ts"
Cohesion: 0.04
Nodes (56): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeclarationRule, PlacedDeclaration, Plain, DeepReadonly, PrivateKeys (+48 more)

### Community 45 - "TemporalKV"
Cohesion: 0.04
Nodes (54): TemporalKV, migrations(), 2. `storage-errors.ts` — shared base (new file), 3.4 Watermarks, 3. Module Interfaces, 4. Composition with `WalletStateStore` / `PrivateStateProvider`, 5. Documentation-Generation Tooling, Storage Layer Interface Specification (+46 more)

### Community 46 - "harness.ts"
Cohesion: 0.09
Nodes (46): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+38 more)

### Community 47 - "column-refusals.test.ts"
Cohesion: 0.07
Nodes (31): ModuleTable, ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, Case, freshDatabase() (+23 more)

### Community 48 - "FinalizedLoop"
Cohesion: 0.09
Nodes (12): FinalizedLoop, LoopObserver, Startup, WaitingInRead, FailingAfter, call(), cursorText(), isBlock() (+4 more)

### Community 49 - "cbor.ts"
Cohesion: 0.08
Nodes (44): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+36 more)

### Community 5 - "translatePostgresError"
Cohesion: 0.02
Nodes (153): ConnectionError, Retryability, SerializationFailedError, StorageError, TransactionKeyReuseError, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError (+145 more)

### Community 50 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (33): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+25 more)

### Community 51 - "module-tables.ts"
Cohesion: 0.07
Nodes (37): CaptureColumn, ModuleColumn, ModuleContentsError, PageOptions, ColumnType, RefusalCode, RefusalPlace, contentsHash() (+29 more)

### Community 52 - "core-block-commit.test.ts"
Cohesion: 0.07
Nodes (37): InMemoryItems, Wait, StandInOptions, Commit, Committed, blockHeaderOf(), checkParent(), commitBlock() (+29 more)

### Community 53 - "spawnChild"
Cohesion: 0.06
Nodes (38): ParentJob, Kill, Orphaned, SourceFile, LockResult, alive(), bystander(), childrenOf() (+30 more)

### Community 54 - "node.test.ts"
Cohesion: 0.08
Nodes (17): RawClient, Failure, Variant, TapeClock, open(), quiet(), withNode(), expectAnswersByOccurrence() (+9 more)

### Community 55 - "graph.ts"
Cohesion: 0.07
Nodes (44): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+36 more)

### Community 56 - "checkShape"
Cohesion: 0.07
Nodes (35): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), insert() (+27 more)

### Community 57 - "core-ledger-state.ts"
Cohesion: 0.07
Nodes (33): BlockLedgerSource, CoreLedgerStateOptions, LedgerBinding, boundLedgerParser(), applyBlock(), boundLedger(), coreLedgerState(), hex() (+25 more)

### Community 58 - "zero-timeouts-checks.ts"
Cohesion: 0.09
Nodes (32): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+24 more)

### Community 59 - "chain-process.test.ts"
Cohesion: 0.08
Nodes (29): WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing, Flaky (+21 more)

### Community 6 - "builder.test.ts"
Cohesion: 0.02
Nodes (109): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Frame, FindTapeOptions (+101 more)

### Community 61 - "boundary.test.ts"
Cohesion: 0.12
Nodes (34): ModuleReference, own(), collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts() (+26 more)

### Community 62 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (36): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+28 more)

### Community 63 - "retries.test.ts"
Cohesion: 0.13
Nodes (30): testBuild, A42Observation, Seen, StartsAtEveryRevision, Phase, crashRun(), a43Entries(), a43Run() (+22 more)

### Community 67 - "networks.ts"
Cohesion: 0.07
Nodes (32): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, Answers (+24 more)

### Community 68 - "node-bridge.ts"
Cohesion: 0.10
Nodes (21): ChildReader, NodeStore, EngineOptions, BridgeServer, bridgeStore, Growable, childRefKeys(), readChildren() (+13 more)

### Community 69 - "recovery.test.ts"
Cohesion: 0.09
Nodes (24): Armed, CommitArm, CommitFault, CommitProxy, Pair, AlwaysLost, DropsHeld, Fault (+16 more)

### Community 7 - "PgTransactionLeaseLayer"
Cohesion: 0.02
Nodes (117): BenchEnv, PgCheckpointStore, UmbraDBSql, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, CoTxCallable, CoTxPauseInfo (+109 more)

### Community 70 - ".show"
Cohesion: 0.07
Nodes (22): AllowedDetail, schemaName(), module(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 71 - "ref_node_crypto"
Cohesion: 0.12
Nodes (22): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, text(), checkPackageFiles(), manifestSha256(), mismatch() (+14 more)

### Community 72 - "digest.test.ts"
Cohesion: 0.09
Nodes (30): ChangeKind, tableChanges, TouchedRow, digestBlock(), encodeCanonical(), changeOf(), concat(), isCheckpointHeight() (+22 more)

### Community 75 - "test/postgres/setup.ts"
Cohesion: 0.08
Nodes (27): Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, registerSuiteLifecycle(), startTestDatabase(), getTestContainer() (+19 more)

### Community 77 - "containers.test.ts"
Cohesion: 0.09
Nodes (21): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, guardContainers(), guardPid(), watcherInput(), removeAttempt() (+13 more)

### Community 79 - "InMemoryBlockSource"
Cohesion: 0.12
Nodes (11): QueuedBlock, BlockRef, InMemoryBlockSource, InMemorySourceOptions, Flaky, Fetching, Recorder, LateRedelivery (+3 more)

### Community 8 - "chain-placement.test.ts"
Cohesion: 0.03
Nodes (141): BlockEventSource, BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent, EventPhase (+133 more)

### Community 80 - "crash.test.ts"
Cohesion: 0.10
Nodes (25): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, SkipsStartAtRestart, WORKER, CrashJob (+17 more)

### Community 82 - "db/durability-probe.test.ts"
Cohesion: 0.11
Nodes (25): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, Outcome, WriterSession, WriterStart (+17 more)

### Community 83 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 87 - "determinism-checks.ts"
Cohesion: 0.15
Nodes (24): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, PRIVATE_ROWS_SQL(), privateModule(), publicReads(), refusalOf() (+16 more)

### Community 89 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 9 - "admin-harness.ts"
Cohesion: 0.03
Nodes (129): FromAdmin, RunSeams, ProcessHandle, AdminRun, AdminRunOptions, Answered, Answerer, Expected (+121 more)

### Community 90 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 91 - "core-block-fetch/metadata.ts"
Cohesion: 0.11
Nodes (20): MetadataField, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive, RecordTypes, ScaleValue (+12 more)

### Community 92 - "version-checks.ts"
Cohesion: 0.14
Nodes (15): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, copyVendoredLedger(), expectEveryPackageFileChecked() (+7 more)

### Community 93 - "PgChainArchiveStore"
Cohesion: 0.19
Nodes (10): BlockBundle, BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32() (+2 more)

### Community 94 - "upgrade-boundary.test.ts"
Cohesion: 0.10
Nodes (24): A47Observation, CommitsTheBoundary, Controls, Version, busy(), holder(), withRoute(), migrating() (+16 more)

### Community 95 - "sigterm.test.ts"
Cohesion: 0.12
Nodes (20): Job, WorkEvent, WorkOptions, A48Observation, WORKER, Job, WorkerEvent, report() (+12 more)

### Community 96 - "code-registry.ts"
Cohesion: 0.14
Nodes (22): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+14 more)

### Community 97 - "ChainArchiveStore"
Cohesion: 0.09
Nodes (10): ChainArchiveStore, 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 5. Acceptance criteria status, 6. Known limitations, Full-Chain Storage, Boundary enforcement (+2 more)

### Community 98 - "private/backends.ts"
Cohesion: 0.13
Nodes (15): PrivateBackend, SessionSeen, PrivateOptions, A112Observation, Wiring, pgliteBackend(), schemaPlan(), PRIVATE_BACKENDS (+7 more)

### Community 99 - "pglite-writer.worker.ts"
Cohesion: 0.16
Nodes (17): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor() (+9 more)

### Community 105 - "table"
Cohesion: 0.09
Nodes (19): table(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, Data that is not a function of the chain, 14. Private processes, 6. Determinism (+11 more)

### Community 106 - "fn"
Cohesion: 0.13
Nodes (21): fn(), ADDED Requirements, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1), Requirement: Transactions commit or roll back atomically, Requirement: withLease always releases its lease, even when fn throws (+13 more)

### Community 111 - "pg"
Cohesion: 0.11
Nodes (17): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 1. Postgres-side profiling (+9 more)

### Community 115 - "address"
Cohesion: 0.12
Nodes (17): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite (+9 more)

### Community 116 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (17): 10. Ingest, 11. Chain data, 13. Contract data, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API, 3. Modules (+9 more)

### Community 135 - "repository"
Cohesion: 0.14
Nodes (15): repository(), 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA (+7 more)

### Community 137 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 144 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 158 - "10. Tables"
Cohesion: 0.20
Nodes (11): fakePackage(), regular(), system(), Chain events, transactions and their outcomes, 10. Tables, Requirement: CD-5 `core-block-parsed` parses each block once, Scenario: A system transaction between regular ones, Scenario: A transaction no event accounts for (+3 more)

### Community 164 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 168 - "scoped-review-manifest"
Cohesion: 0.20
Nodes (10): explain(), explainRefusal(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation (+2 more)

### Community 170 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 186 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 241 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 258 - "launchPrivate"
Cohesion: 0.67
Nodes (3): launchPrivate(), poll(), quiet()

### Community 30 - "runMigrations"
Cohesion: 0.03
Nodes (83): integer(), assertValidSchemaName(), createClient(), runMigrations(), 8. Migration, 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation (+75 more)

### Community 41 - "T"
Cohesion: 0.03
Nodes (63): T(), 5.1 Layer A: per-key temporal history, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5) (+55 more)

### Community 65 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): listen(), ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)` (+22 more)

### Community 88 - "version"
Cohesion: 0.07
Nodes (25): version(), Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5) (+17 more)

### Community 103 - "Full-Chain Storage — Design"
Cohesion: 0.09
Nodes (21): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+13 more)

### Community 107 - "ROADMAP.md"
Cohesion: 0.10
Nodes (16): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+8 more)

### Community 109 - "package.json"
Cohesion: 0.10
Nodes (20): bin, umbradb, description, exports, files, homepage, license, main (+12 more)

### Community 112 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 114 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.11
Nodes (19): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+11 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 123 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 125 - "UmbraDB module guide"
Cohesion: 0.12
Nodes (16): Blocks from the node, Cursor tables, Migrations, Private modules, Process items and APIs, Reading through `db`, Running a module with the `umbradb` command, Settings (+8 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 128 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 130 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 131 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 133 - "README.md"
Cohesion: 0.22
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 134 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception (+6 more)

### Community 139 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.14
Nodes (14): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+6 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 142 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 143 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 146 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 149 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 157 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 159 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.17
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 162 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 163 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 165 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 166 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 167 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.18
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 171 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 172 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 173 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 174 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 175 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 176 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

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

### Community 187 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 188 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 189 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 190 - "conformance-gate.mjs"
Cohesion: 0.22
Nodes (8): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli

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

### Community 197 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 198 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 199 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 200 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 201 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

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

### Community 212 - "5. Recommended candidate model"
Cohesion: 0.33
Nodes (6): 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 213 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 214 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 215 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 216 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 217 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 218 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 219 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 220 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 222 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 223 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 224 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 225 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 226 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 227 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 228 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 229 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 230 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 231 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 232 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 233 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 234 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 235 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 236 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 237 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 238 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 239 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
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

### Community 248 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 249 - "Requirement: DB-11 Exactly one writer per database"
Cohesion: 0.50
Nodes (4): Requirement: DB-11 Exactly one writer per database, Scenario: A crashed writer's lock is released, Scenario: A paused writer keeps its lock, Scenario: A second writer refuses

### Community 250 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 251 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 255 - "Requirement: set is an idempotent, unconditional overwrite (Law W1)"
Cohesion: 0.67
Nodes (3): Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A new set always overwrites, with no conflict possible, Scenario: Setting the same value twice leaves the stored state unchanged

### Community 256 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 60 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 64 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 66 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 73 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height (+25 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-17 Ledger tasks give modules the native objects, Requirement: LG-1 Each block's ledger version comes from its `MNSV` digest (+23 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+20 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

## Knowledge Gaps
- **49 isolated node(s):** `RFC-9110`, `RFC-6455`, `RFC-6455`, `RFC-7693`, `RFC-7693` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3210 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionHistoryStorage`, `ValidationError`, `ledger-state.test.ts`, `UmbraError`, `db/migrate.ts`, `translatePostgresError`, `builder.test.ts`, `PgTransactionLeaseLayer`, `chain-placement.test.ts`, `admin-harness.ts`, `api-server.test.ts`, `NodeClient`, `declaration.ts`, `src/index.ts`, `config/history.ts`, `height-versioned.test.ts`, `cursor-durability.crash.test.ts`, `config-check.ts`, `runner/process.ts`, `tape/index.ts`, `NodeBlockSource`, `node/client.test.ts`, `process-admin.ts`, `loop.ts`, `core-config.test.ts`, `opt-out.test.ts`, `loop.test.ts`, `ref_node_fs`, `ledger/types.ts`, `adapter.ts`, `interfaces/temporal-kv.ts`, `transform-checks.ts`, `validate.ts`, `ref_node_path`, `node-format.ts`, `postgres/client.ts`, `builds.ts`, `cold-boot-recovery.integration.test.ts`, `writer-lock-checks.ts`, `validation.ts`, `column-refusals.test.ts`, `column-rules.test.ts`, `core-block-commit.test.ts`, `spawnChild`, `node.test.ts`, `core-ledger-state.ts`, `zero-timeouts-checks.ts`, `chain-process.test.ts`, `boundary.test.ts`, `cbor.property.test.ts`, `retries.test.ts`, `networks.ts`, `node-bridge.ts`, `recovery.test.ts`, `ref_node_crypto`, `digest.test.ts`, `test/postgres/setup.ts`, `containers.test.ts`, `crash.test.ts`, `db/durability-probe.test.ts`, `determinism-checks.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `version-checks.ts`, `upgrade-boundary.test.ts`, `sigterm.test.ts`, `code-registry.ts`, `private/backends.ts`, `serve.ts`, `block-fetch-decode.test.ts`, `package.json`, `binding.test.ts`, `adapter-worker-host.ts`, `ledger-table-config.test.ts`, `height-versioned.property.test.ts`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `twox.ts`, `excluded-not-exported.test.ts`, `validation.test.ts`, `component-table.test.ts`, `intake.test.ts`, `stop-heights.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `history.property.test.ts`, `postgres-image.test.ts`?**
  _High betweenness centrality (0.299) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-9110`, `RFC-6455`, `RFC-6455` to the rest of the system?**
  _49 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionHistoryStorage` be split into smaller, more focused modules?**
  _Cohesion score 0.014538217634756797 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `ledger-state.test.ts`, `db/migrate.ts`, `admin-harness.ts`, `api-server.test.ts`, `NodeClient`, `declaration.ts`, `config/history.ts`, `height-versioned.test.ts`, `config-check.ts`, `runner/process.ts`, `tape/index.ts`, `NodeBlockSource`, `node/client.test.ts`, `process-admin.ts`, `loop.ts`, `validation.test.ts`, `opt-out.test.ts`, `loop.test.ts`, `adapter.ts`, `transform-checks.ts`, `validate.ts`, `ref_node_path`, `builds.ts`, `writer-lock-checks.ts`, `validation.ts`, `FinalizedLoop`, `cbor.ts`, `module-tables.ts`, `core-block-commit.test.ts`, `graph.ts`, `checkShape`, `core-ledger-state.ts`, `zero-timeouts-checks.ts`, `chain-process.test.ts`, `retries.test.ts`, `ref_node_crypto`, `InMemoryBlockSource`, `db/durability-probe.test.ts`, `mapping.ts`, `version-checks.ts`, `upgrade-boundary.test.ts`, `pglite-writer.worker.ts`, `version-table.ts`, `ledger-table-config.test.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `ValidationError` be split into smaller, more focused modules?**
  _Cohesion score 0.01927546138072454 - nodes in this community are weakly interconnected._