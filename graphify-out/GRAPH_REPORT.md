# Graph Report - UmbraDB

## Corpus Check
- 943 files · ~1,468,196 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 10227 nodes · 30476 edges · 287 communities (260 shown, 27 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 3385 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `3d8716592efb2b25` (943 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- validate.ts
- UmbraError
- BlockRef
- binding.test.ts
- height-versioned.property.test.ts
- Lockstep
- dispatch.ts
- tx-replay-decoder.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- crash.test.ts
- TransactionHandle
- PgChainArchiveStore
- dispatch.test.ts
- code-registry.ts
- ChainArchiveStore
- postgres/chain-archive-store.ts
- version-table.ts
- pglite-outside-reads.ts
- cursor-durability.crash.test.ts
- BlobIntegrityError
- commit-proxy.ts
- parseJsonLossless
- ingest-harness.ts
- ledger/metadata.ts
- cursor-table.property.test.ts
- ws-mutual-tls.test.ts
- checkShape
- type-check.ts
- no-indexer-or-wallet-sdk.test.ts
- core-ledger-state.ts
- column-rules.ts
- midnight-env — reproducible PREPROD dev environment
- Session
- NodeClient
- database-fixtures.ts
- ProcessItems
- tape/index.ts
- node/client.test.ts
- Heartbeat
- postgres-image.test.ts
- src/index.ts
- status-schema.test.ts
- n
- core-transport.ts
- mutation-evidence.d.mts
- vendored-ledger-files.test.ts
- no-chain-sync-import-guard.test.ts
- adapter-fixtures.ts
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- adapter.ts
- .#schedule
- .value
- stop-heights.test.ts
- SkipsAfterReconnect
- node-format.ts
- SignalSource
- CliBackend
- builder.test.ts
- LateRedelivery
- ledger-storage.test.ts
- ValidationError
- ModuleDeclaration
- core-block-parsed.ts
- range.ts
- chain-process.test.ts
- vitest
- ledger-tapes.ts
- NodeBlockSource
- LedgerPackage
- postgres/transaction-history-storage.ts
- .save
- module-tables.ts
- ref_node_crypto
- range.test.ts
- transform-checks.ts
- FinalizedLoop
- engine.ts
- opt-out.test.ts
- crash-worker.ts
- host.ts
- ref_node_fs
- admin-harness.ts
- declaration.ts
- writer-lock-checks.ts
- lifecycle.test.ts
- mapping.ts
- run.test.ts
- slow-block-harness.ts
- ledger/types.ts
- private/backends.ts
- refused-configuration.test.ts
- key-checks.ts
- builds.ts
- runner/process.ts
- zero-timeouts-checks.ts
- lockstep-refusals.test.ts
- transport-faults.test.ts
- cbor.ts
- graph.ts
- boundary.test.ts
- pglite.ts
- core-settings.ts
- PgliteDatabase
- postgres.ts
- runMigrations
- changes.property.test.ts
- column-refusals.test.ts
- core-chain-events.ts
- core-key-registry.test.ts
- pglite-queue.test.ts
- version-checks.ts
- PgTransactionLeaseLayer
- order.property.test.ts
- deterministic-postgresql/index.ts
- checks.test.ts
- height-versioned.test.ts
- networks.ts
- cbor.property.test.ts
- api-server.test.ts
- node-bridge.ts
- sweep-tapes.ts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- private/lockstep-wait.test.ts
- history.property.test.ts
- saveAndAdvance
- loggingModule
- .boolean
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- repository
- mutation-per-adapter.mjs
- pg
- fault
- call
- twox.ts
- facade-merge-loader.ts
- pack-install.mjs
- ref_node_url
- Performance — design
- tableRefusals
- Requirement: CF-4 Every field is data, operational or secret
- orphan-watcher.mjs
- Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data
- fresh-instance.mjs
- T
- fn
- table
- graph.py
- Full-Chain Storage — Design
- ADDED Requirements
- package.json
- ADDED Requirements
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- stryker.conf.json
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- devDependencies
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ROADMAP.md
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB dev environment — master runbook
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Roadmap
- compilerOptions
- README.md
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB V1.0.0 Implementation Guideline
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- 3. Proof-blocking findings
- Requirement: DT-6 Stored data avoids non-deterministic values
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- UmbraDB
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- Design — Postgres+JSONB storage rebuild
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Tasks — v1.1.0: Quint model checking
- conformance-gate.mjs
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Tasks — v1.0.0-infosec-signoff
- Our Pledge
- Algebraic Specification of the midnight-pg-store Storage Layer
- Midnight infra verification checklist
- 12. Milestone status
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0 API Surface & Release Contract
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 5. Recommended candidate model
- Proposal — Sprint 1: project setup + TemporalKV
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
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- manifest.json
- Vendored ledger builds
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
- 9. Backups and browser
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
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 314 edges
2. `UmbraError` - 252 edges
3. `ModuleDeclaration` - 154 edges
4. `FinalizedLoop` - 116 edges
5. `PgTransactionLeaseLayer` - 93 edges
6. `InMemoryBlockSource` - 92 edges
7. `NodeClient` - 91 edges
8. `runMigrations()` - 90 edges
9. `Database` - 87 edges
10. `ValidationError` - 87 edges

## Surprising Connections (you probably didn't know these)
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `2.1 Historical implementation baseline` --references--> `PgTemporalKV`  [INFERRED]
  Formal/STORAGE_ALGEBRA_LEAN_RESEARCH.md → src/postgres/temporal-kv.ts
- `Scenario: load before any save rejects with CheckpointNotFoundError` --references--> `CheckpointNotFoundError`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/specs/wallet-state-envelope/spec.md → src/interfaces/checkpoint-store.ts
- `Scenario: save on a caller transaction behaves identically to the internal-transaction path for a reader` --references--> `CheckpointSummary`  [INFERRED]
  openspec/changes/v1.0.0-durable-checkpoint-cursor/specs/durable-composition/spec.md → src/interfaces/checkpoint-store.ts
- `The honest-test pattern (what makes each required test non-vacuous)` --references--> `ChunkMissingError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (287 total, 27 thin omitted)

### Community 0 - "validate.ts"
Cohesion: 0.02
Nodes (291): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, ProcessAdminOptions, RevisionSettings, SnapshotFacts, ConfigSnapshot (+283 more)

### Community 1 - "UmbraError"
Cohesion: 0.02
Nodes (205): BlockWriteHandle, CommittedHeight, Database, ReadOnlyDatabase, ReadOptions, SchemaWriteHandle, Transaction, ReadTimeoutSetting (+197 more)

### Community 10 - "BlockRef"
Cohesion: 0.03
Nodes (73): ChainCheck, ChainCheckInput, ConfiguredGenesis, PrivateBlockSource, PrivateChecks, privateIntake, SourceTransport, PublicDatabase (+65 more)

### Community 102 - "binding.test.ts"
Cohesion: 0.12
Nodes (24): A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), a113Problems(), a156Problems() (+16 more)

### Community 103 - "height-versioned.property.test.ts"
Cohesion: 0.13
Nodes (20): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Key, Model (+12 more)

### Community 104 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 105 - "dispatch.ts"
Cohesion: 0.14
Nodes (18): Callback, EntryBoundary, ParallelPoint, PointArguments, PointSchedule, SkipsStartAtRestart, StartsAtEveryRevision, boundaryModules() (+10 more)

### Community 106 - "tx-replay-decoder.ts"
Cohesion: 0.10
Nodes (25): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+17 more)

### Community 107 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 108 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 109 - "crash.test.ts"
Cohesion: 0.12
Nodes (22): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+14 more)

### Community 11 - "TransactionHandle"
Cohesion: 0.03
Nodes (123): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus, TransactionHistoryWriter, AsOf (+115 more)

### Community 111 - "PgChainArchiveStore"
Cohesion: 0.19
Nodes (10): BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf(), sha256Hex() (+2 more)

### Community 112 - "dispatch.test.ts"
Cohesion: 0.11
Nodes (18): PointRun, CallEvent, ids(), registering(), waveIds(), recording(), runOf(), yields() (+10 more)

### Community 113 - "code-registry.ts"
Cohesion: 0.14
Nodes (22): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+14 more)

### Community 115 - "ChainArchiveStore"
Cohesion: 0.09
Nodes (10): ChainArchiveStore, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents, `transactions` (chain_archive) (+2 more)

### Community 116 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (17): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind (+9 more)

### Community 117 - "version-table.ts"
Cohesion: 0.17
Nodes (21): LedgerPin, LedgerRow, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 118 - "pglite-outside-reads.ts"
Cohesion: 0.17
Nodes (14): LoadOutcome, OutsideRead, Traced, PgliteTestDatabase, pgliteBackend(), expectNoOutsideReads(), outsideReads(), runUnderReadLoad() (+6 more)

### Community 12 - "cursor-durability.crash.test.ts"
Cohesion: 0.03
Nodes (121): JsonValue, KvRow, BatchSpec, CurrentState, InvariantResult, C5AnyFn, CurrentState, CurrentState (+113 more)

### Community 122 - "BlobIntegrityError"
Cohesion: 0.20
Nodes (12): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+4 more)

### Community 124 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 127 - "parseJsonLossless"
Cohesion: 0.19
Nodes (9): Connection, parseJsonLossless(), errorMessage(), encodeJson(), hex(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem (+1 more)

### Community 13 - "ingest-harness.ts"
Cohesion: 0.04
Nodes (106): BlockHeader, ProcessCondition, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded (+98 more)

### Community 132 - "ledger/metadata.ts"
Cohesion: 0.18
Nodes (6): MetadataBlock, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, contentStateOf(), hexOf()

### Community 133 - "cursor-table.property.test.ts"
Cohesion: 0.16
Nodes (16): CursorValue, Access, Block, BlockFails, Counts, Write, canonicalText(), expectValue() (+8 more)

### Community 134 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 136 - "checkShape"
Cohesion: 0.30
Nodes (8): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), 14. External claims and their evidence

### Community 138 - "type-check.ts"
Cohesion: 0.18
Nodes (11): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), isRegularFile(), packageType(), typeCheckFile() (+3 more)

### Community 139 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.21
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 14 - "core-ledger-state.ts"
Cohesion: 0.03
Nodes (83): BlockLedgerSource, CoreLedgerStateOptions, LedgerBinding, retainedStates, CoreRevision, GreyPicker, GreyView, SweepPhase (+75 more)

### Community 15 - "column-rules.ts"
Cohesion: 0.03
Nodes (103): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+95 more)

### Community 153 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 157 - "Session"
Cohesion: 0.22
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 16 - "NodeClient"
Cohesion: 0.05
Nodes (67): CoreChainBinding, Connection, HeadSubscriber, NodeCallOptions, NodeClient, NodeRetry, Pending, State (+59 more)

### Community 164 - "database-fixtures.ts"
Cohesion: 0.20
Nodes (8): CheckTarget, Snapshot, blocksSql(), pgliteCliBackend(), record(), rowsSql(), snapshotWith(), CLI_BACKENDS

### Community 17 - "tape/index.ts"
Cohesion: 0.05
Nodes (73): Recorded, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError (+65 more)

### Community 18 - "node/client.test.ts"
Cohesion: 0.03
Nodes (56): NodeClientOptions, Answer, FakeNode, Handler, Received, recorded, ManualTimers, ConnectionFrames (+48 more)

### Community 180 - "Heartbeat"
Cohesion: 0.36
Nodes (5): Heartbeat, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 181 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 2 - "src/index.ts"
Cohesion: 0.02
Nodes (212): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError, ChunkMissingError (+204 more)

### Community 20 - "status-schema.test.ts"
Cohesion: 0.04
Nodes (78): adminRoutes, AdminChannel, AdminServeOptions, DigestRow, ModuleFacts, PartTable, AdminAnswer, AdminEndpoint (+70 more)

### Community 203 - "n"
Cohesion: 0.29
Nodes (7): Absent, n(), 3.3 T3 omits the current event and cannot replay a pruned suffix, 4. Law-by-law repair map, Requirement: CheckpointSummary metadata is populated and label round-trips, Scenario: A label given at save time is returned by history and load, Scenario: byteLength, chunkCount, and createdAt reflect the saved payload

### Community 21 - "core-transport.ts"
Cohesion: 0.03
Nodes (75): PublicSide, PublicSideOptions, Session, TransportLimits, TransportTls, Committed, Hello, HelloAck (+67 more)

### Community 211 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 212 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 213 - "no-chain-sync-import-guard.test.ts"
Cohesion: 0.53
Nodes (5): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles()

### Community 22 - "adapter-fixtures.ts"
Cohesion: 0.06
Nodes (83): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState (+75 more)

### Community 220 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 23 - "adapter.ts"
Cohesion: 0.04
Nodes (73): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+65 more)

### Community 24 - ".value"
Cohesion: 0.06
Nodes (62): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+54 more)

### Community 25 - "stop-heights.test.ts"
Cohesion: 0.05
Nodes (75): ProcessStatus, Job, WorkerEvent, WORKER, Q142Observation, A43Observation, testBuild, AlwaysLost (+67 more)

### Community 26 - "node-format.ts"
Cohesion: 0.06
Nodes (57): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+49 more)

### Community 27 - "builder.test.ts"
Cohesion: 0.04
Nodes (43): ConnectionFrames, Failure, Variant, WrongRecording, Metadata, Step, Frame, RawClient (+35 more)

### Community 28 - "ledger-storage.test.ts"
Cohesion: 0.05
Nodes (79): Call, SeenLoad, RestartEvent, RestartJob, retentionSeen, LedgerTx, recordedGenesis, ProcessDatabase (+71 more)

### Community 29 - "ValidationError"
Cohesion: 0.03
Nodes (81): ValidationError, coerceToSafeNumber(), 0. Package layout, 1. Chunking, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 6. Migration (`002_checkpoint_store.ts`), 9. Test infrastructure, Design — Sprint 3: CheckpointStore (+73 more)

### Community 3 - "ModuleDeclaration"
Cohesion: 0.02
Nodes (174): QueuedBlock, ItemSink, ModuleDeclaration, PendingKey, PointName, EntryRange, GraphInput, HeightRange (+166 more)

### Community 30 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (75): BlockHeaderItem, BodyExtrinsic, BlockBody, CoreBlockHeader, BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser (+67 more)

### Community 31 - "range.ts"
Cohesion: 0.05
Nodes (62): Refusal, BoundaryBlockReading, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command (+54 more)

### Community 32 - "chain-process.test.ts"
Cohesion: 0.04
Nodes (53): BlockContext, InMemoryItems, Wait, StandInOptions, ChainBuildOptions, A77Observation, A78Observation, A78Refusal (+45 more)

### Community 33 - "vitest"
Cohesion: 0.03
Nodes (58): ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, ReportedTest, guardPid() (+50 more)

### Community 34 - "ledger-tapes.ts"
Cohesion: 0.07
Nodes (68): BlockSpec, EventSpec, Scenario, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase (+60 more)

### Community 35 - "NodeBlockSource"
Cohesion: 0.06
Nodes (28): CoreBlockItems, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeSubscription, NodeHeader, PreparedBlock (+20 more)

### Community 36 - "LedgerPackage"
Cohesion: 0.06
Nodes (36): LedgerName, LedgerEventKind, LedgerPackage, LedgerEngine, LedgerLoader, LoaderModule, InThreadLedgerOptions, hexOf() (+28 more)

### Community 37 - "postgres/transaction-history-storage.ts"
Cohesion: 0.04
Nodes (59): EntryContent, EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, LifecycleDetailStore, TestEntry, TestSection (+51 more)

### Community 38 - ".save"
Cohesion: 0.07
Nodes (53): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+45 more)

### Community 39 - "module-tables.ts"
Cohesion: 0.05
Nodes (54): CaptureColumn, CanonicalEncodingFailure, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ColumnType (+46 more)

### Community 4 - "ref_node_crypto"
Cohesion: 0.02
Nodes (183): MergeEntriesFn, TransactionHistoryEntry, TransactionHistoryStorage, PgTransactionHistoryStorage, PgWalletSdkTransactionHistoryAdapter, InMemoryTransactionHistoryStorage, CheckpointStore, TemporalKV (+175 more)

### Community 40 - "range.test.ts"
Cohesion: 0.05
Nodes (43): ConnectSocket, ScriptedNode, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade, BoundaryOptions (+35 more)

### Community 42 - "transform-checks.ts"
Cohesion: 0.07
Nodes (45): Failure, Variant, TapeError, TransformError, SubscriptionId, NotificationRange, turns(), baseRecords() (+37 more)

### Community 43 - "FinalizedLoop"
Cohesion: 0.05
Nodes (19): FinalizedLoop, LoopObserver, Startup, PublicCoreOptions, SkipsLockstep, SkipsUnseen, WaitsInTransaction, WaitingInRead (+11 more)

### Community 44 - "engine.ts"
Cohesion: 0.06
Nodes (48): LedgerStateItem, ApplyInput, ApplyOutput, ChainOutcome, NodeStore, ParsedTransaction, StateHandle, StateSummary (+40 more)

### Community 45 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (47): PlacedRefusal, Refusal, shadowTableName(), captured(), hex(), moduleM(), restart(), sha256() (+39 more)

### Community 46 - "crash-worker.ts"
Cohesion: 0.05
Nodes (48): WatermarkKey, WatermarkKind, WatermarkValue, SaveAndAdvanceCursor, WatermarkRow, CoTxCallable, CoTxPauseInfo, CrashHook (+40 more)

### Community 47 - "host.ts"
Cohesion: 0.06
Nodes (36): RetainedState, LedgerTask, LoadState, LedgerActivity, LedgerHost, LedgerWorkerFailure, LedgerWorkerOptions, NodeDatabase (+28 more)

### Community 48 - "ref_node_fs"
Cohesion: 0.06
Nodes (37): FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+29 more)

### Community 49 - "admin-harness.ts"
Cohesion: 0.06
Nodes (45): FromAdmin, ToAdmin, AdminServer, AdminStarter, AdminStartOptions, AdminSnapshot, AdminRun, Answerer (+37 more)

### Community 5 - "declaration.ts"
Cohesion: 0.02
Nodes (168): CommandBuildOptions, ConfigCheckReport, coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig (+160 more)

### Community 50 - "writer-lock-checks.ts"
Cohesion: 0.08
Nodes (44): WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, startWriter(), blocksIn(), cleanUp() (+36 more)

### Community 51 - "lifecycle.test.ts"
Cohesion: 0.07
Nodes (50): Answered, Observation, Start, Child, startProcess(), adminCore(), adminSource(), ask() (+42 more)

### Community 52 - "mapping.ts"
Cohesion: 0.06
Nodes (39): ResultType, Case, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+31 more)

### Community 53 - "run.test.ts"
Cohesion: 0.06
Nodes (40): CommandIo, cliProject, CommandResult, RunningCommand, statsConfig, runArguments(), runCommand(), runProcessCommand() (+32 more)

### Community 54 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (42): BlockItemSource, HeightActivity, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead (+34 more)

### Community 55 - "ledger/types.ts"
Cohesion: 0.07
Nodes (40): LoadLedger, LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, LedgerPackageOptions, SlowStep, TestLoaderData (+32 more)

### Community 56 - "private/backends.ts"
Cohesion: 0.07
Nodes (30): PrivateIntakeOptions, PrivateBackend, SessionSeen, TestDatabase, PrivateOptions, A155Observation, Outcome, A112Observation (+22 more)

### Community 57 - "refused-configuration.test.ts"
Cohesion: 0.07
Nodes (44): ProcessConfig, ProcessHandle, Refusal, Start, ProcessBackend, adminSnapshot(), statusSnapshot(), heldPort() (+36 more)

### Community 58 - "key-checks.ts"
Cohesion: 0.07
Nodes (50): Admission, AdmittedSeen, Blocking, KeyCall, KeyRefusal, KeyRow, Restarts, TestKeyConfig (+42 more)

### Community 59 - "builds.ts"
Cohesion: 0.08
Nodes (35): PrivateProcess, PrivateRefusal, PrivateSeen, A114Observation, A116Observation, TestLink, Pause, privateBackbone() (+27 more)

### Community 6 - "runner/process.ts"
Cohesion: 0.02
Nodes (98): PrivateSideFacts, ProcessAdmin, PrivateInstanceFacts, Bound, ChainSource, CoreChainFacts, NodeWait, WaitingListener (+90 more)

### Community 60 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (34): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+26 more)

### Community 61 - "lockstep-refusals.test.ts"
Cohesion: 0.10
Nodes (45): PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, a113Run(), withCore(), privateModule() (+37 more)

### Community 62 - "transport-faults.test.ts"
Cohesion: 0.08
Nodes (34): ResultColumn, Message, MessageType, Pem, TestCertificates, Ended, rawClient, mutualTlsOptions() (+26 more)

### Community 63 - "cbor.ts"
Cohesion: 0.08
Nodes (41): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+33 more)

### Community 64 - "graph.ts"
Cohesion: 0.08
Nodes (47): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+39 more)

### Community 65 - "boundary.test.ts"
Cohesion: 0.10
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 66 - "pglite.ts"
Cohesion: 0.06
Nodes (34): Job, Held, PgliteLockUse, Outcome, ServerErrorFields, Job, acquirePgliteLock(), lockHeld() (+26 more)

### Community 67 - "core-settings.ts"
Cohesion: 0.06
Nodes (42): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys (+34 more)

### Community 68 - "PgliteDatabase"
Cohesion: 0.08
Nodes (21): JobQueue, PgliteDatabase, Writer, commitRolledBack(), handleClosed(), allowMultiStatement(), failedEarlier(), nestedCall() (+13 more)

### Community 69 - "postgres.ts"
Cohesion: 0.09
Nodes (36): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, DriverError, Outcome, PostgresOptions, Role (+28 more)

### Community 7 - "runMigrations"
Cohesion: 0.02
Nodes (129): AnySql, RolloverBucket, RolloverTable, UmbraDBConnectionOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration (+121 more)

### Community 71 - "changes.property.test.ts"
Cohesion: 0.08
Nodes (39): CanonicalEncodingError, ChangeKind, tableChanges, TouchedRow, Op, States, TableName, digestBlock() (+31 more)

### Community 75 - "column-refusals.test.ts"
Cohesion: 0.09
Nodes (22): DeterminismBackend, TestDatabase, TestServer, Backend, Case, freshDatabase(), hashOf(), hex() (+14 more)

### Community 76 - "core-chain-events.ts"
Cohesion: 0.07
Nodes (31): BlockEventSource, isBlockEventSource(), bindCoreChainEvents(), boundEventSource(), chainEventsItemOf(), chainEventsOf(), coreChainEventsOnFetch(), metadataView() (+23 more)

### Community 77 - "core-key-registry.test.ts"
Cohesion: 0.07
Nodes (27): AdmittedKey, KeyRegistryOptions, Run, RunKey, TestKey, admittedOf(), bytesOfHex(), idText() (+19 more)

### Community 78 - "pglite-queue.test.ts"
Cohesion: 0.06
Nodes (22): Phase, HeldRead, Job, Outcome, Reads, Step, postgresCliBackend(), postgresBackend() (+14 more)

### Community 79 - "version-checks.ts"
Cohesion: 0.13
Nodes (28): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, Answers, toHex() (+20 more)

### Community 8 - "PgTransactionLeaseLayer"
Cohesion: 0.02
Nodes (116): BenchEnv, PgCheckpointStore, UmbraDBSql, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters, GcPass (+108 more)

### Community 80 - "order.property.test.ts"
Cohesion: 0.09
Nodes (37): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, dispatch(), isParallelPoint(), runSchedule() (+29 more)

### Community 81 - "deterministic-postgresql/index.ts"
Cohesion: 0.10
Nodes (31): CapturedTable, CaptureState, GuardTableRow, ConsistentRead, optOut, captureDefinitions(), capturedTables(), captureFunctionName() (+23 more)

### Community 82 - "checks.test.ts"
Cohesion: 0.07
Nodes (24): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, attachIntegerChecks() (+16 more)

### Community 84 - "height-versioned.test.ts"
Cohesion: 0.09
Nodes (21): cursorTable, CursorTableOptions, heightVersionedTable, HeightVersionedTableOptions, Migration, Control, BlockFails, Height (+13 more)

### Community 87 - "networks.ts"
Cohesion: 0.07
Nodes (32): Boundary, BoundaryBlock, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource, Answers (+24 more)

### Community 88 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (31): CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical() (+23 more)

### Community 9 - "api-server.test.ts"
Cohesion: 0.02
Nodes (123): versionEntry, ApiRegistry, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, StartedModuleApi, VersionedResponse (+115 more)

### Community 91 - "node-bridge.ts"
Cohesion: 0.11
Nodes (19): ChildReader, BridgeServer, bridgeStore, Growable, childRefKeys(), readChildren(), decodeNodes(), encodedSize() (+11 more)

### Community 92 - "sweep-tapes.ts"
Cohesion: 0.14
Nodes (29): TableSnapshot, FixtureNode, hex(), insertionOrder(), firstVersion(), hex(), runFixture(), hex() (+21 more)

### Community 93 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.07
Nodes (25): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED) (+17 more)

### Community 95 - "private/lockstep-wait.test.ts"
Cohesion: 0.10
Nodes (22): LockstepCondition, Report, A118Observation, MismatchObservation, ExpectedWait, WaitSample, ReportRelay, RetargetProxy (+14 more)

### Community 97 - "history.property.test.ts"
Cohesion: 0.08
Nodes (26): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+18 more)

### Community 19 - "saveAndAdvance"
Cohesion: 0.02
Nodes (99): validateSaveOptions(), saveAndAdvance(), tx(), version(), 1. The invariant: the cursor is never ahead of its data, 2.1 Atomic co-commit (preferred): `saveAndAdvance` or one shared `tx`, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions (+91 more)

### Community 114 - "loggingModule"
Cohesion: 0.13
Nodes (21): busy(), holder(), withRoute(), migrating(), secretDatabase(), secretProblems(), module(), leaking() (+13 more)

### Community 119 - ".boolean"
Cohesion: 0.11
Nodes (18): insert(), 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints (+10 more)

### Community 125 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (16): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 3. Modules (+8 more)

### Community 141 - "repository"
Cohesion: 0.14
Nodes (15): repository(), 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA (+7 more)

### Community 142 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 144 - "pg"
Cohesion: 0.15
Nodes (12): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 2. Node-side query correlation (+4 more)

### Community 145 - "fault"
Cohesion: 0.14
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 149 - "call"
Cohesion: 0.25
Nodes (3): call(), isBlock(), sameBytes()

### Community 150 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 161 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 170 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 210 - "Performance — design"
Cohesion: 0.29
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 218 - "tableRefusals"
Cohesion: 0.33
Nodes (5): tableRefusals(), 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 224 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.33
Nodes (6): released(), vendored(), listen(), Requirement: CF-4 Every field is data, operational or secret, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases

### Community 234 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 250 - "Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data"
Cohesion: 0.40
Nodes (4): 2. Database API, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Scenario: A function in the configuration, Scenario: A user module from the configuration file

### Community 252 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 41 - "T"
Cohesion: 0.03
Nodes (69): T(), 1. TemporalKV — event-sourced right action with a CAS guard, ADDED Requirements, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+61 more)

### Community 70 - "fn"
Cohesion: 0.05
Nodes (43): fn(), ADDED Requirements, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API, ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError (+35 more)

### Community 72 - "table"
Cohesion: 0.05
Nodes (41): table(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, Cursor tables, Data that is not a function of the chain, Height-versioned tables (+33 more)

### Community 83 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 85 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

### Community 101 - "package.json"
Cohesion: 0.07
Nodes (28): bin, umbradb, bugs, url, description, engines, node, exports (+20 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+18 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 121 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
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

### Community 129 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+8 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 131 - "scripts"
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

### Community 151 - "UmbraDB dev environment — master runbook"
Cohesion: 0.14
Nodes (11): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT) (+3 more)

### Community 152 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 156 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 159 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 160 - "README.md"
Cohesion: 0.30
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 162 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 163 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 165 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 166 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 167 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 168 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.18
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 171 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 172 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 173 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 174 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 175 - "3. Proof-blocking findings"
Cohesion: 0.20
Nodes (10): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption, 3.8 C2 safety and liveness are different theorem classes (+2 more)

### Community 176 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 177 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 178 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 179 - "UmbraDB"
Cohesion: 0.20
Nodes (10): Contents, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB, Verification: what is proved, checked, and tested (+2 more)

### Community 182 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.22
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 183 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 184 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.22
Nodes (9): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 8. Test infrastructure (open decision — resolve in Task 1) (+1 more)

### Community 185 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 186 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 187 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 188 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution, Design — v1.0.0-infosec-signoff

### Community 189 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 190 - "conformance-gate.mjs"
Cohesion: 0.22
Nodes (8): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli

### Community 191 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 192 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 193 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.25
Nodes (7): Benchmarks, Compatibility, and what 1.0.0 needs, Installing, Security, UmbraDB 0.9.5 "Penumbra", What is proved, and what that is worth, What this is not

### Community 194 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 195 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 196 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 197 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 198 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 199 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 200 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.29
Nodes (5): 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 201 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 202 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 205 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 206 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 207 - "Acceptance — v1.0.0 API Surface & Release Contract"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0 API Surface & Release Contract, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in), Precondition (blocks the whole change)

### Community 208 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 209 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 214 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 215 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 216 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 217 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 219 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 221 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 222 - "5. Recommended candidate model"
Cohesion: 0.33
Nodes (6): 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 223 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 225 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 226 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 227 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 228 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 229 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 230 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 231 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 232 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 235 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 236 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 237 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 238 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 239 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 240 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 241 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 242 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 243 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 244 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 245 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 246 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 247 - "00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 248 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 249 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 251 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 254 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 255 - "Vendored ledger builds"
Cohesion: 0.40
Nodes (4): Rebuilding, Updating a version, Vendored ledger builds, What the patches add

### Community 256 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 257 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 258 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 259 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 260 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 261 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.50
Nodes (4): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The core leaves an answer as the module wrote it

### Community 262 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 263 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 268 - "9. Backups and browser"
Cohesion: 0.67
Nodes (3): 9.1 Backups (BK; Q83, Q85), 9.2 Browser build (BR), 9. Backups and browser

### Community 73 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 89 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides, Requirement: LG-17 Ledger tasks give modules the native objects (+25 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points (+24 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

## Knowledge Gaps
- **52 isolated node(s):** `RFC-8785`, `RFC-8785`, `RFC-3339`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3423 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `validate.ts`, `UmbraError`, `src/index.ts`, `ModuleDeclaration`, `ref_node_crypto`, `declaration.ts`, `runner/process.ts`, `runMigrations`, `PgTransactionLeaseLayer`, `api-server.test.ts`, `BlockRef`, `TransactionHandle`, `cursor-durability.crash.test.ts`, `ingest-harness.ts`, `core-ledger-state.ts`, `column-rules.ts`, `NodeClient`, `tape/index.ts`, `node/client.test.ts`, `status-schema.test.ts`, `core-transport.ts`, `adapter-fixtures.ts`, `adapter.ts`, `.value`, `stop-heights.test.ts`, `node-format.ts`, `builder.test.ts`, `ledger-storage.test.ts`, `core-block-parsed.ts`, `chain-process.test.ts`, `ledger-tapes.ts`, `NodeBlockSource`, `postgres/transaction-history-storage.ts`, `module-tables.ts`, `range.test.ts`, `transform-checks.ts`, `engine.ts`, `opt-out.test.ts`, `crash-worker.ts`, `host.ts`, `ref_node_fs`, `admin-harness.ts`, `writer-lock-checks.ts`, `lifecycle.test.ts`, `mapping.ts`, `run.test.ts`, `slow-block-harness.ts`, `ledger/types.ts`, `private/backends.ts`, `refused-configuration.test.ts`, `key-checks.ts`, `builds.ts`, `zero-timeouts-checks.ts`, `lockstep-refusals.test.ts`, `transport-faults.test.ts`, `boundary.test.ts`, `pglite.ts`, `core-settings.ts`, `postgres.ts`, `changes.property.test.ts`, `column-refusals.test.ts`, `core-chain-events.ts`, `core-key-registry.test.ts`, `pglite-queue.test.ts`, `version-checks.ts`, `order.property.test.ts`, `checks.test.ts`, `height-versioned.test.ts`, `networks.ts`, `cbor.property.test.ts`, `node-bridge.ts`, `sweep-tapes.ts`, `private/lockstep-wait.test.ts`, `history.property.test.ts`, `package.json`, `binding.test.ts`, `height-versioned.property.test.ts`, `Lockstep`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `crash.test.ts`, `dispatch.test.ts`, `code-registry.ts`, `loggingModule`, `pglite-outside-reads.ts`, `BlobIntegrityError`, `cursor-table.property.test.ts`, `ws-mutual-tls.test.ts`, `type-check.ts`, `no-indexer-or-wallet-sdk.test.ts`, `mutation-per-adapter.mjs`, `twox.ts`, `midnight-env — reproducible PREPROD dev environment`, `excluded-not-exported.test.ts`, `facade-merge-loader.ts`, `Heartbeat`, `postgres-image.test.ts`, `ref_node_url`, `vendored-ledger-files.test.ts`, `no-chain-sync-import-guard.test.ts`?**
  _High betweenness centrality (0.300) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8785`, `RFC-8785`, `RFC-3339` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `validate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.015098600030106879 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `validate.ts`, `ModuleDeclaration`, `ledger/metadata.ts`, `declaration.ts`, `runner/process.ts`, `checkShape`, `api-server.test.ts`, `BlockRef`, `ingest-harness.ts`, `core-ledger-state.ts`, `NodeClient`, `tape/index.ts`, `node/client.test.ts`, `status-schema.test.ts`, `core-transport.ts`, `stop-heights.test.ts`, `ledger-storage.test.ts`, `Session`, `range.ts`, `chain-process.test.ts`, `vitest`, `NodeBlockSource`, `LedgerPackage`, `module-tables.ts`, `transform-checks.ts`, `FinalizedLoop`, `opt-out.test.ts`, `host.ts`, `writer-lock-checks.ts`, `lifecycle.test.ts`, `mapping.ts`, `slow-block-harness.ts`, `ledger/types.ts`, `private/backends.ts`, `refused-configuration.test.ts`, `zero-timeouts-checks.ts`, `lockstep-refusals.test.ts`, `transport-faults.test.ts`, `cbor.ts`, `graph.ts`, `pglite.ts`, `core-settings.ts`, `PgliteDatabase`, `postgres.ts`, `changes.property.test.ts`, `table`, `core-key-registry.test.ts`, `pglite-queue.test.ts`, `version-checks.ts`, `deterministic-postgresql/index.ts`, `checks.test.ts`, `height-versioned.test.ts`, `binding.test.ts`, `version-table.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.020351587423819057 - nodes in this community are weakly interconnected._