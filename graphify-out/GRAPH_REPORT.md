# Graph Report - UmbraDB

## Corpus Check
- 923 files · ~1,432,999 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 9950 nodes · 29537 edges · 270 communities (245 shown, 25 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 3339 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `035a90e7f168b210` (923 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- loop.ts
- src/index.ts
- test/postgres/setup.ts
- node-bridge.ts
- worker-storage.test.ts
- digest.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- height-versioned.property.test.ts
- code-registry.ts
- ChainArchiveStore
- refused-configuration.test.ts
- sweep.ts
- intake.test.ts
- full-sync-soak.integration.test.ts
- tx-replay-decoder.ts
- ledger/types.ts
- ledger/metadata.ts
- version-table.ts
- core-chain.ts
- api-server.test.ts
- ingest-faults.test.ts
- PrivateTransport
- commit-proxy.ts
- identity.ts
- describeNodeStoreExports
- PgTransactionLeaseLayer
- 3. Proof-blocking findings
- FakeNode
- crash-worker.ts
- column-rules.ts
- HeightRun
- attempt
- RawClient
- ref_node_crypto
- no-indexer-or-wallet-sdk.test.ts
- component-table.test.ts
- tape/index.ts
- childRefKeys
- ChunkMissingError
- type-check.ts
- ProcessItems
- ModuleDeclaration
- postgres-image.test.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- db/durability-probe.test.ts
- chain-process.test.ts
- NodeClient
- ReadPool
- mutation-evidence.d.mts
- vendored-ledger-files.test.ts
- config-check.ts
- node-source.test.ts
- validate.ts
- core-block-parsed.ts
- core-transport.ts
- CliBackend
- ReadHandle
- StorageError
- ref_node_fs
- VersionConflictError
- vitest
- ledger-storage.test.ts
- range.ts
- module-tables.ts
- core-private-source.test.ts
- adapter.ts
- host.ts
- determinism-checks.ts
- record-and-replay.test.ts
- FinalizedLoop
- adapter-fixtures.ts
- db/migrate.ts
- translatePostgresError
- .value
- node/client.test.ts
- core-ledger-state.ts
- .read
- changes.property.test.ts
- NodeBlockSource
- fetch-fixtures.ts
- UmbraError
- harness.ts
- runMigrations
- real-tapes.ts
- transform-checks.ts
- chain-placement.test.ts
- cbor.ts
- mapping.ts
- core-block-commit.test.ts
- slow-block-harness.ts
- LedgerPackage
- runner/process.ts
- .#open
- PgTransactionHistoryStorage
- ws-mutual-tls.test.ts
- post-block-update-checks.ts
- graph.ts
- core-settings.ts
- BlockRef
- checkShape
- config/history.ts
- declaration.ts
- sweep-tapes.ts
- ledger-tapes.ts
- change-capture.ts
- boundary.test.ts
- refused
- ledger-state.test.ts
- cbor.property.test.ts
- networks.ts
- admin-harness.ts
- node-format.ts
- binding.test.ts
- vendored-ledger-v9.test.ts
- checks.test.ts
- order.property.test.ts
- ValidationError
- LedgerEngine
- version-checks.ts
- child-processes.test.ts
- 5. Runner
- ledger-sweep.test.ts
- table
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- block-fetch-decode.test.ts
- Tasks — v1.0.0-infosec-signoff
- mutation-per-adapter.mjs
- pg
- .restore
- twox.ts
- history.property.test.ts
- pack-install.mjs
- scoped-review-manifest
- Performance — design
- orphan-watcher.mjs
- read-only-checks.ts
- fresh-instance.mjs
- Requirement: CF-4 Every field is data, operational or secret
- ADDED Requirements
- hello
- graph.py
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Storage Algebra Lean Formalization — Approved Design and Status
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- Design — Postgres+JSONB storage rebuild
- stryker.conf.json
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
- UmbraDB
- README.md
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- Roadmap
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- UmbraDB V1.0.0 Implementation Guideline
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Design — v1.0.0-infosec-signoff
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
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
- Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — CORE-ARCH: the standalone indexer's core architecture
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 5. Recommended candidate model
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — v1.0.0-perf-baseline
- Acceptance — v1.1.0: Quint model checking
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
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- Acceptance criteria — v1.0.0-perf-baseline
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
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
- ADDED Requirements
- package.json
- main.rs
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
10. `Database` - 87 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: A checkpoint whose stored chunk content matches its recorded hash loads successfully` --references--> `CheckpointRecord`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts
- `Scenario: A history page issues two queries regardless of page size` --references--> `CheckpointSummary`  [INFERRED]
  openspec/changes/v1.0.0-perf-baseline/specs/performance-baseline/spec.md → src/interfaces/checkpoint-store.ts
- `CheckpointStore: content-addressed snapshots` --references--> `ManifestCorruptError`  [INFERRED]
  README.md → src/interfaces/checkpoint-store.ts
- `Impact` --references--> `TemporalKV`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/proposal.md → src/interfaces/temporal-kv.ts
- `What changes` --references--> `TemporalKV`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/proposal.md → src/interfaces/temporal-kv.ts

## Import Cycles
- None detected.

## Communities (270 total, 25 thin omitted)

### Community 0 - "loop.ts"
Cohesion: 0.02
Nodes (191): DurabilityViolation, ErrorCode, PointName, Revision, EntryRange, GraphInput, HeightRange, ResolvedGraph (+183 more)

### Community 1 - "src/index.ts"
Cohesion: 0.03
Nodes (179): TransactionHistoryReader, TransactionHistoryWriter, CheckpointRecord, CheckpointSequence, CheckpointStoreErrorCode, CheckpointSummary, ContentHash, HistoryOptions (+171 more)

### Community 10 - "test/postgres/setup.ts"
Cohesion: 0.02
Nodes (136): JsonValue, KvRow, BatchSpec, CurrentState, InvariantResult, C5AnyFn, CurrentState, CurrentState (+128 more)

### Community 100 - "node-bridge.ts"
Cohesion: 0.10
Nodes (21): NodeStore, StoredNode, EngineOptions, BridgeServer, bridgeStore, Growable, Nodes, bridgeMemory() (+13 more)

### Community 102 - "worker-storage.test.ts"
Cohesion: 0.11
Nodes (20): LedgerReleasePackage, SlowStep, TestLoaderData, loadLedgerPackage(), createV8Adapter(), createV9Adapter(), countDeserializations(), hexOf() (+12 more)

### Community 103 - "digest.test.ts"
Cohesion: 0.11
Nodes (23): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+15 more)

### Community 104 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 105 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 106 - "height-versioned.property.test.ts"
Cohesion: 0.15
Nodes (18): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Key, Model (+10 more)

### Community 107 - "code-registry.ts"
Cohesion: 0.13
Nodes (24): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+16 more)

### Community 108 - "ChainArchiveStore"
Cohesion: 0.08
Nodes (11): ChainArchiveStore, 6. Known limitations, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents (+3 more)

### Community 11 - "refused-configuration.test.ts"
Cohesion: 0.03
Nodes (127): ProcessConfig, SignalTarget, AdminRun, Answered, gate, Start, Child, Refusal (+119 more)

### Community 110 - "sweep.ts"
Cohesion: 0.13
Nodes (12): GreyView, SweepPhase, SweepTables, byBytes(), BYTE_ORDER(), hexOf(), merged(), sweepStep() (+4 more)

### Community 111 - "intake.test.ts"
Cohesion: 0.17
Nodes (13): PrivateSeen, A114Observation, A116Observation, TestLink, a114Problems(), a114Run(), a116Problems(), follow() (+5 more)

### Community 112 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (11): GcPass, HistGroup, SampleObservation, kvMapKey(), newPool(), readCurrentState(), { connectionUri }, DECLARED_ENVELOPE (+3 more)

### Community 113 - "tx-replay-decoder.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+12 more)

### Community 114 - "ledger/types.ts"
Cohesion: 0.16
Nodes (19): ApplyInput, ApplyOutput, LedgerEvent, LedgerTask, LogItem, StateHandle, TransactionResult, VmLog (+11 more)

### Community 115 - "ledger/metadata.ts"
Cohesion: 0.15
Nodes (7): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, OwnStateMetadata, contentStateOf(), hexOf()

### Community 116 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 119 - "core-chain.ts"
Cohesion: 0.13
Nodes (19): Bound, ChainSource, ConfiguredGenesis, CoreChainBinding, WaitingListener, boundTo(), bytesOf(), checkChain() (+11 more)

### Community 12 - "api-server.test.ts"
Cohesion: 0.03
Nodes (105): ApiRegistry, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, VersionedResponse, ChainDataAnswer (+97 more)

### Community 122 - "ingest-faults.test.ts"
Cohesion: 0.15
Nodes (14): ProcessCondition, A84Observation, LoggedRetry, OutageObservation, RetrySample, askingAgain(), fastClient(), outageRun() (+6 more)

### Community 123 - "PrivateTransport"
Cohesion: 0.19
Nodes (6): HelloAck, PrivateTransport, lost(), reject(), resolve(), rowsOf()

### Community 124 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 126 - "identity.ts"
Cohesion: 0.20
Nodes (15): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+7 more)

### Community 128 - "describeNodeStoreExports"
Cohesion: 0.18
Nodes (4): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports()

### Community 13 - "PgTransactionLeaseLayer"
Cohesion: 0.03
Nodes (120): TransactionKeyReuseError, Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, Rollback, TransactionFaultError (+112 more)

### Community 130 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 137 - "crash-worker.ts"
Cohesion: 0.20
Nodes (14): CoTxCallable, CoTxPauseInfo, CrashHook, describeCaughtError(), main(), observeClientPauseBeforeCursor(), pauseThenResume(), pauseUntilKilled() (+6 more)

### Community 14 - "column-rules.ts"
Cohesion: 0.02
Nodes (104): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+96 more)

### Community 140 - "HeightRun"
Cohesion: 0.16
Nodes (6): HeightRun, SkipsAfterReconnect, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, StartsAtEveryRevision

### Community 143 - "attempt"
Cohesion: 0.16
Nodes (13): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+5 more)

### Community 15 - "ref_node_crypto"
Cohesion: 0.03
Nodes (85): EntryLifecycle, MergeEntriesFn, TransactionHistoryEntry, TransactionHistoryStatus, JsonEncoded, StoredEntryJson, TxHistoryRow, LifecycleDetailStore (+77 more)

### Community 151 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 158 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 16 - "tape/index.ts"
Cohesion: 0.04
Nodes (77): Recorded, Failure, Variant, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest (+69 more)

### Community 169 - "childRefKeys"
Cohesion: 0.40
Nodes (3): ChildReader, childRefKeys(), readChildren()

### Community 17 - "ChunkMissingError"
Cohesion: 0.02
Nodes (107): CheckpointNotFoundError, ChunkIntegrityError, ChunkMissingError, Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, version() (+99 more)

### Community 178 - "type-check.ts"
Cohesion: 0.36
Nodes (8): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), isRegularFile(), packageType(), typeCheckFile(), typescript

### Community 18 - "ModuleDeclaration"
Cohesion: 0.04
Nodes (98): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminStarter (+90 more)

### Community 180 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 184 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 19 - "db/durability-probe.test.ts"
Cohesion: 0.04
Nodes (86): DurabilityProbeOptions, DurabilityWarning, ProbeSession, Held, PgliteLockUse, Outcome, Outcome, Writer (+78 more)

### Community 2 - "chain-process.test.ts"
Cohesion: 0.02
Nodes (160): BlockItemSource, BlockSource, FinalityStallCondition, InMemoryBlockSource, InMemoryItems, Wait, LoopInput, ProcessHandle (+152 more)

### Community 20 - "NodeClient"
Cohesion: 0.05
Nodes (67): Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter, NodeBlock (+59 more)

### Community 206 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 207 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 21 - "config-check.ts"
Cohesion: 0.04
Nodes (81): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, StepName, StepReport (+73 more)

### Community 22 - "node-source.test.ts"
Cohesion: 0.03
Nodes (66): NodeCallOptions, ConnectSocket, RecordingClient, Opened, ScriptedRequest, syntheticChain, SyntheticChainOptions, SyntheticFault (+58 more)

### Community 23 - "validate.ts"
Cohesion: 0.04
Nodes (90): RedactionForms, SecretForm, TextPattern, ConfigRule, CursorRule, EntryRef, Finding, Issue (+82 more)

### Community 24 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (92): BlockHeaderItem, BlockEventSource, BodyExtrinsic, BlockBody, CoreBlockHeader, BlockParsed, BlockParsedOptions, BlockTransaction (+84 more)

### Community 25 - "core-transport.ts"
Cohesion: 0.04
Nodes (77): CoreTransportOptions, InstanceView, Session, TransportLimits, TransportTls, Committed, Hello, JsonValue (+69 more)

### Community 26 - "ReadHandle"
Cohesion: 0.03
Nodes (63): BlockWriteHandle, ReadHandle, OwnPart, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions (+55 more)

### Community 27 - "StorageError"
Cohesion: 0.03
Nodes (95): CheckpointStoreError, ConnectionError, Retryability, StorageError, TemporalKVError, Row, code(), Change: `v1.0.0-api-surface` — G1/G2/G3/G4/G20 the public-surface freeze (2026-07-24) (+87 more)

### Community 28 - "ref_node_fs"
Cohesion: 0.03
Nodes (64): LoadOptions, PlainArray, PlainDataNode, PlainDataRule, Walk, Row, Finding, GuardViolation (+56 more)

### Community 29 - "VersionConflictError"
Cohesion: 0.02
Nodes (94): HistoryUnavailableError, VersionConflictError, T(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, `kv_current` / `kv_history` — TemporalKV, tier1_wallet lineage, `watermarks`, 1. TemporalKV — event-sourced right action with a CAS guard (+86 more)

### Community 3 - "vitest"
Cohesion: 0.02
Nodes (115): DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, Database, ReadOnlyDatabase (+107 more)

### Community 30 - "ledger-storage.test.ts"
Cohesion: 0.04
Nodes (83): BlockHeader, SourceShared, CrashEvent, CrashJob, ingest, IngestOptions, SourceClass, watched (+75 more)

### Community 31 - "range.ts"
Cohesion: 0.04
Nodes (73): NodeClientOptions, NodeSubscription, Refusal, BoundaryBlockReading, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions (+65 more)

### Community 32 - "module-tables.ts"
Cohesion: 0.05
Nodes (58): ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ConsistentRead, RefusalPlace, DeterminismBackend, TestDatabase (+50 more)

### Community 33 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (46): ChainCheck, ChainCheckInput, Closable, PrivateBlockSource, PrivateChecks, PrivateIntakeOptions, PublicDatabase, PublicIdentity (+38 more)

### Community 34 - "adapter.ts"
Cohesion: 0.04
Nodes (61): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+53 more)

### Community 35 - "host.ts"
Cohesion: 0.06
Nodes (55): LoadLedger, LedgerStateItem, LedgerName, ChainOutcome, LedgerPackageOptions, ParsedTransaction, StateSummary, AppliedState (+47 more)

### Community 36 - "determinism-checks.ts"
Cohesion: 0.05
Nodes (56): PrivateBackend, SessionSeen, TestCertificates, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A155Observation (+48 more)

### Community 37 - "record-and-replay.test.ts"
Cohesion: 0.05
Nodes (42): Answer, Handler, Received, recorded, ConnectionFrames, Failure, Variant, WrongRecording (+34 more)

### Community 38 - "FinalizedLoop"
Cohesion: 0.05
Nodes (20): Activity, FinalizedLoop, LoopObserver, UnexpectedCursor, Startup, WaitingInRead, ItemsAfterWrite, FailingAfter (+12 more)

### Community 39 - "adapter-fixtures.ts"
Cohesion: 0.07
Nodes (59): Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState, Probe (+51 more)

### Community 4 - "db/migrate.ts"
Cohesion: 0.03
Nodes (135): SchemaWriteHandle, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference, PlannedSchema (+127 more)

### Community 40 - "translatePostgresError"
Cohesion: 0.07
Nodes (47): BlobIntegrityError, BlobMissingError, BlobRole, BlockBundle, BlockMeta, BlockNotFoundError, BlockRecord, BlockStatus (+39 more)

### Community 41 - ".value"
Cohesion: 0.09
Nodes (43): ExtrinsicCall, MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, MetadataVariant, Primitive (+35 more)

### Community 42 - "node/client.test.ts"
Cohesion: 0.05
Nodes (30): NodeRetry, ManualTimers, TapeCall, TapeClock, caught(), client(), quietConnect(), scriptedSockets() (+22 more)

### Community 43 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (54): CoreLedgerStateOptions, retainedStates, CoreRevision, GreyPicker, bindLedgerParser(), boundLedgerParser(), workerParser(), applyBlock() (+46 more)

### Community 44 - ".read"
Cohesion: 0.05
Nodes (54): Settings, Run, Job, WorkerEvent, Outcome, identityRow(), captured(), captureFunction() (+46 more)

### Community 45 - "changes.property.test.ts"
Cohesion: 0.06
Nodes (56): Chain, ChainOptions, DigestRow, Op, States, TableName, encodeCanonical(), hex() (+48 more)

### Community 46 - "NodeBlockSource"
Cohesion: 0.08
Nodes (19): CoreBlockItems, BlockLedgerSource, HeadWait, NodeBlockSource, NodeSourceOptions, Prefetch, LedgerBinding, NodeHeader (+11 more)

### Community 47 - "fetch-fixtures.ts"
Cohesion: 0.08
Nodes (55): Scenario, ArgType, BlockOptions, CallSpec, chainBlock, PalletSpec, RUNTIME, Decoded (+47 more)

### Community 48 - "UmbraError"
Cohesion: 0.05
Nodes (30): JobQueue, PgliteDatabase, BoundedRead, Session, UmbraError, DeclarationRule, BlockOptions, Case (+22 more)

### Community 49 - "harness.ts"
Cohesion: 0.09
Nodes (47): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+39 more)

### Community 5 - "runMigrations"
Cohesion: 0.02
Nodes (126): AnySql, RolloverBucket, RolloverTable, UmbraDBSql, DurabilityContractError, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning (+118 more)

### Community 50 - "real-tapes.ts"
Cohesion: 0.05
Nodes (43): Metadata, Step, FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource (+35 more)

### Community 51 - "transform-checks.ts"
Cohesion: 0.09
Nodes (37): Failure, Variant, TransformError, recordKind, CallSelection, NotificationRange, baseRecords(), expectedText() (+29 more)

### Community 52 - "chain-placement.test.ts"
Cohesion: 0.09
Nodes (45): Field, PalletMetadata, Registry, RuntimeShape, StorageSpec, decodeExtrinsics(), inThreadParser(), fill() (+37 more)

### Community 53 - "cbor.ts"
Cohesion: 0.08
Nodes (44): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+36 more)

### Community 54 - "mapping.ts"
Cohesion: 0.07
Nodes (38): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+30 more)

### Community 55 - "core-block-commit.test.ts"
Cohesion: 0.06
Nodes (36): StandInOptions, Commit, TestBackend, HeldRead, Job, Outcome, Reads, Step (+28 more)

### Community 56 - "slow-block-harness.ts"
Cohesion: 0.09
Nodes (41): HeightActivity, ReadOpener, StatusBody, Times, Wait, askedSource, BodyRead, HoldMode (+33 more)

### Community 57 - "LedgerPackage"
Cohesion: 0.06
Nodes (27): RetainedState, LedgerEventKind, LedgerPackage, guardContainers(), guardPid(), watcherInput(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence (+19 more)

### Community 58 - "runner/process.ts"
Cohesion: 0.05
Nodes (17): LoopEnd, upgradeBoundary, UpgradeCondition, UpgradeEntry, SilentHalt, coreBlockFetchOnFetch(), isBlockItemSource(), blockContext() (+9 more)

### Community 59 - ".#open"
Cohesion: 0.08
Nodes (21): NodeWait, ConfigFinding, CoreTransport, RetryCode, SlowBlockEvent, Process, RetryCondition, WaitingCondition (+13 more)

### Community 6 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (156): TransactionHistoryStorage, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, CheckpointStore, abortErrorLike(), reason(), 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`), 9. Module → module mapping (source of truth for `tasks.md`) (+148 more)

### Community 60 - "ws-mutual-tls.test.ts"
Cohesion: 0.05
Nodes (38): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+30 more)

### Community 61 - "post-block-update-checks.ts"
Cohesion: 0.09
Nodes (39): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+31 more)

### Community 62 - "graph.ts"
Cohesion: 0.08
Nodes (45): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeFacts, Spanned (+37 more)

### Community 64 - "core-settings.ts"
Cohesion: 0.06
Nodes (39): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+31 more)

### Community 65 - "BlockRef"
Cohesion: 0.07
Nodes (14): QueuedBlock, BlockItems, BlockRef, InMemorySourceOptions, EventsRunner, Fetching, Recorder, LateRedelivery (+6 more)

### Community 68 - "checkShape"
Cohesion: 0.07
Nodes (34): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), insert() (+26 more)

### Community 7 - "config/history.ts"
Cohesion: 0.03
Nodes (153): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder (+145 more)

### Community 70 - "declaration.ts"
Cohesion: 0.06
Nodes (35): AdmittedKey, DefinedModule, KnownPointsOnly, TableDeclaration, PlacedDeclaration, Plain, Validator, schemaFile() (+27 more)

### Community 71 - "sweep-tapes.ts"
Cohesion: 0.11
Nodes (37): TableSnapshot, FixtureNode, FakeState, coreLedgerState(), writeSweep(), coreWith(), hex(), insertionOrder() (+29 more)

### Community 72 - "ledger-tapes.ts"
Cohesion: 0.09
Nodes (40): BlockSpec, EventSpec, Json, transactionSpec, eventsRuntime, Phase, ledgerScenario, LedgerScenarioOptions (+32 more)

### Community 73 - "change-capture.ts"
Cohesion: 0.10
Nodes (26): CapturedTable, CaptureState, GuardTableRow, optOut, captureDefinitions(), capturedTables(), captureFunctionName(), captureReady() (+18 more)

### Community 74 - "boundary.test.ts"
Cohesion: 0.12
Nodes (34): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+26 more)

### Community 75 - "refused"
Cohesion: 0.06
Nodes (37): AlwaysLanded, refused(), cursorRead(), following(), 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix (+29 more)

### Community 76 - "ledger-state.test.ts"
Cohesion: 0.12
Nodes (36): Call, recordedGenesis, a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows(), expectedStates() (+28 more)

### Community 78 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (35): CaptureColumn, CanonicalEncodingFailure, CanonicalValue, ModuleColumn, ColumnType, Abort, CheckResult, Decoded (+27 more)

### Community 79 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 8 - "admin-harness.ts"
Cohesion: 0.03
Nodes (119): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+111 more)

### Community 80 - "node-format.ts"
Cohesion: 0.12
Nodes (23): Child, Reader, Readable, Reader, TableNode, node(), childKey(), concat() (+15 more)

### Community 83 - "binding.test.ts"
Cohesion: 0.10
Nodes (31): TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, readIdentity(), privateCursorHeight() (+23 more)

### Community 85 - "vendored-ledger-v9.test.ts"
Cohesion: 0.13
Nodes (30): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, runInFreshInstance(), bigCell(), cell() (+22 more)

### Community 87 - "checks.test.ts"
Cohesion: 0.08
Nodes (23): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql() (+15 more)

### Community 88 - "order.property.test.ts"
Cohesion: 0.09
Nodes (33): PointRun, CheckName, GraphSpec, ModuleSpec, Pipeline, TESTED, byBytes(), checkDigestLast() (+25 more)

### Community 9 - "ValidationError"
Cohesion: 0.02
Nodes (131): EntryContent, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, Command, ReplayableStorage, ValidationError (+123 more)

### Community 90 - "LedgerEngine"
Cohesion: 0.16
Nodes (10): LedgerEngine, hexOf(), idOf(), same(), sameBytes(), run(), storedState(), started() (+2 more)

### Community 91 - "version-checks.ts"
Cohesion: 0.15
Nodes (26): CountingNode, MetadataSelector, Select, Walk, Answers, toHex(), H(), blockWith() (+18 more)

### Community 93 - "child-processes.test.ts"
Cohesion: 0.07
Nodes (27): ParentJob, Kill, Orphaned, SourceFile, alive(), bystander(), childrenOf(), commandOf() (+19 more)

### Community 95 - "5. Runner"
Cohesion: 0.15
Nodes (29): ResolvedRange, Callback, EntryBoundary, ParallelPoint, PointSchedule, CoreStopsFirst, checkBackbone(), span() (+21 more)

### Community 99 - "ledger-sweep.test.ts"
Cohesion: 0.13
Nodes (16): SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel (+8 more)

### Community 66 - "table"
Cohesion: 0.05
Nodes (40): table(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, Blocks from the node, Cursor tables, Data that is not a function of the chain (+32 more)

### Community 109 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.09
Nodes (21): 10. Ingest, 11. Chain data, 13. Contract data, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 3. Modules, 4. Configuration (+13 more)

### Community 118 - "block-fetch-decode.test.ts"
Cohesion: 0.18
Nodes (16): blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes(), encodeCompact() (+8 more)

### Community 129 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.12
Nodes (13): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1 (+5 more)

### Community 139 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 142 - "pg"
Cohesion: 0.15
Nodes (12): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 2. Node-side query correlation (+4 more)

### Community 146 - ".restore"
Cohesion: 0.14
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 150 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 163 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 170 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 172 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 205 - "Performance — design"
Cohesion: 0.29
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 222 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 238 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 239 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 246 - "Requirement: CF-4 Every field is data, operational or secret"
Cohesion: 0.50
Nodes (4): listen(), Requirement: CF-4 Every field is data, operational or secret, Scenario: A secret never appears, Scenario: Two `core` revisions with different databases

### Community 63 - "ADDED Requirements"
Cohesion: 0.05
Nodes (44): fakePackage(), regular(), system(), Chain events, transactions and their outcomes, 10. Tables, Requirement: CD-5 `core-block-parsed` parses each block once, Scenario: A system transaction between regular ones, Scenario: A transaction no event accounts for (+36 more)

### Community 77 - "hello"
Cohesion: 0.06
Nodes (38): endedWithin(), hello(), tlsProblems(), greeted(), apiProblems(), duplicateProblems(), greeted(), 14. Private processes (+30 more)

### Community 81 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 82 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): 2. Database API, ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)` (+22 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): integer(), ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: history() computes per-manifest aggregates in a single grouped query (HP-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1) (+23 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 117 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.10
Nodes (21): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+13 more)

### Community 120 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 125 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.11
Nodes (14): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+6 more)

### Community 127 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically, Requirement: the required Postgres configuration is published as a binding Durability Contract, Requirement: the UmbraDB connection sets bounded server-side timeouts by default, Scenario: a caller can override each timeout default, Scenario: A crash before the single commit leaves neither the checkpoint nor the cursor (+8 more)

### Community 133 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 135 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 136 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 138 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 141 - "ROADMAP.md"
Cohesion: 0.14
Nodes (9): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+1 more)

### Community 144 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 145 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 147 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 148 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 152 - "README.md"
Cohesion: 0.27
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 153 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 155 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.15
Nodes (12): 0. Package layout, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire, 3. G7 — Server-side timeouts, 5.1 Archival reconciliation note (Opus N6), 5. Boundaries and non-goals respected, 6.1 The Fable-vs-Opus factual dispute (resolved by live test), 6.2 Blocking findings applied (+4 more)

### Community 156 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 159 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 162 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 164 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 165 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 166 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 167 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 168 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.18
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 171 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 173 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 174 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 175 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 176 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 177 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 181 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 182 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 183 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 185 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 186 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 187 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 188 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 189 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 190 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 191 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 192 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 193 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 194 - "Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored"
Cohesion: 0.25
Nodes (7): ADDED Requirements, MODIFIED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Scenario: A stale transaction handle is rejected before any query runs, Scenario: Two puts inside one withTransaction both commit together, Scenario: Two puts inside one withTransaction either both commit or neither does, temporal-kv (transaction-participation wiring)

### Community 195 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 196 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 197 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 198 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 199 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.29
Nodes (6): 14. External claims and their evidence, 15. Relation to the existing design documents, 9.1 Backups (BK; Q83, Q85), 9.2 Browser build (BR), 9. Backups and browser, Design — CORE-ARCH: the standalone indexer's core architecture

### Community 200 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 201 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 202 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 203 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 208 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 209 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 210 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 211 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 212 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 213 - "5. Recommended candidate model"
Cohesion: 0.33
Nodes (6): 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 214 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 215 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 216 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 217 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 218 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 219 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 220 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 221 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 223 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 224 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 225 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 226 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 227 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 228 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 229 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 230 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 231 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 232 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 233 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 234 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 235 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 236 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 237 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 240 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 241 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 242 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 243 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 244 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 245 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 247 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 248 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 249 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 67 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+28 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 89 - "package.json"
Cohesion: 0.06
Nodes (34): bin, umbradb, bugs, url, dependencies, @electric-sql/pglite, postgres, typescript (+26 more)

### Community 92 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+23 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

## Knowledge Gaps
- **51 isolated node(s):** `RFC-8259`, `RFC-8949`, `RFC-3339`, `RFC-7693`, `RFC-7693` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3353 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `loop.ts`, `src/index.ts`, `chain-process.test.ts`, `db/migrate.ts`, `runMigrations`, `config/history.ts`, `admin-harness.ts`, `ValidationError`, `test/postgres/setup.ts`, `refused-configuration.test.ts`, `api-server.test.ts`, `PgTransactionLeaseLayer`, `column-rules.ts`, `ref_node_crypto`, `tape/index.ts`, `ChunkMissingError`, `ModuleDeclaration`, `db/durability-probe.test.ts`, `NodeClient`, `config-check.ts`, `node-source.test.ts`, `validate.ts`, `core-block-parsed.ts`, `core-transport.ts`, `ReadHandle`, `ref_node_fs`, `ledger-storage.test.ts`, `module-tables.ts`, `core-private-source.test.ts`, `adapter.ts`, `host.ts`, `determinism-checks.ts`, `record-and-replay.test.ts`, `adapter-fixtures.ts`, `translatePostgresError`, `node/client.test.ts`, `core-ledger-state.ts`, `.read`, `changes.property.test.ts`, `fetch-fixtures.ts`, `UmbraError`, `real-tapes.ts`, `transform-checks.ts`, `chain-placement.test.ts`, `mapping.ts`, `core-block-commit.test.ts`, `slow-block-harness.ts`, `runner/process.ts`, `.#open`, `ws-mutual-tls.test.ts`, `post-block-update-checks.ts`, `core-settings.ts`, `declaration.ts`, `sweep-tapes.ts`, `boundary.test.ts`, `ledger-state.test.ts`, `cbor.property.test.ts`, `networks.ts`, `node-format.ts`, `binding.test.ts`, `vendored-ledger-v9.test.ts`, `checks.test.ts`, `order.property.test.ts`, `package.json`, `version-checks.ts`, `child-processes.test.ts`, `ledger-sweep.test.ts`, `node-bridge.ts`, `worker-storage.test.ts`, `digest.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `height-versioned.property.test.ts`, `code-registry.ts`, `intake.test.ts`, `full-sync-soak.integration.test.ts`, `block-fetch-decode.test.ts`, `ingest-faults.test.ts`, `identity.ts`, `Tasks — v1.0.0-infosec-signoff`, `mutation-per-adapter.mjs`, `twox.ts`, `no-indexer-or-wallet-sdk.test.ts`, `excluded-not-exported.test.ts`, `component-table.test.ts`, `history.property.test.ts`, `postgres-image.test.ts`, `vendored-ledger-files.test.ts`?**
  _High betweenness centrality (0.318) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8259`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `loop.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.01769960605892471 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `loop.ts`, `chain-process.test.ts`, `vitest`, `db/migrate.ts`, `config/history.ts`, `refused-configuration.test.ts`, `api-server.test.ts`, `tape/index.ts`, `ModuleDeclaration`, `db/durability-probe.test.ts`, `NodeClient`, `config-check.ts`, `node-source.test.ts`, `validate.ts`, `core-transport.ts`, `ReadHandle`, `ref_node_fs`, `ledger-storage.test.ts`, `range.ts`, `module-tables.ts`, `core-private-source.test.ts`, `determinism-checks.ts`, `record-and-replay.test.ts`, `FinalizedLoop`, `node/client.test.ts`, `core-ledger-state.ts`, `.read`, `changes.property.test.ts`, `NodeBlockSource`, `transform-checks.ts`, `cbor.ts`, `mapping.ts`, `core-block-commit.test.ts`, `slow-block-harness.ts`, `runner/process.ts`, `.#open`, `graph.ts`, `core-settings.ts`, `BlockRef`, `table`, `checkShape`, `declaration.ts`, `binding.test.ts`, `checks.test.ts`, `version-checks.ts`, `ledger/types.ts`, `ledger/metadata.ts`, `version-table.ts`, `core-chain.ts`, `ingest-faults.test.ts`, `PrivateTransport`, `identity.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.027175856397053565 - nodes in this community are weakly interconnected._