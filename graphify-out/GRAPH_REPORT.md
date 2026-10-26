# Graph Report - UmbraDB

## Corpus Check
- 616 files · ~1,006,960 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 54 file(s) not represented in the graph (top: .lean 25, (none) 13, .patch 8)

## Summary
- 6526 nodes · 16956 edges · 259 communities (238 shown, 21 thin omitted)
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 2340 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `1a2b3e4cba60f1be` (616 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- UmbraError
- PgTransactionHistoryStorage
- TransactionHandle
- What changes — the 1.0.0 gate items this change addresses
- validation.test.ts
- parseJsonLossless
- node-format.ts
- Database
- ReadPool
- checkShape
- runMigrations
- pg-tx-history-adapter.test.ts
- read-height.property.test.ts
- load-under-prune.integration.test.ts
- node/client.test.ts
- ref_node_crypto
- postgres/durability-probe.test.ts
- no-indexer-or-wallet-sdk.test.ts
- module-tables.ts
- Session
- Reader
- process.test.ts
- ProcessItems
- api.ts
- node.ts
- resolveTransaction
- n
- mutation-evidence.d.mts
- node/client.ts
- src/index.ts
- history.test.ts
- opt-out.test.ts
- vitest
- cbor.ts
- CliBackend
- setup.ts
- change-capture.ts
- dispatch.test.ts
- harness.ts
- node.test.ts
- changes.property.test.ts
- declaration.ts
- boundary.test.ts
- core-settings.test.ts
- graph.ts
- FinalizedLoop
- ref_node_fs
- config/history.ts
- entries.ts
- writer-lock-checks.ts
- wallet-state-envelope.test.ts
- module-api.ts
- pglite.ts
- validate.ts
- validate.test.ts
- runner/process.ts
- cursor-durability.crash.test.ts
- ValidationError
- config-check-database.test.ts
- config-check.ts
- api-server.ts
- order.property.test.ts
- NodeClient
- cbor.property.test.ts
- format.test.ts
- column-rules.ts
- ADDED Requirements
- plain-data.ts
- redact.test.ts
- differential-equivalence.test.ts
- chain-archive-replay-decode.integration.test.ts
- command.ts
- PgTransactionLeaseLayer
- check-required-tests.ts
- pglite-timeouts.test.ts
- ChainArchiveStore
- PgChainArchiveStore
- cursor-table.property.test.ts
- ws-mutual-tls.test.ts
- 5. Runner
- loop.test.ts
- describeNodeStoreExports
- mapping.ts
- pg-tx-history-adapter.ts
- full-sync-soak.integration.test.ts
- chain-archive-rollover.ts
- translatePostgresError
- development-opt-in.test.ts
- postgres/chain-archive-store.ts
- postgres-image.test.ts
- validation.ts
- pg-kill-save.crash.test.ts
- read-only-database.test.ts
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- migrations
- mutation-per-adapter.mjs
- mapping.test.ts
- address
- history.property.test.ts
- facade-merge-loader.ts
- scoped-review-manifest
- pack-install.mjs
- .boolean
- fresh-instance.mjs
- parameterText
- graph.py
- context
- ADDED Requirements
- 1. Determinism primitives
- vendored-ledger-v9.test.ts
- Requirement: DT-6 Stored data avoids non-deterministic values
- cold-boot-recovery.integration.test.ts
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- scripts
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ADDED Requirements
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- devDependencies
- ROADMAP.md
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Roadmap
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- ADDED Requirements
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Design — Postgres+JSONB storage rebuild
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- 3. Proof-blocking findings
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
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
- Storage Algebra Lean M3a Watermarks Sprint
- Security policy & threat model
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 12. Milestone status
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- [0.9.5] - 2026-07-25 — "Penumbra"
- Algebraic Specification of the midnight-pg-store Storage Layer
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
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
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network
- Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- GC architecture and query-tracing: research findings
- PULL_REQUEST_CHECKLIST.md
- 9. Trust and refinement boundary
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
- 9. Backups and browser
- Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats
- Requirement: manifestHash is computed once at write time from the ordered chunk-hash sequence
- Requirement: prune retains exactly the N newest complete manifests per wallet+network
- Requirement: get returns exactly the last value set, scoped per (kind, key)
- Requirement: set is an idempotent, unconditional overwrite (Law W1)
- Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18)
- Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16)
- run.sh
- build-in-container.sh
- vitest.config.ts
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- ADDED Requirements
- Full-Chain Storage — Design
- package.json
- ADDED Requirements
- Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 175 edges
2. `UmbraError` - 160 edges
3. `PgTransactionLeaseLayer` - 93 edges
4. `ValidationError` - 87 edges
5. `PgCheckpointStore` - 87 edges
6. `ModuleDeclaration` - 86 edges
7. `runMigrations()` - 86 edges
8. `translatePostgresError()` - 78 edges
9. `Database` - 73 edges
10. `PgTransactionHistoryStorage` - 70 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`)` --references--> `CheckpointStore`  [INFERRED]
  design/full-chain-storage-design.md → src/interfaces/checkpoint-store.ts
- `6. Backup/restore guidance` --references--> `CheckpointStore`  [INFERRED]
  docs/CONTRACT.md → src/interfaces/checkpoint-store.ts
- `Scope — documented preconditions vs. implemented controls (1.0.0)` --references--> `CheckpointStore`  [INFERRED]
  docs/THREAT_MODEL.md → src/interfaces/checkpoint-store.ts
- `6. On not adding a Merkle/authenticated data structure` --references--> `CheckpointStore`  [INFERRED]
  Formal/STORAGE_ALGEBRA.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (259 total, 21 thin omitted)

### Community 0 - "UmbraError"
Cohesion: 0.03
Nodes (143): BlockWriteHandle, SchemaWriteHandle, Transaction, ReadTimeoutSetting, AppliedRow, MigrationPart, Runnable, Settling (+135 more)

### Community 1 - "PgTransactionHistoryStorage"
Cohesion: 0.03
Nodes (119): CheckpointStore, SerializationFailedError, MergeEntriesFn, TransactionHistoryEntry, TransactionHistoryStorage, JsonEncoded, PgTransactionHistoryStorage, StoredEntryJson (+111 more)

### Community 10 - "TransactionHandle"
Cohesion: 0.04
Nodes (80): AsOf, AssertExact, JsonValue, Key, Namespace, Scope, TemporalKV, Version (+72 more)

### Community 101 - "What changes — the 1.0.0 gate items this change addresses"
Cohesion: 0.24
Nodes (13): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+5 more)

### Community 103 - "validation.test.ts"
Cohesion: 0.14
Nodes (13): DeclarationRule, Case, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+5 more)

### Community 105 - "parseJsonLossless"
Cohesion: 0.19
Nodes (9): Connection, parseJsonLossless(), errorMessage(), encodeJson(), hex(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem (+1 more)

### Community 109 - "node-format.ts"
Cohesion: 0.25
Nodes (14): Child, Disposable, childKey(), concat(), encodeChild(), encodeChildren(), hasEmbeddedChild(), nodeKey() (+6 more)

### Community 11 - "Database"
Cohesion: 0.04
Nodes (65): Database, Settings, TestDatabase, Case, LoadOutcome, OutsideRead, Traced, Opened (+57 more)

### Community 114 - "ReadPool"
Cohesion: 0.18
Nodes (6): ReadPool, rollBack(), Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 119 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 12 - "runMigrations"
Cohesion: 0.03
Nodes (100): Watermarks, UmbraDBConnectionOptions, DurabilityContractError, runMigrations(), saveAndAdvance(), 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`), 9. Module → module mapping (source of truth for `tasks.md`), 2. `storage-errors.ts` — shared base (new file) (+92 more)

### Community 125 - "pg-tx-history-adapter.test.ts"
Cohesion: 0.19
Nodes (9): TestEntry, TestSection, makeAdapter(), isPlainObject(), mergeSections(), referenceMergeEntries(), { sql: getSql }, UMBRADB_ADAPTER_LIFECYCLE_DETAIL_KEY (+1 more)

### Community 127 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 128 - "load-under-prune.integration.test.ts"
Cohesion: 0.16
Nodes (11): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), seedCheckpoints(), sha256() (+3 more)

### Community 13 - "node/client.test.ts"
Cohesion: 0.03
Nodes (51): Connection, NodeClientOptions, ConnectSocket, NodeSocket, NodeSocketEvents, NodeTimers, SocketFailure, Answer (+43 more)

### Community 134 - "ref_node_crypto"
Cohesion: 0.18
Nodes (10): FreshInstanceRequest, FreshInstanceResult, StoredNode, NodeBatch, NodeRoot, runInFreshInstance(), fixtures, packages (+2 more)

### Community 135 - "postgres/durability-probe.test.ts"
Cohesion: 0.31
Nodes (9): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, assertNoTransactionPooler(), classifyFsync(), classifyFullPageWrites(), classifySynchronousCommit(), probeAdvisoryLockVisibility() (+1 more)

### Community 136 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 14 - "module-tables.ts"
Cohesion: 0.05
Nodes (52): ModuleContentsError, ModuleTable, PageOptions, ConsistentRead, RefusalCode, DeterminismBackend, TestDatabase, TestServer (+44 more)

### Community 148 - "Reader"
Cohesion: 0.36
Nodes (5): Reader, decodeChild(), decodeChildren(), readChild(), readChildList()

### Community 15 - "process.test.ts"
Cohesion: 0.05
Nodes (63): ProcessingEnd, ProcessStatus, StartupFacts, ProcessBackend, ProcessDatabase, CoreSeen, testBuild, A149Observation (+55 more)

### Community 16 - "api.ts"
Cohesion: 0.04
Nodes (35): ReadHandle, cursorTable, CursorTableOptions, CursorValue, Migration, PointCallbacks, BlockRef, BlockSource (+27 more)

### Community 17 - "node.ts"
Cohesion: 0.06
Nodes (56): TapeProblem, Json, NotJsonError, Connection, Read, TapeCall, TapeNode, TapeNodeOptions (+48 more)

### Community 18 - "resolveTransaction"
Cohesion: 0.05
Nodes (59): TransactionHandleInvalidError, WatermarkKey, WatermarkKind, WatermarkValue, SaveAndAdvanceCursor, WatermarkRow, CoTxCallable, CoTxPauseInfo (+51 more)

### Community 182 - "n"
Cohesion: 0.29
Nodes (7): Absent, n(), 3.3 T3 omits the current event and cannot replay a pruned suffix, 4. Law-by-law repair map, Requirement: CheckpointSummary metadata is populated and label round-trips, Scenario: A label given at save time is returned by history and load, Scenario: byteLength, chunkCount, and createdAt reflect the saved payload

### Community 189 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 19 - "node/client.ts"
Cohesion: 0.07
Nodes (49): NodeCallOptions, NodeRetry, NodeSubscription, Pending, State, Subscription, Waiter, NodeBlock (+41 more)

### Community 2 - "src/index.ts"
Cohesion: 0.03
Nodes (133): CheckpointStoreErrorCode, ConnectionError, Retryability, SharedStorageErrorCode, StorageError, HistoryUnavailableError, TemporalKVError, TemporalKVErrorCode (+125 more)

### Community 20 - "history.test.ts"
Cohesion: 0.06
Nodes (60): versionEntry, HistoryInput, HistoryOptions, HistoryRow, HistoryRule, AppliedMigration, Simulation, Start (+52 more)

### Community 21 - "opt-out.test.ts"
Cohesion: 0.07
Nodes (56): Chain, DigestRow, moduleEntryBuilder(), migrationPart(), schemaItem(), schemaModule(), schemaModules(), schemaPlan() (+48 more)

### Community 22 - "vitest"
Cohesion: 0.07
Nodes (29): BenchEnv, Migration, BlockRow, TxRow, overridingUrlParameter(), assertNoConflictingSearchPath(), assertValidSchemaName(), createClient() (+21 more)

### Community 23 - "cbor.ts"
Cohesion: 0.07
Nodes (51): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, ColumnMode, DateTimeFields, Mode, PathNode, Task (+43 more)

### Community 24 - "setup.ts"
Cohesion: 0.05
Nodes (57): Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount() (+49 more)

### Community 25 - "change-capture.ts"
Cohesion: 0.05
Nodes (47): CaptureColumn, CapturedTable, CaptureState, ModuleColumn, ModuleTableOptions, GuardTableRow, CheckFunctionsOptions, IntegerCheckRow (+39 more)

### Community 26 - "dispatch.test.ts"
Cohesion: 0.06
Nodes (47): DurabilityViolation, ErrorCode, EntryRange, GraphInput, HeightRange, PastFaultCase, RefusalCase, Recorder (+39 more)

### Community 27 - "harness.ts"
Cohesion: 0.10
Nodes (45): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+37 more)

### Community 28 - "node.test.ts"
Cohesion: 0.07
Nodes (18): Frame, RawClient, Variant, TapeClock, expectAnswersByOccurrence(), expectDelayHonoured(), expectNotificationsAfterCalls(), manualClock() (+10 more)

### Community 29 - "changes.property.test.ts"
Cohesion: 0.06
Nodes (45): ChangeKind, tableChanges, TouchedRow, Op, States, TableName, digestBlock(), takeChanges() (+37 more)

### Community 3 - "declaration.ts"
Cohesion: 0.03
Nodes (91): ApiRegistry, BlockContext, BlockHeader, DefinedModule, FieldKind, FieldSchema, ItemDeclaration, ItemSink (+83 more)

### Community 30 - "boundary.test.ts"
Cohesion: 0.09
Nodes (41): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+33 more)

### Community 31 - "core-settings.test.ts"
Cohesion: 0.05
Nodes (42): PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly, hashHex() (+34 more)

### Community 32 - "graph.ts"
Cohesion: 0.08
Nodes (46): Edge, GraphFacts, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts (+38 more)

### Community 33 - "FinalizedLoop"
Cohesion: 0.09
Nodes (12): EntryBoundary, PointSchedule, FinalizedLoop, WaitingInRead, FailingAfter, StartsAtEveryRevision, CoreStopsFirst, NoRedelivery (+4 more)

### Community 34 - "ref_node_fs"
Cohesion: 0.06
Nodes (26): Finding, Lockfile, Manifest, Upstream, GuardViolation, lines(), filesUnder(), patchesOf() (+18 more)

### Community 35 - "config/history.ts"
Cohesion: 0.09
Nodes (40): HistoryCheck, HistoryCode, HistoryContext, Span, CheckedEntry, PlacedEntry, StartedProcess, asNumber() (+32 more)

### Community 36 - "entries.ts"
Cohesion: 0.06
Nodes (41): CoreLedgerVersion, LedgerName, LedgerPackageIdentity, CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder (+33 more)

### Community 37 - "writer-lock-checks.ts"
Cohesion: 0.09
Nodes (37): WriterProcess, Job, WorkerEvent, PauseReport, blocksIn(), cleanUp(), firstOf(), startWriterProcess() (+29 more)

### Community 38 - "wallet-state-envelope.test.ts"
Cohesion: 0.08
Nodes (38): EnvelopeCorruptError, EnvelopeVersionUnsupportedError, WalletStateEnvelope, WalletStateEnvelopeError, hasPostgresUnsafeText(), decode(), encode(), safeNonEmptyString() (+30 more)

### Community 39 - "module-api.ts"
Cohesion: 0.08
Nodes (32): ChainDataAnswer, ChainDataView, ApiError, ApiErrorCode, ApiRequest, HttpHandler, HttpMethod, HttpRoute (+24 more)

### Community 4 - "pglite.ts"
Cohesion: 0.04
Nodes (88): ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, ReadOptions, DurabilityProbeOptions, DurabilityWarning (+80 more)

### Community 40 - "validate.ts"
Cohesion: 0.09
Nodes (41): HistoryFinding, CursorRule, Finding, Issue, Plain, coreSettingsSchema(), pathOf(), closest() (+33 more)

### Community 42 - "validate.test.ts"
Cohesion: 0.08
Nodes (34): coreEntry, ConfigRule, EntryRef, CursorRow, Expected, entryOf(), checked(), declarations() (+26 more)

### Community 43 - "runner/process.ts"
Cohesion: 0.08
Nodes (27): CheckState, ConfigCheckOptions, CoreVersion, ProcessSide, LoadedConfig, plainData, CheckedConfig, ConfigContext (+19 more)

### Community 44 - "cursor-durability.crash.test.ts"
Cohesion: 0.07
Nodes (30): BatchSpec, CurrentState, InvariantResult, CrashWorkerHandle, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs() (+22 more)

### Community 5 - "ValidationError"
Cohesion: 0.03
Nodes (115): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointSummary, ChunkIntegrityError, ChunkMissingError, ContentHash (+107 more)

### Community 50 - "config-check-database.test.ts"
Cohesion: 0.10
Nodes (24): ConfigCheckReport, cliProject, CommandResult, CheckTarget, configText(), coreSettings(), emitDeclarations(), inChild() (+16 more)

### Community 52 - "config-check.ts"
Cohesion: 0.09
Nodes (26): CheckFinding, CheckStep, StepName, StepReport, StepStatus, DatabaseState, TypeCheckFinding, TypeCheckResult (+18 more)

### Community 53 - "api-server.ts"
Cohesion: 0.09
Nodes (24): ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, StartedModuleApi, ApiResponse, ApiRoutes, ApiStartup, ModuleRegistration (+16 more)

### Community 54 - "order.property.test.ts"
Cohesion: 0.10
Nodes (30): CheckName, GraphSpec, ModuleSpec, TESTED, byBytes(), checkDigestLast(), checkEachOnce(), checkParallelWaits() (+22 more)

### Community 55 - "NodeClient"
Cohesion: 0.14
Nodes (8): HeadSubscriber, NodeClient, isRecord(), isRetryable(), SYSTEM_TIMERS, 14. External claims and their evidence, 10. Node client and ingest, 9. Test tape

### Community 57 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (30): Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain, hex(), hex() (+22 more)

### Community 58 - "format.test.ts"
Cohesion: 0.11
Nodes (20): Metadata, Step, TapeError, expectGoldenRoundTrip(), checkTape(), recordLine(), sessionCheck(), deepFreeze() (+12 more)

### Community 6 - "column-rules.ts"
Cohesion: 0.02
Nodes (102): CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType, ColumnFacts (+94 more)

### Community 60 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): LoopObserver, 8. Private processes (PP), ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database (+20 more)

### Community 63 - "plain-data.ts"
Cohesion: 0.10
Nodes (22): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+14 more)

### Community 64 - "redact.test.ts"
Cohesion: 0.12
Nodes (23): PlainObject, RedactableConfig, RedactionForms, SecretForm, TextPattern, EntryView, fieldKinds, Needs (+15 more)

### Community 66 - "differential-equivalence.test.ts"
Cohesion: 0.12
Nodes (26): CurrentState, Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1() (+18 more)

### Community 67 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.12
Nodes (25): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, bootstrapChainArchiveSchema() (+17 more)

### Community 69 - "command.ts"
Cohesion: 0.13
Nodes (20): CommandHandler, CommandIo, MainProcess, ConfigCheckSeams, redactor, checkArguments(), configCommand(), runCommand() (+12 more)

### Community 7 - "PgTransactionLeaseLayer"
Cohesion: 0.03
Nodes (85): TransactionLeaseLayer, PgCheckpointStore, UmbraDBSql, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters (+77 more)

### Community 70 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 73 - "pglite-timeouts.test.ts"
Cohesion: 0.10
Nodes (17): Run, Job, WorkerEvent, LockResult, expectNeverCutOffNorHung(), settings(), apiRead(), engine() (+9 more)

### Community 74 - "ChainArchiveStore"
Cohesion: 0.08
Nodes (13): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2.3 Partition rollover (`src/postgres/chain-archive-rollover.ts`), 2. Architecture, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage (+5 more)

### Community 75 - "PgChainArchiveStore"
Cohesion: 0.19
Nodes (11): BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf() (+3 more)

### Community 77 - "cursor-table.property.test.ts"
Cohesion: 0.10
Nodes (23): Access, Block, BlockFails, Counts, Write, Failure, canonicalText(), expectValue() (+15 more)

### Community 78 - "ws-mutual-tls.test.ts"
Cohesion: 0.11
Nodes (18): Attempt, locked(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+10 more)

### Community 79 - "5. Runner"
Cohesion: 0.20
Nodes (24): Callback, ParallelPoint, LoopEnd, ProcessState, boundaryModules(), dispatch(), entryIdOf(), isBackbonePart() (+16 more)

### Community 8 - "loop.test.ts"
Cohesion: 0.04
Nodes (79): InMemoryBlockSource, HeightRun, Client, Seen, Batching, Contexts, LoopClass, RunnerBackend (+71 more)

### Community 81 - "describeNodeStoreExports"
Cohesion: 0.17
Nodes (11): NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), 5.1 The `LedgerPackage` interface (LG-6), 5.2 Vendored builds (LG-5), 5.3 The ledger worker and the node-store bridge (LG-10, LG-11), 5.4 Storage, retention and sweep (LG-11 to LG-14), 5.5 Ledger tasks (LG-17, Q49) (+3 more)

### Community 83 - "mapping.ts"
Cohesion: 0.14
Nodes (21): ResultColumn, ResultType, isInfinity(), malformed(), malformedArray(), parseArrayText(), parseBigint(), parseBoolean() (+13 more)

### Community 84 - "pg-tx-history-adapter.ts"
Cohesion: 0.14
Nodes (17): LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore(), reconstructLifecycle() (+9 more)

### Community 85 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (12): CurrentState, GcPass, HistGroup, SampleObservation, kvMapKey(), newPool(), readCurrentState(), { connectionUri } (+4 more)

### Community 86 - "chain-archive-rollover.ts"
Cohesion: 0.13
Nodes (19): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+11 more)

### Community 9 - "translatePostgresError"
Cohesion: 0.04
Nodes (96): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionFaultError, TransactionLeaseError, TransactionOptions (+88 more)

### Community 90 - "development-opt-in.test.ts"
Cohesion: 0.12
Nodes (14): LoadOptions, invalid(), isFile(), loadConfig(), load(), resolve(), DEFAULT_CONFIG_FILE, TYPESCRIPT_SYNTAX (+6 more)

### Community 91 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (16): BlobRole, BlockBundle, BlockMeta, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult (+8 more)

### Community 92 - "postgres-image.test.ts"
Cohesion: 0.10
Nodes (16): RepositoryFile, Report, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS (+8 more)

### Community 93 - "validation.ts"
Cohesion: 0.10
Nodes (20): PlacedDeclaration, Plain, FIELD_KINDS, LIFETIMES, TABLE_KINDS, badId, DECLARATION_PROPERTIES, duplicateId (+12 more)

### Community 94 - "pg-kill-save.crash.test.ts"
Cohesion: 0.12
Nodes (18): C5AnyFn, assertSaveNotAutoRetriedUnderRetriableFault(), assertSaveNotInAnyAutoRetryAllowlist(), completeManifestCount(), completeManifestCountAtSeq(), danglingChunkCount(), listSrcTsFiles(), makeSerializationFaultInjectingClient() (+10 more)

### Community 95 - "read-only-database.test.ts"
Cohesion: 0.13
Nodes (12): ReadOnlyDatabase, OffersReadOnly, readOnlyDatabase(), block(), namesOf(), prototypesOf(), readOnlyProblems(), setUp() (+4 more)

### Community 97 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.11
Nodes (17): Hash, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence) (+9 more)

### Community 100 - "migrations"
Cohesion: 0.12
Nodes (16): runMigrationsImpl(), migrations(), 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), How the two lineages coexist, 6. Storage helpers, Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 4: Watermarks (+8 more)

### Community 117 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 118 - "mapping.test.ts"
Cohesion: 0.19
Nodes (4): mapRows(), mapValue(), RESULT_TYPES, RFC-3339

### Community 130 - "address"
Cohesion: 0.18
Nodes (12): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Requirement: Set is an unconditional overwrite at the exact address, Scenario: A later value wins at the same address, Scenario: Abstract absence remains distinct from a stored null-like value (+4 more)

### Community 143 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 144 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 146 - "scoped-review-manifest"
Cohesion: 0.20
Nodes (10): explain(), explainRefusal(), Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation (+2 more)

### Community 149 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 175 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 205 - "fresh-instance.mjs"
Cohesion: 0.40
Nodes (4): hex(), requested, store, stored

### Community 207 - "parameterText"
Cohesion: 0.47
Nodes (6): arrayLiteral(), hexOf(), invalidParameter(), isPlainObject(), jsonText(), parameterText()

### Community 47 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 49 - "context"
Cohesion: 0.07
Nodes (22): schemaName(), module(), context(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 56 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): listen(), ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret (+23 more)

### Community 87 - "1. Determinism primitives"
Cohesion: 0.10
Nodes (21): databaseRefusals(), refusalMessage(), relationRefusals(), tableRefusals(), 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix (+13 more)

### Community 88 - "vendored-ledger-v9.test.ts"
Cohesion: 0.23
Nodes (18): bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex(), nodesOf() (+10 more)

### Community 89 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.09
Nodes (21): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number (+13 more)

### Community 99 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.24
Nodes (16): phaseA_syncAndPersistEnvelope(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), startTestDatabase(), stopTestDatabase(), EXPECTED_NIGHT_VALUE, EXPECTED_UNSHIELDED_ADDRESS (+8 more)

### Community 102 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (17): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest (+9 more)

### Community 104 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 106 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 108 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 110 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.12
Nodes (14): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`) (+6 more)

### Community 111 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 112 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor first, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+7 more)

### Community 113 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.13
Nodes (15): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N) (+7 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract, Scenario: An untouched address retains its initial value (+6 more)

### Community 116 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 120 - "ROADMAP.md"
Cohesion: 0.14
Nodes (9): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+1 more)

### Community 121 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.14
Nodes (14): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+6 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 123 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 124 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 126 - "Roadmap"
Cohesion: 0.14
Nodes (14): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+6 more)

### Community 129 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 132 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 133 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 137 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 138 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 139 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.17
Nodes (11): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover), 7. What this change deliberately does not verify (traceability of the non-goals) (+3 more)

### Community 140 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 141 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 145 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 147 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 150 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.20
Nodes (10): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 7. Driver / toolkit choice (+2 more)

### Community 151 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 152 - "3. Proof-blocking findings"
Cohesion: 0.20
Nodes (10): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption, 3.8 C2 safety and liveness are different theorem classes (+2 more)

### Community 153 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 154 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 155 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 156 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 158 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.22
Nodes (5): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first

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

### Community 163 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 164 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 165 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 166 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 167 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 169 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 170 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 171 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 172 - "Security policy & threat model"
Cohesion: 0.25
Nodes (8): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 173 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 174 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 176 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 177 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 178 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 179 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 180 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 181 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 183 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 184 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 185 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 186 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 187 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 188 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 190 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 191 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.33
Nodes (4): 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 192 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 193 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 194 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 195 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 196 - "Proposal — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 1: project setup + TemporalKV, What changes, Why

### Community 197 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 198 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 199 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 200 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 201 - "Proposal — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 1.0.0 gate items addressed, Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0-perf-baseline, Why

### Community 202 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 203 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 204 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 206 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 208 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 209 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 210 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 211 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 212 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 213 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 214 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 215 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 216 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 217 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 218 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 219 - "Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network"
Cohesion: 0.40
Nodes (5): Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Scenario: A rolled-back save consumes no sequence number, Scenario: Concurrent saves for one wallet+network still produce a gapless, non-repeating sequence, Scenario: Different wallet+network pairs have independent sequence counters, Scenario: Sequential saves for one wallet+network produce consecutive sequence numbers

### Community 220 - "Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (explicitly out of scope for this change), Proposal — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Why

### Community 221 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 222 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 223 - "9. Trust and refinement boundary"
Cohesion: 0.50
Nodes (4): 9. Trust and refinement boundary, Completed M1/M2/W1 claims, Deferred M2–M5 proof work, Named external obligations

### Community 224 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 225 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 226 - "2. Schema — two corrections to `design/design.md` §3"
Cohesion: 0.50
Nodes (4): 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3

### Community 227 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.50
Nodes (3): Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, Why

### Community 228 - "Requirement: CI gates any change to flake.lock behind explicit review (G18)"
Cohesion: 0.50
Nodes (4): Requirement: CI gates any change to flake.lock behind explicit review (G18), Scenario: A labeled flake.lock change is allowed, Scenario: A pull request that does not touch flake.lock passes, Scenario: An unlabeled flake.lock change fails the gate

### Community 229 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 230 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 231 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 235 - "Vendored ledger builds"
Cohesion: 0.50
Nodes (3): Rebuilding, Updating a version, Vendored ledger builds

### Community 238 - "9. Backups and browser"
Cohesion: 0.67
Nodes (3): 9.1 Backups (BK; Q83, Q85), 9.2 Browser build (BR), 9. Backups and browser

### Community 239 - "Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats"
Cohesion: 0.67
Nodes (3): Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Scenario: A manifest's chunks are read back in position order regardless of storage order, Scenario: A payload containing a repeated chunk round-trips correctly

### Community 240 - "Requirement: manifestHash is computed once at write time from the ordered chunk-hash sequence"
Cohesion: 0.67
Nodes (3): Requirement: manifestHash is computed once at write time from the ordered chunk-hash sequence, Scenario: Identical payloads saved as separate checkpoints report the same manifestHash, Scenario: Payloads differing only in chunk order report different manifestHash

### Community 241 - "Requirement: prune retains exactly the N newest complete manifests per wallet+network"
Cohesion: 0.67
Nodes (3): Requirement: prune retains exactly the N newest complete manifests per wallet+network, Scenario: Pruning to retain k newest keeps exactly those k, Scenario: Pruning to retain the single newest manifest keeps only it

### Community 242 - "Requirement: get returns exactly the last value set, scoped per (kind, key)"
Cohesion: 0.67
Nodes (3): Requirement: get returns exactly the last value set, scoped per (kind, key), Scenario: A different kind or key is never affected by an unrelated set, Scenario: get reflects the most recent set among several

### Community 243 - "Requirement: set is an idempotent, unconditional overwrite (Law W1)"
Cohesion: 0.67
Nodes (3): Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A new set always overwrites, with no conflict possible, Scenario: Setting the same value twice leaves the stored state unchanged

### Community 244 - "Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18)"
Cohesion: 0.67
Nodes (3): Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Scenario: A newly introduced secret outside the allowlist fails the scan, Scenario: The historical wallet secret and the template placeholder do not fail the scan

### Community 245 - "Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16)"
Cohesion: 0.67
Nodes (3): Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16), Scenario: The dedup and prune docs state the trust-domain requirement and the side channel, Scenario: The rewrite changes no contract and preserves existing accurate caveats

### Community 41 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 45 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+30 more)

### Community 46 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data responses name their view and height (+30 more)

### Community 48 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+29 more)

### Community 51 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+25 more)

### Community 59 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.06
Nodes (28): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+20 more)

### Community 61 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18), Requirement: The localhost Require default is unchanged (G17), Requirement: The repository ships an ignore-scripts .npmrc that CI asserts (G18) (+22 more)

### Community 62 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: history() computes per-manifest aggregates in a single grouped query (HP-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+22 more)

### Community 65 - "Full-Chain Storage — Design"
Cohesion: 0.07
Nodes (29): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs, 3.5 Dust generation + ledger events (generic) (+21 more)

### Community 68 - "package.json"
Cohesion: 0.07
Nodes (27): bin, umbradb, bugs, url, description, engines, node, exports (+19 more)

### Community 71 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 72 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: Schema isolation is the default, not opt-in (+18 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: Schema isolation is the default, not opt-in (+17 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: an unrecognized envelopeVersion is rejected, never best-effort restored, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses, Requirement: getAll returns live bigint/Date-typed common fields through the adapter, Requirement: load returns the persisted envelope, by latest or explicit sequence (+17 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: merge semantics are equivalent to mergeWalletEntries, not last-write-wins, Requirement: one storage instance is bound to exactly one wallet at construction, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract (+15 more)

### Community 96 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 98 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+10 more)

## Knowledge Gaps
- **36 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-3339` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2483 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `UmbraError`, `load-under-prune.integration.test.ts`, `src/index.ts`, `declaration.ts`, `pglite.ts`, `ValidationError`, `column-rules.ts`, `PgTransactionLeaseLayer`, `ref_node_crypto`, `translatePostgresError`, `no-indexer-or-wallet-sdk.test.ts`, `Database`, `postgres/durability-probe.test.ts`, `node/client.test.ts`, `module-tables.ts`, `history.property.test.ts`, `api.ts`, `TransactionHandle`, `facade-merge-loader.ts`, `node/client.ts`, `history.test.ts`, `opt-out.test.ts`, `resolveTransaction`, `cbor.ts`, `setup.ts`, `dispatch.test.ts`, `node.test.ts`, `changes.property.test.ts`, `boundary.test.ts`, `core-settings.test.ts`, `PgTransactionHistoryStorage`, `ref_node_fs`, `entries.ts`, `writer-lock-checks.ts`, `wallet-state-envelope.test.ts`, `module-api.ts`, `loop.test.ts`, `validate.test.ts`, `cursor-durability.crash.test.ts`, `config-check-database.test.ts`, `order.property.test.ts`, `cbor.property.test.ts`, `format.test.ts`, `plain-data.ts`, `redact.test.ts`, `differential-equivalence.test.ts`, `chain-archive-replay-decode.integration.test.ts`, `package.json`, `command.ts`, `check-required-tests.ts`, `pglite-timeouts.test.ts`, `process.test.ts`, `cursor-table.property.test.ts`, `ws-mutual-tls.test.ts`, `full-sync-soak.integration.test.ts`, `vendored-ledger-v9.test.ts`, `development-opt-in.test.ts`, `postgres-image.test.ts`, `pg-kill-save.crash.test.ts`, `read-only-database.test.ts`, `cold-boot-recovery.integration.test.ts`, `validation.test.ts`, `pglite.test.ts`, `postgresql.test.ts`, `node-format.ts`, `mutation-per-adapter.mjs`, `mapping.test.ts`, `vitest.config.ts`, `pg-tx-history-adapter.test.ts`, `read-height.property.test.ts`?**
  _High betweenness centrality (0.291) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.025983771868111252 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `declaration.ts`, `pglite.ts`, `loop.test.ts`, `Database`, `node/client.test.ts`, `Session`, `module-tables.ts`, `api.ts`, `process.test.ts`, `node/client.ts`, `history.test.ts`, `opt-out.test.ts`, `cbor.ts`, `dispatch.test.ts`, `changes.property.test.ts`, `graph.ts`, `FinalizedLoop`, `config/history.ts`, `entries.ts`, `writer-lock-checks.ts`, `module-api.ts`, `validate.ts`, `validate.test.ts`, `runner/process.ts`, `config-check.ts`, `api-server.ts`, `NodeClient`, `plain-data.ts`, `parameterText`, `mapping.ts`, `development-opt-in.test.ts`, `validation.ts`, `read-only-database.test.ts`, `validation.test.ts`, `mapping.test.ts`, `checkShape`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Should `PgTransactionHistoryStorage` be split into smaller, more focused modules?**
  _Cohesion score 0.025045637093829867 - nodes in this community are weakly interconnected._