# Graph Report - UmbraDB

## Corpus Check
- 918 files · ~1,426,680 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 67 file(s) not represented in the graph (top: .lean 25, (none) 13, .jsonl 11)

## Summary
- 9916 nodes · 29389 edges · 255 communities (231 shown, 24 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 3337 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Corpus fingerprint: `285d5f2793894d04` (918 tracked files, graphify 0.9.89, Python 3.12, post-process v2)
- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.
- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).

## Community Hubs (Navigation)
- PgTransactionLeaseLayer
- UmbraError
- node/client.test.ts
- version-table.ts
- pglite-writer.worker.ts
- postgres/chain-archive-store.ts
- Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)
- loop.test.ts
- commit-proxy.ts
- pglite-outside-reads.ts
- core-block-fetch/metadata.ts
- identity.ts
- tx-replay-decoder.ts
- FakeNode
- createClient
- checkShape
- readRuntimeMetadata
- holds
- attempt
- cursor-table.property.test.ts
- postgres/transaction-history-storage.ts
- ws-mutual-tls.test.ts
- chain-events-source.test.ts
- read-height.property.test.ts
- api-server.test.ts
- Session
- no-indexer-or-wallet-sdk.test.ts
- FinalizedLoop
- admin-harness.ts
- ProcessItems
- builder.test.ts
- type-check.ts
- NodeClient
- vitest
- n
- mutation-evidence.d.mts
- src/index.ts
- TransactionHandle
- ledger-state.test.ts
- core-transport.ts
- exitWithin
- process-admin.ts
- NodeBlockSource
- declaration.ts
- postgres/transaction-lease.ts
- config-check.ts
- config/history.ts
- adapter.ts
- core-block-parsed.ts
- column-rules.ts
- node-format.ts
- validate.ts
- graph.ts
- ledger-sweep.test.ts
- core-config.test.ts
- LedgerPackage
- core-block-commit.test.ts
- core-ledger-state.ts
- runner/process.ts
- builds.ts
- ledger/types.ts
- writer-lock-checks.ts
- postgres.ts
- entries.ts
- ValidationError
- spawnChild
- column-rules.test.ts
- mapping.ts
- PgTransactionHistoryStorage
- column-refusals.test.ts
- zero-timeouts-checks.ts
- private/backends.ts
- boundary.test.ts
- BlockRef
- cbor.ts
- module-tables.ts
- serve.test.ts
- pglite.ts
- slow-block-harness.ts
- tape/index.ts
- database-fixtures.ts
- changes.property.test.ts
- real-tapes.ts
- version-checks.ts
- public-database.ts
- core-settings.ts
- networks.ts
- postgres/checkpoint-store.ts
- change-capture.ts
- validation.ts
- core-private-source.test.ts
- cbor.property.test.ts
- post-block-update.negative-control.test.ts
- chain-process.test.ts
- startLedgerWorker
- Tasks — v1.0.0: Formal completion (`formal-completion`)
- 12. Ledger
- binding.test.ts
- ledger-storage.test.ts
- PgChainArchiveStore
- check-required-tests.ts
- legacy-excluded.test.ts
- .value
- module-rules.ts
- code-registry.ts
- ChainArchiveStore
- pg
- Acceptance — CORE-ARCH: the standalone indexer's core architecture
- .boolean
- mutation-per-adapter.mjs
- fault
- .restore
- twox.ts
- repository
- facade-merge-loader.ts
- pack-install.mjs
- midnight-env — reproducible PREPROD dev environment
- Full-Chain Storage
- schemaName
- orphan-watcher.mjs
- Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data
- T
- digests.test.ts
- graph.py
- Full-Chain Storage — Design
- hello
- ledger-checks.ts
- config
- ADDED Requirements
- Storage Algebra Lean Formalization — Approved Design and Status
- Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)
- ADDED Requirements
- stryker.conf.json
- ADDED Requirements
- scripts
- UmbraDB V1.0.0 — Lessons-Learned Living Log
- devDependencies
- UmbraDB software supply-chain directory
- ADDED Requirements
- ADDED Requirements
- REMOVED Requirements
- UmbraDB
- Roadmap
- README.md
- Storage Algebra Lean M2 Retention Sprint
- ADDED Requirements
- compilerOptions
- ROADMAP.md
- ADDED Requirements
- ADDED Requirements
- Design — v1.1.0: Quint model checking
- devnet.sh
- compilerOptions
- openspec-explore/SKILL.md
- UmbraDB v0.9.5 "Penumbra" — Release Record
- UmbraDB third-party component inventory (SBOM)
- UmbraDB V1.0.0 Implementation Guideline
- explore.md
- UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)
- 3. Proof-blocking findings
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
- Tasks — v1.1.0: Quint model checking
- Contributing
- G12 / R5 — manual pre-tag Preprod round-trip evidence
- Storage Algebra Lean M3a Watermarks Sprint
- Roadmap for the missing formalization
- Acceptance criteria — v1.0.0-infosec-signoff
- Repository agent policy
- Our Pledge
- Midnight infra verification checklist
- Security policy & threat model
- Design — Sprint 5: Lean M3a Watermarks W1
- Design — Sprint 6: Lean M3b CheckpointStore C1
- Acceptance — v1.0.0: Formal completion (`formal-completion`)
- Proposal — v1.0.0: Formal completion (`formal-completion`)
- [0.9.5] - 2026-07-25 — "Penumbra"
- Preprod connection — endpoints, wallet, faucet
- 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows
- 00012 — A user module may be named `core`, the id of the `core` configuration entry
- 00022 — The tape `record` command's process test leaves its child running when the test process is gone
- 5. Recommended candidate model
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
- 00024 — The module API listener closes a refused request's connection before its client has sent the body
- 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket
- 00026 — A configuration's `core` revisions may name different networks
- 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code
- bug-report.md
- feature-request.md
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
- Requirement: set is an idempotent, unconditional overwrite (Law W1)
- graphify/run.sh
- build-in-container.sh
- backup-state.sh
- enable-db-sync-tls.sh
- restore-state.sh
- stop-stack.sh
- generate-test-wallet.sh
- oracle/run.sh
- v8/build.sh
- v9/build.sh
- vendor-ledger.sh
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- main.rs
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- package.json
- Design — Postgres+JSONB storage rebuild
- ADDED Requirements

## God Nodes (most connected - your core abstractions)
1. `vitest` - 299 edges
2. `UmbraError` - 238 edges
3. `ModuleDeclaration` - 143 edges
4. `FinalizedLoop` - 104 edges
5. `PgTransactionLeaseLayer` - 93 edges
6. `NodeClient` - 91 edges
7. `runMigrations()` - 90 edges
8. `InMemoryBlockSource` - 88 edges
9. `PgCheckpointStore` - 87 edges
10. `Database` - 87 edges

## Surprising Connections (you probably didn't know these)
- `The ledger state` --references--> `UmbraError`  [INFERRED]
  docs/module-guide.md → src/deterministic-postgresql/errors.ts
- `3.1 Field mapping (write path)` --references--> `TransactionHistoryEntry`  [INFERRED]
  openspec/changes/sprint-8-wallet-envelope-live-sync/design.md → legacy/transaction-history/src/interfaces/transaction-history-storage.ts
- `Rework (class 1 — infra)` --references--> `ConnectionError`  [INFERRED]
  AUTONOMOUS_RUN_LOG.md → src/interfaces/storage-errors.ts
- `2. Postgres-kill mid-save + retry-duplication contract (G9 / 02-T2)` --references--> `ConnectionError`  [INFERRED]
  openspec/changes/v1.0.0-recovery-testing/tasks.md → src/interfaces/storage-errors.ts
- `3. PgTransactionHistoryStorage implementation` --references--> `StorageError`  [INFERRED]
  openspec/changes/sprint-7-transaction-history-storage/tasks.md → src/interfaces/storage-errors.ts

## Import Cycles
- None detected.

## Communities (255 total, 24 thin omitted)

### Community 0 - "PgTransactionLeaseLayer"
Cohesion: 0.01
Nodes (239): BenchEnv, JsonValue, PgCheckpointStore, UmbraDBSql, KvRow, PgTransactionLeaseLayer, PgWatermarks, WatermarkRow (+231 more)

### Community 1 - "UmbraError"
Cohesion: 0.02
Nodes (192): BlockWriteHandle, Database, ReadOptions, SchemaWriteHandle, Transaction, ReadTimeoutSetting, AppliedRow, MigrationPart (+184 more)

### Community 10 - "node/client.test.ts"
Cohesion: 0.02
Nodes (118): NodeClientOptions, NodeRetry, ConnectSocket, NodeSocketEvents, IngestOptions, Answer, Handler, Received (+110 more)

### Community 100 - "version-table.ts"
Cohesion: 0.16
Nodes (22): ConfiguredLedgerTable, LedgerPin, LedgerSelection, LedgerTableIssue, VersionedBlock, blockNamed(), checkPins(), covers() (+14 more)

### Community 102 - "pglite-writer.worker.ts"
Cohesion: 0.18
Nodes (16): Held, Job, acquirePgliteLock(), lockHeld(), openFailed(), pgliteLockFile(), cursor(), main() (+8 more)

### Community 107 - "postgres/chain-archive-store.ts"
Cohesion: 0.14
Nodes (15): BlobRole, BlockBundle, BlockMeta, BlockStatus, BridgeObservationKind, ChainArchiveErrorCode, TransactionKind, TransactionResult (+7 more)

### Community 109 - "Roadmap — `v1.1.0-formal-completion`: storage-algebra Lean mechanization vs 1.0.0 (v2, audit-reframed)"
Cohesion: 0.11
Nodes (17): Hash, 0. What v1 got wrong (audit corrections folded in), 1. Decision the user/council must make (forced, per audit), 2. Normative release-law manifest (single source of truth), 3. Corrected Lean gates (the ones that change), 4. Anti-vacuity acceptance criteria (corrected — was the hole), 5. Refinement strategy — three honest statuses (was overstated), 6. CI / faithfulness enforcement (corrected — Trust ≠ law-presence) (+9 more)

### Community 11 - "loop.test.ts"
Cohesion: 0.03
Nodes (137): ReadOnlyDatabase, EntryRange, InMemoryBlockSource, Flaky, Seen, Contexts, Faults, LostCommit (+129 more)

### Community 111 - "commit-proxy.ts"
Cohesion: 0.15
Nodes (9): Armed, CommitArm, CommitFault, CommitProxy, Pair, holds(), tailOf(), COMMIT_COMPLETE (+1 more)

### Community 112 - "pglite-outside-reads.ts"
Cohesion: 0.20
Nodes (11): LoadOutcome, OutsideRead, Traced, PgliteTestDatabase, expectNoOutsideReads(), outsideReads(), runUnderReadLoad(), turn() (+3 more)

### Community 113 - "core-block-fetch/metadata.ts"
Cohesion: 0.13
Nodes (14): MetadataField, MetadataPallet, MetadataStorage, MetadataStorageEntry, MetadataType, Primitive, littleEndian(), METADATA_MAGIC (+6 more)

### Community 114 - "identity.ts"
Cohesion: 0.20
Nodes (15): LedgerSource, ManifestLine, VerifyLedgerPackagesOptions, text(), checkPackageFiles(), manifestSha256(), mismatch(), packageName() (+7 more)

### Community 116 - "tx-replay-decoder.ts"
Cohesion: 0.18
Nodes (16): DecodedArchivedTransaction, DecodedDustRegistration, DecodedDustSpend, DecodedUnshieldedOutput, DecodedZswapInput, DecodedZswapOutput, decodeArchivedTransaction(), isStandardTransaction() (+8 more)

### Community 12 - "createClient"
Cohesion: 0.03
Nodes (114): BaselineLoad, ManualOpts, TinybenchOpts, Baseline, BloatStability, EnvironmentBlock, GcCurve, GcPoint (+106 more)

### Community 121 - "checkShape"
Cohesion: 0.30
Nodes (8): Shape, checkItem(), checkShape(), isObject(), isZodObject(), quoted(), shown(), 14. External claims and their evidence

### Community 123 - "readRuntimeMetadata"
Cohesion: 0.43
Nodes (9): TypeDef, ScaleError, field(), pallet(), readRuntimeMetadata(), readTypeRegistry(), storageEntry(), strings() (+1 more)

### Community 124 - "holds"
Cohesion: 0.28
Nodes (9): VersionedValue, StoredVersion, BlockFails, Model, canonicalText(), holds(), readBack(), same() (+1 more)

### Community 125 - "attempt"
Cohesion: 0.15
Nodes (14): Write, attempt(), Global Constraints, Plan Self-Review, Storage Algebra Lean M1 Implementation Plan, Task 1: Pin the project and prove the imported API smoke slice, Task 2: Implement the executable TemporalKV history kernel, Task 3: Prove the M1 TemporalKV theorem slice (+6 more)

### Community 128 - "cursor-table.property.test.ts"
Cohesion: 0.18
Nodes (14): Access, Block, BlockFails, Counts, canonicalText(), expectValue(), holds(), readBack() (+6 more)

### Community 13 - "postgres/transaction-history-storage.ts"
Cohesion: 0.03
Nodes (116): EntryContent, EntryLifecycle, EntryLifecycleStatus, FinalizedLifecycle, MergeEntriesFn, PendingLifecycle, RejectedLifecycle, TransactionHistoryEntry (+108 more)

### Community 135 - "ws-mutual-tls.test.ts"
Cohesion: 0.21
Nodes (9): Attempt, server(), connect(), file(), makeCa(), makeLeaf(), openssl(), read() (+1 more)

### Community 137 - "chain-events-source.test.ts"
Cohesion: 0.19
Nodes (7): NodeCallOptions, RecordingClient, open(), quiet(), chain, closing, SYSTEM_EVENTS_STORAGE

### Community 138 - "read-height.property.test.ts"
Cohesion: 0.22
Nodes (9): HeldRead, Job, Outcome, Reads, Step, concurrent(), queued(), STATEMENTS (+1 more)

### Community 14 - "api-server.test.ts"
Cohesion: 0.03
Nodes (108): Connection, HeadersArgument, ModuleApiServer, ModuleApiServerOptions, ModuleApiStart, StartedModuleApi, VersionedResponse, ChainDataAnswer (+100 more)

### Community 143 - "Session"
Cohesion: 0.22
Nodes (3): BoundedRead, Session, queryTimeout()

### Community 149 - "no-indexer-or-wallet-sdk.test.ts"
Cohesion: 0.29
Nodes (7): Finding, moduleSpecifier(), scanRoots(), scanSource(), scriptKind(), sourceFiles(), ROOTS

### Community 15 - "FinalizedLoop"
Cohesion: 0.03
Nodes (73): PointName, HeightRange, ResolvedRange, Callback, CallbackFailure, EntryBoundary, ParallelPoint, PointRun (+65 more)

### Community 16 - "admin-harness.ts"
Cohesion: 0.03
Nodes (118): AdminRun, Answered, Answerer, Expected, gate, Hold, Observation, Prober (+110 more)

### Community 17 - "builder.test.ts"
Cohesion: 0.03
Nodes (68): ConnectionFrames, Failure, Variant, WrongRecording, Refusal, Metadata, Step, Frame (+60 more)

### Community 179 - "type-check.ts"
Cohesion: 0.39
Nodes (7): TypeCheckFinding, TypeCheckResult, configCompilerOptions(), detectedAsModule(), packageType(), typeCheckFile(), typescript

### Community 18 - "NodeClient"
Cohesion: 0.04
Nodes (84): CoreChainBinding, Connection, HeadSubscriber, NodeClient, Pending, State, Subscription, Waiter (+76 more)

### Community 19 - "vitest"
Cohesion: 0.03
Nodes (82): LoadOptions, Row, Finding, Lockfile, Manifest, RepositoryFile, LockResult, Upstream (+74 more)

### Community 190 - "n"
Cohesion: 0.29
Nodes (7): Absent, n(), 3.3 T3 omits the current event and cannot replay a pruned suffix, 4. Law-by-law repair map, Requirement: CheckpointSummary metadata is populated and label round-trips, Scenario: A label given at save time is returned by history and load, Scenario: byteLength, chunkCount, and createdAt reflect the saved payload

### Community 195 - "mutation-evidence.d.mts"
Cohesion: 0.29
Nodes (6): AdapterResult, GateResult, MutantTally, StrykerFile, StrykerMutant, StrykerReport

### Community 2 - "src/index.ts"
Cohesion: 0.02
Nodes (218): BlobIntegrityError, BlobMissingError, BlockNotFoundError, ChainArchiveError, CheckpointStoreErrorCode, ConnectionError, Retryability, SharedStorageErrorCode (+210 more)

### Community 20 - "TransactionHandle"
Cohesion: 0.03
Nodes (99): TransactionHistoryReader, TransactionHistoryWriter, AsOf, AssertExact, Key, Namespace, Scope, TemporalKV (+91 more)

### Community 21 - "ledger-state.test.ts"
Cohesion: 0.05
Nodes (105): RetainedState, SeenLoad, LedgerTx, Upstream, contractFixture, Ledger, RawPackage, AdapterSubject (+97 more)

### Community 22 - "core-transport.ts"
Cohesion: 0.03
Nodes (89): PublicSide, ResultColumn, CoreTransportOptions, InstanceView, Session, TransportLimits, TransportTls, Api (+81 more)

### Community 23 - "process-admin.ts"
Cohesion: 0.04
Nodes (94): ConfigFacts, OpenedConfig, AllowedDetail, ProcessAdmin, ProcessAdminOptions, RevisionSettings, AdminStarter, DigestRow (+86 more)

### Community 24 - "NodeBlockSource"
Cohesion: 0.04
Nodes (54): BodyExtrinsic, ExtrinsicCall, BlockBody, BlockItemSource, CoreBlockItems, RuntimeMetadataView, HeadWait, NodeBlockSource (+46 more)

### Community 25 - "declaration.ts"
Cohesion: 0.03
Nodes (81): ReadHandle, OwnPart, cursorTable, CursorTableOptions, CursorValue, heightVersionedTable, HeightVersionedTableOptions, ApiRegistry (+73 more)

### Community 26 - "postgres/transaction-lease.ts"
Cohesion: 0.03
Nodes (100): Lease, LeaseAcquireOptions, LeaseFaultError, LeaseNotHeldError, LeaseTimeoutError, TransactionFaultError, TransactionLeaseError, TransactionOptions (+92 more)

### Community 27 - "config-check.ts"
Cohesion: 0.03
Nodes (85): privateIntake, CommandBuildOptions, CommandHandler, CommandIo, MainProcess, CheckFinding, CheckStep, ConfigCheckReport (+77 more)

### Community 28 - "config/history.ts"
Cohesion: 0.04
Nodes (98): CoreVersion, versionEntry, HistoryCode, HistoryContext, HistoryFinding, ProvidesRow, Span, UpgradeEntry (+90 more)

### Community 29 - "adapter.ts"
Cohesion: 0.03
Nodes (75): AdapterSpec, Binding, EventKind, Native, Proof, RawBlockContext, RawEvent, RawIntent (+67 more)

### Community 3 - "core-block-parsed.ts"
Cohesion: 0.02
Nodes (193): BlockEventSource, MetadataVariant, BlockParsed, BlockParsedOptions, BlockTransaction, TransactionParser, ChainTransaction, ChainEvent (+185 more)

### Community 30 - "column-rules.ts"
Cohesion: 0.03
Nodes (95): ModuleTableOptions, CatalogColumn, CatalogOptions, CatalogTable, AllowedRule, CatalogFunction, CatalogType, ColumnFacts (+87 more)

### Community 31 - "node-format.ts"
Cohesion: 0.06
Nodes (58): FreshInstanceRequest, FreshInstanceResult, StoredNode, Child, Reader, Disposable, NodeBatch, NodeStoreExports (+50 more)

### Community 32 - "validate.ts"
Cohesion: 0.04
Nodes (82): ProcessSide, coreEntry, plainData, ConfigContext, ConfigInput, ConfigRule, CursorRule, EntryRef (+74 more)

### Community 33 - "graph.ts"
Cohesion: 0.04
Nodes (84): ErrorCode, Edge, GraphFacts, GraphInput, GraphPart, GraphRule, MidChain, Missing (+76 more)

### Community 35 - "ledger-sweep.test.ts"
Cohesion: 0.05
Nodes (48): GreyPicker, GreyView, SweepPhase, SweepState, SweepTables, SweepWrites, ChildReader, NodeBatch (+40 more)

### Community 36 - "core-config.test.ts"
Cohesion: 0.06
Nodes (54): adminRoutes, AdminStartOptions, AdminEndpoint, AdminPart, AdminSnapshot, AdminView, ReadinessFacts, CoreLedgerVersion (+46 more)

### Community 37 - "LedgerPackage"
Cohesion: 0.06
Nodes (35): LedgerPackage, StateHandle, Held, LedgerEngine, Settled, hexOf(), idOf(), same() (+27 more)

### Community 38 - "core-block-commit.test.ts"
Cohesion: 0.04
Nodes (52): BlockHeaderItem, CoreBlockHeader, InMemoryItems, InMemorySourceOptions, Wait, Commit, AlwaysLanded, blockHeaderOf() (+44 more)

### Community 39 - "core-ledger-state.ts"
Cohesion: 0.05
Nodes (58): BlockLedgerSource, LedgerBinding, retainedStates, CoreRevision, boundLedgerParser(), workerParser(), applyBlock(), bindCoreLedgerState() (+50 more)

### Community 4 - "runner/process.ts"
Cohesion: 0.02
Nodes (126): OpenedFacts, Bound, ChainCheck, ChainCheckInput, ChainSource, ConfiguredGenesis, CoreChainFacts, NodeWait (+118 more)

### Community 40 - "builds.ts"
Cohesion: 0.06
Nodes (55): PrivateProcess, PrivateRefusal, PrivateSeen, PublicCore, InstanceHashes, OptedOutObservation, Refusal, TableRefusals (+47 more)

### Community 41 - "ledger/types.ts"
Cohesion: 0.07
Nodes (52): LoadLedger, LedgerStateItem, LedgerName, ApplyInput, ApplyOutput, ChainOutcome, LedgerPackageOptions, NodeStore (+44 more)

### Community 42 - "writer-lock-checks.ts"
Cohesion: 0.07
Nodes (44): WriterProcess, WorkerEvent, PostgresTestDatabase, PostgresTestServer, PauseReport, startWriter(), blocksIn(), cleanUp() (+36 more)

### Community 43 - "postgres.ts"
Cohesion: 0.07
Nodes (50): DatabaseState, ReadDatabaseOptions, ConfiguredDatabase, ConfiguredDatabaseOptions, databaseTarget, CommittedHeight, DurabilityProbeOptions, DurabilityViolation (+42 more)

### Community 44 - "entries.ts"
Cohesion: 0.04
Nodes (51): CoreEntryInput, CoreSettings, CoreSettingsBase, Entry, EntryBuilder, EntryConfig, EntryHeights, LedgerPin (+43 more)

### Community 45 - "ValidationError"
Cohesion: 0.04
Nodes (55): ValidationError, LL-002 — A7 watermark-participation negative control did not fire; survived fix-round-1, caught by round-2 cold cross-vendor Codex, Requirement: prune rejects a retainCount that is not a positive safe integer, before any deletion runs, Requirement: save rejects invalid options with ValidationError before any chunking or hashing work, Scenario: A chunkSize above the schema's 16 MiB bound is rejected with no work done, Scenario: A non-integer or non-finite retainCount is rejected with no effect, Scenario: An integer retainCount outside the safe integer range is rejected with no effect, Scenario: retainCount of zero is rejected with no effect (+47 more)

### Community 46 - "spawnChild"
Cohesion: 0.05
Nodes (46): ParentJob, Kill, Orphaned, SourceFile, Report, heldPort(), startChild(), startWorker() (+38 more)

### Community 47 - "column-rules.test.ts"
Cohesion: 0.04
Nodes (33): Because, columnVerdict, DefaultPart, keyOrder, Refusal, TableRule, TreeNode, TypeRule (+25 more)

### Community 48 - "mapping.ts"
Cohesion: 0.06
Nodes (38): ResultType, arrayLiteral(), hexOf(), invalidParameter(), isInfinity(), isPlainObject(), jsonText(), malformed() (+30 more)

### Community 5 - "PgTransactionHistoryStorage"
Cohesion: 0.02
Nodes (180): TransactionHistoryStorage, PgTransactionHistoryStorage, CheckpointStore, EnvelopeCorruptError, EnvelopeVersionUnsupportedError, WalletStateEnvelope, WalletStateEnvelopeError, Watermarks (+172 more)

### Community 50 - "column-refusals.test.ts"
Cohesion: 0.08
Nodes (33): ModuleContentsError, ConsistentRead, DeterminismBackend, TestDatabase, TestServer, Backend, Case, contentsHash() (+25 more)

### Community 51 - "zero-timeouts-checks.ts"
Cohesion: 0.07
Nodes (35): Settings, Run, Job, WorkerEvent, Phase, Outcome, expectNeverCutOffNorHung(), settings() (+27 more)

### Community 52 - "private/backends.ts"
Cohesion: 0.07
Nodes (29): PrivateBackend, SessionSeen, TestDatabase, TestCertificates, A155Observation, Outcome, A112Observation, Wiring (+21 more)

### Community 53 - "boundary.test.ts"
Cohesion: 0.09
Nodes (42): DesignTable, RowCoverage, ModuleReference, collationsWritten(), componentCode(), componentExports(), componentTexts(), copiedCode() (+34 more)

### Community 54 - "BlockRef"
Cohesion: 0.07
Nodes (18): QueuedBlock, BlockItems, BlockRef, CommitOutcome, HeldHeight, Fetching, Recorder, LateRedelivery (+10 more)

### Community 55 - "cbor.ts"
Cohesion: 0.09
Nodes (40): ColumnMode, DateTimeFields, Mode, PathNode, Task, Writer, ScalarColumnType, checkSafeInteger() (+32 more)

### Community 56 - "module-tables.ts"
Cohesion: 0.07
Nodes (34): CaptureColumn, CanonicalEncodingError, ModuleColumn, ModuleContentsFailure, ModuleTable, PageOptions, ColumnType, RefusalCode (+26 more)

### Community 57 - "serve.test.ts"
Cohesion: 0.08
Nodes (27): AdminChannel, AdminServeOptions, FromAdmin, ToAdmin, AdminServer, AdminAnswer, Heartbeat, isMessage() (+19 more)

### Community 58 - "pglite.ts"
Cohesion: 0.09
Nodes (17): Job, JobQueue, Outcome, PgliteDatabase, ServerErrorFields, Writer, commitRolledBack(), handleClosed() (+9 more)

### Community 59 - "slow-block-harness.ts"
Cohesion: 0.11
Nodes (37): LoopInput, Times, Wait, askedSource, HoldMode, Observed, Seen, SlowOptions (+29 more)

### Community 6 - "tape/index.ts"
Cohesion: 0.03
Nodes (119): Recorded, Failure, Variant, Link, TapeBuilderOptions, RecordingError, RecordingProblem, TapeError (+111 more)

### Community 60 - "database-fixtures.ts"
Cohesion: 0.05
Nodes (27): CheckTarget, CliBackend, Snapshot, Job, openPgliteOn(), blocksSql(), pgliteCliBackend(), postgresCliBackend() (+19 more)

### Community 63 - "changes.property.test.ts"
Cohesion: 0.08
Nodes (38): ChangeKind, tableChanges, TouchedRow, Op, States, TableName, digestBlock(), takeChanges() (+30 more)

### Community 64 - "real-tapes.ts"
Cohesion: 0.08
Nodes (34): FindTapeOptions, FoundTape, ReportedTest, RealTape, RealTapeManifest, RealTapeSource, TapeLookup, TapeRefusedError (+26 more)

### Community 65 - "version-checks.ts"
Cohesion: 0.12
Nodes (28): MetadataNode, CountingNode, MetadataSelector, Select, Walk, OwnStateMetadata, Answers, toHex() (+20 more)

### Community 66 - "public-database.ts"
Cohesion: 0.11
Nodes (24): Closable, PrivateBlockSource, PrivateIntakeOptions, PublicDatabase, PublicIdentity, PublicSideOptions, PublicWakes, TransportPosition (+16 more)

### Community 67 - "core-settings.ts"
Cohesion: 0.06
Nodes (34): LedgerTableSettings, PrivateCoreSettings, PublicCoreSettings, DeepReadonly, PrivateKeys, PrivateOnly, PublicKeys, PublicOnly (+26 more)

### Community 68 - "networks.ts"
Cohesion: 0.07
Nodes (35): Boundary, BoundaryBlock, builtInNetwork, Issue, KnownNetwork, NetworkGenesis, NetworksFileProblem, NetworkSource (+27 more)

### Community 7 - "postgres/checkpoint-store.ts"
Cohesion: 0.02
Nodes (162): CheckpointNotFoundError, CheckpointRecord, CheckpointSequence, CheckpointStoreError, CheckpointSummary, ChunkIntegrityError, ChunkMissingError, ContentHash (+154 more)

### Community 70 - "change-capture.ts"
Cohesion: 0.09
Nodes (27): CapturedTable, CaptureState, GuardTableRow, optOut, captureDefinitions(), capturedTables(), captureFunctionName(), captureReady() (+19 more)

### Community 71 - "validation.ts"
Cohesion: 0.06
Nodes (32): DeclarationRule, PlacedDeclaration, Plain, ShapeCase, Stats, first(), validateWith(), failures() (+24 more)

### Community 76 - "core-private-source.test.ts"
Cohesion: 0.07
Nodes (10): AdmittedKey, privateBackbone(), fakePublic(), fakeRead(), CORE_KEY_REGISTRY, CORE_KEY_REGISTRY_MIGRATIONS, NONE, PRIVATE_CORE_DIGEST (+2 more)

### Community 77 - "cbor.property.test.ts"
Cohesion: 0.09
Nodes (32): CanonicalEncodingFailure, CanonicalValue, Abort, CheckResult, Decoded, DecodedEntry, DecodedMap, Plain (+24 more)

### Community 78 - "post-block-update.negative-control.test.ts"
Cohesion: 0.10
Nodes (24): LedgerReleasePackage, SlowStep, TestLoaderData, loadLedgerPackage(), createV8Adapter(), createV9Adapter(), countDeserializations(), hexOf() (+16 more)

### Community 8 - "chain-process.test.ts"
Cohesion: 0.02
Nodes (145): ProcessHandle, ProcessingEnd, ProcessStatus, Job, WorkerEvent, A77Observation, A78Observation, A78Refusal (+137 more)

### Community 80 - "startLedgerWorker"
Cohesion: 0.09
Nodes (25): NodeDatabase, Pending, BridgeServer, bridgeStore, Growable, errorOf(), heightOf(), ledgerWorkerEntry() (+17 more)

### Community 82 - "Tasks — v1.0.0: Formal completion (`formal-completion`)"
Cohesion: 0.07
Nodes (25): ReadPool, Affirmed (audit found sound), Audit record — `v1.1.0-formal-completion` roadmap (v1 → v2), Convergent findings (≥2 lanes) and v2 resolution, Verdicts, 0. Scaffolding + Trust reach, 1. C2a — GC-safety (release-blocking; start now), 2. C2b — eventual collection (DEFERRED) (+17 more)

### Community 85 - "12. Ledger"
Cohesion: 0.14
Nodes (12): LedgerTask, LoadedState, LedgerHost, LedgerWorkerFailure, NodeReader, inThreadLedger(), recordingLoads(), tapeTest() (+4 more)

### Community 86 - "binding.test.ts"
Cohesion: 0.11
Nodes (26): A113Observation, A156Observation, Binding, Created, Outcome, privateCursorHeight(), readPrivateCursor(), readDatabaseState() (+18 more)

### Community 9 - "ledger-storage.test.ts"
Cohesion: 0.03
Nodes (150): CoreLedgerStateOptions, ProcessCondition, ArgType, BlockOptions, CallSpec, chainBlock, RUNTIME, Decoded (+142 more)

### Community 90 - "PgChainArchiveStore"
Cohesion: 0.17
Nodes (12): BlockRecord, BridgeObservationRecord, Hex32, TransactionMeta, TransactionRecord, VerifierKeyObservationRecord, PgChainArchiveStore, assertHex32() (+4 more)

### Community 91 - "check-required-tests.ts"
Cohesion: 0.13
Nodes (22): JsonReport, JsonReportAssertion, JsonReportFile, ManifestEntry, ReconcileResult, RequiredTestsManifest, ViolationReason, cli() (+14 more)

### Community 92 - "legacy-excluded.test.ts"
Cohesion: 0.15
Nodes (23): VitestConfig, buildProblems(), coverageProblems(), programFiles(), repoPath(), runFiles(), holdsProblems(), inventoryProblems() (+15 more)

### Community 93 - ".value"
Cohesion: 0.20
Nodes (10): ScaleReader, ValueReader, blockTimeOf(), callOf(), callVariants(), decodeExtrinsic(), isCompactU64(), bytesArgument() (+2 more)

### Community 95 - "module-rules.ts"
Cohesion: 0.10
Nodes (16): CheckedMigration, CheckFunctionsOptions, IntegerCheckRow, IntegerRule, IntegerRules, JsonbNumberRule, attachIntegerChecks(), checkFunctionsSql() (+8 more)

### Community 96 - "code-registry.ts"
Cohesion: 0.14
Nodes (22): CodeList, CodeTest, RegistryInput, Section11, TestLiterals, input(), readRepositoryFile(), registryProblems() (+14 more)

### Community 98 - "ChainArchiveStore"
Cohesion: 0.09
Nodes (10): ChainArchiveStore, `blocks`, Boundary enforcement, `bridge_observations`, chain_archive lineage, `chain_archive.watermarks`, Table of contents, `transactions` (chain_archive) (+2 more)

### Community 101 - "pg"
Cohesion: 0.10
Nodes (17): pg(), 7. Driver / toolkit choice, 1. Is there a known resolution — bounded-constant statement count, unbounded rows, no bind-param cap, no V8 string limit?, 2. Best candidate — COPY-BINARY into temp + INSERT-SELECT-ON-CONFLICT, 3. Recommendation for UmbraDB, 4. Migration/rollout note (if/when adopted), Research Assessment: Single-Statement Unbounded `bytea` Inserts via postgres.js, 1. Postgres-side profiling (+9 more)

### Community 103 - "Acceptance — CORE-ARCH: the standalone indexer's core architecture"
Cohesion: 0.10
Nodes (19): listen(), 10. Ingest, 11. Chain data, 13. Contract data, 14. Private processes, 15. Backups and browser, 16. Whole system, 17. Required test ids added to the manifest (+11 more)

### Community 106 - ".boolean"
Cohesion: 0.11
Nodes (18): insert(), 6. Determinism, ADDED Requirements, Requirement: DT-1 One canonical row encoding, Requirement: DT-2 Primary-key order, Requirement: DT-3 The contents hash, Requirement: DT-4 Per-block changes of every module table, Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints (+10 more)

### Community 127 - "mutation-per-adapter.mjs"
Cohesion: 0.17
Nodes (11): gateAdapters(), tallyMutants(), adapters, conf, gate, JSON_REPORT, PER_ADAPTER_CONF, results (+3 more)

### Community 129 - "fault"
Cohesion: 0.14
Nodes (13): fault(), 9. Test tape, ADDED Requirements, Requirement: TT-1 The tape file format, Requirement: TT-2 The tape node answers calls by occurrence, Requirement: TT-3 Subscriptions, disconnects and faults, Requirement: TT-4 The recording builder and its variants, Scenario: A changing answer (+5 more)

### Community 132 - ".restore"
Cohesion: 0.14
Nodes (12): ADDED Requirements, Requirement: LS-1 The package exports exactly the new surface, Requirement: LS-3 TransactionHistory stays, outside the build, Requirement: LS-4 The change is announced as breaking, Requirement: LS-5 The quality gates move to the new code, Requirement: LS-6 The `umbradb` command, Scenario: An extra export, Scenario: An unknown subcommand (+4 more)

### Community 139 - "twox.ts"
Cohesion: 0.24
Nodes (8): littleEndian(), merge(), rotl(), round(), storagePrefix(), twox128(), writeLittleEndian(), xxh64()

### Community 147 - "repository"
Cohesion: 0.18
Nodes (9): repository(), CORE_ARCH, DURABILITY, 1. What SLSA v1.0 defines, 3. Target and gap analysis, Build track levels, How npm `--provenance` maps to SLSA, Level summary (+1 more)

### Community 148 - "facade-merge-loader.ts"
Cohesion: 0.36
Nodes (8): facadeDistIndexPath(), facadeMergeAvailable(), loadFacadeMerge(), unshieldedWalletDistIndexPath(), ledgerV8NodeEntry(), loadMidnightWalletSdk(), midnightWalletRepoRoot(), packageDistFile()

### Community 159 - "pack-install.mjs"
Cohesion: 0.42
Nodes (8): dockerIndependentOracles(), fail(), main(), roundTripOracle(), run(), repoRoot, scratch, tscBin

### Community 163 - "midnight-env — reproducible PREPROD dev environment"
Cohesion: 0.22
Nodes (9): locked(), 1. Reproducibility contract — what is pinned, and how, 2. Host-state assumptions the flake does NOT capture (the real impurities), 3. How to reproduce (exact steps), 4. Validation performed, 5. Impurity reduction vs. documented-as-known, midnight-env — reproducible PREPROD dev environment, Security — db-sync TLS posture (READ BEFORE ENABLING TLS) (+1 more)

### Community 173 - "Full-Chain Storage"
Cohesion: 0.22
Nodes (7): 1. Overview / purpose, 2.1 The boundary rule (the feature's key design decision), 2. Architecture, 4. How to run it, 5. Acceptance criteria status, 6. Known limitations, Full-Chain Storage

### Community 210 - "orphan-watcher.mjs"
Cohesion: 0.40
Nodes (4): end(), removeContainers(), filters, listed

### Community 225 - "Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data"
Cohesion: 0.40
Nodes (4): 2. Database API, Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data, Scenario: A function in the configuration, Scenario: A user module from the configuration file

### Community 34 - "T"
Cohesion: 0.02
Nodes (83): runMigrationsImpl(), withReservedTransaction(), migrations(), T(), Superseded — see `Formal/STORAGE_ALGEBRA.md`, 5. Migration lineage, schema placement — Tier-1.5 (audit item 5), How the two lineages coexist, 1. TemporalKV — event-sourced right action with a CAS guard (+75 more)

### Community 49 - "digests.test.ts"
Cohesion: 0.06
Nodes (45): captured(), captureFunction(), hex(), moduleM(), restart(), sha256(), text(), triggerEnabled() (+37 more)

### Community 69 - "graph.py"
Cohesion: 0.12
Nodes (17): check(), check_environment(), dump_canonical(), fail(), fingerprint(), freshness_section(), git_lines(), inside() (+9 more)

### Community 72 - "Full-Chain Storage — Design"
Cohesion: 0.06
Nodes (34): createHeightPartitions(), up(), name, CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE, CHAIN_ARCHIVE_PRECREATED_PARTITIONS, 10. Residual limitations and open questions for the design council, 11. Phasing table, 1. Problem and core principle (+26 more)

### Community 79 - "hello"
Cohesion: 0.07
Nodes (34): hello(), greeted(), duplicateProblems(), greeted(), ADDED Requirements, Requirement: PP-10 Keys never reach the public side, Requirement: PP-11 Opt-in mutual TLS, Requirement: PP-12 Private databases are not backed up by UmbraDB (+26 more)

### Community 83 - "ledger-checks.ts"
Cohesion: 0.13
Nodes (31): heightsIn(), a106Problems(), a107Problems(), a99Problems(), blockZeroProblems(), eventRows(), expectedStates(), ledgerItemsWatcher() (+23 more)

### Community 97 - "config"
Cohesion: 0.09
Nodes (23): hexBytes(), config(), Cursor tables, Data that is not a function of the chain, Height-versioned tables, Migrations, Private modules, Reading through `db` (+15 more)

### Community 104 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Requirement: MD-1 A module is a declaration the host imports, Requirement: MD-2 Declarations are validated at startup, Requirement: MD-3 The requirement graph is resolved per height range, Requirement: MD-4 Modules start mid-chain only when they promise it, Requirement: MD-5 Development-only modules need the development opt-in, Requirement: MD-6 Shared items have exactly one active provider per height, Requirement: MD-7 Process items are published once, at startup (+12 more)

### Community 105 - "Storage Algebra Lean Formalization — Approved Design and Status"
Cohesion: 0.10
Nodes (20): 10. Sprint 2 transaction/lease proposal, 11.1 Repository evidence, 11.2 External primary sources, 11. Evidence matrix, 12. Milestone status, 1. Executive conclusion, 2.1 Historical implementation baseline, 2. Research protocol (+12 more)

### Community 108 - "Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24)"
Cohesion: 0.11
Nodes (18): Change: process — guideline corrections, model floors, workflow moved to `AGENTS.md` (2026-10-20 → 10-21), Change: `v1.0.0-durable-checkpoint-cursor` — G6 / G7 / G8 (2026-07-24), Change: `v1.0.0-perf-baseline` — G13 / G14 (2026-07-24), Change: `v1.0.0-recovery-testing` — G9/G10/G11 crash-injection + soak + differential (2026-07-24), Rework (class 1 — infra), Rework (class 1 — infra flake, not a change defect), Rework (class 2 — Task 0 foundation: two audits DIVERGED on severity), Rework (class 2 — the machine oracle caught what BOTH diff-scoped audits could not) (+10 more)

### Community 110 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, formal-watermarks, Requirement: Command traces compose in list order, Requirement: Lookup after a trace returns the last matching value, Requirement: Set is an unconditional overwrite at the exact address, Requirement: Set preserves distinct addresses, Requirement: The abstract Watermarks store has one absence representation, Requirement: The W1 proof claim remains abstract (+10 more)

### Community 115 - "stryker.conf.json"
Cohesion: 0.11
Nodes (17): cleanTempDir, _comment, concurrency, coverageAnalysis, mutate, reporters, $schema, tempDirName (+9 more)

### Community 117 - "ADDED Requirements"
Cohesion: 0.12
Nodes (16): ADDED Requirements, formal-checkpoint-c1, Requirement: C1 remains a save-only abstract projection, Requirement: Chunk identities form an unconditional finite join projection, Requirement: Chunk-map merge preserves existing bytes, Requirement: Collision freedom is an explicit local theorem premise, Requirement: Compatible chunk maps satisfy conditional C1 commutation, Requirement: Saving identity inputs is extensive, repeat-idempotent, and order-independent (+8 more)

### Community 118 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, bench, bench:smoke, build, docs:storage, docs:storage:check, graph:check, graph:refresh (+9 more)

### Community 120 - "UmbraDB V1.0.0 — Lessons-Learned Living Log"
Cohesion: 0.12
Nodes (15): A. Preventative actions to land or re-defer before iteration 2 begins, B. Named consumption targets (guideline §5.5) — record the actual edit made, C. Trend analysis (across events, not per-incident), Capture rules, D. Retro review sign-off, Entry template (copy per event), Event log (append-only; newest at bottom), Iteration-2 intake (retired 2026-10-21 — kept as history, not a gate) (+7 more)

### Community 122 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, ajv, effect, esbuild, fast-check, @midnightntwrk/wallet-sdk-abstractions, @stryker-mutator/core, @stryker-mutator/vitest-runner (+8 more)

### Community 126 - "UmbraDB software supply-chain directory"
Cohesion: 0.13
Nodes (12): How the inventory is organized, Recommended follow-up, Security process — the CI gates, SLSA posture in one paragraph, UmbraDB software supply-chain directory, Update process — how and when to bump each ecosystem, Why this exists, 2. UmbraDB's current posture (+4 more)

### Community 130 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: BK-1 Backup, Requirement: BK-2 The file, Requirement: BK-3 Restore into an empty database, checked before and after loading, Requirement: BK-4 A restored database continues like one that never stopped, Requirement: BK-5 The browser, Scenario: A changed row, Scenario: Backup in the page (+5 more)

### Community 131 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: CD-1 `core-chain` records the chain's identity, Requirement: CD-2 `core-block-fetch` is the node-backed block source, Requirement: CD-3 `core-block-commit` writes the cursor before every module, Requirement: CD-4 `core-chain-events` stores every runtime event, Requirement: CD-6 `core-tx-results` stores outcomes from the chain events, Scenario: A partially successful transaction, Scenario: A repeated hash (+5 more)

### Community 133 - "REMOVED Requirements"
Cohesion: 0.14
Nodes (13): REMOVED Requirements, Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored, Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed, Requirement: Dual addressing agrees at recorded write timestamps (Law T4), Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window, Requirement: History intervals never overlap for a single key (Law T5), Requirement: listKeys streams without materializing the full result set first, and orders results correctly, Requirement: Migrations are idempotent and ordered (+5 more)

### Community 134 - "UmbraDB"
Cohesion: 0.14
Nodes (14): CheckpointStore: content-addressed snapshots, Contents, License, Performance and ceilings, Schema and migrations, Security, Status, The five primitives (+6 more)

### Community 136 - "Roadmap"
Cohesion: 0.14
Nodes (14): 1.0.0 acceptance checklist, Frozen 1.0.0 API surface, SemVer policy, error catalog & contracts (G1-G4 -- `openspec/changes/v1.0.0-api-surface`), Frozen 1.0.0 Lean cut-line (G20 — `openspec/changes/v1.0.0-api-surface`), Milestone 0 — Design (completed baseline), Milestone 1 — Formal (`Formal/`, in progress), Milestone 3 — Testing (complete for 1.0.0), Milestone 4 — Performance (`Performance/`), Milestone 5 — Cutover (+6 more)

### Community 140 - "README.md"
Cohesion: 0.27
Nodes (3): Generate your local wallet, Test wallets, Why this is not just a committed key anymore

### Community 141 - "Storage Algebra Lean M2 Retention Sprint"
Cohesion: 0.15
Nodes (12): Adversarial test matrix, Approved semantic decisions, Completed baseline, Executable pruning, Explicit non-goals, Extensional T5, Implemented source layout, Lookup classification (+4 more)

### Community 142 - "ADDED Requirements"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Requirement: CC-1 `core-contract-states` stores each touched contract's keys, Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs, Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts, Requirement: CC-4 One provider of contract logs at a time, Scenario: A computed log value, Scenario: A log in a failed fallible segment, Scenario: A v8 log (+4 more)

### Community 145 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, declaration, esModuleInterop, module, moduleResolution, noEmit, noUncheckedIndexedAccess, resolveJsonModule (+4 more)

### Community 146 - "ROADMAP.md"
Cohesion: 0.17
Nodes (5): For historical reference only, Tasks — superseded by per-sprint openspec changes, UmbraDB v1.0.0 — Release Record (PENDING), What 1.0.0 additionally requires, What must happen before this record can be completed

### Community 150 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: AE-1 Four read-only endpoints on the admin listener, Requirement: AE-2 A heartbeat independent of the work, Requirement: AE-5 `/status` and `/config` contents, Requirement: AE-6 Secrets and errors are never leaked, Scenario: A blocking callback fails liveness, and the endpoints still answer, Scenario: A credential in an exception, Scenario: A long awaiting callback does not fail liveness (+3 more)

### Community 151 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: BR-1 Workers and databases in the browser, Requirement: BR-2 The browser starts at the tip, Requirement: BR-3 Only the node and a user's backup, Requirement: BR-4 Same results as Node.js, Scenario: A second tab on one OPFS database, Scenario: Browser and Node.js agree, Scenario: Ledger state without a backup (+3 more)

### Community 152 - "Design — v1.1.0: Quint model checking"
Cohesion: 0.17
Nodes (11): 1. Module layout, 2. Backend routing (the one non-obvious constraint), 3. C2a model sketch, 4. C2b model sketch, 5. L1 model sketch, 6. Falsifiability controls, 6b. Witnesses — proving the interesting state is reachable, 7. Bounds (+3 more)

### Community 153 - "devnet.sh"
Cohesion: 0.36
Nodes (9): attempt(), finalized(), log(), rpc(), devnet.sh script, sha(), spec_version(), traffic() (+1 more)

### Community 154 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, noEmit, outDir, rootDir, sourceMap, exclude (+3 more)

### Community 155 - "openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 156 - "UmbraDB v0.9.5 "Penumbra" — Release Record"
Cohesion: 0.18
Nodes (11): 1. The twenty gate items, 2. Tag preconditions R1–R12, 3. Rulings recorded for this release, 4. Deferred to 1.1 / post-1.0.0, 5. R5 — live Preprod evidence against the RC, 6. R6 — independent cold release audit, 7. R9 — Go / No-Go, Track C — Recovery testing (`openspec/changes/v1.0.0-recovery-testing`, merged `4e04926`) (+3 more)

### Community 157 - "UmbraDB third-party component inventory (SBOM)"
Cohesion: 0.18
Nodes (11): 1. npm — runtime dependencies, 2. npm — direct dev dependencies, 3. Nix — flake inputs (git-pinned), 4. Nix — pinned release binaries (`fetchurl` + sha256), 5. Docker images (digest-pinned), 6. Nix — nixpkgs packages (from the locked nixpkgs), 7. Lean / mathlib toolchain, 8. Host / toolchain dependencies (+3 more)

### Community 158 - "UmbraDB V1.0.0 Implementation Guideline"
Cohesion: 0.18
Nodes (11): §0 — Authority and invariants, §1 — Workflow, §3 — Cross-cutting rules, §4.1 — Closing one gate item (G-N), §4 — Gate-item close criteria and the 1.0.0 tag gate, §5 — Run log, §6.0 — What the 2026-07-23 → 07-25 run actually did, §6.1 — Open 1.0.0 obligations (+3 more)

### Community 160 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 161 - "UmbraDB v1.0.0 — Resume-From-Home Checkpoint (2026-07-23)"
Cohesion: 0.20
Nodes (9): 1. Current `main` state, 2. Preprod sync — PAUSED (safely), no progress lost, 2a. Resume on THIS machine, 2b. Resume on a FRESH machine, 3. Reproducible environment, 4. Roadmap status — G5 done, 19 to go, 5. Established implementation workflow (follow it for G6–G8), 6. Worktree cleanup (+1 more)

### Community 162 - "3. Proof-blocking findings"
Cohesion: 0.20
Nodes (10): 3.10 L1 has two non-equivalent meanings, 3.1 The TemporalKV carrier is too small, 3.2 The proposed action is not an ordinary monoid action, 3.4 The time field is not a commit instant, 3.5 T2 overstates atomic conflict reporting, 3.6 T5 credits a constraint with more than it enforces, 3.7 C1 needs compatibility or a collision assumption, 3.8 C2 safety and liveness are different theorem classes (+2 more)

### Community 164 - "Requirement: DT-6 Stored data avoids non-deterministic values"
Cohesion: 0.20
Nodes (10): Requirement: DT-6 Stored data avoids non-deterministic values, Scenario: A `CURRENT_TIMESTAMP` default, Scenario: A fractional JSON number, Scenario: A fractional `numeric`, Scenario: A JSON number with a zero fraction, Scenario: A serial column, Scenario: A table no module declared, Scenario: A table without a primary key (+2 more)

### Community 165 - "Design — v1.0.0-infosec-signoff"
Cohesion: 0.20
Nodes (9): 0. Scope boundary and what this change does NOT touch, 1. G15 — `SECURITY.md` / threat-model document, 2. G16 — CheckpointStore cross-wallet dedup interface-doc rewrite, 3. G17 — TLS caveat surfaced + VerifyFull/`--ca` de-stubbed, 4. G18 — Supply-chain CI gate, 5. G19 — Replace the committed Preview wallet secret, 6. Non-goals & boundaries respected (summary), Audit resolution (+1 more)

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

### Community 171 - "UmbraDB dev environment — master runbook"
Cohesion: 0.22
Nodes (8): Build / run (from source — all public, no ghcr auth), Credentials, Host, Midnight repos (cloned under ~/repos), Shell / PATH persistence, Tooling (all rootless / user-space), UmbraDB dev environment — master runbook, Wallet SDK install (public-npm workaround — IMPORTANT)

### Community 172 - "Sprint 7 — Midnight preprod toolchain inventory & build checklist"
Cohesion: 0.22
Nodes (8): A. System / host toolchain (shared), B. midnight-node (from source → preprod), C. midnight-indexer (GraphQL WS the wallet syncs against), Credentials summary, D. proof-server (from source — corrects earlier "ghcr-only" finding), E. midnight-wallet SDK, Key version decision (resolved), Sprint 7 — Midnight preprod toolchain inventory & build checklist

### Community 174 - "Storage Algebra Lean M3b CheckpointStore C1 Sprint"
Cohesion: 0.22
Nodes (8): Adversarial examples, Audited semantic decisions, Compatible-map theorem gate, Explicit non-goals, Identity-projection theorem gate, Source layout, Storage Algebra Lean M3b CheckpointStore C1 Sprint, Verification matrix

### Community 175 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: SH-1 The cursor table (from 0.9.5's Watermarks), Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV), Requirement: SH-3 One change per key per block, Scenario: A second change in the same block, Scenario: Last write wins, Scenario: Reading as of a height, Spec delta — `storage-helpers` capability

### Community 176 - "Tasks — v1.0.0-infosec-signoff"
Cohesion: 0.22
Nodes (8): 0. Threat-model documentation hub (G15), 1. CheckpointStore interface-doc rewrite (G16) — depends on 0.3, 2. TLS caveat + VerifyFull de-stub (G17) — independent, 3. Supply-chain CI gate (G18) — 3.5 depends on 4.1, 4. Committed-secret remediation (G19) — mutually dependent with 3.5, 4b. Release-publication artifact (R7) — found missing during the release run, 5. Change close-out, Tasks — v1.0.0-infosec-signoff

### Community 177 - "Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`)"
Cohesion: 0.22
Nodes (8): Acceptance criteria — v1.0.0: Recovery, Crash-Injection & Soak Testing (`recovery-testing`), Boundary / scope guardrails (council rulings honored), Crash between data and cursor — keystone (G9 / T5, depends on G5), Differential state-equivalence, in-repo (G11, fault-schedule half depends on G5), Lease non-wedge cold start (G9 / T3), Manual pre-tag Preprod evidence run (G12, release step 7, against the RC), Process-kill mid-save (G9 / T1), Suite-level (G9)

### Community 178 - "Tasks — v1.1.0: Quint model checking"
Cohesion: 0.22
Nodes (8): 0. Toolchain and scaffolding, 1. C2a — GC reachability safety, 2. C2b — eventual collection, 3. L1 — lease mutual exclusion, 4. T1 — cross-writer, 5. CI, 6. Documentation and close-out, Tasks — v1.1.0: Quint model checking

### Community 181 - "Contributing"
Cohesion: 0.25
Nodes (7): Code Contribution Process, Contributing, Contributor License Agreement, Getting Started, Requirements for Acceptable Contributions:, Submitting Issues, Support and Communication:

### Community 182 - "G12 / R5 — manual pre-tag Preprod round-trip evidence"
Cohesion: 0.25
Nodes (7): Captured transcript, Chain / wallet state at run time, Cold-boot round-trip, G12 / R5 — manual pre-tag Preprod round-trip evidence, Pass/fail per M5 sub-criterion, Run identity, Verdict

### Community 183 - "Storage Algebra Lean M3a Watermarks Sprint"
Cohesion: 0.25
Nodes (7): Adversarial examples, Audited semantic decisions, Explicit non-goals, Source layout, Storage Algebra Lean M3a Watermarks Sprint, Theorem gate, Verification matrix

### Community 184 - "Roadmap for the missing formalization"
Cohesion: 0.25
Nodes (7): Phase F1 — Close the absent *abstract* laws (tractable now; highest value), Phase F2 — Cross-module composition laws, Phase F3 — The refinement gap (strategic; the big decision), Priority call, Roadmap for the missing formalization, UmbraDB storage-algebra — formalization gap map & roadmap, What we have vs. the spec

### Community 185 - "Acceptance criteria — v1.0.0-infosec-signoff"
Cohesion: 0.25
Nodes (7): Acceptance criteria — v1.0.0-infosec-signoff, Cross-cutting council-ruling gates (close-out — Task 5.1), G15 — Threat-model / `SECURITY.md`, G16 — CheckpointStore dedup interface-doc caveat, G17 — TLS caveat surfaced + VerifyFull de-stubbed, localhost default kept, G18 — Supply-chain CI gate, G19 — Committed-secret remediation

### Community 186 - "Repository agent policy"
Cohesion: 0.29
Nodes (7): Bounded review, Lean, Model floors, Repository agent policy, Run log, The five stages, The three review lanes

### Community 187 - "Our Pledge"
Cohesion: 0.29
Nodes (6): Attribution, Enforcement, Our Pledge, Our Responsibilities, Our Standards, Scope

### Community 188 - "Midnight infra verification checklist"
Cohesion: 0.29
Nodes (6): A. Toolchain & binaries (all self-serve from public source), B. Preprod connectivity (public endpoints, verified live), C. Our wallet, D. Operations to verify (the requested end-to-end), E. Our from-source node (prove the build works as a real node), Midnight infra verification checklist

### Community 189 - "Security policy & threat model"
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

### Community 196 - "[0.9.5] - 2026-07-25 — "Penumbra""
Cohesion: 0.33
Nodes (6): [0.9.5] - 2026-07-25 — "Penumbra", [1.0.0] - unreleased — "Totality", Changelog, Contract documents, Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface), [Unreleased]

### Community 197 - "Preprod connection — endpoints, wallet, faucet"
Cohesion: 0.33
Nodes (5): Faucet (get tNIGHT), Our preprod wallet, Preprod connection — endpoints, wallet, faucet, Public preprod endpoints (all verified live), Sync cost (CORRECTED — no block-height "birthday" for the unshielded wallet)

### Community 198 - "00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows"
Cohesion: 0.33
Nodes (5): 00006 — `postgres` 3.4.9 reads a NULL array element as the text "NULL", so equal hashes can hide different rows, Evidence, Problem, Resolution, Suggested fix

### Community 199 - "00012 — A user module may be named `core`, the id of the `core` configuration entry"
Cohesion: 0.33
Nodes (5): 00012 — A user module may be named `core`, the id of the `core` configuration entry, Evidence, Problem, Resolution, Suggested fix

### Community 200 - "00022 — The tape `record` command's process test leaves its child running when the test process is gone"
Cohesion: 0.33
Nodes (5): 00022 — The tape `record` command's process test leaves its child running when the test process is gone, Evidence, Problem, Resolution, Suggested fix

### Community 201 - "5. Recommended candidate model"
Cohesion: 0.33
Nodes (6): 5.2 Layer B: keyed store and transaction guard, 5.3 Layer C: retention, 5.4 Checkpoints, 5.5 Watermarks, 5.6 Lease state, 5. Recommended candidate model

### Community 202 - "Proposal — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 5: Lean M3a Watermarks W1, What changes, Why

### Community 203 - "Tasks — Sprint 5: Lean M3a Watermarks W1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Executable Watermarks model, 2. W1 theorem tranche, 3. Close-out, Tasks — Sprint 5: Lean M3a Watermarks W1

### Community 204 - "Proposal — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): Impact, Non-goals, Proposal — Sprint 6: Lean M3b CheckpointStore C1, What changes, Why

### Community 205 - "Tasks — Sprint 6: Lean M3b CheckpointStore C1"
Cohesion: 0.33
Nodes (5): 0. Specification freeze, 1. Chunk-identity projection, 2. Compatible chunk maps, 3. Close-out, Tasks — Sprint 6: Lean M3b CheckpointStore C1

### Community 206 - "Tasks — v1.0.0-perf-baseline"
Cohesion: 0.33
Nodes (5): 2. G14 — benchmark harness (may start in parallel; baseline recorded only after §1), 3. G14 — record the baseline + document ceilings, 4. Close-out, G14 build close-out (2026-07-23), Tasks — v1.0.0-perf-baseline

### Community 207 - "Acceptance — v1.1.0: Quint model checking"
Cohesion: 0.33
Nodes (5): Acceptance — v1.1.0: Quint model checking, Definition of done, Explicit non-goals, Status manifest — what this change may and may not claim, The honesty bar

### Community 208 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, @electric-sql/pglite, postgres, typescript, ws, zod

### Community 209 - "Midnight Foundation Security Policy"
Cohesion: 0.33
Nodes (5): Disclosing a security issue, Midnight Foundation Security Policy, Preferred Languages, Suggesting changes, Vulnerability management

### Community 211 - "lib.sh"
Cohesion: 0.60
Nodes (5): build(), build_image(), file_sha256(), lib.sh script, sums()

### Community 212 - "Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency)"
Cohesion: 0.40
Nodes (4): Impact, Proposal — Postgres+JSONB storage rebuild (remove the MongoDB dependency), What changes, Why

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

### Community 218 - "00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost"
Cohesion: 0.40
Nodes (4): 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost, Evidence, Problem, Suggested fix

### Community 219 - "00024 — The module API listener closes a refused request's connection before its client has sent the body"
Cohesion: 0.40
Nodes (4): 00024 — The module API listener closes a refused request's connection before its client has sent the body, Evidence, Problem, Suggested fix

### Community 220 - "00025 — The module API listener refuses a request that offers an upgrade other than WebSocket"
Cohesion: 0.40
Nodes (4): 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket, Evidence, Problem, Suggested fix

### Community 221 - "00026 — A configuration's `core` revisions may name different networks"
Cohesion: 0.40
Nodes (4): 00026 — A configuration's `core` revisions may name different networks, Evidence, Problem, Suggested fix

### Community 222 - "00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code"
Cohesion: 0.40
Nodes (4): 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code, Evidence, Problem, Suggested fix

### Community 223 - "bug-report.md"
Cohesion: 0.40
Nodes (4): Actual behavior:, Context & versions:, Expected behavior:, Steps to reproduce:

### Community 224 - "feature-request.md"
Cohesion: 0.40
Nodes (4): Describe the proposed feature:, Details:, Expected Benefit:, User Need:

### Community 227 - "manifest.json"
Cohesion: 0.40
Nodes (4): about, format, tapes, version

### Community 228 - "00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)"
Cohesion: 0.50
Nodes (3): 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4), Problem, Suggested fix

### Community 229 - "PULL_REQUEST_CHECKLIST.md"
Cohesion: 0.50
Nodes (3): Change summary, Review (AGENTS.md), Validation

### Community 230 - "documentation-improvement.md"
Cohesion: 0.50
Nodes (3): Description of Improvement:, Documentation URL:, Proposed Solution (Optional):

### Community 231 - "Overview"
Cohesion: 0.50
Nodes (3): Links, Overview, Submission Checklist

### Community 232 - "transaction-history/tsconfig.json"
Cohesion: 0.50
Nodes (3): extends, include, ../../tsconfig.json

### Community 233 - "Spec — capability `formal-completion`"
Cohesion: 0.50
Nodes (3): Governed by, Requirements (EARS), Spec — capability `formal-completion`

### Community 234 - "renovate.json"
Cohesion: 0.50
Nodes (3): extends, $schema, local>midnightntwrk/renovate-config

### Community 237 - "Requirement: set is an idempotent, unconditional overwrite (Law W1)"
Cohesion: 0.67
Nodes (3): Requirement: set is an idempotent, unconditional overwrite (Law W1), Scenario: A new set always overwrites, with no conflict possible, Scenario: Setting the same value twice leaves the stored state unchanged

### Community 61 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: DB-10 Migrations of an upgrade never change stored values, Requirement: DB-11 Exactly one writer per database, Requirement: DB-12 The durability probe guards PostgreSQL, Requirement: DB-13 A lost connection is a distinct, retryable error, Requirement: DB-14 Block transactions change rows only, Requirement: DB-15 Timeouts by connection role, Requirement: DB-1 One API over two backends (+35 more)

### Community 62 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, Requirement: A real VerifyFull/--ca path is provided, replacing the stub (G17), Requirement: A shipped threat-model document states the single-trusted-writer trust model (G15), Requirement: CI gates any change to flake.lock behind explicit review (G18), Requirement: CI installs dependencies with npm ci (G18), Requirement: CI runs a blocking npm audit on runtime dependencies (G18), Requirement: CI runs full-history gitleaks secret scanning with the wallet history and template allowlisted (G18), Requirement: CI scans both pinned Docker image digests for CVEs (G18) (+35 more)

### Community 73 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: LG-10 Ledger work runs in a worker thread, Requirement: LG-11 The ledger state lives in the database, Requirement: LG-12 The retention window, Requirement: LG-13 Contract states stay alive, Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep, Requirement: LG-15 Every state root is checked, Requirement: LG-16 What `core-ledger-state` provides (+28 more)

### Community 74 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): ADDED Requirements, Requirement: RN-10 Stop heights end an entry after its last block, Requirement: RN-11 After-write notifications are delivered at least once, Requirement: RN-12 The runner stops at an upgrade boundary, Requirement: RN-13 SIGTERM stops cleanly, Requirement: RN-14 The block source is the runner's only view of the chain, Requirement: RN-15 Module APIs are registered once, at startup, Requirement: RN-16 Chain-data reads name their view and height (+28 more)

### Community 75 - "ADDED Requirements"
Cohesion: 0.06
Nodes (35): ADDED Requirements, recovery-testing (crash-injection, soak, differential & live-evidence gate), Requirement: G10 — a full-sync soak runs at a declared envelope with GC passes and holds every invariant, Requirement: G11/T11 — a fault-schedule run is state-equivalent to a fault-free reference, Requirement: G11 — the differential gate is anchored on the P3 replay-equivalence property, Requirement: G12 — a manual pre-tag Preprod round-trip is run against the RC with recorded evidence, Requirement: G9 — a skip-enforcement check proves every required crash test executed, none silently skipped, Requirement: G9/T1 — process-kill mid-save leaves no partially-visible checkpoint (+27 more)

### Community 81 - "main.rs"
Cohesion: 0.09
Nodes (16): after_json(), CALL, clamp_and_normalize(), compute_overall_fullness(), cost(), DEPLOY, hex_of(), main() (+8 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, release-contract, Requirement: A cancellation contract states the abort guarantee as public behavior, Requirement: A CHANGELOG records the 1.0.0 surface, Requirement: A durability contract states the ordering guarantee and its binding precondition, Requirement: A format-headroom note reserves keyed/encrypted chunk modes for 1.1, Requirement: A forward-only migration contract states there is no supported downgrade, Requirement: A lease-limitation contract states the single-process boundary (+23 more)

### Community 87 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, Requirement: IN-10 Errors are retried or halt, by kind, Requirement: IN-11 Recovery after an uncertain COMMIT, Requirement: IN-12 Startup refusals and halts, Requirement: IN-1 The database holds finalized blocks only, Requirement: IN-2 Bootstrap of an empty database, Requirement: IN-3 Startup checks, Requirement: IN-4 Every finalized height, once, in order (+20 more)

### Community 88 - "ADDED Requirements"
Cohesion: 0.07
Nodes (28): ADDED Requirements, performance-baseline (implementation), Requirement: a benchmark baseline is recorded as a committed artifact (the G14 gate), Requirement: a coarse smoke guard is wired now; the CV-aware regression gate is deferred, Requirement: ckpt_chunks carries a stored size_bytes column computed without detoasting (IS-2), Requirement: kv_current is fillfactor-tuned to preserve HOT-update eligibility (IS-1), Requirement: save() issues a bounded number of round-trips independent of chunk count (HP-1), Requirement: scalability ceilings are documented for 1.0.0 (+20 more)

### Community 89 - "package.json"
Cohesion: 0.07
Nodes (28): bin, umbradb, bugs, url, description, engines, node, exports (+20 more)

### Community 94 - "Design — Postgres+JSONB storage rebuild"
Cohesion: 0.08
Nodes (21): Asking the owner to decide, Keep the knowledge graph current, sprint by sprint, Review workflow, UmbraDB — project instructions, Unrelated findings go to `docs/issues/` first, 0. How this reconciles with the Tier-2 (indexer) Postgres decision, 10. State-equivalence gate (merge blocker, mirrors the mongo-store Plan A/B gate), 1. Mongo-compatibility-shim tooling: evaluated and rejected (+13 more)

### Community 99 - "ADDED Requirements"
Cohesion: 0.09
Nodes (22): ADDED Requirements, Requirement: CF-10 `umbradb config check`, Requirement: CF-11 Test keys in a private configuration, Requirement: CF-2 Builders fill identity and version from the build, Requirement: CF-5 Entries are revised by `(id, start)`, Requirement: CF-6 Configuration changes only the future, Requirement: CF-7 The history row and its hash, Requirement: CF-8 One version per build (+14 more)

## Knowledge Gaps
- **51 isolated node(s):** `RFC-8259`, `RFC-3339`, `RFC-3339`, `RFC-3339`, `RFC-9110` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3343 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PgTransactionLeaseLayer`, `UmbraError`, `src/index.ts`, `core-block-parsed.ts`, `runner/process.ts`, `PgTransactionHistoryStorage`, `tape/index.ts`, `postgres/checkpoint-store.ts`, `chain-process.test.ts`, `ledger-storage.test.ts`, `node/client.test.ts`, `loop.test.ts`, `createClient`, `postgres/transaction-history-storage.ts`, `api-server.test.ts`, `FinalizedLoop`, `admin-harness.ts`, `builder.test.ts`, `NodeClient`, `TransactionHandle`, `ledger-state.test.ts`, `core-transport.ts`, `process-admin.ts`, `NodeBlockSource`, `declaration.ts`, `postgres/transaction-lease.ts`, `config-check.ts`, `config/history.ts`, `adapter.ts`, `node-format.ts`, `validate.ts`, `graph.ts`, `ledger-sweep.test.ts`, `core-config.test.ts`, `core-block-commit.test.ts`, `core-ledger-state.ts`, `builds.ts`, `ledger/types.ts`, `writer-lock-checks.ts`, `postgres.ts`, `entries.ts`, `spawnChild`, `column-rules.test.ts`, `mapping.ts`, `digests.test.ts`, `column-refusals.test.ts`, `zero-timeouts-checks.ts`, `private/backends.ts`, `boundary.test.ts`, `module-tables.ts`, `serve.test.ts`, `slow-block-harness.ts`, `database-fixtures.ts`, `changes.property.test.ts`, `real-tapes.ts`, `version-checks.ts`, `core-settings.ts`, `networks.ts`, `validation.ts`, `core-private-source.test.ts`, `cbor.property.test.ts`, `post-block-update.negative-control.test.ts`, `startLedgerWorker`, `binding.test.ts`, `package.json`, `check-required-tests.ts`, `legacy-excluded.test.ts`, `code-registry.ts`, `pglite-outside-reads.ts`, `identity.ts`, `mutation-per-adapter.mjs`, `cursor-table.property.test.ts`, `ws-mutual-tls.test.ts`, `chain-events-source.test.ts`, `read-height.property.test.ts`, `twox.ts`, `excluded-not-exported.test.ts`, `repository`, `facade-merge-loader.ts`, `no-indexer-or-wallet-sdk.test.ts`?**
  _High betweenness centrality (0.320) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `UmbraError` (e.g. with `The ledger state` and `11. Refusals and halts (IN-12)`) actually correct?**
  _`UmbraError` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-8259`, `RFC-3339`, `RFC-3339` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PgTransactionLeaseLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.013357025915425468 - nodes in this community are weakly interconnected._
- **Why does `UmbraError` connect `UmbraError` to `runner/process.ts`, `tape/index.ts`, `chain-process.test.ts`, `ledger-storage.test.ts`, `node/client.test.ts`, `loop.test.ts`, `api-server.test.ts`, `Session`, `admin-harness.ts`, `FinalizedLoop`, `NodeClient`, `vitest`, `builder.test.ts`, `ledger-state.test.ts`, `core-transport.ts`, `process-admin.ts`, `NodeBlockSource`, `declaration.ts`, `config-check.ts`, `config/history.ts`, `column-rules.ts`, `validate.ts`, `graph.ts`, `core-block-commit.test.ts`, `core-ledger-state.ts`, `writer-lock-checks.ts`, `postgres.ts`, `entries.ts`, `mapping.ts`, `column-refusals.test.ts`, `zero-timeouts-checks.ts`, `private/backends.ts`, `BlockRef`, `cbor.ts`, `module-tables.ts`, `pglite.ts`, `slow-block-harness.ts`, `changes.property.test.ts`, `version-checks.ts`, `public-database.ts`, `validation.ts`, `core-private-source.test.ts`, `12. Ledger`, `binding.test.ts`, `module-rules.ts`, `config`, `version-table.ts`, `pglite-writer.worker.ts`, `identity.ts`, `checkShape`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ModuleDeclaration` (e.g. with `12. Exported surface and command (LS-1, LS-6)` and `1. Source layout`) actually correct?**
  _`ModuleDeclaration` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `UmbraError` be split into smaller, more focused modules?**
  _Cohesion score 0.021510840108401083 - nodes in this community are weakly interconnected._