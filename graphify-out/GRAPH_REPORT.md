# Graph Report - UmbraDB

## Corpus Check
- 894 files · ~1,378,068 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 9561 nodes · 27981 edges · 275 communities (250 shown, 25 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 3205 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `b171eba50f29a167` (894 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionHistoryStorage
- src/index.ts
- opt-out.test.ts
- ChainArchiveStore
- PgChainArchiveStore
- cbor.property.test.ts
- code-registry.ts
- no-indexer-or-wallet-sdk.test.ts
- block-fetch-decode.test.ts
- postgres/chain-archive-store.ts
- Design — CORE-ARCH: the standalone indexer's core architecture
- declaration.ts
- .head
- .value
- BlobIntegrityError
- 14. Private processes
- core-block-fetch/metadata.ts
- commit-proxy.ts
- adapter-fixtures.ts
- identity.ts
- 3. Proof-blocking findings
- readRuntimeMetadata
- chain-archive-rollover.ts
- interfaces/temporal-kv.ts
- cbor.test.ts
- attempt
- column-rules.ts
- read-height.property.test.ts
- intake.test.ts
- admin-harness.ts
- config-check.ts
- extrinsics.ts
- process-admin.ts
- ProcessItems
- postgres-image.test.ts
- PgTransactionLeaseLayer
- Design — v1.0.0: Formal completion (`formal-completion`)
- NodeClient
- chain-process.test.ts
- tape/index.ts
- ReadPool
- mutation-evidence.d.mts
- chain-placement.test.ts
- ledger/types.ts
- ref_node_crypto
- EventsRunner
- exitWithin
- UmbraError
- translatePostgresError
- runMigrations
- range.test.ts
- adapter.ts
- core-block-parsed.ts
- createClient
- height-versioned.test.ts
- db/backends.ts
- loop.test.ts
- db/durability-probe.test.ts
- node/client.test.ts
- Database
- builds.ts
- validate.ts
- node-format.ts
- saveAndAdvance
- ValidationError
- node.test.ts
- api-server.test.ts
- ref_node_fs
- core-transport.ts
- module-api.ts
- order.property.test.ts
- range.ts
- LedgerPackage
- core-private-source.test.ts
- harness.ts
- ingest-harness.ts
- builder.test.ts
- networks.ts
- transform-checks.ts
- dispatch.test.ts
- db/errors.ts
- FinalizedLoop
- spawnChild
- core-ledger-state.ts
- containers.test.ts
- core-config.test.ts
- boundary.test.ts
- NodeBlockSource
- crash.test.ts
- core-block-commit.test.ts
- graph.ts
- zero-timeouts-checks.ts
- real-tapes.ts
- mapping.ts
- db/migrate.ts
- messages.ts
- ledger-state.test.ts
- node-source.ts
- private/backends.ts
- config/history.ts
- version-checks.ts
- BlockRef
- checks.test.ts
- module-api.test.ts
- chain-archive-replay-decode.integration.test.ts
- 5. Runner
- plain-data.ts
- runner/process.ts
- process-context.test.ts
- ws-mutual-tls.test.ts
- cbor.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- transport.test.ts
- version
- Requirement: DT-6 Stored data avoids non-deterministic values
- Tasks — v1.0.0-infosec-signoff
- mutation-per-adapter.mjs
- pg
- twox.ts
- facade-merge-loader.ts
- history.property.test.ts
- 001_chain_archive_core.ts
- Performance — design
- orphan-watcher.mjs
- fresh-instance.mjs
- code
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- graph.py
- ADDED Requirements
- vitest
- ADDED Requirements
- package.json
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- stryker.conf.json
- Full-Chain Storage — Design
- UmbraDB software supply-chain directory
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- devDependencies
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ROADMAP.md
- Storage Algebra Lean Formalization — Approved Design and Status
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
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- openspec-explore/SKILL.md
- UmbraDB V1.0.0 Implementation Guideline
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB third-party component inventory (SBOM)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- UmbraDB
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- Design — Postgres+JSONB storage rebuild
- UmbraDB dev environment — master runbook
- 3. Live-node/indexer confirmation
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- 12. Milestone status
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-perf-baseline
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 5. Recommended candidate model
- Requirement: TransactionKeyReuseError is now reachable through the public put() API
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
- manifest.json
- Vendored ledger builds
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails
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
1. `vitest` - 286 edges
2. `UmbraError` - 231 edges
3. `ModuleDeclaration` - 132 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `NodeClient` - 91 edges
6. `runMigrations()` - 90 edges
7. `FinalizedLoop` - 89 edges
8. `PgCheckpointStore` - 87 edges
9. `Database` - 87 edges
10. `ValidationError` - 87 edges

## Surprising Connections (you probably didn't know these)
- `Midnight repos (cloned under ~/repos)` --references--> `TransactionHistoryStorage`  [INFERRED]
  design/environment/ENVIRONMENT.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note)` --references--> `PgTransactionHistoryStorage`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → legacy/transaction-history/src/postgres/transaction-history-storage.ts
- `4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`)` --references--> `CheckpointStore`  [INFERRED]
  design/full-chain-storage-design.md → src/interfaces/checkpoint-store.ts
- `6. Backup/restore guidance` --references--> `CheckpointStore`  [INFERRED]
  docs/CONTRACT.md → src/interfaces/checkpoint-store.ts
- `6. On not adding a Merkle/authenticated data structure` --references--> `CheckpointStore`  [INFERRED]
  Formal/STORAGE_ALGEBRA.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (275 total, 25 thin omitted)

### Community 0 - "PgTransactionHistoryStorage"
Cohesion: 0.01
Nodes (231): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryEntry (+223 more)

### Community 1 - "src/index.ts"
Cohesion: 0.03
Nodes (160): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError, ChunkMissingError (+152 more)

### Community 10 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (90): CaptureColumn, CapturedTable, CaptureState, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure (+82 more)

### Community 100 - "ChainArchiveStore"
Cohesion: 0.08
Nodes (12): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks` (+4 more)

### Community 101 - "PgChainArchiveStore"
Cohesion: 0.20
Nodes (9): BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf(), sha256Hex() (+1 more)

### Community 103 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (23): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+15 more)

### Community 104 - "code-registry.ts"
Cohesion: 0.14
Nodes (22): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+14 more)

### Community 105 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.14
Nodes (14): TypeCheckFinding, TypeCheckResult, Finding, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), moduleSpecifier() (+6 more)

### Community 106 - "block-fetch-decode.test.ts"
Cohesion: 0.15
Nodes (18): PalletSpec, blake2b256(), compress(), rotateRight(), words(), encodeHeader(), headerHash(), concatBytes() (+10 more)

### Community 107 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (18): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind (+10 more)

### Community 108 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.18
Nodes (13): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), 14. External claims and their evidence (+5 more)

### Community 11 - "declaration.ts"
Cohesion: 0.03
Nodes (116): coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+108 more)

### Community 111 - ".head"
Cohesion: 0.25
Nodes (15): Writer, checkSafeInteger(), encodeArrayHead(), encodeColumnScalar(), encodeGeneric(), encodeOne(), enter(), fail() (+7 more)

### Community 113 - ".value"
Cohesion: 0.30
Nodes (5): ScaleReader, ValueReader, bytesArgument(), decodeChainEvents(), read()

### Community 115 - "BlobIntegrityError"
Cohesion: 0.20
Nodes (12): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+4 more)

### Community 116 - "14. Private processes"
Cohesion: 0.13
Nodes (15): AdminChannel, SourceShared, openPublicDatabase(), openPublicSide(), pollingWakes(), readsDirectly(), oid(), 8. Private processes (PP) (+7 more)

### Community 118 - "core-block-fetch/metadata.ts"
Cohesion: 0.13
Nodes (16): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, canonicalJson(), hexOf() (+8 more)

### Community 119 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 12 - "adapter-fixtures.ts"
Cohesion: 0.05
Nodes (106): ApplyInput, StoredNode, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot (+98 more)

### Community 120 - "identity.ts"
Cohesion: 0.20
Nodes (15): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+7 more)

### Community 124 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 127 - "readRuntimeMetadata"
Cohesion: 0.40
Nodes (9): TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry(), storageEntry(), strings() (+1 more)

### Community 128 - "chain-archive-rollover.ts"
Cohesion: 0.19
Nodes (14): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+6 more)

### Community 13 - "interfaces/temporal-kv.ts"
Cohesion: 0.02
Nodes (116): AsOf, AssertExact, JsonValue, Key, Namespace, Scope, Version, VersionedEntry (+108 more)

### Community 135 - "cbor.test.ts"
Cohesion: 0.16
Nodes (13): CanonicalEncodingFailure, CanonicalValue, run(), toHex(), failureReason(), expectFailure(), failure(), hexOf() (+5 more)

### Community 138 - "attempt"
Cohesion: 0.16
Nodes (13): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+5 more)

### Community 14 - "column-rules.ts"
Cohesion: 0.02
Nodes (105): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+97 more)

### Community 143 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 144 - "intake.test.ts"
Cohesion: 0.26
Nodes (12): PrivateProcess, PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), follow(), heights() (+4 more)

### Community 15 - "admin-harness.ts"
Cohesion: 0.04
Nodes (104): AdminRun, Answered, Answerer, Expected, gate, Hold, Observation, Prober (+96 more)

### Community 16 - "config-check.ts"
Cohesion: 0.04
Nodes (95): privateIntake, CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams (+87 more)

### Community 164 - "extrinsics.ts"
Cohesion: 0.27
Nodes (9): BodyExtrinsic, ExtrinsicCall, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), decodeExtrinsics(), isCompactU64() (+1 more)

### Community 17 - "process-admin.ts"
Cohesion: 0.04
Nodes (95): ConfigFacts, OpenedConfig, AllowedDetail, ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminStarter, DigestRow (+87 more)

### Community 175 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 18 - "PgTransactionLeaseLayer"
Cohesion: 0.03
Nodes (80): PgCheckpointStore, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters, GcPass, HistGroup (+72 more)

### Community 183 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 19 - "NodeClient"
Cohesion: 0.05
Nodes (66): CoreChainBinding, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State, Subscription (+58 more)

### Community 2 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (135): BlockItemSource, InMemoryBlockSource, InMemoryItems, Wait, LoopEnd, ProcessHandle, ProcessingEnd, ProcessStatus (+127 more)

### Community 20 - "tape/index.ts"
Cohesion: 0.05
Nodes (71): RecordingProblem, TapeProblem, TransformProblem, readRequest, RequestId, Json, NotJsonError, Connection (+63 more)

### Community 203 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 21 - "chain-placement.test.ts"
Cohesion: 0.04
Nodes (96): BlockSpec, EventSpec, transactionSpec, eventsRuntime, Field, PalletMetadata, Phase, Registry (+88 more)

### Community 22 - "ledger/types.ts"
Cohesion: 0.04
Nodes (77): LoadLedger, TransactionParser, LedgerStateItem, LedgerName, ApplyOutput, ChainOutcome, LedgerPackageOptions, LedgerTask (+69 more)

### Community 23 - "ref_node_crypto"
Cohesion: 0.04
Nodes (95): ChangeKind, tableChanges, TouchedRow, Chain, ChainOptions, DigestRow, Op, States (+87 more)

### Community 24 - "UmbraError"
Cohesion: 0.04
Nodes (65): DatabaseState, ReadDatabaseOptions, ConfiguredDatabaseOptions, CommittedHeight, ReadOptions, Job, JobQueue, Held (+57 more)

### Community 25 - "translatePostgresError"
Cohesion: 0.04
Nodes (91): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, Rollback, TransactionFaultError, TransactionOptions (+83 more)

### Community 26 - "runMigrations"
Cohesion: 0.03
Nodes (87): UmbraDBConnectionOptions, DurabilityContractError, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, TransactionPoolerDetectedError, Migration, RunMigrationsOptions (+79 more)

### Community 27 - "range.test.ts"
Cohesion: 0.03
Nodes (59): NodeCallOptions, ConnectSocket, NodeSocketEvents, RecordingClient, Script, ScriptedNode, ScriptedRequest, Step (+51 more)

### Community 28 - "adapter.ts"
Cohesion: 0.04
Nodes (69): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+61 more)

### Community 29 - "core-block-parsed.ts"
Cohesion: 0.04
Nodes (81): BlockEventSource, BlockBody, MetadataVariant, RuntimeMetadataView, BlockParsedOptions, BlockTransaction, ChainTransaction, ChainEvent (+73 more)

### Community 3 - "createClient"
Cohesion: 0.02
Nodes (149): InvariantResult, C5AnyFn, Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, Fault, Cancellable (+141 more)

### Community 30 - "height-versioned.test.ts"
Cohesion: 0.04
Nodes (64): cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue, Migration, cursorDatabase (+56 more)

### Community 31 - "db/backends.ts"
Cohesion: 0.04
Nodes (49): CheckTarget, CliBackend, Snapshot, LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase (+41 more)

### Community 32 - "loop.test.ts"
Cohesion: 0.04
Nodes (65): EntryRange, CommitOutcome, HeldHeight, WaitingInRead, Contexts, Faults, LostCommit, Outcomes (+57 more)

### Community 33 - "db/durability-probe.test.ts"
Cohesion: 0.05
Nodes (68): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, WriterSession, WriterStart, Row, WriterProcess (+60 more)

### Community 34 - "node/client.test.ts"
Cohesion: 0.04
Nodes (39): Answer, FakeNode, Handler, Received, recorded, caught(), client(), quietConnect() (+31 more)

### Community 35 - "Database"
Cohesion: 0.06
Nodes (59): Bound, Database, ReadOnlyDatabase, SchemaPlan, ItemDeclaration, ProcessContext, ResolvedGraph, StartedModuleApi (+51 more)

### Community 36 - "builds.ts"
Cohesion: 0.06
Nodes (56): PrivateIntakeOptions, PublicWakes, TestDatabase, A113Observation, Binding, Outcome, PrivateOptions, PrivateRefusal (+48 more)

### Community 37 - "validate.ts"
Cohesion: 0.04
Nodes (72): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, HistoryFinding, ConfigRule, CursorRule, Finding, Issue (+64 more)

### Community 38 - "node-format.ts"
Cohesion: 0.07
Nodes (50): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+42 more)

### Community 39 - "saveAndAdvance"
Cohesion: 0.04
Nodes (63): WatermarkKey, WatermarkKind, Watermarks, WatermarkValue, SaveAndAdvanceCursor, WatermarkRow, CoTxCallable, CoTxPauseInfo (+55 more)

### Community 4 - "ValidationError"
Cohesion: 0.02
Nodes (135): TransactionHistoryReader, TransactionHistoryWriter, ValidationError, TemporalKV, TransactionHandle, TransactionHandleInvalidError, ApplicationError, exceedsMaxDepth() (+127 more)

### Community 40 - "node.test.ts"
Cohesion: 0.05
Nodes (36): ManualTimers, Metadata, Step, Frame, Failure, Variant, Failure, Variant (+28 more)

### Community 41 - "api-server.test.ts"
Cohesion: 0.04
Nodes (53): ApiRegistry, ModuleApiServer, ApiRoutes, HttpHandler, HttpRoute, ModuleRegistration, AcceptsDuplicates, AddsExtensions (+45 more)

### Community 42 - "ref_node_fs"
Cohesion: 0.04
Nodes (45): Finding, Upstream, GuardViolation, Pem, TestCertificates, ReportedTest, filesUnder(), patchesOf() (+37 more)

### Community 43 - "core-transport.ts"
Cohesion: 0.05
Nodes (46): PublicSide, ResultColumn, CoreTransport, CoreTransportOptions, InstanceView, Session, TransportLimits, TransportTls (+38 more)

### Community 44 - "module-api.ts"
Cohesion: 0.05
Nodes (53): Connection, HeadersArgument, ModuleApiServerOptions, ModuleApiStart, VersionedResponse, ChainDataAnswer, ApiError, ApiErrorCode (+45 more)

### Community 45 - "order.property.test.ts"
Cohesion: 0.05
Nodes (57): ItemSink, PointName, PointArguments, PointRun, Unwrapped, HeightFailure, Misuse, CallEvent (+49 more)

### Community 46 - "range.ts"
Cohesion: 0.05
Nodes (61): NodeClientOptions, IngestOptions, BoundaryBlockReading, BoundaryReading, Arguments, Command, TapeCommandIo, CompletenessRange (+53 more)

### Community 47 - "LedgerPackage"
Cohesion: 0.06
Nodes (30): LedgerEventKind, LedgerPackage, StateHandle, LedgerEngine, Settled, hexOf(), idOf(), same() (+22 more)

### Community 48 - "core-private-source.test.ts"
Cohesion: 0.05
Nodes (32): ChainCheck, AdmittedKey, Closable, PrivateBlockSource, PublicDatabase, PublicIdentity, PublicSideOptions, TransportPosition (+24 more)

### Community 49 - "harness.ts"
Cohesion: 0.08
Nodes (48): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+40 more)

### Community 5 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (125): BlockParsed, BlockHeader, ProcessCondition, itemsSeen, Json, Scenario, chainBlock, RUNTIME (+117 more)

### Community 50 - "builder.test.ts"
Cohesion: 0.05
Nodes (27): ConnectionFrames, Recorded, Failure, Variant, WrongRecording, Refusal, RawClient, Link (+19 more)

### Community 51 - "networks.ts"
Cohesion: 0.05
Nodes (57): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+49 more)

### Community 52 - "transform-checks.ts"
Cohesion: 0.09
Nodes (41): TapeError, TransformError, SubscriptionId, NotificationRange, reason(), baseRecords(), expectedText(), expectVariantOutput() (+33 more)

### Community 53 - "dispatch.test.ts"
Cohesion: 0.06
Nodes (44): GraphInput, HeightRange, PastFaultCase, RefusalCase, schemaName(), revisionAt(), module(), keysModule() (+36 more)

### Community 54 - "db/errors.ts"
Cohesion: 0.06
Nodes (29): BlockWriteHandle, ReadHandle, SchemaWriteHandle, ReadTimeoutSetting, ErrorCode, ErrorDetails, FieldKind, FieldSchema (+21 more)

### Community 55 - "FinalizedLoop"
Cohesion: 0.08
Nodes (15): FinalizedLoop, LoopObserver, UnexpectedCursor, Startup, PublicCoreOptions, NoRedelivery, CommitsTheBoundary, Controls (+7 more)

### Community 56 - "spawnChild"
Cohesion: 0.05
Nodes (48): ParentJob, Kill, Orphaned, SourceFile, LockResult, Report, guardContainers(), guardPid() (+40 more)

### Community 58 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (46): CoreLedgerStateOptions, LedgerBinding, BlockContext, bindLedgerParser(), boundLedgerParser(), applyBlock(), bindCoreLedgerState(), boundLedger() (+38 more)

### Community 59 - "containers.test.ts"
Cohesion: 0.07
Nodes (29): Started, FailsOnceStarted, SlowToReportPorts, SourceFile, BlockRow, TxRow, removeAttempt(), startContainer() (+21 more)

### Community 6 - "core-config.test.ts"
Cohesion: 0.03
Nodes (106): adminRoutes, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer, AdminEndpoint (+98 more)

### Community 60 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 63 - "NodeBlockSource"
Cohesion: 0.11
Nodes (11): HeadWait, NodeBlockSource, NodeHeader, PreparedBlock, QueueRunner, NoWindow, Refetches, TrustsNotifications (+3 more)

### Community 64 - "crash.test.ts"
Cohesion: 0.06
Nodes (31): HeightRun, SkipsAfterReconnect, Batching, CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite (+23 more)

### Community 65 - "core-block-commit.test.ts"
Cohesion: 0.07
Nodes (37): BlockHeaderItem, CoreBlockHeader, StandInOptions, Commit, AlwaysLanded, blockHeaderOf(), checkParent(), commitBlock() (+29 more)

### Community 66 - "graph.ts"
Cohesion: 0.08
Nodes (44): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+36 more)

### Community 67 - "zero-timeouts-checks.ts"
Cohesion: 0.09
Nodes (33): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+25 more)

### Community 68 - "real-tapes.ts"
Cohesion: 0.07
Nodes (35): FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+27 more)

### Community 69 - "mapping.ts"
Cohesion: 0.08
Nodes (30): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+22 more)

### Community 7 - "db/migrate.ts"
Cohesion: 0.03
Nodes (116): Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, MultiStatementRunner, Difference (+108 more)

### Community 72 - "messages.ts"
Cohesion: 0.07
Nodes (33): ApiResult, Committed, MessageFault, Parsed, bytesOf(), decodeParameter(), decodeValue(), describe() (+25 more)

### Community 73 - "ledger-state.test.ts"
Cohesion: 0.11
Nodes (29): ChildReader, LedgerEvent, TransactionResult, ledgerItemsSeen, recordedGenesis, coreLedgerState(), childRefKeys(), readChildren() (+21 more)

### Community 75 - "node-source.ts"
Cohesion: 0.08
Nodes (17): CoreBlockItems, BlockLedgerSource, NodeSourceOptions, Prefetch, MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry (+9 more)

### Community 78 - "private/backends.ts"
Cohesion: 0.09
Nodes (16): PrivateBackend, SessionSeen, A112Observation, Wiring, TransportProxy, mutualTlsOptions(), pgliteBackend(), schemaPlan() (+8 more)

### Community 8 - "config/history.ts"
Cohesion: 0.03
Nodes (123): CoreLedgerVersion, CoreVersion, LedgerPackageIdentity, ConfiguredDatabase, CoreSettings, versionEntry, HistoryCheck, HistoryCode (+115 more)

### Community 80 - "version-checks.ts"
Cohesion: 0.16
Nodes (26): LedgerTable, CountingNode, Select, Walk, Answers, toHex(), H(), blockWith() (+18 more)

### Community 82 - "BlockRef"
Cohesion: 0.11
Nodes (11): QueuedBlock, BlockItems, BlockRef, InMemorySourceOptions, Fetching, Recorder, KeptItems, KeptLoop (+3 more)

### Community 84 - "checks.test.ts"
Cohesion: 0.09
Nodes (23): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+15 more)

### Community 85 - "module-api.test.ts"
Cohesion: 0.11
Nodes (24): ChainDataView, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions(), chainApi() (+16 more)

### Community 87 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.11
Nodes (25): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, bootstrapChainArchiveSchema() (+17 more)

### Community 88 - "5. Runner"
Cohesion: 0.17
Nodes (27): ResolvedRange, Callback, EntryBoundary, ParallelPoint, PointSchedule, CoreStopsFirst, boundaryModules(), dispatch() (+19 more)

### Community 89 - "plain-data.ts"
Cohesion: 0.10
Nodes (21): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+13 more)

### Community 9 - "runner/process.ts"
Cohesion: 0.03
Nodes (72): OpenedFacts, ChainCheckInput, ChainSource, ConfiguredGenesis, NodeWait, WaitingListener, ModuleDeclaration, Revision (+64 more)

### Community 90 - "process-context.test.ts"
Cohesion: 0.10
Nodes (20): MisuseListener, PublishRefusal, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass, entry(), a74Problems() (+12 more)

### Community 91 - "ws-mutual-tls.test.ts"
Cohesion: 0.09
Nodes (21): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+13 more)

### Community 96 - "cbor.ts"
Cohesion: 0.08
Nodes (23): ColumnMode, DateTimeFields, Mode, PathNode, Task, ScalarColumnType, compareBytes(), daysInMonth() (+15 more)

### Community 97 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 98 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 99 - "transport.test.ts"
Cohesion: 0.14
Nodes (19): Message, MessageType, Ended, rawClient, hexOf(), endedWithin(), hello(), tlsProblems() (+11 more)

### Community 61 - "version"
Cohesion: 0.04
Nodes (43): version(), 0. Project setup, 1. TemporalKV, 2. Sprint close-out, Tasks — Sprint 1: project setup + TemporalKV, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()` (+35 more)

### Community 102 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.08
Nodes (24): insert(), ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default (+16 more)

### Community 129 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.12
Nodes (15): repository(), 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, Build track levels, How npm `--provenance` maps to SLSA, The Source track (later versions), 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3 (+7 more)

### Community 134 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 137 - "pg"
Cohesion: 0.15
Nodes (12): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 2. Node-side query correlation (+4 more)

### Community 145 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 152 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 157 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 162 - "001_chain_archive_core.ts"
Cohesion: 0.24
Nodes (9): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, Revision history, v2 — 2026-07-22, revised in response to a 3-reviewer design-council audit (Fable 5 / Opus / GPT-5.6 Sol), v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol) (+1 more)

### Community 202 - "Performance — design"
Cohesion: 0.29
Nodes (5): 1. Postgres-side profiling, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 219 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 239 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 57 - "code"
Cohesion: 0.04
Nodes (52): code(), `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, Excluded: the deferred chain-archive codes, The count is enforced, not asserted, The retryable set, UmbraDB Frozen Error-Code Catalog, Benchmarks, Compatibility, and what 1.0.0 needs (+44 more)

### Community 62 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.04
Nodes (46): listen(), 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest (+38 more)

### Community 76 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 95 - "vitest"
Cohesion: 0.08
Nodes (4): settings, CORE_ARCH, DURABILITY, vitest

### Community 109 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 110 - "package.json"
Cohesion: 0.10
Nodes (20): bin, umbradb, description, exports, files, homepage, license, main (+12 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+11 more)

### Community 114 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 121 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 122 - "Full-Chain Storage — Design"
Cohesion: 0.12
Nodes (16): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer") (+8 more)

### Community 123 - "UmbraDB software supply-chain directory"
Cohesion: 0.12
Nodes (14): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists, 2. UmbraDB's current posture (+6 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 126 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 130 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 131 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 132 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception (+6 more)

### Community 136 - "ROADMAP.md"
Cohesion: 0.14
Nodes (9): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+1 more)

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

### Community 146 - "README.md"
Cohesion: 0.27
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 147 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 149 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 150 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 151 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 155 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 156 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 158 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 159 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 160 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.18
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

### Community 161 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 163 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.18
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 165 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 166 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 167 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 168 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 169 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 170 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 171 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 172 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 173 - "UmbraDB"
Cohesion: 0.20
Nodes (10): Contents, License, Performance and ceilings, Schema and migrations, Security, Status, UmbraDB, Verification: what is proved, checked, and tested (+2 more)

### Community 176 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 177 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 178 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.22
Nodes (9): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 8. Test infrastructure (open decision — resolve in Task 1) (+1 more)

### Community 179 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 180 - "3. Live-node/indexer confirmation"
Cohesion: 0.22
Nodes (9): 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs, 3.5 Dust generation + ledger events (generic), 3.6 Contract state/actions — confirmed absent, not confirmed present, 3.7 Governance / bridge, 3.8 SPO/staking (+1 more)

### Community 181 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 182 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 184 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 185 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 186 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 187 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 188 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 189 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 190 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 191 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 192 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 193 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 194 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 195 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 196 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 197 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 198 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.29
Nodes (6): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, What changes, Why

### Community 199 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 200 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 204 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 205 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 206 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 207 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 208 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 209 - "5. Recommended candidate model"
Cohesion: 0.33
Nodes (6): 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 210 - "Requirement: TransactionKeyReuseError is now reachable through the public put() API"
Cohesion: 0.33
Nodes (5): ADDED Requirements, MODIFIED Requirements, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API, temporal-kv (transaction-participation wiring)

### Community 211 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 212 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 213 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 214 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 215 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 216 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 217 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 218 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 220 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 221 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 222 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 223 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 224 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 225 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 226 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 227 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 228 - "00019 — `evictKeys` does not refuse the root node of a live ledger state"
Cohesion: 0.40
Nodes (4): 00019 — `evictKeys` does not refuse the root node of a live ledger state, Evidence, Problem, Suggested fix

### Community 229 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 230 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 231 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 232 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 233 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 234 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 235 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 236 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 240 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 241 - "Vendored ledger builds"
Cohesion: 0.40
Nodes (4): Rebuilding, Updating a version, Vendored ledger builds, What the patches add

### Community 242 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 243 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.50
Nodes (3): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Suggested fix

### Community 244 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 245 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 246 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 247 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 248 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 249 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 250 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 251 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 254 - "Requirement: set is an idempotent, unconditional overwrite (Law W1)"
Cohesion: 0.67
Nodes (3): Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A new set always overwrites, with no conflict possible, Scenario: Setting the same value twice leaves the stored state unchanged

### Community 255 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 70 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 71 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 81 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, checkpoint-store (implementation), Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+22 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

## Knowledge Gaps
- **51 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-3339`, `RFC-8949`, `RFC-8949` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3280 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionHistoryStorage`, `src/index.ts`, `chain-process.test.ts`, `createClient`, `ValidationError`, `ingest-harness.ts`, `core-config.test.ts`, `db/migrate.ts`, `config/history.ts`, `runner/process.ts`, `opt-out.test.ts`, `declaration.ts`, `adapter-fixtures.ts`, `interfaces/temporal-kv.ts`, `column-rules.ts`, `admin-harness.ts`, `config-check.ts`, `process-admin.ts`, `PgTransactionLeaseLayer`, `NodeClient`, `tape/index.ts`, `chain-placement.test.ts`, `ledger/types.ts`, `ref_node_crypto`, `runMigrations`, `range.test.ts`, `adapter.ts`, `core-block-parsed.ts`, `height-versioned.test.ts`, `db/backends.ts`, `loop.test.ts`, `db/durability-probe.test.ts`, `node/client.test.ts`, `Database`, `builds.ts`, `validate.ts`, `node-format.ts`, `saveAndAdvance`, `node.test.ts`, `api-server.test.ts`, `ref_node_fs`, `core-transport.ts`, `order.property.test.ts`, `core-private-source.test.ts`, `builder.test.ts`, `networks.ts`, `transform-checks.ts`, `dispatch.test.ts`, `db/errors.ts`, `spawnChild`, `core-ledger-state.ts`, `containers.test.ts`, `boundary.test.ts`, `crash.test.ts`, `core-block-commit.test.ts`, `zero-timeouts-checks.ts`, `real-tapes.ts`, `mapping.ts`, `messages.ts`, `ledger-state.test.ts`, `private/backends.ts`, `version-checks.ts`, `checks.test.ts`, `module-api.test.ts`, `chain-archive-replay-decode.integration.test.ts`, `plain-data.ts`, `process-context.test.ts`, `ws-mutual-tls.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `transport.test.ts`, `cbor.property.test.ts`, `code-registry.ts`, `no-indexer-or-wallet-sdk.test.ts`, `block-fetch-decode.test.ts`, `package.json`, `BlobIntegrityError`, `identity.ts`, `mutation-per-adapter.mjs`, `cbor.test.ts`, `read-height.property.test.ts`, `intake.test.ts`, `twox.ts`, `facade-merge-loader.ts`, `history.property.test.ts`, `postgres-image.test.ts`?**
  _High betweenness centrality (0.319) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-3339` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionHistoryStorage` be split into smaller, more focused modules?**
  _Cohesion score 0.014096204350070706 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `chain-process.test.ts`, `ingest-harness.ts`, `core-config.test.ts`, `db/migrate.ts`, `config/history.ts`, `runner/process.ts`, `opt-out.test.ts`, `declaration.ts`, `adapter-fixtures.ts`, `admin-harness.ts`, `config-check.ts`, `process-admin.ts`, `NodeClient`, `tape/index.ts`, `ref_node_crypto`, `adapter.ts`, `core-block-parsed.ts`, `height-versioned.test.ts`, `db/backends.ts`, `loop.test.ts`, `db/durability-probe.test.ts`, `node/client.test.ts`, `Database`, `validate.ts`, `api-server.test.ts`, `ref_node_fs`, `core-transport.ts`, `module-api.ts`, `range.ts`, `core-private-source.test.ts`, `networks.ts`, `transform-checks.ts`, `dispatch.test.ts`, `db/errors.ts`, `FinalizedLoop`, `core-ledger-state.ts`, `NodeBlockSource`, `core-block-commit.test.ts`, `graph.ts`, `zero-timeouts-checks.ts`, `mapping.ts`, `node-source.ts`, `version-checks.ts`, `BlockRef`, `checks.test.ts`, `module-api.test.ts`, `plain-data.ts`, `process-context.test.ts`, `cbor.ts`, `Design — CORE-ARCH: the standalone indexer's core architecture`, `14. Private processes`, `identity.ts`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.027504402776338963 - nodes in this community are weakly interconnected._