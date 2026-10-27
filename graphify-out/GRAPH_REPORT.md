# Graph Report - UmbraDB

## Corpus Check
- 923 files · ~1,432,507 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 9952 nodes · 29535 edges · 286 communities (255 shown, 31 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 3338 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `ce1fe9bcf10a01f0` (923 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- loop.ts
- test/postgres/setup.ts
- PgTransactionLeaseLayer
- dispatch.test.ts
- tx-replay-decoder.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- dispatch.ts
- code-registry.ts
- PgChainArchiveStore
- ws-mutual-tls.test.ts
- transport.test.ts
- cli/command.ts
- ValidationError
- ChainArchiveStore
- pglite-writer.worker.ts
- postgres/chain-archive-store.ts
- version-table.ts
- ledger-storage-checks.ts
- opt-out.test.ts
- ledger-checks.ts
- version-selection.test.ts
- BlobIntegrityError
- containers.test.ts
- commit-proxy.ts
- validation.test.ts
- NodeClient
- 3. Proof-blocking findings
- identity.ts
- readiness.test.ts
- HeightRun
- database-fixtures.ts
- api-server.test.ts
- cursor-table.property.test.ts
- attempt
- interfaces/temporal-kv.ts
- tape/index.ts
- intake.test.ts
- ref_node_crypto
- ProcessItems
- api.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- runner/process.ts
- RuntimeMetadata
- src/index.ts
- ledger-state.test.ts
- ReadPool
- mutation-evidence.d.mts
- no-chain-sync-import-guard.test.ts
- core-block-parsed.ts
- core-config.test.ts
- BlockRef
- module-tables.ts
- Activity
- exitWithin
- refused-configuration.test.ts
- node/client.test.ts
- config/history.ts
- WaitingInRead
- FailingAfter
- NoRedelivery
- CommitsTheBoundary
- adapter.ts
- core-block-commit.test.ts
- PgTransactionHistoryStorage
- node-format.ts
- ModuleDeclaration
- .value
- config-check.ts
- chain-placement.test.ts
- ledger/types.ts
- admin-harness.ts
- validate.ts
- core-private-source.test.ts
- range.test.ts
- runMigrations
- range.ts
- builder.test.ts
- core-ledger-state.ts
- LedgerPackage
- core-transport.ts
- column-rules.ts
- vitest
- FinalizedLoop
- chain-process.test.ts
- ingest-harness.ts
- writer-lock-checks.ts
- ref_node_fs
- spawnChild
- column-rules.test.ts
- declaration.ts
- ledger-sweep.test.ts
- slow-block-harness.ts
- TemporalKV
- transform-checks.ts
- boundary.test.ts
- db/migrate.ts
- graph.ts
- validate.test.ts
- cbor.ts
- core-settings.ts
- 12. Ledger
- private/backends.ts
- history-fixtures.ts
- zero-timeouts-checks.ts
- checkShape
- determinism-checks.ts
- translatePostgresError
- plain-data.ts
- ledger-storage.test.ts
- checks.test.ts
- cbor.property.test.ts
- crash.test.ts
- sweep-tapes.ts
- UmbraError
- entries.ts
- messages.ts
- binding.test.ts
- networks.ts
- ref_node_os
- node-bridge.ts
- InMemoryBlockSource
- order.property.test.ts
- version-checks.ts
- mapping.ts
- height-versioned.property.test.ts
- version
- repository
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- pg
- twox.ts
- facade-merge-loader.ts
- pack-install.mjs
- .slowBlockMs
- Performance — design
- ledger
- orphan-watcher.mjs
- fresh-instance.mjs
- saveAndAdvance
- UmbraDB module guide
- graph.py
- Full-Chain Storage — Design
- ADDED Requirements
- package.json
- Design — Postgres+JSONB storage rebuild
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- stryker.conf.json
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- devDependencies
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ROADMAP.md
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- README.md
- Storage Algebra Lean M2 Retention Sprint
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
- openspec-explore/SKILL.md
- UmbraDB V1.0.0 Implementation Guideline
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Design — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- UmbraDB
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
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
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
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
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- manifest.json
- Vendored ledger builds
- 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Requirement: CF-6 Configuration changes only the future
- Requirement: RN-16 Chain-data reads name their view and height
- Acceptance criteria — v1.0.0-perf-baseline
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- Requirement: CF-10 `umbradb config check`
- Requirement: RN-3 Callbacks within a point run in a fixed order
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
- ADDED Requirements
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 302 edges
2. `UmbraError` - 241 edges
3. `ModuleDeclaration` - 143 edges
4. `FinalizedLoop` - 104 edges
5. `PgTransactionLeaseLayer` - 93 edges
6. `NodeClient` - 91 edges
7. `runMigrations()` - 90 edges
8. `InMemoryBlockSource` - 88 edges
9. `PgCheckpointStore` - 87 edges
10. `ValidationError` - 87 edges

## Surprising Connections (you probably didn't know these)
- `2.1 Historical implementation baseline` --references--> `PgTemporalKV`  [INFERRED]
  Formal/STORAGE_ALGEBRA_LEAN_RESEARCH.md → src/postgres/temporal-kv.ts
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: load before any save rejects with CheckpointNotFoundError` --references--> `CheckpointNotFoundError`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/specs/wallet-state-envelope/spec.md → src/interfaces/checkpoint-store.ts
- `Scenario: A chunk whose stored content no longer matches its recorded hash is rejected` --references--> `ChunkIntegrityError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts
- `The honest-test pattern (what makes each required test non-vacuous)` --references--> `ChunkMissingError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (286 total, 31 thin omitted)

### Community 0 - "loop.ts"
Cohesion: 0.02
Nodes (195): ItemDeclaration, ProcessContext, Revision, EntryRange, GraphInput, HeightRange, ResolvedGraph, StartedModuleApi (+187 more)

### Community 1 - "test/postgres/setup.ts"
Cohesion: 0.02
Nodes (176): JsonValue, KvRow, BatchSpec, CurrentState, InvariantResult, C5AnyFn, CurrentState, GcPass (+168 more)

### Community 10 - "PgTransactionLeaseLayer"
Cohesion: 0.03
Nodes (116): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+108 more)

### Community 100 - "dispatch.test.ts"
Cohesion: 0.09
Nodes (22): PendingKey, PointArguments, PointRun, CallEvent, Pipeline, provider(), ids(), registering() (+14 more)

### Community 101 - "tx-replay-decoder.ts"
Cohesion: 0.10
Nodes (25): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+17 more)

### Community 102 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 103 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 104 - "dispatch.ts"
Cohesion: 0.17
Nodes (24): Callback, EntryBoundary, ParallelPoint, PointSchedule, CoreStopsFirst, boundaryModules(), dispatch(), entryIdOf() (+16 more)

### Community 105 - "code-registry.ts"
Cohesion: 0.13
Nodes (24): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+16 more)

### Community 106 - "PgChainArchiveStore"
Cohesion: 0.20
Nodes (9): BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf(), sha256Hex() (+1 more)

### Community 107 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 108 - "transport.test.ts"
Cohesion: 0.15
Nodes (18): Message, Ended, rawClient, hexOf(), endedWithin(), hello(), tlsProblems(), greeted() (+10 more)

### Community 109 - "cli/command.ts"
Cohesion: 0.15
Nodes (16): CommandHandler, CommandIo, MainProcess, CommandResult, checkArguments(), configCommand(), runArguments(), runCommand() (+8 more)

### Community 11 - "ValidationError"
Cohesion: 0.02
Nodes (127): CheckpointRecord, CheckpointSequence, CheckpointSummary, ContentHash, HistoryOptions, PruneResult, SaveCheckpointOptions, ValidationError (+119 more)

### Community 110 - "ChainArchiveStore"
Cohesion: 0.09
Nodes (10): ChainArchiveStore, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents, `transactions` (chain_archive) (+2 more)

### Community 111 - "pglite-writer.worker.ts"
Cohesion: 0.16
Nodes (17): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor() (+9 more)

### Community 112 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (18): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind (+10 more)

### Community 113 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 114 - "ledger-storage-checks.ts"
Cohesion: 0.19
Nodes (21): SeenLoad, LedgerTx, a100Problems(), a102Problems(), a104KeyProblems(), a104Scenario(), bytesOf(), contractNodeKeys() (+13 more)

### Community 12 - "opt-out.test.ts"
Cohesion: 0.03
Nodes (112): CapturedTable, CaptureState, SchemaPlan, ChangeKind, tableChanges, TouchedRow, optOut, Chain (+104 more)

### Community 121 - "ledger-checks.ts"
Cohesion: 0.22
Nodes (19): LedgerEvent, LogItem, TransactionResult, VmLog, ledgerItemsSeen, a106Problems(), a107Problems(), a99Problems() (+11 more)

### Community 122 - "version-selection.test.ts"
Cohesion: 0.21
Nodes (16): CountingNode, Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts() (+8 more)

### Community 124 - "BlobIntegrityError"
Cohesion: 0.20
Nodes (12): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+4 more)

### Community 126 - "containers.test.ts"
Cohesion: 0.11
Nodes (11): FailsOnceStarted, SlowToReportPorts, SourceFile, LABEL_ATTEMPT, LABEL_PID, LABEL_REPOSITORY, START_ATTEMPTS, PARENT (+3 more)

### Community 127 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 128 - "validation.test.ts"
Cohesion: 0.14
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 13 - "NodeClient"
Cohesion: 0.04
Nodes (81): NodeSourceOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+73 more)

### Community 130 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 133 - "identity.ts"
Cohesion: 0.22
Nodes (14): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest() (+6 more)

### Community 134 - "readiness.test.ts"
Cohesion: 0.18
Nodes (13): Decision, ReadinessCase, ae4(), caseText(), readinessProblems(), holding(), observedProblems(), ready() (+5 more)

### Community 138 - "HeightRun"
Cohesion: 0.15
Nodes (7): HeightRun, SkipsAfterReconnect, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, ComputeAtH, StartsAtEveryRevision

### Community 139 - "database-fixtures.ts"
Cohesion: 0.14
Nodes (9): CheckTarget, CliBackend, Snapshot, blocksSql(), pgliteCliBackend(), postgresCliBackend(), record(), rowsSql() (+1 more)

### Community 14 - "api-server.test.ts"
Cohesion: 0.03
Nodes (86): ReadHandle, OwnPart, ApiRegistry, FieldKind, FieldSchema, Lifetime, PointCallbacks, Connection (+78 more)

### Community 142 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 145 - "attempt"
Cohesion: 0.16
Nodes (13): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+5 more)

### Community 15 - "interfaces/temporal-kv.ts"
Cohesion: 0.02
Nodes (120): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, AsOf, AssertExact, Key, Namespace (+112 more)

### Community 16 - "tape/index.ts"
Cohesion: 0.04
Nodes (81): Recorded, Failure, Variant, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest (+73 more)

### Community 162 - "intake.test.ts"
Cohesion: 0.33
Nodes (11): PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), follow(), heights(), readProblems() (+3 more)

### Community 17 - "ref_node_crypto"
Cohesion: 0.03
Nodes (87): EntryContent, EntryLifecycle, TransactionHistoryEntry, TransactionHistoryStatus, JsonEncoded, StoredEntryJson, TxHistoryRow, LifecycleDetailStore (+79 more)

### Community 18 - "api.ts"
Cohesion: 0.03
Nodes (74): ConfiguredDatabase, ConfiguredDatabaseOptions, BlockWriteHandle, CommittedHeight, Database, ReadOnlyDatabase, SchemaWriteHandle, PgliteOptions (+66 more)

### Community 185 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 19 - "runner/process.ts"
Cohesion: 0.03
Nodes (59): Bound, ChainCheck, ChainCheckInput, ChainIdentity, ChainSource, ConfiguredGenesis, CoreChainBinding, NodeWait (+51 more)

### Community 2 - "src/index.ts"
Cohesion: 0.03
Nodes (161): CheckpointNotFoundError, CheckpointStoreError, CheckpointStoreErrorCode, ChunkIntegrityError, ChunkMissingError, ManifestCorruptError, ConnectionError, Retryability (+153 more)

### Community 20 - "ledger-state.test.ts"
Cohesion: 0.05
Nodes (98): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState (+90 more)

### Community 208 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 209 - "no-chain-sync-import-guard.test.ts"
Cohesion: 0.53
Nodes (5): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles()

### Community 21 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (93): BlockEventSource, MetadataVariant, RuntimeMetadataView, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent (+85 more)

### Community 22 - "core-config.test.ts"
Cohesion: 0.04
Nodes (79): adminRoutes, AdminStartOptions, AdminEndpoint, AdminPart, AdminSnapshot, AdminView, ChainView, DeclarationView (+71 more)

### Community 23 - "BlockRef"
Cohesion: 0.04
Nodes (39): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, HeadWait, NodeBlockSource (+31 more)

### Community 24 - "module-tables.ts"
Cohesion: 0.04
Nodes (72): CaptureColumn, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions (+64 more)

### Community 25 - "refused-configuration.test.ts"
Cohesion: 0.04
Nodes (87): ProcessConfig, SignalTarget, Start, Child, Refusal, Start, ProcessBackend, startAdminServer() (+79 more)

### Community 26 - "node/client.test.ts"
Cohesion: 0.03
Nodes (53): NodeClientOptions, NodeRetry, Answer, FakeNode, Handler, Received, recorded, ManualTimers (+45 more)

### Community 27 - "config/history.ts"
Cohesion: 0.05
Nodes (81): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, HistoryCode, HistoryContext, HistoryOptions, HistoryRow, ProvidesRow (+73 more)

### Community 28 - "adapter.ts"
Cohesion: 0.04
Nodes (68): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+60 more)

### Community 29 - "core-block-commit.test.ts"
Cohesion: 0.03
Nodes (63): cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, BlockContext, Migration, StandInOptions (+55 more)

### Community 3 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (165): MergeEntriesFn, TransactionHistoryStorage, PgTransactionHistoryStorage, CheckpointStore, WalletStateEnvelope, PgWalletStateEnvelopeStore, decode(), encode() (+157 more)

### Community 30 - "node-format.ts"
Cohesion: 0.06
Nodes (57): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+49 more)

### Community 31 - "ModuleDeclaration"
Cohesion: 0.05
Nodes (68): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, ProcessAdmin, ProcessAdminOptions, AdminStarter, DigestRow (+60 more)

### Community 32 - ".value"
Cohesion: 0.06
Nodes (57): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef (+49 more)

### Community 33 - "config-check.ts"
Cohesion: 0.04
Nodes (68): CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState (+60 more)

### Community 34 - "chain-placement.test.ts"
Cohesion: 0.06
Nodes (72): BlockSpec, EventSpec, Json, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase (+64 more)

### Community 35 - "ledger/types.ts"
Cohesion: 0.06
Nodes (66): LoadLedger, LedgerStateItem, LedgerName, ApplyInput, ApplyOutput, ChainOutcome, LedgerPackageOptions, NodeBatch (+58 more)

### Community 36 - "admin-harness.ts"
Cohesion: 0.05
Nodes (59): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminAnswer, AdminRun, Answered (+51 more)

### Community 37 - "validate.ts"
Cohesion: 0.06
Nodes (69): RevisionSettings, EntryView, plainData, PlainObject, RedactableConfig, RedactionForms, redactor, SecretForm (+61 more)

### Community 38 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (41): Closable, PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, PublicDatabase, PublicIdentity, PublicSideOptions, PublicWakes (+33 more)

### Community 39 - "range.test.ts"
Cohesion: 0.04
Nodes (47): ConnectSocket, Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault (+39 more)

### Community 4 - "runMigrations"
Cohesion: 0.02
Nodes (129): BenchEnv, AnySql, RolloverBucket, RolloverTable, UmbraDBConnectionOptions, UmbraDBSql, DurabilityProbeOptions, DurabilityViolation (+121 more)

### Community 40 - "range.ts"
Cohesion: 0.04
Nodes (58): Refusal, BoundaryBlockReading, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command (+50 more)

### Community 41 - "builder.test.ts"
Cohesion: 0.05
Nodes (36): ConnectionFrames, Failure, Variant, WrongRecording, Metadata, Step, Frame, RawClient (+28 more)

### Community 42 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (64): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock() (+56 more)

### Community 43 - "LedgerPackage"
Cohesion: 0.06
Nodes (30): LedgerEventKind, LedgerPackage, StateHandle, LedgerEngine, Settled, hexOf(), idOf(), same() (+22 more)

### Community 44 - "core-transport.ts"
Cohesion: 0.05
Nodes (47): PublicSide, CoreTransportOptions, InstanceView, Session, TransportLimits, TransportTls, Api, Hello (+39 more)

### Community 45 - "column-rules.ts"
Cohesion: 0.04
Nodes (70): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+62 more)

### Community 46 - "vitest"
Cohesion: 0.05
Nodes (40): FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+32 more)

### Community 47 - "FinalizedLoop"
Cohesion: 0.07
Nodes (14): FinalizedLoop, LoopObserver, UnexpectedCursor, Startup, ItemsAfterWrite, AlwaysLost, DropsHeld, call() (+6 more)

### Community 48 - "chain-process.test.ts"
Cohesion: 0.05
Nodes (41): ProcessHandle, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation, A78Refusal, A90Observation, Failing (+33 more)

### Community 5 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (144): BlockParsed, BlockHeader, NodeCallOptions, ProcessCondition, itemsSeen, Scenario, RecordingClient, ArgType (+136 more)

### Community 50 - "writer-lock-checks.ts"
Cohesion: 0.08
Nodes (45): WriterProcess, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf() (+37 more)

### Community 51 - "ref_node_fs"
Cohesion: 0.05
Nodes (36): Lockfile, Manifest, RepositoryFile, Upstream, Accepts, Rest, WithKnownPoints, WithUnknownPoint (+28 more)

### Community 52 - "spawnChild"
Cohesion: 0.05
Nodes (46): ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, Pem, guardContainers() (+38 more)

### Community 53 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (31): Because, columnVerdict, DefaultPart, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+23 more)

### Community 54 - "declaration.ts"
Cohesion: 0.05
Nodes (42): AdmittedKey, DefinedModule, KnownPointsOnly, TableDeclaration, PlacedDeclaration, Plain, gate, Validator (+34 more)

### Community 55 - "ledger-sweep.test.ts"
Cohesion: 0.07
Nodes (27): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, Block, MemoryTables, ModelBatch (+19 more)

### Community 56 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (43): HeightActivity, LoopInput, ReadOpener, StatusBody, PublicCoreOptions, Times, Wait, askedSource (+35 more)

### Community 57 - "TemporalKV"
Cohesion: 0.04
Nodes (44): TemporalKV, 2. `storage-errors.ts` — shared base (new file), 4. Composition with `WalletStateStore` / `PrivateStateProvider`, 5. Documentation-Generation Tooling, Storage Layer Interface Specification, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism (+36 more)

### Community 58 - "transform-checks.ts"
Cohesion: 0.11
Nodes (32): TransformError, NotificationRange, baseRecords(), expectedText(), expectVariantOutput(), forkRecords(), changedLines(), checkTape() (+24 more)

### Community 59 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+34 more)

### Community 6 - "db/migrate.ts"
Cohesion: 0.03
Nodes (132): Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner, Difference (+124 more)

### Community 60 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+40 more)

### Community 61 - "validate.test.ts"
Cohesion: 0.06
Nodes (37): ConfigRule, EntryRef, CursorRow, Expected, declarations(), input(), refusal(), rowInput() (+29 more)

### Community 62 - "cbor.ts"
Cohesion: 0.09
Nodes (38): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+30 more)

### Community 63 - "core-settings.ts"
Cohesion: 0.06
Nodes (42): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+34 more)

### Community 64 - "12. Ledger"
Cohesion: 0.08
Nodes (24): RetainedState, LedgerTask, LedgerHost, LedgerWorkerFailure, NodeDatabase, Pending, NodeReader, workerParser() (+16 more)

### Community 65 - "private/backends.ts"
Cohesion: 0.07
Nodes (32): PrivateBackend, SessionSeen, TestCertificates, A155Observation, Outcome, A112Observation, Wiring, mutualTlsOptions() (+24 more)

### Community 66 - "history-fixtures.ts"
Cohesion: 0.07
Nodes (45): HistoryCheck, HistoryInput, HistoryRule, AppliedMigration, Holder, Started, StartupOptions, defineModule() (+37 more)

### Community 67 - "zero-timeouts-checks.ts"
Cohesion: 0.09
Nodes (35): Settings, Run, Job, WorkerEvent, Outcome, openBlockWrites(), expectNeverCutOffNorHung(), settings() (+27 more)

### Community 68 - "checkShape"
Cohesion: 0.07
Nodes (35): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), insert() (+27 more)

### Community 69 - "determinism-checks.ts"
Cohesion: 0.10
Nodes (32): PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, TestLink, a113Run(), against() (+24 more)

### Community 7 - "translatePostgresError"
Cohesion: 0.03
Nodes (130): TransactionHistoryReader, TransactionHistoryWriter, Rollback, TransactionFaultError, TransactionHandle, TransactionHandleInvalidError, WatermarkKey, WatermarkKind (+122 more)

### Community 72 - "plain-data.ts"
Cohesion: 0.07
Nodes (32): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+24 more)

### Community 73 - "ledger-storage.test.ts"
Cohesion: 0.09
Nodes (34): Call, RestartEvent, RestartJob, retentionSeen, nodeSourceOf(), coreLedgerState(), retainedStatesOf(), writeSweep() (+26 more)

### Community 74 - "checks.test.ts"
Cohesion: 0.07
Nodes (25): CheckedMigration, CatalogTable, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, TableFacts (+17 more)

### Community 75 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (36): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+28 more)

### Community 76 - "crash.test.ts"
Cohesion: 0.08
Nodes (30): PointName, Unwrapped, Misuse, SlowBlockCondition, CrashCall, CrashEvent, CrashOptions, CrashObservation (+22 more)

### Community 77 - "sweep-tapes.ts"
Cohesion: 0.12
Nodes (34): TableSnapshot, FixtureNode, FakeState, eventsValue(), hex(), insertionOrder(), firstVersion(), hex() (+26 more)

### Community 8 - "UmbraError"
Cohesion: 0.03
Nodes (88): ReadDatabaseOptions, databaseTarget, ReadOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, ReadTimeoutSetting (+80 more)

### Community 80 - "entries.ts"
Cohesion: 0.06
Nodes (35): CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+27 more)

### Community 81 - "messages.ts"
Cohesion: 0.07
Nodes (30): ApiResult, Committed, MessageFault, MessageType, Parsed, bytesOf(), decodeParameter(), decodeValue() (+22 more)

### Community 84 - "binding.test.ts"
Cohesion: 0.09
Nodes (22): TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, TransportProxy, privateCursorHeight() (+14 more)

### Community 85 - "networks.ts"
Cohesion: 0.07
Nodes (33): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+25 more)

### Community 86 - "ref_node_os"
Cohesion: 0.08
Nodes (22): TypeCheckFinding, TypeCheckResult, Finding, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile() (+14 more)

### Community 89 - "node-bridge.ts"
Cohesion: 0.11
Nodes (20): ChildReader, BridgeServer, bridgeStore, Growable, childRefKeys(), readChildren(), bridgeMemory(), decodeNodes() (+12 more)

### Community 9 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (115): BlockItemSource, InMemoryBlockSource, InMemoryItems, Wait, LoopEnd, ProcessingEnd, ProcessStatus, Job (+107 more)

### Community 90 - "order.property.test.ts"
Cohesion: 0.10
Nodes (30): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce() (+22 more)

### Community 93 - "version-checks.ts"
Cohesion: 0.15
Nodes (17): MetadataBlock, MetadataNode, RuntimeMetadataEntry, LedgerTable, OwnStateMetadata, MetadataSelector, Select, Walk (+9 more)

### Community 95 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 99 - "height-versioned.property.test.ts"
Cohesion: 0.13
Nodes (20): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Key, Model (+12 more)

### Community 88 - "version"
Cohesion: 0.06
Nodes (30): version(), Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, 3. The freeze: build + package.json (G1), 5. Release contract docs (G2, G4), 6. Freeze the Lean cut-line (G20), 7. Packed-tarball install smoke test (G1) (+22 more)

### Community 118 - "repository"
Cohesion: 0.11
Nodes (17): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1** (+9 more)

### Community 136 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (14): 10. Ingest, 11. Chain data, 13. Contract data, 15. Backups and browser, 17. Required test ids added to the manifest, 2. Database API, 3. Modules, 4. Configuration (+6 more)

### Community 141 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 144 - "pg"
Cohesion: 0.15
Nodes (12): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 2. Node-side query correlation (+4 more)

### Community 149 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 157 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 167 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 173 - ".slowBlockMs"
Cohesion: 0.22
Nodes (9): listen(), 16. Whole system, 5. Runner, Requirement: CF-4 Every field is data, operational or secret, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases, Requirement: RN-17 A slow block is reported, never cut off, Scenario: A slow callback (+1 more)

### Community 207 - "Performance — design"
Cohesion: 0.29
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 215 - "ledger"
Cohesion: 0.33
Nodes (5): ledger(), Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 224 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 243 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 49 - "saveAndAdvance"
Cohesion: 0.04
Nodes (57): saveAndAdvance(), tx(), 1.3 Transaction participation, 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state (+49 more)

### Community 78 - "UmbraDB module guide"
Cohesion: 0.06
Nodes (37): refused(), cursorRead(), following(), Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations (+29 more)

### Community 79 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 82 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 116 - "package.json"
Cohesion: 0.10
Nodes (20): bin, umbradb, description, exports, files, homepage, license, main (+12 more)

### Community 117 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.10
Nodes (14): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+6 more)

### Community 119 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.10
Nodes (20): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+12 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build, Requirement: CF-9 The development opt-in gates development-only features (+11 more)

### Community 123 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 129 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 132 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 135 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 137 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 140 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 143 - "ROADMAP.md"
Cohesion: 0.14
Nodes (9): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+1 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 148 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 150 - "README.md"
Cohesion: 0.27
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 151 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 154 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 156 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 158 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 160 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 161 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 163 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 164 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 165 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 166 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.18
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 168 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 169 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 170 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 171 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 172 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 174 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer) (+1 more)

### Community 175 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 176 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 177 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 178 - "UmbraDB"
Cohesion: 0.20
Nodes (10): Contents, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB, Verification: what is proved, checked, and tested (+2 more)

### Community 180 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 181 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

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

### Community 190 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 191 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 192 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 193 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 194 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 196 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 197 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 198 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 199 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 200 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 201 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 202 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 203 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 204 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 205 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 210 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 211 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 212 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 213 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 214 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
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

### Community 220 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 221 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 222 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 223 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 225 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 226 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 227 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 228 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 229 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 230 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 231 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 232 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 233 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 234 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 235 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 236 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 237 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 238 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 239 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 240 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 244 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 245 - "Vendored ledger builds"
Cohesion: 0.40
Nodes (4): Rebuilding, Updating a version, Vendored ledger builds, What the patches add

### Community 246 - "00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor"
Cohesion: 0.50
Nodes (3): 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor, Evidence, Suggested fix

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

### Community 251 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 252 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 253 - "Requirement: CF-6 Configuration changes only the future"
Cohesion: 0.50
Nodes (4): Requirement: CF-6 Configuration changes only the future, Scenario: Adding a future revision, Scenario: Changing the past, Scenario: Raising the core's stop after stopping

### Community 254 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.50
Nodes (4): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The core leaves an answer as the module wrote it

### Community 255 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 256 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 257 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 260 - "Requirement: CF-10 `umbradb config check`"
Cohesion: 0.67
Nodes (3): Requirement: CF-10 `umbradb config check`, Scenario: A file with a type error and a schema error, Scenario: Checking against a database

### Community 261 - "Requirement: RN-3 Callbacks within a point run in a fixed order"
Cohesion: 0.67
Nodes (3): Requirement: RN-3 Callbacks within a point run in a fixed order, Scenario: A provider finishes before its consumer starts, Scenario: Unrelated modules write in id order

### Community 262 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 70 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 71 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 91 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points (+21 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

## Knowledge Gaps
- **51 isolated node(s):** `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx`, `typedoc`, `@types/node` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3355 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `loop.ts`, `test/postgres/setup.ts`, `src/index.ts`, `PgTransactionHistoryStorage`, `runMigrations`, `ingest-harness.ts`, `db/migrate.ts`, `translatePostgresError`, `UmbraError`, `InMemoryBlockSource`, `PgTransactionLeaseLayer`, `opt-out.test.ts`, `NodeClient`, `api-server.test.ts`, `interfaces/temporal-kv.ts`, `tape/index.ts`, `ref_node_crypto`, `api.ts`, `runner/process.ts`, `ledger-state.test.ts`, `core-block-parsed.ts`, `core-config.test.ts`, `module-tables.ts`, `refused-configuration.test.ts`, `node/client.test.ts`, `config/history.ts`, `adapter.ts`, `core-block-commit.test.ts`, `node-format.ts`, `ModuleDeclaration`, `.value`, `config-check.ts`, `chain-placement.test.ts`, `ledger/types.ts`, `admin-harness.ts`, `validate.ts`, `core-private-source.test.ts`, `range.test.ts`, `builder.test.ts`, `core-ledger-state.ts`, `core-transport.ts`, `chain-process.test.ts`, `writer-lock-checks.ts`, `ref_node_fs`, `spawnChild`, `column-rules.test.ts`, `declaration.ts`, `ledger-sweep.test.ts`, `slow-block-harness.ts`, `transform-checks.ts`, `boundary.test.ts`, `validate.test.ts`, `core-settings.ts`, `12. Ledger`, `private/backends.ts`, `history-fixtures.ts`, `zero-timeouts-checks.ts`, `plain-data.ts`, `ledger-storage.test.ts`, `checks.test.ts`, `cbor.property.test.ts`, `crash.test.ts`, `sweep-tapes.ts`, `entries.ts`, `messages.ts`, `binding.test.ts`, `networks.ts`, `ref_node_os`, `node-bridge.ts`, `order.property.test.ts`, `version-checks.ts`, `height-versioned.property.test.ts`, `dispatch.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `code-registry.ts`, `ws-mutual-tls.test.ts`, `transport.test.ts`, `cli/command.ts`, `package.json`, `repository`, `version-selection.test.ts`, `BlobIntegrityError`, `containers.test.ts`, `validation.test.ts`, `identity.ts`, `readiness.test.ts`, `mutation-per-adapter.mjs`, `cursor-table.property.test.ts`, `twox.ts`, `excluded-not-exported.test.ts`, `facade-merge-loader.ts`, `intake.test.ts`, `no-chain-sync-import-guard.test.ts`?**
  _High betweenness centrality (0.301) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `loop.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01839262187088274 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `loop.ts`, `validation.test.ts`, `identity.ts`, `db/migrate.ts`, `readiness.test.ts`, `ingest-harness.ts`, `InMemoryBlockSource`, `opt-out.test.ts`, `NodeClient`, `api-server.test.ts`, `tape/index.ts`, `api.ts`, `runner/process.ts`, `core-block-parsed.ts`, `BlockRef`, `module-tables.ts`, `refused-configuration.test.ts`, `node/client.test.ts`, `config/history.ts`, `core-block-commit.test.ts`, `ModuleDeclaration`, `config-check.ts`, `validate.ts`, `core-private-source.test.ts`, `range.ts`, `core-ledger-state.ts`, `core-transport.ts`, `FinalizedLoop`, `chain-process.test.ts`, `writer-lock-checks.ts`, `ref_node_fs`, `declaration.ts`, `slow-block-harness.ts`, `transform-checks.ts`, `graph.ts`, `validate.test.ts`, `cbor.ts`, `core-settings.ts`, `12. Ledger`, `private/backends.ts`, `history-fixtures.ts`, `zero-timeouts-checks.ts`, `checkShape`, `RuntimeMetadata`, `plain-data.ts`, `ledger-storage.test.ts`, `checks.test.ts`, `UmbraDB module guide`, `entries.ts`, `binding.test.ts`, `version-checks.ts`, `mapping.ts`, `pglite-writer.worker.ts`, `version-table.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `test/postgres/setup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01593529788597053 - nodes in this community are weakly interconnected._