# Graph Report - UmbraDB

## Corpus Check
- 987 files · ~1,517,998 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 10606 nodes · 32202 edges · 294 communities (265 shown, 29 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 3398 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `7c8793b5321d1176` (987 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionLeaseLayer
- vitest
- chain-process.test.ts
- digest.test.ts
- binding.test.ts
- intake.test.ts
- cli/command.ts
- lockstep-refusals.test.ts
- TapeNode
- check-required-tests.ts
- legacy-excluded.test.ts
- opt-out.test.ts
- node-bridge.ts
- HeightRun
- private/lockstep-wait.test.ts
- type-check.ts
- childRefKeys
- ReadHandle
- items.ts
- BlockItems
- version-table.ts
- describeNodeStoreExports
- runner/process.ts
- commit-proxy.ts
- height-versioned.property.test.ts
- statementsOf
- createClient
- checkShape
- Lockstep
- HeldHeight
- public-items.test.ts
- cursor-table.property.test.ts
- validate.ts
- identity.ts
- 3. Proof-blocking findings
- InMemoryBlockSource
- attempt
- .save
- lockstep-reads.test.ts
- holds
- ledger-storage.test.ts
- ProcessItems
- refused-configuration.test.ts
- postgres-image.test.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- src/index.ts
- fetch-fixtures.ts
- ref_node_crypto
- ReadPool
- mutation-evidence.d.mts
- sweep-test-loader.ts
- NodeClient
- ref_node_url
- adapter-worker.ts
- Reader
- node/client.test.ts
- core-block-parsed.ts
- EventsRunner
- CheckpointStore
- CliBackend
- tape/index.ts
- TickerProcess
- crash-worker.ts
- config-check.ts
- Database
- adapter.ts
- range.test.ts
- builder.test.ts
- adapter-fixtures.ts
- contract-modules.test.ts
- .value
- process-admin.ts
- order.property.test.ts
- contract-data-checks.ts
- real-tapes.ts
- api-server.test.ts
- postgres/chain-archive-store.ts
- backup-fixtures.ts
- core-private-source.test.ts
- FinalizedLoop
- core-ledger-state.ts
- column-rules.ts
- host.ts
- range.ts
- ledger-tapes.ts
- core-transport.ts
- LedgerPackage
- chain-placement.test.ts
- harness.ts
- spawnChild
- NodeBlockSource
- key-checks.ts
- transform-checks.ts
- column-rules.test.ts
- backup/backup.ts
- run.test.ts
- admin-harness.ts
- ref_node_fs
- cbor.ts
- declaration.ts
- boundary.test.ts
- graph.ts
- slow-block-harness.ts
- post-block-update-checks.ts
- core-settings.ts
- ledger-sweep.test.ts
- ValidationError
- version-checks.ts
- failures.ts
- private/backends.ts
- networks.ts
- core-key-registry.test.ts
- loop.ts
- config/history.ts
- worker-host.test.ts
- cbor.property.test.ts
- backup/restore.ts
- node-format.ts
- vendored-ledger-v9.test.ts
- pglite-processes.ts
- BlockRef
- PgTransactionHistoryStorage
- 12. Ledger
- sweep-tapes.ts
- crash.test.ts
- mapping.ts
- plain-data.ts
- determinism-checks.ts
- ws-mutual-tls.test.ts
- halted
- pg
- repository
- .boolean
- version
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- fault
- history.property.test.ts
- .database
- pack-install.mjs
- scoped-review-manifest
- Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data
- fresh-instance.mjs
- T
- fn
- ADDED Requirements
- graph.py
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- devDependencies
- scripts
- UmbraDB module guide
- ROADMAP.md
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Storage Algebra Lean M2 Retention Sprint
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- Roadmap
- compilerOptions
- README.md
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
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
- Midnight infra verification checklist
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- 12. Milestone status
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- UmbraDB — project instructions
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 5. Recommended candidate model
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
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
- 00018 — The ledger packages' `successfulSegments` is true for the segments that failed
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles
- 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses
- 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)
- 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- manifest.json
- Vendored ledger builds
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
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
- ADDED Requirements
- main.rs
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 329 edges
2. `UmbraError` - 282 edges
3. `ModuleDeclaration` - 165 edges
4. `FinalizedLoop` - 116 edges
5. `InMemoryBlockSource` - 100 edges
6. `NodeClient` - 95 edges
7. `PgTransactionLeaseLayer` - 93 edges
8. `Database` - 93 edges
9. `runMigrations()` - 90 edges
10. `PgCheckpointStore` - 87 edges

## Surprising Connections (you probably didn't know these)
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
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

## Communities (294 total, 29 thin omitted)

### Community 0 - "PgTransactionLeaseLayer"
Cohesion: 0.01
Nodes (225): JsonValue, AggregateRow, ChunkJoinRow, ManifestRow, PgCheckpointStore, UmbraDBSql, KvRow, PgTransactionLeaseLayer (+217 more)

### Community 1 - "vitest"
Cohesion: 0.02
Nodes (168): ReadDatabaseOptions, CommittedHeight, ReadOnlyDatabase, ReadOptions, Transaction, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning (+160 more)

### Community 10 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (120): ProcessAdminOptions, BlockItemSource, LoopEnd, LoopInput, ProcessHandle, ProcessingEnd, ProcessStatus, Job (+112 more)

### Community 101 - "digest.test.ts"
Cohesion: 0.11
Nodes (25): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+17 more)

### Community 102 - "binding.test.ts"
Cohesion: 0.13
Nodes (25): A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), a113Problems(), a113Run() (+17 more)

### Community 103 - "intake.test.ts"
Cohesion: 0.13
Nodes (17): PrivateSeen, A114Observation, A116Observation, TestLink, directPublic(), a114Problems(), a114Run(), a116Problems() (+9 more)

### Community 104 - "cli/command.ts"
Cohesion: 0.13
Nodes (21): CommandHandler, CommandIo, MainProcess, CommandResult, backupArguments(), backupCommand(), checkArguments(), configCommand() (+13 more)

### Community 105 - "lockstep-refusals.test.ts"
Cohesion: 0.14
Nodes (22): LockstepCondition, Report, PublicCore, A118Observation, MismatchObservation, WaitSample, ReportRelay, a118Problems() (+14 more)

### Community 106 - "TapeNode"
Cohesion: 0.11
Nodes (11): Opened, TapeClock, TapeNode, open(), quiet(), quietConnect(), withNode(), quietConnect() (+3 more)

### Community 107 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 108 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 11 - "opt-out.test.ts"
Cohesion: 0.03
Nodes (107): CaptureColumn, CaptureState, CheckedMigration, ModuleColumn, ModuleContentsError, ModuleTable, ModuleTableOptions, PageOptions (+99 more)

### Community 112 - "node-bridge.ts"
Cohesion: 0.14
Nodes (17): BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize(), encodeNodes(), hexOf() (+9 more)

### Community 113 - "HeightRun"
Cohesion: 0.09
Nodes (9): HeightRun, SkipsAfterReconnect, SkipsUnseen, WaitsInTransaction, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, KeysAfterCompute (+1 more)

### Community 115 - "private/lockstep-wait.test.ts"
Cohesion: 0.14
Nodes (16): LockstepInstance, PrivateProcess, ExpectedWait, RetargetProxy, a117Problems(), firstWait(), lockstepCore(), loginOf() (+8 more)

### Community 116 - "type-check.ts"
Cohesion: 0.16
Nodes (14): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), moduleSpecifier() (+6 more)

### Community 118 - "childRefKeys"
Cohesion: 0.17
Nodes (8): ChildReader, ModelBatch, SweepModel, childRefKeys(), readChildren(), hexOf(), hex(), modelOfFixture()

### Community 12 - "ReadHandle"
Cohesion: 0.03
Nodes (86): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, BlockContext (+78 more)

### Community 121 - "items.ts"
Cohesion: 0.15
Nodes (9): BlockHeaderItem, CoreBlockHeader, CoreBlockItems, MetadataBlock, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, contentStateOf() (+1 more)

### Community 122 - "BlockItems"
Cohesion: 0.13
Nodes (11): QueuedBlock, BlockItems, LateUse, EagerItems, EagerLoop, KeptItems, KeptLoop, revisionAt() (+3 more)

### Community 128 - "version-table.ts"
Cohesion: 0.21
Nodes (18): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+10 more)

### Community 129 - "describeNodeStoreExports"
Cohesion: 0.17
Nodes (5): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), sortedHex()

### Community 13 - "runner/process.ts"
Cohesion: 0.03
Nodes (70): ConfigFacts, AdminStarter, Bound, ChainCheck, ChainCheckInput, ChainIdentity, ChainSource, ConfiguredGenesis (+62 more)

### Community 130 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 132 - "height-versioned.property.test.ts"
Cohesion: 0.12
Nodes (16): Block, BlockFails, Counts, Effect, Key, Op, canonicalText(), readBack() (+8 more)

### Community 139 - "statementsOf"
Cohesion: 0.23
Nodes (12): MetaCommands, Piece, State, StatementSplitter, formatUnknown(), checkStatement(), checkStatements(), statementsOf() (+4 more)

### Community 14 - "createClient"
Cohesion: 0.03
Nodes (96): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, AnySql, RolloverBucket (+88 more)

### Community 141 - "checkShape"
Cohesion: 0.30
Nodes (8): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), 14. External claims and their evidence

### Community 142 - "Lockstep"
Cohesion: 0.19
Nodes (3): Lockstep, downText(), holds()

### Community 144 - "HeldHeight"
Cohesion: 0.16
Nodes (10): CommitOutcome, HeldHeight, Outcomes, AlwaysLanded, AlwaysLost, DropsHeld, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence (+2 more)

### Community 148 - "public-items.test.ts"
Cohesion: 0.15
Nodes (11): TestDatabase, A155Observation, Outcome, touchedOf(), a155Problems(), jsonSafe(), outcomeOf(), umbraIn() (+3 more)

### Community 149 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 15 - "validate.ts"
Cohesion: 0.03
Nodes (120): EntryView, coreEntry, Entry, TestKey, UmbraConfig, plainData, RedactionForms, SecretForm (+112 more)

### Community 155 - "identity.ts"
Cohesion: 0.30
Nodes (11): LedgerSource, ManifestLine, checkPackageFiles(), manifestSha256(), mismatch(), packageName(), readManifest(), readOrNull() (+3 more)

### Community 158 - "3. Proof-blocking findings"
Cohesion: 0.15
Nodes (13): Absent, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces (+5 more)

### Community 16 - "InMemoryBlockSource"
Cohesion: 0.04
Nodes (103): EntryRange, GraphInput, InMemoryBlockSource, HeightFailure, Flaky, PastFaultCase, RefusalCase, Contexts (+95 more)

### Community 164 - "attempt"
Cohesion: 0.20
Nodes (11): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+3 more)

### Community 17 - ".save"
Cohesion: 0.02
Nodes (121): CheckpointNotFoundError, CheckpointRecord, CheckpointSummary, SaveCheckpointOptions, assertValidCheckpointIds(), coerceToSafeNumber(), sha256(), toHex() (+113 more)

### Community 170 - "lockstep-reads.test.ts"
Cohesion: 0.24
Nodes (8): Pause, Q142Observation, SkipsLockstep, PRIVATE_ROWS_SQL(), pauseGate(), pausing(), q142Run(), until()

### Community 175 - "holds"
Cohesion: 0.47
Nodes (4): VersionedValue, StoredVersion, Model, holds()

### Community 18 - "ledger-storage.test.ts"
Cohesion: 0.04
Nodes (102): BlockHeader, SourceShared, ingest, IngestOptions, SourceClass, watched, SeenLoad, RestartEvent (+94 more)

### Community 19 - "refused-configuration.test.ts"
Cohesion: 0.03
Nodes (102): ProcessConfig, SignalTarget, AdminRun, Answered, Hold, Observation, ProbeRecord, Start (+94 more)

### Community 190 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 195 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 2 - "src/index.ts"
Cohesion: 0.02
Nodes (226): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, CheckpointStoreError, CheckpointStoreErrorCode, ChunkIntegrityError, ChunkMissingError (+218 more)

### Community 20 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (91): NodeCallOptions, ProcessCondition, RecordingClient, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME (+83 more)

### Community 21 - "ref_node_crypto"
Cohesion: 0.03
Nodes (87): CapturedTable, SchemaPlan, GuardTableRow, Chain, ChainOptions, DigestRow, Op, States (+79 more)

### Community 215 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 216 - "sweep-test-loader.ts"
Cohesion: 0.33
Nodes (5): FixtureNode, FakeState, hex(), loadLedger(), evicted

### Community 22 - "NodeClient"
Cohesion: 0.05
Nodes (69): CoreChainBinding, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription (+61 more)

### Community 23 - "ref_node_url"
Cohesion: 0.03
Nodes (78): EntryContent, TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, Command, ReplayableStorage (+70 more)

### Community 231 - "adapter-worker.ts"
Cohesion: 0.40
Nodes (5): ApplyInput, AdapterWorkerRequest, hex(), storeOf(), request

### Community 24 - "node/client.test.ts"
Cohesion: 0.03
Nodes (54): NodeClientOptions, Answer, FakeNode, Handler, Received, recorded, ManualTimers, ConnectionFrames (+46 more)

### Community 25 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (92): BlockEventSource, BodyExtrinsic, BlockBody, MetadataField, MetadataType, MetadataVariant, Primitive, BlockParsedOptions (+84 more)

### Community 26 - "CheckpointStore"
Cohesion: 0.03
Nodes (91): CheckpointSequence, CheckpointStore, ContentHash, PruneResult, EnvelopeCorruptError, WalletStateEnvelope, PgWalletStateEnvelopeStore, decode() (+83 more)

### Community 27 - "tape/index.ts"
Cohesion: 0.05
Nodes (71): RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError, Connection (+63 more)

### Community 28 - "crash-worker.ts"
Cohesion: 0.03
Nodes (76): WatermarkKey, WatermarkKind, Watermarks, WatermarkValue, WatermarkRow, CoTxCallable, CoTxPauseInfo, CrashHook (+68 more)

### Community 29 - "config-check.ts"
Cohesion: 0.04
Nodes (77): privateIntake, RestoreSeams, BackupOutcome, CommandBuildOptions, CheckFinding, CheckState, ConfigCheckOptions, ConfigCheckSeams (+69 more)

### Community 3 - "Database"
Cohesion: 0.02
Nodes (176): Database, SchemaWriteHandle, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference (+168 more)

### Community 30 - "adapter.ts"
Cohesion: 0.04
Nodes (66): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+58 more)

### Community 31 - "range.test.ts"
Cohesion: 0.04
Nodes (46): ConnectSocket, Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault (+38 more)

### Community 32 - "builder.test.ts"
Cohesion: 0.04
Nodes (40): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Frame, RawClient (+32 more)

### Community 33 - "adapter-fixtures.ts"
Cohesion: 0.07
Nodes (66): ApplyOutput, StoredNode, LedgerHeight, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject (+58 more)

### Community 34 - "contract-modules.test.ts"
Cohesion: 0.05
Nodes (65): ContractLog, CoreContractLogsFastOptions, UnsureLog, FastLogReader, LoadAdapter, LogSite, Program, UnsureReason (+57 more)

### Community 35 - ".value"
Cohesion: 0.07
Nodes (51): ExtrinsicCall, MetadataPallet, MetadataStorage, MetadataStorageEntry, RuntimeMetadataView, TypeDef, ScaleError, ScaleReader (+43 more)

### Community 36 - "process-admin.ts"
Cohesion: 0.06
Nodes (55): AllowedDetail, PrivateSideFacts, ProcessAdmin, RevisionSettings, DigestRow, ModuleFacts, PartTable, PrivateInstanceFacts (+47 more)

### Community 37 - "order.property.test.ts"
Cohesion: 0.04
Nodes (65): PointName, CallbackFailure, PointArguments, PointRun, Activity, Misuse, SlowBlockCondition, CallEvent (+57 more)

### Community 38 - "contract-data-checks.ts"
Cohesion: 0.07
Nodes (68): ContractStateRow, CoreContractStatesOptions, contractScenario, ContractScenarioOptions, DeployTx, LogLine, Program, Ran (+60 more)

### Community 39 - "real-tapes.ts"
Cohesion: 0.05
Nodes (56): Metadata, Step, FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+48 more)

### Community 4 - "api-server.test.ts"
Cohesion: 0.02
Nodes (153): ApiRegistry, Revision, ResolvedGraph, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart (+145 more)

### Community 40 - "postgres/chain-archive-store.ts"
Cohesion: 0.06
Nodes (38): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+30 more)

### Community 41 - "backup-fixtures.ts"
Cohesion: 0.08
Nodes (46): BackupBackend, BackupDatabase, killedRestore, TickerConfig, cliProject, isEmptyDatabase(), catalogOf(), hashOf() (+38 more)

### Community 42 - "core-private-source.test.ts"
Cohesion: 0.04
Nodes (30): PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, SourceTransport, PublicDatabase, PublicIdentity, PublicWakes, PublicItem (+22 more)

### Community 43 - "FinalizedLoop"
Cohesion: 0.07
Nodes (12): FinalizedLoop, LoopObserver, Startup, WaitingInRead, FailingAfter, NoRedelivery, CommitsTheBoundary, call() (+4 more)

### Community 44 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (53): RetainedState, retainedStates, CoreRevision, bindLedgerParser(), boundLedgerParser(), workerParser(), applyBlock(), bindCoreLedgerState() (+45 more)

### Community 45 - "column-rules.ts"
Cohesion: 0.04
Nodes (68): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+60 more)

### Community 46 - "host.ts"
Cohesion: 0.06
Nodes (49): LoadLedger, CoreLedgerStateOptions, LedgerStateItem, ChainOutcome, NodeStore, ParsedTransaction, StateHandle, StateSummary (+41 more)

### Community 48 - "range.ts"
Cohesion: 0.05
Nodes (52): NodeSubscription, Arguments, Command, TapeCommandIo, CompletenessRange, Final, Height, RangeRecording (+44 more)

### Community 49 - "ledger-tapes.ts"
Cohesion: 0.06
Nodes (58): BlockParsed, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime (+50 more)

### Community 5 - "core-transport.ts"
Cohesion: 0.02
Nodes (145): PublicSide, PublicSideOptions, ResultColumn, CoreTransportOptions, InstanceView, Session, TransportLimits, TransportTls (+137 more)

### Community 50 - "LedgerPackage"
Cohesion: 0.08
Nodes (20): LedgerName, VerifyLedgerPackagesOptions, LedgerEventKind, LedgerPackage, LedgerEngine, LoaderModule, hexOf(), idOf() (+12 more)

### Community 51 - "chain-placement.test.ts"
Cohesion: 0.09
Nodes (48): Field, PalletMetadata, Registry, RuntimeShape, StorageSpec, inThreadParser(), fill(), le() (+40 more)

### Community 52 - "harness.ts"
Cohesion: 0.09
Nodes (47): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+39 more)

### Community 53 - "spawnChild"
Cohesion: 0.05
Nodes (49): ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, dockerExec(), guardPid() (+41 more)

### Community 54 - "NodeBlockSource"
Cohesion: 0.08
Nodes (19): HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, NodeBlock, NodeHeader, PreparedBlock, QueueRunner (+11 more)

### Community 55 - "key-checks.ts"
Cohesion: 0.07
Nodes (57): Admission, AdmittedSeen, Blocking, KeyCall, KeyRefusal, KeyRow, Restarts, TestKeyConfig (+49 more)

### Community 56 - "transform-checks.ts"
Cohesion: 0.09
Nodes (36): Failure, Variant, TransformError, turns(), until(), baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect() (+28 more)

### Community 57 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (33): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+25 more)

### Community 58 - "backup/backup.ts"
Cohesion: 0.07
Nodes (47): BackupInput, BackupTarget, ManifestHistoryRow, ManifestMigration, ManifestTool, Environment, PgDumpTool, PgliteDump (+39 more)

### Community 59 - "run.test.ts"
Cohesion: 0.06
Nodes (38): CheckStep, ConfigCheckReport, CheckTarget, statsConfig, configCheck(), configText(), coreSettings(), emitDeclarations() (+30 more)

### Community 6 - "admin-harness.ts"
Cohesion: 0.02
Nodes (140): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+132 more)

### Community 60 - "ref_node_fs"
Cohesion: 0.05
Nodes (33): Finding, Upstream, GuardViolation, ReportedTest, filesUnder(), patchesOf(), patchText(), extractStringLiterals() (+25 more)

### Community 61 - "cbor.ts"
Cohesion: 0.08
Nodes (43): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+35 more)

### Community 62 - "declaration.ts"
Cohesion: 0.06
Nodes (44): EntryBuilder, DefinedModule, FieldKind, KnownPointsOnly, TableDeclaration, DeclarationRule, DeclarationSet, PlacedDeclaration (+36 more)

### Community 63 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+34 more)

### Community 64 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+40 more)

### Community 65 - "slow-block-harness.ts"
Cohesion: 0.10
Nodes (40): HeightActivity, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode, Observed (+32 more)

### Community 66 - "post-block-update-checks.ts"
Cohesion: 0.09
Nodes (40): Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction, OracleVersion (+32 more)

### Community 68 - "core-settings.ts"
Cohesion: 0.05
Nodes (42): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys (+34 more)

### Community 69 - "ledger-sweep.test.ts"
Cohesion: 0.09
Nodes (27): GreyPicker, GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, NodeBatch, Block (+19 more)

### Community 7 - "ValidationError"
Cohesion: 0.02
Nodes (148): TransactionHistoryReader, TransactionHistoryWriter, ValidationError, AsOf, AssertExact, HistoryUnavailableError, Key, Namespace (+140 more)

### Community 72 - "version-checks.ts"
Cohesion: 0.12
Nodes (30): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, Answers, toHex() (+22 more)

### Community 73 - "failures.ts"
Cohesion: 0.08
Nodes (33): PendingKey, ReasonCode, Unwrapped, UnexpectedCursor, CodeList, CodeTest, RegistryInput, Section11 (+25 more)

### Community 74 - "private/backends.ts"
Cohesion: 0.09
Nodes (19): PrivateBackend, SessionSeen, Pem, TestCertificates, A112Observation, Wiring, TransportProxy, mutualTlsOptions() (+11 more)

### Community 76 - "networks.ts"
Cohesion: 0.06
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 77 - "core-key-registry.test.ts"
Cohesion: 0.07
Nodes (27): AdmittedKey, KeyRegistryOptions, Run, RunKey, TestKey, admittedOf(), bytesOfHex(), coreKeyRegistry() (+19 more)

### Community 78 - "loop.ts"
Cohesion: 0.10
Nodes (35): HeightRange, Callback, EntryBoundary, ParallelPoint, PointSchedule, Invoke, Progress, ReadOpener (+27 more)

### Community 8 - "config/history.ts"
Cohesion: 0.03
Nodes (153): OpenedConfig, OpenedFacts, CoreVersion, ConfiguredDatabase, ConfiguredDatabaseOptions, CoreEntryInput, CoreSettings, CoreSettingsBase (+145 more)

### Community 80 - "worker-host.test.ts"
Cohesion: 0.09
Nodes (26): LedgerReleasePackage, LedgerPackageOptions, LedgerWorkerFailure, SlowStep, TestLoaderData, loadLedgerPackage(), createV8Adapter(), createV9Adapter() (+18 more)

### Community 83 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 85 - "backup/restore.ts"
Cohesion: 0.11
Nodes (28): BackupFacts, Manifest, Checked, Restored, RestoreTarget, readCursor(), readPrivateCursor(), readPrivateRow() (+20 more)

### Community 86 - "node-format.ts"
Cohesion: 0.15
Nodes (22): Child, Reader, Readable, TableNode, node(), childKey(), concat(), decodeChild() (+14 more)

### Community 87 - "vendored-ledger-v9.test.ts"
Cohesion: 0.13
Nodes (29): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, freeAll(), runInFreshInstance(), bigCell() (+21 more)

### Community 88 - "pglite-processes.ts"
Cohesion: 0.10
Nodes (26): WriterProcess, Job, WorkerEvent, blocksIn(), cleanUp(), firstOf(), startWriterProcess(), workDirectory() (+18 more)

### Community 89 - "BlockRef"
Cohesion: 0.10
Nodes (10): BlockLedgerSource, LedgerBinding, BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, systemEventsKey() (+2 more)

### Community 9 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (141): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryEntry, TransactionHistoryStorage (+133 more)

### Community 90 - "12. Ledger"
Cohesion: 0.13
Nodes (13): LedgerTask, LedgerHost, NodeDatabase, NodeReader, inThreadLedger(), recordingLoads(), released(), listen() (+5 more)

### Community 91 - "sweep-tapes.ts"
Cohesion: 0.16
Nodes (27): TableSnapshot, startLedgerWorker(), hex(), insertionOrder(), firstVersion(), hex(), runFixture(), modelProblems() (+19 more)

### Community 92 - "crash.test.ts"
Cohesion: 0.11
Nodes (24): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+16 more)

### Community 94 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+19 more)

### Community 95 - "plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 96 - "determinism-checks.ts"
Cohesion: 0.13
Nodes (27): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, launchPrivate(), poll(), privateModule(), refusalOf() (+19 more)

### Community 97 - "ws-mutual-tls.test.ts"
Cohesion: 0.09
Nodes (21): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+13 more)

### Community 117 - "halted"
Cohesion: 0.12
Nodes (21): refused(), halted(), When a callback fails, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness (+13 more)

### Community 119 - "pg"
Cohesion: 0.10
Nodes (17): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 1. Postgres-side profiling (+9 more)

### Community 123 - "repository"
Cohesion: 0.11
Nodes (17): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1** (+9 more)

### Community 124 - ".boolean"
Cohesion: 0.11
Nodes (18): insert(), 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints (+10 more)

### Community 125 - "version"
Cohesion: 0.10
Nodes (20): version(), Requirement: CF-2 Builders fill identity and version from the build, Scenario: A misspelled setting is a type error, Requirement: PP-4 The process transport, Scenario: A read through the core, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()` (+12 more)

### Community 135 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 16. Whole system, 17. Required test ids added to the manifest, 3. Modules, 4. Configuration (+7 more)

### Community 147 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 150 - "fault"
Cohesion: 0.14
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 169 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 176 - ".database"
Cohesion: 0.33
Nodes (10): a77Run(), a78Run(), a90Run(), chainProcess(), committedTo3(), identityOf(), outside(), refusalOf() (+2 more)

### Community 177 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 179 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 254 - "Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data"
Cohesion: 0.40
Nodes (4): 2. Database API, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Scenario: A function in the configuration, Scenario: A user module from the configuration file

### Community 257 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 47 - "T"
Cohesion: 0.03
Nodes (62): T(), ADDED Requirements, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+54 more)

### Community 67 - "fn"
Cohesion: 0.05
Nodes (47): fn(), ADDED Requirements, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API, ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError (+39 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (39): 12. Ledger, ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked (+31 more)

### Community 79 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 100 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form (+18 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+16 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: a transaction-pooling proxy is detected and refused, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically, Requirement: the required Postgres configuration is published as a binding Durability Contract, Requirement: the UmbraDB connection sets bounded server-side timeouts by default, Requirement: withLease surfaces a lease-release failure instead of swallowing it (+16 more)

### Community 114 - "package.json"
Cohesion: 0.09
Nodes (22): bugs, url, description, exports, files, homepage, license, main (+14 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 126 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 131 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 133 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 134 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.12
Nodes (17): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol, 6.1 Approved M1 module layout (+9 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 137 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, ajv, effect, @electric-sql/pglite-tools, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core (+9 more)

### Community 138 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 140 - "UmbraDB module guide"
Cohesion: 0.12
Nodes (15): Contract states and contract logs, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Private modules, Reading through `db`, Running a module with the `umbradb` command (+7 more)

### Community 143 - "ROADMAP.md"
Cohesion: 0.13
Nodes (9): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+1 more)

### Community 145 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 146 - "UmbraDB"
Cohesion: 0.13
Nodes (15): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+7 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+5 more)

### Community 154 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 156 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 157 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.15
Nodes (13): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §5 — Run log (+5 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 160 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 162 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 163 - "README.md"
Cohesion: 0.30
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 165 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 166 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover) (+3 more)

### Community 167 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 168 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 171 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 172 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 173 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 174 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 178 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 180 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 181 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 182 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 183 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 184 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 185 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer) (+1 more)

### Community 186 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 187 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 188 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 191 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 192 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 193 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 194 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 196 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 197 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 198 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 199 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 200 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 201 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 202 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 203 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 204 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 205 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 206 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 207 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 208 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 209 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 210 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 211 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 212 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 213 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 217 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 218 - "UmbraDB — project instructions"
Cohesion: 0.33
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 219 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 220 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 221 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 222 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 223 - "5. Recommended candidate model"
Cohesion: 0.33
Nodes (6): 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 224 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 225 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 226 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 227 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 228 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 229 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 230 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 233 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 234 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 235 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 236 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 237 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 238 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 239 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 240 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 241 - "00018 — The ledger packages' `successfulSegments` is true for the segments that failed"
Cohesion: 0.40
Nodes (4): 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix

### Community 242 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 243 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 244 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 245 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 246 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 247 - "00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles"
Cohesion: 0.40
Nodes (4): 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles, Evidence, Problem, Suggested fix

### Community 248 - "00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses"
Cohesion: 0.40
Nodes (4): 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses, Evidence, Problem, Suggested fix

### Community 249 - "00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)"
Cohesion: 0.40
Nodes (4): 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5), Evidence, Problem, Suggested fix

### Community 250 - "00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so"
Cohesion: 0.40
Nodes (4): 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so, Evidence, Problem, Suggested fix

### Community 251 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 252 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 253 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 255 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 258 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 259 - "Vendored ledger builds"
Cohesion: 0.40
Nodes (4): Rebuilding, Updating a version, Vendored ledger builds, What the patches add

### Community 260 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 261 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.50
Nodes (3): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Suggested fix

### Community 262 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 263 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 264 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 265 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 266 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 267 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 271 - "peerDependenciesMeta"
Cohesion: 0.67
Nodes (3): optional, peerDependenciesMeta, @electric-sql/pglite-tools

### Community 272 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 70 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 71 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+28 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+27 more)

### Community 84 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 93 - "Full-Chain Storage — Design"
Cohesion: 0.07
Nodes (29): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+21 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

## Knowledge Gaps
- **53 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-8949`, `RFC-3339` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3509 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionLeaseLayer`, `src/index.ts`, `Database`, `api-server.test.ts`, `core-transport.ts`, `admin-harness.ts`, `ValidationError`, `config/history.ts`, `chain-process.test.ts`, `opt-out.test.ts`, `ReadHandle`, `runner/process.ts`, `createClient`, `validate.ts`, `InMemoryBlockSource`, `ledger-storage.test.ts`, `refused-configuration.test.ts`, `fetch-fixtures.ts`, `ref_node_crypto`, `ref_node_url`, `node/client.test.ts`, `core-block-parsed.ts`, `CheckpointStore`, `tape/index.ts`, `config-check.ts`, `adapter.ts`, `range.test.ts`, `builder.test.ts`, `adapter-fixtures.ts`, `contract-modules.test.ts`, `.value`, `process-admin.ts`, `order.property.test.ts`, `contract-data-checks.ts`, `real-tapes.ts`, `backup-fixtures.ts`, `core-private-source.test.ts`, `core-ledger-state.ts`, `host.ts`, `range.ts`, `ledger-tapes.ts`, `chain-placement.test.ts`, `spawnChild`, `key-checks.ts`, `transform-checks.ts`, `column-rules.test.ts`, `backup/backup.ts`, `run.test.ts`, `ref_node_fs`, `declaration.ts`, `boundary.test.ts`, `slow-block-harness.ts`, `post-block-update-checks.ts`, `core-settings.ts`, `ledger-sweep.test.ts`, `version-checks.ts`, `failures.ts`, `private/backends.ts`, `networks.ts`, `core-key-registry.test.ts`, `worker-host.test.ts`, `cbor.property.test.ts`, `node-format.ts`, `vendored-ledger-v9.test.ts`, `pglite-processes.ts`, `sweep-tapes.ts`, `crash.test.ts`, `plain-data.ts`, `ws-mutual-tls.test.ts`, `digest.test.ts`, `binding.test.ts`, `intake.test.ts`, `cli/command.ts`, `lockstep-refusals.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `node-bridge.ts`, `package.json`, `private/lockstep-wait.test.ts`, `type-check.ts`, `BlockItems`, `repository`, `height-versioned.property.test.ts`, `statementsOf`, `mutation-per-adapter.mjs`, `public-items.test.ts`, `cursor-table.property.test.ts`, `identity.ts`, `excluded-not-exported.test.ts`, `history.property.test.ts`, `lockstep-reads.test.ts`, `postgres-image.test.ts`?**
  _High betweenness centrality (0.330) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionLeaseLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.013820598006644518 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `vitest` to `version-table.ts`, `Database`, `api-server.test.ts`, `core-transport.ts`, `admin-harness.ts`, `config/history.ts`, `chain-process.test.ts`, `statementsOf`, `ReadHandle`, `runner/process.ts`, `opt-out.test.ts`, `validate.ts`, `checkShape`, `InMemoryBlockSource`, `ledger-storage.test.ts`, `refused-configuration.test.ts`, `fetch-fixtures.ts`, `ref_node_crypto`, `NodeClient`, `public-items.test.ts`, `node/client.test.ts`, `identity.ts`, `tape/index.ts`, `config-check.ts`, `contract-modules.test.ts`, `process-admin.ts`, `real-tapes.ts`, `core-private-source.test.ts`, `FinalizedLoop`, `core-ledger-state.ts`, `range.ts`, `NodeBlockSource`, `transform-checks.ts`, `backup/backup.ts`, `ref_node_fs`, `cbor.ts`, `declaration.ts`, `graph.ts`, `slow-block-harness.ts`, `UmbraDB module guide`, `core-settings.ts`, `version-checks.ts`, `failures.ts`, `core-key-registry.test.ts`, `loop.ts`, `backup/restore.ts`, `BlockRef`, `12. Ledger`, `mapping.ts`, `plain-data.ts`, `binding.test.ts`, `lockstep-refusals.test.ts`, `items.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.019478905384945653 - nodes in this community are weakly interconnected._