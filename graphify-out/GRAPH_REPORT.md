# Graph Report - UmbraDB

## Corpus Check
- 903 files · ~1,394,049 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 9673 nodes · 28500 edges · 279 communities (256 shown, 23 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 3268 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `550afe344240aef3` (903 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- src/index.ts
- db/migrate.ts
- cursor-durability.crash.test.ts
- ledger-checks.ts
- code-registry.ts
- block-fetch-decode.test.ts
- sigterm.worker.ts
- tx-replay-decoder.ts
- PrivateTransport
- 12. Exported surface and command (LS-1, LS-6)
- TransactionHandle
- postgres/chain-archive-store.ts
- .value
- opt-out.test.ts
- commit-proxy.ts
- core-block-fetch/metadata.ts
- height-versioned.property.test.ts
- crash.worker.ts
- 3. Proof-blocking findings
- version-table.ts
- config/history.ts
- no-indexer-or-wallet-sdk.test.ts
- attempt
- ws-mutual-tls.test.ts
- checkShape
- readRuntimeMetadata
- fetch-fixtures.ts
- adapter-worker-host.ts
- source-scan.ts
- BlobIntegrityError
- midnight-env — reproducible PREPROD dev environment
- column-rules.ts
- component-table.test.ts
- postgres/transaction-history-storage.ts
- scale-value.ts
- declaration.ts
- holds
- tape/index.ts
- ProcessItems
- Design — v1.0.0: Formal completion (`formal-completion`)
- NodeClient
- type-check.ts
- ledger-test-loader.ts
- PgTransactionHistoryStorage
- host.ts
- adapter-fixtures.ts
- ReadPool
- mutation-evidence.d.mts
- readiness.test.ts
- writer-lock-checks.ts
- process-context.test.ts
- EventsRunner
- adapter.ts
- runner/process.ts
- ledger-state.test.ts
- admin-harness.ts
- builder.test.ts
- vitest
- range.test.ts
- transform-checks.ts
- process-admin.ts
- node/client.test.ts
- node-format.ts
- core-transport.ts
- loop.test.ts
- cbor.ts
- ref_node_fs
- LedgerPackage
- PgTransactionLeaseLayer
- FinalizedLoop
- spawnChild
- changes.property.test.ts
- api-server.test.ts
- build.ts
- height-versioned.test.ts
- validate.test.ts
- ValidationError
- module-api.ts
- core-private-source.test.ts
- InMemoryBlockSource
- core-block-commit.test.ts
- core-chain.test.ts
- ModuleDeclaration
- harness.ts
- core-ledger-state.ts
- ledger-storage.test.ts
- version-checks.ts
- PointName
- validate.ts
- intake.test.ts
- interfaces/temporal-kv.ts
- NodeBlockSource
- plain-data.ts
- graph.ts
- range.ts
- real-tapes.ts
- networks.ts
- loop.ts
- UmbraError
- core-settings.ts
- checks.test.ts
- order.property.test.ts
- postgres/transaction-lease.ts
- crash-worker.ts
- validation.ts
- core-block-parsed.ts
- node-source.ts
- BlockRef
- private/backends.ts
- module-api.test.ts
- mapping.ts
- binding.test.ts
- runMigrations
- check-required-tests.ts
- legacy-excluded.test.ts
- ChainArchiveStore
- PgChainArchiveStore
- transport.test.ts
- Design — Postgres+JSONB storage rebuild
- boundary.test.ts
- halted
- version
- repository
- .boolean
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- mutation-per-adapter.mjs
- twox.ts
- facade-merge-loader.ts
- history.property.test.ts
- Performance — design
- orphan-watcher.mjs
- fresh-instance.mjs
- ADDED Requirements
- graph.py
- ADDED Requirements
- Full-Chain Storage — Design
- fn
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- stryker.conf.json
- ADDED Requirements
- scripts
- Algebraic Specification of the midnight-pg-store Storage Layer
- UmbraDB module guide
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- devDependencies
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Roadmap
- compilerOptions
- ROADMAP.md
- README.md
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- UmbraDB
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Design — v1.0.0-infosec-signoff
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Tasks — v1.0.0-infosec-signoff
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
- 00019 — `evictKeys` does not refuse the root node of a live ledger state
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data
- manifest.json
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
- Requirement: set is an idempotent, unconditional overwrite (Law W1)
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
- package.json
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 290 edges
2. `UmbraError` - 232 edges
3. `ModuleDeclaration` - 136 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `NodeClient` - 91 edges
6. `runMigrations()` - 90 edges
7. `FinalizedLoop` - 89 edges
8. `Database` - 87 edges
9. `PgCheckpointStore` - 87 edges
10. `ValidationError` - 87 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: load before any save rejects with CheckpointNotFoundError` --references--> `CheckpointNotFoundError`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/specs/wallet-state-envelope/spec.md → src/interfaces/checkpoint-store.ts
- `Scenario: save on a caller transaction behaves identically to the internal-transaction path for a reader` --references--> `CheckpointSummary`  [INFERRED]
  openspec/changes/v1.0.0-durable-checkpoint-cursor/specs/durable-composition/spec.md → src/interfaces/checkpoint-store.ts
- `Scenario: A history page issues two queries regardless of page size` --references--> `CheckpointSummary`  [INFERRED]
  openspec/changes/v1.0.0-perf-baseline/specs/performance-baseline/spec.md → src/interfaces/checkpoint-store.ts
- `The honest-test pattern (what makes each required test non-vacuous)` --references--> `ChunkMissingError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/checkpoint-store.ts
- `Scenario: A chunk shared across wallets survives one wallet's prune` --references--> `ChunkMissingError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (279 total, 23 thin omitted)

### Community 0 - "src/index.ts"
Cohesion: 0.02
Nodes (192): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError, ChunkMissingError (+184 more)

### Community 1 - "db/migrate.ts"
Cohesion: 0.03
Nodes (146): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner (+138 more)

### Community 10 - "cursor-durability.crash.test.ts"
Cohesion: 0.03
Nodes (121): JsonValue, KvRow, BatchSpec, CurrentState, InvariantResult, C5AnyFn, CurrentState, CurrentState (+113 more)

### Community 100 - "ledger-checks.ts"
Cohesion: 0.19
Nodes (16): ChildReader, childRefKeys(), readChildren(), a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows() (+8 more)

### Community 101 - "code-registry.ts"
Cohesion: 0.14
Nodes (22): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+14 more)

### Community 103 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 105 - "sigterm.worker.ts"
Cohesion: 0.12
Nodes (18): Job, WorkerEvent, WORKER, WorkEvent, WorkOptions, WORKER, Job, WorkerEvent (+10 more)

### Community 106 - "tx-replay-decoder.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+12 more)

### Community 108 - "PrivateTransport"
Cohesion: 0.17
Nodes (8): PublicSide, HelloAck, PrivateTransport, messageText(), lost(), reject(), resolve(), client()

### Community 109 - "12. Exported surface and command (LS-1, LS-6)"
Cohesion: 0.10
Nodes (19): UmbraConfig, OwnPart, FieldKind, FieldSchema, Lifetime, 12. Exported surface and command (LS-1, LS-6), 15. Relation to the existing design documents, 1. Source layout (+11 more)

### Community 11 - "TransactionHandle"
Cohesion: 0.02
Nodes (114): TransactionHistoryReader, TransactionHistoryWriter, SaveCheckpointOptions, TransactionHandle, TransactionHandleInvalidError, TransactionLeaseLayer, Watermarks, AggregateRow (+106 more)

### Community 112 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (16): BlobRole, BlockBundle, BlockMeta, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult (+8 more)

### Community 116 - ".value"
Cohesion: 0.30
Nodes (5): ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read()

### Community 12 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (90): CaptureColumn, CapturedTable, CaptureState, CanonicalEncodingError, ChangeKind, tableChanges, TouchedRow, ModuleColumn (+82 more)

### Community 120 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 122 - "core-block-fetch/metadata.ts"
Cohesion: 0.14
Nodes (14): BodyExtrinsic, ExtrinsicCall, MetadataPallet, MetadataStorage, MetadataStorageEntry, blockTimeOf(), callOf(), callVariants() (+6 more)

### Community 124 - "height-versioned.property.test.ts"
Cohesion: 0.12
Nodes (16): Block, BlockFails, Counts, Effect, Key, Op, canonicalText(), readBack() (+8 more)

### Community 125 - "crash.worker.ts"
Cohesion: 0.14
Nodes (14): CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent, crashModule() (+6 more)

### Community 126 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 129 - "version-table.ts"
Cohesion: 0.25
Nodes (16): LedgerPin, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin(), freezeRow(), hexOf() (+8 more)

### Community 13 - "config/history.ts"
Cohesion: 0.04
Nodes (118): CoreSettings, versionEntry, HistoryCode, HistoryOptions, HistoryRule, Span, AppliedMigration, Simulation (+110 more)

### Community 130 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.19
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 133 - "attempt"
Cohesion: 0.14
Nodes (15): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+7 more)

### Community 134 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 137 - "checkShape"
Cohesion: 0.30
Nodes (8): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), 14. External claims and their evidence

### Community 139 - "readRuntimeMetadata"
Cohesion: 0.43
Nodes (9): TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry(), storageEntry(), strings() (+1 more)

### Community 14 - "fetch-fixtures.ts"
Cohesion: 0.04
Nodes (100): NodeCallOptions, ProcessCondition, RecordingClient, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME (+92 more)

### Community 144 - "adapter-worker-host.ts"
Cohesion: 0.20
Nodes (12): ApplyInput, ApplyOutput, ParsedTransaction, Kept, LedgerHeight, AdapterWorkerAnswer, AdapterWorkerRequest, Replayed (+4 more)

### Community 145 - "source-scan.ts"
Cohesion: 0.29
Nodes (13): ModuleReference, boundaryViolations(), codeFingerprints(), declaredNames(), eachNode(), lineOf(), literalText(), moduleReferences() (+5 more)

### Community 147 - "BlobIntegrityError"
Cohesion: 0.29
Nodes (10): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation), Requirement: The chain-archive error classes are excluded from the frozen surface, Scenario: Chain-archive classes are not exported and their codes are not frozen (+2 more)

### Community 149 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 15 - "column-rules.ts"
Cohesion: 0.02
Nodes (105): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+97 more)

### Community 155 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 16 - "postgres/transaction-history-storage.ts"
Cohesion: 0.03
Nodes (101): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryStatus (+93 more)

### Community 164 - "scale-value.ts"
Cohesion: 0.18
Nodes (10): MetadataField, MetadataType, Primitive, canonicalJson(), hexOf(), littleEndian(), BIT_STORES, INTEGERS (+2 more)

### Community 17 - "declaration.ts"
Cohesion: 0.03
Nodes (74): AdminStartOptions, BlockItemSource, AdmittedKey, coreEntry, DefinedModule, KnownPointsOnly, TableDeclaration, Validator (+66 more)

### Community 170 - "holds"
Cohesion: 0.47
Nodes (4): VersionedValue, StoredVersion, Model, holds()

### Community 18 - "tape/index.ts"
Cohesion: 0.05
Nodes (71): Link, TapeBuilderOptions, CompletenessRange, RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId (+63 more)

### Community 189 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 19 - "NodeClient"
Cohesion: 0.05
Nodes (64): CoreChainBinding, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription (+56 more)

### Community 194 - "type-check.ts"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 195 - "ledger-test-loader.ts"
Cohesion: 0.25
Nodes (8): SlowStep, TestLoaderData, countDeserializations(), loadLedger(), probe(), deserialized, hold, wrapped

### Community 2 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (149): TransactionHistoryEntry, TransactionHistoryStorage, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, CheckpointStore, EnvelopeCorruptError, WalletStateEnvelope, PgWalletStateEnvelopeStore (+141 more)

### Community 20 - "host.ts"
Cohesion: 0.04
Nodes (75): LedgerStateItem, ChainOutcome, LedgerTask, NodeStore, StateSummary, StoredNode, AppliedState, ApplyBlock (+67 more)

### Community 21 - "adapter-fixtures.ts"
Cohesion: 0.06
Nodes (88): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState (+80 more)

### Community 214 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 22 - "readiness.test.ts"
Cohesion: 0.04
Nodes (78): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminAnswer, AdminEndpoint (+70 more)

### Community 23 - "writer-lock-checks.ts"
Cohesion: 0.04
Nodes (73): Held, PgliteLockUse, PostgresOptions, CheckTarget, CliBackend, Snapshot, WriterProcess, Job (+65 more)

### Community 24 - "process-context.test.ts"
Cohesion: 0.04
Nodes (86): Bound, ItemDeclaration, Revision, EntryRange, GraphInput, ResolvedGraph, StartedModuleApi, MisuseListener (+78 more)

### Community 25 - "adapter.ts"
Cohesion: 0.04
Nodes (78): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+70 more)

### Community 26 - "runner/process.ts"
Cohesion: 0.04
Nodes (54): ConfigFacts, ProcessAdmin, ChainCheck, ChainCheckInput, CoreVersion, HistoryCheck, HistoryContext, CheckedEntry (+46 more)

### Community 27 - "ledger-state.test.ts"
Cohesion: 0.05
Nodes (94): BlockParsed, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec, eventsRuntime (+86 more)

### Community 28 - "admin-harness.ts"
Cohesion: 0.05
Nodes (86): AdminRun, AdminRunOptions, Answered, Answerer, Expected, gate, Hold, Observation (+78 more)

### Community 29 - "builder.test.ts"
Cohesion: 0.04
Nodes (43): ManualTimers, ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, Frame (+35 more)

### Community 3 - "vitest"
Cohesion: 0.02
Nodes (111): CommittedHeight, Database, Committed, Settings, TestBackend, TestDatabase, Case, LoadOutcome (+103 more)

### Community 30 - "range.test.ts"
Cohesion: 0.03
Nodes (59): ConnectSocket, Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault (+51 more)

### Community 31 - "transform-checks.ts"
Cohesion: 0.05
Nodes (61): Metadata, Step, Failure, Variant, TapeError, TransformError, CallRecord, NotifyRecord (+53 more)

### Community 32 - "process-admin.ts"
Cohesion: 0.05
Nodes (77): AllowedDetail, ProcessAdminOptions, RevisionSettings, AdminStarter, DigestRow, ModuleFacts, PartTable, SnapshotFacts (+69 more)

### Community 33 - "node/client.test.ts"
Cohesion: 0.03
Nodes (50): NodeClientOptions, IngestOptions, Answer, FakeNode, Handler, Received, recorded, TapeCommandIo (+42 more)

### Community 34 - "node-format.ts"
Cohesion: 0.06
Nodes (57): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+49 more)

### Community 35 - "core-transport.ts"
Cohesion: 0.04
Nodes (68): CoreTransportOptions, InstanceView, Session, TransportLimits, TransportTls, Api, ApiResult, Committed (+60 more)

### Community 36 - "loop.test.ts"
Cohesion: 0.05
Nodes (63): CommitOutcome, HeldHeight, Contexts, Faults, LostCommit, Outcomes, Seen, LoopClass (+55 more)

### Community 37 - "cbor.ts"
Cohesion: 0.04
Nodes (73): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+65 more)

### Community 38 - "ref_node_fs"
Cohesion: 0.04
Nodes (54): Finding, RepositoryFile, Upstream, GuardViolation, Pem, ReportedTest, namesRunner(), runnerStarts() (+46 more)

### Community 39 - "LedgerPackage"
Cohesion: 0.06
Nodes (37): RetainedState, LedgerName, LedgerEventKind, LedgerPackage, StateHandle, Held, LedgerEngine, LoaderModule (+29 more)

### Community 4 - "PgTransactionLeaseLayer"
Cohesion: 0.02
Nodes (114): PgCheckpointStore, UmbraDBSql, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters, GcPass (+106 more)

### Community 40 - "FinalizedLoop"
Cohesion: 0.05
Nodes (22): EntryBoundary, FinalizedLoop, HeightRun, LoopObserver, UnexpectedCursor, Startup, SkipsAfterReconnect, Batching (+14 more)

### Community 41 - "spawnChild"
Cohesion: 0.04
Nodes (58): SignalTarget, ParentJob, Kill, Orphaned, SourceFile, Started, FailsOnceStarted, SlowToReportPorts (+50 more)

### Community 42 - "changes.property.test.ts"
Cohesion: 0.04
Nodes (68): DigestRow, Op, States, TableName, captureDefinitions(), captureFunctionName(), captureTables(), shadowDigits() (+60 more)

### Community 43 - "api-server.test.ts"
Cohesion: 0.04
Nodes (40): ReadHandle, ApiRegistry, PointCallbacks, ModuleApiServer, ChainDataAnswer, ApiRoutes, HttpHandler, HttpRoute (+32 more)

### Community 44 - "build.ts"
Cohesion: 0.06
Nodes (55): CommandHandler, CommandIo, MainProcess, CheckStep, ConfigCheckReport, CoreLedgerVersion, LedgerPackageIdentity, cliProject (+47 more)

### Community 45 - "height-versioned.test.ts"
Cohesion: 0.05
Nodes (49): BlockWriteHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, Migration, BlockOptions (+41 more)

### Community 46 - "validate.test.ts"
Cohesion: 0.04
Nodes (63): CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+55 more)

### Community 47 - "ValidationError"
Cohesion: 0.04
Nodes (65): ValidationError, exceedsMaxDepth(), EntrySectionsSchema, LL-002 — A7 watermark-participation negative control did not fire; survived fix-round-1, caught by round-2 cold cross-vendor Codex, 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator (+57 more)

### Community 48 - "module-api.ts"
Cohesion: 0.05
Nodes (51): Connection, HeadersArgument, ModuleApiServerOptions, ModuleApiStart, VersionedResponse, ApiError, ApiErrorCode, ApiResponse (+43 more)

### Community 49 - "core-private-source.test.ts"
Cohesion: 0.06
Nodes (34): Closable, PrivateBlockSource, privateIntake, PrivateIntakeOptions, PublicDatabase, PublicIdentity, PublicSideOptions, PublicWakes (+26 more)

### Community 5 - "InMemoryBlockSource"
Cohesion: 0.03
Nodes (118): InMemoryBlockSource, LoopInput, ProcessHandle, ProcessingEnd, ProcessStatus, Flaky, A43Observation, Outcome (+110 more)

### Community 50 - "core-block-commit.test.ts"
Cohesion: 0.05
Nodes (45): BlockHeaderItem, CoreBlockHeader, BlockContext, BlockSource, FinalityStallCondition, InMemoryItems, Wait, StandInOptions (+37 more)

### Community 51 - "core-chain.test.ts"
Cohesion: 0.05
Nodes (33): ChainIdentity, ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, ProcessContexts, WaitingCondition, ChainStarted (+25 more)

### Community 52 - "ModuleDeclaration"
Cohesion: 0.06
Nodes (53): OpenedConfig, OpenedFacts, CoreChainFacts, CheckFinding, CheckState, ConfigCheckOptions, ConfigCheckSeams, StepName (+45 more)

### Community 53 - "harness.ts"
Cohesion: 0.09
Nodes (47): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+39 more)

### Community 54 - "core-ledger-state.ts"
Cohesion: 0.06
Nodes (45): CoreLedgerStateOptions, retainedStates, CoreRevision, boundLedgerParser(), applyBlock(), boundLedger(), bytesOf(), contractsOf() (+37 more)

### Community 55 - "ledger-storage.test.ts"
Cohesion: 0.07
Nodes (45): BlockHeader, CrashEvent, CrashJob, ingest, SourceClass, watched, RestartEvent, RestartJob (+37 more)

### Community 56 - "version-checks.ts"
Cohesion: 0.09
Nodes (44): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerSelection, VersionedBlock, CountingNode, Select, Walk (+36 more)

### Community 57 - "PointName"
Cohesion: 0.05
Nodes (36): QueuedBlock, ItemSink, PendingKey, PointName, ProcessContext, BlockItems, LateUse, PointArguments (+28 more)

### Community 58 - "validate.ts"
Cohesion: 0.07
Nodes (50): HistoryFinding, CursorRule, Finding, Issue, Plain, SettingsSchema, earlyFindings(), coreSettingsSchema() (+42 more)

### Community 59 - "intake.test.ts"
Cohesion: 0.09
Nodes (40): PrivateProcess, PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, A114Observation (+32 more)

### Community 6 - "interfaces/temporal-kv.ts"
Cohesion: 0.02
Nodes (135): AsOf, AssertExact, Key, Namespace, Scope, TemporalKV, Version, VersionedEntry (+127 more)

### Community 60 - "NodeBlockSource"
Cohesion: 0.09
Nodes (14): HeadWait, NodeBlockSource, Prefetch, NodeSubscription, PreparedBlock, QueueRunner, NoWindow, OwnStateMetadata (+6 more)

### Community 61 - "plain-data.ts"
Cohesion: 0.06
Nodes (36): ConfiguredDatabase, ConfiguredDatabaseOptions, LoadOptions, PlainArray, PlainDataNode, PlainDataRule, Walk, Row (+28 more)

### Community 63 - "graph.ts"
Cohesion: 0.08
Nodes (45): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+37 more)

### Community 64 - "range.ts"
Cohesion: 0.07
Nodes (41): BoundaryBlockReading, BoundaryReading, Arguments, Command, Final, Height, RangeRecording, RangeStats (+33 more)

### Community 65 - "real-tapes.ts"
Cohesion: 0.07
Nodes (34): FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+26 more)

### Community 68 - "networks.ts"
Cohesion: 0.06
Nodes (40): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+32 more)

### Community 69 - "loop.ts"
Cohesion: 0.10
Nodes (37): HeightRange, Callback, CallbackFailure, ParallelPoint, PointSchedule, Invoke, LoopEnd, Progress (+29 more)

### Community 7 - "UmbraError"
Cohesion: 0.04
Nodes (77): ReadOnlyDatabase, ReadOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, ReadTimeoutSetting, Job (+69 more)

### Community 70 - "core-settings.ts"
Cohesion: 0.06
Nodes (35): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+27 more)

### Community 71 - "checks.test.ts"
Cohesion: 0.07
Nodes (25): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, optOut, Case (+17 more)

### Community 72 - "order.property.test.ts"
Cohesion: 0.08
Nodes (33): PointRun, Recorder, CheckName, GraphSpec, ModuleSpec, Pipeline, TESTED, byBytes() (+25 more)

### Community 73 - "postgres/transaction-lease.ts"
Cohesion: 0.10
Nodes (30): Lease, LeaseAcquireOptions, TransactionOptions, HeldLease, abortError(), isConnectionFailure(), isPgDriverError(), isStatementTimeout() (+22 more)

### Community 74 - "crash-worker.ts"
Cohesion: 0.09
Nodes (28): WatermarkKey, WatermarkKind, WatermarkValue, WatermarkRow, CoTxCallable, CoTxPauseInfo, CrashHook, describeCaughtError() (+20 more)

### Community 79 - "validation.ts"
Cohesion: 0.07
Nodes (30): DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first(), validateWith() (+22 more)

### Community 8 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (117): BlockEventSource, BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsedOptions, BlockTransaction, LoadLedger, TransactionParser (+109 more)

### Community 80 - "node-source.ts"
Cohesion: 0.09
Nodes (16): CoreBlockItems, NodeSourceOptions, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, LedgerTable, SourceCondition (+8 more)

### Community 82 - "BlockRef"
Cohesion: 0.10
Nodes (10): BlockLedgerSource, LedgerBinding, BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery, systemEventsKey() (+2 more)

### Community 84 - "private/backends.ts"
Cohesion: 0.10
Nodes (20): PrivateBackend, SessionSeen, TestCertificates, A112Observation, Wiring, mutualTlsOptions(), pgliteBackend(), makeCertificates() (+12 more)

### Community 85 - "module-api.test.ts"
Cohesion: 0.11
Nodes (24): ChainDataView, ApiRequest, cursorHeight(), answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView() (+16 more)

### Community 87 - "mapping.ts"
Cohesion: 0.11
Nodes (28): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+20 more)

### Community 88 - "binding.test.ts"
Cohesion: 0.10
Nodes (15): TestDatabase, A113Observation, Binding, Outcome, TransportProxy, privateCursorHeight(), a113Run(), against() (+7 more)

### Community 9 - "runMigrations"
Cohesion: 0.03
Nodes (105): AnySql, RolloverBucket, RolloverTable, UmbraDBConnectionOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration (+97 more)

### Community 93 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 94 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 95 - "ChainArchiveStore"
Cohesion: 0.08
Nodes (13): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage (+5 more)

### Community 96 - "PgChainArchiveStore"
Cohesion: 0.18
Nodes (11): BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf() (+3 more)

### Community 99 - "transport.test.ts"
Cohesion: 0.15
Nodes (18): Message, MessageType, Ended, rawClient, hexOf(), endedWithin(), hello(), tlsProblems() (+10 more)

### Community 102 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.09
Nodes (21): pg(), 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer (+13 more)

### Community 104 - "boundary.test.ts"
Cohesion: 0.19
Nodes (19): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+11 more)

### Community 107 - "halted"
Cohesion: 0.10
Nodes (21): halted(), When a callback fails, 5. Runner, ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness (+13 more)

### Community 110 - "version"
Cohesion: 0.10
Nodes (19): version(), Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-7 The history row and its hash, Scenario: A misspelled setting is a type error, Scenario: The same entry gives the same hash, 3. The freeze: build + package.json (G1), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Scenario: The kv_current HOT ratio is measured and recorded under the soak workload (+11 more)

### Community 113 - "repository"
Cohesion: 0.11
Nodes (17): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1** (+9 more)

### Community 114 - ".boolean"
Cohesion: 0.11
Nodes (18): insert(), 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints (+10 more)

### Community 121 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (16): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+8 more)

### Community 140 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 146 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 159 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 165 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 213 - "Performance — design"
Cohesion: 0.29
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 228 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 248 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 62 - "ADDED Requirements"
Cohesion: 0.04
Nodes (47): assertValidCheckpointIds(), validateHistoryOptions(), runUnSnapshottedReadUnderPrune(), invoke(), ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats (+39 more)

### Community 76 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 78 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 83 - "fn"
Cohesion: 0.08
Nodes (31): fn(), ADDED Requirements, MODIFIED Requirements, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API, temporal-kv (transaction-participation wiring), ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease (+23 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): listen(), ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+18 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 117 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 118 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.11
Nodes (19): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol, 5.2 Layer B: keyed store and transaction guard (+11 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 123 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 128 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 131 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.12
Nodes (10): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside (+2 more)

### Community 132 - "UmbraDB module guide"
Cohesion: 0.12
Nodes (15): Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Private modules, Reading through `db`, Running a module with the `umbradb` command (+7 more)

### Community 135 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+8 more)

### Community 136 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 138 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 141 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 143 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 148 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 150 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 152 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.15
Nodes (12): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover) (+4 more)

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

### Community 161 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 162 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 163 - "Design — v1.1.0: Quint model checking"
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

### Community 169 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 171 - "explore.md"
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

### Community 177 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 178 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer) (+1 more)

### Community 179 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 180 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 181 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 182 - "UmbraDB"
Cohesion: 0.20
Nodes (10): Contents, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB, Verification: what is proved, checked, and tested (+2 more)

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

### Community 190 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 191 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution, Design — v1.0.0-infosec-signoff

### Community 192 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 193 - "Tasks — v1.1.0: Quint model checking"
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

### Community 200 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 201 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 202 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 203 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 204 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 205 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 206 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 207 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

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

### Community 215 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 216 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 217 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 218 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 219 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

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

### Community 224 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 225 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 226 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 227 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 229 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 230 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 231 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 232 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 233 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 234 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 235 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 236 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 237 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

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

### Community 245 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 246 - "Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data"
Cohesion: 0.40
Nodes (5): Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data, Scenario: replay from the durable cursor converges on current state, Scenario: the durable watermark is never ahead of durable data, Scenario: the invariant holds under synchronous_commit = off, Scenario: the invariant holds under synchronous_commit = on

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

### Community 257 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 258 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 261 - "Requirement: set is an idempotent, unconditional overwrite (Law W1)"
Cohesion: 0.67
Nodes (3): Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A new set always overwrites, with no conflict possible, Scenario: Setting the same value twice leaves the stored state unchanged

### Community 66 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 67 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 81 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 91 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form (+21 more)

### Community 92 - "package.json"
Cohesion: 0.07
Nodes (28): bin, umbradb, bugs, url, description, engines, node, exports (+20 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0, Requirement: the baseline reflects the batched (shipped) save shape (+17 more)

## Knowledge Gaps
- **51 isolated node(s):** `RFC-7693`, `RFC-7693`, `RFC-3339`, `RFC-8949`, `RFC-3339` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3297 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `src/index.ts`, `db/migrate.ts`, `PgTransactionHistoryStorage`, `PgTransactionLeaseLayer`, `InMemoryBlockSource`, `UmbraError`, `core-block-parsed.ts`, `runMigrations`, `cursor-durability.crash.test.ts`, `opt-out.test.ts`, `config/history.ts`, `fetch-fixtures.ts`, `column-rules.ts`, `postgres/transaction-history-storage.ts`, `declaration.ts`, `tape/index.ts`, `NodeClient`, `host.ts`, `adapter-fixtures.ts`, `readiness.test.ts`, `writer-lock-checks.ts`, `process-context.test.ts`, `adapter.ts`, `runner/process.ts`, `ledger-state.test.ts`, `admin-harness.ts`, `builder.test.ts`, `range.test.ts`, `transform-checks.ts`, `process-admin.ts`, `node/client.test.ts`, `node-format.ts`, `core-transport.ts`, `loop.test.ts`, `cbor.ts`, `ref_node_fs`, `spawnChild`, `changes.property.test.ts`, `api-server.test.ts`, `build.ts`, `height-versioned.test.ts`, `validate.test.ts`, `core-private-source.test.ts`, `core-block-commit.test.ts`, `core-chain.test.ts`, `core-ledger-state.ts`, `ledger-storage.test.ts`, `version-checks.ts`, `PointName`, `intake.test.ts`, `plain-data.ts`, `real-tapes.ts`, `networks.ts`, `core-settings.ts`, `checks.test.ts`, `order.property.test.ts`, `validation.ts`, `private/backends.ts`, `module-api.test.ts`, `binding.test.ts`, `package.json`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `transport.test.ts`, `code-registry.ts`, `block-fetch-decode.test.ts`, `boundary.test.ts`, `repository`, `height-versioned.property.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `twox.ts`, `midnight-env — reproducible PREPROD dev environment`, `excluded-not-exported.test.ts`, `component-table.test.ts`, `facade-merge-loader.ts`, `history.property.test.ts`?**
  _High betweenness centrality (0.316) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-7693`, `RFC-7693`, `RFC-3339` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02461391731777998 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `db/migrate.ts`, `version-table.ts`, `vitest`, `UmbraDB module guide`, `InMemoryBlockSource`, `checkShape`, `opt-out.test.ts`, `config/history.ts`, `fetch-fixtures.ts`, `declaration.ts`, `tape/index.ts`, `NodeClient`, `readiness.test.ts`, `writer-lock-checks.ts`, `process-context.test.ts`, `runner/process.ts`, `admin-harness.ts`, `transform-checks.ts`, `process-admin.ts`, `node/client.test.ts`, `core-transport.ts`, `loop.test.ts`, `cbor.ts`, `LedgerPackage`, `FinalizedLoop`, `changes.property.test.ts`, `api-server.test.ts`, `height-versioned.test.ts`, `validate.test.ts`, `module-api.ts`, `core-private-source.test.ts`, `core-block-commit.test.ts`, `core-chain.test.ts`, `ModuleDeclaration`, `core-ledger-state.ts`, `version-checks.ts`, `PointName`, `validate.ts`, `NodeBlockSource`, `plain-data.ts`, `graph.ts`, `range.ts`, `loop.ts`, `checks.test.ts`, `validation.ts`, `node-source.ts`, `BlockRef`, `module-api.test.ts`, `mapping.ts`, `PrivateTransport`, `12. Exported surface and command (LS-1, LS-6)`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `db/migrate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.025313368775301177 - nodes in this community are weakly interconnected._