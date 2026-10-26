# Graph Report - UmbraDB

## Corpus Check
- 586 files · ~961,389 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 53 file(s) not represented in the graph (top: .lean 25, (none) 13, .patch 8)

## Summary
- 6153 nodes · 15680 edges · 255 communities (236 shown, 19 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 2305 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `e7664c12c7dba21c` (586 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- src/index.ts
- setup.ts
- declaration.ts
- 3. Proof-blocking findings
- checkShape
- source-scan.ts
- graph.ts
- truncate-guard.ts
- cbor.test.ts
- no-indexer-or-wallet-sdk.test.ts
- chain-archive-rollover.ts
- CheckpointStore
- ws-mutual-tls.test.ts
- roles.ts
- node-store-suite.ts
- loop.test.ts
- FakeNode
- type-check.ts
- component-table.test.ts
- ChunkMissingError
- config-check.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- interfaces/chain-archive-store.ts
- api.ts
- writer-lock-checks.ts
- node/client.test.ts
- ReadPool
- mutation-evidence.d.mts
- PgTransactionLeaseLayer
- config/history.ts
- opt-out.test.ts
- Database
- BlockMeta
- harness.ts
- module-tables.ts
- db/migrate.ts
- UmbraError
- plain-data.ts
- db/backends.ts
- zero-timeouts-checks.ts
- runMigrations
- ValidationError
- cbor.ts
- history.test.ts
- PgTransactionHistoryStorage
- 5. Runner
- validate.test.ts
- interfaces/transaction-history-storage.ts
- process-context.test.ts
- entries.ts
- column-rules.ts
- validate.ts
- column-refusals.test.ts
- NodeClient
- core-settings.test.ts
- mapping.ts
- checks.test.ts
- postgres/chain-archive-store.ts
- TransactionHandle
- node/client.ts
- TransactionHistoryEntry
- redact.test.ts
- api-server.test.ts
- digest.test.ts
- full-sync-soak.integration.test.ts
- vendored-ledger-v9.test.ts
- chain-archive-replay-decode.integration.test.ts
- ChainArchiveStore
- pg-tx-history-adapter.ts
- check-required-tests.ts
- FinalizedLoop
- order.property.test.ts
- cold-boot-recovery.integration.test.ts
- ProcessContexts
- cbor.property.test.ts
- describeNodeStoreExports
- changes.property.test.ts
- translatePostgresError
- vitest
- development-opt-in.test.ts
- connectWebSocket
- history-startup.ts
- node-format.ts
- postgres/transaction-history-storage.ts
- .now
- T
- mutation-per-adapter.mjs
- .on
- 4. The database API
- migrations
- Design — Sprint 7: Transaction History Storage
- address
- facade-merge-loader.ts
- 001_chain_archive_core.ts
- pack-install.mjs
- midnight-env — reproducible PREPROD dev environment
- .boolean
- fresh-instance.mjs
- fn
- graph.py
- context
- decode.ts
- boundary.test.ts
- Requirement: DT-6 Stored data avoids non-deterministic values
- core
- UmbraDB V1.0.0 Implementation Guideline
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- scripts
- Algebraic Specification of the midnight-pg-store Storage Layer
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- devDependencies
- Roadmap
- REMOVED Requirements
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- UmbraDB
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- Design — CORE-ARCH: the standalone indexer's core architecture
- Design — Postgres+JSONB storage rebuild
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB third-party component inventory (SBOM)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Design — v1.0.0 API Surface & Release Contract
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Repository agent policy
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Global Constraints
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Tasks — Sprint 7: Transaction History Storage
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- Checkpoint-store composition contract — cursor ordering and replay
- UmbraDB 1.0.0 Release Contracts
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0 API Surface & Release Contract
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Proposal — Sprint 1: project setup + TemporalKV
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — v1.0.0-perf-baseline
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — v1.0.0 API Surface & Release Contract
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- Requirement: CF-6 Configuration changes only the future
- Requirement: DB-11 Exactly one writer per database
- Requirement: DB-15 Timeouts by connection role
- Requirement: DB-2 A read handle sees one committed height
- Requirement: DB-8 Schema names are unambiguous
- Proposal — Sprint 2: Transaction/Lease
- Requirement: CI gates any change to flake.lock behind explicit review (G18)
- Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence
- Spec — capability `formal-completion`
- renovate.json
- Vendored ledger builds
- Environment changelog
- start-stack.sh
- Requirement: DB-7 Cross-module functions are owned by the provider
- Requirement: manifestHash is computed once at write time from the ordered chunk-hash sequence
- Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18)
- Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16)
- repository
- run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- Requirement: DB-6 Each module's schema is guarded by its own database role
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Full-Chain Storage — Design
- Storage Algebra Lean Formalization — Approved Design and Status
- package.json
- ADDED Requirements
- Requirements
- ADDED Requirements
- UmbraDB software supply-chain directory
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- stryker.conf.json
- UmbraDB v0.9.5 "Penumbra" — Release Record

## God Nodes (most connected - your core abstractions)
1. `vitest` - 163 edges
2. `UmbraError` - 152 edges
3. `PgTransactionLeaseLayer` - 93 edges
4. `PgCheckpointStore` - 87 edges
5. `ValidationError` - 87 edges
6. `runMigrations()` - 86 edges
7. `translatePostgresError()` - 78 edges
8. `ModuleDeclaration` - 75 edges
9. `StorageError` - 70 edges
10. `PgTransactionHistoryStorage` - 70 edges

## Surprising Connections (you probably didn't know these)
- `CheckpointStore: content-addressed snapshots` --references--> `ManifestCorruptError`  [INFERRED]
  README.md → src/interfaces/checkpoint-store.ts
- `Rework (class 1 — infra)` --references--> `ConnectionError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/storage-errors.ts
- `Scenario: A connection failure surfaces as ConnectionError` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/specs/temporal-kv/spec.md → src/interfaces/storage-errors.ts
- `Scenario: A connection failure during any method surfaces as ConnectionError` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/specs/transaction-history-storage/spec.md → src/interfaces/storage-errors.ts
- `G4 — Contract doc set (all true)` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/v1.0.0-api-surface/acceptance.md → src/interfaces/storage-errors.ts

## Import Cycles
- None detected.

## Communities (255 total, 19 thin omitted)

### Community 0 - "src/index.ts"
Cohesion: 0.03
Nodes (148): CheckpointStoreError, CheckpointStoreErrorCode, ManifestCorruptError, ConnectionError, Retryability, SerializationFailedError, SharedStorageErrorCode, StorageError (+140 more)

### Community 1 - "setup.ts"
Cohesion: 0.02
Nodes (150): InvariantResult, C5AnyFn, Method, Fault, Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady (+142 more)

### Community 10 - "declaration.ts"
Cohesion: 0.04
Nodes (60): BlockWriteHandle, ReadHandle, SchemaWriteHandle, OwnPart, ApiRegistry, BlockContext, BlockHeader, DefinedModule (+52 more)

### Community 102 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 104 - "checkShape"
Cohesion: 0.27
Nodes (9): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), Requirement: the envelope module has no wallet-SDK runtime import (+1 more)

### Community 106 - "source-scan.ts"
Cohesion: 0.19
Nodes (16): ModuleReference, opensDatabase(), boundaryViolations(), calledNames(), eachNode(), isInside(), lineOf(), literalText() (+8 more)

### Community 11 - "graph.ts"
Cohesion: 0.04
Nodes (78): ConfigCheckOptions, Edge, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+70 more)

### Community 115 - "truncate-guard.ts"
Cohesion: 0.17
Nodes (7): GuardTableRow, MARK_MIGRATION_SQL, MIGRATION_MARKED_CONDITION, MIGRATION_MARKED_SQL, TRUNCATE_GUARD_FUNCTION_SQL, TRUNCATE_GUARD_TABLES_SQL, TRUNCATE_GUARD_TRIGGER

### Community 116 - "cbor.test.ts"
Cohesion: 0.16
Nodes (13): CanonicalEncodingFailure, CanonicalValue, run(), toHex(), failureReason(), expectFailure(), failure(), hexOf() (+5 more)

### Community 117 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 119 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 12 - "CheckpointStore"
Cohesion: 0.04
Nodes (66): CheckpointSequence, CheckpointStore, WalletStateEnvelope, PgWalletStateEnvelopeStore, decode(), encode(), safeNonEmptyString(), safeString() (+58 more)

### Community 120 - "ws-mutual-tls.test.ts"
Cohesion: 0.21
Nodes (9): Attempt, connect(), file(), makeCa(), makeLeaf(), openssl(), read(), tlsClientErrors (+1 more)

### Community 13 - "roles.ts"
Cohesion: 0.04
Nodes (55): MigrationPart, MultiStatementRunner, Difference, Provision, QualifiedTable, SchemaItem, SchemaMigration, SchemaModule (+47 more)

### Community 132 - "node-store-suite.ts"
Cohesion: 0.19
Nodes (10): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Disposable, NodeBatch, runInFreshInstance(), hasEmbeddedChild() (+2 more)

### Community 14 - "loop.test.ts"
Cohesion: 0.06
Nodes (51): ReadOnlyDatabase, InMemoryBlockSource, HeightRun, Batching, Contexts, LoopClass, RunnerDatabase, Started (+43 more)

### Community 144 - "type-check.ts"
Cohesion: 0.31
Nodes (8): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), isRegularFile(), packageType(), typeCheckFile(), typescript

### Community 145 - "component-table.test.ts"
Cohesion: 0.18
Nodes (7): DesignTable, RowCoverage, typeScriptFiles(), OPENERS, ROWS, SUITE, REPOSITORY

### Community 15 - "ChunkMissingError"
Cohesion: 0.04
Nodes (62): CheckpointNotFoundError, ChunkIntegrityError, ChunkMissingError, ContentHash, Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint (+54 more)

### Community 16 - "config-check.ts"
Cohesion: 0.05
Nodes (55): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckState, CheckStep, ConfigCheckReport, StepName (+47 more)

### Community 163 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 169 - "interfaces/chain-archive-store.ts"
Cohesion: 0.22
Nodes (8): BlobRole, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult, VerifierKeyScope, Hex32Schema

### Community 17 - "api.ts"
Cohesion: 0.06
Nodes (42): ReadOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, ReadTimeoutSetting, DriverError, Outcome (+34 more)

### Community 18 - "writer-lock-checks.ts"
Cohesion: 0.07
Nodes (44): PostgresOptions, WriterProcess, WorkerEvent, PostgresTestDatabase, PostgresTestServer, PauseReport, openPostgres(), startWriter() (+36 more)

### Community 19 - "node/client.test.ts"
Cohesion: 0.05
Nodes (39): NodeRetry, Answer, Handler, Received, recorded, ManualTimers, caught(), client() (+31 more)

### Community 194 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 2 - "PgTransactionLeaseLayer"
Cohesion: 0.03
Nodes (122): CheckpointRecord, CheckpointSummary, PruneResult, SaveCheckpointOptions, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle (+114 more)

### Community 20 - "config/history.ts"
Cohesion: 0.07
Nodes (57): CoreVersion, CoreSettings, HistoryCode, HistoryContext, Span, PlainObject, CheckedEntry, EntryView (+49 more)

### Community 21 - "opt-out.test.ts"
Cohesion: 0.06
Nodes (43): CapturedTable, CaptureState, CheckedMigration, PlacedRefusal, Refusal, captureDefinitions(), capturedTables(), captureFunctionName() (+35 more)

### Community 22 - "Database"
Cohesion: 0.05
Nodes (38): Database, CheckTarget, CliBackend, Snapshot, LoadOutcome, OutsideRead, Traced, Opened (+30 more)

### Community 23 - "harness.ts"
Cohesion: 0.09
Nodes (47): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+39 more)

### Community 24 - "module-tables.ts"
Cohesion: 0.07
Nodes (45): CaptureColumn, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ColumnType, RefusalCode (+37 more)

### Community 25 - "db/migrate.ts"
Cohesion: 0.07
Nodes (49): Transaction, AppliedRow, Runnable, Settling, StartupInput, PlannedSchema, Point, WriteHandleOptions (+41 more)

### Community 26 - "UmbraError"
Cohesion: 0.07
Nodes (23): Job, JobQueue, Outcome, PgliteDatabase, ServerErrorFields, BoundedRead, Session, Writer (+15 more)

### Community 27 - "plain-data.ts"
Cohesion: 0.05
Nodes (43): LoadedConfig, LoadOptions, PlainArray, plainData, PlainDataNode, PlainDataRule, Walk, Row (+35 more)

### Community 28 - "db/backends.ts"
Cohesion: 0.06
Nodes (35): TestBackend, Case, Phase, HeldRead, Job, Outcome, Reads, Step (+27 more)

### Community 29 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (34): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+26 more)

### Community 3 - "runMigrations"
Cohesion: 0.03
Nodes (95): UmbraDBConnectionOptions, DurabilityContractError, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, BlockRow, TxRow (+87 more)

### Community 31 - "ValidationError"
Cohesion: 0.05
Nodes (46): ValidationError, ApplicationError, kv(), txLayer(), FAKE_TX, { sql: getSql, connectionUri }, Requirement: prune rejects a retainCount that is not a positive safe integer, before any deletion runs, Requirement: save rejects invalid options with ValidationError before any chunking or hashing work (+38 more)

### Community 32 - "cbor.ts"
Cohesion: 0.09
Nodes (40): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+32 more)

### Community 33 - "history.test.ts"
Cohesion: 0.08
Nodes (42): versionEntry, HistoryOptions, HistoryRow, Simulation, Start, Case, builtWith100(), m() (+34 more)

### Community 34 - "PgTransactionHistoryStorage"
Cohesion: 0.07
Nodes (41): TransactionHistoryStorage, PgTransactionHistoryStorage, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation), Build (one product module + one thin envelope — corrected from the original "exactly two things, zero new code" framing; see finding below) (+33 more)

### Community 35 - "5. Runner"
Cohesion: 0.09
Nodes (27): BlockRef, BlockSource, InMemorySourceOptions, Wait, cursorHeight(), readCursor(), buildDeclarations(), answerChainData() (+19 more)

### Community 36 - "validate.test.ts"
Cohesion: 0.07
Nodes (37): ProcessSide, coreEntry, ConfigContext, ConfigInput, EntryRef, CursorRow, Expected, Row (+29 more)

### Community 37 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.05
Nodes (36): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), decodeSerializedContent(), decodeSerializedEntry(), store() (+28 more)

### Community 38 - "process-context.test.ts"
Cohesion: 0.07
Nodes (29): PublishRefusal, Seen, RunnerBackend, AllowsOutside, AllowsTwice, ContextsClass, readOnlyDatabase(), a141Problems() (+21 more)

### Community 39 - "entries.ts"
Cohesion: 0.06
Nodes (35): CoreLedgerVersion, LedgerName, LedgerPackageIdentity, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig (+27 more)

### Community 4 - "column-rules.ts"
Cohesion: 0.03
Nodes (101): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+93 more)

### Community 40 - "validate.ts"
Cohesion: 0.10
Nodes (37): HistoryFinding, ConfigRule, CursorRule, Finding, Issue, Plain, SettingsSchema, coreSettingsSchema() (+29 more)

### Community 41 - "column-refusals.test.ts"
Cohesion: 0.09
Nodes (20): ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, Case, freshDatabase(), hashOf() (+12 more)

### Community 43 - "NodeClient"
Cohesion: 0.14
Nodes (10): HeadSubscriber, NodeClient, Pending, connectionFailure, NodeMethod, isRecord(), clientClosed(), SYSTEM_TIMERS (+2 more)

### Community 45 - "core-settings.test.ts"
Cohesion: 0.07
Nodes (31): PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly, hashHex() (+23 more)

### Community 46 - "mapping.ts"
Cohesion: 0.10
Nodes (32): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+24 more)

### Community 48 - "checks.test.ts"
Cohesion: 0.08
Nodes (23): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, optOut, Case, checkFunctionsSql() (+15 more)

### Community 49 - "postgres/chain-archive-store.ts"
Cohesion: 0.15
Nodes (17): BlockBundle, BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, VerifierKeyObservationRecord, BlockRow (+9 more)

### Community 5 - "TransactionHandle"
Cohesion: 0.04
Nodes (80): HistoryOptions, AsOf, AssertExact, Key, Namespace, Scope, TemporalKV, Version (+72 more)

### Community 51 - "node/client.ts"
Cohesion: 0.10
Nodes (24): NodeCallOptions, NodeSubscription, State, Subscription, Waiter, NodeBlock, NodeHeader, NodeRuntimeVersion (+16 more)

### Community 53 - "TransactionHistoryEntry"
Cohesion: 0.11
Nodes (12): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends (+4 more)

### Community 56 - "redact.test.ts"
Cohesion: 0.12
Nodes (24): ConfigCheckSeams, RedactableConfig, RedactionForms, redactor, SecretForm, TextPattern, fieldKinds, Needs (+16 more)

### Community 6 - "api-server.test.ts"
Cohesion: 0.03
Nodes (74): Connection, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, StartedModuleApi, ChainDataAnswer, ChainDataView, ApiError (+66 more)

### Community 60 - "digest.test.ts"
Cohesion: 0.11
Nodes (26): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+18 more)

### Community 61 - "full-sync-soak.integration.test.ts"
Cohesion: 0.07
Nodes (17): JsonValue, KvRow, BatchSpec, CurrentState, CurrentState, GcPass, HistGroup, SampleObservation (+9 more)

### Community 62 - "vendored-ledger-v9.test.ts"
Cohesion: 0.17
Nodes (23): NodeRoot, bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex() (+15 more)

### Community 63 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.12
Nodes (24): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+16 more)

### Community 64 - "ChainArchiveStore"
Cohesion: 0.07
Nodes (14): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage (+6 more)

### Community 65 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+14 more)

### Community 66 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 69 - "FinalizedLoop"
Cohesion: 0.18
Nodes (5): FinalizedLoop, WaitingInRead, FailingAfter, call(), runFinalized()

### Community 7 - "order.property.test.ts"
Cohesion: 0.04
Nodes (98): GraphInput, HeightRange, Callback, EntryBoundary, ParallelPoint, PointRun, PointSchedule, PastFaultCase (+90 more)

### Community 71 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.18
Nodes (20): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+12 more)

### Community 74 - "ProcessContexts"
Cohesion: 0.12
Nodes (5): ProcessContexts, ProcessItems, names(), providesProcessItem(), sealed()

### Community 75 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (23): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+15 more)

### Community 76 - "describeNodeStoreExports"
Cohesion: 0.17
Nodes (11): NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), 5.1 The `LedgerPackage` interface (LG-6), 5.2 Vendored builds (LG-5), 5.3 The ledger worker and the node-store bridge (LG-10, LG-11), 5.4 Storage, retention and sweep (LG-11 to LG-14), 5.5 Ledger tasks (LG-17, Q49) (+3 more)

### Community 78 - "changes.property.test.ts"
Cohesion: 0.12
Nodes (23): Op, States, TableName, encodeCanonical(), sha256(), text(), blockAgrees(), compareKeys() (+15 more)

### Community 79 - "translatePostgresError"
Cohesion: 0.19
Nodes (16): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, isChainArchiveCheckConstraintName(), translatePostgresError() (+8 more)

### Community 8 - "vitest"
Cohesion: 0.03
Nodes (59): Held, Finding, Job, Lockfile, Manifest, RepositoryFile, LockResult, Upstream (+51 more)

### Community 84 - "development-opt-in.test.ts"
Cohesion: 0.16
Nodes (16): ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, PgliteLockUse, PgliteOptions, open() (+8 more)

### Community 85 - "connectWebSocket"
Cohesion: 0.13
Nodes (13): Connection, NodeClientOptions, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, SocketFailure, connectWebSocket() (+5 more)

### Community 9 - "history-startup.ts"
Cohesion: 0.04
Nodes (81): HistoryCheck, HistoryInput, HistoryRule, AppliedMigration, SchemaPlan, ProcessContext, EntryRange, ResolvedGraph (+73 more)

### Community 91 - "node-format.ts"
Cohesion: 0.23
Nodes (14): Reader, childKey(), concat(), decodeChild(), decodeChildren(), encodeChild(), encodeChildren(), nodeKey() (+6 more)

### Community 97 - "postgres/transaction-history-storage.ts"
Cohesion: 0.19
Nodes (16): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+8 more)

### Community 94 - ".now"
Cohesion: 0.14
Nodes (15): For historical reference only, Tasks — superseded by per-sprint openspec changes, Data that is not a function of the chain, Reading through `db`, Stored values and digests, Time values, UmbraDB module guide, Upgrades (+7 more)

### Community 108 - "T"
Cohesion: 0.15
Nodes (15): T(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, Scenario: Version and timestamp addressing agree, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 6.1 — P3 is the differential gate's replay-equivalence / fold anchor (documentation, no new test code) (+7 more)

### Community 114 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 118 - ".on"
Cohesion: 0.15
Nodes (12): 3. `synchronous_commit` — probe-warned, never refused, 2.2 The three durability settings, 2.3 Transaction-pooler detection, 2.4 The binding Durability Contract doc, 2. G6 — Durability startup probe + binding contract, Requirement: the required Postgres configuration is published as a binding Durability Contract, Scenario: the Durability Contract doc exists and states every enforced precondition, 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5 (+4 more)

### Community 121 - "4. The database API"
Cohesion: 0.14
Nodes (12): integer(), 4. The database API, Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first), G14 — benchmark harness + recorded baseline, 1. G13 — perf-correctness fixes (LAND FIRST), 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1) (+4 more)

### Community 125 - "migrations"
Cohesion: 0.15
Nodes (12): migrations(), Migrations, Requirement: BK-2 The file, Scenario: Both backends write a restorable file, Requirement: DB-9 Bootstrap, migrations and setup, Scenario: A changed migration refuses startup, Scenario: The second of two migrations fails, Impact (+4 more)

### Community 126 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.15
Nodes (11): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins (+3 more)

### Community 128 - "address"
Cohesion: 0.18
Nodes (12): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Requirement: Set is an unconditional overwrite at the exact address, Scenario: A later value wins at the same address, Scenario: Abstract absence remains distinct from a stored null-like value (+4 more)

### Community 139 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 142 - "001_chain_archive_core.ts"
Cohesion: 0.24
Nodes (9): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, Revision history, v2 — 2026-07-22, revised in response to a 3-reviewer design-council audit (Fable 5 / Opus / GPT-5.6 Sol), v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol) (+1 more)

### Community 146 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 151 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.22
Nodes (9): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS) (+1 more)

### Community 177 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 207 - "fresh-instance.mjs"
Cohesion: 0.40
Nodes (4): hex(), requested, store, stored

### Community 30 - "fn"
Cohesion: 0.05
Nodes (48): fn(), ADDED Requirements, MODIFIED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: A stale transaction handle is rejected before any query runs, Scenario: Two puts inside one withTransaction both commit together, Scenario: Two puts inside one withTransaction either both commit or neither does (+40 more)

### Community 42 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 47 - "context"
Cohesion: 0.07
Nodes (22): schemaName(), module(), context(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 57 - "decode.ts"
Cohesion: 0.17
Nodes (21): blockAnswer(), byteArrayAnswer(), bytesAnswer(), bytesListAnswer(), bytesParameter(), countParameter(), frozenCopy(), hashAnswer() (+13 more)

### Community 81 - "boundary.test.ts"
Cohesion: 0.20
Nodes (18): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+10 more)

### Community 83 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.09
Nodes (21): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+13 more)

### Community 86 - "core"
Cohesion: 0.12
Nodes (19): core(), 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix, 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor, Evidence (+11 more)

### Community 100 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+8 more)

### Community 101 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 105 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 107 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.12
Nodes (10): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Superseded — see `Formal/STORAGE_ALGEBRA.md`, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 4. Transaction / Lease — the control algebra the other three run inside (+2 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor first, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+7 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract, Scenario: An untouched address retains its initial value (+6 more)

### Community 112 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 113 - "Roadmap"
Cohesion: 0.13
Nodes (15): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`) (+7 more)

### Community 122 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 123 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (13): 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups, 16. Browser, 17. Library surface and gates, 18. Whole-system faults, differentials and measurements (+5 more)

### Community 124 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 127 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 131 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.15
Nodes (12): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover) (+4 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Backup while syncing (+3 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 136 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 137 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 138 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 141 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 143 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.18
Nodes (10): 10. Tables, 11. Refusals and halts (IN-12), 14. External claims and their evidence, 15. Relation to the existing design documents, 1. Source layout, 8. Private processes (PP), 9.1 Backups (BK; Q83, Q85), 9.2 Browser build (BR) (+2 more)

### Community 147 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.20
Nodes (10): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 7. Driver / toolkit choice (+2 more)

### Community 148 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 149 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 150 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 152 - "Design — v1.0.0 API Surface & Release Contract"
Cohesion: 0.20
Nodes (9): 0. Ordering constraint (why this change is Phase 2, not Phase 1), 1.2 `package.json` — make it publishable with a strict `exports`, 1.3 Packed-tarball install smoke test, 1. G1 — Public API surface, 2. G2 — SemVer stability policy + CHANGELOG, 4. G4 — The contract doc set (all *true*), 5. G20 — Freeze the Lean cut-line, 6. Non-goals / boundaries respected (restated for the implementer) (+1 more)

### Community 153 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 154 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 155 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.20
Nodes (9): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC, 9. Change close-out (+1 more)

### Community 156 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 157 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 159 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 160 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 161 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 162 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 164 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 165 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 166 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 167 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 168 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 170 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 171 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 172 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 173 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 174 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 175 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 176 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 178 - "Tasks — Sprint 7: Transaction History Storage"
Cohesion: 0.25
Nodes (7): 0. Specification freeze, 1. Vendor/pin manifest, 3. PgTransactionHistoryStorage implementation, 4. WalletState envelope, 6. Live-sync tier (nightly/labeled — blocked on design.md §7's open question), 7. Close-out, Tasks — Sprint 7: Transaction History Storage

### Community 179 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.25
Nodes (7): 4. Live preprod DB-sync verification (nightly/labeled), 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding), 7. Testing strategy (post-implementation), Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 180 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 181 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 182 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 183 - "Checkpoint-store composition contract — cursor ordering and replay"
Cohesion: 0.29
Nodes (6): 1. The invariant: the cursor is never ahead of its data, 2.2 Manual composition: advance the cursor **strictly after** the data commits, 2. The two conforming compositions, 3. Replay convergence is judged on CURRENT state, 4. Cross-reference, Checkpoint-store composition contract — cursor ordering and replay

### Community 184 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 185 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 186 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 187 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 188 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 189 - "Acceptance — v1.0.0 API Surface & Release Contract"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0 API Surface & Release Contract, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in), Precondition (blocks the whole change)

### Community 190 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 191 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 193 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 195 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 196 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 197 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 198 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 199 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 200 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 201 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 202 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 203 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 204 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, Why

### Community 205 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 206 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 208 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 209 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 210 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 211 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 212 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 213 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 214 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 215 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 216 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 217 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 218 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 219 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, Why

### Community 221 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 222 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 223 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 224 - "Requirement: CF-6 Configuration changes only the future"
Cohesion: 0.50
Nodes (4): Requirement: CF-6 Configuration changes only the future, Scenario: Adding a future revision, Scenario: Changing the past, Scenario: Raising the core's stop after stopping

### Community 225 - "Requirement: DB-11 Exactly one writer per database"
Cohesion: 0.50
Nodes (4): Requirement: DB-11 Exactly one writer per database, Scenario: A crashed writer's lock is released, Scenario: A paused writer keeps its lock, Scenario: A second writer refuses

### Community 226 - "Requirement: DB-15 Timeouts by connection role"
Cohesion: 0.50
Nodes (4): Requirement: DB-15 Timeouts by connection role, Scenario: A hung API query is cut off, Scenario: A long migration is never cut off, Scenario: The writer keeps its session between blocks

### Community 227 - "Requirement: DB-2 A read handle sees one committed height"
Cohesion: 0.50
Nodes (4): Requirement: DB-2 A read handle sees one committed height, Scenario: A multi-statement read does not straddle a commit, Scenario: Large JSON integers stay distinct, Scenario: Times read the same in every time zone

### Community 228 - "Requirement: DB-8 Schema names are unambiguous"
Cohesion: 0.50
Nodes (4): Requirement: DB-8 Schema names are unambiguous, Scenario: An id that aliases a backbone schema, Scenario: An id that is too long, Scenario: Two providers of one item with different migrations

### Community 229 - "Proposal — Sprint 2: Transaction/Lease"
Cohesion: 0.50
Nodes (3): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease

### Community 230 - "Requirement: CI gates any change to flake.lock behind explicit review (G18)"
Cohesion: 0.50
Nodes (4): Requirement: CI gates any change to flake.lock behind explicit review (G18), Scenario: A labeled flake.lock change is allowed, Scenario: A pull request that does not touch flake.lock passes, Scenario: An unlabeled flake.lock change fails the gate

### Community 231 - "Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence"
Cohesion: 0.50
Nodes (4): Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Scenario: the evidence run is not a required CI gate, Scenario: the pre-tag run resumes from the durable cursor with no resync or drift, Scenario: the run's evidence is recorded as a release artifact

### Community 232 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 233 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 234 - "Vendored ledger builds"
Cohesion: 0.50
Nodes (3): Rebuilding, Updating a version, Vendored ledger builds

### Community 237 - "Requirement: DB-7 Cross-module functions are owned by the provider"
Cohesion: 0.67
Nodes (3): Requirement: DB-7 Cross-module functions are owned by the provider, Scenario: A consumer changes the provider's table only through its function, Scenario: An unrelated module is not granted the function

### Community 238 - "Requirement: manifestHash is computed once at write time from the ordered chunk-hash sequence"
Cohesion: 0.67
Nodes (3): Requirement: manifestHash is computed once at write time from the ordered chunk-hash sequence, Scenario: Identical payloads saved as separate checkpoints report the same manifestHash, Scenario: Payloads differing only in chunk order report different manifestHash

### Community 239 - "Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18)"
Cohesion: 0.67
Nodes (3): Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Scenario: A newly introduced secret outside the allowlist fails the scan, Scenario: The historical wallet secret and the template placeholder do not fail the scan

### Community 240 - "Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16)"
Cohesion: 0.67
Nodes (3): Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16), Scenario: The dedup and prune docs state the trust-domain requirement and the side channel, Scenario: The rewrite changes no contract and preserves existing accurate caveats

### Community 241 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 44 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data responses name their view and height (+30 more)

### Community 50 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+25 more)

### Community 52 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+24 more)

### Community 54 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides, Requirement: LG-17 Ledger tasks give modules the native objects, Requirement: LG-1 Each block's ledger version comes from its `MNSV` digest (+23 more)

### Community 55 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form (+23 more)

### Community 58 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18), Requirement: The localhost Require default is unchanged (G17), Requirement: The repository ships an ignore-scripts .npmrc that CI asserts (G18) (+22 more)

### Community 59 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: history() computes per-manifest aggregates in a single grouped query (HP-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+22 more)

### Community 67 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 68 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 70 - "Full-Chain Storage — Design"
Cohesion: 0.08
Nodes (25): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+17 more)

### Community 72 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.08
Nodes (25): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+17 more)

### Community 73 - "package.json"
Cohesion: 0.08
Nodes (24): bin, umbradb, bugs, url, description, engines, node, exports (+16 more)

### Community 77 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-7 The history row and its hash (+15 more)

### Community 80 - "Requirements"
Cohesion: 0.09
Nodes (22): Purpose, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: Schema isolation is the default, not opt-in, Requirement: Unconditional writes are gapless and monotonic (Law T1), Requirements (+14 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: Schema isolation is the default, not opt-in, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A connection failure surfaces as ConnectionError (+13 more)

### Community 87 - "UmbraDB software supply-chain directory"
Cohesion: 0.10
Nodes (18): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists, 1. What SLSA v1.0 defines (+10 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A bare numeric watermark value round-trips exactly (+12 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.10
Nodes (21): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence (+13 more)

### Community 92 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-1 One API over two backends, Requirement: DB-3 Writes only through a write handle, Requirement: DB-4 PGlite serializes all work in one queue (+11 more)

### Community 93 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 95 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (17): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest (+9 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+9 more)

### Community 98 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 99 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.12
Nodes (15): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track B — Durable composition (`openspec/changes/v1.0.0-durable-checkpoint-cursor`, merged `e5fcdaa`, `2cb5d00`) (+7 more)

## Knowledge Gaps
- **36 isolated node(s):** `RFC-3339`, `RFC-8949`, `./tsconfig.json`, `RFC-3339`, `RFC-3339` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2369 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `src/index.ts`, `setup.ts`, `PgTransactionLeaseLayer`, `runMigrations`, `column-rules.ts`, `node-store-suite.ts`, `TransactionHandle`, `order.property.test.ts`, `api-server.test.ts`, `history-startup.ts`, `declaration.ts`, `graph.ts`, `facade-merge-loader.ts`, `roles.ts`, `CheckpointStore`, `ChunkMissingError`, `config-check.ts`, `api.ts`, `writer-lock-checks.ts`, `component-table.test.ts`, `node/client.test.ts`, `opt-out.test.ts`, `Database`, `loop.test.ts`, `module-tables.ts`, `db/migrate.ts`, `plain-data.ts`, `db/backends.ts`, `zero-timeouts-checks.ts`, `ValidationError`, `history.test.ts`, `5. Runner`, `validate.test.ts`, `interfaces/transaction-history-storage.ts`, `process-context.test.ts`, `entries.ts`, `column-refusals.test.ts`, `core-settings.test.ts`, `checks.test.ts`, `node/client.ts`, `redact.test.ts`, `digest.test.ts`, `full-sync-soak.integration.test.ts`, `vendored-ledger-v9.test.ts`, `chain-archive-replay-decode.integration.test.ts`, `pg-tx-history-adapter.ts`, `check-required-tests.ts`, `cold-boot-recovery.integration.test.ts`, `package.json`, `cbor.property.test.ts`, `changes.property.test.ts`, `translatePostgresError`, `boundary.test.ts`, `development-opt-in.test.ts`, `mutation-per-adapter.mjs`, `cbor.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `ws-mutual-tls.test.ts`?**
  _High betweenness centrality (0.258) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `UmbraError` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`UmbraError` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `./tsconfig.json` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.030282562197455815 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `api-server.test.ts`, `order.property.test.ts`, `vitest`, `history-startup.ts`, `declaration.ts`, `graph.ts`, `roles.ts`, `loop.test.ts`, `Design — CORE-ARCH: the standalone indexer's core architecture`, `config-check.ts`, `api.ts`, `writer-lock-checks.ts`, `node/client.test.ts`, `config/history.ts`, `opt-out.test.ts`, `module-tables.ts`, `db/migrate.ts`, `plain-data.ts`, `db/backends.ts`, `zero-timeouts-checks.ts`, `cbor.ts`, `history.test.ts`, `5. Runner`, `validate.test.ts`, `process-context.test.ts`, `entries.ts`, `validate.ts`, `NodeClient`, `mapping.ts`, `checks.test.ts`, `node/client.ts`, `decode.ts`, `FinalizedLoop`, `ProcessContexts`, `changes.property.test.ts`, `development-opt-in.test.ts`, `checkShape`, `4. The database API`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Should `setup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020156638941169328 - nodes in this community are weakly interconnected._