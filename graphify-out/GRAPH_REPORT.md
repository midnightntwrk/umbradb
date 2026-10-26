# Graph Report - UmbraDB

## Corpus Check
- 639 files · ~1,042,797 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 64 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 6787 nodes · 17942 edges · 275 communities (254 shown, 21 thin omitted)
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 2424 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `ce72cf30b64d9ddb` (639 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- db/migrate.ts
- PgTransactionLeaseLayer
- vitest
- height-versioned.property.test.ts
- node/errors.ts
- validate.test.ts
- node-format.ts
- ModuleApi
- api-server.ts
- api.ts
- ws-mutual-tls.test.ts
- checkShape
- cursor-table.property.test.ts
- .error
- config-check.ts
- RawClient
- no-indexer-or-wallet-sdk.test.ts
- 3. Proof-blocking findings
- midnight-env — reproducible PREPROD dev environment
- TransactionKeyReuseError
- ApiRoutes
- component-table.test.ts
- node/client.test.ts
- holds
- runner/process.ts
- postgres/chain-archive-store.ts
- Reader
- column-rules.ts
- fresh-instance.ts
- ProcessItems
- postgres-image.test.ts
- stop-heights.test.ts
- Global Constraints
- Design — v1.0.0: Formal completion (`formal-completion`)
- type-check.ts
- TransactionHandle
- ReadPool
- translatePostgresError
- config/history.ts
- interfaces/chain-archive-store.ts
- transform-checks.ts
- mutation-evidence.d.mts
- vendored-ledger-files.test.ts
- builder.negative-control.test.ts
- record-and-replay.test.ts
- history.test.ts
- HeldRead
- postgres/client.ts
- loop.test.ts
- terminationSignal
- CliBackend
- interfaces/temporal-kv.ts
- Database
- createClient
- PgTransactionHistoryStorage
- postgres/checkpoint-store.ts
- order.property.test.ts
- cbor.ts
- zero-timeouts-checks.ts
- column-rules.test.ts
- graph.ts
- dispatch.test.ts
- module-tables.test.ts
- module-tables.ts
- FinalizedLoop
- UmbraError
- TemporalKV
- plain-data.ts
- ValidationError
- validate.ts
- column-refusals.test.ts
- replay-check.ts
- boundary.test.ts
- describeNodeStoreExports
- declaration.ts
- node.test.ts
- validation.ts
- FakeNode
- core-settings.test.ts
- cbor.property.test.ts
- pg-tx-history-adapter.ts
- database-fixtures.ts
- tape/index.ts
- digest.test.ts
- PointName
- cursor-durability.crash.test.ts
- redact.test.ts
- differential-equivalence.test.ts
- ref_node_crypto
- mapping.ts
- src/index.ts
- chain-archive-replay-decode.integration.test.ts
- PgChainArchiveStore
- 5. Runner
- checks.test.ts
- node/client.ts
- check-required-tests.ts
- writer-lock-checks.ts
- postgres/transaction-history-storage.ts
- chain-archive-rollover.ts
- ChainArchiveStore
- changes.property.test.ts
- module-api.ts
- setup.ts
- NodeClient
- TransactionHistoryEntry
- .#ended
- transaction-history-storage.property.test.ts
- module-api.test.ts
- TapeNode
- What changes — the 1.0.0 gate items this change addresses
- integer
- context
- table
- Design — Sprint 7: Transaction History Storage
- mutation-per-adapter.mjs
- envelope.test.ts
- address
- ADDED Requirements
- history.property.test.ts
- facade-merge-loader.ts
- pack-install.mjs
- .boolean
- parseJsonLossless
- runMigrations
- graph.py
- ADDED Requirements
- withAbort
- fn
- cold-boot-recovery.integration.test.ts
- version
- decode.ts
- Storage Algebra Lean Formalization — Approved Design and Status
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- stryker.conf.json
- STORAGE_ALGEBRA_LEAN_RESEARCH.md
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 Implementation Guideline
- ADDED Requirements
- ADDED Requirements
- ROADMAP.md
- ADDED Requirements
- devDependencies
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Roadmap
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- Design — v1.1.0: Quint model checking
- compilerOptions
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB and SLSA — supply-chain integrity assessment
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- explore.md
- Design — Postgres+JSONB storage rebuild
- UmbraDB module guide
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
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
- conformance-gate.mjs
- Contributing
- UmbraDB 0.9.5 "Penumbra"
- Storage Algebra Lean M3a Watermarks Sprint
- Security policy & threat model
- Roadmap for the missing formalization
- Design — CORE-ARCH: the standalone indexer's core architecture
- Acceptance criteria — v1.0.0-infosec-signoff
- Our Pledge
- Algebraic Specification of the midnight-pg-store Storage Layer
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 12. Milestone status
- 5. Recommended candidate model
- Design — Sprint 1: project setup + TemporalKV
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0 API Surface & Release Contract
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Proposal — Sprint 5: Lean M3a Watermarks W1
- Tasks — Sprint 5: Lean M3a Watermarks W1
- Proposal — Sprint 6: Lean M3b CheckpointStore C1
- Tasks — Sprint 6: Lean M3b CheckpointStore C1
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
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- Requirement: DB-11 Exactly one writer per database
- Proposal — Sprint 2: Transaction/Lease
- Proposal — v1.0.0 API Surface & Release Contract
- Requirement: CI gates any change to flake.lock behind explicit review (G18)
- Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- Requirement: DB-10 Migrations of an upgrade never change stored values
- Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep
- Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18)
- Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16)
- repository
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
- Full-Chain Storage — Design
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)

## God Nodes (most connected - your core abstractions)
1. `vitest` - 186 edges
2. `UmbraError` - 161 edges
3. `PgTransactionLeaseLayer` - 93 edges
4. `PgCheckpointStore` - 87 edges
5. `ModuleDeclaration` - 87 edges
6. `ValidationError` - 87 edges
7. `runMigrations()` - 86 edges
8. `translatePostgresError()` - 78 edges
9. `Database` - 73 edges
10. `TransactionHandle` - 70 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `2.1 Historical implementation baseline` --references--> `PgTemporalKV`  [INFERRED]
  Formal/STORAGE_ALGEBRA_LEAN_RESEARCH.md → src/postgres/temporal-kv.ts
- `2. TemporalKV → Postgres` --references--> `TransactionKeyReuseError`  [INFERRED]
  design/design.md → src/interfaces/temporal-kv.ts
- `Rework (class 1 — infra)` --references--> `ConnectionError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/storage-errors.ts
- `Scenario: A connection failure surfaces as ConnectionError` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/archive/2026-07-21-sprint-1-setup-and-temporal-kv/specs/temporal-kv/spec.md → src/interfaces/storage-errors.ts

## Import Cycles
- None detected.

## Communities (275 total, 21 thin omitted)

### Community 0 - "db/migrate.ts"
Cohesion: 0.03
Nodes (133): CapturedTable, AppliedRow, MigrationPart, Runnable, Settling, StartupInput, Difference, OwnPart (+125 more)

### Community 1 - "PgTransactionLeaseLayer"
Cohesion: 0.02
Nodes (108): TransactionLeaseLayer, PgCheckpointStore, UmbraDBSql, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks, Adapters, Adapters (+100 more)

### Community 10 - "vitest"
Cohesion: 0.04
Nodes (50): LoadOutcome, OutsideRead, Traced, PgliteTestDatabase, PgliteTestServer, Phase, OffersReadOnly, TestPart (+42 more)

### Community 103 - "height-versioned.property.test.ts"
Cohesion: 0.12
Nodes (16): Block, BlockFails, Counts, Effect, Key, Op, canonicalText(), readBack() (+8 more)

### Community 109 - "node/errors.ts"
Cohesion: 0.15
Nodes (13): SocketFailure, backoffDelay(), positive(), callTimedOut(), invalidOption(), isRecord(), kindOf(), methodNotAllowed() (+5 more)

### Community 11 - "validate.test.ts"
Cohesion: 0.03
Nodes (71): LedgerName, coreEntry, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+63 more)

### Community 110 - "node-format.ts"
Cohesion: 0.26
Nodes (15): StoredNode, Child, NodeBatch, childKey(), concat(), encodeChild(), encodeChildren(), hasEmbeddedChild() (+7 more)

### Community 112 - "ModuleApi"
Cohesion: 0.23
Nodes (6): Connection, ModuleApi, errorMessage(), encodeJson(), hex(), 2. Points

### Community 116 - "api-server.ts"
Cohesion: 0.18
Nodes (14): ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, ApiStartup, listenModuleApi(), parseAddress(), readBody(), serve() (+6 more)

### Community 12 - "api.ts"
Cohesion: 0.04
Nodes (43): BlockWriteHandle, ReadHandle, ReadOnlyDatabase, ReadOptions, SchemaWriteHandle, Transaction, MultiStatementRunner, cursorTable (+35 more)

### Community 121 - "ws-mutual-tls.test.ts"
Cohesion: 0.19
Nodes (10): Attempt, connect(), file(), makeCa(), makeLeaf(), openssl(), read(), tlsClientErrors (+2 more)

### Community 125 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 126 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 129 - ".error"
Cohesion: 0.19
Nodes (7): HeadSubscriber, 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 13 - "config-check.ts"
Cohesion: 0.05
Nodes (63): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName (+55 more)

### Community 134 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 136 - "3. Proof-blocking findings"
Cohesion: 0.15
Nodes (13): Absent, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces (+5 more)

### Community 137 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.17
Nodes (10): Lockfile, Manifest, locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment (+2 more)

### Community 14 - "TransactionKeyReuseError"
Cohesion: 0.03
Nodes (78): TransactionKeyReuseError, T(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 1. TemporalKV — event-sourced right action with a CAS guard, ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4) (+70 more)

### Community 142 - "ApiRoutes"
Cohesion: 0.23
Nodes (7): ApiRoutes, ModuleRegistration, parsePath(), registerModuleApis(), shapeOf(), routesOf(), routesOf()

### Community 143 - "component-table.test.ts"
Cohesion: 0.17
Nodes (9): DesignTable, RowCoverage, opensDatabase(), calledNames(), typeScriptFiles(), OPENERS, ROWS, SUITE (+1 more)

### Community 15 - "node/client.test.ts"
Cohesion: 0.04
Nodes (47): NodeClientOptions, NodeRetry, ConnectSocket, NodeSocketEvents, recorded, ManualTimers, RecordAndReplayOptions, connectWebSocket() (+39 more)

### Community 159 - "holds"
Cohesion: 0.47
Nodes (4): VersionedValue, StoredVersion, Model, holds()

### Community 16 - "runner/process.ts"
Cohesion: 0.05
Nodes (45): CheckState, ConfigCheckOptions, ProcessSide, LoadedConfig, plainData, CheckedConfig, ConfigContext, ConfigInput (+37 more)

### Community 160 - "postgres/chain-archive-store.ts"
Cohesion: 0.25
Nodes (7): BlockMeta, BlockRow, ChainArchiveTx, TxRow, bufToHex(), toBlockMeta(), Hex32Schema

### Community 161 - "Reader"
Cohesion: 0.36
Nodes (5): Reader, decodeChild(), decodeChildren(), readChild(), readChildList()

### Community 17 - "column-rules.ts"
Cohesion: 0.04
Nodes (78): CaptureState, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts (+70 more)

### Community 175 - "fresh-instance.ts"
Cohesion: 0.22
Nodes (7): FreshInstanceRequest, FreshInstanceResult, hex(), runInFreshInstance(), requested, store, stored

### Community 177 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 18 - "stop-heights.test.ts"
Cohesion: 0.06
Nodes (58): ProcessingEnd, ProcessStatus, ProcessBackend, ProcessDatabase, testBuild, A42Observation, Seen, WorkEvent (+50 more)

### Community 181 - "Global Constraints"
Cohesion: 0.22
Nodes (8): Write, Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 183 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 189 - "type-check.ts"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 19 - "TransactionHandle"
Cohesion: 0.05
Nodes (59): TransactionHistoryReader, TransactionHistoryWriter, TransactionHandle, TransactionHandleInvalidError, WatermarkKey, WatermarkKind, WatermarkValue, WatermarkRow (+51 more)

### Community 2 - "translatePostgresError"
Cohesion: 0.04
Nodes (124): ConnectionError, SerializationFailedError, StorageError, Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError (+116 more)

### Community 20 - "config/history.ts"
Cohesion: 0.06
Nodes (60): CoreVersion, CoreSettings, UmbraConfig, HistoryCode, HistoryContext, Span, CheckedEntry, PlacedEntry (+52 more)

### Community 201 - "interfaces/chain-archive-store.ts"
Cohesion: 0.25
Nodes (7): BlobRole, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult, VerifierKeyScope

### Community 21 - "transform-checks.ts"
Cohesion: 0.07
Nodes (47): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, turns() (+39 more)

### Community 216 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 217 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 218 - "builder.negative-control.test.ts"
Cohesion: 0.29
Nodes (3): Failure, Variant, WrongRecording

### Community 22 - "record-and-replay.test.ts"
Cohesion: 0.05
Nodes (37): Answer, Handler, Received, ConnectionFrames, Recorded, Refusal, Frame, Script (+29 more)

### Community 23 - "history.test.ts"
Cohesion: 0.06
Nodes (61): CoreLedgerVersion, LedgerPackageIdentity, versionEntry, HistoryCheck, HistoryInput, HistoryOptions, HistoryRow, HistoryRule (+53 more)

### Community 231 - "HeldRead"
Cohesion: 0.60
Nodes (3): HeldRead, concurrent(), queued()

### Community 24 - "postgres/client.ts"
Cohesion: 0.06
Nodes (36): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, BlockRow, TxRow, overridingUrlParameter(), assertNoConflictingSearchPath() (+28 more)

### Community 25 - "loop.test.ts"
Cohesion: 0.06
Nodes (40): BlockRef, InMemoryBlockSource, InMemorySourceOptions, HeightRun, Batching, LoopClass, RunnerDatabase, Broken (+32 more)

### Community 26 - "interfaces/temporal-kv.ts"
Cohesion: 0.07
Nodes (53): AsOf, AssertExact, HistoryUnavailableError, JsonValue, Key, Namespace, Scope, TemporalKVError (+45 more)

### Community 27 - "Database"
Cohesion: 0.06
Nodes (50): Database, Chain, ChainOptions, DigestRow, TestBackend, TestDatabase, Case, Job (+42 more)

### Community 28 - "createClient"
Cohesion: 0.09
Nodes (48): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+40 more)

### Community 29 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (48): TransactionHistoryStorage, PgTransactionHistoryStorage, capitalize(), encodeContent(), encodeSections(), encodeStoredEntry(), 1. Decisive scope, 2. Live-sync conformance test plan (+40 more)

### Community 3 - "postgres/checkpoint-store.ts"
Cohesion: 0.02
Nodes (132): CheckpointNotFoundError, CheckpointRecord, CheckpointStoreError, ChunkIntegrityError, ChunkMissingError, ManifestCorruptError, AggregateRow, ChunkJoinRow (+124 more)

### Community 31 - "order.property.test.ts"
Cohesion: 0.05
Nodes (48): PointArguments, PointRun, CallEvent, Contexts, Recorder, WithDb, CheckName, GraphSpec (+40 more)

### Community 32 - "cbor.ts"
Cohesion: 0.08
Nodes (44): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+36 more)

### Community 33 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (33): Settings, Run, Job, WorkerEvent, Outcome, expectNeverCutOffNorHung(), settings(), apiRead() (+25 more)

### Community 34 - "column-rules.test.ts"
Cohesion: 0.05
Nodes (30): Because, columnVerdict, DefaultPart, Refusal, TableRule, TreeNode, TypeRule, DesignTable (+22 more)

### Community 35 - "graph.ts"
Cohesion: 0.07
Nodes (48): Edge, GraphFacts, GraphPart, GraphRule, HeightRange, MidChain, Missing, RangeCheck (+40 more)

### Community 36 - "dispatch.test.ts"
Cohesion: 0.08
Nodes (43): GraphInput, PastFaultCase, RefusalCase, keysModule(), contractLogs(), declaration(), logsProvider(), reader() (+35 more)

### Community 37 - "module-tables.test.ts"
Cohesion: 0.08
Nodes (34): ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, contentsHash(), countRows(), fromClause() (+26 more)

### Community 38 - "module-tables.ts"
Cohesion: 0.05
Nodes (31): CaptureColumn, ModuleColumn, ModuleTable, ModuleTableOptions, PageOptions, ColumnType, RefusalCode, RefusalOptions (+23 more)

### Community 39 - "FinalizedLoop"
Cohesion: 0.10
Nodes (11): FinalizedLoop, LoopObserver, Startup, WaitingInRead, FailingAfter, NoRedelivery, CommitsTheBoundary, call() (+3 more)

### Community 4 - "UmbraError"
Cohesion: 0.03
Nodes (82): ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning (+74 more)

### Community 40 - "TemporalKV"
Cohesion: 0.05
Nodes (35): TemporalKV, Watermarks, 6. Encrypted blob storage (`MongoPrivateStateProvider`/`MongoWalletStateStore`), 9. Module → module mapping (source of truth for `tasks.md`), 1.2 Async pattern, 1.3 Transaction participation, 1. Shared Conventions, 2. `storage-errors.ts` — shared base (new file) (+27 more)

### Community 41 - "plain-data.ts"
Cohesion: 0.07
Nodes (31): LoadOptions, PlainArray, PlainDataNode, PlainDataRule, Walk, Row, invalid(), isFile() (+23 more)

### Community 42 - "ValidationError"
Cohesion: 0.06
Nodes (41): ValidationError, exceedsMaxDepth(), EntrySectionsSchema, Requirement: prune rejects a retainCount that is not a positive safe integer, before any deletion runs, Requirement: save rejects invalid options with ValidationError before any chunking or hashing work, Scenario: A chunkSize above the schema's 16 MiB bound is rejected with no work done, Scenario: A non-integer or non-finite retainCount is rejected with no effect, Scenario: An integer retainCount outside the safe integer range is rejected with no effect (+33 more)

### Community 43 - "validate.ts"
Cohesion: 0.09
Nodes (40): HistoryFinding, CursorRule, Finding, Issue, Plain, coreSettingsSchema(), closest(), configFindings() (+32 more)

### Community 44 - "column-refusals.test.ts"
Cohesion: 0.07
Nodes (19): CheckedMigration, IntegerCheckRow, Case, describeTable(), moduleTables(), databaseRefusals(), refusalMessage(), relationRefusals() (+11 more)

### Community 45 - "replay-check.ts"
Cohesion: 0.09
Nodes (23): TapeBuilder, TapeCommandIo, RecordingError, ConnectionFrames, ReplaySession, frameText(), isWebSocketUrl(), whenClosed() (+15 more)

### Community 47 - "boundary.test.ts"
Cohesion: 0.13
Nodes (33): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+25 more)

### Community 49 - "describeNodeStoreExports"
Cohesion: 0.09
Nodes (22): Disposable, NodeStoreExports, NodeStoreSubject, describeNodeStoreExports(), 5.1 The `LedgerPackage` interface (LG-6), 5.2 Vendored builds (LG-5), 5.3 The ledger worker and the node-store bridge (LG-10, LG-11), 5.4 Storage, retention and sweep (LG-11 to LG-14) (+14 more)

### Community 5 - "declaration.ts"
Cohesion: 0.04
Nodes (93): SchemaPlan, ApiRegistry, BlockContext, BlockHeader, DefinedModule, FieldKind, FieldSchema, ItemDeclaration (+85 more)

### Community 50 - "node.test.ts"
Cohesion: 0.09
Nodes (17): Metadata, Step, Failure, Variant, expectAnswersByOccurrence(), expectDelayHonoured(), expectGoldenRoundTrip(), expectNotificationsAfterCalls() (+9 more)

### Community 51 - "validation.ts"
Cohesion: 0.07
Nodes (31): DeclarationRule, Plain, ShapeCase, Stats, first(), validateWith(), failures(), loose() (+23 more)

### Community 52 - "FakeNode"
Cohesion: 0.07
Nodes (19): FakeNode, startNode(), listen(), 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix (+11 more)

### Community 53 - "core-settings.test.ts"
Cohesion: 0.07
Nodes (30): PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly, hexBytes() (+22 more)

### Community 54 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 56 - "pg-tx-history-adapter.ts"
Cohesion: 0.10
Nodes (24): LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+16 more)

### Community 59 - "database-fixtures.ts"
Cohesion: 0.08
Nodes (21): CheckTarget, Snapshot, Report, Job, openPgliteOn(), blocksSql(), pgliteCliBackend(), record() (+13 more)

### Community 6 - "tape/index.ts"
Cohesion: 0.05
Nodes (71): Link, TapeBuilderOptions, RecordingProblem, TapeError, TapeProblem, TransformProblem, readRequest, RequestId (+63 more)

### Community 60 - "digest.test.ts"
Cohesion: 0.10
Nodes (26): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+18 more)

### Community 61 - "PointName"
Cohesion: 0.10
Nodes (17): ItemSink, PointName, BlockItems, LateUse, CallbackFailure, HeightFailure, Misuse, EagerItems (+9 more)

### Community 62 - "cursor-durability.crash.test.ts"
Cohesion: 0.08
Nodes (28): BatchSpec, CurrentState, InvariantResult, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs(), durableKvValues() (+20 more)

### Community 65 - "redact.test.ts"
Cohesion: 0.12
Nodes (23): PlainObject, RedactableConfig, RedactionForms, SecretForm, TextPattern, EntryView, fieldKinds, Needs (+15 more)

### Community 67 - "differential-equivalence.test.ts"
Cohesion: 0.12
Nodes (26): CurrentState, Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1() (+18 more)

### Community 68 - "ref_node_crypto"
Cohesion: 0.17
Nodes (23): NodeRoot, bigCell(), cell(), contractAddress(), makeV8State(), makeV9State(), free(), hex() (+15 more)

### Community 69 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+19 more)

### Community 7 - "src/index.ts"
Cohesion: 0.05
Nodes (80): CheckpointSequence, CheckpointStore, CheckpointStoreErrorCode, CheckpointSummary, ContentHash, HistoryOptions, PruneResult, SaveCheckpointOptions (+72 more)

### Community 70 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.12
Nodes (25): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, bootstrapChainArchiveSchema() (+17 more)

### Community 71 - "PgChainArchiveStore"
Cohesion: 0.17
Nodes (13): BlockBundle, BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, VerifierKeyObservationRecord, PgChainArchiveStore (+5 more)

### Community 74 - "5. Runner"
Cohesion: 0.17
Nodes (25): Callback, EntryBoundary, ParallelPoint, PointSchedule, LoopEnd, ProcessState, CoreStopsFirst, boundaryModules() (+17 more)

### Community 76 - "checks.test.ts"
Cohesion: 0.10
Nodes (19): CheckFunctionsOptions, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName(), numericOkPredicate() (+11 more)

### Community 77 - "node/client.ts"
Cohesion: 0.11
Nodes (17): Connection, NodeCallOptions, NodeSubscription, State, Subscription, Waiter, NodeBlock, NodeHeader (+9 more)

### Community 78 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 8 - "writer-lock-checks.ts"
Cohesion: 0.05
Nodes (62): Held, PgliteLockUse, WriterProcess, Job, WorkerEvent, PostgresTestDatabase, PostgresTestServer, PauseReport (+54 more)

### Community 82 - "postgres/transaction-history-storage.ts"
Cohesion: 0.11
Nodes (19): JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections(), isTagObject() (+11 more)

### Community 83 - "chain-archive-rollover.ts"
Cohesion: 0.12
Nodes (22): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+14 more)

### Community 85 - "ChainArchiveStore"
Cohesion: 0.08
Nodes (12): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks` (+4 more)

### Community 87 - "changes.property.test.ts"
Cohesion: 0.11
Nodes (24): Op, States, TableName, encodeCanonical(), sha256(), text(), digestRows(), blockAgrees() (+16 more)

### Community 89 - "module-api.ts"
Cohesion: 0.13
Nodes (17): ChainDataAnswer, ChainDataView, ApiErrorCode, HttpHandler, HttpMethod, HttpRoute, PathSegment, Registration (+9 more)

### Community 9 - "setup.ts"
Cohesion: 0.04
Nodes (78): C5AnyFn, Cancellable, CrashHook, CrashWorkerHandle, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, SuiteWatchdogTimeoutError (+70 more)

### Community 91 - "NodeClient"
Cohesion: 0.26
Nodes (5): NodeClient, hashParameter(), blockUnavailable(), in8Tour(), 10. Node client and ingest

### Community 92 - "TransactionHistoryEntry"
Cohesion: 0.19
Nodes (10): MergeEntriesFn, TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends, 3.1 Field mapping (write path) (+2 more)

### Community 93 - ".#ended"
Cohesion: 0.24
Nodes (6): Pending, connectionFailure, NodeMethod, clientClosed(), run(), SYSTEM_TIMERS

### Community 96 - "transaction-history-storage.property.test.ts"
Cohesion: 0.12
Nodes (15): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), arbitraryCommand, badKeyValue, GOOD_LEAF_KEYS (+7 more)

### Community 97 - "module-api.test.ts"
Cohesion: 0.12
Nodes (13): ApiError, ApiRequest, ApiResponse, Shaped, bodyOf(), errorOf(), ok(), "on-start-api"() (+5 more)

### Community 98 - "TapeNode"
Cohesion: 0.18
Nodes (4): TapeClock, TapeNode, SessionPlan, SYSTEM_CLOCK

### Community 99 - "What changes — the 1.0.0 gate items this change addresses"
Cohesion: 0.24
Nodes (13): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+5 more)

### Community 115 - "integer"
Cohesion: 0.12
Nodes (14): integer(), Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G13 — perf-correctness fixes (land first), G14 — benchmark harness + recorded baseline, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Scenario: The history aggregate reads size_bytes, not octet_length(data), Scenario: The size_bytes column exists and equals the payload length (+6 more)

### Community 118 - "context"
Cohesion: 0.20
Nodes (3): schemaName(), module(), context()

### Community 119 - "table"
Cohesion: 0.13
Nodes (14): table(), Data that is not a function of the chain, Height-versioned tables, Requirement: DB-6 Each module's schema is guarded by its own database role, Requirement: DB-8 Schema names are unambiguous, Scenario: An id that aliases a backbone schema, Scenario: An id that is too long, Scenario: Two providers of one item with different migrations (+6 more)

### Community 120 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.13
Nodes (13): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 5. WalletState envelope, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier (+5 more)

### Community 124 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 132 - "envelope.test.ts"
Cohesion: 0.26
Nodes (11): answerChainData(), chainDataHeaders(), hex(), noCommittedHeight(), readChainDataView(), withViewExtensions(), CHAIN_DATA_HEADERS, CHAIN_DATA_VIEW (+3 more)

### Community 138 - "address"
Cohesion: 0.18
Nodes (12): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Requirement: Set is an unconditional overwrite at the exact address, Scenario: A later value wins at the same address, Scenario: Abstract absence remains distinct from a stored null-like value (+4 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value (+3 more)

### Community 152 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 153 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 162 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 198 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 222 - "parseJsonLossless"
Cohesion: 0.40
Nodes (5): parseJsonLossless(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 30 - "runMigrations"
Cohesion: 0.04
Nodes (55): runMigrations(), 1. `fsync = on` — probe-enforced, 2. `full_page_writes = on` — probe-enforced (overridable), 3. `synchronous_commit` — probe-warned, never refused, 4. Session-mode connection pooling only — probe-enforced (best-effort), 5. Server-side timeouts — applied by `createClient` (documented), Summary, UmbraDB Durability Contract (+47 more)

### Community 48 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 57 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+21 more)

### Community 72 - "withAbort"
Cohesion: 0.07
Nodes (26): withAbort(), 0. Package layout, 3. Lease acquisition, release, and timeout, 6. Test infrastructure, Design — Sprint 2: Transaction/Lease, Prerequisite: Sprint 1 merged and archived (RESOLVED 2026-07-21), Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Scenario: A get whose signal aborts after the call has begun likewise completes normally (+18 more)

### Community 75 - "fn"
Cohesion: 0.10
Nodes (26): fn(), ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease, Requirement: A transaction timeout surfaces as TransactionFaultError, Requirement: Aborting opts.signal before withTransaction starts rejects with AbortError, Requirement: Aborting opts.signal during lease acquisition rejects with AbortError, Requirement: acquireLease waits indefinitely absent a timeout; tryAcquireLease never blocks unboundedly, Requirement: At most one holder per lease key at any instant (Law L1) (+18 more)

### Community 88 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.20
Nodes (20): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), isPlainObject(), mergeSections(), referenceMergeEntries() (+12 more)

### Community 90 - "version"
Cohesion: 0.10
Nodes (21): version(), 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3) (+13 more)

### Community 94 - "decode.ts"
Cohesion: 0.26
Nodes (19): blockAnswer(), byteArrayAnswer(), bytesAnswer(), bytesListAnswer(), bytesParameter(), countParameter(), frozenCopy(), hashAnswer() (+11 more)

### Community 100 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.11
Nodes (18): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+10 more)

### Community 101 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.11
Nodes (17): 10. Ingest, 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest (+9 more)

### Community 102 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 104 - "STORAGE_ALGEBRA_LEAN_RESEARCH.md"
Cohesion: 0.12
Nodes (12): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort (+4 more)

### Community 105 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.12
Nodes (17): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup, Scenario: A consumer starts before its provider (+9 more)

### Community 107 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 108 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 111 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N) (+8 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 114 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor first, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-5 `core-block-parsed` parses each block once, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction (+7 more)

### Community 117 - "ROADMAP.md"
Cohesion: 0.13
Nodes (9): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+1 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract, Scenario: An untouched address retains its initial value (+6 more)

### Community 123 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+5 more)

### Community 128 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 130 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 131 - "Roadmap"
Cohesion: 0.14
Nodes (14): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+6 more)

### Community 135 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 139 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note), Scenario: A pending entry clears against a finalized entry whose identifiers grew via two prior merges, Scenario: A pending entry does not clear when its identifiers are not a subset (+4 more)

### Community 141 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 144 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.17
Nodes (10): 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, UmbraDB v0.9.5 "Penumbra" — Release Record, UmbraDB v1.0.0 — Release Record (PENDING) (+2 more)

### Community 145 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page, Scenario: Backup while syncing (+3 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 149 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.17
Nodes (11): 11. Chain data, 12. Ledger, 13. Contract data, 14. Private processes, 15. Backups, 16. Browser, 17. Library surface and gates, 18. Whole-system faults, differentials and measurements (+3 more)

### Community 150 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 151 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 154 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck (+3 more)

### Community 155 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 156 - "UmbraDB and SLSA — supply-chain integrity assessment"
Cohesion: 0.18
Nodes (11): 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA, Level summary, Source track (later-version intent) — solid, unclaimed under v1.0 (+3 more)

### Community 157 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.18
Nodes (10): 1.1 Envelope shape, 1. Envelope decision: (a) one versioned envelope — DECIDED, 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding) (+2 more)

### Community 158 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 163 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 164 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.20
Nodes (10): 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected, 2. TemporalKV → Postgres, 3. Checkpoint chunker (content-addressed, deduplicated), 4. Watermarks, 5. Commit/transaction layer, 7. Driver / toolkit choice (+2 more)

### Community 165 - "UmbraDB module guide"
Cohesion: 0.20
Nodes (9): Cursor tables, Process items and APIs, Reading through `db`, Start and stop heights, Stored values and digests, Time values, UmbraDB module guide, Upgrades (+1 more)

### Community 166 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 167 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 168 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 169 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 170 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 171 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 172 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 173 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 174 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 178 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 179 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 180 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 182 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 184 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One write per key per block, Scenario: A second write in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 185 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 186 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 187 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 188 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 190 - "conformance-gate.mjs"
Cohesion: 0.22
Nodes (8): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli

### Community 193 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 194 - "UmbraDB 0.9.5 "Penumbra""
Cohesion: 0.25
Nodes (7): Benchmarks, Compatibility, and what 1.0.0 needs, Installing, Security, UmbraDB 0.9.5 "Penumbra", What is proved, and what that is worth, What this is not

### Community 195 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 196 - "Security policy & threat model"
Cohesion: 0.25
Nodes (8): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 197 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 199 - "Design — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.25
Nodes (7): 10. Tables, 14. External claims and their evidence, 15. Relation to the existing design documents, 9.1 Backups (BK; Q83, Q85), 9.2 Browser build (BR), 9. Backups and browser, Design — CORE-ARCH: the standalone indexer's core architecture

### Community 200 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 202 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 203 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.29
Nodes (5): 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 204 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 205 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 206 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 207 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 208 - "12. Milestone status"
Cohesion: 0.29
Nodes (7): 12. Milestone status, M0 — freeze semantics, M1 — no-`sorry` TemporalKV vertical slice (completed), M2 — complete temporal laws (abstract per-key tranche completed), M3 — simple stores (in progress), M4 — leases and liveness (deferred), M5 — refinement evidence (deferred)

### Community 209 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 210 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.29
Nodes (6): 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 2. Migration mechanism, 3. Connection factory (`src/postgres/client.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV

### Community 211 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 212 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 213 - "Acceptance — v1.0.0 API Surface & Release Contract"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0 API Surface & Release Contract, G20 — Lean cut-line, G2 — SemVer stability policy + CHANGELOG, G4 — Contract doc set (all true), Negative / boundary criteria (nothing out-of-scope leaked in), Precondition (blocks the whole change)

### Community 214 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 215 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 219 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 220 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 221 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 223 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 224 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 225 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 226 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 227 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 228 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 229 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 230 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 232 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 233 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 234 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 235 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 236 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 237 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 238 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 239 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 240 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 241 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 242 - "00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone"
Cohesion: 0.50
Nodes (3): 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone, Problem, Suggested fix

### Community 243 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 244 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 245 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 246 - "Requirement: DB-11 Exactly one writer per database"
Cohesion: 0.50
Nodes (4): Requirement: DB-11 Exactly one writer per database, Scenario: A crashed writer's lock is released, Scenario: A paused writer keeps its lock, Scenario: A second writer refuses

### Community 247 - "Proposal — Sprint 2: Transaction/Lease"
Cohesion: 0.50
Nodes (3): Impact, Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 2: Transaction/Lease

### Community 248 - "Proposal — v1.0.0 API Surface & Release Contract"
Cohesion: 0.50
Nodes (3): Non-goals (explicitly out of scope — honoring the council rulings verbatim), Proposal — v1.0.0 API Surface & Release Contract, Why

### Community 249 - "Requirement: CI gates any change to flake.lock behind explicit review (G18)"
Cohesion: 0.50
Nodes (4): Requirement: CI gates any change to flake.lock behind explicit review (G18), Scenario: A labeled flake.lock change is allowed, Scenario: A pull request that does not touch flake.lock passes, Scenario: An unlabeled flake.lock change fails the gate

### Community 250 - "Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference"
Cohesion: 0.50
Nodes (4): Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Scenario: fault-schedule end state matches the fault-free reference on current state, Scenario: negative control — a dropped range makes the equivalence assertion fire, Scenario: the differential gate imports no foreign consumer application

### Community 251 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 252 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 257 - "Requirement: DB-10 Migrations of an upgrade never change stored values"
Cohesion: 0.67
Nodes (3): Requirement: DB-10 Migrations of an upgrade never change stored values, Scenario: A version that needs a resync, as an upgrade, Scenario: Restarting a database built with that version

### Community 258 - "Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep"
Cohesion: 0.67
Nodes (3): Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Scenario: Reused content after a deletion, Scenario: Same deletions on two machines

### Community 259 - "Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18)"
Cohesion: 0.67
Nodes (3): Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Scenario: A newly introduced secret outside the allowlist fails the scan, Scenario: The historical wallet secret and the template placeholder do not fail the scan

### Community 260 - "Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16)"
Cohesion: 0.67
Nodes (3): Requirement: The CheckpointStore interface docs carry the cross-wallet side-channel caveat (G16), Scenario: The dedup and prune docs state the trust-domain requirement and the side channel, Scenario: The rewrite changes no contract and preserves existing accurate caveats

### Community 261 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 46 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data responses name their view and height (+30 more)

### Community 55 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-17 Ledger tasks give modules the native objects, Requirement: LG-1 Each block's ledger version comes from its `MNSV` digest (+25 more)

### Community 58 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 63 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends, Requirement: DB-2 A read handle sees one committed height, Requirement: DB-3 Writes only through a write handle (+22 more)

### Community 64 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18), Requirement: The localhost Require default is unchanged (G17), Requirement: The repository ships an ignore-scripts .npmrc that CI asserts (G18) (+22 more)

### Community 66 - "Full-Chain Storage — Design"
Cohesion: 0.07
Nodes (29): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+21 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+19 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks on an existing database, Requirement: IN-4 Every finalized height, once, in order (+18 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form (+18 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0, Requirement: the baseline reflects the batched (shipped) save shape (+17 more)

### Community 86 - "package.json"
Cohesion: 0.08
Nodes (24): bin, umbradb, bugs, url, description, engines, node, exports (+16 more)

### Community 95 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

## Knowledge Gaps
- **36 isolated node(s):** `./tsconfig.json`, `RFC-3339`, `RFC-8949`, `RFC-8259`, `RFC-8785` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2546 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `db/migrate.ts`, `PgTransactionLeaseLayer`, `translatePostgresError`, `postgres/checkpoint-store.ts`, `UmbraError`, `declaration.ts`, `no-indexer-or-wallet-sdk.test.ts`, `src/index.ts`, `writer-lock-checks.ts`, `midnight-env — reproducible PREPROD dev environment`, `setup.ts`, `validate.test.ts`, `api.ts`, `config-check.ts`, `tape/index.ts`, `component-table.test.ts`, `node/client.test.ts`, `runner/process.ts`, `stop-heights.test.ts`, `config/history.ts`, `transform-checks.ts`, `record-and-replay.test.ts`, `history.test.ts`, `history.property.test.ts`, `postgres/client.ts`, `interfaces/temporal-kv.ts`, `Database`, `createClient`, `facade-merge-loader.ts`, `loop.test.ts`, `envelope.test.ts`, `order.property.test.ts`, `zero-timeouts-checks.ts`, `column-rules.test.ts`, `dispatch.test.ts`, `module-tables.test.ts`, `module-tables.ts`, `plain-data.ts`, `column-refusals.test.ts`, `boundary.test.ts`, `postgres-image.test.ts`, `node.test.ts`, `validation.ts`, `vitest.config.ts`, `core-settings.test.ts`, `cbor.property.test.ts`, `pg-tx-history-adapter.ts`, `database-fixtures.ts`, `digest.test.ts`, `PointName`, `cursor-durability.crash.test.ts`, `redact.test.ts`, `differential-equivalence.test.ts`, `ref_node_crypto`, `chain-archive-replay-decode.integration.test.ts`, `checks.test.ts`, `check-required-tests.ts`, `postgres/transaction-history-storage.ts`, `package.json`, `changes.property.test.ts`, `cold-boot-recovery.integration.test.ts`, `vendored-ledger-files.test.ts`, `builder.negative-control.test.ts`, `transaction-history-storage.property.test.ts`, `module-api.test.ts`, `height-versioned.property.test.ts`, `node/errors.ts`, `node-format.ts`, `ws-mutual-tls.test.ts`, `mutation-per-adapter.mjs`, `cursor-table.property.test.ts`?**
  _High betweenness centrality (0.316) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `./tsconfig.json`, `RFC-3339`, `RFC-8949` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `db/migrate.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02719459791282996 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `db/migrate.ts`, `envelope.test.ts`, `declaration.ts`, `writer-lock-checks.ts`, `vitest`, `validate.test.ts`, `api.ts`, `config-check.ts`, `ApiRoutes`, `node/client.test.ts`, `runner/process.ts`, `stop-heights.test.ts`, `config/history.ts`, `transform-checks.ts`, `history.test.ts`, `loop.test.ts`, `Database`, `cbor.ts`, `zero-timeouts-checks.ts`, `graph.ts`, `dispatch.test.ts`, `module-tables.ts`, `FinalizedLoop`, `plain-data.ts`, `validate.ts`, `column-refusals.test.ts`, `replay-check.ts`, `validation.ts`, `mapping.ts`, `checks.test.ts`, `node/client.ts`, `changes.property.test.ts`, `module-api.ts`, `NodeClient`, `.#ended`, `decode.ts`, `module-api.test.ts`, `node/errors.ts`, `checkShape`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 21 inferred relationships involving `PgTransactionLeaseLayer` (e.g. with `Boundary held` and `Added`) actually correct?**
  _`PgTransactionLeaseLayer` has 21 INFERRED edges - model-reasoned connections that need verification._
- **Should `PgTransactionLeaseLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.02402069475240207 - nodes in this community are weakly interconnected._