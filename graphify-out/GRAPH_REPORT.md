# Graph Report - UmbraDB

## Corpus Check
- 796 files · ~1,236,779 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 8548 nodes · 24160 edges · 279 communities (255 shown, 24 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 3000 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `07249d30fd3b09c1` (796 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- UmbraError
- translatePostgresError
- postgres/transaction-history-storage.ts
- cbor.property.test.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- durability-checks.ts
- ref_node_path
- private/backends.ts
- loop.ts
- pglite-timeouts.test.ts
- full-sync-soak.integration.test.ts
- tx-replay-decoder.ts
- PgliteDatabase
- ingest-crash.test.ts
- BlobIntegrityError
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- core-block-fetch/metadata.ts
- changes.property.test.ts
- compact
- db/backends.ts
- ChainArchiveStore
- Process
- 3. Proof-blocking findings
- binding.test.ts
- pglite-outside-reads.ts
- FakeNode
- halts.test.ts
- chain-archive-rollover.ts
- ws-mutual-tls.test.ts
- module-tables.ts
- checkShape
- cursor-table.property.test.ts
- ref_node_crypto
- load-under-prune.integration.test.ts
- postgres/client.ts
- no-indexer-or-wallet-sdk.test.ts
- postgres/transaction-lease.ts
- intake.test.ts
- component-table.test.ts
- node/client.test.ts
- DeclarationSet
- a114Run
- ProcessItems
- postgres-image.test.ts
- config-check.ts
- Global Constraints
- BlockSource
- api-server.test.ts
- adapter.ts
- admin-harness.ts
- mutation-evidence.d.mts
- vendored-ledger-files.test.ts
- createClient
- HeldRead
- describeNodeStoreExports
- declaration.ts
- CliBackend
- ReadHandle
- RecordingClient
- runMigrations
- builder.test.ts
- snapshot.test.ts
- runner/process.ts
- ref_node_fs
- FinalizedLoop
- NodeBlockSource
- networks.ts
- transform-checks.ts
- serve.test.ts
- validate.test.ts
- BlockRef
- chain-placement.test.ts
- config/history.ts
- TransactionHandle
- opt-out.test.ts
- history.test.ts
- cbor.ts
- harness.ts
- TapeRecord
- version-checks.ts
- node/client.ts
- child-processes.test.ts
- chain-process.test.ts
- vitest
- src/index.ts
- test/postgres/setup.ts
- core-block-commit.test.ts
- recording.ts
- LedgerPackage
- postgres.ts
- build.ts
- tape/index.ts
- postgres/chain-archive-store.ts
- ValidationError
- NodeClient
- PgTransactionHistoryStorage
- mapping.ts
- graph.ts
- validate.ts
- determinism-checks.ts
- chain-data-tapes.ts
- plain-data.ts
- core-settings.ts
- column-rules.ts
- boundary.test.ts
- pglite.ts
- core-private-source.ts
- .value
- chain-data.test.ts
- post-block-update-checks.ts
- crash.test.ts
- entries.ts
- replay-check.ts
- loop.test.ts
- .show
- change-capture.ts
- writer-lock-checks.ts
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- PgTransactionLeaseLayer
- block-fetch-decode.test.ts
- cursor-durability.crash.test.ts
- db/durability-probe.test.ts
- differential-equivalence.test.ts
- digest.test.ts
- chain-events-decode.test.ts
- height-versioned.property.test.ts
- version
- core-private-source.test.ts
- pg
- height
- address
- halted
- node.test.ts
- mutation-per-adapter.mjs
- .read
- Tasks — v1.0.0-infosec-signoff
- 10. Tables
- facade-merge-loader.ts
- ADDED Requirements
- history.property.test.ts
- pack-install.mjs
- midnight-env — reproducible PREPROD dev environment
- .boolean
- 001_chain_archive_core.ts
- T
- fresh-instance.mjs
- graph.py
- fn
- ADDED Requirements
- ADDED Requirements
- Storage Algebra Lean Formalization — Approved Design and Status
- Full-Chain Storage — Design
- ADDED Requirements
- package.json
- README.md
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- UmbraDB software supply-chain directory
- ADDED Requirements
- Design — Postgres+JSONB storage rebuild
- stryker.conf.json
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- UmbraDB V1.0.0 Implementation Guideline
- devDependencies
- UmbraDB
- UmbraDB module guide
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- Roadmap
- compilerOptions
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- compilerOptions
- Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB third-party component inventory (SBOM)
- ADDED Requirements
- Requirement: DT-6 Stored data avoids non-deterministic values
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Scalability ceilings (v1.0.0)
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Tasks — v1.1.0: Quint model checking
- Repository agent policy
- scoped-review-manifest
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Security policy & threat model
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Our Pledge
- Midnight infra verification checklist
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 5. Recommended candidate model
- Tasks — CORE-ARCH: the standalone indexer's core architecture
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance criteria — v1.0.0-infosec-signoff
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
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00023 — The blocks table's height partitions end at 5,000,000
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
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
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 240 edges
2. `UmbraError` - 209 edges
3. `ModuleDeclaration` - 113 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `runMigrations()` - 90 edges
6. `ValidationError` - 87 edges
7. `PgCheckpointStore` - 87 edges
8. `Database` - 82 edges
9. `InMemoryBlockSource` - 79 edges
10. `NodeClient` - 78 edges

## Surprising Connections (you probably didn't know these)
- `Rework (class 1 — infra)` --references--> `ConnectionError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/storage-errors.ts
- `2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2)` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/v1.0.0-recovery-testing/tasks.md → src/interfaces/storage-errors.ts
- `3. PgTransactionHistoryStorage implementation` --references--> `StorageError`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/tasks.md → src/interfaces/storage-errors.ts
- `5. Activity logging` --references--> `StorageError`  [INFERRED]
  Performance/DESIGN.md → src/interfaces/storage-errors.ts
- `Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API` --references--> `TransactionKeyReuseError`  [INFERRED]
  openspec/changes/sprint-2-transaction-lease/specs/temporal-kv/spec.md → src/interfaces/temporal-kv.ts

## Import Cycles
- None detected.

## Communities (279 total, 24 thin omitted)

### Community 0 - "UmbraError"
Cohesion: 0.03
Nodes (154): Database, ReadOnlyDatabase, SchemaWriteHandle, Transaction, ReadTimeoutSetting, AppliedRow, MigrationPart, Runnable (+146 more)

### Community 1 - "translatePostgresError"
Cohesion: 0.03
Nodes (155): ConnectionError, Retryability, StorageError, HistoryUnavailableError, TemporalKVError, TransactionKeyReuseError, VersionConflictError, LeaseFaultError (+147 more)

### Community 10 - "postgres/transaction-history-storage.ts"
Cohesion: 0.03
Nodes (93): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryStatus, JsonEncoded (+85 more)

### Community 100 - "cbor.property.test.ts"
Cohesion: 0.11
Nodes (26): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+18 more)

### Community 101 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 102 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 104 - "durability-checks.ts"
Cohesion: 0.16
Nodes (20): PostgresTestDatabase, startWriter(), expectRefusedBeforeAnyWrite(), noHeight(), opened(), loginOn(), expectLockLostWhenTakenMeanwhile(), expectLockRetakenAfterTermination() (+12 more)

### Community 105 - "ref_node_path"
Cohesion: 0.14
Nodes (17): Held, PgliteLockUse, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor() (+9 more)

### Community 107 - "private/backends.ts"
Cohesion: 0.13
Nodes (15): PrivateBackend, SessionSeen, A112Observation, Wiring, pgliteBackend(), a146RefusalProblems(), schemaPlan(), PRIVATE_BACKENDS (+7 more)

### Community 11 - "loop.ts"
Cohesion: 0.04
Nodes (90): PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointArguments (+82 more)

### Community 110 - "pglite-timeouts.test.ts"
Cohesion: 0.11
Nodes (16): Run, Job, WorkerEvent, LockResult, expectNeverCutOffNorHung(), settings(), apiRead(), engine() (+8 more)

### Community 111 - "full-sync-soak.integration.test.ts"
Cohesion: 0.09
Nodes (11): CurrentState, GcPass, HistGroup, SampleObservation, kvMapKey(), readCurrentState(), { connectionUri }, DECLARED_ENVELOPE (+3 more)

### Community 112 - "tx-replay-decoder.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+12 more)

### Community 114 - "PgliteDatabase"
Cohesion: 0.19
Nodes (6): JobQueue, PgliteDatabase, handleClosed(), failedEarlier(), nestedCall(), openOn()

### Community 12 - "ingest-crash.test.ts"
Cohesion: 0.05
Nodes (81): Scenario, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded, FetchSeen (+73 more)

### Community 121 - "BlobIntegrityError"
Cohesion: 0.20
Nodes (12): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, ChainArchiveCheckViolationError, ChainArchiveInvariantError, 2.2 Storage layer (`src/interfaces/chain-archive-store.ts` + `src/postgres/chain-archive-store.ts`), 3.3 Strip / mark-experimental the chain-archive error classes (pre-freeze obligation) (+4 more)

### Community 123 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.11
Nodes (17): Hash, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence) (+9 more)

### Community 127 - "core-block-fetch/metadata.ts"
Cohesion: 0.12
Nodes (15): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, hexOf(), littleEndian() (+7 more)

### Community 128 - "changes.property.test.ts"
Cohesion: 0.15
Nodes (18): Op, States, TableName, encodeCanonical(), blockAgrees(), compareKeys(), expectedChanges(), keyId() (+10 more)

### Community 129 - "compact"
Cohesion: 0.34
Nodes (9): Field, Registry, metadataWith(), metadataV14(), midnightMetadata(), some(), text(), vec() (+1 more)

### Community 13 - "db/backends.ts"
Cohesion: 0.03
Nodes (71): ReadOptions, Snapshot, Settings, TestBackend, Case, Opened, PgliteTestServer, Phase (+63 more)

### Community 131 - "ChainArchiveStore"
Cohesion: 0.11
Nodes (6): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, Boundary enforcement, Table of contents, UmbraDB Postgres Schema Reference

### Community 132 - "Process"
Cohesion: 0.25
Nodes (3): Process, messageOf(), pause()

### Community 134 - "3. Proof-blocking findings"
Cohesion: 0.12
Nodes (17): Absent, n(), 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting (+9 more)

### Community 137 - "binding.test.ts"
Cohesion: 0.15
Nodes (10): TestDatabase, A113Observation, Binding, Outcome, privateCursorHeight(), bindingIn(), outcomeOf(), rowsIn() (+2 more)

### Community 138 - "pglite-outside-reads.ts"
Cohesion: 0.21
Nodes (11): LoadOutcome, OutsideRead, Traced, PgliteTestDatabase, expectNoOutsideReads(), outsideReads(), runUnderReadLoad(), turn() (+3 more)

### Community 14 - "halts.test.ts"
Cohesion: 0.05
Nodes (68): ProcessHandle, ProcessingEnd, ProcessStatus, A43Case, A43Observation, Outcome, ProcessDatabase, CoreSeen (+60 more)

### Community 140 - "chain-archive-rollover.ts"
Cohesion: 0.19
Nodes (14): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+6 more)

### Community 141 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 15 - "module-tables.ts"
Cohesion: 0.05
Nodes (62): CaptureColumn, ModuleColumn, ModuleContentsError, ModuleContentsFailure, ModuleTable, PageOptions, ConsistentRead, ColumnType (+54 more)

### Community 150 - "checkShape"
Cohesion: 0.33
Nodes (7): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown()

### Community 151 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 157 - "ref_node_crypto"
Cohesion: 0.18
Nodes (12): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, checkFunctionsSql(), numericOkPredicate(), refusedNumbersPath() (+4 more)

### Community 158 - "load-under-prune.integration.test.ts"
Cohesion: 0.16
Nodes (11): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, backdatePastGraceWindow(), newClient(), seedCheckpoints(), sha256() (+3 more)

### Community 16 - "postgres/client.ts"
Cohesion: 0.05
Nodes (54): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, Started, FailsOnceStarted, SlowToReportPorts, SourceFile (+46 more)

### Community 160 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.25
Nodes (8): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), REPOSITORY, ROOTS

### Community 17 - "postgres/transaction-lease.ts"
Cohesion: 0.05
Nodes (71): AsOf, AssertExact, JsonValue, Key, Namespace, Scope, Version, VersionedEntry (+63 more)

### Community 173 - "intake.test.ts"
Cohesion: 0.33
Nodes (11): PrivateSeen, A114Observation, A116Observation, a114Problems(), a116Problems(), follow(), heights(), readProblems() (+3 more)

### Community 176 - "component-table.test.ts"
Cohesion: 0.18
Nodes (7): DesignTable, RowCoverage, typeScriptFiles(), OPENERS, ROWS, SUITE, REPOSITORY

### Community 18 - "node/client.test.ts"
Cohesion: 0.04
Nodes (47): NodeRetry, NodeSocketEvents, Answer, Handler, Received, recorded, ManualTimers, connectWebSocket() (+39 more)

### Community 186 - "DeclarationSet"
Cohesion: 0.33
Nodes (10): CoreChainFacts, CheckState, ConfigCheckOptions, ProcessSide, CheckedConfig, ConfigContext, DeclarationSet, Opened (+2 more)

### Community 189 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 19 - "config-check.ts"
Cohesion: 0.04
Nodes (63): AdmittedKey, CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams (+55 more)

### Community 193 - "Global Constraints"
Cohesion: 0.22
Nodes (8): Write, Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice, Task 4: Add reproducible trust gates and close the M1 documentation loop

### Community 2 - "api-server.test.ts"
Cohesion: 0.03
Nodes (112): ApiRegistry, Connection, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, StartedModuleApi, ChainDataAnswer, ChainDataView (+104 more)

### Community 20 - "adapter.ts"
Cohesion: 0.04
Nodes (62): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+54 more)

### Community 21 - "admin-harness.ts"
Cohesion: 0.04
Nodes (64): AdminServer, AdminStartOptions, AdminRun, AdminRunOptions, Answered, Answerer, Expected, gate (+56 more)

### Community 218 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 220 - "vendored-ledger-files.test.ts"
Cohesion: 0.33
Nodes (5): Upstream, filesUnder(), patchesOf(), patchText(), ledgerDir

### Community 23 - "createClient"
Cohesion: 0.04
Nodes (67): C5AnyFn, CrashWorkerHandle, SuiteWatchdogTimeoutError, assertNoConflictingSearchPath(), createClient(), class2AdvisoryLockCountForHash(), manifestCount(), pool() (+59 more)

### Community 234 - "HeldRead"
Cohesion: 0.60
Nodes (3): HeldRead, concurrent(), queued()

### Community 24 - "describeNodeStoreExports"
Cohesion: 0.07
Nodes (51): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+43 more)

### Community 25 - "declaration.ts"
Cohesion: 0.04
Nodes (64): OwnPart, ErrorCode, BlockHeader, DefinedModule, FieldKind, FieldSchema, ItemDeclaration, KnownPointsOnly (+56 more)

### Community 26 - "ReadHandle"
Cohesion: 0.05
Nodes (37): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, BlockContext (+29 more)

### Community 27 - "runMigrations"
Cohesion: 0.04
Nodes (70): UmbraDBConnectionOptions, assertValidSchemaName(), runMigrations(), 8. Migration, 2. Forward-only / no-downgrade migration contract, 3. Cancellation semantics, 5. Lease limitation, 6. Backup/restore guidance (+62 more)

### Community 28 - "builder.test.ts"
Cohesion: 0.05
Nodes (31): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Frame, RawClient, Script (+23 more)

### Community 29 - "snapshot.test.ts"
Cohesion: 0.07
Nodes (51): ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminStarter, SnapshotFacts, ConfigSnapshot, SanitizedError, StatusSnapshot (+43 more)

### Community 3 - "runner/process.ts"
Cohesion: 0.03
Nodes (92): Bound, ChainIdentity, ChainSource, CoreChainBinding, NodeWait, WaitingListener, HistoryCheck, HistoryInput (+84 more)

### Community 30 - "ref_node_fs"
Cohesion: 0.09
Nodes (56): ApplyOutput, StoredNode, Upstream, contractFixture, Ledger, AdapterSubject, NodeRoot, AdapterWorkerAnswer (+48 more)

### Community 31 - "FinalizedLoop"
Cohesion: 0.06
Nodes (21): FinalizedLoop, HeightRun, LoopObserver, Startup, SkipsAfterReconnect, Batching, WaitingInRead, ItemsAfterWrite (+13 more)

### Community 32 - "NodeBlockSource"
Cohesion: 0.08
Nodes (18): HeadWait, NodeBlockSource, NodeHeader, PreparedBlock, QueueRunner, NoWindow, Refetches, TrustsNotifications (+10 more)

### Community 33 - "networks.ts"
Cohesion: 0.05
Nodes (63): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+55 more)

### Community 34 - "transform-checks.ts"
Cohesion: 0.08
Nodes (44): Failure, Variant, TransformError, NotifyRecord, recordKind, SubscriptionId, CallSelection, NotificationRange (+36 more)

### Community 35 - "serve.test.ts"
Cohesion: 0.07
Nodes (39): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminAnswer, AdminEndpoint, AdminPart (+31 more)

### Community 36 - "validate.test.ts"
Cohesion: 0.05
Nodes (46): coreEntry, EntryRef, Needs, Finding, CursorRow, Expected, checked(), checked() (+38 more)

### Community 37 - "BlockRef"
Cohesion: 0.05
Nodes (31): BlockHeaderItem, BlockEventSource, BlockItemSource, CoreBlockHeader, CoreBlockItems, NodeSourceOptions, Prefetch, QueuedBlock (+23 more)

### Community 38 - "chain-placement.test.ts"
Cohesion: 0.06
Nodes (57): BodyExtrinsic, BlockBody, MetadataVariant, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent (+49 more)

### Community 39 - "config/history.ts"
Cohesion: 0.07
Nodes (54): CoreVersion, CoreSettings, HistoryCode, HistoryContext, Span, CheckedEntry, PlacedEntry, StartedProcess (+46 more)

### Community 4 - "TransactionHandle"
Cohesion: 0.02
Nodes (126): TransactionHistoryReader, TransactionHistoryWriter, TemporalKV, TransactionHandle, TransactionHandleInvalidError, Watermarks, validateSaveOptions(), saveAndAdvance() (+118 more)

### Community 40 - "opt-out.test.ts"
Cohesion: 0.06
Nodes (45): PlacedRefusal, Refusal, Chain, ChainOptions, DigestRow, defineModule(), hex(), moduleM() (+37 more)

### Community 41 - "history.test.ts"
Cohesion: 0.06
Nodes (52): versionEntry, HistoryOptions, HistoryRow, Simulation, Start, Case, databaseOptions(), openConfiguredDatabase() (+44 more)

### Community 42 - "cbor.ts"
Cohesion: 0.07
Nodes (49): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+41 more)

### Community 43 - "harness.ts"
Cohesion: 0.09
Nodes (46): BenchEnv, BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve (+38 more)

### Community 44 - "TapeRecord"
Cohesion: 0.06
Nodes (41): Recorded, Metadata, Step, Failure, Variant, TapeError, TapeProblem, TapeNodeOptions (+33 more)

### Community 45 - "version-checks.ts"
Cohesion: 0.09
Nodes (33): MetadataBlock, MetadataNode, RuntimeMetadata, RuntimeMetadataEntry, LedgerSelection, VersionedBlock, OwnStateMetadata, CountingNode (+25 more)

### Community 46 - "node/client.ts"
Cohesion: 0.09
Nodes (45): Connection, NodeClientOptions, State, Subscription, NodeBlock, NodeRuntimeVersion, NodeCallMethod, SubscribeMethod (+37 more)

### Community 47 - "child-processes.test.ts"
Cohesion: 0.05
Nodes (44): ParentJob, Kill, Orphaned, SourceFile, guardContainers(), guardPid(), alive(), bystander() (+36 more)

### Community 48 - "chain-process.test.ts"
Cohesion: 0.06
Nodes (41): Job, WorkerEvent, A77Observation, A78Observation, A90Observation, Failing, Flaky, Seen (+33 more)

### Community 49 - "vitest"
Cohesion: 0.05
Nodes (24): Lockfile, Manifest, Report, GuardViolation, ReportedTest, inTimeZone(), extractStringLiterals(), findChainSyncViolations() (+16 more)

### Community 5 - "src/index.ts"
Cohesion: 0.03
Nodes (117): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStore, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError (+109 more)

### Community 50 - "test/postgres/setup.ts"
Cohesion: 0.06
Nodes (34): Method, Cancellable, CrashHook, CrashWorkerReady, CrashWorkerResult, SpawnCrashWorkerOptions, registerSuiteLifecycle(), startTestDatabase() (+26 more)

### Community 51 - "core-block-commit.test.ts"
Cohesion: 0.07
Nodes (38): InMemoryItems, Wait, Commit, blockHeaderOf(), checkParent(), commitBlock(), hex(), ledgerVersionOf() (+30 more)

### Community 52 - "recording.ts"
Cohesion: 0.08
Nodes (28): Link, TapeBuilderOptions, RecordingError, RecordingProblem, TransformProblem, readRequest, RequestId, NotJsonError (+20 more)

### Community 53 - "LedgerPackage"
Cohesion: 0.05
Nodes (30): LedgerEvent, LedgerEventKind, LedgerPackage, LedgerTask, StateHandle, addCosts(), 00018 — The ledger packages' `successfulSegments` is true for the segments that failed, Evidence (+22 more)

### Community 54 - "postgres.ts"
Cohesion: 0.07
Nodes (24): BoundedRead, DriverError, Outcome, Role, Session, Writer, Job, commitRolledBack() (+16 more)

### Community 55 - "build.ts"
Cohesion: 0.09
Nodes (32): LoadLedger, CoreLedgerVersion, LedgerName, LedgerPackageIdentity, LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, LedgerReleasePackage (+24 more)

### Community 56 - "tape/index.ts"
Cohesion: 0.10
Nodes (24): Json, Connection, TapeCall, TapeClock, TapeNode, TapeOutcome, CallRecord, SubscribeRecord (+16 more)

### Community 57 - "postgres/chain-archive-store.ts"
Cohesion: 0.10
Nodes (27): BlobRole, BlockBundle, BlockMeta, BlockRecord, BlockStatus, BridgeObservationKind, BridgeObservationRecord, ChainArchiveErrorCode (+19 more)

### Community 58 - "ValidationError"
Cohesion: 0.06
Nodes (44): ValidationError, exceedsMaxDepth(), EntrySectionsSchema, LL-002 — A7 watermark-participation negative control did not fire; survived fix-round-1, caught by round-2 cold cross-vendor Codex, 0. Package layout, 1. Chunking, 3. `prune` — two-step GC, `design/design.md` §3's pass plus §2.1's cascade, 6. Migration (`002_checkpoint_store.ts`) (+36 more)

### Community 59 - "NodeClient"
Cohesion: 0.11
Nodes (15): HeadSubscriber, NodeClient, Pending, Waiter, connectionFailure, NodeMethod, IngestOptions, Opened (+7 more)

### Community 6 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (116): MergeEntriesFn, TransactionHistoryEntry, TransactionHistoryStorage, PgTransactionHistoryStorage, InMemoryTransactionHistoryStorage, capitalize(), abortErrorLike(), capitalize() (+108 more)

### Community 60 - "mapping.ts"
Cohesion: 0.08
Nodes (31): ResultColumn, ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText() (+23 more)

### Community 61 - "graph.ts"
Cohesion: 0.08
Nodes (42): Edge, GraphPart, GraphRule, MidChain, Missing, RangeFacts, Spanned, DeclarationOrigin (+34 more)

### Community 62 - "validate.ts"
Cohesion: 0.09
Nodes (40): HistoryFinding, ConfigRule, CursorRule, Finding, Issue, Plain, SettingsSchema, coreSettingsSchema() (+32 more)

### Community 64 - "determinism-checks.ts"
Cohesion: 0.10
Nodes (37): PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals, privateBackbone(), a113Run(), against() (+29 more)

### Community 65 - "chain-data-tapes.ts"
Cohesion: 0.09
Nodes (40): BlockSpec, EventSpec, Json, transactionSpec, eventsRuntime, PalletMetadata, Phase, RuntimeShape (+32 more)

### Community 67 - "plain-data.ts"
Cohesion: 0.08
Nodes (31): LoadedConfig, LoadOptions, PlainArray, plainData, PlainDataNode, PlainDataRule, Walk, Row (+23 more)

### Community 68 - "core-settings.ts"
Cohesion: 0.06
Nodes (34): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+26 more)

### Community 7 - "column-rules.ts"
Cohesion: 0.02
Nodes (116): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, Because, CatalogFunction, CatalogType (+108 more)

### Community 70 - "boundary.test.ts"
Cohesion: 0.13
Nodes (34): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+26 more)

### Community 72 - "pglite.ts"
Cohesion: 0.09
Nodes (29): DatabaseState, ReadDatabaseOptions, TypeCheckFinding, TypeCheckResult, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight (+21 more)

### Community 73 - "core-private-source.ts"
Cohesion: 0.12
Nodes (21): ChainCheck, PrivateBlockSource, privateIntake, PrivateIntakeOptions, PublicDatabase, PublicIdentity, PublicWakes, readIdentity() (+13 more)

### Community 74 - ".value"
Cohesion: 0.19
Nodes (15): TypeDef, ScaleError, ScaleReader, ValueReader, field(), pallet(), readRuntimeMetadata(), readTypeRegistry() (+7 more)

### Community 75 - "chain-data.test.ts"
Cohesion: 0.11
Nodes (28): BlockParsed, itemsSeen, ProcessBackend, a91Problems(), a92Problems(), a93Problems(), itemsWatcher(), parsedRows() (+20 more)

### Community 76 - "post-block-update-checks.ts"
Cohesion: 0.11
Nodes (32): RawPackage, Decimal, Fullness, OracleAfter, oracleCase, OracleCost, OracleFullness, OracleSystemTransaction (+24 more)

### Community 77 - "crash.test.ts"
Cohesion: 0.09
Nodes (30): SignalTarget, CrashCall, CrashEvent, CrashOptions, CrashObservation, WORKER, CrashJob, CrashWorkerEvent (+22 more)

### Community 78 - "entries.ts"
Cohesion: 0.06
Nodes (32): CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+24 more)

### Community 79 - "replay-check.ts"
Cohesion: 0.09
Nodes (22): TapeBuilder, TapeCommandIo, ConnectionFrames, RecordAndReplayOptions, RecordAndReplayResult, ReplaySession, frameText(), isWebSocketUrl() (+14 more)

### Community 8 - "loop.test.ts"
Cohesion: 0.04
Nodes (100): EntryRange, InMemoryBlockSource, Contexts, LoopClass, RunnerBackend, RunnerDatabase, SeenCall, Started (+92 more)

### Community 80 - ".show"
Cohesion: 0.07
Nodes (22): AllowedDetail, schemaName(), module(), Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance (+14 more)

### Community 81 - "change-capture.ts"
Cohesion: 0.10
Nodes (25): CapturedTable, CaptureState, GuardTableRow, optOut, captureDefinitions(), capturedTables(), captureFunctionName(), captureReady() (+17 more)

### Community 83 - "writer-lock-checks.ts"
Cohesion: 0.12
Nodes (26): WriterProcess, WorkerEvent, PauseReport, blocksIn(), cleanUp(), firstOf(), startWriterProcess(), workDirectory() (+18 more)

### Community 85 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.07
Nodes (25): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED) (+17 more)

### Community 9 - "PgTransactionLeaseLayer"
Cohesion: 0.04
Nodes (89): TransactionLeaseLayer, WatermarkKey, WatermarkKind, WatermarkValue, PgCheckpointStore, UmbraDBSql, PgTemporalKV, PgTransactionLeaseLayer (+81 more)

### Community 90 - "block-fetch-decode.test.ts"
Cohesion: 0.10
Nodes (25): ExtrinsicCall, PalletSpec, blake2b256(), compress(), rotateRight(), words(), blockTimeOf(), callOf() (+17 more)

### Community 91 - "cursor-durability.crash.test.ts"
Cohesion: 0.08
Nodes (28): BatchSpec, CurrentState, InvariantResult, adaptersFor(), completeManifestCount(), driveFullBatch(), durableCompleteSeqs(), durableKvValues() (+20 more)

### Community 92 - "db/durability-probe.test.ts"
Cohesion: 0.12
Nodes (24): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, WriterSession, WriterStart, Row, assertNoTransactionPooler() (+16 more)

### Community 93 - "differential-equivalence.test.ts"
Cohesion: 0.12
Nodes (26): CurrentState, Fault, adaptersFor(), applyBatchUnderFault(), buildSchedule(), completeManifestCount(), driveFullBatch(), injectT1() (+18 more)

### Community 95 - "digest.test.ts"
Cohesion: 0.11
Nodes (24): ChangeKind, tableChanges, TouchedRow, digestBlock(), takeChanges(), changeOf(), concat(), isCheckpointHeight() (+16 more)

### Community 98 - "chain-events-decode.test.ts"
Cohesion: 0.12
Nodes (24): RuntimeMetadataView, blockParsedOf(), bindCoreChainEvents(), boundEventSource(), chainEventsItemOf(), chainEventsOf(), coreChainEventsOnFetch(), metadataView() (+16 more)

### Community 99 - "height-versioned.property.test.ts"
Cohesion: 0.13
Nodes (20): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Key, Model (+12 more)

### Community 108 - "version"
Cohesion: 0.09
Nodes (22): version(), Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-7 The history row and its hash, Scenario: A misspelled setting is a type error, Scenario: The same entry gives the same hash, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()` (+14 more)

### Community 109 - "core-private-source.test.ts"
Cohesion: 0.11
Nodes (6): publicNotStarted(), fakePublic(), fakeRead(), CORE_KEY_REGISTRY, PUBLIC_POLL_MS, PRIVATE_CORE_DIGEST

### Community 118 - "pg"
Cohesion: 0.11
Nodes (17): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 1. Postgres-side profiling (+9 more)

### Community 119 - "height"
Cohesion: 0.12
Nodes (18): height(), 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer"), 4.5 `verifier_key_observations` — v3 redesign of the "build now" VK addition (replaces v2's `verifier_keys`), 4.6 Range partitioning strategy, 4. Schema design (+10 more)

### Community 124 - "address"
Cohesion: 0.12
Nodes (17): address(), isAddress(), Generate your local wallet, Test wallets, Why this is not just a committed key anymore, G19 — Committed-secret remediation, 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document (+9 more)

### Community 125 - "halted"
Cohesion: 0.12
Nodes (18): halted(), ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-4 Readiness, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked (+10 more)

### Community 147 - "node.test.ts"
Cohesion: 0.17
Nodes (7): expectDelayHonoured(), manualClock(), randomPort(), BARRIER_METHOD, FAULT_RPC_CODE, NOT_ON_TAPE_RPC_CODE, PORT_ATTEMPTS

### Community 148 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 149 - ".read"
Cohesion: 0.17
Nodes (14): identityRow(), captured(), triggerEnabled(), state(), migrationRows(), storedRows(), exists(), halfFailedViolations() (+6 more)

### Community 153 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.14
Nodes (13): repository(), 3. Rulings recorded for this release, 3. Target and gap analysis, Level summary, 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1 (+5 more)

### Community 166 - "10. Tables"
Cohesion: 0.20
Nodes (11): fakePackage(), regular(), system(), Chain events, transactions and their outcomes, 10. Tables, Requirement: CD-5 `core-block-parsed` parses each block once, Scenario: A system transaction between regular ones, Scenario: A transaction no event accounts for (+3 more)

### Community 167 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 169 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): insert(), ADDED Requirements, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints, Scenario: Checkpoints at the same heights, Scenario: Insert then update in one block, Scenario: Rewriting the same value (+3 more)

### Community 172 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 177 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 195 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 206 - ".boolean"
Cohesion: 0.29
Nodes (7): 6. Determinism, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Scenario: Map key order, Scenario: RFC test vectors, Scenario: Text keys with mixed case, Scenario: `uuid` and `boolean` keys

### Community 219 - "001_chain_archive_core.ts"
Cohesion: 0.43
Nodes (5): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS

### Community 22 - "T"
Cohesion: 0.03
Nodes (76): T(), input(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 1. TemporalKV — event-sourced right action with a CAS guard, 2. CheckpointStore — idempotent join-semilattice with a reachability closure, 3. Watermarks — trivial last-write-wins (deliberately *not* event-sourced), 4. Transaction / Lease — the control algebra the other three run inside, 6. On not adding a Merkle/authenticated data structure (+68 more)

### Community 248 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 71 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 86 - "fn"
Cohesion: 0.08
Nodes (31): fn(), ADDED Requirements, MODIFIED Requirements, Requirement: TransactionKeyReuseError is now reachable through the public put() API, Scenario: Two puts to the same key inside one transaction reject and roll back together, through the public API, temporal-kv (transaction-participation wiring), ADDED Requirements, Requirement: A lease timeout surfaces distinctly for acquireLease vs. tryAcquireLease (+23 more)

### Community 94 - "ADDED Requirements"
Cohesion: 0.07
Nodes (29): listen(), ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Requirement: CF-3 Every entry is validated at startup, Requirement: CF-4 Every field is data, operational or secret, Requirement: CF-5 Entries are revised by `(id, start)` (+21 more)

### Community 103 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database, Requirement: PP-4 The process transport (+18 more)

### Community 106 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.08
Nodes (25): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+17 more)

### Community 113 - "Full-Chain Storage — Design"
Cohesion: 0.09
Nodes (21): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs (+13 more)

### Community 115 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 116 - "package.json"
Cohesion: 0.10
Nodes (20): bin, umbradb, description, exports, files, homepage, license, main (+12 more)

### Community 117 - "README.md"
Cohesion: 0.16
Nodes (5): For historical reference only, Tasks — superseded by per-sprint openspec changes, UmbraDB v1.0.0 — Release Record (PENDING), What 1.0.0 additionally requires, What must happen before this record can be completed

### Community 120 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 122 - "UmbraDB software supply-chain directory"
Cohesion: 0.11
Nodes (16): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists, 1. What SLSA v1.0 defines (+8 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 130 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.11
Nodes (14): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+6 more)

### Community 133 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 135 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 136 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 142 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 143 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.12
Nodes (15): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+7 more)

### Community 144 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.13
Nodes (15): §0 — Authority and invariants, §1 — Workflow, §2.1 — Building, §2.2 — Evidence for reviews, §2.5 — Security (G15–G19), §2 — Engineering rules, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N) (+7 more)

### Community 145 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner, @testcontainers/postgresql (+7 more)

### Community 146 - "UmbraDB"
Cohesion: 0.13
Nodes (15): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+7 more)

### Community 152 - "UmbraDB module guide"
Cohesion: 0.14
Nodes (13): Cursor tables, Data that is not a function of the chain, Migrations, Private modules, Process items and APIs, Reading through `db`, Start and stop heights, Stored values and digests (+5 more)

### Community 154 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 155 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 156 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 159 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 161 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 162 - "Design — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.15
Nodes (12): 0. Test-infrastructure layout, 1.1 Skip-enforcement mechanism — the anti-self-skip guarantee, made a named check, 1. Crash harness — deterministic faults, not timing races (`council/B` §3 tooling ruling), 3.1 Full-sync soak (`council/B` §3 item 5; `01` checklist item 3), 3. G10 — full-sync soak + load-under-concurrent-prune, 4. Boundary respected — no consumer-app import (G11/G12), 5. G11 — differential state-equivalence, rescoped in-repo (`01` item 4; `council/B` §1; `02`-T11), 6. G12 — Milestone-5 live round-trip, rescoped as manual pre-tag Preprod evidence (`01` §Cutover) (+4 more)

### Community 163 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 165 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 168 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 170 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 171 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 174 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 175 - "Tasks — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.18
Nodes (10): 0. Crash harness (foundation), 1. Process-kill mid-save (G9 / 02-T1), 2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2), 3. Crash between data and cursor — the keystone (G9 / 02-T5)  ⟵ depends on G5, 4. Lease non-wedge cold start (G9 / 02-T3), 6. Differential state-equivalence gate, rescoped in-repo (G11)  ⟵ fault-schedule half depends on G5, 7. CI gate wiring, 8. G12 — manual pre-tag Preprod evidence run  ⟵ release step 7, against the RC (+2 more)

### Community 178 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 179 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.20
Nodes (10): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+2 more)

### Community 180 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 181 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-4 One provider of contract logs at a time, Scenario: A log in a failed fallible segment, Scenario: A v8 log, Scenario: Full until a backup, fast after it, Scenario: Two calls to one contract in one block (+1 more)

### Community 182 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 183 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 184 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 185 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 190 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 191 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 192 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 194 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 196 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 197 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 199 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 200 - "scoped-review-manifest"
Cohesion: 0.25
Nodes (7): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 4 — Write the manifest, Step 5 — Hand off

### Community 201 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 202 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 203 - "Security policy & threat model"
Cohesion: 0.25
Nodes (8): Commit policy — what may and may not go into git, Reporting a vulnerability, `schema` is namespacing, NOT a security or tenant boundary, Scope — documented preconditions vs. implemented controls (1.0.0), Security policy & threat model, T-A1 — Single trusted writer, one trust domain, T-A2 — Trusted Postgres, disk, backups, and operator, Trust model (the assumptions the code is built on)

### Community 204 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 205 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 207 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 208 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 209 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.29
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 210 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 211 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 212 - "Tasks — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.29
Nodes (6): 13. Contract data, 15. Backups, 16. Browser, 18. Whole-system faults, differentials and measurements, 19. Close-out, Tasks — CORE-ARCH: the standalone indexer's core architecture

### Community 213 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 214 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 215 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.29
Nodes (6): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate

### Community 216 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 217 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 221 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 222 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 223 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 224 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 225 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 226 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 227 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 228 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 229 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 230 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 231 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 232 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 233 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 235 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 236 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 237 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 238 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 239 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 240 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 241 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 242 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 243 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 244 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 245 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 246 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 247 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 249 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 250 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 251 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 252 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 253 - "TransactionHistory (kept, not built)"
Cohesion: 0.50
Nodes (3): Checking it by hand, Layout, TransactionHistory (kept, not built)

### Community 254 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 255 - "Acceptance criteria — v1.0.0-perf-baseline"
Cohesion: 0.50
Nodes (3): Acceptance criteria — v1.0.0-perf-baseline, Boundary / non-goal assertions (must remain true), G14 — benchmark harness + recorded baseline

### Community 256 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 257 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 261 - "Requirement: set is an idempotent, unconditional overwrite (Law W1)"
Cohesion: 0.67
Nodes (3): Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A new set always overwrites, with no conflict possible, Scenario: Setting the same value twice leaves the stored state unchanged

### Community 262 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 63 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 66 - "ADDED Requirements"
Cohesion: 0.05
Nodes (40): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+32 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 82 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides, Requirement: LG-17 Ledger tasks give modules the native objects (+25 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, checkpoint-store (implementation), Requirement: A manifest preserves the exact order and multiplicity of its chunks, including repeats, Requirement: An already-aborted opts.signal rejects before any database work; a signal aborting after the call has begun has no effect, Requirement: Checkpoint payloads are split into fixed-size chunks with a correctly-sized remainder, Requirement: Checkpoint sequence numbers are gapless, monotonic, and scoped per wallet+network, Requirement: Chunk reclamation respects the grace window, protecting against re-reference races, Requirement: Chunk storage is content-addressed and globally deduplicated (+23 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 89 - "ADDED Requirements"
Cohesion: 0.06
Nodes (32): ADDED Requirements, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form, Requirement: G9/T3 — a killed lease-holder does not wedge the lease (+24 more)

### Community 96 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 97 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

## Knowledge Gaps
- **42 isolated node(s):** `RFC-3339`, `RFC-8949`, `RFC-8949`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner` (+37 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3001 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `UmbraError`, `translatePostgresError`, `api-server.test.ts`, `runner/process.ts`, `src/index.ts`, `column-rules.ts`, `loop.test.ts`, `PgTransactionLeaseLayer`, `postgres/transaction-history-storage.ts`, `loop.ts`, `ingest-crash.test.ts`, `db/backends.ts`, `halts.test.ts`, `module-tables.ts`, `postgres/client.ts`, `postgres/transaction-lease.ts`, `node/client.test.ts`, `config-check.ts`, `adapter.ts`, `admin-harness.ts`, `createClient`, `describeNodeStoreExports`, `declaration.ts`, `ReadHandle`, `builder.test.ts`, `snapshot.test.ts`, `ref_node_fs`, `networks.ts`, `transform-checks.ts`, `serve.test.ts`, `validate.test.ts`, `chain-placement.test.ts`, `opt-out.test.ts`, `history.test.ts`, `cbor.ts`, `TapeRecord`, `version-checks.ts`, `node/client.ts`, `child-processes.test.ts`, `chain-process.test.ts`, `test/postgres/setup.ts`, `core-block-commit.test.ts`, `recording.ts`, `postgres.ts`, `build.ts`, `mapping.ts`, `plain-data.ts`, `core-settings.ts`, `boundary.test.ts`, `.value`, `chain-data.test.ts`, `post-block-update-checks.ts`, `crash.test.ts`, `entries.ts`, `writer-lock-checks.ts`, `block-fetch-decode.test.ts`, `cursor-durability.crash.test.ts`, `db/durability-probe.test.ts`, `differential-equivalence.test.ts`, `digest.test.ts`, `chain-events-decode.test.ts`, `height-versioned.property.test.ts`, `cbor.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `durability-checks.ts`, `ref_node_path`, `private/backends.ts`, `core-private-source.test.ts`, `pglite-timeouts.test.ts`, `full-sync-soak.integration.test.ts`, `package.json`, `BlobIntegrityError`, `changes.property.test.ts`, `binding.test.ts`, `pglite-outside-reads.ts`, `ws-mutual-tls.test.ts`, `node.test.ts`, `mutation-per-adapter.mjs`, `cursor-table.property.test.ts`, `load-under-prune.integration.test.ts`, `no-indexer-or-wallet-sdk.test.ts`, `excluded-not-exported.test.ts`, `facade-merge-loader.ts`, `history.property.test.ts`, `intake.test.ts`, `component-table.test.ts`, `postgres-image.test.ts`, `vendored-ledger-files.test.ts`?**
  _High betweenness centrality (0.296) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `UmbraError` (e.g. with `11. Refusals and halts (IN-12)` and `12. Exported surface and command (LS-1, LS-6)`) actually correct?**
  _`UmbraError` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-8949`, `RFC-8949` to the rest of the system?**
  _42 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.025387666786873424 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `changes.property.test.ts`, `api-server.test.ts`, `runner/process.ts`, `column-rules.ts`, `loop.test.ts`, `loop.ts`, `ingest-crash.test.ts`, `db/backends.ts`, `halts.test.ts`, `module-tables.ts`, `node/client.test.ts`, `config-check.ts`, `admin-harness.ts`, `checkShape`, `declaration.ts`, `ReadHandle`, `snapshot.test.ts`, `FinalizedLoop`, `NodeBlockSource`, `networks.ts`, `transform-checks.ts`, `validate.test.ts`, `BlockRef`, `config/history.ts`, `opt-out.test.ts`, `history.test.ts`, `cbor.ts`, `version-checks.ts`, `node/client.ts`, `chain-process.test.ts`, `core-block-commit.test.ts`, `LedgerPackage`, `postgres.ts`, `build.ts`, `NodeClient`, `mapping.ts`, `graph.ts`, `validate.ts`, `plain-data.ts`, `pglite.ts`, `core-private-source.ts`, `entries.ts`, `writer-lock-checks.ts`, `db/durability-probe.test.ts`, `durability-checks.ts`, `ref_node_path`, `core-private-source.test.ts`, `PgliteDatabase`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `translatePostgresError` be split into smaller, more focused modules?**
  _Cohesion score 0.026490852934188642 - nodes in this community are weakly interconnected._