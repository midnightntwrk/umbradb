# Graph Report - UmbraDB

## Corpus Check
- 563 files · ~917,992 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 53 file(s) not represented in the graph (top: .lean 25, (none) 13, .patch 8)

## Summary
- 5838 nodes · 14569 edges · 252 communities (232 shown, 20 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 2217 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `1bd88ec36dd8bc06` (563 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- translatePostgresError
- postgres/checkpoint-store.ts
- StorageError
- ref_node_child_process
- setup.ts
- read-only-database.test.ts
- checks.test.ts
- chain-archive-rollover.ts
- postgres.ts
- plain-data.ts
- load-under-prune.integration.test.ts
- roles.ts
- 3. Proof-blocking findings
- no-indexer-or-wallet-sdk.test.ts
- fresh-instance.ts
- db/errors.ts
- FakeNode
- chain.ts
- declaration.ts
- postgres-image.test.ts
- node/client.test.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- TemporalKV
- interfaces/temporal-kv.ts
- ReadPool
- mutation-evidence.d.mts
- UmbraError
- vendored-ledger-files.test.ts
- runMigrations
- CheckpointStore
- createClient
- loop.ts
- ref_node_path
- Waiter
- zero-timeouts-checks.ts
- boundary.test.ts
- order.property.test.ts
- PgTransactionHistoryStorage
- ValidationError
- change-capture.ts
- column-rules.ts
- cbor.ts
- history-startup.ts
- changes.property.test.ts
- history.test.ts
- writer-lock-checks.ts
- graph.ts
- checkShape
- ref_node_crypto
- validate.test.ts
- loop.test.ts
- node/client.ts
- postgres/migrate.ts
- config/history.ts
- validate.ts
- entries.ts
- interfaces/transaction-history-storage.ts
- cursor-durability.crash.test.ts
- core-settings.test.ts
- vitest
- postgres/client.ts
- cbor.property.test.ts
- validation.ts
- redact.test.ts
- NodeClient
- pg-tx-history-adapter.ts
- FinalizedLoop
- ws-mutual-tls.test.ts
- PgTransactionLeaseLayer
- chain-archive-replay-decode.integration.test.ts
- differential-equivalence.test.ts
- pglite-processes.ts
- api.ts
- vendored-ledger-v9.test.ts
- check-required-tests.ts
- ChainArchiveStore
- TransactionHistoryEntry
- fixtures.ts
- PgChainArchiveStore
- node-format.ts
- src/index.ts
- ref_node_fs
- digest.test.ts
- connectWebSocket
- full-sync-soak.integration.test.ts
- describeNodeStoreExports
- opt-out.test.ts
- postgres/chain-archive-store.ts
- ReadHandle
- What changes — the 1.0.0 gate items this change addresses
- transaction-history-storage.property.test.ts
- .now
- mutation-per-adapter.mjs
- Design — Sprint 7: Transaction History Storage
- Algebraic Specification of the midnight-pg-store Storage Layer
- address
- history.property.test.ts
- facade-merge-loader.ts
- pack-install.mjs
- lease-nonwedge.crash.test.ts
- 001_chain_archive_core.ts
- watermarks.property.test.ts
- graph.py
- context
- cold-boot-recovery.integration.test.ts
- decode.ts
- ADDED Requirements
- T
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- scripts
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ADDED Requirements
- UmbraDB V1.0.0 Implementation Guideline
- Design — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- devDependencies
- ROADMAP.md
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- UmbraDB
- Roadmap
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.0.0-infosec-signoff
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Global Constraints
- Storage Algebra Lean M3a Watermarks Sprint
- Security policy & threat model
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Proposal — Sprint 1: project setup + TemporalKV
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
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network
- Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data
- GC architecture and query-tracing: research findings
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- 2. Schema — two corrections to `design/design.md` §3
- Proposal — v1.0.0 API Surface & Release Contract
- Requirement: CI gates any change to flake.lock behind explicit review (G18)
- Acceptance criteria — v1.0.0-perf-baseline
- Spec — capability `formal-completion`
- renovate.json
- Vendored ledger builds
- Environment changelog
- start-stack.sh
- Requirement: prune retains exactly the N newest complete manifests per wallet+network
- Requirement: set is an idempotent, unconditional overwrite (Law W1)
- Requirement: package.json is publishable with a strict exports map and no deep-import escape hatch
- Requirement: The 1.0.0 Lean cut-line is frozen with a written deferral
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
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Storage Algebra Lean Formalization — Approved Design and Status
- Requirements
- ADDED Requirements
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- Design — Postgres+JSONB storage rebuild
- package.json

## God Nodes (most connected - your core abstractions)
1. `vitest` - 154 edges
2. `UmbraError` - 143 edges
3. `PgTransactionLeaseLayer` - 93 edges
4. `ValidationError` - 87 edges
5. `PgCheckpointStore` - 87 edges
6. `runMigrations()` - 86 edges
7. `translatePostgresError()` - 78 edges
8. `StorageError` - 70 edges
9. `PgTransactionHistoryStorage` - 70 edges
10. `TransactionHandle` - 70 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: A transaction-key-reuse violation surfaces as TransactionKeyReuseError` --references--> `TransactionKeyReuseError`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts
- `Scenario: A transaction-key-reuse violation surfaces as TransactionKeyReuseError` --references--> `TransactionKeyReuseError`  [INFERRED]
  openspec/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts
- `Scenario: Two puts inside one withTransaction either both commit or neither does` --references--> `Rollback`  [INFERRED]
  openspec/changes/sprint-2-transaction-lease/specs/temporal-kv/spec.md → src/interfaces/transaction-lease.ts
- `Scenario: A stale transaction handle is rejected before any query runs` --references--> `TransactionHandleInvalidError`  [INFERRED]
  openspec/changes/sprint-2-transaction-lease/specs/temporal-kv/spec.md → src/interfaces/transaction-lease.ts
- `Scenario: A history page issues two queries regardless of page size` --references--> `CheckpointSummary`  [INFERRED]
  openspec/changes/v1.0.0-perf-baseline/specs/performance-baseline/spec.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (252 total, 20 thin omitted)

### Community 0 - "translatePostgresError"
Cohesion: 0.04
Nodes (103): TransactionKeyReuseError, Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, Rollback, TransactionFaultError (+95 more)

### Community 1 - "postgres/checkpoint-store.ts"
Cohesion: 0.04
Nodes (101): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointSummary, ChunkIntegrityError, ChunkMissingError, ContentHash (+93 more)

### Community 10 - "StorageError"
Cohesion: 0.04
Nodes (68): ConnectionError, Retryability, StorageError, ClockRegressionError, Row, code(), AS_OF, ROLLBACK_CAUSE (+60 more)

### Community 106 - "ref_node_child_process"
Cohesion: 0.12
Nodes (11): LockResult, kill(), check, checker, env, forwarded, repoRoot, reportPath (+3 more)

### Community 11 - "setup.ts"
Cohesion: 0.04
Nodes (67): C5AnyFn, Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash() (+59 more)

### Community 115 - "read-only-database.test.ts"
Cohesion: 0.17
Nodes (9): OffersReadOnly, readOnlyDatabase(), block(), namesOf(), prototypesOf(), readOnlyProblems(), setUp(), MODULES (+1 more)

### Community 116 - "checks.test.ts"
Cohesion: 0.14
Nodes (7): Case, outcome(), started(), write(), CASES, MODULE, TYPE_OF

### Community 118 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 12 - "postgres.ts"
Cohesion: 0.06
Nodes (43): ConfiguredDatabase, ConfiguredDatabaseOptions, CommittedHeight, DurabilityProbeOptions, DurabilityWarning, ProbeSession, PgliteOptions, BoundedRead (+35 more)

### Community 126 - "plain-data.ts"
Cohesion: 0.24
Nodes (12): PlainArray, PlainDataNode, PlainDataRule, Walk, copyArray(), copyObject(), instanceOf(), isElementKey() (+4 more)

### Community 127 - "load-under-prune.integration.test.ts"
Cohesion: 0.16
Nodes (11): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), seedCheckpoints(), sha256() (+3 more)

### Community 13 - "roles.ts"
Cohesion: 0.05
Nodes (56): MigrationPart, Difference, PlannedSchema, Provision, QualifiedTable, SchemaItem, SchemaMigration, SchemaModule (+48 more)

### Community 130 - "3. Proof-blocking findings"
Cohesion: 0.15
Nodes (13): Absent, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces (+5 more)

### Community 133 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 139 - "fresh-instance.ts"
Cohesion: 0.18
Nodes (9): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, hex(), runInFreshInstance(), requested, store (+1 more)

### Community 14 - "db/errors.ts"
Cohesion: 0.05
Nodes (45): DurabilityViolation, ReadTimeoutSetting, ErrorCode, ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter() (+37 more)

### Community 147 - "chain.ts"
Cohesion: 0.29
Nodes (8): DigestRow, blockAt(), checkpointRows(), processContext(), runBlock(), startChain(), CORE_DIGEST, counter

### Community 15 - "declaration.ts"
Cohesion: 0.05
Nodes (46): OwnPart, ApiRegistry, BlockHeader, DefinedModule, FieldKind, FieldSchema, ItemDeclaration, ItemSink (+38 more)

### Community 155 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 16 - "node/client.test.ts"
Cohesion: 0.05
Nodes (37): Answer, Handler, Received, recorded, ManualTimers, caught(), client(), quietConnect() (+29 more)

### Community 161 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 17 - "TemporalKV"
Cohesion: 0.04
Nodes (57): TemporalKV, runMigrationsImpl(), migrations(), column(), key(), 1.2 Async pattern, 1.3 Transaction participation, 1.5 Naming (+49 more)

### Community 18 - "interfaces/temporal-kv.ts"
Cohesion: 0.07
Nodes (51): AsOf, AssertExact, HistoryUnavailableError, JsonValue, Key, Namespace, Scope, TemporalKVError (+43 more)

### Community 188 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 19 - "UmbraError"
Cohesion: 0.07
Nodes (37): Job, JobQueue, Held, PgliteLockUse, Outcome, PgliteDatabase, ServerErrorFields, UmbraError (+29 more)

### Community 190 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 2 - "runMigrations"
Cohesion: 0.03
Nodes (109): UmbraDBConnectionOptions, DurabilityContractError, TransactionPoolerDetectedError, MigrationLockTimeoutError, integer(), assertValidSchemaName(), runMigrations(), saveAndAdvance() (+101 more)

### Community 20 - "CheckpointStore"
Cohesion: 0.07
Nodes (45): CheckpointStore, EnvelopeCorruptError, EnvelopeVersionUnsupportedError, WalletStateEnvelope, WalletStateEnvelopeError, PgWalletStateEnvelopeStore, decode(), encode() (+37 more)

### Community 21 - "createClient"
Cohesion: 0.09
Nodes (45): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+37 more)

### Community 22 - "loop.ts"
Cohesion: 0.07
Nodes (35): BlockContext, BlockRef, BlockSource, ChainDataAnswer, ChainDataView, InMemoryBlockSource, InMemorySourceOptions, Wait (+27 more)

### Community 23 - "ref_node_path"
Cohesion: 0.05
Nodes (36): databaseTarget, LoadedConfig, LoadOptions, plainData, Row, Finding, databaseOptions(), openConfiguredDatabase() (+28 more)

### Community 24 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (41): Settings, Run, Job, WorkerEvent, Outcome, openBlockWrites(), commitHeight(), commitHeight() (+33 more)

### Community 25 - "boundary.test.ts"
Cohesion: 0.08
Nodes (43): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+35 more)

### Community 26 - "order.property.test.ts"
Cohesion: 0.08
Nodes (51): HeightRange, Callback, EntryBoundary, ParallelPoint, CheckName, GraphSpec, ModuleSpec, TESTED (+43 more)

### Community 27 - "PgTransactionHistoryStorage"
Cohesion: 0.06
Nodes (46): TransactionHistoryStorage, PgTransactionHistoryStorage, 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order), Architectural boundary (explicit owner directive, confirmed post-consolidation), Build (one product module + one thin envelope — corrected from the original "exactly two things, zero new code" framing; see finding below) (+38 more)

### Community 28 - "ValidationError"
Cohesion: 0.05
Nodes (49): ValidationError, 3. Replay convergence is judged on CURRENT state, 0. Package layout, 1. Chunking, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 6. Migration (`002_checkpoint_store.ts`), 9. Test infrastructure, Design — Sprint 3: CheckpointStore (+41 more)

### Community 29 - "change-capture.ts"
Cohesion: 0.07
Nodes (41): CapturedTable, CaptureState, GuardTableRow, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule (+33 more)

### Community 3 - "column-rules.ts"
Cohesion: 0.03
Nodes (99): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+91 more)

### Community 30 - "cbor.ts"
Cohesion: 0.08
Nodes (42): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+34 more)

### Community 31 - "history-startup.ts"
Cohesion: 0.08
Nodes (43): CoreSettings, HistoryCheck, HistoryInput, HistoryRow, HistoryRule, AppliedMigration, EntryRange, Holder (+35 more)

### Community 32 - "changes.property.test.ts"
Cohesion: 0.06
Nodes (44): Op, States, TableName, captured(), hex(), moduleM(), restart(), sha256() (+36 more)

### Community 33 - "history.test.ts"
Cohesion: 0.09
Nodes (41): versionEntry, HistoryOptions, Simulation, Start, Case, canonicalJson(), dataHash(), builtWith100() (+33 more)

### Community 34 - "writer-lock-checks.ts"
Cohesion: 0.10
Nodes (21): PostgresTestDatabase, PostgresTestServer, PauseReport, startWriter(), postgresBackend(), firstOf(), opened(), startPostgresServer() (+13 more)

### Community 35 - "graph.ts"
Cohesion: 0.08
Nodes (44): Edge, GraphPart, GraphRule, MidChain, Missing, RangeFacts, ResolvedRange, Spanned (+36 more)

### Community 36 - "checkShape"
Cohesion: 0.07
Nodes (36): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), insert() (+28 more)

### Community 38 - "ref_node_crypto"
Cohesion: 0.08
Nodes (28): ModuleContentsFailure, ModuleTable, DeterminismBackend, TestDatabase, TestServer, Backend, freshDatabase(), hashOf() (+20 more)

### Community 39 - "validate.test.ts"
Cohesion: 0.07
Nodes (33): coreEntry, ConfigRule, EntryRef, CursorRow, Expected, entryOf(), checked(), declarations() (+25 more)

### Community 4 - "loop.test.ts"
Cohesion: 0.04
Nodes (80): GraphInput, ResolvedGraph, PastFaultCase, RefusalCase, WaitingInRead, Contexts, LoopClass, RunnerBackend (+72 more)

### Community 40 - "node/client.ts"
Cohesion: 0.08
Nodes (28): NodeCallOptions, NodeSubscription, State, Subscription, NodeBlock, NodeHeader, NodeRuntimeVersion, NodeCallMethod (+20 more)

### Community 41 - "postgres/migrate.ts"
Cohesion: 0.08
Nodes (21): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit() (+13 more)

### Community 42 - "config/history.ts"
Cohesion: 0.10
Nodes (33): CoreVersion, HistoryCode, HistoryContext, HistoryFinding, Span, CheckedEntry, Finding, PlacedEntry (+25 more)

### Community 43 - "validate.ts"
Cohesion: 0.10
Nodes (38): ProcessSide, CheckedConfig, ConfigContext, ConfigInput, CursorRule, Issue, Plain, SettingsSchema (+30 more)

### Community 46 - "entries.ts"
Cohesion: 0.07
Nodes (33): CoreLedgerVersion, LedgerName, LedgerPackageIdentity, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig (+25 more)

### Community 47 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.07
Nodes (28): MergeEntriesFn, isPlainObject(), mergeSections(), referenceMergeEntries(), decodeSerializedContent(), decodeSerializedEntry(), store(), txLayer() (+20 more)

### Community 48 - "cursor-durability.crash.test.ts"
Cohesion: 0.07
Nodes (28): InvariantResult, CrashWorkerHandle, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs(), durableKvValues(), itemKey() (+20 more)

### Community 49 - "core-settings.test.ts"
Cohesion: 0.07
Nodes (31): PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly, hashHex() (+23 more)

### Community 5 - "vitest"
Cohesion: 0.04
Nodes (59): Database, TestBackend, TestDatabase, Case, LoadOutcome, OutsideRead, Traced, Opened (+51 more)

### Community 50 - "postgres/client.ts"
Cohesion: 0.12
Nodes (16): BenchEnv, UmbraDBSql, BlockRow, TxRow, overridingUrlParameter(), assertNoConflictingSearchPath(), bundleFixture(), makeBlock() (+8 more)

### Community 52 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 54 - "validation.ts"
Cohesion: 0.07
Nodes (29): DeclarationRule, Plain, Case, ShapeCase, Stats, first(), validateWith(), failures() (+21 more)

### Community 55 - "redact.test.ts"
Cohesion: 0.12
Nodes (26): PlainObject, RedactableConfig, RedactionForms, redactor, SecretForm, TextPattern, EntryView, fieldKinds (+18 more)

### Community 56 - "NodeClient"
Cohesion: 0.16
Nodes (8): HeadSubscriber, NodeClient, NodeRetry, Pending, connectionFailure, NodeMethod, clientClosed(), 10. Node client and ingest

### Community 57 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (24): LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, phaseB_freshProcessRestoreAndVerify(), assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra() (+16 more)

### Community 58 - "FinalizedLoop"
Cohesion: 0.13
Nodes (8): FinalizedLoop, HeightRun, Batching, ComputeAtH, FailingAfter, WritingLoop, call(), runFinalized()

### Community 59 - "ws-mutual-tls.test.ts"
Cohesion: 0.08
Nodes (24): Attempt, locked(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+16 more)

### Community 6 - "PgTransactionLeaseLayer"
Cohesion: 0.04
Nodes (77): TransactionLeaseLayer, PgCheckpointStore, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, CoTxCallable, CoTxPauseInfo, CrashHook (+69 more)

### Community 67 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.12
Nodes (25): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, bootstrapChainArchiveSchema() (+17 more)

### Community 68 - "differential-equivalence.test.ts"
Cohesion: 0.13
Nodes (25): Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1(), injectT2() (+17 more)

### Community 69 - "pglite-processes.ts"
Cohesion: 0.12
Nodes (23): WriterProcess, WorkerEvent, blocksIn(), cleanUp(), startWriterProcess(), workDirectory(), dataDirectory(), expectPausedWriterKeepsLock() (+15 more)

### Community 7 - "api.ts"
Cohesion: 0.05
Nodes (69): BlockWriteHandle, ReadOnlyDatabase, ReadOptions, SchemaWriteHandle, Transaction, AppliedRow, Runnable, Settling (+61 more)

### Community 70 - "vendored-ledger-v9.test.ts"
Cohesion: 0.17
Nodes (23): NodeRoot, bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex() (+15 more)

### Community 71 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 72 - "ChainArchiveStore"
Cohesion: 0.08
Nodes (13): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage (+5 more)

### Community 75 - "TransactionHistoryEntry"
Cohesion: 0.14
Nodes (10): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), encodeContent(), encodeSections(), encodeStoredEntry(), abortErrorLike(), capitalize() (+2 more)

### Community 76 - "fixtures.ts"
Cohesion: 0.10
Nodes (20): PointName, CallbackFailure, PointArguments, PointRun, HeightFailure, Misuse, CallEvent, Recorder (+12 more)

### Community 77 - "PgChainArchiveStore"
Cohesion: 0.19
Nodes (11): BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf() (+3 more)

### Community 79 - "node-format.ts"
Cohesion: 0.19
Nodes (18): Child, Reader, childKey(), concat(), decodeChild(), decodeChildren(), encodeChild(), encodeChildren() (+10 more)

### Community 8 - "src/index.ts"
Cohesion: 0.05
Nodes (58): CheckpointStoreErrorCode, SerializationFailedError, SharedStorageErrorCode, TemporalKVErrorCode, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle (+50 more)

### Community 80 - "ref_node_fs"
Cohesion: 0.13
Nodes (9): Lockfile, Manifest, GuardViolation, extractStringLiterals(), findChainSyncViolations(), scanDirectory(), walkTsFiles(), ALGEBRA_PATH (+1 more)

### Community 83 - "digest.test.ts"
Cohesion: 0.13
Nodes (20): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+12 more)

### Community 85 - "connectWebSocket"
Cohesion: 0.13
Nodes (13): Connection, NodeClientOptions, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, connectWebSocket(), SYSTEM_TIMERS (+5 more)

### Community 87 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (11): GcPass, HistGroup, SampleObservation, kvMapKey(), newPool(), readCurrentState(), { connectionUri }, DECLARED_ENVELOPE (+3 more)

### Community 89 - "describeNodeStoreExports"
Cohesion: 0.19
Nodes (8): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), 5.1 The `LedgerPackage` interface (LG-6), 5.2 Vendored builds (LG-5), 0. Pins and verification, What the patches add

### Community 9 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (50): CaptureColumn, CheckedMigration, CanonicalEncodingError, ModuleColumn, ModuleContentsError, PageOptions, ConsistentRead, ColumnType (+42 more)

### Community 90 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (16): BlobRole, BlockBundle, BlockMeta, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult (+8 more)

### Community 94 - "ReadHandle"
Cohesion: 0.12
Nodes (7): ReadHandle, PointCallbacks, snapshot(), "on-after-db-write"(), "on-compute"(), problems(), rowCounts()

### Community 95 - "What changes — the 1.0.0 gate items this change addresses"
Cohesion: 0.21
Nodes (13): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+5 more)

### Community 96 - "transaction-history-storage.property.test.ts"
Cohesion: 0.11
Nodes (16): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+8 more)

### Community 91 - ".now"
Cohesion: 0.11
Nodes (18): Data that is not a function of the chain, Migrations, Reading through `db`, Stored values and digests, Time values, UmbraDB module guide, Upgrades, Writing in callbacks (+10 more)

### Community 114 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 119 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.14
Nodes (12): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 5. WalletState envelope, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier, Design — Sprint 7: Transaction History Storage (+4 more)

### Community 128 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.15
Nodes (11): n(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer (+3 more)

### Community 131 - "address"
Cohesion: 0.18
Nodes (12): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Requirement: Set is an unconditional overwrite at the exact address, Scenario: A later value wins at the same address, Scenario: Abstract absence remains distinct from a stored null-like value (+4 more)

### Community 141 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 142 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 148 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 167 - "lease-nonwedge.crash.test.ts"
Cohesion: 0.28
Nodes (8): class2AdvisoryLockCountForHash(), pollForLockGone(), pool(), sleep(), worker(), liveWorkers, openPools, { sql: getSql, connectionUri }

### Community 189 - "001_chain_archive_core.ts"
Cohesion: 0.43
Nodes (5): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS

### Community 217 - "watermarks.property.test.ts"
Cohesion: 0.40
Nodes (3): store(), arbitraryWatermarkValue, { sql: getSql }

### Community 44 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 53 - "context"
Cohesion: 0.07
Nodes (22): schemaName(), module(), context(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 66 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.12
Nodes (25): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), registerSuiteLifecycle(), startTestDatabase(), stopTestDatabase(), EXPECTED_NIGHT_VALUE (+17 more)

### Community 84 - "decode.ts"
Cohesion: 0.21
Nodes (20): blockAnswer(), byteArrayAnswer(), bytesAnswer(), bytesListAnswer(), bytesParameter(), countParameter(), frozenCopy(), hashAnswer() (+12 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence, Requirement: the adapter round-trips SDK lifecycle detail so getAll yields schema-valid SDK entries (+13 more)

### Community 92 - "T"
Cohesion: 0.10
Nodes (20): T(), 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model (+12 more)

### Community 100 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (17): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+9 more)

### Community 101 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note) (+9 more)

### Community 102 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 103 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 105 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 107 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.12
Nodes (14): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`) (+6 more)

### Community 108 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 109 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor first, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+7 more)

### Community 110 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.13
Nodes (15): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N) (+7 more)

### Community 111 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.13
Nodes (14): 10. Tables, 11. Refusals and halts (IN-12), 14. External claims and their evidence, 15. Relation to the existing design documents, 2. Points, 5.3 The ledger worker and the node-store bridge (LG-10, LG-11), 5.4 Storage, retention and sweep (LG-11 to LG-14), 5.5 Ledger tasks (LG-17, Q49) (+6 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract, Scenario: An untouched address retains its initial value (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 117 - "ROADMAP.md"
Cohesion: 0.14
Nodes (9): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+1 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+5 more)

### Community 122 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 123 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.14
Nodes (13): 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups, 16. Browser, 17. Library surface and gates, 18. Whole-system faults, differentials and measurements (+5 more)

### Community 124 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 125 - "Roadmap"
Cohesion: 0.14
Nodes (14): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+6 more)

### Community 129 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 136 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover), 7. What this change deliberately does not verify (traceability of the non-goals) (+3 more)

### Community 137 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 138 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 140 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 144 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 145 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.18
Nodes (10): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding) (+2 more)

### Community 146 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 149 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 150 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 151 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 152 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 153 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 154 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 156 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

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

### Community 162 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 163 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 164 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 165 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 166 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 169 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 170 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 171 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 172 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 173 - "Security policy & threat model"
Cohesion: 0.25
Nodes (8): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 174 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 175 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 176 - "Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored"
Cohesion: 0.25
Nodes (7): ADDED Requirements, MODIFIED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Scenario: A stale transaction handle is rejected before any query runs, Scenario: Two puts inside one withTransaction both commit together, Scenario: Two puts inside one withTransaction either both commit or neither does, temporal-kv (transaction-participation wiring)

### Community 177 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 178 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 179 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 180 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 181 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 182 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 183 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 184 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 185 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 187 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 191 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 192 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 193 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 194 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 195 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 196 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 197 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 198 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 199 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 200 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 201 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 202 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 203 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 204 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 205 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 206 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 207 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 208 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 209 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 210 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 211 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 212 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 213 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 214 - "Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network"
Cohesion: 0.40
Nodes (5): Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Scenario: A rolled-back save consumes no sequence number, Scenario: Concurrent saves for one wallet+network still produce a gapless, non-repeating sequence, Scenario: Different wallet+network pairs have independent sequence counters, Scenario: Sequential saves for one wallet+network produce consecutive sequence numbers

### Community 215 - "Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data"
Cohesion: 0.40
Nodes (5): Requirement: G9/T5 — a crash between data and cursor never leaves the watermark ahead of durable data, Scenario: replay from the durable cursor converges on current state, Scenario: the durable watermark is never ahead of durable data, Scenario: the invariant holds under synchronous_commit = off, Scenario: the invariant holds under synchronous_commit = on

### Community 216 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 218 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 219 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 220 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 221 - "2. Schema — two corrections to `design/design.md` §3"
Cohesion: 0.50
Nodes (4): 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3

### Community 222 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.50
Nodes (3): Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, Why

### Community 223 - "Requirement: CI gates any change to flake.lock behind explicit review (G18)"
Cohesion: 0.50
Nodes (4): Requirement: CI gates any change to flake.lock behind explicit review (G18), Scenario: A labeled flake.lock change is allowed, Scenario: A pull request that does not touch flake.lock passes, Scenario: An unlabeled flake.lock change fails the gate

### Community 224 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 225 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 226 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 227 - "Vendored ledger builds"
Cohesion: 0.50
Nodes (3): Rebuilding, Updating a version, Vendored ledger builds

### Community 230 - "Requirement: prune retains exactly the N newest complete manifests per wallet+network"
Cohesion: 0.67
Nodes (3): Requirement: prune retains exactly the N newest complete manifests per wallet+network, Scenario: Pruning to retain k newest keeps exactly those k, Scenario: Pruning to retain the single newest manifest keeps only it

### Community 231 - "Requirement: set is an idempotent, unconditional overwrite (Law W1)"
Cohesion: 0.67
Nodes (3): Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A new set always overwrites, with no conflict possible, Scenario: Setting the same value twice leaves the stored state unchanged

### Community 232 - "Requirement: package.json is publishable with a strict exports map and no deep-import escape hatch"
Cohesion: 0.67
Nodes (3): Requirement: package.json is publishable with a strict exports map and no deep-import escape hatch, Scenario: A deep import of an internal module is unresolvable from the installed package, Scenario: The package advertises a root import and no deep-import path

### Community 233 - "Requirement: The 1.0.0 Lean cut-line is frozen with a written deferral"
Cohesion: 0.67
Nodes (3): Requirement: The 1.0.0 Lean cut-line is frozen with a written deferral, Scenario: The frozen cut-line and its deferral are recorded, Scenario: The frozen set is the set actually mechanized and covered by the trust gate

### Community 234 - "Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18)"
Cohesion: 0.67
Nodes (3): Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Scenario: A newly introduced secret outside the allowlist fails the scan, Scenario: The historical wallet secret and the template placeholder do not fail the scan

### Community 235 - "Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16)"
Cohesion: 0.67
Nodes (3): Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16), Scenario: The dedup and prune docs state the trust-domain requirement and the side channel, Scenario: The rewrite changes no contract and preserves existing accurate caveats

### Community 236 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 37 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 45 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+30 more)

### Community 51 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data responses name their view and height (+27 more)

### Community 60 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (28): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+20 more)

### Community 61 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)` (+22 more)

### Community 62 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18), Requirement: The localhost Require default is unchanged (G17), Requirement: The repository ships an ignore-scripts .npmrc that CI asserts (G18) (+22 more)

### Community 63 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: history() computes per-manifest aggregates in a single grouped query (HP-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+22 more)

### Community 64 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing (+22 more)

### Community 65 - "Full-Chain Storage — Design"
Cohesion: 0.07
Nodes (29): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+21 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+17 more)

### Community 81 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.08
Nodes (25): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+17 more)

### Community 82 - "Requirements"
Cohesion: 0.08
Nodes (24): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: Schema isolation is the default, not opt-in, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+16 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: Schema isolation is the default, not opt-in, Requirement: Unconditional writes are gapless and monotonic (Law T1) (+15 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 97 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 98 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.11
Nodes (15): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+7 more)

### Community 99 - "package.json"
Cohesion: 0.11
Nodes (18): description, exports, files, homepage, license, main, name, type (+10 more)

## Knowledge Gaps
- **34 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-8259`, `RFC-3339`, `RFC-3339` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2284 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `translatePostgresError`, `postgres/checkpoint-store.ts`, `column-rules.ts`, `loop.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `PgTransactionLeaseLayer`, `api.ts`, `src/index.ts`, `opt-out.test.ts`, `StorageError`, `setup.ts`, `postgres.ts`, `history.property.test.ts`, `db/errors.ts`, `roles.ts`, `declaration.ts`, `node/client.test.ts`, `interfaces/temporal-kv.ts`, `chain.ts`, `facade-merge-loader.ts`, `CheckpointStore`, `loop.ts`, `ref_node_path`, `zero-timeouts-checks.ts`, `boundary.test.ts`, `order.property.test.ts`, `postgres-image.test.ts`, `changes.property.test.ts`, `history.test.ts`, `writer-lock-checks.ts`, `ref_node_crypto`, `validate.test.ts`, `lease-nonwedge.crash.test.ts`, `node/client.ts`, `postgres/migrate.ts`, `entries.ts`, `interfaces/transaction-history-storage.ts`, `cursor-durability.crash.test.ts`, `core-settings.test.ts`, `postgres/client.ts`, `cbor.property.test.ts`, `validation.ts`, `redact.test.ts`, `pg-tx-history-adapter.ts`, `ws-mutual-tls.test.ts`, `vendored-ledger-files.test.ts`, `cold-boot-recovery.integration.test.ts`, `chain-archive-replay-decode.integration.test.ts`, `differential-equivalence.test.ts`, `pglite-processes.ts`, `vendored-ledger-v9.test.ts`, `check-required-tests.ts`, `node-format.ts`, `ref_node_fs`, `digest.test.ts`, `full-sync-soak.integration.test.ts`, `watermarks.property.test.ts`, `What changes — the 1.0.0 gate items this change addresses`, `transaction-history-storage.property.test.ts`, `package.json`, `ref_node_child_process`, `mutation-per-adapter.mjs`, `read-only-database.test.ts`, `checks.test.ts`, `load-under-prune.integration.test.ts`?**
  _High betweenness centrality (0.259) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `UmbraError` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`UmbraError` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-8259` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `translatePostgresError` be split into smaller, more focused modules?**
  _Cohesion score 0.0383442265795207 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `loop.test.ts`, `vitest`, `api.ts`, `opt-out.test.ts`, `postgres.ts`, `roles.ts`, `db/errors.ts`, `declaration.ts`, `node/client.test.ts`, `loop.ts`, `ref_node_path`, `zero-timeouts-checks.ts`, `cbor.ts`, `history-startup.ts`, `changes.property.test.ts`, `history.test.ts`, `writer-lock-checks.ts`, `graph.ts`, `checkShape`, `validate.test.ts`, `node/client.ts`, `config/history.ts`, `validate.ts`, `entries.ts`, `validation.ts`, `NodeClient`, `FinalizedLoop`, `decode.ts`, `read-only-database.test.ts`, `checks.test.ts`, `plain-data.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Should `postgres/checkpoint-store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.035090096192927786 - nodes in this community are weakly interconnected._