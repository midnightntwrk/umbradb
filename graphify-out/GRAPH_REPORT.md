# Graph Report - UmbraDB

## Corpus Check
- 845 files · ~1,299,914 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 8926 nodes · 25708 edges · 269 communities (250 shown, 19 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 3071 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `57b17a1b7fbf38e0` (845 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- src/index.ts
- config/history.ts
- translatePostgresError
- child-processes.ts
- version-table.ts
- ChainArchiveStore
- transaction-history-storage.property.test.ts
- PrivateBlockSource
- process-admin.ts
- binding.test.ts
- builds.ts
- TapeNode
- TransactionHistoryEntry
- vitest
- ref_node_url
- api-server.test.ts
- core-private-source.ts
- checkShape
- chain-archive-rollover.ts
- attempt
- UmbraError
- BlobIntegrityError
- opt-out.test.ts
- a114Run
- intake.test.ts
- separation.test.ts
- column-rules.ts
- Heartbeat
- interfaces/temporal-kv.ts
- postgres-image.test.ts
- node/client.test.ts
- ProcessItems
- ref_node_fs
- n
- runMigrations
- ReadHandle
- mutation-evidence.d.mts
- vendored-ledger-files.test.ts
- process-context.test.ts
- runner/process.ts
- .once
- ingest-crash.test.ts
- loop.ts
- postgres/transaction-lease.ts
- TapeRecord
- db/durability-probe.test.ts
- core-config.test.ts
- adapter.ts
- test/postgres/setup.ts
- cbor.ts
- BlockRef
- loop.test.ts
- module-api.test.ts
- validate.ts
- range.ts
- NodeClient
- describeNodeStoreExports
- builder.test.ts
- ValidationError
- admin-harness.ts
- tape/index.ts
- core-block-parsed.ts
- boundary.test.ts
- FinalizedLoop
- range.test.ts
- adapter-fixtures.ts
- harness.ts
- core-block-commit.test.ts
- .value
- db/migrate.ts
- PgTransactionHistoryStorage
- mapping.ts
- chain-data.test.ts
- declaration.ts
- chain-placement.test.ts
- validation.ts
- real-tapes.ts
- LedgerPackage
- postgres/chain-archive-store.ts
- zero-timeouts-checks.ts
- TransactionHandle
- chain-events-decode.test.ts
- node-source.ts
- graph.ts
- post-block-update-checks.ts
- child-processes.test.ts
- fetch-fixtures.ts
- core-settings.ts
- chain-process.test.ts
- version.negative-control.test.ts
- networks.ts
- pg-tx-history-adapter.ts
- .show
- history.property.test.ts
- PgTransactionLeaseLayer
- determinism-checks.ts
- plain-data.ts
- crash.test.ts
- ws-mutual-tls.test.ts
- checks.test.ts
- change-capture.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- ledger/types.ts
- version-checks.ts
- tx-replay-decoder.ts
- height
- recordRange
- decode.ts
- ref_node_child_process
- pg
- mutation-per-adapter.mjs
- Design — Sprint 7: Transaction History Storage
- twox.ts
- facade-merge-loader.ts
- ADDED Requirements
- 001_chain_archive_core.ts
- pack-install.mjs
- test-processes.test.ts
- .boolean
- read-only-checks.ts
- fresh-instance.mjs
- T
- graph.py
- ADDED Requirements
- ADDED Requirements
- version
- Tasks — v1.0.0-infosec-signoff
- core-private-source.test.ts
- .getAll
- address
- cold-boot-recovery.integration.test.ts
- package.json
- README.md
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- Full-Chain Storage — Design
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- stryker.conf.json
- ADDED Requirements
- scripts
- Algebraic Specification of the midnight-pg-store Storage Layer
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- devDependencies
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- UmbraDB module guide
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Roadmap
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- UmbraDB V1.0.0 Implementation Guideline
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB v0.9.5 "Penumbra" — Release Record
- 3. Proof-blocking findings
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- Design — Postgres+JSONB storage rebuild
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Repository agent policy
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Our Pledge
- Midnight infra verification checklist
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- 12. Milestone status
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-perf-baseline
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
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
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- bug-report.md
- feature-request.md
- GC architecture and query-tracing: research findings
- manifest.json
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 263 edges
2. `UmbraError` - 215 edges
3. `ModuleDeclaration` - 125 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `runMigrations()` - 90 edges
6. `ValidationError` - 87 edges
7. `PgCheckpointStore` - 87 edges
8. `NodeClient` - 85 edges
9. `Database` - 84 edges
10. `InMemoryBlockSource` - 79 edges

## Surprising Connections (you probably didn't know these)
- `4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`)` --references--> `CheckpointStore`  [INFERRED]
  design/full-chain-storage-design.md → src/interfaces/checkpoint-store.ts
- `6. Backup/restore guidance` --references--> `CheckpointStore`  [INFERRED]
  docs/CONTRACT.md → src/interfaces/checkpoint-store.ts
- `6. On not adding a Merkle/authenticated data structure` --references--> `CheckpointStore`  [INFERRED]
  Formal/STORAGE_ALGEBRA.md → src/interfaces/checkpoint-store.ts
- `6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted)` --references--> `CheckpointStore`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/design.md → src/interfaces/checkpoint-store.ts
- `2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite` --references--> `CheckpointStore`  [INFERRED]
  openspec/changes/v1.0.0-infosec-signoff/design.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (269 total, 19 thin omitted)

### Community 0 - "src/index.ts"
Cohesion: 0.03
Nodes (159): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStore, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError (+151 more)

### Community 1 - "config/history.ts"
Cohesion: 0.03
Nodes (152): CoreVersion, ConfiguredDatabase, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryConfig, EntryHeights (+144 more)

### Community 10 - "translatePostgresError"
Cohesion: 0.03
Nodes (116): ConnectionError, StorageError, TransactionKeyReuseError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, ClockRegressionError, ExclusionViolationError, PgDriverError (+108 more)

### Community 101 - "child-processes.ts"
Cohesion: 0.10
Nodes (17): Report, ReportedTest, guardPid(), watcherInput(), inTimeZone(), containerFilters, WATCHER, EXPECTED (+9 more)

### Community 102 - "version-table.ts"
Cohesion: 0.18
Nodes (20): LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable() (+12 more)

### Community 105 - "ChainArchiveStore"
Cohesion: 0.10
Nodes (7): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations, Boundary enforcement, Table of contents, UmbraDB Postgres Schema Reference

### Community 107 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 108 - "PrivateBlockSource"
Cohesion: 0.21
Nodes (8): PrivateBlockSource, PrivateIntakeOptions, PublicDatabase, PublicWakes, readPrivateCursor(), openPublicDatabase(), 8. Private processes (PP), 14. Private processes

### Community 11 - "process-admin.ts"
Cohesion: 0.04
Nodes (105): ConfigFacts, OpenedConfig, OpenedFacts, ProcessAdmin, RevisionSettings, DigestRow, ModuleFacts, PartTable (+97 more)

### Community 110 - "binding.test.ts"
Cohesion: 0.13
Nodes (13): TestDatabase, A113Observation, Binding, Outcome, hex(), a113Run(), against(), bindingIn() (+5 more)

### Community 111 - "builds.ts"
Cohesion: 0.18
Nodes (17): PrivateProcess, PrivateRefusal, privateBackbone(), genesisBlock(), genesisHex(), launchPrivate(), poll(), privateCoreEntry() (+9 more)

### Community 112 - "TapeNode"
Cohesion: 0.15
Nodes (6): TapeClock, TapeNode, SessionPlan, quietConnect(), withNode(), SYSTEM_CLOCK

### Community 114 - "TransactionHistoryEntry"
Cohesion: 0.20
Nodes (9): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends, 3.1 Field mapping (write path), 3.2 Lifecycle-detail fidelity — the correctness-gate open question (+1 more)

### Community 12 - "vitest"
Cohesion: 0.03
Nodes (67): ConfiguredDatabaseOptions, CommittedHeight, Database, CheckTarget, CliBackend, Snapshot, TestDatabase, Case (+59 more)

### Community 121 - "ref_node_url"
Cohesion: 0.16
Nodes (7): GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles(), ALGEBRA_PATH, DOC_PATH

### Community 13 - "api-server.test.ts"
Cohesion: 0.03
Nodes (85): ApiRegistry, Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, VersionedResponse, ChainDataAnswer (+77 more)

### Community 131 - "core-private-source.ts"
Cohesion: 0.23
Nodes (12): privateIntake, PublicIdentity, bindingRefusal(), hex(), sameBytes(), pollingWakes(), present(), readPublicBlock() (+4 more)

### Community 132 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 133 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 134 - "attempt"
Cohesion: 0.16
Nodes (13): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+5 more)

### Community 14 - "UmbraError"
Cohesion: 0.04
Nodes (65): ReadOptions, ReadTimeoutSetting, MultiStatementRunner, Job, JobQueue, Held, PgliteLockUse, PgliteDatabase (+57 more)

### Community 142 - "BlobIntegrityError"
Cohesion: 0.29
Nodes (10): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation), Requirement: The chain-archive error classes are excluded from the frozen surface, Scenario: Chain-archive classes are not exported and their codes are not frozen (+2 more)

### Community 15 - "opt-out.test.ts"
Cohesion: 0.04
Nodes (76): CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions (+68 more)

### Community 150 - "a114Run"
Cohesion: 0.24
Nodes (5): PublicCore, TestLink, directPublic(), a114Run(), against()

### Community 151 - "intake.test.ts"
Cohesion: 0.32
Nodes (12): PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), a116Run(), follow(), heights() (+4 more)

### Community 159 - "separation.test.ts"
Cohesion: 0.20
Nodes (8): PrivateBackend, SessionSeen, A112Observation, Wiring, PRIVATE_LOGIN, READER_LOGIN, engines, owner

### Community 16 - "column-rules.ts"
Cohesion: 0.02
Nodes (99): CatalogColumn, CatalogOptions, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts, columnVerdict (+91 more)

### Community 165 - "Heartbeat"
Cohesion: 0.31
Nodes (5): Heartbeat, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 17 - "interfaces/temporal-kv.ts"
Cohesion: 0.03
Nodes (93): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, JsonEncoded, StoredEntryJson (+85 more)

### Community 174 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 18 - "node/client.test.ts"
Cohesion: 0.03
Nodes (63): NodeClientOptions, Answer, FakeNode, Handler, Received, recorded, ManualTimers, ConnectionFrames (+55 more)

### Community 19 - "ref_node_fs"
Cohesion: 0.03
Nodes (84): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, StepName, StepReport (+76 more)

### Community 198 - "n"
Cohesion: 0.29
Nodes (7): Absent, n(), 3.3 T3 omits the current event and cannot replay a pruned suffix, 4. Law-by-law repair map, Requirement: CheckpointSummary metadata is populated and label round-trips, Scenario: A label given at save time is returned by history and load, Scenario: byteLength, chunkCount, and createdAt reflect the saved payload

### Community 2 - "runMigrations"
Cohesion: 0.02
Nodes (131): DurabilityContractError, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, TransactionPoolerDetectedError, Migration, MigrationLockTimeoutError, Started (+123 more)

### Community 20 - "ReadHandle"
Cohesion: 0.03
Nodes (72): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, VersionedValue (+64 more)

### Community 205 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 206 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 21 - "process-context.test.ts"
Cohesion: 0.04
Nodes (76): Bound, ReadOnlyDatabase, Revision, ResolvedGraph, StartedModuleApi, MisuseListener, MisuseReports, ProcessContexts (+68 more)

### Community 22 - "runner/process.ts"
Cohesion: 0.04
Nodes (60): ChainCheck, ChainCheckInput, ChainIdentity, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait, WaitingListener (+52 more)

### Community 222 - ".once"
Cohesion: 0.33
Nodes (4): SignalTarget, heldPort(), startChild(), startWorker()

### Community 23 - "ingest-crash.test.ts"
Cohesion: 0.05
Nodes (84): SourceShared, RUNTIME, Decoded, FetchSeen, CrashEvent, CrashJob, ingest, IngestOptions (+76 more)

### Community 24 - "loop.ts"
Cohesion: 0.04
Nodes (82): PointName, HeightRange, LateUse, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+74 more)

### Community 25 - "postgres/transaction-lease.ts"
Cohesion: 0.04
Nodes (86): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionFaultError, TransactionLeaseError, TransactionOptions (+78 more)

### Community 26 - "TapeRecord"
Cohesion: 0.05
Nodes (65): Recorded, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest, RequestId, Json (+57 more)

### Community 27 - "db/durability-probe.test.ts"
Cohesion: 0.05
Nodes (72): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, Outcome, PostgresOptions, WriterSession (+64 more)

### Community 28 - "core-config.test.ts"
Cohesion: 0.06
Nodes (59): adminRoutes, AdminStartOptions, AdminEndpoint, AdminPart, AdminSnapshot, ReadinessFacts, AdmittedKey, CoreLedgerVersion (+51 more)

### Community 29 - "adapter.ts"
Cohesion: 0.04
Nodes (64): Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent, RawLedgerPackage (+56 more)

### Community 3 - "test/postgres/setup.ts"
Cohesion: 0.02
Nodes (149): InvariantResult, C5AnyFn, Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, Fault, Cancellable (+141 more)

### Community 30 - "cbor.ts"
Cohesion: 0.04
Nodes (73): CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer (+65 more)

### Community 31 - "BlockRef"
Cohesion: 0.06
Nodes (24): HeadWait, NodeBlockSource, QueuedBlock, NodeHeader, BlockItems, BlockRef, PreparedBlock, QueueRunner (+16 more)

### Community 32 - "loop.test.ts"
Cohesion: 0.05
Nodes (56): InMemoryBlockSource, Contexts, LoopClass, RunnerDatabase, SeenCall, Started, Broken, EagerItems (+48 more)

### Community 33 - "module-api.test.ts"
Cohesion: 0.04
Nodes (67): EntryRange, GraphInput, ChainDataView, PastFaultCase, RefusalCase, Seen, answerChainData(), chainDataHeaders() (+59 more)

### Community 34 - "validate.ts"
Cohesion: 0.05
Nodes (71): coreEntry, ConfigRule, CursorRule, EntryRef, Finding, Issue, Plain, SettingsSchema (+63 more)

### Community 35 - "range.ts"
Cohesion: 0.04
Nodes (62): Refusal, BoundaryBlockReading, BoundaryReading, Link, TapeBuilder, TapeBuilderOptions, Arguments, Command (+54 more)

### Community 36 - "NodeClient"
Cohesion: 0.06
Nodes (40): NodeSourceOptions, CoreChainBinding, Connection, HeadSubscriber, NodeClient, NodeRetry, Pending, State (+32 more)

### Community 37 - "describeNodeStoreExports"
Cohesion: 0.07
Nodes (51): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+43 more)

### Community 38 - "builder.test.ts"
Cohesion: 0.05
Nodes (36): ConnectionFrames, Failure, Variant, WrongRecording, Metadata, Step, Frame, RawClient (+28 more)

### Community 39 - "ValidationError"
Cohesion: 0.03
Nodes (74): ValidationError, LL-002 — A7 watermark-participation negative control did not fire; survived fix-round-1, caught by round-2 cold cross-vendor Codex, 0. Package layout, 1. Chunking, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 6. Migration (`002_checkpoint_store.ts`), 9. Test infrastructure, Design — Sprint 3: CheckpointStore (+66 more)

### Community 4 - "admin-harness.ts"
Cohesion: 0.03
Nodes (126): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStarter, AdminAnswer, AdminView (+118 more)

### Community 40 - "tape/index.ts"
Cohesion: 0.07
Nodes (52): Failure, Variant, TransformError, Answer, CallRecord, recordKind, SubscriptionId, Entry (+44 more)

### Community 41 - "core-block-parsed.ts"
Cohesion: 0.05
Nodes (66): MetadataVariant, BlockTransaction, ChainTransaction, ChainEvent, EventPhase, RecordTypes, ScaleValue, ChainOutcome (+58 more)

### Community 42 - "boundary.test.ts"
Cohesion: 0.06
Nodes (53): DesignTable, RowCoverage, ModuleReference, Finding, collationsWritten(), componentCode(), componentExports(), componentTexts() (+45 more)

### Community 43 - "FinalizedLoop"
Cohesion: 0.06
Nodes (23): FinalizedLoop, HeightRun, LoopInput, LoopObserver, Startup, PrivateOptions, PublicCoreOptions, SkipsAfterReconnect (+15 more)

### Community 44 - "range.test.ts"
Cohesion: 0.05
Nodes (34): ConnectSocket, Script, ScriptedNode, ScriptedRequest, Step, syntheticChain, SyntheticChainOptions, SyntheticFault (+26 more)

### Community 45 - "adapter-fixtures.ts"
Cohesion: 0.10
Nodes (50): Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState, expectNoV8Logs() (+42 more)

### Community 46 - "harness.ts"
Cohesion: 0.09
Nodes (46): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+38 more)

### Community 47 - "core-block-commit.test.ts"
Cohesion: 0.05
Nodes (36): InMemoryItems, Wait, StandInOptions, Commit, heightPartitionsSql(), checkHeight(), hashAt(), inMemoryBlock() (+28 more)

### Community 48 - ".value"
Cohesion: 0.11
Nodes (30): MetadataField, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, TypeDef, ScaleError, ScaleReader (+22 more)

### Community 5 - "db/migrate.ts"
Cohesion: 0.03
Nodes (115): SchemaWriteHandle, Transaction, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference (+107 more)

### Community 50 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (46): TransactionHistoryStorage, PgTransactionHistoryStorage, store(), reason(), 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order) (+38 more)

### Community 51 - "mapping.ts"
Cohesion: 0.06
Nodes (37): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+29 more)

### Community 52 - "chain-data.test.ts"
Cohesion: 0.08
Nodes (46): BlockParsed, itemsSeen, BlockSpec, EventSpec, Json, Scenario, transactionSpec, a91Problems() (+38 more)

### Community 53 - "declaration.ts"
Cohesion: 0.06
Nodes (40): EntryBuilder, OwnPart, BlockHeader, DefinedModule, FieldKind, FieldSchema, ItemDeclaration, ItemSink (+32 more)

### Community 54 - "chain-placement.test.ts"
Cohesion: 0.07
Nodes (39): BlockParsedOptions, LoadLedger, TransactionParser, LedgerName, LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage (+31 more)

### Community 55 - "validation.ts"
Cohesion: 0.05
Nodes (43): DeclarationRule, Plain, Validator, Case, ShapeCase, Stats, first(), validateWith() (+35 more)

### Community 56 - "real-tapes.ts"
Cohesion: 0.07
Nodes (36): FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+28 more)

### Community 57 - "LedgerPackage"
Cohesion: 0.05
Nodes (28): LedgerEventKind, LedgerPackage, released(), listen(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem, Suggested fix (+20 more)

### Community 58 - "postgres/chain-archive-store.ts"
Cohesion: 0.10
Nodes (27): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+19 more)

### Community 59 - "zero-timeouts-checks.ts"
Cohesion: 0.08
Nodes (35): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+27 more)

### Community 6 - "TransactionHandle"
Cohesion: 0.02
Nodes (121): TransactionHistoryReader, TransactionHistoryWriter, TemporalKV, TransactionHandle, TransactionHandleInvalidError, capitalize(), exceedsMaxDepth(), withAbort() (+113 more)

### Community 60 - "chain-events-decode.test.ts"
Cohesion: 0.11
Nodes (33): eventsRuntime, Field, PalletMetadata, Phase, Registry, RuntimeShape, StorageSpec, fill() (+25 more)

### Community 62 - "node-source.ts"
Cohesion: 0.07
Nodes (29): BlockHeaderItem, BlockEventSource, BodyExtrinsic, ExtrinsicCall, BlockBody, BlockItemSource, CoreBlockHeader, CoreBlockItems (+21 more)

### Community 63 - "graph.ts"
Cohesion: 0.09
Nodes (41): Edge, GraphPart, GraphRule, MidChain, Missing, RangeFacts, ResolvedRange, Spanned (+33 more)

### Community 64 - "post-block-update-checks.ts"
Cohesion: 0.10
Nodes (34): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+26 more)

### Community 65 - "child-processes.test.ts"
Cohesion: 0.07
Nodes (33): ParentJob, Kill, Orphaned, SourceFile, LockResult, alive(), bystander(), childrenOf() (+25 more)

### Community 67 - "fetch-fixtures.ts"
Cohesion: 0.09
Nodes (35): ArgType, BlockOptions, CallSpec, chainBlock, PalletSpec, blake2b256(), compress(), rotateRight() (+27 more)

### Community 68 - "core-settings.ts"
Cohesion: 0.06
Nodes (35): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys (+27 more)

### Community 7 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (106): ProcessAdminOptions, ProcessingEnd, ProcessStatus, Job, WorkerEvent, ChainBuildOptions, A77Observation, A78Observation (+98 more)

### Community 70 - "version.negative-control.test.ts"
Cohesion: 0.10
Nodes (17): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, CountingNode, MetadataSelector, Select, Walk (+9 more)

### Community 71 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 74 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (26): TransactionHistoryStatus, LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys(), describeStatusValue() (+18 more)

### Community 75 - ".show"
Cohesion: 0.07
Nodes (22): AllowedDetail, schemaName(), module(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 79 - "history.property.test.ts"
Cohesion: 0.08
Nodes (26): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+18 more)

### Community 8 - "PgTransactionLeaseLayer"
Cohesion: 0.03
Nodes (94): BenchEnv, PgCheckpointStore, UmbraDBSql, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, WatermarkRow, CoTxCallable (+86 more)

### Community 80 - "determinism-checks.ts"
Cohesion: 0.13
Nodes (25): InstanceHashes, OptedOutObservation, Refusal, TableRefusals, privateCursorHeight(), PRIVATE_ROWS_SQL(), privateModule(), refusalOf() (+17 more)

### Community 81 - "plain-data.ts"
Cohesion: 0.10
Nodes (22): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+14 more)

### Community 84 - "crash.test.ts"
Cohesion: 0.11
Nodes (23): CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite, WORKER, CrashJob, CrashWorkerEvent (+15 more)

### Community 85 - "ws-mutual-tls.test.ts"
Cohesion: 0.09
Nodes (21): Lockfile, Manifest, Attempt, server(), locked(), connect(), file(), makeCa() (+13 more)

### Community 88 - "checks.test.ts"
Cohesion: 0.10
Nodes (20): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), numericOkPredicate() (+12 more)

### Community 9 - "change-capture.ts"
Cohesion: 0.03
Nodes (106): CaptureColumn, CapturedTable, CaptureState, ChangeKind, tableChanges, TouchedRow, GuardTableRow, optOut (+98 more)

### Community 91 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 92 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 93 - "ledger/types.ts"
Cohesion: 0.13
Nodes (22): AdapterSpec, LedgerRelease, ApplyInput, ApplyOutput, LedgerEvent, LedgerTask, LogItem, NodeStore (+14 more)

### Community 97 - "version-checks.ts"
Cohesion: 0.21
Nodes (21): Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectEveryPackageFileChecked(), expectPinsChecked() (+13 more)

### Community 98 - "tx-replay-decoder.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+12 more)

### Community 104 - "height"
Cohesion: 0.12
Nodes (18): height(), 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy, 4. Schema design (+10 more)

### Community 116 - "recordRange"
Cohesion: 0.27
Nodes (7): positive(), hashParameter(), blockUnavailable(), recordBlockZero(), recordHeights(), recordRange(), in8Tour()

### Community 117 - "decode.ts"
Cohesion: 0.27
Nodes (18): blockAnswer(), byteArrayAnswer(), bytesAnswer(), bytesListAnswer(), bytesParameter(), countParameter(), frozenCopy(), hashAnswer() (+10 more)

### Community 128 - "ref_node_child_process"
Cohesion: 0.13
Nodes (12): end(), removeContainers(), check, checker, env, forwarded, repoRoot, reportPath (+4 more)

### Community 129 - "pg"
Cohesion: 0.14
Nodes (13): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 1. Postgres-side profiling (+5 more)

### Community 130 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 139 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.14
Nodes (12): 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 5. WalletState envelope, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage (+4 more)

### Community 141 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 153 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 156 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value (+3 more)

### Community 162 - "001_chain_archive_core.ts"
Cohesion: 0.24
Nodes (9): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, Revision history, v2 — 2026-07-22, revised in response to a 3-reviewer design-council audit (Fable 5 / Opus / GPT-5.6 Sol), v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol) (+1 more)

### Community 166 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 187 - "test-processes.test.ts"
Cohesion: 0.28
Nodes (7): namesRunner(), runnerStarts(), sources(), valueNames(), REPOSITORY, RUNNER, TESTS

### Community 193 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 238 - "read-only-checks.ts"
Cohesion: 0.70
Nodes (4): namesOf(), prototypesOf(), readOnlyProblems(), NOT_OFFERED

### Community 239 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 49 - "T"
Cohesion: 0.04
Nodes (53): T(), 1. TemporalKV — event-sourced right action with a CAS guard, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly (+45 more)

### Community 72 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): integer(), ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+21 more)

### Community 87 - "version"
Cohesion: 0.07
Nodes (26): version(), 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes (+18 more)

### Community 89 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.08
Nodes (24): repository(), CORE_ARCH, DURABILITY, 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1** (+16 more)

### Community 90 - "core-private-source.test.ts"
Cohesion: 0.09
Nodes (7): publicNotStarted(), fakePublic(), fakeRead(), identity(), CORE_KEY_REGISTRY, PUBLIC_POLL_MS, PRIVATE_CORE_DIGEST

### Community 95 - ".getAll"
Cohesion: 0.08
Nodes (24): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+16 more)

### Community 96 - "address"
Cohesion: 0.09
Nodes (23): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md` (+15 more)

### Community 99 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.22
Nodes (16): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), isPlainObject(), mergeSections(), referenceMergeEntries(), EXPECTED_NIGHT_VALUE (+8 more)

### Community 100 - "package.json"
Cohesion: 0.10
Nodes (20): bin, umbradb, description, exports, files, homepage, license, main (+12 more)

### Community 103 - "README.md"
Cohesion: 0.16
Nodes (5): For historical reference only, Tasks — superseded by per-sprint openspec changes, UmbraDB v1.0.0 — Release Record (PENDING), What 1.0.0 additionally requires, What must happen before this record can be completed

### Community 106 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.10
Nodes (17): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+9 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+11 more)

### Community 113 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 118 - "Full-Chain Storage — Design"
Cohesion: 0.11
Nodes (17): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+9 more)

### Community 119 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.10
Nodes (16): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now) (+8 more)

### Community 120 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 123 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 124 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.12
Nodes (10): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside (+2 more)

### Community 125 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 126 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+7 more)

### Community 127 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 135 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.14
Nodes (14): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+6 more)

### Community 136 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 138 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 140 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 143 - "UmbraDB module guide"
Cohesion: 0.15
Nodes (12): Cursor tables, Data that is not a function of the chain, Migrations, Private modules, Reading through `db`, Start and stop heights, Stored values and digests, Time values (+4 more)

### Community 144 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 145 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note), Scenario: A pending entry clears against a finalized entry whose identifiers grew via two prior merges, Scenario: A pending entry does not clear when its identifiers are not a subset (+4 more)

### Community 148 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 152 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 157 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 158 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 160 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 161 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 163 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.18
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 164 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 167 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 168 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.20
Nodes (10): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+2 more)

### Community 169 - "3. Proof-blocking findings"
Cohesion: 0.20
Nodes (10): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption, 3.8 C2 safety and liveness are different theorem classes (+2 more)

### Community 170 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 171 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 172 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 173 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 175 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 176 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 177 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.22
Nodes (9): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 8. Test infrastructure (open decision — resolve in Task 1) (+1 more)

### Community 178 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 179 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 180 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 181 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 182 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding), 7. Testing strategy (post-implementation), Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 183 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 184 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 185 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 188 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 189 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 190 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 191 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 192 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 194 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 195 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 196 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 197 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 199 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 200 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 201 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 202 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.29
Nodes (6): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, What changes, Why

### Community 203 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 204 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 207 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 208 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 209 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 210 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 211 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.33
Nodes (5): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Problem, Resolution, Suggested fix

### Community 212 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 213 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.33
Nodes (5): 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 214 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 215 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 216 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 217 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 218 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 219 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 220 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

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

### Community 230 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 231 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 232 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 233 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 234 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 235 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 236 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 237 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 240 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 241 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 242 - "00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails"
Cohesion: 0.50
Nodes (3): 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Suggested fix

### Community 243 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 244 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 245 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 246 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 247 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 248 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 249 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 250 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 253 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 61 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 66 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 77 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+21 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

## Knowledge Gaps
- **49 isolated node(s):** `RFC-8259`, `RFC-8785`, `RFC-8785`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3109 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `src/index.ts`, `config/history.ts`, `runMigrations`, `test/postgres/setup.ts`, `admin-harness.ts`, `db/migrate.ts`, `chain-process.test.ts`, `PgTransactionLeaseLayer`, `change-capture.ts`, `translatePostgresError`, `process-admin.ts`, `api-server.test.ts`, `UmbraError`, `opt-out.test.ts`, `column-rules.ts`, `interfaces/temporal-kv.ts`, `node/client.test.ts`, `ref_node_fs`, `ReadHandle`, `process-context.test.ts`, `runner/process.ts`, `ingest-crash.test.ts`, `loop.ts`, `postgres/transaction-lease.ts`, `TapeRecord`, `db/durability-probe.test.ts`, `core-config.test.ts`, `adapter.ts`, `cbor.ts`, `loop.test.ts`, `module-api.test.ts`, `validate.ts`, `NodeClient`, `describeNodeStoreExports`, `builder.test.ts`, `tape/index.ts`, `boundary.test.ts`, `range.test.ts`, `adapter-fixtures.ts`, `core-block-commit.test.ts`, `mapping.ts`, `chain-data.test.ts`, `declaration.ts`, `chain-placement.test.ts`, `validation.ts`, `real-tapes.ts`, `zero-timeouts-checks.ts`, `chain-events-decode.test.ts`, `node-source.ts`, `post-block-update-checks.ts`, `child-processes.test.ts`, `fetch-fixtures.ts`, `core-settings.ts`, `version.negative-control.test.ts`, `networks.ts`, `pg-tx-history-adapter.ts`, `history.property.test.ts`, `determinism-checks.ts`, `plain-data.ts`, `crash.test.ts`, `ws-mutual-tls.test.ts`, `checks.test.ts`, `Tasks — v1.0.0-infosec-signoff`, `core-private-source.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `version-checks.ts`, `cold-boot-recovery.integration.test.ts`, `package.json`, `child-processes.ts`, `transaction-history-storage.property.test.ts`, `binding.test.ts`, `ref_node_url`, `mutation-per-adapter.mjs`, `twox.ts`, `excluded-not-exported.test.ts`, `intake.test.ts`, `facade-merge-loader.ts`, `separation.test.ts`, `Heartbeat`, `postgres-image.test.ts`, `test-processes.test.ts`, `vendored-ledger-files.test.ts`?**
  _High betweenness centrality (0.322) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8259`, `RFC-8785`, `RFC-8785` to the rest of the system?**
  _49 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02857142857142857 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `config/history.ts`, `core-private-source.ts`, `checkShape`, `db/migrate.ts`, `admin-harness.ts`, `chain-process.test.ts`, `change-capture.ts`, `process-admin.ts`, `vitest`, `api-server.test.ts`, `opt-out.test.ts`, `node/client.test.ts`, `ref_node_fs`, `ReadHandle`, `process-context.test.ts`, `runner/process.ts`, `ingest-crash.test.ts`, `loop.ts`, `TapeRecord`, `db/durability-probe.test.ts`, `core-config.test.ts`, `cbor.ts`, `BlockRef`, `loop.test.ts`, `module-api.test.ts`, `validate.ts`, `range.ts`, `NodeClient`, `tape/index.ts`, `FinalizedLoop`, `core-block-commit.test.ts`, `mapping.ts`, `declaration.ts`, `chain-placement.test.ts`, `validation.ts`, `zero-timeouts-checks.ts`, `node-source.ts`, `graph.ts`, `version.negative-control.test.ts`, `plain-data.ts`, `checks.test.ts`, `core-private-source.test.ts`, `ledger/types.ts`, `version-checks.ts`, `version-table.ts`, `PrivateBlockSource`, `recordRange`, `decode.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `config/history.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.026966025184129248 - nodes in this community are weakly interconnected._