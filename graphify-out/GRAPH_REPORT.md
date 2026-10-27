# Graph Report - UmbraDB

## Corpus Check
- 930 files · ~1,449,737 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 10081 nodes · 29977 edges · 286 communities (259 shown, 27 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 3354 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `28b373c8aa68ab60` (930 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionHistoryStorage
- api-server.test.ts
- PgTemporalKV
- legacy-excluded.test.ts
- ChainArchiveStore
- private/lockstep-wait.test.ts
- ws-mutual-tls.test.ts
- code-registry.ts
- tx-replay-decoder.ts
- sweep.ts
- node-bridge.ts
- pglite.ts
- pglite-writer.worker.ts
- Lockstep
- records.ts
- interfaces/chain-archive-store.ts
- ledger-sweep.test.ts
- read-height.property.test.ts
- no-indexer-or-wallet-sdk.test.ts
- validate.ts
- childRefKeys
- builder-checks.ts
- retention.ts
- attempt
- height-versioned.property.test.ts
- 3. Proof-blocking findings
- loop.test.ts
- version-table.ts
- checkShape
- version-selection.test.ts
- declaration.ts
- identity.ts
- chain-archive-rollover.ts
- config/history.ts
- upgrade-boundary.test.ts
- RawClient
- BlockRef
- ledger-storage.test.ts
- holds
- NodeClient
- ProcessItems
- process-admin.ts
- UmbraError
- cursor-durability.crash.test.ts
- chain-process.test.ts
- mutation-evidence.d.mts
- columnVerdict
- .save
- ReadHandle
- builds.ts
- exitWithin
- core-private-source.test.ts
- .value
- ValidationError
- PgCheckpointStore
- core-transport.ts
- node/client.test.ts
- node-format.ts
- runner/process.ts
- adapter.ts
- adapter-fixtures.ts
- chain-placement.test.ts
- host.ts
- saveAndAdvance
- changes.property.test.ts
- run.test.ts
- .read
- src/index.ts
- spawnChild
- core-block-parsed.ts
- vitest
- FinalizedLoop
- LedgerPackage
- transport-faults.test.ts
- real-tapes.ts
- ledger/types.ts
- runMigrations
- pglite-timeouts.test.ts
- loop.ts
- config-check.ts
- private/backends.ts
- column-rules.test.ts
- column-rules.ts
- order.property.test.ts
- boundary.test.ts
- 5. Runner
- graph.ts
- admin-harness.ts
- mapping.ts
- slow-block-harness.ts
- recovery.test.ts
- cbor.ts
- tape/index.ts
- node.test.ts
- core-settings.ts
- ingest-harness.ts
- ref_node_os
- cbor.property.test.ts
- networks.ts
- postgres/chain-archive-store.ts
- core-block-commit.test.ts
- transform-checks.ts
- module-tables.ts
- core-ledger-state.ts
- post-block-update-checks.ts
- jsonText
- pglite-queue.test.ts
- serve.test.ts
- crash.test.ts
- lockstep-refusals.test.ts
- .#open
- ref_node_path
- PgTransactionLeaseLayer
- history.property.test.ts
- node.ts
- transforms.ts
- block-source.ts
- version-checks.ts
- check-required-tests.ts
- version
- core-ledger-state.test.ts
- .boolean
- repository
- mutation-per-adapter.mjs
- pg
- twox.ts
- facade-merge-loader.ts
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- 001_chain_archive_core.ts
- pack-install.mjs
- schemaName
- Performance — design
- ref_node_worker_threads
- orphan-watcher.mjs
- Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data
- Requirement: CF-4 Every field is data, operational or secret
- read-only-checks.ts
- Requirement: DT-4 Per-block changes of every module table
- T
- ADDED Requirements
- graph.py
- UmbraDB module guide
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- Design — Postgres+JSONB storage rebuild
- package.json
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- stryker.conf.json
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- devDependencies
- ROADMAP.md
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Roadmap
- compilerOptions
- README.md
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Design — v1.0.0 API Surface & Release Contract
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Tasks — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- G12 / R5 — manual pre-tag Preprod round-trip evidence
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
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00023 — The blocks table's height partitions end at 5,000,000
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- manifest.json
- Vendored ledger builds
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- Requirement: CF-5 Entries are revised by `(id, start)`
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
- ADDED Requirements
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 307 edges
2. `UmbraError` - 247 edges
3. `ModuleDeclaration` - 148 edges
4. `FinalizedLoop` - 112 edges
5. `PgTransactionLeaseLayer` - 93 edges
6. `NodeClient` - 91 edges
7. `InMemoryBlockSource` - 90 edges
8. `runMigrations()` - 90 edges
9. `Database` - 87 edges
10. `ValidationError` - 87 edges

## Surprising Connections (you probably didn't know these)
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `2.1 Historical implementation baseline` --references--> `PgTemporalKV`  [INFERRED]
  Formal/STORAGE_ALGEBRA_LEAN_RESEARCH.md → src/postgres/temporal-kv.ts
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `1. Chunking` --references--> `ValidationError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/design.md → src/interfaces/storage-errors.ts
- `Scenario: A custom schema is honored end to end` --references--> `TemporalKV`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts

## Import Cycles
- None detected.

## Communities (286 total, 27 thin omitted)

### Community 0 - "PgTransactionHistoryStorage"
Cohesion: 0.01
Nodes (219): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryEntry (+211 more)

### Community 1 - "api-server.test.ts"
Cohesion: 0.02
Nodes (167): Bound, ApiRegistry, Revision, ResolvedGraph, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions (+159 more)

### Community 10 - "PgTemporalKV"
Cohesion: 0.03
Nodes (122): AsOf, AssertExact, JsonValue, Key, Namespace, Scope, Version, VersionedEntry (+114 more)

### Community 100 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 101 - "ChainArchiveStore"
Cohesion: 0.08
Nodes (13): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage (+5 more)

### Community 102 - "private/lockstep-wait.test.ts"
Cohesion: 0.11
Nodes (17): LockstepWait, ExpectedWait, SkipsUnseen, WaitsInTransaction, RetargetProxy, a117Problems(), firstWait(), lockstepCore() (+9 more)

### Community 104 - "ws-mutual-tls.test.ts"
Cohesion: 0.10
Nodes (19): Attempt, server(), locked(), connect(), file(), makeCa(), makeLeaf(), openssl() (+11 more)

### Community 105 - "code-registry.ts"
Cohesion: 0.14
Nodes (22): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+14 more)

### Community 106 - "tx-replay-decoder.ts"
Cohesion: 0.12
Nodes (22): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+14 more)

### Community 108 - "sweep.ts"
Cohesion: 0.12
Nodes (13): GreyView, SweepPhase, SweepTables, byBytes(), BYTE_ORDER(), hexOf(), merged(), sweepStep() (+5 more)

### Community 109 - "node-bridge.ts"
Cohesion: 0.14
Nodes (17): BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 11 - "pglite.ts"
Cohesion: 0.03
Nodes (87): ConfiguredDatabaseOptions, CommittedHeight, DurabilityProbeOptions, DurabilityWarning, ProbeSession, Job, JobQueue, Outcome (+79 more)

### Community 110 - "pglite-writer.worker.ts"
Cohesion: 0.16
Nodes (17): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor() (+9 more)

### Community 111 - "Lockstep"
Cohesion: 0.13
Nodes (8): CoreTransportOptions, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal, downText(), holds()

### Community 112 - "records.ts"
Cohesion: 0.15
Nodes (20): TapeError, DisconnectRecord, FaultRecord, expectGoldenRoundTrip(), checkRecord(), isPlainObject(), kindOf(), recordLine() (+12 more)

### Community 113 - "interfaces/chain-archive-store.ts"
Cohesion: 0.15
Nodes (18): BlobIntegrityError, BlobMissingError, BlobRole, BlockNotFoundError, BlockStatus, BridgeObservationKind, ChainArchiveError, ChainArchiveErrorCode (+10 more)

### Community 114 - "ledger-sweep.test.ts"
Cohesion: 0.19
Nodes (12): SweepState, SweepWrites, Block, MemoryTables, ModelSnapshot, sweepReset(), bigints(), compare() (+4 more)

### Community 115 - "read-height.property.test.ts"
Cohesion: 0.13
Nodes (13): TestBackend, HeldRead, Job, Outcome, Reads, Step, concurrent(), queued() (+5 more)

### Community 116 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.16
Nodes (14): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), moduleSpecifier() (+6 more)

### Community 12 - "validate.ts"
Cohesion: 0.03
Nodes (131): ConfiguredDatabase, coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+123 more)

### Community 120 - "childRefKeys"
Cohesion: 0.18
Nodes (6): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf()

### Community 121 - "builder-checks.ts"
Cohesion: 0.14
Nodes (15): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, a71Script(), a71TapeText(), droppedConnection() (+7 more)

### Community 124 - "retention.ts"
Cohesion: 0.15
Nodes (13): retainedStates, boundLedger(), releasesOf(), revisionsOf(), sweepOf(), coreRevisionsOf(), releasedBy(), retainedFrom() (+5 more)

### Community 125 - "attempt"
Cohesion: 0.12
Nodes (17): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+9 more)

### Community 127 - "height-versioned.property.test.ts"
Cohesion: 0.12
Nodes (16): Block, BlockFails, Counts, Effect, Key, Op, canonicalText(), readBack() (+8 more)

### Community 129 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 13 - "loop.test.ts"
Cohesion: 0.03
Nodes (105): DurabilityViolation, ErrorCode, EntryRange, GraphInput, InMemoryBlockSource, HeightRun, Flaky, PastFaultCase (+97 more)

### Community 133 - "version-table.ts"
Cohesion: 0.25
Nodes (16): LedgerPin, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin(), freezeRow(), hexOf() (+8 more)

### Community 136 - "checkShape"
Cohesion: 0.30
Nodes (8): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), 14. External claims and their evidence

### Community 138 - "version-selection.test.ts"
Cohesion: 0.24
Nodes (15): Answers, H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts(), haltOf(), hashOf() (+7 more)

### Community 14 - "declaration.ts"
Cohesion: 0.03
Nodes (97): adminRoutes, AdminEndpoint, AdminPart, ReadinessFacts, AdmittedKey, CoreLedgerVersion, LedgerPackageIdentity, DefinedModule (+89 more)

### Community 143 - "identity.ts"
Cohesion: 0.27
Nodes (12): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest() (+4 more)

### Community 145 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 15 - "config/history.ts"
Cohesion: 0.04
Nodes (124): OpenedFacts, CoreVersion, CoreSettings, versionEntry, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding (+116 more)

### Community 150 - "upgrade-boundary.test.ts"
Cohesion: 0.21
Nodes (13): ProcessingEnd, RunObservation, A47Observation, Controls, Version, a47Problems(), a47Run(), big() (+5 more)

### Community 16 - "BlockRef"
Cohesion: 0.03
Nodes (51): BlockHeaderItem, BlockEventSource, BodyExtrinsic, BlockBody, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, HeadWait (+43 more)

### Community 17 - "ledger-storage.test.ts"
Cohesion: 0.04
Nodes (115): Call, SeenLoad, RestartEvent, RestartJob, retentionSeen, ledgerScenario, LedgerTx, recordedGenesis (+107 more)

### Community 172 - "holds"
Cohesion: 0.47
Nodes (4): VersionedValue, StoredVersion, Model, holds()

### Community 18 - "NodeClient"
Cohesion: 0.05
Nodes (77): CoreChainBinding, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+69 more)

### Community 19 - "process-admin.ts"
Cohesion: 0.04
Nodes (94): ConfigFacts, OpenedConfig, AllowedDetail, ProcessAdmin, RevisionSettings, DigestRow, ModuleFacts, PartTable (+86 more)

### Community 2 - "UmbraError"
Cohesion: 0.03
Nodes (160): Database, ReadOnlyDatabase, ReadOptions, SchemaWriteHandle, Transaction, ReadTimeoutSetting, AppliedRow, MigrationPart (+152 more)

### Community 20 - "cursor-durability.crash.test.ts"
Cohesion: 0.03
Nodes (95): BatchSpec, CurrentState, InvariantResult, C5AnyFn, CrashWorkerHandle, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount() (+87 more)

### Community 21 - "chain-process.test.ts"
Cohesion: 0.04
Nodes (82): InMemoryItems, InMemorySourceOptions, Wait, Job, WorkerEvent, A77Observation, A78Observation, A78Refusal (+74 more)

### Community 211 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 212 - "columnVerdict"
Cohesion: 0.29
Nodes (7): columnVerdict, becauseOf(), numericScale(), refusalOfTypeName(), ruleOf(), becauseOf(), verdictOf()

### Community 22 - ".save"
Cohesion: 0.04
Nodes (91): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+83 more)

### Community 23 - "ReadHandle"
Cohesion: 0.03
Nodes (67): BlockWriteHandle, ReadHandle, OwnPart, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+59 more)

### Community 24 - "builds.ts"
Cohesion: 0.04
Nodes (81): A113Observation, A156Observation, Binding, Created, Outcome, PrivateProcess, PrivateRefusal, PrivateSeen (+73 more)

### Community 25 - "core-private-source.test.ts"
Cohesion: 0.04
Nodes (50): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, SourceTransport, PublicDatabase, PublicIdentity (+42 more)

### Community 26 - ".value"
Cohesion: 0.06
Nodes (60): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+52 more)

### Community 27 - "ValidationError"
Cohesion: 0.03
Nodes (82): ValidationError, TemporalKV, 1.2 Async pattern, 1.3 Transaction participation, 1. Shared Conventions, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism (+74 more)

### Community 28 - "PgCheckpointStore"
Cohesion: 0.04
Nodes (76): CheckpointStore, TransactionLeaseLayer, EnvelopeCorruptError, WalletStateEnvelope, Watermarks, PgCheckpointStore, SaveAndAdvanceDeps, PgWalletStateEnvelopeStore (+68 more)

### Community 29 - "core-transport.ts"
Cohesion: 0.04
Nodes (63): PublicSide, InstanceView, Session, TransportLimits, TransportTls, Committed, Hello, HelloAck (+55 more)

### Community 3 - "node/client.test.ts"
Cohesion: 0.02
Nodes (130): NodeClientOptions, NodeRetry, ConnectSocket, IngestOptions, Answer, FakeNode, Handler, Received (+122 more)

### Community 30 - "node-format.ts"
Cohesion: 0.06
Nodes (57): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+49 more)

### Community 31 - "runner/process.ts"
Cohesion: 0.04
Nodes (54): ProcessAdminOptions, AdminStarter, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait, WaitingListener, CheckState (+46 more)

### Community 32 - "adapter.ts"
Cohesion: 0.04
Nodes (67): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+59 more)

### Community 33 - "adapter-fixtures.ts"
Cohesion: 0.06
Nodes (67): StoredNode, Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerAnswer, AdapterWorkerHost (+59 more)

### Community 34 - "chain-placement.test.ts"
Cohesion: 0.06
Nodes (73): BlockSpec, EventSpec, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry (+65 more)

### Community 35 - "host.ts"
Cohesion: 0.06
Nodes (55): LoadLedger, LedgerStateItem, LedgerName, ApplyOutput, ChainOutcome, LedgerTask, NodeStore, ParsedTransaction (+47 more)

### Community 36 - "saveAndAdvance"
Cohesion: 0.03
Nodes (76): UmbraDBConnectionOptions, exceedsMaxDepth(), saveAndAdvance(), tx(), EntrySectionsSchema, 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits (+68 more)

### Community 37 - "changes.property.test.ts"
Cohesion: 0.04
Nodes (72): ChangeKind, tableChanges, TouchedRow, Op, States, TableName, digestBlock(), changeOf() (+64 more)

### Community 38 - "run.test.ts"
Cohesion: 0.05
Nodes (54): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, cliProject, CommandResult, statsConfig (+46 more)

### Community 39 - ".read"
Cohesion: 0.04
Nodes (59): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Settings, Case, Outcome (+51 more)

### Community 4 - "src/index.ts"
Cohesion: 0.03
Nodes (168): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError, ChunkMissingError (+160 more)

### Community 41 - "spawnChild"
Cohesion: 0.04
Nodes (53): ParentJob, Kill, Orphaned, SourceFile, FailsOnceStarted, SlowToReportPorts, SourceFile, LockResult (+45 more)

### Community 42 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (63): BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent, EventPhase, ScaleValue (+55 more)

### Community 43 - "vitest"
Cohesion: 0.04
Nodes (40): Lockfile, Manifest, RepositoryFile, Upstream, GuardViolation, ReportedTest, canPin(), pinViolations() (+32 more)

### Community 44 - "FinalizedLoop"
Cohesion: 0.07
Nodes (12): FinalizedLoop, LoopObserver, Startup, WaitingInRead, FailingAfter, WritingLoop, CommitsTheBoundary, call() (+4 more)

### Community 45 - "LedgerPackage"
Cohesion: 0.07
Nodes (24): RetainedState, LedgerEventKind, LedgerPackage, LedgerEngine, hexOf(), idOf(), same(), sameBytes() (+16 more)

### Community 46 - "transport-faults.test.ts"
Cohesion: 0.06
Nodes (44): ResultColumn, Message, MessageType, Report, Ended, rawClient, ReportRelay, codeOf() (+36 more)

### Community 47 - "real-tapes.ts"
Cohesion: 0.05
Nodes (52): FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+44 more)

### Community 49 - "ledger/types.ts"
Cohesion: 0.06
Nodes (44): LedgerReleasePackage, AppliedBlock, ApplyInput, LedgerEvent, LedgerPackageOptions, LogEventType, LogItem, NodeBatch (+36 more)

### Community 5 - "runMigrations"
Cohesion: 0.02
Nodes (133): BenchEnv, UmbraDBSql, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, RunMigrationsOptions, Started (+125 more)

### Community 50 - "pglite-timeouts.test.ts"
Cohesion: 0.04
Nodes (42): CheckTarget, CliBackend, Snapshot, Run, Job, WorkerEvent, Report, Job (+34 more)

### Community 51 - "loop.ts"
Cohesion: 0.05
Nodes (42): PointName, CallbackFailure, ReasonCode, Unwrapped, Activity, HeightActivity, HeightFailure, Invoke (+34 more)

### Community 52 - "config-check.ts"
Cohesion: 0.06
Nodes (44): privateIntake, CommandBuildOptions, CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState (+36 more)

### Community 53 - "private/backends.ts"
Cohesion: 0.07
Nodes (27): PrivateBackend, SessionSeen, TestDatabase, TestCertificates, Pause, Q142Observation, SkipsLockstep, A112Observation (+19 more)

### Community 54 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (30): CatalogColumn, Because, CatalogFunction, ColumnFacts, DefaultCatalog, DefaultPart, DefaultReference, keyOrder (+22 more)

### Community 55 - "column-rules.ts"
Cohesion: 0.04
Nodes (53): AllowedRule, CatalogType, DesignRow, PlacedRefusal, RefusalCode, RefusalOptions, RefusedRule, RuleBase (+45 more)

### Community 56 - "order.property.test.ts"
Cohesion: 0.06
Nodes (47): PointArguments, CallEvent, Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, registering() (+39 more)

### Community 57 - "boundary.test.ts"
Cohesion: 0.09
Nodes (43): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+35 more)

### Community 58 - "5. Runner"
Cohesion: 0.09
Nodes (35): ResolvedRange, Callback, EntryBoundary, ParallelPoint, PointRun, PointSchedule, Pipeline, StartsAtEveryRevision (+27 more)

### Community 59 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, HeightRange, MidChain, Missing, RangeCheck (+40 more)

### Community 6 - "admin-harness.ts"
Cohesion: 0.03
Nodes (153): AdminServer, BlockItemSource, ProcessConfig, ProcessHandle, ProcessState, AdminRun, Answered, Answerer (+145 more)

### Community 60 - "mapping.ts"
Cohesion: 0.07
Nodes (36): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+28 more)

### Community 61 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (41): LoopInput, StatusBody, PublicCoreOptions, Times, Wait, askedSource, BodyRead, HoldMode (+33 more)

### Community 62 - "recovery.test.ts"
Cohesion: 0.07
Nodes (32): CommitOutcome, HeldHeight, Armed, CommitArm, CommitFault, CommitProxy, Pair, Outcomes (+24 more)

### Community 63 - "cbor.ts"
Cohesion: 0.09
Nodes (37): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+29 more)

### Community 67 - "tape/index.ts"
Cohesion: 0.09
Nodes (25): Refusal, Link, TapeBuilder, TapeBuilderOptions, RecordingError, RecordingProblem, TapeProblem, TransformProblem (+17 more)

### Community 68 - "node.test.ts"
Cohesion: 0.08
Nodes (21): Metadata, Step, Frame, Failure, Variant, TapeClock, expectAnswersByOccurrence(), expectDelayHonoured() (+13 more)

### Community 69 - "core-settings.ts"
Cohesion: 0.06
Nodes (38): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+30 more)

### Community 7 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (143): BlockHeader, ProcessCondition, itemsSeen, Json, Scenario, ArgType, BlockOptions, CallSpec (+135 more)

### Community 70 - "ref_node_os"
Cohesion: 0.06
Nodes (24): LoadOptions, Row, Finding, invalid(), isFile(), modulesOf(), failures(), refusal() (+16 more)

### Community 71 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (36): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+28 more)

### Community 72 - "networks.ts"
Cohesion: 0.06
Nodes (36): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, ConfiguredLedgerTable (+28 more)

### Community 73 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (19): BlockBundle, BlockMeta, BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, VerifierKeyObservationRecord (+11 more)

### Community 77 - "core-block-commit.test.ts"
Cohesion: 0.09
Nodes (27): StandInOptions, Commit, checkParent(), commitBlock(), hex(), sameBytes(), writeBlockRow(), writeHashRow() (+19 more)

### Community 78 - "transform-checks.ts"
Cohesion: 0.10
Nodes (15): Failure, Variant, baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape(), expectVariantOutput(), forkRecords() (+7 more)

### Community 8 - "module-tables.ts"
Cohesion: 0.03
Nodes (120): CaptureColumn, CapturedTable, CaptureState, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure (+112 more)

### Community 80 - "core-ledger-state.ts"
Cohesion: 0.09
Nodes (33): CoreLedgerStateOptions, CoreRevision, GreyPicker, blockHeaderOf(), ledgerVersionOf(), applyBlock(), bytesOf(), chainOutcomesOf() (+25 more)

### Community 81 - "post-block-update-checks.ts"
Cohesion: 0.12
Nodes (30): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+22 more)

### Community 82 - "jsonText"
Cohesion: 0.11
Nodes (14): readRequest, SessionRecording, errorFrame(), isId(), isStructured(), isSubscribeMethod(), notificationFrame(), notificationMethod() (+6 more)

### Community 83 - "pglite-queue.test.ts"
Cohesion: 0.10
Nodes (19): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, pgliteBackend(), expectNoOutsideReads() (+11 more)

### Community 84 - "serve.test.ts"
Cohesion: 0.11
Nodes (23): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminStartOptions, AdminAnswer, AdminSnapshot, AdminView (+15 more)

### Community 85 - "crash.test.ts"
Cohesion: 0.09
Nodes (25): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, LateRedelivery, SkipsStartAtRestart, WORKER (+17 more)

### Community 87 - "lockstep-refusals.test.ts"
Cohesion: 0.12
Nodes (30): LockstepCondition, A118Observation, MismatchObservation, WaitSample, privateCursorHeight(), readPrivateCursor(), inMemoryBlock(), blockAt() (+22 more)

### Community 88 - ".#open"
Cohesion: 0.13
Nodes (7): CoreTransport, ProcessReason, SlowBlockEvent, Process, messageOf(), namedStartDb(), pause()

### Community 89 - "ref_node_path"
Cohesion: 0.10
Nodes (24): WriterProcess, WorkerEvent, blocksIn(), cleanUp(), startWriterProcess(), workDirectory(), dataDirectory(), expectPausedWriterKeepsLock() (+16 more)

### Community 9 - "PgTransactionLeaseLayer"
Cohesion: 0.03
Nodes (135): TransactionHistoryReader, TransactionHistoryWriter, Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, Rollback (+127 more)

### Community 91 - "history.property.test.ts"
Cohesion: 0.08
Nodes (26): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+18 more)

### Community 93 - "node.ts"
Cohesion: 0.13
Nodes (19): Json, Connection, TapeCall, TapeNodeOptions, CallRecord, NotifyRecord, SubscribeRecord, Entry (+11 more)

### Community 94 - "transforms.ts"
Cohesion: 0.21
Nodes (27): TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, checkTape(), liveSubscriptions(), notificationLines() (+19 more)

### Community 97 - "block-source.ts"
Cohesion: 0.11
Nodes (14): QueuedBlock, ItemSink, BlockItems, LateUse, FinalityStallCondition, EagerItems, EagerLoop, KeptItems (+6 more)

### Community 98 - "version-checks.ts"
Cohesion: 0.12
Nodes (16): MetadataNode, LedgerSelection, VersionedBlock, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata (+8 more)

### Community 99 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 48 - "version"
Cohesion: 0.04
Nodes (54): validateSaveOptions(), version(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3 (+46 more)

### Community 132 - "core-ledger-state.test.ts"
Cohesion: 0.12
Nodes (9): boundLedgerParser(), bindCoreLedgerState(), itemsOf(), retainedStatesOf(), writeBlock(), bound(), CORE_LEDGER_STATE_MIGRATIONS, NODES_PER_STATEMENT (+1 more)

### Community 135 - ".boolean"
Cohesion: 0.14
Nodes (14): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Map key order (+6 more)

### Community 141 - "repository"
Cohesion: 0.14
Nodes (15): repository(), 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA (+7 more)

### Community 142 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 144 - "pg"
Cohesion: 0.15
Nodes (12): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 2. Node-side query correlation (+4 more)

### Community 152 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 160 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 162 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.18
Nodes (10): 16. Whole system, 5. Runner, Requirement: RN-17 A slow block is reported, never cut off, Scenario: A slow callback, 13. Contract data, 15. Backups, 16. Browser, 18. Whole-system faults, differentials and measurements (+2 more)

### Community 169 - "001_chain_archive_core.ts"
Cohesion: 0.24
Nodes (9): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, Revision history, v2 — 2026-07-22, revised in response to a 3-reviewer design-council audit (Fable 5 / Opus / GPT-5.6 Sol), v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol) (+1 more)

### Community 173 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 210 - "Performance — design"
Cohesion: 0.29
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 225 - "ref_node_worker_threads"
Cohesion: 0.40
Nodes (4): hex(), requested, store, stored

### Community 227 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 246 - "Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data"
Cohesion: 0.40
Nodes (4): 2. Database API, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Scenario: A function in the configuration, Scenario: A user module from the configuration file

### Community 247 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.40
Nodes (5): released(), listen(), Requirement: CF-4 Every field is data, operational or secret, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases

### Community 249 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 259 - "Requirement: DT-4 Per-block changes of every module table"
Cohesion: 0.50
Nodes (4): insert(), Requirement: DT-4 Per-block changes of every module table, Scenario: Insert then update in one block, Scenario: Rewriting the same value

### Community 40 - "T"
Cohesion: 0.03
Nodes (71): T(), 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored (+63 more)

### Community 64 - "ADDED Requirements"
Cohesion: 0.05
Nodes (41): ledger(), Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why, ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database (+33 more)

### Community 74 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 75 - "UmbraDB module guide"
Cohesion: 0.06
Nodes (36): refused(), cursorRead(), following(), Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations (+28 more)

### Community 103 - "Full-Chain Storage — Design"
Cohesion: 0.08
Nodes (25): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+17 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+15 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 118 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.10
Nodes (14): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+6 more)

### Community 119 - "package.json"
Cohesion: 0.10
Nodes (19): description, exports, files, homepage, license, main, name, type (+11 more)

### Community 122 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 126 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 128 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.12
Nodes (17): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol, 6.1 Approved M1 module layout (+9 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 131 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 134 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 137 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 139 - "ROADMAP.md"
Cohesion: 0.13
Nodes (9): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+1 more)

### Community 140 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 148 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 149 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 153 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 155 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 156 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 158 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 159 - "README.md"
Cohesion: 0.30
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 161 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.17
Nodes (11): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 17. Required test ids added to the manifest, 3. Modules, 4. Configuration (+3 more)

### Community 163 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 164 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 165 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 166 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 167 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 168 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 170 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.18
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 171 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Scenario: An extra export, Scenario: Not in the package, Scenario: The changelog says so (+2 more)

### Community 174 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 175 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 176 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 177 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 178 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 179 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 180 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 181 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 182 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 184 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 185 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 186 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 187 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 188 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 189 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 190 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.22
Nodes (8): 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer), Design — v1.0.0 API Surface & Release Contract

### Community 191 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 192 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 194 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 195 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 196 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 197 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 198 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 199 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 200 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 201 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 202 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 203 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 204 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 205 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

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

### Community 217 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 218 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 219 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 220 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 221 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 222 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 223 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 224 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 226 - "Midnight Foundation Security Policy"
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

### Community 236 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 237 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 238 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 239 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 240 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 241 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 242 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 243 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 244 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 245 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 250 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 251 - "Vendored ledger builds"
Cohesion: 0.40
Nodes (4): Rebuilding, Updating a version, Vendored ledger builds, What the patches add

### Community 252 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 253 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.50
Nodes (3): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Suggested fix

### Community 254 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 255 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 256 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 257 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 258 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 260 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 261 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 264 - "Requirement: CF-5 Entries are revised by `(id, start)`"
Cohesion: 0.67
Nodes (3): Requirement: CF-5 Entries are revised by `(id, start)`, Scenario: A recorded entry is missing, Scenario: A scheduled entry is moved

### Community 265 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 65 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 66 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+28 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 86 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+22 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-9110`, `RFC-6455`, `RFC-6455`, `RFC-8259`, `@stryker-mutator/core` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3380 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionHistoryStorage`, `api-server.test.ts`, `UmbraError`, `node/client.test.ts`, `src/index.ts`, `runMigrations`, `admin-harness.ts`, `ingest-harness.ts`, `module-tables.ts`, `PgTransactionLeaseLayer`, `PgTemporalKV`, `pglite.ts`, `validate.ts`, `loop.test.ts`, `declaration.ts`, `config/history.ts`, `BlockRef`, `ledger-storage.test.ts`, `NodeClient`, `process-admin.ts`, `cursor-durability.crash.test.ts`, `chain-process.test.ts`, `ReadHandle`, `builds.ts`, `core-private-source.test.ts`, `.value`, `PgCheckpointStore`, `core-transport.ts`, `node-format.ts`, `runner/process.ts`, `adapter.ts`, `adapter-fixtures.ts`, `chain-placement.test.ts`, `changes.property.test.ts`, `run.test.ts`, `.read`, `spawnChild`, `transport-faults.test.ts`, `real-tapes.ts`, `ledger/types.ts`, `pglite-timeouts.test.ts`, `loop.ts`, `config-check.ts`, `private/backends.ts`, `column-rules.test.ts`, `order.property.test.ts`, `boundary.test.ts`, `5. Runner`, `mapping.ts`, `slow-block-harness.ts`, `recovery.test.ts`, `node.test.ts`, `core-settings.ts`, `ref_node_os`, `cbor.property.test.ts`, `networks.ts`, `core-block-commit.test.ts`, `transform-checks.ts`, `core-ledger-state.ts`, `post-block-update-checks.ts`, `jsonText`, `pglite-queue.test.ts`, `serve.test.ts`, `crash.test.ts`, `lockstep-refusals.test.ts`, `ref_node_path`, `history.property.test.ts`, `block-source.ts`, `version-checks.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `private/lockstep-wait.test.ts`, `ws-mutual-tls.test.ts`, `code-registry.ts`, `node-bridge.ts`, `ledger-sweep.test.ts`, `read-height.property.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `package.json`, `builder-checks.ts`, `retention.ts`, `height-versioned.property.test.ts`, `core-ledger-state.test.ts`, `version-selection.test.ts`, `mutation-per-adapter.mjs`, `identity.ts`, `upgrade-boundary.test.ts`, `twox.ts`, `excluded-not-exported.test.ts`, `facade-merge-loader.ts`?**
  _High betweenness centrality (0.299) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-9110`, `RFC-6455`, `RFC-6455` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionHistoryStorage` be split into smaller, more focused modules?**
  _Cohesion score 0.014159158022260922 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `api-server.test.ts`, `node/client.test.ts`, `core-ledger-state.test.ts`, `version-table.ts`, `admin-harness.ts`, `ingest-harness.ts`, `module-tables.ts`, `checkShape`, `pglite.ts`, `validate.ts`, `loop.test.ts`, `declaration.ts`, `config/history.ts`, `BlockRef`, `identity.ts`, `NodeClient`, `process-admin.ts`, `chain-process.test.ts`, `upgrade-boundary.test.ts`, `ReadHandle`, `builds.ts`, `core-private-source.test.ts`, `core-transport.ts`, `runner/process.ts`, `host.ts`, `changes.property.test.ts`, `.read`, `FinalizedLoop`, `transport-faults.test.ts`, `loop.ts`, `config-check.ts`, `graph.ts`, `mapping.ts`, `slow-block-harness.ts`, `cbor.ts`, `ref_node_os`, `UmbraDB module guide`, `core-block-commit.test.ts`, `core-ledger-state.ts`, `pglite-queue.test.ts`, `lockstep-refusals.test.ts`, `transforms.ts`, `version-checks.ts`, `pglite-writer.worker.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `api-server.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017978816703771168 - nodes in this community are weakly interconnected._