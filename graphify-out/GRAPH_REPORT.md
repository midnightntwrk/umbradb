# Graph Report - UmbraDB

## Corpus Check
- 544 files · ~884,912 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 53 file(s) not represented in the graph (top: .lean 25, (none) 13, .patch 8)

## Summary
- 5544 nodes · 13525 edges · 240 communities (223 shown, 17 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 2106 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `fdf38643d5186bd3` (544 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- db/migrate.ts
- createClient
- client.ts
- source-scan.ts
- load-under-prune.integration.test.ts
- ws-mutual-tls.test.ts
- translatePostgresError
- TransactionHistoryEntry
- checkShape
- declaration.ts
- truncate-guard.ts
- 3. Proof-blocking findings
- postgres/chain-archive-store.ts
- ref_node_crypto
- describeNodeStoreExports
- dispatch.test.ts
- component-table.test.ts
- UmbraError
- loop.test.ts
- order.property.test.ts
- db/errors.ts
- typed-config.test.ts
- mutation-evidence.d.mts
- vendored-ledger-files.test.ts
- harness.ts
- api.ts
- TransactionHandle
- TemporalKV
- postgres/transaction-lease.ts
- writer-lock-checks.ts
- PgTransactionLeaseLayer
- cbor.ts
- validate.test.ts
- column-refusals.test.ts
- zero-timeouts-checks.ts
- column-rules.test.ts
- StorageError
- postgres.ts
- changes.property.test.ts
- graph.ts
- PgTransactionHistoryStorage
- transaction-history-storage.property.test.ts
- ref_node_fs
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- module-tables.ts
- crash-worker.ts
- opt-out.test.ts
- vitest
- validate.ts
- ChunkMissingError
- checks.test.ts
- validation.ts
- cursor-durability.crash.test.ts
- core-settings.test.ts
- column-rules.ts
- loop.ts
- src/index.ts
- cbor.property.test.ts
- redact.test.ts
- FinalizedLoop
- pg-tx-history-adapter.ts
- entries.ts
- interfaces/temporal-kv.ts
- plain-data.test.ts
- postgres/checkpoint-store.ts
- differential-equivalence.test.ts
- check-required-tests.ts
- sync-service.ts
- change-capture.ts
- chain-archive-rollover.ts
- load.test.ts
- chain-archive-replay-decode.integration.test.ts
- full-sync-soak.integration.test.ts
- runMigrations
- pglite-writer.worker.ts
- 0. Pins and verification
- .save
- node-format.ts
- CheckpointNotFoundError
- ValidationError
- 5. Runner
- write-handles.test.ts
- postgres/transaction-history-storage.ts
- cold-boot-recovery.integration.test.ts
- T
- .history
- Design — v1.0.0-perf-baseline
- mutation-per-adapter.mjs
- chain-archive-sync-retry.integration.test.ts
- address
- ADDED Requirements
- facade-merge-loader.ts
- migrations
- pack-install.mjs
- midnight-env — reproducible PREPROD dev environment
- .prune
- .getAt
- .boolean
- fresh-instance.mjs
- graph.py
- context
- boundary.test.ts
- vendored-ledger-v9.test.ts
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB V1.0.0 Implementation Guideline
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- devDependencies
- ROADMAP.md
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Roadmap
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Design — Sprint 3: CheckpointStore
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- UmbraDB and SLSA — supply-chain integrity assessment
- Design — Postgres+JSONB storage rebuild
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-infosec-signoff
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0-infosec-signoff
- Contributing
- UmbraDB module guide
- Global Constraints
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 12. Milestone status
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — v1.0.0-perf-baseline
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- bug-report.md
- feature-request.md
- GC architecture and query-tracing: research findings
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- Requirement: CI gates any change to flake.lock behind explicit review (G18)
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
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
- Requirement: the envelope module has no wallet-SDK runtime import
- bugs
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Storage Algebra Lean Formalization — Approved Design and Status
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- scripts
- stryker.conf.json
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- UmbraDB v0.9.5 "Penumbra" — Release Record

## God Nodes (most connected - your core abstractions)
1. `vitest` - 150 edges
2. `UmbraError` - 116 edges
3. `PgTransactionLeaseLayer` - 93 edges
4. `PgCheckpointStore` - 87 edges
5. `ValidationError` - 87 edges
6. `runMigrations()` - 86 edges
7. `translatePostgresError()` - 78 edges
8. `createClient()` - 74 edges
9. `UmbraDBSql` - 72 edges
10. `TransactionHandle` - 70 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `2. TemporalKV → Postgres` --references--> `TransactionKeyReuseError`  [INFERRED]
  design/design.md → src/interfaces/temporal-kv.ts
- `Scenario: A transaction-key-reuse violation surfaces as TransactionKeyReuseError` --references--> `TransactionKeyReuseError`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts
- `Scenario: A transaction-key-reuse violation surfaces as TransactionKeyReuseError` --references--> `TransactionKeyReuseError`  [INFERRED]
  openspec/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → src/interfaces/transaction-history-storage.ts

## Import Cycles
- None detected.

## Communities (240 total, 17 thin omitted)

### Community 0 - "db/migrate.ts"
Cohesion: 0.04
Nodes (101): Transaction, AppliedMigration, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference (+93 more)

### Community 1 - "createClient"
Cohesion: 0.03
Nodes (98): C5AnyFn, Method, Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError (+90 more)

### Community 10 - "client.ts"
Cohesion: 0.06
Nodes (33): UmbraDBSql, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, BlockRow, TxRow, overridingUrlParameter(), assertNoConflictingSearchPath() (+25 more)

### Community 103 - "source-scan.ts"
Cohesion: 0.19
Nodes (16): ModuleReference, opensDatabase(), boundaryViolations(), calledNames(), eachNode(), isInside(), lineOf(), literalText() (+8 more)

### Community 108 - "load-under-prune.integration.test.ts"
Cohesion: 0.14
Nodes (13): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), runUnSnapshottedReadUnderPrune(), seedCheckpoints() (+5 more)

### Community 109 - "ws-mutual-tls.test.ts"
Cohesion: 0.19
Nodes (11): Attempt, connect(), file(), makeCa(), makeLeaf(), openssl(), read(), tlsClientErrors (+3 more)

### Community 11 - "translatePostgresError"
Cohesion: 0.04
Nodes (56): TransactionKeyReuseError, TransactionFaultError, ClockRegressionError, ExclusionViolationError, PgDriverError, UnrecognizedPostgresError, CatalogRow, isChainArchiveCheckConstraintName() (+48 more)

### Community 114 - "TransactionHistoryEntry"
Cohesion: 0.29
Nodes (6): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 117 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 12 - "declaration.ts"
Cohesion: 0.04
Nodes (50): ReadHandle, ApiRegistry, BlockContext, BlockHeader, DefinedModule, FieldKind, FieldSchema, ItemDeclaration (+42 more)

### Community 124 - "truncate-guard.ts"
Cohesion: 0.19
Nodes (8): GuardTableRow, MARK_MIGRATION_SQL, MIGRATION_MARK, MIGRATION_MARKED_CONDITION, MIGRATION_MARKED_SQL, TRUNCATE_GUARD_FUNCTION_SQL, TRUNCATE_GUARD_TABLES_SQL, TRUNCATE_GUARD_TRIGGER

### Community 127 - "3. Proof-blocking findings"
Cohesion: 0.15
Nodes (13): Absent, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces (+5 more)

### Community 13 - "postgres/chain-archive-store.ts"
Cohesion: 0.07
Nodes (44): BlobIntegrityError, BlobMissingError, BlobRole, BlockBundle, BlockMeta, BlockNotFoundError, BlockRecord, BlockStatus (+36 more)

### Community 130 - "ref_node_crypto"
Cohesion: 0.18
Nodes (10): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, runInFreshInstance(), fixtures, packages (+2 more)

### Community 131 - "describeNodeStoreExports"
Cohesion: 0.26
Nodes (7): Child, Disposable, NodeStoreSubject, hasEmbeddedChild(), refsOf(), describeNodeStoreExports(), sortedHex()

### Community 14 - "dispatch.test.ts"
Cohesion: 0.06
Nodes (55): GraphInput, PastFaultCase, RefusalCase, resolveGraph(), contractLogs(), declaration(), blockAt(), logsProvider() (+47 more)

### Community 142 - "component-table.test.ts"
Cohesion: 0.18
Nodes (7): DesignTable, RowCoverage, typeScriptFiles(), OPENERS, ROWS, SUITE, REPOSITORY

### Community 15 - "UmbraError"
Cohesion: 0.06
Nodes (25): MultiStatementRunner, Job, JobQueue, PgliteDatabase, PgliteOptions, ServerErrorFields, BoundedRead, Session (+17 more)

### Community 16 - "loop.test.ts"
Cohesion: 0.05
Nodes (34): BlockRef, InMemoryBlockSource, InMemorySourceOptions, HeightRun, Batching, WaitingInRead, LoopClass, RunnerDatabase (+26 more)

### Community 17 - "order.property.test.ts"
Cohesion: 0.06
Nodes (56): HeightRange, Callback, EntryBoundary, ParallelPoint, PointRun, PointSchedule, Recorder, CheckName (+48 more)

### Community 18 - "db/errors.ts"
Cohesion: 0.06
Nodes (41): ReadTimeoutSetting, ErrorCode, ErrorDetails, ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter() (+33 more)

### Community 187 - "typed-config.test.ts"
Cohesion: 0.29
Nodes (4): Finding, CONFIG, FIXTURES, typescript

### Community 188 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 189 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 19 - "harness.ts"
Cohesion: 0.09
Nodes (47): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+39 more)

### Community 2 - "api.ts"
Cohesion: 0.04
Nodes (70): BlockWriteHandle, CommittedHeight, Database, ReadOnlyDatabase, SchemaWriteHandle, TestBackend, TestDatabase, Case (+62 more)

### Community 20 - "TransactionHandle"
Cohesion: 0.06
Nodes (52): TransactionHandle, TransactionHandleInvalidError, capitalize(), registerTransaction(), resolveTransaction(), unregisterTransaction(), fn(), key() (+44 more)

### Community 21 - "TemporalKV"
Cohesion: 0.04
Nodes (49): TemporalKV, Watermarks, 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`), 9. Module → module mapping (source of truth for `tasks.md`), 1.1 Error handling — one idiom: thrown, `code`-discriminated typed errors, 1.2 Async pattern, 1.3 Transaction participation, 1.4 Runtime validation (+41 more)

### Community 22 - "postgres/transaction-lease.ts"
Cohesion: 0.07
Nodes (45): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionLeaseError, TransactionRolledBackError, HeldLease (+37 more)

### Community 23 - "writer-lock-checks.ts"
Cohesion: 0.08
Nodes (41): WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PauseReport, LockResult, startWriter(), blocksIn() (+33 more)

### Community 24 - "PgTransactionLeaseLayer"
Cohesion: 0.07
Nodes (42): PgCheckpointStore, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters, Adapters, adaptersOf() (+34 more)

### Community 25 - "cbor.ts"
Cohesion: 0.08
Nodes (44): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+36 more)

### Community 26 - "validate.test.ts"
Cohesion: 0.06
Nodes (43): coreEntry, versionEntry, EntryRef, Accepts, ConfigOf, CoreSettingsGiven, Minimal, PricesSettings (+35 more)

### Community 27 - "column-refusals.test.ts"
Cohesion: 0.07
Nodes (28): ModuleTable, DeterminismBackend, TestDatabase, TestServer, Backend, Case, freshDatabase(), hashOf() (+20 more)

### Community 28 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (35): Settings, Run, Job, WorkerEvent, Outcome, pgliteNeedsDevelopmentOptIn(), openPglite(), expectNeverCutOffNorHung() (+27 more)

### Community 29 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (32): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+24 more)

### Community 3 - "StorageError"
Cohesion: 0.03
Nodes (98): ConnectionError, Retryability, StorageError, TemporalKVError, Rollback, TransactionLeaseLayer, RunMigrationsOptions, SaveAndAdvanceCursor (+90 more)

### Community 30 - "postgres.ts"
Cohesion: 0.08
Nodes (38): ReadOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Outcome, DriverError, Outcome (+30 more)

### Community 31 - "changes.property.test.ts"
Cohesion: 0.06
Nodes (46): ChangeKind, tableChanges, TouchedRow, Op, States, TableName, digestBlock(), encodeCanonical() (+38 more)

### Community 32 - "graph.ts"
Cohesion: 0.08
Nodes (46): Edge, EntryRange, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck (+38 more)

### Community 33 - "PgTransactionHistoryStorage"
Cohesion: 0.07
Nodes (40): TransactionHistoryStorage, PgTransactionHistoryStorage, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation), Build (one product module + one thin envelope — corrected from the original "exactly two things, zero new code" framing; see finding below) (+32 more)

### Community 34 - "transaction-history-storage.property.test.ts"
Cohesion: 0.06
Nodes (32): EntryContent, MergeEntriesFn, Command, ReplayableStorage, makeAdapter(), isPlainObject(), mergeSections(), referenceMergeEntries() (+24 more)

### Community 35 - "ref_node_fs"
Cohesion: 0.06
Nodes (26): Lockfile, Manifest, RepositoryFile, GuardViolation, canPin(), pinViolations(), repositoryFiles(), extractStringLiterals() (+18 more)

### Community 36 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.05
Nodes (35): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth) (+27 more)

### Community 38 - "module-tables.ts"
Cohesion: 0.08
Nodes (31): CaptureColumn, ModuleColumn, PageOptions, ColumnType, RefusalCode, contentsHash(), encodeTableRow(), renderKeyValue() (+23 more)

### Community 39 - "crash-worker.ts"
Cohesion: 0.09
Nodes (28): WatermarkKey, WatermarkKind, WatermarkValue, WatermarkRow, CoTxCallable, CoTxPauseInfo, CrashHook, describeCaughtError() (+20 more)

### Community 4 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (69): ModuleDeclaration, ResolvedGraph, Wait, LoopInput, Chain, DigestRow, Contexts, RunnerBackend (+61 more)

### Community 40 - "vitest"
Cohesion: 0.05
Nodes (14): Phase, PostgresTestServer, postgresBackend(), startPostgresServer(), store(), txLayer(), store(), postgresRunner() (+6 more)

### Community 41 - "validate.ts"
Cohesion: 0.10
Nodes (38): CheckedEntry, ConfigRule, CursorRule, Finding, Issue, PlacedEntry, Plain, SettingsSchema (+30 more)

### Community 42 - "ChunkMissingError"
Cohesion: 0.06
Nodes (36): ChunkIntegrityError, ChunkMissingError, CheckpointStore tables, Requirement: A chunk still referenced by any surviving manifest is never reclaimed (Law C2a), Requirement: load always fully verifies chunk integrity before returning, Scenario: A checkpoint whose stored chunk content matches its recorded hash loads successfully, Scenario: A chunk shared across wallets survives one wallet's prune, Scenario: A chunk whose stored content no longer matches its recorded hash is rejected (+28 more)

### Community 43 - "checks.test.ts"
Cohesion: 0.07
Nodes (24): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql() (+16 more)

### Community 46 - "validation.ts"
Cohesion: 0.07
Nodes (33): DeclarationRule, DeclarationSet, PlacedDeclaration, Plain, Case, ShapeCase, Stats, first() (+25 more)

### Community 47 - "cursor-durability.crash.test.ts"
Cohesion: 0.07
Nodes (28): InvariantResult, CrashWorkerHandle, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs(), durableKvValues(), itemKey() (+20 more)

### Community 48 - "core-settings.test.ts"
Cohesion: 0.07
Nodes (30): PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly, hexBytes() (+22 more)

### Community 5 - "column-rules.ts"
Cohesion: 0.03
Nodes (86): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts (+78 more)

### Community 50 - "loop.ts"
Cohesion: 0.08
Nodes (18): ItemSink, PointName, LateUse, BlockSource, CallbackFailure, HeightFailure, Invoke, Misuse (+10 more)

### Community 51 - "src/index.ts"
Cohesion: 0.11
Nodes (26): CheckpointStoreErrorCode, SharedStorageErrorCode, TemporalKVErrorCode, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle (+18 more)

### Community 52 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 54 - "redact.test.ts"
Cohesion: 0.11
Nodes (26): PlainObject, RedactableConfig, RedactionForms, redactor, SecretForm, TextPattern, EntryView, fieldKinds (+18 more)

### Community 55 - "FinalizedLoop"
Cohesion: 0.13
Nodes (9): BlockItems, FinalizedLoop, EagerItems, EagerLoop, FailingAfter, KeptItems, KeptLoop, call() (+1 more)

### Community 56 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (23): LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+15 more)

### Community 58 - "entries.ts"
Cohesion: 0.07
Nodes (30): CoreLedgerVersion, CoreVersion, LedgerName, LedgerPackageIdentity, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry (+22 more)

### Community 6 - "interfaces/temporal-kv.ts"
Cohesion: 0.05
Nodes (64): AsOf, AssertExact, HistoryUnavailableError, JsonValue, Key, Namespace, Scope, Version (+56 more)

### Community 64 - "plain-data.test.ts"
Cohesion: 0.10
Nodes (22): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+14 more)

### Community 65 - "postgres/checkpoint-store.ts"
Cohesion: 0.14
Nodes (25): CheckpointRecord, CheckpointSequence, CheckpointStoreError, ContentHash, HistoryOptions, ManifestCorruptError, PruneResult, SaveCheckpointOptions (+17 more)

### Community 66 - "differential-equivalence.test.ts"
Cohesion: 0.13
Nodes (25): Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1(), injectT2() (+17 more)

### Community 68 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 7 - "sync-service.ts"
Cohesion: 0.05
Nodes (36): IndexerBlock, IndexerClient, IndexerClientError, IndexerClientOptions, IndexerClientParseError, IndexerTransaction, NodeRpcClient, NodeRpcClientOptions (+28 more)

### Community 71 - "change-capture.ts"
Cohesion: 0.17
Nodes (18): CapturedTable, CaptureState, ConsistentRead, optOut, captureDefinitions(), capturedTables(), captureFunctionName(), captureReady() (+10 more)

### Community 72 - "chain-archive-rollover.ts"
Cohesion: 0.13
Nodes (22): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+14 more)

### Community 74 - "load.test.ts"
Cohesion: 0.11
Nodes (18): ProcessSide, LoadedConfig, LoadOptions, plainData, CheckedConfig, ConfigContext, ConfigInput, Row (+10 more)

### Community 76 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.15
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+12 more)

### Community 77 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (10): GcPass, HistGroup, SampleObservation, kvMapKey(), readCurrentState(), { connectionUri }, DECLARED_ENVELOPE, LIVE_ENVELOPE (+2 more)

### Community 8 - "runMigrations"
Cohesion: 0.04
Nodes (70): UmbraDBConnectionOptions, DurabilityContractError, TransactionPoolerDetectedError, MigrationLockTimeoutError, exceedsMaxDepth(), runMigrations(), EntrySectionsSchema, Audit (round 1) — the confirmation-bias control paid off (+62 more)

### Community 80 - "pglite-writer.worker.ts"
Cohesion: 0.17
Nodes (16): Held, PgliteLockUse, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor(), main() (+8 more)

### Community 81 - "0. Pins and verification"
Cohesion: 0.15
Nodes (12): NodeStoreExports, 5.1 The `LedgerPackage` interface (LG-6), 5.2 Vendored builds (LG-5), 5.3 The ledger worker and the node-store bridge (LG-10, LG-11), 5.4 Storage, retention and sweep (LG-11 to LG-14), 5.5 Ledger tasks (LG-17, Q49), 5. Ledger, 0. Pins and verification (+4 more)

### Community 82 - ".save"
Cohesion: 0.13
Nodes (19): CheckpointSummary, integer(), splitChunks(), validateSaveOptions(), 1. Chunking and write path, Requirement: save accepts and joins a caller-supplied transaction handle, Scenario: A checkpoint saved on a caller transaction commits with it, Scenario: A checkpoint saved on a caller transaction that rolls back leaves no trace (+11 more)

### Community 85 - "node-format.ts"
Cohesion: 0.23
Nodes (14): Reader, childKey(), concat(), decodeChild(), decodeChildren(), encodeChild(), encodeChildren(), nodeKey() (+6 more)

### Community 86 - "CheckpointNotFoundError"
Cohesion: 0.12
Nodes (14): CheckpointNotFoundError, store(), { sql: getSql, connectionUri }, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, Requirement: load and history distinguish "no checkpoint" from "checkpoint exists elsewhere" (+6 more)

### Community 9 - "ValidationError"
Cohesion: 0.05
Nodes (61): CheckpointStore, ValidationError, EnvelopeCorruptError, EnvelopeVersionUnsupportedError, WalletStateEnvelope, WalletStateEnvelopeError, PgWalletStateEnvelopeStore, decode() (+53 more)

### Community 93 - "5. Runner"
Cohesion: 0.22
Nodes (15): ChainDataAnswer, ChainDataView, answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions() (+7 more)

### Community 95 - "write-handles.test.ts"
Cohesion: 0.16
Nodes (14): BlockWrites, BlockOpener, block(), expectClosedInNextCallback(), expectOwnRoles(), expectWriteHandleClosed(), keepsFirstRole(), outcome() (+6 more)

### Community 96 - "postgres/transaction-history-storage.ts"
Cohesion: 0.21
Nodes (16): SerializationFailedError, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+8 more)

### Community 102 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.27
Nodes (14): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), EXPECTED_NIGHT_VALUE, EXPECTED_UNSHIELDED_ADDRESS, FAUCET_IDENTIFIER_PREFIX (+6 more)

### Community 104 - "T"
Cohesion: 0.15
Nodes (15): T(), Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, Scenario: Version and timestamp addressing agree, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 6.1 — P3 is the differential gate's replay-equivalence / fold anchor (documentation, no new test code) (+7 more)

### Community 107 - ".history"
Cohesion: 0.12
Nodes (14): validateHistoryOptions(), Requirement: history is newest-first, scoped per wallet+network, and supports cursor paging with no gap or duplicate, Requirement: load and history read a consistent snapshot immune to a concurrently-committing prune, Scenario: A prune committing mid-load does not truncate or empty an in-flight load's result, Scenario: History for one wallet+network never includes another's checkpoints, Scenario: Paging with before continues without gap or duplicate, 1.0.0 gate items addressed, Impact (+6 more)

### Community 112 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.15
Nodes (11): coerceToSafeNumber(), Scenario: A set issued inside a caller's transaction is visible to a get using the same handle before commit, 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6) (+3 more)

### Community 116 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 125 - "chain-archive-sync-retry.integration.test.ts"
Cohesion: 0.22
Nodes (9): bootstrapChainArchiveSchema(), fakeChain(), fakeIndexerFetch(), fakeNodeFetch(), hx(), newService(), MAX_BLOCKS, service (+1 more)

### Community 128 - "address"
Cohesion: 0.18
Nodes (12): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Requirement: Set is an unconditional overwrite at the exact address, Scenario: A later value wins at the same address, Scenario: Abstract absence remains distinct from a stored null-like value (+4 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value (+3 more)

### Community 138 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 140 - "migrations"
Cohesion: 0.18
Nodes (10): migrations(), Migrations, 0. Specification freeze, 1. Vendor/pin manifest, 2. Schema + interface, 3. PgTransactionHistoryStorage implementation, 4. WalletState envelope, 6. Live-sync tier (nightly/labeled — blocked on design.md §7's open question) (+2 more)

### Community 143 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 148 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.22
Nodes (9): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS) (+1 more)

### Community 150 - ".prune"
Cohesion: 0.20
Nodes (9): invoke(), Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: prune rejects a retainCount that is not a positive safe integer, before any deletion runs, Scenario: A newly unreferenced chunk within the grace window is not reclaimed, Scenario: A non-integer or non-finite retainCount is rejected with no effect, Scenario: An integer retainCount outside the safe integer range is rejected with no effect, Scenario: An unreferenced chunk past the grace window is eventually reclaimed, Scenario: retainCount of zero is rejected with no effect (+1 more)

### Community 166 - ".getAt"
Cohesion: 0.25
Nodes (5): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why, Performance

### Community 171 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 202 - "fresh-instance.mjs"
Cohesion: 0.40
Nodes (4): hex(), requested, store, stored

### Community 44 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 53 - "context"
Cohesion: 0.07
Nodes (22): schemaName(), module(), context(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 78 - "boundary.test.ts"
Cohesion: 0.20
Nodes (19): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+11 more)

### Community 79 - "vendored-ledger-v9.test.ts"
Cohesion: 0.23
Nodes (18): bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex(), nodesOf() (+10 more)

### Community 100 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor first, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+7 more)

### Community 110 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.13
Nodes (15): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N) (+7 more)

### Community 111 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (14): 10. Node client and ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups, 16. Browser, 17. Library surface and gates (+6 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract, Scenario: An untouched address retains its initial value (+6 more)

### Community 115 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 118 - "ROADMAP.md"
Cohesion: 0.14
Nodes (9): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+1 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+5 more)

### Community 121 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 122 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 123 - "Roadmap"
Cohesion: 0.14
Nodes (14): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+6 more)

### Community 126 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 129 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 135 - "Design — Sprint 3: CheckpointStore"
Cohesion: 0.17
Nodes (11): 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 5. `history` — pagination, 6. Migration (`002_checkpoint_store.ts`) (+3 more)

### Community 136 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 137 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 139 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 141 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 144 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.20
Nodes (10): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 7. Driver / toolkit choice (+2 more)

### Community 145 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 146 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 147 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 149 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 151 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 152 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.20
Nodes (9): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Full-sync soak + load-under-prune (G10), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1) (+1 more)

### Community 153 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.20
Nodes (9): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover), 7. What this change deliberately does not verify (traceability of the non-goals), 8. Dependencies and sequencing (from `ROADMAP` §"Critical path"), Audit resolution (+1 more)

### Community 154 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 155 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 156 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 157 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 158 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 159 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 160 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 161 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 162 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding), 7. Testing strategy (post-implementation), Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 163 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 165 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 167 - "UmbraDB module guide"
Cohesion: 0.25
Nodes (7): Data that is not a function of the chain, Reading through `db`, Stored values and digests, Time values, UmbraDB module guide, Upgrades, Writing in callbacks

### Community 168 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 169 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 170 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 172 - "Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.25
Nodes (7): 0. Specification freeze, 1. Vendor/pin manifest (for the nightly live tier), 4. Pg-only conformance suite (required merge gate) — `test:conformance`, 5. Live preprod DB-sync + cold-boot tiers (nightly/labeled — NOT a required gate), 6. Close-out, Deferred to Sprint 9 (Batch 3 — recorded as honest deferrals, NOT implemented here), Tasks — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 173 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 174 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 175 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 176 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 177 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 178 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 179 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 180 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 181 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 182 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 183 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 184 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 185 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 186 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 190 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 191 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 192 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 193 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 194 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 195 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 196 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 197 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 198 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 199 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 200 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 201 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 203 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 204 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 205 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 206 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 207 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 208 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 209 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.40
Nodes (4): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Problem, Resolution, Suggested fix

### Community 210 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 211 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 212 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 213 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 214 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 215 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 216 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 217 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 218 - "Requirement: CI gates any change to flake.lock behind explicit review (G18)"
Cohesion: 0.50
Nodes (4): Requirement: CI gates any change to flake.lock behind explicit review (G18), Scenario: A labeled flake.lock change is allowed, Scenario: A pull request that does not touch flake.lock passes, Scenario: An unlabeled flake.lock change fails the gate

### Community 219 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 220 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 223 - "Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18)"
Cohesion: 0.67
Nodes (3): Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Scenario: A newly introduced secret outside the allowlist fails the scan, Scenario: The historical wallet secret and the template placeholder do not fail the scan

### Community 224 - "Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16)"
Cohesion: 0.67
Nodes (3): Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16), Scenario: The dedup and prune docs state the trust-domain requirement and the side channel, Scenario: The rewrite changes no contract and preserves existing accurate caveats

### Community 225 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 37 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 45 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+30 more)

### Community 49 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data responses name their view and height (+27 more)

### Community 57 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form (+25 more)

### Community 59 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 60 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (30): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+22 more)

### Community 61 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)` (+22 more)

### Community 62 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: CheckpointSummary metadata is populated and label round-trips, Requirement: Chunk storage is content-addressed and globally deduplicated (+22 more)

### Community 63 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18), Requirement: The localhost Require default is unchanged (G17), Requirement: The repository ships an ignore-scripts .npmrc that CI asserts (G18) (+22 more)

### Community 67 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 70 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 73 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: Schema isolation is the default, not opt-in, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+16 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: Schema isolation is the default, not opt-in, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+15 more)

### Community 83 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import (+13 more)

### Community 84 - "package.json"
Cohesion: 0.10
Nodes (20): description, engines, node, exports, files, homepage, license, main (+12 more)

### Community 87 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A bare numeric watermark value round-trips exactly, Scenario: A bare string watermark value round-trips exactly (+10 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.11
Nodes (19): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence, Requirement: the adapter round-trips SDK lifecycle detail so getAll yields schema-valid SDK entries (+11 more)

### Community 91 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.11
Nodes (18): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+10 more)

### Community 92 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (17): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest (+9 more)

### Community 94 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, archive:sync, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check (+10 more)

### Community 97 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 98 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.12
Nodes (12): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort (+4 more)

### Community 99 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.12
Nodes (15): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track A — Release contract (`openspec/changes/v1.0.0-api-surface`, merged `726f567`) (+7 more)

## Knowledge Gaps
- **33 isolated node(s):** `./tsconfig.json`, `RFC-3339`, `RFC-3339`, `RFC-8259`, `RFC-3339` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2239 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `db/migrate.ts`, `createClient`, `api.ts`, `describeNodeStoreExports`, `opt-out.test.ts`, `ref_node_crypto`, `interfaces/temporal-kv.ts`, `sync-service.ts`, `ValidationError`, `client.ts`, `translatePostgresError`, `declaration.ts`, `facade-merge-loader.ts`, `component-table.test.ts`, `dispatch.test.ts`, `loop.test.ts`, `order.property.test.ts`, `db/errors.ts`, `postgres/transaction-lease.ts`, `writer-lock-checks.ts`, `PgTransactionLeaseLayer`, `validate.test.ts`, `column-refusals.test.ts`, `zero-timeouts-checks.ts`, `column-rules.test.ts`, `postgres.ts`, `changes.property.test.ts`, `transaction-history-storage.property.test.ts`, `ref_node_fs`, `module-tables.ts`, `crash-worker.ts`, `checks.test.ts`, `validation.ts`, `cursor-durability.crash.test.ts`, `core-settings.test.ts`, `loop.ts`, `src/index.ts`, `cbor.property.test.ts`, `redact.test.ts`, `pg-tx-history-adapter.ts`, `typed-config.test.ts`, `vendored-ledger-files.test.ts`, `plain-data.test.ts`, `differential-equivalence.test.ts`, `check-required-tests.ts`, `load.test.ts`, `chain-archive-replay-decode.integration.test.ts`, `full-sync-soak.integration.test.ts`, `boundary.test.ts`, `vendored-ledger-v9.test.ts`, `package.json`, `CheckpointNotFoundError`, `5. Runner`, `write-handles.test.ts`, `cold-boot-recovery.integration.test.ts`, `load-under-prune.integration.test.ts`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `chain-archive-sync-retry.integration.test.ts`?**
  _High betweenness centrality (0.284) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `UmbraError` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`UmbraError` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `./tsconfig.json`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `db/migrate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03681592039800995 - nodes in this community are weakly interconnected._
- **Why does `runMigrations()` connect `runMigrations` to `db/migrate.ts`, `createClient`, `StorageError`, `interfaces/temporal-kv.ts`, `sync-service.ts`, `ValidationError`, `client.ts`, `translatePostgresError`, `postgres/chain-archive-store.ts`, `harness.ts`, `TransactionHandle`, `TemporalKV`, `PgTransactionLeaseLayer`, `crash-worker.ts`, `cursor-durability.crash.test.ts`, `UmbraDB 1.0.0 Release Contracts`, `src/index.ts`, `ADDED Requirements`, `Full-Chain Storage — Design`, `Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)`, `chain-archive-rollover.ts`, `.save`, `UmbraDB v0.9.5 "Penumbra" — Release Record`, `UmbraDB`, `chain-archive-sync-retry.integration.test.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.031484257871064465 - nodes in this community are weakly interconnected._