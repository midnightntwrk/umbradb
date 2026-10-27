# Graph Report - UmbraDB

## Corpus Check
- 912 files · ~1,409,097 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 9806 nodes · 28948 edges · 294 communities (268 shown, 26 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 3287 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `6ae16e14ff4d6024` (912 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- admin-harness.ts
- node/client.test.ts
- loop.test.ts
- cold-boot-recovery.integration.test.ts
- digest.test.ts
- core-transport.ts
- version-checks.ts
- api-server.ts
- code-registry.ts
- core-block-fetch/metadata.ts
- sweep.ts
- child-processes.test.ts
- tx-replay-decoder.ts
- UmbraError
- ModuleApi
- transport-faults.test.ts
- postgres/chain-archive-store.ts
- version-table.ts
- recovery.test.ts
- transaction-history-storage.property.test.ts
- tape/index.ts
- version.negative-control.test.ts
- referenceMergeEntries
- identity.ts
- commit-proxy.ts
- 3. Proof-blocking findings
- config/history.ts
- FakeNode
- tape/command.ts
- ws-mutual-tls.test.ts
- config-check.ts
- catalog.ts
- postgres/transaction-history-storage.ts
- chain-archive-rollover.ts
- ledger-storage.test.ts
- attempt
- cursor-durability.crash.test.ts
- ApiRoutes
- NodeClient
- Heartbeat
- childRefKeys
- component-table.test.ts
- runMigrations
- postgres/transaction-lease.ts
- postgres-image.test.ts
- Design — v1.0.0: Formal completion (`formal-completion`)
- src/index.ts
- NodeBlockSource
- spawnChild
- time-values.test.ts
- ref_node_path
- TransactionHandle
- ReadPool
- mutation-evidence.d.mts
- child-processes.parent.ts
- writer-lock-checks.ts
- Reader
- ReadHandle
- timeouts/timeouts.test.ts
- FinalizedLoop
- createClient
- exitWithin
- process-admin.ts
- adapter-fixtures.ts
- adapter.ts
- builds.ts
- runner/process.ts
- node-format.ts
- ledger/types.ts
- translatePostgresError
- LedgerPackage
- load-under-prune.integration.test.ts
- validate.ts
- transform-checks.ts
- real-tapes.ts
- harness.ts
- chain-process.test.ts
- PgTransactionHistoryStorage
- roles.ts
- ModuleDeclaration
- vitest
- validation.ts
- core-ledger-state.ts
- db/migrate.test.ts
- stop-heights.test.ts
- column-rules.ts
- column-rules.test.ts
- db/migrate.ts
- 12. Ledger
- zero-timeouts-checks.ts
- cbor.ts
- core-block-commit.test.ts
- core-private-source.ts
- write-handles.test.ts
- graph.ts
- checkShape
- PgTransactionLeaseLayer
- core-settings.ts
- cbor.property.test.ts
- api-server.test.ts
- BlockRef
- boundary.test.ts
- networks.ts
- declaration.ts
- crash-worker.ts
- messages.ts
- pglite-server.ts
- private-transport.ts
- module-api.test.ts
- ledger-sweep.test.ts
- core-block-parsed.ts
- checks.test.ts
- .#open
- mapping.ts
- pg-tx-history-adapter.ts
- height-versioned.property.test.ts
- interfaces/transaction-history-storage.ts
- TransactionHistoryEntry
- ingest-harness.ts
- check-required-tests.ts
- legacy-excluded.test.ts
- ChainArchiveStore
- .value
- worker-storage.test.ts
- node-bridge.ts
- PgChainArchiveStore
- ProcessContexts
- version
- pg
- core-ledger-state.test.ts
- repository
- Design — Sprint 7: Transaction History Storage
- mutation-per-adapter.mjs
- twox.ts
- T
- history.property.test.ts
- 001_chain_archive_core.ts
- pack-install.mjs
- midnight-env — reproducible PREPROD dev environment
- test-processes.test.ts
- child-processes.ts
- parseJsonLossless
- orphan-watcher.mjs
- fresh-instance.mjs
- decodeExtrinsic
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- graph.py
- .getAll
- Storage Algebra Lean Formalization — Approved Design and Status
- ADDED Requirements
- ADDED Requirements
- Requirements
- package.json
- ADDED Requirements
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- stryker.conf.json
- Full-Chain Storage — Design
- UmbraDB module guide
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- ADDED Requirements
- scripts
- devDependencies
- UmbraDB v0.9.5 "Penumbra" — Release Record
- ADDED Requirements
- ROADMAP.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- ADDED Requirements
- Roadmap
- compilerOptions
- README.md
- ADDED Requirements
- ADDED Requirements
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB V1.0.0 Implementation Guideline
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- UmbraDB software supply-chain directory
- UmbraDB third-party component inventory (SBOM)
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- Design — v1.0.0-infosec-signoff
- Design — v1.0.0-perf-baseline
- Spec — `model-checking` capability
- Tasks — v1.1.0: Quint model checking
- Scalability ceilings (v1.0.0)
- scoped-review-manifest
- Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)
- UmbraDB dev environment — master runbook
- 3. Live-node/indexer confirmation
- Sprint 7 — Midnight preprod toolchain inventory & build checklist
- Storage Algebra Lean M3b CheckpointStore C1 Sprint
- ADDED Requirements
- Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery
- Proposal — v1.1.0: Quint model checking (`quint-model-checking`)
- conformance-gate.mjs
- Repository agent policy
- Contributing
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Lean 4 Formalization Plan
- Acceptance criteria — v1.0.0-infosec-signoff
- Tasks — v1.0.0-infosec-signoff
- Our Pledge
- Midnight infra verification checklist
- ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)
- 5. Recommended candidate model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
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
- 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond
- 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost
- 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL
- 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder
- 00023 — The blocks table's height partitions end at 5,000,000
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)
- bug-report.md
- feature-request.md
- Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)
- manifest.json
- 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)
- PULL_REQUEST_CHECKLIST.md
- documentation-improvement.md
- Overview
- transaction-history/tsconfig.json
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
- ADDED Requirements
- Design — Postgres+JSONB storage rebuild

## God Nodes (most connected - your core abstractions)
1. `vitest` - 294 edges
2. `UmbraError` - 234 edges
3. `ModuleDeclaration` - 137 edges
4. `PgTransactionLeaseLayer` - 93 edges
5. `NodeClient` - 91 edges
6. `runMigrations()` - 90 edges
7. `FinalizedLoop` - 89 edges
8. `ValidationError` - 87 edges
9. `PgCheckpointStore` - 87 edges
10. `Database` - 87 edges

## Surprising Connections (you probably didn't know these)
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `Scenario: save on a caller transaction behaves identically to the internal-transaction path for a reader` --references--> `CheckpointSummary`  [INFERRED]
  openspec/changes/v1.0.0-durable-checkpoint-cursor/specs/durable-composition/spec.md → src/interfaces/checkpoint-store.ts
- `Scenario: A history page issues two queries regardless of page size` --references--> `CheckpointSummary`  [INFERRED]
  openspec/changes/v1.0.0-perf-baseline/specs/performance-baseline/spec.md → src/interfaces/checkpoint-store.ts
- `The honest-test pattern (what makes each required test non-vacuous)` --references--> `ChunkMissingError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/checkpoint-store.ts
- `Scenario: A chunk shared across wallets survives one wallet's prune` --references--> `ChunkMissingError`  [INFERRED]
  openspec/changes/sprint-3-checkpoint-store/specs/checkpoint-store/spec.md → src/interfaces/checkpoint-store.ts

## Import Cycles
- None detected.

## Communities (294 total, 26 thin omitted)

### Community 0 - "admin-harness.ts"
Cohesion: 0.02
Nodes (185): adminRoutes, AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminStartOptions, AdminAnswer (+177 more)

### Community 1 - "node/client.test.ts"
Cohesion: 0.02
Nodes (130): NodeClientOptions, NodeRetry, ConnectSocket, NodeSocketEvents, IngestOptions, Answer, Handler, Received (+122 more)

### Community 10 - "loop.test.ts"
Cohesion: 0.03
Nodes (133): GraphInput, PointArguments, PointRun, PastFaultCase, RefusalCase, CallEvent, Contexts, Recorder (+125 more)

### Community 100 - "cold-boot-recovery.integration.test.ts"
Cohesion: 0.19
Nodes (19): PgWalletSdkTransactionHistoryAdapter, phaseA_syncAndPersistEnvelope(), phaseB_freshProcessRestoreAndVerify(), deriveUnshieldedSeed(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), packageDistFile(), buildUnshieldedConfig() (+11 more)

### Community 101 - "digest.test.ts"
Cohesion: 0.13
Nodes (21): ChangeKind, tableChanges, TouchedRow, digestBlock(), changeOf(), concat(), isCheckpointHeight(), nextDigest() (+13 more)

### Community 102 - "core-transport.ts"
Cohesion: 0.10
Nodes (22): InstanceView, Session, TransportLimits, TransportTls, Api, Hello, Read, Report (+14 more)

### Community 103 - "version-checks.ts"
Cohesion: 0.21
Nodes (21): Answers, toHex(), H(), withCore(), blockWith(), expectBadVersionDigestHalts(), expectEveryPackageFileChecked(), expectPinsChecked() (+13 more)

### Community 104 - "api-server.ts"
Cohesion: 0.12
Nodes (22): HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, VersionedResponse, ApiStartup, answerHead(), isVersionHeader() (+14 more)

### Community 105 - "code-registry.ts"
Cohesion: 0.14
Nodes (22): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+14 more)

### Community 106 - "core-block-fetch/metadata.ts"
Cohesion: 0.25
Nodes (16): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, TypeDef, ScaleError, field(), pallet() (+8 more)

### Community 107 - "sweep.ts"
Cohesion: 0.12
Nodes (13): GreyView, SweepPhase, SweepTables, byBytes(), BYTE_ORDER(), hexOf(), merged(), sweepStep() (+5 more)

### Community 108 - "child-processes.test.ts"
Cohesion: 0.11
Nodes (18): Kill, Orphaned, SourceFile, alive(), childrenOf(), commandOf(), expectAllEnd(), nextLine() (+10 more)

### Community 109 - "tx-replay-decoder.ts"
Cohesion: 0.14
Nodes (20): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+12 more)

### Community 11 - "UmbraError"
Cohesion: 0.03
Nodes (90): CommittedHeight, ReadOptions, DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, ProbeSession, ReadTimeoutSetting, MultiStatementRunner (+82 more)

### Community 110 - "ModuleApi"
Cohesion: 0.16
Nodes (9): Connection, ChainDataAnswer, ModuleApi, errorMessage(), encodeJson(), matches(), read(), specificity() (+1 more)

### Community 111 - "transport-faults.test.ts"
Cohesion: 0.12
Nodes (14): ResultColumn, CoreTransportOptions, codeOf(), splitAddress(), startCoreTransport(), describe(), isObject(), parseMessage() (+6 more)

### Community 112 - "postgres/chain-archive-store.ts"
Cohesion: 0.13
Nodes (17): BlobRole, BlockBundle, BlockMeta, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult (+9 more)

### Community 113 - "version-table.ts"
Cohesion: 0.17
Nodes (21): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+13 more)

### Community 114 - "recovery.test.ts"
Cohesion: 0.16
Nodes (17): CommitOutcome, HeldHeight, Outcomes, AlwaysLanded, AlwaysLost, DropsHeld, Fault, committedProblems() (+9 more)

### Community 117 - "transaction-history-storage.property.test.ts"
Cohesion: 0.10
Nodes (17): EntryContent, Command, ReplayableStorage, applyCommand(), replay(), THS_RESERVED_KEY_PREFIX, arbitraryCommand, badKeyValue (+9 more)

### Community 12 - "tape/index.ts"
Cohesion: 0.03
Nodes (96): Refusal, Link, TapeBuilder, TapeBuilderOptions, CompletenessRange, RecordingError, RecordingProblem, TapeError (+88 more)

### Community 123 - "version.negative-control.test.ts"
Cohesion: 0.14
Nodes (10): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, expectUpgradeDecoding(), mnsvOf() (+2 more)

### Community 125 - "referenceMergeEntries"
Cohesion: 0.19
Nodes (12): MergeEntriesFn, facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), midnightWalletRepoRoot(), isPlainObject(), mergeSections() (+4 more)

### Community 127 - "identity.ts"
Cohesion: 0.19
Nodes (16): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+8 more)

### Community 128 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 129 - "3. Proof-blocking findings"
Cohesion: 0.11
Nodes (18): Absent, n(), 1. TemporalKV — event-sourced right action with a CAS guard, 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.3 T3 omits the current event and cannot replay a pruned suffix, 3.4 The time field is not a commit instant (+10 more)

### Community 13 - "config/history.ts"
Cohesion: 0.03
Nodes (127): OpenedFacts, CoreVersion, ConfiguredDatabase, ConfiguredDatabaseOptions, CoreSettings, versionEntry, HistoryCheck, HistoryCode (+119 more)

### Community 137 - "tape/command.ts"
Cohesion: 0.21
Nodes (15): Arguments, Command, boundaries(), check(), parse(), range(), record(), reportedVersion() (+7 more)

### Community 138 - "ws-mutual-tls.test.ts"
Cohesion: 0.17
Nodes (11): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+3 more)

### Community 14 - "config-check.ts"
Cohesion: 0.03
Nodes (111): CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport, ConfigCheckSeams, StepName (+103 more)

### Community 141 - "catalog.ts"
Cohesion: 0.15
Nodes (15): CatalogColumn, CatalogOptions, CatalogFunction, CatalogType, ColumnFacts, DefaultCatalog, DefaultReference, defaultCatalog() (+7 more)

### Community 145 - "postgres/transaction-history-storage.ts"
Cohesion: 0.24
Nodes (14): EntryLifecycle, JsonEncoded, StoredEntryJson, TxHistoryRow, assertStoredEntryShape(), decodeContent(), decodeRow(), decodeSections() (+6 more)

### Community 149 - "chain-archive-rollover.ts"
Cohesion: 0.23
Nodes (13): AnySql, RolloverBucket, RolloverTable, assertDefaultSpanFitsOneBucket(), assertValidBucketBounds(), assertValidPartitionSuffix(), attachedPartitionBound(), getFkConstraintName() (+5 more)

### Community 15 - "ledger-storage.test.ts"
Cohesion: 0.04
Nodes (120): itemsSeen, ingest, Call, SeenLoad, retentionSeen, ledgerScenario, LedgerTx, recordedGenesis (+112 more)

### Community 150 - "attempt"
Cohesion: 0.16
Nodes (13): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+5 more)

### Community 16 - "cursor-durability.crash.test.ts"
Cohesion: 0.02
Nodes (122): JsonValue, KvRow, BatchSpec, CurrentState, InvariantResult, C5AnyFn, CurrentState, CurrentState (+114 more)

### Community 169 - "ApiRoutes"
Cohesion: 0.24
Nodes (6): ApiRoutes, AcceptsDuplicates, parsePath(), shapeOf(), routesOf(), routesOf()

### Community 17 - "NodeClient"
Cohesion: 0.04
Nodes (88): NodeSourceOptions, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+80 more)

### Community 176 - "Heartbeat"
Cohesion: 0.31
Nodes (5): Heartbeat, lastTick(), tickAgeMs(), beat(), HEARTBEAT_INTERVAL_MS

### Community 177 - "childRefKeys"
Cohesion: 0.40
Nodes (3): ChildReader, childRefKeys(), readChildren()

### Community 178 - "component-table.test.ts"
Cohesion: 0.18
Nodes (7): DesignTable, RowCoverage, typeScriptFiles(), OPENERS, ROWS, SUITE, REPOSITORY

### Community 18 - "runMigrations"
Cohesion: 0.02
Nodes (130): UmbraDBConnectionOptions, DurabilityContractError, MigrationLockTimeoutError, exceedsMaxDepth(), runMigrations(), saveAndAdvance(), fill(), tx() (+122 more)

### Community 19 - "postgres/transaction-lease.ts"
Cohesion: 0.03
Nodes (108): Lease, TransactionHandleInvalidError, AggregateRow, ChunkJoinRow, ManifestRow, HeldLease, InjectedReleaseFaultLayer, abortError() (+100 more)

### Community 190 - "postgres-image.test.ts"
Cohesion: 0.24
Nodes (9): RepositoryFile, canPin(), pinViolations(), repositoryFiles(), files, HASH_COMMENTED, RECORDS, ROOT (+1 more)

### Community 197 - "Design — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.22
Nodes (8): Hash, 3. Corrected Lean gates (the ones that change), §1 C2a — GC reachability-safety (`Checkpoint/GC.lean`), §2 L1 — lease mutual exclusion (`Transaction/Lease.lean`), §3 Supporting gates, §4 Refinement register & three statuses, §5 CI faithfulness manifest, Design — v1.0.0: Formal completion (`formal-completion`)

### Community 2 - "src/index.ts"
Cohesion: 0.03
Nodes (191): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointStoreErrorCode, CheckpointSummary, ChunkIntegrityError, ChunkMissingError (+183 more)

### Community 20 - "NodeBlockSource"
Cohesion: 0.04
Nodes (55): BlockEventSource, BodyExtrinsic, ExtrinsicCall, BlockBody, CoreBlockItems, RuntimeMetadataView, HeadWait, NodeBlockSource (+47 more)

### Community 204 - "spawnChild"
Cohesion: 0.25
Nodes (8): LockResult, bystander(), WATCHER, runInChild(), kill(), startLockProcess(), spawnChild, children

### Community 205 - "time-values.test.ts"
Cohesion: 0.22
Nodes (8): Report, inTimeZone(), EXPECTED, REPOSITORY, TIME_ZONES, WORKER, MARKER, RFC-3339

### Community 21 - "ref_node_path"
Cohesion: 0.03
Nodes (91): CoreEntryInput, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin, LedgerSources (+83 more)

### Community 22 - "TransactionHandle"
Cohesion: 0.03
Nodes (95): CheckpointStore, Key, Namespace, Scope, TemporalKV, VersionedEntry, TransactionHandle, Watermarks (+87 more)

### Community 223 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 224 - "child-processes.parent.ts"
Cohesion: 0.29
Nodes (6): ParentJob, child, CHILDREN, exited, job, lines

### Community 23 - "writer-lock-checks.ts"
Cohesion: 0.04
Nodes (74): Held, PgliteLockUse, CheckTarget, CliBackend, Snapshot, WriterProcess, Job, WorkerEvent (+66 more)

### Community 24 - "ReadHandle"
Cohesion: 0.03
Nodes (67): BlockWriteHandle, ReadHandle, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, Migration (+59 more)

### Community 240 - "timeouts/timeouts.test.ts"
Cohesion: 0.33
Nodes (5): ReportedTest, CONFIG, FIXTURE_CONFIG, REPOSITORY, VITEST_CLI

### Community 25 - "FinalizedLoop"
Cohesion: 0.04
Nodes (54): Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointSchedule, FinalizedLoop, HeightRun, Invoke (+46 more)

### Community 26 - "createClient"
Cohesion: 0.04
Nodes (67): DurabilityProbeOptions, DurabilityViolation, DurabilityWarning, Migration, RunMigrationsOptions, Started, FailsOnceStarted, SlowToReportPorts (+59 more)

### Community 27 - "process-admin.ts"
Cohesion: 0.05
Nodes (87): ConfigFacts, OpenedConfig, AllowedDetail, ProcessAdmin, ProcessAdminOptions, RevisionSettings, DigestRow, ModuleFacts (+79 more)

### Community 28 - "adapter-fixtures.ts"
Cohesion: 0.06
Nodes (84): Upstream, contractFixture, Ledger, RawPackage, AdapterSubject, NodeRoot, AdapterWorkerHost, LoadedState (+76 more)

### Community 29 - "adapter.ts"
Cohesion: 0.04
Nodes (74): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+66 more)

### Community 3 - "builds.ts"
Cohesion: 0.02
Nodes (123): AdmittedKey, privateIntake, PrivateIntakeOptions, PublicWakes, Message, PrivateBackend, SessionSeen, TestDatabase (+115 more)

### Community 30 - "runner/process.ts"
Cohesion: 0.03
Nodes (54): AdminStarter, Bound, ChainCheck, ChainCheckInput, ChainSource, CoreChainBinding, NodeWait, WaitingListener (+46 more)

### Community 31 - "node-format.ts"
Cohesion: 0.06
Nodes (55): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+47 more)

### Community 32 - "ledger/types.ts"
Cohesion: 0.06
Nodes (62): LoadLedger, LedgerStateItem, LedgerName, ApplyInput, ApplyOutput, ChainOutcome, LedgerPackageOptions, NodeBatch (+54 more)

### Community 33 - "translatePostgresError"
Cohesion: 0.04
Nodes (65): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, Rollback, ChainArchiveCheckViolationError, ChainArchiveInvariantError, isChainArchiveCheckConstraintName() (+57 more)

### Community 34 - "LedgerPackage"
Cohesion: 0.06
Nodes (33): LedgerEventKind, LedgerPackage, LedgerEngine, hexOf(), idOf(), same(), sameBytes(), run() (+25 more)

### Community 35 - "load-under-prune.integration.test.ts"
Cohesion: 0.03
Nodes (68): Callable, Deferred, LoadInterleaveObserver, SavedCheckpoint, assertValidCheckpointIds(), validateHistoryOptions(), validateSaveOptions(), backdatePastGraceWindow() (+60 more)

### Community 36 - "validate.ts"
Cohesion: 0.05
Nodes (61): HistoryFinding, RedactionForms, SecretForm, TextPattern, ConfigRule, CursorRule, Finding, Issue (+53 more)

### Community 37 - "transform-checks.ts"
Cohesion: 0.08
Nodes (45): Failure, Variant, TransformError, CallRecord, NotifyRecord, recordKind, SubscriptionId, CallSelection (+37 more)

### Community 38 - "real-tapes.ts"
Cohesion: 0.05
Nodes (43): Metadata, Step, FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource (+35 more)

### Community 39 - "harness.ts"
Cohesion: 0.09
Nodes (46): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+38 more)

### Community 4 - "chain-process.test.ts"
Cohesion: 0.03
Nodes (129): InMemoryBlockSource, InMemoryItems, Wait, ProcessHandle, SignalTarget, Job, WorkerEvent, A77Observation (+121 more)

### Community 40 - "PgTransactionHistoryStorage"
Cohesion: 0.05
Nodes (50): TransactionHistoryStorage, PgTransactionHistoryStorage, store(), reason(), 1. Decisive scope, 2. Live-sync conformance test plan, 3. Open questions for the design-drafting stage, 4. Prioritized artifacts (dependency order) (+42 more)

### Community 41 - "roles.ts"
Cohesion: 0.06
Nodes (42): Difference, PlannedSchema, Provision, QualifiedTable, SchemaMigration, SchemaModule, SchemaTable, TestPart (+34 more)

### Community 42 - "ModuleDeclaration"
Cohesion: 0.06
Nodes (35): QueuedBlock, ItemSink, ModuleDeclaration, PointName, GraphFacts, BlockItems, LateUse, FinalityStallCondition (+27 more)

### Community 43 - "vitest"
Cohesion: 0.05
Nodes (24): Lockfile, Manifest, Upstream, Finding, GuardViolation, filesUnder(), patchesOf(), patchText() (+16 more)

### Community 44 - "validation.ts"
Cohesion: 0.05
Nodes (49): coreEntry, DeclarationRule, PlacedDeclaration, Plain, Case, ShapeCase, Stats, entryOf() (+41 more)

### Community 45 - "core-ledger-state.ts"
Cohesion: 0.06
Nodes (46): BlockLedgerSource, CoreLedgerStateOptions, LedgerBinding, retainedStates, CoreRevision, GreyPicker, applyBlock(), boundLedger() (+38 more)

### Community 46 - "db/migrate.test.ts"
Cohesion: 0.05
Nodes (37): SchemaItem, GuardTableRow, RelationFacts, TableName, MigrationRow, PartOptions, TestPart, identityRow() (+29 more)

### Community 47 - "stop-heights.test.ts"
Cohesion: 0.06
Nodes (44): ChainDataView, ProcessingEnd, ProcessStatus, A43Observation, Recorded, RecoveryObservation, CoreStopsFirst, NoRedelivery (+36 more)

### Community 48 - "column-rules.ts"
Cohesion: 0.04
Nodes (56): AllowedRule, Because, DesignRow, PlacedRefusal, Refusal, RefusalCode, RefusalOptions, RefusedRule (+48 more)

### Community 49 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (30): columnVerdict, DefaultPart, keyOrder, TableRule, TreeNode, TypeRule, DesignTable, numericScale() (+22 more)

### Community 5 - "db/migrate.ts"
Cohesion: 0.03
Nodes (125): Transaction, CaptureColumn, CapturedTable, CaptureState, AppliedRow, Runnable, Settling, CheckedMigration (+117 more)

### Community 50 - "12. Ledger"
Cohesion: 0.07
Nodes (31): RetainedState, LedgerTask, LedgerHost, LedgerWorkerFailure, NodeDatabase, Pending, NodeReader, workerParser() (+23 more)

### Community 51 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (37): Run, Job, WorkerEvent, Outcome, openBlockWrites(), commitHeight(), expectNeverCutOffNorHung(), settings() (+29 more)

### Community 53 - "cbor.ts"
Cohesion: 0.08
Nodes (42): CanonicalEncodingError, ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType (+34 more)

### Community 54 - "core-block-commit.test.ts"
Cohesion: 0.07
Nodes (38): BlockHeaderItem, CoreBlockHeader, StandInOptions, Commit, blockHeaderOf(), checkParent(), commitBlock(), hex() (+30 more)

### Community 55 - "core-private-source.ts"
Cohesion: 0.07
Nodes (39): ConfiguredGenesis, PrivateChecks, PublicIdentity, PublicSideOptions, TransportPosition, cursorHeight(), readCursor(), bindCoreBlockFetch() (+31 more)

### Community 56 - "write-handles.test.ts"
Cohesion: 0.06
Nodes (33): StartupInput, BlockWrites, Point, WriteHandleOptions, OffersReadOnly, BlockOpener, writeHandleClosed(), runCallback() (+25 more)

### Community 57 - "graph.ts"
Cohesion: 0.08
Nodes (45): Edge, GraphPart, GraphRule, HeightRange, MidChain, Missing, RangeCheck, RangeFacts (+37 more)

### Community 59 - "checkShape"
Cohesion: 0.07
Nodes (35): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), insert() (+27 more)

### Community 6 - "PgTransactionLeaseLayer"
Cohesion: 0.02
Nodes (116): BenchEnv, TransactionLeaseLayer, PgCheckpointStore, UmbraDBSql, SaveAndAdvanceDeps, PgTemporalKV, PgTransactionLeaseLayer, PgWatermarks (+108 more)

### Community 62 - "core-settings.ts"
Cohesion: 0.06
Nodes (37): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+29 more)

### Community 63 - "cbor.property.test.ts"
Cohesion: 0.08
Nodes (36): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+28 more)

### Community 64 - "api-server.test.ts"
Cohesion: 0.08
Nodes (27): HttpHandler, HttpRoute, AddsExtensions, AddsHeaders, AppendsVersion, Client, VersionsAnswersOnly, names() (+19 more)

### Community 66 - "BlockRef"
Cohesion: 0.09
Nodes (11): Closable, PrivateBlockSource, PublicDatabase, BlockRef, InMemorySourceOptions, Fetching, Recorder, LateRedelivery (+3 more)

### Community 67 - "boundary.test.ts"
Cohesion: 0.13
Nodes (34): ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode(), copiedTexts(), redeclared() (+26 more)

### Community 68 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 7 - "declaration.ts"
Cohesion: 0.03
Nodes (133): Database, ReadOnlyDatabase, SchemaWriteHandle, MigrationPart, OwnPart, SchemaPlan, TableFacts, ApiRegistry (+125 more)

### Community 70 - "crash-worker.ts"
Cohesion: 0.11
Nodes (24): WatermarkKey, WatermarkKind, WatermarkValue, SaveAndAdvanceCursor, WatermarkRow, CoTxCallable, CoTxPauseInfo, CrashHook (+16 more)

### Community 72 - "messages.ts"
Cohesion: 0.07
Nodes (29): ApiResult, Committed, MessageFault, MessageType, Parsed, bytesOf(), decodeParameter(), decodeValue() (+21 more)

### Community 75 - "pglite-server.ts"
Cohesion: 0.10
Nodes (21): LoadOutcome, OutsideRead, Traced, Opened, PgliteTestDatabase, PgliteTestServer, Job, openPgliteOn() (+13 more)

### Community 77 - "private-transport.ts"
Cohesion: 0.12
Nodes (15): PublicSide, HelloAck, JsonValue, ReadResult, Pending, PrivateTransport, TransportState, hexOf() (+7 more)

### Community 78 - "module-api.test.ts"
Cohesion: 0.08
Nodes (23): ApiError, ApiErrorCode, ApiRequest, ApiResponse, HttpMethod, ModuleRegistration, PathSegment, Registration (+15 more)

### Community 79 - "ledger-sweep.test.ts"
Cohesion: 0.13
Nodes (15): SweepState, SweepWrites, Block, MemoryTables, ModelBatch, ModelSnapshot, SweepModel, sweepReset() (+7 more)

### Community 8 - "core-block-parsed.ts"
Cohesion: 0.03
Nodes (145): MetadataVariant, BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent, EventPhase (+137 more)

### Community 80 - "checks.test.ts"
Cohesion: 0.09
Nodes (22): CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, Case, checkFunctionsSql(), integerCheckName() (+14 more)

### Community 81 - ".#open"
Cohesion: 0.15
Nodes (5): CoreTransport, StartedModuleApi, Process, messageOf(), pause()

### Community 82 - "mapping.ts"
Cohesion: 0.12
Nodes (27): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+19 more)

### Community 83 - "pg-tx-history-adapter.ts"
Cohesion: 0.11
Nodes (22): LifecycleDetailStore, TestEntry, TestSection, assertNoReservedAdapterKeys(), describeStatusValue(), mapSdkStatusToUmbra(), mapUmbraStatusToSdk(), parseLifecycleDetailStore() (+14 more)

### Community 87 - "height-versioned.property.test.ts"
Cohesion: 0.13
Nodes (20): VersionedValue, StoredVersion, Block, BlockFails, Counts, Effect, Key, Model (+12 more)

### Community 88 - "interfaces/transaction-history-storage.ts"
Cohesion: 0.08
Nodes (21): EntryLifecycleStatus, FinalizedLifecycle, PendingLifecycle, RejectedLifecycle, TransactionHistoryReader, TransactionHistoryStatus, TransactionHistoryWriter, EntryContentSchema (+13 more)

### Community 89 - "TransactionHistoryEntry"
Cohesion: 0.13
Nodes (8): TransactionHistoryEntry, InMemoryTransactionHistoryStorage, capitalize(), rowToEntry(), abortErrorLike(), capitalize(), Requirement: the Pg-backed and in-memory reference are sequentially equivalent for single-writer traces, Scenario: An identical sequential fixture produces identical getAll() output on both backends

### Community 9 - "ingest-harness.ts"
Cohesion: 0.03
Nodes (130): NodeCallOptions, ProcessCondition, Scenario, RecordingClient, ArgType, BlockOptions, CallSpec, chainBlock (+122 more)

### Community 90 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 91 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 92 - "ChainArchiveStore"
Cohesion: 0.08
Nodes (13): ChainArchiveStore, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 6. Known limitations, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage (+5 more)

### Community 94 - ".value"
Cohesion: 0.19
Nodes (10): MetadataType, Primitive, ScaleReader, ValueReader, blockTimeOf(), isCompactU64(), bytesArgument(), decodeChainEvents() (+2 more)

### Community 95 - "worker-storage.test.ts"
Cohesion: 0.10
Nodes (20): SlowStep, TestLoaderData, Nodes, loadLedgerPackage(), createV8Adapter(), createV9Adapter(), countDeserializations(), hexOf() (+12 more)

### Community 96 - "node-bridge.ts"
Cohesion: 0.12
Nodes (19): NodeStore, EngineOptions, BridgeServer, bridgeStore, Growable, bridgeMemory(), decodeNodes(), encodedSize() (+11 more)

### Community 97 - "PgChainArchiveStore"
Cohesion: 0.19
Nodes (10): BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, PgChainArchiveStore, assertHex32(), hexToBuf() (+2 more)

### Community 98 - "ProcessContexts"
Cohesion: 0.12
Nodes (5): ProcessContexts, ProcessItems, providesProcessItem(), startChain(), sealed()

### Community 52 - "version"
Cohesion: 0.04
Nodes (48): version(), 0. Package layout, 1. Chunking, 2.1 `ckpt_manifest_chunks` needs an explicit position, 2.2 `seq` needs an explicit allocator, 2.3 `complete`: kept, and explicitly written `true` by every `save()`, 2. Schema — two corrections to `design/design.md` §3, 6. Migration (`002_checkpoint_store.ts`) (+40 more)

### Community 115 - "pg"
Cohesion: 0.10
Nodes (17): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 1. Postgres-side profiling (+9 more)

### Community 140 - "core-ledger-state.test.ts"
Cohesion: 0.13
Nodes (9): bindLedgerParser(), boundLedgerParser(), bindCoreLedgerState(), itemsOf(), writeBlock(), bound(), CORE_LEDGER_STATE_MIGRATIONS, NODES_PER_STATEMENT (+1 more)

### Community 143 - "repository"
Cohesion: 0.14
Nodes (15): repository(), 3. Rulings recorded for this release, 1. What SLSA v1.0 defines, 2. UmbraDB's current posture, 3. Target and gap analysis, Build track — **current estimate: L0–L1**, Build track levels, How npm `--provenance` maps to SLSA (+7 more)

### Community 144 - "Design — Sprint 7: Transaction History Storage"
Cohesion: 0.13
Nodes (13): `transaction_history`, 1. Schema, 2. Dependency direction: structural mirror, not a runtime import, 3. Atomic merge under concurrent writers, 4. Multi-wallet identity, 5. WalletState envelope, 6. Open questions carried into this sprint (unresolved, tracked here rather than silently defaulted), 7. What "live-sync" means for this sprint's non-required test tier (+5 more)

### Community 147 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 156 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 158 - "T"
Cohesion: 0.19
Nodes (12): T(), input(), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Scenario: getAt matches an independent replay for an arbitrary put sequence, Requirement: T is a caller assertion — no runtime validation beyond the erased WatermarkValue shape, Scenario: Reading with a mismatched T returns the stored value, not a runtime error, 6.1 — P3 is the differential gate's replay-equivalence / fold anchor (documentation, no new test code), Gate notes — Task 6: differential state-equivalence gate (G11) (+4 more)

### Community 170 - "history.property.test.ts"
Cohesion: 0.24
Nodes (9): changesWithValues(), hex(), orderIndependent(), places(), reordered(), replaced(), dataFields, key (+1 more)

### Community 174 - "001_chain_archive_core.ts"
Cohesion: 0.24
Nodes (9): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, Revision history, v2 — 2026-07-22, revised in response to a 3-reviewer design-council audit (Fable 5 / Opus / GPT-5.6 Sol), v3 — 2026-07-22, revised in response to a round-2 3-reviewer design-council re-audit (Fable 5 / Opus / GPT-5.6 Sol) (+1 more)

### Community 179 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 198 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.25
Nodes (8): locked(), 1. Reproducibility contract — what is pinned, and how, 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS), Why `nix develop -c bash scripts/start-stack.sh` and not `nix run .#start-stack`

### Community 203 - "test-processes.test.ts"
Cohesion: 0.28
Nodes (7): namesRunner(), runnerStarts(), sources(), valueNames(), REPOSITORY, RUNNER, TESTS

### Community 222 - "child-processes.ts"
Cohesion: 0.38
Nodes (5): guardContainers(), guardPid(), watcherInput(), containerFilters, WATCHER

### Community 228 - "parseJsonLossless"
Cohesion: 0.40
Nodes (5): parseJsonLossless(), 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug, Evidence, Problem, Suggested fix

### Community 239 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 262 - "fresh-instance.mjs"
Cohesion: 0.50
Nodes (4): hex(), requested, store, stored

### Community 271 - "decodeExtrinsic"
Cohesion: 0.50
Nodes (3): callOf(), callVariants(), decodeExtrinsic()

### Community 58 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.04
Nodes (43): 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest, 2. Database API (+35 more)

### Community 69 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 93 - ".getAll"
Cohesion: 0.08
Nodes (26): Requirement: getAll returns live bigint/Date-typed values, not JSON-stringified primitives, Scenario: A bigint field survives the Postgres round-trip as a real bigint, Scenario: A Date field survives the Postgres round-trip as a real Date instance, ADDED Requirements, Requirement: a cold boot resumes without a full resync and preserves tx-history continuity, Requirement: a live-synced transaction materializes as a Postgres row observable via getAll, Requirement: each sub-wallet resumes from its own last-known point; the envelope bundles for atomicity only, Requirement: encode and decode are lossless inverses (+18 more)

### Community 116 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.10
Nodes (21): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 13. Approved implementation decisions, 1. Executive conclusion, 2.1 Historical implementation baseline (+13 more)

### Community 118 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 119 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: a non-object JSON value round-trips correctly, Requirement: an already-aborted opts.signal rejects before any statement; a later abort has no effect, Requirement: get never throws for an unset cursor, Requirement: get returns exactly the last value set, scoped per (kind, key), Requirement: set is an idempotent, unconditional overwrite (Law W1), Requirement: set rejects an invalid value with ValidationError before any statement, Scenario: A bare numeric watermark value round-trips exactly (+12 more)

### Community 120 - "Requirements"
Cohesion: 0.10
Nodes (20): Purpose, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Schema isolation is the default, not opt-in, Requirement: Unconditional writes are gapless and monotonic (Law T1), Requirements (+12 more)

### Community 121 - "package.json"
Cohesion: 0.10
Nodes (20): bin, umbradb, description, exports, files, homepage, license, main (+12 more)

### Community 122 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered, Requirement: Schema isolation is the default, not opt-in, Requirement: Unconditional writes are gapless and monotonic (Law T1), Scenario: A custom schema is honored end to end (+11 more)

### Community 124 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 126 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 130 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 131 - "Full-Chain Storage — Design"
Cohesion: 0.12
Nodes (16): 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle, 2. Source grounding, 4.1 `chain_blobs` / `chain_blob_roles` — content-addressed blob store (unchanged decision: new sibling table, NOT an in-place extension of `ckpt_chunks`), 4.2 `blocks` — the block tree, not just the canonical chain, 4.3 `transactions` — metadata only, raw bytes via blob reference, 4.4 `bridge_observations` — NEW build-now table (reclassified from "defer") (+8 more)

### Community 132 - "UmbraDB module guide"
Cohesion: 0.12
Nodes (16): Blocks from the node, Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Private modules, Reading through `db`, Running a module with the `umbradb` command (+8 more)

### Community 133 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (16): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+8 more)

### Community 134 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 135 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 139 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 142 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.13
Nodes (13): 1. The twenty gate items, 2. Tag preconditions R1–R12, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`), Track D — Performance baseline (`openspec/changes/v1.0.0-perf-baseline`, merged `855fb22`) (+5 more)

### Community 146 - "ADDED Requirements"
Cohesion: 0.13
Nodes (14): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-3 States and conditions, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception (+6 more)

### Community 148 - "ROADMAP.md"
Cohesion: 0.14
Nodes (9): For historical reference only, Tasks — superseded by per-sprint openspec changes, Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity (+1 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 152 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 153 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-2 Retired parts are gone, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export (+5 more)

### Community 154 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 155 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 157 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 159 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 160 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: concurrent writers merging the same tx hash never lose a section, Requirement: identifier-subset pending-clear rule survives repeated merges, Requirement: serialize() is a full synchronous-equivalent dump matching the fixed interface contract, Requirement: the merge function is caller-supplied and never a wallet-SDK runtime import, Scenario: A bare upsert without a row lock is insufficient (negative control, implementation note), Scenario: A pending entry clears against a finalized entry whose identifiers grew via two prior merges, Scenario: A pending entry does not clear when its identifiers are not a subset (+4 more)

### Community 161 - "Roadmap"
Cohesion: 0.15
Nodes (13): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+5 more)

### Community 163 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 164 - "README.md"
Cohesion: 0.30
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 165 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 166 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer, Scenario: A delayed answer, Scenario: A malformed line (+3 more)

### Community 167 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.17
Nodes (11): 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED), 4. Multi-key TemporalKV lift — FRAMING ONLY (DEFERRED), 5. Ordered chunk reconstruction (DEFERRED), 6. C1 collision hygiene (release-blocking rider), 7. Transaction-envelope composition (DEFERRED), 8. Watermark cursor-vs-data ordering (DEFERRED) (+3 more)

### Community 168 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 171 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 172 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 173 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 175 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.18
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 180 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 181 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 182 - "UmbraDB software supply-chain directory"
Cohesion: 0.20
Nodes (7): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists

### Community 183 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.20
Nodes (10): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies, 9. Vendored ledger WASM builds (`vendor/ledger/`) (+2 more)

### Community 184 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.20
Nodes (9): 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence), 7. Effort & sequencing (consistent DAG), 8. Binding constraints (verified accurate) (+1 more)

### Community 185 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

### Community 186 - "Design — v1.0.0-perf-baseline"
Cohesion: 0.20
Nodes (9): 0. Package layout, 1. HP-1 — `save()` `UNNEST` batching (G13), 2. HP-2 + IS-2 — `history()` single `GROUP BY` over a stored `size_bytes` (G13), 3. IS-1 — `kv_current fillfactor=90` (G13), 5. G14 — the GC anti-join measurement + recorded baseline, 6. G14 — documented scalability ceilings (SC-1..SC-6), 7. Boundaries and non-goals respected, Audit resolution (+1 more)

### Community 187 - "Spec — `model-checking` capability"
Cohesion: 0.20
Nodes (9): 1. Scope and honesty, 2. Faithfulness to the algebra, 3. C2a — GC reachability safety, 4. C2b — eventual collection (liveness), 5. L1 — lease mutual exclusion, 6. T1 cross-writer, 7. CI integration, 8. Documentation (+1 more)

### Community 188 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.20
Nodes (9): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, 7. Model-based conformance (the refinement bridge) (+1 more)

### Community 189 - "Scalability ceilings (v1.0.0)"
Cohesion: 0.20
Nodes (9): Environment pinning (for reproduction), Regression gating posture, SC-1 — `kv_history` unbounded growth, SC-2 — `ckpt_chunks` GC cost is O(live chunks), full anti-join per pass, SC-3 — `load()` single-buffer materialization, SC-4 — single global writer lease serializes writers, SC-5 — TransactionHistory GIN `fastupdate` p99 spikes, SC-6 — TOAST storage mode on `ckpt_chunks.data` (+1 more)

### Community 191 - "scoped-review-manifest"
Cohesion: 0.22
Nodes (8): Cleanup, scoped-review-manifest, Step 0 — Skip check, Step 1 — Freshness gate, Step 2 — Changed-file seed set, Step 3 — Blast-radius computation, Step 4 — Write the manifest, Step 5 — Hand off

### Community 192 - "Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)"
Cohesion: 0.22
Nodes (8): 1. Driver — why this is now mandatory, 2. What the Cardano side does (and does not) provide, 3. Feasibility — demonstrated, 4. Security postures, 5. Folding into `nix/midnight-env`, 6. Risks / open items, 7. Verdict, Feasibility: TLS for the Cardano db-sync database (Midnight partner-chain follower)

### Community 193 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 194 - "3. Live-node/indexer confirmation"
Cohesion: 0.22
Nodes (9): 3.1 Block header, 3.2 Raw transaction blob (opaque SCALE-wrapped ledger tx), 3.3 Transactions / regular_transactions (queryable metadata split), 3.4 Unshielded UTXOs, 3.5 Dust generation + ledger events (generic), 3.6 Contract state/actions — confirmed absent, not confirmed present, 3.7 Governance / bridge, 3.8 SPO/staking (+1 more)

### Community 195 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 196 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 199 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 200 - "Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery"
Cohesion: 0.22
Nodes (8): 4. Live preprod DB-sync verification (nightly/labeled), 5. Cold-boot recovery, and the cross-sub-wallet consistency contract, 6. Relationship to the future verifiable-snapshot-recovery feature, 7.2 Live preprod DB-sync (nightly/labeled) — `test:live`, 7.3 Cold-boot recovery (nightly/labeled) — `test:live`, 7.4 Required-gate vs nightly split (binding), 7. Testing strategy (post-implementation), Design — Sprint 8: WalletState Envelope + Live Preprod DB-Sync + Cold-Boot Recovery

### Community 201 - "Proposal — v1.1.0: Quint model checking (`quint-model-checking`)"
Cohesion: 0.22
Nodes (8): Binding constraints, Dependencies, Proposal — v1.1.0: Quint model checking (`quint-model-checking`), Tooling, What changes, What this does NOT claim, Why Quint specifically, Why: three laws are unproved, and it is not a coincidence which three

### Community 202 - "conformance-gate.mjs"
Cohesion: 0.22
Nodes (8): check, checker, env, forwarded, repoRoot, reportPath, vitest, vitestCli

### Community 206 - "Repository agent policy"
Cohesion: 0.25
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 207 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 208 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 209 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 210 - "Lean 4 Formalization Plan"
Cohesion: 0.25
Nodes (7): Harder / genuinely novel — no existing precedent to lean on, Lean 4 Formalization Plan, Moderate effort, Near-term tractable — start here, Per-property guidance, Process note, Scope decision: abstract model first, implementation trusted-but-unverified

### Community 211 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 212 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 213 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 214 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 215 - "ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)"
Cohesion: 0.29
Nodes (6): 1. Executive verdict, 2. Ranked root causes, evidence, and council challenges resolved, 3. THE recommended action, 4. Decisive validation experiment, 5. Residual risk and confidence, ASSESSMENT — `midnight-node-archive` Peer Flapping (Midnight Preprod, WSL2 Docker Host)

### Community 216 - "5. Recommended candidate model"
Cohesion: 0.29
Nodes (7): 5.1 Layer A: per-key temporal history, 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 217 - "Design — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.29
Nodes (6): 1. Executable carrier, 2. Commands and interpretation, 3. Laws, 4. Trust and reachability, 5. Refinement boundary, Design — Sprint 5: Lean M3a Watermarks W1

### Community 218 - "Design — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.29
Nodes (6): 1. Finite identity projection, 2. Finite byte-bearing maps, 3. Collision premise bridge, 4. Laws and trust boundary, 5. Refinement boundary, Design — Sprint 6: Lean M3b CheckpointStore C1

### Community 219 - "Acceptance — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Acceptance — v1.0.0: Formal completion (`formal-completion`), Change-level exit (Option B) / checklist-close (Option A), Definition-of-done for a gate to CLOSE, Non-goals, Normative release-law manifest (single source of truth), The forced decision (must be recorded before this change closes)

### Community 220 - "Proposal — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.29
Nodes (6): Binding constraints, Dependencies & critical path, Governance framing (read first), Proposal — v1.0.0: Formal completion (`formal-completion`), What changes, Why

### Community 225 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 226 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 227 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 229 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 230 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 231 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 232 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 233 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 234 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 235 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 236 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 237 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 241 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 242 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

### Community 243 - "00001 — `graph.yml` cites a CLAUDE.md section that no longer exists"
Cohesion: 0.40
Nodes (4): 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists, Evidence, Problem, Suggested fix

### Community 244 - "00002 — Most OpenSpec proposals carry a stale or non-standard status line"
Cohesion: 0.40
Nodes (4): 00002 — Most OpenSpec proposals carry a stale or non-standard status line, Evidence, Problem, Suggested fix

### Community 245 - "00003 — The `v1.1.0-formal-completion` headings say "v1.0.0""
Cohesion: 0.40
Nodes (4): 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0", Evidence, Problem, Suggested fix

### Community 246 - "00005 — The supply-chain inventory's npm graph figures and dev table are stale"
Cohesion: 0.40
Nodes (4): 00005 — The supply-chain inventory's npm graph figures and dev table are stale, Evidence, Problem, Suggested fix

### Community 247 - "00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag"
Cohesion: 0.40
Nodes (4): 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag, Evidence, Problem, Suggested fix

### Community 248 - "00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond"
Cohesion: 0.40
Nodes (4): 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond, Evidence, Problem, Suggested fix

### Community 249 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 250 - "00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL"
Cohesion: 0.40
Nodes (4): 00013 — A nondeterministic collation compares differently on PGlite and on PostgreSQL, Evidence, Problem, Suggested fix

### Community 251 - "00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder"
Cohesion: 0.40
Nodes (4): 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder, Evidence, Resolution, Suggested fix

### Community 252 - "00023 — The blocks table's height partitions end at 5,000,000"
Cohesion: 0.40
Nodes (4): 00023 — The blocks table's height partitions end at 5,000,000, Evidence, Problem, Suggested fix

### Community 253 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 254 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 255 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 256 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 257 - "Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2)"
Cohesion: 0.40
Nodes (4): Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts

### Community 258 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 259 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 260 - "Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)"
Cohesion: 0.40
Nodes (4): Impact, Non-goals (what this change does NOT cover), Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`), Why

### Community 263 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 264 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 265 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 266 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 267 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 268 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 269 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 270 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 274 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 60 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 61 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 65 - "ADDED Requirements"
Cohesion: 0.05
Nodes (38): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+30 more)

### Community 71 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 73 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.06
Nodes (33): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint, Requirement: G9/T2 — the save retry-duplication contract is verified in its 1.0.0 (documented-unsafe) form (+25 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 85 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB, Requirement: PP-13 A private module may require public table items, Requirement: PP-1 Processes and databases, Requirement: PP-2 A private database is bound to one public database, Requirement: PP-3 Private processes take blocks from the public database (+20 more)

### Community 86 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

### Community 99 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.08
Nodes (19): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+11 more)

## Knowledge Gaps
- **51 isolated node(s):** `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-8949`, `RFC-6455` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3323 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `admin-harness.ts`, `node/client.test.ts`, `src/index.ts`, `builds.ts`, `chain-process.test.ts`, `db/migrate.ts`, `PgTransactionLeaseLayer`, `declaration.ts`, `core-block-parsed.ts`, `ingest-harness.ts`, `loop.test.ts`, `UmbraError`, `tape/index.ts`, `config/history.ts`, `config-check.ts`, `ledger-storage.test.ts`, `cursor-durability.crash.test.ts`, `NodeClient`, `postgres/transaction-lease.ts`, `NodeBlockSource`, `ref_node_path`, `writer-lock-checks.ts`, `ReadHandle`, `createClient`, `process-admin.ts`, `adapter-fixtures.ts`, `adapter.ts`, `runner/process.ts`, `node-format.ts`, `ledger/types.ts`, `translatePostgresError`, `load-under-prune.integration.test.ts`, `validate.ts`, `transform-checks.ts`, `real-tapes.ts`, `roles.ts`, `ModuleDeclaration`, `validation.ts`, `core-ledger-state.ts`, `db/migrate.test.ts`, `stop-heights.test.ts`, `column-rules.test.ts`, `12. Ledger`, `zero-timeouts-checks.ts`, `core-block-commit.test.ts`, `write-handles.test.ts`, `core-settings.ts`, `cbor.property.test.ts`, `api-server.test.ts`, `boundary.test.ts`, `networks.ts`, `crash-worker.ts`, `messages.ts`, `pglite-server.ts`, `module-api.test.ts`, `ledger-sweep.test.ts`, `checks.test.ts`, `pg-tx-history-adapter.ts`, `height-versioned.property.test.ts`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `worker-storage.test.ts`, `node-bridge.ts`, `cold-boot-recovery.integration.test.ts`, `digest.test.ts`, `version-checks.ts`, `code-registry.ts`, `child-processes.test.ts`, `transport-faults.test.ts`, `recovery.test.ts`, `transaction-history-storage.property.test.ts`, `package.json`, `version.negative-control.test.ts`, `referenceMergeEntries`, `identity.ts`, `ws-mutual-tls.test.ts`, `core-ledger-state.test.ts`, `mutation-per-adapter.mjs`, `twox.ts`, `excluded-not-exported.test.ts`, `history.property.test.ts`, `Heartbeat`, `component-table.test.ts`, `postgres-image.test.ts`, `test-processes.test.ts`, `spawnChild`, `time-values.test.ts`, `timeouts/timeouts.test.ts`?**
  _High betweenness centrality (0.339) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-3339`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-harness.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.021645021645021644 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `admin-harness.ts`, `node/client.test.ts`, `builds.ts`, `chain-process.test.ts`, `db/migrate.ts`, `UmbraDB module guide`, `declaration.ts`, `ingest-harness.ts`, `loop.test.ts`, `core-ledger-state.test.ts`, `config/history.ts`, `config-check.ts`, `tape/index.ts`, `NodeClient`, `NodeBlockSource`, `ref_node_path`, `writer-lock-checks.ts`, `ReadHandle`, `FinalizedLoop`, `process-admin.ts`, `runner/process.ts`, `validate.ts`, `transform-checks.ts`, `roles.ts`, `ApiRoutes`, `ModuleDeclaration`, `validation.ts`, `core-ledger-state.ts`, `db/migrate.test.ts`, `stop-heights.test.ts`, `12. Ledger`, `zero-timeouts-checks.ts`, `cbor.ts`, `core-block-commit.test.ts`, `core-private-source.ts`, `write-handles.test.ts`, `graph.ts`, `checkShape`, `api-server.test.ts`, `BlockRef`, `private-transport.ts`, `module-api.test.ts`, `checks.test.ts`, `mapping.ts`, `ProcessContexts`, `core-transport.ts`, `version-checks.ts`, `transport-faults.test.ts`, `version-table.ts`, `identity.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `node/client.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017873012738224548 - nodes in this community are weakly interconnected._