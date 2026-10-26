# Graph Report - UmbraDB

## Corpus Check
- 572 files · ~944,144 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 53 file(s) not represented in the graph (top: .lean 25, (none) 13, .patch 8)

## Summary
- 6032 nodes · 15244 edges · 255 communities (236 shown, 19 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 2245 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `f15f012184847c44` (572 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- UmbraError
- api.ts
- vitest
- postgres-image.test.ts
- checkShape
- translatePostgresError
- postgres/transaction-history-storage.ts
- plain-data.ts
- load-under-prune.integration.test.ts
- ClockRegressionError
- dispatch.test.ts
- catalog.ts
- connectWebSocket
- ModuleDeclaration
- 3. Proof-blocking findings
- no-indexer-or-wallet-sdk.test.ts
- config/history.ts
- development-opt-in.test.ts
- vendored-ledger-node-roots.test.ts
- FakeNode
- interfaces/temporal-kv.ts
- loop.test.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- roles.ts
- node/client.test.ts
- order.property.test.ts
- ReadPool
- mutation-evidence.d.mts
- columnVerdict
- StorageError
- runMigrations
- zero-timeouts-checks.ts
- HeldRead
- harness.ts
- CheckpointStore
- crash-worker.ts
- ValidationError
- setup.ts
- builders.test.ts
- column-rules.test.ts
- boundary.test.ts
- postgres/transaction-lease.ts
- ref_node_fs
- TransactionHandle
- column-rules.ts
- history-fixtures.ts
- writer-lock-checks.ts
- postgres/migrate.ts
- node/client.ts
- graph.ts
- PgTransactionLeaseLayer
- validate.test.ts
- core-settings.test.ts
- loop.ts
- validate.ts
- cursor-durability.crash.test.ts
- checks.test.ts
- opt-out.test.ts
- NodeClient
- decode.ts
- redact.test.ts
- transaction-history-storage.property.test.ts
- TemporalKV
- createClient
- src/index.ts
- TransactionHistoryStorage
- chain-archive-replay-decode.integration.test.ts
- differential-equivalence.test.ts
- FinalizedLoop
- ws-mutual-tls.test.ts
- check-required-tests.ts
- entries.ts
- api-server.test.ts
- pg-tx-history-adapter.ts
- cbor.ts
- chain-archive-rollover.ts
- describeNodeStoreExports
- PgTransactionHistoryStorage
- cold-boot-recovery.integration.test.ts
- mapping.ts
- PointName
- db/migrate.ts
- node-format.ts
- digest.test.ts
- cbor.property.test.ts
- full-sync-soak.integration.test.ts
- pglite-writer.worker.ts
- TransactionHistoryEntry
- pg-kill-save.crash.test.ts
- declaration.ts
- .head
- encodeRow
- .now
- .boolean
- Design — Sprint 7: Transaction History Storage
- mutation-per-adapter.mjs
- address
- history.property.test.ts
- facade-merge-loader.ts
- pack-install.mjs
- scoped-review-manifest
- .getAt
- notImmutableParts
- parseJsonLossless
- fresh-instance.mjs
- defaultReferences
- concatBytes
- Requirement: DT-4 Per-block changes of every module table
- .save
- graph.py
- context
- ADDED Requirements
- registerSuiteLifecycle
- vendored-ledger-v9.test.ts
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- T
- Requirements
- stryker.conf.json
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- scripts
- UmbraDB
- ADDED Requirements
- ADDED Requirements
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- devDependencies
- Roadmap
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Design — Postgres+JSONB storage rebuild
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- ROADMAP.md
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Design — CORE-ARCH: the standalone indexer's core architecture
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- 3. Live-node/indexer confirmation
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- UmbraDB 1.0.0 Release Contracts
- Global Constraints
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Acceptance criteria — v1.0.0-infosec-signoff
- Repository agent policy
- Our Pledge
- Midnight infra verification checklist
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 12. Milestone status
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Proposal — Sprint 7: Transaction History Storage (Wallet Integration Surface)
- Tasks — v1.0.0-perf-baseline
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.1.0: Quint model checking
- dependencies
- Midnight Foundation Security Policy
- lib.sh
- 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists
- 00002 — Most OpenSpec proposals carry a stale or non-standard status line
- 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"
- 00005 — The supply-chain inventory's npm graph figures and dev table are stale
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- GC architecture and query-tracing: research findings
- PULL_REQUEST_CHECKLIST.md
- UmbraDB Postgres Schema Reference
- documentation-improvement.md
- Overview
- Requirement: CI gates any change to flake.lock behind explicit review (G18)
- Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference
- Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence
- Spec — capability `formal-completion`
- renovate.json
- Vendored ledger builds
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
- bugs
- engines
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- package.json
- Storage Algebra Lean Formalization — Approved Design and Status

## God Nodes (most connected - your core abstractions)
1. `vitest` - 159 edges
2. `UmbraError` - 151 edges
3. `PgTransactionLeaseLayer` - 93 edges
4. `ValidationError` - 87 edges
5. `PgCheckpointStore` - 87 edges
6. `runMigrations()` - 86 edges
7. `translatePostgresError()` - 78 edges
8. `ModuleDeclaration` - 71 edges
9. `StorageError` - 70 edges
10. `TransactionHandle` - 70 edges

## Surprising Connections (you probably didn't know these)
- `Phase F1 — Close the absent *abstract* laws (tractable now; highest value)` --references--> `Key`  [INFERRED]
  Formal/FORMALIZATION_ROADMAP.md → src/interfaces/temporal-kv.ts
- `Rework (class 1 — infra)` --references--> `ConnectionError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/storage-errors.ts
- `2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2)` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/v1.0.0-recovery-testing/tasks.md → src/interfaces/storage-errors.ts
- `3.2 Lifecycle-detail fidelity — the correctness-gate open question` --references--> `SerializationFailedError`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → src/interfaces/storage-errors.ts
- `3. PgTransactionHistoryStorage implementation` --references--> `StorageError`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/tasks.md → src/interfaces/storage-errors.ts

## Import Cycles
- None detected.

## Communities (255 total, 19 thin omitted)

### Community 0 - "UmbraError"
Cohesion: 0.04
Nodes (75): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, ReadTimeoutSetting, MultiStatementRunner, Job, JobQueue (+67 more)

### Community 1 - "api.ts"
Cohesion: 0.03
Nodes (73): ConfiguredDatabase, ConfiguredDatabaseOptions, CommittedHeight, Database, ReadOnlyDatabase, ReadOptions, PgliteOptions, PostgresOptions (+65 more)

### Community 10 - "vitest"
Cohesion: 0.05
Nodes (64): BlockWriteHandle, CaptureColumn, CapturedTable, CaptureState, SchemaPlan, Chain, ChainOptions, DigestRow (+56 more)

### Community 101 - "postgres-image.test.ts"
Cohesion: 0.12
Nodes (12): RepositoryFile, LockResult, canPin(), pinViolations(), repositoryFiles(), kill(), files, HASH_COMMENTED (+4 more)

### Community 108 - "checkShape"
Cohesion: 0.27
Nodes (9): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), Requirement: the envelope module has no wallet-SDK runtime import (+1 more)

### Community 11 - "translatePostgresError"
Cohesion: 0.05
Nodes (51): BlobIntegrityError, BlobMissingError, BlobRole, BlockBundle, BlockMeta, BlockNotFoundError, BlockRecord, BlockStatus (+43 more)

### Community 111 - "postgres/transaction-history-storage.ts"
Cohesion: 0.21
Nodes (15): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+7 more)

### Community 115 - "plain-data.ts"
Cohesion: 0.23
Nodes (14): PlainArray, PlainDataNode, PlainDataRule, Walk, copyArray(), copyObject(), instanceOf(), integer() (+6 more)

### Community 116 - "load-under-prune.integration.test.ts"
Cohesion: 0.14
Nodes (13): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), runUnSnapshottedReadUnderPrune(), seedCheckpoints() (+5 more)

### Community 117 - "ClockRegressionError"
Cohesion: 0.15
Nodes (13): ClockRegressionError, `CLOCK_REGRESSION` is conditional, not uniformly non-retryable, The retryable set, 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+5 more)

### Community 12 - "dispatch.test.ts"
Cohesion: 0.05
Nodes (67): EntryRange, GraphInput, ApiRequest, PastFaultCase, RefusalCase, Contexts, Shaped, migrationPart() (+59 more)

### Community 128 - "catalog.ts"
Cohesion: 0.18
Nodes (13): CatalogColumn, CatalogOptions, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference, defaultCatalog() (+5 more)

### Community 129 - "connectWebSocket"
Cohesion: 0.19
Nodes (8): NodeSocketEvents, connectWebSocket(), DEFAULT_HEARTBEAT_MS, ws, 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 13 - "ModuleDeclaration"
Cohesion: 0.05
Nodes (47): ModuleDeclaration, Revision, GraphFacts, ResolvedGraph, PlacedDeclaration, StartedModuleApi, MisuseListener, ProcessContexts (+39 more)

### Community 131 - "3. Proof-blocking findings"
Cohesion: 0.15
Nodes (13): Absent, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces (+5 more)

### Community 132 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 14 - "config/history.ts"
Cohesion: 0.06
Nodes (67): CoreVersion, HistoryCheck, HistoryCode, HistoryContext, HistoryFinding, HistoryInput, HistoryOptions, HistoryRow (+59 more)

### Community 144 - "development-opt-in.test.ts"
Cohesion: 0.21
Nodes (9): databaseTarget, databaseOptions(), openConfiguredDatabase(), load(), resolve(), build(), CONFIG, MODULES (+1 more)

### Community 146 - "vendored-ledger-node-roots.test.ts"
Cohesion: 0.20
Nodes (10): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, runInFreshInstance(), fixtures, packages (+2 more)

### Community 15 - "interfaces/temporal-kv.ts"
Cohesion: 0.06
Nodes (57): AsOf, AssertExact, HistoryUnavailableError, JsonValue, Key, Namespace, Scope, TemporalKVError (+49 more)

### Community 16 - "loop.test.ts"
Cohesion: 0.05
Nodes (51): InMemoryBlockSource, HeightRun, Batching, LoopClass, RunnerDatabase, Broken, Lost, Seen (+43 more)

### Community 167 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 17 - "roles.ts"
Cohesion: 0.05
Nodes (52): SchemaWriteHandle, MigrationPart, Difference, PlannedSchema, Provision, QualifiedTable, SchemaItem, SchemaMigration (+44 more)

### Community 18 - "node/client.test.ts"
Cohesion: 0.05
Nodes (39): NodeClientOptions, ConnectSocket, NodeTimers, Answer, Handler, Received, recorded, ManualTimers (+31 more)

### Community 19 - "order.property.test.ts"
Cohesion: 0.07
Nodes (56): HeightRange, Callback, EntryBoundary, ParallelPoint, PointRun, PointSchedule, Recorder, CheckName (+48 more)

### Community 194 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 195 - "columnVerdict"
Cohesion: 0.29
Nodes (7): columnVerdict, becauseOf(), numericScale(), refusalOfTypeName(), ruleOf(), becauseOf(), verdictOf()

### Community 2 - "StorageError"
Cohesion: 0.03
Nodes (107): ConnectionError, Retryability, SerializationFailedError, StorageError, TransactionKeyReuseError, DurabilityContractError, TransactionPoolerDetectedError, ExclusionViolationError (+99 more)

### Community 20 - "runMigrations"
Cohesion: 0.05
Nodes (56): UmbraDBConnectionOptions, runMigrations(), 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 3. `synchronous_commit` — probe-warned, never refused, 4. Session-mode connection pooling only — probe-enforced (best-effort), 5. Server-side timeouts — applied by `createClient` (documented), Summary (+48 more)

### Community 21 - "zero-timeouts-checks.ts"
Cohesion: 0.06
Nodes (39): Settings, Run, Job, WorkerEvent, Outcome, pgliteNeedsDevelopmentOptIn(), openPglite(), openBlockWrites() (+31 more)

### Community 214 - "HeldRead"
Cohesion: 0.60
Nodes (3): HeldRead, concurrent(), queued()

### Community 22 - "harness.ts"
Cohesion: 0.09
Nodes (46): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+38 more)

### Community 23 - "CheckpointStore"
Cohesion: 0.06
Nodes (47): CheckpointStore, EnvelopeCorruptError, EnvelopeVersionUnsupportedError, WalletStateEnvelope, WalletStateEnvelopeError, decode(), encode(), splitChunks() (+39 more)

### Community 24 - "crash-worker.ts"
Cohesion: 0.06
Nodes (42): WatermarkKey, WatermarkKind, Watermarks, WatermarkValue, WatermarkRow, CoTxCallable, CoTxPauseInfo, CrashHook (+34 more)

### Community 25 - "ValidationError"
Cohesion: 0.05
Nodes (50): ValidationError, UnrecognizedPostgresError, exceedsMaxDepth(), EntrySectionsSchema, 3. Replay convergence is judged on CURRENT state, 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position (+42 more)

### Community 26 - "setup.ts"
Cohesion: 0.06
Nodes (50): Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount() (+42 more)

### Community 27 - "builders.test.ts"
Cohesion: 0.06
Nodes (37): CoreLedgerVersion, LedgerName, LedgerPackageIdentity, TestKey, LoadedConfig, LoadOptions, plainData, Accepts (+29 more)

### Community 28 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (24): Because, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+16 more)

### Community 29 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 3 - "postgres/transaction-lease.ts"
Cohesion: 0.04
Nodes (96): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionFaultError, TransactionLeaseError, TransactionOptions (+88 more)

### Community 30 - "ref_node_fs"
Cohesion: 0.06
Nodes (26): Finding, Upstream, GuardViolation, filesUnder(), patchesOf(), patchText(), extractStringLiterals(), findChainSyncViolations() (+18 more)

### Community 31 - "TransactionHandle"
Cohesion: 0.07
Nodes (39): TransactionHistoryReader, TransactionHistoryWriter, TransactionHandle, TransactionHandleInvalidError, resolveTransaction(), Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Scenario: Passing a transaction handle throws before any query runs, 2. The transaction-handle registry (the one new design decision this sprint makes) (+31 more)

### Community 33 - "column-rules.ts"
Cohesion: 0.05
Nodes (46): AllowedRule, DesignRow, PlacedRefusal, RefusalCode, RefusalOptions, RefusedRule, RelationFacts, RuleBase (+38 more)

### Community 34 - "history-fixtures.ts"
Cohesion: 0.08
Nodes (40): versionEntry, AppliedMigration, Started, StartupOptions, defineModule(), builtWith100(), m(), recorded() (+32 more)

### Community 35 - "writer-lock-checks.ts"
Cohesion: 0.11
Nodes (35): WriterProcess, WorkerEvent, PauseReport, startWriter(), blocksIn(), cleanUp(), firstOf(), startWriterProcess() (+27 more)

### Community 36 - "postgres/migrate.ts"
Cohesion: 0.08
Nodes (25): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, RunMigrationsOptions, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites() (+17 more)

### Community 37 - "node/client.ts"
Cohesion: 0.07
Nodes (31): Connection, HeadSubscriber, NodeCallOptions, NodeRetry, NodeSubscription, State, Subscription, Waiter (+23 more)

### Community 39 - "graph.ts"
Cohesion: 0.09
Nodes (41): Edge, GraphPart, GraphRule, MidChain, Missing, RangeFacts, ResolvedRange, Spanned (+33 more)

### Community 4 - "PgTransactionLeaseLayer"
Cohesion: 0.04
Nodes (85): BenchEnv, Rollback, TransactionLeaseLayer, PgCheckpointStore, UmbraDBSql, SaveAndAdvanceCursor, SaveAndAdvanceDeps, PgTemporalKV (+77 more)

### Community 40 - "validate.test.ts"
Cohesion: 0.07
Nodes (33): ProcessSide, coreEntry, ConfigContext, ConfigInput, ConfigRule, EntryRef, DeclarationSet, CursorRow (+25 more)

### Community 41 - "core-settings.test.ts"
Cohesion: 0.06
Nodes (32): PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly, hexBytes() (+24 more)

### Community 45 - "loop.ts"
Cohesion: 0.10
Nodes (19): LateUse, BlockRef, BlockSource, InMemorySourceOptions, Wait, Invoke, LoopInput, ReadOpener (+11 more)

### Community 46 - "validate.ts"
Cohesion: 0.11
Nodes (36): redactor, CursorRule, Finding, Issue, Plain, SettingsSchema, coreSettingsSchema(), closest() (+28 more)

### Community 47 - "cursor-durability.crash.test.ts"
Cohesion: 0.07
Nodes (28): InvariantResult, CrashWorkerHandle, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs(), durableKvValues(), itemKey() (+20 more)

### Community 48 - "checks.test.ts"
Cohesion: 0.08
Nodes (23): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql() (+15 more)

### Community 5 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (72): CanonicalEncodingError, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, ModuleTableOptions, PageOptions, CatalogTable (+64 more)

### Community 50 - "NodeClient"
Cohesion: 0.16
Nodes (8): NodeClient, Pending, connectionFailure, NodeMethod, clientClosed(), SYSTEM_TIMERS, Process items and APIs, 10. Node client and ingest

### Community 51 - "decode.ts"
Cohesion: 0.15
Nodes (23): NodeBlock, NodeRuntimeVersion, blockAnswer(), byteArrayAnswer(), bytesAnswer(), bytesListAnswer(), bytesParameter(), countParameter() (+15 more)

### Community 52 - "redact.test.ts"
Cohesion: 0.11
Nodes (24): PlainObject, RedactableConfig, RedactionForms, SecretForm, TextPattern, EntryView, fieldKinds, Needs (+16 more)

### Community 54 - "transaction-history-storage.property.test.ts"
Cohesion: 0.07
Nodes (23): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), decodeSerializedContent(), decodeSerializedEntry(), store() (+15 more)

### Community 56 - "TemporalKV"
Cohesion: 0.08
Nodes (26): TemporalKV, 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 4. `PgTemporalKV` adapter (`src/postgres/temporal-kv.ts`), 4a. Error translation (`src/postgres/errors.ts`), 5. Test infrastructure (+18 more)

### Community 59 - "createClient"
Cohesion: 0.17
Nodes (14): BlockRow, TxRow, overridingUrlParameter(), assertNoConflictingSearchPath(), createClient(), bundleFixture(), makeBlock(), DEFAULT_IDLE_IN_TX_TIMEOUT_MS (+6 more)

### Community 6 - "src/index.ts"
Cohesion: 0.04
Nodes (89): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError, ChunkMissingError (+81 more)

### Community 60 - "TransactionHistoryStorage"
Cohesion: 0.09
Nodes (26): TransactionHistoryStorage, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation), Build (one product module + one thin envelope — corrected from the original "exactly two things, zero new code" framing; see finding below), Do not build (obsoleted — confirmed against real source) (+18 more)

### Community 61 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.12
Nodes (25): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, bootstrapChainArchiveSchema() (+17 more)

### Community 62 - "differential-equivalence.test.ts"
Cohesion: 0.13
Nodes (25): Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1(), injectT2() (+17 more)

### Community 64 - "FinalizedLoop"
Cohesion: 0.16
Nodes (6): FinalizedLoop, WaitingInRead, ComputeAtH, FailingAfter, call(), runFinalized()

### Community 65 - "ws-mutual-tls.test.ts"
Cohesion: 0.09
Nodes (20): Lockfile, Manifest, Attempt, locked(), connect(), file(), makeCa(), makeLeaf() (+12 more)

### Community 67 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 68 - "entries.ts"
Cohesion: 0.09
Nodes (26): CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+18 more)

### Community 7 - "api-server.test.ts"
Cohesion: 0.04
Nodes (72): Connection, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, ChainDataAnswer, ChainDataView, ApiError, ApiErrorCode (+64 more)

### Community 71 - "pg-tx-history-adapter.ts"
Cohesion: 0.12
Nodes (21): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+13 more)

### Community 72 - "cbor.ts"
Cohesion: 0.09
Nodes (22): ColumnMode, DateTimeFields, Mode, PathNode, Task, ScalarColumnType, compareBytes(), daysInMonth() (+14 more)

### Community 73 - "chain-archive-rollover.ts"
Cohesion: 0.12
Nodes (22): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+14 more)

### Community 74 - "describeNodeStoreExports"
Cohesion: 0.15
Nodes (12): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), 5.1 The `LedgerPackage` interface (LG-6), 5.2 Vendored builds (LG-5), 5.3 The ledger worker and the node-store bridge (LG-10, LG-11), 5.4 Storage, retention and sweep (LG-11 to LG-14) (+4 more)

### Community 75 - "PgTransactionHistoryStorage"
Cohesion: 0.12
Nodes (21): MergeEntriesFn, PgTransactionHistoryStorage, Requirement: one storage instance is bound to exactly one wallet at construction, Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends, Scenario: Two instances constructed for different wallets never see each other's rows, 3.1 Field mapping (write path), 3.2 Lifecycle-detail fidelity — the correctness-gate open question (+13 more)

### Community 77 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.18
Nodes (20): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), makeAdapter(), isPlainObject() (+12 more)

### Community 78 - "mapping.ts"
Cohesion: 0.13
Nodes (23): ResultColumn, ResultType, arrayLiteral(), hexOf(), isInfinity(), malformed(), malformedArray(), parseArrayText() (+15 more)

### Community 79 - "PointName"
Cohesion: 0.12
Nodes (14): ItemSink, PointName, BlockItems, CallbackFailure, HeightFailure, Misuse, SeenCall, EagerItems (+6 more)

### Community 8 - "db/migrate.ts"
Cohesion: 0.05
Nodes (75): Transaction, AppliedRow, Runnable, Settling, StartupInput, BlockWrites, Point, WriteHandleOptions (+67 more)

### Community 80 - "node-format.ts"
Cohesion: 0.19
Nodes (18): Child, Reader, childKey(), concat(), decodeChild(), decodeChildren(), encodeChild(), encodeChildren() (+10 more)

### Community 82 - "digest.test.ts"
Cohesion: 0.12
Nodes (23): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+15 more)

### Community 83 - "cbor.property.test.ts"
Cohesion: 0.12
Nodes (23): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, checkCanonical(), compareBytes() (+15 more)

### Community 84 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (11): GcPass, HistGroup, SampleObservation, kvMapKey(), newPool(), readCurrentState(), { connectionUri }, DECLARED_ENVELOPE (+3 more)

### Community 85 - "pglite-writer.worker.ts"
Cohesion: 0.16
Nodes (17): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor() (+9 more)

### Community 86 - "TransactionHistoryEntry"
Cohesion: 0.17
Nodes (5): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize()

### Community 88 - "pg-kill-save.crash.test.ts"
Cohesion: 0.11
Nodes (19): C5AnyFn, assertSaveNotAutoRetriedUnderRetriableFault(), assertSaveNotInAnyAutoRetryAllowlist(), completeManifestCount(), completeManifestCountAtSeq(), danglingChunkCount(), listSrcTsFiles(), makeSerializationFaultInjectingClient() (+11 more)

### Community 9 - "declaration.ts"
Cohesion: 0.03
Nodes (68): ReadHandle, OwnPart, ApiRegistry, BlockContext, BlockHeader, DefinedModule, FieldKind, FieldSchema (+60 more)

### Community 91 - ".head"
Cohesion: 0.25
Nodes (15): Writer, checkSafeInteger(), encodeArrayHead(), encodeColumnScalar(), encodeGeneric(), encodeOne(), enter(), fail() (+7 more)

### Community 92 - "encodeRow"
Cohesion: 0.14
Nodes (18): CanonicalEncodingFailure, CanonicalValue, encodeCanonical(), encodeRow(), render(), run(), compareKeys(), expectedChanges() (+10 more)

### Community 94 - ".now"
Cohesion: 0.13
Nodes (16): For historical reference only, Tasks — superseded by per-sprint openspec changes, Data that is not a function of the chain, Reading through `db`, Stored values and digests, Time values, UmbraDB module guide, Upgrades (+8 more)

### Community 112 - ".boolean"
Cohesion: 0.14
Nodes (14): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Map key order (+6 more)

### Community 118 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.13
Nodes (13): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 5. WalletState envelope, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier (+5 more)

### Community 123 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 133 - "address"
Cohesion: 0.18
Nodes (12): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Requirement: Set is an unconditional overwrite at the exact address, Scenario: A later value wins at the same address, Scenario: Abstract absence remains distinct from a stored null-like value (+4 more)

### Community 136 - "history.property.test.ts"
Cohesion: 0.23
Nodes (10): samePlainData(), changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+2 more)

### Community 145 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 152 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 153 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (9): explain(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest (+1 more)

### Community 174 - ".getAt"
Cohesion: 0.25
Nodes (5): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why, Performance

### Community 196 - "notImmutableParts"
Cohesion: 0.29
Nodes (7): listed(), notImmutableParts(), parseExpressionTree(), tokenize(), does(), parts(), references()

### Community 200 - "parseJsonLossless"
Cohesion: 0.40
Nodes (5): parseJsonLossless(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 210 - "fresh-instance.mjs"
Cohesion: 0.40
Nodes (4): hex(), requested, store, stored

### Community 212 - "defaultReferences"
Cohesion: 0.47
Nodes (6): checkedOid(), childOf(), defaultReferences(), listOf(), tokenOf(), typeOf()

### Community 213 - "concatBytes"
Cohesion: 0.33
Nodes (6): sha256(), text(), sha256(), text(), concatBytes(), sha256()

### Community 229 - "Requirement: DT-4 Per-block changes of every module table"
Cohesion: 0.50
Nodes (4): insert(), Requirement: DT-4 Per-block changes of every module table, Scenario: Insert then update in one block, Scenario: Rewriting the same value

### Community 32 - ".save"
Cohesion: 0.04
Nodes (46): validateSaveOptions(), ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: CheckpointSummary metadata is populated and label round-trips (+38 more)

### Community 42 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 49 - "context"
Cohesion: 0.07
Nodes (22): schemaName(), module(), context(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 66 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+17 more)

### Community 81 - "registerSuiteLifecycle"
Cohesion: 0.09
Nodes (19): class2AdvisoryLockCountForHash(), pollForLockGone(), pool(), sleep(), worker(), registerSuiteLifecycle(), kv(), store() (+11 more)

### Community 87 - "vendored-ledger-v9.test.ts"
Cohesion: 0.23
Nodes (18): bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex(), nodesOf() (+10 more)

### Community 95 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.11
Nodes (17): startTestDatabase(), 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix, 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling) (+9 more)

### Community 96 - "T"
Cohesion: 0.12
Nodes (18): T(), 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model (+10 more)

### Community 100 - "Requirements"
Cohesion: 0.11
Nodes (17): Purpose, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Schema isolation is the default, not opt-in, Requirements, Scenario: A custom schema is honored end to end (+9 more)

### Community 102 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 103 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.12
Nodes (12): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort (+4 more)

### Community 104 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Schema isolation is the default, not opt-in, Scenario: A custom schema is honored end to end, Scenario: A migration failure does not partially apply (+8 more)

### Community 106 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (16): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+8 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 109 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 110 - "UmbraDB"
Cohesion: 0.12
Nodes (17): CheckpointStore: content-addressed snapshots, Contents, Errors and retryability, License, Performance and ceilings, Schema and migrations, Security, Status (+9 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor first, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+7 more)

### Community 119 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.13
Nodes (15): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N) (+7 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract, Scenario: An untouched address retains its initial value (+6 more)

### Community 121 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 122 - "Roadmap"
Cohesion: 0.13
Nodes (15): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`) (+7 more)

### Community 124 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 125 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+5 more)

### Community 126 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 127 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (13): 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups, 16. Browser, 17. Library surface and gates, 18. Whole-system faults, differentials and measurements (+5 more)

### Community 130 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note), Scenario: A pending entry clears against a finalized entry whose identifiers grew via two prior merges, Scenario: A pending entry does not clear when its identifiers are not a subset (+4 more)

### Community 137 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.17
Nodes (12): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`) (+4 more)

### Community 138 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.17
Nodes (10): 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, UmbraDB v0.9.5 "Penumbra" — Release Record, UmbraDB v1.0.0 — Release Record (PENDING) (+2 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 141 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 142 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 143 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 148 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 149 - "ROADMAP.md"
Cohesion: 0.18
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 150 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.18
Nodes (10): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding) (+2 more)

### Community 151 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 154 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 155 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 156 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.20
Nodes (9): 10. Tables, 11. Refusals and halts (IN-12), 14. External claims and their evidence, 15. Relation to the existing design documents, 8. Private processes (PP), 9.1 Backups (BK; Q83, Q85), 9.2 Browser build (BR), 9. Backups and browser (+1 more)

### Community 157 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 158 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 159 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 160 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 161 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 162 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 163 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 164 - "3. Live-node/indexer confirmation"
Cohesion: 0.22
Nodes (9): 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs, 3.5 Dust generation + ledger events (generic), 3.6 Contract state/actions — confirmed absent, not confirmed present, 3.7 Governance / bridge, 3.8 SPO/staking (+1 more)

### Community 165 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 166 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 168 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 169 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 170 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 171 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 172 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 173 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 175 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.25
Nodes (8): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 4. Save-retry caveat, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 176 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 177 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 178 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 179 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 180 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 182 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 183 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 184 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 185 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 186 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 187 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 188 - "Proposal — Sprint 7: Transaction History Storage (Wallet Integration Surface)"
Cohesion: 0.29
Nodes (6): Impact, Non-goals, Proposal — Sprint 7: Transaction History Storage (Wallet Integration Surface), What changes, Why, Why this sprint is numbered 7, not 5

### Community 189 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.29
Nodes (6): 1. G13 — perf-correctness fixes (LAND FIRST), 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 190 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 191 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 193 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 197 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 198 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 199 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 201 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 202 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 203 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), What changes, Why

### Community 204 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 205 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 206 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 207 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 208 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 209 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 211 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 215 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 216 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 217 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 218 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 219 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 220 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 221 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 222 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 223 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 224 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 225 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 226 - "UmbraDB Postgres Schema Reference"
Cohesion: 0.50
Nodes (4): Boundary enforcement, How the two lineages coexist, Table of contents, UmbraDB Postgres Schema Reference

### Community 227 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 228 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 230 - "Requirement: CI gates any change to flake.lock behind explicit review (G18)"
Cohesion: 0.50
Nodes (4): Requirement: CI gates any change to flake.lock behind explicit review (G18), Scenario: A labeled flake.lock change is allowed, Scenario: A pull request that does not touch flake.lock passes, Scenario: An unlabeled flake.lock change fails the gate

### Community 231 - "Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference"
Cohesion: 0.50
Nodes (4): Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Scenario: fault-schedule end state matches the fault-free reference on current state, Scenario: negative control — a dropped range makes the equivalence assertion fire, Scenario: the differential gate imports no foreign consumer application

### Community 232 - "Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence"
Cohesion: 0.50
Nodes (4): Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Scenario: the evidence run is not a required CI gate, Scenario: the pre-tag run resumes from the durable cursor with no resync or drift, Scenario: the run's evidence is recorded as a release artifact

### Community 233 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 234 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 235 - "Vendored ledger builds"
Cohesion: 0.50
Nodes (3): Rebuilding, Updating a version, Vendored ledger builds

### Community 238 - "Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18)"
Cohesion: 0.67
Nodes (3): Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Scenario: A newly introduced secret outside the allowlist fails the scan, Scenario: The historical wallet secret and the template placeholder do not fail the scan

### Community 239 - "Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16)"
Cohesion: 0.67
Nodes (3): Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16), Scenario: The dedup and prune docs state the trust-domain requirement and the side channel, Scenario: The rewrite changes no contract and preserves existing accurate caveats

### Community 240 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 38 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 43 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+30 more)

### Community 44 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data responses name their view and height (+30 more)

### Community 53 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 55 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (28): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+20 more)

### Community 57 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)` (+22 more)

### Community 58 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18), Requirement: The localhost Require default is unchanged (G17), Requirement: The repository ships an ignore-scripts .npmrc that CI asserts (G18) (+22 more)

### Community 63 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 70 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form, Requirement: G9/T3 — a killed lease-holder does not wedge the lease, Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data (+17 more)

### Community 89 - "Full-Chain Storage — Design"
Cohesion: 0.10
Nodes (20): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer") (+12 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 93 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A bare numeric watermark value round-trips exactly, Scenario: A bare string watermark value round-trips exactly (+10 more)

### Community 98 - "package.json"
Cohesion: 0.11
Nodes (18): description, exports, files, homepage, license, main, name, type (+10 more)

### Community 99 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.11
Nodes (18): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+10 more)

## Knowledge Gaps
- **36 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2347 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `UmbraError`, `api.ts`, `StorageError`, `postgres/transaction-lease.ts`, `PgTransactionLeaseLayer`, `opt-out.test.ts`, `src/index.ts`, `no-indexer-or-wallet-sdk.test.ts`, `history.property.test.ts`, `db/migrate.ts`, `declaration.ts`, `translatePostgresError`, `dispatch.test.ts`, `api-server.test.ts`, `config/history.ts`, `interfaces/temporal-kv.ts`, `development-opt-in.test.ts`, `roles.ts`, `vendored-ledger-node-roots.test.ts`, `node/client.test.ts`, `facade-merge-loader.ts`, `zero-timeouts-checks.ts`, `ModuleDeclaration`, `CheckpointStore`, `crash-worker.ts`, `loop.test.ts`, `setup.ts`, `builders.test.ts`, `column-rules.test.ts`, `boundary.test.ts`, `ref_node_fs`, `history-fixtures.ts`, `writer-lock-checks.ts`, `postgres/migrate.ts`, `node/client.ts`, `validate.test.ts`, `core-settings.test.ts`, `loop.ts`, `cursor-durability.crash.test.ts`, `checks.test.ts`, `redact.test.ts`, `transaction-history-storage.property.test.ts`, `createClient`, `chain-archive-replay-decode.integration.test.ts`, `differential-equivalence.test.ts`, `ws-mutual-tls.test.ts`, `check-required-tests.ts`, `pg-tx-history-adapter.ts`, `cold-boot-recovery.integration.test.ts`, `node-format.ts`, `registerSuiteLifecycle`, `digest.test.ts`, `cbor.property.test.ts`, `full-sync-soak.integration.test.ts`, `vendored-ledger-v9.test.ts`, `pg-kill-save.crash.test.ts`, `encodeRow`, `order.property.test.ts`, `package.json`, `postgres-image.test.ts`, `load-under-prune.integration.test.ts`, `mutation-per-adapter.mjs`?**
  _High betweenness centrality (0.280) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `UmbraError` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`UmbraError` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.03524904214559387 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `api.ts`, `opt-out.test.ts`, `api-server.test.ts`, `db/migrate.ts`, `declaration.ts`, `vitest`, `dispatch.test.ts`, `ModuleDeclaration`, `config/history.ts`, `development-opt-in.test.ts`, `roles.ts`, `node/client.test.ts`, `loop.test.ts`, `zero-timeouts-checks.ts`, `builders.test.ts`, `history-fixtures.ts`, `writer-lock-checks.ts`, `node/client.ts`, `graph.ts`, `validate.test.ts`, `loop.ts`, `validate.ts`, `checks.test.ts`, `NodeClient`, `decode.ts`, `FinalizedLoop`, `entries.ts`, `cbor.ts`, `mapping.ts`, `pglite-writer.worker.ts`, `checkShape`, `plain-data.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03186515748031496 - nodes in this community are weakly interconnected._