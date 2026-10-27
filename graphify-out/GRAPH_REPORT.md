# Graph Report - UmbraDB

## Corpus Check
- 914 files · ~1,417,430 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 9846 nodes · 29109 edges · 282 communities (253 shown, 29 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 3317 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `1fd89fdc00cb3e7c` (914 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionLeaseLayer
- declaration.ts
- module-tables.ts
- ChainArchiveStore
- redact.ts
- PgChainArchiveStore
- ledger/metadata.ts
- version.negative-control.test.ts
- code-registry.ts
- tx-replay-decoder.ts
- core-config.test.ts
- PrivateTransport
- intake.test.ts
- postgres/chain-archive-store.ts
- version-table.ts
- PgTransactionHistoryStorage
- BlobIntegrityError
- digest.test.ts
- commit-proxy.ts
- BlockItems
- 3. Proof-blocking findings
- ReadHandle
- .#follow
- attempt
- HeightRun
- read-height.property.test.ts
- cursor-table.property.test.ts
- tape/index.ts
- no-indexer-or-wallet-sdk.test.ts
- chain-archive-rollover.ts
- worker-storage.test.ts
- adapter-fixtures.ts
- component-table.test.ts
- api-server.test.ts
- Connection
- records.ts
- config/history.ts
- ReadPool
- ProcessItems
- Design — v1.0.0: Formal completion (`formal-completion`)
- node-source.ts
- type-check.ts
- UmbraError
- NodeClient
- lifecycle.test.ts
- mutation-evidence.d.mts
- 00028 — `core-block-commit`'s parent check lets a block above a gap commit
- chain-placement.test.ts
- vitest
- node/client.test.ts
- exitWithin
- adapter.ts
- CliBackend
- core-ledger-state.ts
- range.test.ts
- ItemsAfterWrite
- SilentHalt
- opt-out.test.ts
- node-format.ts
- ValidationError
- builder.test.ts
- graph.ts
- NodeBlockSource
- core-block-parsed.ts
- host.ts
- ledger-storage.test.ts
- process-admin.ts
- spawnChild
- LedgerPackage
- run.test.ts
- src/index.ts
- range.ts
- column-rules.ts
- admin-harness.ts
- real-tapes.ts
- harness.ts
- transform-checks.ts
- ingest-faults.test.ts
- column-rules.test.ts
- config-check.ts
- db/migrate.ts
- cbor.ts
- sweep-tapes.ts
- determinism-checks.ts
- core-transport.ts
- pglite-writer.worker.ts
- ProcessAdmin
- .read
- checkShape
- ConnectionError
- ledger/types.ts
- boundary.test.ts
- core-settings.ts
- ws-mutual-tls.test.ts
- chain-process.test.ts
- core-private-source.test.ts
- networks.ts
- cbor.property.test.ts
- TemporalKV
- runner/process.ts
- validate.ts
- validate.test.ts
- messages.ts
- entries.ts
- transport.test.ts
- runMigrations
- private/backends.ts
- binding.test.ts
- node-bridge.ts
- version-checks.ts
- plain-data.ts
- crash.test.ts
- ledger-sweep.test.ts
- mapping.ts
- InMemoryBlockSource
- height-versioned.property.test.ts
- api-server.ts
- ref_node_timers
- FinalizedLoop
- check-required-tests.ts
- legacy-excluded.test.ts
- .#queueRunner
- ADDED Requirements
- fn
- mapping.test.ts
- repository
- version
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- pg
- fault
- twox.ts
- facade-merge-loader.ts
- call
- history.property.test.ts
- scoped-review-manifest
- Performance — design
- orphan-watcher.mjs
- fresh-instance.mjs
- .commitOutcome
- T
- code
- graph.py
- Full-Chain Storage — Design
- ADDED Requirements
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- ADDED Requirements
- ADDED Requirements
- stryker.conf.json
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Roadmap
- compilerOptions
- ROADMAP.md
- README.md
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
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
- Design — v1.0.0-infosec-signoff
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Acceptance criteria — v1.0.0-infosec-signoff
- Tasks — v1.0.0-infosec-signoff
- Repository agent policy
- Our Pledge
- Midnight infra verification checklist
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
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
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- manifest.json
- 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- TransactionHistory (kept, not built)
- transaction-history/tsconfig.json
- Acceptance criteria — v1.0.0-perf-baseline
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
- ADDED Requirements
- ADDED Requirements
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 296 edges
2. `UmbraError` - 236 edges
3. `ModuleDeclaration` - 140 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `NodeClient` - 91 edges
6. `runMigrations()` - 90 edges
7. `FinalizedLoop` - 89 edges
8. `PgCheckpointStore` - 87 edges
9. `Database` - 87 edges
10. `ValidationError` - 87 edges

## Surprising Connections (you probably didn't know these)
- `2.1 Historical implementation baseline` --references--> `PgTemporalKV`  [INFERRED]
  Formal/STORAGE_ALGEBRA_LEAN_RESEARCH.md → src/postgres/temporal-kv.ts
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`)` --references--> `CheckpointStore`  [INFERRED]
  design/full-chain-storage-design.md → src/interfaces/checkpoint-store.ts
- `6. Backup/restore guidance` --references--> `CheckpointStore`  [INFERRED]
  docs/CONTRACT.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (282 total, 29 thin omitted)

### Community 0 - "PgTransactionLeaseLayer"
Cohesion: 0.01
Nodes (250): JsonValue, PgCheckpointStore, UmbraDBSql, KvRow, PgTemporalKV, HeldLease, PgTransactionLeaseLayer, PgWatermarks (+242 more)

### Community 1 - "declaration.ts"
Cohesion: 0.02
Nodes (243): BlockHeader, DefinedModule, ItemSink, KnownPointsOnly, ModuleDeclaration, PendingKey, PointName, ProcessContext (+235 more)

### Community 10 - "module-tables.ts"
Cohesion: 0.04
Nodes (89): CaptureColumn, CapturedTable, CaptureState, CheckedMigration, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable (+81 more)

### Community 100 - "ChainArchiveStore"
Cohesion: 0.08
Nodes (13): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage (+5 more)

### Community 102 - "redact.ts"
Cohesion: 0.14
Nodes (20): RedactionForms, SecretForm, TextPattern, Needs, findings(), configRedactor(), credentialsIn(), decoded() (+12 more)

### Community 103 - "PgChainArchiveStore"
Cohesion: 0.19
Nodes (10): BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf(), sha256Hex() (+2 more)

### Community 105 - "ledger/metadata.ts"
Cohesion: 0.13
Nodes (9): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, MetadataSelector, OwnStateMetadata, contentStateOf(), hexOf() (+1 more)

### Community 107 - "version.negative-control.test.ts"
Cohesion: 0.15
Nodes (19): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, Select, checkPackageFiles(), manifestSha256(), mismatch() (+11 more)

### Community 108 - "code-registry.ts"
Cohesion: 0.14
Nodes (22): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+14 more)

### Community 109 - "tx-replay-decoder.ts"
Cohesion: 0.12
Nodes (22): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+14 more)

### Community 11 - "core-config.test.ts"
Cohesion: 0.03
Nodes (90): adminRoutes, AdminEndpoint, AdminPart, ChainView, InstanceStatus, ItemView, ModuleTableStatus, PublicStatus (+82 more)

### Community 110 - "PrivateTransport"
Cohesion: 0.14
Nodes (10): PublicSide, HelloAck, JsonValue, PrivateTransport, lost(), readFailure(), reject(), resolve() (+2 more)

### Community 112 - "intake.test.ts"
Cohesion: 0.17
Nodes (13): PrivateSeen, A114Observation, A116Observation, TestLink, a114Problems(), a114Run(), a116Problems(), follow() (+5 more)

### Community 113 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (17): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind (+9 more)

### Community 114 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 12 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (120): TransactionHistoryStorage, PgTransactionHistoryStorage, CheckpointStore, Watermarks, reason(), 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`), 9. Module → module mapping (source of truth for `tasks.md`), 2. `storage-errors.ts` — shared base (new file) (+112 more)

### Community 120 - "BlobIntegrityError"
Cohesion: 0.20
Nodes (12): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+4 more)

### Community 124 - "digest.test.ts"
Cohesion: 0.15
Nodes (17): ChangeKind, tableChanges, TouchedRow, changeOf(), concat(), sameBytes(), hex(), DIGEST_BYTES (+9 more)

### Community 125 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 127 - "BlockItems"
Cohesion: 0.18
Nodes (7): QueuedBlock, BlockItems, Fetching, Recorder, KeptItems, KeptLoop, reporting()

### Community 129 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 13 - "ReadHandle"
Cohesion: 0.03
Nodes (76): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, BlockContext (+68 more)

### Community 132 - ".#follow"
Cohesion: 0.18
Nodes (3): LoopObserver, cursorText(), isRetryable()

### Community 133 - "attempt"
Cohesion: 0.14
Nodes (15): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+7 more)

### Community 137 - "HeightRun"
Cohesion: 0.16
Nodes (6): HeightRun, SkipsAfterReconnect, Batching, SkipsStartAtRestart, CommitsDespiteLastWrite, StartsAtEveryRevision

### Community 138 - "read-height.property.test.ts"
Cohesion: 0.20
Nodes (10): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), run() (+2 more)

### Community 139 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 14 - "tape/index.ts"
Cohesion: 0.04
Nodes (97): ArgType, BlockOptions, CallSpec, PalletSpec, RUNTIME, Decoded, FetchSeen, CrashEvent (+89 more)

### Community 140 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 142 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 147 - "worker-storage.test.ts"
Cohesion: 0.21
Nodes (7): NodeStore, EngineOptions, Nodes, at(), input(), rows(), started()

### Community 15 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (97): ApplyOutput, StoredNode, LedgerHeight, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject (+89 more)

### Community 155 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 16 - "api-server.test.ts"
Cohesion: 0.03
Nodes (81): ApiRegistry, ModuleApiStart, StartedModuleApi, VersionedResponse, ChainDataAnswer, ChainDataView, ApiError, ApiErrorCode (+73 more)

### Community 169 - "Connection"
Cohesion: 0.35
Nodes (4): Connection, errorMessage(), encodeJson(), hex()

### Community 17 - "records.ts"
Cohesion: 0.04
Nodes (69): Failure, Variant, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, NotJsonError (+61 more)

### Community 18 - "config/history.ts"
Cohesion: 0.04
Nodes (94): databaseTarget, HistoryCode, HistoryContext, HistoryFinding, ProvidesRow, Span, Simulation, Start (+86 more)

### Community 189 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 19 - "node-source.ts"
Cohesion: 0.05
Nodes (71): BlockHeaderItem, BodyExtrinsic, ExtrinsicCall, BlockBody, CoreBlockHeader, CoreBlockItems, MetadataField, MetadataPallet (+63 more)

### Community 195 - "type-check.ts"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 2 - "UmbraError"
Cohesion: 0.02
Nodes (156): ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, CommittedHeight, Database, ReadOnlyDatabase, ReadOptions, DurabilityProbeOptions (+148 more)

### Community 20 - "NodeClient"
Cohesion: 0.06
Nodes (62): CoreChainBinding, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter, NodeBlock (+54 more)

### Community 21 - "lifecycle.test.ts"
Cohesion: 0.04
Nodes (87): coreEntry, versionEntry, AdminRun, Answered, gate, Observation, StatusBody, Start (+79 more)

### Community 211 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 217 - "00028 — `core-block-commit`'s parent check lets a block above a gap commit"
Cohesion: 0.40
Nodes (5): AlwaysLanded, 00028 — `core-block-commit`'s parent check lets a block above a gap commit, Evidence, Problem, Suggested fix

### Community 22 - "chain-placement.test.ts"
Cohesion: 0.06
Nodes (87): BlockSpec, EventSpec, Scenario, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase (+79 more)

### Community 23 - "vitest"
Cohesion: 0.03
Nodes (59): Finding, Lockfile, Manifest, RepositoryFile, Upstream, GuardViolation, ReportedTest, namesRunner() (+51 more)

### Community 24 - "node/client.test.ts"
Cohesion: 0.03
Nodes (47): NodeRetry, Answer, FakeNode, Handler, Received, recorded, ManualTimers, TapeCall (+39 more)

### Community 25 - "adapter.ts"
Cohesion: 0.04
Nodes (74): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+66 more)

### Community 26 - "core-ledger-state.ts"
Cohesion: 0.04
Nodes (70): BlockLedgerSource, CoreLedgerStateOptions, LedgerBinding, retainedStates, CoreRevision, GreyPicker, GreyView, SweepPhase (+62 more)

### Community 27 - "range.test.ts"
Cohesion: 0.04
Nodes (50): Connection, ConnectSocket, NodeSocket, NodeSocketEvents, Script, ScriptedNode, ScriptedRequest, syntheticChain (+42 more)

### Community 28 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (78): TableFacts, Chain, ChainOptions, DigestRow, Op, States, TableName, shadowDigits() (+70 more)

### Community 29 - "node-format.ts"
Cohesion: 0.06
Nodes (57): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+49 more)

### Community 3 - "ValidationError"
Cohesion: 0.02
Nodes (187): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryEntry (+179 more)

### Community 30 - "builder.test.ts"
Cohesion: 0.04
Nodes (43): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Frame, RawClient (+35 more)

### Community 31 - "graph.ts"
Cohesion: 0.03
Nodes (80): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeFacts, Spanned (+72 more)

### Community 32 - "NodeBlockSource"
Cohesion: 0.04
Nodes (31): HeadWait, NodeBlockSource, Prefetch, NodeCallOptions, NodeSubscription, PreparedBlock, QueueRunner, SourceCondition (+23 more)

### Community 33 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (77): BlockEventSource, BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent, EventPhase (+69 more)

### Community 34 - "host.ts"
Cohesion: 0.06
Nodes (56): LedgerStateItem, RetainedState, LedgerName, ChainOutcome, LedgerTask, ParsedTransaction, StateHandle, StateSummary (+48 more)

### Community 35 - "ledger-storage.test.ts"
Cohesion: 0.06
Nodes (73): Call, SeenLoad, retentionSeen, LedgerTx, recordedGenesis, ProcessBackend, FoundTape, Tape (+65 more)

### Community 36 - "process-admin.ts"
Cohesion: 0.06
Nodes (75): ConfigFacts, OpenedConfig, AllowedDetail, OpenedFacts, ProcessAdminOptions, RevisionSettings, AdminStarter, DigestRow (+67 more)

### Community 37 - "spawnChild"
Cohesion: 0.03
Nodes (67): SignalTarget, ParentJob, Kill, Orphaned, SourceFile, Run, Job, WorkerEvent (+59 more)

### Community 38 - "LedgerPackage"
Cohesion: 0.05
Nodes (37): LedgerEventKind, LedgerPackage, LedgerEngine, hexOf(), idOf(), same(), sameBytes(), run() (+29 more)

### Community 39 - "run.test.ts"
Cohesion: 0.05
Nodes (54): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, RunSeams, cliProject, CommandResult (+46 more)

### Community 4 - "src/index.ts"
Cohesion: 0.03
Nodes (180): TransactionHistoryReader, TransactionHistoryWriter, CheckpointSequence, CheckpointStoreErrorCode, CheckpointSummary, ContentHash, HistoryOptions, PruneResult (+172 more)

### Community 41 - "range.ts"
Cohesion: 0.05
Nodes (62): NodeClientOptions, IngestOptions, BoundaryBlockReading, BoundaryOptions, BoundaryReading, Arguments, Command, TapeCommandIo (+54 more)

### Community 42 - "column-rules.ts"
Cohesion: 0.04
Nodes (68): CatalogColumn, CatalogOptions, AllowedRule, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference (+60 more)

### Community 43 - "admin-harness.ts"
Cohesion: 0.06
Nodes (47): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer, AdminSnapshot (+39 more)

### Community 44 - "real-tapes.ts"
Cohesion: 0.05
Nodes (48): Metadata, Step, FindTapeOptions, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup (+40 more)

### Community 45 - "harness.ts"
Cohesion: 0.09
Nodes (47): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+39 more)

### Community 46 - "transform-checks.ts"
Cohesion: 0.09
Nodes (39): TransformError, SubscriptionId, CallSelection, NotificationRange, baseRecords(), expectedText(), expectNotificationsAfterInsertedDisconnect(), expectResubscriptionOnTape() (+31 more)

### Community 47 - "ingest-faults.test.ts"
Cohesion: 0.05
Nodes (49): ProcessCondition, A84Observation, LoggedRetry, OutageObservation, RetrySample, a84Run(), a84Tape(), discarded() (+41 more)

### Community 48 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (31): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+23 more)

### Community 49 - "config-check.ts"
Cohesion: 0.06
Nodes (43): CheckFinding, ConfigCheckSeams, StepName, StepReport, StepStatus, DatabaseState, Refused, RunOptions (+35 more)

### Community 5 - "db/migrate.ts"
Cohesion: 0.02
Nodes (149): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner (+141 more)

### Community 50 - "cbor.ts"
Cohesion: 0.08
Nodes (42): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+34 more)

### Community 51 - "sweep-tapes.ts"
Cohesion: 0.08
Nodes (45): ingest, TableSnapshot, FixtureNode, FakeState, coreLedgerState(), itemsWatcher(), run(), run() (+37 more)

### Community 52 - "determinism-checks.ts"
Cohesion: 0.08
Nodes (41): PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A155Observation, Outcome, a113Run() (+33 more)

### Community 54 - "core-transport.ts"
Cohesion: 0.06
Nodes (38): PublicSideOptions, CoreTransportOptions, InstanceView, Session, TransportLimits, Api, Hello, Read (+30 more)

### Community 55 - "pglite-writer.worker.ts"
Cohesion: 0.07
Nodes (37): Held, PgliteLockUse, WriterProcess, Job, WorkerEvent, acquirePgliteLock(), lockHeld(), openFailed() (+29 more)

### Community 56 - "ProcessAdmin"
Cohesion: 0.09
Nodes (10): ProcessAdmin, CoreTransport, Heartbeat, Process, recordedHistory(), writerLockHeld(), messageOf(), pause() (+2 more)

### Community 57 - ".read"
Cohesion: 0.07
Nodes (37): Settings, Outcome, identityRow(), captured(), captureFunction(), triggerEnabled(), state(), migrationRows() (+29 more)

### Community 58 - "checkShape"
Cohesion: 0.07
Nodes (35): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), insert() (+27 more)

### Community 6 - "ConnectionError"
Cohesion: 0.02
Nodes (168): CheckpointNotFoundError, CheckpointRecord, CheckpointStoreError, ChunkIntegrityError, ChunkMissingError, ManifestCorruptError, ConnectionError, HistoryUnavailableError (+160 more)

### Community 61 - "ledger/types.ts"
Cohesion: 0.09
Nodes (30): LoadLedger, ApplyInput, LedgerPackageOptions, AdapterWorkerRequest, SlowStep, TestLoaderData, loadLedgerPackage(), createV8Adapter() (+22 more)

### Community 62 - "boundary.test.ts"
Cohesion: 0.11
Nodes (35): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+27 more)

### Community 63 - "core-settings.ts"
Cohesion: 0.06
Nodes (36): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+28 more)

### Community 64 - "ws-mutual-tls.test.ts"
Cohesion: 0.06
Nodes (30): Attempt, gateAdapters(), tallyMutants(), server(), locked(), connect(), file(), makeCa() (+22 more)

### Community 65 - "chain-process.test.ts"
Cohesion: 0.09
Nodes (28): ProcessHandle, WorkerEvent, A77Observation, A78Observation, A78Refusal, A90Observation, Failing, Flaky (+20 more)

### Community 66 - "core-private-source.test.ts"
Cohesion: 0.06
Nodes (12): Closable, PrivateBlockSource, PrivateIntakeOptions, PublicDatabase, PublicWakes, PrivateOptions, fakePublic(), fakeRead() (+4 more)

### Community 67 - "networks.ts"
Cohesion: 0.07
Nodes (36): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+28 more)

### Community 68 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (36): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+28 more)

### Community 69 - "TemporalKV"
Cohesion: 0.06
Nodes (32): TemporalKV, migrations(), 1.2 Async pattern, 1.3 Transaction participation, 1.5 Naming, 1. Shared Conventions, 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), 0. Schema naming, now that UmbraDB is standalone (+24 more)

### Community 7 - "runner/process.ts"
Cohesion: 0.02
Nodes (129): Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait, WaitingListener (+121 more)

### Community 71 - "validate.ts"
Cohesion: 0.10
Nodes (36): CursorRule, Finding, Issue, Plain, SettingsSchema, coreSettingsSchema(), closest(), configFindings() (+28 more)

### Community 72 - "validate.test.ts"
Cohesion: 0.07
Nodes (31): ConfigRule, EntryRef, CursorRow, Expected, declarations(), input(), refusal(), rowInput() (+23 more)

### Community 74 - "messages.ts"
Cohesion: 0.07
Nodes (30): ApiResult, Committed, MessageFault, MessageType, Parsed, bytesOf(), decodeParameter(), decodeValue() (+22 more)

### Community 77 - "entries.ts"
Cohesion: 0.06
Nodes (32): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig (+24 more)

### Community 78 - "transport.test.ts"
Cohesion: 0.10
Nodes (23): Message, Pem, TestCertificates, Ended, rawClient, mutualTlsOptions(), hexOf(), messageText() (+15 more)

### Community 8 - "runMigrations"
Cohesion: 0.02
Nodes (124): DurabilityContractError, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, TransactionPoolerDetectedError, Migration, MigrationLockTimeoutError, Started (+116 more)

### Community 80 - "private/backends.ts"
Cohesion: 0.10
Nodes (18): PrivateBackend, SessionSeen, A112Observation, Wiring, TransportProxy, pgliteBackend(), a146HashProblems(), a146RefusalProblems() (+10 more)

### Community 82 - "binding.test.ts"
Cohesion: 0.10
Nodes (28): TestDatabase, A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), readPrivateCursor() (+20 more)

### Community 83 - "node-bridge.ts"
Cohesion: 0.11
Nodes (19): ChildReader, BridgeServer, bridgeStore, Growable, childRefKeys(), readChildren(), decodeNodes(), encodedSize() (+11 more)

### Community 84 - "version-checks.ts"
Cohesion: 0.16
Nodes (26): LedgerTable, CountingNode, Walk, Answers, toHex(), H(), withCore(), blockWith() (+18 more)

### Community 86 - "plain-data.ts"
Cohesion: 0.10
Nodes (22): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+14 more)

### Community 87 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, LateRedelivery, WORKER, CrashJob, CrashWorkerEvent (+15 more)

### Community 88 - "ledger-sweep.test.ts"
Cohesion: 0.14
Nodes (15): SweepState, SweepWrites, NodeBatch, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel (+7 more)

### Community 89 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 9 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (102): BlockItemSource, HistoryOptions, BlockRef, BlockSource, FinalityStallCondition, InMemoryBlockSource, InMemoryItems, InMemorySourceOptions (+94 more)

### Community 93 - "height-versioned.property.test.ts"
Cohesion: 0.13
Nodes (20): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Key, Model (+12 more)

### Community 94 - "api-server.ts"
Cohesion: 0.10
Nodes (23): HeadersArgument, ModuleApiServer, ModuleApiServerOptions, answerHead(), isVersionHeader(), listenModuleApi(), readBody(), refuseUpgrade() (+15 more)

### Community 96 - "ref_node_timers"
Cohesion: 0.11
Nodes (20): Job, WorkEvent, WorkOptions, A48Observation, WORKER, Job, WorkerEvent, report() (+12 more)

### Community 97 - "FinalizedLoop"
Cohesion: 0.11
Nodes (12): EntryBoundary, PointSchedule, FinalizedLoop, Startup, WaitingInRead, EagerLoop, FailingAfter, AlwaysLost (+4 more)

### Community 98 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 99 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): listen(), ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+18 more)

### Community 106 - "fn"
Cohesion: 0.11
Nodes (24): fn(), ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1), Requirement: Transactions commit or roll back atomically (+16 more)

### Community 111 - "mapping.test.ts"
Cohesion: 0.11
Nodes (11): mapValue(), parseJsonLossless(), oid(), identity(), RESULT_COLUMNS, RESULT_TYPES, RFC-3339, 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug (+3 more)

### Community 115 - "repository"
Cohesion: 0.11
Nodes (17): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1** (+9 more)

### Community 121 - "version"
Cohesion: 0.11
Nodes (18): version(), Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-7 The history row and its hash, Scenario: A misspelled setting is a type error, Scenario: The same entry gives the same hash, 3. The freeze: build + package.json (G1), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Scenario: The kv_current HOT ratio is measured and recorded under the soak workload (+10 more)

### Community 126 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (16): 10. Ingest, 11. Chain data, 13. Contract data, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API, 3. Modules (+8 more)

### Community 141 - "pg"
Cohesion: 0.15
Nodes (12): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 2. Node-side query correlation (+4 more)

### Community 143 - "fault"
Cohesion: 0.14
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 148 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 159 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 163 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 171 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 210 - "Performance — design"
Cohesion: 0.29
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 229 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 246 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 40 - "T"
Cohesion: 0.03
Nodes (72): T(), 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored (+64 more)

### Community 53 - "code"
Cohesion: 0.04
Nodes (47): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog, Benchmarks, Compatibility, and what 1.0.0 needs (+39 more)

### Community 73 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 75 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0, Requirement: the baseline reflects the batched (shipped) save shape (+17 more)

### Community 116 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.10
Nodes (20): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+12 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 118 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 119 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.11
Nodes (12): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort (+4 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 123 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 128 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 131 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 134 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+8 more)

### Community 135 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 136 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 144 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 145 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 146 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 149 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 150 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 152 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 153 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 156 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 157 - "ROADMAP.md"
Cohesion: 0.17
Nodes (5): For historical reference only, Tasks — superseded by per-sprint openspec changes, UmbraDB v1.0.0 — Release Record (PENDING), What 1.0.0 additionally requires, What must happen before this record can be completed

### Community 158 - "README.md"
Cohesion: 0.30
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 160 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 161 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 164 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 165 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 166 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 167 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover), 7. What this change deliberately does not verify (traceability of the non-goals) (+2 more)

### Community 168 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 170 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 172 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 173 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.20
Nodes (10): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+2 more)

### Community 174 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 175 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 176 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 177 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 178 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 179 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 180 - "UmbraDB"
Cohesion: 0.20
Nodes (10): Contents, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB, Verification: what is proved, checked, and tested (+2 more)

### Community 184 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 185 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.22
Nodes (9): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 8. Test infrastructure (open decision — resolve in Task 1) (+1 more)

### Community 186 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 187 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 188 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 190 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 191 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution, Design — v1.0.0-infosec-signoff

### Community 192 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 193 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 194 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 196 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 197 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 198 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 199 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 200 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 201 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 202 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 203 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 204 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 205 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

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

### Community 212 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 213 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 214 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 215 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 216 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 218 - "5. Recommended candidate model"
Cohesion: 0.33
Nodes (6): 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

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

### Community 237 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 238 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

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

### Community 247 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 248 - "00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor"
Cohesion: 0.50
Nodes (3): 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor, Evidence, Suggested fix

### Community 249 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 250 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 251 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 252 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 253 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 254 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 255 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 256 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 257 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 261 - "9. Backups and browser"
Cohesion: 0.67
Nodes (3): 9.1 Backups (BK; Q83, Q85), 9.2 Browser build (BR), 9. Backups and browser

### Community 59 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 60 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 70 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): 0. Package layout, 3.1 Connection defaults, 3.2 Bounded migration advisory-lock acquire, 3. G7 — Server-side timeouts, 5.1 Archival reconciliation note (Opus N6), 5. Boundaries and non-goals respected, 6.1 The Fable-vs-Opus factual dispute (resolved by live test), 6.2 Blocking findings applied (+25 more)

### Community 81 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 92 - "package.json"
Cohesion: 0.07
Nodes (28): bin, umbradb, bugs, url, description, engines, node, exports (+20 more)

### Community 95 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form, Requirement: G9/T3 — a killed lease-holder does not wedge the lease, Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data (+20 more)

## Knowledge Gaps
- **51 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3338 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionLeaseLayer`, `declaration.ts`, `UmbraError`, `ValidationError`, `src/index.ts`, `db/migrate.ts`, `ConnectionError`, `runner/process.ts`, `runMigrations`, `InMemoryBlockSource`, `module-tables.ts`, `core-config.test.ts`, `ReadHandle`, `tape/index.ts`, `adapter-fixtures.ts`, `api-server.test.ts`, `records.ts`, `config/history.ts`, `node-source.ts`, `NodeClient`, `lifecycle.test.ts`, `chain-placement.test.ts`, `node/client.test.ts`, `adapter.ts`, `core-ledger-state.ts`, `range.test.ts`, `opt-out.test.ts`, `node-format.ts`, `builder.test.ts`, `graph.ts`, `NodeBlockSource`, `core-block-parsed.ts`, `host.ts`, `ledger-storage.test.ts`, `process-admin.ts`, `spawnChild`, `run.test.ts`, `admin-harness.ts`, `real-tapes.ts`, `transform-checks.ts`, `ingest-faults.test.ts`, `column-rules.test.ts`, `config-check.ts`, `sweep-tapes.ts`, `determinism-checks.ts`, `core-transport.ts`, `pglite-writer.worker.ts`, `.read`, `ledger/types.ts`, `boundary.test.ts`, `core-settings.ts`, `ws-mutual-tls.test.ts`, `chain-process.test.ts`, `core-private-source.test.ts`, `networks.ts`, `cbor.property.test.ts`, `validate.test.ts`, `messages.ts`, `entries.ts`, `transport.test.ts`, `private/backends.ts`, `binding.test.ts`, `node-bridge.ts`, `version-checks.ts`, `plain-data.ts`, `crash.test.ts`, `ledger-sweep.test.ts`, `package.json`, `height-versioned.property.test.ts`, `ref_node_timers`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `redact.ts`, `version.negative-control.test.ts`, `code-registry.ts`, `mapping.test.ts`, `intake.test.ts`, `repository`, `BlobIntegrityError`, `digest.test.ts`, `read-height.property.test.ts`, `cursor-table.property.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `worker-storage.test.ts`, `twox.ts`, `excluded-not-exported.test.ts`, `component-table.test.ts`, `facade-merge-loader.ts`, `history.property.test.ts`?**
  _High betweenness centrality (0.306) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionLeaseLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.013256544870331677 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `declaration.ts`, `db/migrate.ts`, `runner/process.ts`, `InMemoryBlockSource`, `module-tables.ts`, `core-config.test.ts`, `ReadHandle`, `tape/index.ts`, `api-server.test.ts`, `records.ts`, `config/history.ts`, `node-source.ts`, `NodeClient`, `lifecycle.test.ts`, `node/client.test.ts`, `core-ledger-state.ts`, `opt-out.test.ts`, `graph.ts`, `NodeBlockSource`, `host.ts`, `process-admin.ts`, `range.ts`, `transform-checks.ts`, `ingest-faults.test.ts`, `config-check.ts`, `cbor.ts`, `determinism-checks.ts`, `core-transport.ts`, `pglite-writer.worker.ts`, `.#queueRunner`, `.read`, `checkShape`, `ProcessAdmin`, `chain-process.test.ts`, `core-private-source.test.ts`, `validate.ts`, `validate.test.ts`, `binding.test.ts`, `version-checks.ts`, `plain-data.ts`, `mapping.ts`, `ledger/metadata.ts`, `version.negative-control.test.ts`, `PrivateTransport`, `mapping.test.ts`, `version-table.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `declaration.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.016809993327896806 - nodes in this community are weakly interconnected._