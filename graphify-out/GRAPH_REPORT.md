# Graph Report - UmbraDB

## Corpus Check
- 696 files · ~1,115,139 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 65 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 7479 nodes · 20120 edges · 254 communities (233 shown, 21 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 2597 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `4225d5f52146c1b6` (696 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- UmbraError
- PgTransactionLeaseLayer
- ValidationError
- postgres/chain-archive-store.ts
- pglite.ts
- BlobIntegrityError
- checks.test.ts
- version-table.ts
- ProcessContexts
- 3. Proof-blocking findings
- builder.test.ts
- source-scan.ts
- TransactionHistoryEntry
- sigterm.worker.ts
- FakeNode
- ConnectionError
- ws-mutual-tls.test.ts
- checkShape
- chain-archive-rollover.ts
- translatePostgresError
- read-height.property.test.ts
- ref_node_fs
- no-indexer-or-wallet-sdk.test.ts
- version-selection.test.ts
- opt-out.test.ts
- component-table.test.ts
- RuntimeMetadata
- loop.test.ts
- ProcessItems
- order.property.test.ts
- column-rules.ts
- mutation-evidence.d.mts
- builder.negative-control.test.ts
- src/index.ts
- postgres/transaction-lease.ts
- describeNodeStoreExports
- height-versioned.test.ts
- interfaces/temporal-kv.ts
- db/durability-probe.test.ts
- runner/process.ts
- adapter-suite.ts
- InMemoryBlockSource
- changes.property.test.ts
- adapter.ts
- runMigrations
- transform-checks.ts
- core-chain.test.ts
- FinalizedLoop
- harness.ts
- core-block-commit.test.ts
- config/history.ts
- vitest
- halts.test.ts
- pglite-queue.test.ts
- mapping.ts
- declaration.ts
- validate.test.ts
- column-rules.test.ts
- height-versioned.property.test.ts
- history.test.ts
- module-tables.ts
- node.ts
- loop.ts
- deterministic-postgresql/index.ts
- LedgerPackage
- chain-process.test.ts
- cursor-durability.crash.test.ts
- cbor.ts
- ledger/types.ts
- graph.ts
- PgTransactionHistoryStorage
- column-refusals.test.ts
- development-opt-in.test.ts
- networks.ts
- api-server.test.ts
- core-settings.ts
- config-check.ts
- validate.ts
- crash.test.ts
- entries.ts
- database-fixtures.ts
- tape/index.ts
- pg-tx-history-adapter.ts
- redact.test.ts
- version-checks.ts
- transaction-history-storage.property.test.ts
- TransactionHistoryStorage
- history.property.test.ts
- node/client.ts
- plain-data.ts
- interfaces/transaction-history-storage.ts
- adapter-core.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- node/client.test.ts
- PgChainArchiveStore
- digest.test.ts
- module-rules.ts
- chain-archive-replay-decode.integration.test.ts
- ChainArchiveStore
- pglite-writer.worker.ts
- version
- boundary.test.ts
- cold-boot-recovery.integration.test.ts
- T
- table
- Design — Sprint 7: Transaction History Storage
- Tasks — v1.0.0-infosec-signoff
- .boolean
- facade-merge-loader.ts
- Full-Chain Storage
- midnight-env — reproducible PREPROD dev environment
- fresh-instance.mjs
- Requirement: DT-4 Per-block changes of every module table
- graph.py
- Full-Chain Storage — Design
- context
- .getAll
- address
- ROADMAP.md
- ADDED Requirements
- ADDED Requirements
- package.json
- Design — Postgres+JSONB storage rebuild
- UmbraDB software supply-chain directory
- ADDED Requirements
- stryker.conf.json
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 Implementation Guideline
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- ADDED Requirements
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- devDependencies
- README.md
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Roadmap
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- compilerOptions
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB third-party component inventory (SBOM)
- Requirement: DT-6 Stored data avoids non-deterministic values
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- Tasks — Sprint 7: Transaction History Storage
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- Tasks — v1.1.0: Quint model checking
- scoped-review-manifest
- Contributing
- Algebraic Specification of the midnight-pg-store Storage Layer
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Our Pledge
- Midnight infra verification checklist
- UmbraDB 1.0.0 Release Contracts
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- Security policy & threat model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- Performance — design
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js
- Design — Sprint 1: project setup + TemporalKV
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
- 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- bug-report.md
- feature-request.md
- GC architecture and query-tracing: research findings
- 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor
- 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
- 7. Testing strategy (post-implementation)
- Acceptance criteria — v1.0.0-perf-baseline
- Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference
- Spec — capability `formal-completion`
- renovate.json
- Environment changelog
- start-stack.sh
- Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints
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
- engines
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- ADDED Requirements
- Design — v1.0.0-durable-checkpoint-cursor
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- Storage Algebra Lean Formalization — Approved Design and Status

## God Nodes (most connected - your core abstractions)
1. `vitest` - 208 edges
2. `UmbraError` - 191 edges
3. `ModuleDeclaration` - 97 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `runMigrations()` - 90 edges
6. `PgCheckpointStore` - 87 edges
7. `ValidationError` - 87 edges
8. `Database` - 80 edges
9. `translatePostgresError()` - 78 edges
10. `TransactionHandle` - 70 edges

## Surprising Connections (you probably didn't know these)
- `3. Modules` --references--> `OwnPart`  [INFERRED]
  openspec/changes/core-arch/tasks.md → src/db/roles.ts
- `2.1 Historical implementation baseline` --references--> `PgTemporalKV`  [INFERRED]
  Formal/STORAGE_ALGEBRA_LEAN_RESEARCH.md → src/postgres/temporal-kv.ts
- `The honest-test pattern (what makes each required test non-vacuous)` --references--> `ChunkMissingError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/checkpoint-store.ts
- `LL-002 — A7 watermark-participation negative control did not fire; survived fix-round-1, caught by round-2 cold cross-vendor Codex` --references--> `ValidationError`  [INFERRED]
  docs/v1-lessons-learned.md → src/interfaces/storage-errors.ts
- `Scenario: A value that fails WatermarkValueSchema is rejected with no statement issued` --references--> `ValidationError`  [INFERRED]
  openspec/changes/sprint-4-watermarks/specs/watermarks/spec.md → src/interfaces/storage-errors.ts

## Import Cycles
- None detected.

## Communities (254 total, 21 thin omitted)

### Community 0 - "UmbraError"
Cohesion: 0.02
Nodes (156): Transaction, ReadTimeoutSetting, AppliedRow, Runnable, Settling, StartupInput, MultiStatementRunner, Difference (+148 more)

### Community 1 - "PgTransactionLeaseLayer"
Cohesion: 0.02
Nodes (127): BenchEnv, AggregateRow, ChunkJoinRow, ManifestRow, PgCheckpointStore, UmbraDBSql, PgTemporalKV, PgTransactionLeaseLayer (+119 more)

### Community 10 - "ValidationError"
Cohesion: 0.03
Nodes (88): CheckpointNotFoundError, ChunkIntegrityError, ChunkMissingError, ValidationError, assertValidCheckpointIds(), validateHistoryOptions(), validateSaveOptions(), migrations() (+80 more)

### Community 103 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (17): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind (+9 more)

### Community 11 - "pglite.ts"
Cohesion: 0.04
Nodes (49): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, Job, JobQueue, Outcome, PgliteDatabase (+41 more)

### Community 110 - "BlobIntegrityError"
Cohesion: 0.20
Nodes (12): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+4 more)

### Community 114 - "checks.test.ts"
Cohesion: 0.13
Nodes (11): Case, checkFunctionsSql(), numericOkPredicate(), refusedNumbersPath(), outcome(), started(), verdicts(), write() (+3 more)

### Community 115 - "version-table.ts"
Cohesion: 0.21
Nodes (18): LedgerPin, LedgerSelection, VersionedBlock, blockNamed(), checkPins(), covers(), effectiveLedgerTable(), freezePin() (+10 more)

### Community 116 - "ProcessContexts"
Cohesion: 0.17
Nodes (6): MisuseReports, ProcessContexts, names(), providesProcessItem(), startChain(), sealed()

### Community 117 - "3. Proof-blocking findings"
Cohesion: 0.11
Nodes (18): Absent, n(), 1. TemporalKV — event-sourced right action with a CAS guard, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant (+10 more)

### Community 12 - "builder.test.ts"
Cohesion: 0.04
Nodes (43): ConnectionFrames, Refusal, Metadata, Step, Frame, RawClient, Script, ScriptedNode (+35 more)

### Community 123 - "source-scan.ts"
Cohesion: 0.19
Nodes (16): ModuleReference, opensDatabase(), boundaryViolations(), calledNames(), eachNode(), isInside(), lineOf(), literalText() (+8 more)

### Community 125 - "TransactionHistoryEntry"
Cohesion: 0.26
Nodes (7): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends, 3.1 Field mapping (write path)

### Community 128 - "sigterm.worker.ts"
Cohesion: 0.15
Nodes (12): SignalTarget, WORKER, Job, WorkerEvent, terminationSignal(), startWorker(), startWorker(), report() (+4 more)

### Community 13 - "ConnectionError"
Cohesion: 0.03
Nodes (78): JsonEncoded, TxHistoryRow, ConnectionError, SerializationFailedError, TemporalKV, TransactionFaultError, CatalogRow, assertStoredEntryShape() (+70 more)

### Community 132 - "ws-mutual-tls.test.ts"
Cohesion: 0.19
Nodes (10): Attempt, connect(), file(), makeCa(), makeLeaf(), openssl(), read(), tlsClientErrors (+2 more)

### Community 135 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 138 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 14 - "translatePostgresError"
Cohesion: 0.04
Nodes (73): TransactionHandle, TransactionHandleInvalidError, WatermarkKey, WatermarkRow, coerceToSafeNumber(), sha256(), toHex(), toSummary() (+65 more)

### Community 144 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 15 - "ref_node_fs"
Cohesion: 0.04
Nodes (61): ConfigCheckReport, cliProject, CommandResult, Finding, LockResult, GuardViolation, USAGE, configText() (+53 more)

### Community 153 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 159 - "version-selection.test.ts"
Cohesion: 0.47
Nodes (10): Answers, toHex(), H(), blockWith(), expectBadVersionDigestHalts(), expectPinsChecked(), expectUnknownRuntimeHalts(), haltOf() (+2 more)

### Community 16 - "opt-out.test.ts"
Cohesion: 0.05
Nodes (63): CapturedTable, CaptureState, SchemaPlan, GuardTableRow, ConsistentRead, Chain, ChainOptions, DigestRow (+55 more)

### Community 160 - "component-table.test.ts"
Cohesion: 0.18
Nodes (7): DesignTable, RowCoverage, typeScriptFiles(), OPENERS, ROWS, SUITE, REPOSITORY

### Community 17 - "loop.test.ts"
Cohesion: 0.06
Nodes (68): Database, TestDatabase, helperDatabase, Contexts, LoopClass, RunnerDatabase, SeenCall, Started (+60 more)

### Community 18 - "order.property.test.ts"
Cohesion: 0.04
Nodes (73): GraphInput, PointRun, PastFaultCase, RefusalCase, Recorder, CheckName, GraphSpec, ModuleSpec (+65 more)

### Community 19 - "column-rules.ts"
Cohesion: 0.04
Nodes (82): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts (+74 more)

### Community 196 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 197 - "builder.negative-control.test.ts"
Cohesion: 0.29
Nodes (3): Failure, Variant, WrongRecording

### Community 2 - "src/index.ts"
Cohesion: 0.03
Nodes (140): CheckpointRecord, CheckpointSequence, CheckpointStore, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ContentHash, HistoryOptions (+132 more)

### Community 20 - "postgres/transaction-lease.ts"
Cohesion: 0.04
Nodes (66): Lease, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, HeldLease, ApplicationError, InjectedReleaseFaultLayer, abortError() (+58 more)

### Community 21 - "describeNodeStoreExports"
Cohesion: 0.07
Nodes (50): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+42 more)

### Community 22 - "height-versioned.test.ts"
Cohesion: 0.05
Nodes (37): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, BlockContext (+29 more)

### Community 23 - "interfaces/temporal-kv.ts"
Cohesion: 0.06
Nodes (59): AsOf, AssertExact, HistoryUnavailableError, JsonValue, Key, Namespace, Scope, TemporalKVError (+51 more)

### Community 24 - "db/durability-probe.test.ts"
Cohesion: 0.07
Nodes (51): PostgresOptions, WriterSession, WriterProcess, WorkerEvent, PostgresTestDatabase, PauseReport, openPostgres(), allowWriterStart() (+43 more)

### Community 25 - "runner/process.ts"
Cohesion: 0.05
Nodes (43): ChainCheck, ChainCheckInput, CoreChainBinding, NodeWait, CheckState, ProcessSide, CheckedConfig, BlockSource (+35 more)

### Community 26 - "adapter-suite.ts"
Cohesion: 0.08
Nodes (58): ApplyOutput, ParsedTransaction, StoredNode, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject (+50 more)

### Community 27 - "InMemoryBlockSource"
Cohesion: 0.08
Nodes (43): InMemoryBlockSource, ProcessBackend, ProcessDatabase, testBuild, A149Observation, A149Startup, A42Observation, Seen (+35 more)

### Community 28 - "changes.property.test.ts"
Cohesion: 0.05
Nodes (62): CanonicalEncodingError, CanonicalEncodingFailure, CanonicalValue, Op, States, TableName, Abort, CheckResult (+54 more)

### Community 29 - "adapter.ts"
Cohesion: 0.05
Nodes (47): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+39 more)

### Community 3 - "runMigrations"
Cohesion: 0.03
Nodes (110): DurabilityContractError, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, TransactionPoolerDetectedError, PgDriverError, Migration, MigrationLockTimeoutError (+102 more)

### Community 30 - "transform-checks.ts"
Cohesion: 0.08
Nodes (42): Failure, Variant, TransformError, recordKind, SubscriptionId, CallSelection, NotificationRange, turns() (+34 more)

### Community 31 - "core-chain.test.ts"
Cohesion: 0.05
Nodes (41): Bound, ChainIdentity, ChainSource, CoreChainFacts, WaitingListener, HistoryCheck, HistoryInput, HistoryRule (+33 more)

### Community 32 - "FinalizedLoop"
Cohesion: 0.07
Nodes (18): BlockItems, FinalizedLoop, HeightRun, Batching, WaitingInRead, SkipsStartAtRestart, CommitsDespiteLastWrite, ComputeAtH (+10 more)

### Community 33 - "harness.ts"
Cohesion: 0.09
Nodes (46): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+38 more)

### Community 34 - "core-block-commit.test.ts"
Cohesion: 0.06
Nodes (42): BlockHeaderItem, StandInOptions, ChainBuildOptions, Commit, Committed, blockHeaderOf(), checkParent(), commitBlock() (+34 more)

### Community 35 - "config/history.ts"
Cohesion: 0.08
Nodes (50): CoreVersion, CoreSettings, HistoryCode, HistoryContext, Span, CheckedEntry, PlacedEntry, SettingsSchema (+42 more)

### Community 36 - "vitest"
Cohesion: 0.05
Nodes (33): Lockfile, Manifest, RepositoryFile, Upstream, gateAdapters(), tallyMutants(), canPin(), pinViolations() (+25 more)

### Community 37 - "halts.test.ts"
Cohesion: 0.05
Nodes (44): LoopEnd, LoopInput, ProcessingEnd, ProcessStatus, A43Case, A43Observation, Outcome, SilentHalt (+36 more)

### Community 38 - "pglite-queue.test.ts"
Cohesion: 0.05
Nodes (34): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, Report, Job (+26 more)

### Community 39 - "mapping.ts"
Cohesion: 0.06
Nodes (35): ResultColumn, ResultType, Connection, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject() (+27 more)

### Community 4 - "declaration.ts"
Cohesion: 0.03
Nodes (103): ConfigCheckOptions, ConfigInput, SchemaWriteHandle, MigrationPart, ApiRegistry, BlockHeader, DefinedModule, FieldKind (+95 more)

### Community 40 - "validate.test.ts"
Cohesion: 0.06
Nodes (46): coreEntry, HistoryFinding, ConfigRule, EntryRef, Finding, CursorRow, Expected, Row (+38 more)

### Community 41 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (33): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+25 more)

### Community 42 - "height-versioned.property.test.ts"
Cohesion: 0.06
Nodes (43): VersionedValue, Access, Block, BlockFails, Counts, Write, StoredVersion, Block (+35 more)

### Community 43 - "history.test.ts"
Cohesion: 0.07
Nodes (46): versionEntry, HistoryOptions, HistoryRow, Simulation, Start, Case, TestBuildOptions, dataHash() (+38 more)

### Community 44 - "module-tables.ts"
Cohesion: 0.07
Nodes (37): CaptureColumn, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ColumnType, RefusalCode (+29 more)

### Community 45 - "node.ts"
Cohesion: 0.08
Nodes (26): Json, Connection, TapeCall, TapeClock, TapeNode, TapeNodeOptions, TapeOutcome, CallRecord (+18 more)

### Community 46 - "loop.ts"
Cohesion: 0.09
Nodes (39): HeightRange, ResolvedRange, LateUse, BlockRef, Callback, EntryBoundary, ParallelPoint, PointArguments (+31 more)

### Community 47 - "deterministic-postgresql/index.ts"
Cohesion: 0.08
Nodes (35): Settings, Run, Job, WorkerEvent, Phase, Outcome, expectNeverCutOffNorHung(), settings() (+27 more)

### Community 48 - "LedgerPackage"
Cohesion: 0.05
Nodes (30): LedgerEventKind, LedgerPackage, released(), replay(), listen(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence, Problem (+22 more)

### Community 49 - "chain-process.test.ts"
Cohesion: 0.07
Nodes (31): ProcessHandle, Job, WorkerEvent, A77Observation, A78Observation, A90Observation, Failing, Flaky (+23 more)

### Community 5 - "cursor-durability.crash.test.ts"
Cohesion: 0.03
Nodes (114): InvariantResult, C5AnyFn, Fault, CrashWorkerHandle, SuiteWatchdogTimeoutError, class2AdvisoryLockCountForHash(), manifestCount(), pool() (+106 more)

### Community 50 - "cbor.ts"
Cohesion: 0.09
Nodes (37): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+29 more)

### Community 51 - "ledger/types.ts"
Cohesion: 0.09
Nodes (33): LedgerName, LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage, ApplyInput, LedgerEvent, LedgerPackageOptions (+25 more)

### Community 52 - "graph.ts"
Cohesion: 0.08
Nodes (43): Edge, GraphPart, GraphRule, MidChain, Missing, RangeCheck, RangeFacts, Spanned (+35 more)

### Community 53 - "PgTransactionHistoryStorage"
Cohesion: 0.07
Nodes (34): PgTransactionHistoryStorage, capitalize(), encodeContent(), encodeSections(), encodeStoredEntry(), reason(), Checking it by hand, Layout (+26 more)

### Community 55 - "column-refusals.test.ts"
Cohesion: 0.08
Nodes (23): DeterminismBackend, TestDatabase, TestServer, Backend, Case, pgliteBackend(), startPgliteServer(), freshDatabase() (+15 more)

### Community 56 - "development-opt-in.test.ts"
Cohesion: 0.08
Nodes (33): DatabaseState, ReadDatabaseOptions, TypeCheckFinding, TypeCheckResult, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, LoadedConfig (+25 more)

### Community 59 - "networks.ts"
Cohesion: 0.06
Nodes (37): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+29 more)

### Community 6 - "api-server.test.ts"
Cohesion: 0.03
Nodes (83): ReadOnlyDatabase, ReadOptions, ResolvedGraph, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, StartedModuleApi, ChainDataAnswer (+75 more)

### Community 60 - "core-settings.ts"
Cohesion: 0.06
Nodes (35): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, ConfiguredLedgerTable, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys (+27 more)

### Community 61 - "config-check.ts"
Cohesion: 0.08
Nodes (31): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckSeams, StepName, StepReport (+23 more)

### Community 62 - "validate.ts"
Cohesion: 0.11
Nodes (38): plainData, ConfigContext, CursorRule, Issue, Plain, coreSettingsSchema(), closest(), configFindings() (+30 more)

### Community 64 - "crash.test.ts"
Cohesion: 0.09
Nodes (29): PointName, HeightFailure, Misuse, CrashCall, CrashEvent, CrashOptions, CrashObservation, ItemsAfterWrite (+21 more)

### Community 68 - "entries.ts"
Cohesion: 0.07
Nodes (31): CoreLedgerVersion, LedgerPackageIdentity, CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights (+23 more)

### Community 69 - "database-fixtures.ts"
Cohesion: 0.07
Nodes (13): CheckTarget, CliBackend, Snapshot, PostgresTestServer, blocksSql(), postgresCliBackend(), record(), rowsSql() (+5 more)

### Community 7 - "tape/index.ts"
Cohesion: 0.04
Nodes (76): Recorded, Failure, Variant, Link, TapeBuilder, TapeBuilderOptions, TapeCommandIo, RecordingError (+68 more)

### Community 71 - "pg-tx-history-adapter.ts"
Cohesion: 0.09
Nodes (24): LifecycleDetailStore, PgWalletSdkTransactionHistoryAdapter, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk() (+16 more)

### Community 73 - "redact.test.ts"
Cohesion: 0.11
Nodes (25): PlainObject, RedactableConfig, RedactionForms, SecretForm, TextPattern, EntryView, fieldKinds, Needs (+17 more)

### Community 74 - "version-checks.ts"
Cohesion: 0.13
Nodes (20): MetadataBlock, MetadataNode, RuntimeMetadataEntry, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata (+12 more)

### Community 75 - "transaction-history-storage.property.test.ts"
Cohesion: 0.07
Nodes (23): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), decodeSerializedContent(), decodeSerializedEntry(), store() (+15 more)

### Community 77 - "TransactionHistoryStorage"
Cohesion: 0.07
Nodes (25): TransactionHistoryReader, TransactionHistoryStorage, Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space) (+17 more)

### Community 78 - "history.property.test.ts"
Cohesion: 0.08
Nodes (26): Hash, changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields (+18 more)

### Community 8 - "node/client.ts"
Cohesion: 0.05
Nodes (63): Connection, HeadSubscriber, NodeCallOptions, NodeClient, NodeSubscription, Pending, State, Subscription (+55 more)

### Community 80 - "plain-data.ts"
Cohesion: 0.10
Nodes (22): PlainArray, PlainDataNode, PlainDataRule, Walk, Row, copyArray(), copyObject(), instanceOf() (+14 more)

### Community 81 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (24): EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryStatus, TransactionHistoryWriter (+16 more)

### Community 84 - "adapter-core.test.ts"
Cohesion: 0.09
Nodes (22): NormalizedCost, RawTransaction, RawTransactionResult, SyntheticCost, FakeTransaction, Recorded, deserialize(), fakePackage() (+14 more)

### Community 86 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 87 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 9 - "node/client.test.ts"
Cohesion: 0.03
Nodes (62): NodeClientOptions, NodeRetry, ConnectSocket, NodeSocketEvents, Answer, Handler, Received, recorded (+54 more)

### Community 92 - "PgChainArchiveStore"
Cohesion: 0.19
Nodes (10): BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf(), sha256Hex() (+2 more)

### Community 94 - "digest.test.ts"
Cohesion: 0.11
Nodes (23): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+15 more)

### Community 96 - "module-rules.ts"
Cohesion: 0.10
Nodes (14): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, optOut, integerCheckName() (+6 more)

### Community 97 - "chain-archive-replay-decode.integration.test.ts"
Cohesion: 0.15
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, SqliteTxRow, decodeArchivedTransaction() (+12 more)

### Community 98 - "ChainArchiveStore"
Cohesion: 0.09
Nodes (10): ChainArchiveStore, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents, `transactions` (chain_archive) (+2 more)

### Community 99 - "pglite-writer.worker.ts"
Cohesion: 0.16
Nodes (17): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor() (+9 more)

### Community 100 - "version"
Cohesion: 0.09
Nodes (21): version(), Non-goals (explicitly out of scope for this sprint), Proposal — Sprint 3: CheckpointStore, What changes, 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3) (+13 more)

### Community 101 - "boundary.test.ts"
Cohesion: 0.20
Nodes (19): collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared(), settingsElsewhere() (+11 more)

### Community 102 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.22
Nodes (17): phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), buildUnshieldedConfig(), firstStateWhere(), isPlainObject(), mergeSections(), referenceMergeEntries() (+9 more)

### Community 108 - "T"
Cohesion: 0.12
Nodes (19): T(), input(), 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state (+11 more)

### Community 111 - "table"
Cohesion: 0.11
Nodes (17): table(), 00020 — A module id that is a reserved SQL key word passes DB-8, and every unquoted reference to its schema fails, Evidence, Problem, Suggested fix, Cursor tables, Data that is not a function of the chain, Height-versioned tables (+9 more)

### Community 131 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.13
Nodes (13): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 5. WalletState envelope, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier (+5 more)

### Community 137 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.14
Nodes (13): repository(), 3. Rulings recorded for this release, 3. Target and gap analysis, Level summary, 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1 (+5 more)

### Community 146 - ".boolean"
Cohesion: 0.18
Nodes (11): 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Same data, two backends (+3 more)

### Community 152 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 172 - "Full-Chain Storage"
Cohesion: 0.22
Nodes (7): 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 4. How to run it, 5. Acceptance criteria status, 6. Known limitations, Full-Chain Storage

### Community 174 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 210 - "fresh-instance.mjs"
Cohesion: 0.40
Nodes (4): hex(), requested, store, stored

### Community 229 - "Requirement: DT-4 Per-block changes of every module table"
Cohesion: 0.50
Nodes (4): insert(), Requirement: DT-4 Per-block changes of every module table, Scenario: Insert then update in one block, Scenario: Rewriting the same value

### Community 65 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 66 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 70 - "context"
Cohesion: 0.07
Nodes (22): schemaName(), module(), context(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 83 - ".getAll"
Cohesion: 0.07
Nodes (25): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+17 more)

### Community 88 - "address"
Cohesion: 0.08
Nodes (24): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md` (+16 more)

### Community 104 - "ROADMAP.md"
Cohesion: 0.10
Nodes (16): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes, For historical reference only (+8 more)

### Community 105 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 106 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A bare numeric watermark value round-trips exactly (+12 more)

### Community 107 - "package.json"
Cohesion: 0.10
Nodes (20): bin, umbradb, description, exports, files, homepage, license, main (+12 more)

### Community 109 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.11
Nodes (15): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+7 more)

### Community 112 - "UmbraDB software supply-chain directory"
Cohesion: 0.11
Nodes (16): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists, 1. What SLSA v1.0 defines (+8 more)

### Community 113 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 118 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 119 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 120 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 121 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, durable-composition (implementation), Requirement: a conforming composition keeps the durable cursor from ever being ahead of durable checkpoint data, Requirement: saveAndAdvance co-commits a checkpoint and its sync cursor atomically, Requirement: the required Postgres configuration is published as a binding Durability Contract, Requirement: the UmbraDB connection sets bounded server-side timeouts by default, Scenario: a caller can override each timeout default, Scenario: A crash before the single commit leaves neither the checkpoint nor the cursor (+8 more)

### Community 122 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 124 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.12
Nodes (16): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.3 — Test evidence, coverage, and mutation, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules (+8 more)

### Community 126 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+7 more)

### Community 127 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer (+7 more)

### Community 130 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 133 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: driver-level failures surface as the shared StorageError hierarchy, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note), Scenario: A connection failure during any method surfaces as ConnectionError (+6 more)

### Community 134 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 136 - "README.md"
Cohesion: 0.24
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 139 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 140 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 141 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 142 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 143 - "Roadmap"
Cohesion: 0.14
Nodes (14): 1.0.0 acceptance checklist, Beyond 1.0.0 — additional tracks in progress, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`) (+6 more)

### Community 145 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 147 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 148 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 149 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.15
Nodes (12): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 3. L1 — lease mutual exclusion (release-blocking; start now), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED) (+4 more)

### Community 151 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 156 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 157 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 158 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 161 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 162 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 163 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 164 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.20
Nodes (9): 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups, 16. Browser, 18. Whole-system faults, differentials and measurements, 19. Close-out, 8. Admin endpoints (+1 more)

### Community 165 - "Tasks — Sprint 7: Transaction History Storage"
Cohesion: 0.20
Nodes (9): 0. Specification freeze, 1. Vendor/pin manifest, 2. Schema + interface, 3. PgTransactionHistoryStorage implementation, 4. WalletState envelope, 5. Storage-swappable conformance harness (Pg-only tier — required merge gate), 6. Live-sync tier (nightly/labeled — blocked on design.md §7's open question), 7. Close-out (+1 more)

### Community 166 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 167 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 168 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 170 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 171 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 173 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 175 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 176 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 177 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 178 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 180 - "scoped-review-manifest"
Cohesion: 0.25
Nodes (7): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 4 — Write the manifest, Step 5 — Hand off

### Community 181 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 182 - "Algebraic Specification of the midnight-pg-store Storage Layer"
Cohesion: 0.25
Nodes (6): Superseded — see `Formal/STORAGE_ALGEBRA.md`, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure, Algebraic Specification of the midnight-pg-store Storage Layer

### Community 183 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 184 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 185 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 186 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 187 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 188 - "UmbraDB 1.0.0 Release Contracts"
Cohesion: 0.29
Nodes (7): 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance, 7. Threat-model pointer, 8. Format headroom (reserved for 1.1), UmbraDB 1.0.0 Release Contracts

### Community 189 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 190 - "Security policy & threat model"
Cohesion: 0.29
Nodes (7): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 191 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 192 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 193 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 194 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 195 - "Performance — design"
Cohesion: 0.29
Nodes (6): 1. Postgres-side profiling, 2. Node-side query correlation, 3. GC architecture (the load-bearing decision), 4. Benchmark harness, 5. Activity logging, Performance — design

### Community 198 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 199 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 200 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 201 - "Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js"
Cohesion: 0.33
Nodes (5): 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js

### Community 202 - "Design — Sprint 1: project setup + TemporalKV"
Cohesion: 0.33
Nodes (5): 0. Schema naming, now that UmbraDB is standalone, 1. Package layout, 3. Connection factory (`src/postgres/client.ts`), 5. Test infrastructure, Design — Sprint 1: project setup + TemporalKV

### Community 203 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 204 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 205 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 206 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 207 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 208 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 209 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 211 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 212 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 213 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 214 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 215 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 216 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 217 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 218 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.40
Nodes (4): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Suggested fix

### Community 219 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 220 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 221 - "GC architecture and query-tracing: research findings"
Cohesion: 0.40
Nodes (4): Decision: GC architecture, Decision: query tracing, GC architecture and query-tracing: research findings, What was checked and found NOT to hold up (excluded from the above)

### Community 222 - "00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor"
Cohesion: 0.50
Nodes (3): 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor, Evidence, Suggested fix

### Community 223 - "00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone"
Cohesion: 0.50
Nodes (3): 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone, Problem, Suggested fix

### Community 224 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 225 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 226 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 227 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 228 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 230 - "7. Testing strategy (post-implementation)"
Cohesion: 0.50
Nodes (4): 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding), 7. Testing strategy (post-implementation)

### Community 231 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 232 - "Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference"
Cohesion: 0.50
Nodes (4): Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Scenario: fault-schedule end state matches the fault-free reference on current state, Scenario: negative control — a dropped range makes the equivalence assertion fire, Scenario: the differential gate imports no foreign consumer application

### Community 233 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 234 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 237 - "Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints"
Cohesion: 0.67
Nodes (3): Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Two runs, one difference

### Community 238 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 54 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 57 - "Design — v1.0.0-durable-checkpoint-cursor"
Cohesion: 0.04
Nodes (38): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+30 more)

### Community 58 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 63 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data responses name their view and height (+30 more)

### Community 67 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 72 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+25 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+23 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.06
Nodes (30): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: history() computes per-manifest aggregates in a single grouped query (HP-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1) (+22 more)

### Community 82 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future (+21 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.07
Nodes (27): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+19 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 90 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — Postgres-kill mid-save surfaces a typed error and stays all-or-nothing, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form (+18 more)

### Community 91 - "Requirements"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: Schema isolation is the default, not opt-in (+18 more)

### Community 93 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Postgres errors surface as the shared StorageError hierarchy, Requirement: Schema isolation is the default, not opt-in (+17 more)

### Community 95 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.08
Nodes (25): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+17 more)

## Knowledge Gaps
- **40 isolated node(s):** `RFC-3339`, `RFC-3339`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `tsx` (+35 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2751 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `UmbraError`, `PgTransactionLeaseLayer`, `src/index.ts`, `runMigrations`, `ws-mutual-tls.test.ts`, `cursor-durability.crash.test.ts`, `declaration.ts`, `api-server.test.ts`, `node/client.ts`, `node/client.test.ts`, `tape/index.ts`, `pglite.ts`, `builder.test.ts`, `ConnectionError`, `ref_node_fs`, `opt-out.test.ts`, `read-height.property.test.ts`, `loop.test.ts`, `order.property.test.ts`, `postgres/transaction-lease.ts`, `describeNodeStoreExports`, `excluded-not-exported.test.ts`, `height-versioned.test.ts`, `facade-merge-loader.ts`, `db/durability-probe.test.ts`, `adapter-suite.ts`, `no-indexer-or-wallet-sdk.test.ts`, `changes.property.test.ts`, `runner/process.ts`, `InMemoryBlockSource`, `core-chain.test.ts`, `component-table.test.ts`, `version-selection.test.ts`, `core-block-commit.test.ts`, `transform-checks.ts`, `halts.test.ts`, `pglite-queue.test.ts`, `mapping.ts`, `validate.test.ts`, `column-rules.test.ts`, `height-versioned.property.test.ts`, `history.test.ts`, `module-tables.ts`, `deterministic-postgresql/index.ts`, `chain-process.test.ts`, `ledger/types.ts`, `column-refusals.test.ts`, `development-opt-in.test.ts`, `networks.ts`, `core-settings.ts`, `crash.test.ts`, `entries.ts`, `database-fixtures.ts`, `builder.negative-control.test.ts`, `pg-tx-history-adapter.ts`, `redact.test.ts`, `version-checks.ts`, `transaction-history-storage.property.test.ts`, `history.property.test.ts`, `plain-data.ts`, `adapter-core.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `digest.test.ts`, `chain-archive-replay-decode.integration.test.ts`, `boundary.test.ts`, `cold-boot-recovery.integration.test.ts`, `package.json`, `BlobIntegrityError`, `checks.test.ts`?**
  _High betweenness centrality (0.292) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 11 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `@stryker-mutator/core` to the rest of the system?**
  _40 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.023417535922248753 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `declaration.ts`, `api-server.test.ts`, `checkShape`, `node/client.ts`, `node/client.test.ts`, `tape/index.ts`, `pglite.ts`, `ref_node_fs`, `opt-out.test.ts`, `loop.test.ts`, `order.property.test.ts`, `height-versioned.test.ts`, `db/durability-probe.test.ts`, `runner/process.ts`, `InMemoryBlockSource`, `changes.property.test.ts`, `transform-checks.ts`, `core-chain.test.ts`, `FinalizedLoop`, `core-block-commit.test.ts`, `config/history.ts`, `halts.test.ts`, `pglite-queue.test.ts`, `mapping.ts`, `validate.test.ts`, `RuntimeMetadata`, `history.test.ts`, `module-tables.ts`, `loop.ts`, `deterministic-postgresql/index.ts`, `chain-process.test.ts`, `cbor.ts`, `ledger/types.ts`, `graph.ts`, `development-opt-in.test.ts`, `config-check.ts`, `validate.ts`, `entries.ts`, `database-fixtures.ts`, `version-checks.ts`, `plain-data.ts`, `module-rules.ts`, `pglite-writer.worker.ts`, `checks.test.ts`, `version-table.ts`, `ProcessContexts`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `PgTransactionLeaseLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.021713970790851474 - nodes in this community are weakly interconnected._