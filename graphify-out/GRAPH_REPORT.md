# Graph Report - UmbraDB

## Corpus Check
- 956 files · ~1,485,219 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 10370 nodes · 31067 edges · 274 communities (249 shown, 25 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 3400 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `848d65d38128fcae` (956 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionLeaseLayer
- translatePostgresError
- vitest
- PgChainArchiveStore
- recovery.test.ts
- node-source.ts
- binding.test.ts
- PrivateTransport
- tx-replay-decoder.ts
- builds.ts
- block-fetch-decode.test.ts
- declaration.ts
- node-bridge.ts
- postgres/chain-archive-store.ts
- identity.ts
- core-key-registry.ts
- checks.test.ts
- TapeRecord
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- commit-proxy.ts
- height-versioned.property.test.ts
- ChainArchiveStore
- 3. Proof-blocking findings
- config/history.ts
- ws-mutual-tls.test.ts
- checkShape
- read-height.property.test.ts
- column-rules.ts
- attempt
- PgCheckpointStore
- loop.test.ts
- holds
- ProcessItems
- NodeClient
- api-server.test.ts
- HeldHeight
- admin-harness.ts
- ref_node_crypto
- core-transport.ts
- mutation-evidence.d.mts
- range.ts
- db/errors.ts
- .save
- exitWithin
- adapter-fixtures.ts
- createClient
- opt-out.test.ts
- ledger-storage.test.ts
- api.ts
- chain-placement.test.ts
- chain-process.test.ts
- node/client.test.ts
- adapter.ts
- cbor.ts
- key-checks.ts
- core-block-parsed.ts
- node-format.ts
- runner/process.ts
- ledger/types.ts
- runMigrations
- core-private-source.test.ts
- FinalizedLoop
- configuration.ts
- config-check.ts
- refused-configuration.test.ts
- writer-lock-checks.ts
- process-context.test.ts
- validate.test.ts
- readiness.test.ts
- change-capture.ts
- .value
- core-ledger-state.ts
- ingest-harness.ts
- backup/backup.ts
- boundary.test.ts
- networks.ts
- ModuleDeclaration
- child-processes.test.ts
- LedgerPackage
- 12. Ledger
- changes.property.test.ts
- version-checks.ts
- ledger-sweep.test.ts
- src/index.ts
- plain-data.ts
- build-modules.ts
- graph.ts
- NodeBlockSource
- mapping.ts
- Process
- private/backends.ts
- real-tapes.ts
- process-admin.ts
- zero-timeouts-checks.ts
- PgTemporalKV
- lockstep-refusals.test.ts
- core-settings.ts
- BlockRef
- validate.ts
- ValidationError
- validation.ts
- tape/index.ts
- differential-equivalence.test.ts
- order.property.test.ts
- Lockstep
- UmbraError
- check-required-tests.ts
- legacy-excluded.test.ts
- intake.test.ts
- db/migrate.test.ts
- code-registry.ts
- table
- Requirement: DT-6 Stored data avoids non-deterministic values
- core-key-registry.test.ts
- Tasks — v1.0.0-infosec-signoff
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- pg
- twox.ts
- facade-merge-loader.ts
- pack-install.mjs
- scoped-review-manifest
- chain_archive lineage
- .slowBlockMs
- midnight-env — reproducible PREPROD dev environment
- .boolean
- Performance — design
- orphan-watcher.mjs
- fresh-instance.mjs
- version
- graph.py
- Full-Chain Storage — Design
- fn
- package.json
- ADDED Requirements
- UmbraDB third-party component inventory (SBOM)
- Storage Algebra Lean Formalization — Approved Design and Status
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- stryker.conf.json
- ADDED Requirements
- devDependencies
- scripts
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ROADMAP.md
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- README.md
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- Roadmap
- compilerOptions
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- ADDED Requirements
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- UmbraDB
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- Design — Postgres+JSONB storage rebuild
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.1.0: Quint model checking
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Repository agent policy
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
- 00023 — The blocks table's height partitions end at 5,000,000
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
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
- Requirement: PP-2 A private database is bound to one public database
- Requirement: RN-16 Chain-data reads name their view and height
- Acceptance criteria — v1.0.0-perf-baseline
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- Requirement: set is an idempotent, unconditional overwrite (Law W1)
- peerDependenciesMeta
- repository
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- bin
- engines
- peerDependencies
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
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 318 edges
2. `UmbraError` - 272 edges
3. `ModuleDeclaration` - 156 edges
4. `FinalizedLoop` - 116 edges
5. `InMemoryBlockSource` - 95 edges
6. `PgTransactionLeaseLayer` - 93 edges
7. `NodeClient` - 91 edges
8. `Database` - 91 edges
9. `runMigrations()` - 90 edges
10. `PgCheckpointStore` - 87 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: history for a wallet+network with no checkpoints resolves empty` --references--> `CheckpointNotFoundError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts
- `Scenario: No checkpoint exists for the wallet+network at all` --references--> `CheckpointNotFoundError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts
- `Scenario: load before any save rejects with CheckpointNotFoundError` --references--> `CheckpointNotFoundError`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/specs/wallet-state-envelope/spec.md → src/interfaces/checkpoint-store.ts
- `Scenario: A chunk whose stored content no longer matches its recorded hash is rejected` --references--> `ChunkIntegrityError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts
- `The honest-test pattern (what makes each required test non-vacuous)` --references--> `ChunkMissingError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (274 total, 25 thin omitted)

### Community 0 - "PgTransactionLeaseLayer"
Cohesion: 0.01
Nodes (202): BenchEnv, JsonValue, UmbraDBSql, KvRow, HeldLease, PgTransactionLeaseLayer, Adapters, BatchSpec (+194 more)

### Community 1 - "translatePostgresError"
Cohesion: 0.02
Nodes (200): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, CheckpointNotFoundError, CheckpointStoreError, ChunkIntegrityError, ChunkMissingError (+192 more)

### Community 10 - "vitest"
Cohesion: 0.03
Nodes (95): CommandHandler, CommandIo, MainProcess, CheckStep, BackupBackend, BackupDatabase, TickerConfig, cliProject (+87 more)

### Community 100 - "PgChainArchiveStore"
Cohesion: 0.19
Nodes (11): BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf() (+3 more)

### Community 101 - "recovery.test.ts"
Cohesion: 0.12
Nodes (21): ProcessAdminOptions, ProcessReason, ProcessStatus, StatusFacts, A43Observation, Fault, Recorded, RecoveryObservation (+13 more)

### Community 102 - "node-source.ts"
Cohesion: 0.10
Nodes (16): BlockHeaderItem, BlockEventSource, BodyExtrinsic, BlockBody, CoreBlockHeader, CoreBlockItems, BlockLedgerSource, NodeSourceOptions (+8 more)

### Community 103 - "binding.test.ts"
Cohesion: 0.13
Nodes (21): A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), a113Problems(), a156Problems() (+13 more)

### Community 104 - "PrivateTransport"
Cohesion: 0.15
Nodes (8): PublicSide, HelloAck, PrivateTransport, Waiter, lost(), reject(), resolve(), client()

### Community 105 - "tx-replay-decoder.ts"
Cohesion: 0.12
Nodes (22): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+14 more)

### Community 107 - "builds.ts"
Cohesion: 0.13
Nodes (18): PrivateRefusal, Pause, Q142Observation, privateConfig(), genesisBlock(), genesisHex(), launchPublicCore(), poll() (+10 more)

### Community 109 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 11 - "declaration.ts"
Cohesion: 0.03
Nodes (109): BlockWriteHandle, ReadHandle, OwnPart, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+101 more)

### Community 110 - "node-bridge.ts"
Cohesion: 0.14
Nodes (16): BridgeServer, bridgeStore, Growable, decodeNodes(), encodedSize(), encodeNodes(), hexOf(), rowNode() (+8 more)

### Community 112 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (16): BlobRole, BlockBundle, BlockMeta, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult (+8 more)

### Community 113 - "identity.ts"
Cohesion: 0.19
Nodes (15): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+7 more)

### Community 115 - "core-key-registry.ts"
Cohesion: 0.13
Nodes (18): AdmittedKey, KeyRegistryOptions, Run, RunKey, TestKey, admittedOf(), bytesOfHex(), coreKeyRegistry() (+10 more)

### Community 116 - "checks.test.ts"
Cohesion: 0.11
Nodes (13): IntegerRules, Case, checkFunctionsSql(), numericOkPredicate(), refusedNumbersPath(), outcome(), verdicts(), write() (+5 more)

### Community 12 - "TapeRecord"
Cohesion: 0.03
Nodes (68): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Metadata, Step (+60 more)

### Community 121 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.11
Nodes (17): Hash, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence) (+9 more)

### Community 123 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 125 - "height-versioned.property.test.ts"
Cohesion: 0.12
Nodes (16): Block, BlockFails, Counts, Effect, Key, Op, canonicalText(), readBack() (+8 more)

### Community 126 - "ChainArchiveStore"
Cohesion: 0.12
Nodes (4): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations

### Community 128 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 13 - "config/history.ts"
Cohesion: 0.03
Nodes (123): OpenedFacts, CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreSettings, HistoryCheck, HistoryCode, HistoryContext (+115 more)

### Community 133 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 137 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 138 - "read-height.property.test.ts"
Cohesion: 0.20
Nodes (10): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+2 more)

### Community 14 - "column-rules.ts"
Cohesion: 0.02
Nodes (111): CatalogColumn, CatalogOptions, CatalogTable, CheckFunctionsOptions, IntegerRule, JsonbNumberRule, AllowedRule, Because (+103 more)

### Community 141 - "attempt"
Cohesion: 0.16
Nodes (13): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+5 more)

### Community 15 - "PgCheckpointStore"
Cohesion: 0.03
Nodes (107): TransactionHistoryReader, TransactionHistoryWriter, TransactionHandle, TransactionHandleInvalidError, WatermarkKey, WatermarkKind, PgCheckpointStore, PgWatermarks (+99 more)

### Community 16 - "loop.test.ts"
Cohesion: 0.04
Nodes (104): EntryRange, Contexts, Faults, Seen, Seen, AtGate, LoopClass, RunnerDatabase (+96 more)

### Community 163 - "holds"
Cohesion: 0.47
Nodes (4): VersionedValue, StoredVersion, Model, holds()

### Community 17 - "NodeClient"
Cohesion: 0.04
Nodes (82): Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription, Waiter (+74 more)

### Community 18 - "api-server.test.ts"
Cohesion: 0.03
Nodes (92): Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, StartedModuleApi, VersionedResponse, ChainDataAnswer (+84 more)

### Community 185 - "HeldHeight"
Cohesion: 0.28
Nodes (5): CommitOutcome, HeldHeight, Outcomes, AlwaysLost, DropsHeld

### Community 19 - "admin-harness.ts"
Cohesion: 0.04
Nodes (91): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+83 more)

### Community 2 - "ref_node_crypto"
Cohesion: 0.02
Nodes (148): EntryContent, EntryLifecycle, MergeEntriesFn, TransactionHistoryEntry, TransactionHistoryStatus, JsonEncoded, PgTransactionHistoryStorage, StoredEntryJson (+140 more)

### Community 20 - "core-transport.ts"
Cohesion: 0.03
Nodes (97): Session, TransportLimits, TransportTls, Committed, Hello, JsonValue, Message, MessageFault (+89 more)

### Community 202 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 21 - "range.ts"
Cohesion: 0.03
Nodes (91): NodeCallOptions, ConnectSocket, RecordingClient, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault, SyntheticUpgrade (+83 more)

### Community 22 - "db/errors.ts"
Cohesion: 0.04
Nodes (65): CommittedHeight, ReadOptions, DurabilityProbeOptions, DurabilityWarning, ProbeSession, ReadTimeoutSetting, Job, JobQueue (+57 more)

### Community 23 - ".save"
Cohesion: 0.03
Nodes (104): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+96 more)

### Community 24 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (97): ApplyInput, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+89 more)

### Community 25 - "createClient"
Cohesion: 0.04
Nodes (72): AnySql, RolloverBucket, RolloverTable, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, Started (+64 more)

### Community 26 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (72): CheckedMigration, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, ConsistentRead (+64 more)

### Community 27 - "ledger-storage.test.ts"
Cohesion: 0.05
Nodes (98): Call, SeenLoad, retentionSeen, LedgerTx, recordedGenesis, SweepModel, TableSnapshot, coreLedgerState() (+90 more)

### Community 28 - "api.ts"
Cohesion: 0.03
Nodes (63): Database, ReadOnlyDatabase, ErrorDetails, CheckTarget, CliBackend, Snapshot, Case, LoadOutcome (+55 more)

### Community 29 - "chain-placement.test.ts"
Cohesion: 0.05
Nodes (92): BlockParsedOptions, TransactionParser, ChainEvent, ScaleValue, BlockSpec, EventSpec, Json, transactionSpec (+84 more)

### Community 3 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (133): FinalityStallCondition, InMemoryBlockSource, InMemoryItems, Wait, ProcessingEnd, Job, WorkerEvent, A77Observation (+125 more)

### Community 30 - "node/client.test.ts"
Cohesion: 0.03
Nodes (52): NodeClientOptions, IngestOptions, Answer, FakeNode, Handler, Received, recorded, ManualTimers (+44 more)

### Community 31 - "adapter.ts"
Cohesion: 0.03
Nodes (77): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+69 more)

### Community 32 - "cbor.ts"
Cohesion: 0.04
Nodes (80): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+72 more)

### Community 33 - "key-checks.ts"
Cohesion: 0.05
Nodes (86): PrivateProcess, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, Admission, AdmittedSeen (+78 more)

### Community 34 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (77): BlockTransaction, ItemSink, StandInOptions, Commit, EagerItems, EagerLoop, AlwaysLanded, blockHeaderOf() (+69 more)

### Community 35 - "node-format.ts"
Cohesion: 0.06
Nodes (58): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+50 more)

### Community 36 - "runner/process.ts"
Cohesion: 0.04
Nodes (68): ConfigFacts, Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, CoreChainFacts, NodeWait, WaitingListener (+60 more)

### Community 37 - "ledger/types.ts"
Cohesion: 0.05
Nodes (72): LoadLedger, LedgerStateItem, LedgerName, ApplyOutput, ChainOutcome, LedgerPackageOptions, NodeStore, ParsedTransaction (+64 more)

### Community 38 - "runMigrations"
Cohesion: 0.03
Nodes (87): UmbraDBConnectionOptions, DurabilityContractError, TransactionPoolerDetectedError, exceedsMaxDepth(), runMigrations(), EntrySectionsSchema, Audit (round 1) — the confirmation-bias control paid off, 8. Migration (+79 more)

### Community 39 - "core-private-source.test.ts"
Cohesion: 0.04
Nodes (47): ChainCheck, ChainCheckInput, PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, SourceTransport, PublicDatabase, PublicIdentity (+39 more)

### Community 4 - "FinalizedLoop"
Cohesion: 0.02
Nodes (91): PointName, HeightRange, ResolvedRange, LateUse, Callback, CallbackFailure, EntryBoundary, ParallelPoint (+83 more)

### Community 40 - "configuration.ts"
Cohesion: 0.05
Nodes (72): OpenedConfig, AllowedDetail, RevisionSettings, SnapshotFacts, ConfigSnapshot, DeclarationView, EntryView, RecordedView (+64 more)

### Community 41 - "config-check.ts"
Cohesion: 0.05
Nodes (67): BackupOutcome, CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, commandTarget, DatabaseState (+59 more)

### Community 42 - "refused-configuration.test.ts"
Cohesion: 0.05
Nodes (64): AdminStarter, RunSeams, ProcessConfig, ProcessHandle, ProcessInput, SignalTarget, Answered, Start (+56 more)

### Community 43 - "writer-lock-checks.ts"
Cohesion: 0.06
Nodes (59): Held, PgliteLockUse, WriterProcess, Job, WorkerEvent, PauseReport, acquirePgliteLock(), lockHeld() (+51 more)

### Community 44 - "process-context.test.ts"
Cohesion: 0.05
Nodes (53): ChainDataView, MisuseListener, MisuseReports, ProcessContexts, PublishRefusal, Seen, RunnerBackend, AllowsOutside (+45 more)

### Community 45 - "validate.test.ts"
Cohesion: 0.03
Nodes (64): CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+56 more)

### Community 46 - "readiness.test.ts"
Cohesion: 0.05
Nodes (65): versionEntry, ProcessState, AdminRun, gate, Observation, Decision, ReadinessCase, ask() (+57 more)

### Community 47 - "change-capture.ts"
Cohesion: 0.05
Nodes (59): CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow, GuardTableRow, digestBlock() (+51 more)

### Community 48 - ".value"
Cohesion: 0.08
Nodes (48): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+40 more)

### Community 49 - "core-ledger-state.ts"
Cohesion: 0.04
Nodes (55): CoreLedgerStateOptions, RetainedState, retainedStates, CoreRevision, GreyPicker, boundLedgerParser(), workerParser(), boundLedger() (+47 more)

### Community 5 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (148): BlockParsed, ProcessCondition, itemsSeen, Scenario, ArgType, BlockOptions, CallSpec, chainBlock (+140 more)

### Community 50 - "backup/backup.ts"
Cohesion: 0.06
Nodes (61): BackupInput, BackupSeams, BackupTarget, BackupWritten, BackupFacts, Manifest, ManifestHistoryRow, ManifestMigration (+53 more)

### Community 51 - "boundary.test.ts"
Cohesion: 0.06
Nodes (52): DesignTable, RowCoverage, ModuleReference, Finding, collationsWritten(), componentCode(), componentExports(), componentTexts() (+44 more)

### Community 52 - "networks.ts"
Cohesion: 0.05
Nodes (62): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+54 more)

### Community 53 - "ModuleDeclaration"
Cohesion: 0.07
Nodes (46): BlockItemSource, ModuleDeclaration, BlockSource, LoopInput, AdminRunOptions, StatusBody, PublicCoreOptions, TestBuildOptions (+38 more)

### Community 54 - "child-processes.test.ts"
Cohesion: 0.04
Nodes (51): ParentJob, Kill, Orphaned, SourceFile, RepositoryFile, LockResult, guardContainers(), guardPid() (+43 more)

### Community 55 - "LedgerPackage"
Cohesion: 0.07
Nodes (22): LedgerEventKind, LedgerPackage, LedgerEngine, hexOf(), idOf(), same(), sameBytes(), run() (+14 more)

### Community 56 - "12. Ledger"
Cohesion: 0.06
Nodes (36): LedgerTask, LedgerHost, LedgerWorkerFailure, NodeDatabase, Pending, NodeReader, errorOf(), heightOf() (+28 more)

### Community 57 - "changes.property.test.ts"
Cohesion: 0.05
Nodes (48): SchemaPlan, Chain, ChainOptions, DigestRow, Op, States, TableName, TestDatabase (+40 more)

### Community 58 - "version-checks.ts"
Cohesion: 0.09
Nodes (35): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, CountingNode, MetadataSelector, Select (+27 more)

### Community 59 - "ledger-sweep.test.ts"
Cohesion: 0.07
Nodes (29): GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, ChildReader, NodeBatch, Block (+21 more)

### Community 6 - "src/index.ts"
Cohesion: 0.03
Nodes (153): TransactionHistoryStorage, CheckpointRecord, CheckpointSequence, CheckpointStore, CheckpointStoreErrorCode, CheckpointSummary, ContentHash, HistoryOptions (+145 more)

### Community 60 - "plain-data.ts"
Cohesion: 0.05
Nodes (42): LoadOptions, PlainArray, PlainDataNode, PlainDataRule, Walk, Row, invalid(), isFile() (+34 more)

### Community 61 - "build-modules.ts"
Cohesion: 0.05
Nodes (36): privateIntake, CommandBuildOptions, ConfigCheckReport, RunOptions, SignalSource, stopSignal, ChainBuildOptions, statsConfig (+28 more)

### Community 62 - "graph.ts"
Cohesion: 0.06
Nodes (52): DurabilityViolation, ErrorCode, Edge, GraphFacts, GraphInput, GraphPart, GraphRule, MidChain (+44 more)

### Community 63 - "NodeBlockSource"
Cohesion: 0.10
Nodes (11): HeadWait, NodeBlockSource, NodeHeader, PreparedBlock, QueueRunner, NoWindow, Refetches, TrustsNotifications (+3 more)

### Community 64 - "mapping.ts"
Cohesion: 0.07
Nodes (37): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+29 more)

### Community 65 - "Process"
Cohesion: 0.09
Nodes (10): ProcessAdmin, CoreTransport, Process, recordedHistory(), writerLockHeld(), earlyRedactor(), configSecrets(), retryOf() (+2 more)

### Community 66 - "private/backends.ts"
Cohesion: 0.07
Nodes (27): PrivateBackend, SessionSeen, TestDatabase, A155Observation, Outcome, A112Observation, Wiring, TransportProxy (+19 more)

### Community 67 - "real-tapes.ts"
Cohesion: 0.07
Nodes (36): FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+28 more)

### Community 68 - "process-admin.ts"
Cohesion: 0.08
Nodes (35): PrivateSideFacts, DigestRow, ModuleFacts, PartTable, PrivateInstanceFacts, ModuleStatus, NodeStatus, PrivateInstanceStatus (+27 more)

### Community 69 - "zero-timeouts-checks.ts"
Cohesion: 0.09
Nodes (34): Settings, Run, Job, WorkerEvent, Outcome, openBlockWrites(), expectNeverCutOffNorHung(), settings() (+26 more)

### Community 7 - "PgTemporalKV"
Cohesion: 0.02
Nodes (152): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, AsOf, AssertExact, Key, Namespace (+144 more)

### Community 73 - "lockstep-refusals.test.ts"
Cohesion: 0.09
Nodes (35): LockstepCondition, A118Observation, MismatchObservation, ExpectedWait, WaitSample, RetargetProxy, hashAt(), inMemoryBlock() (+27 more)

### Community 74 - "core-settings.ts"
Cohesion: 0.06
Nodes (36): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+28 more)

### Community 75 - "BlockRef"
Cohesion: 0.08
Nodes (13): QueuedBlock, BlockItems, BlockRef, InMemorySourceOptions, EventsRunner, Fetching, Recorder, LateRedelivery (+5 more)

### Community 76 - "validate.ts"
Cohesion: 0.10
Nodes (38): CursorRule, Finding, Issue, Plain, SettingsSchema, TestKeysRuleOptions, coreSettingsSchema(), closest() (+30 more)

### Community 77 - "ValidationError"
Cohesion: 0.07
Nodes (38): ValidationError, Requirement: prune rejects a retainCount that is not a positive safe integer, before any deletion runs, Requirement: save rejects invalid options with ValidationError before any chunking or hashing work, Scenario: A chunkSize above the schema's 16 MiB bound is rejected with no work done, Scenario: A non-integer or non-finite retainCount is rejected with no effect, Scenario: An integer retainCount outside the safe integer range is rejected with no effect, Scenario: retainCount of zero is rejected with no effect, ADDED Requirements (+30 more)

### Community 78 - "validation.ts"
Cohesion: 0.06
Nodes (33): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+25 more)

### Community 8 - "tape/index.ts"
Cohesion: 0.03
Nodes (113): Failure, Variant, RecordingProblem, TapeError, TapeProblem, TransformError, TransformProblem, readRequest (+105 more)

### Community 81 - "differential-equivalence.test.ts"
Cohesion: 0.10
Nodes (32): Adapters, Fault, adaptersFor(), adaptersOf(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch() (+24 more)

### Community 83 - "order.property.test.ts"
Cohesion: 0.09
Nodes (30): Recorder, CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce() (+22 more)

### Community 89 - "Lockstep"
Cohesion: 0.11
Nodes (12): CoreTransportOptions, InstanceView, PrivateInstance, Entry, Lockstep, LockstepInstance, LockstepOptions, LockstepRefusal (+4 more)

### Community 9 - "UmbraError"
Cohesion: 0.03
Nodes (126): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner (+118 more)

### Community 92 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 93 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 97 - "intake.test.ts"
Cohesion: 0.13
Nodes (16): PrivateSeen, A114Observation, A116Observation, TestLink, against(), directPublic(), a114Problems(), a114Run() (+8 more)

### Community 98 - "db/migrate.test.ts"
Cohesion: 0.10
Nodes (21): SchemaItem, MigrationRow, PartOptions, TestPart, identityRow(), captured(), triggerEnabled(), undigested() (+13 more)

### Community 99 - "code-registry.ts"
Cohesion: 0.13
Nodes (24): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+16 more)

### Community 106 - "table"
Cohesion: 0.09
Nodes (21): expectKeyOrder(), table(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, Blocks from the node, Cursor tables (+13 more)

### Community 111 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.09
Nodes (21): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+13 more)

### Community 119 - "core-key-registry.test.ts"
Cohesion: 0.12
Nodes (9): blockAt(), bytesOf(), computed(), expectedId(), hex(), startHandle(), written(), KEY_A (+1 more)

### Community 127 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.12
Nodes (13): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1 (+5 more)

### Community 129 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 17. Required test ids added to the manifest, 2. Database API, 3. Modules, 4. Configuration (+7 more)

### Community 136 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 140 - "pg"
Cohesion: 0.15
Nodes (12): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 2. Node-side query correlation (+4 more)

### Community 145 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 153 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 165 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 167 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 169 - "chain_archive lineage"
Cohesion: 0.20
Nodes (9): `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents, `transactions` (chain_archive), UmbraDB Postgres Schema Reference (+1 more)

### Community 170 - ".slowBlockMs"
Cohesion: 0.22
Nodes (9): listen(), 16. Whole system, 5. Runner, Requirement: CF-4 Every field is data, operational or secret, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases, Requirement: RN-17 A slow block is reported, never cut off, Scenario: A slow callback (+1 more)

### Community 182 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 190 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 201 - "Performance — design"
Cohesion: 0.29
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 216 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 236 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 71 - "version"
Cohesion: 0.05
Nodes (41): validateSaveOptions(), version(), 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored) (+33 more)

### Community 79 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 80 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 88 - "fn"
Cohesion: 0.08
Nodes (31): fn(), ADDED Requirements, MODIFIED Requirements, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API, temporal-kv (transaction-participation wiring), ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease (+23 more)

### Community 108 - "package.json"
Cohesion: 0.09
Nodes (22): bugs, url, description, exports, files, homepage, license, main (+14 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 117 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 118 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.10
Nodes (20): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+12 more)

### Community 120 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 124 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 131 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 132 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 134 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 135 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 139 - "ROADMAP.md"
Cohesion: 0.14
Nodes (9): For historical reference only, Tasks — superseded by per-sprint openspec changes, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity (+1 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 143 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 144 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 146 - "README.md"
Cohesion: 0.27
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 147 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 149 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 151 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 152 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.17
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 156 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 157 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 158 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 159 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.18
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 160 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 161 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 162 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Scenario: An extra export, Scenario: Not in the package, Scenario: The changelog says so (+2 more)

### Community 166 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 168 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 171 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line, Scenario: Record and replay give the same session (+1 more)

### Community 172 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

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

### Community 177 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 178 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.22
Nodes (9): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 8. Test infrastructure (open decision — resolve in Task 1) (+1 more)

### Community 179 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 180 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 181 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 183 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 184 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 186 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 187 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 188 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 189 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 191 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 192 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 193 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 194 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 195 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 196 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 197 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 198 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 199 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 200 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 203 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 204 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 205 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 206 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 207 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 208 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 209 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 210 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 211 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 212 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 213 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 214 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 215 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 217 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 218 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 219 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 220 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 221 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 222 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 223 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 224 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 225 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 226 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 227 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 228 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 229 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 230 - "00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 231 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.40
Nodes (4): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Suggested fix

### Community 232 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 233 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 234 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 237 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 238 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 239 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 240 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 241 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 242 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 243 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 244 - "Requirement: PP-2 A private database is bound to one public database"
Cohesion: 0.50
Nodes (4): Requirement: PP-2 A private database is bound to one public database, Scenario: Configured for another network, Scenario: Pointed at another public database, Scenario: The public core never started

### Community 245 - "Requirement: RN-16 Chain-data reads name their view and height"
Cohesion: 0.50
Nodes (4): Requirement: RN-16 Chain-data reads name their view and height, Scenario: A GraphQL module states its height, Scenario: Every answer names its build, Scenario: The core leaves an answer as the module wrote it

### Community 246 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 247 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 248 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 251 - "Requirement: set is an idempotent, unconditional overwrite (Law W1)"
Cohesion: 0.67
Nodes (3): Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A new set always overwrites, with no conflict possible, Scenario: Setting the same value twice leaves the stored state unchanged

### Community 252 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 253 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 70 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 84 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides, Requirement: LG-17 Ledger tasks give modules the native objects (+25 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+25 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-1 The main program is a fixed sequence of points (+24 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

### Community 94 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.07
Nodes (24): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now) (+16 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash (+18 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

## Knowledge Gaps
- **53 isolated node(s):** `@electric-sql/pglite-tools`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx`, `typedoc` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3452 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionLeaseLayer`, `translatePostgresError`, `ref_node_crypto`, `chain-process.test.ts`, `FinalizedLoop`, `ingest-harness.ts`, `src/index.ts`, `PgTemporalKV`, `tape/index.ts`, `UmbraError`, `declaration.ts`, `TapeRecord`, `config/history.ts`, `column-rules.ts`, `PgCheckpointStore`, `loop.test.ts`, `NodeClient`, `api-server.test.ts`, `admin-harness.ts`, `core-transport.ts`, `range.ts`, `db/errors.ts`, `adapter-fixtures.ts`, `createClient`, `opt-out.test.ts`, `ledger-storage.test.ts`, `api.ts`, `chain-placement.test.ts`, `node/client.test.ts`, `adapter.ts`, `cbor.ts`, `key-checks.ts`, `core-block-parsed.ts`, `node-format.ts`, `runner/process.ts`, `ledger/types.ts`, `core-private-source.test.ts`, `configuration.ts`, `config-check.ts`, `refused-configuration.test.ts`, `writer-lock-checks.ts`, `process-context.test.ts`, `validate.test.ts`, `readiness.test.ts`, `change-capture.ts`, `core-ledger-state.ts`, `boundary.test.ts`, `networks.ts`, `ModuleDeclaration`, `child-processes.test.ts`, `12. Ledger`, `changes.property.test.ts`, `version-checks.ts`, `ledger-sweep.test.ts`, `plain-data.ts`, `build-modules.ts`, `mapping.ts`, `private/backends.ts`, `real-tapes.ts`, `process-admin.ts`, `zero-timeouts-checks.ts`, `lockstep-refusals.test.ts`, `core-settings.ts`, `validation.ts`, `differential-equivalence.test.ts`, `order.property.test.ts`, `Lockstep`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `intake.test.ts`, `db/migrate.test.ts`, `code-registry.ts`, `recovery.test.ts`, `binding.test.ts`, `builds.ts`, `package.json`, `block-fetch-decode.test.ts`, `node-bridge.ts`, `identity.ts`, `checks.test.ts`, `core-key-registry.test.ts`, `height-versioned.property.test.ts`, `Tasks — v1.0.0-infosec-signoff`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `read-height.property.test.ts`, `twox.ts`, `excluded-not-exported.test.ts`, `facade-merge-loader.ts`?**
  _High betweenness centrality (0.300) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@electric-sql/pglite-tools`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionLeaseLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.013282209357692405 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `chain-process.test.ts`, `FinalizedLoop`, `ingest-harness.ts`, `tape/index.ts`, `checkShape`, `declaration.ts`, `config/history.ts`, `loop.test.ts`, `NodeClient`, `api-server.test.ts`, `core-transport.ts`, `range.ts`, `db/errors.ts`, `opt-out.test.ts`, `api.ts`, `node/client.test.ts`, `adapter.ts`, `cbor.ts`, `core-block-parsed.ts`, `runner/process.ts`, `core-private-source.test.ts`, `configuration.ts`, `config-check.ts`, `refused-configuration.test.ts`, `writer-lock-checks.ts`, `process-context.test.ts`, `validate.test.ts`, `readiness.test.ts`, `change-capture.ts`, `core-ledger-state.ts`, `backup/backup.ts`, `networks.ts`, `ModuleDeclaration`, `12. Ledger`, `changes.property.test.ts`, `version-checks.ts`, `plain-data.ts`, `graph.ts`, `NodeBlockSource`, `mapping.ts`, `Process`, `private/backends.ts`, `process-admin.ts`, `zero-timeouts-checks.ts`, `lockstep-refusals.test.ts`, `BlockRef`, `validate.ts`, `validation.ts`, `db/migrate.test.ts`, `recovery.test.ts`, `node-source.ts`, `binding.test.ts`, `PrivateTransport`, `table`, `identity.ts`, `core-key-registry.ts`, `checks.test.ts`, `core-key-registry.test.ts`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `translatePostgresError` be split into smaller, more focused modules?**
  _Cohesion score 0.02074688796680498 - nodes in this community are weakly interconnected._